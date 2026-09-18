export function getWeeklyReportEmailHtml({
  userName,
  completedCount,
  pendingCount,
}: {
  userName: string;
  completedCount: number;
  pendingCount: number;
}) {
  const isGreatWeek = completedCount > 0;
  const headline = isGreatWeek ? "Great work this week!" : "Here's your weekly wrap-up";
  const message = isGreatWeek 
    ? `You knocked out <strong>${completedCount}</strong> tasks this week. Take a moment to celebrate your progress before diving into what's next.`
    : `You have <strong>${pendingCount}</strong> tasks pending. A new week is a fresh start to build momentum. Let's get things done!`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Weekly Vector OS Report</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F9F9F7;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F9F9F7; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); max-width: 600px; width: 100%;">
                
                <!-- Header -->
                <tr>
                  <td style="background-color: #111111; padding: 24px; text-align: center;">
                    <h1 style="color: #F9F9F7; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Vector OS</h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 32px;">
                    <h2 style="color: #111111; margin-top: 0; margin-bottom: 16px; font-size: 22px;">${headline}</h2>
                    <p style="color: #4A5568; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 32px;">
                      Hi ${userName},<br><br>
                      ${message}
                    </p>
                    
                    <!-- Stats Grid -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
                      <tr>
                        <td width="48%" style="background-color: #F7FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 20px; text-align: center;">
                          <p style="color: #718096; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; margin: 0 0 8px 0;">Completed</p>
                          <p style="color: #38A169; font-size: 32px; font-weight: 700; margin: 0;">${completedCount}</p>
                        </td>
                        <td width="4%"></td>
                        <td width="48%" style="background-color: #F7FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 20px; text-align: center;">
                          <p style="color: #718096; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; margin: 0 0 8px 0;">Pending</p>
                          <p style="color: #3182CE; font-size: 32px; font-weight: 700; margin: 0;">${pendingCount}</p>
                        </td>
                      </tr>
                    </table>

                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="border-radius: 4px;" bgcolor="#111111">
                          <a href="https://vector-os.com/dashboard" target="_blank" style="font-size: 16px; font-weight: bold; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F9F9F7; text-decoration: none; border-radius: 4px; padding: 12px 24px; border: 1px solid #111111; display: inline-block;">Plan your week</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #F7FAFC; padding: 24px; text-align: center; border-top: 1px solid #E2E8F0;">
                    <p style="color: #A0AEC0; font-size: 12px; margin: 0;">
                      Sent automatically every week to keep you on track.<br>
                      Vector OS
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
