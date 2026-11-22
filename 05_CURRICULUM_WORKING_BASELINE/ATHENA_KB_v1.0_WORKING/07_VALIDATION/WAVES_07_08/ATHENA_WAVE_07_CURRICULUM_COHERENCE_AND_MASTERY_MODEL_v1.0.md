# ATHENA Wave 07 — Curriculum Coherence & Mastery Model v1.0

**Baseline:** KB v3.22 / Master Vault v5.8  
**Scope:** all 216 baseline modules across 18 disciplines  
**Status:** authored proposal; semantic owner review not performed

## Executive result

- Audited all 216 module records and the existing 216-node / 206-edge curriculum sequence graph.
- Preserved every baseline module ID and every existing recommended-sequence edge.
- Added 0 hard prerequisites. Sequence remains advisory; diagnostic evidence can justify skip, reorder or bridge-first placement.
- Authored 18 discipline progression maps, 216 module-specific mastery profiles, 40 cross-discipline bridges, 20 gap/overlap/sequence findings and 8 representative learner pathways.
- Cross-discipline links are explicitly non-gating and distinguish `SUPPORTS`, `APPLIES_TO` and `OVERLAPS_WITH`; they are not claims of equivalence.

## 1. Audit of the existing progression graph

The source graph contains 216 nodes and 206 advisory edges. Its existing validation reports 0 unresolved endpoints and an acyclic topological traversal of 216 nodes. The graph policy explicitly says recommended sequence edges do not block learner progress. Wave 07 retains that policy.

The 18 discipline spines each contain 12 modules. Most disciplines have 11 within-discipline sequence edges; MATH has 19. This is a graph-shape observation, not proof that the denser mathematics sequence is better or that every edge is a prerequisite.

## 2. Curriculum coherence rules

1. **Outcome-first sequencing:** order modules by the knowledge or performance needed for the next task, not by numbering alone.
2. **No inferred hard gates:** a preceding module is a recommendation unless the target task genuinely cannot be performed without a named prerequisite.
3. **Diagnostic placement:** learners can start at the point supported by evidence; a gap creates a narrow bridge, not a forced restart.
4. **Separate adjacent constructs:** shared vocabulary or context does not mean two modules teach the same thing.
5. **Interdisciplinary bridges are not equivalence claims:** connections help transfer; each discipline keeps its own standards and safety boundaries.
6. **Mastery is multidimensional:** accuracy, reasoning, independence, adaptability and retention are reported separately; no universal average score.
7. **Safety is non-compensatory:** a critical safety/authorization failure blocks the relevant practical demonstration regardless of other scores.

## 3. Mastery model

| Level | Meaning | Permitted inference |
| --- | --- | --- |
| 0 — Not yet evidenced | No usable evidence collected | No ability judgement |
| 1 — Emerging / supported | Partial attempt; prompts or substantial support remain | Learning in progress; identify exact gap |
| 2 — Independent demonstration | Meets the module outcome independently under stated conditions | Outcome demonstrated in this task context |
| 3 — Adaptive transfer | Applies outcome to changed/unfamiliar context and handles a boundary | Transfer demonstrated for this sampled context |
| 4 — Retained / repeatable | Cold performance after delay on a parallel task | Retention/repeatability evidence for stated interval and conditions |


The levels are ordered evidence states, not a psychometric scale. They are not automatically averaged, converted into a percentage or treated as permanent traits. A learner may show strong transfer in one context and still need support in another.

## 4. Discipline progression maps

Each map contains all 12 module IDs, the target outcome, its default position, a concise role in the pathway, and the preceding recommended module. Every edge is advisory. See the machine-readable JSON for all 216 node records.

### ENG — Engineering & Computer Science

| Seq | Module ID | Module | Outcome |
| --- | --- | --- | --- |
| 1 | BASE-ENG-001 | Problem decomposition | Break a real problem into inputs, outputs, constraints and smaller testable tasks. |
| 2 | BASE-ENG-002 | Algorithms and pseudocode | Express a deterministic procedure in ordered steps and trace its state. |
| 3 | BASE-ENG-003 | Variables and data types | Choose and use values with explicit types and valid operations. |
| 4 | BASE-ENG-004 | Control flow | Use conditions and loops to express branching and repetition. |
| 5 | BASE-ENG-005 | Functions and contracts | Decompose programs into functions with clear responsibilities and contracts. |
| 6 | BASE-ENG-006 | Collections and data structures | Select a collection based on access and update requirements. |
| 7 | BASE-ENG-007 | Debugging and testing | Locate faults using reproducible evidence and test cases. |
| 8 | BASE-ENG-008 | Files and command line | Navigate directories and safely run programs with command-line arguments. |
| 9 | BASE-ENG-009 | Version control foundations | Track changes and recover from mistakes using version control. |
| 10 | BASE-ENG-010 | Web and HTTP foundations | Explain how browsers, servers, requests and responses interact. |
| 11 | BASE-ENG-011 | Relational data foundations | Represent structured records with entities, attributes and relationships. |
| 12 | BASE-ENG-012 | Security and reliability basics | Build safe defaults into a small application. |


### BIZ — Business & Entrepreneurship

| Seq | Module ID | Module | Outcome |
| --- | --- | --- | --- |
| 1 | BASE-BIZ-001 | Problem and customer discovery | Identify a specific customer group and a problem worth solving. |
| 2 | BASE-BIZ-002 | Market research foundations | Estimate a market using transparent assumptions and primary/secondary evidence. |
| 3 | BASE-BIZ-003 | Value proposition | Connect a customer problem to a credible outcome and differentiator. |
| 4 | BASE-BIZ-004 | Offer and pricing basics | Define scope, deliverables, limits and a defensible price. |
| 5 | BASE-BIZ-005 | Ethical sales conversations | Understand needs and communicate a fit without manipulation. |
| 6 | BASE-BIZ-006 | Marketing and positioning | Reach a defined audience with a consistent, truthful message. |
| 7 | BASE-BIZ-007 | Funnel and measurement | Track a customer’s path from discovery to purchase and repeat use. |
| 8 | BASE-BIZ-008 | Bookkeeping and cash flow | Record business transactions and distinguish profit from cash. |
| 9 | BASE-BIZ-009 | Unit economics | Evaluate contribution per sale before scaling. |
| 10 | BASE-BIZ-010 | Operations and fulfilment | Deliver a consistent service or product with clear handoffs. |
| 11 | BASE-BIZ-011 | Customer support and retention | Resolve issues while preserving trust and learning from recurring failures. |
| 12 | BASE-BIZ-012 | Business ethics and strategy | Make decisions that consider customers, law, risk and long-term viability. |


### ELEC — Electronics & Hardware

| Seq | Module ID | Module | Outcome |
| --- | --- | --- | --- |
| 1 | BASE-ELEC-001 | Electrical safety | Recognize hazards and select safe low-voltage learning conditions. |
| 2 | BASE-ELEC-002 | Units and circuit quantities | Use SI units and distinguish voltage, current, resistance and power. |
| 3 | BASE-ELEC-003 | Measurement instruments | Measure voltage and continuity using correct meter settings and connection. |
| 4 | BASE-ELEC-004 | Circuit diagrams | Read and draw basic circuit symbols and current paths. |
| 5 | BASE-ELEC-005 | Ohm’s law | Relate voltage, current and resistance in a resistive element. |
| 6 | BASE-ELEC-006 | Series and parallel networks | Predict how current and voltage behave in simple series/parallel circuits. |
| 7 | BASE-ELEC-007 | Resistors and LEDs | Choose current-limiting resistance for a low-voltage LED circuit. |
| 8 | BASE-ELEC-008 | Diode behaviour | Explain one-way conduction and the limits of a diode model. |
| 9 | BASE-ELEC-009 | Transistor switching | Use a transistor as a controlled switch in a conceptual low-voltage circuit. |
| 10 | BASE-ELEC-010 | Capacitors and time response | Explain charge storage and basic RC timing. |
| 11 | BASE-ELEC-011 | Breadboard prototyping | Translate a simple schematic to a solderless breadboard layout. |
| 12 | BASE-ELEC-012 | Digital logic and microcontrollers | Explain binary states and basic input/output behaviour. |


### FIN — Finance & Economics

| Seq | Module ID | Module | Outcome |
| --- | --- | --- | --- |
| 1 | BASE-FIN-001 | Money numeracy | Use percentages, units and comparisons to reason about money. |
| 2 | BASE-FIN-002 | Personal budgeting | Create a realistic budget that distinguishes needs, wants and goals. |
| 3 | BASE-FIN-003 | Cash flow | Track money timing and understand liquidity. |
| 4 | BASE-FIN-004 | Interest and compounding | Explain simple and compound interest over time. |
| 5 | BASE-FIN-005 | Inflation and purchasing power | Explain why nominal money and real purchasing power differ. |
| 6 | BASE-FIN-006 | Accounting foundations | Record transactions using consistent categories and double-entry logic. |
| 7 | BASE-FIN-007 | Financial statements | Interpret an income statement, balance sheet and cash-flow statement together. |
| 8 | BASE-FIN-008 | Risk and uncertainty | Distinguish risk types and avoid treating uncertain outcomes as guaranteed. |
| 9 | BASE-FIN-009 | Markets and institutions | Explain the roles of exchanges, brokers, issuers and regulators. |
| 10 | BASE-FIN-010 | Diversification and allocation | Explain how concentration and correlation affect portfolio risk. |
| 11 | BASE-FIN-011 | Fraud and consumer protection | Recognize common financial deception and verify claims before acting. |
| 12 | BASE-FIN-012 | Economic reasoning | Use incentives, scarcity and marginal trade-offs to explain choices. |


### BODY — Body Science & Anatomy

| Seq | Module ID | Module | Outcome |
| --- | --- | --- | --- |
| 1 | BASE-BODY-001 | Biological organization | Explain the hierarchy from cells to tissues, organs and systems. |
| 2 | BASE-BODY-002 | Cell and tissue basics | Describe major cell structures and broad tissue classes. |
| 3 | BASE-BODY-003 | Anatomical orientation | Use anatomical position, planes, directions and regions accurately. |
| 4 | BASE-BODY-004 | Homeostasis | Explain feedback regulation using a simple physiological example. |
| 5 | BASE-BODY-005 | Nervous system basics | Explain how sensory input, processing and motor output coordinate action. |
| 6 | BASE-BODY-006 | Cardiorespiratory function | Describe how heart, blood and lungs support gas transport. |
| 7 | BASE-BODY-007 | Musculoskeletal function | Explain how bones, joints, muscles and tendons create movement. |
| 8 | BASE-BODY-008 | Nutrition and digestion | Explain the roles of macronutrients, micronutrients and digestion. |
| 9 | BASE-BODY-009 | Sleep and recovery | Explain sleep’s role in learning, regulation and physical recovery. |
| 10 | BASE-BODY-010 | Exercise adaptation | Explain how training stimulus, recovery and adaptation relate. |
| 11 | BASE-BODY-011 | Health information literacy | Evaluate health claims using evidence quality and uncertainty. |
| 12 | BASE-BODY-012 | Human variation and ethics | Explain why bodies differ and why measurements need context. |


### PSY — Psychology & Strategy

| Seq | Module ID | Module | Outcome |
| --- | --- | --- | --- |
| 1 | BASE-PSY-001 | Psychology as an evidence discipline | Distinguish psychological observation, theory and evidence. |
| 2 | BASE-PSY-002 | Attention and cognitive load | Explain limits of attention and working memory. |
| 3 | BASE-PSY-003 | Memory systems | Distinguish encoding, storage and retrieval. |
| 4 | BASE-PSY-004 | Learning and behaviour | Explain practice, feedback and reinforcement without reducing learning to rewards. |
| 5 | BASE-PSY-005 | Emotion and regulation | Describe emotion as information without treating it as a command. |
| 6 | BASE-PSY-006 | Motivation and habits | Explain how cues, friction, goals and feedback influence behaviour. |
| 7 | BASE-PSY-007 | Biases and heuristics | Recognize common reasoning shortcuts and test their influence. |
| 8 | BASE-PSY-008 | Decision-making | Compare options under uncertainty using explicit criteria. |
| 9 | BASE-PSY-009 | Social psychology | Explain how norms, roles and group context influence behaviour. |
| 10 | BASE-PSY-010 | Communication and conflict | Use listening and perspective-taking to clarify disagreement. |
| 11 | BASE-PSY-011 | Strategic interaction | Model choices where outcomes depend on other actors. |
| 12 | BASE-PSY-012 | Systems and causal reasoning | Distinguish correlation, causal mechanism and feedback. |


### AEST — Aesthetics & Visual Design

| Seq | Module ID | Module | Outcome |
| --- | --- | --- | --- |
| 1 | BASE-AEST-001 | Visual perception | Explain how contrast, grouping and visual attention shape interpretation. |
| 2 | BASE-AEST-002 | Composition and framing | Arrange elements to guide attention and establish balance. |
| 3 | BASE-AEST-003 | Hierarchy and information design | Order content by importance and user task. |
| 4 | BASE-AEST-004 | Colour foundations | Use hue, value and saturation to create relationships and sufficient contrast. |
| 5 | BASE-AEST-005 | Typography foundations | Choose type and spacing for legibility, hierarchy and tone. |
| 6 | BASE-AEST-006 | Layout systems | Use grids and spacing rules to make layouts consistent. |
| 7 | BASE-AEST-007 | Brand foundations | Translate a positioning idea into consistent visual and verbal cues. |
| 8 | BASE-AEST-008 | Interface states | Design feedback for loading, empty, error, success and disabled states. |
| 9 | BASE-AEST-009 | Accessibility foundations | Design so information and controls remain perceivable and operable. |
| 10 | BASE-AEST-010 | Photography foundations | Control composition, exposure and focus for a deliberate image. |
| 11 | BASE-AEST-011 | Critique and iteration | Give specific feedback tied to user goals and evidence. |
| 12 | BASE-AEST-012 | Design systems | Create reusable tokens and components with consistent states. |


### WORK — Workflow & Productivity

| Seq | Module ID | Module | Outcome |
| --- | --- | --- | --- |
| 1 | BASE-WORK-001 | File and folder literacy | Organize files with predictable paths and names. |
| 2 | BASE-WORK-002 | Notes and knowledge capture | Capture information so it can be retrieved and acted upon. |
| 3 | BASE-WORK-003 | Task capture and triage | Convert open loops into clear next actions. |
| 4 | BASE-WORK-004 | Planning and estimation | Break work into milestones and estimate with uncertainty. |
| 5 | BASE-WORK-005 | Time and attention management | Match work to available time and cognitive demands. |
| 6 | BASE-WORK-006 | Typing and text entry | Improve accurate text entry with ergonomic technique. |
| 7 | BASE-WORK-007 | Terminal foundations | Use shell commands to inspect and manipulate files safely. |
| 8 | BASE-WORK-008 | Git workflow | Use commits and branches to make changes recoverable. |
| 9 | BASE-WORK-009 | Spreadsheet foundations | Use formulas and tables for transparent calculations. |
| 10 | BASE-WORK-010 | Documents and communication tools | Create clear documents with styles, structure and version control. |
| 11 | BASE-WORK-011 | Automation foundations | Automate a repetitive task only after understanding its steps and failure modes. |
| 12 | BASE-WORK-012 | Workflow improvement | Measure bottlenecks and improve a process incrementally. |


### ART — Artistic Development

| Seq | Module ID | Module | Outcome |
| --- | --- | --- | --- |
| 1 | BASE-ART-001 | Observation and visual analysis | Describe what is actually visible before drawing interpretation. |
| 2 | BASE-ART-002 | Line and mark control | Use line weight and mark direction intentionally. |
| 3 | BASE-ART-003 | Shape and form | Distinguish 2D silhouette from 3D volume. |
| 4 | BASE-ART-004 | Proportion and measurement | Compare relative sizes and alignments accurately. |
| 5 | BASE-ART-005 | Perspective foundations | Represent spatial depth using consistent perspective cues. |
| 6 | BASE-ART-006 | Value and light | Describe form through light direction and value grouping. |
| 7 | BASE-ART-007 | Colour foundations | Mix and organise colour by hue, value and saturation. |
| 8 | BASE-ART-008 | Composition | Arrange shapes and values to guide the viewer. |
| 9 | BASE-ART-009 | Figure and anatomy foundations | Construct simplified human proportions while respecting variation. |
| 10 | BASE-ART-010 | Visual storytelling | Communicate action and sequence through composition and visual cues. |
| 11 | BASE-ART-011 | Reference and study practice | Use reference ethically and extract principles rather than copying blindly. |
| 12 | BASE-ART-012 | Critique and deliberate practice | Select one controllable weakness and design a focused practice loop. |


### ATH — Athletics & Physical Performance

| Seq | Module ID | Module | Outcome |
| --- | --- | --- | --- |
| 1 | BASE-ATH-001 | Movement literacy | Recognize basic movement patterns and perform them with control. |
| 2 | BASE-ATH-002 | Warm-up and readiness | Prepare gradually for activity and notice readiness signals. |
| 3 | BASE-ATH-003 | Mobility and flexibility | Distinguish joint mobility, flexibility and control. |
| 4 | BASE-ATH-004 | Coordination and balance | Control body position and timing across simple tasks. |
| 5 | BASE-ATH-005 | Strength foundations | Explain progressive resistance and safe technique. |
| 6 | BASE-ATH-006 | Aerobic conditioning | Explain intensity, duration and aerobic adaptation. |
| 7 | BASE-ATH-007 | Speed and acceleration | Understand acceleration mechanics and the need for full recovery. |
| 8 | BASE-ATH-008 | Agility and deceleration | Change direction with control and prepare to absorb force. |
| 9 | BASE-ATH-009 | Sport skill acquisition | Break sport skills into perception, decision and execution. |
| 10 | BASE-ATH-010 | Recovery and load management | Recognize fatigue and balance training with recovery. |
| 11 | BASE-ATH-011 | Training design | Build a balanced week around goals, constraints and recovery. |
| 12 | BASE-ATH-012 | Performance analysis | Review performance using observable actions and context. |


### PERF — Vocal & Performance Arts

| Seq | Module ID | Module | Outcome |
| --- | --- | --- | --- |
| 1 | BASE-PERF-001 | Vocal health | Recognize comfortable versus strained voice use. |
| 2 | BASE-PERF-002 | Breath coordination | Coordinate easy breath flow with short phrases. |
| 3 | BASE-PERF-003 | Pitch foundations | Recognize and reproduce simple pitch relationships. |
| 4 | BASE-PERF-004 | Rhythm and timing | Maintain a pulse and subdivide simple patterns. |
| 5 | BASE-PERF-005 | Listening and ear training | Attend to pitch, rhythm, timbre and phrasing. |
| 6 | BASE-PERF-006 | Articulation and diction | Produce clear speech sounds without unnecessary tension. |
| 7 | BASE-PERF-007 | Resonance and tone | Explore comfortable resonance without forcing volume. |
| 8 | BASE-PERF-008 | Phrasing and expression | Shape phrases using breath, emphasis and dynamics. |
| 9 | BASE-PERF-009 | Practice design | Use short, focused sessions with a clear target and recovery. |
| 10 | BASE-PERF-010 | Recording and self-review | Record a performance and assess it against one criterion. |
| 11 | BASE-PERF-011 | Stagecraft foundations | Communicate intention to an audience through preparation and presence. |
| 12 | BASE-PERF-012 | Repertoire and interpretation | Select material suited to current ability and artistic goals. |


### MATH — Mathematics & Scientific Reasoning

| Seq | Module ID | Module | Outcome |
| --- | --- | --- | --- |
| 1 | BASE-MATH-001 | Number sense | Estimate magnitude and judge whether a result is plausible. |
| 2 | BASE-MATH-002 | Arithmetic operations | Perform and explain operations with whole numbers and decimals. |
| 3 | BASE-MATH-003 | Fractions and decimals | Represent the same quantity in fraction, decimal and visual forms. |
| 4 | BASE-MATH-004 | Percentages and proportional change | Calculate percentage of, increase/decrease and reverse percentage. |
| 5 | BASE-MATH-005 | Ratios and rates | Compare quantities using ratios and unit rates. |
| 6 | BASE-MATH-006 | Negative numbers and number lines | Interpret signed quantities and perform operations with negatives. |
| 7 | BASE-MATH-007 | Algebraic expressions | Represent unknown quantities with symbols and simplify equivalent expressions. |
| 8 | BASE-MATH-008 | Equations and inequalities | Solve one- and two-step equations and interpret inequalities. |
| 9 | BASE-MATH-009 | Exponents, powers and roots | Interpret a^n as repeated multiplication for positive integer n and identify base and exponent.; Use product, quotient and power-of-a-power rules when their conditions are met.; Explain zero and negative integer exponents for non-zero bases.; Find and estimate square roots and cube roots, distinguishing principal square roots from both solutions of x² = a.; Use powers of ten and scientific notation to express and compare very large or small quantities. |
| 10 | BASE-MATH-010 | Geometry, spatial reasoning and measurement | Distinguish length, perimeter, area, surface area and volume, with correct units.; Measure and classify angles and use angle relationships to solve unknowns.; Use triangle and quadrilateral properties to justify geometric conclusions.; Calculate perimeter and area for rectangles, triangles and parallelograms, and circumference/area of circles at an introductory level.; Calculate volume of rectangular prisms and explain how measurement uncertainty and unit conversion affect results. |
| 11 | BASE-MATH-011 | Coordinate graphs, relations and functions | Plot and interpret ordered pairs on a Cartesian coordinate plane.; Distinguish a relation from a function using the one-input-one-output rule.; Interpret slope as rate of change and intercepts as contextual starting values.; Construct and interpret tables, equations and graphs of simple linear relationships.; Identify domain, range, scale choices and limitations in a graph-based model. |
| 12 | BASE-MATH-012 | Mathematical reasoning, problem solving and proof | Translate a verbal or practical situation into a mathematical representation and identify assumptions.; Distinguish examples, counterexamples, conjectures, definitions and proofs.; Use logical statements, implication and counterexample reasoning accurately.; Construct clear arithmetic, algebraic and elementary geometric justifications.; Check solutions, detect invalid reasoning and communicate a conclusion with appropriate limits. |


### CYBER — Cybersecurity & Digital Infrastructure

| Seq | Module ID | Module | Outcome |
| --- | --- | --- | --- |
| 1 | BASE-CYBER-001 | Digital safety and privacy | Reduce common account and device risks. |
| 2 | BASE-CYBER-002 | Operating system foundations | Explain processes, files, permissions and applications. |
| 3 | BASE-CYBER-003 | Network foundations | Explain how devices address and exchange data. |
| 4 | BASE-CYBER-004 | Authentication and authorization | Distinguish proving identity from permission to act. |
| 5 | BASE-CYBER-005 | Permissions and least privilege | Limit access to files, devices and services. |
| 6 | BASE-CYBER-006 | Backup and recovery | Protect important data against loss and corruption. |
| 7 | BASE-CYBER-007 | Shell and Linux basics | Use a command line to inspect and manage a safe test environment. |
| 8 | BASE-CYBER-008 | Web security basics | Identify common web trust boundaries and input risks. |
| 9 | BASE-CYBER-009 | Secure coding foundations | Handle secrets, errors and untrusted data safely. |
| 10 | BASE-CYBER-010 | Threat modelling | Identify assets, adversaries, attack paths and mitigations. |
| 11 | BASE-CYBER-011 | Defensive monitoring | Recognize useful security events and preserve context. |
| 12 | BASE-CYBER-012 | Authorized lab practice | Learn security testing only in systems with explicit permission. |


### LANG — Language & Linguistic Intelligence

| Seq | Module ID | Module | Outcome |
| --- | --- | --- | --- |
| 1 | BASE-LANG-001 | Language learning strategy | Build a balanced routine across listening, speaking, reading and writing. |
| 2 | BASE-LANG-002 | Sound and phonology | Notice and produce meaningful sound contrasts. |
| 3 | BASE-LANG-003 | Vocabulary acquisition | Learn words with context, collocation and retrieval. |
| 4 | BASE-LANG-004 | Grammar as structure | Use grammar to express relationships between ideas. |
| 5 | BASE-LANG-005 | Reading comprehension | Extract explicit meaning, infer cautiously and track argument structure. |
| 6 | BASE-LANG-006 | Listening comprehension | Understand speech across speed, accent and context. |
| 7 | BASE-LANG-007 | Writing foundations | Write clear paragraphs with a claim, support and logical sequence. |
| 8 | BASE-LANG-008 | Speaking and interaction | Communicate clearly and repair misunderstandings. |
| 9 | BASE-LANG-009 | Bangla-English technical bridging | Map technical concepts across Bangla and English without assuming word-for-word equivalence. |
| 10 | BASE-LANG-010 | Rhetoric and argument | Build claims supported by reasons and credible evidence. |
| 11 | BASE-LANG-011 | Second-language pathway design | Choose a language and sequence based on use cases and available input. |
| 12 | BASE-LANG-012 | Linguistic awareness | Notice how languages encode meaning differently. |


### RES — Research & Information Intelligence

| Seq | Module ID | Module | Outcome |
| --- | --- | --- | --- |
| 1 | BASE-RES-001 | Question formation | Turn curiosity into a focused, answerable research question. |
| 2 | BASE-RES-002 | Search strategy | Search systematically using synonyms and source types. |
| 3 | BASE-RES-003 | Source credibility | Evaluate authority, evidence, methods, currency and conflicts. |
| 4 | BASE-RES-004 | Claims and evidence | Separate factual claims, interpretations and opinions. |
| 5 | BASE-RES-005 | Citation and provenance | Record sources so another person can locate and evaluate them. |
| 6 | BASE-RES-006 | Bias and misinformation | Recognize framing, selection and manipulation techniques. |
| 7 | BASE-RES-007 | Research design basics | Choose a method that can answer the question ethically. |
| 8 | BASE-RES-008 | Data collection and quality | Collect data consistently and document measurement limits. |
| 9 | BASE-RES-009 | Evidence synthesis | Compare findings across sources and explain agreement/disagreement. |
| 10 | BASE-RES-010 | Research writing | Present methods, evidence, reasoning and limitations transparently. |
| 11 | BASE-RES-011 | Reproducibility | Preserve data, code, methods and decisions needed to repeat work. |
| 12 | BASE-RES-012 | Research ethics | Respect consent, privacy, attribution and harm minimisation. |


### INDEP — Practical Independence

| Seq | Module ID | Module | Outcome |
| --- | --- | --- | --- |
| 1 | BASE-INDEP-001 | Personal safety and boundaries | Recognize unsafe situations and seek help early. |
| 2 | BASE-INDEP-002 | Hygiene and self-care systems | Maintain repeatable hygiene routines using safe products and instructions. |
| 3 | BASE-INDEP-003 | Cooking foundations | Prepare simple meals using safe heat and knife practices. |
| 4 | BASE-INDEP-004 | Food safety | Reduce contamination and temperature-related food risks. |
| 5 | BASE-INDEP-005 | Cleaning and household systems | Clean common surfaces using appropriate methods and product labels. |
| 6 | BASE-INDEP-006 | Clothing and garment care | Interpret care labels and maintain common clothing. |
| 7 | BASE-INDEP-007 | Money administration | Track small transactions and keep receipts/records organised. |
| 8 | BASE-INDEP-008 | Navigation and travel planning | Plan a route with time, cost and contingency. |
| 9 | BASE-INDEP-009 | Basic tools and repairs | Identify common hand tools and know when not to attempt a repair. |
| 10 | BASE-INDEP-010 | Household troubleshooting | Use a safe diagnose-check-escalate process. |
| 11 | BASE-INDEP-011 | First-aid literacy | Recognize emergencies and understand the role of trained responders. |
| 12 | BASE-INDEP-012 | Emergency planning | Prepare a simple household communication and evacuation plan. |


### LEAD — Leadership & Management

| Seq | Module ID | Module | Outcome |
| --- | --- | --- | --- |
| 1 | BASE-LEAD-001 | Self-management | Make commitments realistic and track follow-through. |
| 2 | BASE-LEAD-002 | Reliability and ownership | Take responsibility for agreed work and communicate blockers. |
| 3 | BASE-LEAD-003 | Listening and understanding | Listen for goals, constraints and unspoken ambiguity. |
| 4 | BASE-LEAD-004 | Teamwork foundations | Coordinate roles and shared outcomes. |
| 5 | BASE-LEAD-005 | Goal setting | Translate a broad aim into observable milestones. |
| 6 | BASE-LEAD-006 | Feedback and coaching | Give specific feedback that supports improvement. |
| 7 | BASE-LEAD-007 | Delegation | Assign work with context, authority and support. |
| 8 | BASE-LEAD-008 | Project coordination | Track dependencies, risks and changes. |
| 9 | BASE-LEAD-009 | Conflict resolution | Address disagreement through interests and evidence. |
| 10 | BASE-LEAD-010 | Decision and accountability | Make decisions with clear ownership and review. |
| 11 | BASE-LEAD-011 | Meeting and coordination hygiene | Run concise meetings with purpose and recorded actions. |
| 12 | BASE-LEAD-012 | Ethical leadership | Consider power, fairness, transparency and consequences. |


### COMM — Communication & Rhetoric

| Seq | Module ID | Module | Outcome |
| --- | --- | --- | --- |
| 1 | BASE-COMM-001 | Audience and purpose | Adapt message to what the audience needs to know or do. |
| 2 | BASE-COMM-002 | Active listening | Listen for content, emotion and uncertainty. |
| 3 | BASE-COMM-003 | Clarity and concision | Express one main idea with precise wording. |
| 4 | BASE-COMM-004 | Message structure | Organize information in a sequence the audience can follow. |
| 5 | BASE-COMM-005 | Explanation and teaching | Make an idea understandable through examples and checks. |
| 6 | BASE-COMM-006 | Questioning skills | Ask questions that reveal assumptions and useful detail. |
| 7 | BASE-COMM-007 | Writing for purpose | Choose format, tone and evidence for the writing task. |
| 8 | BASE-COMM-008 | Argument and reasoning | Construct a claim with valid reasoning and relevant support. |
| 9 | BASE-COMM-009 | Persuasion and ethical influence | Present benefits and trade-offs without deception. |
| 10 | BASE-COMM-010 | Feedback and disagreement | Respond to criticism without losing the substance of the issue. |
| 11 | BASE-COMM-011 | Public speaking foundations | Deliver a structured short talk with understandable pacing. |
| 12 | BASE-COMM-012 | Negotiation foundations | Clarify interests and seek agreements with explicit terms. |


## 5. Cross-discipline bridges

The 40 bridges connect related capabilities without merging discipline standards. `SUPPORTS` indicates useful prerequisite-like support but is not a gate; `APPLIES_TO` indicates a useful application context; `OVERLAPS_WITH` indicates adjacent content requiring explicit boundary protection. All are design proposals requiring semantic owner review.

| From | To | Relation | Rationale |
| --- | --- | --- | --- |
| BASE-MATH-001 | BASE-FIN-001 | SUPPORTS | number sense supports money numeracy; the finance task still teaches domain-specific meaning |
| BASE-MATH-004 | BASE-FIN-004 | SUPPORTS | percent change supports interest and compounding calculations |
| BASE-MATH-005 | BASE-FIN-009 | SUPPORTS | rates and ratios support quantitative market interpretation |
| BASE-MATH-008 | BASE-ENG-004 | SUPPORTS | equations and inequalities support formal reasoning about conditions; not required for all beginner control flow |
| BASE-MATH-011 | BASE-ENG-010 | SUPPORTS | functions/graphs support selected web and data reasoning; not a universal HTTP prerequisite |
| BASE-ENG-001 | BASE-RES-001 | APPLIES_TO | problem decomposition is useful for turning broad interests into answerable research questions |
| BASE-RES-002 | BASE-CYBER-003 | SUPPORTS | search strategy supports independent investigation of networking concepts, not network operation |
| BASE-RES-003 | BASE-FIN-009 | SUPPORTS | source credibility supports market/institution research |
| BASE-RES-004 | BASE-PSY-001 | SUPPORTS | claim-evidence reasoning supports psychology as an evidence discipline |
| BASE-LANG-003 | BASE-RES-002 | SUPPORTS | vocabulary acquisition helps formulate and refine searches across technical terminology |
| BASE-LANG-007 | BASE-COMM-007 | OVERLAPS_WITH | both involve writing; LANG focuses language production, COMM focuses purpose/audience effectiveness |
| BASE-COMM-001 | BASE-AEST-003 | SUPPORTS | audience and purpose inform information hierarchy |
| BASE-AEST-009 | BASE-ENG-010 | SUPPORTS | accessibility principles inform web/interface implementation |
| BASE-AEST-009 | BASE-WORK-010 | SUPPORTS | accessible document and communication tools need design awareness |
| BASE-ENG-005 | BASE-WORK-011 | SUPPORTS | functions and contracts inform automation design |
| BASE-WORK-008 | BASE-ENG-009 | OVERLAPS_WITH | both use version control; WORK focuses reliable workflow, ENG focuses engineering collaboration and history |
| BASE-WORK-007 | BASE-CYBER-007 | OVERLAPS_WITH | terminal foundations and shell/Linux basics share command-line fluency but differ in security context and depth |
| BASE-CYBER-001 | BASE-ENG-012 | SUPPORTS | privacy and digital safety inform secure/reliable software habits |
| BASE-ELEC-002 | BASE-MATH-005 | SUPPORTS | units and circuit quantities apply ratio/rate reasoning |
| BASE-ELEC-005 | BASE-MATH-008 | SUPPORTS | Ohm’s law uses algebraic rearrangement; teach algebra bridge when needed |
| BASE-ELEC-003 | BASE-MATH-010 | SUPPORTS | measurement instruments require scale, unit and measurement reasoning |
| BASE-BODY-004 | BASE-PSY-005 | APPLIES_TO | homeostasis and emotion regulation are distinct systems; bridge is comparison of regulation concepts, not equivalence |
| BASE-BODY-005 | BASE-PSY-002 | APPLIES_TO | nervous system and attention can be connected through biological/psychological levels without reducing one to the other |
| BASE-BODY-009 | BASE-ATH-010 | SUPPORTS | sleep and recovery knowledge informs training-load decisions |
| BASE-BODY-010 | BASE-ATH-006 | SUPPORTS | exercise adaptation informs conditioning but is not a substitute for coaching or health advice |
| BASE-ATH-002 | BASE-ATH-007 | SUPPORTS | readiness and warm-up precede high-intensity speed work when appropriate |
| BASE-ATH-010 | BASE-ATH-011 | SUPPORTS | recovery/load interpretation informs training design |
| BASE-PERF-001 | BASE-PERF-002 | SUPPORTS | vocal health bounds breath practice |
| BASE-PERF-002 | BASE-PERF-003 | SUPPORTS | breath coordination supports pitch work while pitch can also be practised gently in parallel |
| BASE-ART-001 | BASE-AEST-001 | OVERLAPS_WITH | both study visual perception; ART emphasises observation/drawing, AEST emphasises designed communication |
| BASE-ART-006 | BASE-AEST-004 | OVERLAPS_WITH | value/light and colour foundations intersect but have distinct artistic and design aims |
| BASE-AEST-002 | BASE-ART-008 | APPLIES_TO | composition/framing principles transfer across design and fine-art composition |
| BASE-BIZ-001 | BASE-RES-001 | OVERLAPS_WITH | customer discovery and research question formation share inquiry but differ in evidence and ethics context |
| BASE-BIZ-002 | BASE-RES-002 | SUPPORTS | market research uses search strategy and source evaluation |
| BASE-BIZ-008 | BASE-FIN-006 | OVERLAPS_WITH | bookkeeping and accounting foundations overlap; business operations context is distinct |
| BASE-BIZ-009 | BASE-FIN-008 | SUPPORTS | unit economics require explicit uncertainty and risk interpretation |
| BASE-LEAD-003 | BASE-COMM-002 | OVERLAPS_WITH | listening appears in both; COMM assesses communication technique, LEAD assesses team/leadership use |
| BASE-LEAD-004 | BASE-COMM-010 | APPLIES_TO | teamwork and feedback/disagreement connect in collaborative settings |
| BASE-LEAD-008 | BASE-WORK-004 | SUPPORTS | project coordination uses planning and estimation |
| BASE-INDEP-004 | BASE-BODY-008 | OVERLAPS_WITH | food safety and nutrition/digestion are distinct; one is safe handling, the other biological function |
| BASE-INDEP-011 | BASE-BODY-011 | APPLIES_TO | first-aid literacy and health information literacy meet at recognizing limits and seeking qualified help |


## 6. Gap and overlap register

| Type | ID | Finding | Treatment |
| --- | --- | --- | --- |
| GAP | FOUNDATION-001 | Mathematical fluency is a hidden dependency across finance, electrical measurement, engineering and data work. | Do not gate entire disciplines; attach local just-in-time diagnostic bridges to the exact calculation required. |
| GAP | FOUNDATION-002 | Reading/listening comprehension and technical vocabulary affect every discipline but are not represented as universal prerequisites. | Offer language support and glossary overlays; do not block entry based on language proficiency when equivalent evidence modes exist. |
| GAP | FOUNDATION-003 | Digital file, privacy and account-safety foundations are prerequisites for safe evidence capture and app use. | Provide an onboarding safety bridge; distinguish platform operation from subject competence. |
| GAP | FOUNDATION-004 | Measurement, units, uncertainty and data interpretation are unevenly explicit across science/engineering/health modules. | Add objective-level measurement and uncertainty checks where outcomes require them; do not insert a generic science gate. |
| GAP | FOUNDATION-005 | Ethical reasoning, consent and privacy appear as boundaries but not as a consistent cross-disciplinary competency thread. | Maintain discipline-specific safeguards and link to a common ethics/privacy reference layer. |
| GAP | FOUNDATION-006 | No explicit universal data literacy module exists in the 216 spine despite use in research, business, finance and performance analysis. | Treat as a proposed cross-disciplinary bridge/candidate module, not an invented 217th baseline record. |
| GAP | FOUNDATION-007 | No explicit universal visual literacy bridge joins ART, AEST, diagrams, data visualisation and technical schematics. | Use shared visual-analysis vocabulary while preserving domain-specific standards. |
| GAP | FOUNDATION-008 | Accessibility is explicit in AEST but needs operational checks in documents, language tasks, apps, presentations and assessment delivery. | Apply access-mode checks to all assessments without treating accessibility as an optional aesthetic extra. |
| OVERLAP | OVERLAP-001 | ENG-009 Version control foundations and WORK-008 Git workflow. | Keep both: WORK teaches reliable everyday Git workflow; ENG teaches engineering collaboration, review and change history. Cross-reference and avoid duplicated beginner Git lessons. |
| OVERLAP | OVERLAP-002 | WORK-007 Terminal foundations and CYBER-007 Shell and Linux basics. | Keep both: WORK teaches safe command-line literacy; CYBER teaches OS/security-specific command interpretation in authorised labs. |
| OVERLAP | OVERLAP-003 | LANG-007 Writing foundations and COMM-007 Writing for purpose. | Keep both: LANG teaches language construction; COMM teaches rhetorical purpose, audience and task fit. |
| OVERLAP | OVERLAP-004 | ART-001 Observation and visual analysis and AEST-001 Visual perception. | Keep both: ART trains observation for making; AEST applies perception to designed communication. |
| OVERLAP | OVERLAP-005 | ART-006 Value and light and AEST-004 Colour foundations. | Coordinate terminology, but do not merge artistic tonal rendering and design colour systems. |
| OVERLAP | OVERLAP-006 | BIZ-008 Bookkeeping and cash flow and FIN-006 Accounting foundations. | Keep both: FIN teaches general accounting concepts; BIZ applies records and cash movement to operations. |
| OVERLAP | OVERLAP-007 | LEAD-003 Listening and understanding and COMM-002 Active listening. | LEAD focuses team leadership use; COMM focuses observable listening behaviours and communication technique. |
| OVERLAP | OVERLAP-008 | INDEP-004 Food safety and BODY-008 Nutrition and digestion. | Do not conflate safe food handling with physiology/nutrition. |
| OVERLAP | OVERLAP-009 | BODY-010 Exercise adaptation and ATH-011 Training design. | BODY explains physiological adaptation; ATH applies training design with safety and load management. |
| OVERLAP | OVERLAP-010 | RES-003 Source credibility and CYBER-011 Defensive monitoring (signals vs evidence). | Use shared evidence reasoning; keep cyber monitoring operational and bounded to authorised systems. |
| SEQUENCE | SEQ-001 | The existing graph contains 206 advisory edges, mostly within-discipline progression. | Keep sequence advisory. Review cross-discipline entry points via diagnostic placement; no hard prerequisites are introduced by this wave. |
| SEQUENCE | SEQ-002 | MATH has 19 edges while most other disciplines have 11; this is a denser internal path. | Preserve math-specific sequence pending subject review; do not infer the extra edges as universal dependencies. |


## 7. Representative learner pathways

These are entry routes, not rigid tracks. A learner may combine them, change direction or enter at a later module after diagnostic evidence.

### PATH-01 — Academic and scientific foundations

**Outcome:** Build quantitative, evidence and explanation foundations that support later formal study.
**Entry modules:** BASE-MATH-001, BASE-RES-001, BASE-LANG-005, BASE-BODY-001
**Supporting modules:** BASE-MATH-008, BASE-RES-004, BASE-RES-007, BASE-ENG-001, BASE-COMM-005
**Entry rule:** Start from diagnostic evidence, not age or assumed school level.

### PATH-02 — Builder and engineer

**Outcome:** Move from problem framing to safe, testable digital/physical prototypes.
**Entry modules:** BASE-ENG-001, BASE-MATH-001, BASE-WORK-001, BASE-CYBER-001
**Supporting modules:** BASE-ENG-002, BASE-ENG-003, BASE-ENG-004, BASE-ENG-005, BASE-ELEC-001, BASE-ELEC-002
**Entry rule:** Electrical and cybersecurity practical work remains safety-gated by environment and authorisation.

### PATH-03 — Product and business builder

**Outcome:** Validate a real problem, shape an offer, manage basic money and communicate honestly.
**Entry modules:** BASE-BIZ-001, BASE-RES-001, BASE-COMM-001, BASE-FIN-001
**Supporting modules:** BASE-BIZ-003, BASE-BIZ-004, BASE-BIZ-008, BASE-FIN-006, BASE-ENG-001, BASE-AEST-003
**Entry rule:** Use fictional/anonymised cases and guardian/professional support for legal or financial commitments.

### PATH-04 — Creative maker

**Outcome:** Develop observation, craft, composition, critique and purposeful communication.
**Entry modules:** BASE-ART-001, BASE-AEST-001, BASE-COMM-001
**Supporting modules:** BASE-ART-002, BASE-ART-003, BASE-AEST-002, BASE-AEST-003, BASE-AEST-011
**Entry rule:** Portfolio quality is judged against the selected medium and brief, not one universal aesthetic.

### PATH-05 — Independent life capability

**Outcome:** Build safe, reliable everyday systems and know when to seek adult or professional help.
**Entry modules:** BASE-INDEP-001, BASE-INDEP-002, BASE-WORK-001, BASE-FIN-001
**Supporting modules:** BASE-INDEP-003, BASE-INDEP-004, BASE-INDEP-007, BASE-INDEP-012, BASE-COMM-002
**Entry rule:** Higher-risk tasks are simulations or supervised demonstrations.

### PATH-06 — Athletic and performance development

**Outcome:** Understand movement, practice safely, monitor recovery and refine performance.
**Entry modules:** BASE-ATH-001, BASE-BODY-001, BASE-ATH-002, BASE-PERF-001
**Supporting modules:** BASE-ATH-003, BASE-ATH-005, BASE-ATH-006, BASE-ATH-010, BASE-PERF-002, BASE-PERF-009
**Entry rule:** No maximal testing or pain-based progression; qualified coaching/clinical input when indicated.

### PATH-07 — Research and critical thinking

**Outcome:** Ask answerable questions, evaluate evidence and produce traceable conclusions.
**Entry modules:** BASE-RES-001, BASE-RES-002, BASE-RES-003, BASE-LANG-005
**Supporting modules:** BASE-RES-004, BASE-RES-005, BASE-RES-007, BASE-RES-009, BASE-PSY-001, BASE-COMM-008
**Entry rule:** Research involving people requires consent, privacy protection and appropriate adult/ethics oversight.

### PATH-08 — Communication and leadership

**Outcome:** Communicate clearly, coordinate work and handle disagreement ethically.
**Entry modules:** BASE-COMM-001, BASE-COMM-002, BASE-LEAD-001, BASE-LEAD-003
**Supporting modules:** BASE-COMM-004, BASE-COMM-005, BASE-COMM-010, BASE-LEAD-004, BASE-LEAD-008
**Entry rule:** Use role-play or consented collaboration; do not infer character from a single interaction.

## 8. Validation and limitations

- Structural checks: all 216 baseline IDs represented exactly once in mastery profiles; 18 progression maps contain 12 nodes each; all bridge endpoints resolve; no hard prerequisites added.
- The existing source graph is structurally acyclic. The new bridges are not inserted as gating edges.
- The mastery profiles are authoring specifications, not empirically validated cut scores.
- The 20 findings are curriculum design judgements based on the current module descriptions; they require subject-owner review before canonical adoption.
- No learner pathway has been tested with actual learners. No claim of instructional effectiveness or expert approval is made.

## Source basis

- ATHENA Breadth-First Baseline 216 Modules v1.1 (KB v3.22).
- Curriculum Sequence Graph Message 18 v0.1 (216 nodes, 206 advisory edges).
- ATHENA Competency, Assessment, Evidence and Placement Framework v1.0 (working).
- Wave 05 resource audit and Wave 06 teaching-pack baseline, for scope/safety context.
