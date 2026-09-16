import { createClient } from "./supabase/server";
import { redirect } from "next/navigation";

// Keeping these for backwards compatibility or safe fallbacks if DB is not updated yet
export const ADMIN_ROLES = ["CEO & Founder", "Admin", "C-Suite"];
export const ELEVATED_ROLES = ["CEO & Founder", "Admin", "C-Suite"];
export const ALL_ROLES = ["CEO & Founder", "Admin", "C-Suite", "Employee", "Intern"];

export function isAdmin(role: string) {
  return ADMIN_ROLES.includes(role);
}

export function isElevated(role: string) {
  return ELEVATED_ROLES.includes(role);
}

export async function checkAccess(moduleName: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  // Attempt to fetch with role relationship for dynamic RBAC
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, accessible_modules, full_name, avatar_url, position, roles(is_admin, accessible_modules)")
    .eq("id", user.id)
    .single();

  if (!profile) return redirect("/login");

  // Check if roles relation exists (Dynamic RBAC active)
  let isElevatedRole = false;
  let allowedModules: string[] = [];

  if (profile.roles && !Array.isArray(profile.roles)) {
    // @ts-expect-error - dynamic property
    isElevatedRole = profile.roles.is_admin || profile.role === "C-Suite";
    // @ts-expect-error - dynamic property
    allowedModules = profile.roles.accessible_modules || [];
  } else {
    // Fallback to legacy hardcoded logic if the SQL script hasn't been run yet
    isElevatedRole = ELEVATED_ROLES.includes(profile.role);
    allowedModules = profile.accessible_modules || ["dashboard", "tasks", "calendar"];
  }

  // Elevated roles bypass module gating
  if (isElevatedRole) {
    return { user, profile };
  }

  if (!allowedModules.includes(moduleName.toLowerCase())) {
    return redirect("/?error=UnauthorizedAccess");
  }

  return { user, profile };
}
