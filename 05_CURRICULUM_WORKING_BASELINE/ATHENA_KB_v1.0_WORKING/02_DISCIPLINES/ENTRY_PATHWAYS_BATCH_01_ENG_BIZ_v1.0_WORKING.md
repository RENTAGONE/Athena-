# Macro Entry Pathways — Batch 01

**Disciplines:** Engineering & Computer Science (ENG), Business & Entrepreneurship (BIZ)  
**Status:** Substantive draft pathways. Placement is diagnostic; these are not compulsory linear courses.  
**Unit standard:** Each module includes a conceptual model, observable objectives, worked example, practice, assessment, common misconceptions and a bridge to later study.

# ENG — Engineering & Computer Science

## ENG-EP-01 — Computational thinking and problem specification

**Purpose:** Learn to turn an ambiguous task into a precise problem that can be reasoned about and eventually implemented.

**Core model:** A program solves a specified problem under stated inputs, constraints and expected outputs. Coding before clarifying the problem often produces a technically functioning answer to the wrong task.

**Concepts:** problem statement; stakeholder/user; input; output; constraints; assumptions; examples; edge cases; decomposition; acceptance criteria.

**Objectives:**
- Rewrite a vague request as a testable problem statement.
- Identify inputs, outputs, constraints and assumptions.
- Create normal, boundary and invalid examples.
- Break a problem into smaller operations with clear responsibilities.
- Define acceptance criteria before implementation.

**Worked example:** “Make a marks calculator” is underspecified. A usable specification asks: What marks are entered? Are they integers or decimals? What is the maximum? How are missing values handled? What output is required? For example: accept five subject scores from 0 to 100, reject out-of-range values, calculate the arithmetic mean, and display the result to one decimal place.

**Guided practice:** Specify a unit converter and a simple inventory total. For each, list inputs, valid ranges, outputs, assumptions and at least three edge cases.

**Independent practice:** Choose a small real task and write a one-page specification without writing code. Ask another person to identify ambiguity.

**Assessment:** Given a vague feature request, produce a specification with inputs, outputs, constraints, assumptions, examples and acceptance tests. Success requires another person to implement or test it without inventing major requirements.

**Misconceptions:** A problem statement is the same as a solution; edge cases are rare and can be ignored; requirements never change; more features automatically mean a better solution.

**Bridge:** Requirements engineering, algorithm design, testing and product discovery.

## ENG-EP-02 — Algorithms, decomposition and tracing

**Purpose:** Represent a solution as finite, ordered steps and reason about what those steps do before choosing a programming language.

**Core model:** An algorithm is a sufficiently precise procedure for transforming inputs into outputs. A trace follows the state of variables and decisions step by step for a particular input.

**Concepts:** sequence; selection; iteration; state; variable; condition; loop invariant intuition; pseudocode; flowchart; trace table; termination.

**Objectives:**
- Express a small procedure in clear pseudocode.
- Distinguish sequence, selection and iteration.
- Trace variable values through a short algorithm.
- Identify a condition that never changes and may cause a non-terminating loop.
- Test an algorithm with normal and boundary inputs.

**Worked example:** To find the largest of three values, initialise `largest` to the first value, compare the second and replace `largest` if necessary, then do the same with the third. The algorithm's correctness depends on preserving the meaning of `largest` after each comparison.

**Guided practice:** Trace a total accumulator, a countdown loop and a search through a short list. Record variable values after every iteration.

**Independent practice:** Write pseudocode for counting values above a threshold and for finding the first matching item in a list.

**Assessment:** Given an unfamiliar short algorithm, produce a correct trace table, predict output, identify a faulty condition and propose a minimal correction.

**Misconceptions:** An algorithm must be written in code; a loop always runs a fixed number of times; a variable's name guarantees its value; testing one input proves correctness.

**Bridge:** Programming fundamentals, data structures, algorithm analysis and formal reasoning.

## ENG-EP-03 — Programming fundamentals: data, expressions and control flow

**Purpose:** Build a language-independent model of how programs represent data and select operations.

**Core model:** Programs manipulate values according to defined types and operations. Control flow determines which instructions execute and how often. Different languages express these ideas with different syntax and runtime rules.

**Concepts:** literals; variables; assignment; numeric/string/Boolean types; expressions; operators; type conversion; conditionals; loops; input/output; scope introduction.

**Objectives:**
- Distinguish a value, variable, expression and assignment.
- Select appropriate data types for simple information.
- Predict the result of arithmetic, comparison and Boolean expressions.
- Write conditional logic for multiple cases.
- Use a loop with a clear stopping condition.
- Explain the difference between syntax errors, runtime errors and logic errors.

**Worked example:** A price calculator should represent a price as a numeric value, a quantity as an integer where appropriate, and a discount rate as a numeric proportion. Concatenating a number into text is not the same operation as adding two numbers; explicit conversion may be needed.

**Guided practice:** Implement a temperature converter, a simple grade-category classifier and a repeated input loop. Test ordinary, boundary and invalid inputs.

**Independent practice:** Build a small command-line program that accepts multiple records, validates them, calculates a result and prints a clear summary.

**Assessment:** Given a new specification, write a short program using variables, expressions, conditionals and loops; explain each decision and demonstrate tests. Success is defined by correctness, validation, readability and handling of stated edge cases—not by code length.

**Misconceptions:** A variable is a box that can contain any type in every language; `=` always means mathematical equality; a program that runs is correct; loops should be avoided because they are difficult.

**Bridge:** Functions, collections, data structures, testing and language-specific tracks (Python, JavaScript/TypeScript, C, SQL and shell).

## ENG-EP-04 — Functions, modularity and debugging

**Purpose:** Organise code into understandable units and diagnose faults systematically.

**Core model:** A function packages a responsibility behind an interface: inputs, behaviour and output or side effect. Modularity reduces the amount of code that must be understood at once. Debugging is evidence-driven fault localisation, not random editing.

**Concepts:** function definition/call; parameters; arguments; return values; local scope; decomposition; cohesion; coupling; reproducible bug; breakpoint/print tracing; minimal test case.

**Objectives:**
- Identify repeated logic that should become a function.
- Define parameters and return values that make responsibilities explicit.
- Distinguish local variables from values available elsewhere.
- Reproduce a bug and record expected versus actual behaviour.
- Reduce a failure to a minimal example.
- Change one likely cause at a time and rerun relevant tests.

**Worked example:** If three parts of a program independently calculate tax, a single `calculate_tax` function prevents inconsistent formulas. A good function name and contract make it clear what input it expects and what result it returns.

**Guided practice:** Refactor a repeated calculation into a function. Introduce a deliberate off-by-one bug into a harmless loop, reproduce it, trace the state and correct it.

**Independent practice:** Take a small procedural script and divide it into functions with clear names, parameters and return values. Add tests for normal and boundary cases.

**Assessment:** Given a small buggy program, provide a reproducible report, isolate the cause, make a minimal fix and demonstrate regression tests. Success requires explaining why the fix addresses the cause rather than merely showing that one example now works.

**Misconceptions:** Every few lines need a function; functions automatically make code good; debugging means changing things until output looks right; comments compensate for unclear structure.

**Bridge:** Software design, object-oriented and functional paradigms, automated testing, APIs and maintainable systems.

# BIZ — Business & Entrepreneurship

## BIZ-EP-01 — Problems, customers and value

**Purpose:** Understand business as creating and delivering value for a defined group, rather than merely selling an item or copying a competitor.

**Core model:** A viable offer addresses a problem or desired outcome for a particular customer segment. The customer must perceive enough value to justify the price, effort, risk and alternatives. A founder's enthusiasm is not evidence of demand.

**Concepts:** customer segment; job/problem; pain/gain; current alternatives; willingness to pay; value proposition; evidence versus assumption; ethical discovery.

**Objectives:**
- Describe a customer group specifically enough to study its needs.
- Distinguish a problem from a proposed solution.
- Identify current alternatives and the cost of doing nothing.
- Separate observed evidence from founder assumptions.
- Write a value proposition linking customer, problem, outcome and offer.

**Worked example:** “People need a website” is too broad. A narrower hypothesis might be: “Small local clinics need a reliable way to present services and receive appointment enquiries without managing a complex booking platform.” This can be tested through interviews and observation; it is not yet proven demand.

**Guided practice:** Select a low-risk problem in a familiar market. Interview or observe potential users with open questions. Avoid leading questions such as “Would you buy my great idea?”

**Independent practice:** Write three customer/problem hypotheses, list the evidence that supports each, and design the cheapest ethical test that could disconfirm them.

**Assessment:** Produce a one-page problem brief with segment, context, current workaround, consequence, evidence, assumptions and a falsifiable next test.

**Misconceptions:** Everyone is a customer; compliments equal demand; a competitor proves the market is attractive; the first proposed solution must be the right one.

**Bridge:** Market research, positioning, offer design, product discovery and sales.

## BIZ-EP-02 — Customer research and validation

**Purpose:** Collect useful evidence about customer behaviour and unmet needs without steering people toward the answer the founder wants.

**Core model:** Strong validation tests behaviour and costly commitments more reliably than hypothetical enthusiasm. Research quality depends on sampling, question wording, context and honest interpretation.

**Concepts:** interview guide; open question; leading question; observation; sample bias; stated vs revealed preference; prototype; landing-page test; conversion; falsification.

**Objectives:**
- Write neutral interview questions about past behaviour.
- Distinguish what people say from what they have actually done.
- Identify selection and confirmation bias in a small sample.
- Design a low-cost test with a measurable outcome.
- Define in advance what result would support, weaken or reject a hypothesis.

**Worked example:** Instead of asking “Would you pay 500 taka for this?”, ask what the customer currently spends, how often the problem occurs, what they tried, what failed and who approves spending. A small pilot or pre-order may provide stronger evidence than verbal approval, provided it is honest and obligations are clear.

**Guided practice:** Create a five-question interview guide, conduct a few consent-based conversations with appropriate participants, and record exact observations separately from interpretation.

**Independent practice:** Design a test for one offer. Specify target audience, sample limitations, metric, time window, success threshold and ethical safeguards.

**Assessment:** Present findings with raw observations, limitations, competing explanations and a decision. Success means the decision follows the evidence, including when the evidence says not to proceed.

**Misconceptions:** A small sample proves a whole market; friends are representative; survey intent predicts purchase; a failed test means the entire problem is imaginary.

**Bridge:** Market sizing, product strategy, pricing, distribution and experimentation.

## BIZ-EP-03 — Offers, pricing and unit economics

**Purpose:** Understand what is being sold, how price relates to cost and perceived value, and whether each transaction contributes sustainably.

**Core model:** Revenue is not profit. Unit economics examine the revenue and variable costs associated with one sale or service unit. A business can grow sales while losing money on every transaction.

**Concepts:** offer; scope; deliverable; price; fixed/variable cost; contribution margin; gross profit; payment fees; fulfilment time; refund/rework; break-even; cash timing.

**Objectives:**
- Define an offer with clear deliverables, exclusions and terms.
- Distinguish revenue, gross profit, contribution and net profit.
- Calculate contribution per unit using realistic variable costs.
- Estimate break-even volume under stated assumptions.
- Explain how refunds, rework, payment fees and time affect economics.

**Worked example:** If a digital item sells for 85 taka and acquisition cost is 60.50 taka, the gross difference is 24.50 taka before payment fees, refunds, support time, hosting and other costs. Calling all 24.50 taka “profit” would overstate the result.

**Guided practice:** Build a simple spreadsheet for one product with selling price, purchase cost, fees, expected refund allowance and variable labour/support cost. Label unknowns rather than inventing values.

**Independent practice:** Compare two offer structures with different prices and delivery effort. Calculate contribution and identify the assumptions most likely to change the result.

**Assessment:** Submit a one-page offer and unit-economics sheet with formulas, assumptions, break-even estimate and sensitivity check. Success requires correct arithmetic and clear distinction between known and estimated costs.

**Misconceptions:** Revenue equals profit; low price always wins; customer acquisition is free; founder time has no economic cost; break-even is a guaranteed forecast.

**Bridge:** Accounting, pricing strategy, cash-flow management, financial planning and growth.

## BIZ-EP-04 — Ethical sales and customer communication

**Purpose:** Explain an offer clearly, discover fit, handle questions honestly and agree next steps without manipulation.

**Core model:** Sales is a decision process between parties. Good sales communication clarifies needs, fit, price, risks, terms and next action. A sale that depends on deception or hidden conditions damages trust and creates operational risk.

**Concepts:** qualification; discovery; fit; demonstration; objection; evidence; scope; expectation management; consent; follow-up; customer support.

**Objectives:**
- Ask questions that establish the customer's actual need and constraints.
- Explain the offer, price, limitations and delivery process accurately.
- Distinguish a genuine objection from a misunderstanding or poor fit.
- Respond to uncertainty by checking facts rather than bluffing.
- Record agreed terms and next steps clearly.

**Worked example:** If a customer asks whether a website includes unlimited revisions, the seller should state the actual revision scope and price for additional work. Promising “unlimited” to close the sale creates an undefined obligation.

**Guided practice:** Role-play a customer enquiry, a price objection and a case where the offer is not suitable. Practise saying “I need to verify that” when an answer is unknown.

**Independent practice:** Draft a transparent product/service description, FAQ and post-sale handoff message.

**Assessment:** Conduct a role-play in which the customer has a real constraint. Success requires accurate representation, appropriate questions, clear terms and willingness to recommend no purchase when the offer is a poor fit.

**Misconceptions:** Persuasion means pressure; every objection must be defeated; hiding limitations improves conversion; a verbal agreement removes the need for clear records.

**Bridge:** Negotiation, account management, customer success, brand trust and business operations.
