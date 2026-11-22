# Wave 1 Consolidation — Integrated Projects and Cumulative Assessment Blueprint

**Version:** 0.1-working  
**Production message:** 8 of 20  
**Status:** Draft specification; not piloted or approved.  
**Applies to:** MATH, ENG, ELEC, RES, LANG, COMM.

## 1. How to use this document

This is the bridge between six separate learning pathways and evidence of integrated capability. A project is not a decorative activity: it must require the learner to make decisions, produce inspectable work, explain the reasoning, test the result and reflect on limitations. Learners may use any suitable research/teaching tool, but must record sources and distinguish their own contribution from tool-generated material.

The projects below are specifications. They are not claims that the learner has completed them or that the projects have been piloted.

## 2. Project A — Design, build and evaluate a low-voltage sensor indicator

**Primary disciplines:** ELEC + MATH + ENG + RES + COMM.  
**Optional contribution:** LANG (clear technical documentation).

### Challenge
Design a small, low-voltage indicator that responds to a chosen measurable condition using only a safe, current-limited, battery-powered or isolated educational supply approved by a knowledgeable supervisor. Example: a light-level indicator using a sensor module, or a simple LED threshold indicator. Do not connect to mains electricity. Do not improvise high-current battery packs. If suitable parts or supervision are unavailable, complete the circuit simulation and design-review variant instead.

### Required stages and evidence
1. **Define the problem (ENG/COMM):** write a user need, operating context, constraints, measurable acceptance criteria and at least two failure conditions. Evidence: one-page requirements brief.
2. **Research (RES):** compare at least three sources or component datasheets; record author/manufacturer, document title, version/date if available, exact claim used, and why the source is suitable. Evidence: source matrix with uncertainty notes.
3. **Model (MATH):** identify variables, units, expected ranges and a simple relationship or threshold model. State assumptions and predict at least two input/output cases. Evidence: annotated calculation/model sheet.
4. **Design (ELEC/ENG):** produce a labelled schematic or simulation, component list, polarity/current-limit notes and a test plan. Evidence: schematic plus design rationale.
5. **Build or simulate (ELEC):** if physical, use only safe low-voltage supervised conditions and document actual measured values; if simulation, label all outputs as simulated. Evidence: photographs or simulator file/screens plus measurement table.
6. **Verify (MATH/RES/ENG):** compare predicted and observed/simulated behaviour; explain discrepancies, measurement uncertainty and whether each acceptance criterion passed. Evidence: test report.
7. **Communicate (LANG/COMM):** write a concise technical report and deliver a 3–5 minute explanation with questions. Evidence: report, presentation outline and question-response notes.

### Assessment rubric (4 levels)
- **0 — Not demonstrated:** missing, unsafe, unsupported or impossible to inspect.
- **1 — Emerging:** partial model/design; major omissions; weak evidence traceability.
- **2 — Competent:** requirements, calculations, design and test evidence are mostly correct; limitations are acknowledged; minor errors do not invalidate the result.
- **3 — Strong:** traceable sources, correct units and calculations, safe design choices, systematic tests, reasoned discrepancy analysis and clear communication.

**Critical fail conditions:** unsafe electrical setup; mains exposure; bypassing current limits; presenting simulated values as measured; fabricated source or test evidence. A critical fail blocks project pass regardless of average score.

### Transfer question
How would the design change if the sensor were noisy, the supply voltage varied, or the device had to work for six months? The learner must identify which assumptions break and what new evidence is needed.

## 3. Project B — Investigate a real question using a reproducible data workflow

**Primary disciplines:** RES + MATH + ENG + LANG + COMM.

### Challenge
Choose a low-risk, non-sensitive question that can be answered with public/open data or a small voluntary observation exercise. Avoid collecting private data, health data, location histories or identifiable information from other people. Example questions: compare publicly reported monthly rainfall across two locations; analyse a public transport timetable; examine price changes in a publicly available product dataset.

### Required stages and evidence
1. **Question and scope:** define the question, target population or dataset, time period and what the investigation cannot answer.
2. **Source evaluation:** locate original data where possible; inspect provenance, collection method, date, licence/terms and known limitations. Record search terms and rejected sources.
3. **Operational definitions:** define each variable, unit, category, missing-value code and inclusion/exclusion rule before analysis.
4. **Data workflow:** preserve a read-only raw copy; create a cleaning log; never silently overwrite or delete inconvenient observations. Record transformations and reasons.
5. **Analysis:** choose summaries/graphs that match variable types; include denominators, units and uncertainty; do not imply causation from descriptive association.
6. **Reproducibility:** provide a spreadsheet with formulas or a script/notebook, data dictionary, source register and steps sufficient for another learner to reproduce the result.
7. **Communication:** produce a 500–800 word report or equivalent structured brief, one visual, a plain-language summary and a short oral defence.

### Assessment rubric
- Research question and scope: 15%
- Source provenance and evaluation: 15%
- Data definitions and cleaning transparency: 20%
- Mathematical/statistical appropriateness: 20%
- Reproducibility and audit trail: 15%
- Writing, visualisation and defence: 15%

**Critical fail conditions:** fabricated data; undisclosed selective deletion; privacy-invasive collection; unsupported causal claim; chart that materially misrepresents scale or denominator; results not reproducible from supplied artefacts.

### Transfer question
Would the conclusion change under a different sampling frame, time window, missing-data treatment or summary statistic? Learner must perform at least one sensitivity check.

## 4. Project C — Explain and defend a technical decision to a non-specialist

**Primary disciplines:** COMM + LANG + RES + MATH + ENG or ELEC.

### Challenge
Select a real but bounded technical decision, such as choosing between two storage options, comparing two network plans, evaluating a simple automation workflow or selecting a low-voltage component. The decision must have at least three criteria and at least one meaningful trade-off.

### Required stages and evidence
1. State the decision and the intended audience.
2. Define criteria, units, constraints and weights; justify why the weights are not arbitrary.
3. Gather and evaluate evidence from at least three traceable sources, including primary documentation when available.
4. Build a comparison table and, where appropriate, a transparent weighted decision model. Show how the result changes if weights vary.
5. Identify uncertainty, missing information, conflicts of interest and what would change the recommendation.
6. Write an executive summary and a longer evidence appendix.
7. Deliver a 4–6 minute presentation and answer at least three challenge questions without inventing certainty.

### Assessment rubric
- Audience and decision framing: 10%
- Evidence quality and traceability: 20%
- Quantitative reasoning and model transparency: 20%
- Trade-off and uncertainty analysis: 20%
- Argument structure and counterarguments: 15%
- Oral/written clarity and question handling: 15%

**Critical fail conditions:** invented source, concealed material conflict, misrepresented uncertainty, or recommendation unsupported by the stated criteria.

## 5. Cumulative assessment architecture for each discipline

No single percentage score is sufficient to establish durable competence. Use multiple evidence modes and retain the evidence record.

| Discipline | Diagnostic | Formative checks | Cumulative performance | Authentic evidence | Transfer test |
|---|---|---|---|---|---|
| MATH | prerequisite probe, estimation, algebra/graph interpretation | worked steps, error diagnosis, retrieval | mixed unfamiliar problems with explanation | model, proof or solution portfolio | solve a structurally similar problem with changed context/constraints |
| ENG | reading/debugging/design interpretation | small code/design reviews, tests | implement, test and explain a bounded solution | repository history, code, test results, design notes | handle unseen edge case or changed requirement |
| ELEC | symbol, unit, safety and circuit reasoning check | prediction before measurement, measurement log | design/simulate and interpret a safe circuit | schematic, BOM, simulation/measurement provenance | diagnose changed component/supply/sensor condition |
| RES | source and claim appraisal | search log, variable definition, bias check | conduct a small reproducible investigation | protocol, data dictionary, cleaning log, report | critique a new study/data source and revise inference |
| LANG | reading/listening/writing sample in target language | retrieval, feedback revision, comprehension probes | interpret a new text and produce audience-appropriate writing | annotated text, drafts, revision log, oral sample | apply strategy to unfamiliar genre/register |
| COMM | argument/listening/presentation baseline | claim-evidence checks, paraphrase and question drills | present, negotiate or defend a position | recording/outline, audience feedback, reflection | adapt same message to a different audience or challenge |

## 6. Common evidence protocol

For every summative task, capture:
- `task_id`, `unit_codes`, `discipline_codes`, `attempt_id`, date and task version;
- conditions: timed/untimed, closed/open resource, tools allowed, collaboration status;
- original learner submission and any revisions;
- source and tool provenance, including AI assistance and what it contributed;
- rubric criteria with criterion-level outcomes and assessor rationale;
- error/misconception codes and recommended remediation;
- confidence rating separately from demonstrated performance;
- delayed recall/transfer follow-up where appropriate;
- learner reflection and approval state.

Never store only a final score when the task requires reasoning. Preserve working and provenance. AI-generated explanations are not learner evidence unless the learner independently reconstructs and defends the reasoning.

## 7. Assessment decision rules

1. A threshold (for example 80%) is a local task rule, not a universal definition of mastery.
2. Critical safety, integrity or conceptual errors may block a pass even when arithmetic mean exceeds threshold.
3. A correct answer without required reasoning may satisfy a procedural item but not an explanation objective.
4. Tool-assisted and unaided performance are distinct conditions; neither is automatically superior, but the claim must match the condition.
5. A pass on one attempt does not prove retention. Schedule a delayed check based on the skill's decay/risk profile.
6. Reassessment should target the failed objective, not force needless repetition of already demonstrated objectives.
7. Placement may be provisional and should be revisited when later evidence conflicts with the initial diagnostic.

## 8. Project completion checklist

- [ ] Task and scope are clear.
- [ ] Prerequisites checked without unnecessary hard gates.
- [ ] Learner's own contribution is distinguishable.
- [ ] Sources and data provenance are traceable.
- [ ] Working, design decisions and revisions are preserved.
- [ ] Safety/privacy/ethics review completed where relevant.
- [ ] Criteria and critical-fail rules applied.
- [ ] Transfer or delayed retention evidence collected.
- [ ] Learner reviewed the proposed ATHENA update before commit.

## 9. Validation still required

These projects and rubrics are authored specifications. Before release they need: independent review by relevant subject specialists; a learner pilot; age/accessibility and safety review; time-on-task calibration; rubric inter-rater checks; resource and licensing review; and an actual app import/preview/rollback test. No such external validation is claimed here.
