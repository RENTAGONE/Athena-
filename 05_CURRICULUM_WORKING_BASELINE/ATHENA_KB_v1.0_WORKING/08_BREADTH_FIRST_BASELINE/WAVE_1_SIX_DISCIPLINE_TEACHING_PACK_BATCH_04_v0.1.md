# Wave 1 Six-Discipline Teaching Pack — Batch 04

**Production message:** 7 of 20  
**Disciplines:** MATH, ENG, ELEC, RES, LANG, COMM  
**Status:** Authored instructional drafts; internal structural and worked-example checks performed; independent subject review and learner pilot pending.

## Learning workflow

ATHENA assigns the objectives, prerequisites and evidence requirements. The learner chooses study resources and learns independently. AI explanations and answer keys are study aids, not mastery evidence. The learner submits their own explanations, solutions or artefacts; an evaluator checks them against explicit criteria; the system proposes an evidence update; the learner approves before commit. Preserve source provenance and distinguish unaided performance from tool-assisted work.

---

## MATH-REASON-016 — Mathematical proof, counterexamples and structured problem solving

**Discipline strand:** Mathematical reasoning  
**Purpose:** Translate informal claims into precise statements; distinguish examples from proof; construct direct proofs, proofs by contrapositive and counterexamples; communicate a complete solution.  
**Prerequisites:** Arithmetic, algebra, equations, sets and basic logic notation.

### Learning outcomes
By the end, the learner can:
1. Explain the central ideas in their own words and define the relevant terms.
2. Apply the method to a standard problem without copying a worked solution.
3. Identify assumptions, boundary conditions and common failure modes.
4. Check the result using an independent method where practical.
5. Communicate reasoning and limitations clearly.

### Core knowledge
A proof is a finite chain of justified statements that establishes a claim for every object in its stated domain. Checking ten examples can suggest a conjecture but cannot prove a universal statement. A counterexample disproves a universal claim by exhibiting one valid case where it fails.

### Worked example
Claim: the sum of two odd integers is even. Let the integers be 2m+1 and 2n+1 for integers m,n. Their sum is 2(m+n+1), which is divisible by 2; therefore it is even. The proof works for arbitrary odd integers, not selected examples.

### Guided practice
1. Test whether every integer n has n²≥n; identify the domain where it is true and find a counterexample if the domain is all integers. 2. Prove the sum of two consecutive integers is odd. 3. Find a counterexample to 'if ab=ac then b=c' when no nonzero condition is imposed.

### Answer and feedback guidance
1. For nonnegative integers n, n²≥n; for all integers, n=-1 gives 1≥-1 (still true), but n=0 true; actually all integers? n=-2 gives 4≥-2 true. Prove n²-n=n(n-1)≥0 for integer n because consecutive factors share sign or one is zero. 2. n+(n+1)=2n+1. 3. a=0, b=1, c=2 gives 0=0 but b≠c.

### Common misconceptions and diagnostic prompts
Confusing repeated examples with proof; omitting the domain; assuming the conclusion inside the reasoning; dividing by an expression that may be zero; using a diagram as a universal proof without justification.

### Independent demonstration
Complete a new task that combines at least two of the unit's core ideas. Submit the original prompt or problem statement, your first attempt, the reasoning behind each major decision, the final result or artefact, an independent check, and a short reflection on what remains uncertain. Do not submit an AI-generated answer as if it were your own work.

### Assessment rubric
- Conceptual accuracy: 25%.
- Method selection and execution: 25%.
- Reasoning, checking and treatment of assumptions: 25%.
- Communication and provenance of evidence: 15%.
- Transfer to a new context: 10%.

**Competency threshold:** At least 80% overall, with no critical error in safety, logic or evidence integrity. A score below threshold identifies targeted revision; it does not erase prior evidence. Tool-assisted completion must be labelled and followed by an unaided check.

### Retention and progression
Reconstruct one proof from memory after 1 day; write a different proof or counterexample after 1 week; solve a novel claim after 1 month.

**Progression bridge:** Proof techniques, discrete mathematics, algorithms, scientific argument and formal verification.

---

## ENG-ALGO-003 — Algorithms, data structures and complexity

**Discipline strand:** Software engineering  
**Purpose:** Specify an algorithm independently of a programming language; select basic data structures; trace correctness; estimate time and space growth; compare trade-offs.  
**Prerequisites:** Basic programming, variables, conditionals, loops, functions, arrays/lists and simple debugging.

### Learning outcomes
By the end, the learner can:
1. Explain the central ideas in their own words and define the relevant terms.
2. Apply the method to a standard problem without copying a worked solution.
3. Identify assumptions, boundary conditions and common failure modes.
4. Check the result using an independent method where practical.
5. Communicate reasoning and limitations clearly.

### Core knowledge
An algorithm is a finite, unambiguous procedure that maps valid inputs to outputs and terminates under stated conditions. Data structures organise information to support operations. Complexity describes how resource use grows with input size; Big-O is an asymptotic upper-bound family, not a stopwatch prediction.

### Worked example
Linear search checks up to n elements, so comparisons grow proportionally to n: O(n). Binary search repeatedly halves a sorted search interval, requiring about log₂(n) steps: O(log n), but only when the ordering and access assumptions hold. A hash table often offers expected O(1) lookup, but collisions and worst-case behaviour matter. Choosing a structure depends on the operations required, memory limits and correctness constraints.

### Guided practice
1. Trace linear search for target 7 in [4,2,7,9]. 2. Explain why binary search is invalid on an unsorted list. 3. Compare a list and a set for repeated membership tests. 4. Write pseudocode to find the largest value, including empty-input handling.

### Answer and feedback guidance
1. Checks 4, then 2, then 7: three comparisons. 2. The midpoint does not tell which half contains the target unless ordering is guaranteed. 3. Lists preserve sequence and duplicates; sets represent unique membership and commonly support faster average membership. 4. Either reject empty input or return an explicit no-result value; initialise max to first element and scan remaining elements.

### Common misconceptions and diagnostic prompts
Assuming O(1) means instant; calling every nested loop O(n²) without examining bounds; using binary search without sorted input; ignoring memory; failing to define behaviour for empty or malformed input.

### Independent demonstration
Complete a new task that combines at least two of the unit's core ideas. Submit the original prompt or problem statement, your first attempt, the reasoning behind each major decision, the final result or artefact, an independent check, and a short reflection on what remains uncertain. Do not submit an AI-generated answer as if it were your own work.

### Assessment rubric
- Conceptual accuracy: 25%.
- Method selection and execution: 25%.
- Reasoning, checking and treatment of assumptions: 25%.
- Communication and provenance of evidence: 15%.
- Transfer to a new context: 10%.

**Competency threshold:** At least 80% overall, with no critical error in safety, logic or evidence integrity. A score below threshold identifies targeted revision; it does not erase prior evidence. Tool-assisted completion must be labelled and followed by an unaided check.

### Retention and progression
Trace an algorithm after 1 day; reimplement from memory after 1 week; compare two approaches on larger inputs after 1 month.

**Progression bridge:** Data structures, databases, optimisation, systems design and computational mathematics.

---

## ELEC-DIG-003 — Digital logic, binary representation and combinational circuits

**Discipline strand:** Electronics  
**Purpose:** Convert between binary and decimal; explain bits, logic levels and Boolean operations; build truth tables; simplify simple logic expressions; reason about combinational circuit behaviour.  
**Prerequisites:** Basic arithmetic, voltage/current concepts, safe multimeter use and basic circuit symbols. No mains work.

### Learning outcomes
By the end, the learner can:
1. Explain the central ideas in their own words and define the relevant terms.
2. Apply the method to a standard problem without copying a worked solution.
3. Identify assumptions, boundary conditions and common failure modes.
4. Check the result using an independent method where practical.
5. Communicate reasoning and limitations clearly.

### Core knowledge
Digital systems encode information using discrete states, commonly represented as 0 and 1. A logic level is a voltage range interpreted according to a device's specifications, not necessarily exactly 0 V or the supply voltage. Boolean algebra describes logical relationships. A combinational circuit's output depends on current inputs; sequential circuits also depend on stored state.

### Worked example
For a two-input AND gate, output is 1 only when both inputs are 1. Truth table: 00→0, 01→0, 10→0, 11→1. OR outputs 1 when at least one input is 1; NOT reverses a single input. Binary 1011₂ = 8+0+2+1 = 11₁₀. A half-adder uses XOR for sum and AND for carry.

### Guided practice
1. Convert 11010₂ to decimal. 2. Create truth tables for NOT A, A OR B and A XOR B. 3. For a safety interlock requiring both guard-closed and start-requested, select the basic gate and explain. 4. Explain why a real logic input must not be left floating unless the datasheet explicitly permits it.

### Answer and feedback guidance
1. 16+8+2=26. 2. NOT: 0→1,1→0; OR: 00→0,01→1,10→1,11→1; XOR: 00→0,01→1,10→1,11→0. 3. AND, because both conditions must be true. 4. Floating voltage can be interpreted unpredictably and may cause noise, excess current or unreliable switching; use specified pull-up/down arrangements.

### Common misconceptions and diagnostic prompts
Treating logic 1 as universally equal to 5 V; confusing XOR with OR; ignoring active-low signals; assuming ideal gates without propagation delay or input thresholds; wiring an IC without checking pinout and supply ratings.

### Independent demonstration
Complete a new task that combines at least two of the unit's core ideas. Submit the original prompt or problem statement, your first attempt, the reasoning behind each major decision, the final result or artefact, an independent check, and a short reflection on what remains uncertain. Do not submit an AI-generated answer as if it were your own work.

### Assessment rubric
- Conceptual accuracy: 25%.
- Method selection and execution: 25%.
- Reasoning, checking and treatment of assumptions: 25%.
- Communication and provenance of evidence: 15%.
- Transfer to a new context: 10%.

**Competency threshold:** At least 80% overall, with no critical error in safety, logic or evidence integrity. A score below threshold identifies targeted revision; it does not erase prior evidence. Tool-assisted completion must be labelled and followed by an unaided check.

### Retention and progression
Recreate truth tables after 1 day; convert mixed binary values after 1 week; design and test a new logic condition after 1 month.

**Progression bridge:** Microcontrollers, computer architecture, embedded systems, control and digital communication.

---

## RES-DATA-003 — Data cleaning, descriptive analysis and reproducible workflows

**Discipline strand:** Research  
**Purpose:** Create a data dictionary; inspect missing, duplicate and invalid values; distinguish cleaning from manipulation; calculate suitable summaries; document a reproducible analysis.  
**Prerequisites:** Research question, variable types, basic arithmetic, spreadsheet or beginner programming use.

### Learning outcomes
By the end, the learner can:
1. Explain the central ideas in their own words and define the relevant terms.
2. Apply the method to a standard problem without copying a worked solution.
3. Identify assumptions, boundary conditions and common failure modes.
4. Check the result using an independent method where practical.
5. Communicate reasoning and limitations clearly.

### Core knowledge
Data analysis begins with data provenance and variable meaning. Cleaning corrects or flags demonstrable quality problems; it must not silently change inconvenient observations. Missingness is information: distinguish not recorded, not applicable and refused where possible. Descriptive summaries depend on measurement scale and distribution. A reproducible workflow records transformations from raw data to reported results.

### Worked example
A survey has ages [13,14,14,15,150] and one blank. Do not automatically replace 150 with 15. Check the source, flag it as a possible entry error, retain the raw value and document any correction. Report count, missingness and a robust summary such as median alongside the mean if the outlier materially shifts it. Preserve an untouched raw file and create a scripted or logged cleaned dataset.

### Guided practice
1. Define a data dictionary for age, study minutes and preferred subject. 2. Explain how to handle a duplicate row. 3. Calculate mean and median for [2,3,3,4,18]. 4. Describe a reproducible sequence from raw file to chart.

### Answer and feedback guidance
1. Include name, definition, type, unit, allowed values and missing-value rule. 2. Verify whether it is a true duplicate or two legitimate identical records; document removal only if duplicate identity is established. 3. Mean=6; median=3. 4. Preserve raw data; document import; validate schema; log cleaning; analyse; generate figures; record software/version and decisions; export results.

### Common misconceptions and diagnostic prompts
Deleting outliers because they weaken a hypothesis; treating blank as zero; changing raw data in place; reporting mean without distribution context; confusing a duplicate value with duplicate record; failing to record units or time window.

### Independent demonstration
Complete a new task that combines at least two of the unit's core ideas. Submit the original prompt or problem statement, your first attempt, the reasoning behind each major decision, the final result or artefact, an independent check, and a short reflection on what remains uncertain. Do not submit an AI-generated answer as if it were your own work.

### Assessment rubric
- Conceptual accuracy: 25%.
- Method selection and execution: 25%.
- Reasoning, checking and treatment of assumptions: 25%.
- Communication and provenance of evidence: 15%.
- Transfer to a new context: 10%.

**Competency threshold:** At least 80% overall, with no critical error in safety, logic or evidence integrity. A score below threshold identifies targeted revision; it does not erase prior evidence. Tool-assisted completion must be labelled and followed by an unaided check.

### Retention and progression
Recreate the cleaning log after 1 day; audit a different dataset after 1 week; reproduce another person's analysis after 1 month.

**Progression bridge:** Statistics, scientific research, business analytics, finance, public policy and machine learning.

---

## LANG-READ-003 — Reading comprehension, inference and analytical writing

**Discipline strand:** Language  
**Purpose:** Identify explicit claims, infer supported implications, distinguish author claim from evidence, summarise faithfully, analyse structure and produce a concise evidence-based response.  
**Prerequisites:** Functional reading fluency in the target language; basic sentence and paragraph structure.

### Learning outcomes
By the end, the learner can:
1. Explain the central ideas in their own words and define the relevant terms.
2. Apply the method to a standard problem without copying a worked solution.
3. Identify assumptions, boundary conditions and common failure modes.
4. Check the result using an independent method where practical.
5. Communicate reasoning and limitations clearly.

### Core knowledge
Comprehension has literal, inferential and evaluative layers. An inference must be supported by textual cues plus reasonable background knowledge; it is not permission to invent. A summary preserves the source's central meaning without inserting opinion. Analytical writing makes a claim, supports it with relevant evidence, explains the connection and acknowledges limits.

### Worked example
Suppose a passage says: 'After the school moved practice indoors, attendance rose from 60% to 75%. The report did not track weather or transport changes.' A supported statement is that attendance increased after the move. It is not yet justified to claim the indoor venue caused the increase, because other explanations were not controlled.

### Guided practice
1. Write a one-sentence neutral summary of a 200-word article. 2. Mark one explicit claim and its supporting evidence. 3. Identify an inference and cite the clue that supports it. 4. Rewrite an overconfident causal claim as a cautious one. 5. Write a 150-word analysis with claim, evidence, reasoning and limitation.

### Answer and feedback guidance
Answer quality depends on the selected passage. A valid summary includes the central point and key qualification, excludes minor details and adds no new opinion. A causal claim should be revised to 'attendance rose after the change, but the report does not establish that the venue change caused it.'

### Common misconceptions and diagnostic prompts
Confusing inference with speculation; quoting without explaining relevance; cherry-picking; summarising sentence-by-sentence rather than synthesising; treating correlation or sequence as causation; overstating certainty.

### Independent demonstration
Complete a new task that combines at least two of the unit's core ideas. Submit the original prompt or problem statement, your first attempt, the reasoning behind each major decision, the final result or artefact, an independent check, and a short reflection on what remains uncertain. Do not submit an AI-generated answer as if it were your own work.

### Assessment rubric
- Conceptual accuracy: 25%.
- Method selection and execution: 25%.
- Reasoning, checking and treatment of assumptions: 25%.
- Communication and provenance of evidence: 15%.
- Transfer to a new context: 10%.

**Competency threshold:** At least 80% overall, with no critical error in safety, logic or evidence integrity. A score below threshold identifies targeted revision; it does not erase prior evidence. Tool-assisted completion must be labelled and followed by an unaided check.

### Retention and progression
Recall the author's thesis after 1 day; summarise a new text after 1 week; compare conflicting sources after 1 month.

**Progression bridge:** Research literacy, academic writing, media literacy, critical thinking and professional communication.

---

## COMM-NEG-003 — Negotiation, conflict resolution and active listening

**Discipline strand:** Communication  
**Purpose:** Prepare for a negotiation; identify interests beneath stated positions; ask clarifying questions; generate options; evaluate objective criteria; make and document agreements; recognise when to pause or seek help.  
**Prerequisites:** Active listening, clear expression, emotional self-regulation and basic argumentation.

### Learning outcomes
By the end, the learner can:
1. Explain the central ideas in their own words and define the relevant terms.
2. Apply the method to a standard problem without copying a worked solution.
3. Identify assumptions, boundary conditions and common failure modes.
4. Check the result using an independent method where practical.
5. Communicate reasoning and limitations clearly.

### Core knowledge
A position is what a party says they want; an interest is the underlying need or concern. Negotiation improves when parties clarify interests, identify constraints and develop options rather than treating the first positions as fixed. A BATNA is the best alternative if no agreement is reached. It is not a threat; it helps assess whether an agreement is better than walking away. Fair process requires accurate representation and no coercion.

### Worked example
Two students need the same computer at the same time. Their positions are 'I need it now'. Interests may differ: one needs a 20-minute upload deadline; the other needs quiet typing time. Options include deadline-first use, a different device, scheduled turns or splitting tasks. Agree measurable times and a fallback. Do not assume interests until each person confirms them.

### Guided practice
1. Convert 'I want the room' into three possible underlying interests. 2. Write two open questions that uncover constraints. 3. Generate three options for a shared-resource conflict. 4. State a BATNA in a low-stakes scenario. 5. Draft a neutral written agreement with responsibilities and review time.

### Answer and feedback guidance
There is no single correct agreement. Strong answers distinguish confirmed interests from guesses, include multiple options, use transparent criteria, preserve each party's ability to decline and specify who does what by when. A BATNA should be realistic and within the person's authority.

### Common misconceptions and diagnostic prompts
Treating negotiation as winning; confusing a threat with a boundary; making assumptions about another person's motives; agreeing under pressure; using false deadlines; failing to record commitments; escalating when safety or power imbalance requires support.

### Independent demonstration
Complete a new task that combines at least two of the unit's core ideas. Submit the original prompt or problem statement, your first attempt, the reasoning behind each major decision, the final result or artefact, an independent check, and a short reflection on what remains uncertain. Do not submit an AI-generated answer as if it were your own work.

### Assessment rubric
- Conceptual accuracy: 25%.
- Method selection and execution: 25%.
- Reasoning, checking and treatment of assumptions: 25%.
- Communication and provenance of evidence: 15%.
- Transfer to a new context: 10%.

**Competency threshold:** At least 80% overall, with no critical error in safety, logic or evidence integrity. A score below threshold identifies targeted revision; it does not erase prior evidence. Tool-assisted completion must be labelled and followed by an unaided check.

### Retention and progression
Reconstruct the interests/options framework after 1 day; role-play a new scenario after 1 week; review a real low-stakes agreement after 1 month.

**Progression bridge:** Leadership, teamwork, sales, project management, conflict resolution and civic participation.
