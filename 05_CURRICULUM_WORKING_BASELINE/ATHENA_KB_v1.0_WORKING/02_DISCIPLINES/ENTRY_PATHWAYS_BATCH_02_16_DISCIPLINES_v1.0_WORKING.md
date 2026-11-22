# ATHENA Macro Curriculum — Large Entry-to-Intermediate Build Batch

**Status:** Working curriculum content; draft pending subject review and schema mapping.
**Scope:** Four authored entry modules for each of the 16 disciplines not covered by the first ENG/BIZ pathway batch (64 modules). These are real starting units, not complete discipline coverage.


---

# ELEC — Electronics & Hardware


## ELEC-01 — Electrical quantities, units and safe measurement

**Core model:** Voltage is potential difference, current is charge flow, resistance opposes current, and power is the rate of energy transfer. A circuit model is only useful when the reference points, units and measurement conditions are explicit.

**Worked example:** A 9 V source across a 1 kΩ resistor ideally gives I=V/R=9 mA. A meter in current mode belongs in series; a voltmeter is placed across the component.

**Guided and independent practice:** Draw a low-voltage battery-resistor-LED circuit; predict polarity and current path; identify meter mode and connection before touching the circuit.

**Assessment and evidence:** Given a low-voltage circuit diagram and a multimeter, explain the measurement plan, identify hazards, and record a plausible reading with units. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Voltage is not “used up”; current is not consumed by a series component; meter modes are not interchangeable.

**Bridge:** Basic circuit analysis and component selection.


## ELEC-02 — Series, parallel and circuit diagrams

**Core model:** A circuit diagram is a symbolic model of connected nodes and components. Series elements share one current path; parallel branches share the same two nodes and have the same voltage across them.

**Worked example:** Two 1 kΩ resistors in series give 2 kΩ total; in parallel they give 500 Ω. The same component values produce different circuit behaviour because topology changes.

**Guided and independent practice:** Redraw a physical low-voltage circuit as a schematic; calculate equivalent resistance; predict what happens when one branch opens.

**Assessment and evidence:** Analyse three unseen series/parallel networks and verify one with a safe low-voltage simulator or supervised kit. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Physical closeness on a page does not mean electrical connection; parallel does not mean “side by side” visually.

**Bridge:** Ohm’s law, Kirchhoff rules and circuit troubleshooting.


## ELEC-03 — Resistors, LEDs, diodes and capacitors

**Core model:** Components have characteristic current-voltage behaviour and limits. A resistor constrains current, an LED emits light under forward bias, a diode conducts preferentially one way, and a capacitor stores energy in an electric field.

**Worked example:** For a 5 V supply, red LED drop near 2 V and target 10 mA, an approximate resistor is (5−2)/0.01=300 Ω; choose a suitable standard value and check power rating.

**Guided and independent practice:** Read resistor colour bands; identify LED polarity; select a current-limiting resistor from stated assumptions; compare capacitor charge/discharge curves in simulation.

**Assessment and evidence:** Design and explain a safe, current-limited LED indicator on a low-voltage supply; justify component values and tolerances. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** An LED is not a bare lamp that can always connect directly to a supply; capacitor polarity and voltage ratings matter.

**Bridge:** Transistors, switching, timing and power calculations.


## ELEC-04 — Breadboards, debugging and build documentation

**Core model:** A reliable build is reproducible: the schematic, physical layout, component values, supply limits and observed symptoms must agree. Debugging changes one variable at a time and tests hypotheses.

**Worked example:** If an LED fails, test supply voltage, rail continuity, LED polarity, resistor placement and breadboard row connectivity in a controlled sequence rather than randomly moving wires.

**Guided and independent practice:** Build a low-voltage LED circuit with supervision; photograph and annotate it; introduce a known safe fault in a simulator and diagnose it systematically.

**Assessment and evidence:** A peer should be able to reconstruct the circuit from your diagram, parts list and notes; you must also identify the cause of a seeded fault. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Changing several things at once destroys diagnostic information; a working circuit without documentation is difficult to reproduce.

**Bridge:** Transistor switching, microcontrollers and PCB design.


---

# FIN — Finance & Economics


## FIN-01 — Money, budgeting and cash-flow records

**Core model:** A budget is a plan; cash flow is the timing of money entering and leaving. Profit, cash and account balance are different quantities. Records should separate personal funds, business funds, revenue, cost and owner contributions.

**Worked example:** Selling a digital item for ৳85 after a ৳60.50 purchase gives ৳24.50 gross spread before fees, refunds, hosting, time and other overhead. Cash received is not automatically profit.

**Guided and independent practice:** Create a one-month mock ledger; classify each transaction; reconcile opening balance + inflows − outflows to closing balance.

**Assessment and evidence:** Given a small simulated shop ledger, produce a cash summary, identify missing entries and calculate gross margin and net result under stated assumptions. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Revenue is not profit; cash balance is not profitability; an unpaid invoice is not cash received.

**Bridge:** Accounting statements, pricing and unit economics.


## FIN-02 — Percentages, interest, inflation and time value

**Core model:** Percentages describe a change relative to a defined base. Compounding applies growth to the changing balance; inflation changes purchasing power. Nominal and real returns differ.

**Worked example:** ৳1,000 growing 10% then 10% becomes ৳1,210, not ৳1,200. A 10% price rise followed by a 10% fall does not restore the original price.

**Guided and independent practice:** Compare simple and compound growth tables; calculate percentage change with explicit base; adjust a hypothetical amount for inflation.

**Assessment and evidence:** Explain a two-period compound-growth problem and distinguish nominal gain from purchasing-power change. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Percentage points and percent change are not interchangeable; a return is not guaranteed; inflation is not uniform across every household.

**Bridge:** Risk, valuation and macroeconomics.


## FIN-03 — Accounting basics and unit economics

**Core model:** Accounting classifies transactions so that performance and position can be inspected. Unit economics asks whether one additional sale creates positive contribution after variable costs.

**Worked example:** If price is ৳85, variable acquisition cost ৳60.50 and payment fee ৳2, contribution is ৳22.50 before fixed costs. Monthly hosting is fixed overhead for the period.

**Guided and independent practice:** Classify revenue, cost of goods, fees, fixed cost, asset and liability in a sample business; calculate contribution per unit and break-even volume.

**Assessment and evidence:** Prepare a simple income statement from a supplied ledger and defend the break-even calculation. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** A positive contribution does not guarantee overall profit; sunk costs should not distort forward decisions.

**Bridge:** Cash-flow forecasts, pricing experiments and financial statements.


## FIN-04 — Risk, diversification and decision quality

**Core model:** Risk is uncertainty about outcomes, not merely the chance of losing money. Diversification reduces exposure to some idiosyncratic risks but cannot eliminate market-wide risk. Expected return is not a promise.

**Worked example:** A concentrated investment can fail due to one company-specific event; a diversified basket reduces that single-name exposure but still falls during broad market stress.

**Guided and independent practice:** Compare scenarios with different probability and impact; calculate a simple expected value; identify liquidity, concentration and fraud risks.

**Assessment and evidence:** Evaluate a fictional investment proposal by listing assumptions, downside, liquidity, diversification and evidence gaps; do not recommend action from return claims alone. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Past performance guarantees nothing; higher advertised return is not proof of better opportunity; diversification does not make risk disappear.

**Bridge:** Portfolio theory, valuation and behavioural finance.


---

# BODY — Body Science & Anatomy


## BODY-01 — Cells, tissues and levels of organisation

**Core model:** The body is organised from cells to tissues, organs and organ systems. Structure constrains function, while feedback loops coordinate systems. A model is simplified and does not capture every individual variation.

**Worked example:** Muscle tissue contains cells specialised for contraction; organised muscle, connective tissue, nerves and blood vessels form an organ that works with skeletal and nervous systems.

**Guided and independent practice:** Map one familiar action, such as standing up, across muscle, bone, nerve, circulation and energy supply.

**Assessment and evidence:** Explain a body function using at least three interacting levels and distinguish a tissue from an organ. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Organs do not operate independently; a diagram is not a complete account of biological variation.

**Bridge:** Physiology and biomechanics.


## BODY-02 — Homeostasis and feedback systems

**Core model:** Homeostasis is dynamic regulation around viable ranges, not a perfectly fixed internal number. Negative feedback counteracts deviation; positive feedback amplifies a process until a stopping event.

**Worked example:** Thermoregulation uses sensors, control centres and effectors: sweating and changes in skin blood flow help regulate temperature.

**Guided and independent practice:** Draw a feedback loop for temperature or blood glucose; label sensor, control centre, effector and response.

**Assessment and evidence:** Given an unfamiliar regulation example, identify feedback type and predict what happens when one component is impaired. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Negative feedback does not mean “bad”; homeostasis is not a static set point.

**Bridge:** Endocrine, nervous and exercise physiology.


## BODY-03 — Biomechanics: force, leverage and movement

**Core model:** Movement emerges from forces, joint constraints, muscle action and external conditions. Torque depends on force and moment arm; technique changes load distribution.

**Worked example:** Holding a weight farther from the elbow increases the external moment even if the weight is unchanged, because the moment arm is longer.

**Guided and independent practice:** Analyse a safe everyday movement using a stick-figure diagram; identify joints, direction of force and a lever arm.

**Assessment and evidence:** Explain why changing object distance changes joint demand, without diagnosing an injury or prescribing treatment. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** More force is not always more effective; a simplified lever model omits tissue complexity and movement dynamics.

**Bridge:** Strength training, sport technique and injury-prevention literacy.


## BODY-04 — Nutrition, sleep, recovery and evidence

**Core model:** Nutrition supplies energy and materials; sleep supports multiple regulatory and learning processes; recovery adapts to load. Individual needs vary with development, activity and context.

**Worked example:** A training plan must account for session demand, rest, food availability and sleep; increasing workload without recovery can reduce performance.

**Guided and independent practice:** Compare two fictional weekly schedules and identify mismatches between training load, recovery and available food/sleep.

**Assessment and evidence:** Critique a health claim by checking population, evidence type, magnitude, uncertainty and whether it applies to adolescents. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** One food or supplement does not determine health; correlation does not prove a diet caused an outcome; online body targets are not universal.

**Bridge:** Exercise physiology and research literacy.


---

# PSY — Psychology & Strategy


## PSY-01 — Observation, interpretation and inference

**Core model:** Psychological reasoning separates what was observed from the explanation proposed. A behaviour can have multiple causes, and one observation rarely identifies intent or stable traits.

**Worked example:** “They did not reply for two hours” is an observation; “they dislike me” is one possible inference, not an established fact.

**Guided and independent practice:** Write an observation/inference table for neutral scenarios; generate at least two alternative explanations.

**Assessment and evidence:** Analyse a short case without mind-reading; state evidence, uncertainty and what additional observation would discriminate explanations. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Confidence is not evidence; a single behaviour does not establish personality or motive.

**Bridge:** Cognitive biases and social psychology.


## PSY-02 — Attention, memory and cognitive load

**Core model:** Working memory is limited; attention is selective; retrieval and meaningful organisation support learning. Cognitive load rises when many unfamiliar elements must be processed simultaneously.

**Worked example:** A worked example can reduce unnecessary search for a novice, while a partially completed example can gradually shift effort to the learner.

**Guided and independent practice:** Compare a dense instruction sheet with a segmented version; identify intrinsic, extraneous and productive processing demands.

**Assessment and evidence:** Redesign a short learning task to reduce avoidable load without removing the core thinking. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Multitasking does not mean full parallel attention; rereading can feel fluent without producing retrievable knowledge.

**Bridge:** Learning science and instructional design.


## PSY-03 — Biases, heuristics and calibration

**Core model:** Heuristics are efficient shortcuts that can create systematic errors. Bias analysis is a tool for checking decisions, not a label to dismiss people.

**Worked example:** Confirmation bias can lead someone to search only for evidence supporting a preferred product; a pre-mortem deliberately asks how the decision could fail.

**Guided and independent practice:** For a chosen decision, write a prediction, list disconfirming evidence and identify a base rate.

**Assessment and evidence:** Review a decision after outcomes arrive and compare predicted confidence with actual accuracy. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Knowing a bias name does not make someone immune; hindsight makes outcomes seem more predictable than they were.

**Bridge:** Decision theory and forecasting.


## PSY-04 — Strategic decisions and game theory basics

**Core model:** A strategic choice depends partly on what other actors choose. Incentives, information, repeated interaction and credible commitments shape outcomes.

**Worked example:** Two sellers choosing price can face different outcomes depending on whether customers compare prices and whether competitors can observe changes.

**Guided and independent practice:** Model a simple payoff table for two choices; identify dominant strategies if any and discuss assumptions.

**Assessment and evidence:** Explain a strategic situation, identify players/actions/payoffs and state how repeated interaction could change incentives. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Game theory does not predict people perfectly; a payoff table reflects assumptions, not objective human value.

**Bridge:** Negotiation, management and market strategy.


---

# AEST — Aesthetics & Visual Design


## AEST-01 — Visual hierarchy and composition

**Core model:** Visual hierarchy guides attention through size, contrast, position, spacing, alignment and repetition. Composition creates relationships between elements rather than merely decorating a page.

**Worked example:** A landing page with one clear headline, one primary action and supporting evidence has a stronger hierarchy than five equally loud buttons.

**Guided and independent practice:** Annotate three designs for focal point, reading order, alignment and spacing; redesign one cluttered layout.

**Assessment and evidence:** A viewer should identify the intended primary message and next action quickly; justify the hierarchy choices. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** More effects do not create more hierarchy; colour alone cannot carry all meaning.

**Bridge:** Typography, layout systems and interface design.


## AEST-02 — Typography and readable information

**Core model:** Type choices affect legibility, tone and information structure. A type scale, line length, spacing and contrast should form a coherent system.

**Worked example:** A heading scale with consistent ratios and adequate line spacing makes sections scannable; using many unrelated fonts increases noise.

**Guided and independent practice:** Build a one-page type specimen with heading, body, caption and emphasis styles; test on a phone at enlarged text size.

**Assessment and evidence:** Evaluate a page for hierarchy, line length, contrast and responsive readability, then revise it. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** A fashionable font is not automatically readable; small text and low contrast are not premium design.

**Bridge:** Design systems and editorial layout.


## AEST-03 — Colour, contrast and accessibility

**Core model:** Colour has perceptual, cultural and functional roles. Contrast supports legibility; colour meaning must be reinforced with labels, shapes or patterns.

**Worked example:** A red/green status pair becomes ambiguous for some users; adding icons and text makes the state understandable without colour perception.

**Guided and independent practice:** Create a small palette and test text contrast; convert a status UI to grayscale and check whether meaning remains clear.

**Assessment and evidence:** Produce an accessible palette and explain contrast, redundancy and context limitations. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** A colour palette is not an accessibility audit; hue difference alone may not provide sufficient contrast.

**Bridge:** Brand systems and accessible UI.


## AEST-04 — Design process, critique and iteration

**Core model:** Design is a problem-solving process: define users and constraints, explore options, prototype, test and revise. Critique should identify effects and evidence, not just taste.

**Worked example:** If users miss a primary action, observe where attention goes, form a hypothesis, change one variable and retest.

**Guided and independent practice:** Create two low-fidelity alternatives for the same task; run a small usability check and record observed friction.

**Assessment and evidence:** Present a design rationale, evidence from testing and a prioritized revision list. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** A personal preference is not user evidence; polishing before validating the problem can waste effort.

**Bridge:** Product design and creative direction.


---

# WORK — Workflow & Productivity


## WORK-01 — Information capture and file systems

**Core model:** A useful information system makes items findable, understandable and recoverable. Names, folders, metadata and stable IDs should reduce ambiguity without excessive categorisation.

**Worked example:** A project folder with `brief`, `assets`, `source`, `exports` and `archive` separates working material from deliverables.

**Guided and independent practice:** Design a folder structure for a small website; create consistent file names and a short README.

**Assessment and evidence:** A second person should locate the latest source, asset and final export without asking for clarification. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Deep folder nesting is not automatically organisation; duplicate “final-final” files create ambiguity.

**Bridge:** Version control and knowledge management.


## WORK-02 — Task decomposition and estimation

**Core model:** A task becomes actionable when its next observable step, dependency and done condition are clear. Estimates improve when work is decomposed and compared with actual elapsed time.

**Worked example:** “Build website” becomes “list pages”, “create wireframe”, “implement navigation”, “test mobile layout”; each has an observable output.

**Guided and independent practice:** Break a real but low-risk task into steps; estimate each; record actual duration and revise future estimates.

**Assessment and evidence:** Produce a plan with dependencies, checkpoints, risks and a definition of done; explain the largest uncertainty. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** A to-do list is not a plan; estimates are predictions, not commitments or moral judgments.

**Bridge:** Project management and operations.


## WORK-03 — Version control and change traceability

**Core model:** Version control records changes to files over time. A commit should represent a coherent change; a diff makes the exact modification inspectable.

**Worked example:** Before editing a configuration value, inspect status and diff; after editing, verify only intended lines changed.

**Guided and independent practice:** Practise `status`, `diff`, `add`, `commit` and branch basics in a disposable repository.

**Assessment and evidence:** Given a small repository, identify uncommitted changes, explain a diff and recover a previous version safely. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** A commit is not a backup by itself; pushing can publish secrets if files are not reviewed.

**Bridge:** Collaboration, release engineering and reproducible work.


## WORK-04 — Automation, checklists and feedback loops

**Core model:** Automation is worthwhile when a repeated process is stable and exceptions are understood. A checklist externalises critical steps; it should support judgement rather than replace it.

**Worked example:** Automating a weekly report is safe only after inputs, transformations, failure cases and verification steps are explicit.

**Guided and independent practice:** Map a repeated task; identify stable steps and exceptions; automate one reversible step and compare outputs.

**Assessment and evidence:** Demonstrate that the automated result matches a manual sample and describe failure detection and rollback. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Automating a broken process makes errors faster; checklists should not become blind rituals.

**Bridge:** Data pipelines and systems thinking.


---

# ART — Artistic Development


## ART-01 — Observation, shape and proportion

**Core model:** Drawing begins by simplifying a subject into large shapes and spatial relationships. Proportion is comparative: parts are judged against one another rather than from memory alone.

**Worked example:** A bottle can be blocked as a centre line, top ellipse, body rectangle and base ellipse before details are added.

**Guided and independent practice:** Draw three everyday objects using only large shapes; compare angles and relative widths against observation.

**Assessment and evidence:** Produce a recognisable structural sketch with measured proportions before adding detail. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Outlining details too early hides structural errors; symbols from memory can override what is actually seen.

**Bridge:** Perspective, form and anatomy.


## ART-02 — Line, value and three-dimensional form

**Core model:** Line describes edges and direction; value describes lightness; form emerges when value and contour communicate volume. A light source creates predictable highlight, midtone, core shadow and cast shadow relationships.

**Worked example:** A sphere under one lamp has a highlight, gradual value transition, terminator, reflected light and cast shadow.

**Guided and independent practice:** Shade a sphere, cube and cylinder from one consistent light direction; label each value region.

**Assessment and evidence:** Draw a simple still life with consistent light logic and readable volume. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Outlines alone do not create form; reflected light should not become brighter than the light source.

**Bridge:** Perspective, material rendering and lighting.


## ART-03 — Perspective and spatial construction

**Core model:** Perspective systems represent three-dimensional space on a two-dimensional surface. Horizon, eye level and vanishing points organise parallel directions in the scene.

**Worked example:** In one-point perspective, edges receding perpendicular to the picture plane converge toward one vanishing point on the horizon.

**Guided and independent practice:** Construct a box and simple room using one-point then two-point perspective; check verticals and convergence.

**Assessment and evidence:** Draw an unfamiliar box arrangement with consistent perspective and explain the chosen system. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Not every line converges to the same point; the horizon is eye level, not necessarily the physical horizon.

**Bridge:** Environment design and visual storytelling.


## ART-04 — Reference use and original composition

**Core model:** Reference supports observation of anatomy, materials, lighting and design. Originality comes from selection, transformation and deliberate relationships, not avoiding reference.

**Worked example:** Combine a pose reference, lighting reference and material study into a new composition while recording what was borrowed and changed.

**Guided and independent practice:** Create a reference board with source notes; produce thumbnails exploring different focal points and silhouettes.

**Assessment and evidence:** Present a composition with clear focal hierarchy and explain how references informed, but did not dictate, the result. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Copying a reference without understanding does not build transferable skill; reference provenance matters.

**Bridge:** Concept art and visual development.


---

# ATH — Athletics & Physical Performance


## ATH-01 — Movement literacy and warm-up

**Core model:** Movement quality depends on coordination, joint control, balance and appropriate preparation. A warm-up progressively raises readiness; it is not a guarantee against injury.

**Worked example:** A football warm-up can progress from easy movement to dynamic mobility, acceleration preparation and ball-specific actions.

**Guided and independent practice:** Build a short warm-up sequence for a low-intensity practice and identify the purpose of each phase.

**Assessment and evidence:** Demonstrate controlled movement at a suitable intensity and explain when to reduce or stop activity. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Stretching harder is not always better; warm-up should match the upcoming task and conditions.

**Bridge:** Strength, speed and sport-specific skill.


## ATH-02 — Strength, power and progressive loading

**Core model:** Strength is the capacity to produce force; power is force produced over time. Adaptation depends on appropriate stimulus, technique, recovery and progression.

**Worked example:** A jump requires rapid force production; a controlled bodyweight squat emphasizes movement control and force through a larger time window.

**Guided and independent practice:** Compare movement quality across unloaded patterns; record repetitions only when technique remains consistent.

**Assessment and evidence:** Explain how load, repetitions, rest and movement quality affect a training plan; identify unsafe progression. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** More volume is not always better; training to exhaustion is not required for every session.

**Bridge:** Periodisation and performance testing.


## ATH-03 — Aerobic endurance, pacing and recovery

**Core model:** Aerobic systems support sustained work. Pacing manages effort relative to duration and current capacity; recovery is part of training rather than lost time.

**Worked example:** Starting a run too fast can force early slowing; an even effort may produce better total performance.

**Guided and independent practice:** Use a comfortable talk-test pace during an appropriate session; record perceived effort and recovery.

**Assessment and evidence:** Plan a gradual endurance progression with rest days and explain how intensity is monitored. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** A single time trial does not define fitness; pain, dizziness or unusual symptoms are reasons to stop and seek appropriate help.

**Bridge:** Energy systems and sport conditioning.


## ATH-04 — Football scanning, decision and execution

**Core model:** Football performance combines perception, anticipation, technical execution and decision-making under pressure. Scanning gathers information before the ball arrives.

**Worked example:** A midfielder checks shoulder space before receiving, adjusts body orientation and selects a pass based on pressure and available teammates.

**Guided and independent practice:** Practise receiving with a pre-scan cue; use a partner to vary pass direction and pressure gradually.

**Assessment and evidence:** In a small-sided or controlled drill, demonstrate scanning, first-touch direction and a justified next action—not merely a completed pass. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Head-down control reduces available information; a technically perfect pass can still be a poor decision.

**Bridge:** Tactical awareness and match analysis.


---

# PERF — Vocal & Performance Arts


## PERF-01 — Breath, posture and vocal health

**Core model:** Voice production coordinates airflow, vocal-fold vibration and resonance. Efficient speech does not require maximal volume or forced breath. Vocal health includes rest, hydration and avoiding painful strain.

**Worked example:** A speaker can improve audibility through clear articulation and room-aware projection rather than shouting.

**Guided and independent practice:** Record a short passage at comfortable volume; note breath interruptions, tension and intelligibility.

**Assessment and evidence:** Deliver a short explanation clearly without pain, hoarseness or forced volume; stop if discomfort develops. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** More air is not always better; pushing through pain is not vocal training.

**Bridge:** Resonance, pitch and expressive delivery.


## PERF-02 — Pitch, rhythm and auditory discrimination

**Core model:** Pitch is perceived frequency; rhythm organises events in time. Ear training improves through focused comparison and feedback, not guesswork alone.

**Worked example:** Compare two notes and identify whether the second is higher or lower before attempting exact note naming.

**Guided and independent practice:** Use a reference tone to practise higher/lower matching; tap steady beats at slow and moderate tempos.

**Assessment and evidence:** Reproduce a short pitch contour or rhythm pattern and identify errors from a recording. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Perfect pitch is not required; loudness and pitch are different properties.

**Bridge:** Intonation, harmony and musical phrasing.


## PERF-03 — Articulation, pacing and expressive phrasing

**Core model:** Intelligibility depends on consonant clarity, vowel shape, pace, pauses and phrase grouping. Expression changes emphasis while preserving meaning.

**Worked example:** A pause before a key contrast can clarify a sentence more effectively than speaking faster or louder.

**Guided and independent practice:** Read the same paragraph with different punctuation and emphasis; record and compare intelligibility.

**Assessment and evidence:** Deliver a one-minute passage with clear phrase boundaries, appropriate pace and accurate wording. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Over-articulation can sound unnatural; speed is not the same as fluency.

**Bridge:** Public speaking and performance interpretation.


## PERF-04 — Recording and performance feedback

**Core model:** A recording creates evidence for self-review but microphone placement, room acoustics and device processing affect the result. Feedback should target one controllable variable at a time.

**Worked example:** A phone placed close to a quiet speaker may capture clearer speech than digital amplification from far away, provided plosives and clipping are controlled.

**Guided and independent practice:** Record in a quiet room at two distances; compare noise, clipping and clarity; revise one variable.

**Assessment and evidence:** Produce a clean short recording and annotate what improved and what remains uncertain. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** A waveform that looks large is not proof of quality; editing cannot replace clear source capture.

**Bridge:** Audio production and stagecraft.


---

# MATH — Mathematics & Scientific Reasoning


## MATH-01 — Algebra, equations and functions

**Core model:** Algebra expresses relationships with symbols. An equation asserts equality; transformations must preserve that equality. A function maps each allowed input to exactly one output.

**Worked example:** For y=3x+2, changing x changes y predictably; solving 3x+2=17 gives x=5, verified by substitution.

**Guided and independent practice:** Translate a word problem into an equation; solve and check; make a table and graph for a simple linear function.

**Assessment and evidence:** Model an unfamiliar linear relationship, identify domain restrictions and interpret slope and intercept in context. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Moving a term is shorthand for applying the same operation to both sides; a graph is not the function’s full definition.

**Bridge:** Quadratics, systems and calculus.


## MATH-02 — Geometry, proof and spatial reasoning

**Core model:** Geometry studies properties and relationships under definitions and axioms. A proof establishes why a statement follows, not just that examples appear to support it.

**Worked example:** Measuring several triangles may suggest an angle-sum rule, but a proof needs a logical chain from accepted properties.

**Guided and independent practice:** Construct examples and counterexamples; mark known facts; write a short proof using definitions and previously established results.

**Assessment and evidence:** Prove a basic angle or congruence result with a clear sequence of justified steps. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** A diagram is not proof; visual appearance may hide equalities or special cases.

**Bridge:** Trigonometry and formal mathematics.


## MATH-03 — Probability, statistics and uncertainty

**Core model:** Probability quantifies uncertainty under a model; statistics describes samples and supports cautious inference about populations. Sampling method and measurement quality affect conclusions.

**Worked example:** A fair coin has probability 1/2 of heads on each toss, but short sequences can be uneven; observed frequency approaches expectation only in a long-run sense.

**Guided and independent practice:** Simulate repeated trials; compare frequency across sample sizes; identify selection bias in a survey.

**Assessment and evidence:** Interpret a data claim with sample, method, variability and uncertainty; explain what cannot be concluded. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Randomness does not “owe” a balancing outcome on the next trial; a large sample can still be biased.

**Bridge:** Inference, regression and experimental design.


## MATH-04 — Exponents, roots, logarithms and growth

**Core model:** Exponents describe repeated multiplication and scale; roots reverse powers on suitable domains; logarithms answer how many multiplicative steps are needed. These tools model growth and decay.

**Worked example:** If a quantity doubles every period, after n periods it is initial×2^n. A logarithm can solve for the number of periods needed to reach a target.

**Guided and independent practice:** Compare linear and exponential tables; estimate square roots between perfect squares; solve simple exponential equations by reasoning.

**Assessment and evidence:** Choose a suitable growth model from data and explain assumptions and limits. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Exponential growth is not automatically sustainable; doubling time cannot be assumed constant indefinitely.

**Bridge:** Calculus, finance and scientific models.


---

# CYBER — Cybersecurity & Digital Infrastructure


## CYBER-01 — Digital identity, authentication and permissions

**Core model:** Authentication verifies an identity claim; authorization determines what that identity may do. Least privilege limits damage if an account or device is compromised.

**Worked example:** A website login proves account access, while role permissions determine whether the user can view, edit or administer records.

**Guided and independent practice:** Audit a fictional app’s roles and permissions; identify excessive access and propose least-privilege changes.

**Assessment and evidence:** Design a basic role matrix and explain authentication versus authorization with a concrete example. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** A hidden URL is not access control; sharing a password destroys accountability.

**Bridge:** Application security and identity management.


## CYBER-02 — Networks, DNS and web requests

**Core model:** A network moves data through layered protocols. DNS resolves names to addresses; HTTP defines request/response semantics; TLS protects transport against important network threats.

**Worked example:** Typing a domain triggers DNS resolution, connection setup and an HTTP request; a failure can occur at several distinct layers.

**Guided and independent practice:** Trace a simplified browser request and classify symptoms as DNS, connectivity, TLS, server or application-level.

**Assessment and evidence:** Diagnose a fictional connection problem using evidence and explain what each test does and does not prove. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Ping success does not prove a website works; DNS resolution does not prove a server is trustworthy.

**Bridge:** TCP/IP, network operations and web security.


## CYBER-03 — Threat modelling and safe system design

**Core model:** Threat modelling identifies assets, actors, attack surfaces, trust boundaries and plausible failure paths. Controls should be proportional to risk and tested.

**Worked example:** For a small shop website, customer data, admin credentials and payment flows have different threats and consequences.

**Guided and independent practice:** Draw a data-flow diagram for a fictional app; mark trust boundaries and list likely threats and mitigations.

**Assessment and evidence:** Present a threat model with prioritized risks, mitigations and residual risks. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Security is not a one-time checklist; a control can create new usability or operational risks.

**Bridge:** Secure architecture and risk management.


## CYBER-04 — Defensive operations, backups and incident response

**Core model:** Defensive security emphasizes prevention, detection, containment, recovery and learning. Backups matter only when restoration is tested.

**Worked example:** A clean backup stored separately can restore a project after accidental deletion or ransomware; an untested archive may be incomplete.

**Guided and independent practice:** Create a backup/restore plan for non-sensitive sample files; verify checksums and perform a test restore.

**Assessment and evidence:** Walk through a fictional compromised-account incident: contain, preserve evidence, recover access and review controls. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Deleting suspicious evidence can hinder response; a backup that has never been restored is an assumption, not assurance.

**Bridge:** Incident handling, forensics and governance.


---

# LANG — Language & Linguistic Intelligence


## LANG-01 — Phonology, listening and pronunciation

**Core model:** Speech is a stream of sounds organised by a language’s phonology. Listening improves when learners notice contrasts, stress, rhythm and connected speech rather than isolated spelling alone.

**Worked example:** Two words may differ by one phoneme; a learner can practise hearing and producing the contrast in short, meaningful pairs.

**Guided and independent practice:** Build a small sound contrast set; listen, identify, repeat and record; compare intelligibility rather than imitating an accent.

**Assessment and evidence:** Identify a target contrast in unfamiliar examples and produce it clearly enough to distinguish meaning. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Spelling does not reliably reveal pronunciation; accent difference is not automatically an error.

**Bridge:** Vocabulary acquisition and spoken fluency.


## LANG-02 — Vocabulary, morphology and spaced retrieval

**Core model:** Words are connected to meaning, form, pronunciation, collocation and context. Durable vocabulary requires retrieval and use across contexts, not only recognition.

**Worked example:** Knowing “decide” also involves forms such as decision/decisive and common patterns such as decide to do something.

**Guided and independent practice:** Create a vocabulary card with definition, example, collocation, word family and a prompt for active recall.

**Assessment and evidence:** Use target words accurately in a new spoken and written context after a delay. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** A translation pair rarely captures every usage; memorising a list without retrieval produces fragile recognition.

**Bridge:** Reading comprehension and writing.


## LANG-03 — Grammar, sentence structure and revision

**Core model:** Grammar describes patterns that organise meaning. Effective revision checks sentence relationships, clarity, agreement, tense, reference and punctuation—not just isolated rules.

**Worked example:** A long sentence with several pronouns may be grammatically possible but ambiguous; repeating a noun can clarify reference.

**Guided and independent practice:** Edit a paragraph in passes: meaning, sentence structure, reference, tense, punctuation and concision.

**Assessment and evidence:** Revise a draft and explain three changes that improve meaning or readability. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Complex sentences are not automatically advanced; grammar rules must be interpreted in context and register.

**Bridge:** Academic writing and rhetoric.


## LANG-04 — Second-language learning pathway design

**Core model:** Language learning combines input, interaction, retrieval, output and feedback. A pathway should balance listening, speaking, reading and writing while adapting to the target language.

**Worked example:** A learner beginning a new language might first learn sound patterns and survival phrases, then build high-frequency vocabulary and simple sentence frames.

**Guided and independent practice:** Design a two-week beginner cycle with comprehensible input, short retrieval, speaking attempts and review; choose one measurable communicative task.

**Assessment and evidence:** Complete a realistic beginner interaction and identify the next gap from actual performance, not app streaks. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Collecting app points is not communicative competence; translating every sentence can slow direct comprehension.

**Bridge:** Intermediate proficiency and linguistics.


---

# RES — Research & Information Intelligence


## RES-01 — Research questions and scope

**Core model:** A research question defines what is being investigated, for whom, under what conditions and within what boundaries. Narrowing scope improves answerability.

**Worked example:** “Does exercise help?” is too broad; “In adolescents, what does current evidence say about moderate activity and sleep quality?” is more researchable.

**Guided and independent practice:** Turn broad topics into focused questions; define key terms, population, outcome and time frame.

**Assessment and evidence:** Produce a question with clear scope and explain what evidence would answer it. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** A question can be interesting but unanswerable with available evidence; changing scope changes the claim.

**Bridge:** Search strategy and literature review.


## RES-02 — Search strategy and source evaluation

**Core model:** Search results are ranked outputs, not a truth hierarchy. Search terms, date, source type, author expertise, methods and conflicts affect source quality.

**Worked example:** A product blog may explain a feature but is weaker evidence for a medical claim than a well-designed review or official guidance.

**Guided and independent practice:** Search one question with synonyms and exact phrases; compare primary, secondary and official sources; record limitations.

**Assessment and evidence:** Create a source table with claim, author, source type, evidence, date and limitations. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** A polished website is not proof; “peer reviewed” does not make a study flawless.

**Bridge:** Evidence synthesis and citation practice.


## RES-03 — Evidence, claims and causal reasoning

**Core model:** Evidence supports claims to varying degrees. Causal inference requires more than correlation and must address confounding, selection and alternative explanations.

**Worked example:** A study finding that screen time correlates with sleep does not by itself establish that screen time caused the sleep difference.

**Guided and independent practice:** Draw a causal diagram with a possible confounder; identify what study design could better test the relationship.

**Assessment and evidence:** Critique a causal headline and rewrite it to match the study design and uncertainty. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** A large sample does not remove confounding; absence of evidence is not always evidence of absence.

**Bridge:** Statistics and experimental design.


## RES-04 — Synthesis, citation and reproducibility

**Core model:** Synthesis compares sources to identify agreement, disagreement, methods and gaps. Citation allows readers to trace claims; reproducibility records how conclusions were reached.

**Worked example:** A synthesis paragraph groups findings by theme and method rather than summarising one article at a time.

**Guided and independent practice:** Create an annotated bibliography and a claim-evidence matrix; write a paragraph that reconciles two differing findings.

**Assessment and evidence:** A reader can trace each factual claim to a source and understand why the synthesis reached its conclusion. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Citation is not decoration; paraphrasing still requires attribution; a summary must not overstate the sources.

**Bridge:** Systematic review and independent research.


---

# INDEP — Practical Independence


## INDEP-01 — Personal systems, hygiene and daily routines

**Core model:** Reliable daily systems reduce preventable friction. A routine should fit the environment and be simple enough to repeat, while remaining adaptable when conditions change.

**Worked example:** A school/work bag checklist can group essentials by function and include a final visual scan before leaving.

**Guided and independent practice:** Build and test a short morning or packing checklist; remove steps that do not prevent a real failure.

**Assessment and evidence:** Complete the routine across several ordinary days and revise it after observing actual omissions. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** A checklist cannot replace judgement; adding too many items makes it easier to ignore.

**Bridge:** Planning and household operations.


## INDEP-02 — Food preparation and kitchen safety

**Core model:** Food preparation combines hygiene, ingredient handling, measurement, heat, timing and safe tool use. Risk depends on food type, storage, temperature and cross-contamination.

**Worked example:** Separate raw and ready-to-eat foods; wash hands and surfaces appropriately; follow reliable local food-safety guidance.

**Guided and independent practice:** Prepare a no-heat snack, then a supervised simple recipe; record sequence, storage needs and allergen considerations.

**Assessment and evidence:** Demonstrate a repeatable recipe while following hygiene and supervision rules appropriate to the learner and task. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Smell alone cannot establish food safety; washing raw poultry can spread contamination; safe cooking depends on food and method.

**Bridge:** Nutrition literacy and meal planning.


## INDEP-03 — Household repair and tool judgement

**Core model:** Basic repair begins with identifying the problem, selecting the correct tool, isolating hazards and knowing when a task exceeds competence.

**Worked example:** A loose screw may need the correct screwdriver bit and controlled torque; a damaged electrical outlet is not a beginner repair.

**Guided and independent practice:** Identify common fasteners and tools; practise on a safe non-electrical training material; label stop-and-escalate conditions.

**Assessment and evidence:** Complete a low-risk assembly task and explain which repairs require a qualified adult or technician. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Forcing a mismatched tool damages hardware; turning off a switch is not proof electrical equipment is safe.

**Bridge:** Workshop practice and risk assessment.


## INDEP-04 — Navigation, travel and contingency planning

**Core model:** Travel planning combines route, timing, cost, accessibility, local conditions, communication and fallback options. Plans should be shared appropriately and adjusted to current information.

**Worked example:** A route plan includes start/end points, transfer points, estimated time, fare, safe meeting point and a backup if a service is delayed.

**Guided and independent practice:** Plan a familiar accompanied route using current public information; identify landmarks and a safe check-in plan.

**Assessment and evidence:** Explain the route and a contingency to a trusted adult; demonstrate how to recover from a wrong turn safely. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** The shortest route is not always safest; map estimates can be outdated or ignore local conditions.

**Bridge:** Map literacy and emergency preparedness.


---

# LEAD — Leadership & Management


## LEAD-01 — Reliability, ownership and follow-through

**Core model:** Trustworthy execution requires clear commitments, realistic scope, timely updates and visible completion. Ownership includes escalating risks rather than hiding them.

**Worked example:** If a task will miss its deadline, an early update with impact, cause and recovery proposal is more useful than silence.

**Guided and independent practice:** Practise writing a concise status update with done, next, blocked and decision-needed fields.

**Assessment and evidence:** Manage a small team task and show that responsibilities, progress and handoffs are visible. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Being busy is not the same as delivering; accountability is not blame.

**Bridge:** Project management and operational leadership.


## LEAD-02 — Listening, feedback and coaching

**Core model:** Good feedback describes observable behaviour, its effect and a useful next step. Listening checks understanding before responding. Coaching supports the learner’s reasoning rather than taking over.

**Worked example:** “Your explanation skipped the cost assumption, so the conclusion is hard to verify; add the unit cost and show the calculation” is actionable.

**Guided and independent practice:** Practise a feedback conversation using observation, impact, question and next step; ask the recipient to paraphrase.

**Assessment and evidence:** Give and receive feedback while maintaining specificity, respect and a clear action. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Vague praise and personal attacks both provide little guidance; feedback is not a verdict on identity.

**Bridge:** Conflict resolution and team development.


## LEAD-03 — Delegation, coordination and project control

**Core model:** Delegation transfers a defined outcome with authority, constraints and checkpoints. Coordination manages dependencies and shared information.

**Worked example:** A design task needs an owner, deliverable format, deadline, decision boundary and review point—not simply “handle design”.

**Guided and independent practice:** Create a responsibility matrix for a small project; identify dependencies and handoff requirements.

**Assessment and evidence:** Run a short project check-in and resolve one dependency without duplicating or obscuring ownership. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Delegation without authority creates bottlenecks; micromanagement reduces ownership.

**Bridge:** Operations, strategy and organisational design.


## LEAD-04 — Ethical leadership and decision governance

**Core model:** Leadership decisions affect people with different interests and unequal power. Ethical governance makes criteria, conflicts, accountability and appeal routes visible.

**Worked example:** A product team deciding whether to collect user data should weigh necessity, consent, minimisation, security and user benefit.

**Guided and independent practice:** Analyse a fictional dilemma using stakeholders, duties, consequences, rights and reversibility.

**Assessment and evidence:** Defend a decision with transparent criteria and describe safeguards for affected people. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Good intentions do not erase harm; majority preference does not automatically justify unfair treatment.

**Bridge:** Strategy, governance and organisational behaviour.


---

# COMM — Communication & Rhetoric


## COMM-01 — Audience, purpose and message structure

**Core model:** Effective communication begins with audience needs and the action or understanding sought. Structure makes the main point easy to locate and verify.

**Worked example:** A technical explanation for a beginner starts with the problem and plain-language model before introducing specialist terms.

**Guided and independent practice:** Explain one topic to two audiences; change examples and vocabulary while keeping factual meaning stable.

**Assessment and evidence:** Deliver a structured explanation with a clear main point, supporting reasons and a useful conclusion. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** More detail is not always more clarity; jargon can conceal rather than improve precision.

**Bridge:** Technical writing and public speaking.


## COMM-02 — Argument, evidence and counterargument

**Core model:** A persuasive argument links a claim to reasons and evidence while acknowledging relevant limits. Counterarguments should be represented fairly before they are answered.

**Worked example:** A proposal can state the claim, show cost and benefit evidence, address the strongest objection and define conditions where it would fail.

**Guided and independent practice:** Build a claim-evidence-warrant outline; steelman an opposing view; identify what evidence would change your mind.

**Assessment and evidence:** Present an argument that is logically connected, sourced and appropriately qualified. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Anecdote is not automatically representative; attacking a weak version of the opposing view is not a fair rebuttal.

**Bridge:** Debate, rhetoric and decision communication.


## COMM-03 — Concise writing and message design

**Core model:** Concise writing preserves necessary meaning while removing redundancy. A useful message includes context, request, deadline or next step where relevant.

**Worked example:** A project handoff states current status, exact file/version, completed work, known issue and next action.

**Guided and independent practice:** Rewrite a long message into a short brief without dropping constraints or uncertainty.

**Assessment and evidence:** A reader can identify the purpose, relevant facts and requested next step after one read. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Shorter is not always clearer; omitted assumptions can make a concise message ambiguous.

**Bridge:** Professional writing and operational handoffs.


## COMM-04 — Negotiation, disagreement and conflict

**Core model:** Negotiation explores interests, options, constraints and alternatives. Respectful disagreement challenges claims or plans while preserving the other person’s dignity.

**Worked example:** Two collaborators can separate positions (“I want Friday”) from interests (time to review, dependency, availability) and find alternatives.

**Guided and independent practice:** Role-play a low-stakes disagreement; state your interest, ask about theirs, generate options and record an agreement.

**Assessment and evidence:** Reach or explain a no-deal outcome using clear criteria, boundaries and an accurate summary. Evidence should include the learner’s actual response or performance, conditions, supports used and evaluator/source. A correct answer after hints is recorded differently from an unaided demonstration.

**Common misconceptions:** Agreement is not always the best outcome; pressure and manipulation are not substitutes for negotiation.

**Bridge:** Leadership, sales and conflict management.
