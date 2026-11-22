# Wave 1 Six-Discipline Teaching Pack — Batch 03

**Production message:** 6 of 20  
**Disciplines:** MATH, ENG, ELEC, RES, LANG, COMM  
**Status:** Authored instructional drafts; internal consistency review required; independent subject review and learner pilot pending.  
**Purpose:** Provide assignable learning units rather than topic labels. Each unit is designed for the ATHENA loop: assign → learner-selected research → practice → learner demonstration → independent evaluation → proposed evidence package → learner approval → engine commit.

## How to use these units

ATHENA should present the learning objectives and required evidence, not force the learner to use one source or AI tutor. The learner may use books, courses, videos, simulations or AI assistance. AI-generated explanations are study inputs, not evidence of mastery. The learner's own explanation, solution, artefact or performance is the evidence. Evaluation must distinguish unaided understanding from tool-assisted performance and must preserve provenance.

---

## MATH-MOD-015 — Mathematical modelling: assumptions, variables and validation

**Purpose:** Translate a real situation into a mathematical model, inspect its assumptions, solve or analyse it, and judge whether the result is useful in context.

**Prerequisites:** Ratios and percentages; linear equations; functions and graphs; basic descriptive statistics. Calculus is not required for the introductory pathway.

**Learning outcomes:** The learner can (1) define a modelling question; (2) distinguish variables, parameters, inputs and outputs; (3) state assumptions and units; (4) select a suitable representation such as an equation, table, graph or simulation; (5) solve or estimate; (6) test the result against data or boundary cases; and (7) communicate limitations.

**Core model:** A mathematical model is a purposeful simplification, not a perfect copy of reality. The modelling cycle is: formulate → make assumptions → mathematise → solve/analyse → interpret → validate → revise/communicate. A result can be algebraically correct and still be a poor answer if the assumptions, units or domain are wrong.

**Concepts:** independent/dependent variable; parameter; constraint; dimensional consistency; proportional versus nonlinear relationship; calibration; residual; sensitivity; scenario; extrapolation; uncertainty; model validity; domain of applicability.

**Worked example:** A water tank initially contains 120 L and drains at a constant 3 L/min. Under the constant-rate assumption, V(t)=120−3t. The physical domain is 0≤t≤40 minutes; a negative volume after 40 minutes is mathematically computable but physically meaningless. If the drain rate changes with water height, the linear model becomes inadequate. Validation would compare predicted volumes with measured volumes at several times and inspect residuals rather than relying on one matching point.

**Guided practice:**
1. A phone battery falls from 80% to 68% in 30 minutes. Calculate the average percentage-point rate, then explain why a constant-rate forecast may fail.
2. Model the total cost of a ride with a fixed starting fee plus a per-kilometre charge. Name variables, parameters, units and a realistic domain.
3. A model predicts 52 users while observation records 47. Calculate the signed error and absolute error; explain why one error does not establish overall model quality.
4. Identify two assumptions in a model of monthly savings and explain how each could fail.

**Independent practice:** Choose a modest real problem (travel time, mobile data use, savings, water use, study time or a small business order). Submit: question; variable/parameter table with units; assumptions; model; solution or forecast; at least two validation checks; sensitivity discussion; and a paragraph explaining where the model should not be used.

**Answer guidance:** Good modelling work makes assumptions visible and checks units. Distinguish percentage points from percent change. Do not extrapolate beyond observed conditions without justification. If data are noisy, report a range or uncertainty rather than false precision. A more complicated model is not automatically better; complexity must earn its cost through improved explanatory or predictive performance.

**Common misconceptions:** Treating assumptions as facts; forgetting domain restrictions; confusing correlation with mechanism; using too many significant figures; judging a model from one data point; assuming a close fit proves causality; and failing to revise a model when evidence contradicts it.

**Assessment:** Given a short real-world scenario and a small dataset, create a model, solve it, validate it and explain limitations. Independent performance requires coherent units, defensible assumptions, correct calculations and at least two meaningful checks. Transfer-ready performance compares two candidate models and justifies the simpler or more useful choice.

**Evidence to submit:** Model report, calculations or code/spreadsheet, validation table, assumptions register and a short oral defence answering “What evidence would make you change this model?”

**Retention:** Rebuild the modelling cycle from memory using a new scenario after 1 day, 1 week and 1 month. Revisit the original model after collecting new observations and record what changed.

**Progression bridge:** Statistics, calculus-based modelling, optimisation, physics, engineering, economics and business forecasting.

---

## ENG-SWE-002 — Version control, change history and collaborative software workflow

**Purpose:** Use version control to make software changes traceable, reviewable and recoverable rather than editing a project with no reliable history.

**Prerequisites:** Basic programming; files and folders; command-line navigation or a graphical Git client; understanding of a project directory.

**Learning outcomes:** The learner can explain repository, working tree, staging area and commit; create meaningful commits; inspect history and differences; use branches for isolated work; integrate changes; resolve a simple conflict; and avoid committing secrets or generated clutter.

**Core model:** Version control records a sequence of snapshots and relationships between them. A commit should represent a coherent change with a message explaining intent. A branch is a movable line of development, not a separate copy of the whole project. A merge combines histories; a conflict means Git cannot safely decide how overlapping edits should be reconciled. Version control is not a substitute for backups, tests or code review.

**Concepts:** repository; clone; working tree; staging; commit; diff; branch; merge; conflict; remote; pull; push; ignore rules; tag; revert; reset; secret management; code review.

**Worked example:** A learner changes a calculator's input validation. Before editing, they inspect `git status` and the current diff. They create a branch `fix/input-validation`, modify the code, run tests, stage only the intended files, inspect the staged diff and commit with a message such as `Reject non-numeric calculator input`. They push the branch and request review. If another change touched the same lines, they inspect both versions, decide the intended behaviour, resolve the conflict and rerun tests before merging.

**Guided practice:**
1. Explain the difference between a file being modified and being staged.
2. Given three changes (bug fix, unrelated formatting, local secret), decide what belongs in one commit and what must not be committed.
3. Read a diff and identify exactly which behaviour changed.
4. Describe when `revert` is safer than rewriting shared history.
5. Resolve a deliberately created text conflict in a disposable practice repository.

**Independent practice:** Create a small repository for a harmless script or static website. Make at least four coherent commits, use a feature branch, introduce and resolve one controlled conflict, write a useful README, configure ignore rules and inspect the final history. Do not publish credentials, personal data or private client files.

**Answer guidance:** Stage deliberately; do not use a blanket add command without checking what it captures. A commit message describes the change, not merely “update”. Shared history should generally be corrected with a new commit rather than destructive rewriting. A merge is not complete until tests and review pass. Never paste access tokens into source code or commit history; removing a secret from the latest file does not erase it from prior commits.

**Common misconceptions:** Git is the same as GitHub; commit equals backup; every change should be one giant commit; branches automatically prevent conflicts; a successful merge proves correctness; and deleting a secret from the current file makes a leaked token safe.

**Assessment:** In a sandbox repository, make a branch, implement a bounded change, provide a readable diff, resolve a conflict, run tests and explain recovery options. Independent performance preserves unrelated work and leaves a traceable history. Transfer-ready performance can review another person's change and identify risk, missing tests and sensitive-data exposure.

**Evidence to submit:** Repository history or screenshots, commit rationale, before/after diff, test output, conflict-resolution note and a short explanation of how to recover from an accidental change.

**Retention:** Rehearse the workflow on a disposable repository monthly. Before each real push, retrieve the sequence: status → diff → stage → staged diff → commit → test → push/review.

**Progression bridge:** CI/CD, code review, release management, collaborative engineering and secure software supply chains.

---

## ELEC-MEAS-002 — Measurement, multimeter use and uncertainty in low-voltage circuits

**Purpose:** Make safe, repeatable electrical measurements and interpret readings with awareness of instrument limits and circuit effects.

**Prerequisites:** Voltage, current and resistance; Ohm's law; series/parallel circuits; circuit symbols; basic electrical safety.

**Safety boundary:** This unit is restricted to low-voltage, current-limited educational circuits. Do not measure mains outlets, open power supplies, large batteries, unknown high-energy sources or live household wiring. Never place a multimeter in current mode directly across a voltage source. Practical work requires appropriate supervision, rated probes and a current-limited supply. Simulation and worked datasets are valid alternatives.

**Learning outcomes:** The learner can choose the correct measurement mode and range; explain why voltage is measured in parallel and current in series; measure resistance only on an isolated, de-energised component; recognise overload and polarity signs; record units and instrument resolution; and identify plausible sources of measurement error.

**Core model:** A measurement is an interaction between a physical quantity and an instrument. A voltmeter has finite input resistance and can slightly load a circuit; an ammeter has nonzero burden resistance and must be inserted in series. Instrument range, resolution, calibration, probe contact and circuit stability affect results. A displayed number is not automatically the true value.

**Concepts:** DC voltage; current; resistance; continuity; range; resolution; input impedance; burden voltage; tolerance; repeatability; accuracy; calibration; uncertainty; measurement loading; polarity; common/COM jack; fused current input.

**Worked example:** A resistor marked 1.0 kΩ with ±5% tolerance has an expected resistance interval of 950 Ω to 1050 Ω. A de-energised isolated measurement of 987 Ω is consistent with that tolerance. Measuring it while still connected in parallel with other components may produce a lower equivalent resistance, so the result would not directly test the resistor's own value. To measure a supply's voltage, select the appropriate DC-voltage mode and place probes across the two circuit nodes. To measure branch current, open the branch and insert the meter in series using the correct fused current input and range.

**Guided practice:**
1. For a 5 V LED circuit, state where the voltmeter probes go to measure LED voltage.
2. Explain why an ammeter must not be placed directly across a battery or supply.
3. A nominal 220 Ω resistor is marked ±5%. Calculate its tolerance interval.
4. Three readings are 4.98 V, 5.01 V and 4.99 V. Calculate the mean and describe what the small spread does and does not establish.
5. Identify the safe next action if the display shows overload or the reading is unstable.

**Independent practice:** Use a simulator or supervised low-voltage kit to document a measurement sequence. Record circuit diagram, supply limit, meter mode/range, probe placement, three readings, mean, instrument resolution, component tolerance and likely error sources. If no hardware is available, analyse a supplied or self-created simulated dataset and label it as simulated.

**Answer guidance:** Resistance should be measured with power removed and ideally with one component lead isolated when parallel paths affect the result. Voltage is measured across a component; current is measured through a branch. Do not infer high precision from extra displayed digits. Repeated readings estimate repeatability, not necessarily accuracy; all readings can share a systematic offset.

**Common misconceptions:** Treating voltage and current measurement as interchangeable; measuring resistance in a powered circuit; using the wrong jack; interpreting overload as a very large valid number; assuming the mean eliminates systematic error; and assuming a component's nominal value is exact.

**Assessment:** Given a low-voltage schematic and a measurement objective, choose mode, range and probe placement, explain safety checks, interpret readings and state uncertainty. Any dangerous meter connection is an automatic safety failure regardless of arithmetic accuracy.

**Evidence to submit:** Annotated schematic, measurement plan, readings or simulated dataset, tolerance calculation, uncertainty note and a safety checklist.

**Retention:** Before each practical session, retrieve the rules for voltage, current and resistance measurement. Repeat a measurement with a changed range or instrument and explain any difference.

**Progression bridge:** Circuit debugging, sensor interfacing, laboratory practice, embedded systems and electronics prototyping.

---

## RES-METHOD-002 — Research questions, operational definitions and study design

**Purpose:** Turn a broad curiosity into a researchable question and choose a method capable of producing evidence relevant to that question.

**Prerequisites:** Source evaluation; distinction between claim and evidence; basic descriptive statistics; ethical awareness when people or personal data are involved.

**Learning outcomes:** The learner can narrow a topic into a bounded question; define key terms operationally; distinguish descriptive, comparative, correlational and causal questions; select an appropriate design; identify population, sample, variables and likely confounders; and state ethical and feasibility constraints.

**Core model:** Research design is the logic connecting a question to evidence. The method must match the claim. A descriptive survey can estimate reported behaviour in a defined sample but cannot by itself establish that one factor caused another. A controlled experiment may support causal inference when allocation, measurement and confounding are handled appropriately, but it may be unethical or impractical. Operational definitions specify how an abstract concept will be observed or measured.

**Concepts:** research question; scope; construct; operational definition; population; sampling frame; sample; variable; outcome; exposure; confounder; bias; descriptive study; observational study; experiment; qualitative interview; mixed methods; consent; privacy; preregistration; feasibility.

**Worked example:** Broad topic: “Does phone use affect studying?” A more researchable descriptive question is: “Among students in one specified class during a specified two-week period, how many minutes of recreational phone use do they report on school nights, and how does that relate to self-reported study duration?” Operational definitions specify what counts as recreational use and study time. This observational design can describe an association but cannot establish that phone use causes reduced study time. Sleep, workload, family responsibilities and reverse causation may matter. If minors participate, guardian/school requirements, voluntary assent, data minimisation and privacy protection must be addressed before collecting information.

**Guided practice:**
1. Rewrite “Is social media bad?” into one descriptive and one comparative question.
2. Operationally define “regular exercise” for a small observational project.
3. Identify the population, sampling frame and likely selection bias in an online poll shared only with friends.
4. Explain why a correlation between sleep and grades does not by itself show that sleep caused the grade difference.
5. Decide whether an interview, survey, observation, experiment or existing dataset best fits a supplied question and justify the choice.

**Independent practice:** Design a small, low-risk study using public or non-sensitive data, or a literature-based question. Submit: research question; rationale; operational definitions; target population and sampling approach; design; measurement plan; likely biases/confounders; ethical review; analysis plan; and a limitation statement. Do not collect sensitive data or involve participants without appropriate permission and safeguards.

**Answer guidance:** A good question is focused, answerable with available evidence and explicit about population/time/context. Operational definitions should be measurable without pretending that a proxy fully captures a complex construct. Sampling convenience must be disclosed. Causal wording requires a design and assumptions that support causal inference; statistical adjustment alone does not automatically remove confounding.

**Common misconceptions:** Bigger sample automatically means representative; survey response equals objective behaviour; a variable is well measured because it has a numeric score; correlation proves causation; an operational definition captures the whole construct; and low-risk student projects need no ethical consideration.

**Assessment:** Evaluate a proposed study plan. Independent performance identifies a fit-for-purpose design, valid operational definitions, plausible bias and ethical controls. Transfer-ready performance explains what conclusions the design can and cannot support and proposes a stronger feasible alternative.

**Evidence to submit:** One-page protocol, variable/definition table, sampling plan, bias register, ethics checklist and a paragraph limiting the claims the data could support.

**Retention:** Apply a question-design checklist to a news claim or everyday curiosity every few weeks. Revisit the protocol after pilot testing and record which definitions or procedures were unclear.

**Progression bridge:** Qualitative methods, experimental design, statistics, scientific reasoning, user research and policy evaluation.

---

## LANG-ACQ-002 — Deliberate language learning: input, retrieval, feedback and transfer

**Purpose:** Build an evidence-informed routine for acquiring vocabulary, grammar, listening, speaking, reading and writing in an additional language.

**Prerequisites:** Basic literacy in a language the learner knows; ability to identify a target language and a practical communication goal.

**Learning outcomes:** The learner can define a communicative target; select comprehensible but challenging input; use spaced retrieval for vocabulary; practise language in context; obtain corrective feedback; track receptive and productive performance separately; and revise a study plan from evidence rather than app streaks.

**Core model:** Language ability is multidimensional. Recognising a word while reading is not the same as retrieving it while speaking. Learning benefits from meaningful exposure, repeated retrieval, interaction, feedback and varied contexts. A useful cycle is notice → understand → retrieve → use → receive feedback → revisit after delay. Progress should be measured against communicative tasks, not only completed lessons or memorised word counts.

**Concepts:** comprehensible input; noticing; receptive vocabulary; productive vocabulary; retrieval practice; spacing; interleaving; shadowing; comprehensible output; interaction; corrective feedback; fluency; accuracy; register; transfer; fossilisation; CEFR-style proficiency descriptors (used as broad descriptors, not automatic certification).

**Worked example:** Goal: ask for directions and understand a simple reply. The learner first studies a short dialogue with audio and transcript, marks useful phrases, checks meaning and pronunciation, then hides the transcript and retrieves the phrases. They practise variations with different destinations, listen to a new speaker, role-play the exchange and receive feedback on intelligibility and word choice. A week later they perform a new role-play without seeing the original dialogue. This tests transfer better than rereading the same script.

**Guided practice:**
1. Turn ten isolated vocabulary words into five useful phrases or sentences in context.
2. Create a three-stage review schedule for new words and explain why delayed retrieval matters.
3. Compare a reading task and a speaking task that use the same vocabulary; identify what each reveals.
4. Record a short spoken response, identify one intelligibility issue and practise a corrected version.
5. Adapt one memorised dialogue to a new setting rather than repeating it verbatim.

**Independent practice:** Design a two-week micro-curriculum for one real communication goal. Include input sources, daily retrieval, listening, speaking or writing output, feedback source, spaced reviews and two transfer tasks. Keep a small error log that records the form, intended meaning, correction and a new example. Use lawful, age-appropriate resources and avoid sharing private recordings publicly.

**Answer guidance:** Select material that is understandable enough to follow while still containing some new language. Use spaced retrieval, but do not turn every session into flashcards. Feedback should be specific and actionable. Correctness is not the only goal: intelligibility, appropriateness and successful communication matter. A memorised script is useful as a starting scaffold but not proof of flexible ability.

**Common misconceptions:** Streaks equal proficiency; passive exposure alone guarantees speaking ability; translation word-for-word is always appropriate; one accent is inherently superior; a single test measures all language skills; and errors mean failure rather than information for the next practice cycle.

**Assessment:** Complete an unfamiliar but level-appropriate communicative task after preparation, then repeat a structurally similar task with changed details after a delay. Independent performance communicates the intended meaning with appropriate vocabulary and comprehensible form. Transfer-ready performance adapts language to a new interlocutor or context and can self-correct some errors.

**Evidence to submit:** Goal statement, two-week plan, sample input log, retrieval results, short written or recorded performance, feedback/error log and delayed transfer task.

**Retention:** Schedule cumulative retrieval, not only recent vocabulary. Reuse old language in new contexts and periodically test listening with unfamiliar speakers or texts.

**Progression bridge:** Advanced grammar, pronunciation, intercultural pragmatics, translation, academic language and multilingual communication.

---

## COMM-PRES-002 — Oral presentation: structure, delivery and question handling

**Purpose:** Plan and deliver a clear presentation that helps a specific audience understand and remember a defensible message, then respond accurately to questions.

**Prerequisites:** Evidence-based argumentation; basic audience analysis; ability to organise a short written explanation.

**Learning outcomes:** The learner can define audience and purpose; write a one-sentence takeaway; structure an opening, body and conclusion; select evidence and visuals that clarify rather than decorate; rehearse for timing and intelligibility; use delivery techniques accessibly; and answer questions without bluffing.

**Core model:** A presentation is a designed communication event. The speaker chooses what the audience should understand, believe or do, then structures evidence and explanation to support that outcome. Delivery supports comprehension but does not replace substance. Visuals should reduce cognitive load, make relationships visible or provide necessary detail; they should not compete with the speaker. A credible presenter distinguishes what is known, inferred and uncertain.

**Concepts:** audience analysis; purpose; key message; signposting; narrative arc; opening hook; evidence hierarchy; slide density; visual encoding; pacing; vocal variety; articulation; eye-line; accessibility; rehearsal; Q&A; uncertainty statement; time budget.

**Worked example:** A five-minute presentation proposes improving a school club's event registration. The opening states the current problem and the takeaway. The body explains the user friction, shows a simple process diagram, presents a small evidence sample and compares two options. The conclusion recommends a limited pilot and defines how success will be measured. In Q&A, when asked whether the proposal will double attendance, the presenter says the available evidence cannot support that forecast and explains what a pilot could test.

**Guided practice:**
1. Reduce a paragraph to one sentence that states the audience's main takeaway.
2. Arrange six information points into a logical sequence and add signposts.
3. Replace a dense slide of prose with one diagram and a spoken explanation.
4. Practise answering “What do you not know yet?” without becoming defensive.
5. Rehearse a 90-second explanation and compare actual time with the planned time.

**Independent practice:** Deliver a 3–5 minute presentation on a project, concept or recommendation. Submit a purpose/audience brief, outline, slides or visual aid, source notes, rehearsal timing, final recording or live evaluator notes, and responses to three questions including one challenging question. If recording is unavailable or undesirable, use a live presentation with an observer rubric.

**Answer guidance:** The opening should orient the audience, not delay the point. Each section should advance the key message. Cite evidence close to the claim it supports. Use readable contrast, labels and descriptions; do not rely on colour alone. If a question is unclear, ask for clarification. If the answer is unknown, state the boundary and how it could be checked.

**Common misconceptions:** More slides mean more substance; memorising every sentence is the only way to prepare; confidence proves correctness; questions are attacks; charts explain themselves; and a polished delivery can compensate for weak evidence.

**Assessment:** Score message clarity, structure, evidence, audience fit, visual accessibility, delivery intelligibility, time management and Q&A honesty separately. Independent performance is understandable and evidence-grounded. Transfer-ready performance adapts to an unfamiliar audience and handles uncertainty or challenge accurately.

**Evidence to submit:** Brief, outline, presentation artefact, source list, timing record, rubric feedback and a reflection identifying one content improvement and one delivery improvement.

**Retention:** Give short explanations regularly, then revisit the same topic for a different audience. Practise answering questions after a delay rather than memorising a fixed Q&A script.

**Progression bridge:** Teaching, technical demos, pitching, public speaking, leadership communication and stakeholder briefings.

---

## Cross-unit progression and prerequisite notes

- MATH-MOD-015 depends on functional mathematics and introductory statistics; it can support later engineering, finance and research projects.
- ENG-SWE-002 assumes a small working code project and should precede collaborative repositories, CI/CD and release workflows.
- ELEC-MEAS-002 requires safety knowledge before hands-on activity; unsafe meter connection is a hard stop, not a minor scoring deduction.
- RES-METHOD-002 builds on source evaluation and must precede learner-led studies involving people or personal data.
- LANG-ACQ-002 can be applied to any additional language; language-specific content and proficiency targets must be selected separately.
- COMM-PRES-002 builds on argument structure and should be assessed on content and delivery as distinct dimensions.

## ATHENA evidence-package guidance for this batch

A learning-session update should identify the stable unit code, source materials actually used, time spent if known, learner's own explanation/performance, task conditions (open-book, notes, AI-assisted or unaided), evaluator findings, unresolved gaps, confidence with rationale, and recommended next action. Preserve source provenance. Do not infer mastery from completion, time spent, self-rating, or AI-generated work. A proposed state transition must include evidence and remain subject to learner approval and the engine's validation rules.

## Internal review checklist

- [x] Stable unique unit codes within this batch.
- [x] Prerequisites and observable learning outcomes stated.
- [x] Concepts, examples, practice, answer guidance and misconceptions included.
- [x] Assessment and evidence submission described.
- [x] Retention and progression bridge included.
- [x] Safety boundary included for practical electronics.
- [ ] Independent subject-matter review.
- [ ] Learner pilot and accessibility review.
- [ ] Resource links checked for current availability, licensing and exact objective alignment.
- [ ] Formal exchange-schema validation by the ATHENA application importer.
