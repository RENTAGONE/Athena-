# ATHENA Build Readiness & Acceptance Plan
Version 1.0.0 · 2026-11-17 · For Claude Stage 0 confirmation and Stage 1 execution

## 1. Objective

Move from reviewed architecture to a usable, trustworthy phone-first MVP in staged vertical slices. Target a first dependable MVP in roughly 3–5 weeks of active implementation, subject to Claude tool access, repository setup, test feedback and the real-device verification schedule. This is a planning target, not a delivery guarantee.

“ATHENA MVP” means the core app works end-to-end. It does not mean all 18 disciplines have complete curricula, every advanced feature is implemented, or every future module is active.

## 2. Build gate

Claude first reads the complete handoff in the order in `START_HERE_READ_ORDER.md`. Then produce one concise Stage 0 confirmation packet:
1. product invariants confirmed;
2. all 15 reconciliation gaps marked resolved/pending exactly as the addendum states;
3. 14 existing ADRs preserved, with any proposed changes listed as new ADR revisions;
4. technical stack decision and alternatives;
5. data model/schema compatibility statement;
6. visual design system acceptance and first-screen plan;
7. v1 scope and deferred scope;
8. user-owned decisions still requiring approval;
9. implementation plan with testable acceptance criteria.

Do not restart Stage 0 research from zero. Reuse its sources, research and ADRs; update only where v1.4/v0.8 changes the decision or new evidence requires it.

Claude may begin reversible scaffolding and test setup while confirmation is being prepared. Do not create paid accounts, publish a public URL, overwrite a repository, migrate real user data or perform destructive operations without explicit approval.

## 3. Suggested implementation sequence

### Phase 0 — Confirmation and repository readiness (0.5–2 active days)
- reconcile Stage 0 with Vault v1.4 and Pack v0.8;
- confirm technical stack through ADRs;
- inspect repository state before changing files;
- establish CI and branch/backup strategy;
- produce a small architecture map and first implementation plan.

Exit: user accepts the confirmation packet; CI can run a trivial build/test.

### Phase 1 — App foundation and visual system (3–5 active days)
- app shell, navigation and responsive layout;
- design tokens, typography, component states and Cognitive Atlas identity;
- local persistence adapter and schema registry;
- offline shell/service worker and explicit update prompt;
- error/empty/loading states;
- unit tests and phone viewport checks.

Exit: app installs/opens offline after first load, navigation works at 360 px, sample data persists across reload, no cross-origin runtime data calls.

### Phase 2 — Knowledge vertical slice (4–6 active days)
- discipline/domain/skill/subskill/objective catalogue;
- skill detail view;
- typed relationship model and validation;
- accessible tree/list and basic graph prototype;
- draft/review/approved lifecycle;
- search and filters.

Exit: user can inspect a real draft skill, navigate parent/child/related records and see draft vs approved clearly.

### Phase 3 — AI ingestion and governance (4–6 active days)
- JSON paste and file import share one pipeline;
- package envelope, schema validation, ID/reference checks;
- duplicate/version-drift checks;
- diff/impact preview and per-record decisions;
- explicit approval, atomic changeset, audit history and rollback;
- inert untrusted strings.

Exit: valid package previews without writes; reject invalid package; approve package; verify changeset and rollback.

### Phase 4 — Learning execution and evidence (4–6 active days)
- session capture, learner explanation, uncertainty and notes;
- assessment attempt and append-only evidence;
- five competency dimensions and eight derived states;
- review queue using transparent provisional rules;
- project/milestone records;
- workload-aware plans and no-backlog fallback.

Exit: complete one objective cycle from session → attempt → evidence → derived state explanation → later review.

### Phase 5 — Backup, restore and portability (3–5 active days)
- full archive export and checksum;
- save/share flow and SD-card fallback;
- archive verification;
- restore dry-run and merge/replace preview;
- scratch-store round-trip tests;
- older archive migration fixtures.

Exit: export → wipe scratch store → restore → compare canonical data hashes with no loss.

### Phase 6 — Hardening and real-device verification (3–5 active days)
- accessibility audit (keyboard, TalkBack, text scaling, contrast);
- graph benchmark and fallback behaviour;
- performance budgets and real-device profile;
- error recovery, storage quota and update/migration checks;
- documentation and release checklist.

Exit: all critical acceptance tests pass in CI; real-device limitations documented honestly.

## 4. Critical acceptance-test catalogue

| ID | Area | Required proof |
|---|---|---|
| AT-OFF-01 | Offline | After first install/load, app shell and core data views open in airplane mode |
| AT-OFF-02 | Offline writes | Notes, sessions, evidence, import preview and export work offline |
| AT-DATA-01 | Atomicity | Injected failure leaves prior database state unchanged |
| AT-DATA-02 | Rollback | Changeset inverse restores canonical state hash |
| AT-DATA-03 | Identity | Tombstoned codes cannot be reissued |
| AT-DATA-04 | Evidence | Evidence has no update/delete route; corrections supersede |
| AT-IMP-01 | Preview | Valid package preview performs no write before approval |
| AT-IMP-02 | Rejection | Invalid schema, dangling ID, cycle, duplicate and version drift show precise errors |
| AT-IMP-03 | Idempotency | Same package ID cannot be committed twice silently |
| AT-IMP-04 | Safety | AI package cannot set mastery or write health data |
| AT-IMP-05 | Inert data | Prompt-injection strings remain inert text; no execution/fetch |
| AT-GRAPH-01 | Graph | Layout drag changes layout only, never semantic node/edge hashes |
| AT-GRAPH-02 | Accessibility | Every graph operation has an equivalent searchable tree/list action |
| AT-GRAPH-03 | Scale | Visible-node cap enforced; graph chunk lazy-loaded |
| AT-MOB-01 | Mobile | No horizontal page overflow at 360 CSS px |
| AT-MOB-02 | Touch | Interactive targets meet 48 CSS px target or documented exception |
| AT-MOB-03 | Scaling | 200% text scale remains usable |
| AT-A11Y-01 | Accessibility | Keyboard focus, screen-reader labels, contrast and reduced motion checked |
| AT-BACKUP-01 | Export | Archive manifest, counts and checksum validate |
| AT-BACKUP-02 | Restore | Scratch restore is lossless and conflict preview precedes writes |
| AT-BACKUP-03 | SD card | Actual Android save-to-SD path tested; fallback documented |
| AT-HEALTH-01 | Health privacy | Dormant module collects no health data until explicit user activation |
| AT-HEALTH-02 | Separation | Health records cannot enter competency calculations or AI packages by default |
| AT-UI-01 | Visual QA | Required screens match Cognitive Atlas direction and component states |
| AT-SEC-01 | Security | CSP, sanitisation, import limits and untrusted content tests pass |

## 5. Release gates

- **Designed:** specification exists; no claim of implementation.
- **Implemented:** code exists and basic manual operation works.
- **Unit tested:** relevant unit tests pass.
- **Integration tested:** data and adapters pass together.
- **E2E tested:** user workflow passes in browser automation.
- **Emulator verified:** specified viewport/device emulation passes.
- **Real-device verified:** tested on named Android/browser combination.
- **Released:** build and migration path are reproducible; rollback and backup are documented.

Do not collapse these statuses into one “done” label.

## 6. V1 scope discipline

Prioritise reliable core flows over breadth:
- one complete objective/session/evidence cycle;
- one complete import/approve/rollback cycle;
- one complete backup/restore cycle;
- one accessible graph/tree navigation path;
- one polished responsive visual system.

Do not attempt to author a complete curriculum for all 18 disciplines before the app foundation works. Seed content is intentionally limited and labelled DRAFT.
