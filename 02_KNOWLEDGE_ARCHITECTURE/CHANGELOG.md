# Knowledge Architecture Pack Changelog

## v0.8.0 — 2026-11-17
- Restored four missing domain IDs from the original foundation seed; Domain Map v0.3 now has 113 domains and 40 skill families.
- Added explicit `owner_discipline_id`, normalized content versions and domain/family schemas.
- Added ID namespace registry; retained legacy `SCI` and `LEARN` codes without regenerating IDs.
- Mapped 36 draft skills to proposed primary domains and mapped 36 subskills through parent skills.
- Published a canonical relation-type registry and explicit `gating` semantics.
- Structural relationship exchange uses `client_ref`; internal IDs are assigned at commit. Transfer links retain `ATH-XFER-*` codes.
- Added first-class context records and normalized 31 transfer hypotheses in v0.3.
- Added structured micro-skill maintenance policies, qualitative success criteria, version metadata and HIGH-risk review gates; count corrected to 20.
- Added schemas for domain, family, context, transfer, project, milestone, practice protocol and competency state; updated node, relationship, objective, unit, assessment, skill, subskill and micro-skill schemas.
- Added mapping and validation reports. All content remains draft pending human review.
- Added `ATHENA_CONTENT_COVERAGE_v0.1.json` (42 seeded-draft domains, 71 taxonomy-only domains) and `CONTENT_AUTHORING_ROADMAP_v1.0.md` to separate taxonomy size from real curriculum coverage.


## v0.9 — Stage 0 v0.3 content-owner contract pass (2026-11-17)
- Added evidence exchange schema v0.2 with structured record-level and per-target outcomes plus criterion `met`.
- Removed ATH-EDGE from evidence target patterns; retained historical seed IDs only as provenance.
- Added six draft skill-level targets and linked all 20 canonical micro-skills to disciplines and skills using non-gating SUPPORTS edges.
- Added package-local relationship client_ref values and evidence fixtures.
- Added proposed SUPERSEDES acyclic-lineage semantics; pending owner confirmation.
- Added full v0.9 validation script; no expert content approval or app Ajv/CSP test is claimed.
