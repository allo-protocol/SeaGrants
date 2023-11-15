import ProfilePage from "@/components/profile/ProfilePage";

export default function Profile({ params }: { params: { id: string } }) {
  return (
    <div>
      <ProfilePage params={params} />
    </div>
  );
}
