# ATHENA Domain Map v0.2

Status: Draft architecture for review; not an approved exhaustive curriculum.

Coverage: 18 disciplines, 109 proposed domains, 40 initial skill-family clusters.

## Interpretation rules
- Domains are broad branches, not individual skills or lessons.
- Skill families group related skills; detailed skill/subskill/objective authoring comes later.
- All entries are draft and require review for scope, overlap, omissions and level.
- A domain can support multiple learning pathways; this map does not impose one universal linear sequence.
- Existing domain IDs in v0.1 are retained and reused, never regenerated.

## 1. Engineering & Computer Science (`ATH-DISC-ENG`)
Software construction, algorithms, systems, programming languages, and computational problem-solving.

- **Programming & Computational Thinking** — `ATH-DOM-ENG-PROG`: Programming fundamentals, control flow, data structures and computational problem solving.
- **Software Engineering** — `ATH-DOM-ENG-SOFT`: Requirements, architecture, testing, debugging, maintainability and delivery.
- **Web & Application Development** — `ATH-DOM-ENG-WEB`: Frontend, backend, APIs, databases and application deployment.
- **Algorithms & Data Structures** — `ATH-DOM-ENG-ALGO`: Algorithmic reasoning, complexity, common structures and problem-solving patterns.
- **Computer Systems** — `ATH-DOM-ENG-SYS`: Operating systems, processes, memory, filesystems and computer architecture.
- **Advanced Computing** — `ATH-DOM-ENG-ADV`: Distributed systems, concurrency, compilers, AI and advanced language concepts.

## 2. Business & Entrepreneurship (`ATH-DISC-BIZ`)
Customer discovery, value creation, offers, sales, marketing, operations, and venture building.

- **Value Creation & Customer Discovery** — `ATH-DOM-BIZ-VALUE`: Problems, customer research, value propositions and product-market evidence.
  - Family: Problem Discovery (`ATH-FAM-BIZ-VALUE-PROBLEM`)
  - Family: Customer Segmentation & Research (`ATH-FAM-BIZ-VALUE-CUSTOMER`)
  - Family: Value Proposition (`ATH-FAM-BIZ-VALUE-VALUEPROP`)
  - Family: Validation & Experimentation (`ATH-FAM-BIZ-VALUE-VALIDATE`)
  - Family: Customer Feedback Loops (`ATH-FAM-BIZ-VALUE-FEEDBACK`)
- **Offers & Positioning** — `ATH-DOM-BIZ-OFFER`: Offer design, differentiation, pricing logic and positioning.
- **Marketing & Distribution** — `ATH-DOM-BIZ-MKT`: Messaging, channels, content, acquisition and distribution.
- **Sales & Negotiation** — `ATH-DOM-BIZ-SALES`: Lead qualification, discovery, proposals, objection handling and ethical negotiation.
- **Operations & Systems** — `ATH-DOM-BIZ-OPS`: Processes, quality, fulfilment, documentation, automation and service delivery.
- **Venture Strategy & Growth** — `ATH-DOM-BIZ-GROW`: Unit economics, retention, experimentation, partnerships and responsible scaling.

## 3. Electronics & Hardware (`ATH-DISC-ELEC`)
Electrical fundamentals, components, embedded systems, instrumentation, fabrication, and mechatronics.

- **Electrical Fundamentals** — `ATH-DOM-ELEC-FUND`: Charge, voltage, current, resistance, power, energy and circuit laws.
  - Family: Charge & Electric Fields (`ATH-FAM-ELEC-FUND-CHARGE`)
  - Family: Voltage, Current & Resistance (`ATH-FAM-ELEC-FUND-VIR`)
  - Family: Electrical Power & Energy (`ATH-FAM-ELEC-FUND-POWER`)
  - Family: DC Circuit Analysis (`ATH-FAM-ELEC-FUND-DC`)
  - Family: AC Fundamentals & Signals (`ATH-FAM-ELEC-FUND-AC`)
- **Components & Circuits** — `ATH-DOM-ELEC-COMP`: Passive and active components, circuit topologies and component selection.
- **Digital Electronics** — `ATH-DOM-ELEC-DIG`: Binary logic, gates, combinational and sequential circuits.
- **Embedded Systems** — `ATH-DOM-ELEC-EMB`: Microcontrollers, firmware, GPIO, timers, interrupts and real-time constraints.
- **Instrumentation & Measurement** — `ATH-DOM-ELEC-MEAS`: Multimeters, sensors, signal conditioning, calibration and uncertainty.
- **Fabrication & Mechatronics** — `ATH-DOM-ELEC-FAB`: Soldering, PCB design, prototyping, actuators and mechanical-electrical integration.

## 4. Finance & Economics (`ATH-DISC-FIN`)
Personal finance, accounting, markets, investing, economics, valuation, and capital allocation.

- **Personal Finance** — `ATH-DOM-FIN-PERSONAL`: Budgeting, saving, cash flow, financial goals and risk awareness.
- **Accounting & Statements** — `ATH-DOM-FIN-ACC`: Bookkeeping, income statements, balance sheets and cash-flow statements.
- **Economic Principles** — `ATH-DOM-FIN-ECON`: Scarcity, incentives, supply and demand, markets and macroeconomic indicators.
- **Markets & Investing** — `ATH-DOM-FIN-MARKETS`: Asset classes, diversification, valuation basics and market mechanics.
- **Corporate Finance** — `ATH-DOM-FIN-CORP`: Capital budgeting, cost of capital, financial modelling and business valuation.
- **Risk & Capital Allocation** — `ATH-DOM-FIN-RISK`: Risk management, portfolio construction, liquidity and decision-making under uncertainty.

## 5. Body Science & Anatomy (`ATH-DISC-BODY`)
Anatomy, physiology, biomechanics, kinesiology, nutrition, recovery, and evidence-based body science.

- **Human Anatomy** — `ATH-DOM-BODY-ANAT`: Body structures, organs, tissues, anatomical terminology and system organisation.
  - Family: Anatomical Terminology & Orientation (`ATH-FAM-BODY-ANAT-TERMS`)
  - Family: Cells & Tissues (`ATH-FAM-BODY-ANAT-TISSUE`)
  - Family: Skeletal System (`ATH-FAM-BODY-ANAT-SKELETAL`)
  - Family: Muscular System (`ATH-FAM-BODY-ANAT-MUSC`)
  - Family: Organ Systems & Integration (`ATH-FAM-BODY-ANAT-ORGANS`)
- **Human Physiology** — `ATH-DOM-BODY-PHYS`: How body systems function and maintain homeostasis.
- **Biochemistry & Cell Biology** — `ATH-DOM-BODY-BIOCHEM`: Cells, biomolecules, metabolism and energy systems.
- **Kinesiology & Biomechanics** — `ATH-DOM-BODY-KINES`: Movement analysis, forces, joints, levers and motor control.
  - Family: Joint Mechanics (`ATH-FAM-BODY-KINES-JOINT`)
  - Family: Levers & Mechanical Advantage (`ATH-FAM-BODY-KINES-LEVER`)
  - Family: Forces & Motion (`ATH-FAM-BODY-KINES-FORCE`)
  - Family: Gait & Movement Analysis (`ATH-FAM-BODY-KINES-GAIT`)
  - Family: Motor Control & Coordination (`ATH-FAM-BODY-KINES-MOTOR`)
- **Nutrition Science** — `ATH-DOM-BODY-NUTRI`: Energy balance, macronutrients, micronutrients, hydration and evidence quality.
- **Recovery & Health Science** — `ATH-DOM-BODY-RECOV`: Sleep, fatigue, adaptation, injury prevention and recovery principles.

## 6. Psychology & Strategy (`ATH-DISC-PSY`)
Cognition, behavior, decision-making, logic, game theory, forecasting, and strategic reasoning.

- **Cognition & Learning Psychology** — `ATH-DOM-PSY-COG`: Attention, memory, perception, learning and cognitive biases.
- **Behavior & Motivation** — `ATH-DOM-PSY-BEHAV`: Habit formation, reinforcement, motivation and behavior change.
- **Social Psychology** — `ATH-DOM-PSY-SOCIAL`: Groups, norms, influence, cooperation and interpersonal perception.
- **Decision Science** — `ATH-DOM-PSY-DECIDE`: Judgment, probability, expected value, uncertainty and decision processes.
- **Strategic Reasoning & Game Theory** — `ATH-DOM-PSY-STRAT`: Competitive interaction, incentives, negotiation models and strategic choice.
- **Emotion & Self-Regulation** — `ATH-DOM-PSY-EMOTION`: Emotion processes, stress regulation and psychological resilience.

## 7. Aesthetics & Visual Design (`ATH-DISC-AEST`)
Visual perception, composition, typography, photography, graphic design, and art direction.

- **Visual Perception & Principles** — `ATH-DOM-AEST-VISPER`: Gestalt, hierarchy, contrast, balance, proportion and visual attention.
- **Composition & Art Direction** — `ATH-DOM-AEST-COMP`: Framing, layout, focal hierarchy, rhythm and visual storytelling.
- **Typography & Layout** — `ATH-DOM-AEST-TYPE`: Type anatomy, pairing, readability, grids and information hierarchy.
- **Photography & Imaging** — `ATH-DOM-AEST-PHOTO`: Exposure, focus, lens perspective, lighting, framing and image processing.
- **Identity & Brand Systems** — `ATH-DOM-AEST-BRAND`: Visual identity, consistency, design systems and brand applications.
- **Digital Interface Design** — `ATH-DOM-AEST-DIGDES`: Interaction patterns, responsive layouts, accessibility and interface aesthetics.

## 8. Workflow & Productivity (`ATH-DISC-WORK`)
Personal workflows, typing, terminal fluency, version control, automation, and knowledge management.

- **Personal Workflow Design** — `ATH-DOM-WORK-PERSONAL`: Prioritisation, planning, routines, task capture and review.
- **Typing & Input Fluency** — `ATH-DOM-WORK-TYPING`: Touch typing, shortcuts, text navigation and efficient input.
- **Command Line & Shell** — `ATH-DOM-WORK-CLI`: Terminal navigation, files, processes, scripting and shell composition.
- **Version Control** — `ATH-DOM-WORK-VERSION`: Git concepts, branching, commits, collaboration and recovery.
- **Automation & Scripting** — `ATH-DOM-WORK-AUTO`: Task automation, APIs, data transformation and repeatable workflows.
- **Knowledge & Information Management** — `ATH-DOM-WORK-KNOW`: Notes, metadata, retrieval, documentation and personal knowledge systems.

## 9. Artistic Development (`ATH-DISC-ART`)
Drawing, observation, form, perspective, color, illustration, and creative practice.

- **Observation & Visual Literacy** — `ATH-DOM-ART-OBS`: Seeing proportion, edges, values, shapes and visual relationships.
- **Drawing Fundamentals** — `ATH-DOM-ART-DRAW`: Line, shape, form, gesture, contour and construction.
- **Perspective & Spatial Form** — `ATH-DOM-ART-SPACE`: Perspective systems, volume, rotation and spatial reasoning.
- **Light, Value & Rendering** — `ATH-DOM-ART-LIGHT`: Value structure, shading, material and light behaviour.
- **Color Theory & Application** — `ATH-DOM-ART-COLOR`: Color relationships, harmony, temperature and controlled palettes.
- **Illustration & Visual Storytelling** — `ATH-DOM-ART-ILLUS`: Character, environment, narrative composition and style development.

## 10. Athletics & Physical Performance (`ATH-DISC-ATH`)
Strength, conditioning, speed, agility, coordination, sport skills, and physical performance.

- **Physical Literacy & Training Principles** — `ATH-DOM-ATH-FITBASE`: Movement quality, training principles, progression and load management.
- **Strength & Power** — `ATH-DOM-ATH-STRENGTH`: Strength development, power, jumping, landing and safe resistance training.
- **Aerobic & Anaerobic Conditioning** — `ATH-DOM-ATH-ENDURE`: Aerobic capacity, repeat efforts, intervals and endurance.
- **Speed, Agility & Change of Direction** — `ATH-DOM-ATH-SPEED`: Acceleration, deceleration, sprint mechanics and agility.
- **Coordination & Sport Skill** — `ATH-DOM-ATH-SKILL`: Balance, coordination, ball skills and sport-specific technique.
- **Performance Recovery** — `ATH-DOM-ATH-RECOVERY`: Warm-ups, mobility, recovery habits and monitoring fatigue.

## 11. Vocal & Performance Arts (`ATH-DISC-PERF`)
Voice, articulation, singing, stage presence, improvisation, and movement performance.

- **Vocal Technique & Voice Care** — `ATH-DOM-PERF-VOICE`: Breath coordination, resonance, articulation, projection and vocal health.
- **Singing & Pitch** — `ATH-DOM-PERF-SING`: Pitch matching, intonation, range development, rhythm and musical phrasing.
- **Spoken Performance** — `ATH-DOM-PERF-SPEAK`: Diction, pacing, emphasis, vocal expression and microphone technique.
- **Stage & Camera Presence** — `ATH-DOM-PERF-PRESENCE`: Presence, body language, audience awareness and performance confidence.
- **Improvisation & Creative Response** — `ATH-DOM-PERF-IMPROV`: Spontaneity, listening, scene work and adaptive performance.
- **Movement & Physical Expression** — `ATH-DOM-PERF-MOVE`: Gesture, posture, rhythm and expressive movement.

## 12. Mathematics & Scientific Reasoning (`ATH-DISC-MATH`)
Mathematical foundations, formal reasoning, statistics, scientific methods, and quantitative modeling.

- **Number & Arithmetic Foundations** — `ATH-DOM-MATH-NUM`: Number sense, operations, fractions, decimals, percentages, ratios and proportional reasoning.
  - Family: Place Value & Number Sense (`ATH-FAM-MATH-NUM-PLACE`)
  - Family: Arithmetic Operations (`ATH-FAM-MATH-NUM-OPS`)
  - Family: Fractions & Decimals (`ATH-FAM-MATH-NUM-FRAC`)
  - Family: Percentages & Ratios (`ATH-FAM-MATH-NUM-PCT`)
  - Family: Signed Numbers & Order of Operations (`ATH-FAM-MATH-NUM-SIGN`)
- **Algebra & Symbolic Reasoning** — `ATH-DOM-MATH-ALG`: Expressions, equations, inequalities, exponents, roots and functions.
  - Family: Expressions & Variables (`ATH-FAM-MATH-ALG-EXPR`)
  - Family: Equations & Inequalities (`ATH-FAM-MATH-ALG-EQ`)
  - Family: Powers, Roots & Scientific Notation (`ATH-FAM-MATH-ALG-POW`)
  - Family: Functions & Graphs (`ATH-FAM-MATH-ALG-FUNC`)
  - Family: Symbolic Manipulation (`ATH-FAM-MATH-ALG-SYMBOL`)
- **Geometry & Measurement** — `ATH-DOM-MATH-GEO`: Shapes, spatial reasoning, measurement, coordinate geometry and trigonometry.
- **Statistics & Probability** — `ATH-DOM-MATH-DATA`: Data literacy, descriptive statistics, probability, inference and uncertainty.
- **Logic & Mathematical Reasoning** — `ATH-DOM-MATH-REASON`: Deduction, proof, patterns, abstraction, argument and problem solving.
  - Family: Formal & Informal Logic (`ATH-FAM-MATH-REASON-LOGIC`)
  - Family: Proof & Justification (`ATH-FAM-MATH-REASON-PROOF`)
  - Family: Patterns & Generalisation (`ATH-FAM-MATH-REASON-PATTERN`)
  - Family: Problem-Solving Heuristics (`ATH-FAM-MATH-REASON-PROBLEM`)
  - Family: Mathematical Modelling (`ATH-FAM-MATH-REASON-MODEL`)
- **Scientific Method & Modelling** — `ATH-DOM-MATH-SCI`: Hypotheses, variables, experiments, measurement, models and scientific explanation.
- **Advanced Mathematics** — `ATH-DOM-MATH-ADV`: Calculus, vectors, matrices, discrete mathematics and advanced quantitative methods.

## 13. Cybersecurity & Digital Infrastructure (`ATH-DISC-CYBER`)
Digital safety, networking, operating systems, defensive security, and authorized security testing.

- **Personal Digital Security** — `ATH-DOM-CYBER-SAFETY`: Account security, authentication, privacy, backups and safe device practices.
- **Networking Fundamentals** — `ATH-DOM-CYBER-NETWORK`: Network models, addressing, DNS, routing, TCP/IP and common protocols.
- **Operating Systems & Linux** — `ATH-DOM-CYBER-OS`: Users, permissions, processes, services, filesystems and system administration.
- **Web & Application Security** — `ATH-DOM-CYBER-WEBSEC`: Threat modelling, secure design, common web vulnerabilities and mitigations.
- **Defensive Security** — `ATH-DOM-CYBER-DEFENSE`: Logging, monitoring, incident response, hardening and threat analysis.
- **Authorized Security Testing** — `ATH-DOM-CYBER-TEST`: Controlled labs, scoped testing, vulnerability validation and responsible disclosure.

## 14. Language & Linguistic Intelligence (`ATH-DISC-LANG`)
Language learning, vocabulary, grammar, reading, writing, and linguistic analysis.

- **Linguistic Foundations** — `ATH-DOM-LANG-LING`: Sounds, morphology, syntax, semantics, pragmatics and language structure.
- **Vocabulary & Lexical Growth** — `ATH-DOM-LANG-VOCAB`: Word learning, collocations, semantic nuance and active vocabulary.
- **Grammar & Usage** — `ATH-DOM-LANG-GRAM`: Sentence construction, grammatical systems, editing and register.
- **Reading & Interpretation** — `ATH-DOM-LANG-READ`: Comprehension, inference, critical reading and text analysis.
- **Writing Development** — `ATH-DOM-LANG-WRITE`: Clarity, structure, style, revision and audience-aware writing.
- **Additional Language Acquisition** — `ATH-DOM-LANG-ACQUIRE`: Listening, speaking, pronunciation, fluency and deliberate language practice.

## 15. Research & Information Intelligence (`ATH-DISC-RES`)
Source evaluation, research methods, evidence synthesis, documentation, and information verification.

- **Question Formation & Research Design** — `ATH-DOM-RES-QUEST`: Research questions, scope, hypotheses and appropriate methods.
- **Source Evaluation** — `ATH-DOM-RES-SOURCES`: Authority, provenance, bias, primary sources and source quality.
  - Family: Primary & Secondary Sources (`ATH-FAM-RES-SOURCES-PRIMARY`)
  - Family: Authority & Expertise (`ATH-FAM-RES-SOURCES-AUTH`)
  - Family: Bias, Incentives & Conflicts (`ATH-FAM-RES-SOURCES-BIAS`)
  - Family: Source Provenance & Traceability (`ATH-FAM-RES-SOURCES-TRACE`)
  - Family: Evidence Quality & Limitations (`ATH-FAM-RES-SOURCES-QUALITY`)
- **Evidence & Verification** — `ATH-DOM-RES-EVIDENCE`: Triangulation, fact checking, uncertainty and claim-evidence alignment.
- **Synthesis & Analysis** — `ATH-DOM-RES-SYNTH`: Comparing sources, extracting patterns and constructing explanations.
- **Documentation & Citation** — `ATH-DOM-RES-DOC`: Research notes, references, reproducibility and traceability.
- **Information Literacy & OSINT** — `ATH-DOM-RES-INFO`: Search strategy, information environments and lawful open-source investigation.

## 16. Practical Independence (`ATH-DISC-INDEP`)
Everyday competence including cooking, repair basics, navigation, safety, and personal organization.

- **Home & Daily Living** — `ATH-DOM-INDEP-HOME`: Household organisation, cleaning, maintenance and practical routines.
- **Food Preparation & Cooking** — `ATH-DOM-INDEP-FOOD`: Food safety, basic cooking methods, meal preparation and kitchen skills.
- **Tools & Basic Repair** — `ATH-DOM-INDEP-REPAIR`: Tool identification, safe handling, simple maintenance and repair judgement.
- **Navigation & Travel Skills** — `ATH-DOM-INDEP-NAV`: Maps, directions, route planning, public transport and situational awareness.
- **Personal & Emergency Safety** — `ATH-DOM-INDEP-SAFETY`: Risk recognition, emergency response and seeking qualified help.
- **Everyday Administration** — `ATH-DOM-INDEP-MONEY`: Documents, appointments, purchases, consumer awareness and personal organisation.

## 17. Leadership & Management (`ATH-DISC-LEAD`)
Planning with others, delegation, coordination, feedback, team systems, and responsible leadership.

- **Self-Leadership** — `ATH-DOM-LEAD-SELF`: Responsibility, initiative, self-management and dependable execution.
- **Team Dynamics** — `ATH-DOM-LEAD-TEAM`: Roles, trust, collaboration, group norms and shared objectives.
- **Planning & Coordination** — `ATH-DOM-LEAD-PLAN`: Goal setting, delegation, scheduling, dependencies and follow-through.
- **Feedback & Development** — `ATH-DOM-LEAD-FEEDBACK`: Giving, receiving and applying feedback; coaching fundamentals.
- **Conflict & Difficult Conversations** — `ATH-DOM-LEAD-CONFLICT`: Conflict analysis, mediation basics, boundaries and resolution.
- **Organisational Systems** — `ATH-DOM-LEAD-ORG`: Processes, accountability, culture, decision rights and management.

## 18. Communication & Rhetoric (`ATH-DISC-COMM`)
Clear explanation, listening, writing, presentation, debate, negotiation, and persuasive communication.

- **Explanation & Teaching** — `ATH-DOM-COMM-EXPLAIN`: Clear explanations, analogies, audience modelling and checking understanding.
- **Listening & Dialogue** — `ATH-DOM-COMM-LISTEN`: Active listening, questioning, turn-taking and conversational accuracy.
- **Practical & Professional Writing** — `ATH-DOM-COMM-WRITE`: Messages, reports, proposals, concise writing and tone control.
- **Public Speaking & Presentation** — `ATH-DOM-COMM-SPEAK`: Structure, delivery, audience engagement and presentation design.
- **Argumentation & Debate** — `ATH-DOM-COMM-ARGUE`: Claims, reasoning, evidence, rebuttals and logical fallacies.
- **Persuasion & Negotiation Communication** — `ATH-DOM-COMM-PERSUADE`: Ethical persuasion, framing, negotiation language and influence.

## Review checklist
- [ ] Confirm every domain belongs under the intended discipline.
- [ ] Identify missing major branches.
- [ ] Merge duplicate or overly narrow domains.
- [ ] Confirm boundaries between overlapping disciplines.
- [ ] Approve domain IDs before large-scale skill authoring.
- [ ] Add subject-matter sources and review provenance before approving detailed learning content.
