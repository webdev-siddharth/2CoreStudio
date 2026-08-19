import { Suspense } from "react";
import HeroSlider from "@/components/HeroSlider";
import { HomeStats } from "@/components/home/HomeStats";
import { HomeBenefits } from "@/components/home/HomeBenefits";
import { HomeFaq } from "@/components/home/HomeFaq";
import { HomeNewsTeaser } from "@/components/home/HomeNewsTeaser";
import { HomeCtaBand } from "@/components/home/HomeCtaBand";
import { createClient } from "@/lib/supabase/server";
import {
  isUnconfiguredSupabase,
  withTimeout,
} from "@/lib/supabase/fetch-guard";
import type { AppRow } from "@/lib/types";

// Session-aware (server client uses cookies()) → always render at request
// time so publish/unpublish shows immediately.
export const dynamic = "force-dynamic";

async function getFeaturedApps(): Promise<AppRow[]> {
  if (isUnconfiguredSupabase()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await withTimeout(
      supabase
        .from("apps")
        .select("*")
        .eq("is_published", true)
        .eq("is_featured", true)
        .order("featured_order", { ascending: true })
        .order("created_at", { ascending: true })
    );

    if (error) {
      console.error("Featured apps fetch failed:", error.message);
      return [];
    }
    return (data ?? []) as AppRow[];
  } catch (err) {
    // Supabase unreachable/timed out — fall back to the static brand hero
    // instead of crashing the homepage.
    console.error("Featured apps fetch threw:", err);
    return [];
  }
}

function HomeSkeleton() {
  return (
    <section className="relative flex min-h-svh items-center justify-center overflow-hidden bg-surface">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
        Loading…
      </p>
    </section>
  );
}

export default async function HomePage() {
  const apps = await getFeaturedApps();
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HeroSlider apps={apps} />
      <HomeCtaBand />
      <HomeStats />
      <HomeBenefits />
      <HomeNewsTeaser />
      <HomeFaq />
    </Suspense>
  );
}