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
  const headline = isOverdue ? "Deadline Passed!" : "Deadline Approaching!";
  const message = isOverdue
    ? "One of your tasks has missed its deadline. Log in to update its status or reschedule it."
    : "One of your tasks is due within the next 24 hours. Keep up the momentum and get it done!";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${headline}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F9F9F7;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F9F9F7; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); max-width: 600px; width: 100%;">
                <tr>
                  <td style="background-color: #111111; padding: 24px; text-align: center;">
                    <h1 style="color: #F9F9F7; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Vector OS</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 32px;">
                    <h2 style="color: ${color}; margin-top: 0; margin-bottom: 16px; font-size: 20px;">${headline}</h2>
                    <p style="color: #4A5568; font-size: 16px; line-height: 1.5; margin-top: 0; margin-bottom: 24px;">
                      Hi ${userName},<br><br>
                      ${message}
                    </p>
                    
                    <div style="background-color: #F7FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 16px; margin-bottom: 32px;">
                      <p style="margin: 0; color: #111111; font-weight: 600; font-size: 18px;">${taskTitle}</p>
                      <p style="margin: 8px 0 0 0; color: #718096; font-size: 14px;">
                        Due: ${dueDate}
                      </p>
                    </div>

                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="border-radius: 4px;" bgcolor="#111111">
                          <a href="https://vector-os.com/dashboard/tasks" target="_blank" style="font-size: 16px; font-weight: bold; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F9F9F7; text-decoration: none; border-radius: 4px; padding: 12px 24px; border: 1px solid #111111; display: inline-block;">Open Dashboard</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #F7FAFC; padding: 24px; text-align: center; border-top: 1px solid #E2E8F0;">
                    <p style="color: #A0AEC0; font-size: 12px; margin: 0;">
                      You are receiving this because this task is active in your Vector OS account.
                    </p>
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
