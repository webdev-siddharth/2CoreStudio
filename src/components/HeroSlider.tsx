"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AppRow } from "@/lib/types";

const SLIDE_INTERVAL_MS = 6000;

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function logView(appId: string) {
  try {
    createClient()
      .from("app_events")
      .insert({ app_id: appId, platform: null, event: "view" })
      .then(({ error }) => {
        if (error) console.warn("view event insert failed:", error.message);
      });
  } catch {
    // analytics must never break the hero
  }
}

export default function HeroSlider({ apps }: { apps: AppRow[] }) {
  const [index, setIndex] = useState(0);
  // Hydration-safe media query: server snapshot is false, client updates
  // after hydration and reacts to runtime changes.
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
  const [paused, setPaused] = useState(false);
  const loggedRef = useRef<Set<string>>(new Set());

  const canSlide = apps.length > 1;
  const autoplay = canSlide && !reducedMotion;

  const next = useCallback(
    () => setIndex((i) => (i + 1) % apps.length),
    [apps.length]
  );
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + apps.length) % apps.length),
    [apps.length]
  );

  // View analytics — one insert per app per page session.
  const current = apps[index];
  useEffect(() => {
    if (!current) return;
    if (loggedRef.current.has(current.id)) return;
    loggedRef.current.add(current.id);
    logView(current.id);
  }, [current]);

  // Auto-advance with pause on hover/touch and hidden tabs.
  useEffect(() => {
    if (!autoplay || paused) return;
    const id = setInterval(next, SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [autoplay, paused, next]);

  useEffect(() => {
    if (!autoplay) return;
    const onVisibility = () => {
      if (document.hidden) setPaused(true);
      else setPaused(false);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [autoplay]);

  const slides = useMemo(() => apps, [apps]);

  /* ---- zero featured apps → static brand hero ---- */
  if (slides.length === 0) {
    return (
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
        <div className="relative z-10 mx-auto max-w-3xl px-6 pb-20 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            Every platform. One studio.
          </p>
          <h1 className="display mt-4 text-5xl text-text sm:text-7xl">
            2CORE<span className="text-primary">STUDIO</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-mono text-sm leading-relaxed text-text">
            Multi-platform apps for web, Windows, Mac, Android, iOS and Linux —
            built with speed, shipped with soul.
          </p>
          <Link href="/apps" className="nb-btn mt-8">
            Browse software →
          </Link>
        </div>
      </section>
    );
  }

  /* ---- exactly one featured app → static hero, no chrome ---- */
  if (!canSlide) {
    const app = slides[0];
    return (
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
        {app.banner_url && (
          <div
            aria-hidden
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${app.banner_url})` }}
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/20"
        />
        <div className="relative z-10 mx-auto max-w-3xl px-6 pb-24 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            Featured app
          </p>
          <h1 className="display mt-4 text-5xl text-text sm:text-7xl">
            {app.title}
          </h1>
          {app.description && (
            <p className="mx-auto mt-6 max-w-xl font-mono text-sm leading-relaxed text-text">
              {app.description}
            </p>
          )}
          <Link href={`/apps/${app.slug}`} className="nb-btn mt-8">
            View app →
          </Link>
        </div>
      </section>
    );
  }

  /* ---- multi-app slider ---- */
  return (
    <section
      className="relative flex h-[100svh] overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Featured apps"
    >
      {slides.map((app, i) => (
        <div
          key={app.id}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-transform duration-700 ${
            reducedMotion ? "" : "ease-out"
          }`}
          style={{ transform: `translateX(${(i - index) * 100}%)` }}
        >
          {app.banner_url && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${app.banner_url})` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/20" />
          <div className="absolute inset-0 flex items-center">
            <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-28">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
                Featured — {app.category}
              </p>
              <h2 className="display mt-3 max-w-2xl text-4xl text-text sm:text-6xl">
                {app.title}
              </h2>
              {app.description && (
                <p className="mt-4 max-w-xl font-mono text-sm leading-relaxed text-text">
                  {app.description}
                </p>
              )}
              <Link href={`/apps/${app.slug}`} className="nb-btn mt-7">
                View app →
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* arrows */}
      <div className="absolute inset-y-0 left-4 z-20 flex items-center">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous app"
          className="cursor-pointer border-[3px] border-ink bg-surface px-3 py-2 font-mono text-sm font-bold text-text shadow-[4px_4px_0_var(--ink)] transition-transform duration-75 active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          ←
        </button>
      </div>
      <div className="absolute inset-y-0 right-4 z-20 flex items-center">
        <button
          type="button"
          onClick={next}
          aria-label="Next app"
          className="cursor-pointer border-[3px] border-ink bg-surface px-3 py-2 font-mono text-sm font-bold text-text shadow-[4px_4px_0_var(--ink)] transition-transform duration-75 active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          →
        </button>
      </div>

      {/* dots */}
      <div className="absolute bottom-24 z-20 flex w-full justify-center gap-3">
        {slides.map((app, i) => (
          <button
            key={app.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}: ${app.title}`}
            aria-current={i === index}
            className={`grid h-8 w-8 cursor-pointer place-items-center bg-transparent p-0 md:block md:h-3 md:w-3 md:border-[3px] md:border-ink md:shadow-[2px_2px_0_var(--ink)] md:transition-colors ${
              i === index ? "md:bg-primary" : "md:bg-surface"
            }`}
          >
            <span
              className={`block h-3 w-3 border-[3px] border-ink shadow-[2px_2px_0_var(--ink)] transition-colors md:hidden ${
                i === index ? "bg-primary" : "bg-surface"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
