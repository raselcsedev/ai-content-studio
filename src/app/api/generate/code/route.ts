import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateCode } from "@/services/ai.service";
import { createGeneration } from "@/services/history.service";
import { errorResponse, successResponse, serverError } from "@/lib/api-response";
import { codeSchema } from "@/validations/ai.validation";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id as string | undefined;
    if (!userId) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await req.json();
    const data = codeSchema.parse(body);

    const output = await generateCode({
      prompt: data.prompt,
      language: data.language,
      action: data.action,
    });

    await createGeneration({
      userId,
      type: "code",
      title: `Code: ${data.language}`,
      prompt: `Action: ${data.action}
Language: ${data.language}
Prompt: ${data.prompt}`,
      output,
      metadata: {
        language: data.language,
        action: data.action,
      },
    });

    return successResponse({ output }, "Code generated successfully");
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 500);
    }
    return serverError(error);
  }
}
