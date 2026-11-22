# ATHENA Knowledge Architecture Handoff v0.3

This handoff accompanies Knowledge Architecture Pack v0.8 and Master Vault v1.4. The Vault is canonical for product purpose and user-owned decisions; this pack is canonical for semantic IDs, taxonomy, schemas, learning objects, relationships and content governance.

## Read first
1. `README.md`
2. `STABLE_ID_STANDARD.md`
3. `ID_NAMESPACE_REGISTRY_v0.2.json`
4. `ATHENA_DOMAIN_MAP_v0.3.md` and `.json`
5. `RELATIONSHIP_TYPE_REGISTRY_v0.2.json`
6. `KNOWLEDGE_ARCHITECTURE_AND_ONTOLOGY.md`
7. `EXCHANGE_AND_STORAGE_MAPPING_v0.2.md`
8. `SCHEMAS/` and root schemas
8. `REGISTRIES/` and transfer/micro-skill registries
10. `VALIDATION_REPORT_v0.8.md`

## Binding semantic rules
- Preserve all original IDs; do not silently regenerate, drop or re-parent content.
- Explicit `owner_discipline_id` is authoritative and must agree with the primary `CONTAINS` chain.
- `SCI` and `LEARN` are legacy origin namespaces for existing codes. The owner is per-record and is never inferred from the code segment.
- 113 domains and 40 skill families are draft taxonomy, not completed curriculum.
- 36 skills and 36 subskills are draft candidates. Domain mappings are proposals, not approvals.
- Transfer links are hypotheses and never prerequisites.
- Structural edges get internal IDs on commit; exchange uses `client_ref`. `ATH-XFER-*` codes remain stable semantic transfer IDs.
- `gating` is separate from relation type. Only `PREREQUISITE_FOR` may be hard-gated.
- Contexts are first-class `ATH-CTX-*` objects.
- Exchange convenience links normalise into edges; storage edges are the single source of truth.
- Evidence is append-only. AI cannot mint codes or set mastery.
- Micro-skills remain a separate linked subsystem. All 20 seed records are DRAFT; four HIGH-risk records remain blocked pending human safety review.

## Validation and implementation boundary
The fixtures have been schema-validated and cross-reference checked as documented. Claude must implement the same rules in runtime validators and tests. Do not treat this pack's passing fixture checks as proof that the app, importer, graph, backup, or real-device storage has been tested.
