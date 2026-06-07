"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { imagePromptSchema, type ImagePromptFormData } from "@/validations/ai.validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CopyButton } from "@/components/shared/copy-button";

export function ImagePromptForm() {
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { control, register, handleSubmit, formState: { errors } } = useForm<ImagePromptFormData>({
    resolver: zodResolver(imagePromptSchema),
    defaultValues: {
      subject: "Futuristic workspace",
      category: "Technology",
      style: "Cinematic",
      mood: "Inspiring",
      details: "Soft lighting and high contrast with neon reflections.",
    },
  });

  async function onSubmit(data: ImagePromptFormData) {
    setIsLoading(true);
    setOutput("");

    try {
      const response = await fetch("/api/generate/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        toast.error(result.error || "Unable to generate image prompt.");
        return;
      }
      setOutput(result.data.output);
      toast.success("Image prompt generated successfully.");
    } catch (error) {
      toast.error("An unexpected error occurred while generating the prompt.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6 rounded-3xl border border-border bg-card p-6">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" placeholder="Enter the scene subject" {...register("subject")} />
            {errors.subject && <p className="mt-2 text-sm text-destructive">{errors.subject.message}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="category">Category</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Technology', 'Nature', 'Lifestyle', 'Fantasy'].map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && <p className="mt-2 text-sm text-destructive">{errors.category.message}</p>}
            </div>
            <div>
              <Label htmlFor="style">Style</Label>
              <Controller
                control={control}
                name="style"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="style">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Cinematic', 'Minimal', 'Photorealistic', 'Digital art'].map((style) => (
                        <SelectItem key={style} value={style}>{style}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.style && <p className="mt-2 text-sm text-destructive">{errors.style.message}</p>}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="mood">Mood</Label>
              <Controller
                control={control}
                name="mood"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="mood">
                      <SelectValue placeholder="Select mood" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Inspiring', 'Moody', 'Bright', 'Dreamy'].map((mood) => (
                        <SelectItem key={mood} value={mood}>{mood}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.mood && <p className="mt-2 text-sm text-destructive">{errors.mood.message}</p>}
            </div>
            <div>
              <Label htmlFor="details">Details</Label>
              <Input id="details" placeholder="Optional details" {...register("details")} />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Generating prompt..." : "Generate prompt"}
          </Button>
        </div>
        <div className="space-y-4">
          <div className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Prompt output</h2>
            <p className="mt-2 text-sm text-muted-foreground">A ready-to-use AI image prompt appears here.</p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 min-h-[210px]">
            {output ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold">Generated prompt</p>
                  <CopyButton text={output} />
                </div>
                <pre className="whitespace-pre-wrap break-words text-sm leading-7 text-muted-foreground">{output}</pre>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Create a prompt and generate cinematic AI image descriptions.</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
