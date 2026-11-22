# ATHENA Wave 13 — App Exchange and Operational Compatibility Handoff v1.0

**Status: implementation contract and test specification; actual app execution has not been performed.** This handoff is for the application engineer. It does not claim Claude/Gemini implementation compatibility.

## 1. Existing contract preserved

The existing 22-case `IMPORTER_CONFORMANCE_SUITE_v0.1` remains the baseline. The 18 additional cases in `ATHENA_WAVE_13_IMPORTER_TEST_EXTENSIONS_v1.0.json` extend it to **40 cases**. Existing stable IDs, schemas and semantics are not silently replaced.

## 2. Required import lifecycle

1. Read package manifest and verify checksum before parsing records.
2. Parse in a sandbox with archive path traversal, decompression bomb and oversized payload protections.
3. Validate schema version and all record types; run semantic reference and graph checks.
4. Produce a non-mutating preview: adds, updates, aliases, tombstones, conflicts, migrations, warnings and rejected records.
5. Require explicit user approval for the exact preview.
6. Create and verify a pre-commit backup.
7. Commit atomically; if any record fails, rollback the entire package and verify database hash unchanged.
8. Record import receipt, package hash, schema versions, app version, operator decision and migration provenance.
9. Export the resulting state and verify semantic round-trip equivalence.

## 3. Identity and evidence invariants

- The app, not imported content or AI, owns permanent internal IDs.
- Stable public/canonical codes are not silently minted, reassigned or reused.
- Aliases and tombstones survive migration and round-trip.
- Evidence and learner attempts are append-only. Correction means a new superseding record with a reason.
- No silent last-write-wins for authored content, evidence, schedules or privacy settings.
- Hard prerequisites alone must be acyclic; semantic/non-gating relationships may be cyclic when type-valid.
- Unknown required semantics are rejected; optional extension fields follow an explicit compatibility policy.

## 4. Offline-first behaviour

Core reads and writes use local persisted data. Network sync is a separate repository concern. Writes enter a durable outbox with idempotency keys and retry state. The UI reports local-saved, pending-sync, synced, conflict or failed states. Do not delete local data before server acknowledgement and integrity checks.

Conflict policy is domain-specific:
- append-only evidence: preserve both events; never overwrite;
- user-edited content: show versions and ask for merge/choice;
- schedule events: retain event history and ask before applying a conflicting change;
- preferences: user-visible conflict resolution, not silent remote override;
- static reference content: package-version policy can select newer approved version while retaining provenance.

## 5. Backup, restore and deletion

Backup must include manifest, schema/app version, timestamps, checksums, stable IDs, aliases, tombstones and provenance. Restore starts with a preview and explicit confirmation. A corrupt backup must not mutate current data. Deletion/export must include local data, synced copies, media references and documented retention limits; legal retention exceptions require qualified advice.

## 6. Test execution requirements

Run all 40 cases on a disposable database. Capture app version, schema version, package hash, database hash before/after, device/browser, logs, screenshots where useful, and reproducible pass/fail. For rejection cases, assert zero mutation. Run on the target Android device and desktop browser. Record performance separately; schema validation is not runtime compatibility.

## 7. Acceptance criteria

Wave 13 can be marked app-tested only when:
- all 40 cases have evidence and no unresolved P0 defect;
- preview is non-mutating and approval is explicit;
- package commit is atomic;
- rollback and backup restore are verified;
- offline writes survive restart and sync exactly once;
- conflict policy is visible and domain-specific;
- provenance and identity survive round-trip;
- target Android and desktop tests are recorded.

## 8. App engineer must report

Return a machine-readable test log with case ID, result, environment, hashes, artifact references, defect IDs, retest result and reviewer. Do not mark tests passed from code inspection alone.
