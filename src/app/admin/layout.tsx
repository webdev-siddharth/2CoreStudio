import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Server-side admin gate — every route under /admin is checked here.
 * Never trust a client-side role check; this runs on the server per request.
 */
export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let isAdmin = false;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
      isAdmin = profile?.role === "admin";
    }
  } catch (err) {
    console.error("Admin gate check threw:", err);
  }

  if (!isAdmin) redirect("/");

  return (
    <div className="min-h-screen">
      <div className="border-b-[3px] border-ink bg-surface px-5 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <Link
            href="/admin"
            className="display text-sm text-ink no-underline hover:text-magenta"
          >
            ADMIN<span className="text-magenta">CONSOLE</span>
          </Link>
          <nav className="flex flex-wrap gap-x-4 gap-y-2">
            <Link
              href="/admin"
              className="py-1 text-[0.68rem] font-bold uppercase tracking-wider text-ink no-underline hover:text-magenta md:py-0"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/apps"
              className="py-1 text-[0.68rem] font-bold uppercase tracking-wider text-ink no-underline hover:text-magenta md:py-0"
            >
              Apps
            </Link>
            <Link
              href="/admin/posts"
              className="py-1 text-[0.68rem] font-bold uppercase tracking-wider text-ink no-underline hover:text-magenta md:py-0"
            >
              Posts
            </Link>
            <Link
              href="/"
              className="py-1 text-[0.68rem] font-bold uppercase tracking-wider text-muted no-underline hover:text-ink md:py-0"
            >
              ← Back to site
            </Link>
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}
