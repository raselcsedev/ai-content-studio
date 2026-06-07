"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Clock3, Sparkles, TrendingUp } from "lucide-react";
import { formatDate, truncate } from "@/lib/utils";
import type { ActivityData, DashboardStats, IGeneration } from "@/types";

interface DashboardOverviewProps {
  stats: DashboardStats;
  activity: ActivityData[];
  recentGenerations: IGeneration[];
}

export function DashboardOverview({ stats, activity, recentGenerations }: DashboardOverviewProps) {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { title: "Total AI Generations", value: stats.totalGenerations, icon: Sparkles },
          { title: "This month", value: stats.thisMonthGenerations, icon: TrendingUp },
          { title: "Blogs created", value: stats.totalBlogs, icon: ArrowUpRight },
          { title: "Email drafts", value: stats.totalEmails, icon: Clock3 },
        ].map((card) => (
          <Card key={card.title} className="border border-border bg-card/95 p-6">
            <CardHeader className="p-0">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">{card.value}</CardTitle>
                  <CardDescription>{card.title}</CardDescription>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <card.icon className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Activity summary</CardTitle>
            <CardDescription>AI content creation over the last 15 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activity} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBlogs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorEmails" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="blogs" name="Blogs" stroke="#7c3aed" fill="url(#colorBlogs)" />
                  <Area type="monotone" dataKey="emails" name="Emails" stroke="#0ea5e9" fill="url(#colorEmails)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="space-y-4 p-6">
          <div>
            <CardTitle>Recent AI generation</CardTitle>
            <CardDescription>Latest content generated in your account.</CardDescription>
          </div>
          <div className="space-y-4">
            {recentGenerations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent content yet. Generate your first item now.</p>
            ) : (
              recentGenerations.map((generation) => (
                <div key={generation._id} className="rounded-3xl border border-border p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">{generation.title}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(generation.createdAt)}</p>
                    </div>
                    <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                      {generation.type.replace("image-prompt", "prompt")}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{truncate(generation.output, 120)}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
