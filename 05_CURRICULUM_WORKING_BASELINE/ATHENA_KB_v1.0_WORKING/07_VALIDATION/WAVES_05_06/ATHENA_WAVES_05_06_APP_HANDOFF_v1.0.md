# ATHENA Waves 05–06 App/Content Handoff v1.0

## Source baseline
- KB v3.20, Master Vault v5.6.
- Breadth-first baseline: 216 modules, 12 per 18 disciplines.
- Strict prior teaching-pack ledger: 46 matched, 170 unmatched.

## Wave 05 — resource provenance
- Preserved all 52 prior resource records and added seven Bangladesh-context resources.
- Corrected the declared count discrepancy: prior register said 30 while containing 52; new register contains 59.
- Added 216 module-level audited crosswalk rows. All links remain candidate relevance links.
- Each resource has a per-record inspection state, scope, limitation, reuse note and disposition.
- No full-text review, legal review, claim-by-claim corroboration or expert approval is claimed.

## Wave 06 — teaching packs
- Authored exact-ID packs for all 170 previously unmatched modules across 17 non-MATH disciplines (10 per discipline).
- Each pack includes learner explanation, worked example, guided and independent practice, answer guidance, misconception feedback, assessment/rubric, retrieval, transfer, safety/scope, accessibility and candidate resource IDs.
- Previous 46 matched packs are retained; new strict draft coverage ledger reports 216/216 authored pack matches.
- Coverage is structural/authored coverage only, not approval, learner validation or proof of instructional efficacy.

## App integration recommendations
1. Import the new teaching pack JSON as a versioned additive content batch; do not overwrite existing `BASE-*` records.
2. Preserve each exact `BASE-*` ID as the primary key.
3. Treat `candidate_resource_ids` as references requiring resource lookup; keep the full source metadata in the resource register.
4. Display draft/review status; never translate authored coverage into mastery.
5. Support source limitations, jurisdiction flags, access notes and safety boundaries in the UI.
6. For ELEC/CYBER/ATH/BODY/PERF/INDEP/FIN, enforce the stated safety and scope boundaries in learner-facing presentation.
7. Run schema, duplicate-ID, missing-reference, rollback and offline tests in the actual app before claiming import compatibility.

## Deferred by design
- Expert review and learner validation.
- Double-rater assessment calibration and reliability statistics.
- Legal/license review and current local regulatory sign-off.
- App importer execution and device testing.
