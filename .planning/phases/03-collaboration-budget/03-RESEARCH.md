# Phase 03: Collaboration & Budget — Research

**Status:** Active  
**Updated:** April 24, 2026  
**Phase Goal:** Enable group planning with cost visibility and shared decisions

---

## Scope Framing

Phase 03 expands TripTrail from solo editing into multi-user planning with social signals and finance visibility.

Required outcomes from requirements and roadmap:

- Invite travelers without mandatory signup
- Real-time collaborative itinerary editing
- Activity comments, threaded replies, and votes
- Budget estimate, actual expense tracking, and split calculation
- Presence and notification system

Locked decisions from roadmap:

- Use operational-transform style conflict handling for collaborative edits
- Voting is democratic (not owner approval only)
- Budget pricing source in this phase is internal hardcoded catalog (external provider APIs deferred to Phase 4)

---

## Recommended Technical Approach

### Real-Time Collaboration

Use Supabase Realtime channels for:

- Activity reorder/add/remove events
- Comment and vote updates
- Presence state (active collaborators)

Conflict strategy for MVP:

- Per-day operation stream with monotonic revision number
- Server validates base revision, applies op, increments revision
- Client rebases pending local ops when mismatch occurs

This satisfies the roadmap decision for OT-style conflict mitigation without introducing full CRDT complexity.

### Guest Collaboration Without Signup

Implement signed invite tokens and guest sessions:

- Owner creates invite link tied to trip and permissions
- Invitee opens link, enters display name, receives signed httpOnly guest session cookie
- Guest actions are scoped to that trip and role via server checks

This preserves requirement 3.1 while keeping existing authenticated owner flows.

### Budget Data in Phase 03

Use hardcoded activity cost catalog by category and destination multipliers:

- Category base cost (museum, food, transport, tour, nightlife)
- Destination multiplier (budget/standard/premium)
- User can override estimate per activity

Phase 04 can replace with affiliate/provider pricing APIs.

---

## Data Model Additions

New tables:

1. `trip_collaborators`

- `id uuid pk`
- `trip_id uuid fk trips(id)`
- `user_id uuid null` (for signed-in collaborator)
- `guest_id uuid null` (for guest collaborator)
- `display_name text not null`
- `role text check (role in ('owner','editor','viewer'))`
- `joined_at timestamptz default now()`
- `last_seen_at timestamptz default now()`

2. `trip_invites`

- `id uuid pk`
- `trip_id uuid fk trips(id)`
- `token text unique not null`
- `invited_by uuid fk users(id)`
- `expires_at timestamptz`
- `max_uses int default 10`
- `uses_count int default 0`
- `created_at timestamptz default now()`

3. `activity_comments`

- `id uuid pk`
- `trip_id uuid fk trips(id)`
- `activity_id uuid fk itineraries(id)`
- `author_collaborator_id uuid fk trip_collaborators(id)`
- `parent_comment_id uuid null fk activity_comments(id)`
- `content text not null`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`
- `deleted_at timestamptz null`

4. `activity_votes`

- `id uuid pk`
- `trip_id uuid fk trips(id)`
- `activity_id uuid fk itineraries(id)`
- `collaborator_id uuid fk trip_collaborators(id)`
- `vote smallint check (vote in (-1, 1))`
- `created_at timestamptz default now()`
- unique (`activity_id`, `collaborator_id`)

5. `activity_budgets`

- `id uuid pk`
- `trip_id uuid fk trips(id)`
- `activity_id uuid fk itineraries(id)`
- `estimated_cost numeric(10,2) not null`
- `actual_cost numeric(10,2) null`
- `currency text default 'USD'`
- `cost_source text default 'phase3_catalog'`
- `updated_by uuid null`
- `updated_at timestamptz default now()`

6. `trip_notifications`

- `id uuid pk`
- `trip_id uuid fk trips(id)`
- `recipient_collaborator_id uuid fk trip_collaborators(id)`
- `type text` (`invite`, `comment`, `vote`, `budget_update`)
- `payload jsonb not null`
- `read_at timestamptz null`
- `created_at timestamptz default now()`

---

## API Surface for Phase 03

### Invites and Presence

- `POST /api/trips/[tripId]/invites` create invite token
- `POST /api/invites/[token]/join` join as guest or signed-in user
- `GET /api/trips/[tripId]/collaborators` list active collaborators
- Realtime channel: `trip:[tripId]:presence`

### Comments, Votes, Notifications

- `GET|POST /api/trips/[tripId]/activities/[activityId]/comments`
- `PATCH|DELETE /api/comments/[commentId]`
- `POST /api/trips/[tripId]/activities/[activityId]/vote`
- `GET /api/trips/[tripId]/notifications`
- `PATCH /api/notifications/[notificationId]/read`

### Budget and Expense Split

- `GET|PATCH /api/trips/[tripId]/budget`
- `POST /api/trips/[tripId]/expenses`
- `GET /api/trips/[tripId]/expenses/split`

---

## UX and Interaction Guidance

- Collaborative panel pinned on edit page with avatars and status dot
- Activity card shows vote score and threaded comment count
- Budget side panel shows:
  - total estimated
  - total actual
  - delta (actual - estimated)
  - per-person share
- Notifications drawer groups events by recency and type

Mobile notes:

- Collapse budget panel into bottom sheet
- Realtime updates should avoid hard re-render of full itinerary; patch local slices only

---

## Security and Abuse Controls

- Invite tokens are high-entropy random values, hashed in DB
- Invite join endpoint rate-limited by IP + token
- Guest session cookies scoped per trip and short TTL (24h default, renewable)
- All write APIs must verify collaborator role (`owner`/`editor`) per trip
- Comment content length and basic abuse guardrails (max size, sanitize rendering)

RLS policy direction:

- Owners: full control on own trips
- Collaborators: access limited to associated trip rows
- Guests: mapped through `guest_id` collaborator record

---

## Risks and Mitigations

| Risk                                       | Severity | Mitigation                                                             |
| ------------------------------------------ | -------- | ---------------------------------------------------------------------- |
| Realtime event storms with 5+ editors      | High     | Batch client updates, throttle presence updates, only broadcast deltas |
| Invite abuse / brute force                 | High     | Token hashing, expiration, max uses, join rate limit                   |
| Budget trust issues due to rough estimates | Medium   | Show estimate source label and allow manual overrides                  |
| Comment noise and UI overload              | Medium   | Thread collapse, pagination, unread counts                             |
| Conflict confusion on simultaneous edits   | High     | Revision mismatch response + client rebase and retry                   |

---

## Validation Architecture

Phase 03 requires mixed verification:

- Fast API contract tests for invite/comment/vote/budget endpoints
- Realtime integration tests with two simulated clients
- UI behavior tests for comment threads, vote updates, and budget totals
- Manual smoke test for invite flow on mobile and desktop

Target sampling:

- Quick suite after each task commit (<=60s)
- Full collaboration suite after each plan wave

---

## Recommendation for Planning

Split into three plans:

1. Collaboration foundation (schema, invites, presence/realtime contract)
2. Social layer (comments, voting, notifications)
3. Budget layer (estimates, actual spending, split + UI)

This mapping keeps each plan within context budget and enables partial parallelism after foundational schema and collaborator model are in place.

---

_Last updated: April 24, 2026 — Phase 03 research complete_
