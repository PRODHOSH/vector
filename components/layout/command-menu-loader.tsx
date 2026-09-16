import { createClient } from "@/utils/supabase/server";
import { CommandMenu } from "./command-menu";

export async function CommandMenuLoader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let role = "Employee";
  if (user) {
    const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (data) role = data.role;
  }

  const [tasksRes, projectsRes, contactsRes] = await Promise.all([
    supabase.from("tasks").select("id, title").is("deleted_at", null).order("updated_at", { ascending: false }).limit(30),
    supabase.from("projects").select("id, name").order("updated_at", { ascending: false }).limit(30),
    supabase.from("crm_contacts").select("id, full_name").order("updated_at", { ascending: false }).limit(30),
  ]);

  return (
    <CommandMenu
      role={role}
      searchItems={{
        tasks: tasksRes.data || [],
        projects: projectsRes.data || [],
        contacts: contactsRes.data || [],
      }}
    />
  );
}
