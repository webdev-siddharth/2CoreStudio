import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import DownloadButton from "@/components/DownloadButton";
import { MarkdownBody } from "@/components/news/MarkdownBody";
import { ViewTracker } from "@/components/ViewTracker";
import { ACCESS_TIER_LABELS } from "@/components/AppCard";
import { PLATFORM_LABELS } from "@/lib/platform";
import { createClient } from "@/lib/supabase/server";
import {
  isUnconfiguredSupabase,
  withTimeout,
} from "@/lib/supabase/fetch-guard";
import type { AppWithPlatforms, Platform } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getApp(slug: string): Promise<AppWithPlatforms | null> {
  if (isUnconfiguredSupabase()) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await withTimeout(
      supabase
        .from("apps")
        .select("*, app_platforms(*)")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle()
    );

    if (error) {
      console.error("App fetch failed:", error.message);
      return null;
    }
    return (data ?? null) as AppWithPlatforms | null;
  } catch (err) {
    console.error("App fetch threw:", err);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const app = await getApp(slug);
  if (!app) return { title: "App not found" };

  return {
    title: app.title,
    description: app.description ?? undefined,
    openGraph: {
      title: app.title,
      description: app.description ?? undefined,
      images: app.banner_url ? [app.banner_url] : undefined,
    },
  };
}

export default async function AppDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const app = await getApp(slug);

  if (!app) notFound();

  return (
    <article>
      <ViewTracker appId={app.id} />

      {/* Banner */}
      <section className="relative overflow-hidden border-b-[3px] border-ink">
        {app.banner_url && (
          <div
            aria-hidden
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${app.banner_url})` }}
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-bg via-bg/75 to-bg/25"
        />
        <div className="relative z-10 mx-auto max-w-6xl px-5 pb-16 pt-24 sm:pt-32">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            {app.category}
          </p>
          <h1 className="display mt-3 text-4xl text-text sm:text-6xl">
            {app.title}
          </h1>
          {app.description && (
            <p className="mt-5 max-w-2xl font-mono text-sm leading-relaxed text-text">
              {app.description}
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-2.5">
            <span className="nb-tag nb-tag--a">{app.category}</span>
            <span className="nb-tag nb-tag--b">
              {ACCESS_TIER_LABELS[app.access_tier] ?? app.access_tier}
            </span>
            {app.is_premium && <span className="nb-tag nb-tag--a">Premium</span>}
          </div>
          {app.thumbnail_url && (
            <Image
              src={app.thumbnail_url}
              alt={`${app.title} thumbnail`}
              width={64}
              height={64}
              className="mt-6 h-16 w-16 border-[3px] border-ink object-cover shadow-[4px_4px_0_var(--ink)]"
              unoptimized
            />
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[1fr_340px]">
        {/* Body */}
        <div>
          {app.detailed_body && (
            <MarkdownBody content={app.detailed_body} />
          )}

          {app.youtube_embed_id && (
            <div className="mt-10 border-[3px] border-ink bg-surface p-2 shadow-[6px_6px_0_var(--ink)]">
              <div className="relative aspect-video">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube.com/embed/${app.youtube_embed_id}`}
                  title={`${app.title} trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:pt-2">
          <div className="nb-card">
            <h2 className="display mb-4 text-lg text-text">AVAILABLE ON</h2>
            {app.app_platforms.length === 0 ? (
              <p className="font-mono text-xs text-muted">
                Builds for this app are being prepared. Check back soon.
              </p>
            ) : (
              <ul className="divide-y-[3px] divide-ink border-[3px] border-ink bg-surface shadow-[6px_6px_0_var(--ink)]">
                {app.app_platforms.map((platform) => (
                  <li
                    key={platform.id}
                    className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
                  >
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-text">
                      {PLATFORM_LABELS[platform.platform as Platform] ??
                        platform.platform}
                    </span>
                    <span className="font-mono text-[0.7rem] text-muted">
                      {platform.version
                        ? `v${platform.version}`
                        : "latest"}
                      {platform.released_at &&
                        ` · ${new Date(platform.released_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="nb-card mt-4">
            <h2 className="display mb-4 text-base text-text">GET THE APP</h2>
            <DownloadButton
              appId={app.id}
              requiresAuth={app.requires_auth}
              platforms={app.app_platforms.map((p) => ({
                platform: p.platform,
                url: p.url,
                version: p.version ?? undefined,
              }))}
            />
            {app.requires_auth && (
              <p className="mt-3 font-mono text-[0.65rem] leading-relaxed text-muted">
                This app needs an account. You&apos;ll sign in after choosing your
                platform.
              </p>
            )}
            {app.github_url && (
              <a
                href={app.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block font-mono text-[0.65rem] font-bold text-muted hover:text-primary underline"
              >
                See all releases →
              </a>
            )}
            <Link
              href="/apps"
              className="mt-5 inline-block py-1 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-text no-underline hover:text-primary md:py-0"
            >
              ← Back to catalog
            </Link>
          </div>

          {app.app_platforms.some((p) => p.changelog) && (
            <div className="nb-card mt-4">
              <h2 className="display mb-3 text-base text-text">WHAT&apos;S NEW</h2>
              <ul className="space-y-2">
                {app.app_platforms
                  .filter((p) => p.changelog)
                  .map((platform) => (
                    <li
                      key={platform.id}
                      className="border-2 border-ink bg-surface2 px-3 py-2"
                    >
                      <span className="nb-tag nb-tag--b">
                        {PLATFORM_LABELS[platform.platform as Platform] ??
                          platform.platform}
                      </span>
                      {platform.version && (
                        <span className="ml-2 font-mono text-[0.65rem] text-muted">
                          v{platform.version}
                        </span>
                      )}
                      <div className="mt-1 font-mono text-[0.7rem] leading-relaxed text-text">
                        <MarkdownBody content={platform.changelog ?? ""} />
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </aside>
      </section>
    </article>
  );
}
