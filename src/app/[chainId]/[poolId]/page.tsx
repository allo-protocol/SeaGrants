import type { TApplicationMetadata, TNewApplicationResponse, TPoolData, TPoolMetadata } from "@/types";
import PoolOverview from "@/components/pool/PoolOverview";
import Container from "@/components/shared/Container";
import { PoolContextProvider } from "@/context/PoolContext";
import { getIPFSClient } from "@/services/ipfs";
import { getPoolData } from "@/utils/request";

export default async function Pool({
  params,
}: {
  params: { chainId: string; poolId: string };
}) {
  try {
    const pool: TPoolData = await getPoolData(params.chainId, params.poolId);
    const poolMetadata: TPoolMetadata = pool.pool.metadata;

    let poolBanner = undefined;

    if (poolMetadata.base64Image) {
      const poolMetadataJson: {data: string} = await getIPFSClient().fetchJson(poolMetadata.base64Image);
      if (poolMetadataJson.data) {
        poolBanner = poolMetadataJson.data;
      }
    }

    const applications: TNewApplicationResponse[] = [];

    for (const application of pool.microGrantRecipients) {
      if (application.metadataPointer !== "") {
        const metadata: TApplicationMetadata = await getIPFSClient().fetchJson(
          application.metadataPointer,
        );
        application.metadata = metadata;
        if (metadata.base64Image) {
          const image: { data: string } = await getIPFSClient().fetchJson(metadata.base64Image);
          application.applicationBanner = image.data;
        }
      }
      applications.push(application);
    }

    return (
      <Container>
        <PoolContextProvider chainId={params.chainId} poolId={params.poolId}>
          <PoolOverview
            applications={applications}
            poolBanner={poolBanner}
            chainId={params.chainId}
            poolId={params.poolId}
            pool={pool}
            metadata={poolMetadata}
          />
        </PoolContextProvider>
      </Container>
    );
  } catch (e) {
    console.log(e);
    return (
      <Container>
        <div>Pool not found</div>
      </Container>
    );
  }
}
