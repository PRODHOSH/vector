type WeeklyReportProps = {
  userName: string;
  completedTasks: string[];
  pendingTasks: string[];
};

export const getWeeklyReportEmailHtml = ({ userName, completedTasks, pendingTasks }: WeeklyReportProps) => {
  const completedList = completedTasks.length > 0 
    ? completedTasks.map(t => `<li style="margin-bottom: 8px;">✅ ${t}</li>`).join('')
    : `<li style="margin-bottom: 8px; color: #999;">No tasks checked off this week. You've got this next week!</li>`;

  const pendingList = pendingTasks.length > 0
    ? pendingTasks.map(t => `<li style="margin-bottom: 8px;">🎯 ${t}</li>`).join('')
    : `<li style="margin-bottom: 8px; color: #999;">Inbox zero! You're completely caught up.</li>`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Weekly Wrap-up</title>
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
              <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 16px; color: #111111; letter-spacing: -0.5px;">Hey ${userName},</h1>
              
              <p style="font-size: 16px; color: #555555; margin: 0 0 24px; line-height: 1.5;">
                Sunday is a great time to reflect on the past week and gear up for the next. Here is a quick snapshot of what you've accomplished and what's still on your plate in Vector OS.
              </p>
              
              <h2 style="font-size: 18px; font-weight: 600; color: #111111; margin: 32px 0 16px;">What You Shipped This Week 🚀</h2>
              <ul style="font-size: 15px; color: #555555; padding-left: 0; list-style-type: none; margin: 0 0 32px;">
                ${completedList}
              </ul>

              <h2 style="font-size: 18px; font-weight: 600; color: #111111; margin: 0 0 16px;">On Deck for Next Week 📌</h2>
              <ul style="font-size: 15px; color: #555555; padding-left: 0; list-style-type: none; margin: 0 0 32px;">
                ${pendingList}
              </ul>
              
              <p style="font-size: 16px; color: #555555; margin: 0 0 32px; line-height: 1.5;">
                Take a breath, prioritize these tasks, and let's crush it this week!
              </p>

              <!-- CTA Button -->
              <table border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" bgcolor="#111111" style="border-radius: 9999px;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://vector.prodhosh.me'}" target="_blank" style="display: inline-block; padding: 14px 36px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 9999px; border: 1px solid #111111;">
                      Open Vector OS
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
              This is a weekly automated summary of your tasks.<br><br>
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
};
