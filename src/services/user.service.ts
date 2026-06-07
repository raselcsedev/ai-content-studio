import dbConnect from "@/lib/db";
import User, { IUserDocument } from "@/models/user.model";
import bcrypt from "bcryptjs";

export async function getUserById(userId: string) {
  // Test mode - return mock user without DB
  if (process.env.NEXTAUTH_TEST_MODE === "true") {
    const email = userId.includes("test@") ? "test@example.com" : "demo@example.com";
    return {
      _id: userId,
      name: email === "test@example.com" ? "Test User" : "Demo User",
      email: email,
      role: "user",
      avatar: undefined,
    };
  }

  await dbConnect();
  return User.findById(userId).lean();
}

export async function getUserByEmail(email: string) {
  await dbConnect();
  return User.findOne({ email }).lean();
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  await dbConnect();

  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new Error("An account with this email already exists");
  }

  const user = await User.create(data);
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function updateUserProfile(
  userId: string,
  data: { name?: string; email?: string }
) {
  await dbConnect();

  if (data.email) {
    const existing = await User.findOne({
      email: data.email,
      _id: { $ne: userId },
    });
    if (existing) {
      throw new Error("Email is already in use by another account");
    }
  }

  const user = await User.findByIdAndUpdate(userId, data, {
    new: true,
    runValidators: true,
  }).lean();

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  await dbConnect();

  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new Error("User not found");
  }

  const isValid = await user.comparePassword(currentPassword);
  if (!isValid) {
    throw new Error("Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  return true;
}
