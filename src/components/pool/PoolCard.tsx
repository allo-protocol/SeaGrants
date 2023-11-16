import { TPool } from "@/app/types";
import { classNames, statusColorsScheme, stringToColor } from "@/utils/common";
import { formatEther } from "viem";

const PoolCard = ({ pool }: { pool: TPool }) => {
  const bg = stringToColor(pool.name);

  return (
    <>
      <div
        className={`flex justify-between items-center gap-x-4 border-b border-gray-900/5 p-6`}
        style={{ backgroundColor: bg }}
      >
        {/* Add chain id logo */}
        {/* <Image
          src={pool.imageUrl}
          alt={pool.name}
          height={48}
          width={48}
        /> */}
        <div className="flex text-sm font-medium text-gray-900">
          {pool.name}
        </div>
        <div
          className={classNames(
            statusColorsScheme[
              pool.active
                ? ("Active" as keyof typeof statusColorsScheme)
                : ("Closed" as keyof typeof statusColorsScheme)
            ],
            "flex rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset"
          )}
        >
          {pool.active ? "Active" : "Closed"}
        </div>
      </div>
      <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Pool Amount</dt>
          <dd className="flex items-start gap-x-2">
            <div className="font-medium text-gray-900">
              {formatEther(BigInt(pool.amount))} {pool.tokenSymbol}
            </div>
          </dd>
        </div>

        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Start Date:</dt>
          <dd className="text-gray-700">
            <time dateTime={pool.dates.start}>{pool.dates.start}</time>
          </dd>
        </div>

        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">End Date</dt>
          <dd className="text-gray-700">
            <time dateTime={pool.dates.end}>{pool.dates.end}</time>
          </dd>
        </div>
      </dl>
    </>
  );
};

export default PoolCard;
