"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import type { AppCategory, AccessTier, Platform } from "@/lib/types";

function revalidateCatalog() {
  revalidatePath("/admin");
  revalidatePath("/admin/apps");
  revalidatePath("/");
  revalidatePath("/apps");
}

const CATEGORIES: AppCategory[] = ["Gaming", "Utility", "SaaS"];
const TIERS: AccessTier[] = ["instant", "account", "premium"];
const PLATFORMS: Platform[] = ["web", "windows", "mac", "android", "ios", "linux"];

function str(formData: FormData, key: string): string {
  return (formData.get(key) as string)?.trim() ?? "";
}

function bool(formData: FormData, key: string): boolean {
  return formData.get(key) === "on";
}

export async function checkSlugUnique(slug: string, excludeId?: string) {
  const supabase = await requireAdmin();
  let query = supabase.from("apps").select("id").eq("slug", slug);
  if (excludeId) query = query.neq("id", excludeId);
  const { data } = await query.maybeSingle();
  return !data;
}

export async function createApp(formData: FormData) {
  const supabase = await requireAdmin();
  const title = str(formData, "title");
  const slug = str(formData, "slug");

  if (!title || !slug) throw new Error("Title and slug are required.");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    throw new Error("Slug must be lowercase alphanumeric with hyphens only.");
  if (!CATEGORIES.includes(formData.get("category") as AppCategory))
    throw new Error("Invalid category.");
  if (!TIERS.includes(formData.get("access_tier") as AccessTier))
    throw new Error("Invalid access tier.");

  const { data: existing } = await supabase
    .from("apps")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (existing) throw new Error("A post/app with this slug already exists.");

  const { data, error } = await supabase
    .from("apps")
    .insert({
      title,
      slug,
      description: str(formData, "description") || null,
      detailed_body: str(formData, "detailed_body") || null,
      category: formData.get("category") as AppCategory,
      access_tier: formData.get("access_tier") as AccessTier,
      requires_auth: bool(formData, "requires_auth"),
      is_published: bool(formData, "is_published"),
      thumbnail_url: str(formData, "thumbnail_url") || null,
      banner_url: str(formData, "banner_url") || null,
      youtube_embed_id: str(formData, "youtube_embed_id") || null,
      product_sku: str(formData, "product_sku") || null,
      is_featured: bool(formData, "is_featured"),
      is_premium: bool(formData, "is_premium"),
      featured_order: Number(formData.get("featured_order")) || 0,
      github_url: str(formData, "github_url") || null,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  revalidateCatalog();
  redirect(`/admin/apps/${data.id}`);
}

export async function updateApp(formData: FormData) {
  const supabase = await requireAdmin();
  const id = str(formData, "id");
  const title = str(formData, "title");
  const slug = str(formData, "slug");
  if (!id || !title || !slug) throw new Error("Missing required fields.");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    throw new Error("Slug must be lowercase alphanumeric with hyphens only.");

  const { data: existing } = await supabase
    .from("apps")
    .select("id")
    .eq("slug", slug)
    .neq("id", id)
    .maybeSingle();
  if (existing) throw new Error("A post/app with this slug already exists.");

  const { error } = await supabase
    .from("apps")
    .update({
      title,
      slug,
      description: str(formData, "description") || null,
      detailed_body: str(formData, "detailed_body") || null,
      category: formData.get("category") as AppCategory,
      access_tier: formData.get("access_tier") as AccessTier,
      requires_auth: bool(formData, "requires_auth"),
      is_published: bool(formData, "is_published"),
      is_featured: bool(formData, "is_featured"),
      is_premium: bool(formData, "is_premium"),
      featured_order: Number(formData.get("featured_order")) || 0,
      thumbnail_url: str(formData, "thumbnail_url") || null,
      banner_url: str(formData, "banner_url") || null,
      youtube_embed_id: str(formData, "youtube_embed_id") || null,
      product_sku: str(formData, "product_sku") || null,
      github_url: str(formData, "github_url") || null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidateCatalog();
}

export async function deleteApp(formData: FormData) {
  const supabase = await requireAdmin();
  const id = str(formData, "id");
  if (!id) throw new Error("Missing id.");

  const { error } = await supabase.from("apps").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateCatalog();
  redirect("/admin/apps");
}

export async function togglePublish(formData: FormData) {
  const supabase = await requireAdmin();
  const id = str(formData, "id");
  const isPublished = formData.get("is_published") === "true";
  if (!id) throw new Error("Missing id.");

  const { error } = await supabase
    .from("apps")
    .update({ is_published: !isPublished })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidateCatalog();
}

export async function addPlatform(formData: FormData) {
  const supabase = await requireAdmin();
  const appId = str(formData, "app_id");
  const platform = formData.get("platform") as Platform;
  const url = str(formData, "url");

  if (!appId || !url) throw new Error("Platform and URL are required.");
  if (!PLATFORMS.includes(platform)) throw new Error("Invalid platform.");
  if (!url.startsWith("http://") && !url.startsWith("https://"))
    throw new Error("Platform URL must start with http:// or https://");

  const { error } = await supabase.from("app_platforms").insert({
    app_id: appId,
    platform,
    url,
    version: str(formData, "version") || null,
    changelog: str(formData, "changelog") || null,
  });
  if (error) throw new Error(error.message);
  revalidateCatalog();
}

export async function deletePlatform(formData: FormData) {
  const supabase = await requireAdmin();
  const id = str(formData, "id");
  if (!id) throw new Error("Missing id.");

  const { error } = await supabase.from("app_platforms").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateCatalog();
}
