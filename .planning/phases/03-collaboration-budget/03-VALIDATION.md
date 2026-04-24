---
phase: 03
slug: collaboration-budget
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-24
---

# Phase 03 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property               | Value                                   |
| ---------------------- | --------------------------------------- |
| **Framework**          | vitest + playwright                     |
| **Config file**        | vitest.config.ts, playwright.config.ts  |
| **Quick run command**  | `npm run test -- --runInBand --changed` |
| **Full suite command** | `npm run test && npm run test:e2e`      |
| **Estimated runtime**  | ~120 seconds                            |

---

## Sampling Rate

- **After every task commit:** Run `npm run test -- --runInBand --changed`
- **After every plan wave:** Run `npm run test && npm run test:e2e`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 120 seconds

---

## Per-Task Verification Map

| Task ID  | Plan | Wave | Requirement   | Threat Ref | Secure Behavior                                                       | Test Type   | Automated Command                        | File Exists | Status     |
| -------- | ---- | ---- | ------------- | ---------- | --------------------------------------------------------------------- | ----------- | ---------------------------------------- | ----------- | ---------- |
| 03-01-01 | 01   | 1    | 3.1, 3.2, 3.8 | T-03-01-01 | Invite token and collaborator writes scoped by trip role              | integration | `npm run test -- invites`                | ❌ W0       | ⬜ pending |
| 03-01-02 | 01   | 1    | 3.1, 3.8      | T-03-01-02 | Guest join and presence events authorized by invite token             | integration | `npm run test -- collaboration-presence` | ❌ W0       | ⬜ pending |
| 03-02-01 | 02   | 2    | 3.3, 3.4, 3.9 | T-03-02-01 | Comments/votes only by collaborator and event fanout sanitized        | integration | `npm run test -- comments-votes`         | ❌ W0       | ⬜ pending |
| 03-02-02 | 02   | 2    | 3.3, 3.4, 3.9 | T-03-02-02 | UI renders threaded comments + vote score updates without full reload | e2e         | `npm run test:e2e -- collaboration-ui`   | ❌ W0       | ⬜ pending |
| 03-03-01 | 03   | 2    | 3.5, 3.6, 3.7 | T-03-03-01 | Budget and expense writes validate currency/amount bounds             | integration | `npm run test -- budget-expenses`        | ❌ W0       | ⬜ pending |
| 03-03-02 | 03   | 2    | 3.5, 3.6, 3.7 | T-03-03-02 | Split calculations stable for uneven contribution scenarios           | unit        | `npm run test -- expense-split`          | ❌ W0       | ⬜ pending |

_Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky_

---

## Wave 0 Requirements

- [ ] `tests/integration/invites.test.ts` — invite creation/join and role checks
- [ ] `tests/integration/collaboration-presence.test.ts` — realtime/presence events
- [ ] `tests/integration/comments-votes.test.ts` — comments and vote APIs
- [ ] `tests/integration/budget-expenses.test.ts` — budget estimate and actual spend APIs
- [ ] `tests/unit/expense-split.test.ts` — split math edge cases
- [ ] `tests/e2e/collaboration-ui.spec.ts` — live UI synchronization and notifications

---

## Manual-Only Verifications

| Behavior                                    | Requirement | Why Manual                                                        | Test Instructions                                                           |
| ------------------------------------------- | ----------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Invite link flow on mobile browser          | 3.1         | Deep-link/session cookie nuances differ across browsers           | Generate invite, open on mobile Safari/Chrome, join as guest, verify access |
| Concurrent editing with 3 live sessions     | 3.2, 3.8    | Real websocket timing and UX smoothing are hard to simulate fully | Open 3 clients, edit same day, verify presence and conflict reconciliation  |
| Notification usability under burst activity | 3.9         | Human UX judgment for signal/noise quality                        | Trigger 10 comment/vote events and assess grouping/readability              |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 120s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
