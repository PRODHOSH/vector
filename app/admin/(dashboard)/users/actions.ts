"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/server-admin";
import { revalidatePath } from "next/cache";

export async function toggleUserRole(userId: string, currentIsAdmin: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");
  
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  
  if (!profile?.is_admin) throw new Error("Forbidden");

  const adminClient = createAdminClient();
  const { error } = await adminClient.from("profiles").update({ is_admin: !currentIsAdmin }).eq("id", userId);
  
  if (error) throw new Error(error.message);
  
  revalidatePath("/admin/users");
}

export async function deleteUser(userId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");
  if (user.id === userId) throw new Error("Cannot delete yourself");
  
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  
  if (!profile?.is_admin) throw new Error("Forbidden");

  const adminClient = createAdminClient();
  const { error } = await adminClient.auth.admin.deleteUser(userId);
  
  if (error) throw new Error(error.message);
  
  revalidatePath("/admin/users");
}

export async function updateUser(userId: string, data: { full_name?: string, email?: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");
  
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  
  if (!profile?.is_admin) throw new Error("Forbidden");

  const adminClient = createAdminClient();
  
  // If email is provided, we must update it in auth.users first
  if (data.email) {
    const { error: authError } = await adminClient.auth.admin.updateUserById(userId, { email: data.email });
    if (authError) throw new Error(`Auth Error: ${authError.message}`);
  }

  // Update profiles table
  const { error: profileError } = await adminClient.from("profiles").update(data).eq("id", userId);
  if (profileError) throw new Error(`Profile Error: ${profileError.message}`);
  
  revalidatePath("/admin/users");
}
