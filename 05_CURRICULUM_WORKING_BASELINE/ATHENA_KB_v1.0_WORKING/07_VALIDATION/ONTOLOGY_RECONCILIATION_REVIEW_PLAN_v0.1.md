# Ontology Reconciliation Review Plan v0.1

**Purpose:** Resolve the two parallel domain maps and micro-skill registries without losing existing decisions or creating false equivalences.

## Workstream A — domains
1. Freeze both source registries as immutable inputs: canonical 113-domain/40-family map and working 145-domain/733-family scaffold.
2. Normalize names and descriptions only in a derived comparison view; never rewrite source records during comparison.
3. For each working domain, compare scope, learning outcomes, boundaries, parent discipline, examples and exclusions—not title similarity alone.
4. Assign exactly one review disposition: `equivalent`, `alias`, `split_from`, `merged_into`, `broader_than`, `narrower_than`, `related_to`, `new_proposal`, `retire_candidate`, or `unresolved`.
5. For every split/merge, record source IDs, target IDs, rationale, preserved provenance, affected module/skill references and migration strategy.
6. Reconcile skill-family clusters separately. The 733 working family entries must not be described as 733 approved canonical families.
7. Review all unresolved and low-similarity cases with a human; no automatic acceptance threshold.
8. Generate proposed canonical migration only after all source records have a disposition; run schema, uniqueness, parent/child and edge validation.

## Workstream B — micro-skills
1. Compare all 20 `ATH-MICRO-*` architecture records with all 155 `MS-*` working candidates.
2. Preserve the original named micro-skills and their aliases, including legacy names.
3. Use the same disposition vocabulary, with `duplicate_of` permitted only when target performance and assessment are genuinely equivalent.
4. Keep longitudinal capabilities (e.g. Ambidexterity Basics) distinct from short acquisition tricks and represent their progression/maintenance model explicitly.
5. Apply safety review before approving locksport, electrical/tool, emergency-response, health, physical-performance or security-related protocols.
6. Decide whether `MS-*` becomes canonical, maps to `ATH-MICRO-*`, or remains a working namespace with explicit aliases. Do not silently mint replacements.

## Required outputs
- Human-readable decision ledger with rationale and reviewer.
- Machine-readable mapping table with source/target IDs and disposition.
- Alias/migration table and affected-reference inventory.
- Updated canonical registries only after approval.
- Validation report covering ID stability, unresolved references, duplicates, hierarchy and graph cycles.

## Non-negotiable safeguards
- No title-only merges.
- No deletion or ID recycling.
- No automatic canonical promotion.
- Preserve old IDs as aliases or migration sources where appropriate.
- All changes remain draft until approved.
