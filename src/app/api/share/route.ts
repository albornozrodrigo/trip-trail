import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function POST(request: NextRequest) {
  try {
    const { tripId } = (await request.json()) as { tripId?: string };
    if (!tripId) {
      return NextResponse.json({ error: "Trip ID required" }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: trip } = await supabase
      .from("trips")
      .select("id")
      .eq("id", tripId)
      .eq("user_id", userId)
      .single();

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    const token = randomUUID();
    const { error } = await supabase.from("share_links").insert({ trip_id: tripId, token });
    if (error) throw error;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    return NextResponse.json({ shareUrl: `${baseUrl}/share/${token}`, token });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Share creation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
