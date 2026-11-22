# Wave 1 — Baseline Quality Triage v1.0

## Finding that changes the project status

The v3.26 archive contains 216 baseline module records and teaching-pack artifacts, but its own strict coverage ledger records only **46/216** as matched full teaching-pack drafts at the time of that ledger. A later Wave 06B artifact deepened 119 of the 170 Wave 06 packs. Those 119 must be re-audited against the strict completion standard; their existence is not automatic certification. The remaining **51** Wave 06 packs were not in the deepened subset and need priority deepening.

Therefore the honest current state is: 216 pack artifacts exist; 46 were historically strict-matched; 119 later deepened but not re-certified; 51 not deepened; 0 expert-approved; 0 learner-validated. Do not report 216/216 complete.

## Automated content-specificity signals

### Wave 06 170-pack batch

| Field | Unique values | Records | Median characters | Interpretation |
|---|---:|---:|---:|---|
| `learner_explanation` | 170 | 170 | 730.0 | Potentially differentiated; still needs semantic review |
| `worked_example` | 170 | 170 | 1134.5 | Potentially differentiated; still needs semantic review |
| `guided_practice` | 170 | 170 | 979.5 | Potentially differentiated; still needs semantic review |
| `independent_practice` | 67 | 170 | 645.0 | Repeated/template risk; rewrite or justify |
| `answer_guidance` | 170 | 170 | 751.0 | Potentially differentiated; still needs semantic review |
| `misconceptions_and_feedback` | 30 | 170 | 673.5 | Repeated/template risk; rewrite or justify |
| `assessment_rubric` | 170 | 170 | 1490.0 | Potentially differentiated; still needs semantic review |
| `transfer_task` | 15 | 170 | 299.0 | Repeated/template risk; rewrite or justify |
| `scope_and_safety_boundary` | 17 | 170 | 192.0 | Repeated/template risk; rewrite or justify |
| `retrieval_and_maintenance` | 2 | 170 | 310.0 | Repeated/template risk; rewrite or justify |

### Wave 06B 119-pack deepened subset

| Field | Unique values | Records | Median characters | Interpretation |
|---|---:|---:|---:|---|
| `learner_explanation` | 119 | 119 | 720 | Potentially differentiated; still needs semantic review |
| `worked_example` | 119 | 119 | 1178 | Potentially differentiated; still needs semantic review |
| `guided_practice` | 119 | 119 | 1003 | Potentially differentiated; still needs semantic review |
| `independent_practice` | 16 | 119 | 663 | Repeated/template risk; rewrite or justify |
| `answer_guidance` | 119 | 119 | 761 | Potentially differentiated; still needs semantic review |
| `misconceptions_and_feedback` | 16 | 119 | 685 | Repeated/template risk; rewrite or justify |
| `assessment_rubric` | 119 | 119 | 1488 | Potentially differentiated; still needs semantic review |
| `transfer_task` | 1 | 119 | 299 | Repeated/template risk; rewrite or justify |
| `scope_and_safety_boundary` | 16 | 119 | 192 | Repeated/template risk; rewrite or justify |
| `retrieval_and_maintenance` | 1 | 119 | 310 | Repeated/template risk; rewrite or justify |

The automated scan finds especially serious repetition in the 170-pack set: only 67 unique independent-practice fields, 30 unique misconception/feedback fields, 15 unique transfer tasks, 17 unique safety-boundary fields and only 2 unique retrieval/maintenance fields. In the 119-pack deepened set, there is only 1 unique transfer task and 1 unique retrieval/maintenance field, and only 16 unique independent-practice, misconception and safety-boundary fields. This does not prove every repeated field is wrong, but it proves the fields cannot be counted as individually authored without a module-specific semantic review.

## Baseline metadata scan

All 216 module IDs, titles, learning objectives, core models and assessment tasks are unique. However, 212/216 retain the same generic provenance string and draft status. `assessment_modes` has 18 unique values (one per discipline), `retention_profile` has 24 unique values and `safety_review` has 18 unique values; these are discipline-level patterns, not necessarily module-level decisions. The quality overlay must be checked against each module rather than accepted because a field is non-empty.

## Ontology state from current archive

- Domain crosswalk: 146 working-domain rows; all 113 canonical domains have candidate coverage; no mappings approved.
- Skill-family inventory: 741 working candidates against 40 canonical seed families; 59 candidate specifications exist and 682 remain title-level. Candidate expansion records are not canonical approval.
- Micro-skills: 155 candidate protocols have structural drafts; 130 candidate-specific new-entry proposals remain unapproved; 21 risk-sensitive candidates require qualified review.

## Wave 1 execution order

1. Deepen the 51 non-deepened Wave 06 packs first, prioritising high-risk foundations and cross-discipline prerequisites.
2. Re-audit the 119 Wave 06B packs, replacing repeated transfer, retention, misconception, practice and safety content with capability-specific work.
3. Recheck the 46 historically matched packs against the same standard.
4. Repair baseline metadata and publish one canonical lesson-completion ledger.
5. Complete domain/family/micro-skill disposition with explicit owner decision fields.

## Limits

This is a reproducible structural/content-specificity triage, not a subject-matter correctness review. It does not certify any lesson, ontology mapping, safety content or learner outcome.
