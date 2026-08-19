import type { Metadata } from "next";
import { ProfileClient } from "@/components/profile/ProfileClient";
import { createClient } from "@/lib/supabase/server";
import {
  isUnconfiguredSupabase,
  withTimeout,
} from "@/lib/supabase/fetch-guard";
import type { ProfileRow } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Profile",
  description: "Sign in or create your 2coreStudio account.",
};

/** Local redirect only — never accept external URLs (open redirect guard). */
function sanitizeReturnTo(value: string | undefined): string {
  if (!value) return "/apps";
  if (!value.startsWith("/") || value.startsWith("//")) return "/apps";
  return value;
}

async function getSession() {
  if (isUnconfiguredSupabase()) return { user: null, profile: null };
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await withTimeout(supabase.auth.getUser());
    if (!user) return { user: null, profile: null };

    const { data: profile } = await withTimeout(
      supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle()
    );

    return {
      user: { id: user.id, email: user.email ?? "" },
      profile: (profile ?? null) as ProfileRow | null,
    };
  } catch (err) {
    console.error("Profile session fetch threw:", err);
    return { user: null, profile: null };
  }
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string; error?: string }>;
}) {
  const { returnTo, error } = await searchParams;
  const { user, profile } = await getSession();

  return (
    <div className="mx-auto max-w-md px-5 py-14">
      <h1 className="display text-3xl text-ink">PROFILE</h1>
      <p className="mt-2 mb-8 font-mono text-xs uppercase tracking-widest text-muted">
        {user ? "Your account" : "Sign in or create an account"}
      </p>

      {error && (
        <div className="mb-6 border-[3px] border-ink bg-surface p-4 shadow-[4px_4px_0_var(--ink)]">
          <p className="font-mono text-xs font-bold text-orange">
            Sign-in failed — try again or use a magic link.
          </p>
        </div>
      )}

      <ProfileClient
        user={user}
        profile={profile}
        returnTo={sanitizeReturnTo(returnTo)}
      />
    </div>
  );
}