import { IApplication, TNewApplicationResponse } from "@/app/types";
import { classNames, statusColorsScheme } from "@/utils/common";
import Image from "next/image";

export default function ApplicationCard(props: {
  application: TNewApplicationResponse;
}) {
  const application = props.application;

  return (
    <>
      <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
        {/* <Image
          className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10"
          src={application.base64Image}
          alt={application.name}
          height={48}
          width={48}
        /> */}
      </div>
      <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
        <div className="text-sm font-medium leading-6 text-gray-900">
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
            <div
              className={classNames(
                statusColorsScheme[application.status],
                "rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset",
              )}
            >
              {application.status.toString()}
            </div>
          </dd>
        </div>
      </dl>
    </>
  );
}
