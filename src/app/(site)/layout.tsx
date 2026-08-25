import { Header } from "@/components/Header";
import { Marquee } from "@/components/Marquee";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import {
  isUnconfiguredSupabase,
  withTimeout,
} from "@/lib/supabase/fetch-guard";
import type { ProfileRow } from "@/lib/types";

async function getSession(): Promise<{
  user: { id: string; email: string } | null;
  isAdmin: boolean;
}> {
  if (isUnconfiguredSupabase()) return { user: null, isAdmin: false };
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await withTimeout(supabase.auth.getUser());
    if (!user) return { user: null, isAdmin: false };

    const { data: profile } = await withTimeout(
      supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle()
    );

    return {
      user: { id: user.id, email: user.email ?? "" },
      isAdmin: (profile as ProfileRow | null)?.role === "admin",
    };
  } catch (err) {
    console.error("Site layout session fetch threw:", err);
    return { user: null, isAdmin: false };
  }
}

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user, isAdmin } = await getSession();

  return (
    <div className="flex min-h-screen flex-col">
      <Marquee />
      <Header user={user} isAdmin={isAdmin} />
      <main className="flex-1">{children}</main>
      <Footer isAdmin={isAdmin} />
    </div>
  );
}