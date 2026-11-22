# Wave 1 Six-Discipline Teaching Pack — Batch 05

**Production message:** 9 of 20  
**Status:** Authoring draft; internal review required  
**Purpose:** Close selected high-impact instructional gaps across all six Wave 1 disciplines. These units are learner-facing study specifications: ATHENA assigns the work, the learner studies through suitable sources, and independent evidence is evaluated before any progress update is proposed.

## Learning workflow

For each unit: (1) check prerequisites; (2) study the concepts using at least one suitable source; (3) attempt guided practice without copying worked answers; (4) complete the independent demonstration; (5) submit reasoning, artefacts and disclosed tool assistance; (6) receive evaluation and targeted remediation; (7) complete delayed retrieval or transfer. Reading a unit or asking an AI for an answer is not evidence of mastery.

---

## MATH-LA-017 — Vectors, matrices and linear transformations

**Purpose:** Build the conceptual bridge from algebra and coordinate geometry to linear algebra, graphics, data science, physics and engineering.

**Prerequisites:** Signed numbers, fractions, coordinate pairs, solving simple equations and interpreting functions. Recommended: MATH-FUNC-001 and MATH-MOD-015.

**Learning outcomes:** The learner can represent vectors geometrically and component-wise; calculate vector addition, scalar multiplication and dot products; interpret matrices as structured transformations or systems; multiply compatible matrices; solve a small system using elimination; and explain when a linear model is inappropriate.

**Core knowledge:** A vector represents a quantity with components and a coordinate frame. In two dimensions, v=(a,b); addition combines corresponding components and scalar multiplication changes scale and possibly direction. The dot product a·b=a₁b₁+a₂b₂ measures alignment and supports angle/projection reasoning. A matrix is not merely a rectangular table: it can encode a linear map, transform coordinates, or represent coefficients in a system. Matrix dimensions determine which products are defined. For an m×n matrix A and n×1 vector x, Ax is defined and produces an m×1 vector. Composition order matters: in general AB≠BA. Linear transformations preserve vector addition and scalar multiplication; translations are affine, not linear, unless represented in an augmented coordinate system.

**Worked example:** Let u=(2,1), v=(-1,3). Then u+v=(1,4), 2u=(4,2), and u·v=2(-1)+1(3)=1. For A=[[2,0],[0,3]], A(2,1)=(4,3): horizontal coordinates are scaled by 2 and vertical coordinates by 3. The matrix changes the vector's coordinates according to a rule; it does not arbitrarily “multiply two lists.”

**Guided practice:**
1. Draw (3,-2), then calculate its magnitude and explain why magnitude is non-negative.
2. Compute (1,4)+(-3,2) and 3(1,4).
3. Compute the dot product of (2,0) and (0,5); interpret the result geometrically.
4. Determine whether a 2×3 matrix can multiply a 4×1 vector; explain using inner dimensions.
5. Apply [[1,0],[0,-1]] to (3,2) and describe the reflection.
6. Solve 2x+y=7 and x-y=2 by elimination; verify the solution in both original equations.

**Answer and feedback guidance:** The vector sum is (-2,6); scalar multiple is (3,12); perpendicular axis-aligned vectors have dot product 0; the 2×3 by 4×1 product is undefined; the matrix reflects across the horizontal axis to (3,-2); the system solution is x=3,y=1. Award reasoning credit for dimensions, operations and substitution checks, not only final values.

**Common misconceptions:** Treating vectors as points without a stated interpretation; assuming dot product is component-wise multiplication; multiplying matrices whenever they look compatible; reversing transformation order; believing every matrix has an inverse; confusing a linear transformation with any graph transformation.

**Independent demonstration:** Model a 2D coordinate transformation for a simple sprite, map, or measured set of points. Submit the original coordinates, matrix, transformed coordinates, a hand-worked check for at least two points, a diagram, and a note explaining the transformation's limitations. A spreadsheet or code tool may verify arithmetic but the learner must explain the operation.

**Assessment rubric:** 0 = cannot interpret components or dimensions; 1 = performs familiar operations with prompts; 2 = accurately computes and explains a transformation; 3 = composes or compares transformations, checks results independently and explains limitations. Mastery requires a fresh transfer problem after a delay.

**Retention and progression:** Reconstruct vector operations from a blank page after 2–7 days; later solve a new transformation problem. Progression: determinants, inverse matrices, eigenvectors, least squares, 3D transformations and applied linear algebra. These advanced topics are not covered by this unit.

---

## ENG-TEST-004 — Software testing, debugging and quality assurance

**Purpose:** Replace trial-and-error editing with a repeatable method for finding, explaining and preventing software defects.

**Prerequisites:** Basic programming in one language; variables, conditionals, loops, functions and reading error messages. ENG-ARCH-001 and ENG-SWE-002 recommended.

**Learning outcomes:** The learner can distinguish syntax, runtime and logic defects; reproduce a defect; reduce it to a minimal failing case; form and test a hypothesis; write tests for normal, boundary and invalid inputs; interpret a failing test; and explain the limits of test coverage.

**Core knowledge:** A defect is a flaw; a failure is an observed incorrect behaviour under particular conditions. Debugging begins with a reproducible observation, not a random code change. A useful loop is observe → reproduce → isolate → hypothesise → test → fix → regression-test → document. Unit tests check small components; integration tests check interactions; end-to-end tests check user-visible flows. Test cases should cover equivalence classes, boundaries, expected errors and important state transitions. A passing test suite proves only that tested cases passed under the tested environment; it does not prove absence of defects. Assertions should test behaviour, not mirror implementation details so closely that a wrong design can pass.

**Worked example:** A function `discount(price, rate)` is intended to accept non-negative price and a rate from 0 to 1. A test with price=100, rate=0.2 should return 80. Boundary tests include rate=0 and rate=1; invalid tests include negative price and rate=1.2. If the function returns 120, first reproduce it, inspect the calculation and identify whether the code adds rather than subtracts the discount. After correction, rerun the original failing test and the entire relevant regression suite.

**Guided practice:**
1. Classify: missing colon, division by zero, and a loop that skips the final item.
2. Design tests for a function that converts Celsius to Fahrenheit, including a known reference point and negative temperature.
3. For an age validator accepting 0–120 inclusive, list boundary and invalid tests.
4. Explain why “it works on my phone” is not sufficient release evidence.
5. Given a defect report with vague steps, rewrite it as a reproducible sequence with expected and actual results.
6. Explain why changing three unrelated lines before rerunning a failing test weakens diagnosis.

**Answer and feedback guidance:** Missing colon is syntax; division by zero is runtime; skipped final item is logic. Celsius tests can include 0°C→32°F and -40°C→-40°F. Age boundaries include 0, 1, 119, 120 and invalid -1, 121, non-numeric input if not supported. A good defect report records environment, setup, exact steps, expected result, actual result and frequency. Debugging quality is judged by causal reasoning and controlled changes.

**Common misconceptions:** Passing tests means no bugs; more tests automatically mean better tests; debugging means staring at code until insight arrives; an error message always identifies the root cause; fixing the symptom is equivalent to fixing the cause; tests should only cover the happy path.

**Independent demonstration:** Take a small program with at least three seeded defects or use a learner-created program. Submit defect reproduction steps, a minimal failing test for each defect, hypotheses, fixes, regression tests and a short note on remaining untested risks. Disclose AI/code-assistant use and be prepared to explain every change.

**Assessment rubric:** 0 = edits without reproducible evidence; 1 = finds obvious defects with hints; 2 = isolates, fixes and regression-tests defects; 3 = designs systematic test coverage, distinguishes symptom from cause and communicates residual risk.

**Retention and progression:** Revisit a previously fixed defect after one week and write a regression test from memory. Progression: property-based testing, mocking, test automation, CI, performance testing, security testing and reliability engineering.

---

## ELEC-ANA-004 — RC circuits, time constants and safe transient observation

**Purpose:** Understand how a resistor-capacitor circuit changes over time, connecting circuit laws to real measurements without unsafe experimentation.

**Prerequisites:** Voltage, current, resistance, Ohm's law, series circuits, capacitor polarity where applicable, and safe multimeter practice. ELEC-DEV-001 and ELEC-MEAS-002 recommended.

**Safety boundary:** This unit is for conceptual work and supervised, current-limited extra-low-voltage educational circuits only. Do not connect experiments to mains electricity, wall adapters of unknown quality, lithium battery packs, or high-energy capacitors. Never measure resistance on an energised circuit. Discharge capacitors using an appropriate resistor-based method under competent supervision; do not short a capacitor with a tool. Verify the circuit is de-energised before changing connections. If supervision or correctly rated equipment is unavailable, complete the simulation-only pathway.

**Learning outcomes:** The learner can explain capacitor charge storage; describe charging and discharging curves; calculate the time constant τ=RC with consistent units; estimate the fraction of final voltage after selected time constants; identify measurement loading and component tolerance; and distinguish ideal models from real behaviour.

**Core knowledge:** A capacitor stores energy in an electric field. In a simple series RC circuit, the time constant τ=RC sets the characteristic speed of the response. During ideal charging from a DC step, capacitor voltage is Vc(t)=Vs(1−e^(−t/RC)); during discharge from V₀, Vc(t)=V₀e^(−t/RC). At one time constant, charging reaches about 63.2% of its final value and discharge falls to about 36.8% of its initial value. At about five time constants, the response is near (not mathematically exactly) its final value. Real components have tolerances, leakage, parasitic effects and measurement limitations.

**Worked example:** R=10 kΩ and C=100 µF. Convert units: 10,000 Ω × 0.0001 F = 1 s. After one second of ideal charging, Vc≈0.632Vs. If Vs=5 V, that is about 3.16 V. After five seconds it is about 4.97 V, close to 5 V. These are model estimates, not guaranteed readings.

**Guided practice:**
1. Calculate τ for 4.7 kΩ and 220 µF; show unit conversion.
2. Estimate charging voltage after one τ from a 3.3 V source.
3. Estimate the remaining discharge voltage after two τ from an initial 6 V.
4. Explain why doubling R while holding C constant doubles τ.
5. Explain why a meter with finite input resistance can affect some measurements.
6. Identify two reasons a measured curve may differ from the ideal exponential model.

**Answer and feedback guidance:** τ≈1.034 s; one-τ charging voltage≈2.09 V; after two τ, 6e^-2≈0.812 V. Doubling R doubles RC. Measurement input resistance can form an unintended parallel path; component tolerance, capacitor leakage, source resistance and timing error can also explain deviations. Accept sensible approximations if method and units are clear.

**Common misconceptions:** A capacitor is simply a tiny battery; current through an ideal capacitor is constant during charging; five time constants means exact completion; a meter is invisible to a circuit; an uncharged capacitor is always safe; a simulated result guarantees hardware behaviour.

**Independent demonstration:** Use a circuit simulator or a supervised extra-low-voltage kit to predict and record an RC charge/discharge curve. Submit schematic, component values and tolerances, predicted τ, a labelled time-voltage table or plot, measurement method, safety checklist, comparison and uncertainty explanation. Simulation-only evidence must be labelled as simulation.

**Assessment rubric:** 0 = cannot relate R, C and time; 1 = calculates τ with support; 2 = predicts and interprets transient behaviour with units; 3 = compares model and data, identifies measurement effects and communicates safety/uncertainty.

**Retention and progression:** Recalculate τ with different units after a delay; explain the 63%/37% landmarks without notes. Progression: first-order filters, frequency response, signal conditioning and transient analysis. This unit does not authorise unsupervised hardware work.

---

## RES-SYN-004 — Literature search, synthesis and evidence traceability

**Purpose:** Move from collecting links to producing a transparent synthesis that accurately represents what sources do and do not establish.

**Prerequisites:** Focused research questions, source evaluation, basic note-taking and distinction between claim and evidence. RES-EVAL-001 and RES-METHOD-002 recommended.

**Learning outcomes:** The learner can translate a question into search concepts; build a reproducible search strategy; record inclusion/exclusion criteria; extract claims and methods; compare sources without flattening disagreement; identify evidence gaps; and write a traceable synthesis with appropriately bounded conclusions.

**Core knowledge:** A search strategy specifies databases or repositories, search terms, date limits, language and document types. Search strings may combine synonyms with OR and concepts with AND. A search log records when, where and how a search was run. Inclusion criteria should be decided before selecting results where feasible; exclusion reasons should be recorded. A source matrix can capture citation, question, design, sample/context, measures, findings, limitations and relevance. Synthesis groups findings by themes, methods or disagreements; it is not a sequence of unrelated summaries. A narrative review, scoping review and systematic review make different methodological promises. Do not call a small informal search “systematic.”

**Worked example:** Question: “What factors affect beginner retention in introductory programming courses?” Search concepts: beginner/novice; programming/computing; retention/persistence/dropout. Search log records database, exact query, date and result count. Screening criteria include population, course context and whether retention is measured. The synthesis may find that prior experience, course design and belonging are discussed, but if studies use different populations and outcomes, the writer must not claim one universal causal factor.

**Guided practice:**
1. Convert a broad topic into three concept groups with synonyms.
2. Write a reproducible search string using AND/OR.
3. Create inclusion and exclusion criteria for a narrowly defined question.
4. Extract methods, population, outcome and limitation from two abstracts.
5. Identify whether two apparently conflicting findings actually measure different outcomes.
6. Rewrite an overconfident conclusion so it matches the available evidence.

**Answer and feedback guidance:** Strong search concepts are conceptually distinct and include meaningful synonyms. Criteria must be operational rather than “good papers only.” Extraction separates authors' findings from your interpretation. Disagreement may arise from different definitions, samples, methods, contexts or genuine uncertainty. A synthesis should preserve those distinctions and cite each claim at the point where it is used.

**Common misconceptions:** The first page of search results is comprehensive; citation count equals truth; two papers prove consensus; a review is systematic because it has many references; a source matrix is itself a synthesis; absence of evidence proves no effect.

**Independent demonstration:** Produce a mini evidence review on a low-risk, non-sensitive question. Submit the question, search log, exact search strings, selection criteria, source matrix with at least five relevant sources if available, thematic synthesis, disagreement/gap section and limitations. If fewer than five credible sources exist, report that rather than padding with irrelevant material.

**Assessment rubric:** 0 = link collection without traceability; 1 = basic summaries with incomplete search records; 2 = reproducible search and accurate thematic synthesis; 3 = critically compares methods, uncertainty and gaps while keeping every substantive claim traceable.

**Retention and progression:** Re-run one search after two weeks and compare what changed; revisit the synthesis when new evidence appears. Progression: systematic review methods, meta-analysis, evidence grading, preregistration and research synthesis software.

---

## LANG-PRAG-004 — Semantics, pragmatics and meaning in context

**Purpose:** Analyse how literal meaning, speaker intention, context and social convention interact in real communication.

**Prerequisites:** Basic awareness of word classes, sentence structure and language variation. LANG-STRUCT-001 recommended.

**Learning outcomes:** The learner can distinguish lexical and compositional meaning from pragmatic inference; identify ambiguity, deixis, presupposition and implicature; explain how context changes interpretation; analyse register and politeness without treating one cultural norm as universal; and revise a message for a specified audience and purpose.

**Core knowledge:** Semantics concerns conventional meaning and how expressions combine. Pragmatics concerns meaning in use: what a speaker communicates in a context beyond the literal sentence. Deixis uses context-dependent expressions such as “here,” “that” and “tomorrow.” Ambiguity permits multiple interpretations. Presuppositions are background assumptions triggered by an expression; implicatures are contextually inferred meanings that are not explicitly stated. Register varies with audience, purpose, medium and relationship. Politeness conventions differ across communities and situations; avoid presenting one culture's preferred style as a universal rule.

**Worked example:** “Can you open the window?” is grammatically a question about ability, but in many ordinary contexts it functions as a request. “It's cold in here” may be a literal observation or an indirect request to close a window, depending on context. The interpretation is plausible, not guaranteed; the listener should use context and clarification rather than assume intent with certainty.

**Guided practice:**
1. Give two possible referents for “Put it over there” and identify missing context.
2. Explain the difference between the literal form and likely function of “Could you pass the salt?”
3. Identify a possible presupposition in “When did you stop using the old system?”
4. Write two interpretations of an ambiguous headline.
5. Rewrite a blunt message for a formal audience without changing its factual content.
6. Explain why indirectness may be interpreted differently across relationships and cultures.

**Answer and feedback guidance:** Deictic expressions need speaker, time or location context. The salt sentence conventionally functions as a request. The “when did you stop” question presupposes that the person previously used the old system; that assumption may be false. Good rewrites preserve propositional content while changing register. Pragmatic interpretations should be presented as context-supported possibilities, not certain mind-reading.

**Common misconceptions:** Meaning is only dictionary definition; every indirect phrase has one intended meaning; politeness is identical across cultures; grammar errors and pragmatic mismatch are the same; an inference is a fact about the speaker's intention.

**Independent demonstration:** Analyse three short, non-private examples from public communication (e.g., notices, advertisements or dialogue). For each, identify literal meaning, contextual inference, ambiguity/presupposition/implicature where relevant, audience and alternative interpretation. Then rewrite one message for a different audience and explain the changes.

**Assessment rubric:** 0 = treats all meaning as literal; 1 = identifies context with prompting; 2 = distinguishes semantics and pragmatics and supports interpretations; 3 = analyses alternatives, audience/register and uncertainty without stereotyping.

**Retention and progression:** Keep a small context-and-meaning log and revisit interpretations after learning more context. Progression: discourse analysis, sociolinguistics, intercultural pragmatics, conversation analysis and translation.

---

## COMM-MEDIA-004 — Media literacy, framing and persuasive techniques

**Purpose:** Evaluate how messages select, frame and present information, and communicate a fair response without confusing persuasion with proof.

**Prerequisites:** Evidence-based argumentation, source evaluation and basic audience analysis. COMM-ARG-001 and RES-EVAL-001 recommended.

**Learning outcomes:** The learner can identify claim, evidence, source and intended audience; distinguish reporting from commentary and advertising; analyse framing, omission, emotional appeal and visual selection; check a claim against primary or independent sources; and produce a fair, sourced response that acknowledges uncertainty.

**Core knowledge:** Media literacy asks who created a message, for whom, with what purpose, under what incentives, and with which evidence. Framing selects aspects of an issue and makes some interpretations more salient. Selection is unavoidable, but material omissions can distort. A photograph or chart can be authentic yet misleading through cropping, scale, denominator choice or missing context. Persuasive techniques include emotional appeal, social proof, authority cues, repetition and false dilemmas; their presence does not automatically make a claim false. Verification should trace a specific claim to its original context, date, data and methodology. Distinguish fact-checking from attacking the speaker.

**Worked example:** A headline says “Scores double after new teaching method.” Before accepting it, ask: double compared with what baseline? How many learners? Was there a control group? Were the same tests used? Was the change absolute or relative? Did other changes occur? A rise from 1 to 2 is a doubling but may be educationally trivial. A fair response states what the report shows and what it does not establish.

**Guided practice:**
1. Separate factual claims, opinions and calls to action in a short post.
2. Identify the denominator missing from a percentage claim.
3. Explain how a truncated chart axis can exaggerate a difference.
4. Trace a quoted statistic back to its original source and date.
5. Identify one strong and one weak alternative explanation for a headline claim.
6. Rewrite a partisan summary into a fair account that preserves relevant disagreement.

**Answer and feedback guidance:** The learner should quote or paraphrase the exact claim before checking it. A percentage needs a base and comparison. Chart axes must be inspected, not judged from visual impression alone. Original source context matters: a quote may be accurate but incomplete. A fair account does not require false balance; evidence quality determines weight.

**Common misconceptions:** Viral means verified; a real image proves the caption; every two-sided issue has equally supported sides; emotional language proves manipulation; a source with bias cannot contain true information; a fact-check label replaces reading the evidence.

**Independent demonstration:** Select a public, non-sensitive claim from a news article, advertisement or social post. Submit the exact claim, source and date, intended audience, evidence trail, framing/omission analysis, independent corroboration, confidence level, and a 200–300 word fair assessment. Do not amplify private information, harassment or unverified allegations about identifiable people.

**Assessment rubric:** 0 = repeats a claim without checking; 1 = checks surface details; 2 = traces evidence and identifies framing/limitations; 3 = triangulates credible sources, weighs evidence proportionately and communicates a calibrated conclusion.

**Retention and progression:** Apply a five-question verification checklist to one claim per week. Progression: visual misinformation, platform incentives, political communication, advertising analysis, data journalism and advanced fact-checking.

---

## Cross-unit transfer challenge

Choose a public, low-risk claim about a simple electronic indicator, software tool or learning intervention. Use RES-SYN-004 to find and trace evidence; COMM-MEDIA-004 to analyse framing; MATH-LA-017 or existing mathematical units to check quantitative claims; ENG-TEST-004 to define a reproducible test; and, only if a supervised extra-low-voltage simulation or kit is available, ELEC-ANA-004 to model a circuit response. Use LANG-PRAG-004 to revise the explanation for a non-specialist audience. Submit a source log, test plan, calculations/model, limitations, safety statement and plain-language conclusion. This is a transfer task, not proof that every linked unit is mastered.

## Evidence-package requirements

For each unit, the learner submits: unit code; date; resources used; a concise explanation in their own words; independent work; answer/checking method; mistakes and corrections; practical artefact where applicable; tool/AI assistance disclosure; and a delayed transfer result when scheduled. An evaluator may recommend `DEMONSTRATED`, `NEEDS_REVISION` or `INSUFFICIENT_EVIDENCE`; the engine must not infer mastery from time spent, reading completion or AI-generated text. Learner approval is required before any progress-state commit.
