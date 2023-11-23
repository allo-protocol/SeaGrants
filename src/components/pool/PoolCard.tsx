"use client";
import { EPoolStatus, TPoolData } from "@/app/types";
import {
  classNames,
  getPoolStatus,
  humanReadableAmount,
  prettyTimestamp,
  statusColorsScheme,
} from "@/utils/common";
import Link from "next/link";
import Banner from "../shared/Banner";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { useEffect, useRef, useState } from "react";

const PoolCard = ({ pool }: { pool: TPoolData }) => {
  const containerRef = useRef(null);
  const [isTextOverflowing, setIsTextOverflowing] = useState(false);
  const poolDetail = pool.pool;
  const metadata = poolDetail.metadata;

  const poolStatus: EPoolStatus = getPoolStatus(
    pool.allocationStartTime,
    pool.allocationEndTime,
  );

  const tokenMetadata = poolDetail.tokenMetadata;
  const amount = humanReadableAmount(poolDetail.amount, tokenMetadata.decimals);
  const maxRequestedAmount = humanReadableAmount(
    pool.maxRequestedAmount,
    tokenMetadata.decimals,
  );

  useEffect(() => {
    if (containerRef.current) {
      const _ref = containerRef.current as unknown as {
        scrollHeight: number;
        clientHeight: number;
      };
      const isOverflowing = _ref.scrollHeight > _ref.clientHeight;
      setIsTextOverflowing(isOverflowing);
    }
  }, [metadata.description]);

  return (
    <Link href={`/${pool.chainId}/${pool.poolId}`}>
      <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50">
        <Banner image={poolDetail.poolBanner} alt={metadata.name} />
      </div>
      <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">
            {" "}
            <div className="text-sm font-medium leading-6 text-gray-900 py-3">
              {metadata!.name}
            </div>
          </dt>
          <div className="flex justify-between gap-x-4 py-3">
            <dd className="text-gray-500">
              <div
                className={classNames(
                  statusColorsScheme[poolStatus],
                  "flex rounded-md py-1 px-3 text-xs font-medium ring-1 ring-inset",
                )}
              >
                {poolStatus.toString()}
              </div>
            </dd>
          </div>
        </div>
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">
            Pool Amount: {amount} {tokenMetadata.symbol ?? "ETH"}
          </dt>
          <dd className="text-gray-500">
            Request Amount: max {maxRequestedAmount}{" "}
            {tokenMetadata.symbol ?? "ETH"}
          </dd>
        </div>
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">
            Start Date:{" "}
            <time dateTime={pool.allocationStartTime.toString()}>
              {prettyTimestamp(pool.allocationStartTime)}
            </time>
          </dt>
          <dd className="text-gray-500">
            End Date:{" "}
            <time dateTime={pool.allocationEndTime.toString()}>
              {prettyTimestamp(pool.allocationEndTime)}
            </time>
          </dd>
        </div>
        <div className="flex justify-between gap-x-4 py-3 text-gray-500">
          <div
            ref={containerRef}
            className={`text-gray-500 line-clamp-4 ${
              isTextOverflowing ? "overflow-hidden" : ""
            }`}
          >
            <ReactMarkdown
              children={metadata.description}
              remarkPlugins={[gfm]}
              components={{
                img: ({ node, ...props }) => null, // Skip rendering images
              }}
            />
          </div>
        </div>
        {isTextOverflowing && <>Show more...</>}
      </dl>
    </Link>
  );
};

export default PoolCard;
