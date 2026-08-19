/**
 * Lightweight row types mirroring the 2corestudio schema (see supabase/schema
 * in the project docs). Replace with src/types/database.types.ts generated
 * types once `supabase gen types` has been run — these keep the app
 * type-checked in the meantime.
 */

export type Platform = "web" | "windows" | "mac" | "android" | "ios" | "linux";

export type AccessTier = "instant" | "account" | "premium";

export type AppCategory = "Gaming" | "Utility" | "SaaS";

export type EventType = "view" | "download";

export interface AppRow {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  detailed_body: string | null;
  category: AppCategory;
  access_tier: AccessTier;
  requires_auth: boolean;
  is_published: boolean;
  thumbnail_url: string | null;
  banner_url: string | null;
  youtube_embed_id: string | null;
  is_premium: boolean;
  product_sku: string | null;
  is_featured: boolean;
  featured_order: number;
  created_at: string;
  updated_at: string;
}

export interface AppPlatformRow {
  id: string;
  app_id: string;
  platform: Platform;
  url: string;
  version: string | null;
  changelog: string | null;
  released_at: string | null;
  created_at: string;
}

export interface AppWithPlatforms extends AppRow {
  app_platforms: AppPlatformRow[];
}

export interface ProfileRow {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  account_tier: "standard" | "premium";
  role: "user" | "admin";
  created_at: string;
}

export interface AppEventRow {
  id: string;
  app_id: string | null;
  user_id: string | null;
  event: EventType;
  platform: string | null;
  created_at: string;
  apps: Pick<AppRow, "title" | "slug"> | null;
}

export interface PostRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  cover_url: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}
