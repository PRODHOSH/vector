import { createClient } from "@/utils/supabase/server";
import { CommandMenu } from "./command-menu";

export async function CommandMenuLoader() {
  const supabase = await createClient();

  const [tasksRes] = await Promise.all([
    supabase.from("tasks").select("id, title").is("deleted_at", null).order("updated_at", { ascending: false }).limit(30),
  ]);

  return (
    <CommandMenu
      searchItems={{
        tasks: tasksRes.data || [],
      }}
    />
  );
}
