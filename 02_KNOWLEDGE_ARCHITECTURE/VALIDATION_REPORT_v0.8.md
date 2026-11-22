# Knowledge Architecture Pack v0.8 — Validation Report
Date: 2026-11-17
Validator: `tools/validate_pack.py`
Result: **PASS for the included draft fixtures**

## Automated results

| Check | Result |
|---|---:|
| JSON files parsed | 50 / 50 |
| JSON Schema Draft 2020-12 documents meta-validated | 25 / 25 |
| Record instances validated against schemas | 432 / 432 |
| Cross-reference / ownership / mapping / governance errors | 0 |
| Duplicate canonical IDs | 0 |
| Restored missing domain IDs | 4 / 4 |
| Skills with proposed primary-domain mapping | 36 / 36 |
| Subskills inheriting parent mapping | 36 / 36 |
| Transfer links with valid endpoints and non-gating state | 31 / 31 |
| Context records | 6 / 6 |
| Micro-skill records marked DRAFT | 20 / 20 |
| HIGH-risk micro-skills with pending safety review | 4 / 4 |
| Domain coverage inventory records | 113 / 113 |

## Record groups validated

- Domain map envelope: 1
- Domains: 113
- Skill families: 40
- Skills: 36
- Subskills: 36
- Contexts: 6
- Transfer links: 31
- Structural relationship exchange records: 3
- Learning objectives: 1
- Learning units: 1
- Assessments: 1
- Micro-skills: 20
- Foundation seed records: 29
- Content coverage envelope: 1
- Content coverage records: 113

Total: **432 record instances**.

## Current content coverage snapshot

- 113 domains are listed exactly once.
- 42 domains contain at least one mapped draft seed record.
- 71 domains currently have taxonomy only.
- No domain is labelled curriculum-complete or approved.
- The counts are inventory counts of current seed assets, not a score for content quality or learning capability.

## Important interpretation

- The four previously missing domain IDs are now first-class draft domain records. The 14 domain records duplicated in the historical foundation seed are intentional source mirrors, not duplicate active canonical objects.
- The skill/subskill mappings are proposed and remain draft. Schema validity is not subject-matter approval.
- The 31 transfer links remain hypotheses; all are non-gating.
- The 20 micro-skills remain DRAFT. Four HIGH-risk records are explicitly blocked pending human safety review.
- No real hard-gated prerequisite edge exists in the current seed set. Hard-gate cycle detection therefore still needs synthetic/property tests in the application test suite.
- The current fixtures do not establish full subject-matter correctness or curriculum completeness.

## Not tested by this report

- No application code was built.
- No dependency installation, production build, CI run, browser E2E test or real Android test was performed.
- No graph-library benchmark or performance measurement was performed.
- No browser IndexedDB durability, PWA update, SD-card picker, encryption, security audit or deployment was verified.
- No full 18-discipline curriculum, complete assessment bank or complete objective catalogue is claimed.

Claude must reproduce the validation in the implementation repository and add unit, property, integration, E2E and real-device tests. Do not upgrade any draft record to approved solely because it passes these checks.
