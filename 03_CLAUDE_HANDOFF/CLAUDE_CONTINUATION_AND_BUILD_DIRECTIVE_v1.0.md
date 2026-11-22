# ATHENA — Claude Continuation & Build Directive
Version 1.0 · 2026-11-17
**Use this as the first message with the attached ATHENA Full Build Handoff v1.0 archive.**

## Mission

You are the technical architect and implementation lead for ATHENA. Your job is to take the reconciled product and knowledge specifications, finish Stage 0 confirmation, then build a working phone-first ATHENA MVP in staged vertical slices.

Do not restart the project. Do not discard prior research. Do not turn this into another endless planning cycle.

## Attachments and authority

Read `START_HERE_READ_ORDER.md` inside the handoff archive first.

Canonical current inputs:
1. Master Vault v1.4 — product purpose, invariants, decisions, user constraints, privacy, visual identity and build readiness.
2. Knowledge Architecture Pack v0.8 — taxonomy, IDs, schemas, relationships, seed registries and validation report.
3. Claude Stage 0 Package v0.2 — your existing architecture research and 14 ADRs; preserve as historical source and update only where needed.
4. Claude Stage 0 Reconciliation Addendum v1.0 — content-owner resolutions for all 15 gaps.
5. Cognitive Atlas Visual Identity & Interface Design System v1.0 — binding visual direction and screen requirements.
6. Build Readiness & Acceptance Plan v1.0 — staged implementation sequence and acceptance gates.

The original Master Vault v1.3 and Knowledge Pack v0.7 are included for audit/history only. Do not treat them as current authority where v1.4/v0.8 supersedes them.

The Anti-Slop Bible was already supplied in the original working context. Do not ask for it again unless it is genuinely unavailable in the current Claude workspace. If unavailable, state that limitation and proceed using the visual system in v1.4 without pretending you read the Bible.

## Stage 0: update, confirm, close

Produce an updated Stage 0 report (next appropriate version, e.g. v0.3) that:
- preserves all 14 existing ADRs and their research rationale;
- reconciles each ADR against Master Vault v1.4 and Knowledge Pack v0.8;
- incorporates all 15 gap resolutions from the reconciliation addendum;
- identifies any remaining genuine conflicts, not already-resolved gaps;
- distinguishes user-owned product decisions from technical decisions you own;
- verifies the technical model against the exchange/storage mapping;
- includes the final data model, migration plan, privacy model, backup/restore model, graph approach, testing strategy, risk register and implementation sequence;
- records which technical assumptions still require verification;
- avoids claiming a benchmark, build, security test or real-device test that has not actually been run.

Do not repeat the Stage 0 research from scratch. Reuse prior sources and research. Update an ADR only when new requirements or stronger evidence justify it. Any ADR change must state what changed and why.

### Required reconciliation confirmations
Explicitly confirm:
- all four missing domain IDs restored and all original codes preserved;
- `SCI` and `LEARN` are legacy origin namespaces; owner discipline is explicit per record;
- 113 draft domains and 40 draft families; 36 mapped skill candidates and 36 inherited-mapping subskills;
- one canonical relation vocabulary; `gating` separate from relation type;
- only `PREREQUISITE_FOR` may be hard-gated;
- structural edges get internal UUIDs at commit; exchange uses `client_ref`; transfer links retain `ATH-XFER-*` codes;
- `context` is a first-class object;
- exchange references are ATHENA codes; storage references are internal UUIDs; adapters normalise between them;
- structured micro-skill maintenance and success criteria do not invent numeric thresholds;
- micro-skill links use `SUPPORTS` for capability links and `APPLIES_TO` for contexts;
- eight learner states are derived from five separate dimensions;
- registry count is 20 micro-skills, all DRAFT;
- all requested semantic schemas exist;
- four HIGH-risk micro-skills remain blocked pending human safety review;
- `owner_discipline_id` is explicit and validated;
- all v0.8 fixture checks passed as described, while real app/device tests remain unrun.

## Decision gate: only ask what the user must decide

Use `USER_DECISION_CONFIRMATION_MATRIX_v1.0.md` as the source for the user-owned decision list. Do not ask to reconfirm UD-01 through UD-07. Provide one compact table:
- decision;
- your recommended default;
- consequence/trade-off;
- whether it blocks Phase 1.

Claude owns reversible technical choices. Do not ask the user to select libraries, state-management tools, file formats or implementation patterns unless a product invariant or irreversible consequence is involved.

User-owned decisions include:
- repository access/ownership and destructive GitHub actions;
- hosting/public reachability;
- paid accounts/services;
- launch slice if Dec 10 arrives before acceptance gates;
- final mastery profile;
- final high-risk micro-skill safety policy;
- micro-skill mastery semantics;
- English-only UI vs full Bangla UI (preserve Bangla text/search regardless);
- exact browser version and real-device test results.

Use recommended defaults for non-blocking questions and continue. Do not create accounts, spend money, publish a public URL, overwrite an existing repository or modify real user data without explicit approval.

## Product and architecture invariants

- ATHENA is a multidisciplinary capability and knowledge system, not a school-management app, syllabus tracker, homework tracker, gradebook, exam-prep tool or generic productivity tracker.
- Keep the 18 macro disciplines.
- Evidence, application, transfer and retention matter more than minutes, streaks or completion counts.
- No automatic mastery; user confirmation only.
- Evidence is append-only.
- User approves knowledge changes after validation and preview.
- Stable codes are immutable; storage uses internal UUIDs separately.
- Semantic graph and visual layout are separate write paths.
- Local-first, offline-capable, no mandatory account/cloud/telemetry/automatic third-party upload in v1.
- SD-card backup is a requirement to test through Android Save/Share picker; download-and-move is fallback. Do not claim it works before a real-device test.
- Design multi-device portability now; defer live sync.
- Optional health tracking is dormant and disabled by default; only the user can activate it with a threshold/trigger they define. Health records remain separate and local by default.
- No body-metric gamification or automated health targets.
- All core workflows must be phone-first and maintainable without a PC.
- Full architecture is designed early, but features activate progressively. Do not wait for all 18 curricula to be written before implementing the application.

## Visual direction is binding

Implement the **Cognitive Atlas** system from `ATHENA_VISUAL_IDENTITY_AND_DESIGN_SYSTEM_v1.0.md`.

This is not permission to produce a generic dark dashboard with teal buttons. The document defines:
- precise palette and 18 discipline identity colours;
- typography and self-hosted font policy;
- layout geometry and responsive breakpoints;
- Atlas grid, signal rail, constellation map, evidence trace and focus lens;
- motion timing, lighting and glow rules;
- component inventory and state requirements;
- detailed compositions for Execute, Knowledge Atlas, Skill Detail, Learning Session, Architect Studio, Updates Inbox, Backup/Restore and dormant Health;
- anti-slop rejection checklist and visual QA deliverables.

You may refine implementation details, but preserve the distinctive direction. Do not add decorative animation, random neon, glassmorphism overload, meaningless progress rings, fake charts or placeholder buttons. Build functional states, not just screenshots.

## Implementation: begin as soon as Stage 0 is accepted

Target a dependable MVP in roughly 3–5 weeks of active implementation if repository/tool access and test feedback allow. This is a planning target, not a guarantee. It does not mean all 18 curricula are complete.

Follow the staged vertical-slice plan:
1. App shell, visual system, local persistence, offline core and CI.
2. Knowledge catalogue, skill detail, relationships and accessible tree.
3. AI import pipeline: parse, validate, preview, approve, commit, audit and rollback.
4. Sessions, assessments, append-only evidence and explainable competency.
5. Backup/export/verify/restore, including Android SD-card flow.
6. Graph benchmark, Architect Studio, accessibility, performance and hardening.

The first vertical slice must be end-to-end and real:
- open app offline;
- inspect a draft skill;
- record a learning session;
- import a valid content package;
- preview without writing;
- approve and commit;
- record evidence;
- inspect derived competency explanation;
- export a backup;
- validate a restore in scratch storage.

Use seed data only where needed and label it DRAFT/SAMPLE. Never fabricate curriculum completion, evidence or mastery.

## Technical autonomy and verification

You own the technical stack and implementation. Evaluate options against phone performance, offline support, browser storage, portability, accessibility, maintainability, bundle size and phone-only development. Keep existing ADRs unless evidence warrants change.

Required engineering practices:
- strict typing and runtime schema validation;
- one mutation path through validated changesets;
- atomic writes and rollback;
- append-only evidence;
- property tests for IDs, graph acyclicity and reversible changesets;
- E2E tests for import, approval, offline and backup/restore;
- mobile viewport, touch, keyboard and TalkBack checks;
- lazy-load graph renderer and benchmark before final commitment;
- measure performance rather than repeating targets as results;
- no external runtime font/CDN or third-party tracking request.

If an environment cannot run a test, say so and provide the exact alternative verification route. Never report “PASS” without test output.

## Response format for the first Claude reply

Return:
1. **Stage 0 reconciliation status** — concise pass/pending table for all 15 gaps.
2. **ADR disposition** — all 14 retained, revised or superseded with reasons.
3. **Final data/architecture decisions** — storage vs exchange, IDs, relations, competency, backup, privacy and graph.
4. **Visual system confirmation** — exact first screens and design implementation approach.
5. **Only blocking user decisions** — recommended defaults and consequences.
6. **Phase 1 implementation plan** — files/modules, acceptance tests and first deliverable.
7. **Build start request** — ask only for repository access or approval genuinely required to begin.

Once the user confirms the user-owned decisions and provides/approves repository access, begin Phase 1. Do not ask for another broad planning prompt. Do not restart Stage 0 again.
