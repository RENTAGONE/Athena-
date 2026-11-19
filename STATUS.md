# STATUS: what was run, and what was not

## Pack v1.0 upgrade (2026-11-19)

`npm run verify` → exit 0: 47/47 domain tests, 47/47 with Ajv, 3/3 Dexie, `validate:pack` 1,266 records with 0 failures, production build and service worker generated.
`npm run test:e2e` → 3/3 pass. A browser session at 390×844 and 1440×900 imported the bundled Pack v1.0 seed (1,201 nodes, 1,125 edges, 2,326 changes) and rendered the full atlas with 0 horizontal overflow and no console errors.

Pack v1.0 merges the content owner's KB v3.28 working tier into the canonical v0.9 records: 146 domains (113 canonical + 33 working), 777 skill families (40 canonical + 737 working), 158 micro-skills (156 KB candidates with their substantive protocols + 2 canonical records with no counterpart) and 75 transfer links (31 canonical + 44 Message-14 hypotheses). Every canonical ATH-* code is preserved. The 156 KB candidates are imported as DRAFT with `review_required_before_approval` on the high-risk set; authoring is not approval.

The numbers in the table below describe the earlier v0.9 authoring run and are kept as recorded.



Authoring environment: a chat sandbox with **no network** (Node v22.23.4, TypeScript 6.0.3, Python 3). No npm package could be installed. Dependencies listed in `package.json` have never been installed or version-checked.

## Executed here, with real output

`node --test "tests/*.test.ts"` → **46 tests, 46 pass, 0 fail** (Node's built-in runner; TypeScript executed by Node's type stripping).

| Area | Tests |
| --- | --- |
| Importer conformance IMP-001 to IMP-022 (content owner's catalogue v0.1) | 22 |
| Domain: IDs, graph, store revision check, derived caches, change-set inversion, containment, preview purity, integrity | 9 |
| Evidence: v0.2 outcome fixtures agree with the content owner's verdicts; forbidden fields; storage mapping | 3 |
| Competency rules (profile `conservative-v0`) | 10 |
| Full Pack v0.9 seed through the real importer (293 nodes, 306 edges): counts, invariants, re-import no-op, archive round trip, micro-skill gates | 4 |

Also executed: `tsc --noEmit` over `src/domain`, `src/app` and `src/adapters/formats` (clean). The UI, Dexie, Ajv and config files were type-checked only against **throwaway stand-in type declarations**, which found no errors in the authored code except where the stand-ins were too loose. Real library types may expose more.

Test strength check: eleven rules were deliberately broken one at a time (hard-cycle check, evidence overwrite, checksum verification, UUID acceptance, tombstone check, revision conflict, attestation, SELF_REPORT counting, mastery without confirmation, multiple parents, mutating preview). Three escaped at first (revision conflict at store level, multiple parents, mutating preview); tests were added and all eleven are now caught.

The Pack's own validator was reproduced for v0.9 through a minimal stand-in for the `jsonschema` library: 56 files parsed, 461 records, 0 errors. My stand-in first reported 2 false failures because it did not implement `oneOf` and `not`; after adding them the result matches the Pack's report. It is not a full Draft 2020-12 validator.

## Scope of that evidence (important)

- The importer ran against an **in-memory store** with a **test-only schema validator**. It did not run against Dexie, Ajv, a browser or a phone.
- IMP-018 is **partial**: the migration preview is deterministic and writes nothing, but no rollback point exists yet. IMP-002 reports changed field **names**, not value diffs.
- "Atomic" means: the whole delta is computed first and applied in one step with a revision check. A real crash test exists only as a simulated failure.

## NOT run, NOT claimed

Dexie persistence, Ajv validation, standalone validator precompile, Vite build, PWA install, offline reopen, Playwright, CSP behaviour, bundle size, performance, accessibility, TalkBack, Android file sharing, SD-card save, real-device anything. **The UI has never been rendered.** Expect compile or runtime errors on first run.

## Not built yet

Session logging, evidence entry screens, review queue, planning, graph, Studio editors, real restore (only a scratch-copy check), restore points, update-time migration, health module (dormant by design), Bangla search tokeniser test, font-weight budget.

## Findings from building this (for the content owner or for review)

- **N-12** The evidence schema has no item-identity field, so "different item" and "distinct items" (retention, M2) cannot be derived from imported evidence. The app stores a learner-supplied `item_signature`; until then retention stays `unknown` and mastery cannot become a candidate from imports alone. That is deliberate and conservative, but it needs a schema decision.
- **N-13** M2's "one novel item" cannot be checked for the same reason; the parameter is not implemented rather than faked.
- **N-14** Micro-skill `discipline_links` have no specified relation type, so they stay in the stored record and are not turned into edges. `skill_links` and `prerequisites` are normalised (SUPPORTS, PREREQUISITE_FOR).
- **N-15** The package envelope (`athena_package: "0.1"`, separate arrays for nodes, micro-skills, contexts, relationships, transfer links, evidence) is **app-owned**; the Pack defines record schemas, not an envelope. Content owner to confirm or replace it.
- The importer enforces what the relationship registry says: `CONTAINS` is acyclic with one primary parent per record; only hard-gated `PREREQUISITE_FOR` edges must be acyclic.
- Seed archive size: about 1.5 MB uncompressed NDJSON for 293 nodes and 306 edges. Compressed size not measured.

## Deliberate deviations from the ADRs

- A 20-line hash router replaces React Router (fewer dependencies, easy to swap back).
- CSP allows `style-src 'unsafe-inline'` because React style props need it. `script-src` is `'self'` only.
- The app icon is a provisional mark, not the final compass-aperture design.

## Unverified assumptions to settle on first run

Package versions; Ajv standalone output shape and `validateFormats: false` (string formats are not checked in the browser build); `@fontsource` import paths; `vite-plugin-pwa` options; Workbox precache of the large seed chunk; React 19 and Vite 7 compatibility; Web Share with files on the target phone.
