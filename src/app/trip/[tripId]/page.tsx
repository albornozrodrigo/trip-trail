import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

interface TripPageProps {
  params: Promise<{ tripId: string }>;
}

export default async function TripPage({ params }: TripPageProps) {
  const { tripId } = await params;
  const supabase = createServerSupabaseClient();

  const { data: trip } = await supabase.from("trips").select("*").eq("id", tripId).single();
  const { data: items } = await supabase
    .from("itineraries")
    .select("*")
    .eq("trip_id", tripId)
    .order("day_number", { ascending: true })
    .order("activity_order", { ascending: true });

  if (!trip || !items) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-3xl font-bold">{trip.destination}</h1>
      <p className="mb-6 text-sm text-zinc-600">
        {trip.date_from} to {trip.date_to} • {trip.num_travelers} traveler(s)
      </p>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="rounded border bg-white p-3">
            <div className="flex items-center justify-between">
              <strong>{item.activity_name}</strong>
              <span className="text-sm text-blue-700">
                {item.time_start || ""} {item.time_end ? `- ${item.time_end}` : ""}
              </span>
            </div>
            <p className="text-sm text-zinc-600">{item.location}</p>
            <p className="text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
