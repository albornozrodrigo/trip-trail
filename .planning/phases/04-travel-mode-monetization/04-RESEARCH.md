# Phase 04: Travel Mode & Monetization — Research

**Status:** Active  
**Updated:** April 24, 2026  
**Phase Goal:** Complete, monetizable product ready for user growth

---

## Scope Summary

Phase 04 finalizes product readiness with offline travel support and revenue infrastructure.

Requirements in scope:
- 4.1 PWA installation
- 4.2 Offline itinerary access
- 4.3 Time-based activity alerts
- 4.4/4.5/4.6 Affiliate booking integrations
- 4.7 Premium tier + subscription controls
- 4.8 Analytics tracking and conversion insights

Roadmap decisions to preserve:
- Service worker is mandatory for offline and alerts
- Affiliate commission model is core monetization channel
- Premium launches in same phase (not deferred)

---

## Recommended Architecture

### PWA and Offline Layer

Use Next.js App Router + service worker (`next-pwa` or custom Workbox setup):
- Cache static assets with stale-while-revalidate
- Cache itinerary API responses with network-first fallback
- IndexedDB store for itinerary snapshots to support no-network read mode

Offline data strategy:
- Trip and itinerary payload mirrored to IndexedDB on successful fetch
- Offline route reads from IndexedDB and marks UI as offline snapshot
- Queue user write attempts and replay on reconnect where feasible

### Time-Based Alerts

Use service worker notifications for activity reminders:
- Activity schedule converted to local notification jobs on trip-day load
- Reminder lead time configurable (default 15 minutes)
- Fallback in-app banner when Notification permission denied

Important browser constraints:
- iOS/Safari support differs; provide capability detection and explicit UX fallback

### Affiliate Integrations

Phase 04 scope should prioritize reliable affiliate URL generation rather than deep booking checkout embedding.

Per-provider strategy:
- Booking.com: destination and date query deep link with partner/affiliate id
- Viator: activity/location link generation using tracked source params
- GetYourGuide: product search URL with tracking tags

Tracking:
- Generate signed outbound click IDs to attribute conversion events
- Persist click events before redirect to provider

### Premium and Billing

Use Stripe subscriptions:
- Free tier constraints: limited AI regenerations per month
- Premium tier: unlimited regenerations + PDF export + priority support flag

Billing design:
- `POST /api/billing/checkout` create Stripe Checkout session
- `POST /api/billing/webhook` sync subscription status
- Entitlements resolved server-side and exposed in user profile payload

### Analytics

Track critical funnel and product metrics:
- PWA install prompt shown/accepted
- Offline usage sessions
- Affiliate clicks by provider and trip
- Premium paywall views -> checkout started -> checkout completed
- Feature adoption: pdf export, alerts enabled

Prefer first-party event capture into database with optional forwarder to external analytics provider.

---

## Data Model Additions

1. `affiliate_clicks`
- `id uuid pk`
- `user_id uuid`
- `trip_id uuid`
- `provider text` (`booking`, `viator`, `getyourguide`)
- `target_url text`
- `click_token text unique`
- `created_at timestamptz default now()`

2. `subscriptions`
- `id uuid pk`
- `user_id uuid unique`
- `provider text default 'stripe'`
- `provider_customer_id text`
- `provider_subscription_id text`
- `status text` (`active`, `past_due`, `canceled`, `trialing`)
- `current_period_end timestamptz`
- `updated_at timestamptz`

3. `usage_limits`
- `id uuid pk`
- `user_id uuid unique`
- `period_start date`
- `period_end date`
- `ai_regenerations_used int default 0`
- `pdf_exports_used int default 0`

4. `analytics_events`
- `id uuid pk`
- `user_id uuid null`
- `trip_id uuid null`
- `event_name text`
- `properties jsonb`
- `created_at timestamptz default now()`

---

## API Surface

### PWA and Alerts
- `GET /api/offline/trips/[tripId]` offline snapshot payload
- `POST /api/alerts/schedule` register local reminder metadata

### Affiliate
- `POST /api/affiliate/link` generate tracked provider URL
- `POST /api/affiliate/click` log click and return redirect URL

### Billing and Entitlements
- `POST /api/billing/checkout`
- `POST /api/billing/webhook`
- `GET /api/billing/entitlements`

### Analytics
- `POST /api/analytics/event`
- `GET /api/analytics/dashboard` (admin/internal)

---

## Risk Register and Mitigation

| Risk | Severity | Mitigation |
|------|----------|------------|
| Offline cache inconsistency with fresh edits | High | Version snapshot payloads and show stale-data indicator in UI |
| Notification permission denial | Medium | Fallback reminders inside app timeline and settings prompt |
| Affiliate attribution loss | High | Persist click event server-side before redirect and sign click token |
| Stripe webhook desync | High | Idempotent webhook handling and periodic entitlement reconciliation |
| Analytics event over-collection | Medium | Event schema allowlist and sampling limits for high-volume events |

---

## Validation Architecture

Testing focus:
- Integration tests for affiliate click logging and redirect construction
- Webhook contract tests for Stripe status updates
- PWA install/offline e2e tests with network toggling
- Notification flow smoke tests with permission granted/denied branches

Sampling:
- Quick suite after each task commit (<=90s)
- Full suite after each wave including one browser e2e pass

---

## Planning Recommendation

Create three plans:
1. PWA + offline + alert foundation
2. Affiliate booking integrations with tracked outbound links
3. Premium billing/entitlements + analytics instrumentation

This structure preserves context quality and keeps revenue-critical integrations isolated for easier verification.

---

_Last updated: April 24, 2026 — Phase 04 research complete_