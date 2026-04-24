import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

interface RouteParams {
  params: Promise<{ tripId: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { tripId } = await params;
  const supabase = createServerSupabaseClient();
  const { data: trip, error } = await supabase.from("trips").select("*").eq("id", tripId).single();

  if (error || !trip) {
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  }

  return NextResponse.json(trip);
}
