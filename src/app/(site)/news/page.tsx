import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  isUnconfiguredSupabase,
  withTimeout,
} from "@/lib/supabase/fetch-guard";
import type { PostRow } from "@/lib/types";
import { NewsSearch } from "@/components/news/NewsSearch";

export const metadata: Metadata = {
  title: "News / Blog",
  description:
    "Release notes, launch announcements and studio updates from 2coreStudio.",
};

export const dynamic = "force-dynamic";

const POSTS_PER_PAGE = 6;

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

function buildHref(base: string, params: Record<string, string | null>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) sp.set(k, v);
  }
  const qs = sp.toString();
  return qs ? `${base}?${qs}` : base;
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const rawQ = typeof params.q === "string" ? params.q : "";
  const query = rawQ.trim();
  const rawPage = typeof params.page === "string" ? params.page : "1";
  const currentPage = Math.max(1, parseInt(rawPage, 10) || 1);

  const allPosts = await getPublishedPosts();

  const filtered = query
    ? allPosts.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          (p.excerpt && p.excerpt.toLowerCase().includes(q))
        );
      })
    : allPosts;

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * POSTS_PER_PAGE;
  const posts = filtered.slice(start, start + POSTS_PER_PAGE);

  const baseHref = "/news";

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
        2coreStudio
      </p>
      <h1 className="display mt-3 text-4xl text-text sm:text-5xl">
        NEWS <span className="text-primary">/</span> BLOG
      </h1>
      <p className="mt-4 max-w-2xl font-mono text-sm leading-relaxed text-text">
        Release notes, launch announcements and studio updates.
      </p>

      <div className="mt-8">
        <NewsSearch query={query} />
      </div>

      {query && (
        <p className="mt-4 font-mono text-xs text-muted">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;
          {query}&rdquo;
        </p>
      )}

      <div className="mt-8">
        {filtered.length === 0 ? (
          <div className="nb-card">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              {query
                ? "No posts match your search — try different keywords."
                : "No posts yet — check back soon."}
            </p>
          </div>
        ) : (
          <>
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
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">
                        {formatDate(post.published_at ?? post.created_at)}
                      </p>
                      <span className="nb-tag nb-tag--a">{post.category ?? "Update"}</span>
                      {(post.tags ?? []).slice(0, 2).map((tag) => (
                        <span key={tag} className="nb-tag nb-tag--b">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="display mt-2 text-lg text-text">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="mt-2 font-mono text-xs leading-relaxed text-muted">
                        {post.excerpt}
                      </p>
                    )}
                    <p className="mt-4 inline-block font-mono text-[0.68rem] font-bold uppercase tracking-wider text-primary">
                      Read post →
                    </p>
                  </Link>
                </li>
              ))}
            </ul>

            {totalPages > 1 && (
              <nav
                aria-label="Pagination"
                className="mt-10 flex flex-wrap items-center justify-center gap-2"
              >
                <Link
                  href={buildHref(baseHref, {
                    q: query || null,
                    page: String(safePage - 1),
                  })}
                  className={`nb-chip ${safePage <= 1 ? "pointer-events-none opacity-40" : ""}`}
                  aria-disabled={safePage <= 1}
                  tabIndex={safePage <= 1 ? -1 : 0}
                >
                  ← Prev
                </Link>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <Link
                      key={p}
                      href={buildHref(baseHref, {
                        q: query || null,
                        page: String(p),
                      })}
                      className={`nb-chip ${p === safePage ? "nb-chip--on" : ""}`}
                      aria-current={p === safePage ? "page" : undefined}
                    >
                      {p}
                    </Link>
                  )
                )}

                <Link
                  href={buildHref(baseHref, {
                    q: query || null,
                    page: String(safePage + 1),
                  })}
                  className={`nb-chip ${safePage >= totalPages ? "pointer-events-none opacity-40" : ""}`}
                  aria-disabled={safePage >= totalPages}
                  tabIndex={safePage >= totalPages ? -1 : 0}
                >
                  Next →
                </Link>
              </nav>
            )}

            <p className="mt-4 text-center font-mono text-[0.65rem] text-muted">
              Page {safePage} of {totalPages}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
