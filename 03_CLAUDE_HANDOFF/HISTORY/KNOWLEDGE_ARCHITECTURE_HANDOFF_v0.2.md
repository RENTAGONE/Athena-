# ATHENA Knowledge Architecture Handoff v0.2

This handoff accompanies Knowledge Architecture Pack v0.7. The Master Vault is the project-wide source of truth; the Knowledge Architecture Pack is the focused, versioned semantic specification. Both are required context, and neither replaces the other.

## New v0.7 material
Skill/subskill authoring; 36 initial draft skill candidates and 36 subskill candidates covering all 18 disciplines; typed relationship schema and sample edges; learning-unit schema and baseline diagnostic example; assessment and evidence schemas; resource provenance schema; dependency rules; curriculum authoring; assessment/evidence policy; resource verification; knowledge lifecycle and change control.

## Implementation direction for Claude
Treat schemas as proposed contracts to review against Stage 0 architecture. Identify incompatibilities and propose ADR-backed adjustments before implementation. Preserve stable semantic IDs separately from internal database keys. Implement staged import/validation/diff/approval/atomic commit and append-only evidence. Do not promote draft seeds to approved curriculum. Do not infer mastery from resource completion. Do not turn recommended prerequisites into hard gates. Validate acyclicity only for hard prerequisite graph edges.

## File roles
- Master Vault: purpose, invariants, decisions, roadmap, history and project context.
- Knowledge Architecture Pack: detailed ontology, schemas, standards and seed registries.
- Anti-Slop Bible: already supplied to Claude in the initial handoff; do not request it again unless Claude reports it is unavailable.
