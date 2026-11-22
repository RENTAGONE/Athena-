# ATHENA Mathematics — Teaching Pack, Batch 05: Patterns, Uncertainty, Data and Change

**Modules:** MATH-SEQ-007 to MATH-CALC-010 (supplementary functional-pathway IDs; not replacements for the 216 baseline IDs).  
**Status:** Substantive instructional draft; internal calculation and structure checks required; independent subject review and learner pilot pending.  
**Purpose:** Add coherent first-pass instruction in four major strands that were previously scope-mapped but materially under-taught: sequences/series, probability/combinatorics, statistics/data reasoning, and introductory calculus.

## How to use these units

Treat each unit as a learning assignment, not as a page to skim. Before study, check the prerequisites. Use any reliable teacher or resource to learn the material. Then close the source and complete the explanation, practice and transfer tasks. Submit working, not only answers, for evaluation. A correct answer without a defensible method is incomplete evidence; an error is useful only when its cause is identified and corrected.

---

# MATH-SEQ-007 — Sequences, recurrence and finite series

## Learning outcomes

By the end, the learner can distinguish a sequence from a series; identify arithmetic and geometric patterns; write explicit and recursive rules; calculate a term from either form; calculate finite arithmetic and geometric sums; and explain why pattern recognition from a few terms is a conjecture rather than proof of a unique rule.

## Prerequisites

Integer and fraction arithmetic, substitution into expressions, solving simple linear equations, exponent notation and function-like input/output thinking. If exponent laws are unfamiliar, learn them before geometric sequences.

## Core explanation

A **sequence** is an ordered list of terms. The index tells a term's position: a₁ is the first term, a₂ the second, and aₙ the nth. A **series** is a sum of sequence terms. For example, 2, 5, 8, 11 is a sequence; 2 + 5 + 8 + 11 is its four-term series.

An arithmetic sequence has a constant difference d between consecutive terms. Its explicit rule is aₙ = a₁ + (n − 1)d. The factor n − 1 appears because reaching term n from term 1 requires n − 1 jumps. A geometric sequence has a constant non-zero ratio r between consecutive terms; its explicit rule is aₙ = a₁rⁿ⁻¹. The ratio may be fractional or negative.

A recursive rule defines a term using an earlier term, such as a₁ = 4 and aₙ = aₙ₋₁ + 3. Recursive rules describe the generation process; explicit rules allow direct calculation of a distant term. Neither form is universally better.

For an arithmetic sequence, the sum of the first n terms is Sₙ = n(a₁ + aₙ)/2. This is the number of terms multiplied by the average of the first and last terms. For a geometric sequence with r ≠ 1, Sₙ = a₁(1 − rⁿ)/(1 − r). If r = 1, every term is a₁ and Sₙ = na₁. These are finite-sum formulas; infinite geometric series require a separate convergence condition.

A finite list never determines one unique continuation without an assumed rule or context. The pattern 2, 4, 8 could continue by doubling, but many other rules can fit those three terms. State the rule you are assuming.

## Worked example 1 — Arithmetic sequence

A sequence begins 7, 11, 15, 19, … . The common difference is 4. The 20th term is a₂₀ = 7 + (20 − 1)4 = 7 + 76 = 83. Check by recursive reasoning: term 1 to term 20 contains 19 increments, not 20.

## Worked example 2 — Arithmetic sum

Find the sum of the first 20 terms of that sequence. The last term is 83, so S₂₀ = 20(7 + 83)/2 = 10 × 90 = 900. The average term value is 45, and 20 × 45 = 900, providing an independent check.

## Worked example 3 — Geometric sequence

A culture begins with 5 cells and doubles each interval. If the initial count is term 1, the sequence is 5, 10, 20, 40, … and aₙ = 5 × 2ⁿ⁻¹. Term 8 is 5 × 2⁷ = 640. Be careful: if a problem instead says “after 8 doubling intervals”, that is 5 × 2⁸ = 1,280. Clarify whether the starting state is counted as term 1 or as time zero.

## Worked example 4 — Geometric finite sum

Find 3 + 6 + 12 + 24 + 48. Here a₁ = 3, r = 2, n = 5. S₅ = 3(1 − 2⁵)/(1 − 2) = 3(−31)/(−1) = 93. Direct addition also gives 93.

## Guided practice

1. For 12, 9, 6, 3, … identify a₁ and d, then calculate a₁₅.
2. A geometric sequence has a₁ = 81 and r = 1/3. Write its first five terms and calculate a₅.
3. Find the sum of the first 10 positive odd integers using an arithmetic-series method.
4. Explain why the list 1, 4, 9, 16 does not, by itself, prove that the next term must be 25.

**Guided answers:** (1) a₁ = 12, d = −3; a₁₅ = 12 + 14(−3) = −30. (2) 81, 27, 9, 3, 1; a₅ = 1. (3) Terms 1 to 19, n = 10; S₁₀ = 10(1 + 19)/2 = 100. (4) It suggests the square-number rule, but other rules can fit four values; the rule or context must be specified.

## Independent exercise set

1. An arithmetic sequence has a₄ = 17 and a₁₀ = 41. Find d, a₁ and a₂₅.
2. A geometric sequence starts at 160 and has ratio 1/2. Find a₆ and the sum of its first six terms.
3. A theatre has 18 seats in the first row and 2 more seats in each following row. Find the number of seats in row 15 and the total seats in the first 15 rows.
4. A video receives 200 views on day 1 and then 1.25 times the previous day's views each day. Write a model for day n and calculate the model's day-5 value. Explain why actual views need not follow it exactly.
5. Construct two different rules that both fit the first three terms 3, 6, 9 but predict different fourth terms. Explain what additional information would distinguish them.

**Answer guidance:** (1) a₁₀ − a₄ = 6d = 24, so d = 4; a₁ = 17 − 3(4) = 5; a₂₅ = 5 + 24(4) = 101. (2) a₆ = 160(1/2)⁵ = 5; S₆ = 160(1 − (1/2)⁶)/(1 − 1/2) = 315. (3) Row 15 = 18 + 14(2) = 46; total = 15(18 + 46)/2 = 480. (4) Vₙ = 200(1.25)ⁿ⁻¹; day 5 = 200(1.25)⁴ = 488.28125, so a practical count estimate is about 488; the constant growth ratio is an assumption and platform exposure/audience behaviour can change. (5) Examples: arithmetic +3 predicts 12; a rule matching 3,6,9 then adding 5 predicts 14. Many valid constructions exist.

## Common misconceptions and feedback

- **Using n increments instead of n − 1:** draw the term positions and count the gaps.
- **Confusing a sequence with a series:** terms are listed in a sequence; terms are added in a series.
- **Assuming every visible pattern has one forced continuation:** require the learner to state a rule and its evidence.
- **Applying the infinite geometric-series formula to a finite sum:** identify whether the problem asks for a fixed number of terms or an infinite limit.
- **Treating an exponential projection as a guarantee:** label the constant-ratio assumption and compare it with observed data.

## Assessment and mastery evidence

Give the learner an unfamiliar sequence, a contextual growth model and a finite-sum task. Require explicit and recursive representations, a worked term calculation, a sum calculation, and a written limitation of the model. Independent evidence requires correct indexing, correct formula selection, a check by an alternate method where feasible, and a clear statement of the assumed rule. Suggested rubric: 0 = no coherent model; 1 = recognises pattern but misuses index/formula; 2 = correct calculations with limited explanation; 3 = correct, justified and checked; 4 = transfers the model and critiques its assumptions.

## Transfer task

Model a savings plan in which a fixed amount is added monthly (arithmetic balance increase if no interest) and compare it with a balance that grows by a fixed percentage (geometric model). State whether deposits occur at the beginning or end of each period; do not confuse deposits with interest growth.

## Retention and next steps

Retrieve the explicit formulas after 1, 7 and 30 days using fresh values. Later connect sequences to recurrence relations, mathematical induction, algorithm analysis, compound growth and infinite-series convergence. This unit does not teach proof by induction or advanced convergence tests.

---

# MATH-PROB-008 — Counting principles and introductory probability

## Learning outcomes

The learner can define an experiment, outcome, sample space and event; calculate probabilities in equally likely finite sample spaces; use complements; apply the addition rule to mutually exclusive events; apply the multiplication rule to independent events; distinguish independence from mutual exclusivity; count ordered outcomes using the multiplication principle; and use permutations or combinations in simple cases.

## Prerequisites

Fractions, ratios, percentages, multiplication, sets and careful interpretation of “and”, “or”, “at least” and “exactly”. Probability is not a prediction that a particular outcome must occur.

## Core explanation

A random experiment has an outcome that is uncertain before it is performed. The **sample space** S is the set of possible outcomes. An **event** A is a subset of S. In a finite sample space where outcomes are equally likely, P(A) = number of outcomes in A divided by total number of outcomes. This formula is not valid merely because outcomes can be listed; equal likelihood must be justified.

Probability lies between 0 and 1. P(A) = 0 means impossible under the model; P(A) = 1 means certain under the model. The complement Aᶜ means “A does not happen”, so P(Aᶜ) = 1 − P(A).

For events A and B, P(A or B) = P(A) + P(B) − P(A and B). If they are mutually exclusive, they cannot occur together and the intersection probability is zero. For independent events, knowing that one occurred does not change the probability of the other; then P(A and B) = P(A)P(B). Independence and mutual exclusivity are different ideas: two events with non-zero probabilities cannot be both mutually exclusive and independent.

The multiplication principle counts a sequence of choices: if one stage has m possibilities and a second has n possibilities for each first-stage choice, there are mn ordered combinations. For choosing r objects from n distinct objects, order matters for permutations: n!/(n−r)!. If order does not matter, combinations are n!/[r!(n−r)!]. Factorial n! means n(n−1)…2×1, with 0! = 1.

## Worked example 1 — Equally likely outcomes

A fair six-sided die is rolled. The sample space is {1,2,3,4,5,6}. The event “roll an even number” is {2,4,6}, so P(even) = 3/6 = 1/2. This relies on the die being fair; a physically biased die may not have equally likely faces.

## Worked example 2 — Complement

The probability of rolling at least one 6 in one roll is 1/6. The probability of not rolling a 6 is 5/6. More generally, for repeated independent fair-die rolls, the probability of at least one 6 in four rolls is 1 − (5/6)⁴ ≈ 0.5177. It is often easier to calculate “none” and subtract from 1.

## Worked example 3 — Independent stages

A fair coin is tossed and a fair die is rolled. There are 2 × 6 = 12 equally likely ordered outcomes. The probability of heads and a number greater than 4 is (1/2)(2/6) = 1/6. The events are independent because the coin result does not alter the die's distribution.

## Worked example 4 — Permutation versus combination

From 5 learners, choose a president and a secretary. The roles differ, so order/assignment matters: 5 × 4 = 20 arrangements, or 5P2 = 20. If instead choosing a two-person committee with no distinct roles, there are 5C2 = 10 committees. The same two people in reversed order are a different office assignment but the same committee.

## Guided practice

1. A bag has 3 red and 2 blue tokens. One token is drawn uniformly. Find P(red), P(blue) and P(not red).
2. A fair coin is tossed twice. List the sample space and find P(exactly one head).
3. A code contains one letter from {A,B,C} followed by one digit from {0,1,2,3}. How many codes are possible if repetition is allowed?
4. From 6 books, how many ways can 2 be selected if order does not matter?

**Guided answers:** (1) 3/5, 2/5, 2/5. (2) {HH, HT, TH, TT}; exactly one head is {HT,TH}, so 2/4 = 1/2. (3) 3×4 = 12. (4) 6C2 = 15.

## Independent exercise set

1. A fair die is rolled. Find the probability of a result greater than 4 and the probability of a result that is not greater than 4. Check that the two probabilities sum to 1.
2. Two fair coins are tossed. Find P(at least one tail) using a complement.
3. A meal is selected by choosing 1 of 4 mains and 1 of 3 drinks. How many meal combinations exist? What changes if one main is unavailable?
4. In a class of 20, 12 study science club material, 9 study coding, and 5 study both. Find the number studying at least one and the number studying neither.
5. A team of 3 is selected from 8 people. How many teams are possible? How many ordered gold/silver/bronze podiums can be formed from the same 8 people?
6. Explain why “drawing a red token” and “drawing a blue token” on one draw from a bag containing only red and blue tokens are mutually exclusive, but not independent when both colours are possible.

**Answer guidance:** (1) Greater than 4: 2/6 = 1/3; not greater than 4: 4/6 = 2/3; sum 1. (2) Complement is no tails = HH, probability 1/4; therefore 3/4. (3) 12; with one main unavailable, 3×3 = 9. (4) Union = 12 + 9 − 5 = 16; neither = 20 − 16 = 4. (5) Teams = 8C3 = 56; podiums = 8×7×6 = 336. (6) They cannot happen together on one draw, but knowing red occurred makes blue impossible; this dependence violates independence.

## Common misconceptions and feedback

- **Assuming every outcome is equally likely:** inspect the experiment and physical mechanism.
- **Confusing “or” with “and”:** “or” uses a union; “and” uses an intersection.
- **Adding probabilities without subtracting overlap:** draw a Venn diagram or identify the intersection.
- **Calling mutually exclusive events independent:** test whether learning one event occurred changes the probability of the other.
- **Ignoring order in role assignments:** name the positions or ask whether swapped selections count as different outcomes.
- **Treating probability as certainty over a small number of trials:** expected long-run behaviour does not dictate the next result.

## Assessment and mastery evidence

Assess sample-space construction, a complement, a union with overlap, independent joint probability, and a counting problem where the learner must justify whether order matters. Independent evidence requires a stated model, correct event definitions, valid probability calculations and an explanation of assumptions. Suggested rubric: 0 = event/sample space unclear; 1 = uses formula without valid model; 2 = mostly correct with one conceptual confusion; 3 = correct and justified; 4 = detects invalid equal-likelihood or independence assumptions.

## Transfer task

Evaluate the chance of receiving a particular game item under a clearly stated drop-rate model. Calculate the chance of at least one success over a fixed number of independent attempts, then explain why the model does not guarantee a drop and what could invalidate the independence assumption (pity systems, changing rates, server-side rules).

## Retention and next steps

Use short retrieval problems after 1, 7 and 30 days, varying the story while preserving the probability structure. Next topics: conditional probability, Bayes' rule, random variables, expectation, distributions and simulation. These are not fully taught here.

---

# MATH-STAT-009 — Descriptive statistics, sampling and responsible data claims

## Learning outcomes

The learner can distinguish categorical and numerical data; distinguish a population from a sample; calculate and interpret mean, median, mode, range and interquartile range; read basic distributions; identify outliers and sampling bias; interpret simple association; and explain why correlation alone does not establish causation.

## Prerequisites

Fractions, decimals, percentages, ordering numbers, basic graphs and arithmetic. A spreadsheet or calculator may be used after the learner can explain the calculation.

## Core explanation

Statistics is the discipline of learning from data while accounting for variation and uncertainty. A **population** is the full group of interest; a **sample** is the subset actually observed. A statistic calculated from a sample is used to describe that sample and may estimate a population feature, but sampling error and bias remain possible.

Data can be categorical (labels or groups) or numerical. Numerical data may be discrete counts or continuous measurements. The measurement scale and collection method determine which summaries are meaningful. For example, the mean of jersey numbers is not useful because jersey numbers are labels, not measured quantities.

The **mean** is the sum divided by the number of observations and is sensitive to extreme values. The **median** is the middle ordered value (or average of the two middle values) and is more resistant to extreme values. The **mode** is the most frequent value or category; a dataset may have multiple modes or none that is informative. The **range** is maximum minus minimum. Quartiles divide ordered data into portions; the interquartile range (IQR) is Q3 − Q1 and describes the spread of the middle half. Different conventions exist for quartiles in small datasets, so state the convention used.

A distribution is not described by its centre alone. Look at shape, spread, clusters, gaps and possible outliers. A box plot summarises median, quartiles and a chosen whisker convention; it does not show every data point. A histogram shows numerical distribution by bins; changing bin width can change the visible pattern.

A sample can be large and still biased. A voluntary online poll may overrepresent people who are motivated to respond. A convenience sample may exclude less accessible groups. Random selection helps reduce selection bias when implemented properly, but non-response, measurement error and poor question wording can still distort results.

Correlation describes association, not cause. A relationship may arise because A influences B, B influences A, a third variable influences both, selection effects create the pattern, or coincidence occurs. Causal claims require a design and assumptions beyond a correlation coefficient.

## Worked example 1 — Mean and median with an outlier

Consider weekly study hours: 2, 3, 3, 4, 8. The mean is (2+3+3+4+8)/5 = 20/5 = 4 hours. The median is 3 hours. If the final value were 28 instead of 8, the mean would become 40/5 = 8, while the median would remain 3. This illustrates why the median can better represent a typical value in a strongly skewed set.

## Worked example 2 — Range and IQR

For 2, 3, 3, 4, 8, the range is 8 − 2 = 6. Using the median-of-halves convention that excludes the overall median for an odd-sized list, the lower half is 2,3 and Q1 = 2.5; the upper half is 4,8 and Q3 = 6. Therefore IQR = 6 − 2.5 = 3.5. Another quartile convention may give different quartiles; the method must be reported.

## Worked example 3 — Sampling bias

A school wants to estimate the average daily travel time of all students. It asks only students who arrive by bus. The sample excludes walkers, cyclists and students using other transport. Even a very large bus-only sample cannot represent the whole school without additional assumptions or a redesigned sampling plan.

## Worked example 4 — Association is not causation

Ice-cream sales and swimming incidents may both rise during hot weather. It would be invalid to conclude from their correlation alone that ice-cream causes swimming incidents. Temperature and time spent near water are plausible confounders. A responsible report describes the association and discusses alternative explanations.

## Guided practice

1. Find the mean and median of 4, 5, 5, 6, 10.
2. Find the range. Using the median-of-halves convention, find Q1, Q3 and IQR.
3. A survey link is posted in a competitive gaming group to estimate all teenagers' daily screen time. Identify one likely source of bias.
4. A dataset contains favourite colours. Explain why its arithmetic mean is meaningless.

**Guided answers:** (1) Mean = 30/5 = 6; median = 5. (2) Range = 10−4 = 6; lower half 4,5 gives Q1=4.5; upper half 6,10 gives Q3=8; IQR=3.5. (3) Coverage/selection bias: members of that group may differ from teenagers generally. (4) Colour labels have no numerical magnitude or meaningful arithmetic ordering.

## Independent exercise set

1. For 6, 7, 7, 8, 12, calculate mean, median, mode and range.
2. Replace 12 with 42. Which measures change, and which are resistant to this change? Explain.
3. A researcher surveys the first 30 people leaving a gym to estimate the exercise habits of an entire city. Identify the target population, sample and at least two limitations.
4. A chart begins its vertical axis at 95 and shows values 96, 97 and 98. Explain how this may exaggerate visual differences.
5. A report says students who sleep more tend to have higher test scores, therefore sleep alone causes higher scores. Give two alternative explanations or confounders and rewrite the claim responsibly.
6. Two classes have the same mean score. Give two ways their distributions could still differ.

**Answer guidance:** (1) Mean 40/5 = 8; median 7; mode 7; range 6. (2) Mean rises to 14; median becomes 7; mode remains 7; range rises to 36. Median and mode are unchanged here; mean and range are sensitive. (3) Target population is city residents (or the intended city population); sample is the 30 gym-exit respondents; gym users are not representative, time/location may bias the sample, and sample size is small. (4) Truncation magnifies small absolute differences; show a zero baseline or clearly disclose the axis and use a suitable scale. (5) Possible confounders include prior achievement, health, stress, study time, socioeconomic conditions; say the variables are associated in the observed data, not that sleep alone caused the scores. (6) Different spread, skew, outliers, clusters, modes or proportions above a threshold.

## Common misconceptions and feedback

- **Using the mean for every kind of data:** inspect measurement scale and distribution.
- **Assuming median and mean are interchangeable:** compare sensitivity to extreme values and skew.
- **Treating a large sample as automatically representative:** inspect how participants entered the sample.
- **Removing an outlier merely because it is inconvenient:** investigate data quality and context; report decisions transparently.
- **Reading a graph without checking axes and units:** state what one unit represents and inspect scale breaks/truncation.
- **Claiming causation from correlation:** identify confounders and study design limitations.

## Assessment and mastery evidence

Provide a small raw dataset, a chart and a short survey-method description. The learner must select suitable summaries, calculate centre/spread, critique sampling, identify a misleading visual feature and rewrite a causal overclaim. Independent evidence requires correct calculations, method transparency and a limitation-aware interpretation. Suggested rubric: 0 = calculations/claims unsupported; 1 = summaries without interpretation; 2 = mostly correct but misses bias or causal limits; 3 = correct and responsible; 4 = proposes a better sampling/measurement design and justifies it.

## Transfer task

Design a fair survey to estimate how much time students spend on self-directed learning in a typical week. Define the population, sampling frame, sampling method, question wording, response format, likely non-response and privacy safeguards. Explain how the resulting statistic should and should not be interpreted.

## Retention and next steps

Retrieve summary calculations with new datasets after 1, 7 and 30 days. Next topics: probability distributions, expected value, sampling distributions, confidence intervals, hypothesis testing, regression and causal inference. Those inferential topics are not fully covered by this descriptive unit.

---

# MATH-CALC-010 — Calculus foundations: rates of change and accumulation

## Learning outcomes

The learner can explain average rate of change as a ratio of changes; interpret a derivative as an instantaneous rate/slope; estimate a derivative from nearby values or a graph; differentiate simple power functions and sums using basic rules; interpret a definite integral as signed accumulation/area; estimate area numerically; and connect differentiation and integration through the fundamental theorem at an introductory level.

## Prerequisites

Algebraic manipulation, functions and graphs, coordinate slope, fractions, exponents and basic trigonometric familiarity for later extensions. A learner who cannot interpret a function or calculate a line's slope should strengthen those prerequisites first.

## Core explanation

Calculus studies continuous change and accumulation. If y = f(x), the **average rate of change** from x=a to x=b is [f(b)−f(a)]/(b−a). Geometrically, this is the slope of the secant line joining the two graph points. It describes the average change in output per unit change in input across an interval.

The **derivative** f′(a) is the limiting value of these average rates as the interval shrinks toward a. Geometrically it is the tangent slope, when the derivative exists. In a physical context, if position is measured in metres and time in seconds, the derivative of position with respect to time has units metres per second and represents instantaneous velocity. A derivative is not simply “the slope at any nearby point”; it is defined by a limit.

For introductory polynomial work, the power rule is d/dx(xⁿ) = nxⁿ⁻¹ for real exponents where the function is defined and differentiable. A constant differentiates to zero; a constant multiple can be taken outside; derivatives of sums are sums of derivatives. Thus for f(x)=3x²−5x+4, f′(x)=6x−5. The derivative gives a new function: evaluate it at a particular x to obtain the instantaneous rate there.

A definite integral accumulates a quantity across an interval. For a non-negative function, it can be interpreted as area under the curve; more generally it is signed area, with regions below the axis contributing negatively. In a context, units multiply: integrating a rate in metres/second over seconds gives metres.

The definite integral can be approximated by rectangles (Riemann sums). Narrower rectangles often improve the approximation for well-behaved functions, but the direction and size of error depend on the function and rectangle choice. The fundamental theorem of calculus links accumulation and antiderivatives: if F′=f, then the definite integral from a to b of f(x) dx equals F(b)−F(a), under the theorem's conditions.

## Worked example 1 — Average rate of change

Let f(x)=x². From x=2 to x=5, the average rate is [25−4]/[5−2] = 21/3 = 7. This is the slope of the secant line across the interval, not the derivative at every point in that interval.

## Worked example 2 — Derivative from the power rule

For f(x)=x², f′(x)=2x. At x=3, the instantaneous rate is 6. Compare this with the average rate from x=3 to x=3.1: [(3.1)²−9]/0.1 = (9.61−9)/0.1 = 6.1. As the second point approaches 3, the average rate approaches 6.

## Worked example 3 — Differentiate a polynomial

For g(x)=4x³−2x²+7x−9, apply the power rule term by term: g′(x)=12x²−4x+7. The constant −9 becomes zero. At x=1, g′(1)=12−4+7=15. The derivative's units are output-units per input-unit, not the same units as g itself.

## Worked example 4 — Accumulation with a constant rate

A tank fills at 3 litres per minute for 8 minutes. Accumulated volume is 3 × 8 = 24 litres. In integral notation, the accumulation is the integral from 0 to 8 of 3 dt = [3t] from 0 to 8 = 24. This simple case connects area under a constant rate graph to total change.

## Worked example 5 — Signed area

For f(x)=x on the interval [−1,1], the triangular area below the x-axis from −1 to 0 is −1/2 and the area above from 0 to 1 is +1/2. The definite integral is zero, even though the geometric area between the graph and axis is 1. Distinguish signed integral from total geometric area.

## Guided practice

1. For f(x)=3x+2, calculate the average rate of change from x=1 to x=4.
2. Differentiate h(x)=5x⁴−3x²+8 and evaluate h′(2).
3. A vehicle's position is s(t)=t² metres. Find its average velocity from t=2 to t=4 and its instantaneous velocity at t=3.
4. A machine outputs 4 units per second for 6 seconds. Express and calculate the accumulated output as an integral.

**Guided answers:** (1) Linear slope is 3; directly [14−5]/3 = 3. (2) h′(x)=20x³−6x; h′(2)=160−12=148. (3) Average = (16−4)/2 = 6 m/s; s′(t)=2t, so at t=3 it is 6 m/s. (4) Integral from 0 to 6 of 4 dt = 24 units.

## Independent exercise set

1. For f(x)=x²+2x, find the average rate of change from x=1 to x=3.
2. Differentiate p(x)=2x⁵−4x³+x−6.
3. Evaluate p′(1) for the function in question 2.
4. A position function is s(t)=t³ metres. Find the instantaneous velocity function and its value at t=2 seconds. State the units.
5. Estimate the area under y=2x on [0,4] using two equal-width rectangles with left endpoints. Then calculate the exact integral and compare.
6. Explain why the integral of a function that is partly below the x-axis may be smaller than the total geometric area between the curve and the axis.
7. A learner says “the derivative is the area under the graph.” Correct the statement by distinguishing derivative and integral.

**Answer guidance:** (1) f(1)=3, f(3)=15; average rate = (15−3)/2 = 6. (2) p′(x)=10x⁴−12x²+1. (3) 10−12+1 = −1. (4) v(t)=s′(t)=3t² m/s; v(2)=12 m/s. (5) Width 2; left heights y(0)=0 and y(2)=4; estimate = 2(0+4)=8 square units. Exact integral = [x²]₀⁴ = 16; left sum underestimates because y=2x is increasing. (6) Signed area below the axis is negative and subtracts from area above; total geometric area counts both magnitudes positively. (7) Derivative measures local rate/slope; integral measures accumulated signed quantity/area under appropriate interpretation.

## Common misconceptions and feedback

- **Confusing average and instantaneous rate:** average uses two points; derivative is a limit of secant slopes.
- **Differentiating a constant as itself:** a constant has zero rate of change.
- **Forgetting to reduce the exponent:** apply nxⁿ⁻¹, not nxⁿ.
- **Dropping units:** derivatives and integrals have derived units that should match the context.
- **Equating definite integral with total geometric area:** account for signed regions below the axis.
- **Assuming every function is differentiable everywhere:** corners, jumps, cusps and vertical tangents require care; continuity alone does not guarantee differentiability.

## Assessment and mastery evidence

Require one average-rate problem, one derivative calculation, one contextual interpretation with units, one numerical accumulation estimate and one signed-area explanation. Independent evidence requires correct symbolic rules, clear distinction between rates and totals, and appropriate units. Suggested rubric: 0 = no meaningful interpretation; 1 = rule memorised but misapplied; 2 = calculations mostly correct but concepts/units unclear; 3 = correct, interpreted and checked; 4 = explains limiting or accumulation meaning and critiques approximation assumptions.

## Transfer task

Choose a real process with a rate and accumulated total: water flow, distance/speed, download rate/data transferred, or revenue rate/revenue accumulated. Define the variables and units, create a simple rate function, estimate total accumulation over an interval, and explain what information a derivative and an integral each provide. Do not claim a model is realistic without checking its assumptions.

## Retention and next steps

Retrieve the distinction between secant slope, tangent slope and signed accumulation after 1, 7 and 30 days. Next topics: limit definitions and continuity; product, quotient and chain rules; implicit differentiation; optimisation and related rates; substitution and integration by parts; differential equations; multivariable calculus. This unit is an introductory bridge, not a complete calculus course.

---

## Batch-level implementation notes

- These four units deepen MAT-06 through MAT-09 but do not complete those strands. Probability's conditional/Bayes topics, inferential statistics, advanced sequence convergence and the broader calculus scope remain open.
- Stable unit IDs are supplementary content IDs. The canonical 216-module baseline IDs must not be silently replaced or renumbered.
- Every unit includes outcomes, prerequisites, explanations, worked examples, guided practice with answers, independent practice with answer guidance, misconceptions, assessment criteria, transfer and retention/next steps.
- Review status is draft. Internal arithmetic checks do not establish external subject approval, psychometric validity or learner usability.
