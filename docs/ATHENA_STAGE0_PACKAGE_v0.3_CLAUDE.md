# ATHENA — Stage 0 Package

**Version 0.3 (draft for review) · 2026-11-17**

Inputs: Build Pack v0.1, Anti-Slop Bible, Master Vault v1.2, Knowledge Architecture Pack v0.6. Nothing here is implemented and no benchmark has been run. Every performance figure is a target to be measured, not a result.

**Version 0.3 update.** Part A below confirms Stage 0 against Master Vault v1.4 and Knowledge Pack v0.8 and supersedes v0.2 wherever it says so. Sections 0–12 after Part A are the v0.2 baseline, preserved unchanged as the handoff requires; they were written against the earlier Vault v1.2 and Pack v0.6.

## A1. Result

Stage 0 is confirmed against Master Vault v1.4 and Knowledge Pack v0.8. All 15 gaps are resolved at the level the Addendum states, all 14 ADRs are kept (3 with amendments, 2 revised, none superseded), and nothing found blocks Phase 1 scaffolding. The one blocker is yours: repository access (UD-08).

**What I checked myself (measured on 2026-11-17):**

- **Archives:** the two standalone ZIPs are byte-identical to the copies nested in the Full Handoff, and every file in the Pack is identical to the Vault’s knowledge folder.
- **Validator reproduction:** `validate_pack.py` needs the `jsonschema` library, which I cannot install offline. I ran the script unchanged against a minimal stand-in I wrote for the keywords the schemas use. Result: 50 JSON files parsed, 432 record instances checked, 0 errors, matching the report. A negative control (a domain record missing `owner_discipline_id`) was rejected. **Limit:** the stand-in is not a full Draft 2020-12 validator and does not meta-validate the 25 schema documents, so I rely on the Pack’s report for that part.
- **Independent data checks (my own script):** every v0.2 domain, family, seed, transfer, context and micro-skill ID is preserved in the new versions; the 4 restored domains are present; counts are 113 domains, 40 families, 36 skills, 36 subskills, 29 seed nodes, 31 transfer links, 6 contexts and 20 micro-skills; 0 namespace or owner violations; all 20 micro-skills are DRAFT; the 4 HIGH-risk records carry a pending safety review.
- **Contrast:** I computed WCAG ratios for the design tokens (A6).

**Not done, and not claimed:** no application code, build, CI run, browser or IndexedDB test, PWA test, graph benchmark, security test, or real-device test, including the SD-card flow on the Infinix HOT 60i. This chat sandbox has no network, so it cannot install dependencies or run Vitest or Playwright. Those run in CI once a repository exists (A7).

## A2. Reconciliation status: all 15 gaps

All 15 gaps match the Addendum’s status. The middle column is what I confirmed in the v0.8 data itself, not only in the Addendum text.

| Gap | What I confirmed in v0.8 | Status |
| --- | --- | --- |
| G-01 | All 4 domain IDs present, draft and needs\_review: `ATH-DOM-ENG-COMPUTE` under ENG; `ATH-DOM-MATH-PHYS` and `ATH-DOM-MATH-CHEM` under MATH; `ATH-DOM-WORK-LEARN` under WORK. No v0.2 ID dropped; 29 of 29 seed IDs unchanged; the 2 orphaned parent references now resolve. | Resolved structurally; subject review pending |
| G-02 | The namespace registry lists 20 namespaces: 18 disciplines plus legacy `SCI` (owners MATH, RES) and `LEARN` (owner WORK). 0 namespace or owner violations in 254 records (113 domains, 40 families, 36 skills, 36 subskills, 29 seed nodes). The 4 legacy-segment records carry explicit owners. | Resolved; the instance-ID suffix rule has no data test yet |
| G-03 | 432 instances, 0 errors (A1). | Resolved for fixtures; production importer test pending |
| G-04 | The registry holds 17 relationship types: the 13 original, `EXPLAINS`, `ENABLES`, `SHARED_FOUNDATION_FOR`, and `SUPERSEDES` (see N-05). Only `PREREQUISITE_FOR` allows gating. `TRANSFER_TO` is kept. | Resolved |
| G-05 | `gating` is a separate field. A hard gate needs `PREREQUISITE_FOR`, strength required and a justification, which the validator enforces. The seed has 3 structural edges and none is hard. | Resolved; cycle detection untested on real data, so synthetic tests are needed |
| G-06 | Structural edges use `client_ref` (3 in the seed). The 31 transfer links keep `ATH-XFER-*` codes. | Resolved; see N-04 |
| G-07 | `context` is an object type with its own schema; 6 contexts present. | Resolved |
| G-08 | The exchange and storage mapping standard matches my import design (§2.5): codes resolve through the registry and embedded links normalise to edges. | Resolved; round-trip tests pending |
| G-09 | `maintenance_policy` on all 20: interval 7 (at 7, 30 or 90 days), manual 7, event-triggered 5, provider-guided 1. Success criteria: 20 of 20 are `qualitative`. | Resolved structurally; criteria content review pending |
| G-10 | `SUPPORTS` and `APPLIES_TO` are defined for micro-skill links, but all 20 micro-skills have empty `discipline_links`, `skill_links` and `prerequisites`. | Rule resolved; no instances yet (N-03) |
| G-11 | The `COMPETENCY_STATE` schema’s five dimension enums and eight states match my §6 exactly. | Resolved |
| G-12 | 20 micro-skills. The README, handoff and pack headers now say v1.4 and v0.8. | Resolved |
| G-13 | 25 schema documents cover all 16 listed object types. Instances exist for the registries plus 1 objective, 1 unit and 1 assessment. None exist for evidence, resources, projects, milestones, practice protocols or competency states. | Resolved at contract level, as stated |
| G-14 | The 4 HIGH-risk records have `safety_review` set to needs\_review and `review_required_before_approval` true. Supervision: 3 adult-guidance-recommended, 1 qualified-instructor-required (the CPR record). | Guardrail in place; human review open (UD-13) |
| G-15 | `owner_discipline_id` is on domains, families, skills, subskills, seed nodes and relationships. The validator checks owner against parent for domains, families, skills and subskills. A whole-graph check against the primary `CONTAINS` chain is an app test. | Resolved for seeds; app test pending |

## A3. Remaining conflicts in v1.4 and v0.8

Eleven differences remain that the 15 gaps did not cover. None touches a product invariant and none blocks Phase 1. Four ask something of the content owner (N-01, N-03, N-04, N-05); I resolve the rest on my side.

| ID | Finding and resolution | Severity | Decides |
| --- | --- | --- | --- |
| N-01 | The evidence schema has no structured outcome: `result_summary` and `rubric_results[].result` are free text, but the competency rules need a per-target outcome. **Resolution:** storage adds `outcome` (not\_demonstrated, partial, demonstrated) and optional per-criterion `met`. A package may propose them; they take effect only when you approve the evidence in the preview. Ask the content owner to add both to evidence schema v0.2. | Medium | Both |
| N-02 | Evidence `conditions` are booleans (calculator, notes, AI, hints, collaboration, tools, time limit) with no independence field. **Resolution:** independence is derived. It is independent only when your attestation is yes, `ai_used`, `hints_used` and `collaboration_used` are false, and `notes_used` is false unless the assessment allows notes. An unknown attestation counts as assisted. The attestation is storage-only, and a package cannot set it. | Medium | Me |
| N-03 | All 20 micro-skills have empty `discipline_links`, `skill_links` and `prerequisites`, so the micro-skill subsystem is not yet linked to any skill. **Resolution:** the app shows them as unlinked drafts; the content owner supplies links through packages. | Low | Content owner |
| N-04 | The evidence `target_ids` pattern still admits `ATH-EDGE-*`, although structural edges have no permanent code, and the 3 seed `client_ref` values are written as `ATH-EDGE-…`. **Resolution:** the importer treats `client_ref` strictly as package-local and rejects `ATH-EDGE-*` as an evidence target; transfer evidence targets `ATH-XFER-*`. Ask the content owner to drop EDGE from the pattern and rename the prefix. | Low | Content owner |
| N-05 | `SUPERSEDES` is in the relationship registry but not in the Addendum’s list of additions. **Resolution:** I use it for retired-code successor links and need confirmation that this is its intent. | Low | Content owner |
| N-06 | The storage node schema keeps `parent_id` and `discipline_ids`. **Resolution:** they are read-only derived caches maintained from the primary `CONTAINS` edge and the owner rules; direct writes are rejected and a test asserts equality. Edges stay the single source of truth. | Low | Me |
| N-07 | Evidence `target_ids` is an array; my §5.2 had one target per row. **Resolution:** store `target_ids` as the exchange record has it, plus an index table `evidence_targets` for lookups. Append-only is unchanged. | Low | Me |
| N-08 | The exchange `evaluator` has type (learner, human, ai, automated, external), name, version and `prompt_or_protocol_ref`; my §5.2 added provider and model. **Resolution:** use the exchange fields and keep provider and model in `extensions`. | Low | Me |
| N-09 | `text-muted` (#8799A5) on `surface-3` (#20323F) measures 4.49:1, just under the 4.5:1 normal-text threshold; it passes on the other four surfaces (5.24 to 6.62). **Resolution:** no small `text-muted` text on sheets and popovers, or lighten that one pair by a step; logged as a deviation. | Low | Me |
| N-10 | Six discipline colour pairs are close (RGB distance about 18 to 21): body and comm, art and lang, psy and perf, indep and comm, art and indep, lang and indep. The spec already forbids colour-only identification, so graph nodes always carry glyph and label; I check distinguishability in the graph benchmark. | Low | Me |
| N-11 | The 14 domain records in the historical foundation seed duplicate the domain map by design (source mirrors). **Resolution:** the domain map wins; seed mirrors are kept as provenance and are exempt from duplicate detection. | Low | Me |

## A4. ADR disposition

All 14 ADRs are kept. Nine are retained unchanged, three are retained with an amendment, two are revised, and none is superseded. The original text of every ADR stays in §4 below.

| ADR | Disposition | What changed and why |
| --- | --- | --- |
| 001 Stack | Retained | Vault v1.4 sets no stack. The visual system needs three self-hosted font families; none of Inter, Space Grotesk or IBM Plex Mono covers Bangla, so Bangla text uses a system fallback with an optional bundled subset if the target phone lacks coverage (to verify on the device). |
| 002 Local database | Retained with amendment | Health data lives in a separate IndexedDB database that is created only on explicit activation, so the dormant module stores nothing and can be exported or deleted without touching learning data (privacy spec §9). |
| 003 Sync and backup | Retained | v1.4 confirms local-first with no sync. Added: the SD-card flow (Save/Share picker, download-and-move fallback), labelled “designed; device test pending” until UD-18 passes. |
| 004 Identity | **Revised** | The exchange `id` of authored content is the ATHENA code, so packages may propose codes. ATHENA allocates every internal UUID and is the only authority that registers codes: it checks namespace, uniqueness and tombstones at commit and rejects clashes. This narrows my v0.2 wording that AI never mints codes. Added: the namespace registry (a code’s segment is an immutable origin label), structural edges with UUIDs only plus `client_ref` in exchange, and `ATH-XFER-*` codes only for transfer links. |
| 005 Graph renderer | Retained (provisional) | The visual spec’s focus lens, node cap and separate Explore and Arrange modes were already in §2.6. Spike S-1 gains two checks: visual fidelity to the Atlas node rings and halos, and the now-known target device. |
| 006 State management | Retained | No new evidence. |
| 007 Validation and versioning | **Revised** | The Pack’s 25 JSON Schema documents are now the authoritative exchange contracts, and G-03 showed what drift costs. Exchange records are validated against those schemas with Ajv, precompiled to standalone validators at build time so no runtime code generation is needed under the strict CSP (to verify in Stage 1). Zod 4 stays for internal storage types and domain logic. CI reproduces the Pack validation (432 of 432) and checks that exported records validate against the same schemas. This replaces “Zod generates the published JSON Schema” for exchange; Zod’s generated schemas now cover storage and the archive manifest only. |
| 008 Authentication | Retained | No new evidence. |
| 009 Testing | Retained with amendment | Added: reproduce the Pack validation in CI; health-separation and no-health-in-packages tests; SD-card tests on the named target device; visual QA screenshots at 360×800, 393×852 and 1440×900; the release-gate vocabulary (Designed to Released) in every report. |
| 010 Deployment | Retained; needs your approval | Unchanged recommendation (GitHub, CI, static host, no public URL). It stays blocked on UD-08, UD-09 and UD-10. I inspect the repository before any write and never overwrite. |
| 011 PWA and updates | Retained | Fonts are self-hosted and precached; the SD-card flow does not depend on the File System Access API. |
| 012 History model | Retained | No new evidence. |
| 013 Search | Retained with amendment | Bangla text and search are required from v1 (UD-15 default). The tokenizer is tested on Bangla fixtures, with an `Intl.Segmenter` fallback if MiniSearch’s default fails them. |
| 014 Retention and rule profiles | Retained | Profiles stay data. The parameter table the Addendum asks for is in A5. |

## A5. Final data and architecture decisions

The v0.2 model stands. The decisions below are settled, followed by the competency parameters the Addendum asks to see and the model changes v1.4 and v0.8 force.

### Settled decisions

- **Storage versus exchange.** Exchange records carry ATHENA codes; stored records carry an internal UUID plus `code`. Adapters convert both ways. Embedded convenience links are normalised into edges on import and regenerated on export. Unmapped fields go to `extensions` and are reported, never dropped.
- **Identity.** UUIDv7 internal keys. An ATHENA code is immutable, never recycled and tombstoned on retirement. Its segment is an origin label, owner is explicit per record, and no ID derives from a name, parent path or order; numeric suffixes are instance counters.
- **Relations.** One registry-driven vocabulary (17 types seeded from the Pack). `gating` is a field, not a type. Only `PREREQUISITE_FOR` can be hard-gated, and a hard gate needs strength required, a justification and acyclicity (an error). Other relations may cycle. Transfer links never gate.
- **Competency.** Five stored dimensions, eight derived states, mastery only by your confirmation, rules held as data.
- **Backup.** Gzip NDJSON archive with the manifest the privacy spec requires (format and app version, per-type schema versions, registry and rules versions, device ID, counts) and a SHA-256 over canonical content. Restore dry-runs in a scratch store, creates a restore point, and offers four conflict strategies: keep local, accept imported, duplicate as a draft, defer. This extends my v0.2 Replace-or-Merge choice. A file the browser will not let us read back is labelled “exported, not independently re-read”.
- **Privacy.** Local only, strict CSP, no third-party requests. Health data sits in its own database, dormant until you activate it with a threshold you define, and no AI package can write to it. Encrypted export waits until key derivation, recovery and failure behaviour are documented and tested.
- **Graph.** Cytoscape.js stays provisional and lazy-loaded with a 300-node cap. The tree and list view is a full equivalent. Spike S-1 runs on the target phone.
- **Multi-device.** `device_id` on changesets, record versions, per-type schema versions, tombstones and package idempotency now; no live sync and no CRDT.

### Competency profile `conservative-v0` (provisional data, not a final rule)

| Parameter | Default | Handling |
| --- | --- | --- |
| Evidence that counts for performance | RETRIEVAL, EXPLANATION, PROBLEM\_PERFORMANCE, PRACTICAL\_DEMONSTRATION, PROJECT\_ARTEFACT, TRANSFER\_PERFORMANCE, EXTERNAL\_VERIFICATION | Only classes the objective’s assessment methods allow. SELF\_REPORT never counts. |
| Independence | Your attestation is yes; no AI, hints or collaboration; notes only if the assessment allows them | Unknown counts as assisted. |
| Demonstrations for a mastery candidate (M1) | 3 independent, on 3 separate days, spanning 14 days or more | Parameter in the profile. |
| Item variation (M2) | At least 2 distinct item signatures, one novel | The same item within 24 hours counts once. |
| Rubric (M3) | All required criteria met in the latest 2 independent attempts; explanation criterion if the objective lists it |  |
| Delayed retention (M4) | One independent demonstration 14 days or more after the first, on a different item | `retained` needs 7 days or more and no lapse. Immediate repeats never count. |
| Transfer (M5) | One TRANSFER\_PERFORMANCE record in a different context | Only when the objective flags transfer. |
| Safety-critical (M6) | EXTERNAL\_VERIFICATION and a supervision record | Shown as “practised to criteria”, never “qualified”. |
| Latest attempt (M7) | The latest independent attempt is not `not_demonstrated` |  |
| Review ladder | 1, 3, 7, 14, 30, 60, 120 days; success moves up one box, partial stays, failure drops two (minimum 1) | Reminder heuristic, not a claim of optimal spacing. |
| Lapsed mastery | Shown as `lapsed` with its history | Restored only by new independent demonstrations that meet the profile, plus your re-confirmation. |
| Overrides | Objective, then outcome class, then discipline, then safety class, then default | No universal threshold across the 18 disciplines. You approve the profile (UD-12) before it is shown as final. |

### Model changes forced by v1.4 and v0.8

- `relation_types` is seeded from the Pack, and a `namespaces` table from the ID Namespace Registry (20 entries, 2 legacy).
- `nodes` use the Pack’s 15 object types. `owner_discipline_id` is mandatory on every record except disciplines, and also on edges, as the exchange relationship schema requires.
- A read-only `content_coverage` table (113 records: 71 taxonomy only, 42 seeded draft) drives honest labels, because product invariant 12 forbids false completeness.
- Evidence follows the exchange record (N-01, N-02, N-07, N-08): `target_ids[]` with an `evidence_targets` index, `outcome`, exchange `evaluator` fields, and a storage-only `independence_attestation`. Competency snapshots use the `COMPETENCY_STATE` fields exactly.
- Micro-skills are stored whole in the v0.2 schema, including `maintenance_policy`, `success_criteria` and `safety_review`. Their upper-case status maps to the lower-case lifecycle. Three success criteria mention numbers in prose (30 seconds, 95 percent, 60 seconds); they are qualitative and are never parsed as thresholds.
- Health data: separate `athena_health` database, no tables until activation, its own export category.
- Seed mirrors: the 14 domain records in the historical foundation seed are provenance only (N-11).
- **Migration plan.** Database and archive migrations are unchanged (ADR-007). Content needs no ID migration: every v0.2 ID is preserved in v0.3. The `HISTORY` folders are audit material and are never imported as current.

## A6. Visual system confirmation

I accept the Cognitive Atlas specification as binding. Nothing below is built yet, so no screenshot, Lighthouse figure or device check exists; those are the Phase 1 and Phase 6 deliverables.

### First screens (the first vertical slice)

1. **Execute / Today:** “No plan approved” empty state with a real create-or-review action and always-reachable quick capture. A recommended next action appears only when an approved plan exists.
2. **Knowledge catalogue to Skill Detail:** one of the Pack’s 36 draft skills, with a DRAFT status tag, its stable code, the five competency dimensions each showing “not assessed”, objectives and subskills, grouped prerequisites, and working Start practice and Record evidence actions.
3. **Learning Session:** one task at a time, optional timer that never counts as evidence, notes, uncertainty and help markers, and an end-of-session explanation step.
4. **Updates inbox:** paste or file, package receipt, validation report before the diff, per-record accept or reject, approval footer with exact counts.
5. **Evidence entry and competency explanation:** conditions form, outcome confirmation at approval, then the derived state with its evidence list and rules version.
6. **Backup and Restore:** last verified export, one export action, verify with checksum and counts, scratch-store restore dry run, and the restore-point explanation.

The Atlas graph, Architect Studio and the dormant Personal Health screen follow in later phases.

### Implementation approach

- **Tokens:** every hex value, spacing step, radius and duration from the spec becomes a CSS custom property in one `tokens.css`; Tailwind v4 maps to those variables and no colour is written ad hoc. Discipline colours are separate `--discipline-*` tokens used only for glyphs, rails, node rings and filter markers.
- **Type:** self-hosted subsets of Space Grotesk, Inter and IBM Plex Mono, precached, with metric-matched fallbacks; tabular numerals on counts, dates and durations. I will set a font-weight budget when I measure it.
- **Signature devices:** the atlas grid is a static CSS background on empty canvas areas only; the signal rail is a 1–3 px edge on the active item; evidence trace is a compact strip of date, class, independence and outcome; the focus lens lowers the opacity of non-neighbours; instrument labels are small uppercase monospace with 0.08em spacing.
- **Components:** the full inventory in spec §8, each with default, hover, pressed, focused, disabled, loading, error and selected states where they apply, checked by automated state screenshots rather than a separate Storybook dependency.
- **Motion:** CSS transitions on transform and opacity at the spec’s durations; reduced motion becomes immediate state changes; no looping decoration.
- **Icons and mark:** one Lucide line-icon family, tree-shaken, and an original inline-SVG compass-aperture mark.
- **Layout:** dark theme first with tokens structured so light mode can follow; breakpoints at 480, 840 and 1200 px; bottom navigation for Execute, Knowledge and Studio at 360 px; 48 px touch targets.

### Contrast, computed (WCAG 2.x relative luminance)

- `text-primary` is at least 12.04:1 and `text-secondary` at least 6.94:1 on all five surfaces.
- `text-muted` is 5.24 to 6.62:1 on four surfaces but **4.49:1 on `surface-3`**, just under the 4.5:1 threshold (N-09).
- All six signal colours are at least 5.96:1 on every surface, and `text-inverse` on `signal-teal` is 11.76:1.
- All 18 discipline colours are at least 7.1:1 on `surface-1`. Six pairs sit close together (N-10), so colour never identifies a discipline on its own.

These are arithmetic on the token values, not a rendered-screen audit.

### Deviations so far

One: the `text-muted` on `surface-3` pairing (N-09). The list will be kept current for the visual QA deliverables (spec §12).

## A7. Decisions that need you, Phase 1 plan, and what is unverified

UD-01 to UD-07 are accepted and not reopened. Library, state-management, file-format and pattern choices are mine. Only UD-08 blocks Phase 1.

### Decisions that need you

| Decision | Recommended default | Consequence or trade-off | Blocks Phase 1? |
| --- | --- | --- | --- |
| UD-08 Repository access and ownership | An existing repository you approve. I inspect it before writing, work on a new branch, and never force-push or delete. | Without a repository nothing can be built or tested in CI, because my sandbox has no network. The alternative is an unverified scaffold ZIP. | Yes, for repository work |
| UD-09 Hosting and public reachability | No public URL until you choose a host; an unlisted static preview only. | Installing on the phone needs HTTPS, so real-device install tests wait for a preview host. | No for development; yes for release |
| UD-10 Paid services and accounts | Free tooling only; nothing created or bought without approval. | Limits me to free CI and hosting tiers (terms to verify). | No |
| UD-11 Dec 10 launch scope | A small, reliable capture-and-protect slice if the full MVP is not acceptance-ready: sessions, baseline evidence, approved imports, backup. | Competency views, graph and Studio may arrive after Dec 10. Data integrity is never weakened. | No for development; yes for launch |
| UD-12 Mastery profile | Keep `conservative-v0` as data; you alone confirm mastery. | Mastery is labelled provisional until you approve the profile. | No for scaffolding |
| UD-13 HIGH-risk micro-skill gate | The 4 records stay DRAFT and unschedulable until a human safety review; CPR needs a recognised instructor. | Those 4 stay out of every schedule. | No; yes for those records |
| UD-14 Micro-skill mastery | No separate mastery label; demonstrated, retained and maintenance states only. | Simpler now; a label can be added later. | No |
| UD-15 Bangla UI | English interface first; full Bangla text and search from v1. | A Bangla interface later needs translation and review. | No |
| UD-16 Second device | Portable architecture, no live sync. | Nothing visible in v1. | No |
| UD-17 Target browser | I need the exact browser name and version on the Infinix HOT 60i (X6728, Android 15). | Budgets and the graph benchmark are calibrated to it. | No |
| UD-18 SD-card test | Test Save/Share and the download fallback on that phone. | Backup stays labelled “designed; device test pending” until it passes. | No for Phase 1; yes for any backup release claim |

### Phase 1 plan

**Order (planning only, not a guarantee).** Phase 0 is repository and CI readiness; then Phase 1 foundation. I recommend building a thin end-to-end slice early, covering all ten steps of the directive with minimal UI and seed data labelled DRAFT or SAMPLE, then deepening each phase, so integration risk shows in the first weeks.

**Modules and files:**

- `schemas/exchange/`: the Pack’s v0.8 JSON Schemas, vendored, hash-pinned and read-only; `fixtures/pack-v0.8/` holds the seed registries.
- `src/domain/`: `ids`, `codes` (namespace and tombstone rules), `graph` (relation registry, ownership, acyclicity), `changeset`, `competency` (rules and profile), and the Zod storage schemas.
- `src/app/`: the import pipeline state machine and the backup service.
- `src/adapters/`: `store-dexie` (migration v1), `formats` (exchange and storage mappers for the registries, micro-skills and evidence), `file-io`, `clock`, `idgen`.
- `src/ui/`: `tokens.css`, components, shell and routes. `src/sw/`: the Workbox configuration.
- `tests/`: unit, property (fast-check), integration (fake-indexeddb), end-to-end (Playwright), and a test that reproduces the 432-instance Pack validation.
- `.github/workflows/verify.yml`: typecheck, lint with the dependency-direction rule, tests, bundle budget, schema-drift check and Pack validation.

**Acceptance for Phase 1:** AT-OFF-01; AT-DATA-01 to AT-DATA-04 for the core; AT-MOB-01 to AT-MOB-03; the no-cross-origin and CSP part of AT-SEC-01; Pack validation 432 of 432 in CI; AT-UI-01 for the six first screens at 360 px; sample data persists across reload; no external font or CDN request.

**First deliverable:** a CI-green repository with an installable, offline-capable shell at 360 px showing the Execute empty state, and the Knowledge catalogue and Skill Detail loaded from the Pack’s draft seeds through the adapter and labelled DRAFT, with data persisting across reload, the token file and component inventory, and a CI report with real test output. It does not claim a real-device or on-device Lighthouse result.

### Still unverified

- Package versions and bundle sizes (React, Vite, Dexie, Cytoscape, Ajv, Zod, MiniSearch): not measured.
- That precompiled Ajv validators avoid runtime code generation under the strict CSP.
- Web Share with files, picker destinations and SD-card access on the Infinix HOT 60i and its actual browser; whether File System Access exists there.
- Persistent-storage grant and IndexedDB quota on that phone.
- Bangla rendering, font subset size and MiniSearch tokenisation of Bangla text.
- Cytoscape fidelity to the Atlas visuals, and pan and pinch at about 30 fps with 300 nodes.
- Free-tier terms for CI and static hosting for personal use, and Claude Code from the mobile app as the build environment.
- Everything listed under “Not done” in A1.

### Build start request

I need only UD-08: which existing repository may I work in, and may I use a new branch? The browser name and version (UD-17) can follow whenever convenient. Everything else proceeds on the defaults above.

## 0. Continuation state and recommendation

### 0.1 What was done, and what was not

- **Completed:** Build Pack v0.1 read in full (7 files).
- **Completed:** Anti-Slop Bible reviewed. Phase 1 (performance, animation, UI laws), the Phase 4 master directive, and the openings of Phase 5 and the audit matrix were read in full. The Dhaka niche matrices, unit-economics tables and five B2B component listings were scanned by heading only, because Vault §15 and your Stage 0 brief exclude them.
- **Completed:** stack research on 2026-11-16 (local storage, graph rendering, framework, validation, backup APIs). Sources and confidence are in §12.
- **Completed:** both new ZIPs read, and their registries machine-checked (§8.1).
- **Not completed before this document:** no Stage 0 deliverable had been written yet. This is its first written version, so nothing was duplicated or discarded.
- **Carried forward as ADRs:** ADR-001 to ADR-014 (§4).

### 0.2 Recommendation in brief

- Build a local-first, installable PWA: React 19, TypeScript strict, Vite. Next.js is the wrong tool here: there is no server and no SSR need.
- Store data in IndexedDB through Dexie, behind a Store port. Every change is an immutable, reversible changeset. Evidence is append-only.
- Identity has two layers: an internal UUIDv7 `id` (never shown) and the ATHENA ID as `code` (immutable, unique, never recycled, never parsed for logic).
- Zod 4 schemas are the single source for validation, TypeScript types and the JSON Schemas that ChatGPT and Gemini produce against.
- Graph: Cytoscape.js (canvas) behind a GraphPort, plus a mandatory accessible tree twin. Provisional until a benchmark spike passes.
- Competency: five separate dimensions. The Vault’s eight learner states become a derived view. Mastery is never an input and always needs your confirmation.
- Backup is export-first (gzip NDJSON archive with checksum). No accounts, no sync, no third-party services in v1.
- Delivery: build and verify through a GitHub repo with CI and static hosting. Your Vault says you have no PC, so no build, test, deploy or maintenance step may need one (§2.1, §11).
- Needs you, not me: hosting account, delivery pipeline, Dec 10 launch scope, micro-skill scheduling gate (§11).

### 0.3 New conflicts found

Fifteen gaps between the Vault, the Knowledge Pack and the technical model (§8.3). The most serious: four v0.1 seed domains silently absent from Domain Map v0.2 (G-01), registries that fail the supplied JSON Schemas (G-03), and a relation vocabulary that disagrees with the Decision Register (G-04).

## 1. Constraints from the Vault that shape the design

- **Phone-first Android, no dedicated PC.** Every step of build, test, deploy and content editing must work from a phone. Verification runs in CI, not on a laptop. Routine content changes happen in Architect Studio, not in source code.
- **The learner is a minor.** No accounts, no third-party analytics, no cloud service in v1. Any later cloud feature is a guardian-aware decision, not a default.
- **Time:** Asia/Dhaka (UTC+6). School Sunday–Thursday 8:00–13:00 is a protected time block, not a school-management feature. Friday and Saturday are weekend and buffer.
- **Weekly review (Saturday 20:00) already exists outside ATHENA** (ATH-DEC-013). ATHENA will not build a second scheduler or notifications. It will export a compact review pack that the existing review can read.
- **Division of work:** Gemini teaches, ChatGPT evaluates and prepares updates, ATHENA validates, stores and schedules, you approve. ATHENA stays evaluator-agnostic. JSON import and copy-paste share one engine (ATH-DEC-004).
- **School is not an organising taxonomy.** No class, grade, homework or exam entities. School appears only as an external context (ATH-CTX-\*) that transfer links can point at.
- **Learning lanes A–E** (foundations, continuity practice, business reading, aesthetics, physical development) have unequal, capped workloads. Launch is 2026-12-10 with a baseline diagnostic snapshot, not a gate.
- **Content versus app ownership.** ChatGPT owns semantics (IDs, curricula, edges, assessments). I own the technical model. Where the technical model needs a semantic change, it goes on a hand-back list (§8.3), not into a silent edit.
- **Data minimisation.** The Vault contains body measurements. ATHENA v1 stores no body metrics. Training and nutrition stay as learning objects and practice, not health records.

## 2. Architecture proposal

### 2.1 System overview

Four layers, with dependencies pointing inward only:

- **UI:** React routes for the three environments (Execute, Knowledge, Architect Studio), plus an Updates inbox and Settings.
- **Application services:** pure TypeScript use-cases (sessions, assessment, competency, review scheduling, planning, import pipeline, Studio, backup).
- **Domain:** schemas, invariants, competency rules, scheduler, graph validation. Imports nothing from React or Dexie.
- **Adapters:** Store (Dexie), GraphView (Cytoscape), FileIO, Clock, IdGen, and format adapters for the Vault registries.

One write path: every mutation is a `ChangeSet`, validated, then committed in one IndexedDB transaction. Learner activity (sessions, self-reports, attempts, evidence) commits as auto-approved changesets because it is the learner’s own act. Knowledge changes (anything touching nodes, edges, rules, schedules proposals) need explicit approval.

Proposed repository layout:

```
athena/
  docs/        adr/ specs/ gaps/
  schemas/     generated JSON Schemas, committed and versioned
  src/
    domain/    entities, invariants, competency rules, scheduler
    app/       use-case services, import pipeline state machine
    adapters/  store-dexie/ graph-cytoscape/ file-io/ clock/ idgen/ formats/
    ui/        routes, components, design tokens
    sw/        service worker configuration
  tests/       unit/ property/ integration/ e2e/ fixtures/
```

**Delivery constraint.** My chat sandbox has no network, so it cannot install dependencies or run a real build. Real implementation needs an environment with network access and a repository. The path I recommend is Claude Code (reachable from the Claude mobile app) against a GitHub repo, with GitHub Actions as the arbiter of “tests pass” and static hosting for preview builds. I have not verified current setup steps or limits; I will check the documentation before Stage 1 and will not claim a test passed unless CI ran it.

### 2.2 Local-first and offline behaviour

- The app shell is precached by a service worker (hashed assets). Reading, notes, session logging, review, evidence entry, import preview and backup all work with no network.
- The only network uses are first install and the update check. No runtime data fetching. After Stage 1, a test asserts zero cross-origin requests.
- **Update policy:** a new service worker waits. The app shows “Update ready”. Accepting it triggers, in order: an automatic restore point, a migration dry-run, then activation. Updates never apply silently.
- **Durability:** request persistent storage after first meaningful data and display the result. Best-effort storage can be evicted under pressure; a granted request is not a guarantee, and users can still clear site data. Show `storage.estimate()` usage in Settings.
- **Multi-tab:** the Web Locks API gives migrations and imports a single writer. A BroadcastChannel tells other tabs to refresh.

### 2.3 Persistence and synchronisation

Dexie (IndexedDB) holds four table groups:

- **Knowledge:** nodes, edges, relation\_types, code\_registry (with tombstones), contexts, graph\_layouts.
- **Learner:** sessions, self\_reports, attempts, evidence (append-only), review\_events (append-only), competency\_snapshots (derived cache), notes.
- **Execution:** lanes, routine\_blocks, plans, plan\_items, execution\_records, micro\_assignments.
- **System:** changesets, update\_packages, snapshots (restore points), settings, system\_versions, feature\_roadmap, rules.

Rules enforced in the repository layer, because IndexedDB has no foreign keys: referential integrity, type-compatible edges, acyclic hard prerequisites, unique codes, tombstone-not-delete, optimistic concurrency by `version`. Hard delete exists only as an explicit “purge” behind a restore point and confirmation.

**Sync:** none in v1 (ADR-003). Every record carries `id`, `version`, `updated_at` and the changeset log carries a `device_id`, so a later file-based or CRDT sync does not require re-modelling.

### 2.4 Import, export and backup

- **Archive format (ATHENA Archive v1):** gzip-compressed NDJSON. Line 1 is a manifest (format version, per-type schema versions, registry version, app version, created\_at, device\_id, counts). Then one `{table, record}` per line. A footer line holds a SHA-256 of all preceding lines. Streaming keeps memory low on a phone.
- **Complete by design:** nodes, edges, relation types, code registry including tombstones, evidence and review history, attempts, sessions, notes, layouts, changesets and provenance, rules versions. Historical evidence stays resolvable even when its target is deprecated. Evidence rows also store a `target_code` snapshot, so references can be rebuilt from codes if ids are ever lost.
- **Context pack export:** a compact JSON of current codes, titles, relation types and versions that you give to ChatGPT or Gemini, so they reference real codes instead of inventing them.
- **Human-readable export:** notes as Markdown; graph as nodes and edges JSON. No vendor lock-in: the manifest points at the published JSON Schemas.
- **Restore:** validate, dry-run into a scratch store, show a diff (counts, conflicts), then Replace (restore point first) or Merge (authored objects match by `code`, learner records by `id`). Never silent.
- **Restore points** are automatic before any import, migration, bulk Studio change or purge. They live on the same device, so they do not protect against device loss. Only an exported archive does.
- **Destinations on Android:** Web Share with a file (share sheet to Drive and similar), `<a download>` as fallback, File System Access only where present. Support for the save picker on Android Chrome is documented inconsistently, so the design does not depend on it (spike S-2).
- **Backup freshness:** Settings shows days since the last verified export and a non-blocking banner when activity exists and the last export is over 7 days old. “Verify export” re-reads the file and checks the hash. A restore drill restores to a scratch store and compares counts and hash.

### 2.5 AI update ingestion and approval pipeline

Paste and file import enter the same pipeline (ATH-DEC-004). States: `received → parsed → validated → previewed → approved → committed`, with terminal `rejected`, `failed`, `superseded`. The raw text, its hash and the validation report are kept for provenance.

- **Parse:** JSON only. Reject non-JSON; accept one wrapper of Markdown code fence because chat tools add it. Size cap, no HTML rendering, prototype-pollution guard.
- **Envelope validation:** `schema_version`, `package_id` (opaque idempotency key), `generated_by {tool, model, generated_at}`, `based_on` registry and object versions, content hash. Provider-specific fields are not allowed beyond `generated_by`, so ChatGPT and Gemini packages go through identical checks.
- **Normalise:** embedded link fields (parent\_id, prerequisite\_ids, skill\_links and similar) are converted into edge operations. Edges are the only stored source of truth (G-08). Fields a format adapter cannot map are kept in a namespaced `extensions` bag, never dropped.
- **Resolve references:** by `code` (preferred for authored content) or `id`. New objects carry a `client_ref`. **AI never mints ids or codes:** ATHENA allocates both at commit, and codes are never recycled.
- **Semantic checks:** type-compatible edge endpoints, acyclic hard prerequisites, duplicate detection (Unicode-normalised title plus aliases within a discipline, warning not block), ownership rule (one canonical owner; no duplicate objects for cross-links), missing success criteria on objectives, missing safety fields on risky items, version drift against `based_on`.
- **Policy gates:** a package cannot set competency or mastery. It may carry evidence records and competency proposals; ATHENA computes what the rules allow and flags any claim beyond that. AI-reported evidence is admissible only after you approve it, and independence is an attestation you tick per attempt, defaulting to unknown.
- **Preview:** grouped diff (adds, changes, archives, edges, evidence, proposals), risk flags, per-item accept or reject, with dependency closure (you cannot accept an edge without its endpoints).
- **Commit:** restore point first, then one transaction creating a changeset with `source=update_package` and full provenance. **Undo** applies the inverse changeset; it reports conflicts when later changes depend on the one being reverted.
- **Inert content:** every string from a package is data. Nothing is fetched, executed or interpreted as a command. URLs are stored as text and opened only on a tap.
- **Prompt injection stance:** text inside a package that tries to instruct ATHENA has no effect because no field is interpreted. It is shown to you in the preview like any other text.

### 2.6 Knowledge graph architecture

- **Two layers that never share a write path.** The semantic layer is nodes, edges and a relation-type registry. The visual layer is `graph_layouts` (positions keyed by node id) and view state. The renderer can only emit `LayoutChanged`; a test asserts that dragging nodes leaves the node and edge hashes unchanged.
- **Relation types are data, not code** (G-04). Each record holds: code, label, what source→target means, symmetric flag, allowed (source type, target type) pairs, cycle policy, required fields, status. It is seeded with the 13 types in the Ontology. Adding `shared_foundation_for`, `enables` or `explains` is an approved changeset, not a release.
- **Edge constraints:** no self-loops; unique (type, source, target) among active edges; every non-discipline node has exactly one active primary `CONTAINS` parent (the canonical owner); `PREREQUISITE_FOR` must be acyclic — an error for `required` or hard-gating edges, a warning for `recommended` and `helpful`. Cycles are allowed in `RELATED_TO`, `CONTRASTS_WITH`, `SUPPORTS` and `TRANSFER_TO`. A property test asserts that no prerequisite is ever inferred from another relation type.
- **Transfer links** are ordinary edges with transfer metadata (type, distance, mechanism, expected benefit, limitations). Their `evidence_state` is derived: `hypothesised` until a transfer evidence record in a named context references the link. A link alone is never evidence.
- **Visual language:** discipline identity = stable colour token + glyph + pattern. Node state is drawn from the five competency dimensions, with a legend and never colour alone. There is no single progress percentage.
- **Level of detail:** disciplines always; domains and families at mid zoom; skills, subskills and objectives only in the focused neighbourhood. Hard cap of 300 visible nodes, target 150.
- **Interaction:** Explore mode (pan, pinch, tap for a bottom-sheet detail, tap an edge to read its rationale and mechanism) and Arrange mode (long-press or toggle; drag, pin, reset). Drag is disabled in Explore so it cannot fight panning.
- **Accessible twin:** a searchable tree/list shares selection with the graph. Every graph action has a list equivalent (select, show prerequisites, open detail, filter). “What blocks me” is a list computed from hard prerequisites.

### 2.7 Architect Studio

- **Same engine as imports.** A Studio draft is a locally authored ChangeSet: draft → validate → preview with impact analysis → approve → commit → history → rollback. One code path, one set of validators.
- **Editors:** disciplines, domains, skills, objectives, resources, assessments, micro-skills, lanes and routines, relation types, competency rule profiles, feature roadmap statuses.
- **Impact analysis before approval:** dependents affected, evidence that would be orphaned, cycle and ownership checks, and a recompute preview of derived competency under the current rules version.
- **Data versus software.** Studio changes data only. Software capability changes ship as app updates through the service-worker prompt and appear on an “App and capabilities” screen with statuses Available, Designed, Planned, Future, Needs upgrade. Eligibility never deploys code.
- **Bulk path:** export a subtree as JSON, have ChatGPT edit it, import it as a package. Forms are one concern per screen with local draft autosave.

### 2.8 Security, privacy and data ownership

- **Local-only by default.** No analytics, telemetry or third-party scripts. Strict CSP (`script-src 'self'`, `connect-src 'self'`). Self-hosted fonts.
- **Content safety in the renderer:** Markdown is sanitised, raw HTML is not rendered, links open only on tap.
- **Import hardening:** size limits, strict schemas, unknown keys rejected at the envelope (extra data is allowed only inside a namespaced `extensions` bag), file-type checks.
- **Ownership:** export at any time in a documented, versioned format; no cloud dependency.
- **No accounts in v1.** Optional later: local app lock (WebAuthn or PIN) and passphrase-encrypted export (WebCrypto AES-GCM with PBKDF2-SHA-256) before any cloud destination. Encryption at rest inside IndexedDB is not in v1; device lock is the baseline.
- **Safety metadata is enforced, not decorative.** `risk_level`, `supervision` and `safety_notes` drive banners and scheduling gates (policy in §11). ATHENA never labels the learner qualified or certified; an external-verification record can only note verified training.
- **Minor-appropriate:** no social features, public profile or share links.

### 2.9 Mobile performance, accessibility and design

- **Budgets (targets, to be measured):** shell JS ≤ 150 KB gzip; graph chunk lazy-loaded ≤ 200 KB gzip; LCP ≤ 2.5 s, INP ≤ 200 ms, CLS < 0.1 on a throttled mid-range Android profile and one real device.
- **Heavy work off the main thread:** import validation, graph checks and search indexing run in a Web Worker. Lists are virtualised past about 100 rows.
- **Motion:** transform and opacity only; honour reduced-motion; nothing decorative loops.
- **Accessibility target WCAG 2.2 AA:** contrast ≥ 4.5:1, touch targets ≥ 48 CSS px, no colour-only meaning, managed focus in sheets, 200% text scaling, a TalkBack walkthrough of core flows.
- **Layout:** 360 px first; bottom navigation for the three environments; primary actions in thumb reach; tabular numerals so figures do not jitter.
- **Visual direction** (Vault §14): near-black charcoal base, deep navy and teal surfaces, restrained cyan and violet accents, strong type hierarchy. No gamified streaks or mastery badges.

## 3. Anti-Slop adaptation

**Carried over:** measured performance budgets (LCP, INP, CLS) with self-hosted, metric-matched fonts; tabular numerals; transform/opacity-only motion; purposeful asymmetric hierarchy instead of symmetric template card rows; sharp structural borders over muddy soft shadows (as a design-language choice); specificity in every label (action + object + constraint) with no vague buttons such as “Submit” or “Get Started”; no truncated code, no `TODO` presented as finished, no completion claims without passing tests; the Bible’s banned filler phrases reused as a UI-copy review checklist.

**Not carried over:** Next.js APIs (`next/font`, `next/image`), the Framer Motion spring constants (tuned for B2B demo pages; CSS transitions are enough and cost no dependency), WhatsApp funnels, taka and lakh formatting, the four business archetype palettes, Dhaka zones and niche matrices, and the pre-built B2B components.

**One deliberate difference:** the Bible says to fill mock arrays with realistic records. ATHENA’s rule (Vault §2) is stricter: sample data must be flagged `is_sample`, labelled on screen, excluded from real aggregates, and never presented as real. Fixtures live in tests and an explicit demo mode only.

## 4. Architecture Decision Records

All ADRs are **Proposed** until you review this package. Each lists options, decision, rationale, risks, and what would trigger a revisit.

### ADR-001 Framework and application stack

- **Context:** offline-first, mobile, no backend; accessible dialogs, sheets and menus matter; you already work in React, TypeScript and Tailwind (your Bible’s stack).
- **Options:** Next.js static export; React 19 + Vite SPA; Svelte 5 + SvelteKit (static); SolidJS.
- **Decision:** React 19, TypeScript strict, Vite, React Router (declarative), Tailwind CSS v4 with CSS-variable design tokens, and an accessible primitives library (Radix or React Aria, chosen in Stage 2 by bundle size and a11y tests).
- **Why:** Next.js adds server concepts and PWA friction for no benefit when all data is local. Svelte 5 is the credible runner-up: third-party comparisons put its runtime at a few KB against roughly 42–45 KB gzip for React (indicative only). In an installed PWA the shell is precached, so that cost is paid once, while ecosystem depth and your existing knowledge lower long-term maintenance risk.
- **Risks:** React runtime weight on low-end phones. Mitigate with budgets, code-splitting and no heavy UI kits.
- **Revisit if:** INP stays above 200 ms and is attributable to the framework on the target device, or the shell budget is breached after Stage 2. **Migration:** domain and app layers are framework-free, so only the UI layer is replaced.

### ADR-002 Local database and persistence

- **Options:** Dexie over IndexedDB; raw IndexedDB with `idb`; SQLite WASM on OPFS; RxDB; PouchDB; localStorage (rejected: small and synchronous).
- **Decision:** Dexie 4.x behind a `Store` port.
- **Why:** small, mature and actively maintained (4.4 release notes, March 2026); transactions, live queries, versioned upgrades, inspectable in browser DevTools, easy for a non-specialist maintainer. SQLite WASM would add SQL, real foreign keys and FTS5, but third-party sizing puts the WASM near 0.9 MB gzip, it needs a Worker, OPFS files cannot be inspected in DevTools, and the common no-isolation VFS has single-connection limits that complicate multiple tabs. Notion’s write-up shows it works at scale, but with real engineering effort.
- **Cost:** integrity is enforced in the repository layer instead of the database. Mitigate with property tests on every invariant.
- **Revisit if:** complex relational or analytic queries, full-text needs, more than about 50k records, or p95 query time above 100 ms. **Migration:** the `Store` port plus the backend-neutral archive make a SQLite swap a contained change.

### ADR-003 Cloud synchronisation and backup

- **Options:** none with export-first backup; user-held file backup via the share sheet; Dexie Cloud; CRDT (Yjs, Automerge, Loro) with a relay; Firebase or Supabase.
- **Decision:** no sync in v1. Export-first backup, with optional passphrase-encrypted export.
- **Why:** the learner is a minor, so accounts and third-party processing need guardian-aware consent; vendor lock-in and cost; the Vault says sync is an optional layer, not a dependency.
- **Risk:** exports not taken. Mitigate with the freshness banner, verify action and restore drill (§2.4).
- **Revisit if:** a second device is needed. Likely first step: file-based encrypted changelog exchange through storage you hold; Dexie Cloud second. Any account creation needs your explicit approval.

### ADR-004 Identity: internal keys and ATHENA codes

- **Options:** ULID; UUIDv7; UUIDv4; nanoid; ATHENA IDs as primary keys; auto-increment.
- **Decision:** every record has a UUIDv7 `id` (lowercase, hyphenated). The ATHENA ID is stored as `code` with a unique index; it is immutable, never recycled, and retired codes are tombstoned. Codes are never parsed for logic. Their discipline segment is an *origin namespace*, not the current owner (ownership is the primary `CONTAINS` edge). Only ATHENA allocates codes and ids. Edges and evidence get internal ids only; `code` is optional on edges except transfer links (`ATH-XFER-*`).
- **Why UUIDv7 over ULID:** RFC 9562 standard, time-sortable, maps to native uuid columns if the data ever moves to Postgres. ULID is a close tie (shorter, 26 characters). **Why not ATHENA IDs as keys:** they embed a discipline segment, and drift already exists in the supplied seed (G-02); a move would force an ID migration.
- **Merge rule:** authored objects match by `code`, learner records by `id`. Evidence rows keep a `target_code` snapshot so links survive an id loss.
- **Risk:** the same code maps to different ids on different installs. Mitigate with code-keyed merge.

### ADR-005 Graph rendering technology (provisional)

- **Options:** Cytoscape.js (canvas); Sigma.js (WebGL); d3-force with custom SVG; React Flow / XYFlow (DOM nodes); custom canvas or PixiJS.
- **Decision:** Cytoscape.js behind a `GraphPort`, with a mandatory accessible tree twin. Provisional until spike S-1 passes.
- **Why:** built-in touch pan and pinch, compound nodes (discipline groups), layout extensions for hierarchical and force layouts, and graph algorithms useful for prerequisite chains. Sigma is built for 100k-node scale and WebGL contexts add low-end-device risk for little gain at ATHENA’s scale. SVG or DOM nodes give per-node accessibility and rich cards, but cost grows with node count on weak phones; React Flow stays the fallback with the level-of-detail caps.
- **Cost:** canvas has no per-node accessibility, so the list twin is required; node detail lives in a DOM bottom sheet; the library is a lazy-loaded chunk of roughly 100 KB gzip or more (measure it).
- **Spike S-1 pass criteria** (synthetic, labelled data; throttled CPU and one real device): 300 visible nodes and 600 edges; sustained 30 fps during pan and pinch; tap-to-selection under 100 ms; chunk within budget. If it fails, run the same test on React Flow and a custom canvas before changing the decision.

### ADR-006 State management

- **Options:** Redux Toolkit; Zustand; Jotai; XState; React context only.
- **Decision:** Dexie `liveQuery` is the single source for persisted data (no mirrored copy in a store). Zustand holds ephemeral UI state only (selection, filters, open sheets). The import pipeline is a hand-written discriminated-union state machine with exhaustive tests. Forms stay plain controlled components until Studio (Stage 8).
- **Why:** one source of truth avoids sync bugs between a store and the database. XState adds a concept your small pipeline does not need.
- **Risk:** live-query re-render storms. Keep queries narrow and test render counts. **Revisit if:** the pipeline grows past about eight states or gains parallel regions.

### ADR-007 Validation and schema versioning

- **Options:** Zod 4; Valibot; Ajv with hand-written JSON Schema; TypeBox; ArkType.
- **Decision:** Zod 4 is the single source. Runtime validators give TypeScript types and the published JSON Schemas (`z.toJSONSchema`), committed in `/schemas`. CI fails if generated schemas differ from the committed ones (schema-drift check).
- **Why:** one definition instead of three, and a machine-readable contract that ChatGPT and Gemini can be given. Zod 4 is roughly 12–15 KB gzip in third-party comparisons against 1–2 KB for Valibot; accepted within the shell budget. Valibot stays the fallback if the budget is breached.
- **Versioning:** each object type has its own `schema_version` (the Vault schemas are 0.1.0), recorded in the archive manifest. The database schema uses Dexie `version(n).upgrade()`. Every migration is a pure function tested against golden archives from every earlier version. Forward-only, with rollback through the automatic restore point. An archive newer than the app is refused with an explanation.
- **Vault schemas are inputs, not the implementation.** CI produces a conformance report of our generated schemas against the Vault’s, so drift is visible (see G-03).
- **Migration:** format adapters (`formats/`) translate the current registry shapes into canonical records until the content owner issues schema v0.2.

### ADR-008 Authentication

- **Options:** none; local app lock (PIN or WebAuthn); account-based sign-in.
- **Decision:** none in v1. Optional local lock later.
- **Why:** no server, a minor learner, and no sync in v1, so an account would add risk and consent questions for no function. **Revisit if:** cloud sync is approved; accounts then need a guardian-aware decision.

### ADR-009 Testing

- **Decision:** Vitest with fake-indexeddb for unit and integration; fast-check for property tests; Playwright for end-to-end at 360×780 with touch, offline mode and service-worker update scenarios; `@axe-core/playwright` for accessibility; Lighthouse CI for budgets; golden archive fixtures. Everything runs in GitHub Actions and through one local command.
- **Completion rule:** no feature is called done without a passing CI run, and each stage ends with an Implemented / Partial / Not implemented / Risky report.
- **Limit:** emulation is not a device. Every stage includes a short real-device checklist.

### ADR-010 Deployment and delivery pipeline (needs your approval)

- **Options:** Vercel static; Cloudflare Pages; Netlify; GitHub Pages; self-hosting.
- **Recommendation:** GitHub repository, GitHub Actions CI, static hosting on Vercel (you already use GitHub and Vercel), security headers set in a config file, preview deployments for phone testing, `noindex`. An unlisted URL is not a private one, and ATHENA holds no server-side data anyway.
- **Why not GitHub Pages:** it cannot set custom response headers (to verify), which weakens the CSP.
- **Open points:** current free-plan terms for personal use (verify); who owns the accounts, since the learner is a minor and a guardian may need to be involved; Claude Code via the mobile app as the build environment (verify).
- **Revisit if:** the hosting terms or limits change. The output is a static folder, so moving hosts is cheap.

### ADR-011 PWA, offline strategy and updates

- Workbox precache of hashed assets through `vite-plugin-pwa` (prompt mode); navigation fallback to the shell; no runtime caching of data; no automatic `skipWaiting`.
- `navigator.storage.persist()` requested after first meaningful data; result shown in Settings.
- A recovery screen can reset the app-shell cache but never touches data.
- Android Chrome is the target. iOS is out of scope; its stricter eviction rules for non-installed sites would need a separate review.

### ADR-012 History model

- **Options:** CRUD with `updated_at`; full event sourcing; current-state tables plus immutable changesets.
- **Decision:** current-state tables plus immutable changesets holding forward and inverse operations. Evidence and review events are append-only tables outside changesets; corrections add a superseding row.
- **Why:** rollback, provenance and sync-readiness without the cost of full event sourcing.
- **Risk:** log growth. Monitor size; compaction only into an archived snapshot with your approval, and never for evidence.

### ADR-013 Text search (lower confidence)

- **Decision:** MiniSearch in a worker over titles, aliases, codes, summaries and notes, with a tokenizer based on `Intl.Segmenter` for non-Latin scripts. Rebuilt incrementally on commit.
- **Alternatives:** Dexie prefix queries (too weak), FlexSearch, SQLite FTS5 (see ADR-002 triggers).
- **Confidence:** chosen on engineering judgement; I did not research this one. Confirm in Stage 5.

### ADR-014 Retention scheduling and rule profiles

- **Options:** Leitner-style ladder; SM-2; FSRS; manual only.
- **Decision:** v1 uses a transparent ladder per target (provisional intervals 1, 3, 7, 14, 30, 60, 120 days) stored as data. FSRS is evaluated after enough review history exists. Competency and mastery rules are **profiles stored as data**, not code (Vault: thresholds are discipline- and objective-specific and reviewable). The default profile `conservative-v0` is provisional and needs the content owner’s review.
- **Why:** the Vault says no single interval is optimal; parameters must be explainable to you and adjustable through an approved changeset.

## 5. Initial data model

### 5.0 Conventions

- **Storage form versus exchange form.** Authored files embed convenience links (`parent_id`, `prerequisite_ids`, `skill_links`, and similar). On import these are normalised into edges. In storage, edges are the only source of truth. Exports regenerate the embedded fields.
- **Common fields on every record:** `id` (UUIDv7), `code` (where the standard defines one), `object_type`, `status` (draft, review, approved, deprecated, archived; adapters map the micro-skill upper-case values), `content_version` (integer), `label` (display string such as 0.1.0), `title`, `aliases[]`, `summary`, `provenance {origin: learner | ai_package | authored_import | system, package_receipt_id, tool, model, observed_at}`, `created_at`, `updated_at` (UTC ISO-8601), `version` (concurrency counter), `is_sample`, `extensions` (namespaced bag for unmapped fields).
- **Time:** UTC instants everywhere; schedule and execution records also carry `local_date` and `tz` (default Asia/Dhaka).
- **Validation tiers:** error (blocks commit), warning (shown, can be approved), info.

### 5.1 Knowledge layer

**nodes** — one physical table, one Zod schema per `object_type`: discipline, domain, skill\_family, skill, subskill, concept, learning\_objective, learning\_unit, resource, assessment, project, milestone, micro\_skill, practice\_protocol, context.

- **Discipline:** `curriculum_status`, `accent_token`, `glyph_key`, `sort_order` (display only, never identity).
- **Domain and skill family:** `owner_discipline_id`, `review_state`.
- **Skill, subskill:** `scope_notes`, plus the shared `safety` block.
- **Concept:** `definition`, `misconceptions[]`.
- **Learning objective** (Vault schema, kept whole): `primary_outcome_class`, `observable_action`, `target_object`, `conditions[]`, `success_criteria[]`, `assessment_methods[]`, `evidence_dimensions[]`, `misconceptions[]`. Technical additions: `aids_allowed[]`, `retention_matters`, `transfer_matters`, optional `rules_profile_id`.
- **Learning unit, practice protocol, resource, assessment, project, milestone, context:** technical schemas are proposed here because the Vault names the types but supplies no schema (G-13). Resource: `kind`, `url`, `offline_blob_id`, `licence_note`, `verification` (unverified, learner\_checked, externally\_verified). Assessment definition: `method`, `rubric {criteria[{id, text, dimension}], pass_rule}`, `required_conditions`, `item_variant_policy`, `rubric_version`. Project and milestone: `goal`, `deliverables[]`, `acceptance_criteria[]`. Context: `context_type`, `description`.
- **Micro-skill:** the Vault schema is stored whole (definition, target performance, practice protocol, assessment, maintenance, risk level, supervision, safety notes, progression, status). Proposed optional additions for the content owner to approve (G-09): `maintenance_policy` (structured cadence), structured `success_criteria[]`, and `content_version`.
- **Shared `safety` block:** `risk_level` (low, moderate, high), `supervision` (the four Vault values), `notes[]`. Required for practical or physical items in body, electronics, cybersecurity and independent-living areas.
- **Ownership:** `owner_discipline_id` is derived from the primary `CONTAINS` chain. `discipline_ids` holds the owner plus cross-listed disciplines, and a validator checks they agree (G-15).

**edges** — `id`, optional `code`, `relation_type`, `source_id`, `target_id`, `status`, `strength` (required, recommended, helpful), `gating` (none, advisory, hard; G-05), `rationale` (mandatory for prerequisites and transfer links), `order_hint` (display only), transfer fields (`transfer_type`, `transfer_distance`, `mechanism`, `expected_benefit`, `limitations`, derived `evidence_state`), `evidence_refs[]`, `source_refs[]`, `review_state`, `content_version`, provenance.

**relation\_types** — data-driven vocabulary (§2.6). **code\_registry** — `code`, `id`, `object_type`, `namespace`, `issued_at`, `state` (active, tombstoned, superseded), `superseded_by_code`. **graph\_layouts** — `layout_id`, `name`, `positions {node_id: {x, y}}`, `pinned[]`, `kind` (manual, hierarchical, force, grouped).

### 5.2 Learner layer

- **sessions:** `started_at`, `ended_at`, `local_date`, `planned_item_id`, `activities[{target_id, kind: read | watch | practise | review | build, minutes}]`, `resource_ids[]`, `learner_report {what_studied, own_explanation, understood[], unclear[], can_do_independently[]}`. Minutes are context only and never feed competency rules.
- **self\_reports** (append-only): `target_id`, `level` (unknown, struggling, partial, confident), `at`, `session_id`. Latest wins for display.
- **attempts:** one assessment sitting: `assessment_id`, `assessment_version`, `at`, `administered_by {kind: self | ai_tool | human, tool, model}`, `conditions`, `transcript_ref`.
- **evidence** (append-only, immutable): `target_id`, `target_code` snapshot, `observed_at`, `class` (self\_report, retrieval, explanation, problem\_performance, practical\_demonstration, project\_artefact, transfer\_performance, external\_verification), `dimensions[]` judged (accuracy, explanation, independence, transfer, retention, quality, safety, judgement), `assessment_id`, `assessment_version`, `rubric_version`, `task`, `conditions {independence: independent | prompted | collaborative | unknown, reference: closed_book | open_book | unknown, aids[]: notes, hints, worked_examples, calculator, ai_assistance, reference_manual, collaboration, time_limit_s}`, `result {outcome: not_demonstrated | partial | demonstrated, criterion_results[{criterion_id, met, note}]}`, `artefact_ref`, `evaluator {type: self | ai | human | external, name, provider, model, version}`, `confidence {level, basis}`, `limitations`, `learner_reflection` (kept separate from the observed result), `item_signature` (hash for repetition detection), `context_id` (for transfer), `is_baseline`, `supersedes_id`, `disputed {reason, at}`, provenance. A correction creates a new row; nothing is edited or deleted.
- **review\_events** (append-only): `target_id`, `at`, `mode` (free\_recall, cued, application), `outcome` (forgot, hard, ok, easy), `independent`, `item_signature`.
- **competency\_snapshots** (derived cache): five dimension values, the derived `learner_state`, a plain-language explanation listing evidence ids, `rules_version`, `inputs_hash`. Fully recomputable from evidence.
- **notes:** `body_markdown`, `node_refs[]` (multi-entry index), `kind`. Imports never overwrite notes.

### 5.3 Execution layer

No school, class, grade, homework or exam entities exist anywhere in this model. School hours are a protected block like any other commitment.

- **lanes:** `code` (A–E), `name`, `priority_rank`, `weekly_minutes_budget` (provisional), per-day-mode caps. Lanes are deliberately unequal.
- **routine\_blocks:** `kind` (protected, flexible), `label`, `days[]`, `start`, `end`, `tz`. Protected blocks cover school, sleep and recovery; they have no academic fields.
- **day\_modes:** minimum, normal, high, each with `max_focus_minutes`, `max_items`, `micro_skill_minutes_cap`.
- **plans (proposals):** `local_date` or week, `mode`, `status` (proposed, approved, superseded, expired), `items[{lane_id, target_id | micro_id | project_id, planned_minutes (provisional), rationale}]`, `generated_by` (rule\_engine, ai\_package, user), `approved_at`. A plan is never active until you approve it.
- **execution\_records:** `local_date`, `plan_item_id`, `session_id`, `status` (done, partial, skipped, moved, not\_attempted), `reason` (busy, low\_energy, illness\_injury, school\_load, other), `minutes`. Plans, routines and execution records are three separate tables.
- **fallback\_states:** `kind` (busy, low\_energy, missed\_session, illness\_injury, multi\_day\_absence), `from`, `to`. **No backlog spiral:** skipped items never roll forward automatically. Plans are re-derived from current state, and carry-over is an explicit action you take.
- **micro\_assignments:** `micro_skill_id`, `active_from`, `active_to`, `dose` (minimum, normal, optional), `rotation_group`, and `supervision_acknowledgements[{at, by: guardian | instructor | self, note}]`.
- **projects and milestones** live in the knowledge layer; their execution (status changes, dated completions) is recorded here as execution records.

### 5.4 System layer

- **changesets:** `kind` (activity, studio, import, system, migration, restore), `ops[{op, entity_type, entity_id, before, after}]`, `created_at`, `approved_at`, `approved_by`, `package_receipt_id`, `restore_point_id`, `reverted_by`.
- **update\_packages:** receipt id, raw text hash and body, state, validation report, per-item decisions, `generated_by`, `package_id`.
- **snapshots:** restore-point metadata and blob. **settings:** day-mode defaults, backup reminders. **device:** `device_id`.
- **system\_versions:** `app_version`, `db_schema_version`, `archive_format`, per-type `schema_versions`, `registry_version`, `rules_version`, `installed_at`, `migration_history[]`.
- **feature\_roadmap:** `code` (a software namespace, `ATH-FEAT-{AREA}-{N}`, separate from knowledge codes), `title`, `status` (available, designed, planned, future, needs\_upgrade), `capability_flag`, `requires_app_version`, `acceptance_test_ids[]`.
- **rules:** competency and mastery profiles (§6), retention ladders, day-mode defaults, all versioned.
- **Separation of progress.** `system_*` tables hold no references to learning tables and vice versa. The dashboards read each side separately, and a test asserts the absence of cross-references.

### 5.5 Validation catalogue

- **V-01 ids:** UUIDv7 format, unique. **V-02 codes:** unique, immutable, matching the type pattern, never recycled (tombstone check); a segment outside the registered namespaces is a warning (G-02).
- **V-03 references** resolve, and a tombstoned target needs a recorded supersession. **V-04 edge endpoints** match the relation type’s allowed type pairs. **V-05** no self-loops, unique (type, source, target).
- **V-06 ownership:** one primary `CONTAINS` parent; `owner_discipline_id` agrees with `discipline_ids`. **V-07 prerequisites** acyclic (error for required or hard, warning otherwise).
- **V-08 rationale** mandatory on prerequisites and transfer links; hard prerequisites also need an evidence basis. **V-09 duplicates:** Unicode-normalised title and alias overlap within an owner (warning). **V-18** a near-duplicate in another discipline suggests a typed link instead (warning).
- **V-10 objectives:** approved objectives need every Vault-required field and assessment alignment (error); drafts get warnings. **V-11 safety:** the safety block is required on practical or physical items; micro-skill sessions ≤ 30 minutes.
- **V-12 evidence** has no update or delete path, only supersession. **V-13** competency and mastery fields are writable only through evidence creation and mastery confirmation.
- **V-14 time:** `updated_at` ≥ `created_at`; `observed_at` not more than 5 minutes in the future; `local_date` consistent with `tz`. **V-15 provenance** required. **V-16** text length limits and Unicode NFC. **V-17** `is_sample` records are excluded from aggregates and exports unless chosen.

## 6. Competency and assessment specification

Rules version `conservative-v0`. **Every number below is a provisional parameter stored as data**, because the Vault says thresholds are objective- and discipline-specific and must be reviewable. The content owner reviews them before they are treated as final.

### 6.1 Principles

- Five dimensions, each with its own source of truth. None is computed from another except where stated.
- **Never inputs:** resource completion, minutes spent, session counts, streaks, self-report, AI confidence. An evaluator’s stated confidence is stored as uncertainty and never used to promote anything.
- Mastery is a designation, not a stored input and not an AI output.
- Rule profiles are data. The most specific profile wins (objective, then outcome class, then discipline, then safety class), falling back to `conservative-v0`.
- Every derived state shows an explanation listing its evidence ids and the rules version.

### 6.2 The five dimensions

- **Exposure** — `not_exposed` or `exposed`. Source: session activity on the target or a “studied” mark. Self-attested; it never feeds the others.
- **Self-reported understanding** — `unknown`, `struggling`, `partial`, `confident`, latest report with its date. It never feeds performance or mastery. A calibration gap is flagged when it says `confident` but the latest independent evidence is partial or not demonstrated.
- **Demonstrated performance** — derived from evidence under recorded conditions: `none`; `assisted` (outcome partial or demonstrated, but prompted, collaborative, unknown-independence, or with hints, worked examples or AI help); `independent_partial`; `independent_demonstrated` (an independent attempt met the stated criteria, in an evidence class the objective allows). Self-report evidence never counts here. AI-reported evidence without a transcript or artefact excerpt counts as `assisted`, never independent.
- **Retention** — `unknown`, `due`, `fragile`, `retained`. `retained` needs a later independent demonstration at least `delay_days` (default 7) after the first one, on a different `item_signature`, with no lapse since. `fragile` means the last review was forgot or hard, or a lapse fell within 30 days. `due` means the ladder says review now. Display priority: due, then fragile, then retained, then unknown, with the underlying flags kept.
- **Mastery designation** — `none`, `candidate`, `confirmed`, `lapsed`. A candidate appears when the applicable mastery rule is fully met. It becomes `confirmed` only when you confirm it after seeing the evidence summary. It becomes `lapsed` when retention fails or the latest independent attempt is not demonstrated. History is kept; the way back is re-demonstration.

**Default mastery rule `conservative-v0` (all must hold):**

- M1: at least 3 independent `demonstrated` results on 3 separate days spanning at least 14 days.
- M2: at least 2 distinct item signatures, including one novel problem not used in the study material.
- M3: all required rubric criteria met in the latest 2 independent attempts, including the explanation criterion where the objective lists it.
- M4: one independent demonstration at least 14 days after the first (when the objective says retention matters).
- M5: one transfer-performance record in a different context (when the objective says transfer matters).
- M6: for safety-critical targets, an external-verification record and a supervision record. ATHENA labels this “practised to criteria”, never “qualified”.
- M7: the latest independent attempt is not `not_demonstrated`.

### 6.3 Derived learner state (the Vault’s eight states)

The eight Vault states are a *view over the dimensions*, not a stored ladder. First match wins:

1. `needs_revision` — the latest independent attempt is not demonstrated after an earlier demonstration; a review outcome of forgot; an evaluator-flagged misconception; a material change to the objective after the evidence; or a failed transfer attempt.
2. `mastered` — mastery designation is `confirmed`.
3. `retained` — retention is `retained`.
4. `demonstrated` — performance is `independent_demonstrated`.
5. `understood_provisionally` — performance is `assisted` or `independent_partial`, supported by at least one explanation, problem or practical record.
6. `practising` — practice, review or build activity logged, or self-report struggling or partial, with no performance evidence.
7. `exposed`. 8. `not_exposed`.

States move in either direction. Every change appends a snapshot with its explanation. Self-report alone can reach `practising` at most.

### 6.4 Assessment specification

- **Methods:** the seven in the Vault objective schema (retrieval, explanation, problem performance, practical demonstration, project artefact, transfer task, external verification). A baseline diagnostic is a purpose flag on an assessment, not a method.
- **Approved objectives** must carry methods, criteria or rubric, acceptable aids and conditions, common failure modes, and transfer or retention flags (Vault objective standard §7). Validators enforce this.
- **Each attempt records:** conditions and aids, rubric version, per-criterion results, evaluator identity and provider, uncertainty, limitations. Your reflection is stored separately.
- **Independence** is an attestation you tick per attempt at approval. It defaults to unknown, and an AI tool cannot attest it.
- **Two evaluators, one attempt** (for example ChatGPT and Gemini): both records are kept, disagreement is shown, and the rules use the more conservative outcome.
- **Repeats:** the same item signature within 24 hours counts once, and an identical item never counts as a retention check.
- **Baselines** count like any evidence but carry `is_baseline` so they are labelled, and variation (M2) still has to be met afterward.

### 6.5 Reassessment, revision and retention

- **Ladder per target:** success moves up one box, partial stays, failure drops two boxes (minimum 1) and records a lapse. Intervals are profile data (provisional 1, 3, 7, 14, 30, 60, 120 days).
- **Reassessment is suggested when:** a review is due; no independent evidence for 90 days at demonstrated or above (30 days below that); the objective changed; a prerequisite regressed (a warning on dependents, never an automatic demotion); a project milestone needs the skill soon.
- **v1 scheduling inputs:** box position and upcoming use. Forgetting risk, importance and learning cost are deferred and tracked in the roadmap, as the Vault asks.
- **No backlog:** due items beyond the day-mode cap are ranked by risk, not queued.

### 6.6 Micro-skills

- Practice sessions are not evidence. Measured trials (1–20 per the schema) are recorded as evidence with conditions, aids and environment.
- `success_threshold` is free text and nullable today (G-09), so until it is structured and piloted, judgement is rubric-based and shown as such. `demonstrated` needs the stated threshold met under the stated conditions on at least 2 separate days. Maintenance uses the record’s trigger. **A mastery designation is not offered for micro-skills in v1** (question Q-08).
- **Safety:** where `supervision` is qualified-instructor-required or not-for-unsupervised, `demonstrated` additionally needs an external-verification record. First aid and CPR records track discovery and verified training only.
- **Scheduling guard:** micro-skills use leftover capacity after protected blocks and the day mode’s foundations minimum; at most 3 in rotation (default); minimum, normal and optional doses.

### 6.7 Safeguards against falsely declaring mastery

- S1: no command sets competency or mastery directly; only evidence creation and your confirmation change them.
- S2: packages carry evidence and proposals, never states; claims beyond the rules are clamped and flagged.
- S3: independence defaults to unknown; AI-administered attempts need your attestation.
- S4: time and activity are excluded from the rule function signature, and a property test asserts that adding minutes or sessions changes nothing.
- S5: spacing, variation and transfer are required, so one correct answer cannot reach mastery.
- S6: repeated identical items count once; recognition is not retention.
- S7: calibration gaps are surfaced, never hidden.
- S8: rules are versioned; a rules change shows a recompute preview with per-target explanations before it takes effect.
- S9: mastery lapses visibly and does not disappear.
- S10: no XP, no mastery badges; streaks, if ever added, describe practice cadence and are labelled that way.
- S11: you can dispute an evidence row with a reason; it is superseded, not deleted, and states recompute.
- S12: sample data is flagged and excluded from real aggregates.
- S13: aggregates over a skill or discipline show counts with what was assessed (for example, “5 of 9 objectives independently assessed, 2 demonstrated”), never a single opaque percentage.

## 7. Risk register

Scored Likelihood × Impact, each 1–5, sorted high to low. Mitigations name the stage that delivers them.

- **R-01 · 4×5=20 · Data loss from storage eviction, cleared site data or uninstall.** Request persistent storage; install as a PWA; show persistence status; export-first backup with freshness banner (Stage 1); restore points before risky operations.
- **R-02 · 4×5=20 · No restorable backup exists (never exported, or never tested).** One-tap share-sheet export, checksum, “verify export”, in-app restore drill, end-to-end round-trip test (Stage 1).
- **R-03 · 4×4=16 · Delivery path unavailable.** You have no PC and my chat sandbox has no network, so code cannot be built or tested there. Without a repo, CI and a build environment, completion claims would be unbacked. Mitigation: settle the pipeline first (§11, Q-02); no “done” without a CI run.
- **R-04 · 4×4=16 · The 2026-12-10 launch pressures shortcuts.** A scope boundary per stage (§10); record-first, derive-later for competency; invariants are never traded for date.
- **R-05 · 4×4=16 · Over-engineering, or a codebase you cannot understand and modify from a phone.** Boring stack, layered boundaries without plug-in frameworks, ADRs, a glossary, tests as documentation, a short walkthrough note at the end of every stage, and a “rebuild guide” by Stage 10.
- **R-06 · 3×5=15 · Falsely declared competency or mastery.** §6 safeguards S1–S13; property tests; mastery needs your confirmation.
- **R-07 · 3×5=15 · A migration corrupts or loses data.** Restore point, dry-run, golden archives from every version, transactional apply, one writer via Web Locks.
- **R-08 · 4×3=12 · Draft seed content treated as approved curriculum.** Everything imports as draft and needs\_review, labelled on screen; approved status requires your approval; seed objectives that fail the objective standard cannot be approved.
- **R-09 · 4×3=12 · Drift between the content owner’s files and the app (G-01, G-03).** Versioned format adapters, a CI conformance report, and import reports that name every unmapped field.
- **R-10 · 3×4=12 · Graph unusable on low-end Android.** Level-of-detail caps, spike S-1 gate, tree twin as the fallback view.
- **R-11 · 3×4=12 · Malformed, injected or hallucinated AI content accepted.** Inert data, strict schemas, resource verification status, preview with per-item approval, provenance on every record.
- **R-12 · 3×4=12 · Service-worker or update bug leaves a stale or broken shell.** Prompted updates, versioned precache, recovery screen that never touches data, update-scenario end-to-end test.
- **R-13 · 4×3=12 · Duplicate or conflicting records from repeated imports.** Idempotency by package id and hash, code-keyed merge, duplicate heuristics, merge preview.
- **R-14 · 4×3=12 · Accessibility gaps on the canvas graph.** Tree twin, axe tests, TalkBack walkthrough, focus management.
- **R-15 · 2×5=10 · Physical or safety-critical practice scheduled for a minor without supervision.** Enforced `risk_level` and `supervision` gates, supervision acknowledgements, no qualification claims, content-safety review by the owner (G-14).
- **R-16 · 3×3=9 · Multi-tab write races.** Web Locks, version checks, BroadcastChannel refresh.
- **R-17 · 3×3=9 · Clock, timezone or device-date errors corrupt retention and plans.** UTC plus `local_date` and `tz`, a `Clock` port with tests, a future-date guard.
- **R-18 · 3×3=9 · Dependency compromise or abandonment.** Few dependencies, lockfile, audit in CI, an ADR required for each new dependency.
- **R-19 · 3×3=9 · Sync debt if a second device appears.** Sync-ready ids, versions and change log from day one; revisit trigger in ADR-003.
- **R-20 · 2×4=8 · Privacy leakage through shared exports or third-party code.** No third-party scripts, strict CSP, a warning on export, optional passphrase encryption.
- **R-21 · 2×4=8 · Drift into a habit tracker or gamified dashboard.** S10, metric definitions required on every dashboard element, review checklist.
- **R-22 · 3×2=6 · Android API variance (file sharing, save picker, persistence).** Feature detection with fallbacks; spike S-2 on a real device.
- **R-23 · 2×3=6 · Storage quota exceeded.** Monitor `estimate()`, cap blob sizes, warn early.
- **R-24 · 3×2=6 · Time estimates read as deadlines.** Labelled provisional everywhere; no overdue states.

## 8. Knowledge Architecture Reconciliation Report

### 8.1 Method and measured results

- **How the archives relate.** Both ZIPs were extracted and compared byte for byte. The Knowledge Pack is a subset of the Vault: 17 of its 18 files have identical content, and only its README differs (stale: its header says v0.2). The Vault holds 9 further files (project bible, outcomes, competitive strategy, roadmap, discipline registry, README, handoff, decision register, changelog). Where the two disagree, the Vault wins; the single disagreement is documentary.
- **How the checks were run.** A custom script, because a full JSON Schema validator was not available offline. It checks counts, id uniqueness, id patterns, parent and endpoint resolution, and schema conformance for required fields, extra fields, types, enums, patterns and minimum lengths. It is **not** a complete Draft 2020-12 validation, and it does not judge subject-matter quality, which belongs to the content owner.
- **Disciplines:** 18, codes match the Stable ID list, and the boundary matrix covers the same 18.
- **Domain Map v0.2:** 109 domains and 40 skill families, counts match; ids unique and well-formed; every parent resolves; no discipline-segment mismatches; all draft and needs\_review.
- **Transfer Registry v0.2:** 31 links and 6 contexts, counts match; every endpoint resolves; 17 SUPPORTS, 11 TRANSFER\_TO, 3 APPLIES\_TO, no PREREQUISITE\_FOR; all `draft_hypothesis`.
- **Micro-skill registry:** 20 records, 4 per category, all DRAFT; all 20 pass the micro-skill schema; id prefixes match categories; risk 13 low, 3 moderate, 4 high; supervision 13 none-routine, 6 adult-guidance, 1 qualified-instructor; sessions 5–15 minutes; no dangling references among the links present.
- **Foundation seed:** 29 nodes, all draft (14 domains, 11 concepts, 4 objectives).
- **Failures:** see G-01 to G-04.

### 8.2 Coverage matrix

**Object types** (Ontology §3 and Node Base schema):

- Supported as defined by the Vault: discipline, domain, skill family, skill, subskill, concept, learning objective (Vault schema kept whole), assessment (definition and attempts), evidence record, competency state (derived), transfer link (an edge), micro-skill (Vault schema kept whole).
- Supported with a **proposed technical schema** because the Vault names the type but defines none: learning unit, resource, practice protocol, project, milestone (G-13).
- **In my model but not in the Vault ontology:** context (`ATH-CTX-*`, used by the transfer registry and by `APPLIES_TO`), added as a node type (G-07).

**Relationship types** (Edge schema, 13): CONTAINS, PREREQUISITE\_FOR, SUPPORTS, APPLIES\_TO, TRANSFER\_TO, RELATED\_TO, CONTRASTS\_WITH, PART\_OF, ASSESSES, EVIDENCES, USES\_RESOURCE, DEVELOPS, CONTRIBUTES\_TO.

- All 13 are seeded in the relation-type registry. `EVIDENCES` is derived from `evidence.target_id` rather than stored as an edge, because materialising it would duplicate an append-only table.
- The Decision Register’s extra candidates (`shared_foundation_for`, `enables`, `explains`) are supported the moment the registry gains them through an approved changeset (G-04).

### 8.3 Gaps and proposed changes

Severity: **H** high, **M** medium, **L** low. “Invariant” says whether the change touches a product invariant or only implementation detail. Owner: who decides.

- **G-01 · H · invariant (IDs never silently dropped) · owner: content.** Four v0.1 seed domains are absent from Domain Map v0.2 with no tombstone or supersession: `ATH-DOM-ENG-COMPUTE`, `ATH-DOM-MATH-CHEM`, `ATH-DOM-MATH-PHYS`, `ATH-DOM-WORK-LEARN`. Two seed nodes still point at them (`ATH-CON-ENG-ALGORITHM`, `ATH-OBJ-LEARN-RETRIEVAL`). The changelog says 10 were reused and none regenerated, which is true but silent about the other four. **Fix:** record each as superseded or retained, with a successor if any.
- **G-02 · M · invariant (ID rules) · owner: content.** Four IDs use discipline segments that are not registered codes, which the Stable ID Standard §6 says to reject: `SCI` (`ATH-CON-SCI-HYPOTHESIS`, `ATH-CON-SCI-VARIABLES`, `ATH-OBJ-SCI-EVIDENCE-CLAIM`) and `LEARN` (`ATH-OBJ-LEARN-RETRIEVAL`). Two of these sit under a different discipline than their segment. Also, numeric suffixes in unit and assessment IDs read as sequence positions. **Fix:** define the segment as an origin namespace with a registry, decide about `SCI` and `LEARN` through a migration map, and treat suffixes as instance counters with order held on edges.
- **G-03 · H · detail · owner: both.** The supplied registries fail the supplied schemas. All 149 domain-map records fail Node Base (`discipline_id` instead of `discipline_ids`, extra `code` and `review_state`, `content_version` is the string 0.1.0 not an integer). All 31 transfer links fail the Edge schema (status `draft_hypothesis` is not in the enum; extra `review_state`). All 4 seed objectives fail the Objective schema (five required fields missing, extra `aliases`). **Fix:** the content owner issues schema v0.2; until then ATHENA ships format adapters and keeps unmapped fields in `extensions`.
- **G-04 · H · not an invariant, but needs approval · owner: content.** Decision D-ATH-TRANSFER-002 lists `supports`, `applies_to`, `shared_foundation_for`, `enables`, `explains`, `related_to`. The Edge schema has 13 types, lacks the last-but-three of those, and includes `TRANSFER_TO`, which the decision does not list. **Fix:** one approved vocabulary, held as data (§2.6).
- **G-05 · M · detail · owner: content.** “Hard prerequisite” is ambiguous: Ontology §6 says `required` blocks only when explicitly marked hard, but no field marks it, while the ID standard forbids cycles in hard edges. **Fix:** add `gating` (none, advisory, hard).
- **G-06 · M · detail · owner: both.** The Edge schema requires an `ATH-EDGE` or `ATH-XFER` ID, yet the ID standard defines only `ATH-XFER`. Structural edges will number in the thousands. **Fix:** edges get internal ids; `code` is required only for transfer links.
- **G-07 · M · detail · owner: content.** The six `ATH-CTX-*` contexts are not an object type in the ontology, Node Base or ID standard. **Fix:** add `context` with an ID pattern.
- **G-08 · M · detail · owner: both.** Embedded link fields (`parent_id`, `prerequisite_ids`, `objective_ids`, `skill_links`, `prerequisites`, `discipline_links`) duplicate the edge table. **Fix:** treat them as exchange form, normalised to edges on import (§5.0).
- **G-09 · M · detail · owner: content.** Micro-skill `maintenance` is free text and `success_threshold` is a nullable free-text string, so a scheduler cannot compute from them; provisional time fields are unlabelled; no per-record version, aliases, source references or timestamps. **Fix:** optional structured cadence and criteria, plus `content_version`.
- **G-10 · L · detail · owner: content.** The relation type for micro-skill to skill or discipline links is unspecified. **Proposal:** `SUPPORTS`, with `APPLIES_TO` for contexts. Confirm.
- **G-11 · M · detail · owner: both.** The eight-state vocabulary mixes several axes. **Resolution here:** stored dimensions with a derived state (§6). No Vault semantics change.
- **G-12 · L · housekeeping · owner: content.** The micro-skill registry has 20 records, but the handoff, Pack README and changelog say 18. The Vault README still says v1.1 for a v1.2 archive, and its “Start here” list omits the micro-skill files.
- **G-13 · M · detail · owner: content.** No semantic schemas exist yet for learning unit, resource, assessment, project, milestone, practice protocol, evidence or competency state. **Fix:** the content owner’s versions should supersede my technical schemas (§5.1, §5.2).
- **G-14 · M · content observation · owner: content, with you.** Three of the four HIGH-risk micro-skills (`EMERGENCY-CALL`, `HAZARD-SCAN`, `STOP-AND-ESCALATE`) carry only `ADULT_GUIDANCE_RECOMMENDED`; `CPR-LEARNING-READINESS` carries `QUALIFIED_INSTRUCTOR_REQUIRED`. ATHENA will gate on whatever the field says, but the right level is a safety-content judgement, not mine.
- **G-15 · M · invariant (one canonical owner) · owner: content.** Node Base has a `discipline_ids` array and a nullable `parent_id`, while the objective standard demands one canonical owner. **Fix:** an explicit `owner_discipline_id` that must agree with the primary `CONTAINS` chain.

### 8.4 Stable-ID compatibility

- Immutable internal keys and the human-readable ATHENA IDs are separate and both supported (ADR-004).
- IDs do not depend on names (titles and aliases are not in codes), on display order (`order_hint` and `sort_order` are separate fields), or on parent paths in any logic. The discipline segment in a code is an origin namespace and is never parsed; a later move changes the primary `CONTAINS` edge and leaves the code alone.
- Retired IDs are tombstoned in `code_registry`, remain resolvable, and point to a successor through an explicit relation. Evidence has no content ID, as the standard says.
- Today’s data breaks two of these rules: G-01 and G-02.

### 8.5 Graph integrity

- Typed edges are validated against the relation registry. Prerequisite strength and gating are fields. Hard prerequisites are acyclic (error), soft ones warn, and cycles are allowed in non-prerequisite relations. Transfer links are never read as prerequisites.
- **Caveat:** the supplied data holds zero prerequisite edges, so acyclicity has not been exercised on real content. It will be tested on synthetic cycle fixtures and again when real edges arrive.

### 8.6 Competency and evidence compatibility

- Every field the Framework §3 requires has a home (§5.2): evidence id, targets, time, context, assessment and rubric version, conditions, criterion results, artefact, evaluator identity and provider, provenance, confidence, limitations, and separate learner reflection.
- All 8 evidence classes, all 8 dimensions and all 8 states are supported. The mastery policy is a data profile, conservative by default. Revision and decay follow §6.5. Aggregates show counts and recency, never a single percentage (S13).

### 8.7 Micro-skill compatibility

- Five categories, bounded protocol (≤ 30 minutes enforced), measurable target, assessment, maintenance, discipline and skill links, safety metadata, supervision and lifecycle status are all stored whole. Links normalise to edges (G-10). Structured maintenance and thresholds wait on the content owner (G-09).
- The 20 records import as DRAFT and show a DRAFT label. They are candidates, not curriculum. Proposed gate (needs your approval, Q-06): a DRAFT record can be viewed but not scheduled, except a LOW-risk record you explicitly start as a pilot; anything HIGH-risk or with adult or instructor supervision cannot be scheduled until approved and a supervision acknowledgement is recorded.
- Micro-skills stay outside the `CONTAINS` hierarchy and outside skill-tree rollups, and the scheduling guard keeps them from crowding out foundations, sleep and recovery.

### 8.8 Ingestion compatibility

- Schema validation, duplicate detection, conflicts, preview, approval, audit history, rollback and version migration are all in §2.5, ADR-007 and ADR-012.
- The four registries import through adapters (domain map 149 records, transfer 31 links plus 6 contexts, foundation seed 29 nodes, micro-skills 20) as draft and needs\_review. The seed objectives import as stubs that cannot be approved until completed. The importer reports the two orphaned parents from G-01 instead of hiding them.

### 8.9 Offline and portability compatibility

- The archive holds the whole graph, relation types, tombstones, evidence and review history, attempts, sessions, notes, layouts, changesets and rules, with per-type schema versions, and is checked for dangling references before it is written.
- A lossless export-wipe-import round trip is a property test. A knowledge-only export in the Vault’s own exchange shapes lets the content owner’s tooling read ATHENA data. There is no vendor lock-in.

### 8.10 Hand-back list for the content owner

- 1. G-01: say what happened to the four dropped seed domains.
- 2. G-02: decide the `SCI` and `LEARN` segments; define namespaces; treat suffixes as counters.
- 3. G-03: publish schema v0.2 so registries validate.
- 4. G-04 and G-05: settle one relation vocabulary and add `gating`.
- 5. G-06, G-07, G-15: edge codes, a `context` type, an explicit owner field.
- 6. G-08: accept exchange form versus storage form.
- 7. G-09 and G-10: structured maintenance and thresholds; the micro-skill link relation.
- 8. G-13: semantic schemas for unit, resource, assessment, project, milestone, evidence.
- 9. G-14: safety review of the HIGH-risk micro-skills.
- 10. Review `conservative-v0` mastery parameters (§6.2) per discipline.
- 11. G-12: fix the 18-versus-20 count and version labels.

## 9. Acceptance-test strategy

### 9.1 Principles and environments

- Every requirement gets at least one automated test, plus a manual device check where the browser cannot prove it. A feature is done only with a passing CI run and its checklist. No test is weakened to make a build pass; failures are reported.
- **Environments:** Vitest with fake-indexeddb; fast-check property tests; Playwright (Chromium, 360×780, touch, 4× CPU slowdown, offline toggled); Lighthouse CI in mobile mode; golden archives from every earlier version; one real Android device (model to be confirmed, Q-11). All fixtures are synthetic and flagged `is_sample`.

### 9.2 Test areas

- **Offline (AT-OFF):** 01 after one online load, airplane mode still opens the app and reads data. 02 offline you can log a session, add a note, enter evidence, run a review, preview an import and export an archive. 03 no network requests beyond app assets and the update check, and CSP blocks cross-origin calls. 04 a new version waits; accepting it makes a restore point then migrates; declining leaves the app working. 05 the persistence result and storage estimate are displayed.
- **Data integrity (AT-INT):** 01 every V-rule has a pass and a fail test. 02 an injected failure mid-commit leaves the database hash unchanged. 03 a changeset followed by its inverse returns an identical state hash (property test on random changesets). 04 a tombstoned code can never be reissued. 05 evidence has no update or delete path. 06 two tabs serialise commits and a stale version is rejected. 07 no references cross between learning and system tables. 08 layout operations leave node and edge hashes unchanged.
- **Imports (AT-IMP):** 01 a valid package previews the expected diff and nothing is written before approval (database hash equal). 02 invalid references, cycles, duplicates, version drift, oversize and non-JSON are rejected with reasons; a code-fenced JSON wrapper is handled. 03 re-importing the same package is flagged. 04 injection-style strings render as inert text. 05 ChatGPT-style and Gemini-style fixtures run through the same validators (asserted by spy). 06 paste and file import share one path. 07 a package cannot set competency or mastery, and over-claims are clamped and flagged. 08 partial approval respects dependency closure, and a rejected package leaves only its record. 09 the four Vault registries import with counts 149 nodes, 31 links plus 6 contexts, 29 seed nodes and 20 micro-skills, all labelled draft, the G-01 orphans reported, and no input field silently dropped (compared field by field against `extensions`).
- **Approvals and history (AT-APP):** 01 every commit creates a restore point. 02 undo restores the exact prior state. 03 undo conflicts with later dependent changes are reported, not forced.
- **Graph (AT-GRA):** 01 spike S-1 criteria (ADR-005). 02 pan, pinch, tap and long-press on emulated touch. 03 selection stays in sync with the tree twin. 04 never more than 300 visible nodes. 05 edge direction matches the stored convention. 06 every node is reachable by keyboard and by TalkBack through the twin. 07 layout reset restores the default.
- **Mobile usability (AT-MOB):** 01 no horizontal scroll at 360 px on any route. 02 touch targets ≥ 48 px (audited). 03 200% text scale works. 04 reduced-motion is honoured. 05 axe reports no serious or critical issues. 06 sheets trap and restore focus. 07 on the real device, one-handed walkthroughs of: log a session, import a package, export a backup, answer a review.
- **Backup and restore (AT-BAK):** 01 export, wipe, restore gives an equal hash. 02 a tampered archive (hash mismatch) is rejected. 03 a truncated archive is rejected. 04 a newer-schema archive is refused with an explanation; an older one migrates. 05 the restore drill passes. 06 merge matches authored objects by code. 07 share-sheet export and the download fallback both work (S-2). 08 behaviour near the storage quota is graceful. 09 the freshness banner appears on schedule.
- **Competency tracking (AT-CMP):** 01 a table-driven test for every state and transition in §6.3. 02 one test per safeguard S1–S13. 03 adding minutes or sessions never changes a state. 04 AI-reported evidence without an artefact is never independent. 05 two evaluators on one attempt resolve to the more conservative outcome. 06 mastery needs your confirmation, lapses visibly, and cannot be set by an import, Studio or any API. 07 a rules-version change shows a recompute preview with per-target explanations. 08 aggregates are labelled with what they measure. 09 a calibration gap is flagged. 10 the micro-skill supervision gate holds.
- **Performance (AT-PERF):** 01 bundle budgets enforced in CI. 02 Lighthouse mobile thresholds from §2.9. 03 interaction timings and long tasks on the real device.
- **Migration (AT-MIG):** 01 every historical fixture migrates to current. 02 a failed migration rolls back fully.

### 9.3 Quality gate and reporting

`verify` runs typecheck, lint (including a rule that forbids the domain layer importing React or Dexie), unit, property, integration, end-to-end smoke, accessibility, bundle budget and the schema-drift check. Each stage ends with a report: Implemented, Partial, Not implemented, Risky, with the CI run attached.

## 10. Implementation sequence and Stage 1 plan

### 10.1 Sequence

I will not give dates until the delivery path is confirmed (Q-02). Order, with what each stage depends on:

- **Stage 1 — Data core.** Headless domain, storage, changesets, import pipeline, archive. Two plain engineering screens only (Backup and Restore, Import Preview). No product UI.
- **Stage 2 — App shell and PWA.** Routing, bottom navigation, tokens, install, offline, update flow, persistence, CI performance gates. Spike S-2 and S-3 here.
- **Stage 3 — Execution core.** Lanes, protected blocks, day modes, session logging, self-reports, plans as proposals, execution records, fallback states, baseline recording.
- **Stage 4 — Updates inbox and evidence.** Preview, approve, history and rollback UI; assessments, attempts, evidence entry and attestation; competency derivation with explanations; retention ladder and review queue.
- **Stage 5 — Knowledge browse.** Tree and list, node detail, search, seed registries shown as draft, relation explanations, context-pack export.
- **Stage 6 — Graph.** Spike S-1 first, then GraphPort, layouts, level of detail, twin integration.
- **Stage 7 — Micro-skills.** Assignments, doses, supervision acknowledgements, scheduling guard, measurements.
- **Stage 8 — Architect Studio.** Editors, drafts, impact analysis, rules-profile editor, capabilities screen.
- **Stage 9 — Projects, transfer evidence, weekly review pack.**
- **Stage 10 — Hardening and rebuild guide.**

**Launch option for 2026-12-10 (Q-04).** Option A, which I recommend: a “capture and protect” launch from Stages 1–4 in reduced form: log sessions, record baselines as evidence, import ChatGPT packages with approval, export backups. Competency views, graph and Studio come later. This follows record-first, derive-later: nothing is lost, and no judgement is shown before the rules are reviewed. Option B follows the full order. Whether even Option A fits before December 10 depends on the delivery path, so I make no promise.

### 10.2 Stage 1 scope

**In:** repository and CI with the `verify` command; Zod schemas for every entity and generated JSON Schemas with the drift check; `IdGen` and `Clock` ports; Store port with the Dexie adapter and migration v1; repository invariants V-01 to V-18 with property tests; code registry with tombstones; relation-type seed; changeset engine with inverse operations and restore points; format adapters and dry-run import of the four Vault registries; the headless update-package pipeline with synthetic ChatGPT-style and Gemini-style fixtures; archive export, import, verify and restore drill; the two engineering screens; glossary, architecture map and a walkthrough note.

**Out:** any product UI, graph, competency derivation, planner, Studio, micro-skill scheduling.

**Dependencies:** Q-01, Q-02 and Q-03. The content owner’s answers to the hand-back list do **not** block Stage 1, because adapters absorb the current formats.

**Acceptance:** AT-INT, AT-IMP, AT-APP, AT-BAK, AT-MIG, the schema-drift check, and zero cross-origin requests, all green in CI; a real-device export and share check if hosting is approved (S-2).

**Spikes:** S-1 graph benchmark (start of Stage 6, or earlier if you want that risk retired sooner). S-2 Android API check for Web Share files, download fallback, save picker and persistence, on a real device. S-3 service-worker update plus migration drill.

## 11. Decisions that need you, and open questions

### 11.1 Decisions that genuinely need your approval

- **Q-02 Delivery pipeline.** A GitHub repository you own, CI, and Claude Code from the mobile app as the build environment. Do you have or can you create the accounts, and does a guardian need to be involved?
- **Q-03 Hosting.** Static hosting on Vercel with an unlisted URL (recommended), or another host. No account or public URL is created without your approval.
- **Q-04 Launch scope for 2026-12-10.** Option A (capture and protect) or Option B (full order).
- **Q-05 Mastery semantics.** Mastery is a designation that only you can confirm, from a conservative provisional profile the content owner reviews.
- **Q-06 Micro-skill scheduling gate** (§8.7).
- **Q-07 Routing the hand-back list** (§8.10) to the content owner, since it changes ID, edge and schema semantics that are theirs to decide.
- **Q-12 No body metrics in v1.** ATHENA stores no weight, height or similar measurements; confirm, or tell me what you do want tracked.

### 11.2 Questions that refine the plan (not blocking Stage 1)

- **Q-01** Any ADR you want changed? The two that depart from earlier assumptions are React plus Vite instead of Next.js (ADR-001) and no sync or accounts in v1 (ADR-003, ADR-008).
- **Q-08** Should micro-skills get a mastery designation at all, or stay at demonstrated and maintained?
- **Q-09** Should v1 support Bangla text in titles and notes (works through Unicode, with font and search care), and Bangla interface labels (needs i18n)?
- **Q-10** Will you need a second device within six months? It raises the priority of sync.
- **Q-11** Your phone model, Android version, Chrome version and RAM, so budgets and spikes use a realistic target.

If some of these go unanswered, I proceed with the recommended defaults above and still create no account, public URL or approved status without your approval.

## 12. Sources and confidence

- **Dexie** (4.4 release notes, March 2026): medium-high. **SQLite WASM and OPFS** (several engineering write-ups including Notion’s): medium. **Browser storage durability** (web.dev guidance): high.
- **Graph libraries** (the Cytoscape comparison repository and articles): low-medium; not benchmarked, which is why S-1 exists. **Svelte versus React** and **Zod versus Valibot** sizes: low, third-party and indicative only.
- **File System Access on Android Chrome:** low. Sources disagree, so the design does not depend on it.
- **From my own knowledge, not researched this session:** UUIDv7 and RFC 9562, Workbox and `vite-plugin-pwa`, PBKDF2 parameters, MiniSearch (ADR-013), the GitHub Pages header limitation, Vercel plan terms, Claude Code from the mobile app. Each is flagged “verify” where it matters.
- **Not done:** no code, no benchmarks, no real-device test. Every budget and threshold is a target or a provisional parameter.
- **Bible coverage** is stated in §0.1. **Registry checks** are described, with their limits, in §8.1.
