# Claude Master Handoff — ATHENA Master Vault v3.1 (working)

This is the short entry point. Read `START_HERE_READ_ORDER.md` and `CLAUDE_CONTINUATION_AND_BUILD_DIRECTIVE_v1.0.md` before implementation.

## Current canonical inputs
- Master Vault v3.1 working: product purpose, invariants, decisions, experience, privacy and roadmap.
- Knowledge Architecture Pack v0.9: 113-domain canonical map, draft skill seeds (42 skills / 36 subskills), 20 canonical micro-skills with proposed links, exchange schemas and authoring standards.
- Claude Stage 0 Package v0.3: latest Stage 0 report; title/version-line mismatch preserved from source.
- Stage 0 Reconciliation Addendum v1.0: 15 original gaps.
- Stage 0 Content-owner Addendum v0.3: N-01, N-03, N-04 content-side resolutions; N-05 proposal pending owner confirmation; ontology working scaffold 146/741 with candidate coverage for all 113 canonical domains; 59/741 family scopes/outcomes drafted.
- Build Readiness & Acceptance Plan v1.0 and Cognitive Atlas Visual Identity & Interface Design System v1.0.

## Ownership
Claude owns technical implementation, stack choices and technical ADRs. The user owns product scope, privacy, data, hosting, repository permissions and irreversible decisions. The Knowledge Architecture Pack owns semantic IDs, taxonomy, relationship meaning, objectives and evidence definitions.

## Non-negotiable invariants
- Local-first, offline-capable v1; no mandatory account, cloud database, telemetry or automatic upload.
- Phone-first workflows; no PC-only maintenance.
- User approval before knowledge changes; no silent destructive writes.
- Stable ATHENA codes separate from internal storage UUIDs.
- Evidence append-only; mastery never automatic.
- Transfer hypotheses are not prerequisites.
- Semantic graph separate from visual layout.
- SD-card backup flow designed and real-device tested; fallback download-and-move.
- Multi-device portability designed now; live sync deferred.
- Health tracking dormant and disabled until explicit user activation.
- Visual design follows the Cognitive Atlas system, not generic SaaS styling.

## Implementation mandate
The original 15 Stage 0 gaps are reported resolved at the Addendum level. The content package now supplies structured evidence outcomes and draft micro-skill links. Remaining N-05 confirmation and content review do not block a reversible Phase 1 scaffold. Only UD-08 repository access blocks repository-based implementation. Inspect the approved repository before writing; use a new branch; never force-push or delete. Do not claim app/schema/CSP/CI/device validation until actual tests run.
