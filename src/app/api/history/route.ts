import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getGenerations, deleteMultipleGenerations } from "@/services/history.service";
import { errorResponse, successResponse, serverError } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id as string | undefined;
    if (!userId) {
      return errorResponse("Unauthorized", 401);
    }

    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") ?? 1);
    const limit = Number(url.searchParams.get("limit") ?? 10);
    const type = url.searchParams.get("type") || undefined;
    const search = url.searchParams.get("search") || undefined;

    const data = await getGenerations({
      userId,
      page,
      limit,
      type: type as any,
      search,
    });

    return successResponse(data);
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 500);
    }
    return serverError(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id as string | undefined;
    if (!userId) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await req.json();
    const ids = body.ids as string[];
    if (!ids || !ids.length) {
      return errorResponse("No generation ids provided", 400);
    }

    const deletedCount = await deleteMultipleGenerations(ids, userId);
    return successResponse({ deletedCount }, "Selected history deleted successfully");
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 500);
    }
    return serverError(error);
  }
}
