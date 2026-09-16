import { PageHeader } from "@/components/ui/page-header";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { CalendarClient } from "./calendar-client";

export default async function CalendarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .not("due_date", "is", null) // Only tasks with due dates
    .order("due_date", { ascending: true });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Calendar" 
        description="View your upcoming tasks and deadlines."
      />

      <CalendarClient tasks={tasks || []} />
    </div>
  );
}
