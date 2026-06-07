import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-12 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="flex flex-col justify-center gap-6 rounded-3xl border border-border bg-card p-8 shadow-sm lg:p-12">
          <div className="space-y-3">
            <p className="inline-flex rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
              AI Content SaaS Dashboard
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Build high-converting blog posts, emails, code, and image prompts with AI.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              AI Content Studio helps creators, marketers, and teams generate polished content faster with a beautiful dashboard, analytics, and history management.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/login" className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
              Get Started
            </Link>
            <Link href="/register" className="inline-flex items-center justify-center rounded-full border border-input px-5 py-3 text-sm font-semibold transition hover:border-primary hover:text-primary">
              Create Account
            </Link>
          </div>
        </section>

        <section className="grid gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Feature Highlights
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "AI blog, email, code, and prompts",
                "Usage analytics and activity chart",
                "Secure login and profile settings",
                "Search, filtering, and history management",
              ].map((feature) => (
                <div key={feature} className="rounded-3xl border border-border p-4">
                  <p className="text-sm font-semibold">{feature}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-primary/5 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Ready for launch</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Install dependencies, configure your environment, and start generating professional AI content immediately.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
