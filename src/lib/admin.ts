import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Every admin mutation goes through this. The DB also enforces
 * is_admin() via RLS — this layer produces clean redirects/errors.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/profile?returnTo=%2Fadmin%2Fapps");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") redirect("/");
  return supabase;
}