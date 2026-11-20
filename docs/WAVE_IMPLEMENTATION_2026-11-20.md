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

## Wave 2 completion — 2026-11-20 (second pass)

The atlas items that were listed as partial in the first pass are now implemented and were exercised in
a real browser against the seeded Pack v1.0 store (1,201 records, 1,125 relations).

| Item | Where | What is actually there |
| --- | --- | --- |
| Procedural biomes | `src/app/atlas-graph.ts` `biomeFor`, `src/ui/AtlasCanvas.tsx` `BIOME_LOOK` | Six biomes (ocean, verdant, desert, ice, volcanic, barren) chosen by a stable hash of the record code. Domains stay banded giants, skills stay rocky worlds; the biome sets sea, ground and land colours. |
| Day/night shading | `drawPlanetDetail` | Terminator gradient, cool night tint, a lit limb crescent and a specular highlight. Light falls from the upper left on every body. |
| Evidence-driven stage growth | `stageGrowth()` | A body's drawn radius grows with its own evidence count, up to +55%; hit targets and labels follow the drawn radius. No evidence, no growth. |
| City lights | `cityLightCount()` + `drawPlanetDetail` | One settlement per piece of evidence (capped at 56), placed only on the night hemisphere, so a lit world is a record of demonstrated work. |
| Black holes / quasars | `systemPhenomenon()` + `drawPhenomenon()` | A discipline with at least 12 records and zero evidence collapses into a black hole with a tilted accretion disc, photon ring and horizon. Three or more confirmed masteries over at least a quarter evidenced fires bipolar quasar jets. Anything in between stays an ordinary star. |
| Multi-galaxy zoom | `GALAXY_CLUSTERS`, `clusterByKey`, macro block in the canvas | Past 3,200 units the Core, Frontier (draft records) and Vault (retired records) are drawn as three spiral galaxies sized from real counts, each with its own label, dust lane and tap target. Empty galaxies are not drawn. |
| Hyperspace warp | `WARP_MS`, `isHyperspaceJump`, warp block in the canvas | Any jump over 2,600 world units — cluster to system, galaxy to galaxy, or a long thread midpoint — plays 650 ms of radial star streaks with `easeInOutQuart`, not the normal easing. |
| Move Bodies → Dexie | `spatialOverrides`, `overridesRef`, drag branch in the pointer handlers | Move mode drags any star, planet, moon, satellite or asteroid. The offset is written to the `spatialOverrides` table on pointer-up, restored on mount, applied on every frame, and cleared by Reset moves. |
| Zen View | `zen` state, `html.athena-zen` | Hides HUD, chips, galaxy rail, legend, drawer and the app chrome; Escape or Exit Zen returns. |

### Verified in the browser
- Pack seeded (1,201 records / 1,125 relations) and the atlas opened on the Knowledge route with no console errors.
- Macro view at 0.5× shows the Core star field and the Frontier spiral labelled from live counts.
- Flying into Electronics & Hardware isolated the system and its planets; the HUD reported 8 domains, 44 constellations, 2 skills, 2 subskills.
- Move mode dragged a body, `Reset moves (1)` appeared, a reload restored the override, Reset cleared it and the row stayed cleared after another reload.
- Zen applied `athena-zen` to the document and Escape removed it.

### Still not done (unchanged from the first pass, stated plainly)
- No Bangla translation layer (explicitly out of scope for this pass).
- Studio is a preview/approve/pack surface, not a node-by-node authoring editor, and the PCL duplicate audit of the 216 modules has not been run.
- `npm run test:e2e` still cannot run in this sandbox: Playwright Chromium needs system libraries (`libnspr4`, `libnss3`, `libatk-1.0`, …) that cannot be installed here (`sudo` refuses due to the no-new-privileges flag).

## Authoring desk, atlas-rule tests and the draft-revision fix (later pass)

| Item | State | Evidence |
| --- | --- | --- |
| Unit tests for the Wave 2 rules | **Delivered** | `tests/atlas-graph.test.ts`: biome determinism and full coverage, stage-growth cap and monotonicity, city-light budget, black-hole/quasar thresholds, the 2,600-unit warp threshold, galaxy lookup and mastery rings. `npm test` (glob `tests/*.test.ts`) picks the file up. |
| The "18 micro-skills will not commit" bug | **Fixed** | The KB revision carried new micro-skill bodies without a higher `content_version`, so the importer refused all 18 with `content_conflict`. `buildPlan` now takes `PlanOptions.allowDraftRevision`; a preview can accept changed **draft** records explicitly, each stored `content_version` increments, and approved content still refuses a same-version overwrite. Covered by `tests/pack-seed.test.ts`. |
| Studio authoring surface | **Started, working** | New `#/studio/author` desk: filter by discipline or code, edit title/description/status/owner, save a revision, retire a record, or branch a micro-skill into a new draft. Every write becomes a one-record exchange package and goes through `buildPlan → commitPlan`, so schema, namespace, code and version rules all apply. |
| Discipline chip as transport | **Delivered** | Choosing a discipline chip in the Atlas sets the filter, isolates that system and warps to it (1.0× → 171× measured); a lock pill names the held discipline and choosing the chip again (or Release) flies back out. In the Index view the chips only filter. |
| Visual pass | **Delivered** | Star diffraction spikes, more saturated stellar cores, a bright nucleus and two slow dust arms on the mapped core galaxy, and Frontier/Vault sized so the cluster reads as three galaxies rather than one web plus a smudge. |

Not done in this pass: creating records from a blank form (branching a micro-skill is the only create path), and the Playwright end-to-end suite still cannot run here (missing `libnspr4`/`libnss3` and no sudo).
