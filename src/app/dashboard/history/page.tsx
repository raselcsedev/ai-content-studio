import { PageHeader } from "@/components/shared/page-header";
import { HistoryTable } from "@/components/dashboard/history-table";

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="History"
        description="Search, filter, and manage your saved AI content history."
      />
      <HistoryTable />
    </div>
  );
}
