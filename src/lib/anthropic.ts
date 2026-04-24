import Anthropic from "@anthropic-ai/sdk";

export interface ItineraryRequest {
  destination: string;
  dateFrom: string;
  dateTo: string;
  numTravelers: number;
  style?: string[];
}

export interface Activity {
  time: string;
  name: string;
  location: string;
  description: string;
}

export interface ItineraryDay {
  date: string;
  dayNumber: number;
  activities: Activity[];
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function dayCount(dateFrom: string, dateTo: string) {
  const start = new Date(dateFrom);
  const end = new Date(dateTo);
  const ms = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)) + 1);
}

function buildItineraryPrompt(request: ItineraryRequest): string {
  return `You are an expert travel planner.

Trip:
- Destination: ${request.destination}
- Date from: ${request.dateFrom}
- Date to: ${request.dateTo}
- Travelers: ${request.numTravelers}
- Style: ${(request.style || []).join(", ") || "balanced"}

Generate ${dayCount(request.dateFrom, request.dateTo)} itinerary days.
Return strict JSON array only, no markdown:
[
  {
    "date": "YYYY-MM-DD",
    "dayNumber": 1,
    "activities": [
      {
        "time": "09:00 - 11:00",
        "name": "Activity",
        "location": "Place",
        "description": "Short explanation"
      }
    ]
  }
]`;
}

export async function generateItinerary(request: ItineraryRequest): Promise<ItineraryDay[]> {
  const prompt = buildItineraryPrompt(request);

  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const textPart = message.content.find((part) => part.type === "text");
  const responseText = textPart && textPart.type === "text" ? textPart.text : "";
  const jsonMatch = responseText.match(/\[[\s\S]*\]/);

  if (!jsonMatch) {
    throw new Error("Claude did not return valid JSON array");
  }

  return JSON.parse(jsonMatch[0]) as ItineraryDay[];
}
