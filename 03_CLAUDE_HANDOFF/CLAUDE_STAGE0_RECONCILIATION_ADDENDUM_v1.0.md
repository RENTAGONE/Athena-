# Claude Stage 0 Reconciliation Addendum
Version 1.0.0 · 2026-11-17
Inputs: Master Vault v1.3, Knowledge Architecture Pack v0.7, Claude Stage 0 Package v0.2 (2026-11-16)

## 1. Purpose and authority

This addendum is the content-owner response to the hand-back list in Claude Stage 0 §8.3–8.10. It does not replace Claude's Stage 0 report or its 14 ADRs. Preserve the original report verbatim as historical research and architecture rationale; use this addendum plus Master Vault v1.4 and Knowledge Pack v0.8 as the current semantic/product baseline.

Authority split:
- Product purpose, learning semantics, stable codes, taxonomy, objective/evidence meaning and user-owned privacy preferences are governed by the Master Vault and Knowledge Pack.
- Technical architecture and implementation remain Claude-owned, subject to product invariants and explicit user approval for consequential changes.
- A technical choice may change an ADR; a semantic invariant may not be silently changed.

## 2. Reconciliation of all 15 gaps

| Gap | Claude finding | Content-owner resolution in v0.8 | Status |
|---|---|---|---|
| G-01 | Four seed domains absent from v0.2 map; two orphaned parent references | Restore all four original IDs as draft domains in Domain Map v0.3: `ATH-DOM-ENG-COMPUTE`, `ATH-DOM-MATH-PHYS`, `ATH-DOM-MATH-CHEM`, `ATH-DOM-WORK-LEARN`. Keep the original concept/objective references. No silent deletion or ID regeneration. | Resolved structurally; subject review pending |
| G-02 | `SCI` and `LEARN` namespace ambiguity; numeric suffixes look like sequence order | Add ID Namespace Registry v0.2. `SCI` and `LEARN` remain legacy origin namespaces for existing IDs; current owner is always explicit per record. `SCI` is allowed for existing Math and Research records; `LEARN` for Workflow & Productivity. Numeric suffixes are instance IDs, not learning order. | Resolved |
| G-03 | Domain, transfer and objective registries fail supplied schemas | Publish canonical v0.8 schemas and normalized exchange records. Domain map v0.3 has 113 domains + 40 families; transfer v0.3 has 31 links + 6 contexts; foundation seed v0.2 has 29 nodes; skill/subskill seeds each have 36. Validators must check all records and report field loss. | Resolved for included fixtures; full production importer test remains |
| G-04 | Relationship vocabulary disagrees with Decision Register | Publish one data-driven registry with the existing types plus `EXPLAINS`, `ENABLES`, `SHARED_FOUNDATION_FOR`; preserve `TRANSFER_TO`. Use canonical uppercase codes in storage and display labels in UI. | Resolved |
| G-05 | Hard prerequisite not explicit | Add edge attribute `gating`: `none`, `advisory`, `hard`. Only `PREREQUISITE_FOR` can be hard; it must be `strength=required`, carry a justification and pass acyclic validation. | Resolved |
| G-06 | Structural edge ID pattern conflicts with ID standard | Structural edges receive internal immutable IDs at commit; draft exchange uses `client_ref` for idempotency only. No human-readable `ATH-EDGE` code is required. Transfer links retain `ATH-XFER-*` codes. | Resolved |
| G-07 | Context is not a formal object type | Add first-class `context` object, `ATH-CTX-*` pattern, schema and six existing context records. | Resolved |
| G-08 | Embedded links duplicate edge store | Exchange records may include convenience links. Import normalises them into edges; storage edges are the single source of truth. Export regenerates convenience fields. Conflicts are reported, never silently chosen. | Resolved |
| G-09 | Micro-skill maintenance/threshold fields are unstructured | Add `maintenance_policy` with explicit mode and optional interval; add structured qualitative success criteria and record version. Do not invent numeric thresholds where source records supplied none. | Resolved structurally; individual criteria still need content review |
| G-10 | Micro-skill link relation unspecified | Use `SUPPORTS` for micro-skill-to-skill/discipline links and `APPLIES_TO` for contexts. Micro-skills remain outside the main `CONTAINS` hierarchy. | Resolved |
| G-11 | Eight learner states mix multiple axes | Preserve the eight labels as a derived display state. Store exposure, self-report, demonstrated performance, retention and mastery designation as separate dimensions. | Preserved from Stage 0 |
| G-12 | 18 vs 20 micro-skills; stale Vault README/version labels | Canonical registry count is 20. Update README, changelog, handoff and pack version references. Archive names and document headers now consistently identify v1.4/v0.8. | Resolved |
| G-13 | Missing semantic schemas for key objects | Add/retain schemas for learning objective, unit, resource, assessment, evidence, project, milestone, practice protocol, competency state, context, transfer, domain, skill family, skill, subskill and micro-skill. | Resolved at contract level; sample coverage remains intentionally limited |
| G-14 | Four HIGH-risk micro-skills need safety judgement | Keep all four DRAFT; add explicit `safety_review=needs_review` and block approval/scheduling until a human safety review confirms age suitability, supervision and local procedure. CPR record is course-readiness only; no CPR instruction or certification. | Guardrail added; content review remains open |
| G-15 | Canonical owner is not explicit | Add `owner_discipline_id` to canonical records; it must agree with the primary `CONTAINS` chain. Cross-domain links do not change ownership. | Resolved for updated seed registries |

## 3. Important semantic clarifications

### 3.1 The four restored domains
The four domain IDs are preserved as draft records. Physics and chemistry remain under Mathematics & Scientific Reasoning as quantitative/model-based foundations so the 18-discipline taxonomy does not silently expand. Their descriptions explicitly limit scope: they are not full physics or chemistry curricula. This ownership can be reviewed through normal governance, but existing IDs must not be discarded.

### 3.2 Skill mapping
All 36 draft skill candidates now have one proposed primary domain and explicit owner. A skill-family link is populated only where a clear existing family exists; null is intentional elsewhere. The 36 subskills inherit their parent skill's proposed owner/domain/family. All mappings remain `draft_proposed_needs_review`; no candidate becomes approved merely because it validates.

### 3.3 Structural edges vs transfer links
Structural graph edges are internal implementation records. `client_ref` is an exchange-package correlation key, not a permanent semantic ID. Transfer links are content objects with stable `ATH-XFER-*` codes because they carry authored rationale and evidence lifecycle. Do not create thousands of meaningless `ATH-EDGE-*` public codes.

### 3.4 Maintenance and thresholds
The v0.8 micro-skill registry adds scheduler-readable cadence modes. Where an interval is supported by the supplied text (weekly, monthly, quarterly), a provisional interval is represented. Event-triggered, manual and provider-guided maintenance remain non-automatic. Success criteria are structured but may remain qualitative; never fabricate a numeric threshold.

### 3.5 Safety
Schema and scheduling guards are not a substitute for expert safety review. Four HIGH-risk records remain DRAFT and blocked pending review. CPR/first-aid practice requires a recognised instructor/provider and cannot be learned or certified by ATHENA.

## 4. Competency profile review

Claude's `conservative-v0` parameters remain provisional data, not a final universal rule. Preserve the five dimensions and the eight derived learner states. Before implementation, Claude should present the current proposed parameters in a concise table and explain:
- which evidence classes can count for each outcome;
- independence and prompt/aids handling;
- how delayed retention differs from repeated immediate attempts;
- how item variation and transfer are represented;
- how lapsed mastery is displayed and restored;
- how safety-critical external verification is handled.

Do not apply a universal numeric mastery threshold across all 18 disciplines. Objective-specific profiles may override discipline defaults. Mastery is only confirmed by the learner.

## 5. Product decisions incorporated since Stage 0

1. **Local-first:** personal data remains local by default; no mandatory account, cloud database, telemetry or third-party analytics in v1.
2. **SD-card backup:** an exported, versioned archive should be savable to the Android SD card through the system picker/share flow where supported; manual download-and-move is the fallback. Real-device verification is required.
3. **Future multi-device:** design stable IDs, version metadata, device IDs, changesets and conflict preview now; implement live sync later, not in v1.
4. **Optional health tracking:** design a dormant module, disabled by default. No health data is collected until the user explicitly enables it using a threshold/trigger the user defines. Keep health data separate and local by default.
5. **Visual identity:** implement the detailed Cognitive Atlas design system in `ATHENA_VISUAL_IDENTITY_AND_DESIGN_SYSTEM_v1.0.md`. Do not substitute generic dashboard styling or vague adjectives.
6. **Phone-first delivery:** all core workflows must be usable and maintainable from the user's Android phone; CI should perform repeatable builds/tests.

## 6. Decisions still requiring explicit user confirmation

These are user-owned decisions, not permission for Claude to guess:
- repository ownership/access and any irreversible GitHub action;
- deployment host and whether a preview URL may be public/unlisted;
- whether any paid service or external account may be created;
- exact v1 launch slice if the 2026-12-10 learning start arrives before the full app is ready;
- approval of the provisional mastery profile;
- final high-risk micro-skill supervision policy;
- whether micro-skills use only demonstrated/retained status or a separate mastery label;
- whether the v1 interface is English-only while preserving Bangla text/search, or ships full Bangla UI;
- real-device browser/version details for final performance testing.

Recommended defaults are provided in the Build Readiness Plan. Claude may proceed with reversible local scaffolding and tests while these are resolved, but must not create accounts, publish a public URL, spend money or perform destructive repo/data actions without approval.

## 7. Verification summary and limits

The v0.8 package is checked for:
- ZIP integrity;
- JSON parsing;
- JSON Schema Draft 2020-12 meta-schema validity;
- record-level schema conformance for included seed registries;
- domain/family/skill/subskill/context/transfer/relationship reference integrity;
- preservation of original IDs and explicit draft status.

These checks do not prove:
- correctness or completeness of every domain's subject matter;
- quality of every learning objective or assessment;
- real-device browser storage behaviour;
- graph rendering performance;
- app security or encryption;
- successful CI/build or deployment.

Claude must rerun these checks in the implementation repository and add integration/property/e2e tests. Do not describe the app as built or verified until those tests actually run.
