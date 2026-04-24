# TripTrail — Requirements

**Status:** Active  
**Updated:** April 24, 2026  
**Source:** PROJECT.md + domain research

---

## Requirements by Phase

### Phase 1: Foundation & Core Loop

**Primary Goal:** Ship MVP with core feedback loop working  
**Success Criteria:**

- [ ] User can sign up via email or Google
- [ ] User can input destination, dates, # travelers
- [ ] AI generates a complete 3+ day itinerary in <10 seconds
- [ ] User sees itinerary displayed day-by-day
- [ ] App is deployed to production
- [ ] First real users can use the product end-to-end

**Functional Requirements:**

| ID    | Requirement        | Acceptance Criteria                                                      |
| ----- | ------------------ | ------------------------------------------------------------------------ |
| `1.1` | User Registration  | User creates account with email/password OR Google OAuth, email verified |
| `1.2` | User Login         | User logs in, session persists, logout clears session                    |
| `1.3` | Trip Input Form    | Destination, dates (flexible), # travelers accepted; form validates      |
| `1.4` | Claude Integration | API call to Claude with structured prompt, returns valid itinerary JSON  |
| `1.5` | Itinerary Display  | Each day shows activities with times, locations, descriptions            |
| `1.6` | Share Link         | Users get shareable link to view-only itinerary (no auth required)       |
| `1.7` | Production Deploy  | App running on Vercel + Supabase, accessible via public URL              |

**Non-Functional Requirements:**

- Response time: Itinerary generation <10 seconds (including AI latency)
- Uptime: 99% availability
- Security: Auth tokens secure, no PII exposed in URLs

---

### Phase 2: Editing & Personalization

**Primary Goal:** Users control their itineraries — drag, reorder, customize  
**Success Criteria:**

- [ ] Drag & drop reordering works without friction
- [ ] Users can add/remove/swap activities
- [ ] Map shows route optimization for the day
- [ ] Travel style preferences influence generation
- [ ] Edited itinerary is persisted and reshared

**Functional Requirements:**

| ID    | Requirement            | Acceptance Criteria                                                |
| ----- | ---------------------- | ------------------------------------------------------------------ |
| `2.1` | Drag & Drop            | Activities within a day reorder via drag & drop, persist on save   |
| `2.2` | Add Activity           | User picks activity from suggestions or custom input, added to day |
| `2.3` | Remove Activity        | User removes activity, day recalculates, no orphaned data          |
| `2.4` | Swap Activity          | User swaps two activities, times adjust, map updates               |
| `2.5` | Travel Style Picker    | User selects style tags (culture, gastronomy, adventure, relax)    |
| `2.6` | Integrated Map         | Activities plotted on map, route shown, times labeled              |
| `2.7` | Map Route Optimization | Route respects times, minimizes backtracking                       |
| `2.8` | Persist Edits          | All changes saved to database, retrievable on reload               |

**Non-Functional Requirements:**

- Drag & drop latency <50ms
- Map renders <2 seconds for 10+ activities
- No data loss on network interruption (optimistic updates)

---

### Phase 3: Collaboration & Budget

**Primary Goal:** Enable group planning with cost visibility  
**Success Criteria:**

- [ ] Multiple users can edit same itinerary
- [ ] Comments + voting on activities work
- [ ] Budget estimation shown clearly
- [ ] Users see real-time who's editing

**Functional Requirements:**

| ID    | Requirement            | Acceptance Criteria                                           |
| ----- | ---------------------- | ------------------------------------------------------------- |
| `3.1` | Invite Travelers       | Owner sends invite link, travelers join without signup        |
| `3.2` | Collaborative Editing  | Real-time sync of activity changes across travelers           |
| `3.3` | Comments on Activities | Users comment, threaded replies visible, notifications sent   |
| `3.4` | Activity Voting        | Users vote up/down activities, majority vote visible          |
| `3.5` | Budget Estimation      | Per-activity cost shown, totals calculated, currency flexible |
| `3.6` | Real Spending Tracking | Users log actual costs, vs. estimated                         |
| `3.7` | Expense Split          | Calculate per-person share of trip cost                       |
| `3.8` | Active Collaborators   | Show avatars of who's editing now                             |
| `3.9` | Notifications          | Comments, votes, invites trigger notifications                |

**Non-Functional Requirements:**

- Real-time sync latency <2 seconds
- Support 5+ concurrent editors without conflicts

---

### Phase 4: Travel Mode & Monetization

**Primary Goal:** Complete product with revenue potential  
**Success Criteria:**

- [ ] Offline itinerary accessible without network
- [ ] Time-based alerts work (PWA + service worker)
- [ ] Booking affiliates integrated (Booking, Viator, GetYourGuide)
- [ ] Premium tier differentiates, generating revenue

**Functional Requirements:**

| ID    | Requirement        | Acceptance Criteria                                      |
| ----- | ------------------ | -------------------------------------------------------- |
| `4.1` | PWA Installation   | User can install app to home screen, works offline       |
| `4.2` | Offline Itinerary  | Full itinerary visible offline, no data calls            |
| `4.3` | Time Alerts        | On trip day, alerts at activity start time               |
| `4.4` | Booking.com Links  | Activities link to booking options, affiliate tracked    |
| `4.5` | Viator Integration | Tours available in-app, affiliate tracked                |
| `4.6` | GetYourGuide Links | Activities link to GetYourGuide options                  |
| `4.7` | Premium Tier       | Unlimited AI regenerations, PDF export, priority support |
| `4.8` | Analytics          | Track user behavior, feature usage, conversion           |

**Non-Functional Requirements:**

- Offline responsiveness maintained
- No affiliate link leakage (tracked properly)
- 30% Premium conversion target by launch

---

## Cross-Phase Requirements (All Phases)

| Requirement                    | Why                      | Status   |
| ------------------------------ | ------------------------ | -------- |
| Mobile-responsive UI           | 70%+ of users on mobile  | Active   |
| Dark mode support              | UX baseline              | Active   |
| Accessibility (WCAG 2.1 AA)    | Legal + ethical baseline | Active   |
| Performance budget (LCP <2.5s) | User retention           | Active   |
| Error handling + user feedback | Trust                    | Active   |
| Analytics integration          | Measure success          | Phase 3+ |

---

## Table Stakes vs. Differentiators

**Table Stakes (Must Have):**

- Itinerary generation by AI
- Day-by-day display
- Basic editing

**Differentiators (Why Choose TripTrail):**

- Collaborative planning in real-time
- Budget tracking + expense split
- Offline mode for travel day
- Affiliate monetization path

---

## Known Risks & Mitigations

| Risk                               | Mitigation                                                                             |
| ---------------------------------- | -------------------------------------------------------------------------------------- |
| AI generation quality inconsistent | Red flag: if >20% itineraries unusable, revisit Claude prompt engineering              |
| LLM API costs spiral               | Monitor token usage, implement prompt caching, rate limiting                           |
| Collaborative sync conflicts       | Implement operational transformation or CRDT; test 5+ concurrent editors in Phase 3 QA |
| Mapbox licensing bloats costs      | Benchmark vs. Google Maps, negotiate volume pricing                                    |
| User acquisition slow              | Phase 4: affiliate commission = free customer acquisition                              |

---

## Validation Strategy

**Phase 1:** Can we generate a usable itinerary?  
→ Ship MVP, 10 real users, qualitative feedback

**Phase 2:** Can users confidently edit?  
→ Track drag abandonment rate, survey editing friction

**Phase 3:** Will people collaborate?  
→ Measure % of itineraries with 2+ collaborators, comment volume

**Phase 4:** Is this monetizable?  
→ Track premium conversion, affiliate revenue per trip

---

_Last updated: April 24, 2026 — Requirements extracted from project definition_
