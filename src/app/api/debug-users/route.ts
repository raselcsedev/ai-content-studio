// app/api/debug-users/route.ts

import dbConnect from "@/lib/db";
import User from "@/models/user.model";

export async function GET() {
  await dbConnect();

  const users = await User.find({}, "name email");

  return Response.json({
    count: users.length,
    users,
  });
}