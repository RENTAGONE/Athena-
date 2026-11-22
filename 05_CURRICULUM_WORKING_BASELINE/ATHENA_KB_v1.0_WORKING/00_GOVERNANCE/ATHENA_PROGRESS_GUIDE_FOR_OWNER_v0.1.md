# ATHENA — Owner Progress Guide v0.1

**As of:** 2026-11-17  
**Purpose:** Explain the real state of ATHENA without hiding unfinished work behind large inventory counts.  
**Overall status:** Active working build. **Not v1.0-ready.**

## 1. The short version

ATHENA has a substantial product plan, a working knowledge architecture, a broad topic map and a first layer of curriculum. It does **not** yet contain a fully written, reviewed, assessed and verified course for every discipline. The app is also not yet verified as a working product.

The biggest mistake would be to read a count such as “216 modules” or “155 protocols” and assume that many finished lessons or approved skills exist. Those counts describe records and draft coverage. Quality and validation are separate.

## 2. What is genuinely in place

| Area | What exists now | What that actually means |
|---|---|---|
| Product definition | Product bible, purpose, invariants, experience specification, privacy and backup decisions, visual direction and roadmap | The intended product is well specified. It is not proof that the app implements it. |
| Knowledge architecture | 18 disciplines; stable-ID conventions; schemas; authoring standards; relationship vocabulary; evidence and competency model | The structure and governance are substantially designed. Some semantic mappings and relation decisions remain proposals. |
| Working ontology | 146 working domains and 741 skill-family candidates | A broad candidate map exists. The canonical seed remains 113 domains and 40 family records; candidate mappings are not approvals. |
| Foundational curriculum | A multi-module foundation draft, including learning how to learn and quantitative foundations | Some parts contain real explanations, examples, practice and misconceptions. It still needs subject review and learner testing. |
| Breadth baseline | 216 topic-outline records: 12 per discipline across 18 disciplines | This establishes a first-pass map of what to teach. It is not 216 complete lessons. A full audit found identical generic success criteria, assessment modes, retention placeholder, safety note, provenance, stage and status fields across all 216 records. |
| Wave 1 deepening | 18 deeper units across Mathematics, Engineering/CS, Electronics, Research, Language and Communication | These are more substantive drafts, with worked examples, guided and independent practice, rubrics, placement and transfer tasks. They are not expert-checked or learner-tested. |
| Skill-family specifications | 59 of 741 candidates specified | 59 have scope, observable outcome, success criteria, assessment examples and boundaries. 682 remain title-level candidates. |
| Micro-skill library | 155 candidates with individual draft protocols | Authoring coverage exists. 0 expert-reviewed, 0 learner-validated and 0 approved. 21 need risk-sensitive review. |
| Projects | 24 integrated project specifications | Project ideas and structures exist. Their links to canonical skills, objectives, assessments and evidence still need validation. |
| Assessment | Competency/evidence framework and module-level assessment prompts | The model exists. Broad item banks, scoring anchors, acceptable variants and calibration are incomplete. |
| Resources | Resource standards and some source references | There is no complete, verified resource corpus linked to every pathway. |
| Validation | Pack validator and working-ontology validator passed their recorded checks | These validate the data they were designed to check. They do not prove instructional correctness or app compatibility. |

## 3. New finding: why the 216-module baseline felt generic

A reproducible comparison of all 216 baseline records found:

- The `success_criteria` field has exactly **one** value repeated in all 216 records.
- `assessment_modes` has exactly **one** value repeated in all 216 records.
- `retention_profile` is the same selector placeholder in all 216 records.
- `safety_review` is the same broad generic note in all 216 records.
- `provenance`, `stage` and `status` are also identical across all 216 records.
- The average learning objective is 8.2 words; practice prompt 9.6 words; assessment prompt 8.4 words.

The module titles and several prompts are discipline-specific, so the entire baseline is not copied generic text. But it is still an outline layer. The common criteria do not tell us what correct algebra, safe circuit work, ethical research, good negotiation or accurate drawing looks like. The baseline needs substantive remediation before it can be presented as teaching content.

See `07_VALIDATION/BASELINE_216_INSTRUCTIONAL_QUALITY_AUDIT_v0.1.md`.

## 4. What we have started correcting

### Mathematics teaching-content Batch 01

`08_BREADTH_FIRST_BASELINE/MATH_FOUNDATIONAL_TEACHING_PACK_BATCH_01_v0.1.md` and `...BATCH_02_v0.1.md` now replace the thin outline-level teaching for:

1. `BASE-MATH-001` — Number sense, magnitude and estimation.
2. `BASE-MATH-002` — Arithmetic operations and operation sense.
3. `BASE-MATH-003` — Fractions, decimals and equivalent quantities.
4. `BASE-MATH-004` — Percentages and proportional change.
5. `BASE-MATH-005` — Ratios, rates and proportional reasoning.
6. `BASE-MATH-006` — Negative numbers and signed quantities.
7. `BASE-MATH-007` — Variables, expressions and algebraic structure.
8. `BASE-MATH-008` — Equations, inequalities and preserving equality.

Each includes a learner-facing explanation, worked examples with reasoning, guided practice with answers, independent exercises with answer guidance, common errors and corrective feedback, an assessment standard, a transfer task, entry assumptions and scope boundaries. A structural check confirms all eight units exceed 500 words and contain the required sections; this is not subject approval.

These four are substantive instructional drafts—not approved lessons. Their subject accuracy and learner comprehension still need review. Stable module IDs are unchanged. The original 216-record JSON baseline is preserved; the new teaching pack is additive until the content schema and app import process are deliberately updated.

## 5. What is still missing for a credible v1.0

### A. Knowledge map and relationships

- Review all 146 working domains and 741 family candidates against the 113-domain/40-family canonical seed.
- Decide genuine equivalence, partial overlap, composite scope, split, merge, new domain or extension; do not approve based on title similarity.
- Specify the remaining 682 skill families and review the first 59.
- Resolve the 155 micro-skill candidates against the 20 canonical records; 130 working candidates remain unlinked.
- Approve typed semantic edges and justify every hard prerequisite. Validate reference integrity and prerequisite acyclicity.

### B. Actual curriculum

- Turn all 216 baseline outlines into real instructional units or explicitly classify them as navigation-only topic records.
- Expand all 18 disciplines with accurate explanations, worked examples, practice progressions, answer rationales, feedback and transfer tasks.
- Complete the three six-discipline deepening waves; 18 Wave 1 units are only an initial slice.
- Build appropriate skill/subskill trees and define observable competence rather than relying on titles.
- Link learning objectives, units, skills, assessments, resources, projects and evidence consistently.

### C. Assessment and retention

- Build varied assessment banks: recall, explanation, problem-solving, practical performance, diagnosis and transfer where appropriate.
- Define task-specific scoring anchors, acceptable variants, error categories and evidence conditions.
- Calibrate scoring against examples and learner performance.
- Give each capability an appropriate retention/relearning profile; do not use one universal review interval.

### D. Sources, safety and review

- Link verified resources with author/publisher, locator, access date, licensing/usage notes, scope and limitations.
- Subject-review factual and technical material.
- Obtain competent review for CPR/AED, choking response, electrical/tool work, cybersecurity, fitness and health-related content.
- Pilot content with the learner and revise confusing explanations, unrealistic workload and weak assessments.

### E. App and release verification

Claude owns the technical implementation. The following must be demonstrated in the actual application, not merely described in an architecture document:

- Import validation, preview, approval, atomic commit, rollback and audit history.
- Backup, restore and round-trip portability.
- Offline/PWA behaviour and local-first privacy requirements.
- Search, graph navigation and accessible non-graph alternatives.
- CI/build/browser tests, Ajv standalone/CSP compatibility, accessibility and performance.
- Real-device testing on the intended Android phone, plus usability testing.

## 6. What “done” must mean

A record is not done because it exists, parses, has a title or passes a minimum-length check. A curriculum item is ready only when:

1. Its scope and intended learner outcome are clear.
2. Its explanation is correct, understandable and appropriately bounded.
3. Worked examples demonstrate the reasoning, not only the result.
4. Practice progresses from supported to independent performance.
5. Assessment criteria measure the stated outcome and have scoring guidance.
6. Misconceptions and likely errors have useful corrective feedback.
7. Transfer is tested in a genuinely changed context.
8. Sources and safety boundaries are documented where needed.
9. Prerequisites and links are semantically justified.
10. Appropriate subject review and learner validation are recorded.

For app features, “done” requires an implemented feature and reproducible test evidence in the real app. For release, all P0 and safety-critical gates must close; a large content count cannot waive them.

## 7. Working ownership

- **ChatGPT/content work:** knowledge architecture, domain and skill semantics, curriculum, lessons, assessments, resources, retention, projects, structured packages and content validation.
- **Claude/app work:** technical architecture, database, importer, UI, offline behaviour, graph implementation, accessibility, tests, CI and deployment.
- **Owner decisions:** product-purpose changes, canonical semantic approvals, unresolved governance decisions and release approval.

Claude being actively at work means implementation is in progress; it does not mean the app has passed tests. We will update this guide only when new artefacts or test evidence exist.

## 8. Current next sequence

1. Complete the 216-module quality diagnosis and establish the lesson-completion standard. **Started; audit published. Mathematics BASE-MATH-001–008 rewritten as substantive drafts.**
2. Continue substantive teaching rewrites in coherent discipline batches, starting with the remaining Mathematics foundations and then other high-leverage foundations.
3. Replace generic assessment and retention placeholders with task-specific designs as each unit is authored.
4. Continue family specifications and canonical ontology decisions without promoting candidates prematurely.
5. Build verified resource and expert-review workflows alongside curriculum production.
6. Integrate the content with Claude's app importer only after the exchange contract and test fixtures are stable.
7. Run learner and device validation; close release gates before calling ATHENA v1.0.

**Bottom line:** ATHENA has a strong blueprint and a growing draft knowledge base. The next phase is not more impressive-looking counts. It is turning each important topic into knowledge that can actually be learned, used, tested, retained and trusted.
