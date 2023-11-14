import { IApplication } from "@/app/types";
import ApplicationCard from "./ApplicationCard";

export default function ApplicationList() {
  // NOTE: This is just a placeholder for now.
  const applications: IApplication[] = [
    {
      id: 1,
      name: "Tuple",
      imageUrl: "https://tailwindui.com/img/logos/48x48/tuple.svg",
      createdAt: "December 13, 2022",
      // dateTime: "2022-12-13",
      amountRequested: "$2,000.00",
      status: "Paid",
      profileOwner: "0x1234",
      recipientAddress: "0x1234",
      nonce: 1,
    },
    {
      id: 2,
      name: "SavvyCal",
      imageUrl: "https://tailwindui.com/img/logos/48x48/savvycal.svg",
      createdAt: "January 22, 2023",
      // dateTime: "2023-01-22",
      amountRequested: "$14,000.00",
      status: "Accepted",
      profileOwner: "0x1234",
      recipientAddress: "0x1234",
      nonce: 2,
    },
    {
      id: 3,
      name: "Reform",
      imageUrl: "https://tailwindui.com/img/logos/48x48/reform.svg",
      createdAt: "January 23, 2023",
      // dateTime: "2023-01-23",
      amountRequested: "$7,600.00",
      status: "Pending",
      profileOwner: "0x1234",
      recipientAddress: "0x1234",
      nonce: 3,
    },
  ];

  return (
    <div className="flex flex-col">
      <div></div>
      <div>
        <ul
          role="list"
          className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8"
        >
          {applications.map((application) => (
            <li
              key={application.id}
              className="overflow-hidden rounded-xl border border-gray-200"
            >
              <ApplicationCard application={application} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
