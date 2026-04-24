import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as "signup" | "recovery" | null;

  if (!tokenHash || !type) {
    return NextResponse.redirect(`${origin}/auth/login`);
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });

  if (error) {
    return NextResponse.redirect(`${origin}/auth/login?error=verification_failed`);
  }

  return NextResponse.redirect(`${origin}/`);
}
