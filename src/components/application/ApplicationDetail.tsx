"use client";

import {
  classNames,
  humanReadableAmount,
  prettyTimestamp,
  statusColorsScheme,
} from "@/utils/common";
import Breadcrumb from "../shared/Breadcrumb";
import Image from "next/image";
import NotificationToast from "../shared/NotificationToast";
import { TApplicationData } from "@/app/types";
import { formatEther } from "viem";
import { useEffect, useState } from "react";
import { getIPFSClient } from "@/services/ipfs";

export default function ApplicationDetail(props: {
  application: TApplicationData;
  isError: boolean;
}) {
  const [metadata, setMetadata] = useState<any>();
  console.log("====application====", props.application);
  const microGrantRecipient = props.application;
  const microGrant = microGrantRecipient.microGrant;
  const tokenMetadata = microGrant.pool.tokenMetadata;
  const amount = humanReadableAmount(
    microGrant.pool.amount,
    tokenMetadata.decimals
  );
  const token = tokenMetadata.symbol ?? "ETH";

  useEffect(() => {
    const fetchMetadata = async () => {
      const ipfsClient = getIPFSClient();
      const DEFAULT_NAME = `Pool ${microGrant.poolId}`;
      let metadata = { name: DEFAULT_NAME };
      try {
        metadata = await ipfsClient.fetchJson(
          microGrantRecipient.metadataPointer
        );

        console.log("====metadata====", metadata);
      } catch {
        console.log("IPFS", "Unable to fetch metadata");
      }
      if (metadata.name === undefined) metadata.name = DEFAULT_NAME;
      setMetadata(metadata);
    };

    fetchMetadata();
  }, [microGrantRecipient]);

  // TODO: Wire in name + description
  // TODO: Wire in approvals/ rejection
  // const applicationName = "Papa Kush";

  const application = {
    name: metadata?.name,
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
      { id: 3, name: metadata?.name, href: "#" },
    ],
    logo: {
      src: "https://www.mikeduran.com/wp-content/uploads/2019/02/Solarpink-1.jpg",
      alt: "Two each of gray, white, and black shirts laying flat.",
    },
    description:
      'The Basic Tee 6-Pack allows you to fully express your vibrant personality with three grayscale options. Feeling adventurous? Put on a heather gray tee. Want to be a trendsetter? Try our exclusive colorway: "Black". Need to add an extra pop of color to your outfit? Our white tee has you covered.',
    highlights: [
      "Hand cut and sewn locally",
      "Dyed with our proprietary colors",
      "Pre-washed & pre-shrunk",
      "Ultra-soft 100% cotton",
    ],
    details:
      'The 6-Pack includes two black, two white, and two heather gray Basic Tees. Sign up for our subscription service and be the first to get new, exciting colors, like our upcoming "Charcoal Gray" limited release.',
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
            <Image
              src={application.logo.src}
              alt={application.logo.alt}
              className="h-full w-full object-cover object-center"
              height={100}
              width={700}
            />
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
                        "rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset"
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
                        "mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0"
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

              <div className="space-y-6">
                <p className="text-base text-gray-900">
                  {application.description}
                </p>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900">Highlights</h3>

              <div className="mt-4">
                <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                  {application.highlights.map((highlight) => (
                    <li key={highlight} className="text-gray-400">
                      <span className="text-gray-600">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-sm font-medium text-gray-900">Details</h2>

              <div className="mt-4 space-y-6">
                <p className="text-sm text-gray-600">{application.details}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
