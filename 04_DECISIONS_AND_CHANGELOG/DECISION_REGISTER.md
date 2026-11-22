# Decision Register
Version: 0.1.0 | Consolidated: 2026-11-16

| ID | Decision | Status | Notes |
|---|---|---|---|
| ATH-DEC-001 | ATHENA is a personal learning and knowledge operating system, not just a tracker | Accepted | Governing product definition |
| ATH-DEC-002 | Understanding over speed; adaptive, evidence-based progression | Accepted | No arbitrary deadlines or automatic mastery |
| ATH-DEC-003 | Hybrid mobile-first PWA | Accepted | Offline-capable core; cloud sync/backup separate |
| ATH-DEC-004 | Both JSON import and copy/paste ingestion | Accepted | Both pass through one validation, preview, approval and history engine |
| ATH-DEC-005 | Gemini teaches; ChatGPT evaluates/prepares updates; ATHENA validates/stores; user approves | Accepted | Learning/update protocol |
| ATH-DEC-006 | 18 macro discipline domains | Accepted as initial taxonomy | Curricula still require detailed validation |
| ATH-DEC-007 | Micro-skills are a separate linked subsystem | Accepted | Must not crowd out core learning/recovery |
| ATH-DEC-008 | Three environments: Execution, Knowledge, Architect Studio | Accepted | Distinct UX and responsibilities |
| ATH-DEC-009 | Claude owns app implementation and technical choices | Accepted | Must document trade-offs and ADRs |
| ATH-DEC-010 | ChatGPT owns knowledge architecture and structured learning content | Accepted | IDs, curricula, objectives, edges, assessments |
| ATH-DEC-011 | User approves consequential changes; no silent destructive writes | Accepted | Preview, validation, history, rollback |
| ATH-DEC-012 | Detailed architecture early; progressive feature activation | Accepted | Separate design maturity from active tracking |
| ATH-DEC-013 | Saturday weekly review at 8 PM Asia/Dhaka for one hour | Active recurring review | Existing automation; do not duplicate |

## Open / not yet finalized
- Exact application stack and persistence technology: Claude to research/recommend with ADR.
- Authentication and cloud-sync provider: not finalized.
- Final skill taxonomy and skill IDs: not yet assigned.
- Competency rubric thresholds per discipline: to be defined.
- Retention algorithm and revision intervals: to be designed and tested.
- Graph library and rendering implementation: Claude to choose after mobile/performance evaluation.
- Detailed feature activation criteria: to be specified per module.

| ATH-DEC-014 | Pre-launch period through Dec 9 is for ATHENA creation/preparation, not formal curriculum study | Accepted | Formal learning launch remains Dec 10, 2026 |
| ATH-DEC-015 | Baseline diagnostics are not a gate that blocks all other disciplines | Accepted | Parallel, workload-controlled learning lanes after launch |
| ATH-DEC-016 | Vocal practice, business reading, aesthetics/photography and physical development remain active lanes | Accepted | Prioritized and workload-limited alongside foundations |
| ATH-DEC-017 | ATHENA develops breadth and depth together; foundations do not block all parallel interests | Accepted | Workload-controlled learning lanes and selected focus domains |
| ATH-DEC-018 | Long-term year-by-year roadmap is provisional and evidence-led | Accepted | No guaranteed outcomes, arbitrary mastery dates or fabricated human rankings |
| ATH-DEC-019 | Measure capability by domain-specific evidence, application, transfer and retention | Accepted | No single global human-ranking score |
| ATH-DEC-020 | ATHENA's ambition is an unusually capable multidisciplinary profile, not world-best status in every field | Accepted | Top-1%-style aspiration is not a measured population percentile |
| ATH-DEC-021 | Explicitly connect foundations to school science, technical capability and later learning | Accepted | Academic transfer is a progress dimension |
| ATH-DEC-022 | Include ethical value creation, business economics and responsible scaling as a core outcome | Accepted | Distinguish revenue, profit, cash flow and sustainable growth |

## D-ATH-TRANSFER-001 — ATHENA is independent of school administration
**Status:** Accepted (2026-11-16)

ATHENA is the user's independent multidisciplinary learning and knowledge system. It does not manage school, map the school syllabus, track homework, schedule exams, record grades or act as a school tutor. The user handles school separately. ATHENA should model genuine cross-domain relationships so that knowledge learned through its normal curriculum can naturally help with school and other contexts. Such spillover is a desired benefit, not a guaranteed grade outcome.

## D-ATH-TRANSFER-002 — Transfer is a first-class knowledge relationship
**Status:** Accepted (2026-11-16)

Represent transfer relationships separately from prerequisites and visual layout. Candidate relationship types include `supports`, `applies_to`, `shared_foundation_for`, `enables`, `explains` and `related_to`. Transfer should be evidenced by application in a different context; a graph link alone does not prove transfer.


## Product and platform decisions confirmed for v1.4 (2026-11-17)

| ID | Decision | Status | Notes |
|---|---|---|---|
| ATH-DEC-023 | Personal data is local-first; no mandatory account, cloud database, telemetry or automatic third-party upload in v1 | Accepted | Static app hosting is separate from personal data hosting |
| ATH-DEC-024 | Versioned user-controlled backups should support saving to the phone's SD card | Accepted | Android save/share picker where supported; download-and-move fallback; real-device test required |
| ATH-DEC-025 | Design for future multi-device use now, but defer live sync | Accepted | Stable IDs, device IDs, versions, changesets, export/import and conflict metadata |
| ATH-DEC-026 | Personal health tracking is a dormant optional module | Accepted | Disabled by default; only activates after explicit user action and a threshold/trigger the user defines; health data remains separate |
| ATH-DEC-027 | ATHENA's visual identity is the Cognitive Atlas design direction | Accepted | Detailed visual spec is binding; no generic dashboard or vague “premium” instruction |
| ATH-DEC-028 | The first implementation must be phone-first and independently usable offline | Accepted | No PC-only maintenance or core workflow |
| ATH-DEC-029 | Claude retains technical implementation authority within approved product invariants | Accepted | Preserve existing 14 ADRs; technical changes require documented ADR updates |

### D-ATH-TRANSFER-002 addendum — canonical relationship vocabulary (2026-11-17)

The v0.8 relationship registry is authoritative. It preserves `TRANSFER_TO` and the existing ontology types, and adds `EXPLAINS`, `ENABLES`, and `SHARED_FOUNDATION_FOR`. Codes are stored in uppercase. `gating` is a separate edge field (`none`, `advisory`, `hard`), not a relationship type. Only a `PREREQUISITE_FOR` edge may be hard-gated. `SUPPORTS`, `APPLIES_TO`, `TRANSFER_TO`, `EXPLAINS`, `ENABLES` and `SHARED_FOUNDATION_FOR` never block learning.

## User-owned decisions still open

- Repository owner/access and any irreversible GitHub actions.
- Hosting provider and whether a preview URL may be publicly reachable.
- Any paid account/service or external data processor.
- Final mastery-rule profile and per-discipline/objective overrides.
- Final safety review and supervision policy for HIGH-risk micro-skills.
- Whether micro-skills have a separate mastery designation or use demonstrated/retained states only.
- Whether v1 ships English-only UI while preserving Bangla text/search, or full Bangla UI.
- Exact v1 launch slice if the Dec 10, 2026 learning start arrives before all MVP acceptance gates pass.
- Actual Android browser version and real-device performance results.


For implementation-stage approvals, use `03_CLAUDE_HANDOFF/USER_DECISION_CONFIRMATION_MATRIX_v1.0.md`; accepted product decisions must not be reopened as questions.


## D-ATHENA-CURR-001 — Breadth-first baseline, then six-discipline deep waves (2026-11-17)
**Decision:** Establish a coherent foundational-to-functional baseline across all 18 disciplines before deeply completing disciplines in three waves of six.
**Wave 1:** MATH, ENG, ELEC, RES, LANG, COMM.
**Wave 2:** BIZ, FIN, WORK, CYBER, PSY, LEAD.
**Wave 3:** BODY, ATH, PERF, AEST, ART, INDEP.
**Rationale:** Avoid leaving most of the knowledge universe as empty taxonomy while a small subset is overdeveloped; preserve cross-domain foundations and a clear deep-authoring sequence.
**Constraints:** Baseline modules remain draft until reviewed; suggested sequence is not automatically a hard prerequisite; v1.0 completion must be reported by coverage/validation dimensions rather than an arbitrary percentage.


## D-ATH-PROJECT-CLASS-001 — Exactly three distinct project classes (2026-11-19)
**Status:** Accepted — user-directed architecture

ATHENA project records must classify projects into exactly three distinct classes:
1. `personal_use` — solves a real problem in the learner's own life or context.
2. `product_business_foundation` — builds something useful with a credible possible path to later improvement, packaging and potential sale; sale/revenue is not required.
3. `intrinsic_exploration` — exploration or creation for its own sake; utility, audience and commercial potential are not required.

The classes must not be collapsed into a generic integrated-project template. Teamwork, research, design, presentation and software are methods/formats, not additional classes. Project completion does not automatically establish module competence, transfer, retention or mastery.
