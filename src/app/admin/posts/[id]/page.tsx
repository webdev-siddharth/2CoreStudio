import { notFound } from "next/navigation";
import { PostEditForm } from "@/app/admin/posts/[id]/PostEditForm";
import { createClient } from "@/lib/supabase/server";
import type { PostRow } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let post: PostRow | null = null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Admin post fetch failed:", error.message);
    } else {
      post = (data ?? null) as PostRow | null;
    }
  } catch (err) {
    console.error("Admin post fetch threw:", err);
  }

  if (!post) notFound();

  return <PostEditForm post={post} />;
}
