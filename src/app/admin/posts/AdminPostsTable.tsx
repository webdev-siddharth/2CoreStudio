"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { deletePost, togglePublish } from "@/app/admin/posts/actions";
import { postStatus } from "@/lib/status";
import type { PostRow } from "@/lib/types";

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

export function AdminPostsTable({ posts }: { posts: PostRow[] }) {
  const [error, setError] = useState<string | null>(null);

  const run = async (
    action: (fd: FormData) => Promise<void>,
    fd: FormData,
    successMsg?: string
  ) => {
    try {
      setError(null);
      await action(fd);
      if (successMsg) toast.success(successMsg);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Action failed";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div>
      <ErrorNote error={error} />

      <div className="mb-6">
        <Link href="/admin/posts/new" className="nb-btn nb-btn--secondary">
          + New post
        </Link>
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
                  <p className="display min-w-0 flex-1 text-base text-text">
                    {post.title}
                  </p>
                  <span className={`nb-status ${status.className}`}>
                    {status.label}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="nb-tag nb-tag--a">{post.category ?? "Update"}</span>
                  {(post.tags ?? []).slice(0, 3).map((tag) => (
                    <span key={tag} className="nb-tag nb-tag--b">
                      {tag}
                    </span>
                  ))}
                  {(post.tags ?? []).length > 3 && (
                    <span className="nb-tag nb-tag--b">
                      +{(post.tags ?? []).length - 3}
                    </span>
                  )}
                </div>

                <dl className="space-y-1.5 font-mono text-[0.68rem] text-muted">
                  <div className="flex justify-between gap-3">
                    <dt className="uppercase tracking-wider">Last edit</dt>
                    <dd className="text-text">{formatDate(post.updated_at)}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="uppercase tracking-wider">Published</dt>
                    <dd className="text-text">
                      {formatDate(post.published_at)}
                    </dd>
                  </div>
                </dl>

                <div className="mt-auto flex flex-wrap gap-2 border-t-[3px] border-dashed border-ink pt-3">
                  <form
                    action={(fd) =>
                      run(
                        togglePublish,
                        fd,
                        post.is_published ? "Post unpublished" : "Post published"
                      )
                    }
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
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="nb-chip no-underline"
                  >
                    Edit
                  </Link>
                  <form
                    action={(fd) => {
                      if (window.confirm(`Delete "${post.title}"?`)) {
                        run(deletePost, fd, "Post deleted");
                      }
                    }}
                    className="inline"
                  >
                    <input type="hidden" name="id" value={post.id} />
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
