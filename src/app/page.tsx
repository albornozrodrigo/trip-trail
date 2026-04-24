"use client";

import TripForm from "@/components/TripForm";
import ItineraryDisplay from "@/components/ItineraryDisplay";
import ShareLink from "@/components/ShareLink";
import { useTripStore } from "@/stores/tripStore";

export default function Home() {
  const { currentItinerary, error } = useTripStore();

  return (
    <div className="min-h-screen bg-zinc-100 py-10">
      <main className="mx-auto max-w-4xl px-4">
        <TripForm />
        {error ? (
          <div className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-red-700">
            {error}
          </div>
        ) : null}
        {currentItinerary ? (
          <>
            <ItineraryDisplay itinerary={currentItinerary} />
            <ShareLink />
          </>
        ) : (
          <p className="mt-6 text-center text-sm text-zinc-500">
            Fill the form to generate your first itinerary.
          </p>
        )}
      </main>
    </div>
  );
}
