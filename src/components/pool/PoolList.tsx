import { TPool } from "@/app/types";
import PoolCard from "./PoolCard";

const pools: TPool[] = [
  {
    id: 4,
    name: "Funding the Commons FIP 17",
    chainId: 44787,
    dates: {
      start: "2021-08-01",
      end: "2021-08-31",
    },
    strategy: "0x0",
    balance: 10e18,
  },
  {
    id: 14,
    name: "Open Civics OCP 324",
    chainId: 44787,
    dates: {
      start: "2021-08-01",
      end: "2021-08-31",
    },
    strategy: "0x0",
    balance: 5e18,
  },
  {
    id: 44,
    name: "Solarpunk SIP 2",
    chainId: 44787,
    dates: {
      start: "2021-08-01",
      end: "2021-08-31",
    },
    strategy: "0x0",
    balance: 1e18,
  },
  // More pools...
];

const PoolList = () => {
  return (
    <div className="mx-4">
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {pools.map((pool) => (
          <PoolCard key={pool.id} pool={pool} />
        ))}
      </ul>
    </div>
  );
};

export default PoolList;
