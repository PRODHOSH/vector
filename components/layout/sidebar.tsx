import { createClient } from "@/utils/supabase/server";
import { SidebarClient } from "./sidebar-client";

export async function Sidebar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = {
    full_name: "Student",
    role: "Student",
    avatar_url: "",
    accessible_modules: ["dashboard", "tasks", "calendar", "settings"],
    status: "Active",
    is_admin: false,
  };

  if (user) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileData) {
      profile.full_name = profileData.full_name || user.user_metadata?.full_name || user.user_metadata?.name || profile.full_name;
      profile.avatar_url = profileData.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture || profile.avatar_url;
      profile.is_admin = !!profileData.is_admin;
    } else {
      profile.full_name = user.user_metadata?.full_name || user.user_metadata?.name || profile.full_name;
      profile.avatar_url = user.user_metadata?.avatar_url || user.user_metadata?.picture || profile.avatar_url;
    }
  }

  const initials = profile.full_name.substring(0, 1).toUpperCase();

  return <SidebarClient profile={profile} email={user?.email} initials={initials} />;
}
