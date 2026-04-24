# TripTrail — Project Definition

**Status:** Initialization  
**Phase:** Project Planning  
**Updated:** April 24, 2026

---

## What This Is

TripTrail is an AI-powered trip planning application that transforms destination + dates + preferences into a complete, editable, and shareable itinerary in seconds. Inspired by the late Inspirock, but built for the modern traveler: mobile-first, collaborative, and with contextual suggestions in real-time.

**Core Value Proposition:**  
_"You tell us where you want to go and what you like. We build the best possible itinerary — and you adjust whatever you want."_

---

## Core Problem

Travel planning is time-consuming and fragmented. Users must:

- Research destinations across multiple websites
- Manually piece together activities by day
- Coordinate with travel companions asynchronously
- Track budgets and logistics separately

TripTrail eliminates this by generating smart, day-by-day itineraries that users can refine collaboratively, all in one place.

---

## Core Features

| Feature                     | Purpose                                                                         | Status      |
| --------------------------- | ------------------------------------------------------------------------------- | ----------- |
| **AI Itinerary Generation** | Input destination, dates, travel style → generate complete day-by-day itinerary | MVP         |
| **Drag & Drop Editing**     | Reorder activities, swap attractions, add stops via intuitive UI                | MVP         |
| **Integrated Map**          | View routes optimized between attractions, visualize flow                       | MVP Phase 2 |
| **Collaborative Planning**  | Invite travelers to edit together with comments and activity voting             | Phase 3     |
| **Budget Estimation**       | Estimated cost per activity + total trip, with real spending tracking           | Phase 3     |
| **Offline/Travel Mode**     | Itinerary available offline with time alerts, reservations, check-ins           | Phase 4     |

---

## Target Personas

1. **The Explorer** 🎒 — Solo travelers, seek adventure, limited planning time
2. **The Couple** 👫 — Romantic trips, balance between relaxation and exploration
3. **The Family** 👨‍👩‍👧‍👦 — Multiple interests to reconcile, logistics-heavy
4. **The Executive** 🧑‍💼 — Business + leisure blend, time-scarce

---

## Requirements

### Validated

(None yet — shipping to validate)

### Active

**Must-Have (Table Stakes):**

- [ ] User authentication (email + Google OAuth)
- [ ] Trip input (destination, dates, number of travelers)
- [ ] LLM integration for itinerary generation
- [ ] Day-by-day itinerary display
- [ ] Production deployment (Vercel + Supabase)
- [ ] Drag & drop activity reordering
- [ ] Travel style preferences (culture, gastronomy, adventure, relaxation)
- [ ] Basic map integration
- [ ] Share itinerary via link
- [ ] Collaborative editing (invite travelers, comments, voting)
- [ ] Budget estimation and tracking
- [ ] Offline mode (PWA)

**Nice-to-Have (Differentiators):**

- [ ] Time-based alerts and reminders
- [ ] Affiliate reservation system (Booking, Viator, GetYourGuide)
- [ ] Premium tier (unlimited AI, PDF export)
- [ ] Usage analytics and insights
- [ ] Advanced AI personalization

### Out of Scope

- Mobile apps (iOS/Android native) — starting with responsive web
- Multi-language support (v1 ships in Portuguese and English)
- Social features (following, likes, activity feed)
- Monetized affiliate bookings (Phase 4+ only)

---

## Key Decisions

| Decision                          | Rationale                                            | Outcome   |
| --------------------------------- | ---------------------------------------------------- | --------- |
| Frontend: Next.js 16 (App Router) | Modern, SSR-capable, Vercel-native                   | ✓ Decided |
| Backend: Supabase                 | Auth + PostgreSQL in one, fast dev velocity          | ✓ Decided |
| AI: Claude API                    | High-quality itinerary generation, streaming support | ✓ Decided |
| Maps: Mapbox GL JS                | Performance, offline capability, route optimization  | ✓ Decided |
| State: Zustand                    | Lightweight, simpler than Redux for this scale       | ✓ Decided |
| Drag & Drop: dnd-kit              | Modern, accessible, performant                       | ✓ Decided |
| Deploy: Vercel                    | Seamless Next.js integration, edge functions         | ✓ Decided |
| CSS: Tailwind CSS                 | Rapid UI iteration, consistent design                | ✓ Decided |

---

## Roadmap — Build Phases

### Phase 1: Foundation & Core Loop (Weeks 1–2)

**Goal:** Ship MVP — users can generate, view, and share itineraries.

- Authentication (email + Google OAuth)
- Trip input form (destination, dates, travelers)
- Claude API integration for itinerary generation
- Day-by-day display
- Initial deployment to Vercel + Supabase

### Phase 2: Editing & Personalization (Weeks 3–4)

**Goal:** Users own their itineraries — drag, edit, style preferences.

- Drag & drop activity reordering
- Add/remove/swap attractions
- Travel style preferences (culture, gastronomy, adventure, relax)
- Google Maps / Mapbox integration
- Share via link

### Phase 3: Collaboration & Budget (Weeks 5–6)

**Goal:** Group planning and cost control.

- Collaborative mode (invite travelers)
- Comments and activity voting
- Budget estimation (per activity, total)
- Integrations with pricing APIs
- Notifications and reminders

### Phase 4: Travel Mode & Monetization (Week 7+)

**Goal:** Monetizable, feature-complete product ready for scaling.

- Offline PWA
- Time-based alerts
- Affiliate reservation system (Booking, Viator, GetYourGuide)
- Premium tier
- Usage analytics

---

## Tech Stack

| Layer        | Technology              | Rationale                          |
| ------------ | ----------------------- | ---------------------------------- |
| **Frontend** | Next.js 16 (App Router) | Modern, SSR, Vercel-native         |
|              | Tailwind CSS            | Rapid UI iteration                 |
|              | TypeScript              | Type safety                        |
|              | dnd-kit                 | Accessible drag & drop             |
|              | Zustand                 | Lightweight state                  |
| **Backend**  | Supabase (PostgreSQL)   | Auth + DB unified, fast iteration  |
| **AI/LLM**   | Claude API              | High-quality generation, streaming |
| **Maps**     | Mapbox GL JS            | Performance + offline capability   |
| **Deploy**   | Vercel                  | Next.js native, edge functions     |
| **Database** | PostgreSQL (Supabase)   | Relational, scalable, well-known   |
| **Auth**     | Supabase Auth           | Built-in, OAuth-ready              |

---

## Success Metrics

- **MVP**: First itinerary generated in <10 seconds
- **Phase 2**: Users can edit their itinerary without friction
- **Phase 3**: 2+ travelers can plan collaboratively
- **Phase 4**: 50% of trips are planned offline-first

---

## Context & Constraints

**Timeline:** 7+ weeks (aggressive MVP-first approach)  
**Team:** Implied small/solo (GSD workflow is single-contributor friendly)  
**Budget:** Cloud-focused (Vercel, Supabase, Claude API)  
**Market:** Portuguese-speaking travelers initially, expanding English

---

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):

1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):

1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---

_Last updated: April 24, 2026 — Project initialization_
