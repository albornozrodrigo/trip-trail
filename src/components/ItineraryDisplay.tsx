import { Itinerary } from "@/stores/tripStore";

interface Props {
  itinerary: Itinerary;
}

export default function ItineraryDisplay({ itinerary }: Props) {
  return (
    <div className="mt-8 space-y-6">
      {itinerary.days.map((day) => (
        <div key={day.dayNumber} className="rounded border bg-white p-4 shadow-sm">
          <h2 className="text-xl font-bold">Day {day.dayNumber}</h2>
          <p className="mb-4 text-sm text-zinc-500">{day.date}</p>
          <div className="space-y-3">
            {day.activities.map((activity, index) => (
              <div key={`${activity.name}-${index}`} className="rounded bg-zinc-50 p-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold">{activity.name}</h3>
                  <span className="text-sm font-medium text-blue-700">{activity.time}</span>
                </div>
                <p className="text-sm text-zinc-600">{activity.location}</p>
                <p className="mt-1 text-sm text-zinc-800">{activity.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
