import { TPool } from "@/app/types";
import { formatEther } from "viem";

const PoolCard = ({ pool }: { pool: TPool }) => {
  return (
    <li
      key={pool.id}
      className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
    >
      <div className="flex w-full items-center justify-between space-x-6 p-6">
        <div className="flex-1 truncate">
          <div className="flex items-center space-x-3">
            <h3 className="truncate text-sm font-medium text-gray-900">
              {pool.name}
            </h3>
          </div>
          <p className="mt-1 truncate text-sm text-gray-500">
            {pool.dates.start} - {pool.dates.end}
          </p>
        </div>
        {/* <img
              className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
              src={pool.imageUrl}
              alt=""
            /> */}
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-gray-200">
          <div className="flex w-0 flex-1">
            <p className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
              {formatEther(BigInt(pool.balance))} Ξ
            </p>
          </div>
          <div className="-ml-px flex w-0 flex-1">
            <div className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
              ?
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default PoolCard;
