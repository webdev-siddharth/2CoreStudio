import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  isUnconfiguredSupabase,
  withTimeout,
} from "@/lib/supabase/fetch-guard";
import type { PostRow } from "@/lib/types";

export const metadata: Metadata = {
  title: "News / Blog",
  description:
    "Release notes, launch announcements and studio updates from 2coreStudio.",
};

export const dynamic = "force-dynamic";

async function getPublishedPosts(): Promise<PostRow[]> {
  if (isUnconfiguredSupabase()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await withTimeout(
      supabase
        .from("posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
    );

    if (error) {
      console.error("Posts fetch failed:", error.message);
      return [];
    }
    return (data ?? []) as PostRow[];
  } catch (err) {
    console.error("Posts fetch threw:", err);
    return [];
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function NewsPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
        2coreStudio
      </p>
      <h1 className="display mt-3 text-4xl text-ink sm:text-5xl">
        NEWS <span className="text-magenta">/</span> BLOG
      </h1>
      <p className="mt-4 max-w-2xl font-mono text-sm leading-relaxed text-ink">
        Release notes, launch announcements and studio updates.
      </p>

      <div className="mt-10">
        {posts.length === 0 ? (
          <div className="nb-card">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              No posts yet — check back soon.
            </p>
          </div>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/news/${post.slug}`}
                  className="nb-card block h-full no-underline transition-transform duration-75 hover:-translate-y-0.5"
                >
                  {post.cover_url && (
                    <div
                      aria-hidden
                      className="mb-4 aspect-video border-[3px] border-ink bg-cover bg-center"
                      style={{ backgroundImage: `url(${post.cover_url})` }}
                    />
                  )}
                  <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">
                    {formatDate(post.published_at ?? post.created_at)}
                  </p>
                  <h2 className="display mt-2 text-lg text-ink">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2 font-mono text-xs leading-relaxed text-muted">
                      {post.excerpt}
                    </p>
                  )}
                  <p className="mt-4 inline-block font-mono text-[0.68rem] font-bold uppercase tracking-wider text-magenta">
                    Read post →
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}