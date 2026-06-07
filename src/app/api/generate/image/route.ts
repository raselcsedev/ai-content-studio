import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateImagePrompt } from "@/services/ai.service";
import { createGeneration } from "@/services/history.service";
import { errorResponse, successResponse, serverError } from "@/lib/api-response";
import { imagePromptSchema } from "@/validations/ai.validation";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id as string | undefined;
    if (!userId) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await req.json();
    const data = imagePromptSchema.parse(body);

    const output = await generateImagePrompt({
      subject: data.subject,
      category: data.category,
      style: data.style,
      mood: data.mood,
      details: data.details ?? "",
    });

    await createGeneration({
      userId,
      type: "image-prompt",
      title: `Image Prompts: ${data.subject}`,
      prompt: `Subject: ${data.subject}
Category: ${data.category}
Style: ${data.style}
Mood: ${data.mood}
Details: ${data.details ?? "None"}`,
      output,
      metadata: {
        category: data.category,
        style: data.style,
        mood: data.mood,
      },
    });

    return successResponse({ output }, "Image prompt generated successfully");
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 500);
    }
    return serverError(error);
  }
}
