"use client";

import { FormEvent, useState } from "react";
import { useTripStore } from "@/stores/tripStore";

const styleOptions = ["Culture", "Gastronomy", "Adventure", "Relaxation"];

export default function TripForm() {
  const { setLoading, setError, setItinerary, loading } = useTripStore();
  const [destination, setDestination] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [numTravelers, setNumTravelers] = useState(1);
  const [style, setStyle] = useState<string[]>([]);

  const toggleStyle = (value: string) => {
    setStyle((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generateItinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, dateFrom, dateTo, numTravelers, style }),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error || "Generation failed");
      }

      const payload = await response.json();
      setItinerary({
        tripId: payload.tripId,
        destination,
        dateFrom,
        dateTo,
        numTravelers,
        style,
        days: payload.itinerary,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="rounded bg-white p-6 shadow">
      <h1 className="mb-4 text-3xl font-bold">TripTrail</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 md:col-span-2">
          Destination
          <input
            className="rounded border p-2"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g. Tokyo"
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          Date from
          <input className="rounded border p-2" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} required />
        </label>
        <label className="flex flex-col gap-1">
          Date to
          <input className="rounded border p-2" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} required />
        </label>
        <label className="flex flex-col gap-1 md:col-span-2">
          Travelers
          <input
            className="rounded border p-2"
            type="number"
            min={1}
            max={20}
            value={numTravelers}
            onChange={(e) => setNumTravelers(Number(e.target.value))}
            required
          />
        </label>
      </div>
      <div className="mt-4">
        <p className="mb-2 text-sm font-medium">Travel style</p>
        <div className="flex flex-wrap gap-2">
          {styleOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => toggleStyle(option)}
              className={`rounded-full border px-3 py-1 text-sm ${
                style.includes(option) ? "bg-blue-600 text-white" : "bg-white text-zinc-700"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded bg-blue-600 p-3 font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Generating..." : "Generate itinerary"}
      </button>
    </form>
  );
}
