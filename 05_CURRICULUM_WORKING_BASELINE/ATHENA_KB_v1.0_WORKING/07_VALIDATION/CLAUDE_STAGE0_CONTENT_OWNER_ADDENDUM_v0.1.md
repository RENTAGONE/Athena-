# Stage 0 v0.3 — Content-owner resolution addendum v0.1

**Status:** Draft exchange-contract update prepared against Claude Stage 0 v0.3. Content-owner work completed for N-01, N-03 and N-04; N-05 semantics proposed for owner confirmation. All affected records remain draft.

## Source and authority

This addendum supplements `ATHENA_STAGE0_PACKAGE_v0.3_CLAUDE.md`. Claude's supplied artifact has a title line that still says v0.2 while its internal version line says 0.3; the source artifact is preserved verbatim. This addendum does not replace any of the 14 ADRs or change the product invariants.

## N-01 — Structured evidence outcomes

**Implemented in the content package draft:** `SCHEMAS/EVIDENCE_RECORD.schema.json` is now exchange schema v0.2. It adds:

- `outcome`: `not_demonstrated`, `partial`, or `demonstrated`, for records where every target shares the same outcome.
- `target_outcomes[]`: target-specific outcomes for a multi-target evidence record where outcomes differ. Each entry contains `target_id` and `outcome`. A semantic validator must require a one-to-one match with `target_ids`, with no duplicates or foreign targets.
- `rubric_results[].met`: optional boolean; omitted/null means not evaluated, false means criterion not met, true means criterion met.
- `outcome_schema_version: "0.2"` marks new records using the structured outcome contract. Legacy records without it remain parseable but must be classified as outcome-unscored until migrated or reassessed.

**Why both outcome shapes:** Stage 0 N-07 preserves `target_ids[]`. A single record may therefore address multiple targets. A single top-level outcome is insufficient when target results differ. The exchange contract permits one shared outcome or target-specific outcomes, never an inferred average. The importer must validate exact target coverage and reject contradictory simultaneous representations.

**Governance:** evidence remains append-only. A package may propose outcome values, but they become evidence only after preview and explicit user approval. Outcomes do not directly set mastery or overwrite competency history.

## N-03 — Canonical micro-skill links

All 20 canonical micro-skill records now have proposed `discipline_links` and `skill_links`. Six skill-level targets were added to the draft skill seed because the existing 36-skill seed did not contain defensible targets for learning/retrieval strategies, digital input fluency, practical knotwork, clothing repair, local navigation, and emergency preparedness/escalation. The skill seed therefore contains 42 draft candidates.

The links are also represented as draft `SUPPORTS` edges in `ATHENA_RELATIONSHIP_SEED_v0.3.json`. They are non-gating and do not imply equivalence, competence or mastery.

`prerequisites` remain empty where no genuine entry prerequisite is justified. Empty prerequisites are not a missing-data defect: the authoring policy forbids inventing gates merely to populate an array. The CPR/AED readiness micro-skill links only to emergency preparedness/course readiness and is explicitly not CPR/AED practical competence.

All 20 micro-skills remain `DRAFT`; all six new skill nodes remain `draft`; mapping and safety review remain open.

## N-04 — Structural edge IDs in evidence

The evidence schema v0.2 no longer accepts `ATH-EDGE-*` in `target_ids` or `objective_ids`. Structural edges have no permanent semantic code. The three current relationship-seed `client_ref` values were renamed to package-local `rel-*` correlation keys. Historical v0.1 seed files retain their old values for provenance only and must not be imported. Authored transfer links continue to use `ATH-XFER-*`.

## N-05 — `SUPERSEDES` semantics (proposal; owner confirmation pending)

Recommended interpretation: source is the approved successor/replacement; target is the record being superseded. The edge records lifecycle/version lineage only. It does not imply prerequisite, equivalence, or content containment. It should be acyclic and should not be used as a generic “related to” link. Existing registry text already describes source as approved successor/replacement for target; this addendum clarifies the intended direction and proposed acyclic validation. No final change to the relationship registry is promoted until the owner confirms this interpretation.

## Explicitly not changed

- N-02 independence attestation remains storage-only and app-owned; no exchange field is added.
- N-06 derived `parent_id`/`discipline_ids` caches remain app-owned.
- N-07 target arrays and the `evidence_targets` storage index remain as Claude specified.
- N-08 evaluator fields remain exchange-authoritative; provider/model belong in extensions.
- N-09 contrast deviation and N-10 colour distinguishability remain UI implementation/QA responsibilities.
- N-11 historical seed mirrors remain provenance and are exempt from current duplicate detection.

## Required implementation checks for Claude

1. Compile the updated evidence schema with precompiled Ajv standalone validators under the strict CSP; verify no runtime code generation or `eval` is required.
2. Test single-target outcome, shared multi-target outcome, mixed `target_outcomes`, criterion `met` true/false/null, legacy unscored evidence, and rejection of `ATH-EDGE-*`.
3. Enforce semantic equality between `target_ids` and `target_outcomes[].target_id` when target outcomes are used.
4. Validate all 20 micro-skill discipline/skill references against current draft registries; render their links as draft SUPPORTS edges, never hard gates.
5. Validate package-local `client_ref` uniqueness and reject the reserved `ATH-EDGE-*` namespace.
6. Keep `SUPERSEDES` owner-confirmation pending; do not build destructive deletion semantics from it.

## Files introduced or updated

- `02_KNOWLEDGE_ARCHITECTURE/SCHEMAS/EVIDENCE_RECORD.schema.json` (v0.2 contract; v0.1 preserved under HISTORY)
- `02_KNOWLEDGE_ARCHITECTURE/ATHENA_MICRO_SKILL_REGISTRY_v0.3.json`
- `02_KNOWLEDGE_ARCHITECTURE/REGISTRIES/ATHENA_SKILL_SEED_v0.3.json`
- `02_KNOWLEDGE_ARCHITECTURE/REGISTRIES/ATHENA_RELATIONSHIP_SEED_v0.3.json`
- `02_KNOWLEDGE_ARCHITECTURE/RELATIONSHIP_TYPE_REGISTRY_v0.3_PROPOSED.json`
- `07_VALIDATION/MICRO_SKILL_LINKING_REGISTER_v0.1.json`
- `07_VALIDATION/EVIDENCE_OUTCOME_SCHEMA_FIXTURES_v0.2.json`
