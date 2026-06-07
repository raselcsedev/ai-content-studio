import { NextRequest } from "next/server";
import { createUser } from "@/services/user.service";
import { errorResponse, successResponse, serverError } from "@/lib/api-response";
import { registerSchema } from "@/validations/auth.validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    const user = await createUser({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    return successResponse(user, "Account created successfully", 201);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
    return serverError(error);
  }
}
