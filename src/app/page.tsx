import PoolList from "@/components/pool/PoolList";
import { getMicroGrantsQuery, graphqlEndpoint } from "@/utils/query";
import request from "graphql-request";
import { EPoolStatus, TPoolData, TPoolMetadata } from "@/app/types";
import { getIPFSClient } from "@/services/ipfs";
import { getPoolStatus } from "@/utils/common";

export default async function Home() {
  const ipfsClient = getIPFSClient();

  let pools: TPoolData[] = [];
  try {
    const response: any = await request(
      graphqlEndpoint,
      getMicroGrantsQuery,
      {},
    );
    pools = response["microGrants"];
    for (const pool of pools) {
      let metadata: TPoolMetadata;
      try {
        metadata = await ipfsClient.fetchJson(pool.pool.metadataPointer);
        pool.pool.metadata = metadata;
        if (metadata.base64Image) {
          let poolBanner = await ipfsClient.fetchJson(metadata.base64Image);
          pool.pool.poolBanner = poolBanner.data;
        }
        if (!metadata.name) {
          metadata.name = `Pool ${pool.poolId}`;
        }
      } catch {
        console.log("IPFS", "Unable to fetch metadata");
      }
    }
  } catch (e) {
    console.log(e);
  }

  const upcomingPools = pools.filter(
    (pool) =>
      getPoolStatus(pool.allocationStartTime, pool.allocationEndTime) ===
      EPoolStatus.UPCOMING,
  );

  const activePools = pools.filter(
    (pool) =>
      getPoolStatus(pool.allocationStartTime, pool.allocationEndTime) ===
      EPoolStatus.ACTIVE,
  );

  const endedPools = pools.filter(
    (pool) =>
      getPoolStatus(pool.allocationStartTime, pool.allocationEndTime) ===
      EPoolStatus.ENDED,
  );

  return (
    <main>
      <div className="mx-auto max-w-2xl py-16 sm:py-32">
        <img
          src=" https://tailwindui.com/img/beams-basic.png"
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            !MicroGrants
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Micro-grant programs, common in web3 communities like Gitcoin, Celo,
            and ENS to engage members and empower project contributions aligned
            with their mission, often present challenges in accessibility.
          </p>
        </div>
      </div>
      <PoolList
        pools={upcomingPools}
        title={"Upcoming Pools"}
        flyoutOptions={{
          useFlyout: true,
          startIndex: 1,
          label: `Show all upcoming pools (${upcomingPools.length})`,
        }}
      />
      <PoolList
        pools={activePools}
        title={"Active Pools"}
        flyoutOptions={{
          useFlyout: true,
          startIndex: 2,
          label: `Show all active pools (${activePools.length})`,
        }}
      />
      <PoolList
        pools={endedPools}
        title={"Ended Pools"}
        flyoutOptions={{
          useFlyout: true,
          startIndex: 0,
          label: `Show all ended pools (${endedPools.length})`,
        }}
      />
    </main>
  );
}
