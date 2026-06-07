import { NextRequest } from "next/server";
import { forgotPasswordSchema } from "@/validations/auth.validation";
import { errorResponse, successResponse, serverError } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = forgotPasswordSchema.parse(body);

    // In production, integrate an email provider to send password reset instructions.
    return successResponse(
      { email: data.email },
      "If an account exists for this email, we sent password reset instructions.",
      200
    );
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
    return serverError(error);
  }
}
