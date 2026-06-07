import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDashboardStats, getActivityData } from "@/services/stats.service";
import { getRecentGenerations } from "@/services/history.service";
import { PageHeader } from "@/components/shared/page-header";
import { DashboardOverview } from "@/components/dashboard/overview";

function serializeGeneration(generation: any) {
  return {
    ...generation,
    _id: generation._id.toString(),
    userId: generation.userId.toString(),
    createdAt: generation.createdAt.toISOString(),
    updatedAt: generation.updatedAt.toISOString(),
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) {
    redirect("/login");
  }

  const stats = await getDashboardStats(userId);
  const activity = await getActivityData(userId, 15);
  const recentGenerations = (await getRecentGenerations(userId, 5)).map(
    serializeGeneration
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Your AI generation workspace with recent activity, usage metrics, and saved content."
      />
      <DashboardOverview stats={stats} activity={activity} recentGenerations={recentGenerations} />
    </div>
  );
}
