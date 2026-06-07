import { PageHeader } from "@/components/shared/page-header";
import { BlogGeneratorForm } from "@/components/dashboard/blog-generator-form";

export default function BlogGeneratorPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Blog Generator"
        description="Create SEO-friendly blog content with AI in seconds."
      />
      <BlogGeneratorForm />
    </div>
  );
}
