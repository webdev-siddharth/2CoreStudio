import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import {
  isUnconfiguredSupabase,
  withTimeout,
} from "@/lib/supabase/fetch-guard";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const lastModified = new Date();

  const routes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified },
    { url: `${baseUrl}/apps`, lastModified },
    { url: `${baseUrl}/news`, lastModified },
    { url: `${baseUrl}/about`, lastModified },
    { url: `${baseUrl}/support`, lastModified },
    { url: `${baseUrl}/support/security`, lastModified },
    { url: `${baseUrl}/profile`, lastModified },
    { url: `${baseUrl}/legal`, lastModified },
    { url: `${baseUrl}/legal/privacy`, lastModified },
    { url: `${baseUrl}/legal/terms`, lastModified },
    { url: `${baseUrl}/legal/cookies`, lastModified },
  ];

  if (!isUnconfiguredSupabase()) {
    try {
      const supabase = await createClient();
      const { data } = await withTimeout(
        supabase
          .from("apps")
          .select("slug, updated_at")
          .eq("is_published", true)
      );

      for (const app of data ?? []) {
        routes.push({
          url: `${baseUrl}/apps/${app.slug}`,
          lastModified: new Date(app.updated_at),
        });
      }
    } catch (err) {
      console.error("Sitemap fetch threw:", err);
    }

    try {
      const supabase = await createClient();
      const { data } = await withTimeout(
        supabase
          .from("posts")
          .select("slug, published_at")
          .eq("is_published", true)
      );

      for (const post of data ?? []) {
        routes.push({
          url: `${baseUrl}/news/${post.slug}`,
          lastModified: post.published_at
            ? new Date(post.published_at)
            : lastModified,
        });
      }
    } catch (err) {
      console.error("Sitemap posts fetch threw:", err);
    }
  }

  return routes;
}
