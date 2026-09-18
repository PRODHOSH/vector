import { NextResponse } from "next/server";
import { google } from "googleapis";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: integration } = await supabase
    .from("user_integrations")
    .select("*")
    .eq("user_id", user.id)
    .eq("provider", "google")
    .single();

  if (!integration || !integration.refresh_token) {
    return NextResponse.json({ error: "Google Calendar not connected" }, { status: 400 });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    access_token: integration.access_token,
    refresh_token: integration.refresh_token,
    expiry_date: integration.expires_at ? new Date(integration.expires_at).getTime() : null,
  });

  // Automatically handle token refresh if needed
  oauth2Client.on('tokens', async (tokens) => {
    if (tokens.refresh_token) {
      await supabase.from("user_integrations").update({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null
      }).eq("id", integration.id);
    } else {
      await supabase.from("user_integrations").update({
        access_token: tokens.access_token,
        expires_at: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null
      }).eq("id", integration.id);
    }
  });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  
  try {
    const timeMin = new Date();
    timeMin.setDate(timeMin.getDate() - 30); // Look back 30 days
    const timeMax = new Date();
    timeMax.setDate(timeMax.getDate() + 90); // Look ahead 90 days

    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = res.data.items;
    if (!events || events.length === 0) {
      return NextResponse.json({ success: true, count: 0 });
    }

    let insertedCount = 0;

    for (const event of events) {
      if (!event.start || !event.summary) continue;

      // Determine due date (prefer dateTime over date for all-day events)
      const dueDateStr = event.start.dateTime || event.start.date;
      if (!dueDateStr) continue;

      const dueDate = new Date(dueDateStr);

      // We map this to a task
      const { error } = await supabase.from('tasks').upsert({
        user_id: user.id,
        title: event.summary,
        description: event.description || null,
        due_date: dueDate.toISOString(),
        status: 'todo',
        priority: 'medium',
        external_source: 'google',
        external_id: event.id
      }, {
        onConflict: 'external_source, external_id', // Only works if we have the unique constraint
        ignoreDuplicates: true // We don't want to override if the user changed the status to 'done' in Vector OS
      });

      if (!error) insertedCount++;
    }

    return NextResponse.json({ success: true, count: insertedCount });
  } catch (error: any) {
    console.error('The API returned an error: ' + error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
