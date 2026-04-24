# Phase 01: Foundation & Core Loop — Research

**Status:** Active  
**Updated:** April 24, 2026  
**Phase Goal:** Ship MVP — users can generate, view, and share itineraries

---

## Stack Validation

**Decision:** Use the recommended stack as documented in PROJECT.md

### Frontend Stack

- **Framework:** Next.js 16 (App Router)
  - Why: Modern, SSR-capable, Vercel-native, handles both client and server code
  - Justification: Perfect for real-time data + server-side generation
  - Version: 14.x (latest LTS equivalent)

- **UI Library:** Tailwind CSS + TypeScript
  - Why: Rapid prototyping, consistent design system, tree-shakeable
  - Justification: Can ship a polished Phase 1 UI quickly without CSS framework overhead
  - Setup: `create-next-app` default configuration with Tailwind

- **State Management:** Zustand
  - Why: Minimal, no boilerplate, easy to test
  - Justification: Phase 1 is simple (trip input → API call → display). Zustand is overkill but provides foundation for Phase 2–3 when complexity grows.
  - Setup: ~3 stores (user auth, trip state, itinerary state)

### Backend & Database

- **Backend-as-a-Service:** Supabase
  - Why: PostgreSQL + Auth + Realtime in one platform
  - Justification: Zero infrastructure, free tier supports Phase 1, built-in JWT auth, Row-Level Security (RLS) for future collaboration
  - Setup: `@supabase/supabase-js` client SDK

- **Database:** PostgreSQL (Supabase managed)
  - Schema (Phase 1 minimum):
    - `users` — id, email, provider, created_at
    - `trips` — id, user_id, destination, date_from, date_to, num_travelers, created_at, updated_at
    - `itineraries` — id, trip_id, day_number, activity_name, location, time_start, time_end, description
    - `share_links` — id, trip_id, token, created_at

- **Auth:** Supabase Auth + Google OAuth
  - Why: Email/password + social OAuth out of the box
  - Justification: Phase 1 MVP can use pre-built auth, no custom logic needed
  - Setup: Configure Google OAuth app credentials

### AI/LLM Integration

- **LLM:** Claude API (Anthropic)
  - Why: High-quality itinerary generation, streaming support, reliability
  - Justification: Inspirock-quality itineraries require strong reasoning; Claude > GPT-4 for travel planning specificity
  - Endpoint: `messages` API (non-streaming initially, streaming in Phase 2)
  - Prompt engineering: Structured output (JSON itinerary format) via Claude's JSON mode

- **Deployment:** Vercel Serverless Functions
  - Why: Scale to zero, integrates with Next.js, easy environment secrets
  - Justification: Phase 1 traffic is low; Vercel Functions cost ~$0 during MVP phase
  - Setup: Create `/api/generateItinerary` endpoint

### Deployment

- **Hosting:** Vercel
  - Why: Next.js native, auto-deploys from GitHub, serverless functions, edge functions for future optimization
  - Justification: GitHub → Vercel → live in 30 seconds; no DevOps overhead

---

## Data Flow — Phase 1

```
User Input Form (Next.js Page)
  ↓
  → Destination, dates, # travelers
  ↓
POST /api/generateItinerary
  ↓
  → Claude API (structured prompt)
  ↓
  → Returns JSON: { days: [ { date, activities: [...] } ] }
  ↓
  → Save to Supabase (trips + itineraries tables)
  ↓
Display Itinerary (Next.js Page)
  ↓
  → Render day-by-day from database
  ↓
Generate Share Link
  ↓
  → Create random token in share_links table
  → share_links row contains trip_id + encrypted token
  → Generate public URL: triptrail.com/share/{token}
  → View-only endpoint fetches via share token (no auth needed)
```

---

## Critical Path to Launch

### Database Schema (BLOCKING)

Must create before any frontend/backend work:

- `users` table (managed by Supabase Auth)
- `trips` table (core data)
- `itineraries` table (generated content)
- `share_links` table (sharing)
- Indexes on `trip_id`, `user_id`, `created_at`

### Claude Prompt Engineering (BLOCKING)

- Prompt must accept: { destination, dateRange, numTravelers, preferredStyle }
- Output must be valid JSON (parseable)
- Must support 50+ destinations without hallucination

**Test cases:**

- Tokyo, 3 days, 2 travelers → ✓ valid JSON, realistic activities
- Iceland Ring Road, 7 days, 4 travelers → ✓ valid JSON, realistic
- Edge case: unknown destination → graceful degradation (generic suggestions)

### Authentication Flow (BLOCKING)

- Email signup → Supabase Auth creates user
- Google OAuth → same
- Session persists → JWT in httpOnly cookie (Supabase handles this)
- Logout clears session

---

## Known Risks & Mitigations

| Risk                            | Severity | Mitigation                                                                                           |
| ------------------------------- | -------- | ---------------------------------------------------------------------------------------------------- |
| Claude API rate limits exceeded | Medium   | Monitor usage, set daily budget via Anthropic dashboard, implement backoff                           |
| Itinerary quality inconsistent  | High     | Prompt testing with 20+ destinations before launch, human review of 3–5 itineraries                  |
| Supabase RLS misconfigured      | High     | Test row-level security before deploying; share links should NOT expose trip to unauthorized users   |
| Share link token predictable    | High     | Use `crypto.randomUUID()` for tokens, not incremental IDs                                            |
| Database schema missing indexes | Medium   | Add indexes on `trip_id`, `user_id`, `created_at` before deploying; run `EXPLAIN ANALYZE` on queries |

---

## Phase 1 Success Checklist

- [ ] Schema deployed to Supabase
- [ ] Authentication (email + Google) tested end-to-end
- [ ] Claude prompt tested with 20+ destinations
- [ ] First itinerary generated <10 seconds (including API latency)
- [ ] Share link works, view-only access confirmed
- [ ] Deployed to Vercel, public URL accessible
- [ ] 5 real users completed end-to-end flow
- [ ] No P0 bugs
- [ ] Monitoring set up (error logs, API usage)

---

## Validation Architecture

**Dimension 1 — Core Loop (RED/GREEN/REFACTOR)**

- Test: `POST /api/generateItinerary` → itinerary JSON structure valid
- Test: Itinerary displays without errors
- Test: Share link generates and is accessible

**Dimension 2 — Database Integrity**

- Test: User created → can generate multiple trips
- Test: Trip owner can view their trips
- Test: Non-owner cannot access via direct trip ID (RLS enforced)
- Test: Share link works for unauthed users

**Dimension 3 — API Quality**

- Test: Claude API response <10 seconds
- Test: Invalid input (missing destination) → 400 + helpful message
- Test: Server error (Claude offline) → 500 + logged, user sees "try again"

**Dimension 4 — Security**

- Test: Authentication required for private endpoints
- Test: Share tokens are cryptographically random
- Test: No PII in URLs or logs

**Dimension 5 — UI/UX**

- Test: Form is mobile-responsive
- Test: Loading state shown during generation
- Test: Error messages are user-friendly

---

_Last updated: April 24, 2026 — Phase 1 technical research_
