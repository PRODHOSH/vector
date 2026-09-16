import { createClient } from "@/utils/supabase/server";
import { MobileNav } from "./mobile-nav";

export async function MobileNavLoader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let role = "Employee";
  let accessibleModules: string[] = ["dashboard", "tasks", "calendar"];
  if (user) {
    const { data } = await supabase.from("profiles").select("role, accessible_modules").eq("id", user.id).single();
    if (data) {
      role = data.role;
      accessibleModules = data.accessible_modules || accessibleModules;
    }
  }

  return <MobileNav role={role} accessibleModules={accessibleModules} />;
}
