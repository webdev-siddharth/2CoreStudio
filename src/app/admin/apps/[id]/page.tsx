import { notFound } from "next/navigation";
import { AppEditForm } from "@/app/admin/apps/[id]/AppEditForm";
import { createClient } from "@/lib/supabase/server";
import type { AppWithPlatforms } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditAppPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let app: AppWithPlatforms | null = null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("apps")
      .select("*, app_platforms(*)")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Admin app fetch failed:", error.message);
    } else {
      app = (data ?? null) as AppWithPlatforms | null;
    }
  } catch (err) {
    console.error("Admin app fetch threw:", err);
  }

  if (!app) notFound();

  return <AppEditForm app={app} />;
}