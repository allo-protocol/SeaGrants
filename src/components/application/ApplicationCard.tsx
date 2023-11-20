import { IApplication, TNewApplicationResponse } from "@/app/types";
import { classNames, statusColorsScheme, stringToColor } from "@/utils/common";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";

export default function ApplicationCard(props: {
  application: TNewApplicationResponse;
}) {
  const bannerRef = useRef<any>(null);
  const [bannerSize, setBannerSize] = useState({
    width: 0,
    height: 0,
  });
  const params = useParams();
  const application = props.application;
  const navLink = `/${params.chainId}/${params.poolId}/${application.recipientId}`;

  return (
    <Link href={navLink}>
      <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50">
        {props.application.applicationBanner ? (
          <Image
            src={props.application.applicationBanner}
            alt="applicationBanner"
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
              backgroundColor: stringToColor(application.metadata!.name),
            }}
          >
            <span className="text-gray-400 text-3xl">
              {application.metadata!.name}
            </span>
          </div>
        )}
      </div>
      <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
        <div className="text-sm font-medium leading-6 text-gray-900 py-3">
          {application.metadata!.name}
        </div>
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Submitted On</dt>
          <dd className="text-gray-700">
            <time dateTime={application.blockTimestamp}>
              {application.blockTimestamp}
            </time>
          </dd>
        </div>
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Amount</dt>
          <dd className="flex items-start gap-x-2">
            <div className="font-medium text-gray-900">
              {application.requestedAmount}
            </div>
          </dd>
        </div>
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Status</dt>
          <dd className="flex items-start gap-x-2">
            <div
              className={classNames(
                statusColorsScheme[application.status],
                "rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset"
              )}
            >
              {application.status.toString()}
            </div>
          </dd>
        </div>
      </dl>
    </Link>
  );
}
