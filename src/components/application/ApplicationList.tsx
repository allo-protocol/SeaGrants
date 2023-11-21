import { TNewApplicationResponse, TPoolData } from "@/app/types";
import ApplicationCard from "./ApplicationCard";

const ApplicationList = (props: {
  pool: TPoolData,
  applications: TNewApplicationResponse[];
}) => {

  return (
    <div className="flex flex-col pt-10 px-10">
      {props.applications.length > 0 ? (
        <div>
          <ul
            role="list"
            className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8"
          >
            {props.applications.map((application) => (
              <li
                key={application.recipientId.toLowerCase()}
                className="overflow-hidden rounded-xl border border-gray-200"
              >
                <ApplicationCard pool={props.pool} application={application} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <p>No applications</p>
        </div>
      )}
    </div>
  );
};

export default ApplicationList;
