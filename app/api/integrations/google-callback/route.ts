import { NextResponse } from "next/server";
import { google } from "googleapis";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;
  const code = url.searchParams.get("code");
  
  if (!code) {
    return NextResponse.redirect(new URL("/dashboard/settings?error=no_code", req.url));
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${origin}/api/integrations/google-callback`
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);
    
    // Upsert the tokens into user_integrations
    const { error } = await supabase.from("user_integrations").upsert({
      user_id: user.id,
      provider: "google",
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null
    }, {
      onConflict: 'user_id, provider'
    });

    if (error) {
      console.error("Failed to save tokens:", error);
      return NextResponse.redirect(new URL("/dashboard/settings?error=db_error", req.url));
    }

    // Sync immediately upon connecting
    try {
      await fetch(`${origin}/api/calendar/sync`, {
        headers: {
          Cookie: req.headers.get("cookie") || ""
        }
      });
    } catch (e) {
      console.error("Initial sync failed:", e);
    }

    return NextResponse.redirect(new URL("/dashboard/settings?success=google_connected", req.url));
  } catch (error) {
    console.error("OAuth exchange failed:", error);
    return NextResponse.redirect(new URL("/dashboard/settings?error=oauth_failed", req.url));
  }
}
