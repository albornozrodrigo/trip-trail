import { create } from "zustand";

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

export interface Itinerary {
  tripId: string;
  destination: string;
  dateFrom: string;
  dateTo: string;
  numTravelers: number;
  style: string[];
  days: ItineraryDay[];
}

interface TripStore {
  currentItinerary: Itinerary | null;
  loading: boolean;
  error: string | null;
  setItinerary: (itinerary: Itinerary) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearItinerary: () => void;
}

export const useTripStore = create<TripStore>((set) => ({
  currentItinerary: null,
  loading: false,
  error: null,
  setItinerary: (itinerary) => set({ currentItinerary: itinerary, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearItinerary: () => set({ currentItinerary: null }),
}));
