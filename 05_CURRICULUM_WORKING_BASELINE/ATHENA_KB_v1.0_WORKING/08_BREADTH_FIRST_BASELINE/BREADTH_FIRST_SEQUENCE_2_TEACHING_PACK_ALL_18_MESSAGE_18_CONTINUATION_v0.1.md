# ATHENA — Breadth-First Baseline Teaching Pack, Batch 02 (Message 18 continuation)

**Scope:** Sequence-2 modules across all 18 disciplines. These are additive learner-facing drafts, not expert-approved content. The existing baseline IDs are preserved. Each unit includes a conceptual explanation, worked example, guided practice, answer guidance, criteria, misconception checks, retrieval and safety boundary.

## 1. BASE-ENG-002 — Algorithms and pseudocode (Engineering & Computer Science)

**Learning objective:** Express a deterministic procedure in ordered steps and trace its state.
**Core model:** Sequence, selection, iteration, state, termination

**Why this matters**
An algorithm is a precise procedure, not merely a list of intentions. It must specify what happens next, what information changes, and how the process ends.

**Teach the concept**
Represent an algorithm with three control structures. **Sequence** runs steps in order. **Selection** chooses a branch from a condition. **Iteration** repeats a block while a condition holds or for a defined count. A variable is the current state: the values that can change as the procedure runs. A trace table records the state after each step. Termination is part of correctness; a loop that never reaches its stopping condition is not a finished solution.

Example: to find the largest of three scores, set `largest` to the first score; compare the second and replace `largest` if it is greater; do the same with the third; output `largest`. The invariant is that after each comparison, `largest` is the greatest value seen so far. This invariant explains why the algorithm works, not just what it does.

**Worked example**
Input scores 7, 12, 9. Start `largest=7`. Compare 12: 12>7, so `largest=12`. Compare 9: 9>12 is false, so keep 12. Output 12. If the values are 7, 7, 4, strict `>` still returns 7; if the task also requires the position of the first maximum, the algorithm must track its index too.

**Guided and independent practice**
Trace the algorithm on [3, 5, 2], [8, 8, 1] and a one-item list. Then write pseudocode for counting how many values are above a threshold. State what happens for an empty list.

**Answer guidance**
The maxima are 5, 8 and 3. For counting, initialise `count=0`; for each value, if value>threshold increment count; output count. An empty list returns 0. A common bug is initialising the counter to 1, which overcounts every case.

**Evidence and success criteria**
A correct submission identifies sequence, branch and repetition where relevant; traces every state change; handles ties and empty input explicitly; and gives a termination argument. Test at least one ordinary, boundary and adversarial case.

**Common errors to diagnose**
Writing pseudocode that says “find the answer” without defining comparisons; changing a variable before using its old value; using a loop whose exit condition cannot become true; testing only one convenient example.

**Retrieval and transfer**
Without looking, explain sequence, selection, iteration, state, invariant and termination. Reconstruct the maximum algorithm from memory, then trace a new list the next day.

**Safety, ethics and scope boundary**
Use paper or a local, non-sensitive toy program. Do not paste private records or credentials into online code tools.

---

## 2. BASE-BIZ-002 — Market research foundations (Business & Entrepreneurship)

**Learning objective:** Estimate a market using transparent assumptions and primary/secondary evidence.
**Core model:** TAM/SAM/SOM, sampling, competitor set, evidence quality

**Why this matters**
Market sizing is a disciplined estimate, not a large number chosen to make a business idea look attractive.

**Teach the concept**
Separate **TAM**, **SAM** and **SOM**. TAM is the total theoretical demand for the defined category; SAM is the part your product and geography can serve; SOM is the realistically obtainable share over a stated period given capacity, competition and distribution. Define the customer, geography, time period and unit before calculating. A count of people is not interchangeable with annual spending.

Build an estimate from explicit drivers. For example: reachable customer groups × plausible purchase frequency × average transaction value. Use low, base and high assumptions rather than false precision. Secondary sources can establish context; primary research (interviews, observation, a small opt-in test) can test whether people actually have the problem and would choose your offer. A convenience sample of friends is biased and cannot represent an entire country.

**Worked example**
Suppose a hypothetical Dhaka service could reach 2,000 relevant households. If 15% might buy twice a year at ৳500 per purchase, the rough annual serviceable revenue is 2,000×0.15×2×500 = ৳300,000. This is a scenario, not a verified market fact. If fulfilment capacity is only 100 orders, the near-term obtainable revenue is constrained by capacity, not the theoretical market.

**Guided and independent practice**
Create a market estimate for a low-cost digital study planner. Define customer, geography, annual unit, TAM/SAM/SOM, and three assumptions. List one primary research method and one likely sampling bias.

**Answer guidance**
There is no single correct market number. A defensible answer shows units, arithmetic, source dates, exclusions and uncertainty. SOM must be no greater than the serviceable market and must reflect realistic capacity. Interviews reveal language and pain points but do not by themselves establish purchase conversion.

**Evidence and success criteria**
A reviewer can reproduce every calculation; assumptions are labelled; no sample is presented as population truth; TAM/SAM/SOM boundaries are consistent; the estimate is updated when evidence changes.

**Common errors to diagnose**
Using the population of Bangladesh as the customer base; multiplying incompatible units; assuming interest equals willingness to pay; treating a survey of friends as representative; claiming a precise SOM without capacity or competitor analysis.

**Retrieval and transfer**
Recreate the TAM/SAM/SOM distinction and the driver equation. One week later, critique a market-size claim by checking its denominator, time period and evidence.

**Safety, ethics and scope boundary**
Do not collect names, phone numbers, financial details or other sensitive data for a school exercise. Obtain guardian/teacher permission for research involving people; participation must be voluntary.

---

## 3. BASE-ELEC-002 — Units and circuit quantities (Electronics & Hardware)

**Learning objective:** Use SI units and distinguish voltage, current, resistance and power.
**Core model:** Volt, ampere, ohm, watt, charge, energy

**Why this matters**
Circuit reasoning becomes safer and clearer when voltage, current, resistance and power are not treated as interchangeable words.

**Teach the concept**
Voltage (volt, V) is electric potential difference between two points; current (ampere, A) is the rate of charge flow; resistance (ohm, Ω) describes opposition to current for an ohmic component under stated conditions; power (watt, W) is the rate of energy transfer. For a simple resistive element, Ohm’s law is V=IR. Electrical power can be calculated as P=VI, and for an ideal resistor also as P=I²R or V²/R. These relationships are not permission to assume every component is an ideal resistor: LEDs, batteries, motors and semiconductor devices can behave nonlinearly.

Units are part of the answer. 1 A = 1,000 mA; 1 kΩ = 1,000 Ω; 1 W = 1 J/s. Charge is measured in coulombs (C), and energy in joules (J). Do not infer that a low voltage automatically makes every setup safe: short circuits can heat wires and cells, and rechargeable cells can deliver high current.

**Worked example**
A 100 Ω resistor connected to an ideal 5 V source has I=V/R=5/100=0.05 A=50 mA. Its power is P=VI=5×0.05=0.25 W. A real build must use an appropriately rated resistor with margin and consider source limits, temperature and tolerances; the calculation alone does not certify a physical circuit.

**Guided and independent practice**
Calculate current through 220 Ω at 3.3 V and power in a 1 kΩ resistor at 5 V. Convert 25 mA to A and 0.004 A to mA. Explain why an LED should not simply be connected to a voltage source without current limiting.

**Answer guidance**
3.3/220=0.015 A=15 mA. 5/1000=0.005 A; P=5×0.005=0.025 W. 25 mA=0.025 A; 0.004 A=4 mA. LED current must be limited because its current can rise sharply with a small voltage change; use a suitable resistor or a designed current-limited driver.

**Evidence and success criteria**
Every value includes units; formula selection is justified; conversions are correct; ideal-model assumptions are stated; the learner distinguishes calculation from permission to construct.

**Common errors to diagnose**
Confusing voltage with current; using milliamps as amps; applying V=IR to a nonlinear device without qualification; calculating resistor power but ignoring rating and heat.

**Retrieval and transfer**
From memory, define V, I, R, P, charge and energy. Re-derive the example and explain why dimensional units expose an arithmetic mistake.

**Safety, ethics and scope boundary**
This lesson is conceptual. Do not use mains electricity, open power supplies, damaged cells or improvised high-current circuits. Physical experiments require a qualified adult, a current-limited low-voltage source and an approved lab procedure.

---

## 4. BASE-FIN-002 — Personal budgeting (Finance & Economics)

**Learning objective:** Create a realistic budget that distinguishes needs, wants and goals.
**Core model:** Income, fixed/variable expense, buffer, goal, irregular cost

**Why this matters**
A budget is a forward-looking decision tool. It should reveal trade-offs and protect essentials, not punish a person for having irregular income.

**Teach the concept**
A useful budget separates income from spending and classifies costs by behaviour. Fixed costs are relatively stable; variable costs change with use; irregular costs occur occasionally but should be planned for. A sinking fund turns a future irregular cost into a small periodic allocation. A buffer protects against uncertainty. A goal is meaningful only when it has an amount, deadline and contribution plan.

Use the cash identity: opening balance + inflows − outflows = closing balance. Do not count borrowed money as income or confuse a planned allocation with money already spent. When income is irregular, build the plan around a conservative expected amount, prioritise essentials and avoid committing the entire best-case income. A budget is a model: review actuals and revise assumptions without hiding the difference.

**Worked example**
Suppose monthly allowance/income is ৳2,000. Planned categories: transport ৳500, school needs ৳400, phone/data ৳250, food/snacks ৳300, savings goal ৳300, irregular-cost fund ৳150, buffer ৳100. Total = ৳2,000. If income falls to ৳1,700, do not pretend the original plan still balances: protect necessary transport/school costs first, then adjust discretionary spending and goal contributions transparently.

**Guided and independent practice**
Build a one-month budget from a fictional ৳3,000 income with at least one irregular expense. Include a buffer and show how you would revise it if income were 15% lower.

**Answer guidance**
A valid budget totals exactly to available funds and includes realistic timing. The 15% reduction is ৳450, leaving ৳2,550; identify what can flex rather than reducing every category equally. A good answer distinguishes a sinking-fund contribution from the eventual expense.

**Evidence and success criteria**
All categories are mutually understandable; no double counting; planned total equals conservative available income; irregular costs and buffer are visible; the revision explains priorities.

**Common errors to diagnose**
Budgeting against best-case income; forgetting annual/irregular expenses; allocating the same taka twice; calling savings a leftover when the goal needs a planned contribution; treating a budget shortfall as a moral failure.

**Retrieval and transfer**
Rebuild the cash identity and explain fixed, variable, irregular and sinking-fund categories. After a week, compare a fictional plan with actual spending and identify one assumption to change.

**Safety, ethics and scope boundary**
Use fictional numbers. A minor should not share bank, mobile-wallet, account, PIN, OTP or family income details in a learning worksheet; involve a trusted guardian for real financial decisions.

---

## 5. BASE-BODY-002 — Cell and tissue basics (Body Science & Anatomy)

**Learning objective:** Describe major cell structures and broad tissue classes.
**Core model:** Membrane, nucleus, mitochondria, epithelial, connective, muscle, nervous

**Why this matters**
Cells and tissues explain how body structures perform specialised jobs while remaining dependent on one another.

**Teach the concept**
A typical human cell has a plasma membrane that regulates exchange, cytoplasm where many reactions occur, and a nucleus containing most of the cell’s genetic material. Mitochondria participate in ATP production through cellular respiration; they are not “the energy” itself. Cells vary by function: a neuron has specialised extensions for signalling, while a muscle cell contains contractile machinery.

A tissue is an organised group of cells and associated material performing related functions. Four broad tissue classes are epithelial (covering, lining and secretion), connective (support, binding and transport, including blood), muscle (contraction) and nervous (communication and coordination). Real organs contain multiple tissue types. Structure supports function, but avoid saying one organelle has only one job or that every cell looks the same.

**Worked example**
The small intestine is an organ, not a single tissue. Its lining includes epithelial tissue specialised for absorption; connective tissue supports vessels and structures; smooth muscle moves contents; nervous tissue helps coordinate activity. The organ’s function emerges from interaction among tissues.

**Guided and independent practice**
Classify a red blood cell, neuron and skeletal muscle cell by broad function. Then explain why the stomach cannot be described as “just muscle” even though muscle movement is important.

**Answer guidance**
Red blood cells transport oxygen using haemoglobin and have a specialised mature form; neurons transmit signals; skeletal muscle cells generate force. The stomach also has epithelial lining, connective support, blood supply and nervous control. A good answer explains coordination rather than listing tissue names only.

**Evidence and success criteria**
Distinguishes cell, tissue and organ; names the four tissue classes accurately; connects structure to function; avoids overgeneralising across all cells; explains an organ as an integrated system.

**Common errors to diagnose**
Calling mitochondria “energy”; describing blood as not a tissue; claiming all cells have identical structures; confusing an organelle with an organ; assuming one tissue alone explains organ function.

**Retrieval and transfer**
Draw a simple cell and label membrane, nucleus and mitochondria. From memory, name the four tissue classes and give one location/function example for each.

**Safety, ethics and scope boundary**
This is educational anatomy, not diagnosis. Do not infer health status from a diagram or use the lesson to self-diagnose symptoms; concerning symptoms should be discussed with a guardian and qualified clinician.

---

## 6. BASE-PSY-002 — Attention and cognitive load (Psychology & Strategy)

**Learning objective:** Explain limits of attention and working memory.
**Core model:** Selective attention, working memory, switching cost, load

**Why this matters**
Attention and working memory are limited; designing tasks around those limits is more reliable than assuming effort can make attention unlimited.

**Teach the concept**
Selective attention prioritises some information while other information receives less processing. Working memory temporarily maintains and manipulates a limited amount of information; its capacity depends on task complexity, prior knowledge and how information is grouped. Switching between tasks has costs because the learner must reorient, recover goals and reconstruct context. A notification may interrupt even if the person does not reply.

Cognitive load is often discussed as intrinsic (complexity inherent in the material), extraneous (avoidable burden caused by presentation) and germane (effort used to build useful schemas). This framework is a design aid, not a direct meter of a person’s brain. Reduce avoidable clutter, sequence complex material, use worked examples before independent practice, and connect new ideas to prior knowledge. Breaks can help manage fatigue, but there is no universal attention span that applies to everyone.

**Worked example**
A learner solving a multi-step fraction problem while checking messages must maintain the current operation, denominator and next step while repeatedly restoring attention. A better test is to solve one problem with notifications off, write intermediate steps, then compare accuracy and time. One trial is not proof that all multitasking is impossible; it is evidence about this task under these conditions.

**Guided and independent practice**
Redesign a cluttered study instruction containing six unrelated actions into a sequence of three meaningful stages. Identify what is intrinsic complexity and what is avoidable presentation load.

**Answer guidance**
A defensible redesign groups related actions, states the immediate goal and removes irrelevant instructions without deleting essential reasoning. The learner should explain why each grouping reduces unnecessary switching or memory demands.

**Evidence and success criteria**
Explains attention, working memory and switching cost distinctly; uses cautious language; proposes a testable design change; does not diagnose attention disorders from ordinary distraction.

**Common errors to diagnose**
Claiming people can only focus for a fixed number of minutes; treating a cognitive-load category as directly measurable without a method; assuming every distraction has the same effect; blaming the learner instead of examining task design.

**Retrieval and transfer**
Explain why task switching is not the same as parallel processing. Revisit a study session and record one interruption, its recovery cost and one environmental change.

**Safety, ethics and scope boundary**
Do not use this content to label yourself or another person with ADHD or another condition. Persistent functional difficulty merits discussion with a guardian and qualified health professional.

---

## 7. BASE-AEST-002 — Composition and framing (Aesthetics & Visual Design)

**Learning objective:** Arrange elements to guide attention and establish balance.
**Core model:** Grid, balance, negative space, crop, rhythm

**Why this matters**
Composition is the deliberate arrangement of visual elements so viewers can understand relationships and know where to look.

**Teach the concept**
A composition distributes visual weight. Size, contrast, colour intensity, isolation and position can attract attention. Balance may be symmetrical, asymmetrical or radial; balance does not require identical objects on both sides. A grid provides alignment anchors, while negative space separates groups and gives important elements room. Framing and cropping decide what information is included or excluded. Rhythm is created by repeated or varied visual elements that guide the eye.

Start with the communication task. Identify the primary subject or action, supporting information and intended viewing size. Make a thumbnail before polishing detail. Check the design in grayscale or at reduced size: if hierarchy disappears, it may rely too heavily on subtle colour differences. Composition is contextual; a poster, phone interface and portrait have different constraints.

**Worked example**
For a phone event poster, place the event name first, date/location second, and optional details last. Align text to a consistent grid. Give the date enough negative space to scan quickly. A large decorative image may be visually strong but should not obscure the information people need to act.

**Guided and independent practice**
Create two thumbnail layouts for the same fictional event: one symmetrical, one asymmetrical. Mark the first, second and third fixation points. Test each at phone-screen size and in grayscale.

**Answer guidance**
There is no single correct arrangement. Explain how contrast, scale, spacing and alignment establish hierarchy. If the call-to-action is not found quickly, revise the composition and retest with someone unfamiliar with the design.

**Evidence and success criteria**
The layout has a clear focal point; related information is grouped; alignment is intentional; crop preserves essential meaning; the hierarchy survives small-size and grayscale checks.

**Common errors to diagnose**
Adding decoration before hierarchy; treating symmetry as the only form of balance; using spacing inconsistently; cropping context that changes meaning; relying on colour alone to distinguish important information.

**Retrieval and transfer**
Sketch a simple grid and explain negative space, visual weight, balance and rhythm. Redesign one composition with only two changes and state which problem each change addresses.

**Safety, ethics and scope boundary**
Use original, licensed or permission-cleared images. Do not expose private personal information in a public poster or use misleading visual edits that change the meaning of documentary material.

---

## 8. BASE-WORK-002 — Notes and knowledge capture (Workflow & Productivity)

**Learning objective:** Capture information so it can be retrieved and acted upon.
**Core model:** Inbox, metadata, source, retrieval cue, linking

**Why this matters**
Notes are useful only when their source, meaning and retrieval path survive beyond the moment they were written.

**Teach the concept**
A reliable note captures the claim or idea, context, source, date and the learner’s own interpretation. Separate quotation from paraphrase and from your own inference. Add a retrieval cue: a title, question, tag or link that helps you find the note when needed. A simple structure is: **claim → evidence/source → interpretation → next action or open question**.

Capture quickly, then process later. An inbox prevents interruption, but an inbox that is never reviewed becomes a pile. Use a small number of stable categories and meaningful filenames rather than inventing a complex taxonomy. Link notes when they genuinely share a concept; do not create links merely to make a graph look connected. For digital notes, maintain backups and avoid storing secrets or unnecessary personal data.

**Worked example**
Raw note: “DNS translates names.” Improved note: “Question: How does a browser find a server from a domain name? Claim: DNS resolves a domain name to records such as IP addresses. Source: [publisher/title/date/link]. My interpretation: it is a lookup system, not the internet itself. Open question: what happens when a cached record expires?” This note can be retrieved by question, concept or source.

**Guided and independent practice**
Convert three raw notes from a study session into structured notes. Include one direct quotation with quotation marks, one paraphrase and one unresolved question. Add a filename that remains meaningful six months later.

**Answer guidance**
A good note makes provenance explicit and distinguishes source text from learner explanation. If you cannot identify which words are quoted, the note needs correction. The open question should be specific enough to research.

**Evidence and success criteria**
Each note has a meaningful title, source/provenance, date or context, clear claim, learner interpretation and retrieval cue. No sensitive secrets are stored.

**Common errors to diagnose**
Copying text without citation; treating a paraphrase as personal insight; writing titles like “notes 4”; creating too many tags; capturing everything without review; assuming cloud sync is a backup.

**Retrieval and transfer**
Rebuild the claim/evidence/interpretation/open-question structure from memory. Try to retrieve an old note using only its title and tags; improve its retrieval cue if it fails.

**Safety, ethics and scope boundary**
Do not store passwords, OTPs, private messages, addresses or other sensitive data in a general knowledge base. Use guardian-approved storage and backups for school files.

---

## 9. BASE-ART-002 — Line and mark control (Artistic Development)

**Learning objective:** Use line weight and mark direction intentionally.
**Core model:** Stroke, contour, gesture, line weight, rhythm

**Why this matters**
Line control lets an artist communicate contour, movement, material and emphasis without relying on detail alone.

**Teach the concept**
A mark has direction, pressure, speed, width and edge quality. Contour lines describe visible boundaries; gesture lines capture the broad action or flow of a pose; construction lines help establish proportion and orientation. Line weight can separate foreground from background, indicate overlap or focus attention. It should be varied intentionally rather than made uniformly thick.

Practise from shoulder and elbow movement for long strokes, and from wrist/fingers for smaller marks. Use a light exploratory pass before committing to darker lines. A confident line is not necessarily a perfectly straight line; it is a mark placed with a clear purpose. Hatching follows the form or a consistent light logic. Avoid using random shading to hide uncertain structure.

**Worked example**
Draw a simple bottle. First use a light central axis and top/bottom landmarks. Add the outer contour with a few deliberate strokes. Use slightly heavier line where the bottle overlaps the background, lighter line on the far edge, and short marks for the cap seam. The viewer should still recognise the volume without decorative shading.

**Guided and independent practice**
Make a page of 20 strokes: straight, curved, tapered, thick-to-thin and directional hatching. Then draw a cup using gesture/construction first and final contour second. Label which marks are guides and which communicate the final form.

**Answer guidance**
The exercise is judged by purposeful variation and control, not perfect realism. A useful review asks whether line direction supports the form, whether the silhouette is readable and whether unnecessary guide lines were removed or kept faint.

**Evidence and success criteria**
The learner distinguishes gesture, contour and construction; varies line weight with a stated purpose; uses strokes appropriate to scale; and explains one revision based on observation.

**Common errors to diagnose**
Pressing hard from the beginning; tracing the same uncertain contour repeatedly; using thick outlines everywhere; shading before structure; confusing a decorative line with a form-defining line.

**Retrieval and transfer**
Draw three line types from memory and annotate their function. Repeat the cup drawing later without looking at the first attempt; compare proportion and line confidence.

**Safety, ethics and scope boundary**
Use tools on a stable surface and store sharp drawing/craft tools safely. Take breaks if hand or wrist discomfort develops; do not force painful repetitive movement.

---

## 10. BASE-ATH-002 — Warm-up and readiness (Athletics & Physical Performance)

**Learning objective:** Prepare gradually for activity and notice readiness signals.
**Core model:** Raise temperature, mobility, activation, rehearsal

**Why this matters**
A warm-up is a gradual transition from rest to the movement demands of a session, not a competition or a maximal workout.

**Teach the concept**
A general warm-up gradually raises activity and body temperature. A dynamic mobility phase moves joints through comfortable ranges. Activation rehearses muscles and patterns needed for the session. A final rehearsal uses low-intensity versions of the actual task, such as easy passing before football. The warm-up should progress from easy to more specific and should not create fatigue before the main activity.

Readiness is contextual: sleep, illness, soreness, heat, hydration, stress and recent load can change how a session feels. A warm-up cannot guarantee injury prevention. It can help the athlete notice pain, unusual breathlessness, dizziness or poor coordination before intensity increases. A sharp or worsening pain is a reason to stop, not push through. Young athletes should prioritise technique, enjoyment, recovery and adult supervision over maximal load.

**Worked example**
For a recreational football session: begin with easy walking/jogging; add controlled ankle, hip and shoulder movements; perform gentle marching, side steps and balance; then rehearse gradual accelerations, turns and easy passes. Increase speed only if movement remains comfortable. The sequence is adjusted for space, weather and the session plan.

**Guided and independent practice**
Design a 8–12 minute low-to-moderate warm-up for a small-space ball session. Include gradual pulse-raising, mobility, activation and sport-specific rehearsal. State two signs that would make you stop or modify it.

**Answer guidance**
A good plan progresses gradually, avoids maximal sprints at the start, uses controlled movements and matches the session. Stop/modify for sharp pain, dizziness, unusual shortness of breath, feeling unwell or unsafe environmental conditions. Duration is a guide, not a universal rule.

**Evidence and success criteria**
Explains the four phases; matches rehearsal to the activity; progresses intensity; includes readiness checks and stop conditions; avoids promising injury prevention.

**Common errors to diagnose**
Static stretching or maximal sprinting as the only warm-up; copying an elite routine without adapting; treating soreness as a challenge to overcome; ignoring heat or poor footing.

**Retrieval and transfer**
Reconstruct the progression from general to specific. Before a later session, record readiness and one adjustment; do not interpret one good session as proof that a routine prevents injury.

**Safety, ethics and scope boundary**
This is general education, not a personalised medical or training prescription. A minor should train with guardian/coach awareness, use safe footing and hydration, and stop for pain, dizziness or illness. Avoid maximal testing without qualified supervision.

---

## 11. BASE-PERF-002 — Breath coordination (Vocal & Performance Arts)

**Learning objective:** Coordinate easy breath flow with short phrases.
**Core model:** Breath phrase, airflow, posture, release

**Why this matters**
Breath coordination supports comfortable phrasing; it is not about forcing the lungs to hold as much air as possible.

**Teach the concept**
Speech and singing use airflow coordinated with vocal-fold vibration and resonant spaces. Posture should allow easy expansion without rigidly lifting the chest or locking the abdomen. Inhalation should be quiet and comfortable; the phrase should begin without a gasp or throat squeeze. Phrase length depends on tempo, loudness, text and individual capacity. Plan breaths at meaningful phrase boundaries instead of trying to finish every sentence on one breath.

A useful exercise is gentle voiced sound on a comfortable pitch, then a short spoken or sung phrase. Keep the volume moderate. If the throat tightens, reduce intensity and return to easy speech. Breath support is not achieved by pushing the belly hard, clenching the neck or holding residual air. Hydration, rest and sensible vocal load matter.

**Worked example**
Phrase: “The morning light crosses the room.” Mark a comfortable breath before the sentence, speak it at normal volume, and notice whether the final words remain easy. If not, shorten the phrase or take a natural breath after “light”; do not force the ending.

**Guided and independent practice**
Do three cycles: quiet comfortable inhale, gentle “mmm” for a few seconds, rest; then speak two short phrases with planned breath points. Record only whether the sound felt easy, strained or unclear—not a judgement about voice quality.

**Answer guidance**
There is no target number of seconds. The correct result is comfortable airflow and no strain. If a phrase requires pushing, reduce length, loudness or tempo and try again.

**Evidence and success criteria**
Maintains comfortable posture and volume; plans breaths at phrase boundaries; avoids breath-holding and throat tension; recognises when to stop.

**Common errors to diagnose**
Taking an exaggerated gasp; squeezing the abdomen; lifting shoulders rigidly; forcing long breath holds; practising through hoarseness or pain.

**Retrieval and transfer**
Explain why a planned breath point can improve phrasing. Repeat a short phrase later at a comfortable volume and compare ease rather than maximum duration.

**Safety, ethics and scope boundary**
Stop if pain, dizziness, breathlessness or persistent hoarseness occurs. Do not practise extreme breath-holding, hyperventilation or loud sustained vocal drills; seek a qualified voice teacher/clinician for persistent problems.

---

## 12. BASE-MATH-002 — Arithmetic operations (Mathematics & Scientific Reasoning)

**Learning objective:** Perform and explain operations with whole numbers and decimals.
**Core model:** Addition, subtraction, multiplication, division, order of operations

**Why this matters**
Arithmetic is more reliable when the operation matches the meaning of the quantities and the result is checked for scale.

**Teach the concept**
Addition combines quantities with compatible units; subtraction finds a difference or remaining amount; multiplication scales a quantity or combines equal groups; division shares equally or measures how many groups fit. The written algorithm is a procedure, but place value explains why it works. For decimals, align place values when adding/subtracting. In multiplication and division, track the number of decimal places or use fractions to reason about scale.

Order of operations is a convention: grouping symbols first, then exponents, then multiplication/division from left to right, then addition/subtraction from left to right. Multiplication is not automatically before division in every expression; they share precedence. Estimation is an error detector: 19.8×5 should be near 20×5=100, not 9.9 or 990.

**Worked example**
Compute 12.5 + 3.75: write 12.50 + 3.75 = 16.25. Compute 4.8×0.3: 48×3=144, and there are two decimal places total, so 1.44. Check magnitude: 0.3 is less than 1, so multiplying 4.8 by 0.3 should produce a smaller positive number.

**Guided and independent practice**
Calculate 804−276, 23.4+6.08, 2.5×0.4 and 7.2÷0.6. Then evaluate 18−6÷3×2 using left-to-right multiplication/division.

**Answer guidance**
804−276=528; 23.4+6.08=29.48; 2.5×0.4=1.0; 7.2÷0.6=12. For the expression, 6÷3=2, then 2×2=4, then 18−4=14.

**Evidence and success criteria**
Shows place-value alignment; explains the operation meaning; uses correct precedence and left-to-right rule; checks with inverse operation or estimation; includes units when quantities have units.

**Common errors to diagnose**
Misaligning decimal points; assuming multiplication always precedes division; moving decimal points without explaining scale; ignoring whether a product should be larger or smaller.

**Retrieval and transfer**
Recreate one decimal addition, one decimal multiplication and one order-of-operations example without notes. Explain why the estimated magnitude is plausible.

**Safety, ethics and scope boundary**
Use ordinary numbers and fictional money examples. No special safety issue; avoid sharing personal financial records in arithmetic exercises.

---

## 13. BASE-CYBER-002 — Operating system foundations (Cybersecurity & Digital Infrastructure)

**Learning objective:** Explain processes, files, permissions and applications.
**Core model:** Process, memory, filesystem, permission, user

**Why this matters**
Operating-system concepts explain why apps run, where data lives and why permissions matter.

**Teach the concept**
An operating system coordinates hardware and software resources. A **process** is a running program instance; it has state and uses resources such as CPU time and memory. Files are named data objects stored in a filesystem; directories organise paths. An application may create, read, modify or delete files depending on its permissions. A user account and permission model help restrict what an app or person can do.

Memory (RAM) is working space used by active processes; storage keeps data across power cycles. Closing an app does not necessarily delete its files. A file extension is a naming clue, not a guarantee of the actual file type or safety. Least privilege means granting only the access needed. Updates and backups address different risks: updates fix or improve software; backups help recover data after loss or corruption.

**Worked example**
A photo editor requests access to all files. Ask: does the task require the whole filesystem, or can the user select one image? Prefer the narrower permission if available. Save a copy before destructive edits. If the app crashes, the process may stop while the original image remains on storage; recovery depends on autosave and file handling.

**Guided and independent practice**
Draw a diagram linking user, application, process, memory, filesystem and permission. For three common app permissions (camera, microphone, files), give a legitimate use and a reason to deny access.

**Answer guidance**
The diagram should show that the application runs as a process under OS control, uses memory, and accesses storage subject to permissions. Denial is reasonable when a feature does not need that permission; some features will not work without it.

**Evidence and success criteria**
Distinguishes RAM from storage, process from application file, and permission from ownership; explains least privilege; identifies backup and update as different controls.

**Common errors to diagnose**
Assuming an extension proves a file is safe; granting every permission automatically; believing uninstalling always removes cloud copies; confusing RAM with permanent storage.

**Retrieval and transfer**
Explain process, memory, filesystem, path and permission using a phone app example. Review one installed app’s permissions with a guardian and justify each necessary access.

**Safety, ethics and scope boundary**
Do not inspect or modify system files, root the device, disable security controls or run unknown commands as an exercise. Permission review should be non-destructive and guardian-aware.

---

## 14. BASE-LANG-002 — Sound and phonology (Language & Linguistic Intelligence)

**Learning objective:** Notice and produce meaningful sound contrasts.
**Core model:** Phoneme, syllable, stress, intonation, minimal pair

**Why this matters**
Phonology studies sound patterns that can distinguish meaning and shape how speech is understood.

**Teach the concept**
A phoneme is a sound category that can distinguish words in a language; a minimal pair differs in one phoneme, such as English /p/ and /b/ in “pat” and “bat”. A syllable organises speech around a vowel-like nucleus, often with optional onset and coda. Stress gives relative prominence to a syllable or word; intonation is pitch movement across an utterance and can signal structure, attitude or discourse meaning.

Pronunciation practice should connect listening, noticing and production. First hear the contrast, then identify what changes (voicing, place or manner of articulation), then practise in words and meaningful phrases. Accents vary; the goal is intelligibility and control for a chosen context, not erasing a speaker’s identity. Use a reliable dictionary or teacher model for target pronunciation rather than assuming spelling predicts sound.

**Worked example**
For /p/ versus /b/, both are bilabial stops: the lips close and release. The key contrast is voicing: /b/ is typically voiced and /p/ voiceless in English contexts. Practise “pat/bat” slowly, then in a short sentence. If a listener cannot distinguish them, adjust the sound and ask for feedback rather than repeating faster.

**Guided and independent practice**
Choose three minimal pairs from a trusted pronunciation dictionary. Record yourself saying each pair in isolation and in a sentence. Mark syllable stress in three multisyllabic words and note one intonation difference between a statement and a genuine question in your target variety.

**Answer guidance**
A useful analysis identifies the sound contrast and checks listener comprehension. Do not claim a single accent is universally correct; specify the model or context used.

**Evidence and success criteria**
Uses phoneme, syllable, stress and intonation accurately; distinguishes sound from spelling; practises in context; uses feedback and intelligibility rather than accent imitation as the only success measure.

**Common errors to diagnose**
Treating letters as phonemes; assuming every English variety has identical vowels; exaggerating stress until speech becomes unnatural; drilling sounds without checking meaning.

**Retrieval and transfer**
Define phoneme and minimal pair and provide a new example. Listen to a short sentence and mark its stressed syllable and intonation contour.

**Safety, ethics and scope boundary**
Voice recordings can contain personal information. Keep practice recordings private, obtain permission before recording others and avoid sharing identifiable voice clips publicly.

---

## 15. BASE-RES-002 — Search strategy (Research & Information Intelligence)

**Learning objective:** Search systematically using synonyms and source types.
**Core model:** Keyword, synonym, Boolean, database, search log

**Why this matters**
A search strategy makes research reproducible and reduces the risk of stopping at the first convenient result.

**Teach the concept**
Translate a question into concepts, synonyms and exclusions. Search with exact phrases for fixed terminology, Boolean AND to narrow, OR to include synonyms, and NOT cautiously because it can remove relevant results. Use filters such as date, document type, language and domain only when they match the question. Search different source types: scholarly databases for research, official sites for current rules, books for foundational treatment and primary documents for original evidence.

Keep a search log with query, platform, date, filters, useful results and next adjustment. Search results are ranked outputs, not a neutral map of all knowledge. A good search process iterates: inspect terms in useful results, add synonyms, follow citations and look for contrary evidence. For current claims, check publication/update date and jurisdiction.

**Worked example**
Question: “Do spaced practice methods improve recall in school learning?” Concepts: spaced practice, distributed practice, retrieval practice, school students, memory. Query: (“spaced practice” OR “distributed practice”) AND (students OR school) AND (retrieval OR recall). Search a research database, then inspect reviews and individual studies. Log the search date and do not infer causality from a blog summary.

**Guided and independent practice**
Build three progressively refined queries for a question you choose. Record one search that was too broad, one that was too narrow and how you changed it. Identify one source type that could answer the question and one that probably cannot.

**Answer guidance**
The exact query depends on the topic. A good log explains the revision: too many unrelated results → add a concept; no results → broaden synonyms or remove an over-specific term. The source type must fit the evidence needed.

**Evidence and success criteria**
Question concepts are represented; synonyms and operators are used correctly; search iterations are logged; date/jurisdiction filters are justified; results are screened rather than accepted by rank.

**Common errors to diagnose**
Using many keywords without a concept map; applying NOT too early; treating top result as best evidence; ignoring language or date; stopping after one platform.

**Retrieval and transfer**
Reconstruct a query from a question and explain why each operator is present. Repeat the search later and compare what changed in the result set.

**Safety, ethics and scope boundary**
Do not search for or download private personal records, leaked credentials or malware samples. Respect access terms and copyright; do not bypass paywalls or access controls.

---

## 16. BASE-INDEP-002 — Hygiene and self-care systems (Practical Independence)

**Learning objective:** Maintain repeatable hygiene routines using safe products and instructions.
**Core model:** Routine, label, contamination, skin irritation, privacy

**Why this matters**
Hygiene routines work best when they are consistent, proportionate and based on safe product use rather than harshness.

**Teach the concept**
Hygiene reduces avoidable contamination and supports comfort, but more product or stronger scrubbing is not automatically better. Follow the product label, use clean water where available, wash hands at key moments (for example after toilet use and before preparing food), and keep personal items such as towels and toothbrushes from being shared. Skin and hair needs vary; irritation, rash or pain is a signal to stop a product and seek trusted adult/clinical advice if it persists.

A routine should specify trigger, action, materials and safe storage. For example, after outdoor activity: wash hands, change damp clothing, clean reusable equipment as directed and allow it to dry. Store household cleaning products in original containers and away from children. Never mix cleaning chemicals; some combinations release dangerous gases.

**Worked example**
A simple handwashing routine: wet hands with clean running water, apply soap, rub all hand surfaces including between fingers and under nails, rinse, then dry with a clean towel or air. If soap and water are unavailable, use an appropriate hand sanitizer according to its label; it is not a substitute in every situation (for example visibly dirty hands).

**Guided and independent practice**
Design a morning and after-sport hygiene routine with no more than five steps each. For every product, identify the label instruction, storage location and one warning. Explain which steps are essential and which are optional.

**Answer guidance**
A valid routine is repeatable and avoids unnecessary products. It should include hand hygiene, clean/dry personal items and safe storage. If a product has no clear label or causes irritation, do not experiment with mixing or increasing the dose.

**Evidence and success criteria**
Uses products as labelled; avoids sharing personal items; includes drying and storage; recognises irritation; does not overclaim disease prevention.

**Common errors to diagnose**
Mixing cleaners; using more product than directed; sharing towels/razors; scrubbing irritated skin; storing chemicals in drink bottles; believing sanitizer replaces washing in every case.

**Retrieval and transfer**
Rebuild the trigger-action-materials-storage routine. Check a household product label with an adult and explain one precaution without handling it unnecessarily.

**Safety, ethics and scope boundary**
A minor should ask a guardian before using medicated or strong skin products. Never mix bleach, acids, ammonia or other cleaners; keep chemicals in labelled original containers and seek adult help after exposure.

---

## 17. BASE-LEAD-002 — Reliability and ownership (Leadership & Management)

**Learning objective:** Take responsibility for agreed work and communicate blockers.
**Core model:** Ownership, deliverable, dependency, escalation

**Why this matters**
Reliability is demonstrated by clear commitments, visible progress and early communication when reality changes.

**Teach the concept**
Ownership means taking responsibility for the part of a task you agreed to deliver; it does not mean pretending you control every dependency. A deliverable should have an owner, definition of done, due date and acceptance check. Dependencies are inputs or decisions required from someone else. A blocker is a condition preventing progress; escalate it early with a concise description, impact, what has been tried and a proposed next step.

Use status honestly: not started, in progress, blocked, ready for review, accepted. “Almost done” is not a useful status unless the remaining work is specified. If a deadline becomes unrealistic, communicate before it passes and renegotiate scope or timing. Reliability includes recording decisions so the team does not rely on memory alone.

**Worked example**
You promised a one-page project summary Friday, but need a teammate’s data by Wednesday. On Tuesday, the data has not arrived. Send: “The summary is drafted, but the results table depends on the dataset due yesterday. I requested it Monday and followed up today. Without it I can submit a clearly labelled draft Friday; with the dataset by Thursday noon I can submit the complete version. Which option should I use?”

**Guided and independent practice**
For a fictional group project, define one deliverable, acceptance criteria, owner, due date and two dependencies. Write a blocker update that states impact and a proposed decision without blaming a teammate.

**Answer guidance**
A strong update is factual, timely and decision-oriented. It distinguishes the person’s work from the dependency and offers a realistic option. The owner should not hide a missed dependency or silently change the definition of done.

**Evidence and success criteria**
Commitments are specific; status matches evidence; dependencies are named; blockers are raised early; options are realistic; decisions are recorded.

**Common errors to diagnose**
Waiting until deadline to report a blocker; saying “done” before acceptance; blaming others without evidence; accepting work beyond capacity; changing scope without agreement.

**Retrieval and transfer**
Explain owner, deliverable, dependency, blocker and escalation. Review one commitment and write a status that another person could act on.

**Safety, ethics and scope boundary**
Do not publish private team messages or personal details in a portfolio. In a school setting, involve a teacher/guardian if a project conflict includes bullying, coercion or unsafe conduct.

---

## 18. BASE-COMM-002 — Active listening (Communication & Rhetoric)

**Learning objective:** Listen for content, emotion and uncertainty.
**Core model:** Reflection, clarification, summarising, turn-taking

**Why this matters**
Active listening is a method for checking understanding, not silently waiting for a turn to speak.

**Teach the concept**
Listen for three layers: the literal content, the speaker’s concern or priority, and uncertainty that needs clarification. Paraphrase the main point in your own words, then ask whether you understood correctly. Open questions invite explanation (“What matters most about the deadline?”); closed questions confirm specifics (“Is Friday the agreed date?”). Summarising groups the points and decisions at the end.

Do not assume you can read emotion or intent from one cue. Tone, facial expression and word choice are context-dependent. Reflect tentatively: “It sounds like the timing is the main concern—is that right?” rather than declaring what someone feels. Listening does not require agreeing. You can accurately represent a view and still disagree with it.

**Worked example**
Speaker: “The design looks good, but I don’t know what I’m supposed to do next.” Listener: “The visual part is clear, but the next action is not. Would it help if we made the button label and next step more explicit?” The paraphrase separates what works from what is unclear and checks a practical need.

**Guided and independent practice**
In a two-minute conversation about a neutral topic, do not interrupt. Then paraphrase the speaker’s goal, ask one open question and summarise one agreed next step. Ask the speaker whether your summary was accurate.

**Answer guidance**
A good response is faithful, non-judgmental and open to correction. If the speaker says the paraphrase is wrong, revise it rather than defending the first interpretation.

**Evidence and success criteria**
Distinguishes paraphrase from agreement; asks clarifying questions; summarises decisions; avoids mind-reading; accepts correction.

**Common errors to diagnose**
Planning a reply while the other person speaks; repeating words without capturing meaning; turning every question into advice; assuming emotion; treating silence as consent.

**Retrieval and transfer**
Recreate the content/concern/uncertainty model and write one open and one closed question for the same topic.

**Safety, ethics and scope boundary**
Respect boundaries: a person may decline to discuss a topic. Do not pressure someone to disclose personal or traumatic information; seek a trusted adult if a conversation reveals immediate danger.

---

## Authoring and review status

- Status: internally authored teaching draft; subject review required.
- No learner outcome, mastery state or competency level is awarded by reading this pack.
- Answer guidance supports formative feedback; it is not a calibrated examination key.
- Safety statements are conservative boundaries, not professional certification or personalised advice.
- The sequence-2 scope is breadth-first. Further sequence-3 onward packs remain to be authored and reviewed.
