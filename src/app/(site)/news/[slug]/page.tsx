import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  isUnconfiguredSupabase,
  withTimeout,
} from "@/lib/supabase/fetch-guard";
import type { PostRow } from "@/lib/types";
import { MarkdownBody } from "@/components/news/MarkdownBody";

export const dynamic = "force-dynamic";

async function getPost(slug: string): Promise<PostRow | null> {
  if (isUnconfiguredSupabase()) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await withTimeout(
      supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle()
    );

    if (error) {
      console.error("Post fetch failed:", error.message);
      return null;
    }
    return (data ?? null) as PostRow | null;
  } catch (err) {
    console.error("Post fetch threw:", err);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };

  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt || undefined,
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt || undefined,
      images: post.cover_url ? [post.cover_url] : undefined,
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  return (
    <article>
      {/* Cover */}
      <section className="relative overflow-hidden border-b-[3px] border-ink">
        {post.cover_url && (
          <div
            aria-hidden
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${post.cover_url})` }}
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-bg via-bg/75 to-bg/25"
        />
        <div className="relative z-10 mx-auto max-w-6xl px-5 pb-16 pt-24 sm:pt-32">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
              {formatDate(post.published_at ?? post.created_at)}
            </p>
            <span className="nb-tag nb-tag--a">{post.category ?? "Update"}</span>
            {(post.tags ?? []).slice(0, 3).map((tag) => (
              <span key={tag} className="nb-tag nb-tag--b">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="display mt-3 max-w-3xl text-4xl text-text sm:text-6xl">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-5 max-w-2xl font-mono text-sm leading-relaxed text-text">
              {post.excerpt}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-12">
        {post.body ? (
          <MarkdownBody content={post.body} />
        ) : (
          <p className="font-mono text-xs text-muted">No body yet.</p>
        )}

        <Link
          href="/news"
          className="mt-10 inline-block py-1 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-text no-underline hover:text-primary md:py-0"
        >
          ← Back to news
        </Link>
      </section>
    </article>
  );
}
