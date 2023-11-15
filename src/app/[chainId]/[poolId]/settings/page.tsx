import SettingsPage from "@/components/settings/SettingsPage";
import ProfilePage from "@/components/settings/SettingsPage";

export default function Settings({ params }: { params: { id: string } }) {
  return (
    <div>
      <SettingsPage params={params} />
    </div>
  );
}
