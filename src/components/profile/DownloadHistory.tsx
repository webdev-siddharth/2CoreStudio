"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AppEventRow, AppRow } from "@/lib/types";

const PLATFORM_LABELS: Record<string, string> = {
  web: "Web",
  windows: "Windows",
  mac: "macOS",
  android: "Android",
  ios: "iOS",
  linux: "Linux",
};

type AppEventRaw = Omit<AppEventRow, "apps"> & {
  apps: Pick<AppRow, "title" | "slug">[] | null;
};

/**
 * Signed-in user's download history from app_events.
 * RLS only exposes the caller's own rows.
 */
export function DownloadHistory({ userId }: { userId: string }) {
  const [events, setEvents] = useState<AppEventRow[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await createClient()
          .from("app_events")
          .select(
            "id, app_id, user_id, event, platform, created_at, apps(title, slug)"
          )
          .eq("user_id", userId)
          .eq("event", "download")
          .order("created_at", { ascending: false })
          .limit(50);
        if (cancelled) return;
        if (error) setError(true);
        else
          setEvents(
            ((data ?? []) as AppEventRaw[]).map((row) => ({
              ...row,
              apps: row.apps?.[0] ?? null,
            }))
          );
      } catch {
        if (!cancelled) setError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return (
    <div id="downloads" className="mt-6 scroll-mt-6 border-t-[3px] border-dashed border-ink pt-5">
      <p className="display mb-3 text-sm text-ink">MY DOWNLOADS</p>

      {error && (
        <p className="font-mono text-[0.65rem] text-muted">
          Couldn&apos;t load download history.
        </p>
      )}

      {!error && events === null && (
        <p className="font-mono text-[0.65rem] text-muted">Loading…</p>
      )}

      {!error && events !== null && events.length === 0 && (
        <p className="font-mono text-[0.65rem] text-muted">
          No downloads yet — grab something from the catalog and it&apos;ll show
          up here.
        </p>
      )}

      {!error && events !== null && events.length > 0 && (
        <ul className="space-y-2">
          {events.map((event) => (
            <li
              key={event.id}
              className="flex flex-wrap items-center justify-between gap-2 border-2 border-ink bg-surface2 px-3 py-2"
            >
              {event.apps ? (
                <Link
                  href={`/apps/${event.apps.slug}`}
                  className="font-mono text-[0.7rem] font-bold text-ink no-underline hover:text-magenta"
                >
                  {event.apps.title}
                </Link>
              ) : (
                <span className="font-mono text-[0.7rem] text-muted">
                  Removed app
                </span>
              )}
              <span className="font-mono text-[0.65rem] text-muted">
                {event.platform
                  ? (PLATFORM_LABELS[event.platform] ?? event.platform)
                  : "—"}
                {" · "}
                {new Date(event.created_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}