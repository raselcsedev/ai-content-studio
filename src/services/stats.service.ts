import dbConnect from "@/lib/db";
import Generation from "@/models/generation.model";
import type { DashboardStats, ActivityData } from "@/types";

// Mock data for test mode
function getMockDashboardStats(): DashboardStats {
  return {
    totalGenerations: 24,
    thisMonthGenerations: 12,
    totalBlogs: 8,
    totalEmails: 7,
    totalCode: 5,
    totalImagePrompts: 4,
  };
}

function getMockActivityData(days = 30): ActivityData[] {
  const activity: ActivityData[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    activity.push({
      date: dateStr,
      blogs: Math.floor(Math.random() * 3),
      emails: Math.floor(Math.random() * 2),
      code: Math.floor(Math.random() * 2),
      imagePrompts: Math.floor(Math.random() * 1),
    });
  }
  return activity;
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  // Test mode - return mock data without DB
  if (process.env.NEXTAUTH_TEST_MODE === "true") {
    return getMockDashboardStats();
  }

  await dbConnect();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalGenerations, thisMonthGenerations, typeCounts] =
    await Promise.all([
      Generation.countDocuments({ userId }),
      Generation.countDocuments({
        userId,
        createdAt: { $gte: startOfMonth },
      }),
      Generation.aggregate([
        { $match: { userId: userId } },
        { $group: { _id: "$type", count: { $sum: 1 } } },
      ]),
    ]);

  const typeMap: Record<string, number> = {};
  typeCounts.forEach((t: any) => {
    typeMap[t._id] = t.count;
  });

  return {
    totalGenerations,
    thisMonthGenerations,
    totalBlogs: typeMap["blog"] || 0,
    totalEmails: typeMap["email"] || 0,
    totalCode: typeMap["code"] || 0,
    totalImagePrompts: typeMap["image-prompt"] || 0,
  };
}

export async function getActivityData(
  userId: string,
  days = 30
): Promise<ActivityData[]> {
  // Test mode - return mock data without DB
  if (process.env.NEXTAUTH_TEST_MODE === "true") {
    return getMockActivityData(days);
  }

  await dbConnect();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const results = await Generation.aggregate([
    {
      $match: {
        userId: userId,
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          date: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          type: "$type",
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.date": 1 },
    },
  ]);

  // Fill in missing dates
  const activityMap = new Map<string, ActivityData>();

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    const dateStr = date.toISOString().split("T")[0];
    activityMap.set(dateStr, {
      date: dateStr,
      blogs: 0,
      emails: 0,
      code: 0,
      imagePrompts: 0,
    });
  }

  results.forEach((r: any) => {
    const existing = activityMap.get(r._id.date);
    if (existing) {
      switch (r._id.type) {
        case "blog":
          existing.blogs = r.count;
          break;
        case "email":
          existing.emails = r.count;
          break;
        case "code":
          existing.code = r.count;
          break;
        case "image-prompt":
          existing.imagePrompts = r.count;
          break;
      }
    }
  });

  return Array.from(activityMap.values());
}

