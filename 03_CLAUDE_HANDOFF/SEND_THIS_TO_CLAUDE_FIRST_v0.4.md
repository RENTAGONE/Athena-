# SEND THIS TO CLAUDE FIRST — ATHENA Stage 0 v0.3 / Phase 1 handoff v0.4

Use the attached files as the current working source set:
1. `ATHENA_Master_Vault_v3.1_WORKING.zip`
2. `ATHENA_Knowledge_Architecture_Pack_v0.9.zip`
3. `ATHENA_KB_v1.0_WORKING_ONTOLOGY_CONTRACT_v2.5.zip` (if you need the standalone curriculum package)

Read the latest Stage 0 v0.3 report embedded in the Vault, then `CLAUDE_STAGE0_CONTENT_OWNER_ADDENDUM_v0.3.md`, `KNOWLEDGE_ARCHITECTURE_HANDOFF_v0.4.md`, and `USER_DECISION_CONFIRMATION_MATRIX_v1.1.md`. Preserve all 14 ADRs and all product invariants.

## What changed since your Stage 0 v0.3 report

- N-01 content-side resolution: evidence exchange schema v0.2 adds record-level `outcome`, `target_outcomes[]` for mixed multi-target results, optional `rubric_results[].met`, and `outcome_schema_version`. New v0.2 records must use exactly one outcome representation. Legacy records remain parseable but outcome-unscored. The content validator tests seven fixtures.
- N-03 content-side resolution: all 20 canonical micro-skills now have proposed discipline and skill links, represented by draft non-gating SUPPORTS edges. Six new draft skill targets expand the seed from 36 to 42. Empty prerequisites are intentional where no genuine entry prerequisite is justified.
- N-04 content-side resolution: evidence target patterns reject `ATH-EDGE-*`; current structural relationship `client_ref` values use package-local `rel-*`. Historical v0.1 edge IDs are provenance-only.
- N-05: proposed interpretation is source=approved successor, target=superseded record; lifecycle lineage only and acyclic. This is still owner-confirmation pending (UD-19); do not promote it or implement destructive deletion semantics.
- Ontology: working scaffold is now 146 domains / 741 family candidates. 59/741 family candidates now have draft scope/outcome specifications across the first two domains of six Wave 1 disciplines; 682 remain. This is not subject approval. Candidate crosswalk v0.4 covers 113/113 canonical domains; Chemistry `DOM-MATH-09` is a working candidate aligned to `ATH-DOM-MATH-CHEM`, not an approved canonical merge. Eleven repeated-name family groups have semantic review; preserve separate IDs, no merge/alias approved.
- Knowledge Architecture Pack v0.9 validator: 56 JSON files parsed, 24 active schemas plus 2 historical schemas meta-validated, 461 record instances checked, zero cross-reference/governance errors. The separate working ontology validator also passes.

## Your remaining Stage 0 / Phase 1 responsibilities

- N-02: implement independence attestation as storage-only and derive independence conservatively as specified in Stage 0. Packages cannot set it.
- N-06: keep parent_id and discipline_ids derived caches synchronized from CONTAINS edges; reject direct writes.
- N-07: preserve target_ids[] and maintain evidence_targets index.
- N-08: use exchange evaluator fields; provider/model only in extensions.
- N-09: fix or avoid the 4.49:1 muted-text/surface-3 pairing; verify actual contrast and component states.
- N-10: verify discipline distinguishability through glyph, label, pattern and graph testing, never colour alone.
- N-11: treat historical foundation-seed domain mirrors as provenance, exempt from current duplicate detection.
- Compile current Pack schemas with Ajv standalone validators and test under strict CSP. Do not assume Python jsonschema success proves Ajv/CSP compatibility.
- Run the actual 22-case importer conformance suite, plus evidence outcome cases, on the app. Keep logs and report failures honestly.
- No app build, CI, browser, PWA, IndexedDB, graph, accessibility or device tests have yet been claimed.

## Repository access (UD-08) — still required before repository writes

The user has not yet supplied/confirmed a GitHub repository URL. A prior suggested repository name was `ATHENA-MASTER-VAULT`, but that name is not approved and no repository URL/access is established. Ask the user which existing repository to use, or whether to create a new repository with that name. Once approved: inspect before writing, create a new branch, never force-push/delete/overwrite, and report the branch and commit. Do not create an unverified scaffold ZIP unless the user chooses that fallback.

## Execution order

1. Confirm UD-08 repository access.
2. Inspect repo and branch; preserve existing files.
3. Update schema/seed fixtures from Pack v0.9 and implement tests for N-01/N-03/N-04.
4. Build a thin end-to-end vertical slice per Stage 0 v0.3 acceptance: offline shell, Execute empty state, Knowledge catalogue and Skill Detail loaded from draft seeds, persistence, CI report.
5. Prove Ajv standalone + CSP, importer validation, rollback and round-trip as their stages arrive.
6. Do not wait for the full curriculum to begin reversible implementation; the content work continues in parallel.
