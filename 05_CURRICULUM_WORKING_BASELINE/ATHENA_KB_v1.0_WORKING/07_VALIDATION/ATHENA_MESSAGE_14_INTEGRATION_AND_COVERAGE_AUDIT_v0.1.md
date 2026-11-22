# ATHENA Message 14 — Cross-Discipline Integration & Coverage Audit

**Version:** 0.1 working draft  
**Status:** Authored and internally checked for structure; semantic review, source checking, expert review and learner validation remain open.

## 1. Purpose and decision

This batch does not claim the 18-discipline curriculum is complete. It converts existing cross-domain ideas into an explicit transfer model, adds a practical project portfolio and establishes a conservative coverage ledger. The key distinction is between a discipline being represented and a discipline being adequately taught, assessed, practised and validated.

## 2. Evidence inventory at Message 14

| Inventory | Current count | What the count does—and does not—show |
|---|---:|---|
| Baseline modules | 216 | 12 per discipline; draft coverage, not reviewed curriculum completeness |
| Unique assignment-registry units | 54 | Deduplicated by stable unit identifier across assignment snapshots; draft units |
| Existing assessment-bank items | 168 | Items exist in five JSON banks; item count is not calibrated assessment coverage |
| Existing integrated project specs | 24 | Draft specifications across two earlier project banks |
| New Message 14 projects | 9 | Detailed draft briefs; not yet piloted |
| New transfer hypotheses | 44 | Proposed cross-discipline relations; not canonical prerequisites |

The assignment-registry count is intentionally deduplicated by unit ID. It is not a count of every teaching-pack chapter or all instructional content. Assessment-bank items are counted from the five current JSON banks; this does not prove every unit or macro-domain is assessed.

## 3. Transfer architecture

The new transfer map contains 18 discipline nodes and 44 directed transfer hypotheses. Each link states (a) a plausible reusable capability, (b) the target context and (c) a non-equivalence boundary. These are draft hypotheses requiring discipline review. They do not create hard prerequisites, award skill credit or imply automatic mastery transfer.

### Transfer evidence contract

A valid transfer demonstration must include:

1. **Source capability:** identify the capability previously learned and the evidence that supports it.
2. **Changed context:** state what is different in the target domain—terms, constraints, tools, assumptions or risks.
3. **Target performance:** produce a target-domain artefact or observable performance.
4. **Boundary analysis:** identify what did not transfer and what new domain knowledge was required.
5. **Independent explanation:** explain the reasoning without relying on a generated answer as proof.
6. **Review:** assessor checks accuracy, context fit, safety and provenance; any status update remains proposed until owner approval.

### Non-equivalence rules

- No mastery inheritance between disciplines.
- A SUPPORTS_TRANSFER relation is not a hard prerequisite.
- Similar vocabulary does not prove equivalent concepts.
- A polished artefact is not evidence of every skill used to create it.
- AI-generated explanation is not learner evidence.
- Safety-sensitive transfer remains bounded by supervision and qualification requirements.

## 4. Integrated project portfolio

Nine project briefs were authored. Across the nine, every one of the 18 disciplines appears at least once. Each project includes a challenge, deliverables, staged execution, acceptance criteria, a four-dimension rubric, safety/ethics constraints and a transfer test. Projects are deliberately designed to generate evidence rather than decorate a portfolio.

| Project | Primary disciplines | Evidence focus |
|---|---|---|
| ATH-IP-M14-001 — Build a small digital product with evidence of real usefulness | ENG, BIZ, FIN, MATH, RES, COMM, AEST, CYBER, WORK, LEAD | problem and user evidence brief, working low-risk prototype |
| ATH-IP-M14-002 — Low-voltage sensor investigation and engineering notebook | ELEC, MATH, ENG, RES, WORK, COMM, AEST | question and hypothesis, annotated circuit diagram |
| ATH-IP-M14-003 — Research a claim and publish a bilingual evidence explainer | RES, MATH, LANG, COMM, AEST, PSY, LEAD | research question and search log, source-quality matrix |
| ATH-IP-M14-004 — Football performance: observe, analyse, practise, reassess | ATH, BODY, MATH, PSY, RES, COMM, WORK | one clearly defined performance question, baseline observation sheet |
| ATH-IP-M14-005 — Create an accessible visual story with recorded narration | ART, AEST, PERF, COMM, LANG, PSY, WORK | audience and intent statement, thumbnail storyboard |
| ATH-IP-M14-006 — Household systems and hazard-aware independence audit | INDEP, WORK, MATH, BODY, COMM, CYBER, LEAD | current-state process map, risk and escalation checklist |
| ATH-IP-M14-007 — Ethical micro-venture experiment with a real stop rule | BIZ, FIN, MATH, RES, COMM, PSY, WORK, LEAD | offer and target-user statement, consent-based discovery notes |
| ATH-IP-M14-008 — Personal knowledge system with evidence and delayed recall | WORK, ENG, RES, PSY, LANG, AEST, COMM | simple data model and stable IDs, source/provenance records |
| ATH-IP-M14-009 — Team challenge: plan, build, communicate and review | LEAD, COMM, BIZ, ENG, ART, ATH, PERF, INDEP, CYBER | shared brief and success criteria, role/decision log |

## 5. Eighteen-discipline coverage ledger

The companion JSON records each discipline separately. Current evidence supports macro mapping and 12 baseline draft modules per discipline. Assignment-registry deepening varies. The assessment bank inventory is not reliably attributable to all 18 disciplines from the current source records, so the matrix does not pretend otherwise.

| Discipline | Baseline modules | Deepening units in registries | Project portfolio | Review/validation |
|---|---:|---:|---|---|
| ENG — Engineering & Computer Science | 12 | 2 | Present | Expert: no evidence; learner: no evidence |
| BIZ — Business & Entrepreneurship | 12 | 3 | Present | Expert: no evidence; learner: no evidence |
| ELEC — Electronics & Hardware | 12 | 2 | Present | Expert: no evidence; learner: no evidence |
| FIN — Finance & Economics | 12 | 3 | Present | Expert: no evidence; learner: no evidence |
| BODY — Body Science & Anatomy | 12 | 4 | Present | Expert: no evidence; learner: no evidence |
| PSY — Psychology & Strategy | 12 | 3 | Present | Expert: no evidence; learner: no evidence |
| AEST — Aesthetics & Visual Design | 12 | 4 | Present | Expert: no evidence; learner: no evidence |
| WORK — Workflow & Productivity | 12 | 3 | Present | Expert: no evidence; learner: no evidence |
| ART — Artistic Development | 12 | 4 | Present | Expert: no evidence; learner: no evidence |
| ATH — Athletics & Physical Performance | 12 | 4 | Present | Expert: no evidence; learner: no evidence |
| PERF — Vocal & Performance Arts | 12 | 4 | Present | Expert: no evidence; learner: no evidence |
| MATH — Mathematics & Scientific Reasoning | 12 | 2 | Present | Expert: no evidence; learner: no evidence |
| CYBER — Cybersecurity & Digital Infrastructure | 12 | 3 | Present | Expert: no evidence; learner: no evidence |
| LANG — Language & Linguistic Intelligence | 12 | 2 | Present | Expert: no evidence; learner: no evidence |
| RES — Research & Information Intelligence | 12 | 2 | Present | Expert: no evidence; learner: no evidence |
| INDEP — Practical Independence | 12 | 4 | Present | Expert: no evidence; learner: no evidence |
| LEAD — Leadership & Management | 12 | 3 | Present | Expert: no evidence; learner: no evidence |
| COMM — Communication & Rhetoric | 12 | 2 | Present | Expert: no evidence; learner: no evidence |

### Status interpretation

- `MAPPED`: a scope node exists in the macro map.
- `INSTRUCTIONAL_DRAFT`: content has been authored; no claim of completeness.
- `ASSESSED`: assessment items are mapped to objectives and have defensible scoring criteria.
- `PRACTICAL_EVIDENCE`: a learner has performed a relevant task and evidence has been reviewed.
- `SOURCE_CHECKED`: material claims and resources have been independently verified.
- `EXPERT_REVIEWED`: qualified subject review is documented.
- `LEARNER_VALIDATED`: representative learner use has been observed and revisions recorded.
- `APPROVED`: owner-approved, versioned release state.

Message 14 does not promote any discipline to SOURCE_CHECKED, EXPERT_REVIEWED, LEARNER_VALIDATED or APPROVED. Even `ASSESSED` remains partial at package level until mapping and calibration are complete.

## 6. Coverage gaps exposed by this audit

1. **Deepening imbalance:** the six Wave 3 disciplines have four unique assignment-registry units each, Wave 2 disciplines have three each, while Wave 1 representation is lower in this deduplicated registry view. Existing Math-focused and teaching-pack materials are not fully represented by the assignment registry; the registry itself needs a canonical inventory.
2. **Assessment traceability:** existing item banks need objective/unit mapping, item-quality review, scoring anchors, and evidence of calibration.
3. **Resource provenance:** no comprehensive verified resource corpus is linked to every active pathway.
4. **Practice evidence:** project briefs are opportunities only; no learner execution is claimed.
5. **Transfer semantics:** the 44 links are hypotheses, not approved semantic edges.
6. **Subject review:** no external expert review is claimed for the 18 disciplines.
7. **Scope depth:** 12 baseline modules per discipline are a starter map, not evidence that all macro-subdomains have sufficient instruction.

## 7. Recommended work remaining

- Message 15: assessment traceability, rubric anchors, and evidence contracts across all 18 disciplines.
- Message 16: resource provenance and source verification strategy; populate only sources actually checked, with dates and limitations.
- Messages 17–18: semantic, instructional, safety, accessibility and whole-package audits; revise weak content rather than merely report defects.
- Message 19: schema inventory, migration/alias rules, importer conformance fixtures and data integrity checks.
- Message 20: release candidate packaging and go/no-go review.
- Any P0/P1 gap still open after Message 20 becomes additional production work.

## 8. Release decision

**No v1.0 release decision is made by Message 14.** The ontology reconciliation, canonical prerequisite graph, expert review, learner pilot, comprehensive source verification and actual app importer testing remain unresolved in the existing release-gap register. The next valid claim is “Message 14 integration and coverage artefacts authored and internally checked,” not “curriculum complete.”
