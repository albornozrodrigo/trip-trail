import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

interface RouteParams {
  params: Promise<{ tripId: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { tripId } = await params;
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("itineraries")
    .select("*")
    .eq("trip_id", tripId)
    .order("day_number", { ascending: true })
    .order("activity_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ activities: data || [] });
}
