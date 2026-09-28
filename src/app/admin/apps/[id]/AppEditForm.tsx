"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { MarkdownBody } from "@/components/news/MarkdownBody";
import {
  addPlatform,
  checkSlugUnique,
  deleteApp,
  deletePlatform,
  togglePublish,
  updateApp,
  updatePlatform,
} from "@/app/admin/apps/actions";
import { actionErrorMessage } from "@/lib/action-error";
import { generateSlug } from "@/lib/slug";
import { appStatus } from "@/lib/status";
import type { AppPlatformRow, AppWithPlatforms, Platform } from "@/lib/types";

const CATEGORIES = ["Gaming", "Utility", "SaaS"];
const TIERS = ["instant", "account", "premium"];
const PLATFORMS: Platform[] = ["web", "windows", "mac", "android", "ios", "linux"];

function ErrorNote({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <p className="mt-3 border-2 border-ink bg-surface2 px-3 py-2 font-mono text-xs text-red">
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

function restoreFormValues(form: HTMLFormElement, data: FormData) {
  const apply = () => {
    for (const el of Array.from(form.elements)) {
      if (el instanceof HTMLInputElement) {
        if (el.type === "checkbox") {
          el.checked = data.has(el.name);
        } else if (el.type === "radio") {
          el.checked = data.get(el.name) === el.value;
        } else if (el.name) {
          const value = data.get(el.name);
          if (typeof value === "string") el.value = value;
        }
      } else if (
        (el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) &&
        el.name
      ) {
        const value = data.get(el.name);
        if (typeof value === "string") el.value = value;
      }
    }
  };
  apply();
  // React resets the form around the action; re-apply once more after that commit.
  setTimeout(apply, 0);
}

type RunOptions = {
  setError?: (msg: string | null) => void;
  form?: HTMLFormElement | null;
};

export function AppEditForm({ app }: { app: AppWithPlatforms }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(true);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [bodyContent, setBodyContent] = useState(app.detailed_body ?? "");
  const [thumbnailPreview, setThumbnailPreview] = useState(app.thumbnail_url ?? "");
  const [bannerPreview, setBannerPreview] = useState(app.banner_url ?? "");
  const [changelogTab, setChangelogTab] = useState<"write" | "preview">("write");
  const [changelogContent, setChangelogContent] = useState("");
  const [platformError, setPlatformError] = useState<string | null>(null);
  const [addPlatformValue, setAddPlatformValue] = useState<Platform>(
    PLATFORMS.find((p) => !app.app_platforms.some((row) => row.platform === p)) ?? "web"
  );
  const [addUrl, setAddUrl] = useState("");
  const [addVersion, setAddVersion] = useState("");
  const [addReleasedAt, setAddReleasedAt] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRow, setEditRow] = useState({
    platform: "web" as Platform,
    url: "",
    version: "",
    releasedAt: "",
    changelog: "",
  });
  const slugRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const appFormRef = useRef<HTMLFormElement>(null);
  const status = appStatus(app);
  const usedPlatforms = new Set(app.app_platforms.map((row) => row.platform));

  const run = async (
    action: (fd: FormData) => Promise<string | null>,
    fd: FormData,
    successMsg?: string,
    options: RunOptions = {}
  ): Promise<boolean> => {
    const setErr = options.setError ?? setError;
    try {
      setErr(null);
      setSubmitting(true);

      if (fd.get("slug") != null) {
        const title = (fd.get("title") as string)?.trim();
        const slug = (fd.get("slug") as string)?.trim();

        if (!title) throw new Error("Title is required.");
        if (!slug) throw new Error("Slug is required.");
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
          throw new Error("Slug must be lowercase alphanumeric with hyphens only.");

        const unique = await checkSlugUnique(slug, app.id);
        if (!unique) throw new Error("A post/app with this slug already exists.");
      }

      const failure = await action(fd);
      if (failure) {
        setErr(failure);
        toast.error(failure);
        if (options.form) restoreFormValues(options.form, fd);
        return false;
      }
      if (successMsg) toast.success(successMsg);
      return true;
    } catch (err) {
      const msg = actionErrorMessage(err);
      setErr(msg);
      toast.error(msg);
      if (options.form) restoreFormValues(options.form, fd);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (row: AppPlatformRow) => {
    setPlatformError(null);
    setEditingId(row.id);
    setEditRow({
      platform: row.platform,
      url: row.url,
      version: row.version ?? "",
      releasedAt: row.released_at ? row.released_at.slice(0, 10) : "",
      changelog: row.changelog ?? "",
    });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!slugManuallyEdited && slugRef.current) {
      slugRef.current.value = generateSlug(e.target.value);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Link
        href="/admin/apps"
        className="py-1 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-text no-underline hover:text-primary md:py-0"
      >
        ← Back to apps
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="display text-2xl text-text">EDIT APP</h1>
        <span className={`nb-status ${status.className}`}>{status.label}</span>
      </div>
      <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted">
        {app.title} · last edit {formatDate(app.updated_at)}
      </p>

      <ErrorNote error={error} />

      <form
        ref={appFormRef}
        action={async (fd) => {
          await run(updateApp, fd, "App saved", { form: appFormRef.current });
        }}
        className="nb-card mt-6 grid gap-3 sm:grid-cols-2"
      >
        <input type="hidden" name="id" value={app.id} />
        <label className="block">
          <span className="field-label">Title *</span>
          <input
            ref={titleRef}
            name="title"
            defaultValue={app.title}
            onChange={handleTitleChange}
            className="nb-input w-full"
          />
        </label>
        <label className="block">
          <span className="field-label">Slug *</span>
          <input
            ref={slugRef}
            name="slug"
            defaultValue={app.slug}
            onChange={() => setSlugManuallyEdited(true)}
            className="nb-input w-full"
          />
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

        <div className="block sm:col-span-2">
          <span className="field-label">Detailed body (Markdown supported)</span>
          <div className="mt-1 flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("write")}
              className={`nb-chip ${activeTab === "write" ? "nb-chip--on" : ""}`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`nb-chip ${activeTab === "preview" ? "nb-chip--on" : ""}`}
            >
              Preview
            </button>
          </div>
          <textarea
            name="detailed_body"
            value={bodyContent}
            onChange={(e) => setBodyContent(e.target.value)}
            className={`nb-input mt-2 w-full ${activeTab === "write" ? "" : "hidden"}`}
            rows={6}
          />
          {activeTab === "preview" && (
            <div className="nb-input mt-2 min-h-[156px] overflow-auto p-4">
              {bodyContent ? (
                <MarkdownBody content={bodyContent} />
              ) : (
                <p className="font-mono text-xs text-muted">Nothing to preview.</p>
              )}
            </div>
          )}
        </div>

        <label className="block">
          <span className="field-label">Category</span>
          <select name="category" defaultValue={app.category} className="nb-input w-full">
            {CATEGORIES.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="field-label">Access tier</span>
          <select name="access_tier" defaultValue={app.access_tier} className="nb-input w-full">
            {TIERS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="field-label">Banner URL</span>
          <input
            name="banner_url"
            defaultValue={app.banner_url ?? ""}
            onChange={(e) => setBannerPreview(e.target.value)}
            className="nb-input w-full"
          />
          {bannerPreview && (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview of a user-typed URL; any host is allowed
            <img
              src={bannerPreview}
              alt="Banner preview"
              className="mt-2 w-full border-[3px] border-ink object-cover"
              onError={() => setBannerPreview("")}
            />
          )}
        </label>
        <label className="block">
          <span className="field-label">Thumbnail URL</span>
          <input
            name="thumbnail_url"
            defaultValue={app.thumbnail_url ?? ""}
            onChange={(e) => setThumbnailPreview(e.target.value)}
            className="nb-input w-full"
          />
          {thumbnailPreview && (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview of a user-typed URL; any host is allowed
            <img
              src={thumbnailPreview}
              alt="Thumbnail preview"
              className="mt-2 max-h-32 border-[3px] border-ink object-cover"
              onError={() => setThumbnailPreview("")}
            />
          )}
        </label>

        <label className="block">
          <span className="field-label">YouTube embed id</span>
          <input
            name="youtube_embed_id"
            defaultValue={app.youtube_embed_id ?? ""}
            className="nb-input w-full"
          />
        </label>
        <label className="block">
          <span className="field-label">Product SKU</span>
          <input
            name="product_sku"
            defaultValue={app.product_sku ?? ""}
            className="nb-input w-full"
          />
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
        <label className="block sm:col-span-2">
          <span className="field-label">GitHub URL (optional, for older releases)</span>
          <input
            name="github_url"
            defaultValue={app.github_url ?? ""}
            placeholder="https://github.com/..."
            className="nb-input w-full"
          />
        </label>

        <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
          <label className="flex cursor-pointer items-center gap-2 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-text">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={app.is_published}
              className="h-4 w-4 accent-[var(--primary)]"
            />
            Published
          </label>
          <label className="flex cursor-pointer items-center gap-2 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-text">
            <input
              type="checkbox"
              name="requires_auth"
              defaultChecked={app.requires_auth}
              className="h-4 w-4 accent-[var(--primary)]"
            />
            Requires account
          </label>
          <label className="flex cursor-pointer items-center gap-2 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-text">
            <input
              type="checkbox"
              name="is_featured"
              defaultChecked={app.is_featured}
              className="h-4 w-4 accent-[var(--primary)]"
            />
            Featured (hero)
          </label>
          <label className="flex cursor-pointer items-center gap-2 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-text">
            <input
              type="checkbox"
              name="is_premium"
              defaultChecked={app.is_premium}
              className="h-4 w-4 accent-[var(--primary)]"
            />
            Premium
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="nb-btn sm:col-span-2 disabled:opacity-50"
        >
          {submitting ? "SAVING…" : "Save changes"}
        </button>
      </form>

      <div className="nb-card mt-6 flex flex-wrap items-center gap-3">
        <form
          action={async (fd) => {
            await run(
              togglePublish,
              fd,
              app.is_published ? "App unpublished" : "App published"
            );
          }}
          className="inline"
        >
          <input type="hidden" name="id" value={app.id} />
          <input
            type="hidden"
            name="is_published"
            value={String(app.is_published)}
          />
          <button
            type="submit"
            disabled={submitting}
            className="nb-chip disabled:opacity-50"
          >
            {app.is_published ? "Unpublish" : "Publish"}
          </button>
        </form>
        <form
          action={(fd) => {
            if (
              window.confirm(
                `Delete "${app.title}"? Platforms and events cascade.`
              )
            ) {
              run(deleteApp, fd, "App deleted").then((ok) => {
                if (ok) router.push("/admin/apps");
              });
            }
          }}
          className="inline"
        >
          <input type="hidden" name="id" value={app.id} />
          <button
            type="submit"
            disabled={submitting}
            className="nb-chip disabled:opacity-50"
          >
            Delete app
          </button>
        </form>
      </div>

      <div className="nb-card mt-6">
        <p className="mb-3 font-mono text-[0.65rem] font-bold uppercase tracking-wider text-muted">
          Platforms ({app.app_platforms.length})
        </p>
        <ErrorNote error={platformError} />
        <ul className="space-y-2">
          {app.app_platforms.map((platform) => (
            <li
              key={platform.id}
              className={
                editingId === platform.id
                  ? "border-2 border-ink bg-surface2 px-3 py-2"
                  : "flex flex-wrap items-center gap-3 border-2 border-ink bg-surface2 px-3 py-2"
              }
            >
              {editingId === platform.id ? (
                <form
                  action={async (fd) => {
                    const ok = await run(
                      updatePlatform,
                      fd,
                      "Platform updated",
                      { setError: setPlatformError }
                    );
                    if (ok) setEditingId(null);
                  }}
                  className="grid gap-2"
                >
                  <input type="hidden" name="id" value={platform.id} />
                  <div className="grid gap-2 sm:grid-cols-[130px_1fr_110px_130px]">
                    <select
                      name="platform"
                      value={editRow.platform}
                      onChange={(e) =>
                        setEditRow({
                          ...editRow,
                          platform: e.target.value as Platform,
                        })
                      }
                      className="nb-input w-full"
                    >
                      {PLATFORMS.map((p) => (
                        <option
                          key={p}
                          value={p}
                          disabled={p !== platform.platform && usedPlatforms.has(p)}
                        >
                          {p}
                        </option>
                      ))}
                    </select>
                    <input
                      name="url"
                      value={editRow.url}
                      onChange={(e) => setEditRow({ ...editRow, url: e.target.value })}
                      placeholder="https://… (required)"
                      className="nb-input w-full"
                    />
                    <input
                      name="version"
                      value={editRow.version}
                      onChange={(e) => setEditRow({ ...editRow, version: e.target.value })}
                      placeholder="v1.0.0"
                      className="nb-input w-full"
                    />
                    <input
                      type="date"
                      name="released_at"
                      value={editRow.releasedAt}
                      onChange={(e) =>
                        setEditRow({ ...editRow, releasedAt: e.target.value })
                      }
                      aria-label="Release date"
                      className="nb-input w-full"
                    />
                  </div>
                  <textarea
                    name="changelog"
                    value={editRow.changelog}
                    onChange={(e) =>
                      setEditRow({ ...editRow, changelog: e.target.value })
                    }
                    className="nb-input w-full"
                    rows={2}
                    placeholder="Changelog (Markdown supported)"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="nb-btn nb-btn--secondary disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setPlatformError(null);
                      }}
                      className="nb-chip"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <span className="nb-tag nb-tag--b">{platform.platform}</span>
                  <span className="min-w-0 flex-1 truncate font-mono text-[0.7rem] text-text">
                    {platform.url}
                  </span>
                  {platform.version && (
                    <span className="font-mono text-[0.65rem] text-muted">
                      v{platform.version}
                    </span>
                  )}
                  {platform.released_at && (
                    <span className="font-mono text-[0.65rem] text-muted">
                      {formatDate(platform.released_at)}
                    </span>
                  )}
                  {platform.changelog && (
                    <span className="hidden max-w-[180px] truncate font-mono text-[0.65rem] text-muted sm:inline">
                      {platform.changelog}
                    </span>
                  )}
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => startEdit(platform)}
                    className="nb-chip disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <form
                    action={(fd) => {
                      if (window.confirm("Delete this platform entry?")) {
                        run(deletePlatform, fd, "Platform removed", {
                          setError: setPlatformError,
                        });
                      }
                    }}
                  >
                    <input type="hidden" name="id" value={platform.id} />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="nb-chip disabled:opacity-50"
                    >
                      ✕
                    </button>
                  </form>
                </>
              )}
            </li>
          ))}
        </ul>

        <form
          action={async (fd) => {
            const chosen = String(fd.get("platform") ?? "");
            if (usedPlatforms.has(chosen as Platform)) {
              setPlatformError(
                `"${chosen}" is already added — edit or delete it instead.`
              );
              return;
            }
            const ok = await run(addPlatform, fd, "Platform added", {
              setError: setPlatformError,
            });
            if (ok) {
              setAddUrl("");
              setAddVersion("");
              setAddReleasedAt("");
              setChangelogContent("");
              setAddPlatformValue(
                PLATFORMS.find(
                  (p) => !usedPlatforms.has(p) && p !== (chosen as Platform)
                ) ?? "web"
              );
            }
          }}
          className="mt-3 grid gap-2"
        >
          <input type="hidden" name="app_id" value={app.id} />
          <div className="grid gap-2 sm:grid-cols-[130px_1fr_110px_130px_auto]">
            <select
              name="platform"
              value={addPlatformValue}
              onChange={(e) => setAddPlatformValue(e.target.value as Platform)}
              className="nb-input w-full"
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p} disabled={usedPlatforms.has(p)}>
                  {p}
                </option>
              ))}
            </select>
            <input
              name="url"
              value={addUrl}
              onChange={(e) => setAddUrl(e.target.value)}
              placeholder="https://… (required)"
              className="nb-input w-full"
            />
            <input
              name="version"
              value={addVersion}
              onChange={(e) => setAddVersion(e.target.value)}
              placeholder="v1.0.0"
              className="nb-input w-full"
            />
            <input
              type="date"
              name="released_at"
              value={addReleasedAt}
              onChange={(e) => setAddReleasedAt(e.target.value)}
              aria-label="Release date"
              className="nb-input w-full"
            />
            <button
              type="submit"
              disabled={submitting}
              className="nb-btn nb-btn--secondary disabled:opacity-50"
            >
              Add
            </button>
          </div>
          <div>
            <span className="field-label">Changelog (Markdown supported)</span>
            <div className="mt-1 flex gap-2">
              <button
                type="button"
                onClick={() => setChangelogTab("write")}
                className={`nb-chip ${changelogTab === "write" ? "nb-chip--on" : ""}`}
              >
                Write
              </button>
              <button
                type="button"
                onClick={() => setChangelogTab("preview")}
                className={`nb-chip ${changelogTab === "preview" ? "nb-chip--on" : ""}`}
              >
                Preview
              </button>
            </div>
            <textarea
              name="changelog"
              value={changelogContent}
              onChange={(e) => setChangelogContent(e.target.value)}
              className={`nb-input mt-2 w-full ${changelogTab === "write" ? "" : "hidden"}`}
              rows={3}
              placeholder="What's new in this version…"
            />
            {changelogTab === "preview" && (
              <div className="nb-input mt-2 min-h-[76px] overflow-auto p-4">
                {changelogContent ? (
                  <MarkdownBody content={changelogContent} />
                ) : (
                  <p className="font-mono text-xs text-muted">Nothing to preview.</p>
                )}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
