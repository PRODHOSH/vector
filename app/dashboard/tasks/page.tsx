import { PageHeader } from "@/components/ui/page-header";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { TasksClient } from "./tasks-client";

export default async function TasksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Tasks" 
        description="Manage all your student tasks in one place."
      />

      <TasksClient initialTasks={tasks || []} />
    </div>
  );
}
