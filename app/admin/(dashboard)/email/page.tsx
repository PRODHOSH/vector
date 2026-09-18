import { createAdminClient } from "@/utils/supabase/server-admin";
import { EmailForm } from "./email-form";

export default async function AdminEmailPage() {
  const adminClient = createAdminClient();

  // Fetch users to populate the email autocomplete
  const { data: profiles } = await adminClient
    .from("profiles")
    .select("id, email, full_name, avatar_url")
    .order("full_name", { ascending: true });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Email Notifications</h1>
        <p className="text-muted-foreground mt-2">
          Send emails to users directly from the dashboard using Resend.
        </p>
      </div>

      <EmailForm users={profiles || []} />
    </div>
  );
}
