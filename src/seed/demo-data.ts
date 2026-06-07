import dbConnect from "@/lib/db";
import User from "@/models/user.model";
import Generation from "@/models/generation.model";

async function main() {
  await dbConnect();

  const existingUser = await User.findOne({ email: "demo@ai-content-studio.com" }).select("+password");
  if (!existingUser) {
    console.log("Seeding demo user...");
    const user = await User.create({
      name: "Demo User",
      email: "demo@ai-content-studio.com",
      password: "Demo!234",
      avatar: "",
    });

    await Generation.create([
      {
        userId: user._id,
        type: "blog",
        title: "AI Productivity Trends",
        prompt: "Generate a blog post about AI productivity trends.",
        output: "# AI Productivity Trends\n\nAI is transforming productivity...",
        metadata: { tone: "Professional", wordCount: 900, keywords: ["AI", "productivity", "automation"] },
      },
      {
        userId: user._id,
        type: "email",
        title: "Sales Email",
        prompt: "Write a sales email for a new AI product.",
        output: "Hello team,\n\nI wanted to share our new AI solution...",
        metadata: { tone: "Professional", emailType: "Sales email" },
      },
      {
        userId: user._id,
        type: "code",
        title: "React Button Component",
        prompt: "Generate a reusable React button component.",
        output: "import React from 'react';\n...",
        metadata: { language: "TypeScript", action: "generate" },
      },
      {
        userId: user._id,
        type: "image-prompt",
        title: "Cinematic Workspace Prompt",
        prompt: "Generate cinematic AI image prompts for a futuristic workspace.",
        output: "1. Futuristic workspace with neon lighting...",
        metadata: { category: "Technology", style: "Cinematic", mood: "Inspiring" },
      },
    ]);
    console.log("Demo data seeded successfully.");
  } else {
    console.log("Demo user already exists. No changes made.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
