import { AdminAppsTable } from "@/app/admin/apps/AdminAppsTable";
import { createClient } from "@/lib/supabase/server";
import type { AppWithPlatforms } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getAllApps(): Promise<AppWithPlatforms[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("apps")
      .select("*, app_platforms(*)")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Admin apps fetch failed:", error.message);
      return [];
    }
    return (data ?? []) as AppWithPlatforms[];
  } catch (err) {
    console.error("Admin apps fetch threw:", err);
    return [];
  }
}

export default async function AdminAppsPage() {
  const apps = await getAllApps();

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="display text-2xl text-text">MANAGE APPS</h1>
      <p className="mt-2 mb-8 font-mono text-xs uppercase tracking-widest text-muted">
        {apps.length} {apps.length === 1 ? "app" : "apps"} · published +
        drafts
      </p>
      <AdminAppsTable apps={apps} />
    </div>
  );
}
