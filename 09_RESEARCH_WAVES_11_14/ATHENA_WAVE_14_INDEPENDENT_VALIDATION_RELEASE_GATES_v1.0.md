# ATHENA Wave 14 — Independent Validation and Release Gate Pack v1.0

**Status: reviewer briefs and pilot protocol prepared; no external review, learner pilot or release approval is claimed.**

## 1. Purpose

Wave 14 turns the open release gaps into evidence-bearing gates. It does not manufacture approvals. Reviewer briefs identify the expertise needed, scope, exact evidence to return and the release decision each review informs.

## 2. Reviewer packet protocol

The 11 review packets in `ATHENA_WAVE_14_REVIEWER_PACKETS_v1.0.json` cover mathematics/statistics; science/lab safety; electrical/workshop; health/fitness/sport; first aid; cybersecurity/privacy; finance/business; language/localization; accessibility; child safeguarding/privacy; and app import/data integrity.

For each reviewer:
- provide a frozen package hash and the exact record IDs in scope;
- disclose that material is draft and identify intended learner age range;
- ask for severity-ranked findings and a clear approve/revise/reject decision;
- capture reviewer qualifications, date, conflicts of interest and evidence reviewed;
- preserve original feedback and all revisions;
- do not convert “no comments” into approval.

## 3. Learner pilot protocol

`ATHENA_WAVE_14_LEARNER_PILOT_PROTOCOL_v1.0.json` is a protocol only. It requires age-appropriate consent/assent, a safeguarding lead, synthetic or minimal data, a stop option and no public recording by default. Tasks cover discovery, a learning attempt, bilingual glossary, airplane-mode operation, interruption recovery, adaptive suggestion correction, export/delete and assistive technology.

The pilot is not a test of the learner. It is a test of whether the product and content work. A small convenience sample can reveal defects but cannot establish population-wide efficacy.

## 4. Double-rater calibration

For each assessment instrument selected for review:
1. Two raters independently score the same anonymised evidence using the same rubric version.
2. Preserve both original scores before discussion.
3. Calculate criterion-level exact agreement and an appropriate chance-corrected statistic only when sample size and design justify it.
4. Inspect disagreement by criterion and anchor; revise ambiguous descriptors.
5. Re-score a fresh shared sample after revision.
6. Report sample size, missingness, rater training and limitations. Do not report reliability from synthetic examples as empirical reliability.

## 5. Release gates

The 11 `GATE-*` entries are blocking evidence requirements. Critical/high safety or privacy defects, P0 accessibility barriers, importer data loss, broken rollback, or unresolved legal/safeguarding questions block release. Release requires a signed decision by the named release owner after evidence review.

## 6. Current release disposition

**BLOCKED — NOT RELEASE READY.** This is the correct disposition until external and app-execution gates close. Internal authoring, JSON parsing, schema checks or archive integrity cannot substitute for qualified sign-off, learner evidence, accessibility testing or actual app integration.
