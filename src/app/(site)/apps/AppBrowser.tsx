"use client";

import { useMemo, useState } from "react";
import { AppCard } from "@/components/AppCard";
import type { AppRow } from "@/lib/types";

const CATEGORIES = ["All", "Gaming", "Utility", "SaaS"] as const;
const TIERS = [
  { value: "all", label: "All" },
  { value: "instant", label: "Instant play" },
  { value: "account", label: "Account required" },
  { value: "premium", label: "Premium" },
] as const;

type TierValue = (typeof TIERS)[number]["value"];

export function AppBrowser({
  apps,
  initialCategory,
  initialQuery,
}: {
  apps: AppRow[];
  initialCategory?: string;
  initialQuery?: string;
}) {
  const [category, setCategory] = useState<string>(
    initialCategory && CATEGORIES.includes(initialCategory as (typeof CATEGORIES)[number])
      ? initialCategory
      : "All"
  );
  const [tier, setTier] = useState<TierValue>("all");
  const [query, setQuery] = useState(initialQuery ?? "");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apps.filter((app) => {
      if (category !== "All" && app.category !== category) return false;
      if (tier === "instant" && app.access_tier !== "instant") return false;
      if (tier === "account" && app.access_tier !== "account") return false;
      if (tier === "premium" && app.access_tier !== "premium" && !app.is_premium)
        return false;
      if (q) {
        const haystack = `${app.title} ${app.description ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [apps, category, tier, query]);

  const hasActiveFilters = category !== "All" || tier !== "all" || query !== "";

  return (
    <div>
      <div className="chips mb-5 flex flex-wrap gap-2.5">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`nb-chip ${category === c ? "nb-chip--on" : ""}`}
            aria-pressed={category === c}
          >
            {c}
          </button>
        ))}
        <span aria-hidden className="mx-1 self-center text-muted">
          |
        </span>
        {TIERS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTier(t.value)}
            className={`nb-chip ${tier === t.value ? "nb-chip--on" : ""}`}
            aria-pressed={tier === t.value}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SEARCH SOFTWARE…"
          aria-label="Search software"
          className="nb-input min-w-[220px] flex-1 sm:max-w-xs"
        />
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              setCategory("All");
              setTier("all");
              setQuery("");
            }}
            className="nb-chip"
          >
            Clear filters ✕
          </button>
        )}
        <span className="ml-auto font-mono text-[0.65rem] uppercase tracking-wider text-muted">
          {filtered.length} {filtered.length === 1 ? "app" : "apps"}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="nb-card py-16 text-center">
          <p className="display text-lg text-text">NOTHING FOUND</p>
          <p className="mt-3 font-mono text-xs text-muted">
            No apps match the current filters. Try widening the search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}
