"use client";

import { useState } from "react";
import {
  createPost,
  deletePost,
  togglePublish,
  updatePost,
} from "@/app/admin/posts/actions";
import { postStatus } from "@/lib/status";
import type { PostRow } from "@/lib/types";

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

export function AdminPostsTable({ posts }: { posts: PostRow[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
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
        <button
          type="button"
          onClick={() => setShowCreate((v) => !v)}
          className="nb-btn nb-btn--orange"
        >
          {showCreate ? "Close ✕" : "+ New post"}
        </button>

        {showCreate && (
          <form
            action={(fd) => run(createPost, fd)}
            className="nb-card mt-4 grid gap-3 sm:grid-cols-2"
          >
            <label className="block">
              <span className="field-label">Title *</span>
              {field("title", "", "")}
            </label>
            <label className="block">
              <span className="field-label">Slug *</span>
              {field("slug", "", "")}
            </label>
            <label className="block sm:col-span-2">
              <span className="field-label">Excerpt</span>
              <textarea
                name="excerpt"
                className="nb-input w-full"
                rows={2}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="field-label">Body (\n = paragraph)</span>
              <textarea
                name="body"
                className="nb-input w-full"
                rows={4}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="field-label">Cover URL</span>
              {field("cover_url", "")}
            </label>
            <label className="flex cursor-pointer items-center gap-2 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-ink sm:col-span-2">
              <input
                type="checkbox"
                name="is_published"
                className="h-4 w-4 accent-[var(--magenta)]"
              />
              Published
            </label>
            <button type="submit" className="nb-btn sm:col-span-2">
              Create post
            </button>
          </form>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="nb-card">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            No posts yet — create your first one.
          </p>
        </div>
      ) : (
        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => {
            const status = postStatus(post);
            return (
              <li key={post.id} className="nb-card flex flex-col gap-3">
                <div className="flex flex-wrap items-start gap-2">
                  <p className="display min-w-0 flex-1 text-base text-ink">
                    {post.title}
                  </p>
                  <span className={`nb-status ${status.className}`}>
                    {status.label}
                  </span>
                </div>

                <dl className="space-y-1.5 font-mono text-[0.68rem] text-muted">
                  <div className="flex justify-between gap-3">
                    <dt className="uppercase tracking-wider">Last edit</dt>
                    <dd className="text-ink">{formatDate(post.updated_at)}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="uppercase tracking-wider">Published</dt>
                    <dd className="text-ink">
                      {formatDate(post.published_at)}
                    </dd>
                  </div>
                </dl>

                <div className="mt-auto flex flex-wrap gap-2 border-t-[3px] border-dashed border-ink pt-3">
                  <form
                    action={(fd) => run(togglePublish, fd)}
                    className="inline"
                  >
                    <input type="hidden" name="id" value={post.id} />
                    <input
                      type="hidden"
                      name="is_published"
                      value={String(post.is_published)}
                    />
                    <button type="submit" className="nb-chip">
                      {post.is_published ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingId(editingId === post.id ? null : post.id)
                    }
                    className="nb-chip"
                  >
                    {editingId === post.id ? "Close" : "Edit"}
                  </button>
                  <form
                    action={(fd) => {
                      if (window.confirm(`Delete "${post.title}"?`))
                        run(deletePost, fd);
                    }}
                    className="inline"
                  >
                    <input type="hidden" name="id" value={post.id} />
                    <button type="submit" className="nb-chip">
                      Delete
                    </button>
                  </form>
                </div>

                {editingId === post.id && (
                  <form
                    action={(fd) => run(updatePost, fd)}
                    className="mt-3 grid gap-3 border-t-[3px] border-dashed border-ink pt-3 sm:grid-cols-2"
                  >
                    <input type="hidden" name="id" value={post.id} />
                    <label className="block">
                      <span className="field-label">Title *</span>
                      {field("title", post.title)}
                    </label>
                    <label className="block">
                      <span className="field-label">Slug *</span>
                      {field("slug", post.slug)}
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
                    <label className="block sm:col-span-2">
                      <span className="field-label">Body (\n = paragraph)</span>
                      <textarea
                        name="body"
                        defaultValue={post.body ?? ""}
                        className="nb-input w-full"
                        rows={4}
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="field-label">Cover URL</span>
                      {field("cover_url", post.cover_url)}
                    </label>
                    <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
                      <label className="flex cursor-pointer items-center gap-2 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-ink">
                        <input
                          type="checkbox"
                          name="is_published"
                          defaultChecked={post.is_published}
                          className="h-4 w-4 accent-[var(--magenta)]"
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
                    <button type="submit" className="nb-btn sm:col-span-2">
                      Save changes
                    </button>
                  </form>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}