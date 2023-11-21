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
import { Fragment, useContext, useState } from "react";
import { MarkdownView } from "../shared/Markdown";
import { PoolContext } from "@/context/PoolContext";
import Banner from "../shared/Banner";
import Modal from "../shared/Modal";
import { Allocation } from "@allo-team/allo-v2-sdk/dist/strategies/MicroGrantsStrategy/types";
import { Status } from "@allo-team/allo-v2-sdk/dist/strategies/types";
import { AddressResponsive } from "../shared/Address";
import AllocatedList from "../shared/AllocatedsList";
import { Dialog, Listbox, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  CalendarDaysIcon,
  CreditCardIcon,
  EllipsisVerticalIcon,
  FaceFrownIcon,
  FaceSmileIcon,
  FireIcon,
  HandThumbUpIcon,
  HeartIcon,
  PaperClipIcon,
  UserCircleIcon,
  XMarkIcon as XMarkIconMini,
} from "@heroicons/react/20/solid";
import {
  BellIcon,
  XMarkIcon as XMarkIconOutline,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const activity = [
  {
    id: 1,
    type: "created",
    person: { name: "Chelsea Hagon" },
    date: "7d ago",
    dateTime: "2023-01-23T10:32",
  },
  {
    id: 2,
    type: "edited",
    person: { name: "Chelsea Hagon" },
    date: "6d ago",
    dateTime: "2023-01-23T11:03",
  },
  {
    id: 3,
    type: "sent",
    person: { name: "Chelsea Hagon" },
    date: "6d ago",
    dateTime: "2023-01-23T11:24",
  },
  {
    id: 4,
    type: "commented",
    person: {
      name: "Chelsea Hagon",
      imageUrl:
        "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    comment:
      "Called client, they reassured me the invoice would be paid by the 25th.",
    date: "3d ago",
    dateTime: "2023-01-23T15:56",
  },
  {
    id: 5,
    type: "viewed",
    person: { name: "Alex Curren" },
    date: "2d ago",
    dateTime: "2023-01-24T09:12",
  },
  {
    id: 6,
    type: "paid",
    person: { name: "Alex Curren" },
    date: "1d ago",
    dateTime: "2023-01-24T09:20",
  },
];

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
    tokenMetadata.decimals
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
      allocated.recipientId === microGrantRecipient.recipientId.toLowerCase()
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

      <div>
        <header>
          <Breadcrumb breadcrumbs={application.breadcrumbs} />

          {/* Banner */}
          <div className="mx-auto mt-6 max-h-[20rem] sm:px-6 lg:grid lg:gap-x-8 lg:px-8">
            <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
              <Banner image={application.logo.src} alt={application.logo.alt} />
            </div>
          </div>
        </header>
        {/* Application info */}
        <div>
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              <div className="-mx-4 px-4 py-8 shadow-sm ring-1 ring-gray-900/5 sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:px-16 xl:pb-20 xl:pt-16">
                <h2 className="text-base font-semibold leading-6 text-gray-900">
                  {application.name} Details
                </h2>
                {/* Add details info */}
                <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                  <div className="lg:col-span-2 mt-5">
                    <div className="font-mono text-xs">
                      Application ID: &nbsp;
                      <AddressResponsive
                        address={application.recipientId}
                        chainId={Number(microGrant.chainId)}
                      />
                    </div>
                    <div className="font-mono text-xs">
                      Recipient Address:&nbsp;
                      <AddressResponsive
                        address={application.recipientAddress}
                        chainId={Number(microGrant.chainId)}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-10">
                  <h3 className="sr-only">Description</h3>
                  <MarkdownView text={application.description} />
                </div>
                <div className="mt-10">
                  <AllocatedList
                    allocateds={allocateds}
                    showApplication={false}
                  />
                </div>
              </div>
              <div className="lg:col-start-3">
                {/* Activity feed */}
                <h2 className="text-sm font-semibold leading-6 text-gray-900">
                  Activity
                </h2>
                <ul role="list" className="mt-6 space-y-6">
                  {activity.map((activityItem, activityItemIdx) => (
                    <li key={activityItem.id} className="relative flex gap-x-4">
                      <div
                        className={classNames(
                          activityItemIdx === activity.length - 1
                            ? "h-6"
                            : "-bottom-6",
                          "absolute left-0 top-0 flex w-6 justify-center"
                        )}
                      >
                        <div className="w-px bg-gray-200" />
                      </div>
                      <>
                        <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
                          {activityItem.type === "paid" ? (
                            <CheckCircleIcon
                              className="h-6 w-6 text-indigo-600"
                              aria-hidden="true"
                            />
                          ) : (
                            <div className="h-1.5 w-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
                          )}
                        </div>
                        <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
                          <span className="font-medium text-gray-900">
                            {activityItem.person.name}
                          </span>{" "}
                          {activityItem.type} the invoice.
                        </p>
                        <time
                          dateTime={activityItem.dateTime}
                          className="flex-none py-0.5 text-xs leading-5 text-gray-500"
                        >
                          {activityItem.date}
                        </time>
                      </>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {/* Progress Modal */}
          <Modal isOpen={isOpen} setIsOpen={setIsOpen} steps={steps} />
        </div>
      </div>
    </div>
  );
}
