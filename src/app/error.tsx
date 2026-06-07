"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-20 text-center">
      <div className="max-w-xl rounded-3xl border border-border bg-card p-10 shadow-sm">
        <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-destructive" />
        <h1 className="text-3xl font-semibold">Something went wrong</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">An unexpected error occurred. Try refreshing the page or go back to the dashboard.</p>
        <pre className="mt-4 max-h-40 overflow-auto rounded-2xl bg-muted p-4 text-left text-sm text-muted-foreground">{error.message}</pre>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => reset()}>Try again</Button>
          <Link href="/dashboard">
            <Button variant="outline">Go back</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
