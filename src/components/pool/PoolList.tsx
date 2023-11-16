import { TPool } from "@/app/types";
import PoolCard from "./PoolCard";

const pools: TPool[] = [
  {
    id: 4,
    name: "Funding the Commons FIP 17",
    chainId: 5,
    dates: {
      start: "2021-08-01",
      end: "2021-08-31",
    },
    strategy: "0x0",
    amount: 10e18,
    tokenSymbol: "DAI",
    active: true,
  },
  {
    id: 14,
    name: "Open Civics OCP 324",
    chainId: 5,
    dates: {
      start: "2021-08-01",
      end: "2021-08-31",
    },
    strategy: "0x0",
    amount: 5e18,
    tokenSymbol: "ETH",
    active: true,
  },
  {
    id: 44,
    name: "Solarpunk SIP 2",
    chainId: 5,
    dates: {
      start: "2021-08-01",
      end: "2021-08-31",
    },
    strategy: "0x0",
    amount: 1e18,
    tokenSymbol: "PEPE",
    active: true,
  },
  // More pools...
];

const PoolList = () => {
  return (
    <div className="flex flex-row items-center justify-center mx-4 mb-8">
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8"
      >
        {pools.map((pool) => (
          <li
            key={pool.id}
            className="overflow-hidden rounded-xl border border-gray-200"
          >
            <PoolCard key={pool.id} pool={pool} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PoolList;
