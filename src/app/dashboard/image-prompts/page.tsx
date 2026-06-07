import { PageHeader } from "@/components/shared/page-header";
import { ImagePromptForm } from "@/components/dashboard/image-prompt-form";

export default function ImagePromptsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Image Prompt Generator"
        description="Generate detailed image prompts for AI art and illustration tools."
      />
      <ImagePromptForm />
    </div>
  );
}
