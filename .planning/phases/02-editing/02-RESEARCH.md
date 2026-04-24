# Phase 02: Editing & Personalization — Research

**Status:** Active  
**Updated:** April 24, 2026  
**Phase Goal:** Users own their itineraries — full control over activities and style

---

## Editing Technology Stack

### Drag & Drop Library

**Decision:** Use `dnd-kit` for React drag-and-drop

Why `dnd-kit` over alternatives:

- **vs. react-beautiful-dnd:** dnd-kit is actively maintained, better TypeScript support, lighter bundle
- **vs. react-dnd:** dnd-kit is modern, less boilerplate, cleaner component API
- **vs. SortableJS:** dnd-kit is React-native, not a third-party adapter

Setup:

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**Key feature:** Sensors (pointer, keyboard, touch) — works on mobile + desktop, accessible.

### Mapping Library

**Decision:** Use `mapbox-gl` for route visualization

Why Mapbox over Google Maps:

- **Offline support:** Critical for Phase 4 (offline mode)
- **Cost:** $0.50 per 1K requests (vs. Google's ~$7/1K)
- **Route optimization:** Mapbox Directions API for smart routing
- **Styling:** Powerful map theming, custom markers

Setup:

```bash
npm install mapbox-gl @mapbox/mapbox-gl-directions
npm install --save-dev @types/mapbox-gl
```

Supabase integration: Store map token in environment variables (Mapbox public token is safe to expose).

---

## Core Features — Phase 2

### 1. Drag & Drop Activity Reordering

**User Story:** "As a traveler, I want to reorder activities within a day without friction"

Implementation:

- Each day is a `<SortableContext>` with activity cards as draggable items
- On drop, update database immediately (optimistic UI)
- Show time recalculation (if activities have fixed times, auto-adjust end times)

**Data model change:**

```sql
ALTER TABLE itineraries ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
-- Add trigger to update trip.updated_at when itinerary changes
```

**Backend:** PATCH `/api/trips/:tripId/itinerary` accepts new activity order + times

### 2. Add/Remove/Swap Activities

**User Story:** "As a traveler, I want to add a custom activity or swap one out without regenerating the whole day"

Implementation:

- "Add activity" form with auto-suggestion (search Mapbox places API)
- Activity suggestions pull from Claude (context-aware for destination)
- Remove: mark deleted (soft delete or actual delete — for v1, actual delete is fine)
- Swap: select activity from "library" (preset activities for destination)

**New API endpoints:**

- `POST /api/trips/:tripId/activities` — Add custom activity
- `DELETE /api/trips/:tripId/activities/:activityId` — Remove
- `GET /api/activities/suggestions?destination=X&style=Y` — Claude-powered suggestions

### 3. Travel Style Preferences

**User Story:** "As a traveler, I want to customize the style to match my trip better"

Implementation:

- Move "Travel Style" tags from form into itinerary edit panel
- Styles: Culture, Gastronomy, Adventure, Relaxation (multi-select)
- On change → re-prompt Claude with new style for **next** generation (not retro-active edit)
- Allow users to "Regenerate day with new style" (optional feature)

**Data model:**

```sql
UPDATE trips SET travel_style = ARRAY['Culture', 'Adventure'] WHERE id = ?;
```

### 4. Integrated Map Visualization

**User Story:** "As a traveler, I want to see all activities on a map with route optimization"

Implementation:

- Interactive map showing day's activities as markers
- Route lines connecting activities (optimized for distance/time)
- Click marker → highlight activity card
- Click activity → pan map to marker

**Mapbox setup:**

```typescript
// src/components/ItineraryMap.tsx
import mapboxgl from "mapbox-gl";
import MapboxDirections from "@mapbox/mapbox-gl-directions";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Draw route between day's activities
// Use Directions API for optimization
```

**Performance concern:** For 10+ activities, route calculation may be slow. Solution:

- Cache routes for 24 hours
- Show loading skeleton while calculating
- Debounce map updates on activity reorder

### 5. Persist Edits

**User Story:** "As a traveler, I want my edits saved automatically without losing work"

Implementation:

- Auto-save on every change (debounced 1 second)
- Optimistic UI: show changes immediately, retry if server fails
- Conflict resolution: Last-write-wins (for MVP)

**Backend changes:**

- `PATCH /api/trips/:tripId/itinerary` accepts partial updates
- `updated_at` timestamp tracks changes
- Soft delete support (set `deleted_at` instead of hard delete)

---

## Data Flow — Phase 2

```
User opens itinerary
  ↓
Load trip + activities from DB
  ↓
Render day cards with dnd-kit sortable
  ↓
User drags activity
  ↓
Reorder in memory (optimistic)
  ↓
Debounce 1 second, then POST to server
  ↓
Save to DB
  ↓
If error: revert UI change + show toast
  ↓
User adds activity
  ↓
Show modal with suggestions from Claude
  ↓
Select + POST /api/trips/:tripId/activities
  ↓
Add to local state + DB
  ↓
Map refreshes with new marker
```

---

## Database Changes for Phase 2

**Add columns:**

```sql
ALTER TABLE itineraries ADD COLUMN deleted_at TIMESTAMP NULL;
ALTER TABLE itineraries ADD COLUMN custom_activity BOOLEAN DEFAULT FALSE;
ALTER TABLE trips ADD COLUMN last_edited_at TIMESTAMP DEFAULT NOW();

-- Indexes for performance
CREATE INDEX idx_itineraries_deleted_at ON itineraries(deleted_at);
CREATE INDEX idx_trips_last_edited_at ON trips(last_edited_at);

-- Trigger: Update trip.updated_at when activities change
CREATE OR REPLACE FUNCTION update_trip_edited_time()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE trips SET last_edited_at = NOW() WHERE id = NEW.trip_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_trip_edited
AFTER INSERT, UPDATE, DELETE ON itineraries
FOR EACH ROW EXECUTE FUNCTION update_trip_edited_time();
```

---

## API Additions for Phase 2

| Endpoint                                    | Method | Purpose                                         |
| ------------------------------------------- | ------ | ----------------------------------------------- |
| `/api/trips/:tripId/itinerary`              | PATCH  | Update activity order/times                     |
| `/api/trips/:tripId/activities`             | POST   | Add custom activity                             |
| `/api/trips/:tripId/activities/:activityId` | DELETE | Remove activity                                 |
| `/api/activities/suggestions`               | GET    | Claude-powered suggestions (destination, style) |
| `/api/routes/optimize`                      | POST   | Mapbox route optimization for a day             |

---

## Known Risks & Mitigations

| Risk                                   | Severity | Mitigation                                                                   |
| -------------------------------------- | -------- | ---------------------------------------------------------------------------- |
| Drag performance slow on mobile        | High     | Test dnd-kit on real mobile devices, use `pointer` sensor over mouse         |
| Map rendering slow (10+ activities)    | Medium   | Lazy-load map, cache routes, show skeleton while calculating                 |
| Claude suggestions too generic         | Medium   | Include destination context + travel style in prompt, human review first 100 |
| Route optimization fails               | Medium   | Fallback to simple line-drawing, show toast "Map preview not available"      |
| Concurrent edits overwrite each other  | Medium   | Implement optimistic locking (version field), last-write-wins for MVP        |
| Activity deletion cascades incorrectly | High     | Test RLS policies, ensure shared trips handle deletions correctly            |

---

## Validation Architecture

**Dimension 1 — Drag & Drop Interaction**

- Test: Reorder activity 1 ↔ 3 within day → saves correctly
- Test: Mobile touch drag → works without friction
- Test: Keyboard accessibility (arrow keys) → works
- Test: Undo/redo → NOT in Phase 2 (backlog)

**Dimension 2 — Activity Management**

- Test: Add custom "Lunch at restaurant X" → appears in list
- Test: Remove activity → deleted from DB + UI
- Test: Swap activity → new activity replaces old

**Dimension 3 — Map Visualization**

- Test: Map shows all activities for day
- Test: Route connects activities in correct order
- Test: Click marker → highlights card, click card → pans map
- Test: Map handles 10+ activities without lag

**Dimension 4 — Persistence**

- Test: Reorder → close browser → reopen → changes persisted
- Test: Network failure → optimistic UI reverts, toast shown
- Test: Concurrent edits → last-write-wins (consistent state)

**Dimension 5 — Performance**

- Test: Drag responsiveness <50ms latency
- Test: Map render time <2 seconds
- Test: API response <500ms for PATCH

---

## New Dependencies for Phase 2

```json
{
  "@dnd-kit/core": "^6.1.0",
  "@dnd-kit/sortable": "^7.0.2",
  "@dnd-kit/utilities": "^3.2.0",
  "mapbox-gl": "^2.15.0",
  "@mapbox/mapbox-gl-directions": "^4.1.1"
}
```

Dev:

```json
{
  "@types/mapbox-gl": "^2.7.0"
}
```

---

_Last updated: April 24, 2026 — Phase 2 technical research_
