import { NextResponse } from "next/server";
import { google } from "googleapis";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", origin));
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${origin}/api/integrations/google-callback`
  );

  const scopes = [
    'https://www.googleapis.com/auth/calendar.readonly'
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent' // Forces it to return a refresh token every time
  });

  return NextResponse.redirect(url);
}
