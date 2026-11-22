# Wave 1 Cross-Discipline Teaching Pack — Batch 02

**Production message:** 5 of 20  
**Disciplines:** ENG, ELEC, RES, LANG, COMM  
**Status:** Authored instructional drafts; internal structural review required; independent subject review and learner pilot pending.

These units are intentionally not another Mathematics batch. They extend five other Wave 1 disciplines. Each can be assigned by ATHENA as a learning task: the learner studies from chosen sources, submits explanations/performance, receives independent evaluation, and only then produces an evidence update for engine approval.

---

## ENG-ARCH-001 — Requirements, interfaces and acceptance tests

**Purpose:** Turn a feature request into a testable engineering contract before implementation.

**Prerequisites:** Computational problem specification; variables, conditionals and functions; basic user/task modelling.

**Core model:** A requirement states an externally meaningful need or constraint. An interface defines how two parts interact. An acceptance test describes observable conditions under which a requirement is satisfied. Requirements should be traceable: each important requirement maps to one or more tests, and each test maps back to a requirement. This prevents “it works on my phone” from becoming the only quality criterion.

**Concepts:** stakeholder; functional requirement; non-functional requirement; constraint; assumption; user story; acceptance criterion; API/interface contract; precondition; postcondition; edge case; traceability; change control.

**Worked example:** A small inventory app must allow an owner to add an item with a name and non-negative stock quantity. A vague requirement is “add products easily.” A testable version is: “Given an authenticated owner, when a valid item name and integer stock quantity ≥ 0 are submitted, the item is stored and appears in the inventory list.” Separate tests cover empty name, negative stock, duplicate item policy, unauthorised request and storage failure. The interface contract states accepted fields, types, validation rules and error responses.

**Guided practice:**
1. Rewrite “make the website faster” into measurable performance requirements, stating device/network conditions and the metric.
2. For a contact form, list valid input, invalid input, success output and failure states.
3. Draw a traceability table linking each requirement to at least one acceptance test.

**Independent practice:** Choose a small feature from a real app. Produce: (a) one-paragraph problem statement, (b) 5–8 requirements, (c) explicit assumptions, (d) interface contract, (e) normal/boundary/invalid acceptance tests, and (f) one risk that remains untested.

**Answer guidance:** A strong response makes each criterion observable and avoids implementation details unless they are constraints. “Looks good” is not testable; “primary action remains visible at 360 CSS px viewport width without horizontal scrolling” is testable. Do not invent a numeric threshold without a reason and measurement method.

**Common failure modes:**
- Writing solutions as requirements (“use MongoDB”) when the actual need is a user outcome.
- Omitting failure states and permissions.
- Writing tests that merely repeat the requirement without concrete inputs and expected outputs.
- Allowing tests to pass while the requirement itself is ambiguous.
- Failing to update tests when a requirement changes.

**Assessment:** Given a two-paragraph feature request, create a requirement set, interface contract and acceptance test matrix. Independent-level performance requires coverage of normal, boundary, invalid, permission and failure cases, with no contradictory criteria. Transfer-ready performance also identifies trade-offs, test limitations and change impact.

**Evidence to submit:** Original request, rewritten requirements, test matrix, one deliberately ambiguous criterion and its repair, plus a short explanation of how the tests trace to requirements.

**Retention and transfer:** Retrieve by converting different vague requests into testable contracts. Revisit after building a feature: compare planned acceptance tests with real defects and add missing cases. Transfer to client work, electronics specifications, research protocols and business experiments.

**Bridge:** Architecture, automated testing, API design, product management and quality assurance.

---

## ELEC-DEV-001 — Diodes, LED operating points and transistor switching

**Purpose:** Explain how semiconductor devices control current and use that understanding to design and analyse a simple low-voltage switching circuit.

**Prerequisites:** Voltage/current/resistance; Ohm's law; series circuits; resistor power; safe multimeter use; polarity and schematic symbols.

**Safety boundary:** This learning unit is conceptual and uses low-voltage, current-limited battery or bench-supply examples only. No mains wiring, exposed high-energy batteries, improvised chargers or unsupervised high-current loads. Practical work requires an appropriate adult/supervisor, correctly rated components and a current-limited supply. A simulator is an acceptable first demonstration.

**Core model:** A diode is a nonlinear semiconductor device whose current depends strongly on polarity and applied voltage. An LED emits light when forward current passes through its junction; it needs current limiting. A transistor can act as a controlled switch: a small control signal changes whether a larger load current can flow, within the device's voltage/current/thermal ratings. Real devices have non-ideal forward voltage, leakage, switching limits and thermal constraints.

**Concepts:** PN junction; forward/reverse bias; forward voltage; current limiting; LED polarity; transistor base/gate control; saturation/cutoff; MOSFET gate; load; flyback diode; datasheet absolute maximum; thermal dissipation.

**Worked example A — LED resistor:** A nominal 5 V supply drives an LED with assumed forward voltage 2.0 V at a target current of 8 mA. The resistor estimate is R=(5.0−2.0)/0.008=375 Ω. Choose a standard value at or above this estimate, such as 390 Ω, then calculate current using the actual assumed values: I=3/390≈7.69 mA. Resistor dissipation is P=I²R≈0.023 W, so a suitably rated resistor with margin is selected. This is an estimate; actual LED forward voltage and supply tolerance matter.

**Worked example B — transistor as a switch:** A microcontroller output cannot necessarily supply the current required by a motor. A suitable logic-level MOSFET can switch a separately powered low-voltage motor if its gate-drive, drain current, voltage, thermal and safe-operating-area ratings are appropriate. The grounds and supply arrangement must follow the circuit design. An inductive load requires a suitable flyback path. The MOSFET is not selected from headline current alone; thermal resistance, gate voltage and transient ratings matter.

**Guided practice:**
1. Mark an LED's anode/cathode and show the conventional current path.
2. Recalculate the LED resistor for a 9 V source, assumed 2 V LED drop and 10 mA target; state why the result is approximate.
3. Explain why a microcontroller pin should not directly drive an arbitrary motor.
4. In a simulator, compare a transistor switch in cutoff and conducting states; record control input and load behaviour.

**Independent practice:** Given a datasheet excerpt for a low-voltage LED and switching transistor, identify the relevant operating and absolute-maximum ratings. Design a current-limited indicator and a conceptual low-voltage switched-load schematic. State assumptions, expected current, power, protection and what must be verified before construction.

**Answer guidance:** For the 9 V example, R=(9−2)/0.01=700 Ω; select a suitable standard value at or above the calculated value, then recompute current. A 750 Ω resistor gives about 9.33 mA under the assumptions. The correct answer must mention that supply and forward-voltage tolerances affect current. A transistor's maximum rating is not a recommended continuous operating point.

**Common failure modes:**
- Connecting an LED directly to a voltage source without current limiting.
- Reversing diode polarity or assuming a diode is an ideal one-way wire.
- Choosing a transistor only by maximum current headline.
- Ignoring gate/base drive conditions and heat.
- Omitting protection for inductive loads.
- Treating a simulator result as proof that a physical build is safe.

**Assessment:** Interpret a device datasheet, calculate a current-limiting resistor, identify polarity and propose a safe low-voltage switching topology. Independent-level performance includes correct units, explicit assumptions, margin and a clear explanation of unverified practical constraints. No learner is asked to work on mains or high-energy systems.

**Evidence to submit:** Annotated schematic, calculation with units, selected datasheet limits, risk checklist and simulator or supervised low-voltage test observations.

**Retention and transfer:** Retrieve polarity, current limiting and device-rating checks before each design. Transfer to sensor interfaces, microcontroller outputs, relay drivers and product reliability; always re-check the actual component datasheet.

**Bridge:** Digital electronics, embedded systems, power electronics and PCB design.

---

## RES-EVAL-001 — Evaluating sources, claims and evidence strength

**Purpose:** Judge whether a source is appropriate for a specific claim, rather than treating search ranking, confidence or polished presentation as proof.

**Prerequisites:** Distinguish claim, evidence and opinion; basic probability; ability to record source details and paraphrase accurately.

**Core model:** Source quality is claim-relative. A source can be authoritative for one question and weak for another. Evaluation considers provenance, expertise, method, transparency, recency where relevant, conflicts of interest, directness, corroboration and uncertainty. Evidence strength depends on how the information was produced and whether the design supports the claim. A personal anecdote can establish that an experience occurred; it usually cannot estimate population frequency or establish causation.

**Concepts:** primary/secondary source; provenance; expertise; method; sample; measurement; bias; conflict of interest; peer review; replication; triangulation; causal claim; uncertainty; publication date; version; citation chain.

**Worked example:** A viral post says a study proves a learning app doubles exam performance. The post is not the original study. Trace to the paper, identify population and sample size, comparison group, outcome measure, duration, attrition, effect size and uncertainty. Ask whether allocation was random, whether groups differed at baseline, and whether the measured test represents broad learning. If the study is observational or only reports a small uncontrolled before/after change, “proves the app doubles performance” is too strong. A defensible summary states what was measured, in whom, under what conditions and with what limitations.

**Guided practice:**
1. Separate a paragraph into factual claims, interpretations and recommendations.
2. For each claim, record the source closest to the underlying evidence.
3. Compare two sources that disagree; identify whether they use different populations, dates, definitions or methods.
4. Rewrite an overconfident causal statement as a bounded claim.

**Independent practice:** Investigate a question of your choice using at least three sources of different types. Build a claim-evidence table with: exact claim, source, method, population/context, date, limitations, corroboration and confidence rationale. Include one credible source that challenges your initial view.

**Answer guidance:** Do not score sources by a single universal hierarchy. A government dataset may be strong for official counts but not necessarily for causal explanation; a peer-reviewed paper may still have weak design; a recent source may be less relevant than a well-designed older study for a stable concept. “Three websites repeat it” is not triangulation if all copy the same press release.

**Common failure modes:**
- Confusing popularity, professional design or confident language with reliability.
- Citing a secondary summary when the primary evidence is accessible, without noting the chain.
- Treating peer review as a guarantee of truth.
- Ignoring denominator, sample selection, missing data or measurement validity.
- Claiming causation from correlation or from an uncontrolled before/after comparison.
- Omitting evidence that would weaken the preferred conclusion.

**Assessment:** Given a contested claim and a packet of sources, produce a source map, evaluate evidence strength, identify missing information and write a calibrated conclusion. Independent-level performance distinguishes source reliability from claim support. Transfer-ready performance also proposes a feasible method to resolve the most important uncertainty.

**Evidence to submit:** Claim-evidence matrix, source trail, one counter-source, conclusion with confidence and limitations, and a short note on what evidence would change the conclusion.

**Retention and transfer:** Use a source-evaluation checklist on real research, business claims, health claims, technology comparisons and public policy. Reassess when evidence or context changes; do not treat confidence as permanent.

**Bridge:** Research design, statistics, scientific reasoning, media literacy and decision analysis.

---

## LANG-STRUCT-001 — How language is structured: sounds, words, sentences and meaning

**Purpose:** Build a usable linguistic model for analysing language, learning additional languages and understanding why literal translation often fails.

**Prerequisites:** Ability to read a short passage in a familiar language; basic awareness that languages have different sound and word patterns.

**Core model:** Language operates across interacting levels. Phonetics studies the physical production and perception of speech sounds; phonology studies how a language organises sound contrasts and patterns. Morphology studies meaningful word parts. Syntax studies how words combine into phrases and sentences. Semantics studies conventional meaning; pragmatics studies meaning in context, including speaker intention, shared knowledge and social relationship. These levels interact, and languages vary: a pattern in English should not be assumed universal.

**Concepts:** phoneme; allophone; syllable; stress; tone; morpheme; root; affix; inflection; derivation; word class; phrase; clause; word order; agreement; ambiguity; semantic relation; implicature; register.

**Worked example:** Compare “The dog chased the cat” with “The cat chased the dog.” The same lexical items appear, but syntax changes who performs the action and who receives it. Now compare “Could you open the window?” Literally it asks about ability, but in many contexts pragmatics interprets it as a polite request. Meaning therefore cannot be reduced to dictionary definitions alone.

**Guided practice:**
1. Divide a familiar word into root and affixes where possible; explain how each part contributes meaning.
2. Identify subject, verb and object in three sentences, then change word order and describe the meaning change.
3. Find an utterance whose intended meaning differs from its literal form; state the contextual clues.
4. Compare a sound contrast in two languages without assuming the same phoneme inventory.

**Independent practice:** Choose a short paragraph in a language you know. Annotate one example each of sound/spelling correspondence (where relevant), word formation, sentence structure, literal meaning and context-dependent meaning. Then explain one feature that would be difficult to translate directly into another language.

**Answer guidance:** Linguistic labels depend on the language and analysis framework. Not every written letter corresponds to one sound; not every word can be divided transparently into morphemes; word order patterns are not identical across languages. Use examples and explain the analysis rather than forcing a label.

**Common failure modes:**
- Equating letters with sounds.
- Assuming every language uses the same word classes or word order.
- Treating translation as word-for-word substitution.
- Confusing a word's conventional meaning with what a speaker implies in context.
- Treating a dialect or accent difference as evidence of inferior language ability.

**Assessment:** Analyse a short unfamiliar-but-accessible language sample with a supplied glossary. Identify structural patterns, explain an ambiguity and interpret a context-sensitive utterance. Independent-level performance distinguishes at least three linguistic levels and supports claims with examples; transfer-ready performance compares languages without assuming one is the norm.

**Evidence to submit:** Annotated sample, short analysis, one ambiguity with two possible readings, and a reflection on what additional context would resolve it.

**Retention and transfer:** Retrieve linguistic levels using new examples rather than memorised definitions. Apply the framework to language learning, translation, reading comprehension, pronunciation feedback and clear technical writing.

**Bridge:** Phonetics, grammar, semantics, pragmatics, second-language acquisition and translation studies.

---

## COMM-ARG-001 — Building and testing an evidence-based argument

**Purpose:** Construct arguments that make clear claims, use relevant evidence, connect evidence to conclusions and respond fairly to counterarguments.

**Prerequisites:** Reading comprehension; ability to distinguish a claim from an example; basic source evaluation.

**Core model:** An argument is not merely a strong opinion. It is a structured relationship among a claim, supporting grounds, a warrant explaining why those grounds support the claim, backing for the warrant, qualifiers that limit scope, and rebuttals addressing serious objections. A sound argument depends on both logical structure and evidence quality. Persuasive delivery cannot repair false premises or invalid inference.

**Concepts:** thesis; claim; premise; evidence; warrant; backing; qualifier; rebuttal; counterargument; validity; soundness; inductive strength; analogy; causal reasoning; audience; burden of proof; steelmanning.

**Worked example:** Claim: “A school should provide a quiet study area.” Evidence: a student survey reports that many learners lack a quiet place at home. Warrant: access to a quiet environment can make some study tasks easier. Qualifier: “A quiet area may help learners who need a low-distraction space; it will not solve every learning barrier.” Counterargument: space and supervision cost money. Rebuttal: pilot the area in an existing room at limited hours and evaluate usage before expanding. The argument is stronger because it avoids claiming that a room automatically improves every student's grades.

**Guided practice:**
1. Mark claim, evidence and warrant in a short editorial.
2. Identify an unsupported leap between evidence and conclusion.
3. Write the strongest fair version of an opposing argument before responding.
4. Add a qualifier to an overgeneralised claim.

**Independent practice:** Choose a low-stakes policy or product question. Write a 400–600 word argument with a clear thesis, at least two independently sourced pieces of evidence, explicit reasoning, a serious counterargument, a fair response and a limitation. Keep fact claims separate from value judgements.

**Answer guidance:** A statistic is not automatically relevant; explain what it measures and why it bears on the claim. A counterargument is not answered by insulting its supporter. If evidence is mixed, narrow the thesis. If the claim depends on values, name the value trade-off rather than pretending data alone settles it.

**Common failure modes:**
- Straw-manning an opponent.
- Cherry-picking evidence or using a source that does not support the sentence attached to it.
- Treating correlation as causation.
- Using an analogy as proof rather than illustration.
- Overstating certainty or scope.
- Confusing rhetorical confidence with logical validity.

**Assessment:** Given a controversial but low-stakes prompt and a source packet, produce a structured argument and then annotate its claim, evidence, warrant, qualifier and rebuttal. Independent-level performance uses relevant evidence and addresses a genuine objection; transfer-ready performance adapts the argument to a different audience without changing the underlying facts.

**Evidence to submit:** Draft, source list, argument map, counterargument, revision notes and a brief oral or written defence under questions.

**Retention and transfer:** Practise argument mapping on editorials, product decisions, project proposals and everyday disagreements. Revisit after feedback by identifying whether the weakness was evidence, inference, scope, audience adaptation or delivery.

**Bridge:** Debate, public speaking, negotiation, critical reading, policy analysis and leadership.
