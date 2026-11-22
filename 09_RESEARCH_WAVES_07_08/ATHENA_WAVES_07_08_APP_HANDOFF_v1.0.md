# ATHENA Waves 07–08 — App / Content Handoff v1.0

**Baseline:** KB v3.22 / Master Vault v5.8  
**New working baseline:** KB v3.23 / Master Vault v5.9

## Wave 07 — curriculum coherence and mastery
- 216 module-specific mastery profiles; exact `BASE-*` IDs preserved.
- 18 progression maps, 12 modules each.
- Existing 216-node / 206-edge advisory sequence graph preserved; zero hard prerequisites added.
- 40 non-gating cross-discipline bridges with explicit relation types.
- 20 gap/overlap/sequence findings and 8 representative pathways.
- Mastery states are evidence descriptions, not a universal numeric score.
- Import as additive proposal data; do not silently promote bridge edges to prerequisite gates.

## Wave 08 — assessment validity and calibration
- 216 module-specific assessment instruments; exact IDs preserved.
- Four criterion-level scoring dimensions per instrument, with 0–3 observable anchors.
- Alternate form, transfer probe, delayed-retention probe, feedback/retry logic and access/fairness checks included.
- 18 synthetic calibration stimuli included; explicitly not learner data.
- No empirical rater scores, no reliability coefficient, no learner pilot and no validity claim.

## Import/display rules
1. Keep the existing baseline module and assessment records intact; import new records as versioned overlays/proposals.
2. Store criterion-level results, task version, conditions, support, evaluator role, accommodations and artifact references.
3. Do not average unlike criteria into a universal learner score.
4. Keep exposure, recall, explanation, guided performance, independent demonstration, transfer and delayed retention distinct.
5. Preserve append-only attempts: retries never overwrite initial evidence.
6. Enforce non-compensatory safety/authorisation boundaries.
7. Let the learner inspect why a recommended path or bridge is suggested; do not block progress based only on sequence.
8. Do not render synthetic calibration samples as actual learner results or evidence of reliability.

## Integration validation required in the app
- Schema/import test, duplicate-ID test, unresolved-reference test, version migration test.
- Preview/diff, explicit approval, atomic commit and rollback.
- Offline access, low-bandwidth rendering and local evidence privacy.
- Confirm criterion-level scoring and append-only retry history.
- These tests have not been run in the actual app.
