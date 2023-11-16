import { TPoolData } from "@/app/types";
import PoolCard from "./PoolCard";
import { getMicroGrantsQuery, graphqlEndpoint } from "@/utils/query";
import request from "graphql-request";

const PoolList = async () => {

  let pools: TPoolData[] = [];
  // try {
  //   pools = await request(
  //     graphqlEndpoint,
  //     getMicroGrantsQuery,
  //     {}
  //   );
  // } catch (e) {
  //   console.log(e);
  // }

  return (
    <div className="flex flex-row items-center justify-center mx-4 mb-8">
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8"
      >
        {pools.map((pool) => (
          <li
            key={`${pool.chainId}-${pool.poolId}`}
            className="overflow-hidden rounded-xl border border-gray-200"
          >
            <PoolCard key={`${pool.chainId}-${pool.poolId}`} pool={pool} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PoolList;
