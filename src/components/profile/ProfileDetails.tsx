import { TProfile, TAllocatedData, TDistributedData } from "@/app/types";
import { InboxIcon } from "@heroicons/react/24/outline";
import LoadingHistorySkeleton from "../shared/LoadingHistorySkeleton";

const ProfileDetails = ({
  profile,
  allocations,
  distributions,
}: {
  profile: { profileData: TProfile; isLoading: boolean };
  allocations: { allocationData: TAllocatedData[]; isLoading: boolean };
  distributions: { distributionData: TDistributedData[]; isLoading: boolean };
}) => {
  return (
    <div className="-mx-4 px-4 py-8 shadow-sm ring-1 ring-gray-900/5 sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:px-16 xl:pb-20 xl:pt-16">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold leading-6 text-gray-900">
          Profile Details
        </h2>
        <span className="rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-yellow-600 ring-1 ring-inset ring-yellow-600/20">
          {profile.status}
        </span>
      </div>
      <dl className="mt-6 grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
        <div className="sm:pr-4">
          <dt className="inline text-gray-500">Recipient ID:</dt>{" "}
          <dd className="inline text-gray-700">
            <span className="text-xs">{profile.recipientId}</span>
          </dd>
        </div>
        <div className="mt-2 sm:mt-0 sm:pl-4">
          <dt className="inline text-gray-500">Recipient Address:</dt>{" "}
          <dd className="inline text-gray-700">
            <span className="text-xs">{profile.recipientAddress}</span>
          </dd>
        </div>
        <div className="sm:pr-4">
          <dt className="inline text-gray-500">Requested Amount:</dt>{" "}
          <dd className="inline text-gray-700">
            <span>{profile.requestedAmount}</span>
          </dd>
        </div>
      </dl>
      {/* todo: use table display? below.. */}
      {/* Allocations */}
      {!allocations.isLoading ? (
        allocations && allocations.allocationData.length > 0 ? (
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
              {allocations.allocationData.map((item) => (
                <tr
                  key={`${item.recipientId} + ${item.chainId}`}
                  className="border-b border-gray-100"
                >
                  <td className="max-w-0 px-0 py-5 align-top">
                    <div className="truncate font-medium text-gray-900">
                      {item.contractName}
                    </div>
                    <div className="truncate text-gray-500">
                      {item.contractAddress}
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
          <div className="flex flex-col items-center mt-16 w-full text-center border-t pt-2">
            <div>
              <InboxIcon className="w-8 h-8" />
            </div>
            No Allocation History
          </div>
        )
      ) : (
        <LoadingHistorySkeleton />
      )}

      {/* Distributions */}
      {!distributions.isLoading ? (
        distributions && distributions.distributionData.length > 0 ? (
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
              {distributions.distributionData.map((item) => (
                <tr
                  key={`${item.recipientId} + ${item.chainId}`}
                  className="border-b border-gray-100"
                >
                  <td className="max-w-0 px-0 py-5 align-top">
                    <div className="truncate font-medium text-gray-900">
                      {item.contractName}
                    </div>
                    <div className="truncate text-gray-500">
                      {item.contractAddress}
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
          <div className="flex flex-col items-center mt-16 w-full text-center border-t pt-2">
            <div>
              <InboxIcon className="w-8 h-8" />
            </div>
            No Distribution History
          </div>
        )
      ) : (
        <LoadingHistorySkeleton />
      )}
    </div>
  );
};

export default ProfileDetails;

const TableDisplay = () => {
  return <div>todo:</div>;
};
