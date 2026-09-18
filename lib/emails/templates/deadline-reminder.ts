export function getDeadlineReminderEmailHtml({
  userName,
  taskTitle,
  dueDate,
  isOverdue,
}: {
  userName: string;
  taskTitle: string;
  dueDate: string;
  isOverdue: boolean;
}) {
  const color = isOverdue ? "#E53E3E" : "#DD6B20";
  const headline = isOverdue ? "Deadline Passed ⚠️" : "Deadline Approaching ⏳";
  const message = isOverdue
    ? "It looks like one of your tasks slipped past its deadline. Don't stress—it happens to the best of us! Take a deep breath, log in, and let's get it rescheduled or knocked out today."
    : "Just a quick heads-up: you have a task due within the next 24 hours. You're doing great, keep up the momentum and let's get this crossed off your list!";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${headline}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #eaeaea; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
          
          <!-- Banner Image -->
          <tr>
            <td align="center" style="background-color: #ffffff; border-bottom: 1px solid #eaeaea;">
              <img src="https://res.cloudinary.com/ddn6tl045/image/upload/v1789580303/vector-email-banner_axwcad.png" alt="Vector OS" width="600" style="width: 100%; max-width: 600px; height: auto; display: block; border: 0;" />
            </td>
          </tr>

          <!-- Content Area -->
          <tr>
            <td align="left" style="padding: 48px 40px 40px;">
              <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 16px; color: ${color}; letter-spacing: -0.5px;">${headline}</h1>
              
              <p style="font-size: 16px; color: #555555; margin: 0 0 24px; line-height: 1.5;">
                Hey ${userName},<br><br>
                ${message}
              </p>
              
              <div style="background-color: #f9fafb; border: 1px solid #eaeaea; border-radius: 8px; padding: 20px; margin-bottom: 32px;">
                <p style="margin: 0; color: #111111; font-weight: 600; font-size: 18px;">${taskTitle}</p>
                <p style="margin: 8px 0 0 0; color: #718096; font-size: 14px;">
                  Due: <strong>${dueDate}</strong>
                </p>
              </div>
              
              <p style="font-size: 16px; color: #555555; margin: 0 0 32px; line-height: 1.5; text-align: center;">
                You've got this! 🚀
              </p>

              <!-- CTA Button -->
              <table border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" bgcolor="#111111" style="border-radius: 9999px;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://vector.prodhosh.me'}/dashboard/tasks" target="_blank" style="display: inline-block; padding: 14px 36px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 9999px; border: 1px solid #111111;">
                      Open Dashboard
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px;">
          <tr>
            <td align="center" style="padding: 24px 20px; font-size: 12px; color: #999999; text-align: center;">
              &copy; ${new Date().getFullYear()} Vector OS. All rights reserved.<br>
              You are receiving this because this task is active in your Vector OS account.<br><br>
              Have a question or issue? Contact us at <a href="mailto:support@prodhosh.me" style="color: #666666; text-decoration: underline;">support@prodhosh.me</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
