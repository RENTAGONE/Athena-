# ATHENA Exchange ↔ Storage Mapping Standard v0.2

## Why two representations exist
Content authoring packages must be portable and human-reviewable. The application database must use immutable internal identifiers and normalised relationships. They are not the same representation.

## Exchange representation in this pack
- `id` on a knowledge seed record is its stable human-readable ATHENA code (for example `ATH-SKILL-MATH-NUMBER-ALG`).
- References such as `parent_id`, `discipline_ids`, `domain_ids`, `source_id` and `target_id` in exchange files carry ATHENA codes.
- Structural relationship packages use `client_ref` as a package-scoped idempotency/correlation key. It is not a permanent public code.
- Transfer links use their stable `ATH-XFER-*` semantic code in the exchange `id` field.
- Exchange fields may embed convenience references for readability. These are not the stored source of truth.

## Storage representation
- Every persisted knowledge record has an internal immutable UUID in `id` and its human-readable stable ATHENA code in `code`.
- Every stored relationship has an internal immutable UUID in `id`; its `source_id` and `target_id` are internal UUIDs.
- Only authored transfer links require a human-readable relationship `code` (`ATH-XFER-*`). Ordinary structural edges do not receive `ATH-EDGE-*` codes.
- `owner_discipline_id` and other stored references point to internal UUIDs.
- The code registry maps semantic codes to internal IDs and records active, tombstoned or superseded status.

## Import
1. Validate the exchange record against its versioned exchange schema.
2. Resolve each ATHENA code through the code registry.
3. For a new object, allocate internal UUID and register its code at commit.
4. Resolve all exchange references to internal IDs.
5. Convert embedded link fields to normalized edge operations.
6. Validate ownership, type compatibility, duplicate/conflict rules and hard-prerequisite acyclicity.
7. Show the complete diff and impact preview.
8. Commit only after explicit approval, atomically and with provenance.

AI tools may propose content and refer to existing codes; they do not mint permanent IDs/codes and cannot set mastery.

## Export
Export maps internal UUID references back to stable ATHENA codes and regenerates convenience link fields. The export is lossless with respect to semantic content and provenance. Unknown or tombstoned references are reported, not dropped.

## Required tests
- import/export round trip preserves codes, relationships, tombstones and content hashes;
- two imports of the same package are idempotent;
- dangling codes are rejected with precise paths;
- new codes are allocated only by ATHENA at commit;
- structural edge client_ref does not leak as a permanent ATH-EDGE code;
- a failed transaction leaves the prior database hash unchanged.


## Evidence outcome exchange v0.2

The evidence schema now supports record-level `outcome` when all targets share one result, or `target_outcomes[]` when target outcomes differ. `rubric_results[].met` is an optional explicit criterion-threshold result. `outcome_schema_version: "0.2"` identifies new structured records; older evidence remains readable but outcome-unscored. The app must semantically validate target coverage and keep evidence append-only. Evidence target codes exclude `ATH-EDGE-*`; structural edges have only package-local `client_ref` values.


