import { TProfile } from "@/app/types";
import ProfileDetail from "@/components/profile/ProfileDetail";
import { getMicroGrantRecipientQuery, graphqlEndpoint } from "@/utils/query";
import request from "graphql-request";

// const mockProfile: TProfile = {
//   id: "0x123",
//   profileOwner: "0x123",
//   recipientAddress: "0xe7eb5d2b5b188777df902e89c54570e7ef4f59ce",
//   nonce: 1,
//   members: ["0x123"],
// };

export default async function Profile({
  params,
}: {
  params: { recipientId: string };
}) {
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

  return (
    <div>
      <ProfileDetail profile={profileData.microGrantRecipient as TProfile} />
    </div>
  );
}
