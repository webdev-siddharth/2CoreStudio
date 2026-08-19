import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Auth callback — exchanges the OAuth/PKCE code for a session
 * (magic link, email confirm, OAuth). Redirects to `next` or /apps.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/apps";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error("Auth callback exchange failed:", error.message);
  }

  return NextResponse.redirect(`${origin}/profile?error=signin`);
}
