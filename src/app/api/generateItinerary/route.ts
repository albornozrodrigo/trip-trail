import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { generateItinerary, ItineraryRequest } from "@/lib/anthropic";

function splitTimeRange(time: string): { start: string | null; end: string | null } {
  const parts = time.split("-").map((v) => v.trim());
  if (parts.length !== 2) return { start: null, end: null };
  return { start: parts[0], end: parts[1] };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ItineraryRequest;
    const { destination, dateFrom, dateTo, numTravelers, style } = body;

    if (!destination || !dateFrom || !dateTo || !numTravelers) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const itinerary = await generateItinerary({
      destination,
      dateFrom,
      dateTo,
      numTravelers,
      style,
    });

    const { data: trip, error: tripError } = await supabase
      .from("trips")
      .insert({
        user_id: userId,
        destination,
        date_from: dateFrom,
        date_to: dateTo,
        num_travelers: numTravelers,
        travel_style: style || [],
      })
      .select()
      .single();

    if (tripError || !trip) {
      throw tripError || new Error("Could not create trip");
    }

    const inserts = itinerary.flatMap((day) =>
      day.activities.map((activity, index) => {
        const times = splitTimeRange(activity.time);
        return {
          trip_id: trip.id,
          day_number: day.dayNumber,
          activity_order: index,
          activity_name: activity.name,
          location: activity.location,
          time_start: times.start,
          time_end: times.end,
          description: activity.description,
        };
      }),
    );

    if (inserts.length > 0) {
      const { error: insertError } = await supabase.from("itineraries").insert(inserts);
      if (insertError) throw insertError;
    }

    return NextResponse.json({ tripId: trip.id, itinerary });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate itinerary";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
