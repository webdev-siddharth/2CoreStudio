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

export async function createApp(
  formData: FormData
): Promise<string | null> {
  const supabase = await requireAdmin();
  const title = str(formData, "title");
  const slug = str(formData, "slug");

  if (!title || !slug) return "Title and slug are required.";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    return "Slug must be lowercase alphanumeric with hyphens only.";
  if (!CATEGORIES.includes(formData.get("category") as AppCategory))
    return "Invalid category.";
  if (!TIERS.includes(formData.get("access_tier") as AccessTier))
    return "Invalid access tier.";

  const { data: existing } = await supabase
    .from("apps")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (existing) return "A post/app with this slug already exists.";

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

  if (error) return error.message;
  revalidateCatalog();
  redirect(`/admin/apps/${data.id}`);
}

export async function updateApp(formData: FormData): Promise<string | null> {
  const supabase = await requireAdmin();
  const id = str(formData, "id");
  const title = str(formData, "title");
  const slug = str(formData, "slug");
  if (!id || !title || !slug) return "Missing required fields.";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    return "Slug must be lowercase alphanumeric with hyphens only.";

  const { data: existing } = await supabase
    .from("apps")
    .select("id")
    .eq("slug", slug)
    .neq("id", id)
    .maybeSingle();
  if (existing) return "A post/app with this slug already exists.";

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

  if (error) return error.message;
  revalidateCatalog();
  return null;
}

export async function deleteApp(formData: FormData): Promise<string | null> {
  const supabase = await requireAdmin();
  const id = str(formData, "id");
  if (!id) return "Missing id.";

  const { error } = await supabase.from("apps").delete().eq("id", id);
  if (error) return error.message;
  revalidateCatalog();
  redirect("/admin/apps");
}

export async function togglePublish(formData: FormData): Promise<string | null> {
  const supabase = await requireAdmin();
  const id = str(formData, "id");
  const isPublished = formData.get("is_published") === "true";
  if (!id) return "Missing id.";

  const { error } = await supabase
    .from("apps")
    .update({ is_published: !isPublished })
    .eq("id", id);
  if (error) return error.message;
  revalidateCatalog();
  return null;
}

function parseReleaseDate(value: string): { iso: string | null; error?: string } {
  if (!value) return { iso: null };
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime()))
    return { iso: null, error: "Invalid release date." };
  return { iso: parsed.toISOString() };
}

function platformExistsMessage(platform: Platform): string {
  return `This app already has a "${platform}" entry — edit or delete it instead.`;
}

export async function addPlatform(formData: FormData): Promise<string | null> {
  const supabase = await requireAdmin();
  const appId = str(formData, "app_id");
  const platform = formData.get("platform") as Platform;
  const url = str(formData, "url");

  if (!appId) return "Missing app id.";
  if (!url) return "Platform URL is required.";
  if (!PLATFORMS.includes(platform)) return "Invalid platform.";
  if (!url.startsWith("http://") && !url.startsWith("https://"))
    return "Platform URL must start with http:// or https://";

  const released = parseReleaseDate(str(formData, "released_at"));
  if (released.error) return released.error;

  const { data: existing } = await supabase
    .from("app_platforms")
    .select("id")
    .eq("app_id", appId)
    .eq("platform", platform)
    .maybeSingle();
  if (existing) return platformExistsMessage(platform);

  const { error } = await supabase.from("app_platforms").insert({
    app_id: appId,
    platform,
    url,
    version: str(formData, "version") || null,
    changelog: str(formData, "changelog") || null,
    released_at: released.iso ?? new Date().toISOString(),
  });
  if (error) {
    if (error.code === "23505") return platformExistsMessage(platform);
    return error.message;
  }
  revalidateCatalog();
  return null;
}

export async function updatePlatform(formData: FormData): Promise<string | null> {
  const supabase = await requireAdmin();
  const id = str(formData, "id");
  const platform = formData.get("platform") as Platform;
  const url = str(formData, "url");

  if (!id) return "Missing id.";
  if (!PLATFORMS.includes(platform)) return "Invalid platform.";
  if (!url) return "Platform URL is required.";
  if (!url.startsWith("http://") && !url.startsWith("https://"))
    return "Platform URL must start with http:// or https://";

  const released = parseReleaseDate(str(formData, "released_at"));
  if (released.error) return released.error;

  const { data: row } = await supabase
    .from("app_platforms")
    .select("app_id")
    .eq("id", id)
    .maybeSingle();
  if (!row) return "Platform entry not found.";

  const { data: clash } = await supabase
    .from("app_platforms")
    .select("id")
    .eq("app_id", row.app_id)
    .eq("platform", platform)
    .neq("id", id)
    .maybeSingle();
  if (clash) return platformExistsMessage(platform);

  const { error } = await supabase
    .from("app_platforms")
    .update({
      platform,
      url,
      version: str(formData, "version") || null,
      changelog: str(formData, "changelog") || null,
      released_at: released.iso,
    })
    .eq("id", id);
  if (error) {
    if (error.code === "23505") return platformExistsMessage(platform);
    return error.message;
  }
  revalidateCatalog();
  return null;
}

export async function deletePlatform(formData: FormData): Promise<string | null> {
  const supabase = await requireAdmin();
  const id = str(formData, "id");
  if (!id) return "Missing id.";

  const { error } = await supabase.from("app_platforms").delete().eq("id", id);
  if (error) return error.message;
  revalidateCatalog();
  return null;
}
