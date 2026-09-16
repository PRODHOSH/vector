"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData) {
  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const priority = formData.get("priority")?.toString() || "medium";
  const dueDateRaw = formData.get("due_date")?.toString();
  const dueDateISO = formData.get("dueDateISO")?.toString();

  if (!title) throw new Error("Title is required");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("tasks").insert({
    user_id: user.id,
    title,
    description: description || null,
    priority: priority.toLowerCase(),
    due_date: dueDateISO ? new Date(dueDateISO).toISOString() : (dueDateRaw ? new Date(dueDateRaw).toISOString() : null),
    status: "todo"
  });

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard/calendar");
}

export async function updateTask(id: string, formData: FormData) {
  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const priority = formData.get("priority")?.toString() || "medium";
  const dueDateRaw = formData.get("due_date")?.toString();
  const dueDateISO = formData.get("dueDateISO")?.toString();

  if (!title) throw new Error("Title is required");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("tasks")
    .update({
      title,
      description: description || null,
      priority: priority.toLowerCase(),
      due_date: dueDateISO ? new Date(dueDateISO).toISOString() : (dueDateRaw ? new Date(dueDateRaw).toISOString() : null),
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard/calendar");
}

export async function updateTaskStatus(id: string, newStatus: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  let statusEnum = "todo";
  if (newStatus === "To Do") statusEnum = "todo";
  if (newStatus === "In Progress") statusEnum = "in_progress";
  if (newStatus === "Done") statusEnum = "done";

  const { error } = await supabase
    .from("tasks")
    .update({ status: statusEnum })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard/calendar");
}

export async function toggleTaskStatus(id: string, currentStatus: "pending" | "completed") {
  // Legacy toggle used by some older components (if any left)
  const newStatus = currentStatus === "pending" ? "Done" : "To Do";
  await updateTaskStatus(id, newStatus);
}

export async function deleteTask(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard/calendar");
}

export async function checkAndSendOverdueEmails() {
  // No-op for now as we don't send emails
  return;
}
