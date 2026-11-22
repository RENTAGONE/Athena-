# Knowledge Authoring, Review and Change Control v0.1
Status: Draft.

## 1. Lifecycle
`draft -> review -> approved -> deprecated -> archived` (not every item must pass through every state). Draft content is importable only into a staging area. Approved content becomes canonical. Deprecation preserves identity and inbound references; archival preserves history.

## 2. Ingestion pipeline
1. Parse package and identify schema/version.
2. Validate structure and required fields.
3. Validate stable IDs, uniqueness and references.
4. Detect duplicates/near-duplicates and conflicts.
5. Validate graph rules (including prerequisite cycles).
6. Check provenance, safety and content status.
7. Generate a human-readable diff/preview.
8. Obtain user approval for canonical changes.
9. Commit atomically with an audit event and reversible migration record.

## 3. Conflict policy
Never silently overwrite canonical approved content. Offer explicit options: accept new, retain existing, merge with field-level diff, create a new version, or reject. Preserve source provenance and author. When meaning changes materially, create a new stable ID and supersession link; wording-only edits retain ID and increment content version.

## 4. Versioning
Schema version governs structural compatibility; content version governs revisions to one knowledge object; registry/package version governs a collection. Use migrations with preconditions, results and rollback plan. Never recycle IDs.

## 5. Quality gates
Check clarity, scope, distinctness, observable outcomes, evidence alignment, source quality, safety, localization, accessibility and cross-domain duplication. Keep draft/review status visible. Approval is a governance action, not a mastery claim.
