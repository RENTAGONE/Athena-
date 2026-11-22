# ATHENA Macro Curriculum — Batch 03: 108 Progression Modules
**Status:** Working draft; instructional content requires review and assessment calibration.
**Scope:** Six additional modules for each of the 18 macro disciplines. These extend—not replace—the entry modules in batches 01 and 02.
**Authoring rule:** These modules bridge entry foundations toward intermediate capability. They do not imply that advanced/specialist curricula are complete.

## ENG — Engineering & Computer Science
### M03-001 — Programming with functions and contracts
**Core model:** Decompose a program into named functions with explicit inputs, outputs, side effects and failure conditions.
**Worked example:** A price calculator should separate parsing, validation, calculation and display; each function has one responsibility.
**Guided and independent practice:** Refactor a single long script into small functions; test normal, boundary and invalid inputs.
**Assessment / evidence:** Given an unfamiliar script, identify function contracts and implement a new requirement without changing unrelated behaviour.
**Common misconception:** Functions are not merely shorter code; unclear contracts simply hide complexity.
**Progression bridge:** Unit tests, interfaces, modular design and API construction.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-002 — Data structures and algorithm selection
**Core model:** Choose arrays/lists, maps, sets, stacks, queues and trees according to access patterns and invariants.
**Worked example:** A set is appropriate for membership checks; a queue models first-in-first-out work.
**Guided and independent practice:** Implement a contact lookup using a list, then a map; compare clarity and operation costs.
**Assessment / evidence:** Select a structure for a stated workload and justify trade-offs with complexity and correctness.
**Common misconception:** Big-O alone does not decide; memory, constants, ordering and mutation semantics matter.
**Progression bridge:** Algorithm analysis, databases and system design.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-003 — HTTP, APIs and client-server boundaries
**Core model:** Explain request/response, methods, status codes, headers, JSON, authentication boundaries and idempotency.
**Worked example:** A client submits an order request; the server validates price and stock rather than trusting browser values.
**Guided and independent practice:** Design a small read-only API contract and simulate success, missing-resource and invalid-input responses.
**Assessment / evidence:** Trace a request end-to-end and identify which component owns each validation and security decision.
**Common misconception:** An API is not just a URL returning JSON; it is a contract with failure semantics.
**Progression bridge:** Web engineering, auth, caching and distributed systems.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-004 — Relational data modelling
**Core model:** Translate entities and relationships into tables, keys, constraints and normalized structures.
**Worked example:** A customer can place many orders; an order contains order-line records linked to products.
**Guided and independent practice:** Model a small shop schema and write sample queries for revenue by product.
**Assessment / evidence:** Detect update anomalies and propose keys, constraints and joins for a new scenario.
**Common misconception:** Putting every field in one table creates duplication and inconsistent updates.
**Progression bridge:** SQL, transactions, ORM design and analytics.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-005 — Testing strategy and debugging discipline
**Core model:** Use reproducible cases, unit/integration boundaries, assertions, logs and regression tests.
**Worked example:** A discount bug is isolated with one failing input, a minimal reproduction and a regression test.
**Guided and independent practice:** Create tests for valid, boundary, malformed and adversarial input; fix a seeded defect.
**Assessment / evidence:** Diagnose a defect from evidence and show that the fix prevents recurrence.
**Common misconception:** A passing happy-path demo is not evidence of reliability.
**Progression bridge:** CI, test pyramids, observability and reliability engineering.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-006 — Operating systems and process fundamentals
**Core model:** Distinguish processes, threads, memory, files, permissions, scheduling and system calls.
**Worked example:** A running app has a process identity, memory space, open files and scheduled execution.
**Guided and independent practice:** Inspect processes and file permissions in a safe local environment; document observations.
**Assessment / evidence:** Explain a resource or permission failure using OS concepts rather than guessing.
**Common misconception:** A process and a program are not the same thing.
**Progression bridge:** Concurrency, Linux administration and systems programming.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

## BIZ — Business & Entrepreneurship
### M03-007 — Customer discovery and problem interviews
**Core model:** Separate observed behaviour, stated preference, pain severity, current workaround and willingness to pay.
**Worked example:** Ask a potential buyer to describe the last time they faced the problem rather than pitching a solution.
**Guided and independent practice:** Write neutral interview questions and conduct a small, consent-based interview exercise.
**Assessment / evidence:** Synthesize evidence into a problem statement with uncertainty and disconfirming evidence.
**Common misconception:** Compliments and hypothetical purchase claims are not validated demand.
**Progression bridge:** Segmentation, positioning and product-market evidence.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-008 — Offer design and value proposition
**Core model:** Specify target customer, costly problem, promised outcome, mechanism, proof and limits.
**Worked example:** A tutoring offer states subject, level, measurable deliverable, schedule and what is excluded.
**Guided and independent practice:** Create two offers for distinct customer segments and compare clarity and credibility.
**Assessment / evidence:** A reader can identify who it serves, why it matters and why the promise is believable.
**Common misconception:** A feature list is not a value proposition.
**Progression bridge:** Pricing, landing pages and sales conversations.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-009 — Unit economics and contribution margin
**Core model:** Calculate revenue, variable cost, gross margin, contribution, acquisition cost and payback.
**Worked example:** A digital product sale subtracts payment fees and fulfilment costs before estimating contribution.
**Guided and independent practice:** Build a spreadsheet with low/base/high assumptions and sensitivity checks.
**Assessment / evidence:** Explain whether each additional sale contributes cash and which assumption most changes viability.
**Common misconception:** Revenue is not profit; cash timing can differ from accounting profit.
**Progression bridge:** Pricing, break-even analysis and cash-flow planning.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-010 — Ethical sales conversation
**Core model:** Use discovery, fit assessment, transparent offer, objection clarification and non-coercive close.
**Worked example:** When a buyer hesitates, clarify whether the issue is price, trust, timing or mismatch.
**Guided and independent practice:** Role-play a sale where the correct outcome may be recommending no purchase.
**Assessment / evidence:** Demonstrate accurate claims, informed choice and clear next steps without pressure.
**Common misconception:** Manipulation may increase short-term conversion while damaging trust and retention.
**Progression bridge:** Negotiation, customer success and reputation.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-011 — Marketing experiments and attribution
**Core model:** Define audience, hypothesis, channel, creative, conversion event, budget and stopping rule.
**Worked example:** Test two message variants while keeping audience and offer constant.
**Guided and independent practice:** Design a low-cost experiment with one primary metric and guardrail metrics.
**Assessment / evidence:** Interpret results with sample-size limitations and avoid causal claims from weak data.
**Common misconception:** Views and likes do not necessarily indicate qualified demand.
**Progression bridge:** Funnels, analytics and growth strategy.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-012 — Operations, fulfilment and service recovery
**Core model:** Map order-to-delivery steps, handoffs, failure modes, service standards and recovery actions.
**Worked example:** A digital order workflow checks payment, fulfilment, delivery confirmation and support escalation.
**Guided and independent practice:** Draw a process map and conduct a failure-mode walkthrough.
**Assessment / evidence:** A second person can execute the process reliably using the documented procedure.
**Common misconception:** A founder remembering every step is not a scalable operating system.
**Progression bridge:** Delegation, SOPs, quality and operational scaling.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

## ELEC — Electronics & Hardware
### M03-013 — Measurement, uncertainty and instrument limits
**Core model:** Select a meter range, reference, probe arrangement and safe measurement method; record uncertainty.
**Worked example:** A voltage reading is meaningful only with known reference points and instrument mode.
**Guided and independent practice:** Measure safe battery-powered circuits and repeat readings to observe variation.
**Assessment / evidence:** Produce a measurement record with units, range, setup and uncertainty notes.
**Common misconception:** A displayed number is not automatically an accurate measurement.
**Progression bridge:** Circuit debugging and experimental method.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-014 — Series and parallel circuit analysis
**Core model:** Apply current and voltage relationships to series and parallel networks.
**Worked example:** In a series path current is common; parallel branches share voltage across their endpoints.
**Guided and independent practice:** Predict then measure equivalent resistance in simple low-voltage resistor networks.
**Assessment / evidence:** Solve an unseen network and reconcile prediction with measurement.
**Common misconception:** Do not apply household mains voltage for beginner experiments.
**Progression bridge:** Kirchhoff laws and network analysis.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-015 — Diode behaviour and rectification
**Core model:** Explain forward bias, reverse bias, polarity, current limiting and rectifier topology.
**Worked example:** A series resistor limits LED current; a diode bridge routes both AC half-cycles into one polarity.
**Guided and independent practice:** Simulate or build a current-limited low-voltage LED circuit; inspect diode orientation.
**Assessment / evidence:** Predict conduction states for a simple diode circuit and justify each path.
**Common misconception:** A diode is not an ideal one-way switch; voltage drop and ratings matter.
**Progression bridge:** Transistors, power supplies and semiconductor devices.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-016 — Transistor switching fundamentals
**Core model:** Use a transistor as a controlled switch; distinguish control input and load current paths.
**Worked example:** A small control signal can switch a separate low-voltage load within device ratings.
**Guided and independent practice:** Simulate a transistor switch with a resistor and safe LED load.
**Assessment / evidence:** Choose a suitable topology and explain base/gate drive and load limits.
**Common misconception:** Never assume a microcontroller pin can directly drive any load.
**Progression bridge:** MOSFETs, drivers and embedded outputs.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-017 — Capacitors, time response and filtering
**Core model:** Relate capacitance, charge, voltage, RC time constant and frequency-dependent behaviour.
**Worked example:** A capacitor smooths a changing signal but does not provide unlimited energy.
**Guided and independent practice:** Observe charge/discharge in a simulator or safe low-voltage circuit.
**Assessment / evidence:** Predict qualitative response when R or C changes and compare with measured data.
**Common misconception:** Capacitors can retain charge; safe discharge and voltage ratings matter.
**Progression bridge:** Filters, decoupling and power electronics.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-018 — Microcontroller input/output and sensors
**Core model:** Explain digital/analog pins, pull-ups, sampling, debouncing and sensor calibration.
**Worked example:** A floating input can change unpredictably; a defined pull-up establishes a stable logic state.
**Guided and independent practice:** Read a button and one low-voltage sensor; log raw values before mapping them.
**Assessment / evidence:** Document pin mapping, range, calibration and failure behaviour.
**Common misconception:** Sensor readings are measurements with noise and bias, not ground truth.
**Progression bridge:** Embedded systems, control and data acquisition.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

## FIN — Finance & Economics
### M03-019 — Personal cash-flow ledger
**Core model:** Track opening balance, inflows, outflows, commitments and closing balance with dated entries.
**Worked example:** A sale paid next week is not cash available today.
**Guided and independent practice:** Create a one-month fictional ledger and reconcile every transaction.
**Assessment / evidence:** Find missing entries and explain timing differences between income and cash.
**Common misconception:** A budget is a plan; a ledger records what actually happened.
**Progression bridge:** Accounting, working capital and forecasting.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-020 — Compound growth and inflation
**Core model:** Calculate nominal growth, compounding periods, real purchasing-power change and assumptions.
**Worked example:** A balance can rise nominally while buying less if prices rise faster.
**Guided and independent practice:** Compare simple and compound growth under several rates and periods.
**Assessment / evidence:** Explain the difference between nominal return and real return without implying guaranteed outcomes.
**Common misconception:** Past average returns do not guarantee future results.
**Progression bridge:** Investment analysis and macroeconomics.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-021 — Financial statements: income, balance sheet, cash flow
**Core model:** Distinguish profitability, assets/liabilities/equity and cash movement.
**Worked example:** A business can report profit while cash is tied up in receivables or inventory.
**Guided and independent practice:** Classify sample transactions into three statements.
**Assessment / evidence:** Trace how one transaction affects profit, assets and cash at different times.
**Common misconception:** Profit, cash and bank balance are not interchangeable.
**Progression bridge:** Financial analysis and business valuation.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-022 — Risk, diversification and time horizon
**Core model:** Identify market, credit, liquidity, inflation, concentration and behavioural risks.
**Worked example:** Diversification reduces some concentration risk but cannot eliminate market-wide loss.
**Guided and independent practice:** Compare fictional portfolios with different concentrations and time horizons.
**Assessment / evidence:** Explain which risks are reduced, retained or introduced by a proposed allocation.
**Common misconception:** Diversification does not guarantee profit or prevent every loss.
**Progression bridge:** Portfolio theory and suitability.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-023 — Microeconomics: incentives and marginal decisions
**Core model:** Use scarcity, opportunity cost, supply/demand, elasticity and marginal benefit/cost.
**Worked example:** A price change can alter quantity demanded differently for essential and discretionary goods.
**Guided and independent practice:** Interpret a simple demand schedule and predict shifts under changed conditions.
**Assessment / evidence:** Distinguish movement along a curve from a shift and state assumptions.
**Common misconception:** A correlation between price and sales does not alone identify the cause.
**Progression bridge:** Market structure and policy analysis.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-024 — Fraud, consumer protection and financial due diligence
**Core model:** Recognize guaranteed-return claims, urgency, opaque fees, custody risk and identity theft.
**Worked example:** A referral scheme with no sustainable customer value may depend on new entrants.
**Guided and independent practice:** Audit fictional offers against a due-diligence checklist.
**Assessment / evidence:** Write a reasoned reject/hold/verify decision with evidence gaps.
**Common misconception:** A polished website or influencer endorsement is not proof of legitimacy.
**Progression bridge:** Governance, compliance and risk management.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

## BODY — Body Science & Anatomy
### M03-025 — Cell, tissue and organ-system organization
**Core model:** Relate cells, tissues, organs and systems without treating diagrams as literal scale models.
**Worked example:** Muscle tissue contributes to an organ that works with nervous, circulatory and skeletal systems.
**Guided and independent practice:** Label a hierarchy diagram and explain one function at each level.
**Assessment / evidence:** Trace a physiological function across at least three organizational levels.
**Common misconception:** An organ system is not an isolated machine; systems interact.
**Progression bridge:** Physiology and systems biology.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-026 — Cardiorespiratory response to activity
**Core model:** Explain oxygen delivery, ventilation, heart rate and recovery at an introductory level.
**Worked example:** During exercise, demand rises and the body adjusts circulation and breathing.
**Guided and independent practice:** Compare resting and post-activity observations safely without turning readings into diagnosis.
**Assessment / evidence:** Explain trends and variability while identifying limits of consumer measurements.
**Common misconception:** One reading cannot diagnose fitness or disease.
**Progression bridge:** Exercise physiology and training adaptation.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-027 — Muscle contraction and force production
**Core model:** Describe motor units, muscle-tendon action, leverage and force-velocity trade-offs.
**Worked example:** Changing joint angle changes moment arm and mechanical advantage.
**Guided and independent practice:** Use simple movement diagrams to identify joint action and external load.
**Assessment / evidence:** Analyze a movement using muscles, joints, direction and leverage.
**Common misconception:** Muscle soreness is not a reliable measure of training quality.
**Progression bridge:** Biomechanics and strength programming.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-028 — Nutrition: energy, nutrients and evidence
**Core model:** Explain macronutrient roles, micronutrients, hydration and food-pattern adequacy.
**Worked example:** A meal can combine carbohydrate for energy, protein for tissue maintenance and fats for essential functions.
**Guided and independent practice:** Build a balanced fictional meal using locally available food groups.
**Assessment / evidence:** Evaluate a nutrition claim by population, evidence quality and missing context.
**Common misconception:** No single food or supplement replaces an adequate overall pattern.
**Progression bridge:** Nutrition science and public-health literacy.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-029 — Sleep, recovery and adaptation
**Core model:** Describe sleep functions, fatigue, adaptation and the role of recovery in learning and training.
**Worked example:** Repeated high effort without sufficient recovery can reduce performance and increase injury risk.
**Guided and independent practice:** Keep a non-judgmental sleep/energy observation log and identify confounders.
**Assessment / evidence:** Propose a recovery adjustment based on patterns, not one bad day.
**Common misconception:** Recovery is not laziness; more training is not always better.
**Progression bridge:** Performance planning and behavioural science.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-030 — Reading health research responsibly
**Core model:** Interpret study design, sample, comparison, outcome, effect size and limitations.
**Worked example:** An observational association cannot by itself establish causation.
**Guided and independent practice:** Compare a headline with the abstract and identify what the study actually measured.
**Assessment / evidence:** Summarize a health claim with uncertainty, population and limitations.
**Common misconception:** A statistically significant result may be small or not personally applicable.
**Progression bridge:** Research literacy and evidence-based practice.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

## PSY — Psychology & Strategy
### M03-031 — Attention, working memory and cognitive load
**Core model:** Distinguish selective attention, working-memory limits and long-term knowledge structures.
**Worked example:** A novice uses more working memory for steps that an expert has chunked into patterns.
**Guided and independent practice:** Redesign a dense instruction sheet to reduce avoidable cognitive load.
**Assessment / evidence:** Explain why a task becomes easier with expertise without claiming memory capacity magically expands.
**Common misconception:** Multitasking often means rapid task switching with costs.
**Progression bridge:** Learning design and human-computer interaction.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-032 — Memory encoding, retrieval and forgetting
**Core model:** Differentiate encoding, consolidation, retrieval cues, interference and retrieval practice.
**Worked example:** Repeatedly rereading may feel fluent while unaided recall remains weak.
**Guided and independent practice:** Compare rereading with spaced retrieval on matched material.
**Assessment / evidence:** Design a retrieval plan and interpret delayed performance cautiously.
**Common misconception:** Forgetting is not always failure; retrieval difficulty can support learning when appropriately managed.
**Progression bridge:** Learning science and retention scheduling.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-033 — Biases, heuristics and calibration
**Core model:** Identify confirmation bias, availability, anchoring, base-rate neglect and overconfidence.
**Worked example:** A vivid anecdote can dominate a more representative base rate.
**Guided and independent practice:** Make a forecast, record confidence and later score calibration.
**Assessment / evidence:** Name a plausible bias and propose a process that could reduce it.
**Common misconception:** Knowing bias names does not make a person immune to them.
**Progression bridge:** Decision science and forecasting.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-034 — Motivation, habit design and environment
**Core model:** Analyze cues, friction, reward, identity claims and context without reducing behaviour to willpower.
**Worked example:** Placing materials in the work area reduces start-up friction for a chosen practice.
**Guided and independent practice:** Redesign one small routine with a clear cue and realistic minimum action.
**Assessment / evidence:** Evaluate whether the environment change improves consistency without shame or coercion.
**Common misconception:** A streak is not proof of competence or wellbeing.
**Progression bridge:** Behaviour design and productivity.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-035 — Game theory and strategic interaction
**Core model:** Model players, actions, incentives, information and payoffs in simple strategic settings.
**Worked example:** A coordination problem may reward shared expectations rather than unilateral optimization.
**Guided and independent practice:** Create a payoff matrix for a fictional two-player decision.
**Assessment / evidence:** State assumptions and explain how changing incentives changes predicted behaviour.
**Common misconception:** Game-theoretic models simplify real people; they are not mind-reading tools.
**Progression bridge:** Negotiation, economics and strategy.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-036 — Systems thinking and causal loops
**Core model:** Map stocks, flows, feedback loops, delays and unintended consequences.
**Worked example:** A short-term fix can create delayed side effects elsewhere in a system.
**Guided and independent practice:** Draw a causal-loop diagram for a school or small-business process.
**Assessment / evidence:** Identify leverage points and distinguish correlation from causal structure.
**Common misconception:** A diagram is a hypothesis to test, not proof of causality.
**Progression bridge:** Operations, policy and complex systems.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

## AEST — Aesthetics & Visual Design
### M03-037 — Visual hierarchy and information architecture
**Core model:** Use scale, contrast, alignment, proximity and grouping to guide attention.
**Worked example:** A clear primary action should visually outrank secondary metadata.
**Guided and independent practice:** Redesign a cluttered poster using a deliberate hierarchy.
**Assessment / evidence:** A viewer can identify the main message and next action quickly.
**Common misconception:** Making everything bold creates no hierarchy.
**Progression bridge:** Editorial design and interface layout.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-038 — Typography and readable systems
**Core model:** Choose type roles, measure line length, leading, weight, contrast and language coverage.
**Worked example:** A display face may work for a heading but reduce readability in long paragraphs.
**Guided and independent practice:** Build a two-typeface specimen with heading, body, caption and numeric styles.
**Assessment / evidence:** Justify typography choices for device size, content and script.
**Common misconception:** Aesthetic preference cannot override legibility and accessibility.
**Progression bridge:** Design systems and multilingual interfaces.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-039 — Colour relationships and accessible contrast
**Core model:** Use hue, value, saturation, temperature and contrast; avoid colour-only encoding.
**Worked example:** Status can be represented by icon, label and shape as well as colour.
**Guided and independent practice:** Create a palette and test text contrast in light and dark contexts.
**Assessment / evidence:** Explain palette roles and demonstrate that meaning survives grayscale or colour-vision variation.
**Common misconception:** A pleasing palette may still fail contrast requirements.
**Progression bridge:** Brand systems and accessible UI.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-040 — Composition, framing and visual balance
**Core model:** Use focal point, negative space, alignment, visual weight and directional flow.
**Worked example:** A subject placed off-centre can feel balanced when counterweighted by negative space.
**Guided and independent practice:** Create three compositions from the same subject with different intended emphasis.
**Assessment / evidence:** Explain how framing changes interpretation and viewer attention.
**Common misconception:** Rule-of-thirds is a heuristic, not a universal law.
**Progression bridge:** Photography, illustration and art direction.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-041 — Interface states and interaction feedback
**Core model:** Design default, hover/focus, active, disabled, loading, success and error states.
**Worked example:** A form needs visible validation and recovery, not only a successful state.
**Guided and independent practice:** Prototype a small interaction with keyboard and touch states.
**Assessment / evidence:** Demonstrate clear feedback and recovery for both expected and invalid input.
**Common misconception:** A beautiful static mockup does not specify usable behaviour.
**Progression bridge:** UX engineering and component libraries.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-042 — Design critique and iteration
**Core model:** Separate observation, interpretation, impact and actionable recommendation.
**Worked example:** “The hierarchy is unclear because two actions share equal prominence” is more useful than “looks bad.”
**Guided and independent practice:** Critique a design against its stated audience and task; revise one priority.
**Assessment / evidence:** Give evidence-based feedback and show how the revision addresses it.
**Common misconception:** Taste is not a substitute for task-based evaluation.
**Progression bridge:** Creative direction and design leadership.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

## WORK — Workflow & Productivity
### M03-043 — File systems, paths and naming conventions
**Core model:** Understand folders, absolute/relative paths, extensions, naming and version control of files.
**Worked example:** A relative path is interpreted from a working directory, not always the project root.
**Guided and independent practice:** Create a small project structure and locate files using both path types.
**Assessment / evidence:** Recover a misplaced file and explain the path used.
**Common misconception:** A file extension alone does not guarantee its actual format.
**Progression bridge:** Command line, Git and reproducible projects.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-044 — Terminal literacy and safe command execution
**Core model:** Use working directory, listing, navigation, quoting, pipes and help; inspect before destructive actions.
**Worked example:** Preview matching files before a bulk rename or deletion.
**Guided and independent practice:** Complete a guided sequence in a sandbox directory and explain each command.
**Assessment / evidence:** Predict the effect of a command and identify destructive flags before execution.
**Common misconception:** Copy-pasting commands without understanding scope is unsafe.
**Progression bridge:** Automation and system administration.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-045 — Git versioning and change review
**Core model:** Explain repository, commit, branch, diff, merge and remote; make small reversible changes.
**Worked example:** A commit records a coherent snapshot and message, not a backup of every external asset automatically.
**Guided and independent practice:** Create a repo, make two commits and inspect a diff before merging.
**Assessment / evidence:** Resolve a simple conflict and explain which changes were preserved.
**Common misconception:** Git is not synonymous with GitHub and does not replace backups.
**Progression bridge:** Collaborative engineering and release management.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-046 — Spreadsheet models and formula auditing
**Core model:** Use cell references, formulas, ranges, validation, filters and audit checks.
**Worked example:** Absolute references preserve a tax-rate cell when a formula is filled down.
**Guided and independent practice:** Build a small expense model with totals and reconciliation checks.
**Assessment / evidence:** Trace a wrong result to its formula or input and document the correction.
**Common misconception:** A spreadsheet can look precise while encoding incorrect assumptions.
**Progression bridge:** Finance, analytics and operational dashboards.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-047 — Personal knowledge capture and retrieval
**Core model:** Design notes with source, context, claim, links, status and a retrieval path.
**Worked example:** A note should preserve why it matters and how to find it again.
**Guided and independent practice:** Convert one learning session into linked concept, question and application notes.
**Assessment / evidence:** Retrieve a prior idea from a realistic prompt without relying on memory of its filename.
**Common misconception:** Collecting notes is not the same as learning or building a usable knowledge system.
**Progression bridge:** Research, spaced retrieval and ATHENA workflows.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-048 — Automation design and failure handling
**Core model:** Specify trigger, inputs, transformation, output, permissions, logging and rollback.
**Worked example:** A batch workflow validates all records before changing canonical data.
**Guided and independent practice:** Map an automation and add validation plus a failure report.
**Assessment / evidence:** Demonstrate safe handling of malformed input and partial failure.
**Common misconception:** Automation amplifies mistakes when safeguards are missing.
**Progression bridge:** Data pipelines, agents and operational reliability.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

## ART — Artistic Development
### M03-049 — Gesture, rhythm and action line
**Core model:** Capture pose direction, weight shift and movement before detailing anatomy.
**Worked example:** A 30-second gesture prioritizes action and proportion over contour accuracy.
**Guided and independent practice:** Draw timed gesture sets from varied poses and compare readability.
**Assessment / evidence:** A viewer can infer the pose and action without facial or costume detail.
**Common misconception:** A gesture drawing is not a miniature finished illustration.
**Progression bridge:** Figure construction and animation.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-050 — Perspective and spatial construction
**Core model:** Use horizon, vanishing points, convergence and consistent scale for 1-, 2- and 3-point scenes.
**Worked example:** Parallel receding edges converge toward a shared vanishing point in linear perspective.
**Guided and independent practice:** Construct boxes and a simple room from a fixed eye level.
**Assessment / evidence:** Place objects consistently in a scene and explain the perspective system used.
**Common misconception:** Perspective grids guide representation but do not replace observation.
**Progression bridge:** Environment art and composition.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-051 — Value grouping and light logic
**Core model:** Separate light, halftone, core shadow, reflected light and cast shadow.
**Worked example:** A cast shadow follows the light direction and object geometry.
**Guided and independent practice:** Render a simple object in three value groups before adding detail.
**Assessment / evidence:** Make form readable in grayscale and identify the implied light source.
**Common misconception:** Adding more gradients cannot repair incorrect light logic.
**Progression bridge:** Painting, rendering and material studies.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-052 — Colour mixing and temperature
**Core model:** Understand hue relationships, value control, saturation and warm/cool shifts.
**Worked example:** A limited palette can create unity while value contrast preserves focal clarity.
**Guided and independent practice:** Mix a controlled palette from a small set of colours and paint a study.
**Assessment / evidence:** Match a reference relationship rather than chasing isolated swatch names.
**Common misconception:** Colour appearance changes with surrounding colours and lighting.
**Progression bridge:** Digital painting and colour scripting.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-053 — Anatomical construction for artists
**Core model:** Study landmarks, proportions, joint range and simplified volume without memorizing isolated labels only.
**Worked example:** The rib cage and pelvis are useful masses connected by a flexible torso.
**Guided and independent practice:** Construct figures from simple masses and compare against reference.
**Assessment / evidence:** Explain a pose using major masses and joint orientation.
**Common misconception:** Stylized anatomy still needs coherent structure.
**Progression bridge:** Character design and advanced figure drawing.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-054 — Visual storytelling and sequential clarity
**Core model:** Use shot choice, staging, silhouette, continuity, pacing and cause-effect across frames.
**Worked example:** A reaction panel can clarify why an action matters.
**Guided and independent practice:** Create a 4–6 panel sequence with clear setup, action and consequence.
**Assessment / evidence:** A reader can follow the sequence without explanatory paragraphs.
**Common misconception:** More panels do not automatically improve clarity.
**Progression bridge:** Comics, storyboards and motion design.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

## ATH — Athletics & Physical Performance
### M03-055 — Movement quality and motor learning
**Core model:** Use demonstration, focused cues, low-fatigue repetitions and feedback to learn movement safely.
**Worked example:** A single external cue can improve a movement more than several simultaneous instructions.
**Guided and independent practice:** Practice a simple movement pattern at low intensity with one cue at a time.
**Assessment / evidence:** Repeat with stable technique across sessions, not merely one successful attempt.
**Common misconception:** Fatigue-driven repetition can reinforce poor movement.
**Progression bridge:** Sport technique and coaching.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-056 — Aerobic base and pacing literacy
**Core model:** Understand easy/moderate intensity, talk test, pacing, recovery and gradual progression.
**Worked example:** A pace that permits controlled conversation is often useful for easy aerobic work.
**Guided and independent practice:** Compare perceived effort across short controlled efforts with recovery.
**Assessment / evidence:** Choose a sustainable pace and explain signs to reduce intensity.
**Common misconception:** Harder is not always more productive; age, health and context matter.
**Progression bridge:** Endurance training and conditioning.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-057 — Acceleration and sprint mechanics
**Core model:** Study posture, projection, arm-leg coordination, gradual acceleration and full recovery.
**Worked example:** Early acceleration uses forward projection; upright maximum velocity has different mechanics.
**Guided and independent practice:** Use short, low-volume technique drills on a safe surface with full rest.
**Assessment / evidence:** Show consistent mechanics without chasing maximal speed when fatigued.
**Common misconception:** Sprinting is high intensity and requires preparation and recovery.
**Progression bridge:** Speed development and field-sport performance.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-058 — Change of direction and deceleration
**Core model:** Control braking, centre of mass, foot placement and re-acceleration under manageable speed.
**Worked example:** Deceleration quality matters before sharp direction changes.
**Guided and independent practice:** Practice planned wide-angle cuts at low speed, then progress only with control.
**Assessment / evidence:** Demonstrate balanced braking and stable alignment in both directions.
**Common misconception:** Unplanned maximal cuts on slippery or crowded surfaces raise risk.
**Progression bridge:** Agility, football movement and injury-risk reduction.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-059 — Strength training principles for youth
**Core model:** Understand technique, progressive challenge, supervision, recovery and age-appropriate loading.
**Worked example:** Progress can mean better control or repetitions before adding load.
**Guided and independent practice:** Design a balanced bodyweight session with safe technique checkpoints.
**Assessment / evidence:** Explain how to stop or regress an exercise when form deteriorates.
**Common misconception:** Maximal lifting or pain-based training is not required for progress.
**Progression bridge:** Strength programming and physical literacy.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-060 — Skill under pressure and decision quality
**Core model:** Train perception, scanning, option selection and execution under gradually increased constraints.
**Worked example:** A player scans before receiving to reduce decision time after the ball arrives.
**Guided and independent practice:** Use small-sided or simulated decision drills with one constraint changed at a time.
**Assessment / evidence:** Explain decision quality separately from outcome luck.
**Common misconception:** A successful action does not prove the decision was sound, and vice versa.
**Progression bridge:** Tactics, match analysis and representative practice.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

## PERF — Vocal & Performance Arts
### M03-061 — Breath coordination and vocal ease
**Core model:** Coordinate posture, comfortable inhalation and phrase planning without forcing volume.
**Worked example:** A phrase can be planned around natural breath rather than pushed to the last air.
**Guided and independent practice:** Use gentle speech and short phrase exercises; stop if discomfort occurs.
**Assessment / evidence:** Maintain ease and repeatability without throat tension.
**Common misconception:** More air pressure is not automatically better vocal support.
**Progression bridge:** Pitch, resonance and sustained performance.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-062 — Pitch matching and auditory feedback
**Core model:** Hear a reference pitch, reproduce comfortably, compare and adjust.
**Worked example:** A short note match can be checked with a trusted reference or recording.
**Guided and independent practice:** Practice small comfortable intervals and record brief samples.
**Assessment / evidence:** Match a set of notes with improving consistency, not strain.
**Common misconception:** Do not force range or continue through pain/hoarseness.
**Progression bridge:** Intonation, harmony and musical ear.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-063 — Rhythm subdivision and timing
**Core model:** Count pulse, subdivisions, rests and syncopation using body percussion or a metronome.
**Worked example:** A beat can be divided into two or four equal subdivisions.
**Guided and independent practice:** Clap and speak a rhythm before performing it vocally or instrumentally.
**Assessment / evidence:** Reproduce a pattern at a steady tempo and explain its subdivision.
**Common misconception:** Speed without stable pulse is not rhythmic accuracy.
**Progression bridge:** Ensemble work and phrasing.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-064 — Articulation and intelligibility
**Core model:** Shape consonants and vowels while maintaining natural rate and vocal comfort.
**Worked example:** A consonant can clarify a word without adding unnecessary jaw tension.
**Guided and independent practice:** Practice a short passage at slow, normal and conversational rates.
**Assessment / evidence:** A listener accurately transcribes the passage in a quiet setting.
**Common misconception:** Exaggerated diction can sound unnatural and reduce flow.
**Progression bridge:** Public speaking, singing and recording.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-065 — Recording and self-review
**Core model:** Use mic distance, room noise, clipping checks, takes and objective review criteria.
**Worked example:** A consistent mic position makes comparisons more meaningful.
**Guided and independent practice:** Record the same short passage at two distances and compare noise and clarity.
**Assessment / evidence:** Identify one technical and one performance improvement from playback.
**Common misconception:** A recording is useful evidence but can differ from live perception.
**Progression bridge:** Audio production and performance development.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-066 — Stage presence and audience connection
**Core model:** Use intention, orientation, pacing, eye-line and recovery from mistakes.
**Worked example:** A deliberate pause can improve emphasis and audience processing.
**Guided and independent practice:** Deliver a one-minute piece with a clear beginning, central point and close.
**Assessment / evidence:** Audience members can state the intended message and identify clear structure.
**Common misconception:** Performative confidence is not the same as volume or constant movement.
**Progression bridge:** Public speaking and live performance.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

## MATH — Mathematics & Scientific Reasoning
### M03-067 — Algebraic expressions and equivalence
**Core model:** Use variables, terms, coefficients, distributive property and equivalent transformations.
**Worked example:** 3(x+2) and 3x+6 represent the same expression for every x.
**Guided and independent practice:** Translate verbal relationships into expressions and simplify with justifications.
**Assessment / evidence:** Explain why each transformation preserves equality.
**Common misconception:** Changing one side of an equation without balancing the other breaks equivalence.
**Progression bridge:** Equations, functions and proof.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-068 — Exponents, roots and scientific notation
**Core model:** Interpret integer exponents, powers, square roots, exponent laws and scale notation.
**Worked example:** 10^3 means 1000; square root asks for a nonnegative value whose square is the radicand in real-number contexts.
**Guided and independent practice:** Estimate powers and roots before calculating; convert very large/small quantities.
**Assessment / evidence:** Apply exponent laws with domain restrictions and explain common errors.
**Common misconception:** Exponent rules do not permit adding exponents across addition terms.
**Progression bridge:** Polynomials, logarithms and physical scales.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-069 — Linear equations and inequalities
**Core model:** Solve one-variable equations and inequalities while tracking operation validity and solution sets.
**Worked example:** Multiplying an inequality by a negative reverses its direction.
**Guided and independent practice:** Solve contextual problems and verify candidate solutions by substitution.
**Assessment / evidence:** Translate a word problem, solve and interpret whether the result is feasible.
**Common misconception:** A numerical answer without context or units may not solve the original problem.
**Progression bridge:** Systems, functions and optimization.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-070 — Functions, graphs and rate of change
**Core model:** Interpret input/output, domain/range, slope, intercept and functional relationships.
**Worked example:** Slope represents constant rate of change for a linear function.
**Guided and independent practice:** Build a table, graph and equation from a simple constant-rate scenario.
**Assessment / evidence:** Move between representations and explain what slope means in context.
**Common misconception:** A graph is not just a picture; axes and scale determine interpretation.
**Progression bridge:** Quadratics, calculus and modelling.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-071 — Probability, sampling and statistical variation
**Core model:** Distinguish outcomes, events, conditional probability, sample bias and variation.
**Worked example:** A small sample can produce an unstable estimate even when calculated correctly.
**Guided and independent practice:** Run a simple repeated random experiment and compare observed to expected frequencies.
**Assessment / evidence:** Interpret uncertainty and identify sampling limitations.
**Common misconception:** A streak does not necessarily imply the next independent event is due to reverse.
**Progression bridge:** Inference, data science and risk.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-072 — Proof, counterexamples and mathematical argument
**Core model:** Use definitions, logical implication, direct reasoning and counterexamples.
**Worked example:** One counterexample disproves a universal claim.
**Guided and independent practice:** Test conjectures with examples, then construct a proof or counterexample.
**Assessment / evidence:** Distinguish evidence for a conjecture from proof of a universal statement.
**Common misconception:** Checking many examples is not a proof for all cases.
**Progression bridge:** Discrete mathematics and advanced theory.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

## CYBER — Cybersecurity & Digital Infrastructure
### M03-073 — Threat modelling for personal systems
**Core model:** Identify assets, adversaries, attack surfaces, trust boundaries and realistic mitigations.
**Worked example:** A recovery email can become a high-value account takeover path.
**Guided and independent practice:** Threat-model a fictional personal account without probing real targets.
**Assessment / evidence:** Rank threats by likelihood and impact and justify proportionate controls.
**Common misconception:** Security is risk reduction, not a promise of perfect safety.
**Progression bridge:** Application security and enterprise risk.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-074 — Authentication, authorization and session safety
**Core model:** Distinguish identity proof, permissions, sessions, tokens, MFA and recovery channels.
**Worked example:** A valid login does not imply the user should have administrator privileges.
**Guided and independent practice:** Audit a fictional app role matrix and session lifecycle.
**Assessment / evidence:** Identify excessive privilege and propose least-privilege rules.
**Common misconception:** Hiding an admin button is not server-side authorization.
**Progression bridge:** Secure application architecture.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-075 — Network fundamentals and packet flow
**Core model:** Explain IP addressing, DNS, routing, TCP/UDP, ports and TLS at a conceptual level.
**Worked example:** DNS resolves a name; it does not itself encrypt the connection.
**Guided and independent practice:** Trace a browser request from name resolution through transport and application layers.
**Assessment / evidence:** Diagnose a simulated connectivity issue by layer.
**Common misconception:** A port number does not identify a specific person or guarantee service identity.
**Progression bridge:** Network administration and security monitoring.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-076 — Web vulnerabilities and defensive coding
**Core model:** Understand input validation, output encoding, access control, injection and security headers.
**Worked example:** Parameterized queries separate SQL code from user-provided values.
**Guided and independent practice:** Review a deliberately vulnerable toy snippet and propose safe corrections.
**Assessment / evidence:** Explain the vulnerability, exploit precondition and defensive fix in a local lab.
**Common misconception:** Client-side validation alone is not a security boundary.
**Progression bridge:** Secure software development and testing.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-077 — Backups, recovery and incident readiness
**Core model:** Design versioned backups, restore tests, recovery priorities and incident notes.
**Worked example:** A backup that has never been restored is an unverified assumption.
**Guided and independent practice:** Create a recovery plan for fictional files and perform a harmless restore drill.
**Assessment / evidence:** Recover a selected file and document recovery time and gaps.
**Common misconception:** Sync is not always backup; deletion may propagate.
**Progression bridge:** Business continuity and incident response.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-078 — Authorized security lab methodology
**Core model:** Set explicit scope, isolated target, permitted methods, evidence handling and stop conditions.
**Worked example:** A local intentionally vulnerable lab permits learning without touching third-party systems.
**Guided and independent practice:** Complete a guided exercise only in a deliberately vulnerable local environment.
**Assessment / evidence:** Produce a reproducible finding and remediation note within scope.
**Common misconception:** Public availability does not imply authorization to test.
**Progression bridge:** Responsible disclosure and professional security practice.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

## LANG — Language & Linguistic Intelligence
### M03-079 — Vocabulary acquisition through context and retrieval
**Core model:** Learn words with meaning, collocation, register, example and active recall.
**Worked example:** Knowing a translation does not guarantee knowing how a word behaves in a sentence.
**Guided and independent practice:** Build a small set of words from reading and retrieve them in original sentences.
**Assessment / evidence:** Use each word accurately in a new context after a delay.
**Common misconception:** Isolated word lists often create recognition without usable production.
**Progression bridge:** Advanced reading, writing and second-language learning.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-080 — Grammar as sentence architecture
**Core model:** Analyze clause, phrase, tense/aspect, agreement, reference and information order.
**Worked example:** A subordinate clause changes how ideas relate, not merely sentence length.
**Guided and independent practice:** Parse and rewrite sentences while preserving meaning.
**Assessment / evidence:** Explain a grammatical choice and produce a clear alternative.
**Common misconception:** Grammar rules need context and register; avoid treating every variation as error.
**Progression bridge:** Editing, translation and linguistics.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-081 — Reading comprehension and inference
**Core model:** Separate explicit claim, implication, tone, structure, evidence and author purpose.
**Worked example:** An implied conclusion must be supported by textual cues rather than invented.
**Guided and independent practice:** Annotate a short passage with claim, evidence and inference.
**Assessment / evidence:** Answer literal and inferential questions with textual justification.
**Common misconception:** A plausible interpretation is not necessarily the best-supported interpretation.
**Progression bridge:** Critical reading and research synthesis.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-082 — Writing coherent paragraphs and arguments
**Core model:** Use claim, reason, evidence, explanation, transition and qualification.
**Worked example:** Evidence needs a warrant explaining why it supports the claim.
**Guided and independent practice:** Write a paragraph with one controlling idea and revise for coherence.
**Assessment / evidence:** A reader can reconstruct the argument and identify its evidence.
**Common misconception:** Adding connectors does not fix a missing logical relationship.
**Progression bridge:** Essays, technical writing and rhetoric.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-083 — Listening comprehension and shadowing
**Core model:** Use gist, detail, prediction, segmentation and careful imitation without confusing mimicry with understanding.
**Worked example:** A listener can first capture topic, then details, then exact phrasing.
**Guided and independent practice:** Listen to a short clear recording in passes and summarize before shadowing.
**Assessment / evidence:** Retell the content accurately and reproduce selected phrases intelligibly.
**Common misconception:** Repeated playback without an objective can become passive exposure.
**Progression bridge:** Pronunciation, interpretation and real conversation.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-084 — Bangla-English technical concept bridging
**Core model:** Map concepts across Bangla and English while preserving meaning, not literal word order.
**Worked example:** A technical term may need a standard English label plus a clear Bangla explanation.
**Guided and independent practice:** Create a bilingual glossary with definition, example and common confusion.
**Assessment / evidence:** Explain one scientific or mathematical idea accurately in both languages.
**Common misconception:** Word-for-word translation can distort technical relationships.
**Progression bridge:** Academic learning and multilingual communication.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

## RES — Research & Information Intelligence
### M03-085 — Research question and scope design
**Core model:** Define population/context, phenomenon, comparison, outcome and feasible boundaries.
**Worked example:** “Does this study method help?” is refined by learner group, method, comparator and outcome.
**Guided and independent practice:** Turn a broad curiosity into two answerable questions.
**Assessment / evidence:** A question is specific enough to guide search and method without pre-deciding the result.
**Common misconception:** A leading question can bake the desired conclusion into the design.
**Progression bridge:** Literature search and study design.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-086 — Search strategy and query iteration
**Core model:** Use concept blocks, synonyms, exact phrases, exclusions and source-specific search.
**Worked example:** Search for mechanism and synonyms rather than repeating one broad phrase.
**Guided and independent practice:** Create a search log with queries, result relevance and next refinement.
**Assessment / evidence:** Explain why a revised query improves precision or coverage.
**Common misconception:** Top search ranking is not a quality ranking.
**Progression bridge:** Systematic searching and evidence synthesis.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-087 — Source evaluation and provenance
**Core model:** Inspect author expertise, publisher, method, date, citations, conflicts and primary evidence.
**Worked example:** A news summary should be traced to the original study where possible.
**Guided and independent practice:** Evaluate contrasting sources using a transparent rubric.
**Assessment / evidence:** State what a source can and cannot support.
**Common misconception:** A source can be credible yet irrelevant to the exact claim.
**Progression bridge:** Citation management and critical review.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-088 — Study design and confounding
**Core model:** Distinguish experimental, observational, cross-sectional, longitudinal and qualitative designs.
**Worked example:** A confounder can influence both exposure and outcome, creating a misleading association.
**Guided and independent practice:** Draw a simple causal diagram for a fictional observational question.
**Assessment / evidence:** Identify what design can support and what causal claims remain unjustified.
**Common misconception:** Statistical adjustment cannot automatically remove all confounding.
**Progression bridge:** Causal inference and epidemiology.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-089 — Evidence synthesis and disagreement
**Core model:** Compare populations, measures, methods, effect direction, uncertainty and study quality.
**Worked example:** Two studies may differ because they measure different outcomes or populations.
**Guided and independent practice:** Build an evidence table for a narrow claim and note sources of heterogeneity.
**Assessment / evidence:** Write a balanced synthesis that preserves disagreement and uncertainty.
**Common misconception:** Counting studies for/against ignores study quality and dependence.
**Progression bridge:** Systematic reviews and meta-analysis.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-090 — Reproducible analysis and research ethics
**Core model:** Document data provenance, transformations, assumptions, versioning, consent and limitations.
**Worked example:** A chart should be reproducible from documented inputs and transformations.
**Guided and independent practice:** Create a small analysis log and rerun it from clean source data.
**Assessment / evidence:** Another person can reproduce the output and understand ethical constraints.
**Common misconception:** Reproducibility does not guarantee valid measures or unbiased design.
**Progression bridge:** Open science and independent research.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

## INDEP — Practical Independence
### M03-091 — Cooking workflow and food safety
**Core model:** Plan mise en place, heat control, cross-contamination prevention and safe storage.
**Worked example:** Separate raw and ready-to-eat surfaces and verify food is cooked safely.
**Guided and independent practice:** Prepare a simple supervised meal using a written sequence and cleanup plan.
**Assessment / evidence:** Repeat the recipe consistently while following local food-safety guidance.
**Common misconception:** Taste and appearance alone cannot reliably establish safe internal temperature.
**Progression bridge:** Meal planning and household operations.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-092 — Clothing care and repair literacy
**Core model:** Read garment labels, sort materials, remove simple stains safely and perform basic repairs.
**Worked example:** A loose button can be repaired before it becomes a larger tear.
**Guided and independent practice:** Practice on scrap fabric before repairing a real garment.
**Assessment / evidence:** Select a care method and complete a neat, durable simple repair.
**Common misconception:** Heat and chemicals can damage fabrics; test inconspicuously.
**Progression bridge:** Budgeting and sustainable maintenance.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-093 — Household maintenance and fault isolation
**Core model:** Observe symptoms, isolate safe causes, use manuals and know when to stop and call a qualified adult/professional.
**Worked example:** A tripped breaker or damaged cable is not a cue to open electrical equipment.
**Guided and independent practice:** Build a safe inspection checklist for a non-electrical household issue.
**Assessment / evidence:** Document symptom, safe checks, likely cause and escalation point.
**Common misconception:** Do not perform live electrical, gas or structural repairs without qualification.
**Progression bridge:** Troubleshooting and risk management.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-094 — Navigation and route planning
**Core model:** Use landmarks, map orientation, route alternatives, time estimates and check-in plans.
**Worked example:** A route should include safe public paths and a fallback, not just shortest distance.
**Guided and independent practice:** Plan a familiar supervised route with a map and identify decision points.
**Assessment / evidence:** Explain the route and contingency without relying solely on live GPS.
**Common misconception:** Shortest route may be unsafe or inaccessible.
**Progression bridge:** Situational awareness and travel planning.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-095 — Personal documents and administrative organization
**Core model:** Track essential documents, renewal dates, copies, privacy and secure storage.
**Worked example:** A document inventory records where an item is stored without exposing sensitive data.
**Guided and independent practice:** Create a fictional household document index and renewal calendar.
**Assessment / evidence:** Find a needed record through the index while keeping private identifiers protected.
**Common misconception:** Do not store passwords or sensitive IDs in plain shared notes.
**Progression bridge:** Digital security and personal operations.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-096 — First-aid decision literacy and escalation
**Core model:** Recognize emergency triggers, summon help, avoid unsafe interventions and follow certified training.
**Worked example:** A responder first checks scene safety and calls local emergency help when indicated.
**Guided and independent practice:** Use scenario cards to practise decision sequences; practical skills remain instructor-led.
**Assessment / evidence:** Correctly identify when to call for help and state limits of untrained intervention.
**Common misconception:** A text lesson cannot certify CPR, AED use or choking response.
**Progression bridge:** Certified first aid and emergency preparedness.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

## LEAD — Leadership & Management
### M03-097 — Goal setting and execution review
**Core model:** Translate an outcome into milestones, owners, constraints, evidence and review cadence.
**Worked example:** A project milestone is a verifiable deliverable rather than “work on website.”
**Guided and independent practice:** Break a small project into milestones with dependencies.
**Assessment / evidence:** A reviewer can verify completion and identify blocked work.
**Common misconception:** A busy task list is not a strategy.
**Progression bridge:** Project management and operational planning.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-098 — Feedback and coaching conversations
**Core model:** Use specific observation, impact, question, agreed action and follow-up.
**Worked example:** Describe a missed handoff and its effect rather than labelling a person careless.
**Guided and independent practice:** Role-play receiving and giving feedback with a clear behavioural example.
**Assessment / evidence:** Both parties can restate the agreed next step and evaluation point.
**Common misconception:** Feedback should not become personal attack or vague praise.
**Progression bridge:** People development and team performance.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-099 — Delegation and accountability
**Core model:** Specify outcome, decision authority, constraints, resources, checkpoints and escalation.
**Worked example:** Delegating a deliverable without authority or context creates avoidable failure.
**Guided and independent practice:** Write a delegation brief for a low-risk fictional task.
**Assessment / evidence:** The recipient can explain expected output and boundaries.
**Common misconception:** Delegation is not abandonment or micromanagement.
**Progression bridge:** Operations and organizational design.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-100 — Conflict analysis and resolution
**Core model:** Separate positions, interests, facts, interpretations, power and possible agreements.
**Worked example:** Two people may disagree on a schedule while sharing the interest of predictable workload.
**Guided and independent practice:** Map a fictional conflict and propose options that address underlying interests.
**Assessment / evidence:** Produce a fair agreement with responsibilities and review conditions.
**Common misconception:** Not every conflict has a mutually acceptable solution; safety and boundaries matter.
**Progression bridge:** Negotiation and mediation.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-101 — Decision rights and governance
**Core model:** Define who proposes, advises, decides, executes and reviews; document rationale.
**Worked example:** A decision log prevents repeated debate and makes reversals traceable.
**Guided and independent practice:** Create a simple decision-rights matrix for a team project.
**Assessment / evidence:** Identify ambiguity and resolve overlapping authority.
**Common misconception:** Consensus is not always required; accountability must remain explicit.
**Progression bridge:** Governance and strategic management.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-102 — Strategy, prioritization and trade-offs
**Core model:** Compare opportunities by impact, cost, risk, reversibility, timing and strategic fit.
**Worked example:** A reversible low-cost experiment may be preferable to a large irreversible commitment.
**Guided and independent practice:** Rank three fictional initiatives and show sensitivity to changed assumptions.
**Assessment / evidence:** Defend a priority and state what will deliberately not be done.
**Common misconception:** A framework score is decision support, not objective truth.
**Progression bridge:** Portfolio strategy and resource allocation.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

## COMM — Communication & Rhetoric
### M03-103 — Active listening and question design
**Core model:** Use paraphrase, clarification, open questions, summaries and attention to nonverbal context.
**Worked example:** Reflecting the other person’s claim before disagreeing reduces misinterpretation.
**Guided and independent practice:** Conduct a short listening exercise and summarize without adding assumptions.
**Assessment / evidence:** The speaker confirms that the summary captures their intended meaning.
**Common misconception:** Listening is not merely waiting for a turn to speak.
**Progression bridge:** Interviewing, negotiation and leadership.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-104 — Argument mapping and claim structure
**Core model:** Separate claim, premises, evidence, warrant, qualifier and rebuttal.
**Worked example:** A conclusion may fail if the evidence is relevant but the warrant is missing.
**Guided and independent practice:** Map a short argument and identify hidden assumptions.
**Assessment / evidence:** A reader can inspect how premises support or fail to support the conclusion.
**Common misconception:** Confident delivery does not repair invalid reasoning.
**Progression bridge:** Debate, critical thinking and analytical writing.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-105 — Public speaking and audience adaptation
**Core model:** Set audience, purpose, central message, structure, examples, pacing and call to action.
**Worked example:** A technical explanation changes examples and assumed knowledge for a beginner audience.
**Guided and independent practice:** Deliver the same idea in 60 seconds to a novice and a peer.
**Assessment / evidence:** Both audiences can state the core message at the intended depth.
**Common misconception:** More jargon does not equal more expertise.
**Progression bridge:** Teaching, presentation and influence.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-106 — Persuasion, evidence and ethical framing
**Core model:** Use credible evidence, relevant examples, fair counterarguments and transparent uncertainty.
**Worked example:** Acknowledge a limitation before explaining why the central case still holds.
**Guided and independent practice:** Rewrite a persuasive claim to remove exaggeration and add support.
**Assessment / evidence:** The argument remains compelling without deception or pressure.
**Common misconception:** Persuasion should not exploit fear or conceal material facts.
**Progression bridge:** Sales, advocacy and rhetoric.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-107 — Negotiation preparation and option generation
**Core model:** Clarify interests, BATNA conceptually, reservation limits, objective criteria and alternatives.
**Worked example:** Preparing alternatives reduces pressure to accept a poor agreement.
**Guided and independent practice:** Simulate a low-stakes negotiation and record interests before positions.
**Assessment / evidence:** Reach or reject an agreement with reasons tied to criteria and boundaries.
**Common misconception:** A negotiation win that destroys trust may be a poor long-term outcome.
**Progression bridge:** Business, conflict resolution and strategy.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.

### M03-108 — Technical explanation and documentation
**Core model:** Structure explanation around purpose, prerequisites, procedure, expected result, failure modes and references.
**Worked example:** A setup guide includes both the successful path and what to check when it fails.
**Guided and independent practice:** Write instructions for a peer unfamiliar with the tool.
**Assessment / evidence:** A peer completes the task without undocumented assumptions.
**Common misconception:** A technically correct explanation can still fail if prerequisites are omitted.
**Progression bridge:** Documentation, teaching and software engineering.
**Learning outcomes:** Learner can explain the model, apply it to a novel example, identify a limitation, and produce inspectable evidence.
**Evidence status:** Draft instructional unit; requires subject review and a calibrated rubric before approval.
