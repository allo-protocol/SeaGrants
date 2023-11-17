"use client";

import { IApplication, TPoolData, TPoolMetadata } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import Breadcrumb from "../shared/Breadcrumb";
import Image from "next/image";
import { aspectRatio } from "@/utils/config";
import { stringToColor } from "@/utils/common";

export default function PoolDetail(props: {
  chainId: string;
  poolId: string;
  pool: TPoolData;
  metadata: TPoolMetadata;
  poolBanner: string | undefined;
}) {
  const bannerRef = useRef<any>(null);
  const [bannerSize, setBannerSize] = useState({
    width: 0,
    height: 0,
  });
  const breadcrumbs = [
    { id: 1, name: "Home", href: "/" },
    {
      id: 2,
      name: `Pool ${props.poolId}`,
      href: `/${props.chainId}/${props.poolId}`,
    },
  ];

  console.log("====pool====", props.pool);
  console.log("====metadata====", props.metadata);

  useEffect(() => {
    if (bannerRef.current) {
      setBannerSize({
        width: bannerRef.current.offsetWidth,
        height: Math.ceil(bannerRef.current.offsetWidth / aspectRatio),
      });
    }
  }, [bannerRef]);

  return (
    <div className="bg-white">
      <div ref={bannerRef} className="pt-6 w-full">
        <Breadcrumb breadcrumbs={breadcrumbs} />

        {/* Banner */}
        <div className="mx-auto mt-6 max-h-[20rem] sm:px-6 lg:grid lg:gap-x-8 lg:px-8">
          <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
            {props.poolBanner ? (
              <Image
                src={props.poolBanner}
                alt="poolBanner"
                className="h-full w-full object-cover object-center"
                layout="responsive"
                width={bannerSize.width}
                height={bannerSize.height}
              />
            ) : (
              <div
                className="flex items-center justify-center"
                style={{
                  width: `${bannerSize.width}px`,
                  height: `${bannerSize.height}px`,
                  backgroundColor: stringToColor(props.metadata.name),
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
        {/* <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {application.name}
            </h1>
          </div> */}

        {/* Overview */}
        {/* <div className="mt-4 lg:row-span-3 lg:mt-0">
            <div className="mt-6 border-t border-gray-100">
              <dl className="divide-y divide-gray-100">
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
                </div> */}

        {/* {overviews.map((overview, index) => (
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
            </div> */}

        {/* <form className="mt-10">
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
          </div> */}

        <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
          {/* Description and details */}
          {/* <div>
              <h3 className="sr-only">Description</h3>

              <div className="space-y-6">
                <p className="text-base text-gray-900">
                  {application.description}
                </p>
              </div>
            </div> */}

          {/* <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900">Highlights</h3>

              <div className="mt-4">
                <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                  {application.highlights.map((highlight) => (
                    <li key={highlight} className="text-gray-400">
                      <span className="text-gray-600">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div> */}
        </div>
        {/* 
            <div className="mt-10">
              <h2 className="text-sm font-medium text-gray-900">Details</h2>

              <div className="mt-4 space-y-6">
                <p className="text-sm text-gray-600">{application.details}</p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );

  // return (
  //   <div className="flex flex-col">
  //     <div>
  //       <ul
  //         role="list"
  //         className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8"
  //       >
  //         {applications.map((application) => (
  //           <li
  //             key={application.id}
  //             className="overflow-hidden rounded-xl border border-gray-200"
  //           >
  //             <ApplicationCard application={application} />
  //           </li>
  //         ))}
  //       </ul>
  //     </div>
  //   </div>
  // );
}
