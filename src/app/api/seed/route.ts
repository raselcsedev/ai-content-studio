import dbConnect from "@/lib/db";
import User from "@/models/user.model";

export async function GET() {
  await dbConnect();

  // Remove old demo user (optional, useful for fixing bad seed data)
  await User.deleteOne({
    email: "demo@ai-content-studio.com",
  });

  const user = await User.create({
    name: "Demo User",
    email: "demo@ai-content-studio.com",
    password: "Demo!234", // Plain text - pre("save") will hash it
    role: "user",
  });

  const users = await User.find({}, "name email role");

  return Response.json({
    success: true,
    createdUser: {
      id: user._id,
      email: user.email,
    },
    count: users.length,
    users,
  });
}