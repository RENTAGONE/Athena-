# ATHENA Wave 10 — Learning Science, Metacognition and Adaptive Learning Engine

Version 1.0.0 · Status: substantive working draft; research-informed; not expert-reviewed or learner-validated.

## 1. Purpose and architectural position

Wave 10 defines how ATHENA selects, sequences, monitors and adapts learning actions. It is not a universal study timetable, a list of hacks, a personality test, or a promise that one method works for every subject. It connects the actual module objective, learner evidence, task type, prior knowledge, constraints and intended retention horizon to an appropriate instructional strategy.

The governing unit is the **learning decision**: given an objective and current evidence, what should the learner do next, why, and what evidence will show whether that choice worked? The 216-module adaptation bank binds this logic to the existing baseline rather than replacing its objectives, assessment instruments or mastery profiles.

## 2. Evidence model: distinguish learning from performance

ATHENA must keep these states separate:

- Exposure: content was encountered.
- Supported performance: learner succeeded with prompts, examples or immediate assistance.
- Independent performance: learner produced the target under recorded conditions without step-by-step assistance.
- Delayed retention: learner retrieved or performed after a meaningful delay using a non-identical prompt.
- Transfer: learner recognised and adapted the underlying principle in a meaningfully changed context.
- Mastery: a user-confirmed designation based on repeated, suitable evidence; never an automatic score.

Fast completion, familiarity, highlighting, rereading, copied notes, time-on-task, confidence, streaks and polished output are not substitutes for evidence. A learner can have high immediate fluency and weak delayed retention; the system must preserve that distinction.

## 3. The adaptive learning loop

### Phase A — Forethought / plan
1. Resolve the target module and its exact objective.
2. Inspect prerequisite evidence, not merely the recommended sequence.
3. Ask the learner to predict task difficulty and confidence before seeing the answer.
4. Select a target outcome and observable evidence.
5. Choose a strategy based on task type: conceptual explanation, problem solving, procedure, creation/performance or mixed.
6. Set a bounded session scope and identify access, safety and environment constraints.

### Phase B — Performance / monitor
1. Start with a short diagnostic or retrieval prompt where prior learning exists.
2. Deliver explanation, model or demonstration at the learner's entry level.
3. Use worked examples or explicit demonstration for genuinely new/high-complexity tasks.
4. Move through guided attempt, faded support and independent attempt as evidence permits.
5. Monitor observable signals: error type, latency where relevant, prompts used, strategy selection, confidence and task conditions.
6. Stop, simplify or change approach when repeated errors reveal overload, missing foundations, unsafe conditions or irrelevant access friction.

### Phase C — Self-reflection / adapt
1. Compare the attempt with the stated success criteria.
2. Separate what was correct, what was incorrect, and what remains unknown.
3. Classify the first consequential error.
4. Compare pre-feedback confidence with actual result.
5. Select one next action: retrieve again, study a worked example, practise a component, repair a prerequisite, seek feedback, vary context, schedule delayed review, or advance.
6. Preserve original and retry evidence separately.

The cycle repeats. Reflection must change the next learning decision; it is not an ornamental journal.

## 4. Strategy selection by task type

### 4.1 Conceptual knowledge and explanation
Use precise definitions, diagrams or causal models, self-explanation, examples/non-examples, contrastive cases, retrieval and transfer prompts. Ask what causes what, under which conditions, and where the model stops applying. Flashcards can support terms but cannot by themselves establish conceptual explanation.

### 4.2 Mathematical and analytical problem solving
Start with a worked example when the method is new. Make each decision visible. Ask the learner to predict steps; fade worked steps; practise a parallel problem; then interleave related types after basic methods are understood. Require estimation, units, verification and error diagnosis. Do not make a beginner guess randomly across methods they have not yet learned.

### 4.3 Procedural, technical and safety-bounded performance
Use demonstration, chunking, cue recognition, supervised practice where needed, feedback on observable execution and a cold performance check. For procedures that change over time or carry real-world risk, memory alone is insufficient: check current instructions and qualified supervision.

### 4.4 Creative and expressive work
Use exemplars to notice craft, not to prescribe imitation as the final product. Isolate one component, generate variants, compare against explicit criteria and intended effect, revise, then produce a new work under changed constraints. Separate technical craft, expressive intent, audience response and personal taste.

### 4.5 Motor and athletic skills
Prioritise safe technique, manageable repetitions, gradual progression, recovery and context-relevant variation. Use simple blocked repetitions while a movement is unfamiliar; introduce variability and contextual interference only when basic control and safety are stable. Feedback should focus on a specific cue or movement feature. No high-risk, painful or maximal practice is justified by a learning-science label.

### 4.6 Language learning
Combine comprehensible input, noticing, spaced retrieval of useful lexical chunks, listening/reading, production and corrective interaction. Isolated vocabulary review supports access but must be connected to comprehension and communication. Accent is not a proxy for language competence unless a target explicitly concerns a phonetic contrast.

### 4.7 Research, business and decision work
Use question framing, source evaluation, evidence matrices, assumptions, scenario comparison and uncertainty statements. Retrieval helps retain frameworks; authentic decisions require fresh evidence, ethical boundaries and context-specific judgement. Do not convert one anecdote or one sale into proof of a general claim.

## 5. Retrieval, spacing and interleaving: adaptive use, not slogans

### Retrieval
Retrieval is an attempt to reconstruct knowledge or performance from memory. Select the retrieval form to match the objective: free recall, explanation, diagram reconstruction, calculation, discrimination, procedure, creation or oral interaction. Give feedback after the attempt. If retrieval fails, use the error diagnostically, provide a cue or targeted restudy, then retry with a fresh prompt.

### Spacing
Distribute practice across time. The first revisit and later intervals depend on the material, complexity, initial success, desired retention horizon, consequences of forgetting and actual use. ATHENA should use adaptive rules, not a universal fixed schedule. A failed retrieval shortens the next interval or triggers relearning; repeated stable success can lengthen it cautiously. The scheduler must record the rationale and allow user override.

### Interleaving
Interleave related items when the learner needs to discriminate among methods or cues. The learner should already have encountered each method and have enough basic control to attempt it. Interleaving is not random shuffling. If mixed practice collapses into guessing, return to a short blocked/guided repair, then reintroduce mixing.

A 2026 classroom meta-analysis of 53 studies and 7,303 participants found positive average effects for retrieval, spacing and interleaving, but also moderators by knowledge type, outcome, retention interval, test format and feedback. Its conclusion supports context-dependent selection, not one-size-fits-all prescriptions. [LSRC-02]

## 6. Cognitive load and guidance adaptation

The instructional question is not “make everything easy”; it is “remove avoidable load while preserving the thinking the objective requires.”

For a novice: define unfamiliar terms, integrate related text and diagrams, remove irrelevant interface steps, present a complete worked example, chunk complex procedures and avoid asking the learner to discover every step unaided. For a learner with a stable schema: remove redundant explanation, fade scaffolds and increase independence, variation or complexity.

Do not assume all difficulty is beneficial. A useful challenge is one the learner can engage with and learn from. Confusion caused by missing prerequisites, poor wording, inaccessible formats or irrelevant device constraints is not a desirable difficulty.

## 7. Metacognitive monitoring and calibration

Use specific, content-linked questions rather than vague prompts such as “Did you understand?”

**Before:** What exactly must I produce? Which part is likely to be hardest? What do I already know? How confident am I, and why?

**During:** What evidence shows this strategy is working? Can I explain the step? Am I following a model blindly? What is the first point where I became uncertain?

**After:** Which success criterion did I meet? What error occurred first? Was my confidence justified? What changed in my understanding? What is the next test?

Confidence is recorded before feedback and compared with actual performance across multiple observations. A single confidence score is not a trait diagnosis. Small samples are descriptive only. The purpose is better decisions, not judging the learner.

## 8. Error taxonomy and response rules

| Error class | Diagnostic signal | Response |
|---|---|---|
| Knowledge gap | Cannot retrieve a necessary fact or relation | Targeted explanation plus retrieval prompt |
| Misconception | Repeated explanation predicts the wrong result | Contrastive case, counterexample, model repair |
| Prerequisite gap | Learner cannot execute a component needed by target | Narrow prerequisite bridge; do not restart whole discipline |
| Method-selection error | Knows methods but chooses wrong one | Mixed discrimination practice with cue comparison |
| Procedural execution error | Selects correct method but performs step incorrectly | Worked trace or component drill, then fresh full attempt |
| Representation error | Misreads diagram, units, notation or data | Translate between representations; check units/labels |
| Verification failure | Does not check result or misses contradiction | Add estimation, test, counterexample or independent check |
| Attention/slip | Isolated lapse not stable misconception | Add proportionate checking; avoid over-teaching |
| Language/access friction | Wording or mode blocks evidence of target capability | Rephrase or provide construct-preserving mode |
| Overload | Too many new interacting elements at once | Reduce extraneous demands; chunk and model |
| Transfer failure | Performs familiar form but cannot adapt | Map invariant principle, compare cases, vary context |
| Retention failure | Immediate success, delayed failure | Relearn targeted gap and adjust spacing |

## 9. Feedback design

Feedback should be linked to the objective and evidence, focus on task/process/self-regulation, identify a manageable next action and be followed by another attempt. First establish what was correct, then identify the earliest consequential gap. Avoid generic praise, personality labels, overwhelming correction lists or revealing the whole answer before the learner has a chance to think. When automated or AI feedback is used, preserve uncertainty and provide a checkable rationale.

## 10. Session architecture

A session is a flexible container, not a fixed 25/5 law. Suggested sequence:

1. **Orient:** state objective, success criteria and constraints.
2. **Retrieve/diagnose:** brief cold attempt if prior learning exists.
3. **Learn:** explanation, demonstration or worked example matched to current level.
4. **Practise:** guided then independent attempt.
5. **Check:** compare with rubric, source or test; record confidence before feedback.
6. **Repair/extend:** target one consequential gap or attempt a changed case.
7. **Schedule:** set next review based on evidence and desired retention.

Short sessions can complete one meaningful cycle; complex tasks may require several sessions. Time recommendations are provisional and must not be interpreted as guaranteed learning duration.

## 11. Adaptive decision table

| Observed evidence | Next learning action |
|---|---|
| No prior knowledge and high complexity | Teach foundations; complete worked example; guided attempt |
| Strong prerequisite evidence | Skip redundant explanation; diagnostic challenge |
| Supported success only | Fade one prompt; parallel independent task |
| Independent success, no delayed evidence | Schedule cold retrieval/performance |
| Immediate and delayed success, weak transfer | Add contrastive cases and changed context |
| Repeated same error | Diagnose cause; stop repeating same item |
| Fast success with low confidence | Compare evidence; practise calibrated prediction |
| High confidence with errors | Require justification and pre-feedback confidence record |
| Stable transfer and retention | Advance, increase complexity or use maintenance |
| Fatigue, distress, pain or unsafe conditions | Pause, reduce scope or stop; apply relevant safety boundary |

## 12. Motivation, friction and sustainable practice

Motivation is not a fixed personal trait. Make the next action clear, appropriately challenging and meaningful; provide choice where possible; show progress through evidence; reduce avoidable setup friction; and allow a small fallback action on constrained days. Do not punish missed sessions with debt accumulation or streak loss. A learner's value is not their completion rate.

Use implementation intentions (“When X happens, I will do Y”), visible next actions, realistic workload, environmental preparation and supportive feedback. If avoidance repeats, inspect task size, uncertainty, emotional load, access barriers and relevance before assuming laziness.

## 13. Fatigue, sleep, movement and recovery

Learning systems should not encourage all-nighters or compensate for inadequate sleep by scheduling more study. For ages 13–18, the American Academy of Sleep Medicine consensus recommends 8–10 hours per 24 hours regularly; this is a population-level health recommendation, not personalised medical advice. [LSRC-08] If sleep problems persist, involve a guardian and qualified health professional.

For physical skill practice, recovery and safe technique are part of the learning design. Stop for pain, dizziness, unusual shortness of breath or unsafe conditions and seek appropriate adult/qualified support. Do not use fatigue as a proxy for productive effort.

## 14. AI-assisted learning boundaries

AI can explain, generate parallel practice, ask questions, offer feedback hypotheses and help organise reflections. It can also hallucinate, over-assist, leak answers or misjudge evidence. ATHENA should record when AI was used and what it supplied.

Recommended learner workflow: attempt first → request a hint or question rather than full answer → produce own solution → compare with a reliable source or assessment rubric → explain corrections → retry a changed task without AI.

AI output alone is not authoritative source verification, independent performance or mastery. Do not upload credentials, private records or another person's sensitive information. For high-stakes domains, require authoritative sources and qualified human oversight.

## 15. Accessibility and language adaptation

Offer oral, written, diagrammatic, practical, offline and assistive-technology response modes when the response mode is not itself the target construct. Preserve the construct when the objective explicitly targets speaking, handwriting, tool use or another modality. Provide plain-language explanations and a Bangla/English technical glossary where it reduces language friction; do not silently simplify the underlying scientific idea. Avoid scoring accent, device speed, handwriting or expensive-tool access unless directly relevant to the objective.

## 16. Discipline-specific profiles

The companion JSON contains 18 discipline profiles. The following are the operational distinctions:

### ENG — Engineering & Computer Science

- Learning focus: Build, trace, debug and explain working systems.
- Sequence: Worked code/pseudocode → trace a small case → modify one condition → build independently → test edge cases.
- Methods: Use executable or hand-traced examples, incremental construction, debugging logs and test-driven checks.
- Boundary: Do not confuse code that runs once with a correct, secure or maintainable solution.

### BIZ — Business & Entrepreneurship

- Learning focus: Make and defend decisions under uncertainty using customer, value and operating evidence.
- Sequence: Define a real problem → identify assumptions → gather small ethical evidence → compare options → run a bounded experiment → review outcome.
- Methods: Use case comparisons, customer-interview roleplay, assumption maps, simple unit economics and post-experiment reflection.
- Boundary: Do not infer market demand from compliments, friends or a single sale; separate evidence from enthusiasm.

### ELEC — Electronics & Hardware

- Learning focus: Understand physical systems through models, diagrams, measurements and safe supervised experiments.
- Sequence: Model circuit → predict → calculate → simulate or inspect a safe low-voltage example → measure with suitable supervision → explain discrepancy.
- Methods: Use circuit diagrams, worked calculations, prediction-before-measurement, simulation and fault diagnosis.
- Boundary: No mains electricity, exposed high-energy sources, unsafe battery handling or unsupervised hazardous builds.

### FIN — Finance & Economics

- Learning focus: Interpret quantities, incentives, uncertainty and trade-offs with transparent assumptions.
- Sequence: Define question → identify units/time horizon → calculate or model → stress-test assumptions → interpret limits → communicate decision.
- Methods: Use worked numerical examples, spreadsheets or paper ledgers, scenario comparisons, estimation and error checks.
- Boundary: Do not treat classroom models as personalised financial, legal or investment advice; local rules and risk matter.

### BODY — Body Science & Anatomy

- Learning focus: Explain biological structures and functions using accurate models, evidence and careful boundaries.
- Sequence: Locate structure → learn function → trace mechanism → compare normal variation → apply to a case → state uncertainty and care boundary.
- Methods: Use labelled diagrams, retrieval sketches, causal chains, case vignettes and teach-back.
- Boundary: No diagnosis or treatment from study exercises; use qualified clinical guidance for personal health.

### PSY — Psychology & Strategy

- Learning focus: Evaluate behavioural claims, mechanisms and decisions without overgeneralising from anecdotes.
- Sequence: Define construct → distinguish observation/inference → inspect study design → consider alternatives → apply cautiously → state limits.
- Methods: Use claim-evidence tables, experimental-design critique, scenario comparisons and confidence calibration.
- Boundary: Avoid diagnosing self or others; avoid stereotyping and causal claims from correlational evidence.

### AEST — Aesthetics & Visual Design

- Learning focus: Develop visual judgement and design control through deliberate making, comparison and critique.
- Sequence: Observe reference → isolate one visual variable → make variants → compare against criteria → revise → explain design choices.
- Methods: Use side-by-side exemplars, thumbnails, visual analysis, constrained iterations and critique rubrics.
- Boundary: Do not treat taste as objective fact; separate intended effect, audience/context and craft criteria.

### WORK — Workflow & Productivity

- Learning focus: Design repeatable processes that reduce friction while preserving quality and humane limits.
- Sequence: Observe workflow → identify bottleneck → map steps → change one variable → measure effect → document and review.
- Methods: Use process maps, time/effort logs, checklists, small experiments and after-action reviews.
- Boundary: Do not equate busyness or tracking volume with meaningful output; protect rest and privacy.

### ART — Artistic Development

- Learning focus: Build expressive skill through observation, technique, variation and reflective iteration.
- Sequence: Study exemplar → isolate technique → imitate a bounded element → create variation → critique → produce original work.
- Methods: Use demonstrations, short focused drills, reference studies, iterative drafts and portfolio comparison.
- Boundary: Do not mistake copying an exemplar for original authorship; respect rights and attribution.

### ATH — Athletics & Physical Performance

- Learning focus: Acquire movement skills through safe, progressive practice and evidence of execution quality.
- Sequence: Understand cue → demonstrate slowly → practise manageable repetitions → vary context gradually → recover → review technique.
- Methods: Use demonstration, low-risk technique drills, short feedback loops, video only with consent and safe constraints.
- Boundary: No pain-through-it rule, maximal loading, unsafe contact or unsupervised high-risk drills; age-appropriate coaching.

### PERF — Vocal & Performance Arts

- Learning focus: Develop expressive and technical performance through focused rehearsal, listening and feedback.
- Sequence: Hear/observe model → isolate component → practise at manageable intensity → combine → record/reflect → perform varied form.
- Methods: Use model listening, chunked rehearsal, self-recording with consent, targeted repetition and performance reflection.
- Boundary: Avoid vocal strain, unsafe breath-holding or forced range; stop if pain/hoarseness persists.

### MATH — Mathematics & Scientific Reasoning

- Learning focus: Build conceptual models, procedural fluency and problem selection rather than memorising isolated steps.
- Sequence: Interpret representation → study worked example → explain why each step is valid → solve faded example → mix problem types → verify.
- Methods: Use multiple representations, worked examples, self-explanation, error analysis, retrieval and carefully timed interleaving.
- Boundary: Do not interleave before basic methods are understood; distinguish arithmetic slips from conceptual errors.

### CYBER — Cybersecurity & Digital Infrastructure

- Learning focus: Understand systems and threat models through authorised, isolated and defensive practice.
- Sequence: Define asset/threat → learn concept → inspect safe toy example → practise in sandbox → document finding → explain mitigation.
- Methods: Use threat models, network diagrams, controlled labs, command tracing and defensive case analysis.
- Boundary: Only systems and accounts owned or explicitly authorised; no credential theft, malware deployment or real-target probing.

### LANG — Language & Linguistic Intelligence

- Learning focus: Acquire usable language through meaningful input, retrieval, interaction and corrective feedback.
- Sequence: Comprehensible input → notice form/meaning → retrieve vocabulary/chunks → use in context → receive correction → revisit after delay.
- Methods: Use spaced lexical retrieval, listening/reading, shadowing at safe pace, sentence generation and communicative tasks.
- Boundary: Do not overfocus on isolated word lists; accent identity is not a proxy for communicative competence.

### RES — Research & Information Intelligence

- Learning focus: Form answerable questions and build defensible claims from traceable evidence.
- Sequence: Frame question → search strategically → assess source → extract claim/evidence → corroborate → synthesise with uncertainty.
- Methods: Use search logs, source matrices, claim-evidence-reasoning, counter-source checks and synthesis outlines.
- Boundary: A source existing is not corroboration; disclose uncertainty, provenance and limits.

### INDEP — Practical Independence

- Learning focus: Learn safe everyday procedures through demonstration, checklists and context-sensitive judgement.
- Sequence: Clarify task and risk → observe trusted demonstration → rehearse with support → perform bounded step → verify → know when to ask.
- Methods: Use checklists, scenario rehearsal, teach-back, supervised practice and emergency-stop recognition.
- Boundary: High-stakes household, medical, electrical, legal or emergency actions require adult/qualified guidance.

### LEAD — Leadership & Management

- Learning focus: Coordinate people and work through clear goals, communication, feedback and ethical decision-making.
- Sequence: Clarify shared goal → map stakeholders → agree roles → practise communication → review outcomes and impact → adapt.
- Methods: Use role-play, decision logs, meeting simulations, feedback rehearsal and after-action reviews.
- Boundary: Do not confuse authority with competence; include consent, fairness, power differences and accountability.

### COMM — Communication & Rhetoric

- Learning focus: Communicate for a defined audience and purpose with evidence, structure and responsive listening.
- Sequence: Analyse audience/purpose → outline claim → select evidence → draft/perform → test comprehension → revise.
- Methods: Use exemplars, audience analysis, oral rehearsal, argument maps, peer response and revision cycles.
- Boundary: Persuasion quality is not truth; assess evidence, fairness and audience understanding separately.

## 17. Module-level adaptation bank

`ATHENA_WAVE_10_MODULE_LEARNING_ADAPTATION_BANK_v1.0.json` contains 216 records keyed to the exact baseline module IDs. Each record uses the module's actual objective, core model, assessment modes, assessment task and discipline-specific profile to recommend a learning task type, instructional moves, retrieval form, spacing rule, interleaving rule, feedback response, cognitive-load adaptation and evidence links. It does not alter module objectives or Wave 07/08 instruments.

## 18. App behaviour and data requirements

The app should support: objective-aware strategy suggestions; editable session plans; evidence-linked adaptation; confidence-before-feedback; error taxonomy; append-only attempts; spacing rationale and user override; optional fatigue/access context; and visible distinction between recommendation and user choice. Do not infer cognitive traits, diagnoses, intelligence, motivation or ability from interaction telemetry. Do not use engagement metrics as mastery.

Required event fields include module_id, objective_id where available, task_type, strategy_ids, attempt_id, timestamp, conditions, aids/prompts/AI assistance, response mode, evidence reference, criterion results, confidence_before_feedback, error_class, feedback_given, next_action, scheduled_review_reason and user_override. Store only necessary data, with local-first privacy controls.

## 19. Implementation rules and anti-patterns

- No universal fixed spacing intervals.
- No one-size-fits-all session length or attention-span claims.
- No forced interleaving before basic method acquisition.
- No flashcard-only strategy for performance or transfer objectives.
- No deliberate-practice label without a defined component, quality criterion and feedback.
- No mastery from time, streak, confidence or completion.
- No permanent learner profile inferred from one session.
- No all-nighter or overtraining optimisation.
- No AI answer accepted as independent evidence.
- No unsafe task difficulty justified as desirable difficulty.
- No automatic downgrade after a missed session; adapt the next action.

## 20. Research basis and limits

The source register records ten research and guidance sources with scope/limitations. Particularly important: EEF guidance describes metacognition as explicit planning, monitoring and evaluation applied to ordinary curriculum tasks; cognitive-load research supports matching guidance to task and learner; the 2026 classroom meta-analysis supports retrieval, spacing and interleaving while demonstrating moderators; feedback guidance emphasises instruction and formative assessment foundations; calibration research connects monitoring to the full self-regulatory cycle. Sources inform the architecture but do not validate this implementation.

## 21. Status

Wave 10 is an authored, research-informed working engine. It is not a clinically validated learning profile, a personalised cognitive diagnosis, an empirically calibrated scheduler, an expert-approved curriculum or proof of improved outcomes for this learner. Expert review, learner pilot, app implementation testing and empirical tuning remain unclaimed.
