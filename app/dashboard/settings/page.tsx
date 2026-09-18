import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "./settings-form";
import { IntegrationsCard } from "./integrations-card";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: integration } = await supabase
    .from("user_integrations")
    .select("id")
    .eq("user_id", user.id)
    .eq("provider", "google")
    .single();

  const currentFullName = profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || "Student";
  const currentAvatar = profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture || "";

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Settings" 
        description="Manage your profile and account preferences."
      />

      <div className="grid grid-cols-1 gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Update your personal information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SettingsForm 
              initialName={currentFullName} 
              initialAvatar={currentAvatar} 
              email={user.email || ""} 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
            <CardDescription>
              Connect third-party services to Vector OS.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IntegrationsCard isConnected={!!integration} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
