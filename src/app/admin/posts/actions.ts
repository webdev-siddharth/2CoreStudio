"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

function parseTags(formData: FormData): string[] {
  const raw = str(formData, "tags");
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch {
    // fallback: comma-separated
  }
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

async function checkSlugUnique(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const supabase = await requireAdmin();
  let query = supabase
    .from("posts")
    .select("id")
    .eq("slug", slug)
    .limit(1);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data } = await query;
  return !data || data.length === 0;
}

export async function createPost(formData: FormData) {
  const supabase = await requireAdmin();
  const title = requireString(formData, "title");
  const slug = requireString(formData, "slug");

  const slugClean = slug
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!slugClean) throw new Error("Slug is required.");
  if (!(await checkSlugUnique(slugClean))) {
    throw new Error("A post with this slug already exists.");
  }

  const { error } = await supabase.from("posts").insert({
    title,
    slug: slugClean,
    excerpt: str(formData, "excerpt") || null,
    body: str(formData, "body") || null,
    cover_url: str(formData, "cover_url") || null,
    cover_alt: str(formData, "cover_alt") || null,
    category: str(formData, "category") || "Update",
    tags: parseTags(formData),
    seo_title: str(formData, "seo_title") || null,
    seo_description: str(formData, "seo_description") || null,
    is_published: isPublished(formData),
    published_at: isPublished(formData) ? now() : null,
  });

  if (error) throw new Error(error.message);
  revalidatePost(slugClean);
  redirect("/admin/posts");
}

export async function updatePost(formData: FormData) {
  const supabase = await requireAdmin();
  const id = requireString(formData, "id");
  const title = requireString(formData, "title");
  const slug = requireString(formData, "slug");
  const wantPublished = isPublished(formData);

  const slugClean = slug
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!slugClean) throw new Error("Slug is required.");
  if (!(await checkSlugUnique(slugClean, id))) {
    throw new Error("A post with this slug already exists.");
  }

  const { data: existing } = await supabase
    .from("posts")
    .select("published_at")
    .eq("id", id)
    .maybeSingle();

  const publishedAt =
    wantPublished && !existing?.published_at
      ? now()
      : existing?.published_at ?? null;

  const { error } = await supabase
    .from("posts")
    .update({
      title,
      slug: slugClean,
      excerpt: str(formData, "excerpt") || null,
      body: str(formData, "body") || null,
      cover_url: str(formData, "cover_url") || null,
      cover_alt: str(formData, "cover_alt") || null,
      category: str(formData, "category") || "Update",
      tags: parseTags(formData),
      seo_title: str(formData, "seo_title") || null,
      seo_description: str(formData, "seo_description") || null,
      is_published: wantPublished,
      published_at: publishedAt,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePost(slugClean);
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
