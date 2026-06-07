import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateEmail } from "@/services/ai.service";
import { createGeneration } from "@/services/history.service";
import { errorResponse, successResponse, serverError } from "@/lib/api-response";
import { emailSchema } from "@/validations/ai.validation";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id as string | undefined;
    if (!userId) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await req.json();
    const data = emailSchema.parse(body);

    const output = await generateEmail({
      emailType: data.emailType,
      tone: data.tone,
      prompt: data.prompt,
      recipientName: data.recipientName,
      senderName: data.senderName,
    });

    await createGeneration({
      userId,
      type: "email",
      title: `Email: ${data.emailType}`,
      prompt: `Type: ${data.emailType}
Tone: ${data.tone}
Prompt: ${data.prompt}`,
      output,
      metadata: {
        tone: data.tone,
        emailType: data.emailType,
      },
    });

    return successResponse({ output }, "Email generated successfully");
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 500);
    }
    return serverError(error);
  }
}
