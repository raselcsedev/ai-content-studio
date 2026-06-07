import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { RegisterForm } from "@/components/auth/register-form";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <section className="w-full rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-10">
        <div className="mb-8 space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Create account
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Start generating content today</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Register and save your AI blog, email, code, and image prompt history in one place.
          </p>
        </div>
        <RegisterForm />
      </section>
    </main>
  );
}
