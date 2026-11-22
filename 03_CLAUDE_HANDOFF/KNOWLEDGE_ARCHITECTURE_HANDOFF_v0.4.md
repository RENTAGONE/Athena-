# ATHENA Knowledge Architecture Handoff v0.4

This handoff accompanies Knowledge Architecture Pack v0.9 and Master Vault v3.0 working. The Vault governs product purpose and user-owned decisions; the Pack governs semantic IDs, taxonomy, schemas, registries and content exchange.

## Read first
1. `README.md`
2. `STABLE_ID_STANDARD.md` and `ID_NAMESPACE_REGISTRY_v0.2.json`
3. `ATHENA_DOMAIN_MAP_v0.3.md` and `.json` (canonical 113-domain / 40-family seed)
4. `REGISTRIES/ATHENA_SKILL_SEED_v0.3.json` (42 draft skill candidates)
5. `ATHENA_MICRO_SKILL_REGISTRY_v0.3.json` (20 linked draft micro-skills)
6. `REGISTRIES/ATHENA_RELATIONSHIP_SEED_v0.3.json` (26 draft edges)
7. `RELATIONSHIP_TYPE_REGISTRY_v0.2.json`; proposed v0.3 SUPERSEDES clarification is not approved
8. `EXCHANGE_AND_STORAGE_MAPPING_v0.2.md`
9. `SCHEMAS/` and `STANDARDS/`
10. `VALIDATION_REPORT_v0.9.md`

## Binding semantic rules
- Preserve all existing canonical IDs; no silent regeneration, drop, re-parent, merge or alias.
- Explicit `owner_discipline_id` is authoritative and must agree with the primary CONTAINS chain.
- Canonical map remains 113 domains / 40 skill-family seeds. The expanded working scaffold is 146 domains / 741 family candidates and is not the canonical map.
- Domain crosswalk v0.4 gives candidate coverage for all 113 canonical domains, but no mapping is approved. Chemistry `DOM-MATH-09` is a working candidate only.
- Six new skill records expand the draft seed to 42 to give the 20 canonical micro-skills legitimate link targets. They remain draft.
- All 20 micro-skills have proposed discipline/skill links and non-gating SUPPORTS edges. Empty prerequisite lists are valid when no genuine prerequisite is justified.
- Transfer links are hypotheses and never prerequisites. Only `PREREQUISITE_FOR` may be hard-gated.
- Structural edges use package-local `client_ref` only; no `ATH-EDGE-*` semantic IDs. Authored transfer links retain `ATH-XFER-*`.
- Evidence is append-only. Schema v0.2 adds structured `outcome`, per-target outcomes for mixed multi-target evidence, and optional criterion `met`. Legacy records without outcome fields remain outcome-unscored.
- A package may propose evidence but cannot commit it, mint internal UUIDs or set mastery.

## Validation boundary
The Pack v0.9 Python validator passed 461 record instances and 24 active schemas plus two historical schemas. Claude must independently compile the schemas with Ajv standalone validators under strict CSP and execute app tests. No build, CI, browser, importer, graph, PWA or device test is claimed by this handoff.
