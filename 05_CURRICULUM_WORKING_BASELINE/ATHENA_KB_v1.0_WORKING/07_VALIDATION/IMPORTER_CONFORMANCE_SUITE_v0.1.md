# ATHENA importer conformance suite v0.1

**Status:** Test specification only; not executed. Requires Claude’s implemented importer and a disposable test database.

**Cases:** 22

| ID | Test | Expected result |
|---|---|---|
| IMP-001 | Valid new record | `preview_then_commit` |
| IMP-002 | Valid update | `preview_then_commit` |
| IMP-003 | Idempotent re-import | `second_import_noop` |
| IMP-004 | Conflicting duplicate code | `reject_conflict` |
| IMP-005 | Dangling reference | `reject_dangling_reference` |
| IMP-006 | Tombstoned reference | `reject_or_require_explicit_migration` |
| IMP-007 | Schema-required field missing | `reject_schema` |
| IMP-008 | Invalid lifecycle enum | `reject_schema` |
| IMP-009 | Hard prerequisite without justification | `reject_semantic_validation` |
| IMP-010 | Hard prerequisite cycle | `reject_graph_cycle` |
| IMP-011 | Non-gating relationship cycle | `allow_if_type_valid` |
| IMP-012 | Duplicate client_ref | `reject_package_conflict` |
| IMP-013 | AI attempts to mint permanent ID | `reject_or_ignore_untrusted_id` |
| IMP-014 | Partial package failure | `atomic_rollback` |
| IMP-015 | Evidence append-only | `reject_mutation_append_new` |
| IMP-016 | Export/import round trip | `round_trip_equivalent` |
| IMP-017 | Checksum or archive tampering | `reject_integrity` |
| IMP-018 | Schema-version migration dry run | `preview_migration` |
| IMP-019 | Unknown relationship type | `reject_schema` |
| IMP-020 | New code collision at commit | `serialize_or_reject_conflict` |
| IMP-021 | Cross-discipline ownership mismatch | `reject_semantic_validation` |
| IMP-022 | User rejects preview | `no_commit` |

## Global invariants

- No AI-created internal UUIDs.
- No silent stable-code minting or reassignment.
- No last-write-wins for conflicting content.
- Evidence history is append-only.
- Only hard prerequisite edges must be acyclic.
- Non-prerequisite semantic relationships may form cycles.
- Preview is non-mutating.
- Rejected or failed transactions leave the prior database hash unchanged.
- Export/import preserves semantic content, provenance, aliases and tombstones.

## Execution protocol

1. Run each case against a fresh isolated fixture or a resettable transaction.
2. Capture app version, schema version, browser/device, package hash, database hash before and after, validation output and screenshots/log references.
3. For every rejection, assert zero committed mutations and a path-specific diagnostic.
4. For successful cases, export and compare semantic records and provenance.
5. Run on the target Android device and a desktop browser; performance is a separate measurement.
6. Mark a case passed only with reproducible evidence. Do not infer success from static schema validation.
