import { z } from "zod";

export const blogSchema = z.object({
  topic: z
    .string()
    .min(1, "Topic is required")
    .min(5, "Topic must be at least 5 characters")
    .max(200, "Topic must be at most 200 characters"),
  tone: z.string().min(1, "Please select a tone"),
  keywords: z.string().optional(),
  wordCount: z.coerce
    .number()
    .min(100, "Minimum 100 words")
    .max(5000, "Maximum 5000 words")
    .default(800),
});

export const emailSchema = z.object({
  emailType: z.string().min(1, "Please select an email type"),
  tone: z.string().min(1, "Please select a tone"),
  prompt: z
    .string()
    .min(1, "Prompt is required")
    .min(10, "Prompt must be at least 10 characters"),
  recipientName: z.string().optional(),
  senderName: z.string().optional(),
});

export const codeSchema = z.object({
  prompt: z
    .string()
    .min(1, "Prompt is required")
    .min(5, "Prompt must be at least 5 characters"),
  language: z.string().min(1, "Please select a language"),
  action: z.enum(["generate", "explain", "debug", "refactor"]),
});

export const imagePromptSchema = z.object({
  subject: z
    .string()
    .min(1, "Subject is required")
    .min(3, "Subject must be at least 3 characters"),
  style: z.string().min(1, "Please select a style"),
  mood: z.string().min(1, "Please select a mood"),
  details: z.string().optional(),
  category: z.string().min(1, "Please select a category"),
});

export type BlogFormData = z.infer<typeof blogSchema>;
export type EmailFormData = z.infer<typeof emailSchema>;
export type CodeFormData = z.infer<typeof codeSchema>;
export type ImagePromptFormData = z.infer<typeof imagePromptSchema>;
