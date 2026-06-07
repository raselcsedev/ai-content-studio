import { PageHeader } from "@/components/shared/page-header";
import { EmailWriterForm } from "@/components/dashboard/email-writer-form";

export default function EmailWriterPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Email Writer"
        description="Produce professionally written emails for business, follow-ups, and outreach."
      />
      <EmailWriterForm />
    </div>
  );
}
