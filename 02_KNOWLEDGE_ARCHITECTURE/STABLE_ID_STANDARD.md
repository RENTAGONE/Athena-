# ATHENA Stable ID Standard
Version: 0.2.0 | Status: Canonical draft for Stage 0 reconciliation | Date: 2026-11-17

## 1. Identity principles
- Human-readable ATHENA codes are immutable, globally unique within their namespace, and never recycled.
- Internal database IDs (UUIDv7 or another implementation choice selected by Claude) are separate from semantic codes.
- Codes identify semantic objects, not mutable titles, display order, parent paths, progress, difficulty, or current location in the graph.
- Renaming or moving an object does not change its code. A move changes relationships; it does not rewrite identity.
- Retired codes remain resolvable through the code registry and are tombstoned or explicitly superseded. No silent deletion.
- Numeric suffixes are instance identifiers, not curriculum order. Ordering belongs in explicit sequence metadata or relationship fields.

## 2. Canonical patterns
| Object | Pattern | Example |
|---|---|---|
| Discipline | `ATH-DISC-{CODE}` | `ATH-DISC-MATH` |
| Domain | `ATH-DOM-{NAMESPACE}-{CODE}` | `ATH-DOM-MATH-ALG` |
| Skill family | `ATH-FAM-{NAMESPACE}-{CODE}` | `ATH-FAM-MATH-ALG-EQ` |
| Skill | `ATH-SKILL-{NAMESPACE}-{CODE}` | `ATH-SKILL-MATH-LINEAR-EQ` |
| Subskill | `ATH-SUB-{NAMESPACE}-{CODE}` | `ATH-SUB-MATH-ISOLATE-VAR` |
| Concept | `ATH-CON-{NAMESPACE}-{CODE}` | `ATH-CON-MATH-INVERSE-OPS` |
| Objective | `ATH-OBJ-{NAMESPACE}-{CODE}` | `ATH-OBJ-MATH-SOLVE-LINEAR-EQ` |
| Learning unit | `ATH-UNIT-{NAMESPACE}-{CODE}` | `ATH-UNIT-MATH-LINEAR-EQ-01` |
| Resource | `ATH-RES-{SOURCE}-{CODE}` | `ATH-RES-BOOK-ALGEBRA-001` |
| Assessment | `ATH-ASMT-{NAMESPACE}-{CODE}` | `ATH-ASMT-MATH-LINEAR-EQ-01` |
| Project | `ATH-PROJ-{NAMESPACE_OR_X}-{CODE}` | `ATH-PROJ-ELEC-SENSOR-01` |
| Micro-skill | `ATH-MICRO-{CATEGORY}-{CODE}` | `ATH-MICRO-COG-MENTAL-ARITH` |
| Transfer link | `ATH-XFER-{CODE}` | `ATH-XFER-ALGEBRA-PHYSICS-EQ` |
| Context | `ATH-CTX-{CODE}` | `ATH-CTX-PHYSICS-LEARNING` |
| Evidence | Internal immutable ID; no semantic code required | Internal UUID |

`NAMESPACE` is a registered origin namespace, not a foreign key to the current owner discipline. A record also stores an explicit `owner_discipline_id`; validators never infer ownership by parsing the code.

## 3. Registered namespaces
Canonical discipline namespaces: `ENG`, `BIZ`, `ELEC`, `FIN`, `BODY`, `PSY`, `AEST`, `WORK`, `ART`, `ATH`, `PERF`, `MATH`, `CYBER`, `LANG`, `RES`, `INDEP`, `LEAD`, `COMM`.

Legacy origin namespaces retained without code regeneration:
- `SCI` → `ATH-DISC-MATH`. Existing `ATH-CON-SCI-*` and `ATH-OBJ-SCI-*` codes remain valid and immutable.
- `LEARN` → `ATH-DISC-WORK`. Existing `ATH-OBJ-LEARN-*` codes remain valid and immutable.

These aliases preserve historical identity; they do not create extra macro disciplines. New content should use the canonical owner discipline namespace unless a reviewed exception is recorded.

## 4. Code construction and versioning
- Uppercase ASCII and hyphen separators only.
- Prefer stable semantic segments. Avoid encoding mutable titles, parent paths, status, or learner state.
- A numeric suffix distinguishes a separate instance only. Do not treat `01`, `02`, etc. as learning order.
- Every content record has `content_version` (positive integer) and schema version is tracked separately at the registry/archive level.
- An ID correction requires an explicit migration map and reference rewrite; never silently regenerate IDs.
- A content edit increments `content_version`, not the ID.

## 5. Graph and ownership rules
- Every hierarchy node except a discipline has one canonical primary `CONTAINS` parent.
- `owner_discipline_id` is explicit and must agree with the discipline reached through the primary `CONTAINS` chain.
- Cross-discipline application uses typed edges and does not duplicate canonical objects.
- Contexts are explicit typed records (`ATH-CTX-*`), not hidden free-text endpoints.
- Evidence is append-only and remains linked to stable target IDs/codes even when a target is deprecated.

## 6. Validation
Reject duplicate or malformed IDs, unknown namespaces, unresolved references, incompatible edge endpoints, illegal relationship types, illegal hard gates, and cycles in hard prerequisite edges. Non-prerequisite semantic relations may cycle. Tombstoned codes cannot be reissued.
