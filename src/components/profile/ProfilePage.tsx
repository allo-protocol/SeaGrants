"use client";

import { useSearchParams } from "next/navigation";
import ProfileDetail from "./ProfileDetail";
import { TProfile } from "@/app/types";

const mockProfile: TProfile = {
  id: "0x123",
  profileOwner: "0x123",
  recipientAddress: "0x123",
  nonce: 1,
  members: ["0x123"],
};

export default function ProfilePage({ params }: { params: { id: string } }) {
  // get the profile from the contract
  const profileId = params.id;

  console.log("params", params);

  return <ProfileDetail profile={mockProfile} />;
}
