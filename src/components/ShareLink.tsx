"use client";

import { useState } from "react";
import { useTripStore } from "@/stores/tripStore";

export default function ShareLink() {
  const { currentItinerary } = useTripStore();
  const [shareUrl, setShareUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!currentItinerary) return null;

  const generateLink = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId: currentItinerary.tripId }),
      });
      const payload = await response.json();
      if (!response.ok)
        throw new Error(payload.error || "Could not generate share link");
      setShareUrl(payload.shareUrl);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to generate link");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mt-6 rounded bg-white p-4 shadow">
      <h2 className="text-xl font-semibold">Share itinerary</h2>
      {!shareUrl ? (
        <button
          type="button"
          onClick={generateLink}
          disabled={loading}
          className="mt-3 rounded bg-green-600 px-4 py-2 font-medium text-white disabled:opacity-60"
        >
          {loading ? "Generating..." : "Generate share link"}
        </button>
      ) : (
        <div className="mt-3 space-y-2">
          <input
            readOnly
            className="w-full rounded border p-2"
            value={shareUrl}
          />
          <button
            type="button"
            onClick={copyLink}
            className="rounded border px-3 py-2"
          >
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  );
}
