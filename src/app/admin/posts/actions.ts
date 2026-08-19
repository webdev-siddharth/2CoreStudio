"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";

const now = (): string => new Date().toISOString();

function revalidatePost(slug?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePath("/news");
  if (slug) revalidatePath(`/news/${slug}`);
}

function str(formData: FormData, key: string): string {
  return (formData.get(key) as string)?.trim() ?? "";
}

function isPublished(formData: FormData): boolean {
  return formData.get("is_published") === "on";
}

function requireString(formData: FormData, key: string): string {
  const value = str(formData, key);
  if (!value) throw new Error("Required fields are missing.");
  return value;
}

export async function createPost(formData: FormData) {
  const supabase = await requireAdmin();
  const title = requireString(formData, "title");
  const slug = requireString(formData, "slug");

  const { error } = await supabase.from("posts").insert({
    title,
    slug,
    excerpt: str(formData, "excerpt") || null,
    body: str(formData, "body") || null,
    cover_url: str(formData, "cover_url") || null,
    is_published: isPublished(formData),
    published_at: isPublished(formData) ? now() : null,
  });

  if (error) throw new Error(error.message);
  revalidatePost(slug);
}

export async function updatePost(formData: FormData) {
  const supabase = await requireAdmin();
  const id = requireString(formData, "id");
  const title = requireString(formData, "title");
  const slug = requireString(formData, "slug");
  const wantPublished = isPublished(formData);

  const { data: existing } = await supabase
    .from("posts")
    .select("published_at")
    .eq("id", id)
    .maybeSingle();

  const publishedAt =
    wantPublished && !existing?.published_at ? now() : existing?.published_at ?? null;

  const { error } = await supabase
    .from("posts")
    .update({
      title,
      slug,
      excerpt: str(formData, "excerpt") || null,
      body: str(formData, "body") || null,
      cover_url: str(formData, "cover_url") || null,
      is_published: wantPublished,
      published_at: publishedAt,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePost(slug);
}

export async function deletePost(formData: FormData) {
  const supabase = await requireAdmin();
  const id = requireString(formData, "id");

  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePost();
}

export async function togglePublish(formData: FormData) {
  const supabase = await requireAdmin();
  const id = requireString(formData, "id");
  const isPublished = formData.get("is_published") === "true";

  const { data: existing } = await supabase
    .from("posts")
    .select("slug, published_at")
    .eq("id", id)
    .maybeSingle();

  const next = !isPublished;
  const publishedAt = next && !existing?.published_at ? now() : undefined;

  const { error } = await supabase
    .from("posts")
    .update(
      publishedAt
        ? { is_published: next, published_at: publishedAt }
        : { is_published: next }
    )
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePost(existing?.slug);
}