"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";
import { codeSchema, type CodeFormData } from "@/validations/ai.validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CopyButton } from "@/components/shared/copy-button";

export function CodeAssistantForm() {
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { control, register, handleSubmit, formState: { errors } } = useForm<CodeFormData>({
    resolver: zodResolver(codeSchema),
    defaultValues: {
      prompt: "Create a reusable React button component.",
      language: "TypeScript",
      action: "generate",
    },
  });

  async function onSubmit(data: CodeFormData) {
    setIsLoading(true);
    setOutput("");

    try {
      const response = await fetch("/api/generate/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        toast.error(result.error || "Unable to generate code.");
        return;
      }
      setOutput(result.data.output);
      toast.success("Code assistant returned results.");
    } catch (error) {
      toast.error("An unexpected error occurred while generating code.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6 rounded-3xl border border-border bg-card p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="language">Language</Label>
              <Controller
                control={control}
                name="language"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {['TypeScript', 'JavaScript', 'Python', 'Go', 'Java'].map((language) => (
                        <SelectItem key={language} value={language}>{language}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.language && <p className="mt-2 text-sm text-destructive">{errors.language.message}</p>}
            </div>
            <div>
              <Label htmlFor="action">Action</Label>
              <Controller
                control={control}
                name="action"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="action">
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      {['generate', 'explain', 'debug', 'refactor'].map((action) => (
                        <SelectItem key={action} value={action}>{action}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.action && <p className="mt-2 text-sm text-destructive">{errors.action.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea id="prompt" rows={8} placeholder="Describe what you need for code assistance." {...register("prompt")} />
            {errors.prompt && <p className="mt-2 text-sm text-destructive">{errors.prompt.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing code..." : "Run code assistant"}
          </Button>
        </div>
        <div className="space-y-4">
          <div className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Code output</h2>
            <p className="mt-2 text-sm text-muted-foreground">Generated or explained code is displayed below.</p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 min-h-[210px]">
            {output ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold">Generated code</p>
                  <CopyButton text={output} />
                </div>
                <SyntaxHighlighter language="tsx" style={materialDark} customStyle={{ borderRadius: 16, background: "#0f172a", padding: "1rem" }}>
                  {output}
                </SyntaxHighlighter>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Enter a prompt and choose action to see code suggestions.</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
