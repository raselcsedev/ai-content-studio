import { PageHeader } from "@/components/shared/page-header";
import { SettingsPanel } from "@/components/dashboard/settings-panel";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Update your profile, change your password, and manage theme preferences."
      />
      <SettingsPanel />
    </div>
  );
}
