import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/server-admin";

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the user is an admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { fromName, fromEmail, to, subject, message } = body;

    if (!to || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
       return NextResponse.json({ error: "Server configuration error: Resend API Key is missing." }, { status: 500 });
    }

    const adminClient = createAdminClient();

    // Parse the comma-separated emails into an array
    const toArray = to.split(',').map((email: string) => email.trim()).filter(Boolean);
    const fromString = fromName && fromEmail ? `${fromName} <${fromEmail}>` : "Vector Admin <internal@prodhosh.me>";

    const { data, error } = await resend.emails.send({
      from: fromString,
      to: toArray,
      subject: subject,
      text: message,
    });

    if (error) {
      console.error("Resend API Error:", error);
      
      // Log failure
      await adminClient.from("admin_email_logs").insert({
        admin_id: user.id,
        to_email: to,
        subject: subject,
        status: "failed",
        error_message: error.message
      });
      
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Log success
    await adminClient.from("admin_email_logs").insert({
      admin_id: user.id,
      to_email: to,
      subject: subject,
      status: "success"
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
