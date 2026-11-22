# Claude Importer Test Requirements Addendum v0.1

The Knowledge Base is still a working content package. Before any v1.0 release, implement and execute the test cases in `05_CURRICULUM_WORKING_BASELINE/ATHENA_KB_v1.0_WORKING/07_VALIDATION/IMPORTER_CONFORMANCE_SUITE_v0.1.md` and its JSON catalogue.

The suite covers 22 scenarios: valid create/update, idempotency, duplicate conflicts, dangling/tombstoned refs, schema failures, invalid enums, hard-prerequisite justification and cycles, non-prerequisite cycles, client_ref collisions, AI ID-minting attempts, atomic rollback, append-only evidence, round-trip export/import, checksum tampering, schema migration, unknown relationship types, concurrent code collisions, ownership mismatch and rejected preview.

Do not mark these tests passed until the actual app importer is implemented and each case has reproducible execution evidence. Run against a disposable database, then test on the target Android browser/device. The test suite is a specification, not a substitute for the app's real schemas.
