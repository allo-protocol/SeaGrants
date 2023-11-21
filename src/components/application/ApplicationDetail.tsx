"use client";

import {
  classNames,
  humanReadableAmount,
  prettyTimestamp,
  statusColorsScheme,
  stringToColor,
} from "@/utils/common";
import Breadcrumb from "../shared/Breadcrumb";
import NotificationToast from "../shared/NotificationToast";
import {
  TAllocatedData,
  TApplicationData,
  TApplicationMetadata,
} from "@/app/types";
import { useEffect, useRef, useState } from "react";
import { InboxIcon } from "@heroicons/react/24/outline";
import LoadingHistorySkeleton from "../shared/LoadingHistorySkeleton";
import { aspectRatio } from "@/utils/config";
import { MarkdownView } from "../shared/Markdown";
import Image from "next/image";

export default function ApplicationDetail(props: {
  application: TApplicationData;
  metadata: TApplicationMetadata;
  bannerImage: string;
  isError: boolean;
}) {
  const bannerRef = useRef<any>(null);
  const [bannerSize, setBannerSize] = useState({
    width: 0,
    height: 0,
  });

  const microGrantRecipient = props.application;
  const microGrant = microGrantRecipient.microGrant;
  const allocatedData: {
    allocateds: TAllocatedData[];
    isError: boolean;
    isLoading: boolean;
  } = {
    allocateds: [],
    isError: false,
    isLoading: true,
  };
  const tokenMetadata = microGrant.pool.tokenMetadata;
  const amount = humanReadableAmount(
    microGrant.pool.amount,
    tokenMetadata.decimals,
  );
  const token = tokenMetadata.symbol ?? "ETH";

  useEffect(() => {
    if (bannerRef.current) {
      setBannerSize({
        width: bannerRef.current.offsetWidth,
        height: Math.ceil(bannerRef.current.offsetWidth / aspectRatio),
      });
    }
  }, [bannerRef]);

  const application = {
    name: props.metadata?.name,
    status: microGrantRecipient.status,
    amountRequested: `${amount} ${token}`,
    href: "#",
    breadcrumbs: [
      { id: 1, name: "Home", href: "/" },
      {
        id: 2,
        name: `Pool ${microGrant.poolId}`,
        href: `/${microGrant.chainId}/${microGrant.poolId}`,
      },
      { id: 3, name: props.metadata?.name, href: "#" },
    ],
    logo: {
      src: props.bannerImage,
      alt: props.metadata.name,
    },
    description: props.metadata.description,
  };

  const overviews = [
    { description: "Amount", name: application.amountRequested },
    {
      description: "Start Date",
      name: prettyTimestamp(microGrant.allocationStartTime),
    },
    {
      description: "End Date",
      name: prettyTimestamp(microGrant.allocationEndTime),
    },
    { description: "Approvals", name: "2", color: "text-green-700" },
    { description: "Rejections", name: "3", color: "text-red-700" },
  ];

  return (
    <div className="bg-white">
      {props.isError && (
        <NotificationToast
          success={false}
          title="Unable to fetch application"
        />
      )}

      <div className="pt-6">
        <Breadcrumb breadcrumbs={application.breadcrumbs} />

        {/* Banner */}
        <div className="mx-auto mt-6 max-h-[20rem] sm:px-6 lg:grid lg:gap-x-8 lg:px-8">
          <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
            {application.logo.src !== "" ? (
              <Image
                src={application.logo.src}
                alt={application.logo.alt}
                className="h-full w-full object-cover object-center"
                width={bannerSize.width}
                height={bannerSize.height}
              />
            ) : (
              <div
                className="flex items-center justify-center"
                style={{
                  width: `${bannerSize.width}px`,
                  height: `${bannerSize.height}px`,
                  backgroundColor: stringToColor(
                    props.metadata.name ?? (Math.random() * 10000).toString(),
                  ),
                }}
              >
                <span className="text-gray-400 text-3xl">
                  {props.metadata.name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Application info */}
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {application.name}
            </h1>
          </div>

          {/* Overview */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <div className="mt-6 border-t border-gray-100">
              <dl className="divide-y divide-gray-100">
                {/* Status */}
                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Status
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 text-center sm:mt-0">
                    <div
                      className={classNames(
                        statusColorsScheme[
                          application.status as keyof typeof statusColorsScheme
                        ],
                        "rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset",
                      )}
                    >
                      {application.status.toString()}
                    </div>
                  </dd>
                </div>

                {overviews.map((overview, index) => (
                  <div
                    key={index}
                    className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
                  >
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      {overview.description}
                    </dt>
                    <dd
                      className={classNames(
                        overview.color ? overview.color : "",
                        "mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0",
                      )}
                    >
                      {overview.name}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <form className="mt-10">
              <button
                type="submit"
                className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Approve
              </button>
              <button
                type="submit"
                className="mt-4 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-100 px-8 py-3 text-base font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:ring-offset-2"
              >
                Reject
              </button>
            </form>
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Description</h3>
              <MarkdownView text={application.description} />
            </div>

            <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900 border-t pt-10">
                Allocations
              </h3>

              <div className="mt-4">
                {/* Allocations */}
                {!allocatedData.isLoading && !allocatedData.isError ? (
                  allocatedData.allocateds ? (
                    <table className="mt-16 w-full whitespace-nowrap text-left text-sm leading-6">
                      <colgroup>
                        <col className="w-full" />
                        <col />
                      </colgroup>
                      <thead className="border-b border-gray-200 text-gray-900">
                        <tr>
                          <th scope="col" className="px-0 py-3 font-semibold">
                            Projects
                          </th>
                          <th
                            scope="col"
                            className="py-3 pl-8 pr-0 text-right font-semibold"
                          >
                            Funded
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {allocatedData.allocateds.map((item: any) => (
                          <tr
                            key={`${item.recipientId.toLowerCase()} + ${
                              item.chainId
                            }`}
                            className="border-b border-gray-100"
                          >
                            <td className="max-w-0 px-0 py-5 align-top">
                              <div className="truncate font-medium text-gray-900">
                                {item.chainId}
                              </div>
                              <div className="truncate text-gray-500">
                                {item.sender}
                              </div>
                            </td>
                            <td className="py-5 pl-8 pr-0 text-right align-top tabular-nums text-gray-700">
                              {item.amount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <LoadingHistorySkeleton />
                  )
                ) : (
                  <div className="flex flex-col items-center mt-8 w-full text-center pt-2">
                    <InboxIcon className="mb-4 w-8 h-8 mx-auto" />
                    <p>No Allocation History</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
