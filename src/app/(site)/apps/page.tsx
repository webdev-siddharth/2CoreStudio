import { AppBrowser } from "@/app/(site)/apps/AppBrowser";
import { createClient } from "@/lib/supabase/server";
import {
  isUnconfiguredSupabase,
  withTimeout,
} from "@/lib/supabase/fetch-guard";
import type { AppRow } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getPublishedApps(): Promise<AppRow[]> {
  if (isUnconfiguredSupabase()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await withTimeout(
      supabase
        .from("apps")
        .select("*")
        .eq("is_published", true)
        .order("is_featured", { ascending: false })
        .order("featured_order", { ascending: true })
        .order("created_at", { ascending: false })
    );

    if (error) {
      console.error("Apps fetch failed:", error.message);
      return [];
    }
    return (data ?? []) as AppRow[];
  } catch (err) {
    console.error("Apps fetch threw:", err);
    return [];
  }
}

export default async function AppsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const { category, search } = await searchParams;
  const apps = await getPublishedApps();

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="display text-3xl text-ink">ALL SOFTWARE</h1>
      <p className="mt-2 mb-8 font-mono text-xs uppercase tracking-widest text-muted">
        Web · Windows · Mac · Android · iOS · Linux
      </p>
      <AppBrowser apps={apps} initialCategory={category} initialQuery={search} />
    </div>
  );
}
