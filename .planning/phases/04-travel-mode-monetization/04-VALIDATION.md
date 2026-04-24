---
phase: 04
slug: travel-mode-monetization
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-24
---

# Phase 04 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property               | Value                                   |
| ---------------------- | --------------------------------------- |
| **Framework**          | vitest + playwright                     |
| **Config file**        | vitest.config.ts, playwright.config.ts  |
| **Quick run command**  | `npm run test -- --runInBand --changed` |
| **Full suite command** | `npm run test && npm run test:e2e`      |
| **Estimated runtime**  | ~180 seconds                            |

---

## Sampling Rate

- **After every task commit:** Run `npm run test -- --runInBand --changed`
- **After every plan wave:** Run `npm run test && npm run test:e2e`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 180 seconds

---

## Per-Task Verification Map

| Task ID  | Plan | Wave | Requirement   | Threat Ref | Secure Behavior                                                  | Test Type   | Automated Command                      | File Exists | Status     |
| -------- | ---- | ---- | ------------- | ---------- | ---------------------------------------------------------------- | ----------- | -------------------------------------- | ----------- | ---------- |
| 04-01-01 | 01   | 1    | 4.1, 4.2      | T-04-01-01 | Offline caches serve only trip-authorized snapshots              | integration | `npm run test -- pwa-offline`          | ❌ W0       | ⬜ pending |
| 04-01-02 | 01   | 1    | 4.3           | T-04-01-02 | Alert scheduling validates trip ownership and time format        | integration | `npm run test -- alerts`               | ❌ W0       | ⬜ pending |
| 04-02-01 | 02   | 2    | 4.4, 4.5, 4.6 | T-04-02-01 | Affiliate redirects are signed, logged, and provider constrained | integration | `npm run test -- affiliate-links`      | ❌ W0       | ⬜ pending |
| 04-02-02 | 02   | 2    | 4.4, 4.5, 4.6 | T-04-02-02 | UI shows provider links with explicit outbound disclosure        | e2e         | `npm run test:e2e -- affiliate-ui`     | ❌ W0       | ⬜ pending |
| 04-03-01 | 03   | 2    | 4.7           | T-04-03-01 | Billing webhooks update entitlements idempotently                | integration | `npm run test -- billing-entitlements` | ❌ W0       | ⬜ pending |
| 04-03-02 | 03   | 2    | 4.8           | T-04-03-02 | Analytics events follow allowlisted schema and PII policy        | unit        | `npm run test -- analytics-events`     | ❌ W0       | ⬜ pending |

_Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky_

---

## Wave 0 Requirements

- [ ] `tests/integration/pwa-offline.test.ts` — offline snapshot and cache behavior
- [ ] `tests/integration/alerts.test.ts` — time-based alert scheduling validation
- [ ] `tests/integration/affiliate-links.test.ts` — provider URL generation and click logging
- [ ] `tests/integration/billing-entitlements.test.ts` — Stripe webhook and entitlement sync
- [ ] `tests/unit/analytics-events.test.ts` — event schema and sanitization rules
- [ ] `tests/e2e/affiliate-ui.spec.ts` — outbound link and tracking behavior

---

## Manual-Only Verifications

| Behavior                                      | Requirement | Why Manual                                                   | Test Instructions                                               |
| --------------------------------------------- | ----------- | ------------------------------------------------------------ | --------------------------------------------------------------- |
| PWA install prompt acceptance across browsers | 4.1         | Browser heuristics vary and cannot be fully stabilized in CI | Test on Chrome, Safari, and Android browser install flow        |
| Notification permission and delivery path     | 4.3         | OS-level permission UX cannot be fully simulated             | Grant and deny permission; verify fallback messaging            |
| Subscription checkout UX quality              | 4.7         | Payment UX and trust cues need human review                  | Run Stripe checkout in test mode and review post-purchase state |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 180s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
