"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { blogSchema, type BlogFormData } from "@/validations/ai.validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CopyButton } from "@/components/shared/copy-button";
import ReactMarkdown from "react-markdown";

export function BlogGeneratorForm() {
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { control, register, handleSubmit, formState: { errors } } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      topic: "",
      tone: "Professional",
      keywords: "",
      wordCount: 800,
    },
  });

  async function onSubmit(data: BlogFormData) {
    setIsLoading(true);
    setOutput("");

    try {
      const response = await fetch("/api/generate/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        toast.error(result.error || "Unable to generate blog.");
        return;
      }
      setOutput(result.data.output);
      toast.success("Blog generated successfully.");
    } catch (error) {
      toast.error("An unexpected error occurred while generating the blog.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6 rounded-3xl border border-border bg-card p-6">
          <div>
            <Label htmlFor="topic">Blog topic</Label>
            <Input id="topic" placeholder="Enter a topic like AI productivity trends" {...register("topic")} />
            {errors.topic && <p className="mt-2 text-sm text-destructive">{errors.topic.message}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="tone">Tone</Label>
              <Controller
                control={control}
                name="tone"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="tone">
                      <SelectValue placeholder="Select a tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Professional', 'Friendly', 'Casual', 'Authoritative'].map((tone) => (
                        <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.tone && <p className="mt-2 text-sm text-destructive">{errors.tone.message}</p>}
            </div>
            <div>
              <Label htmlFor="wordCount">Word count</Label>
              <Input id="wordCount" type="number" min={100} max={5000} {...register("wordCount", { valueAsNumber: true })} />
              {errors.wordCount && <p className="mt-2 text-sm text-destructive">{errors.wordCount.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="keywords">Keywords</Label>
            <Textarea id="keywords" placeholder="fast ai writing, content marketing, seo" rows={4} {...register("keywords")} />
            {errors.keywords && <p className="mt-2 text-sm text-destructive">{errors.keywords.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Generating blog..." : "Generate blog"}
          </Button>
        </div>
        <div className="space-y-4">
          <div className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Output preview</h2>
            <p className="mt-2 text-sm text-muted-foreground">Once generated, your blog will appear here with a copy button.</p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 min-h-[210px]">
            {output ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold">Generated blog</p>
                  <CopyButton text={output} />
                </div>
                <div className="markdown-content max-h-[420px] overflow-y-auto pr-2 text-sm leading-7">
                  <ReactMarkdown>{output}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Start by filling the fields and generating your first blog post.</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
