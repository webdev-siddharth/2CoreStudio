import { AdminPostsTable } from "@/app/admin/posts/AdminPostsTable";
import { createClient } from "@/lib/supabase/server";
import type { PostRow } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getAllPosts(): Promise<PostRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Admin posts fetch failed:", error.message);
      return [];
    }
    return (data ?? []) as PostRow[];
  } catch (err) {
    console.error("Admin posts fetch threw:", err);
    return [];
  }
}

export default async function AdminPostsPage() {
  const posts = await getAllPosts();

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="display text-2xl text-ink">MANAGE POSTS</h1>
      <p className="mt-2 mb-8 font-mono text-xs uppercase tracking-widest text-muted">
        {posts.length} {posts.length === 1 ? "post" : "posts"} · published +
        drafts
      </p>
      <AdminPostsTable posts={posts} />
    </div>
  );
}