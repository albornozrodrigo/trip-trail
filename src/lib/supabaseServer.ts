import { createClient } from "@supabase/supabase-js";

export function createServerSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
    const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "placeholder-publishable-key";
    return createClient(supabaseUrl, supabasePublishableKey);
}
