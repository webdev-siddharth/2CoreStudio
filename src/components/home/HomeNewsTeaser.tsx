import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { createClient } from "@/lib/supabase/server";
import {
  isUnconfiguredSupabase,
  withTimeout,
} from "@/lib/supabase/fetch-guard";
import type { PostRow } from "@/lib/types";

async function getLatestPosts(limit = 3): Promise<PostRow[]> {
  if (isUnconfiguredSupabase()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await withTimeout(
      supabase
        .from("posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(limit)
    );

    if (error) {
      console.error("Latest posts fetch failed:", error.message);
      return [];
    }
    return (data ?? []) as PostRow[];
  } catch (err) {
    console.error("Latest posts fetch threw:", err);
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

export async function HomeNewsTeaser() {
  const posts = await getLatestPosts();

  if (posts.length === 0) return null;

  return (
    <section className="border-b-[3px] border-ink bg-bg">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            News
          </p>
          <h2 className="display mt-3 text-3xl text-ink sm:text-4xl">
            Latest from the studio
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={i * 80}>
              <Link
                href={`/news/${post.slug}`}
                className="nb-card block no-underline transition-transform duration-75 hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center border-[3px] border-ink bg-surface2 font-mono text-sm font-bold text-magenta shadow-[3px_3px_0_var(--ink)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 className="display truncate text-lg text-ink">
                      {post.title}
                    </h3>
                    <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-widest text-muted">
                      {formatDate(post.published_at ?? post.created_at)}
                    </p>
                  </div>
                  <span className="ml-auto hidden shrink-0 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-magenta sm:inline-block">
                    Read more →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}