# ATHENA Mathematics — Teaching Pack, Batch 06: Probability, Statistical Inference and Data Modelling

**Modules:** MATH-PROB-011 to MATH-STAT-014 (supplementary functional-pathway IDs; preserve all existing baseline IDs).
**Status:** Substantive instructional draft; internal calculation and structural checks required; independent subject review and learner pilot pending.
**Purpose:** Extend introductory probability and descriptive statistics into combinatorics, conditional probability, random variables, sampling, uncertainty, inference and critical interpretation of data.

## Learning workflow

Use each unit as an assignment specification. Study from a reliable teacher, textbook or course; then close the source and solve the problems independently. Submit reasoning, assumptions, units and checks. An answer alone is not sufficient evidence of understanding. The learner should be able to explain why a method applies and when it would fail.

---

# MATH-PROB-011 — Counting principles, permutations and combinations

## Learning outcomes
Distinguish addition and multiplication counting principles; count ordered arrangements and unordered selections; use factorial notation; identify overcounting; solve simple arrangements with repeated restrictions; and justify whether order matters.

## Prerequisites
Whole-number operations, multiplication, fractions, basic set language and the idea of a finite outcome space.

## Core explanation
A counting problem asks how many outcomes satisfy a description. The **addition principle** applies to mutually exclusive alternatives: if a choice can be made in one of two disjoint ways with m and n possibilities, there are m+n possibilities. The **multiplication principle** applies to successive choices: if stage one has m options and each is followed by n options, there are mn combined choices. If the number of later choices depends on the earlier choice, count each branch separately or use a tree.

A factorial is n! = n(n−1)…2·1, with 0! = 1. It counts the orderings of n distinct objects. A permutation selects and arranges r objects from n: P(n,r)=n!/(n−r)!. A combination selects r objects without assigning order: C(n,r)=n!/[r!(n−r)!]. The division by r! removes the multiple orderings of the same selected group.

The decision question is not “which formula looks familiar?” It is: **does changing the order create a different outcome?** A three-person committee is an unordered selection; first, second and third place in a race is ordered. If objects repeat or restrictions apply, the basic formulas may overcount and the model must be adjusted.

## Worked example 1 — Multiplication principle
A code has two letters followed by three digits. Repetition is allowed. There are 26 choices for each letter and 10 for each digit, so the total is 26²×10³ = 676,000. If repetition is forbidden, the count changes: 26×25×10×9×8 = 468,000. State the repetition rule before calculating.

## Worked example 2 — Permutation
Eight runners compete for gold, silver and bronze. The positions are ordered, so P(8,3)=8×7×6=336 possible podiums. The same three runners in a different order form a different outcome.

## Worked example 3 — Combination
A club selects a four-person committee from ten members. Order does not matter, so C(10,4)=10!/(4!6!)=(10×9×8×7)/(4×3×2×1)=210 committees.

## Worked example 4 — Avoiding overcount
A group of 3 is selected from 7 people. Counting ordered triples gives 7×6×5=210. Each group is counted 3!=6 times, once for each ordering. Dividing gives 210/6=35 = C(7,3).

## Guided practice
1. A meal has 3 starters, 4 mains and 2 drinks. How many complete meals are possible if one is chosen from each category?
2. How many four-digit PINs exist if digits may repeat? How many if no digit repeats?
3. From 9 students, how many ways can a captain and vice-captain be chosen?
4. From the same 9 students, how many three-person teams can be chosen?
5. Explain why the answers to questions 3 and 4 use different counting models.

**Guided answers:** (1) 3×4×2=24. (2) 10⁴=10,000; without repetition 10×9×8×7=5,040. (3) 9×8=72, because roles differ. (4) C(9,3)=84. (5) Roles create distinct ordered assignments; a team has no internal ranking.

## Independent practice
1. A password consists of one uppercase letter, then two distinct digits, then one of 5 symbols. Repetition is prohibited only between the two digits. Count passwords.
2. A class of 12 chooses 5 representatives. How many groups are possible?
3. In a race with 10 competitors and no ties, how many possible first-, second- and third-place results exist?
4. A shelf holds 6 distinct books. How many arrangements are possible? How many if two specified books must be adjacent? (Treat the adjacent pair as one block, with two internal orders.)
5. A team of 4 is chosen from 6 girls and 5 boys. How many teams contain exactly 2 girls and 2 boys?
6. Create a counting question where addition is appropriate and one where multiplication is appropriate. Explain why the cases are disjoint or sequential.

**Answer guidance:** (1) 26×10×9×5=11,700. (2) C(12,5)=792. (3) 10×9×8=720. (4) 6!=720; adjacent pair as a block gives 5!×2=240. (5) C(6,2)C(5,2)=15×10=150. (6) Accept any valid examples with a correct model explanation.

## Misconceptions and correction
- **Using permutations for committees:** ask whether swapping selected members changes the outcome.
- **Using combinations for ranked positions:** identify the distinct roles or slots.
- **Ignoring repetition rules:** write the number of choices at each stage before multiplying.
- **Adding overlapping cases:** ensure categories are mutually exclusive or subtract overlap.
- **Applying n! to repeated objects:** explain that identical objects do not create distinguishable arrangements.

## Assessment and mastery evidence
Require one sequential-choice count, one permutation, one combination and one restricted count. The learner must state whether order matters, show the count at each stage, and explain any division used to remove overcounting. Rubric: 0 no viable model; 1 selects a formula by appearance; 2 correct routine calculations; 3 chooses and justifies models; 4 handles restrictions and audits overcounting.

## Transfer task
Design a fair prize-draw procedure for a school event. Calculate the number of possible outcomes under at least two rules (e.g. winners can or cannot win twice). Explain which rule is appropriate and why.

## Retention
Re-solve one ordered and one unordered problem after 1, 7 and 30 days with changed numbers. Later connect counting to binomial probability, combinatorial proofs, algorithms and complexity.

---

# MATH-PROB-012 — Conditional probability, independence and Bayes' rule

## Learning outcomes
Define conditional probability; calculate probabilities from two-way tables and tree diagrams; distinguish mutually exclusive events from independent events; use the multiplication rule; apply Bayes' rule in a simple diagnostic context; and explain base-rate effects.

## Prerequisites
Fractions, ratios, percentages, sample spaces, event notation and basic probability P(A)=favourable outcomes/total equally likely outcomes.

## Core explanation
A conditional probability asks for the probability of A **given that** B has occurred. It is written P(A|B) and, when P(B)>0, equals P(A∩B)/P(B). The denominator is the restricted reference group: once B is known, outcomes outside B are no longer in the relevant sample space.

Events A and B are **independent** when learning that one occurred does not change the probability of the other. Equivalent tests include P(A|B)=P(A), when defined, or P(A∩B)=P(A)P(B). Events are **mutually exclusive** when they cannot occur together, so P(A∩B)=0. Two events with positive probabilities that are mutually exclusive are not independent: occurrence of one makes the other impossible.

The multiplication rule is P(A∩B)=P(A)P(B|A). A tree diagram labels each branch with a conditional probability; multiply along a path and add probabilities for disjoint paths. A two-way table can reveal the correct denominator and prevent the common error of reversing P(A|B) and P(B|A).

Bayes' rule reverses a conditional probability:
P(A|B)=P(B|A)P(A)/P(B).
It is useful when a test result is known but the underlying condition is uncertain. The prior probability P(A), also called the base rate, matters. A test can be fairly accurate and still produce many false positives when the condition is rare.

## Worked example 1 — Conditional probability from a table
In a group of 100 learners, 40 study mathematics daily; 30 study science daily; 18 do both. Let M = studies mathematics daily and S = studies science daily. P(M|S)=18/30=0.60. P(S|M)=18/40=0.45. These differ because the reference groups differ.

## Worked example 2 — Independence
Using the same table, P(M)=40/100=0.40 and P(M|S)=0.60. Since 0.60≠0.40, M and S are not independent. Equivalently, P(M∩S)=0.18 while P(M)P(S)=0.40×0.30=0.12.

## Worked example 3 — Two-stage tree
A bag contains 3 red and 2 blue counters. Two counters are drawn without replacement. Probability of red then blue is (3/5)(2/4)=6/20=0.30. Probability of blue then red is (2/5)(3/4)=6/20=0.30. Probability of one of each colour is 0.60. Without replacement, the second branch probability changes after the first draw.

## Worked example 4 — Bayes and base rates
Suppose 1% of a population has a condition. A screening test is positive for 90% of people with the condition (sensitivity 0.90) and positive for 5% of people without it (false-positive rate 0.05). In 10,000 people, about 100 have the condition; 90 of them test positive. Of 9,900 without it, 495 test positive. Thus 585 positive tests occur, of which 90 are true positives. The probability of having the condition given a positive result is 90/585 ≈ 0.1538, or 15.4%, not 90%. This is a mathematical illustration, not medical advice.

## Guided practice
1. Of 50 learners, 20 play football and 12 play both football and chess. If 15 play chess, find P(football|chess).
2. If P(A)=0.3, P(B)=0.4 and A and B are independent, find P(A∩B).
3. A fair coin is tossed twice. Are “first toss is heads” and “second toss is heads” independent? Explain.
4. A bag has 4 green and 1 yellow ball. Two are drawn without replacement. Find P(green then yellow).
5. Explain why mutually exclusive events with nonzero probabilities cannot be independent.

**Guided answers:** (1) 12/15=0.8. (2) 0.3×0.4=0.12. (3) Yes; the second toss distribution is unchanged by the first. (4) (4/5)(1/4)=1/5. (5) If A occurs, B becomes impossible, so P(B|A)=0, not P(B)>0.

## Independent practice
1. In a survey of 200 people, 120 use public transport, 90 cycle and 50 do both. Find P(cycle|public transport), P(public transport|cycle), and determine whether the events are independent.
2. A box contains 5 white and 3 black beads. Two are drawn without replacement. Find the probability both are white, both black, and one of each.
3. A factory's machine A makes 60% of items with a 2% defect rate; machine B makes 40% with a 5% defect rate. Find the overall defect probability and the probability a defective item came from B.
4. A disease affects 2% of a population. A test has 95% sensitivity and 90% specificity. In a population of 10,000, calculate expected true positives, false positives and P(disease|positive).
5. Give an example of mutually exclusive events and a separate example of independent events. Explain why the terms are not synonyms.
6. A weather app says the chance of rain is 30%. Explain why “rain” and “the app predicts rain” are not automatically independent or mutually exclusive; specify what additional probability model would be needed.

**Answer guidance:** (1) 50/120=5/12≈0.4167; 50/90=5/9≈0.5556; P(T)=0.6, P(C)=0.45, product=0.27 while intersection=0.25, so not independent. (2) WW=(5/8)(4/7)=5/14; BB=(3/8)(2/7)=3/28; one each=(5/8)(3/7)+(3/8)(5/7)=15/28. (3) P(D)=0.6(0.02)+0.4(0.05)=0.032; P(B|D)=0.4(0.05)/0.032=0.625. (4) 200 have disease; 190 true positives. 9,800 do not; 980 false positives because specificity is 90%. Positive total 1,170; posterior 190/1,170≈16.24%. (5) Any valid pair with correct definitions. (6) Requires joint frequencies/calibration across many forecasts and outcomes; marginal rain chance alone is insufficient.

## Misconceptions and correction
- **Reversing conditional probabilities:** mark the denominator group in a table before calculating.
- **Assuming independence from different labels:** test the product rule or compare conditional and marginal probabilities.
- **Confusing without replacement with independent draws:** update the sample space after each draw.
- **Ignoring base rates:** use natural frequencies in a population of 1,000 or 10,000 before using formulas.
- **Treating a forecast probability as a guarantee:** probability describes uncertainty across comparable cases, not certainty in one event.

## Assessment and mastery evidence
Learner must solve a table problem, a without-replacement tree, an independence test and a base-rate diagnostic. Full evidence includes correct denominators, clear event definitions, conditional reasoning and a check that probabilities lie between 0 and 1 and sum correctly across exhaustive outcomes.

## Transfer task
Evaluate a fictional screening test using a stated prevalence, sensitivity and specificity. Explain why test accuracy cannot be communicated responsibly without the base rate and why real decisions require qualified domain guidance.

## Retention
Retrieve the distinction between P(A|B) and P(B|A), and between independence and mutual exclusivity, after 1, 7 and 30 days. Later connect to statistical learning, risk analysis, reliability and decision theory.

---

# MATH-STAT-013 — Distributions, variability and standardisation

## Learning outcomes
Distinguish population and sample; calculate and interpret mean, median, mode, range, interquartile range and standard deviation; compare distributions using centre and spread; recognise skew and outliers; interpret z-scores; and choose summaries appropriate to data shape.

## Prerequisites
Fractions, decimals, percentages, ordering values, arithmetic mean and reading simple graphs.

## Core explanation
A **distribution** describes how values occur: its centre, spread, shape and unusual observations. The mean is the sum divided by the number of observations; it uses every value but is sensitive to extreme values. The median is the middle ordered value (or the average of the two middle values); it is resistant to extremes. The mode is the most frequent value and can be absent or multiple. The range is maximum minus minimum.

Quartiles divide ordered data into approximate quarters. The interquartile range (IQR)=Q3−Q1 describes the spread of the middle half and is resistant to extreme values. Different software and textbooks use slightly different quartile conventions for small datasets; state the convention used. A common outlier flag is below Q1−1.5×IQR or above Q3+1.5×IQR. This is a screening rule, not proof that a value is erroneous.

Variance measures average squared distance from the mean. For a full population, σ²=Σ(x−μ)²/N; population standard deviation σ is its square root. For a sample used to estimate population variance, the common unbiased variance estimator is s²=Σ(x−x̄)²/(n−1), with sample standard deviation s. The n−1 adjustment is Bessel's correction. Always identify which formula and dataset role are intended.

A z-score standardises a value relative to a distribution: z=(x−μ)/σ for a population, or often (x−x̄)/s for a sample description. A z-score of +2 means two standard deviations above the mean. It does not by itself give a percentile unless a distributional model, such as normality, is justified.

## Worked example 1 — Centre and outlier sensitivity
Data: 2, 3, 3, 4, 8. Mean=(20/5)=4; median=3; mode=3; range=8−2=6. If the last value becomes 80, the mean becomes 18.4, but the median remains 3. The median better represents a typical observation in this strongly right-skewed example.

## Worked example 2 — IQR and an outlier flag
Data: 2, 3, 4, 5, 6, 7, 8, 30. Using the median-of-halves convention, lower half 2,3,4,5 gives Q1=(3+4)/2=3.5; upper half 6,7,8,30 gives Q3=(7+8)/2=7.5. IQR=4. Upper fence=7.5+1.5(4)=13.5. Value 30 is flagged for investigation. It should not be deleted automatically.

## Worked example 3 — Population standard deviation
For population data 2, 4, 6, the mean is 4. Squared deviations are 4, 0, 4; population variance=(8/3)≈2.667; population standard deviation=√(8/3)≈1.633. If these are a sample, sample variance is 8/(3−1)=4 and sample standard deviation is 2. The distinction matters.

## Worked example 4 — Standardised comparison
Learner A scores 80 in a test with mean 70 and standard deviation 5: zA=(80−70)/5=2. Learner B scores 90 in a different test with mean 80 and standard deviation 10: zB=(90−80)/10=1. A is further above the reference mean in standard-deviation units, although comparing z-scores assumes the tests measure comparable constructs and the reference distributions are suitable.

## Guided practice
1. Find mean, median and range for 4, 5, 5, 6, 10.
2. Which is more resistant to an extreme high value: mean or median? Why?
3. If Q1=12 and Q3=20, find IQR and the upper 1.5-IQR fence.
4. A value is 72, the mean is 60 and standard deviation is 6. Find its z-score.
5. Explain why a z-score does not automatically mean a percentile.

**Guided answers:** (1) Mean 6, median 5, range 6. (2) Median; it depends on order and central position, not magnitude of every value. (3) IQR 8; upper fence 32. (4) z=2. (5) Percentiles require a distribution shape/model or empirical reference distribution.

## Independent practice
1. For 3, 4, 4, 5, 9, 10, calculate mean, median, mode and range.
2. For 1, 2, 3, 4, 5, 6, 7, 20, use the stated median-of-halves convention to find Q1, Q3, IQR and outlier fences.
3. A population consists of 5, 5, 5, 5. Find its population standard deviation and explain the result.
4. For population values 1, 3, 5, 7, calculate μ, σ² and σ (exact radical and approximate value).
5. A student scores 75 where the class mean is 60 and standard deviation is 5. Another scores 84 where the mean is 72 and standard deviation is 4. Compare z-scores and state one limitation of the comparison.
6. Two towns have the same median income. Town A has IQR 8,000; Town B has IQR 30,000. Explain what this says and what it does not say.
7. Construct a small dataset for which the mean is below the median, and explain the skew.

**Answer guidance:** (1) Mean=35/6≈5.833; median=(4+5)/2=4.5; mode=4; range=7. (2) Lower half 1,2,3,4 gives Q1=2.5; upper half 5,6,7,20 gives Q3=6.5; IQR=4; fences −3.5 and 12.5; 20 is flagged. (3) σ=0 because every value equals the mean. (4) μ=4; squared deviations 9,1,1,9 sum 20; variance=5; σ=√5≈2.236. (5) zA=3; zB=3; equal relative distance; comparison assumes compatible measurement and suitable reference groups. (6) Middle-half spread is greater in B; this does not establish which town has higher mean, greater inequality across the entire distribution, or causal explanation. (7) Example 1, 5, 5, 6, 6 has mean 4.6 and median 5; a low tail pulls mean down.

## Misconceptions and correction
- **Reporting mean alone for skewed data:** inspect a plot and report median/IQR when appropriate.
- **Treating an outlier flag as an error verdict:** investigate source, units, population and recording process.
- **Mixing population and sample formulas:** label whether the observations are the complete group or a sample.
- **Calling z=2 the 97.5th percentile without assumptions:** separate standardisation from distributional probability.
- **Comparing spread without units/context:** standard deviation is in original units; variance is in squared units.

## Assessment and mastery evidence
Give a raw dataset with one extreme value and require centre, spread, a plot choice, an outlier interpretation and a standardised comparison. Learner must select summaries based on shape and explain the sample/population decision.

## Transfer task
Compare two sets of daily travel times or study durations. Present a centre and spread summary, identify unusual observations, and explain why a single average can conceal important differences.

## Retention
After 1, 7 and 30 days, calculate summaries from new datasets and explain when median/IQR are preferable to mean/standard deviation. Later connect to sampling distributions and inference.

---

# MATH-STAT-014 — Sampling, confidence intervals, hypothesis tests and responsible claims

## Learning outcomes
Distinguish population parameters from sample statistics; identify sampling frames and sources of bias; explain sampling variability; interpret a confidence interval correctly; formulate null and alternative hypotheses; interpret a p-value without common errors; distinguish statistical from practical significance; and explain why association does not establish causation.

## Prerequisites
Fractions, percentages, mean, standard deviation, basic probability and reading tables/graphs. Formal inference procedures require later study of sampling distributions and model assumptions.

## Core explanation
A population is the full group of interest. A sample is the subset observed. A parameter describes a population; a statistic describes a sample. Random sampling gives known selection mechanisms and supports inference when implemented correctly. Convenience samples, voluntary response and undercoverage can create systematic bias that a large sample size does not automatically fix. Nonresponse can also distort results if responders differ from nonresponders.

A statistic varies from sample to sample. This is **sampling variability**, not necessarily a mistake. A standard error describes the typical sampling variation of an estimator under a model. For a sample proportion p̂ from a sufficiently large simple random sample, a common approximate standard error is √[p̂(1−p̂)/n]. Conditions and design effects matter; clustered or weighted samples need methods reflecting their design.

A confidence interval is produced by a procedure that, under its assumptions, captures the fixed population parameter in a stated proportion of repeated samples. A 95% confidence procedure has 95% long-run coverage. After a particular interval is calculated, it is not correct in the standard frequentist interpretation to say there is a 95% probability that the fixed parameter lies in that already-computed interval. The interval either contains the parameter or it does not; the method has a long-run coverage property.

A hypothesis test starts with a null hypothesis H₀ and an alternative H₁. A test statistic measures how incompatible the observed data are with H₀ under the model. The **p-value** is the probability, assuming H₀ and the test assumptions, of observing a test statistic at least as extreme as the one obtained. It is not the probability that H₀ is true, nor the probability the result happened “by chance”. A small p-value can indicate evidence against H₀, but it does not measure effect size, practical importance, data quality or probability of replication.

A Type I error rejects a true null hypothesis; a Type II error fails to reject a false null. “Fail to reject” is not proof that H₀ is true. Statistical significance depends on sample size and variability; practical significance depends on the magnitude and consequences of an effect. Confidence intervals for effect sizes often communicate magnitude and uncertainty more usefully than a binary threshold alone.

Association means variables vary together. Causation means changing one variable would produce a change in another under a well-defined intervention. Confounding, reverse causality and selection effects can create associations. Randomised controlled experiments can support causal claims when well designed; observational studies generally require careful assumptions and cannot establish causation merely from correlation.

## Worked example 1 — Sampling bias
A school wants to estimate average daily study time for all students. It asks only students attending an optional evening study club. This sample likely overrepresents students who study more or are more engaged. Increasing the number of club respondents may reduce random noise within that biased group but does not repair the selection mechanism.

## Worked example 2 — Approximate proportion standard error
In a simple random sample of n=400 people, 220 support a proposal, so p̂=0.55. Approximate standard error = √[0.55×0.45/400] = √0.00061875 ≈ 0.0249, or 2.49 percentage points. This is a model-based estimate of sampling variation, not a guarantee that the sample is unbiased.

## Worked example 3 — Illustrative confidence interval
Using a simple normal approximation, p̂ ± 1.96(SE) = 0.55 ± 1.96(0.0249) ≈ 0.55 ± 0.0488, giving approximately (0.501, 0.599). This is an introductory illustration. A production analysis must check sample design and approximation conditions and may use a more appropriate interval method.

## Worked example 4 — Hypothesis testing language
Suppose H₀ says a new study method has no difference in mean score relative to the old method, and H₁ says there is a difference. A valid analysis reports the estimated difference, uncertainty interval, test method, assumptions and p-value. If p=0.03, the correct interpretation is: under H₀ and the model assumptions, results at least this extreme would occur with probability 0.03. It is incorrect to say there is a 97% probability the new method works.

## Guided practice
1. A poll asks only followers of a particular sports team whether the city should build a stadium. Identify a likely bias.
2. In a sample of 100, 60 support an idea. Calculate p̂ and its approximate standard error.
3. Explain the correct long-run meaning of a 95% confidence procedure.
4. A study reports p=0.01. List two conclusions that are not justified by that number alone.
5. Explain the difference between “fail to reject H₀” and “prove H₀”.
6. A study finds that ice-cream sales and sunburn cases rise together. Give a plausible confounder.

**Guided answers:** (1) Coverage/selection bias: team followers are not necessarily representative of city residents. (2) p̂=0.60; SE≈√(0.24/100)=0.0490. (3) Across repeated samples using the method, about 95% of constructed intervals contain the fixed parameter under assumptions. (4) It does not show H₀ has 1% probability, nor that the effect is large/important or causal. (5) Insufficient evidence to reject is not evidence that the null is exactly true. (6) Hot weather/season can increase both.

## Independent practice
1. A university estimates student commute time by surveying only people in the main car park. Identify the target population, sampling frame problem and likely direction of bias.
2. A random sample of 1,000 residents finds 520 support a policy. Calculate p̂ and approximate standard error.
3. Using the introductory normal approximation, calculate p̂ ± 1.96(SE) for question 2. State at least two assumptions or limitations.
4. A paper reports p=0.04 for a difference in test scores. Write a correct one-sentence interpretation and three claims it does not establish.
5. Explain Type I and Type II errors using a fictional spam filter that flags messages as spam.
6. A study finds students who sleep longer tend to score higher. Give two possible confounders and explain why the association alone is not causal proof.
7. A very large sample detects an average improvement of 0.2 points on a 100-point test with p<0.001. Explain why practical importance still needs evaluation.
8. Design a more defensible sampling plan for estimating study time among all students at a school. Include the population, sampling frame, selection method, nonresponse plan and one limitation.

**Answer guidance:** (1) Target is all university students; car-park-only frame excludes or underrepresents walkers, cyclists, public-transport users and remote students; likely overestimates car commuting and may distort total commute time. (2) p̂=0.52; SE=√(0.52×0.48/1000)=√0.0002496≈0.0158. (3) Margin≈1.96×0.0158≈0.0310; interval≈(0.489,0.551). Assumptions include random sample, suitable independence/design, adequate normal approximation; nonresponse and coverage bias may remain. (4) Under H₀ and model assumptions, a result at least as extreme has probability 0.04; it does not establish causation, importance, truth probability or replication certainty. (5) Type I: legitimate message flagged; Type II: spam not flagged. (6) Examples: prior achievement, health, workload, family resources, study habits; confounding and reverse direction remain possible. (7) Statistical evidence can be strong while effect size is educationally trivial; consider costs, measurement precision and meaningful thresholds. (8) Accept a stratified random sample from a complete enrolment list, contact selected students repeatedly using neutral modes, compare response rates and report limitations.

## Misconceptions and correction
- **Large sample means unbiased:** distinguish random error from systematic selection/measurement bias.
- **95% interval means 95% posterior probability:** explain repeated-sampling coverage.
- **p-value is probability H₀ is true:** condition on H₀; the p-value is about data or more extreme data.
- **Non-significant means no effect:** inspect interval width and power; absence of evidence is not evidence of absence.
- **Correlation means causation:** draw a causal diagram and identify confounders, reverse causation and selection.
- **Statistical significance means importance:** report effect size and practical context.

## Assessment and mastery evidence
Require a critique of a flawed survey, a proportion estimate with standard error and interval, a p-value interpretation, error-type identification and a causal-claim critique. Full evidence must separate parameter/statistic, bias/variability, uncertainty/effect size and association/causation. Do not assess formal inferential competence solely through formula substitution.

## Transfer task
Critique a public claim based on a poll or study. Identify who was sampled, how they were selected, what was measured, the uncertainty, possible confounders and whether the headline overstates the evidence. If the underlying methods are unavailable, explicitly say what cannot be concluded.

## Retention and next steps
Use short retrieval prompts after 1, 7 and 30 days. Later study sampling distributions, t procedures, chi-square methods, regression, experimental design, multiple comparisons, Bayesian inference and causal inference. This unit is conceptual and introductory; it is not a substitute for a full inferential-statistics course.

---

## Batch-level quality and scope note

These four modules deepen rather than replace the earlier introductory probability and statistics modules. They do not yet constitute a complete probability/statistics curriculum. Outstanding topics include discrete and continuous random-variable distributions, expectation and variance rules, binomial/Poisson/normal models, central limit theorem, confidence intervals for means, t procedures, chi-square tests, regression, experimental design, Bayesian updating beyond the introductory example, time series, statistical computing and domain-specific data ethics.

**Validation status:** draft pending independent subject review and learner pilot. Check arithmetic independently before operational use. No psychometric calibration, expert approval or learner mastery is implied by inclusion in the knowledge base.
