"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Markdown from "react-markdown";
import { toast } from "sonner";
import {
  deletePost,
  togglePublish,
  updatePost,
} from "@/app/admin/posts/actions";
import { postStatus } from "@/lib/status";
import type { PostRow } from "@/lib/types";

const CATEGORIES = [
  "Release",
  "Update",
  "Announcement",
  "Tutorial",
  "Changelog",
  "Other",
];

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

function isKnownCategory(cat: string): boolean {
  return CATEGORIES.filter((c) => c !== "Other").includes(cat);
}

export function PostEditForm({ post }: { post: PostRow }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [category, setCategory] = useState(
    isKnownCategory(post.category ?? "Update") ? (post.category ?? "Update") : "Other"
  );
  const [customCategory, setCustomCategory] = useState(
    isKnownCategory(post.category ?? "Update") ? "" : (post.category ?? "")
  );
  const [tags, setTags] = useState((post.tags ?? []).join(", "));
  const [body, setBody] = useState(post.body ?? "");
  const [preview, setPreview] = useState(false);
  const [coverUrl, setCoverUrl] = useState(post.cover_url ?? "");
  const status = postStatus(post);

  const displayCategory = category === "Other" ? customCategory : category;
  const tagsArray = tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const run = async (
    action: (fd: FormData) => Promise<void>,
    fd: FormData,
    successMsg?: string
  ) => {
    try {
      setError(null);
      setSubmitting(true);
      await action(fd);
      if (successMsg) toast.success(successMsg);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Action failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (fd: FormData) => {
    fd.set("category", displayCategory || "Update");
    fd.set("tags", JSON.stringify(tagsArray));
    await run(updatePost, fd, "Post saved");
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Link
        href="/admin/posts"
        className="py-1 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-text no-underline hover:text-primary md:py-0"
      >
        ← Back to posts
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="display text-2xl text-text">EDIT POST</h1>
        <span className={`nb-status ${status.className}`}>{status.label}</span>
      </div>
      <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted">
        {post.title} · last edit {formatDate(post.updated_at)}
      </p>

      <ErrorNote error={error} />

      <form
        action={handleUpdate}
        className="nb-card mt-6 grid gap-3 sm:grid-cols-2"
      >
        <input type="hidden" name="id" value={post.id} />
        <label className="block">
          <span className="field-label">Title *</span>
          <input
            name="title"
            defaultValue={post.title}
            className="nb-input w-full"
          />
        </label>
        <label className="block">
          <span className="field-label">Slug *</span>
          <input
            name="slug"
            defaultValue={post.slug}
            className="nb-input w-full"
          />
        </label>
        <label className="block">
          <span className="field-label">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="nb-input w-full"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        {category === "Other" && (
          <label className="block">
            <span className="field-label">Custom category *</span>
            <input
              name="custom_category"
              placeholder="Enter category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="nb-input w-full"
            />
          </label>
        )}
        <label className="block sm:col-span-2">
          <span className="field-label">Tags (comma-separated)</span>
          <input
            name="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="nb-input w-full"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="field-label">Excerpt</span>
          <textarea
            name="excerpt"
            defaultValue={post.excerpt ?? ""}
            className="nb-input w-full"
            rows={2}
          />
        </label>
        <div className="sm:col-span-2">
          <div className="flex items-center justify-between">
            <span className="field-label">Body (Markdown)</span>
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className="nb-chip"
            >
              {preview ? "Edit" : "Preview"}
            </button>
          </div>
          {preview ? (
            <div className="md-body mt-1 border-[3px] border-ink bg-surface p-3 font-mono text-sm leading-relaxed text-text">
              {body ? (
                <Markdown>{body}</Markdown>
              ) : (
                <p className="text-muted">Nothing to preview.</p>
              )}
            </div>
          ) : (
            <textarea
              name="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="nb-input mt-1 w-full"
              rows={10}
            />
          )}
        </div>
        <label className="block">
          <span className="field-label">Cover URL</span>
          <input
            name="cover_url"
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
            className="nb-input w-full"
          />
        </label>
        <label className="block">
          <span className="field-label">Cover Alt Text</span>
          <input
            name="cover_alt"
            defaultValue={post.cover_alt ?? ""}
            placeholder="Description of cover image"
            className="nb-input w-full"
          />
        </label>
        {coverUrl && (
          <div className="sm:col-span-2">
            <span className="field-label">Cover preview</span>
            <div
              aria-hidden
              className="mt-1 aspect-video border-[3px] border-ink bg-cover bg-center"
              style={{ backgroundImage: `url(${coverUrl})` }}
            />
          </div>
        )}
        <label className="block">
          <span className="field-label">SEO Title</span>
          <input
            name="seo_title"
            defaultValue={post.seo_title ?? ""}
            placeholder="Overrides <title> tag"
            className="nb-input w-full"
          />
        </label>
        <label className="block">
          <span className="field-label">SEO Description</span>
          <input
            name="seo_description"
            defaultValue={post.seo_description ?? ""}
            placeholder="Overrides meta description"
            className="nb-input w-full"
          />
        </label>
        <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
          <label className="flex cursor-pointer items-center gap-2 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-text">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={post.is_published}
              className="h-4 w-4 accent-[var(--primary)]"
            />
            Published
          </label>
          <span className="font-mono text-[0.65rem] text-muted">
            {post.is_published
              ? `Published ${formatDate(post.published_at)} — unpublish to hide`
              : post.published_at
                ? "Unpublished — publishing restores"
                : "Publishing sets the date automatically"}
          </span>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className={`nb-btn sm:col-span-2 ${submitting ? "nb-btn--disabled" : ""}`}
        >
          {submitting ? "Saving..." : "Save changes"}
        </button>
      </form>

      <div className="nb-card mt-6 flex flex-wrap items-center gap-3">
        <form
          action={(fd) =>
            run(togglePublish, fd, post.is_published ? "Post unpublished" : "Post published")
          }
          className="inline"
        >
          <input type="hidden" name="id" value={post.id} />
          <input
            type="hidden"
            name="is_published"
            value={String(post.is_published)}
          />
          <button type="submit" disabled={submitting} className="nb-chip disabled:opacity-50">
            {post.is_published ? "Unpublish" : "Publish"}
          </button>
        </form>
        <form
          action={(fd) => {
            if (window.confirm(`Delete "${post.title}"?`)) {
              run(deletePost, fd, "Post deleted").then(() => router.push("/admin/posts"));
            }
          }}
          className="inline"
        >
          <input type="hidden" name="id" value={post.id} />
          <button type="submit" disabled={submitting} className="nb-chip disabled:opacity-50">
            Delete post
          </button>
        </form>
      </div>
    </div>
  );
}
