"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Logs a single 'view' app_event per session per app detail page.
 * RLS allows anonymous inserts; failures are swallowed.
 */
export function ViewTracker({ appId }: { appId: string }) {
  useEffect(() => {
    try {
      const key = `2core-viewed-${appId}`;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
      createClient()
        .from("app_events")
        .insert({ app_id: appId, platform: null, event: "view" })
        .then(({ error }) => {
          if (error) console.warn("view event insert failed:", error.message);
        });
    } catch {
      // analytics must never break the page
    }
  }, [appId]);

  return null;
}
