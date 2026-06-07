import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateUserProfile } from "@/services/user.service";
import { errorResponse, successResponse, serverError } from "@/lib/api-response";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  email: z.string().email("Please enter a valid email"),
});

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id as string | undefined;
    if (!userId) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await req.json();
    const data = profileSchema.parse(body);

    const user = await updateUserProfile(userId, {
      name: data.name,
      email: data.email,
    });

    return successResponse(user, "Profile updated successfully");
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 500);
    }
    return serverError(error);
  }
}
