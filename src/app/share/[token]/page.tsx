import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

interface SharePageProps {
  params: Promise<{ token: string }>;
}

export default async function SharePage({ params }: SharePageProps) {
  const { token } = await params;
  const supabase = createServerSupabaseClient();

  const { data: link } = await supabase
    .from("share_links")
    .select("trip_id")
    .eq("token", token)
    .single();

  if (!link) {
    notFound();
  }

  const { data: trip } = await supabase
    .from("trips")
    .select("*")
    .eq("id", link.trip_id)
    .single();
  const { data: items } = await supabase
    .from("itineraries")
    .select("*")
    .eq("trip_id", link.trip_id)
    .order("day_number", { ascending: true })
    .order("activity_order", { ascending: true });

  if (!trip || !items) {
    notFound();
  }

  const grouped = items.reduce<Record<string, typeof items>>((acc, row) => {
    const key = String(row.day_number);
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-3xl font-bold">{trip.destination}</h1>
      <p className="mb-6 text-sm text-zinc-600">
        {trip.date_from} to {trip.date_to} • Shared itinerary (read-only)
      </p>
      <div className="space-y-6">
        {Object.entries(grouped).map(([day, dayItems]) => (
          <section key={day} className="rounded border bg-white p-4">
            <h2 className="mb-3 text-xl font-semibold">Day {day}</h2>
            <div className="space-y-2">
              {dayItems.map((item) => (
                <div key={item.id} className="rounded bg-zinc-50 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium">{item.activity_name}</p>
                    <p className="text-sm text-blue-700">
                      {item.time_start || ""}{" "}
                      {item.time_end ? `- ${item.time_end}` : ""}
                    </p>
                  </div>
                  <p className="text-sm text-zinc-600">{item.location}</p>
                  <p className="text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
