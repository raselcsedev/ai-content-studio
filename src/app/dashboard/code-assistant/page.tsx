import { PageHeader } from "@/components/shared/page-header";
import { CodeAssistantForm } from "@/components/dashboard/code-assistant-form";

export default function CodeAssistantPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Code Assistant"
        description="Generate, explain, debug, or refactor code with a smart AI assistant."
      />
      <CodeAssistantForm />
    </div>
  );
}
