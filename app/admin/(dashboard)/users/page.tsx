import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/server-admin";
import { UsersTable } from "./users-table";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const currentUserId = user?.id || "";

  const adminClient = createAdminClient();

  const { data: profiles } = await adminClient
    .from("profiles")
    .select("*")
    .order("updated_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground mt-2">
          Manage and view all registered users.
        </p>
      </div>

      <UsersTable 
        initialProfiles={profiles || []} 
        currentUserId={currentUserId} 
      />
    </div>
  );
}
