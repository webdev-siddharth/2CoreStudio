"use client";

import Link from "next/link";
import { useState } from "react";
import { deleteApp, togglePublish } from "@/app/admin/apps/actions";
import { appStatus } from "@/lib/status";
import type { AppPlatformRow, AppWithPlatforms } from "@/lib/types";

function ErrorNote({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <p className="mt-3 border-2 border-ink bg-surface2 px-3 py-2 font-mono text-xs text-secondary">
      {error}
    </p>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function latestVersion(platforms: AppPlatformRow[]): string | null {
  if (platforms.length === 0) return null;
  const newest = [...platforms].sort((a, b) => {
    const at = new Date(a.released_at ?? a.created_at).getTime();
    const bt = new Date(b.released_at ?? b.created_at).getTime();
    return bt - at;
  })[0];
  return newest.version ?? null;
}

export function AdminAppsTable({ apps }: { apps: AppWithPlatforms[] }) {
  const [error, setError] = useState<string | null>(null);

  const run = async (action: (fd: FormData) => Promise<void>, fd: FormData) => {
    try {
      setError(null);
      await action(fd);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    }
  };

  return (
    <div>
      <ErrorNote error={error} />

      <div className="mb-6">
        <Link href="/admin/apps/new" className="nb-btn nb-btn--secondary">
          + New app
        </Link>
      </div>

      {apps.length === 0 ? (
        <div className="nb-card">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            No apps yet — create your first one.
          </p>
        </div>
      ) : (
        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {apps.map((app) => {
            const status = appStatus(app);
            const version = latestVersion(app.app_platforms);
            return (
              <li key={app.id} className="nb-card flex flex-col gap-3">
                <div className="flex flex-wrap items-start gap-2">
                  <p className="display min-w-0 flex-1 text-base text-text">
                    {app.title}
                  </p>
                  <span className={`nb-status ${status.className}`}>
                    {status.label}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="nb-tag nb-tag--a">{app.category}</span>
                  <span className="nb-tag nb-tag--b">{app.access_tier}</span>
                  {app.is_featured && (
                    <span className="nb-tag nb-tag--a">Featured</span>
                  )}
                  {app.is_premium && (
                    <span className="nb-tag nb-tag--b">Premium</span>
                  )}
                </div>

                <dl className="space-y-1.5 font-mono text-[0.68rem] text-muted">
                  <div className="flex justify-between gap-3">
                    <dt className="uppercase tracking-wider">Version</dt>
                    <dd className="text-text">
                      {version ? `v${version}` : "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="uppercase tracking-wider">Platforms</dt>
                    <dd className="text-text">
                      {app.app_platforms.length}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="uppercase tracking-wider">Last edit</dt>
                    <dd className="text-text">
                      {formatDate(app.updated_at)}
                    </dd>
                  </div>
                </dl>

                <div className="mt-auto flex flex-wrap gap-2 border-t-[3px] border-dashed border-ink pt-3">
                  <form
                    action={(fd) => run(togglePublish, fd)}
                    className="inline"
                  >
                    <input type="hidden" name="id" value={app.id} />
                    <input
                      type="hidden"
                      name="is_published"
                      value={String(app.is_published)}
                    />
                    <button type="submit" className="nb-chip">
                      {app.is_published ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                  <Link href={`/admin/apps/${app.id}`} className="nb-chip no-underline">
                    Edit
                  </Link>
                  <form
                    action={(fd) => {
                      if (
                        window.confirm(
                          `Delete "${app.title}"? Platforms and events cascade.`
                        )
                      )
                        run(deleteApp, fd);
                    }}
                    className="inline"
                  >
                    <input type="hidden" name="id" value={app.id} />
                    <button type="submit" className="nb-chip">
                      Delete
                    </button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}