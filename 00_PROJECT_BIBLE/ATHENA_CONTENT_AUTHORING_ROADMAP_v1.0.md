# ATHENA Knowledge Content Authoring Roadmap
Version 1.0.0 · 2026-11-17

## 1. Purpose

This roadmap explains how ATHENA moves from a validated knowledge architecture to a genuinely useful, evidence-based knowledge base. It prevents a common failure: confusing a large taxonomy with a complete curriculum.

**Current truth:** the architecture is substantially structured; the curriculum is still early-stage draft content. The application can be built against stable contracts and clearly labelled seed data while content is authored progressively.

## 2. Current content inventory

| Asset | Current coverage | Status |
|---|---:|---|
| Macro disciplines | 18 | Registered |
| Domains | 113 | Draft taxonomy |
| Skill families | 40 | Draft clusters |
| Skills | 36 | Draft candidates; proposed primary domain mappings |
| Subskills | 36 | Draft candidates; inherit parent mappings |
| Concepts in foundation seed | 11 | Draft |
| Foundation objective stubs | 4 | Draft stubs; not approvable |
| Fully structured objective seed | 1 | Illustrative draft diagnostic |
| Learning units | 1 | Illustrative diagnostic unit |
| Assessments | 1 | Illustrative diagnostic assessment |
| Transfer hypotheses | 31 | Draft; unproven |
| Contexts | 6 | Draft |
| Micro-skills | 20 | Draft; four HIGH-risk records blocked for safety review |
| Approved curricula | 0 | None claimed |

`ATHENA_CONTENT_COVERAGE_v0.1.json` is a domain-by-domain inventory of mapped seed records. It currently reports 42 domains with some draft seed coverage and 71 taxonomy-only domains. “Seeded” does not mean complete, reviewed or approved.

## 3. Six foundational pillars

These are cross-cutting foundations and learning capabilities, not extra macro disciplines:

A. **Learning how to learn:** retrieval, deliberate practice, feedback, calibration, metacognition and self-regulated learning.
B. **Mathematics foundations:** number sense, arithmetic, fractions/decimals/percentages, ratios, negative numbers, algebra, equations/inequalities, exponents/roots, geometry, graphs, statistics and probability.
C. **Logic and analytical reasoning:** deduction, induction, abduction, conditionals, patterns, fallacies, causality, hypotheses, probability and decision-making.
D. **Research literacy:** source classes, primary/secondary evidence, provenance, corroboration, fact-checking, documentation and limitations.
E. **Communication and language:** technical English, vocabulary, reading comprehension, concise writing, explanation, argument and Bangla technical vocabulary support.
F. **Digital/workflow foundations:** file management, keyboard/input, terminal, Git/GitHub, operating-system concepts, security, documentation and knowledge management.

Baseline diagnostics identify strengths and gaps; they do not block all other lanes. Existing competence should be recognised through evidence, not forced through beginner material.

## 4. Authoring waves

### Wave 0 — Contracts and first vertical slice
Before large-scale content production:
- validate the domain map and stable codes;
- review all initial skill/subskill mappings;
- complete a small high-quality set of objectives, units and assessments;
- build one end-to-end objective/session/evidence/review cycle;
- verify package import and export.

Purpose: prove the content model in the application before multiplying records.

### Wave 1 — Foundations and high-transfer capabilities
Prioritise a useful first learning base:
- learning-to-learn and metacognition;
- number/algebra and scientific reasoning;
- research/source evaluation;
- clear explanation and argumentation;
- digital workflow and programming fundamentals;
- basic business/customer discovery and personal finance;
- body science, safe physical development and nutrition literacy.

These priorities create broad transfer opportunities, but do not become hard gates for unrelated interests.

### Wave 2 — User-selected active disciplines
Author focused pathways for:
- Electronics & Hardware;
- Engineering & Computer Science;
- Business & Entrepreneurship;
- Finance & Economics;
- Body Science & Anatomy;
- Athletics & Physical Performance;
- Aesthetics & Visual Design;
- Artistic Development;
- Vocal & Performance Arts;
- Communication & Rhetoric.

Include real projects and performance evidence, not just reading units.

### Wave 3 — Complete the 18-discipline map
Expand remaining domains and families through the same quality gate. Avoid creating superficial records just to fill every branch. A domain may remain intentionally small if scope does not justify more subdomains.

### Wave 4 — Cross-domain integration
Add projects and transfer tasks that require combining capabilities. A transfer hypothesis remains unproven until the learner applies knowledge in a distinct context and records evidence.

## 5. Required content package per skill

A skill should not be approved until it has:
1. canonical owner, domain/family mapping and stable code;
2. precise capability statement (observable, not topic-shaped);
3. scope and exclusions;
4. prerequisite edges with explicit strength and gating;
5. component subskills where they add instructional value;
6. linked concepts and common misconceptions;
7. one or more measurable learning objectives;
8. learning unit(s) with adaptive entry and exit criteria;
9. resources with provenance and verification status;
10. practice protocol with conditions and safety metadata;
11. assessment instrument and rubric aligned to the objective;
12. evidence policy specifying what counts and what does not;
13. retention/retrieval plan where appropriate;
14. transfer links and a task where transfer matters;
15. review state, content version, reviewer and source references.

Not every skill requires every possible object type. Omissions must be intentional and justified, not filled with generic placeholders.

## 6. Learning objective quality gate

Every approved objective follows:
`[Observable action] + [target object] + [conditions/context] + [success criteria]`.

It must be assessable. “Understand electronics” is not an objective. “Explain how current, voltage and resistance relate in a simple DC circuit, calculate an unknown value under stated assumptions, and identify when Ohm's law does not apply” is closer to an assessable objective.

Use outcome classes: `RECALL`, `EXPLAIN`, `INTERPRET`, `PROCEDURE`, `SOLVE`, `CREATE`, `EVALUATE`, `TRANSFER`.

Each objective specifies assessment methods and evidence dimensions. Resource completion and time spent are never substitutes for evidence.

## 7. Assessment and evidence policy

- Assessment conditions are explicit: aids, time, collaboration, AI assistance and environment.
- Rubrics describe criteria, not only one numeric score.
- Repeated identical items do not prove retention.
- AI evaluator identity, model/version and uncertainty are recorded.
- Disagreement between evaluators is visible; use conservative interpretation until resolved.
- Independent performance must be attested and defaults to unknown.
- Safety-critical performance requires external instruction/verification where relevant.
- Mastery is a user-confirmed designation, never an AI output.

## 8. Content status lifecycle

Use explicit statuses:
- `not_scoped`
- `taxonomy_draft`
- `seeded_draft`
- `in_authoring`
- `in_review`
- `approved`
- `deprecated`
- `archived`

The application may also display implementation status separately:
- `not_implemented`
- `implemented`
- `tested`
- `real_device_verified`

Do not conflate content approval with software implementation.

## 9. Research and provenance

For any factual or technical content:
- prefer primary sources, recognised textbooks, standards, peer-reviewed reviews and authoritative documentation appropriate to the topic;
- record author/publisher, publication/version date, access date and locator;
- distinguish consensus, contested claims and provisional hypotheses;
- capture limitations and scope;
- independently verify AI-generated explanations and citations;
- review content when source versions or safety guidance change.

## 10. Content authoring governance

`Draft → Schema validation → ID/reference validation → Duplicate/conflict review → Graph validation → Provenance/safety review → Diff preview → Human approval → Versioned commit`.

A passing schema does not imply correctness. A correct explanation does not imply the learner has mastered it. A complete domain record does not imply its curriculum is complete.

## 11. Build implication

Claude should implement the content model, editors, validators, import/export and status displays now. Do not wait for all 18 curricula to be written. The app must clearly distinguish:
- taxonomy coverage;
- authored content coverage;
- approved content;
- learner evidence;
- demonstrated/retained capability;
- software implementation status.

This separation is essential to prevent a polished interface from making an unfinished knowledge base look complete.


## 2026-11-17 production strategy update — breadth first, then deep waves

The user approved a two-phase content strategy. First, populate a coherent foundation-to-functional baseline across all 18 disciplines. Batch I provides 12 modules per discipline (216 total) with objectives, core concepts, practice, assessment, success criteria, misconceptions and transfer bridges. Next, deepen the curriculum in three waves of six: (1) MATH, ENG, ELEC, RES, LANG, COMM; (2) BIZ, FIN, WORK, CYBER, PSY, LEAD; (3) BODY, ATH, PERF, AEST, ART, INDEP. Each wave requires actual skill/subskill trees, concept/prerequisite graph, learning units, assessment banks, evidence, retention, verified resources, integrated projects, transfer links and validation. The 145-domain / 733-family working scaffold is not yet canonical; reconcile against the v1.4 ontology before promotion.
