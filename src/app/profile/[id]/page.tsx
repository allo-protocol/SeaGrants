import { TAllocatedData, TDistributedData, TProfile } from "@/app/types";
import ProfileDetail from "@/components/profile/ProfileDetail";
import {
  getMicroGrantAllocationsQuery,
  getMicroGrantDistributionQuery,
  getMicroGrantRecipientQuery,
  graphqlEndpoint,
} from "@/utils/query";
import request from "graphql-request";

// FIXME: This is a temporary fix to get the profile page working
// NEED TO GET THE PARAMS FROM THE URL. The url to get to this page does not have chainId and poolId...
export default async function Profile({
  params,
}: {
  params: { recipientId: string };
}) {
  // let isProfileLoading = true;
  // let isAllocationsLoading = true;
  // let isDistributionLoading = true;

  const profileData = await request(
    graphqlEndpoint,
    getMicroGrantRecipientQuery,
    {
      chainId: "5",
      poolId: "15",
      recipientId: "0xe7eb5d2b5b188777df902e89c54570e7ef4f59ce",
    }
  );
  console.log("profileData", profileData);

  const allocationData: TAllocatedData[] = await request(
    graphqlEndpoint,
    getMicroGrantAllocationsQuery,
    {}
  );

  // const allocatedToMe = allocationData.filter(
  //   (allocation) => allocation.recipientId === params.recipientId
  // );

  const distributionData: TDistributedData[] = await request(
    graphqlEndpoint,
    getMicroGrantDistributionQuery,
    {}
  );

  console.log("distributionData ================", distributionData);
  console.log("allocationData ================", allocationData);

  return (
    <div>
      <ProfileDetail
        profile={{
          profileData: profileData.microGrantRecipient as TProfile,
          isLoading: false,
        }}
        allocations={{
          allocationData: allocationData as TAllocatedData[],
          isLoading: false,
        }}
        distributions={{
          distributionData: distributionData as TDistributedData[],
          isLoading: false,
        }}
      />
    </div>
  );
}
