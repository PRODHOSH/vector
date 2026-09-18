import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const DEFAULT_SENDER = 'Vector OS <internal@prodhosh.me>';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from = DEFAULT_SENDER }: SendEmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("Skipping email send: RESEND_API_KEY not set");
    return { success: false, error: "Missing API Key" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}
