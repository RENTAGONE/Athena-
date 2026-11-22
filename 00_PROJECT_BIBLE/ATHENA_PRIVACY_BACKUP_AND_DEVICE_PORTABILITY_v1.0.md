# ATHENA Privacy, Backup & Multi-Device Architecture Requirements
Version 1.0.0 · 2026-11-17

## 1. Default privacy posture
- Single-user, local-first v1.
- No mandatory account, cloud database, analytics, telemetry, ad SDK or third-party tracking.
- No automatic upload of notes, sessions, evidence, health data or knowledge records.
- AI tools receive only the material the user deliberately copies or exports.
- Static hosting of app assets must not be confused with hosting user data.
- Imported text and URLs are untrusted data. No automatic execution, rendering of raw HTML, remote fetch or instruction-following.

## 2. Data classification
| Class | Examples | V1 handling |
|---|---|---|
| Public/reference content | Published resource metadata, taxonomy labels | Local database; provenance retained |
| Personal learning data | Notes, sessions, evidence, assessments, projects | Local-only by default; user-controlled export |
| System data | Settings, rules, layout, changesets, device ID | Local; included in full archive |
| Personal health data | Optional measurements, health logs, nutrition/sleep tracking | Dormant module; no collection until explicit activation; separate logical store |
| Secrets | Export passphrase, recovery material | Never log, never include in plain archive |

## 3. Backup archive contract
The archive format is versioned and documented. The exact serialization (gzip NDJSON or another format) is a technical ADR decision; the following content requirements are mandatory:
- manifest with archive format version, app version, per-type schema versions, registry/rules versions, creation time, device ID and record counts;
- every record type required to reconstruct the user's state, including tombstones, relation types, contexts, evidence, review history, notes, sessions, plans, projects, layouts, changesets, provenance and feature settings;
- integrity checksum (SHA-256 or an equivalent reviewed standard) over canonical archive content;
- explicit encoding and newline rules;
- archive-level validation before writing and after reading;
- compatibility/migration information for older archives.

Never export derived caches as the only source of truth. Derived competency and search indexes must be recomputable.

## 4. Export flow
1. User selects Export.
2. ATHENA creates a consistent snapshot and freezes a manifest/version boundary.
3. Archive is generated without blocking the UI; progress and failure are visible.
4. Checksum is computed.
5. Browser offers the best supported save/share picker.
6. User chooses SD card or another destination. If the picker cannot target SD card, download and provide manual move instructions.
7. ATHENA verifies the saved file when the browser allows reading it back. If not, it clearly labels the file “exported, not independently re-read”.
8. Settings records the last export time, archive version and verification state.

A same-device restore point is not an external backup. Warn the user that device loss, browser-data clearing or SD-card failure can still destroy data if no independent copy exists.

## 5. Restore and merge
- Read and validate the manifest before import.
- Verify checksum before parsing records.
- Validate each record against its declared schema version.
- Resolve all IDs and references; report unknown types and dangling links.
- Perform migration dry-run in scratch storage.
- Show counts for added, changed, unchanged, conflicting, deprecated and rejected records.
- Show whether Replace or Merge is selected and what each means.
- Create a restore point before any commit.
- Commit atomically or leave the prior state untouched.
- Never silently overwrite a newer local record.
- Conflicts require an explicit strategy: keep local, accept imported, duplicate as a draft, or defer.
- Run a post-restore consistency check and report result.

## 6. Encryption
Encrypted export is an optional later capability, not a claim about IndexedDB encryption at rest.
Before shipping it, Claude must document and test:
- passphrase-based key derivation parameters and WebCrypto algorithm;
- salt, nonce/IV and authentication tag handling;
- versioned KDF metadata in the archive;
- password confirmation and recovery warning;
- wrong-password and corrupted-file behaviour;
- no passphrase/key logging or persistence in plaintext;
- restore on a second device.
If the user loses the only passphrase, recovery may be impossible; communicate this before export.

## 7. Android SD-card constraints
Browser support for direct filesystem APIs and removable storage varies. The application must use feature detection and a fallback. It must not assume an unrestricted filesystem path.
Acceptance test on the target Infinix HOT 60i / Android 15:
- generate archive;
- invoke Save/Share;
- inspect available Android destinations;
- save to SD card if offered;
- reopen and verify archive;
- repeat with fallback download-and-move;
- test file naming, overwrite warning and storage-full failure.
Record browser name/version and Android/XOS version. Until this passes, label SD-card compatibility “designed; device test pending.”

## 8. Future multi-device architecture
V1 remains no-sync. Preserve the ability to add optional sync later:
- stable semantic codes and internal immutable IDs;
- device ID on local changesets;
- record version and updated timestamp;
- append-only evidence with immutable IDs;
- schema version per record type;
- tombstones and explicit supersession;
- deterministic package IDs/idempotency;
- conflict preview and merge audit;
- no assumptions that device clocks are perfectly aligned.

Do not implement CRDT or cloud sync pre-emptively without a concrete requirement. First establish correct single-device transactions and lossless export/import.

## 9. Optional health module boundary
- Separate logical tables/store namespace and independent export category.
- Disabled by default; no background collection.
- Explicit user-defined activation threshold/trigger and confirmation.
- User can pause, export or delete health data without touching learning data.
- No AI provider receives health records unless user explicitly selects and confirms a specific export.
- No automated diagnosis, target weight, calorie deficit or body-fat goal.
