# ATHENA Knowledge Architecture Pack v0.9
**Date:** 2026-11-17 · **Status:** canonical draft architecture and exchange-contract update for Claude Stage 0 v0.3

## Purpose
This pack defines ATHENA's semantic knowledge model: taxonomy, stable IDs, relationships, learning objectives, skills/subskills, learning units, resources, assessments, evidence, projects, micro-skills and governance. It is not a completed curriculum. All taxonomy and seed records remain draft unless a record explicitly says otherwise.

## Contents
- `ATHENA_DOMAIN_MAP_v0.3.json/.md` — 18 disciplines, 113 canonical domains, 40 canonical skill-family seeds.
- `ID_NAMESPACE_REGISTRY_v0.2.json` and `STABLE_ID_STANDARD.md` — stable identity and namespace rules.
- `ATHENA_CROSS_DOMAIN_TRANSFER_v0.3.json` — draft transfer hypotheses and contexts.
- `RELATIONSHIP_TYPE_REGISTRY_v0.2.json` — current relationship vocabulary; proposed v0.3 SUPERSEDES clarification remains unapproved.
- `FOUNDATION_NODE_SEED_v0.2.json` — preserved draft seed nodes.
- `REGISTRIES/ATHENA_SKILL_SEED_v0.3.json` — 42 draft skill candidates (36 original + 6 new micro-skill link targets).
- `REGISTRIES/ATHENA_SUBSKILL_SEED_v0.2.json` — 36 draft subskills.
- `ATHENA_MICRO_SKILL_REGISTRY_v0.3.json` — 20 draft canonical micro-skills with proposed discipline and skill links.
- `REGISTRIES/ATHENA_RELATIONSHIP_SEED_v0.3.json` — original draft relationships plus draft non-gating SUPPORTS edges for micro-skills.
- `SCHEMAS/` — canonical exchange and storage contracts; evidence exchange schema is v0.2.
- `STANDARDS/` — authoring, assessment, dependency, provenance, review and lifecycle standards.
- `tools/validate_pack.py` — full Draft 2020-12 meta-validation, record validation and referential checks for v0.9 fixtures.
- `HISTORY/` — superseded schema and registry inputs retained for audit; do not import as current.

## Canonical rules
1. One explicit owner discipline per knowledge record.
2. One primary CONTAINS parent for hierarchical nodes.
3. Cross-domain application uses typed edges; it does not duplicate canonical objects.
4. Only PREREQUISITE_FOR may have gating=hard; hard gates require strength=required, rationale and acyclic validation.
5. Structural edges use package-local `client_ref`; ATH-XFER codes are reserved for authored transfer links. No ATH-EDGE semantic IDs.
6. AI packages cannot mint internal UUIDs or set mastery.
7. Evidence is append-only. Derived competency must be explainable and recomputable.
8. Draft validation is not content approval.
9. Micro-skill SUPPORTS links are draft, non-gating and do not imply equivalence or mastery.
10. Empty prerequisite lists are valid when no genuine prerequisite is justified.

## Counts
| Registry | Count | Status |
|---|---:|---|
| Macro disciplines | 18 | Registered |
| Domains | 113 | Draft |
| Skill families | 40 | Draft |
| Skills | 42 | Draft candidates |
| Subskills | 36 | Draft candidates |
| Transfer links | 31 | Draft hypotheses |
| Contexts | 6 | Draft |
| Micro-skills | 20 | Draft; linked candidates |
| Relationship seed edges | 26 | Draft |
| Learning objective seed | 1 | Illustrative draft |
| Learning unit seed | 1 | Illustrative diagnostic draft |
| Assessment seed | 1 | Illustrative diagnostic draft |

## Validation
See `VALIDATION_REPORT_v0.9.md`. JSON Schema documents are meta-validated with Python jsonschema Draft 2020-12; record fixtures and cross-references are validated by the included script. This does not establish expert review, curriculum completeness, Ajv/CSP compatibility, application integration or device performance.
