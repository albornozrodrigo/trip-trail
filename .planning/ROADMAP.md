# TripTrail — Roadmap

**Status:** Active  
**Updated:** April 24, 2026  
**Timeline:** 7+ weeks (aggressive)

---

## Roadmap Overview

```
Phase 1 (Weeks 1-2)   | Phase 2 (Weeks 3-4)    | Phase 3 (Weeks 5-6) | Phase 4 (Week 7+)
Foundation & Core     | Editing &              | Collaboration &     | Travel Mode &
Loop                  | Personalization        | Budget              | Monetization
                      |                        |                     |
MVP: Auth + Gen +     | Full editing: Drag,    | Group planning:     | Offline + Premium
Deploy                | map, preferences       | Comments, voting    | Bookings, revenue
```

---

## Phase 1: Foundation & Core Loop

**Duration:** Weeks 1–2  
**Goal:** Ship production MVP — users can generate, view, and share itineraries  
**Success Gate:** First 10 real users can complete flow end-to-end  
**Depends on:** None

### Theme
**Core feedback loop:** Destination + Dates → AI Itinerary → Shareable Link

### Deliverables

- [ ] **Authentication** — Email/password signup, Google OAuth, email verification
- [ ] **Trip Input** — Destination, date range, # travelers form
- [ ] **Claude Integration** — API call + prompt engineering for itinerary generation
- [ ] **Itinerary Display** — Day-by-day view with activities, times, descriptions
- [ ] **Share Functionality** — Generate view-only share link
- [ ] **Production Deploy** — Vercel + Supabase live, public URL accessible

### Key Decisions

| Decision | Rationale | Owner |
|----------|-----------|-------|
| Claude API for generation | Quality > speed in MVP; streaming support | Product |
| Single destination per trip v1 | Scope; multi-destination in Phase 2 | Product |
| No map in Phase 1 | Faster MVP; add in Phase 2 | Product |
| Supabase for auth + DB | Single platform, fast iteration | Tech |
| Vercel for deployment | Next.js native, instant scaling | Tech |

### Success Metrics

- First itinerary generated <10 seconds
- 10 real users through complete flow
- 0 critical bugs in first week

---

## Phase 2: Editing & Personalization

**Duration:** Weeks 3–4  
**Goal:** Users own their itineraries — full control over activities and style  
**Success Gate:** Users comfortable editing without support  
**Depends on:** Phase 1 (Core Loop working)

### Theme
**User agency:** Itinerary → Drag, edit, style → Personalized itinerary

### Deliverables

- [ ] **Drag & Drop** — Reorder activities within days seamlessly
- [ ] **Activity Management** — Add/remove/swap attractions
- [ ] **Travel Style Preferences** — Culture, gastronomy, adventure, relaxation tags
- [ ] **Integrated Map** — Mapbox showing route optimization for each day
- [ ] **Persist Edits** — All changes saved and reshared automatically
- [ ] **Route Optimization** — Smart ordering to minimize backtracking

### Key Decisions

| Decision | Rationale | Owner |
|----------|-----------|-------|
| dnd-kit for DnD | Accessible, performant, modern | Frontend |
| Mapbox over Google Maps | Better offline support, cheaper at scale | Tech |
| Travel style influences prompt | Improves generation quality for Phase 1 users | Product |

### Success Metrics

- Drag abandonment rate <5%
- Map renders in <2 seconds for 10+ activities
- Users edit 50% of generated itineraries (stickiness signal)

---

## Phase 3: Collaboration & Budget

**Duration:** Weeks 5–6  
**Goal:** Enable group planning with cost visibility and shared decisions  
**Success Gate:** Multi-user trips completed with 2+ collaborators  
**Depends on:** Phase 2 (Editing working smoothly)

### Theme
**Social + financial:** "We plan together, we budget together"

### Deliverables

- [ ] **Invite System** — Share link for travelers to join without signup
- [ ] **Collaborative Editing** — Real-time sync across 2+ users
- [ ] **Comments & Voting** — Activity-level feedback, democratic decisions
- [ ] **Budget Estimation** — Per-activity costs + trip total
- [ ] **Expense Tracking** — Log actual spending vs. estimated
- [ ] **Expense Split** — Calculate per-person share
- [ ] **Active Collaborators** — Show who's editing in real-time
- [ ] **Notifications** — Real-time updates on comments, votes, invites

### Key Decisions

| Decision | Rationale | Owner |
|----------|-----------|-------|
| Operational transform for sync | Handles concurrent edits without conflicts | Backend |
| Voting not approval-only | Democratic, reduces group friction | Product |
| Budget API: hardcoded prices Phase 3 | Real APIs (Booking, Viator) Phase 4 | Tech |

### Success Metrics

- 30% of trips have 2+ collaborators
- Real-time sync latency <2 seconds
- Budget tracking adoption >70%

---

## Phase 4: Travel Mode & Monetization

**Duration:** Week 7+  
**Goal:** Complete, monetizable product ready for user growth  
**Success Gate:** Revenue flowing, premium conversion >15%  
**Depends on:** Phase 3 (Collaboration working)

### Theme
**Completeness + revenue:** "Travel with TripTrail, book through us"

### Deliverables

- [ ] **Progressive Web App (PWA)** — Install to home screen, full offline capability
- [ ] **Time-Based Alerts** — Service worker triggers notifications on activity start
- [ ] **Affiliate Bookings** — Booking.com, Viator, GetYourGuide integration
- [ ] **Premium Tier** — Unlimited AI regenerations, PDF export, priority support
- [ ] **Analytics** — User behavior, feature adoption, conversion tracking
- [ ] **Monetization Infrastructure** — Stripe integration, subscription management

### Key Decisions

| Decision | Rationale | Owner |
|----------|-----------|-------|
| Service worker for offline | Works offline, no connection required | Frontend |
| Affiliate commission model | Free customer acquisition channel | Business |
| Premium tier in parallel | Launch monetization same phase as main features | Product |

### Success Metrics

- 80%+ of PWA installations result in 2+ trips planned
- Affiliate revenue > 5% of total engagement
- Premium conversion >15%

---

## Cross-Phase Dependencies

```
Phase 1 ──→ Phase 2 ──→ Phase 3 ──→ Phase 4
  Core       Full edit    Group plan   Travel + $
```

- **Phase 1 → 2:** Editable itineraries build on core generation
- **Phase 2 → 3:** Collaboration needs smooth editing baseline
- **Phase 3 → 4:** Monetization depends on mature product

No parallel phases in this roadmap (coarse granularity per config).

---

## Risk Registry

| Risk | Severity | Mitigation | Owner |
|------|----------|-----------|-------|
| Claude prompt quality inconsistent | High | Test with 50+ real destinations Phase 1 week 1 | Product |
| LLM token costs spiral | High | Implement prompt caching, monitor daily | Tech |
| Map rendering slow for complex routes | Medium | Benchmark with 20-activity day in Phase 2 week 3 | Frontend |
| Collaborative sync conflicts | High | Stress test with 5 concurrent editors in Phase 3 week 5 | Backend |
| Premium adoption too low | Medium | User research Phase 3 on feature value | Product |

---

## Future Backlog (Post-Phase 4)

Items deferred for later consideration:

- **Multi-destination trips** — Itineraries spanning multiple cities
- **Multi-language** — Portuguese, English, Spanish, French
- **Native mobile apps** — iOS/Android versions
- **Social features** — User profiles, shared itinerary gallery
- **Advanced AI** — Personal recommendation learning, traveler profiling
- **B2B** — White-label for travel agencies

---

## Validation Gates

### Phase 1 Exit Gate
- [ ] Core generation loop works end-to-end
- [ ] 10 real users completed a trip
- [ ] No critical bugs (P0) outstanding
- [ ] Deploy to production stable 48 hours

### Phase 2 Exit Gate
- [ ] Editing comfortable without friction (user testing)
- [ ] Map integration working for 10+ activities
- [ ] <5% drag interaction abandonment rate
- [ ] Performance budget met (LCP <2.5s)

### Phase 3 Exit Gate
- [ ] Multi-user trips completed with 2+ real collaborators
- [ ] Sync latency <2 seconds (real-time feel)
- [ ] Budget tracking adopted by >70% of users
- [ ] No conflict-induced data loss

### Phase 4 Exit Gate
- [ ] PWA install rate >30% of web visits
- [ ] Affiliate revenue tracking working end-to-end
- [ ] Premium tier available, >15% conversion
- [ ] Analytics dashboard functional

---

## Timeline & Capacity

**Total Duration:** 7+ weeks (aggressive)  
**Implied Team:** 1–2 people (GSD single-contributor optimized)

| Week | Focus | Phase |
|------|-------|-------|
| 1–2 | Auth, generation, deploy | Phase 1 |
| 3–4 | Editing, map, preferences | Phase 2 |
| 5–6 | Collaboration, budget, comments | Phase 3 |
| 7+ | PWA, affiliate, premium, monetization | Phase 4 |

---

## Next Steps

→ Run `/gsd-plan-phase 1` to break Phase 1 into executable tasks  
→ Research will inform stack validation before planning  
→ Run `/gsd-execute-phase 1` to begin building

---

*Last updated: April 24, 2026 — Roadmap initialization*
