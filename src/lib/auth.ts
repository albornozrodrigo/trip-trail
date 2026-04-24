import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function getCurrentUser() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function signOutUser() {
  const supabase = createServerSupabaseClient();
  await supabase.auth.signOut();
}
