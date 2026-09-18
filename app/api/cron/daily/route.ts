import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server-admin";
import { sendEmail } from "@/lib/emails/sender";
import { getDeadlineReminderEmailHtml } from "@/lib/emails/templates/deadline-reminder";
import { format } from "date-fns";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();
    
    // 1. Approaching deadlines (due within 24h, not done, reminder not sent)
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    const { data: approachingTasks, error: err1 } = await supabase
      .from('tasks')
      .select('id, title, due_date, user_id, profiles(email, full_name)')
      .neq('status', 'done')
      .is('reminder_sent_at', null)
      .not('due_date', 'is', null)
      .gt('due_date', now.toISOString())
      .lt('due_date', tomorrow.toISOString());

    if (err1) throw err1;

    // 2. Overdue deadlines (due before now, not done, overdue not sent)
    const { data: overdueTasks, error: err2 } = await supabase
      .from('tasks')
      .select('id, title, due_date, user_id, profiles(email, full_name)')
      .neq('status', 'done')
      .is('overdue_notified_at', null)
      .not('due_date', 'is', null)
      .lt('due_date', now.toISOString());

    if (err2) throw err2;

    const emailsToSend = [];
    const approachingIds = [];
    const overdueIds = [];

    // Queue approaching emails
    if (approachingTasks) {
      for (const task of approachingTasks) {
        if (!task.profiles) continue;
        const profile = Array.isArray(task.profiles) ? task.profiles[0] : task.profiles;
        if (!profile || !profile.email) continue;
        
        emailsToSend.push(
          sendEmail({
            to: profile.email,
            subject: "Action Required: Deadline Approaching ⏳",
            html: getDeadlineReminderEmailHtml({
              userName: profile.full_name || "Student",
              taskTitle: task.title,
              dueDate: format(new Date(task.due_date), "MMM d, yyyy 'at' h:mm a"),
              isOverdue: false,
            }),
          })
        );
        approachingIds.push(task.id);
      }
    }

    // Queue overdue emails
    if (overdueTasks) {
      for (const task of overdueTasks) {
        if (!task.profiles) continue;
        const profile = Array.isArray(task.profiles) ? task.profiles[0] : task.profiles;
        if (!profile || !profile.email) continue;
        
        emailsToSend.push(
          sendEmail({
            to: profile.email,
            subject: "Alert: Deadline Passed 🚨",
            html: getDeadlineReminderEmailHtml({
              userName: profile.full_name || "Student",
              taskTitle: task.title,
              dueDate: format(new Date(task.due_date), "MMM d, yyyy 'at' h:mm a"),
              isOverdue: true,
            }),
          })
        );
        overdueIds.push(task.id);
      }
    }

    // Wait for all emails to send
    await Promise.all(emailsToSend);

    // Update database flags to prevent duplicates
    if (approachingIds.length > 0) {
      await supabase.from('tasks').update({ reminder_sent_at: now.toISOString() }).in('id', approachingIds);
    }
    if (overdueIds.length > 0) {
      await supabase.from('tasks').update({ overdue_notified_at: now.toISOString() }).in('id', overdueIds);
    }

    return NextResponse.json({ 
      success: true, 
      sent: emailsToSend.length,
      approaching: approachingIds.length,
      overdue: overdueIds.length
    });
  } catch (error: any) {
    console.error("Daily Cron Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
