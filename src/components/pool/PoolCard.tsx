import { TPoolData } from "@/app/types";
import { getIPFSClient } from "@/services/ipfs";
import {
  classNames,
  getPoolStatus,
  humanReadableAmount,
  isPoolActive,
  prettyTimestamp,
  statusColorsScheme,
  stringToColor,
} from "@/utils/common";
import Link from "next/link";

const PoolCard = async ({ pool }: { pool: TPoolData }) => {
  const poolDetail = pool.pool;
  const ipfsClient = getIPFSClient();
  const DEFAULT_NAME = `Pool ${pool.poolId}`;

  let metadata = { name: DEFAULT_NAME };
  try {
    metadata = await ipfsClient.fetchJson(poolDetail.metadataPointer);
  } catch {
    console.log("IPFS", "Unable to fetch metadata");
  }

  if (metadata.name === undefined) metadata.name = DEFAULT_NAME;

  const bg = stringToColor(metadata.name);
  const isActive = isPoolActive(
    pool.allocationStartTime,
    pool.allocationEndTime
  );
  const tokenMetadata = poolDetail.tokenMetadata;
  const amount = humanReadableAmount(poolDetail.amount, tokenMetadata.decimals);

  return (
    <Link href={`/${pool.chainId}/${pool.poolId}`}>
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
          {metadata.name}
        </div>
        <div
          className={classNames(
            statusColorsScheme[
              getPoolStatus(pool.allocationStartTime, pool.allocationEndTime)
            ],
            "flex rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset"
          )}
        >
          {isActive ? "Active" : "Ended"}
        </div>
      </div>
      <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Pool Amount</dt>
          <dd className="flex items-start gap-x-2">
            <div className="font-medium text-gray-900">
              {amount} {tokenMetadata.symbol ?? "ETH"}
            </div>
          </dd>
        </div>

        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Start Date:</dt>
          <dd className="text-gray-700">
            <time dateTime={pool.allocationStartTime.toString()}>
              {prettyTimestamp(pool.allocationStartTime)}
            </time>
          </dd>
        </div>

        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">End Date</dt>
          <dd className="text-gray-700">
            <time dateTime={pool.allocationEndTime.toString()}>
              {prettyTimestamp(pool.allocationEndTime)}
            </time>
          </dd>
        </div>
      </dl>
    </Link>
  );
};

export default PoolCard;
