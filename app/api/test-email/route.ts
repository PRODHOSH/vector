import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/emails/sender";
import { getDeadlineReminderEmailHtml } from "@/lib/emails/templates/deadline-reminder";
import { getWeeklyReportEmailHtml } from "@/lib/emails/templates/weekly-report";

export async function GET() {
  const targetEmail = "prodhosh8cpal@gmail.com";

  try {
    // 1. Send Deadline Reminder (Approaching)
    await sendEmail({
      to: targetEmail,
      subject: "[TEST] Action Required: Deadline Approaching ⏳",
      html: getDeadlineReminderEmailHtml({
        userName: "Prodhosh",
        taskTitle: "Finish Advanced Calculus Assignment",
        dueDate: "Sep 19, 2026 at 11:59 PM",
        isOverdue: false,
      }),
    });

    // 2. Send Deadline Reminder (Overdue)
    await sendEmail({
      to: targetEmail,
      subject: "[TEST] Alert: Deadline Passed 🚨",
      html: getDeadlineReminderEmailHtml({
        userName: "Prodhosh",
        taskTitle: "Submit Literature Review Draft",
        dueDate: "Sep 17, 2026 at 5:00 PM",
        isOverdue: true,
      }),
    });

    // 3. Send Weekly Report
    await sendEmail({
      to: targetEmail,
      subject: "[TEST] Your Weekly Vector OS Wrap-up 📊",
      html: getWeeklyReportEmailHtml({
        userName: "Prodhosh",
        completedCount: 14,
        pendingCount: 5,
      }),
    });

    return NextResponse.json({ success: true, message: "Test emails sent!" });
  } catch (error: any) {
    console.error("Test email error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
