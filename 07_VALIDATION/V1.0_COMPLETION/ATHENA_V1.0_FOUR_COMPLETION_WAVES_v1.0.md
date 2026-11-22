# ATHENA v1.0 — Four Completion Waves v1.0

**Purpose:** replace the completed 14-wave draft-authoring sequence with a four-wave completion programme. The target is a genuinely usable, internally coherent and evidence-qualified ATHENA v1.0—not another set of plans.

**Baseline:** standalone Knowledge Base v3.26 / Master Vault v6.2. This plan is based on the actual archive contents and the embedded gap registers. It corrects the previous progress report where artifact presence was incorrectly treated as full instructional completion.

## Completion rule

Every work item moves through separate states: `not_started` → `authored` → `internally_checked` → `independent_review_pending` → `externally_reviewed` → `app_integrated` (where applicable) → `runtime_tested` (where applicable) → `release_accepted`. A file existing, parsing or passing a structural check does not imply the later states. External review and real-app/device tests cannot be self-certified by authoring.

## Wave 1 — Knowledge Core, Ontology and Curriculum Completion

**Objective:** turn the 18-discipline / 216-module map and skill ontology into a defensible, teachable knowledge base.

### Workstreams
1. **216-module instructional remediation.** Re-audit every module against the strict lesson standard. Deepen the 170 Wave 06 packs; re-audit all 119 Wave 06B deepened packs for repeated generic content; rewrite the remaining 51 packs that were not deepened; verify the 46 historically matched packs against the same standard. Replace generic baseline metadata where it remains. Preserve stable IDs and maintain separate draft/review/approval states.
2. **Canonical domain map.** Reconcile the 146 working-domain rows against the 113-domain canonical seed. The v0.4 crosswalk covers all 113 canonical domains but none of its mappings are approved. Produce explicit exact/partial/composite/split/merge/extension decisions with rationale, owner decision fields and migration/alias rules.
3. **Skill-family completion.** Expand the 741 family candidates: 59 have substantive specifications, while 682 remain title-level candidates. Do not promote candidates solely by title. Define scope, observable outcomes, boundary cases, assessment evidence, adjacent-family distinctions and source basis.
4. **Micro-skill disposition.** Reconcile all 155 candidate protocols with canonical skills/families. The 130 new-entry proposals remain unapproved; the 21 risk-sensitive candidates retain a qualified-review flag. Record promote/merge/split/reject/defer decisions without silently changing IDs.
5. **Typed knowledge graph.** Validate objective→lesson→family→micro-skill→assessment→resource→project links; justify hard prerequisites; detect cycles, orphan nodes and semantically duplicate records.

### Wave 1 exit criteria
- 216/216 modules have genuinely module-specific lessons meeting the authoring standard: bounded scope, entry assumptions, learner explanation, at least two reasoned worked examples, guided practice with answers, independent practice with answer guidance, misconceptions with corrective feedback, assessment criteria, changed-context transfer, retention plan, sources and safety boundaries.
- No repeated generic transfer, retrieval, misconception or safety text is counted as module-specific evidence.
- All 146 domain candidates and 741 family candidates have explicit dispositions; unresolved semantic choices are clearly marked for owner review, not silently approved.
- All 155 micro-skills have traceable dispositions and no broken references.
- Graph validation reports exact counts for unresolved IDs, duplicate candidates, orphan nodes and prerequisite cycles.

## Wave 2 — Learning, Assessment, Evidence, Resources and Projects

**Objective:** make the learning system capable of teaching, assessing, retaining and transferring capability, with useful projects and trustworthy resources.

### Workstreams
1. Re-audit all 216 mastery profiles, 216 assessment instruments, 216 learning-adaptation profiles, 18 strategy cards and 18 discipline profiles against the actual lesson objectives. Rewrite generic or misaligned criteria, examples, transfer probes, delayed checks and feedback.
2. Build discipline-appropriate assessment item banks and scoring guidance; distinguish recall, explanation, problem solving, practical performance, diagnosis and transfer. Maintain synthetic examples as synthetic.
3. Build capability-specific retention/relearning policies. Avoid one universal spacing interval; define evidence-triggered review selection and user override.
4. Verify the 59 resource records and 216 crosswalk rows at claim/lesson level: source identity, exact locator, claim supported, directness, access, licensing/usage, jurisdiction, age suitability, recheck date and fallback. Add sources where gaps remain.
5. Reconcile the legacy project lists and 18 Wave 09 blueprints by stable unique IDs before counting. Expand only where a demonstrated coverage gap exists, across exactly three classes: personal-use, product/business-foundation, and intrinsic/for-its-own-sake. Preserve class boundaries.
6. Create complete project pathways with module objectives, assessment links, milestones, evidence, rubrics, low-resource options, safety and transfer boundaries.

### Wave 2 exit criteria
- Every mastery/assessment/adaptation artifact resolves to the canonical module and measures the same stated capability.
- All rubric anchors are discriminable and usable; empirical reliability remains explicitly unclaimed until double-rating data exist.
- Resource claims have traceable evidence and rights/jurisdiction notes; unsupported claims are removed or labelled.
- Project catalogue has a deduplicated count, traceable class, coverage map and justified expansion; all project IDs resolve.

## Wave 3 — Life & Schedule Engine, Safety, Privacy, Accessibility and Bangladesh Fit

**Objective:** create the missing personal operating system and make the knowledge/app contracts safe and usable in the intended context.

### Workstreams
1. Upgrade the Life & Schedule Engine from v0.1 proposal to a complete implementable subsystem: canonical records, recurrence/exceptions, natural-language capture preview, tentative/confirmed status, activity/travel/preparation separation, conflict detection, priority policy, proposal/approval diffs, undo/history, append-only actuals, estimate learning, notifications, offline storage, sync outbox and conflict resolution.
2. Produce deterministic reference logic and acceptance tests for parsing, recurrence expansion, conflict detection and schedule proposals. The football example is a mandatory fixture: tomorrow 08:00, activity 180 minutes, round-trip travel 30 minutes, tentative; do not auto-confirm or overwrite routines.
3. Complete safety/privacy work: risk-specific controls, escalation and incident pathways, data minimisation, retention/deletion, export/backup, permissions, child-safeguarding review and Bangladesh legal review.
4. Validate accessibility: TalkBack, font scaling, contrast, touch targets, keyboard/focus, reflow, mixed Bangla-English scripts, low-bandwidth and offline use. Convert the 40 checklist items into executed evidence only when tested.
5. Human-review the 72-term Bangla-English glossary and Bangladesh regional adaptations; check local currency, institutions, emergency guidance and regulatory references for current accuracy.

### Wave 3 exit criteria
- Schedule engine reference implementation passes deterministic unit and scenario tests; no silent schedule mutation; all proposals require explicit acceptance where specified.
- Offline-first requirements are demonstrated in the implementation or clearly handed off with executable contracts and test fixtures.
- Safety-critical and minor-data requirements have qualified review records; unresolved risks remain visible and release-blocking.
- Accessibility and localization results include device/assistive-technology evidence, not just a checklist.

## Wave 4 — App Integration, Runtime Verification and v1.0 Release

**Objective:** prove the actual application can consume, use, preserve and recover the ATHENA system, then make a defensible release decision.

### Workstreams
1. Unify the 32-schema inventory: canonical versions, required/optional fields, migrations, compatibility rules, ID policy and deprecation aliases. Generate fixtures from the authoritative records.
2. Implement importer preview, validation, atomic commit, rollback, audit history, idempotency, export, backup/restore and round-trip verification. Execute all 40 importer cases in the actual app; add missing recovery and offline-conflict cases.
3. Integrate curriculum, evidence, projects, learning review, schedule engine, accessibility/localization and safety controls in the app. Verify no subsystem is only a document.
4. Execute CI/build, browser, Android-device, offline, performance, accessibility, data-integrity and recovery tests. Preserve logs and reproducible test commands.
5. Conduct qualified expert review, consented learner pilot and independent double-rater calibration. Revise the system based on findings and re-test.
6. Freeze KB and Vault, verify exact embedded mirrors and checksums, publish change log/release notes, close P0/P1 gates and record an explicit release-owner decision.

### Wave 4 exit criteria
- Actual app passes importer, backup/restore, round-trip, offline and conflict tests on target devices.
- All critical safety/privacy issues are closed or explicitly block release.
- Learner and reviewer findings are recorded, addressed and retested; no invented approval or empirical claims.
- Final release package is immutable, reproducible, checksummed and internally consistent.
- Release decision is `READY` only if every mandatory gate is closed; otherwise publish a precise `NOT READY` decision and remaining blockers.

## Cross-wave priorities

- P0: safety-critical correctness, privacy/child safeguarding, canonical ID integrity, atomic import/rollback, backup/restore, offline conflict integrity.
- P1: 216 lesson quality, assessment validity, source provenance, accessibility and Bangla accuracy.
- P2: project catalogue breadth, advanced progression, operational polish.

## Current start point

Wave 1 begins with the corrected 216-module quality triage. The previous claim of 216/216 full teaching-pack coverage is withdrawn: 216 pack artifacts exist, but the historical strict ledger records 46/216 matched; 119 of the 170 later packs were deepened after that ledger and have not been re-certified; 51 of the 170 were not in the deepened subset. The new triage ledger tracks all 216 individually.
