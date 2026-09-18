import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server-admin";
import { sendEmail } from "@/lib/emails/sender";
import { getWeeklyReportEmailHtml } from "@/lib/emails/templates/weekly-report";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();
    
    // Get all profiles with email
    const { data: profiles, error: profileErr } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .not('email', 'is', null);

    if (profileErr) throw profileErr;
    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ success: true, sent: 0 });
    }

    // Get all tasks updated in the last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    
    const { data: tasks, error: tasksErr } = await supabase
      .from('tasks')
      .select('id, user_id, status, title')
      .gte('updated_at', sevenDaysAgo);

    if (tasksErr) throw tasksErr;

    const emailsToSend = [];

    for (const profile of profiles) {
      const userTasks = tasks?.filter(t => t.user_id === profile.id) || [];
      const completedTasks = userTasks.filter(t => t.status === 'done');
      const pendingTasks = userTasks.filter(t => t.status !== 'done');

      // Only send if they had activity this week or have pending tasks
      if (completedTasks.length > 0 || pendingTasks.length > 0) {
        emailsToSend.push(
          sendEmail({
            to: profile.email!,
            subject: "Your Weekly Vector OS Wrap-up 🚀",
            html: getWeeklyReportEmailHtml({
              userName: profile.full_name || "Student",
              completedTasks: completedTasks.map(t => t.title),
              pendingTasks: pendingTasks.map(t => t.title),
            }),
          })
        );
      }
    }

    await Promise.all(emailsToSend);

    return NextResponse.json({ success: true, sent: emailsToSend.length });
  } catch (error: any) {
    console.error("Weekly Cron Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
