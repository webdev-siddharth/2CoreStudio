"use client";

import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { createClient } from "@/lib/supabase/client";
import { detectPlatform, PLATFORM_LABELS } from "@/lib/platform";

export type DownloadTarget = {
  platform: string;
  url: string;
  version?: string | null;
};

const noopSubscribe = () => () => {};

export default function DownloadButton({
  appId,
  requiresAuth,
  platforms,
  className = "",
}: {
  appId: string;
  requiresAuth: boolean;
  platforms: DownloadTarget[];
  className?: string;
}) {
  const router = useRouter();
  // Hydration-safe: server snapshot is "web", client re-renders with the
  // real platform right after hydration.
  const detected = useSyncExternalStore(
    noopSubscribe,
    () => detectPlatform(),
    () => "web"
  );
  const [busy, setBusy] = useState(false);

  // Match visitor platform → fall back to 'web' → else disable.
  const target =
    platforms.find((p) => p.platform === detected) ??
    platforms.find((p) => p.platform === "web") ??
    null;

  const isAndroid =
    target?.platform === "android" && /\.apk($|\?)/i.test(target.url);

  const otherPlatforms = platforms.filter((p) => p.platform !== target?.platform);

  const handleOtherPlatformClick = async (platform: DownloadTarget) => {
    if (busy) return;
    setBusy(true);
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (requiresAuth && !session) {
      const returnTo = encodeURIComponent(window.location.pathname);
      router.push(`/profile?returnTo=${returnTo}`);
      return;
    }

    try {
      await supabase.from("app_events").insert({
        app_id: appId,
        user_id: session?.user.id ?? null,
        platform: platform.platform,
        event: "download",
      });
    } catch {
      // logging must never block the actual download
    }

    window.location.assign(platform.url);
  };

  const handleClick = async () => {
    if (!target || busy) return;

    const supabase = createClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (requiresAuth && !session) {
      const returnTo = encodeURIComponent(window.location.pathname);
      router.push(`/profile?returnTo=${returnTo}`);
      return;
    }

    setBusy(true);
    try {
      await supabase.from("app_events").insert({
        app_id: appId,
        user_id: session?.user.id ?? null,
        platform: target.platform,
        event: "download",
      });
    } catch {
      // logging must never block the actual download
    }
    // Full navigation — external URLs (stores, APKs) don't route internally.
    window.location.assign(target.url);
  };

  const label = target
    ? requiresAuth
      ? "Sign in to download"
      : `Download for ${PLATFORM_LABELS[target.platform as keyof typeof PLATFORM_LABELS] ?? "this platform"}`
    : "";

  return (
    <span className="inline-flex flex-col items-start gap-2">
      {target ? (
        <button
          type="button"
          onClick={handleClick}
          disabled={busy}
          className={`nb-btn ${className}`}
        >
          {busy ? "Preparing…" : `${label} ↓`}
        </button>
      ) : (
        <button type="button" disabled className={`nb-btn nb-btn--disabled ${className}`}>
          Not available for your platform
        </button>
      )}
      {isAndroid && target && (
        <p className="max-w-xs font-mono text-[0.65rem] leading-relaxed text-muted">
          Sideload tip: allow &ldquo;Install unknown apps&rdquo; for your
          browser if this doesn&apos;t install from Google Play automatically.
        </p>
      )}
      {otherPlatforms.length > 0 && (
        <div className="mt-3 flex flex-col gap-1.5">
          {otherPlatforms.map((p) => (
            <button
              key={p.platform}
              type="button"
              onClick={() => handleOtherPlatformClick(p)}
              className="font-mono text-[0.65rem] font-bold text-muted hover:text-primary underline text-left"
            >
              Download Anyway in{" "}
              {PLATFORM_LABELS[p.platform as keyof typeof PLATFORM_LABELS]} →
            </button>
          ))}
        </div>
      )}
    </span>
  );
}
