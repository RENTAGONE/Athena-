# ATHENA Domain Map v0.3
**Status:** draft for subject-matter review · **Date:** 2026-11-17

This registry defines a proposed taxonomy, not a completed curriculum. It contains 18 macro disciplines, 113 domains and 40 skill-family clusters. Every domain and family remains draft until reviewed.

## Reconciliation decisions
- The four seed domains previously absent from v0.2 are restored with their original IDs: `ATH-DOM-ENG-COMPUTE`, `ATH-DOM-MATH-PHYS`, `ATH-DOM-MATH-CHEM`, `ATH-DOM-WORK-LEARN`.
- `SCI` and `LEARN` are retained as legacy origin namespaces mapped to their current owner disciplines; IDs are not regenerated.
- Physics and chemistry domains are explicitly scoped as quantitative/model-based foundations under Mathematics & Scientific Reasoning; they do not create extra macro disciplines or imply full subject curricula.
- Every domain and family has one explicit owner discipline and one primary parent.

## Domains by discipline

### ATH-DISC-AEST
- **ATH-DOM-AEST-VISPER — Visual Perception & Principles**: Gestalt, hierarchy, contrast, balance, proportion and visual attention.
- **ATH-DOM-AEST-COMP — Composition & Art Direction**: Framing, layout, focal hierarchy, rhythm and visual storytelling.
- **ATH-DOM-AEST-TYPE — Typography & Layout**: Type anatomy, pairing, readability, grids and information hierarchy.
- **ATH-DOM-AEST-PHOTO — Photography & Imaging**: Exposure, focus, lens perspective, lighting, framing and image processing.
- **ATH-DOM-AEST-BRAND — Identity & Brand Systems**: Visual identity, consistency, design systems and brand applications.
- **ATH-DOM-AEST-DIGDES — Digital Interface Design**: Interaction patterns, responsive layouts, accessibility and interface aesthetics.

### ATH-DISC-ART
- **ATH-DOM-ART-OBS — Observation & Visual Literacy**: Seeing proportion, edges, values, shapes and visual relationships.
- **ATH-DOM-ART-DRAW — Drawing Fundamentals**: Line, shape, form, gesture, contour and construction.
- **ATH-DOM-ART-SPACE — Perspective & Spatial Form**: Perspective systems, volume, rotation and spatial reasoning.
- **ATH-DOM-ART-LIGHT — Light, Value & Rendering**: Value structure, shading, material and light behaviour.
- **ATH-DOM-ART-COLOR — Color Theory & Application**: Color relationships, harmony, temperature and controlled palettes.
- **ATH-DOM-ART-ILLUS — Illustration & Visual Storytelling**: Character, environment, narrative composition and style development.

### ATH-DISC-ATH
- **ATH-DOM-ATH-FITBASE — Physical Literacy & Training Principles**: Movement quality, training principles, progression and load management.
- **ATH-DOM-ATH-STRENGTH — Strength & Power**: Strength development, power, jumping, landing and safe resistance training.
- **ATH-DOM-ATH-ENDURE — Aerobic & Anaerobic Conditioning**: Aerobic capacity, repeat efforts, intervals and endurance.
- **ATH-DOM-ATH-SPEED — Speed, Agility & Change of Direction**: Acceleration, deceleration, sprint mechanics and agility.
- **ATH-DOM-ATH-SKILL — Coordination & Sport Skill**: Balance, coordination, ball skills and sport-specific technique.
- **ATH-DOM-ATH-RECOVERY — Performance Recovery**: Warm-ups, mobility, recovery habits and monitoring fatigue.

### ATH-DISC-BIZ
- **ATH-DOM-BIZ-VALUE — Value Creation & Customer Discovery**: Problems, customer research, value propositions and product-market evidence.
- **ATH-DOM-BIZ-OFFER — Offers & Positioning**: Offer design, differentiation, pricing logic and positioning.
- **ATH-DOM-BIZ-MKT — Marketing & Distribution**: Messaging, channels, content, acquisition and distribution.
- **ATH-DOM-BIZ-SALES — Sales & Negotiation**: Lead qualification, discovery, proposals, objection handling and ethical negotiation.
- **ATH-DOM-BIZ-OPS — Operations & Systems**: Processes, quality, fulfilment, documentation, automation and service delivery.
- **ATH-DOM-BIZ-GROW — Venture Strategy & Growth**: Unit economics, retention, experimentation, partnerships and responsible scaling.

### ATH-DISC-BODY
- **ATH-DOM-BODY-ANAT — Human Anatomy**: Body structures, organs, tissues, anatomical terminology and system organisation.
- **ATH-DOM-BODY-PHYS — Human Physiology**: How body systems function and maintain homeostasis.
- **ATH-DOM-BODY-BIOCHEM — Biochemistry & Cell Biology**: Cells, biomolecules, metabolism and energy systems.
- **ATH-DOM-BODY-KINES — Kinesiology & Biomechanics**: Movement analysis, forces, joints, levers and motor control.
- **ATH-DOM-BODY-NUTRI — Nutrition Science**: Energy balance, macronutrients, micronutrients, hydration and evidence quality.
- **ATH-DOM-BODY-RECOV — Recovery & Health Science**: Sleep, fatigue, adaptation, injury prevention and recovery principles.

### ATH-DISC-COMM
- **ATH-DOM-COMM-EXPLAIN — Explanation & Teaching**: Clear explanations, analogies, audience modelling and checking understanding.
- **ATH-DOM-COMM-LISTEN — Listening & Dialogue**: Active listening, questioning, turn-taking and conversational accuracy.
- **ATH-DOM-COMM-WRITE — Practical & Professional Writing**: Messages, reports, proposals, concise writing and tone control.
- **ATH-DOM-COMM-SPEAK — Public Speaking & Presentation**: Structure, delivery, audience engagement and presentation design.
- **ATH-DOM-COMM-ARGUE — Argumentation & Debate**: Claims, reasoning, evidence, rebuttals and logical fallacies.
- **ATH-DOM-COMM-PERSUADE — Persuasion & Negotiation Communication**: Ethical persuasion, framing, negotiation language and influence.

### ATH-DISC-CYBER
- **ATH-DOM-CYBER-SAFETY — Personal Digital Security**: Account security, authentication, privacy, backups and safe device practices.
- **ATH-DOM-CYBER-NETWORK — Networking Fundamentals**: Network models, addressing, DNS, routing, TCP/IP and common protocols.
- **ATH-DOM-CYBER-OS — Operating Systems & Linux**: Users, permissions, processes, services, filesystems and system administration.
- **ATH-DOM-CYBER-WEBSEC — Web & Application Security**: Threat modelling, secure design, common web vulnerabilities and mitigations.
- **ATH-DOM-CYBER-DEFENSE — Defensive Security**: Logging, monitoring, incident response, hardening and threat analysis.
- **ATH-DOM-CYBER-TEST — Authorized Security Testing**: Controlled labs, scoped testing, vulnerability validation and responsible disclosure.

### ATH-DISC-ELEC
- **ATH-DOM-ELEC-FUND — Electrical Fundamentals**: Charge, voltage, current, resistance, power, energy and circuit laws.
- **ATH-DOM-ELEC-COMP — Components & Circuits**: Passive and active components, circuit topologies and component selection.
- **ATH-DOM-ELEC-DIG — Digital Electronics**: Binary logic, gates, combinational and sequential circuits.
- **ATH-DOM-ELEC-EMB — Embedded Systems**: Microcontrollers, firmware, GPIO, timers, interrupts and real-time constraints.
- **ATH-DOM-ELEC-MEAS — Instrumentation & Measurement**: Multimeters, sensors, signal conditioning, calibration and uncertainty.
- **ATH-DOM-ELEC-FAB — Fabrication & Mechatronics**: Soldering, PCB design, prototyping, actuators and mechanical-electrical integration.

### ATH-DISC-ENG
- **ATH-DOM-ENG-PROG — Programming & Computational Thinking**: Programming fundamentals, control flow, data structures and computational problem solving.
- **ATH-DOM-ENG-SOFT — Software Engineering**: Requirements, architecture, testing, debugging, maintainability and delivery.
- **ATH-DOM-ENG-WEB — Web & Application Development**: Frontend, backend, APIs, databases and application deployment.
- **ATH-DOM-ENG-ALGO — Algorithms & Data Structures**: Algorithmic reasoning, complexity, common structures and problem-solving patterns.
- **ATH-DOM-ENG-SYS — Computer Systems**: Operating systems, processes, memory, filesystems and computer architecture.
- **ATH-DOM-ENG-ADV — Advanced Computing**: Distributed systems, concurrency, compilers, AI and advanced language concepts.
- **ATH-DOM-ENG-COMPUTE — Computational Foundations**: Decomposition, algorithms, data representation, abstraction and computational problem-solving. This domain provides conceptual foundations; detailed programming practice remains in Programming & Computational Thinking and algorithm implementation remains in Algorithms & Data Structures.

### ATH-DISC-FIN
- **ATH-DOM-FIN-PERSONAL — Personal Finance**: Budgeting, saving, cash flow, financial goals and risk awareness.
- **ATH-DOM-FIN-ACC — Accounting & Statements**: Bookkeeping, income statements, balance sheets and cash-flow statements.
- **ATH-DOM-FIN-ECON — Economic Principles**: Scarcity, incentives, supply and demand, markets and macroeconomic indicators.
- **ATH-DOM-FIN-MARKETS — Markets & Investing**: Asset classes, diversification, valuation basics and market mechanics.
- **ATH-DOM-FIN-CORP — Corporate Finance**: Capital budgeting, cost of capital, financial modelling and business valuation.
- **ATH-DOM-FIN-RISK — Risk & Capital Allocation**: Risk management, portfolio construction, liquidity and decision-making under uncertainty.

### ATH-DISC-INDEP
- **ATH-DOM-INDEP-HOME — Home & Daily Living**: Household organisation, cleaning, maintenance and practical routines.
- **ATH-DOM-INDEP-FOOD — Food Preparation & Cooking**: Food safety, basic cooking methods, meal preparation and kitchen skills.
- **ATH-DOM-INDEP-REPAIR — Tools & Basic Repair**: Tool identification, safe handling, simple maintenance and repair judgement.
- **ATH-DOM-INDEP-NAV — Navigation & Travel Skills**: Maps, directions, route planning, public transport and situational awareness.
- **ATH-DOM-INDEP-SAFETY — Personal & Emergency Safety**: Risk recognition, emergency response and seeking qualified help.
- **ATH-DOM-INDEP-MONEY — Everyday Administration**: Documents, appointments, purchases, consumer awareness and personal organisation.

### ATH-DISC-LANG
- **ATH-DOM-LANG-LING — Linguistic Foundations**: Sounds, morphology, syntax, semantics, pragmatics and language structure.
- **ATH-DOM-LANG-VOCAB — Vocabulary & Lexical Growth**: Word learning, collocations, semantic nuance and active vocabulary.
- **ATH-DOM-LANG-GRAM — Grammar & Usage**: Sentence construction, grammatical systems, editing and register.
- **ATH-DOM-LANG-READ — Reading & Interpretation**: Comprehension, inference, critical reading and text analysis.
- **ATH-DOM-LANG-WRITE — Writing Development**: Clarity, structure, style, revision and audience-aware writing.
- **ATH-DOM-LANG-ACQUIRE — Additional Language Acquisition**: Listening, speaking, pronunciation, fluency and deliberate language practice.

### ATH-DISC-LEAD
- **ATH-DOM-LEAD-SELF — Self-Leadership**: Responsibility, initiative, self-management and dependable execution.
- **ATH-DOM-LEAD-TEAM — Team Dynamics**: Roles, trust, collaboration, group norms and shared objectives.
- **ATH-DOM-LEAD-PLAN — Planning & Coordination**: Goal setting, delegation, scheduling, dependencies and follow-through.
- **ATH-DOM-LEAD-FEEDBACK — Feedback & Development**: Giving, receiving and applying feedback; coaching fundamentals.
- **ATH-DOM-LEAD-CONFLICT — Conflict & Difficult Conversations**: Conflict analysis, mediation basics, boundaries and resolution.
- **ATH-DOM-LEAD-ORG — Organisational Systems**: Processes, accountability, culture, decision rights and management.

### ATH-DISC-MATH
- **ATH-DOM-MATH-NUM — Number & Arithmetic Foundations**: Number sense, operations, fractions, decimals, percentages, ratios and proportional reasoning.
- **ATH-DOM-MATH-ALG — Algebra & Symbolic Reasoning**: Expressions, equations, inequalities, exponents, roots and functions.
- **ATH-DOM-MATH-GEO — Geometry & Measurement**: Shapes, spatial reasoning, measurement, coordinate geometry and trigonometry.
- **ATH-DOM-MATH-DATA — Statistics & Probability**: Data literacy, descriptive statistics, probability, inference and uncertainty.
- **ATH-DOM-MATH-REASON — Logic & Mathematical Reasoning**: Deduction, proof, patterns, abstraction, argument and problem solving.
- **ATH-DOM-MATH-SCI — Scientific Method & Modelling**: Hypotheses, variables, experiments, measurement, models and scientific explanation.
- **ATH-DOM-MATH-ADV — Advanced Mathematics**: Calculus, vectors, matrices, discrete mathematics and advanced quantitative methods.
- **ATH-DOM-MATH-PHYS — Physics Foundations & Quantitative Modelling**: Quantitative foundations for reasoning about physical quantities, units, motion, forces, energy, waves, electricity and simple physical models. This is a mathematics-owned applied-science domain, not a separate ATHENA physics discipline or a complete physics curriculum.
- **ATH-DOM-MATH-CHEM — Chemistry Foundations & Quantitative Modelling**: Quantitative and model-based foundations for reasoning about matter, atomic models, chemical quantities, ratios, reactions and transformations. This is a mathematics-owned applied-science domain, not a separate ATHENA chemistry discipline or a complete chemistry curriculum.

### ATH-DISC-PERF
- **ATH-DOM-PERF-VOICE — Vocal Technique & Voice Care**: Breath coordination, resonance, articulation, projection and vocal health.
- **ATH-DOM-PERF-SING — Singing & Pitch**: Pitch matching, intonation, range development, rhythm and musical phrasing.
- **ATH-DOM-PERF-SPEAK — Spoken Performance**: Diction, pacing, emphasis, vocal expression and microphone technique.
- **ATH-DOM-PERF-PRESENCE — Stage & Camera Presence**: Presence, body language, audience awareness and performance confidence.
- **ATH-DOM-PERF-IMPROV — Improvisation & Creative Response**: Spontaneity, listening, scene work and adaptive performance.
- **ATH-DOM-PERF-MOVE — Movement & Physical Expression**: Gesture, posture, rhythm and expressive movement.

### ATH-DISC-PSY
- **ATH-DOM-PSY-COG — Cognition & Learning Psychology**: Attention, memory, perception, learning and cognitive biases.
- **ATH-DOM-PSY-BEHAV — Behavior & Motivation**: Habit formation, reinforcement, motivation and behavior change.
- **ATH-DOM-PSY-SOCIAL — Social Psychology**: Groups, norms, influence, cooperation and interpersonal perception.
- **ATH-DOM-PSY-DECIDE — Decision Science**: Judgment, probability, expected value, uncertainty and decision processes.
- **ATH-DOM-PSY-STRAT — Strategic Reasoning & Game Theory**: Competitive interaction, incentives, negotiation models and strategic choice.
- **ATH-DOM-PSY-EMOTION — Emotion & Self-Regulation**: Emotion processes, stress regulation and psychological resilience.

### ATH-DISC-RES
- **ATH-DOM-RES-QUEST — Question Formation & Research Design**: Research questions, scope, hypotheses and appropriate methods.
- **ATH-DOM-RES-SOURCES — Source Evaluation**: Authority, provenance, bias, primary sources and source quality.
- **ATH-DOM-RES-EVIDENCE — Evidence & Verification**: Triangulation, fact checking, uncertainty and claim-evidence alignment.
- **ATH-DOM-RES-SYNTH — Synthesis & Analysis**: Comparing sources, extracting patterns and constructing explanations.
- **ATH-DOM-RES-DOC — Documentation & Citation**: Research notes, references, reproducibility and traceability.
- **ATH-DOM-RES-INFO — Information Literacy & OSINT**: Search strategy, information environments and lawful open-source investigation.

### ATH-DISC-WORK
- **ATH-DOM-WORK-PERSONAL — Personal Workflow Design**: Prioritisation, planning, routines, task capture and review.
- **ATH-DOM-WORK-TYPING — Typing & Input Fluency**: Touch typing, shortcuts, text navigation and efficient input.
- **ATH-DOM-WORK-CLI — Command Line & Shell**: Terminal navigation, files, processes, scripting and shell composition.
- **ATH-DOM-WORK-VERSION — Version Control**: Git concepts, branching, commits, collaboration and recovery.
- **ATH-DOM-WORK-AUTO — Automation & Scripting**: Task automation, APIs, data transformation and repeatable workflows.
- **ATH-DOM-WORK-KNOW — Knowledge & Information Management**: Notes, metadata, retrieval, documentation and personal knowledge systems.
- **ATH-DOM-WORK-LEARN — Learning Systems & Metacognition**: Self-regulated learning, retrieval practice, deliberate practice, feedback use, reflection, calibration and learning-strategy selection. It models how the learner develops capability; it does not duplicate the content of the other disciplines.

## Skill families
- **ATH-FAM-MATH-NUM-PLACE — Place Value & Number Sense** (`ATH-DOM-MATH-NUM`)
- **ATH-FAM-MATH-NUM-OPS — Arithmetic Operations** (`ATH-DOM-MATH-NUM`)
- **ATH-FAM-MATH-NUM-FRAC — Fractions & Decimals** (`ATH-DOM-MATH-NUM`)
- **ATH-FAM-MATH-NUM-PCT — Percentages & Ratios** (`ATH-DOM-MATH-NUM`)
- **ATH-FAM-MATH-NUM-SIGN — Signed Numbers & Order of Operations** (`ATH-DOM-MATH-NUM`)
- **ATH-FAM-MATH-ALG-EXPR — Expressions & Variables** (`ATH-DOM-MATH-ALG`)
- **ATH-FAM-MATH-ALG-EQ — Equations & Inequalities** (`ATH-DOM-MATH-ALG`)
- **ATH-FAM-MATH-ALG-POW — Powers, Roots & Scientific Notation** (`ATH-DOM-MATH-ALG`)
- **ATH-FAM-MATH-ALG-FUNC — Functions & Graphs** (`ATH-DOM-MATH-ALG`)
- **ATH-FAM-MATH-ALG-SYMBOL — Symbolic Manipulation** (`ATH-DOM-MATH-ALG`)
- **ATH-FAM-MATH-REASON-LOGIC — Formal & Informal Logic** (`ATH-DOM-MATH-REASON`)
- **ATH-FAM-MATH-REASON-PROOF — Proof & Justification** (`ATH-DOM-MATH-REASON`)
- **ATH-FAM-MATH-REASON-PATTERN — Patterns & Generalisation** (`ATH-DOM-MATH-REASON`)
- **ATH-FAM-MATH-REASON-PROBLEM — Problem-Solving Heuristics** (`ATH-DOM-MATH-REASON`)
- **ATH-FAM-MATH-REASON-MODEL — Mathematical Modelling** (`ATH-DOM-MATH-REASON`)
- **ATH-FAM-BODY-ANAT-TERMS — Anatomical Terminology & Orientation** (`ATH-DOM-BODY-ANAT`)
- **ATH-FAM-BODY-ANAT-TISSUE — Cells & Tissues** (`ATH-DOM-BODY-ANAT`)
- **ATH-FAM-BODY-ANAT-SKELETAL — Skeletal System** (`ATH-DOM-BODY-ANAT`)
- **ATH-FAM-BODY-ANAT-MUSC — Muscular System** (`ATH-DOM-BODY-ANAT`)
- **ATH-FAM-BODY-ANAT-ORGANS — Organ Systems & Integration** (`ATH-DOM-BODY-ANAT`)
- **ATH-FAM-BODY-KINES-JOINT — Joint Mechanics** (`ATH-DOM-BODY-KINES`)
- **ATH-FAM-BODY-KINES-LEVER — Levers & Mechanical Advantage** (`ATH-DOM-BODY-KINES`)
- **ATH-FAM-BODY-KINES-FORCE — Forces & Motion** (`ATH-DOM-BODY-KINES`)
- **ATH-FAM-BODY-KINES-GAIT — Gait & Movement Analysis** (`ATH-DOM-BODY-KINES`)
- **ATH-FAM-BODY-KINES-MOTOR — Motor Control & Coordination** (`ATH-DOM-BODY-KINES`)
- **ATH-FAM-ELEC-FUND-CHARGE — Charge & Electric Fields** (`ATH-DOM-ELEC-FUND`)
- **ATH-FAM-ELEC-FUND-VIR — Voltage, Current & Resistance** (`ATH-DOM-ELEC-FUND`)
- **ATH-FAM-ELEC-FUND-POWER — Electrical Power & Energy** (`ATH-DOM-ELEC-FUND`)
- **ATH-FAM-ELEC-FUND-DC — DC Circuit Analysis** (`ATH-DOM-ELEC-FUND`)
- **ATH-FAM-ELEC-FUND-AC — AC Fundamentals & Signals** (`ATH-DOM-ELEC-FUND`)
- **ATH-FAM-RES-SOURCES-PRIMARY — Primary & Secondary Sources** (`ATH-DOM-RES-SOURCES`)
- **ATH-FAM-RES-SOURCES-AUTH — Authority & Expertise** (`ATH-DOM-RES-SOURCES`)
- **ATH-FAM-RES-SOURCES-BIAS — Bias, Incentives & Conflicts** (`ATH-DOM-RES-SOURCES`)
- **ATH-FAM-RES-SOURCES-TRACE — Source Provenance & Traceability** (`ATH-DOM-RES-SOURCES`)
- **ATH-FAM-RES-SOURCES-QUALITY — Evidence Quality & Limitations** (`ATH-DOM-RES-SOURCES`)
- **ATH-FAM-BIZ-VALUE-PROBLEM — Problem Discovery** (`ATH-DOM-BIZ-VALUE`)
- **ATH-FAM-BIZ-VALUE-CUSTOMER — Customer Segmentation & Research** (`ATH-DOM-BIZ-VALUE`)
- **ATH-FAM-BIZ-VALUE-VALUEPROP — Value Proposition** (`ATH-DOM-BIZ-VALUE`)
- **ATH-FAM-BIZ-VALUE-VALIDATE — Validation & Experimentation** (`ATH-DOM-BIZ-VALUE`)
- **ATH-FAM-BIZ-VALUE-FEEDBACK — Customer Feedback Loops** (`ATH-DOM-BIZ-VALUE`)

## Status limitations
- The 36 skill and 36 subskill seeds are initial candidates only.
- Domain/family existence does not mean all associated concepts, objectives, learning units or assessments are authored.
- Cross-domain transfer links remain hypotheses until supported by learner evidence in a distinct context.
- All taxonomy changes follow the knowledge authoring review and change-control standard.
