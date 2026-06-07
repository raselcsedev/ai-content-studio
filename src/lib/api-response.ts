import { NextResponse } from "next/server";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function successResponse<T>(data: T, message?: string, status = 200) {
  const body: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  return NextResponse.json(body, { status });
}

export function errorResponse(error: string, status = 400) {
  const body: ApiResponse = {
    success: false,
    error,
  };
  return NextResponse.json(body, { status });
}

export function serverError(error: unknown) {
  console.error("Server error:", error);
  const message = error instanceof Error ? error.message : "Internal server error";
  return errorResponse(message, 500);
}
