const ApplicationList = () => {
  return (
    <div className="flex flex-col">
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
};

export default ApplicationList;
