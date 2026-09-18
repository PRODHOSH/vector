import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("user_integrations")
    .delete()
    .match({ user_id: user.id, provider: "google" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Also remove imported google tasks? Let's keep them, just don't sync anymore.
  return NextResponse.json({ success: true });
}
