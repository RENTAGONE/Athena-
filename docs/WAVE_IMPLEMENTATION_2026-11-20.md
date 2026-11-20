# ATHENA — wave implementation record (20 November 2026)

This file records what was actually built in this pass, what was verified, and what remains. It is not a
progress percentage and it does not claim a curriculum, learner evidence or device testing that does not exist.

## Wave 1 — ontology and store

- `src/app/ontology.ts` — six distinct celestial classes (`star`, `planet`, `constellation`, `moon`,
  `satellite`, `asteroid`) plus typed attached systems (knowledge marker, outcome, expedition, beacon,
  probe, trace, trajectory). Relation semantics keep `CONTAINS`, `PREREQUISITE_FOR`, `SUPPORTS`,
  `RELATED_TO` and `TRANSFER_TO` distinct; only a hard `PREREQUISITE_FOR` can lock a path.
- `src/app/selectors.ts` — the atlas projection no longer compresses six levels into three. Domains are
  planets, skill families are constellations, skills are moons, subskills are satellites and micro-skills
  are asteroid telemetry markers. Unparented records stay drawn under their owner star, are listed in the
  Index, and are counted as orphans for repair.
- Progressions read only real prerequisites. The free explorer ignores gating entirely; page visits never
  change mastery.
- `src/adapters/store-dexie.ts` — additive Dexie v2. All twelve operational tables are added with indexes;
  no v1 table is dropped or re-indexed. Activity actuals and the schedule audit log refuse overwrites.
- `src/domain/system.ts` — typed records for schedule, routines, tasks, availability, proposals, actuals,
  audit, three-class projects, PCL progress, spatial overrides and side quests.

## Wave 3 — engines

- `src/app/engines/schedule.ts` — deterministic offline capture ("tomorrow at 8 AM … might … three hours …
  travel 30 minutes round trip" → tentative, 08:00, 180 min, 15/15 travel, 70% confidence, no
  confirmation), conflict detection (overlap, impossible travel, missing buffer, availability, overload,
  recovery), approval-gated proposals with before/after snapshots and undo, recurrence with single-occurrence
  exceptions and pause, and recovery-aware day planning that drops optional blocks instead of promising an
  impossible day.
- `src/app/engines/projects.ts` — exactly three classes, validated lifecycle, milestone dependency and cycle
  checks, acceptance criteria, completion gates, evidence requirements for product claims, project tasks
  shared with the schedule by reference.
- `src/app/engines/pcl.ts` — ten practical tracks, each a fifteen-section capability card indexing existing
  canonical records. Tracks with no canonical match are labelled `NEW`; no skill record is manufactured.
- `src/app/kbpack.ts` + Studio “KB pack” tab — zip export/import with an added/updated/rejected diff, an
  append-only evidence rule, the GPT pack spec, and a SHA-resolving GitHub contents push.

## Wave 2 — atlas, partially delivered

Delivered: 6,500-unit galaxy radius with a 2,400-unit minimum star separation, exponential zoom from 28 to
24,000 units (`zoomDistance`), logarithmic camera interpolation, constellation clusters drawn as clusters
rather than planets, satellite and asteroid bodies kept distinct, and the HUD reporting all tiers.

Not yet delivered: procedural planet biome textures, day/night city lights, black holes and quasars,
multiple galaxies beyond the core, hyperspace streak rendering, and drag-to-move body persistence. The data
tables for spatial overrides and side quests exist, but those interactions are not wired.

## Verification (this environment)

- `npm run verify` → exit 0: typecheck, 73/73 unit tests, 73/73 Ajv-mode tests, 3/3 Dexie tests, pack
  validation 1,266 records with 0 failures, production build and service worker.
- New tests: `tests/schedule.test.ts` (10) and `tests/projects-ontology.test.ts` (8), covering the brief’s
  football example, tentative-never-confirmed, missing-field questions, conflicts, approval/undo, recurrence
  exceptions, day planning, six-tier projection, orphans and project lifecycle gates.
- Browser checks on the running app at 360×800: all ten routes rendered with zero horizontal overflow and no
  console errors; the capture flow produced the expected preview and recorded a tentative plan.
- `npm run test:e2e` could not run here: Playwright’s Chromium needs system libraries (`libnspr4`,
  `libnss3`, …) and this VM has no sudo or package source. The E2E spec is unchanged and should be run on a
  machine with browser dependencies installed.

## Known limitations

- Pack v1.0 remains a draft seed, not an approved curriculum. Draft and review states are preserved.
- Micro-skill links and owner relations still need semantic reconciliation; the orphan count reported by
  Studio is the honest starting point.
- Schedule capture is English-only and rule-based. Bangla/English localisation of the parser is not done.
- PCL cards match canonical records by title/code hints; the disposition ledger is reported in the Library
  header, but a full duplicate audit of all 216 modules was not performed here.
- Studio is still not a full authoring environment; this pass added the pack forge, not node-by-node editing.
