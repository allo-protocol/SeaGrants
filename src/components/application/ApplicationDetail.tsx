"use client";

import {
  classNames,
  humanReadableAmount,
  prettyTimestamp,
  statusColorsScheme,
} from "@/utils/common";
import Breadcrumb from "../shared/Breadcrumb";
import NotificationToast from "../shared/NotificationToast";
import {
  TAllocatedData,
  TApplicationData,
  TApplicationMetadata,
} from "@/app/types";
import { useContext, useState } from "react";
import { MarkdownView } from "../shared/Markdown";
import { PoolContext } from "@/context/PoolContext";
import Banner from "../shared/Banner";
import Modal from "../shared/Modal";
import { Allocation } from "@allo-team/allo-v2-sdk/dist/strategies/MicroGrantsStrategy/types";
import { Status } from "@allo-team/allo-v2-sdk/dist/strategies/types";
import { AddressResponsive } from "../shared/Address";
import AllocatedList from "../shared/AllocatedsList";

export default function ApplicationDetail(props: {
  application: TApplicationData;
  metadata: TApplicationMetadata;
  bannerImage: string;
  isError: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { isAllocator, steps, allocate } = useContext(PoolContext);

  const microGrantRecipient = props.application;
  const microGrant = microGrantRecipient.microGrant;
  const tokenMetadata = microGrant.pool.tokenMetadata;
  const amount = humanReadableAmount(
    microGrant.pool.amount,
    tokenMetadata.decimals,
  );
  const token = tokenMetadata.symbol ?? "ETH";

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
    recipientId: microGrantRecipient.recipientId,
    recipientAddress: microGrantRecipient.recipientAddress,
  };

  const allocateds = microGrant.allocateds.filter(
    (allocated) =>
      allocated.recipientId === microGrantRecipient.recipientId.toLowerCase(),
  );

  // const distributeds = microGrant.distributeds.filter(
  //   (distributed) =>
  //     distributed.recipientId === microGrantRecipient.recipientId.toLowerCase(),
  // );

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

  const onAllocate = async (bool: boolean) => {
    setIsOpen(true);
    const allocation: Allocation = {
      recipientId: microGrantRecipient.recipientId as `0x${string}`,
      status: bool ? Status.Accepted : Status.Rejected,
    };

    await allocate(allocation);

    setTimeout(() => {
      setIsOpen(false);
    }, 1000);
  };

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
            <Banner image={application.logo.src} alt={application.logo.alt} />
          </div>
        </div>

        {/* Application info */}
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {application.name}
            </h1>
            <div className="lg:col-span-2 mt-5">
              {/* First row */}

              <div className="font-mono text-xs">
                <div className="flex items-center">
                  Application ID: &nbsp;
                  <AddressResponsive
                    address={application.recipientId}
                    chainId={Number(microGrant.chainId)}
                  />
                </div>
              </div>

              {/* Second row */}
              <div className="font-mono text-xs">
                <div className="flex items-center">
                  Recipient Address:&nbsp;
                  <AddressResponsive
                    address={application.recipientAddress}
                    chainId={Number(microGrant.chainId)}
                  />
                </div>
              </div>
            </div>
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

            {isAllocator && application.status !== "Accepted" && (
              <>
                <button
                  onClick={() => onAllocate(true)}
                  className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Approve
                </button>
                <button
                  onClick={() => onAllocate(false)}
                  className="mt-4 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-100 px-8 py-3 text-base font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:ring-offset-2"
                >
                  Reject
                </button>
              </>
            )}
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Description</h3>
              <MarkdownView text={application.description} />
            </div>

            <div className="mt-10">
              <AllocatedList allocateds={allocateds} showApplication={false} />
            </div>
          </div>
          <Modal isOpen={isOpen} setIsOpen={setIsOpen} steps={steps} />
        </div>
      </div>
    </div>
  );
}
