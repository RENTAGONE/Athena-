# ATHENA Long-Horizon Research & Production Roadmap v1.0

**Date:** 2026-11-19  
**Baseline:** user-supplied KB v3.18 / Master Vault v5.4  
**Operating rule:** continue in evidence-backed waves; do not stop at a message count or declare completion because files were generated.

## Production sequence and concrete deliverables

### Wave 01 — Original 70 micro-skills
**Current result:** research/refinement dossier, machine-readable matrix and 29-source register produced for MS-01-001 through MS-07-010. All 70 existing protocol sections were found. All remain DRAFT.

**Still required:** subject review, learner usability trials, calibration of task-specific criteria, and safety review where flagged.

### Wave 02 — Expanded 85 micro-skill candidates
**Scope:** MS-08 through MS-15 (the 155-candidate catalogue minus the original 70).

Research each candidate for:
- Actual task boundary and whether it belongs as a micro-skill or a full subskill/module.
- Direct evidence vs adjacent evidence vs expert convention.
- Prerequisites and dependencies; no invented hard prerequisites.
- Safe materials, setting, age/accessibility adaptations and stop conditions.
- Acquisition protocol, progression, common errors and feedback design.
- Observable performance criteria, retention and transfer checks.
- Appropriate authoritative resources, provenance and claim-level relevance.

**Deliverables:** 85 research cards; source register; duplicate/overlap report; risk-review queue; machine-readable matrix; validation report.

### Wave 03 — Full 155-candidate ontology reconciliation
Audit all candidate IDs against the canonical discipline/domain/skill-family graph. Detect:
- Exact and near duplicates.
- Candidate skills that are too broad or too trivial to be micro-skills.
- Missing canonical owners.
- Incorrect or ambiguous discipline links.
- SUPPORTS vs APPLIES_TO vs prerequisite confusion.
- Candidate-to-family mappings that imply false equivalence.

**Deliverables:** 155-row reconciliation crosswalk; duplicate/split/merge recommendations; orphan report; evidence notes; proposed graph changes as proposals only. No canonical approval without semantic owner review.

### Wave 04 — Micro-skill protocol and retention engineering
Upgrade the accepted 155 protocols into consistent structured records. Reconcile the 156 existing retention integrations against actual task demands and evidence. Build:
- Acquisition / retention / transfer distinction.
- Task-specific maintenance triggers.
- Performance-decay and relevance triggers.
- Safe practice-dose boundaries.
- Evidence capture and reassessment rules.
- Explicit no-schedule rules for high-risk or provider-guided skills.

**Deliverables:** structured protocol revisions, retention crosswalk, protocol-quality audit, scheduling policy addendum and regression tests.

### Wave 05 — 216-module resource provenance audit
For every baseline module, verify the resource itself and its relationship to the exact learning outcome. Capture:
- Title, creator, publisher, URL, resource type and version/date.
- Source class: primary, secondary, tertiary, instructional, tool or dataset.
- Audience, level, language, access/cost and regional availability.
- Direct teaching vs related reference vs background context.
- What claim or learning outcome it supports.
- Access/verification date, limitations, copyright and safety flags.

**Deliverables:** audited resource register, 216-module crosswalk, broken/weak-link queue, coverage by discipline and provenance validation. A URL existing is not enough to count as a good resource.

### Wave 06 — Complete the 170 missing full teaching packs
The latest strict ledger reports 46/216 matched full packs and 170 unmatched. A pack counts only when it includes the exact module ID and learner-facing explanation, worked example, progressive practice, answer guidance, assessment/evidence criteria and scope/safety boundary.

Produce breadth-first across all 18 disciplines, not a deep pile for only one discipline. Each pack should also include:
- Learning outcomes and prerequisites.
- Accurate explanations with definitions and conceptual links.
- Multiple worked examples, including edge cases.
- Guided then independent practice.
- Answers with reasoning, not only final results.
- Common misconceptions and diagnostic prompts.
- Retrieval and spaced review prompts.
- Transfer task and assessment rubric.
- Accessibility/language notes and safety boundaries.
- Source citations tied to specific claims.

**Deliverables:** complete pack batches, strict coverage ledger updates, source-to-claim maps and independent content QA queue.

### Wave 07 — Curriculum coherence and mastery model
Audit the full 18-discipline map and 216 baseline modules for:
- Missing foundations and unjustified prerequisites.
- Duplicate coverage and gaps between neighbouring modules.
- Conceptual sequence and alternative entry paths.
- Mastery criteria that actually match the outcome.
- Progression from declarative knowledge to procedural fluency and transfer.
- Interdisciplinary bridges without false equivalence.

**Deliverables:** prerequisite graph proposals, progression maps, mastery-level definitions, gap/overlap register and representative learner pathways.

### Wave 08 — Assessment validity and calibration
Design and test assessment instruments rather than merely writing rubrics. Include:
- Construct/outcome alignment.
- Clear scoring anchors and examples at each level.
- Double-rater calibration samples.
- Inter-rater disagreement logs.
- Formative feedback and retry rules.
- Transfer and delayed-retention measures.
- Accessibility and bias checks.

**Deliverables:** assessment bank, rubric library, calibration pack, reliability report and learner-pilot instruments. No reliability claim until raters actually score common samples.

### Wave 09 — Integrated projects and portfolio evidence
Review all existing integrated projects and expand only where they expose meaningful cross-domain application. Each project should specify:
- Realistic brief, audience and constraints.
- Required concepts and skills.
- Milestones and deliverables.
- Safety, privacy, ethics and permissions.
- Evidence of individual contribution.
- Quality rubric and reflection.
- Transfer/iteration opportunity.

**Deliverables:** project-to-skill traceability, project briefs, milestone rubrics and portfolio evidence model.

### Wave 10 — Learning science, metacognition and adaptation
Build a careful adaptive-learning layer around evidence-supported mechanisms:
- Retrieval, spacing, interleaving, worked examples and elaboration.
- Cognitive-load-aware sequencing and prior-knowledge checks.
- Confidence calibration and error diagnosis.
- Motivation, autonomy and sustainable practice load.
- Forgetting/relearning signals based on actual performance.
- Avoiding false precision in learner models.

**Deliverables:** learning-strategy policy, scheduling heuristics with caveats, learner-state definitions and evaluation plan.

### Wave 11 — Safety, ethics, privacy and safeguarding
Create a central review framework for health, physical performance, first aid, electrical/workshop skills, cybersecurity, finance, interpersonal topics and field activities. Include:
- Risk classification and prohibited unsupervised activities.
- Age-appropriate supervision and escalation rules.
- Qualified-review requirements.
- Local-law and Bangladesh-context verification where relevant.
- Privacy/data minimisation for learner evidence.
- Consent and image/audio recording controls.
- Clear separation of educational literacy from professional competence.

**Deliverables:** safety matrix, review queue, safeguarding notes, privacy policy mappings and emergency-resource verification schedule.

### Wave 12 — Accessibility, language and regional adaptation
Test and improve:
- Plain-language explanations without loss of technical accuracy.
- Bangla/English terminology and glossary mapping.
- Low-bandwidth/offline alternatives.
- Mobile-first reading and interaction constraints.
- Disability accommodations and multiple evidence modes.
- Regional examples, units, laws and public services.

**Deliverables:** localization glossary, accessibility review checklist, low-bandwidth resource alternatives and regional-content audit.

### Wave 13 — App exchange and operational compatibility
Coordinate with the application engineer (user + Gemini). Verify the actual importer and user-facing lifecycle:
- Schema validation and version compatibility.
- Preview/diff before import.
- Explicit user approval.
- Atomic commit and rollback.
- Backup/restore and corruption handling.
- Offline behaviour and conflict resolution.
- Provenance retention and stable ID integrity.

**Deliverables:** fixture packs, import acceptance tests, rollback tests, backup/restore tests and compatibility report. No claim of success until run in the actual app.

### Wave 14 — Independent validation and release gates
Prepare real external review, then wait for evidence:
- Subject-matter expert review.
- Qualified safety sign-off.
- Learner pilot with consent and age-appropriate safeguards.
- Double-rater assessment calibration.
- Accessibility/device testing.
- App importer and data-integrity tests.
- Broken-link and resource-access sweep.
- Final release gap closure with traceable evidence.

**Deliverables:** reviewer packets, pilot protocol, test results, signed review records where obtained, final gap register and release decision. Never fabricate a reviewer, pilot, certification or test result.

## Priority order

1. Finish research on the 85 expanded micro-skills.
2. Reconcile all 155 candidates against canonical ontology.
3. Audit resources across all 216 modules.
4. Continue full teaching packs until strict coverage is 216/216.
5. Upgrade assessments, retention, projects and curriculum coherence.
6. Complete safety/accessibility/localization and app compatibility.
7. Obtain real independent reviews and learner/app validation.

## Completion definition

A workstream is complete only when its artifact exists, its IDs and references resolve, its evidence and limitations are recorded, its relevant validators pass, and any required external review or real-world test has actually happened. A draft, proposal, outline, URL list or structural parse is never silently promoted to approval or release readiness.
