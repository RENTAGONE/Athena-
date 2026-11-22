# ATHENA Breadth-First Curriculum Baseline — Batch I

**Status:** Draft authored content; subject review required.  
**Coverage:** 18 disciplines × 12 baseline modules = 216 modules.  
**Purpose:** Give every discipline a coherent foundation-to-functional entry spine before deep specialist authoring in six-discipline waves.

> These modules are a first baseline, not complete discipline curricula or expert-approved instruction. Suggested sequence links are not hard gates.

## ENG — Engineering & Computer Science

### BASE-ENG-001 — Problem decomposition
**Objective:** Break a real problem into inputs, outputs, constraints and smaller testable tasks.
**Core concepts:** Represent a small workflow as a sequence of independently testable steps.
**Core model:** Decomposition, invariants, input/output contracts
**Practice:** Take a familiar phone or business task and split it into atomic operations; identify edge cases.
**Assessment:** Given a new task, produce a decomposition with inputs, outputs, constraints and at least three edge cases.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A vague task can be solved by coding immediately; decomposition is only documentation.
**Transfer bridge:** Design a small feature from a user story.

### BASE-ENG-002 — Algorithms and pseudocode
**Objective:** Express a deterministic procedure in ordered steps and trace its state.
**Core concepts:** Write pseudocode and manually trace it on normal and edge-case inputs.
**Core model:** Sequence, selection, iteration, state, termination
**Practice:** Create a step-by-step algorithm for searching a list and tracing a simple score counter.
**Assessment:** Trace the algorithm accurately and explain termination and failure cases.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** An algorithm is the same thing as code in a specific language.
**Transfer bridge:** Translate pseudocode into Python or JavaScript.

### BASE-ENG-003 — Variables and data types
**Objective:** Choose and use values with explicit types and valid operations.
**Core concepts:** Explain and predict the effect of assignment, conversion and type mismatch.
**Core model:** Values, identifiers, primitive types, mutability, conversion
**Practice:** Build a tiny calculator using integers, decimals, strings and booleans.
**Assessment:** Predict outputs and diagnose type errors without executing every line.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A variable is a permanent box whose type never changes in every language.
**Transfer bridge:** Model form inputs and validation.

### BASE-ENG-004 — Control flow
**Objective:** Use conditions and loops to express branching and repetition.
**Core concepts:** Construct and trace conditionals and loops with correct boundary conditions.
**Core model:** Boolean expressions, branching, iteration, loop invariants
**Practice:** Write a menu loop and a range-checking routine; test boundary values.
**Assessment:** Pass normal, minimum, maximum and invalid-input tests.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** More nested conditions automatically make logic more powerful.
**Transfer bridge:** Implement input validation and game rules.

### BASE-ENG-005 — Functions and contracts
**Objective:** Decompose programs into functions with clear responsibilities and contracts.
**Core concepts:** Define functions with parameters, return values and explicit pre/postconditions.
**Core model:** Scope, parameters, return values, side effects, contracts
**Practice:** Refactor a repeated calculation into a function and test it independently.
**Assessment:** Function behaves correctly for documented inputs and handles invalid cases.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A function is merely a way to shorten code.
**Transfer bridge:** Design reusable modules and APIs.

### BASE-ENG-006 — Collections and data structures
**Objective:** Select a collection based on access and update requirements.
**Core concepts:** Use lists/arrays, maps/dictionaries and sets appropriately.
**Core model:** Indexing, key lookup, uniqueness, ordering, complexity intuition
**Practice:** Represent inventory items and count frequencies using a dictionary/map.
**Assessment:** Choose a suitable structure and justify lookup/update trade-offs.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** All collections are interchangeable lists.
**Transfer bridge:** Prepare data for searching and analysis.

### BASE-ENG-007 — Debugging and testing
**Objective:** Locate faults using reproducible evidence and test cases.
**Core concepts:** Distinguish syntax, runtime and logic errors; write tests that expose them.
**Core model:** Reproduction, hypothesis, isolation, assertions, test coverage
**Practice:** Create a bug, reproduce it, form a hypothesis, isolate and verify the fix.
**Assessment:** Provide a failing test before the fix and a passing regression test after it.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Changing multiple things at once is an efficient debugging method.
**Transfer bridge:** Use systematic debugging in larger projects.

### BASE-ENG-008 — Files and command line
**Objective:** Navigate directories and safely run programs with command-line arguments.
**Core concepts:** Explain paths, working directories, standard input/output and exit codes.
**Core model:** Filesystem tree, relative/absolute paths, shell commands, streams
**Practice:** Create a project folder, run a script, redirect output and inspect files.
**Assessment:** Complete a file workflow without destructive commands or path confusion.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** The terminal is a separate operating system.
**Transfer bridge:** Automate repetitive project tasks.

### BASE-ENG-009 — Version control foundations
**Objective:** Track changes and recover from mistakes using version control.
**Core concepts:** Create commits, inspect diffs and use branches for isolated changes.
**Core model:** Repository, working tree, staging, commit, branch, merge
**Practice:** Create a repository, commit a working version, change a file and inspect the diff.
**Assessment:** Explain exactly what a commit contains and restore a previous state safely.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** GitHub and Git are the same thing.
**Transfer bridge:** Collaborate through pull requests.

### BASE-ENG-010 — Web and HTTP foundations
**Objective:** Explain how browsers, servers, requests and responses interact.
**Core concepts:** Inspect a basic HTTP request/response and identify methods, status codes and headers.
**Core model:** Client-server model, URL, DNS, HTTP, status codes, JSON
**Practice:** Use browser developer tools or a safe request client to inspect a public test endpoint.
**Assessment:** Explain request method, URL, status, headers and body.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A website is just a collection of HTML files.
**Transfer bridge:** Build and consume APIs.

### BASE-ENG-011 — Relational data foundations
**Objective:** Represent structured records with entities, attributes and relationships.
**Core concepts:** Design a small relational schema with keys and constraints.
**Core model:** Tables, rows, primary keys, foreign keys, normalization intuition
**Practice:** Model customers, orders and order items; identify repeated data and relationships.
**Assessment:** Schema supports required queries without ambiguous duplicate identities.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A spreadsheet and a relational database are identical.
**Transfer bridge:** Write SQL queries and design application persistence.

### BASE-ENG-012 — Security and reliability basics
**Objective:** Build safe defaults into a small application.
**Core concepts:** Identify trust boundaries, validate inputs and avoid exposing secrets.
**Core model:** Least privilege, validation, secrets, errors, backups
**Practice:** Threat-model a simple login/contact form and list mitigations.
**Assessment:** Identify major risks and implement server-side validation and secret handling.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Client-side validation is sufficient security.
**Transfer bridge:** Progress toward secure software engineering.

## BIZ — Business & Entrepreneurship

### BASE-BIZ-001 — Problem and customer discovery
**Objective:** Identify a specific customer group and a problem worth solving.
**Core concepts:** Write testable customer/problem hypotheses and conduct ethical discovery.
**Core model:** Customer segment, job-to-be-done, pain, evidence, assumptions
**Practice:** Interview a few consenting potential users without pitching; record repeated problems.
**Assessment:** Separate direct observations from assumptions and identify disconfirming evidence.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Friends saying an idea is cool proves demand.
**Transfer bridge:** Build a validated problem statement.

### BASE-BIZ-002 — Market research foundations
**Objective:** Estimate a market using transparent assumptions and primary/secondary evidence.
**Core concepts:** Distinguish total, reachable and initially serviceable markets.
**Core model:** TAM/SAM/SOM, sampling, competitor set, evidence quality
**Practice:** Map alternatives and create a bottom-up estimate with stated assumptions.
**Assessment:** A reader can reproduce the estimate and challenge each assumption.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A huge global market means a small venture has a huge opportunity.
**Transfer bridge:** Position an offer in a real market.

### BASE-BIZ-003 — Value proposition
**Objective:** Connect a customer problem to a credible outcome and differentiator.
**Core concepts:** Write a concise value proposition supported by evidence.
**Core model:** Customer, problem, outcome, alternative, differentiation
**Practice:** Compare an offer against current alternatives and identify why a customer would switch.
**Assessment:** State who it serves, what changes and why the claim is credible.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Listing features is the same as explaining value.
**Transfer bridge:** Create a focused offer.

### BASE-BIZ-004 — Offer and pricing basics
**Objective:** Define scope, deliverables, limits and a defensible price.
**Core concepts:** Build a simple offer with cost, value and customer constraints considered.
**Core model:** Scope, deliverable, variable cost, fixed cost, willingness-to-pay
**Practice:** Create two offer packages and calculate direct delivery cost.
**Assessment:** Price does not ignore costs, capacity or customer expectations.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** The cheapest price always wins.
**Transfer bridge:** Test pricing and unit economics.

### BASE-BIZ-005 — Ethical sales conversations
**Objective:** Understand needs and communicate a fit without manipulation.
**Core concepts:** Use discovery questions, summarize needs and disclose limitations.
**Core model:** Qualification, objections, consent, fit, expectation setting
**Practice:** Role-play a customer conversation and handle a mismatch honestly.
**Assessment:** Customer can explain what is included, excluded and why it may or may not fit.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Pressure and false urgency are necessary to close sales.
**Transfer bridge:** Build a repeatable sales process.

### BASE-BIZ-006 — Marketing and positioning
**Objective:** Reach a defined audience with a consistent, truthful message.
**Core concepts:** Choose a channel based on audience behaviour and measure a small experiment.
**Core model:** Positioning, message-market fit, channel, creative, call to action
**Practice:** Run a small low-cost message test with one variable changed at a time.
**Assessment:** Record reach, response and qualified interest without confusing vanity metrics with demand.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Views and likes equal revenue.
**Transfer bridge:** Develop an evidence-led channel strategy.

### BASE-BIZ-007 — Funnel and measurement
**Objective:** Track a customer’s path from discovery to purchase and repeat use.
**Core concepts:** Define funnel stages and calculate basic conversion rates.
**Core model:** Awareness, lead, conversion, retention, cohort, attribution limits
**Practice:** Create a funnel table from sample data and identify the largest drop-off.
**Assessment:** Calculations are correct and recommendations match the data limitations.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Attribution data proves one channel caused every sale.
**Transfer bridge:** Improve conversion and retention.

### BASE-BIZ-008 — Bookkeeping and cash flow
**Objective:** Record business transactions and distinguish profit from cash.
**Core concepts:** Maintain a simple ledger and reconcile cash movements.
**Core model:** Revenue, expense, receivable, payable, inventory, cash flow
**Practice:** Record sample transactions and reconcile opening to closing cash.
**Assessment:** Every entry has date, description, amount and category; totals reconcile.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A profitable business cannot run out of cash.
**Transfer bridge:** Read financial statements.

### BASE-BIZ-009 — Unit economics
**Objective:** Evaluate contribution per sale before scaling.
**Core concepts:** Calculate revenue, variable cost, contribution and break-even volume.
**Core model:** Gross margin, contribution margin, CAC, payback, break-even
**Practice:** Model several price/cost scenarios using a spreadsheet.
**Assessment:** Identify assumptions and explain when an order is economically unattractive.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Revenue growth guarantees healthy economics.
**Transfer bridge:** Plan sustainable growth.

### BASE-BIZ-010 — Operations and fulfilment
**Objective:** Deliver a consistent service or product with clear handoffs.
**Core concepts:** Map an order-to-delivery workflow and identify failure points.
**Core model:** Process, queue, capacity, quality, SLA, exception
**Practice:** Document a small digital-product fulfilment process and test an exception.
**Assessment:** A second person could follow the process and recover from common failures.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Operations only matter after a business becomes large.
**Transfer bridge:** Create standard operating procedures.

### BASE-BIZ-011 — Customer support and retention
**Objective:** Resolve issues while preserving trust and learning from recurring failures.
**Core concepts:** Use a support record, triage and fair resolution policy.
**Core model:** Severity, response time, root cause, refund, retention
**Practice:** Resolve simulated late delivery and incorrect-product cases.
**Assessment:** Response is accurate, respectful and consistent with published policy.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A refund is always a business loss rather than a trust decision.
**Transfer bridge:** Use support insights to improve product.

### BASE-BIZ-012 — Business ethics and strategy
**Objective:** Make decisions that consider customers, law, risk and long-term viability.
**Core concepts:** Identify conflicts of interest and compare strategic options.
**Core model:** Stakeholder, externality, compliance, reputation, moat
**Practice:** Evaluate a growth tactic for short- and long-term consequences.
**Assessment:** Recommendation identifies affected parties, uncertainty and safeguards.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** If a tactic is legal it is automatically ethical.
**Transfer bridge:** Build governance and strategic plans.

## ELEC — Electronics & Hardware

### BASE-ELEC-001 — Electrical safety
**Objective:** Recognize hazards and select safe low-voltage learning conditions.
**Core concepts:** Explain short circuits, polarity, heat, current limits and safe isolation.
**Core model:** Voltage source, current path, power, insulation, stored energy
**Practice:** Inspect a low-voltage battery kit and identify unsafe wiring before energizing.
**Assessment:** Correctly identify hazards and refuse unknown mains/high-energy experiments.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Low voltage means every circuit is harmless.
**Transfer bridge:** Progress to instrumented circuit work.

### BASE-ELEC-002 — Units and circuit quantities
**Objective:** Use SI units and distinguish voltage, current, resistance and power.
**Core concepts:** Convert units and explain each quantity physically.
**Core model:** Volt, ampere, ohm, watt, charge, energy
**Practice:** Solve unit conversions and label a simple circuit diagram.
**Assessment:** Units and prefixes are correct and quantities are not conflated.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Voltage is the amount of current.
**Transfer bridge:** Apply Ohm’s law.

### BASE-ELEC-003 — Measurement instruments
**Objective:** Measure voltage and continuity using correct meter settings and connection.
**Core concepts:** Explain why current and voltage measurements use different connections.
**Core model:** Multimeter, range, probe, series/shunt, uncertainty
**Practice:** Practice on a safe battery-powered training circuit with adult supervision where needed.
**Assessment:** Select correct mode and range before connection; record uncertainty.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A multimeter can be connected the same way for every measurement.
**Transfer bridge:** Measure real circuit behaviour.

### BASE-ELEC-004 — Circuit diagrams
**Objective:** Read and draw basic circuit symbols and current paths.
**Core concepts:** Translate between a schematic and a simple physical layout.
**Core model:** Schematic, node, branch, ground reference, polarity
**Practice:** Draw a battery-switch-resistor-LED circuit with correct polarity.
**Assessment:** Another learner can build the circuit from the drawing.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A schematic shows the physical placement of components.
**Transfer bridge:** Analyse series and parallel networks.

### BASE-ELEC-005 — Ohm’s law
**Objective:** Relate voltage, current and resistance in a resistive element.
**Core concepts:** Solve V=IR for each variable and check units.
**Core model:** Proportionality, resistance, operating point, power
**Practice:** Calculate expected current for safe example resistor circuits.
**Assessment:** Calculations are correct and resistor power limits are considered.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Ohm’s law applies unchanged to every electronic device.
**Transfer bridge:** Analyse circuit networks.

### BASE-ELEC-006 — Series and parallel networks
**Objective:** Predict how current and voltage behave in simple series/parallel circuits.
**Core concepts:** Calculate equivalent resistance and reason about branches.
**Core model:** Kirchhoff intuition, equivalent resistance, current division
**Practice:** Solve two-resistor examples and compare with a low-voltage simulation.
**Assessment:** Predictions agree with circuit rules and are dimensionally valid.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Adding a parallel branch always increases total resistance.
**Transfer bridge:** Design simple sensor and LED circuits.

### BASE-ELEC-007 — Resistors and LEDs
**Objective:** Choose current-limiting resistance for a low-voltage LED circuit.
**Core concepts:** Use LED polarity and forward-voltage approximation safely.
**Core model:** Current limiting, forward voltage, resistor power, datasheet
**Practice:** Calculate a conservative resistor value for a specified supply and LED.
**Assessment:** Circuit stays within component ratings and lights as predicted.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** An LED can be connected directly to a battery of any voltage.
**Transfer bridge:** Understand diodes and rectification.

### BASE-ELEC-008 — Diode behaviour
**Objective:** Explain one-way conduction and the limits of a diode model.
**Core concepts:** Interpret a simple diode I–V curve and polarity marking.
**Core model:** Forward bias, reverse bias, breakdown, rectification
**Practice:** Use a simulator to compare forward and reverse diode behaviour.
**Assessment:** Predict conduction state for correctly labelled examples.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A diode is a perfect one-way switch under all conditions.
**Transfer bridge:** Study rectifiers and protection circuits.

### BASE-ELEC-009 — Transistor switching
**Objective:** Use a transistor as a controlled switch in a conceptual low-voltage circuit.
**Core concepts:** Explain base/gate control and load-current separation.
**Core model:** BJT/MOSFET distinction, saturation, gate threshold, flyback
**Practice:** Simulate switching an LED or small safe load; include protective components where required.
**Assessment:** Identify control and load paths and component limits.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A transistor simply amplifies current in every application.
**Transfer bridge:** Build microcontroller interfaces.

### BASE-ELEC-010 — Capacitors and time response
**Objective:** Explain charge storage and basic RC timing.
**Core concepts:** Predict qualitative charge/discharge behaviour.
**Core model:** Capacitance, time constant, filtering, polarity types
**Practice:** Simulate an RC charge curve and estimate one time constant.
**Assessment:** Describe initial/final behaviour and safe discharge considerations.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A capacitor stores current.
**Transfer bridge:** Understand filters and power smoothing.

### BASE-ELEC-011 — Breadboard prototyping
**Objective:** Translate a simple schematic to a solderless breadboard layout.
**Core concepts:** Identify connected rows/rails and verify continuity before power.
**Core model:** Contact strips, rail breaks, component leads, layout discipline
**Practice:** Build a low-voltage LED circuit and photograph/document the layout.
**Assessment:** Circuit matches schematic and passes pre-power continuity checks.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Breadboard holes are all connected together.
**Transfer bridge:** Prototype sensors and digital logic.

### BASE-ELEC-012 — Digital logic and microcontrollers
**Objective:** Explain binary states and basic input/output behaviour.
**Core concepts:** Use a microcontroller to read a simple input and control an output in simulation or safe kit.
**Core model:** Bits, logic levels, digital input, output, pull-up/down
**Practice:** Write a simple input-triggered LED behaviour and document pin assumptions.
**Assessment:** Code, wiring and logic table agree; voltage compatibility is checked.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A GPIO pin can safely power any load.
**Transfer bridge:** Progress to embedded systems.

## FIN — Finance & Economics

### BASE-FIN-001 — Money numeracy
**Objective:** Use percentages, units and comparisons to reason about money.
**Core concepts:** Calculate percentage change, fees and effective per-unit prices.
**Core model:** Principal, rate, period, fee, nominal versus effective
**Practice:** Compare two purchase/payment options with all fees included.
**Assessment:** Calculations use the same time and quantity basis.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A lower monthly payment always means a lower total cost.
**Transfer bridge:** Build budgets and compare financial products.

### BASE-FIN-002 — Personal budgeting
**Objective:** Create a realistic budget that distinguishes needs, wants and goals.
**Core concepts:** Track income and spending without treating estimates as facts.
**Core model:** Income, fixed/variable expense, buffer, goal, irregular cost
**Practice:** Build a sample monthly budget with a contingency line.
**Assessment:** Every category has a stated assumption and totals reconcile.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A budget is a punishment rather than a planning tool.
**Transfer bridge:** Manage cash flow.

### BASE-FIN-003 — Cash flow
**Objective:** Track money timing and understand liquidity.
**Core concepts:** Prepare a simple cash-flow forecast.
**Core model:** Opening balance, inflow, outflow, closing balance, timing
**Practice:** Forecast a small business’s next four weeks from sample transactions.
**Assessment:** Closing balances reconcile and delayed receipts are modelled.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Profit and cash balance are interchangeable.
**Transfer bridge:** Understand accounting and working capital.

### BASE-FIN-004 — Interest and compounding
**Objective:** Explain simple and compound interest over time.
**Core concepts:** Calculate growth under different rates and periods.
**Core model:** Principal, periodic rate, compounding, effective annual rate
**Practice:** Compare simple and compound growth with a spreadsheet.
**Assessment:** Formula and time periods match; assumptions are stated.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Compounding guarantees positive returns.
**Transfer bridge:** Evaluate borrowing and saving.

### BASE-FIN-005 — Inflation and purchasing power
**Objective:** Explain why nominal money and real purchasing power differ.
**Core concepts:** Calculate an approximate real change after inflation.
**Core model:** Price index, inflation rate, nominal, real, basket
**Practice:** Compare a price basket across two years using provided data.
**Assessment:** Correctly distinguish price-level change from an individual price change.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Every item’s price rises by the headline inflation rate.
**Transfer bridge:** Interpret macroeconomic data.

### BASE-FIN-006 — Accounting foundations
**Objective:** Record transactions using consistent categories and double-entry logic.
**Core concepts:** Explain assets, liabilities, equity, income and expenses.
**Core model:** Accounting equation, debit/credit, accrual, cash basis
**Practice:** Classify sample transactions and show their effect on the accounting equation.
**Assessment:** Entries balance and categories reflect economic substance.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Debit always means money leaving an account.
**Transfer bridge:** Read financial statements.

### BASE-FIN-007 — Financial statements
**Objective:** Interpret an income statement, balance sheet and cash-flow statement together.
**Core concepts:** Explain what each statement can and cannot reveal.
**Core model:** Revenue, COGS, operating expense, assets, liabilities, cash flow
**Practice:** Analyse a simplified company case and identify a liquidity warning.
**Assessment:** Conclusion references multiple statements and avoids unsupported certainty.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A high revenue figure proves financial health.
**Transfer bridge:** Assess business performance.

### BASE-FIN-008 — Risk and uncertainty
**Objective:** Distinguish risk types and avoid treating uncertain outcomes as guaranteed.
**Core concepts:** Compare probability, impact, time horizon and ability to absorb loss.
**Core model:** Volatility, drawdown, liquidity, concentration, counterparty risk
**Practice:** Create a risk register for a hypothetical savings/investment choice.
**Assessment:** Identifies downside, uncertainty and safeguards without making a personal trade recommendation.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Higher risk always means higher realised return.
**Transfer bridge:** Understand diversification.

### BASE-FIN-009 — Markets and institutions
**Objective:** Explain the roles of exchanges, brokers, issuers and regulators.
**Core concepts:** Trace a basic transaction and identify where fees and conflicts may occur.
**Core model:** Primary/secondary market, order, settlement, custody, regulation
**Practice:** Map a hypothetical share purchase from issuer to investor.
**Assessment:** Distinguishes ownership, trading venue and intermediary.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A trading app is itself the stock market.
**Transfer bridge:** Study securities and market structure.

### BASE-FIN-010 — Diversification and allocation
**Objective:** Explain how concentration and correlation affect portfolio risk.
**Core concepts:** Compare allocations conceptually across assets and time horizons.
**Core model:** Correlation, concentration, allocation, rebalancing
**Practice:** Use a simulated portfolio to observe concentration and correlated losses.
**Assessment:** Explains why diversification reduces some risks but cannot eliminate all loss.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Owning many tickers automatically means diversification.
**Transfer bridge:** Study portfolio theory.

### BASE-FIN-011 — Fraud and consumer protection
**Objective:** Recognize common financial deception and verify claims before acting.
**Core concepts:** Check licensing, custody, withdrawal conditions and unrealistic guarantees.
**Core model:** Ponzi, phishing, impersonation, custody, due diligence
**Practice:** Audit a fictional investment pitch for red flags.
**Assessment:** Lists independent verification steps and refuses urgency-based pressure.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A polished website or influencer endorsement proves legitimacy.
**Transfer bridge:** Understand financial regulation.

### BASE-FIN-012 — Economic reasoning
**Objective:** Use incentives, scarcity and marginal trade-offs to explain choices.
**Core concepts:** Distinguish supply/demand shifts from movement along a curve.
**Core model:** Opportunity cost, marginal utility, elasticity, equilibrium
**Practice:** Explain a price change using a supply/demand scenario.
**Assessment:** Names the causal shift and predicts direction with assumptions.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Demand and quantity demanded mean the same thing.
**Transfer bridge:** Progress to micro/macro economic analysis.

## BODY — Body Science & Anatomy

### BASE-BODY-001 — Biological organization
**Objective:** Explain the hierarchy from cells to tissues, organs and systems.
**Core concepts:** Relate structure to function using a familiar body system.
**Core model:** Cell, tissue, organ, system, homeostasis
**Practice:** Create a labelled hierarchy for the musculoskeletal system.
**Assessment:** Levels are correctly distinguished and linked by function.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Organs work independently of other systems.
**Transfer bridge:** Study integrated physiology.

### BASE-BODY-002 — Cell and tissue basics
**Objective:** Describe major cell structures and broad tissue classes.
**Core concepts:** Explain how cell specialisation supports tissue function.
**Core model:** Membrane, nucleus, mitochondria, epithelial, connective, muscle, nervous
**Practice:** Compare a muscle cell and neuron using structure/function.
**Assessment:** Claims remain at the appropriate level and avoid oversimplification.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** All cells have identical structure and function.
**Transfer bridge:** Understand organ systems.

### BASE-BODY-003 — Anatomical orientation
**Objective:** Use anatomical position, planes, directions and regions accurately.
**Core concepts:** Describe a structure’s location without relying on viewpoint ambiguity.
**Core model:** Anterior/posterior, medial/lateral, proximal/distal, planes
**Practice:** Label a neutral anatomical diagram and describe joint movement.
**Assessment:** Terminology is consistent from the subject’s anatomical perspective.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Left/right always means the observer’s left/right.
**Transfer bridge:** Study movement and biomechanics.

### BASE-BODY-004 — Homeostasis
**Objective:** Explain feedback regulation using a simple physiological example.
**Core concepts:** Distinguish negative feedback from positive feedback.
**Core model:** Set point/range, sensor, control centre, effector, feedback
**Practice:** Map body temperature regulation with a feedback loop.
**Assessment:** Each loop component and direction is identified correctly.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Homeostasis means the body never changes.
**Transfer bridge:** Understand endocrine and nervous regulation.

### BASE-BODY-005 — Nervous system basics
**Objective:** Explain how sensory input, processing and motor output coordinate action.
**Core concepts:** Distinguish central and peripheral nervous system roles.
**Core model:** Neuron, synapse, sensory/motor pathway, CNS/PNS
**Practice:** Trace a simple reflex arc and compare it with a voluntary action.
**Assessment:** Sequence is accurate and limits are acknowledged.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** The brain directly controls every movement consciously.
**Transfer bridge:** Study motor control and learning.

### BASE-BODY-006 — Cardiorespiratory function
**Objective:** Describe how heart, blood and lungs support gas transport.
**Core concepts:** Explain broad acute responses to exercise.
**Core model:** Ventilation, circulation, oxygen transport, heart rate
**Practice:** Trace oxygen from inhalation to working muscle at a high level.
**Assessment:** Separates ventilation, gas exchange and circulation.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Breathing faster alone explains all exercise adaptation.
**Transfer bridge:** Study exercise physiology.

### BASE-BODY-007 — Musculoskeletal function
**Objective:** Explain how bones, joints, muscles and tendons create movement.
**Core concepts:** Identify basic joint actions and muscle roles.
**Core model:** Lever, joint, muscle contraction, tendon, ligament
**Practice:** Analyse a squat or jump using joint actions and force direction.
**Assessment:** Description distinguishes muscle, tendon, ligament and bone roles.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Muscles push bones directly.
**Transfer bridge:** Study biomechanics and strength.

### BASE-BODY-008 — Nutrition and digestion
**Objective:** Explain the roles of macronutrients, micronutrients and digestion.
**Core concepts:** Describe digestion, absorption and broad nutrient functions.
**Core model:** Carbohydrate, protein, fat, vitamins, minerals, fibre, digestion
**Practice:** Classify foods by nutrient contribution without labelling foods morally.
**Assessment:** Recognises mixed foods and avoids single-food cure claims.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** One macronutrient is inherently bad for everyone.
**Transfer bridge:** Study nutrition science and sport fueling.

### BASE-BODY-009 — Sleep and recovery
**Objective:** Explain sleep’s role in learning, regulation and physical recovery.
**Core concepts:** Identify behaviours associated with healthy sleep opportunity.
**Core model:** Circadian rhythm, sleep pressure, stages, recovery, adaptation
**Practice:** Keep a short non-judgmental sleep observation log and identify patterns.
**Assessment:** Separates observation from diagnosis and avoids rigid claims.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A single sleep metric fully measures recovery.
**Transfer bridge:** Plan sustainable training and study.

### BASE-BODY-010 — Exercise adaptation
**Objective:** Explain how training stimulus, recovery and adaptation relate.
**Core concepts:** Distinguish acute response from long-term adaptation.
**Core model:** Overload, specificity, progression, fatigue, recovery
**Practice:** Compare two hypothetical training weeks and identify excessive load.
**Assessment:** Recommendation prioritises gradual progression and recovery.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** More training always creates faster improvement.
**Transfer bridge:** Study periodization and performance.

### BASE-BODY-011 — Health information literacy
**Objective:** Evaluate health claims using evidence quality and uncertainty.
**Core concepts:** Distinguish general education from individual diagnosis.
**Core model:** Study design, sample, confounding, effect size, guideline
**Practice:** Audit a fictional supplement claim and list what evidence is missing.
**Assessment:** Identifies limits and refers personal medical concerns to qualified professionals.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Anecdote or one study establishes universal advice.
**Transfer bridge:** Read research responsibly.

### BASE-BODY-012 — Human variation and ethics
**Objective:** Explain why bodies differ and why measurements need context.
**Core concepts:** Discuss biological variation without ranking people’s worth.
**Core model:** Variation, development, environment, measurement error, consent
**Practice:** Interpret a fictional dataset with varied age/context and measurement limitations.
**Assessment:** Avoids deterministic claims and protects privacy.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A population average predicts an individual exactly.
**Transfer bridge:** Study research methods and ethics.

## PSY — Psychology & Strategy

### BASE-PSY-001 — Psychology as an evidence discipline
**Objective:** Distinguish psychological observation, theory and evidence.
**Core concepts:** Identify a testable claim and possible alternative explanations.
**Core model:** Construct, operational definition, hypothesis, replication
**Practice:** Turn a vague claim about motivation into a measurable question.
**Assessment:** Question can be investigated without assuming the answer.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A psychological label explains a person completely.
**Transfer bridge:** Read research and evaluate theories.

### BASE-PSY-002 — Attention and cognitive load
**Objective:** Explain limits of attention and working memory.
**Core concepts:** Design a task environment that reduces avoidable cognitive load.
**Core model:** Selective attention, working memory, switching cost, load
**Practice:** Compare single-task and interrupted-task performance in a safe mini-test.
**Assessment:** Describes limitations and does not overgeneralise from one trial.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Multitasking means doing two demanding tasks equally well.
**Transfer bridge:** Improve learning and workflow.

### BASE-PSY-003 — Memory systems
**Objective:** Distinguish encoding, storage and retrieval.
**Core concepts:** Explain why recognition can feel easier than recall.
**Core model:** Working memory, long-term memory, retrieval cue, interference
**Practice:** Study a short set using rereading versus retrieval and compare recall later.
**Assessment:** Uses delayed retrieval and interprets results cautiously.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Familiarity means durable memory.
**Transfer bridge:** Design retention practice.

### BASE-PSY-004 — Learning and behaviour
**Objective:** Explain practice, feedback and reinforcement without reducing learning to rewards.
**Core concepts:** Choose practice conditions matched to the target capability.
**Core model:** Feedback, reinforcement, shaping, variability, transfer
**Practice:** Compare blocked and varied practice for a simple skill.
**Assessment:** Identifies performance during practice versus learning later.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Immediate fluency proves durable learning.
**Transfer bridge:** Build training protocols.

### BASE-PSY-005 — Emotion and regulation
**Objective:** Describe emotion as information without treating it as a command.
**Core concepts:** Identify a safe regulation strategy and when to seek support.
**Core model:** Arousal, appraisal, regulation, context, coping
**Practice:** Map a fictional stressful situation: trigger, interpretation, response, alternative.
**Assessment:** Avoids diagnosis and distinguishes everyday strategies from clinical care.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Suppressing emotion is the same as regulating it.
**Transfer bridge:** Improve decision-making under pressure.

### BASE-PSY-006 — Motivation and habits
**Objective:** Explain how cues, friction, goals and feedback influence behaviour.
**Core concepts:** Design a small habit experiment with realistic environmental support.
**Core model:** Cue, action, reward, friction, implementation intention
**Practice:** Change one environmental cue and track whether a behaviour becomes easier.
**Assessment:** Experiment has one clear target and non-punitive review.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Willpower alone determines consistency.
**Transfer bridge:** Build sustainable practice systems.

### BASE-PSY-007 — Biases and heuristics
**Objective:** Recognize common reasoning shortcuts and test their influence.
**Core concepts:** Use a structured check before making high-stakes judgments.
**Core model:** Availability, confirmation, anchoring, base rate, calibration
**Practice:** Evaluate a fictional claim using base rates and disconfirming evidence.
**Assessment:** Names a plausible bias without assuming it always explains behaviour.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Knowing bias names makes a person bias-free.
**Transfer bridge:** Improve forecasting and strategy.

### BASE-PSY-008 — Decision-making
**Objective:** Compare options under uncertainty using explicit criteria.
**Core concepts:** Separate reversible from irreversible decisions and identify information value.
**Core model:** Expected value, regret, opportunity cost, reversibility, uncertainty
**Practice:** Create a decision table for a low-stakes choice.
**Assessment:** Criteria and assumptions are explicit; no false precision.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A decision is good only if the outcome is lucky.
**Transfer bridge:** Apply decision science.

### BASE-PSY-009 — Social psychology
**Objective:** Explain how norms, roles and group context influence behaviour.
**Core concepts:** Distinguish individual preference from social pressure.
**Core model:** Norms, conformity, roles, group identity, attribution
**Practice:** Analyse a fictional group decision and identify situational influences.
**Assessment:** Avoids stereotyping and considers alternative explanations.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** One group experiment explains every culture.
**Transfer bridge:** Understand teamwork and leadership.

### BASE-PSY-010 — Communication and conflict
**Objective:** Use listening and perspective-taking to clarify disagreement.
**Core concepts:** Summarize another position fairly before responding.
**Core model:** Active listening, attribution, framing, repair, boundaries
**Practice:** Role-play a disagreement and produce a neutral summary of both positions.
**Assessment:** Other person would recognize their view in the summary.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Perspective-taking requires agreeing with the other person.
**Transfer bridge:** Develop negotiation skills.

### BASE-PSY-011 — Strategic interaction
**Objective:** Model choices where outcomes depend on other actors.
**Core concepts:** Identify incentives, credible commitments and coordination problems.
**Core model:** Payoff, cooperation, defection, repeated game, signaling
**Practice:** Analyse a simple coordination game and propose a stable cooperative rule.
**Assessment:** Model states assumptions and does not claim humans always behave rationally.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Game theory predicts exact human behaviour.
**Transfer bridge:** Study negotiation and strategy.

### BASE-PSY-012 — Systems and causal reasoning
**Objective:** Distinguish correlation, causal mechanism and feedback.
**Core concepts:** Draw a simple causal loop and identify possible unintended effects.
**Core model:** Causal graph, confounder, feedback, delay, leverage point
**Practice:** Map a school/workflow problem as a system with delays and feedback.
**Assessment:** Avoids asserting causality from correlation alone.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Every complex problem has one root cause.
**Transfer bridge:** Apply systems thinking.

## AEST — Aesthetics & Visual Design

### BASE-AEST-001 — Visual perception
**Objective:** Explain how contrast, grouping and visual attention shape interpretation.
**Core concepts:** Identify focal point and grouping cues in a design.
**Core model:** Figure-ground, proximity, similarity, continuity, contrast
**Practice:** Annotate a poster with its focal point and visual grouping.
**Assessment:** Explanation links visual properties to likely reading order.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A design is clear if it looks attractive to its creator.
**Transfer bridge:** Build visual hierarchy.

### BASE-AEST-002 — Composition and framing
**Objective:** Arrange elements to guide attention and establish balance.
**Core concepts:** Use alignment, spacing, scale and framing intentionally.
**Core model:** Grid, balance, negative space, crop, rhythm
**Practice:** Create two compositions from the same content with different hierarchy.
**Assessment:** Viewer can identify intended primary message without explanation.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Centered layout is always balanced.
**Transfer bridge:** Design layouts and photographs.

### BASE-AEST-003 — Hierarchy and information design
**Objective:** Order content by importance and user task.
**Core concepts:** Create a hierarchy with headings, grouping and progressive disclosure.
**Core model:** Primary/secondary action, scan path, grouping, density
**Practice:** Redesign a cluttered information card for fast scanning.
**Assessment:** User can find key information quickly in a simple usability check.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Making everything bold creates emphasis.
**Transfer bridge:** Design interfaces and dashboards.

### BASE-AEST-004 — Colour foundations
**Objective:** Use hue, value and saturation to create relationships and sufficient contrast.
**Core concepts:** Choose a limited palette and check contrast.
**Core model:** Hue, value, saturation, temperature, contrast
**Practice:** Build a palette and test text contrast with a reliable checker.
**Assessment:** Palette has functional roles and readable contrast.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Colour alone should communicate status.
**Transfer bridge:** Create accessible design systems.

### BASE-AEST-005 — Typography foundations
**Objective:** Choose type and spacing for legibility, hierarchy and tone.
**Core concepts:** Set a simple type scale and readable line length.
**Core model:** Typeface, x-height, weight, leading, measure, hierarchy
**Practice:** Create a one-page layout using a restrained type system.
**Assessment:** Body text remains readable at mobile size and enlarged scaling.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A decorative font improves every heading.
**Transfer bridge:** Build brand and interface typography.

### BASE-AEST-006 — Layout systems
**Objective:** Use grids and spacing rules to make layouts consistent.
**Core concepts:** Create responsive layout logic for narrow and wide screens.
**Core model:** Grid, columns, spacing scale, alignment, breakpoint
**Practice:** Adapt a desktop composition to a phone without shrinking everything.
**Assessment:** Content order and touch targets remain usable on small screens.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Responsive design means scaling the whole page proportionally.
**Transfer bridge:** Build interface systems.

### BASE-AEST-007 — Brand foundations
**Objective:** Translate a positioning idea into consistent visual and verbal cues.
**Core concepts:** Create a small identity set with rationale.
**Core model:** Audience, promise, tone, mark, palette, consistency
**Practice:** Develop a concept identity for a fictional small service.
**Assessment:** Visual choices support a defined audience and promise.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A logo alone is a brand.
**Transfer bridge:** Build identity systems.

### BASE-AEST-008 — Interface states
**Objective:** Design feedback for loading, empty, error, success and disabled states.
**Core concepts:** Specify what the interface communicates after each user action.
**Core model:** State model, affordance, feedback, error recovery
**Practice:** Map states for a form and sketch the corresponding screens.
**Assessment:** Every important action has understandable feedback and recovery.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A successful default screen is enough to define an interface.
**Transfer bridge:** Design robust products.

### BASE-AEST-009 — Accessibility foundations
**Objective:** Design so information and controls remain perceivable and operable.
**Core concepts:** Check contrast, text scaling, keyboard/touch operation and non-colour cues.
**Core model:** Perceivable, operable, understandable, robust, semantic structure
**Practice:** Audit a small interface against a short accessibility checklist.
**Assessment:** Identifies barriers and proposes concrete fixes.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Accessibility is only a screen-reader concern.
**Transfer bridge:** Build inclusive design systems.

### BASE-AEST-010 — Photography foundations
**Objective:** Control composition, exposure and focus for a deliberate image.
**Core concepts:** Explain the exposure triangle at a practical level.
**Core model:** Shutter, aperture, ISO, focus, focal length, perspective
**Practice:** Photograph the same subject under varied light and compare choices.
**Assessment:** Can explain why one frame is sharper/brighter or more distorted.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Higher megapixels automatically mean better photographs.
**Transfer bridge:** Develop phone photography and editing.

### BASE-AEST-011 — Critique and iteration
**Objective:** Give specific feedback tied to user goals and evidence.
**Core concepts:** Separate observation, impact and recommendation.
**Core model:** Critique, constraint, iteration, usability evidence
**Practice:** Review a design using “I observe / effect / possible change”.
**Assessment:** Feedback is actionable and does not rely on taste alone.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Critique means saying whether something looks good.
**Transfer bridge:** Develop art direction.

### BASE-AEST-012 — Design systems
**Objective:** Create reusable tokens and components with consistent states.
**Core concepts:** Document a small component and its variants.
**Core model:** Token, component, variant, responsive rule, governance
**Practice:** Build a button/card specification with states and spacing tokens.
**Assessment:** Another designer can reproduce the component consistently.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A design system is just a component library.
**Transfer bridge:** Scale product design.

## WORK — Workflow & Productivity

### BASE-WORK-001 — File and folder literacy
**Objective:** Organize files with predictable paths and names.
**Core concepts:** Use absolute/relative paths and avoid duplicate ambiguous versions.
**Core model:** Directory, extension, path, naming convention, metadata
**Practice:** Create a project folder with source, output and archive locations.
**Assessment:** Can locate and identify the latest source without guessing.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A filename like final-final-new is a reliable version system.
**Transfer bridge:** Manage project assets.

### BASE-WORK-002 — Notes and knowledge capture
**Objective:** Capture information so it can be retrieved and acted upon.
**Core concepts:** Separate raw notes, decisions, tasks and reference material.
**Core model:** Inbox, metadata, source, retrieval cue, linking
**Practice:** Turn a messy note into a structured record with source and next action.
**Assessment:** A future reader can understand context and provenance.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** More notes automatically create more knowledge.
**Transfer bridge:** Build a personal knowledge system.

### BASE-WORK-003 — Task capture and triage
**Objective:** Convert open loops into clear next actions.
**Core concepts:** Define task, outcome, owner, dependency and due condition.
**Core model:** Next action, context, priority, dependency, waiting
**Practice:** Process a small inbox into actionable tasks and reference notes.
**Assessment:** No item remains an ambiguous “work on project” entry.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Every task is equally urgent.
**Transfer bridge:** Plan projects.

### BASE-WORK-004 — Planning and estimation
**Objective:** Break work into milestones and estimate with uncertainty.
**Core concepts:** Use ranges and identify dependencies rather than false precision.
**Core model:** Milestone, critical path, buffer, estimate, risk
**Practice:** Plan a one-week project with deliverables and contingency.
**Assessment:** Plan includes testable outputs and realistic buffers.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A detailed plan eliminates uncertainty.
**Transfer bridge:** Manage larger projects.

### BASE-WORK-005 — Time and attention management
**Objective:** Match work to available time and cognitive demands.
**Core concepts:** Use time blocks as hypotheses and review actual friction.
**Core model:** Time budget, context switch, energy, interruption
**Practice:** Run a short work block and record interruptions without self-punishment.
**Assessment:** Adjusts plan based on evidence rather than idealised capacity.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A schedule is successful only if followed perfectly.
**Transfer bridge:** Build sustainable routines.

### BASE-WORK-006 — Typing and text entry
**Objective:** Improve accurate text entry with ergonomic technique.
**Core concepts:** Measure accuracy and speed separately.
**Core model:** Home row, touch typing, error rate, ergonomics
**Practice:** Practice short sessions with accuracy-first drills.
**Assessment:** Accuracy improves without pain or excessive tension.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Speed should be forced by typing harder.
**Transfer bridge:** Increase digital workflow fluency.

### BASE-WORK-007 — Terminal foundations
**Objective:** Use shell commands to inspect and manipulate files safely.
**Core concepts:** Understand current directory, quoting, wildcards and command output.
**Core model:** Shell, command, argument, pipe, exit status
**Practice:** Run safe listing, navigation and copy commands in a test directory.
**Assessment:** Predicts target paths and avoids destructive wildcard mistakes.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Copying a command without understanding it is safe.
**Transfer bridge:** Automate work.

### BASE-WORK-008 — Git workflow
**Objective:** Use commits and branches to make changes recoverable.
**Core concepts:** Review status and diff before committing.
**Core model:** Stage, commit, branch, merge, remote
**Practice:** Make a small change, inspect diff and create a descriptive commit.
**Assessment:** Can explain what changed and restore the prior state.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A push is the same as a commit.
**Transfer bridge:** Collaborate on software.

### BASE-WORK-009 — Spreadsheet foundations
**Objective:** Use formulas and tables for transparent calculations.
**Core concepts:** Reference cells correctly and audit formulas.
**Core model:** Cell, range, relative/absolute reference, validation, filter
**Practice:** Build a simple budget table and test formula behaviour when copied.
**Assessment:** Totals reconcile and formula assumptions are visible.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A spreadsheet formula is automatically correct because it calculates.
**Transfer bridge:** Build analytical models.

### BASE-WORK-010 — Documents and communication tools
**Objective:** Create clear documents with styles, structure and version control.
**Core concepts:** Use headings, tables and comments appropriately.
**Core model:** Styles, hierarchy, revision, collaboration, export
**Practice:** Turn notes into a structured one-page brief.
**Assessment:** Document is scannable and survives export.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Manual formatting every heading is more maintainable.
**Transfer bridge:** Produce professional documentation.

### BASE-WORK-011 — Automation foundations
**Objective:** Automate a repetitive task only after understanding its steps and failure modes.
**Core concepts:** Define trigger, inputs, outputs, exceptions and recovery.
**Core model:** Trigger, idempotency, validation, logging, retry
**Practice:** Automate renaming or sorting test files in a disposable folder.
**Assessment:** Repeated run does not corrupt or duplicate outputs.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Automation removes the need for checking.
**Transfer bridge:** Build robust workflows.

### BASE-WORK-012 — Workflow improvement
**Objective:** Measure bottlenecks and improve a process incrementally.
**Core concepts:** Map a workflow and identify a constraint or repeated handoff failure.
**Core model:** Process map, bottleneck, queue, feedback, standard work
**Practice:** Map a personal study or project workflow and test one improvement.
**Assessment:** Improvement is observable and does not add unnecessary overhead.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** More tools automatically improve productivity.
**Transfer bridge:** Design operational systems.

## ART — Artistic Development

### BASE-ART-001 — Observation and visual analysis
**Objective:** Describe what is actually visible before drawing interpretation.
**Core concepts:** Break a subject into large masses, edges and relationships.
**Core model:** Observation, negative shape, proportion, gesture
**Practice:** Make a timed observation study and compare against reference.
**Assessment:** Major relationships are captured before details.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Drawing what you think an object looks like is the same as observing it.
**Transfer bridge:** Build accurate construction.

### BASE-ART-002 — Line and mark control
**Objective:** Use line weight and mark direction intentionally.
**Core concepts:** Control pressure, speed and stroke direction.
**Core model:** Stroke, contour, gesture, line weight, rhythm
**Practice:** Complete straight-line, curve and ellipse drills with relaxed grip.
**Assessment:** Marks are deliberate and no pain is produced.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** More pressure always creates better line quality.
**Transfer bridge:** Construct forms.

### BASE-ART-003 — Shape and form
**Objective:** Distinguish 2D silhouette from 3D volume.
**Core concepts:** Construct simple objects from boxes, cylinders and spheres.
**Core model:** Silhouette, plane, axis, cross-contour, volume
**Practice:** Draw household objects as simplified solids.
**Assessment:** Forms remain coherent from multiple viewpoints.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Adding shading can repair incorrect structure.
**Transfer bridge:** Study perspective.

### BASE-ART-004 — Proportion and measurement
**Objective:** Compare relative sizes and alignments accurately.
**Core concepts:** Use sighting and landmark methods to check proportion.
**Core model:** Comparative measurement, axis, landmark, negative space
**Practice:** Draw a still life using relative measurement checks.
**Assessment:** Major proportions align within a chosen tolerance.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Memory alone is reliable for proportion.
**Transfer bridge:** Study figure and object construction.

### BASE-ART-005 — Perspective foundations
**Objective:** Represent spatial depth using consistent perspective cues.
**Core concepts:** Construct boxes with a horizon and vanishing points.
**Core model:** Horizon, vanishing point, convergence, foreshortening
**Practice:** Draw a simple room or box arrangement.
**Assessment:** Edges converge consistently and forms occupy plausible space.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Every drawing requires exactly one vanishing point.
**Transfer bridge:** Build environments.

### BASE-ART-006 — Value and light
**Objective:** Describe form through light direction and value grouping.
**Core concepts:** Separate light, halftone, core shadow, reflected light and cast shadow.
**Core model:** Value scale, light source, plane, cast shadow
**Practice:** Render a sphere and box under one clear light source.
**Assessment:** Value groups match form and light direction.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Dark outlines are a substitute for form shading.
**Transfer bridge:** Develop painting and rendering.

### BASE-ART-007 — Colour foundations
**Objective:** Mix and organise colour by hue, value and saturation.
**Core concepts:** Create a limited palette and control temperature relationships.
**Core model:** Colour wheel, complementary, analogous, temperature, chroma
**Practice:** Mix a small set of colour swatches from a limited palette.
**Assessment:** Swatches have intentional relationships and readable values.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Colour names alone describe how a colour behaves.
**Transfer bridge:** Study painting.

### BASE-ART-008 — Composition
**Objective:** Arrange shapes and values to guide the viewer.
**Core concepts:** Create a thumbnail series before committing to detail.
**Core model:** Focal point, balance, rhythm, framing, negative space
**Practice:** Make six small thumbnails for one scene and compare.
**Assessment:** Each thumbnail has a readable focal hierarchy.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Detail makes composition strong.
**Transfer bridge:** Develop visual storytelling.

### BASE-ART-009 — Figure and anatomy foundations
**Objective:** Construct simplified human proportions while respecting variation.
**Core concepts:** Use gesture, masses and joint landmarks rather than memorised rigid templates.
**Core model:** Gesture, proportion, skeleton landmarks, masses, pose
**Practice:** Draw varied reference poses with time-limited gesture studies.
**Assessment:** Pose reads clearly and avoids one universal body template.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** One idealised proportion fits every person.
**Transfer bridge:** Study advanced anatomy for artists.

### BASE-ART-010 — Visual storytelling
**Objective:** Communicate action and sequence through composition and visual cues.
**Core concepts:** Plan a short visual sequence with clear continuity.
**Core model:** Silhouette, staging, sequence, beat, continuity
**Practice:** Create a three-panel story with a clear setup, action and result.
**Assessment:** A viewer can infer sequence without explanatory text.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A complex background makes a story clearer.
**Transfer bridge:** Develop illustration and concept art.

### BASE-ART-011 — Reference and study practice
**Objective:** Use reference ethically and extract principles rather than copying blindly.
**Core concepts:** Record source and identify what is being studied.
**Core model:** Reference, study, transformation, attribution
**Practice:** Create a study from a permitted reference and annotate the learned principle.
**Assessment:** Source is recorded and the study identifies transferable structure.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A study automatically becomes an original work.
**Transfer bridge:** Build a personal visual library.

### BASE-ART-012 — Critique and deliberate practice
**Objective:** Select one controllable weakness and design a focused practice loop.
**Core concepts:** Compare work against a criterion and plan a next iteration.
**Core model:** Constraint, feedback, iteration, reflection
**Practice:** Review a study for proportion, value or perspective and redo one aspect.
**Assessment:** Revision is tied to a specific observable issue.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Practising longer without feedback guarantees improvement.
**Transfer bridge:** Build sustainable artistic development.

## ATH — Athletics & Physical Performance

### BASE-ATH-001 — Movement literacy
**Objective:** Recognize basic movement patterns and perform them with control.
**Core concepts:** Demonstrate squat, hinge, lunge, push, pull, brace and locomotion patterns.
**Core model:** Joint action, balance, coordination, movement quality
**Practice:** Perform low-intensity bodyweight patterns within comfortable range.
**Assessment:** Movement is controlled and pain-free; stop if pain or dizziness occurs.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A movement pattern must look identical for every body.
**Transfer bridge:** Build strength and sport skill.

### BASE-ATH-002 — Warm-up and readiness
**Objective:** Prepare gradually for activity and notice readiness signals.
**Core concepts:** Use a progressive warm-up matched to the session.
**Core model:** Raise temperature, mobility, activation, rehearsal
**Practice:** Create a short warm-up for a light football session.
**Assessment:** Warm-up progresses from general to specific without fatigue.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Static stretching alone is a complete warm-up.
**Transfer bridge:** Improve performance preparation.

### BASE-ATH-003 — Mobility and flexibility
**Objective:** Distinguish joint mobility, flexibility and control.
**Core concepts:** Use gentle range-of-motion practice without forcing end range.
**Core model:** Range of motion, tissue tolerance, active control
**Practice:** Perform a simple mobility sequence and compare controlled versus passive range.
**Assessment:** No bouncing or forced pain; movement remains controlled.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** More range is always better for performance.
**Transfer bridge:** Build movement capacity.

### BASE-ATH-004 — Coordination and balance
**Objective:** Control body position and timing across simple tasks.
**Core concepts:** Practice balance and hand-foot coordination with progressive difficulty.
**Core model:** Proprioception, visual feedback, rhythm, stability
**Practice:** Use single-leg balance and simple alternating movement patterns near support.
**Assessment:** Maintains control and adjusts difficulty safely.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Wobbling means the exercise is failing.
**Transfer bridge:** Develop agility and ball control.

### BASE-ATH-005 — Strength foundations
**Objective:** Explain progressive resistance and safe technique.
**Core concepts:** Choose manageable resistance and leave room for recovery.
**Core model:** Force, reps, sets, load, progression, technique
**Practice:** Learn basic bodyweight patterns and track quality rather than maximal effort.
**Assessment:** Technique remains consistent and training is age-appropriate.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Training to failure every session is required.
**Transfer bridge:** Build strength and power.

### BASE-ATH-006 — Aerobic conditioning
**Objective:** Explain intensity, duration and aerobic adaptation.
**Core concepts:** Use talk test or perceived effort for broad intensity awareness.
**Core model:** Aerobic metabolism, pacing, volume, recovery
**Practice:** Complete a comfortable conversational-pace activity and record duration.
**Assessment:** Effort is sustainable and recovery is monitored.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Every run should be maximal to improve stamina.
**Transfer bridge:** Build endurance.

### BASE-ATH-007 — Speed and acceleration
**Objective:** Understand acceleration mechanics and the need for full recovery.
**Core concepts:** Practice short controlled accelerations with safe space and surface.
**Core model:** Projection, posture, stride, ground contact, rest
**Practice:** Use a few short submaximal accelerations after warm-up.
**Assessment:** Quality remains high and stops before fatigue degrades technique.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** More repetitions always improve speed.
**Transfer bridge:** Develop sprint performance.

### BASE-ATH-008 — Agility and deceleration
**Objective:** Change direction with control and prepare to absorb force.
**Core concepts:** Practice planned deceleration before reactive cutting.
**Core model:** Braking, centre of mass, foot placement, reaction
**Practice:** Use low-speed planned direction changes with clear spacing.
**Assessment:** Can stop under control without knee collapse or pain.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Agility is only about moving feet quickly.
**Transfer bridge:** Apply sport-specific movement.

### BASE-ATH-009 — Sport skill acquisition
**Objective:** Break sport skills into perception, decision and execution.
**Core concepts:** Practice a football pass or first touch under gradually varied conditions.
**Core model:** Technique, perception-action, constraints, feedback
**Practice:** Alternate predictable passing with small variations in angle and pressure.
**Assessment:** Accuracy and decision quality are assessed separately.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A perfect isolated drill guarantees match performance.
**Transfer bridge:** Develop tactical skill.

### BASE-ATH-010 — Recovery and load management
**Objective:** Recognize fatigue and balance training with recovery.
**Core concepts:** Track simple workload and subjective readiness without obsessive monitoring.
**Core model:** Load, adaptation, fatigue, sleep, soreness
**Practice:** Review a sample week and identify too many high-intensity days.
**Assessment:** Plan includes rest and adjusts for pain, illness or unusual fatigue.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Rest days mean losing progress.
**Transfer bridge:** Design training cycles.

### BASE-ATH-011 — Training design
**Objective:** Build a balanced week around goals, constraints and recovery.
**Core concepts:** Use progression, specificity and variation with age-appropriate volume.
**Core model:** Frequency, intensity, time, type, progression, periodization
**Practice:** Design a simple balanced microcycle with easy and harder sessions.
**Assessment:** No abrupt load spikes; plan is realistic and recoverable.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A sophisticated plan is better than a consistent simple plan.
**Transfer bridge:** Study periodization.

### BASE-ATH-012 — Performance analysis
**Objective:** Review performance using observable actions and context.
**Core concepts:** Separate outcome, decision and execution in a match or drill.
**Core model:** Event coding, decision quality, context, feedback
**Practice:** Review a short play sequence and identify one decision improvement.
**Assessment:** Feedback is specific, fair and linked to a next practice task.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** One mistake defines overall ability.
**Transfer bridge:** Develop tactical intelligence.

## PERF — Vocal & Performance Arts

### BASE-PERF-001 — Vocal health
**Objective:** Recognize comfortable versus strained voice use.
**Core concepts:** Use gentle vocal practice and stop with pain, persistent hoarseness or strain.
**Core model:** Vocal folds, hydration, load, rest, resonance
**Practice:** Compare comfortable speaking and gentle humming; record strain signals.
**Assessment:** No forced volume or range; seeks qualified help for persistent symptoms.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Pain is a normal sign of vocal progress.
**Transfer bridge:** Build safe vocal technique.

### BASE-PERF-002 — Breath coordination
**Objective:** Coordinate easy breath flow with short phrases.
**Core concepts:** Avoid excessive inhalation and shoulder tension.
**Core model:** Breath phrase, airflow, posture, release
**Practice:** Speak a short phrase at comfortable volume with relaxed breathing.
**Assessment:** Phrase remains easy without breath holding or pushing.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** More air pressure always creates stronger voice.
**Transfer bridge:** Develop phrasing and projection.

### BASE-PERF-003 — Pitch foundations
**Objective:** Recognize and reproduce simple pitch relationships.
**Core concepts:** Use a reference tone and compare matching accuracy.
**Core model:** Pitch, interval, register, auditory feedback
**Practice:** Match a comfortable note using a reference tone and record attempts.
**Assessment:** Can identify close versus distant pitch without forcing range.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Louder singing improves pitch accuracy.
**Transfer bridge:** Build intonation.

### BASE-PERF-004 — Rhythm and timing
**Objective:** Maintain a pulse and subdivide simple patterns.
**Core concepts:** Count beats and perform simple rhythmic patterns.
**Core model:** Pulse, meter, subdivision, tempo, syncopation
**Practice:** Clap or tap a basic pattern with metronome support.
**Assessment:** Maintains pulse and can explain subdivision.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Tempo and rhythm are identical.
**Transfer bridge:** Develop musicality.

### BASE-PERF-005 — Listening and ear training
**Objective:** Attend to pitch, rhythm, timbre and phrasing.
**Core concepts:** Describe one audible feature before judging a performance.
**Core model:** Timbre, contour, interval, dynamics, articulation
**Practice:** Compare two short public-domain or original audio examples.
**Assessment:** Descriptions refer to audible evidence rather than vague taste.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Ear training only means naming notes.
**Transfer bridge:** Develop musicianship.

### BASE-PERF-006 — Articulation and diction
**Objective:** Produce clear speech sounds without unnecessary tension.
**Core concepts:** Practice consonant clarity and vowel consistency at natural pace.
**Core model:** Articulator, consonant, vowel, intelligibility, prosody
**Practice:** Read a short paragraph at conversational pace and review clarity.
**Assessment:** Listener can understand words without exaggerated jaw tension.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Speaking faster is the same as speaking clearly.
**Transfer bridge:** Improve singing and public speaking.

### BASE-PERF-007 — Resonance and tone
**Objective:** Explore comfortable resonance without forcing volume.
**Core concepts:** Notice changes in tone with gentle placement exercises.
**Core model:** Resonance, formant, register, vocal tract
**Practice:** Use gentle humming and vowel transitions within comfortable range.
**Assessment:** Tone changes without pain or pressed phonation.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A single placement sensation works for every voice.
**Transfer bridge:** Develop tone and range.

### BASE-PERF-008 — Phrasing and expression
**Objective:** Shape phrases using breath, emphasis and dynamics.
**Core concepts:** Mark phrase structure and emotional intent.
**Core model:** Phrase arc, emphasis, dynamics, legato, pause
**Practice:** Interpret a short passage in two contrasting ways.
**Assessment:** Choices are intentional and words remain intelligible.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Expression requires exaggerated volume.
**Transfer bridge:** Build performance craft.

### BASE-PERF-009 — Practice design
**Objective:** Use short, focused sessions with a clear target and recovery.
**Core concepts:** Select one technical focus and review performance evidence.
**Core model:** Warm-up, target, repetition, feedback, rest
**Practice:** Create a 15-minute practice structure with breaks and reflection.
**Assessment:** Session avoids fatigue and defines a next step.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Repeating a difficult passage endlessly is efficient.
**Transfer bridge:** Build durable performance skill.

### BASE-PERF-010 — Recording and self-review
**Objective:** Record a performance and assess it against one criterion.
**Core concepts:** Use consistent recording conditions for comparison.
**Core model:** Microphone distance, clipping, room noise, playback
**Practice:** Record two short takes and compare pitch, clarity or timing.
**Assessment:** Evaluation is specific and avoids judging identity or worth.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A phone recording captures every aspect of live sound accurately.
**Transfer bridge:** Develop recording technique.

### BASE-PERF-011 — Stagecraft foundations
**Objective:** Communicate intention to an audience through preparation and presence.
**Core concepts:** Plan opening, transitions and recovery from mistakes.
**Core model:** Audience, pacing, cue, presence, contingency
**Practice:** Deliver a short prepared performance to a safe audience.
**Assessment:** Audience understands structure and performer recovers calmly from a slip.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Confidence means never feeling nervous.
**Transfer bridge:** Develop public performance.

### BASE-PERF-012 — Repertoire and interpretation
**Objective:** Select material suited to current ability and artistic goals.
**Core concepts:** Research context and make an interpretation plan.
**Core model:** Repertoire, style, context, authorship, interpretation
**Practice:** Prepare a short piece and explain stylistic choices.
**Assessment:** Selection is appropriate and interpretation is evidence-informed.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Difficulty alone determines artistic value.
**Transfer bridge:** Build an independent repertoire.

## MATH — Mathematics & Scientific Reasoning

### BASE-MATH-001 — Number sense
**Objective:** Estimate magnitude and judge whether a result is plausible.
**Core concepts:** Use benchmarks, place value and rounding to check calculations.
**Core model:** Magnitude, place value, number line, estimation
**Practice:** Estimate totals and compare exact answers with estimates.
**Assessment:** Can detect an order-of-magnitude error.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A calculator result is automatically reasonable.
**Transfer bridge:** Build reliable arithmetic.

### BASE-MATH-002 — Arithmetic operations
**Objective:** Perform and explain operations with whole numbers and decimals.
**Core concepts:** Choose operation order and check with inverse operations.
**Core model:** Addition, subtraction, multiplication, division, order of operations
**Practice:** Solve multistep everyday calculations and verify independently.
**Assessment:** Steps and units are clear; inverse check agrees.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Memorising a procedure replaces understanding quantities.
**Transfer bridge:** Work with fractions and ratios.

### BASE-MATH-003 — Fractions and decimals
**Objective:** Represent the same quantity in fraction, decimal and visual forms.
**Core concepts:** Compare, simplify and operate with common fractions.
**Core model:** Numerator, denominator, equivalence, common denominator
**Practice:** Use area/number-line models before symbolic operations.
**Assessment:** Can explain why equivalent fractions have equal value.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A larger denominator always means a larger fraction.
**Transfer bridge:** Understand ratios and percentages.

### BASE-MATH-004 — Percentages and proportional change
**Objective:** Calculate percentage of, increase/decrease and reverse percentage.
**Core concepts:** Distinguish percentage points from percent change.
**Core model:** Base quantity, rate, multiplier, percentage point
**Practice:** Solve discount, tax and growth examples with explicit base values.
**Assessment:** Identifies the correct base and checks reasonableness.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A 20% increase followed by 20% decrease returns to the start.
**Transfer bridge:** Study finance and statistics.

### BASE-MATH-005 — Ratios and rates
**Objective:** Compare quantities using ratios and unit rates.
**Core concepts:** Scale recipes, maps or speed using proportional reasoning.
**Core model:** Ratio, rate, unit rate, scale factor, direct proportion
**Practice:** Solve unit-price and distance/time problems with units.
**Assessment:** Units remain consistent and scaling assumptions are explicit.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Every relationship is directly proportional.
**Transfer bridge:** Study algebra and measurement.

### BASE-MATH-006 — Negative numbers and number lines
**Objective:** Interpret signed quantities and perform operations with negatives.
**Core concepts:** Use number-line movement and additive inverses.
**Core model:** Integer, opposite, absolute value, order
**Practice:** Model temperature or elevation changes on a number line.
**Assessment:** Explains sign changes rather than relying on memorised tricks.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Two negatives always make a positive in every context.
**Transfer bridge:** Build algebra.

### BASE-MATH-007 — Algebraic expressions
**Objective:** Represent unknown quantities with symbols and simplify equivalent expressions.
**Core concepts:** Use distributive property and combine like terms.
**Core model:** Variable, coefficient, term, expression, equivalence
**Practice:** Translate verbal statements into expressions and simplify.
**Assessment:** Symbolic form preserves meaning and equivalent steps are justified.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** The variable is always a single unknown number in every context.
**Transfer bridge:** Solve equations.

### BASE-MATH-008 — Equations and inequalities
**Objective:** Solve one- and two-step equations and interpret inequalities.
**Core concepts:** Preserve equality by applying the same operation to both sides.
**Core model:** Equation, solution set, inverse operation, inequality
**Practice:** Solve and check by substitution; represent inequalities on a number line.
**Assessment:** Solution satisfies original statement and domain constraints.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Moving a term across the equals sign is a magical rule.
**Transfer bridge:** Study linear models.

### BASE-MATH-009 — Exponents and roots
**Objective:** Interpret powers and roots as structured operations.
**Core concepts:** Use exponent laws within their valid conditions.
**Core model:** Base, exponent, square root, scientific notation
**Practice:** Evaluate simple powers and roots and compare magnitude.
**Assessment:** Can explain why exponent rules work for basic cases.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** An exponent means multiply the base by the exponent.
**Transfer bridge:** Progress to scientific notation and functions.

### BASE-MATH-010 — Geometry and measurement
**Objective:** Use properties of shapes and units to solve measurement problems.
**Core concepts:** Calculate perimeter, area and volume with correct units.
**Core model:** Angle, polygon, area, surface area, volume, unit conversion
**Practice:** Measure a simple object and estimate area/volume.
**Assessment:** Formula, units and dimensional reasoning are correct.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Area and perimeter are interchangeable.
**Transfer bridge:** Study spatial reasoning and trigonometry.

### BASE-MATH-011 — Graphs and functions
**Objective:** Represent relationships using tables, graphs and rules.
**Core concepts:** Interpret slope and intercept in simple linear relationships.
**Core model:** Input/output, function, coordinate, slope, intercept
**Practice:** Graph a simple relationship and explain what slope means in context.
**Assessment:** Graph labels and interpretation match the data.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A graph is only a picture, not a mathematical representation.
**Transfer bridge:** Study modelling and calculus.

### BASE-MATH-012 — Mathematical reasoning
**Objective:** Explain a solution and test a claim with examples or counterexamples.
**Core concepts:** Distinguish example, conjecture and proof.
**Core model:** Definition, implication, counterexample, proof, assumption
**Practice:** Write a short explanation for a divisibility or pattern claim.
**Assessment:** Reasoning is logically connected and assumptions are stated.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Several examples prove a statement for all cases.
**Transfer bridge:** Build formal proof.

## CYBER — Cybersecurity & Digital Infrastructure

### BASE-CYBER-001 — Digital safety and privacy
**Objective:** Reduce common account and device risks.
**Core concepts:** Use unique credentials, multifactor authentication and privacy controls.
**Core model:** Attack surface, credential, MFA, privacy, recovery
**Practice:** Audit a fictional account setup and identify weaknesses.
**Assessment:** Recommendations are practical and do not expose real credentials.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A strong password alone prevents every account attack.
**Transfer bridge:** Understand identity and access.

### BASE-CYBER-002 — Operating system foundations
**Objective:** Explain processes, files, permissions and applications.
**Core concepts:** Identify how applications use OS resources.
**Core model:** Process, memory, filesystem, permission, user
**Practice:** Inspect safe system information and distinguish app from OS responsibilities.
**Assessment:** Can explain file ownership and process roles at a high level.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Closing an app always stops every background process.
**Transfer bridge:** Study Linux and system administration.

### BASE-CYBER-003 — Network foundations
**Objective:** Explain how devices address and exchange data.
**Core concepts:** Distinguish local network, router, DNS and IP address.
**Core model:** Packet, IP, MAC, router, DNS, port
**Practice:** Trace a browser request at a conceptual level.
**Assessment:** Can describe the path without confusing DNS with routing.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Wi-Fi and the internet are the same thing.
**Transfer bridge:** Study TCP/IP.

### BASE-CYBER-004 — Authentication and authorization
**Objective:** Distinguish proving identity from permission to act.
**Core concepts:** Apply least privilege in a simple role model.
**Core model:** Identity, authentication, authorization, session, token
**Practice:** Design viewer/editor/admin permissions for a fictional app.
**Assessment:** Roles grant only required actions and are checked server-side.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Hiding an admin button is access control.
**Transfer bridge:** Build secure applications.

### BASE-CYBER-005 — Permissions and least privilege
**Objective:** Limit access to files, devices and services.
**Core concepts:** Explain permission scope and inheritance.
**Core model:** Read/write/execute, owner, group, ACL, privilege
**Practice:** Review a sample permission table and reduce excessive access.
**Assessment:** Access is sufficient for task but no broader.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Administrator access should be used for convenience.
**Transfer bridge:** Operate systems securely.

### BASE-CYBER-006 — Backup and recovery
**Objective:** Protect important data against loss and corruption.
**Core concepts:** Use multiple copies and test restoration.
**Core model:** Backup, version, checksum, restore, RPO/RTO
**Practice:** Create and restore a test backup of disposable files.
**Assessment:** Restored files are verified, not merely assumed present.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A synced folder is always a complete backup.
**Transfer bridge:** Build incident readiness.

### BASE-CYBER-007 — Shell and Linux basics
**Objective:** Use a command line to inspect and manage a safe test environment.
**Core concepts:** Understand users, paths, processes and package provenance.
**Core model:** Shell, user, process, package, service
**Practice:** Run non-destructive commands in a sandbox or test environment.
**Assessment:** Explains commands before execution and avoids privilege escalation by habit.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Copy-pasting commands from unknown sources is safe.
**Transfer bridge:** Study administration.

### BASE-CYBER-008 — Web security basics
**Objective:** Identify common web trust boundaries and input risks.
**Core concepts:** Explain output encoding, server-side validation and secure session handling.
**Core model:** XSS, injection, CSRF, session, validation
**Practice:** Review a deliberately insecure toy form and propose defensive changes.
**Assessment:** Only authorized lab examples; fixes are tied to threat mechanism.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Client-side validation blocks malicious requests.
**Transfer bridge:** Study secure software.

### BASE-CYBER-009 — Secure coding foundations
**Objective:** Handle secrets, errors and untrusted data safely.
**Core concepts:** Use parameterized queries and safe error responses conceptually.
**Core model:** Input validation, output encoding, secret management, dependency
**Practice:** Review a small code sample for insecure data handling.
**Assessment:** Identifies trust boundary and safe replacement.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Encryption fixes every security flaw.
**Transfer bridge:** Develop defensive applications.

### BASE-CYBER-010 — Threat modelling
**Objective:** Identify assets, adversaries, attack paths and mitigations.
**Core concepts:** Use a simple threat-model worksheet.
**Core model:** Asset, actor, boundary, threat, mitigation, residual risk
**Practice:** Threat-model a personal portfolio website.
**Assessment:** Risks are specific and mitigations map to attack paths.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A threat model predicts every possible attack.
**Transfer bridge:** Plan security controls.

### BASE-CYBER-011 — Defensive monitoring
**Objective:** Recognize useful security events and preserve context.
**Core concepts:** Interpret basic logs without assuming every anomaly is malicious.
**Core model:** Event, timestamp, source, baseline, alert, triage
**Practice:** Review synthetic login logs and identify suspicious patterns.
**Assessment:** Separates evidence, hypothesis and confirmed incident.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** One failed login proves compromise.
**Transfer bridge:** Study incident response.

### BASE-CYBER-012 — Authorized lab practice
**Objective:** Learn security testing only in systems with explicit permission.
**Core concepts:** Define scope, rules of engagement and safe reporting.
**Core model:** Authorization, scope, test environment, disclosure, evidence
**Practice:** Complete a toy lab or intentionally vulnerable local exercise with written scope.
**Assessment:** No third-party targeting; findings are documented and responsibly handled.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Publicly reachable means authorized to test.
**Transfer bridge:** Progress to advanced defensive research.

## LANG — Language & Linguistic Intelligence

### BASE-LANG-001 — Language learning strategy
**Objective:** Build a balanced routine across listening, speaking, reading and writing.
**Core concepts:** Choose target situations and assess current ability before selecting content.
**Core model:** Input, output, retrieval, feedback, proficiency, context
**Practice:** Create a weekly plan around one real communication goal.
**Assessment:** Plan includes comprehension and production, not vocabulary collection alone.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** App streaks prove language proficiency.
**Transfer bridge:** Build a second-language pathway.

### BASE-LANG-002 — Sound and phonology
**Objective:** Notice and produce meaningful sound contrasts.
**Core concepts:** Use listening discrimination and articulation practice.
**Core model:** Phoneme, syllable, stress, intonation, minimal pair
**Practice:** Compare a target-language sound pair and record a short practice sample.
**Assessment:** Can hear the contrast and produce it intelligibly without strain.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Accent elimination is required for communication.
**Transfer bridge:** Improve listening and pronunciation.

### BASE-LANG-003 — Vocabulary acquisition
**Objective:** Learn words with context, collocation and retrieval.
**Core concepts:** Record meaning, usage, register and example phrase.
**Core model:** Lexeme, collocation, polysemy, register, retrieval cue
**Practice:** Learn a small set and use each item in a new sentence after a delay.
**Assessment:** Can recall and use words appropriately, not just recognize translations.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** One-word translation captures every meaning.
**Transfer bridge:** Build fluent reading and speaking.

### BASE-LANG-004 — Grammar as structure
**Objective:** Use grammar to express relationships between ideas.
**Core concepts:** Identify phrase, clause, tense/aspect and agreement in context.
**Core model:** Syntax, morphology, clause, tense, aspect, agreement
**Practice:** Compare two sentences and explain how grammar changes meaning.
**Assessment:** Explanation refers to function and usage, not only rule labels.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Grammar is a list of arbitrary prohibitions.
**Transfer bridge:** Write precise sentences.

### BASE-LANG-005 — Reading comprehension
**Objective:** Extract explicit meaning, infer cautiously and track argument structure.
**Core concepts:** Summarize a passage and distinguish fact from implication.
**Core model:** Main idea, inference, cohesion, reference, argument
**Practice:** Annotate a short article and write a concise evidence-based summary.
**Assessment:** Summary preserves author’s claims without adding unsupported claims.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Reading speed alone measures comprehension.
**Transfer bridge:** Study technical and academic texts.

### BASE-LANG-006 — Listening comprehension
**Objective:** Understand speech across speed, accent and context.
**Core concepts:** Use gist, detail and repeated listening strategically.
**Core model:** Gist, detail, segmentation, connected speech, context
**Practice:** Listen once for gist and again for evidence details.
**Assessment:** Can identify main point and acknowledge uncertain segments.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Understanding every word is necessary to understand a conversation.
**Transfer bridge:** Develop spontaneous comprehension.

### BASE-LANG-007 — Writing foundations
**Objective:** Write clear paragraphs with a claim, support and logical sequence.
**Core concepts:** Revise for audience, coherence and evidence.
**Core model:** Topic sentence, cohesion, paragraph, revision, register
**Practice:** Write a short explanation and revise it after reading aloud.
**Assessment:** Reader can identify main point and supporting reason.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Longer writing is automatically more persuasive.
**Transfer bridge:** Develop essays and technical writing.

### BASE-LANG-008 — Speaking and interaction
**Objective:** Communicate clearly and repair misunderstandings.
**Core concepts:** Use turn-taking, clarification and paraphrase.
**Core model:** Fluency, intelligibility, repair, register, turn-taking
**Practice:** Explain a familiar process and ask a listener what remained unclear.
**Assessment:** Can adapt explanation based on listener feedback.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Speaking without pauses is the same as fluency.
**Transfer bridge:** Develop debate and presentation.

### BASE-LANG-009 — Bangla-English technical bridging
**Objective:** Map technical concepts across Bangla and English without assuming word-for-word equivalence.
**Core concepts:** Create bilingual glossaries with definitions and examples.
**Core model:** Terminology, concept mapping, false equivalence, register
**Practice:** Explain a science concept in both languages and compare meaning.
**Assessment:** Core concept remains accurate in both versions.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A direct translation is always technically correct.
**Transfer bridge:** Improve school and technical communication.

### BASE-LANG-010 — Rhetoric and argument
**Objective:** Build claims supported by reasons and credible evidence.
**Core concepts:** Distinguish claim, warrant, evidence and rebuttal.
**Core model:** Argument, premise, inference, counterargument, rhetoric
**Practice:** Write a short argument with one counterargument and response.
**Assessment:** Reasoning is valid and evidence is relevant.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Confident wording makes an argument true.
**Transfer bridge:** Develop debate and persuasion.

### BASE-LANG-011 — Second-language pathway design
**Objective:** Choose a language and sequence based on use cases and available input.
**Core concepts:** Set proficiency targets for real tasks rather than collecting languages.
**Core model:** CEFR-like descriptors, comprehensible input, output, feedback
**Practice:** Design a beginner pathway for a selected language and target scenario.
**Assessment:** Targets are observable (e.g. handle a simple conversation) and balanced.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Knowing many alphabets equals knowing many languages.
**Transfer bridge:** Progress to independent multilingual use.

### BASE-LANG-012 — Linguistic awareness
**Objective:** Notice how languages encode meaning differently.
**Core concepts:** Compare word order, morphology and pragmatic conventions.
**Core model:** Typology, morphology, pragmatics, sociolinguistics
**Practice:** Compare how a request is phrased in two languages and contexts.
**Assessment:** Avoids ranking languages and recognises social context.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** One language is inherently more logical than another.
**Transfer bridge:** Study linguistics.

## RES — Research & Information Intelligence

### BASE-RES-001 — Question formation
**Objective:** Turn curiosity into a focused, answerable research question.
**Core concepts:** Define scope, population/context and key terms.
**Core model:** Research question, scope, operationalisation, feasibility
**Practice:** Narrow a broad question into one answerable within available time.
**Assessment:** Question is clear, bounded and investigable.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A broad topic is already a research question.
**Transfer bridge:** Plan a search strategy.

### BASE-RES-002 — Search strategy
**Objective:** Search systematically using synonyms and source types.
**Core concepts:** Use query operators and record search decisions.
**Core model:** Keyword, synonym, Boolean, database, search log
**Practice:** Search one topic using multiple terms and compare results.
**Assessment:** Search is reproducible and not dependent on one query.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** The first search result is the best source.
**Transfer bridge:** Conduct literature review.

### BASE-RES-003 — Source credibility
**Objective:** Evaluate authority, evidence, methods, currency and conflicts.
**Core concepts:** Match source type to the claim being investigated.
**Core model:** Primary/secondary, expertise, method, conflict, date
**Practice:** Compare a news summary, official dataset and original study.
**Assessment:** Explains what each source can and cannot support.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A prestigious domain guarantees every claim is correct.
**Transfer bridge:** Build an evidence base.

### BASE-RES-004 — Claims and evidence
**Objective:** Separate factual claims, interpretations and opinions.
**Core concepts:** Trace a claim to its strongest available evidence.
**Core model:** Claim, evidence, inference, uncertainty, falsifiability
**Practice:** Create a claim-evidence table for a short article.
**Assessment:** Each claim has support or is labelled unverified.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A citation automatically proves the claim.
**Transfer bridge:** Write evidence-based explanations.

### BASE-RES-005 — Citation and provenance
**Objective:** Record sources so another person can locate and evaluate them.
**Core concepts:** Capture author, title, publisher, date, URL/identifier and access details.
**Core model:** Citation, provenance, locator, attribution, license
**Practice:** Create source records for three different source types.
**Assessment:** References are complete enough to retrieve and verify.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A link pasted without context is a full citation.
**Transfer bridge:** Build reusable research notes.

### BASE-RES-006 — Bias and misinformation
**Objective:** Recognize framing, selection and manipulation techniques.
**Core concepts:** Check original context and compare independent reporting.
**Core model:** Selection bias, framing, cherry-picking, deepfake, context
**Practice:** Audit a viral claim and locate its earliest traceable source.
**Assessment:** Separates verified fact, missing context and unresolved uncertainty.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A claim is false just because it is emotionally framed.
**Transfer bridge:** Conduct fact-checking.

### BASE-RES-007 — Research design basics
**Objective:** Choose a method that can answer the question ethically.
**Core concepts:** Distinguish observational, experimental and descriptive designs.
**Core model:** Variable, control, sample, measurement, confounder
**Practice:** Design a safe hypothetical study and identify confounds.
**Assessment:** Method matches question and limitations are stated.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** An experiment is always better than observation.
**Transfer bridge:** Study methodology.

### BASE-RES-008 — Data collection and quality
**Objective:** Collect data consistently and document measurement limits.
**Core concepts:** Use a data dictionary and basic quality checks.
**Core model:** Sampling, missingness, measurement error, data dictionary
**Practice:** Clean a small synthetic dataset and document changes.
**Assessment:** Transformations are reproducible and missing data are not silently erased.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** More data automatically means better data.
**Transfer bridge:** Analyse quantitative evidence.

### BASE-RES-009 — Evidence synthesis
**Objective:** Compare findings across sources and explain agreement/disagreement.
**Core concepts:** Use a synthesis matrix rather than stacking summaries.
**Core model:** Convergence, divergence, heterogeneity, confidence
**Practice:** Build a matrix from a few sources and write a balanced synthesis.
**Assessment:** Conclusion reflects the strength and limits of the combined evidence.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Counting sources is the same as weighing evidence.
**Transfer bridge:** Write a literature review.

### BASE-RES-010 — Research writing
**Objective:** Present methods, evidence, reasoning and limitations transparently.
**Core concepts:** Structure a short report with traceable claims.
**Core model:** Abstract, method, result, discussion, limitation
**Practice:** Write a mini-report from a supplied dataset or source set.
**Assessment:** Reader can trace conclusion to evidence and reproduce key steps.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A polished report can compensate for weak methods.
**Transfer bridge:** Produce independent research.

### BASE-RES-011 — Reproducibility
**Objective:** Preserve data, code, methods and decisions needed to repeat work.
**Core concepts:** Version materials and document deviations.
**Core model:** Protocol, version, data lineage, replication, audit trail
**Practice:** Re-run a small analysis from saved source data and instructions.
**Assessment:** Another person can reproduce the result within stated limits.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A screenshot of the result is enough to reproduce it.
**Transfer bridge:** Build robust research practice.

### BASE-RES-012 — Research ethics
**Objective:** Respect consent, privacy, attribution and harm minimisation.
**Core concepts:** Identify when a project needs adult, institutional or expert oversight.
**Core model:** Consent, privacy, harm, authorship, disclosure
**Practice:** Review a fictional study for ethical risks and propose safeguards.
**Assessment:** Safeguards are appropriate and no real person’s data are exposed.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Publicly visible personal information is free to exploit.
**Transfer bridge:** Conduct responsible independent inquiry.

## INDEP — Practical Independence

### BASE-INDEP-001 — Personal safety and boundaries
**Objective:** Recognize unsafe situations and seek help early.
**Core concepts:** Use clear boundaries and trusted support routes.
**Core model:** Risk cue, boundary, consent, exit, help-seeking
**Practice:** Work through fictional scenarios and identify safe exits and contacts.
**Assessment:** Prioritises leaving danger and contacting trusted adults/services.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Handling every dangerous situation alone is independence.
**Transfer bridge:** Build emergency readiness.

### BASE-INDEP-002 — Hygiene and self-care systems
**Objective:** Maintain repeatable hygiene routines using safe products and instructions.
**Core concepts:** Recognize when a product or symptom needs adult/professional guidance.
**Core model:** Routine, label, contamination, skin irritation, privacy
**Practice:** Create a simple personal care checklist without unnecessary tracking.
**Assessment:** Routine is sustainable and avoids unsafe chemical mixing.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** More products always mean better hygiene.
**Transfer bridge:** Manage daily independence.

### BASE-INDEP-003 — Cooking foundations
**Objective:** Prepare simple meals using safe heat and knife practices.
**Core concepts:** Follow a recipe and sequence tasks efficiently.
**Core model:** Mise en place, heat, timing, knife safety, doneness
**Practice:** Prepare a simple supervised meal and clean the workspace.
**Assessment:** Hands, surfaces and tools are handled safely; food is cooked appropriately.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A recipe can be followed without checking food safety.
**Transfer bridge:** Develop a personal recipe repertoire.

### BASE-INDEP-004 — Food safety
**Objective:** Reduce contamination and temperature-related food risks.
**Core concepts:** Separate raw/cooked foods and store perishables safely.
**Core model:** Cross-contamination, temperature, storage, allergens
**Practice:** Inspect a kitchen scenario and identify unsafe handling.
**Assessment:** Can explain safe storage and allergen caution.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Smell alone proves food is safe.
**Transfer bridge:** Plan meals safely.

### BASE-INDEP-005 — Cleaning and household systems
**Objective:** Clean common surfaces using appropriate methods and product labels.
**Core concepts:** Avoid mixing chemicals and ventilate as directed.
**Core model:** Detergent, disinfectant, dilution, contact time, ventilation
**Practice:** Create a room cleaning sequence using ordinary safe products.
**Assessment:** Follows label and avoids dangerous combinations.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Mixing cleaners makes them stronger.
**Transfer bridge:** Maintain a household routine.

### BASE-INDEP-006 — Clothing and garment care
**Objective:** Interpret care labels and maintain common clothing.
**Core concepts:** Sort laundry and choose suitable washing/drying conditions.
**Core model:** Fabric, care symbol, colour transfer, shrinkage
**Practice:** Sort a sample laundry load by label and colour.
**Assessment:** Identifies garments needing special care.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** All fabrics tolerate the same wash cycle.
**Transfer bridge:** Maintain personal belongings.

### BASE-INDEP-007 — Money administration
**Objective:** Track small transactions and keep receipts/records organised.
**Core concepts:** Verify totals and protect financial information.
**Core model:** Receipt, ledger, budget, privacy, reconciliation
**Practice:** Reconcile a fictional weekly spending record.
**Assessment:** Totals match and private credentials are not stored in plain view.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Remembering every transaction is reliable recordkeeping.
**Transfer bridge:** Develop financial independence.

### BASE-INDEP-008 — Navigation and travel planning
**Objective:** Plan a route with time, cost and contingency.
**Core concepts:** Use map orientation and verify important route details.
**Core model:** Landmark, route, transfer, buffer, check-in
**Practice:** Plan a familiar local journey with a backup route and trusted contact.
**Assessment:** Route is plausible and includes safe contingency.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A map route guarantees current conditions.
**Transfer bridge:** Build independent travel skills.

### BASE-INDEP-009 — Basic tools and repairs
**Objective:** Identify common hand tools and know when not to attempt a repair.
**Core concepts:** Use simple tools safely on non-electrical, low-risk tasks.
**Core model:** Fastener, leverage, tool fit, isolation, hazard
**Practice:** Identify tools for a loose furniture screw and inspect stability.
**Assessment:** Uses correct tool and stops when structural/electrical risk appears.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Force can solve a mismatched tool problem.
**Transfer bridge:** Develop household maintenance.

### BASE-INDEP-010 — Household troubleshooting
**Objective:** Use a safe diagnose-check-escalate process.
**Core concepts:** Separate symptom from cause and avoid risky disassembly.
**Core model:** Symptom, hypothesis, isolation, escalation
**Practice:** Troubleshoot a fictional non-electrical household issue.
**Assessment:** Checks simple safe causes and escalates beyond competence.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Taking equipment apart is the best first step.
**Transfer bridge:** Build practical problem-solving.

### BASE-INDEP-011 — First-aid literacy
**Objective:** Recognize emergencies and understand the role of trained responders.
**Core concepts:** Know how to summon local emergency help and follow dispatcher instructions.
**Core model:** Scene safety, emergency response, consent, certified training
**Practice:** Study official first-aid guidance and identify local emergency contact process with guardian.
**Assessment:** Does not claim CPR/first-aid competence without current certified practical training.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Reading instructions alone certifies emergency skill.
**Transfer bridge:** Pursue supervised certified training.

### BASE-INDEP-012 — Emergency planning
**Objective:** Prepare a simple household communication and evacuation plan.
**Core concepts:** Identify contacts, meeting points and essential information.
**Core model:** Hazard, contact tree, evacuation, supplies, reunification
**Practice:** Create a family-reviewed emergency plan.
**Assessment:** Plan is realistic, known to relevant adults and updated when needed.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A generic checklist replaces local emergency guidance.
**Transfer bridge:** Build resilience and independence.

## LEAD — Leadership & Management

### BASE-LEAD-001 — Self-management
**Objective:** Make commitments realistic and track follow-through.
**Core concepts:** Separate controllable actions from external outcomes.
**Core model:** Commitment, capacity, priority, review, reliability
**Practice:** Plan a small team task and report status honestly.
**Assessment:** Updates are timely and risks are surfaced early.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Leadership means doing everything yourself.
**Transfer bridge:** Build team reliability.

### BASE-LEAD-002 — Reliability and ownership
**Objective:** Take responsibility for agreed work and communicate blockers.
**Core concepts:** Define done criteria and handoff conditions.
**Core model:** Ownership, deliverable, dependency, escalation
**Practice:** Own a small task from definition to handoff.
**Assessment:** Task meets agreed criteria or variance is communicated.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Being reliable means never making mistakes.
**Transfer bridge:** Coordinate projects.

### BASE-LEAD-003 — Listening and understanding
**Objective:** Listen for goals, constraints and unspoken ambiguity.
**Core concepts:** Paraphrase and ask clarifying questions before proposing solutions.
**Core model:** Active listening, paraphrase, open question, assumption
**Practice:** Run a short requirements conversation and produce a neutral summary.
**Assessment:** Other person confirms the summary is accurate.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Listening is waiting silently for your turn.
**Transfer bridge:** Lead discovery and feedback.

### BASE-LEAD-004 — Teamwork foundations
**Objective:** Coordinate roles and shared outcomes.
**Core concepts:** Clarify responsibility and communication channels.
**Core model:** Role, norm, shared goal, handoff, psychological safety
**Practice:** Plan a small group task with role and dependency mapping.
**Assessment:** Every task has an owner and handoff is clear.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A team works best when everyone does the same task.
**Transfer bridge:** Manage projects.

### BASE-LEAD-005 — Goal setting
**Objective:** Translate a broad aim into observable milestones.
**Core concepts:** Define outcome, leading action and review condition.
**Core model:** Outcome, milestone, leading indicator, constraint
**Practice:** Turn a broad team goal into three measurable milestones.
**Assessment:** Measures reflect progress rather than vanity.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A numerical target is always meaningful.
**Transfer bridge:** Build strategy.

### BASE-LEAD-006 — Feedback and coaching
**Objective:** Give specific feedback that supports improvement.
**Core concepts:** Describe behaviour, impact and next experiment.
**Core model:** Observation, impact, feedforward, coaching question
**Practice:** Practice feedback on a fictional task without attacking identity.
**Assessment:** Feedback is actionable and proportionate.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Harshness makes feedback more honest.
**Transfer bridge:** Develop coaching skills.

### BASE-LEAD-007 — Delegation
**Objective:** Assign work with context, authority and support.
**Core concepts:** Match task ownership to capability and risk.
**Core model:** Outcome, authority, resources, check-in, escalation
**Practice:** Delegate a small project component with clear acceptance criteria.
**Assessment:** Person understands outcome and can raise blockers.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Delegation is merely transferring blame.
**Transfer bridge:** Manage operations.

### BASE-LEAD-008 — Project coordination
**Objective:** Track dependencies, risks and changes.
**Core concepts:** Use a simple project board and status review.
**Core model:** Scope, dependency, milestone, risk, change control
**Practice:** Coordinate a small multi-person project with a weekly review.
**Assessment:** Status is accurate and scope changes are recorded.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A project board alone makes a project succeed.
**Transfer bridge:** Study project management.

### BASE-LEAD-009 — Conflict resolution
**Objective:** Address disagreement through interests and evidence.
**Core concepts:** Separate positions from underlying needs.
**Core model:** Interest, position, boundary, mediation, repair
**Practice:** Work through a fictional disagreement and propose a fair next step.
**Assessment:** Solution acknowledges constraints and avoids coercion.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Avoiding conflict always preserves relationships.
**Transfer bridge:** Develop negotiation.

### BASE-LEAD-010 — Decision and accountability
**Objective:** Make decisions with clear ownership and review.
**Core concepts:** Record rationale, assumptions and reversal conditions.
**Core model:** Decision rights, trade-off, accountability, postmortem
**Practice:** Write a decision record for a small team choice.
**Assessment:** Decision can be reviewed without blaming individuals.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A leader must always be certain.
**Transfer bridge:** Build governance.

### BASE-LEAD-011 — Meeting and coordination hygiene
**Objective:** Run concise meetings with purpose and recorded actions.
**Core concepts:** Prepare agenda and assign action owners.
**Core model:** Agenda, decision, action item, facilitator, minutes
**Practice:** Facilitate a short meeting and circulate decisions.
**Assessment:** Meeting ends with clear owners and next steps.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** More meetings mean better coordination.
**Transfer bridge:** Manage larger teams.

### BASE-LEAD-012 — Ethical leadership
**Objective:** Consider power, fairness, transparency and consequences.
**Core concepts:** Identify conflicts of interest and protect dissent.
**Core model:** Power, fairness, transparency, duty of care, governance
**Practice:** Evaluate a fictional leadership dilemma and document options.
**Assessment:** Recommendation considers affected parties and accountability.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A successful outcome excuses unethical means.
**Transfer bridge:** Study organizational leadership.

## COMM — Communication & Rhetoric

### BASE-COMM-001 — Audience and purpose
**Objective:** Adapt message to what the audience needs to know or do.
**Core concepts:** Define audience knowledge, purpose and desired action.
**Core model:** Audience, purpose, context, channel, register
**Practice:** Explain one topic to a beginner and a knowledgeable peer.
**Assessment:** Both explanations are accurate and appropriately scoped.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** One explanation style works for every audience.
**Transfer bridge:** Build technical communication.

### BASE-COMM-002 — Active listening
**Objective:** Listen for content, emotion and uncertainty.
**Core concepts:** Paraphrase and clarify before responding.
**Core model:** Reflection, clarification, summarising, turn-taking
**Practice:** Conduct a short conversation and summarise the speaker’s point.
**Assessment:** Speaker confirms the summary is fair.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Interrupting with advice shows engagement.
**Transfer bridge:** Improve collaboration.

### BASE-COMM-003 — Clarity and concision
**Objective:** Express one main idea with precise wording.
**Core concepts:** Remove ambiguity and unnecessary filler without losing meaning.
**Core model:** Plain language, specificity, sentence load, ambiguity
**Practice:** Rewrite a dense paragraph into a clear version.
**Assessment:** Meaning is preserved and reader effort is reduced.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Shorter is always clearer.
**Transfer bridge:** Write concise explanations.

### BASE-COMM-004 — Message structure
**Objective:** Organize information in a sequence the audience can follow.
**Core concepts:** Use context, point, support and next step.
**Core model:** Signposting, hierarchy, transition, conclusion
**Practice:** Deliver a two-minute explanation with a clear beginning and end.
**Assessment:** Listener can restate the main message.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Adding more details automatically improves completeness.
**Transfer bridge:** Build presentations.

### BASE-COMM-005 — Explanation and teaching
**Objective:** Make an idea understandable through examples and checks.
**Core concepts:** Use analogy carefully and test whether it preserves the concept.
**Core model:** Scaffolding, example, analogy, misconception, check for understanding
**Practice:** Teach a simple concept and ask the learner to apply it to a new case.
**Assessment:** Learner can transfer the idea, not merely repeat the wording.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A catchy analogy is always accurate.
**Transfer bridge:** Develop instructional communication.

### BASE-COMM-006 — Questioning skills
**Objective:** Ask questions that reveal assumptions and useful detail.
**Core concepts:** Use open, closed and probing questions appropriately.
**Core model:** Open question, probe, funnel, clarification, neutrality
**Practice:** Interview a peer about a project requirement.
**Assessment:** Questions are neutral and answers inform a decision.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Leading questions produce reliable evidence.
**Transfer bridge:** Conduct research and discovery.

### BASE-COMM-007 — Writing for purpose
**Objective:** Choose format, tone and evidence for the writing task.
**Core concepts:** Draft, revise and proofread a practical document.
**Core model:** Genre, tone, structure, evidence, revision
**Practice:** Write a short project update with status, blocker and next action.
**Assessment:** Reader understands status and what is needed.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Formal wording always improves credibility.
**Transfer bridge:** Produce professional writing.

### BASE-COMM-008 — Argument and reasoning
**Objective:** Construct a claim with valid reasoning and relevant support.
**Core concepts:** Identify hidden assumptions and counterarguments.
**Core model:** Premise, conclusion, warrant, validity, evidence
**Practice:** Evaluate a short argument and improve its weakest inference.
**Assessment:** Separates truth of premises from validity of reasoning.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** A persuasive argument is necessarily sound.
**Transfer bridge:** Develop debate.

### BASE-COMM-009 — Persuasion and ethical influence
**Objective:** Present benefits and trade-offs without deception.
**Core concepts:** Match evidence and framing to audience while preserving informed choice.
**Core model:** Credibility, emotion, logic, disclosure, consent
**Practice:** Create two versions of a truthful proposal for different audiences.
**Assessment:** No fabricated urgency or concealed material limitation.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Persuasion means making someone agree at any cost.
**Transfer bridge:** Develop sales and negotiation.

### BASE-COMM-010 — Feedback and disagreement
**Objective:** Respond to criticism without losing the substance of the issue.
**Core concepts:** Ask for examples and identify actionable changes.
**Core model:** Feedback loop, defensiveness, repair, boundary
**Practice:** Practice receiving feedback and extracting one testable improvement.
**Assessment:** Can acknowledge useful feedback without accepting unfair claims.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** All criticism is valid or all criticism should be rejected.
**Transfer bridge:** Build resilience and collaboration.

### BASE-COMM-011 — Public speaking foundations
**Objective:** Deliver a structured short talk with understandable pacing.
**Core concepts:** Use rehearsal, signposting and audience awareness.
**Core model:** Opening, pacing, projection, pause, visual aid
**Practice:** Give a short talk and collect one comprehension observation.
**Assessment:** Audience can identify main point and follow sequence.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Memorising every word is the only way to prepare.
**Transfer bridge:** Develop advanced presentation.

### BASE-COMM-012 — Negotiation foundations
**Objective:** Clarify interests and seek agreements with explicit terms.
**Core concepts:** Prepare alternatives and identify non-negotiables.
**Core model:** BATNA, reservation point, interests, package, commitment
**Practice:** Negotiate a fictional project scope with fair trade-offs.
**Assessment:** Agreement records scope, responsibilities and conditions.
**Success criteria:** Independent performance; explain reasoning; identify a limitation or edge case.
**Common misconception:** Negotiation is simply winning against the other person.
**Transfer bridge:** Develop advanced negotiation.
