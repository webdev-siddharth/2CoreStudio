"use client";

import Link from "next/link";
import { useState } from "react";
import {
  addPlatform,
  deleteApp,
  deletePlatform,
  togglePublish,
  updateApp,
} from "@/app/admin/apps/actions";
import { appStatus } from "@/lib/status";
import type { AppWithPlatforms, Platform } from "@/lib/types";

const CATEGORIES = ["Gaming", "Utility", "SaaS"];
const TIERS = ["instant", "account", "premium"];
const PLATFORMS: Platform[] = ["web", "windows", "mac", "android", "ios", "linux"];

function field(
  name: string,
  value: string | null | undefined,
  className = ""
) {
  return (
    <input
      name={name}
      defaultValue={value ?? ""}
      className={`nb-input w-full ${className}`}
    />
  );
}

function select(
  name: string,
  value: string,
  options: string[],
  className = ""
) {
  return (
    <select
      name={name}
      defaultValue={value}
      className={`nb-input w-full ${className}`}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function check(name: string, checked: boolean, label: string) {
  return (
    <label className="flex cursor-pointer items-center gap-2 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-ink">
      <input
        type="checkbox"
        name={name}
        defaultChecked={checked}
        className="h-4 w-4 accent-[var(--magenta)]"
      />
      {label}
    </label>
  );
}

function ErrorNote({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <p className="mt-3 border-2 border-ink bg-surface2 px-3 py-2 font-mono text-xs text-orange">
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

export function AppEditForm({ app }: { app: AppWithPlatforms }) {
  const [error, setError] = useState<string | null>(null);
  const status = appStatus(app);

  const run = async (action: (fd: FormData) => Promise<void>, fd: FormData) => {
    try {
      setError(null);
      await action(fd);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Link
        href="/admin/apps"
        className="py-1 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-ink no-underline hover:text-magenta md:py-0"
      >
        ← Back to apps
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="display text-2xl text-ink">EDIT APP</h1>
        <span className={`nb-status ${status.className}`}>{status.label}</span>
      </div>
      <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted">
        {app.title} · last edit {formatDate(app.updated_at)}
      </p>

      <ErrorNote error={error} />

      <form
        action={(fd) => run(updateApp, fd)}
        className="nb-card mt-6 grid gap-3 sm:grid-cols-2"
      >
        <input type="hidden" name="id" value={app.id} />
        <label className="block">
          <span className="field-label">Title *</span>
          {field("title", app.title)}
        </label>
        <label className="block">
          <span className="field-label">Slug *</span>
          {field("slug", app.slug)}
        </label>
        <label className="block sm:col-span-2">
          <span className="field-label">Description</span>
          <textarea
            name="description"
            defaultValue={app.description ?? ""}
            className="nb-input w-full"
            rows={2}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="field-label">
            Detailed body (\n = paragraph)
          </span>
          <textarea
            name="detailed_body"
            defaultValue={app.detailed_body ?? ""}
            className="nb-input w-full"
            rows={4}
          />
        </label>
        <label className="block">
          <span className="field-label">Category</span>
          {select("category", app.category, CATEGORIES)}
        </label>
        <label className="block">
          <span className="field-label">Access tier</span>
          {select("access_tier", app.access_tier, TIERS)}
        </label>
        <label className="block">
          <span className="field-label">Banner URL</span>
          {field("banner_url", app.banner_url)}
        </label>
        <label className="block">
          <span className="field-label">Thumbnail URL</span>
          {field("thumbnail_url", app.thumbnail_url)}
        </label>
        <label className="block">
          <span className="field-label">YouTube embed id</span>
          {field("youtube_embed_id", app.youtube_embed_id)}
        </label>
        <label className="block">
          <span className="field-label">Product SKU</span>
          {field("product_sku", app.product_sku)}
        </label>
        <label className="block">
          <span className="field-label">Featured order</span>
          <input
            type="number"
            name="featured_order"
            defaultValue={app.featured_order}
            className="nb-input w-full"
          />
        </label>
        <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
          {check("is_published", app.is_published, "Published")}
          {check("requires_auth", app.requires_auth, "Requires account")}
          {check("is_featured", app.is_featured, "Featured (hero)")}
          {check("is_premium", app.is_premium, "Premium")}
        </div>
        <button type="submit" className="nb-btn sm:col-span-2">
          Save changes
        </button>
      </form>

      <div className="nb-card mt-6 flex flex-wrap items-center gap-3">
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
            Delete app
          </button>
        </form>
      </div>

      <div className="nb-card mt-6">
        <p className="mb-3 font-mono text-[0.65rem] font-bold uppercase tracking-wider text-muted">
          Platforms ({app.app_platforms.length})
        </p>
        <ul className="space-y-2">
          {app.app_platforms.map((platform) => (
            <li
              key={platform.id}
              className="flex flex-wrap items-center gap-3 border-2 border-ink bg-surface2 px-3 py-2"
            >
              <span className="nb-tag nb-tag--b">{platform.platform}</span>
              <span className="min-w-0 flex-1 truncate font-mono text-[0.7rem] text-ink">
                {platform.url}
              </span>
              {platform.version && (
                <span className="font-mono text-[0.65rem] text-muted">
                  v{platform.version}
                </span>
              )}
              {platform.changelog && (
                <span className="hidden max-w-[180px] truncate font-mono text-[0.65rem] text-muted sm:inline">
                  {platform.changelog}
                </span>
              )}
              <form
                action={(fd) => {
                  if (window.confirm("Delete this platform entry?"))
                    run(deletePlatform, fd);
                }}
              >
                <input type="hidden" name="id" value={platform.id} />
                <button type="submit" className="nb-chip">
                  ✕
                </button>
              </form>
            </li>
          ))}
        </ul>

        <form
          action={(fd) => run(addPlatform, fd)}
          className="mt-3 grid gap-2 sm:grid-cols-[130px_1fr_110px_110px_auto]"
        >
          <input type="hidden" name="app_id" value={app.id} />
          <select
            name="platform"
            className="nb-input w-full"
            defaultValue="web"
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <input
            name="url"
            placeholder="https://… (required)"
            className="nb-input w-full"
          />
          <input
            name="version"
            placeholder="v1.0.0"
            className="nb-input w-full"
          />
          <input
            name="changelog"
            placeholder="changelog"
            className="nb-input w-full"
          />
          <button type="submit" className="nb-btn nb-btn--secondary">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}