"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { emailSchema, type EmailFormData } from "@/validations/ai.validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CopyButton } from "@/components/shared/copy-button";

export function EmailWriterForm() {
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { control, register, handleSubmit, formState: { errors } } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      emailType: "Sales email",
      tone: "Professional",
      prompt: "Introduce a new product to a potential client.",
      recipientName: "",
      senderName: "",
    },
  });

  async function onSubmit(data: EmailFormData) {
    setIsLoading(true);
    setOutput("");

    try {
      const response = await fetch("/api/generate/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        toast.error(result.error || "Unable to generate email.");
        return;
      }
      setOutput(result.data.output);
      toast.success("Email generated successfully.");
    } catch (error) {
      toast.error("An unexpected error occurred while generating the email.");
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
              <Label htmlFor="emailType">Email type</Label>
              <Controller
                control={control}
                name="emailType"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="emailType">
                      <SelectValue placeholder="Select email type" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Sales email', 'Follow-up', 'Introduction', 'Thank you'].map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.emailType && <p className="mt-2 text-sm text-destructive">{errors.emailType.message}</p>}
            </div>
            <div>
              <Label htmlFor="tone">Tone</Label>
              <Controller
                control={control}
                name="tone"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="tone">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Professional', 'Friendly', 'Concise', 'Formal'].map((tone) => (
                        <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.tone && <p className="mt-2 text-sm text-destructive">{errors.tone.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="prompt">Brief</Label>
            <Textarea id="prompt" rows={5} placeholder="Write the email context or details here." {...register("prompt")} />
            {errors.prompt && <p className="mt-2 text-sm text-destructive">{errors.prompt.message}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="recipientName">Recipient name</Label>
              <Input id="recipientName" placeholder="Alex" {...register("recipientName")} />
            </div>
            <div>
              <Label htmlFor="senderName">Sender name</Label>
              <Input id="senderName" placeholder="Jordan" {...register("senderName")} />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Writing email..." : "Generate email"}
          </Button>
        </div>
        <div className="space-y-4">
          <div className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Email preview</h2>
            <p className="mt-2 text-sm text-muted-foreground">Your polished email appears here after generation.</p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 min-h-[210px]">
            {output ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold">Generated email</p>
                  <CopyButton text={output} />
                </div>
                <pre className="whitespace-pre-wrap break-words text-sm leading-7 text-muted-foreground">{output}</pre>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Complete the form and generate your first email draft.</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
