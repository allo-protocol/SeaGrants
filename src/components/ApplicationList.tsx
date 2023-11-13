import ApplicationCard from "./ApplicationCard";

export default function ApplicationList() {
  const applications = [
    {
      id: 1,
      name: "Tuple",
      imageUrl: "https://tailwindui.com/img/logos/48x48/tuple.svg",
      date: "December 13, 2022",
      dateTime: "2022-12-13",
      amount: "$2,000.00",
      status: "Approved",
    },
    {
      id: 2,
      name: "SavvyCal",
      imageUrl: "https://tailwindui.com/img/logos/48x48/savvycal.svg",
      date: "January 22, 2023",
      dateTime: "2023-01-22",
      amount: "$14,000.00",
      status: "Approved",
    },
    {
      id: 3,
      name: "Reform",
      imageUrl: "https://tailwindui.com/img/logos/48x48/reform.svg",
      date: "January 23, 2023",
      dateTime: "2023-01-23",
      amount: "$7,600.00",
      status: "Pending",
    },
  ];

  return (
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
  );
}
