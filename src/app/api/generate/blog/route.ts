import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateBlog } from "@/services/ai.service";
import { createGeneration } from "@/services/history.service";
import { errorResponse, successResponse, serverError } from "@/lib/api-response";
import { blogSchema } from "@/validations/ai.validation";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id as string | undefined;
    if (!userId) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await req.json();
    const data = blogSchema.parse(body);
    const output = await generateBlog({
      topic: data.topic,
      tone: data.tone,
      keywords: data.keywords ? data.keywords.split(",").map((keyword: string) => keyword.trim()) : [],
      wordCount: data.wordCount,
    });

    await createGeneration({
      userId,
      type: "blog",
      title: `Blog: ${data.topic}`,
      prompt: `Topic: ${data.topic}
Tone: ${data.tone}
Keywords: ${data.keywords ?? "None"}`,
      output,
      metadata: {
        tone: data.tone,
        keywords: data.keywords
          ? data.keywords.split(",").map((keyword: string) => keyword.trim())
          : [],
        wordCount: data.wordCount,
      },
    });

    return successResponse({ output }, "Blog generated successfully");
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 500);
    }
    return serverError(error);
  }
}
