import { IApplication } from "@/app/types";
import { classNames } from "@/utils/common";
import Image from "next/image";

export default function ApplicationCard(props: { application: IApplication }) {
  const statuses = {
    Paid: "text-blue-700 bg-blue-50 ring-blue-600/20",
    Accepted: "text-green-700 bg-green-50 ring-green-600/20",
    Pending: "text-yellow-600 bg-yellow-50 ring-yellow-500/10",
    Rejected: "text-red-700 bg-red-50 ring-red-600/20",
  };

  const application = props.application;

  return (
    <>
      <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
        <Image
          className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10"
          src={application.imageUrl}
          alt={application.name}
          height={48}
          width={48}
        />
        <div className="text-sm font-medium leading-6 text-gray-900">
          {application.name}
        </div>
      </div>
      <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Submitted On</dt>
          <dd className="text-gray-700">
            <time dateTime={application.createdAt}>
              {application.createdAt}
            </time>
          </dd>
        </div>
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Amount</dt>
          <dd className="flex items-start gap-x-2">
            <div className="font-medium text-gray-900">
              {application.amountRequested}
            </div>
            <div
              className={classNames(
                statuses[application.status],
                "rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset"
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
