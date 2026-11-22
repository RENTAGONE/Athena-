# ATHENA Wave 08 — Assessment Validity & Calibration System v1.0

**Baseline:** KB v3.22 / Master Vault v5.8  
**Scope:** 216 baseline modules across 18 disciplines  
**Status:** instruments authored; no expert review, learner pilot or empirical rater calibration claimed

## Executive result

- Authored one module-specific assessment instrument for each of the 216 baseline modules.
- Every instrument includes a construct statement, primary task, expected evidence, alternate form, transfer probe, delayed-retention probe, four criterion-level scoring anchors, module-specific scoring cues, false-positive/false-negative/boundary stress tests, feedback/retry rules and accessibility/fairness checks.
- Authored 18 synthetic calibration stimuli and an operational double-rater calibration protocol.
- Authored a five-dimension validity review matrix and learner-pilot instruments.
- Empirical rater scores: 0. Learner-pilot records: 0. Reliability estimate: none. Validity for operational decisions: not established.

## 1. Assessment design contract

Assessment starts from the intended inference: what should ATHENA be allowed to conclude from this evidence? A task is appropriate only when the evidence it elicits matches the learning objective under documented conditions.

| Evidence state | What it means | What it does not prove |
| --- | --- | --- |
| Exposure | Learner encountered the content | Recall or competence |
| Recognition | Learner identifies an answer when shown options/cues | Unaided retrieval |
| Recall | Learner retrieves without the answer supplied | Performance |
| Explanation | Learner explains concepts or reasoning | Ability to execute a procedure |
| Guided performance | Learner performs with prompts/examples | Independent competence |
| Independent demonstration | Learner meets the outcome without step-by-step support | Transfer or retention |
| Repeatable demonstration | Equivalent performance on separate occasions | Broad generalisation |
| Transfer | Learner adapts to a meaningfully changed case | All-context competence |
| Delayed retention | Learner performs/retrieves after a stated delay | Permanent mastery |
| Maintenance | Performance remains adequate under current use conditions | A fixed schedule or trait |


These evidence states must remain separate in the learner record. A single quiz score cannot stand in for all of them.

## 2. Per-module assessment instruments

The JSON assessment bank contains 216 exact-ID instruments. Each uses a discipline-appropriate evidence mode: code/build/debug, financial calculation and decision, safe model or supervised demonstration, visual artifact and critique, spoken/written language performance, physical/performance evidence, research traceability, or scenario-based analysis. The primary prompt remains tied to the existing baseline assessment task and learning objective. Each instrument also names the module misconception to probe, expected model evidence, construct-irrelevant false-positive and false-negative risks, and a boundary-case check.

Each instrument contains four separate criteria: (1) target outcome performance, (2) conceptual/procedural reasoning, (3) verification/quality/boundaries, and (4) transfer. The 0–3 anchors describe observable evidence; they are not a universal score. A critical safety boundary remains non-compensatory.

### Construct-to-evidence examples

| Discipline | Representative module | Evidence mode | Construct guardrail |
| --- | --- | --- | --- |
| ENG | Problem decomposition | decomposition artifact + edge cases + rationale | Do not score code syntax when the target is decomposition |
| ELEC | Ohm’s law | calculation, annotated circuit model, safe simulation | Do not require unsupervised live-circuit work |
| FIN | Risk and uncertainty | scenario comparison, assumptions, risk note | Do not infer personal investment suitability |
| ART | Value and light | original study, stages, observation notes | Do not score expensive materials or one style preference |
| ATH | Speed and acceleration | controlled movement evidence and readiness notes | No maximal test or pain-based progression |
| PERF | Pitch foundations | comfortable-range performance/recording and listening notes | No forced extremes or pain/strain |
| CYBER | Authorized lab practice | owned/authorised sandbox log and cleanup proof | No real targets or unauthorised access |
| LANG | Speaking and interaction | spoken interaction or construct-preserving equivalent | Accent is not penalised unless intelligibility is the target |
| RES | Source credibility | source comparison and claim-evidence map | Do not equate domain prestige with claim truth |
| INDEP | First-aid literacy | scenario response and escalation decision | Literacy is not clinical certification |


## 3. Rubric interpretation

For each criterion, raters choose one anchor independently and cite the exact artifact feature or response evidence. The levels mean: 0 = no usable evidence/materially incorrect; 1 = partial or supported; 2 = independent outcome-level evidence; 3 = robust performance with meaningful boundary handling. Criterion-level reporting prevents strong presentation or vocabulary from compensating for a missing core skill.

## 4. Feedback and retry

Feedback should identify what is correct, name the first consequential gap, explain the relevant principle, and give a specific next action. The learner must have an opportunity to act on feedback. Original attempts and retries are stored separately. A retry after instruction shows learning after feedback; it does not rewrite the initial unaided result. Timing is task- and learner-dependent, not a universal timer.

This follows the EEF feedback guidance: lay foundations with clear learning intentions and formative assessment, focus feedback on moving learning forward, and plan for learners to use the feedback. The EEF also cautions that feedback can be ineffective or harmful when poorly designed.

## 5. Double-rater calibration protocol

1. Both raters study the target outcome, task conditions, rubric and safety boundary.
2. Both independently score the same evidence sample before discussing it.
3. Each score must cite observable evidence and a specific anchor.
4. Compare criterion-level ratings; record exact disagreement rather than averaging it away.
5. Adjudicate using the rubric and record rationale.
6. If disagreement exposes ambiguous wording, revise/version the rubric and rescore affected samples.
7. Recheck drift on later common samples. One meeting does not permanently establish reliability.

### Calibration sample pack

18 synthetic stimuli are included, one per discipline. They are deliberately labelled synthetic and use a provisional authored scoring key. They are not learner responses, rater observations or empirical calibration results.

### Proposed initial reliability study

- Use at least 30 common evidence samples across task types for an initial broad check, plus discipline-specific samples for technical/high-stakes outcomes.
- Have two raters independently score every sample at criterion level.
- Report exact agreement, adjacent agreement, confusion matrices and a suitable ordinal agreement statistic (e.g. weighted kappa where assumptions fit), with uncertainty intervals and prevalence caveats.
- Report by discipline and criterion where sample sizes allow; cross-discipline aggregation can hide local failure.
- Do not choose a universal pass threshold before defining the use, stakes and consequences.
- Do not claim reliability from a well-written rubric, synthetic exemplars or a single rater.

## 6. Validity evidence plan

| Evidence aspect | Question | Evidence needed before operational use |
| --- | --- | --- |
| Content representation | Does the task sample the intended outcome without construct-irrelevant demands? | Outcome-task map; subject review; task coverage analysis |
| Response process | Do learners interpret the task and use the intended reasoning? | Cognitive interviews / think-aloud pilot with consent |
| Internal structure | Do rubric criteria behave as intended and remain distinguishable? | Criterion-level scoring data; analysis appropriate to sample |
| Relations to other evidence | Do results relate plausibly to independent demonstrations or relevant external criteria? | Predefined comparison evidence; avoid circular validation |
| Consequences and fairness | Are decisions useful and fair without irrelevant barriers? | Accessibility review, learner feedback, bias and consequence checks |


## 7. Accessibility and fairness controls

- Offer oral, written, diagrammatic, assistive-technology and low-bandwidth/offline response modes when response mode is not the target construct.
- Do not accommodate away a skill explicitly named in the objective.
- Do not score accent, handwriting, device brand, internet speed or expensive equipment unless directly relevant to the outcome.
- Keep reading load proportional to the target; use plain instructions without changing technical meaning.
- Use examples that do not assume one country, school system, paid subscription or household resource unless required.
- Use consent, assent and privacy minimisation for any learner pilot, especially with minors.

## 8. Sources and design basis

- AERA, APA & NCME, *Standards for Educational and Psychological Testing* (2014; open access information): validity, reliability and fairness must support intended score interpretations and uses.
- Education Endowment Foundation, *Teacher Feedback to Improve Pupil Learning* (2021): formative assessment foundations, actionable feedback and learner action on feedback.
- ATHENA Competency, Assessment, Evidence and Placement Framework v1.0 (working): separate evidence states, five assessment dimensions, append-only evidence and diagnostic placement.

## 9. Validation status

- 216/216 module-specific instruments authored; IDs unique and resolved against the baseline.
- 18/18 synthetic calibration stimuli authored.
- 0 empirical rater scores; no inter-rater reliability estimate.
- 0 learner-pilot records; no response-process evidence.
- No expert review, validity study, operational cut-score approval or release claim.
