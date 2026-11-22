# ATHENA Mathematics — Functional Algebra & Trigonometry Teaching Pack, Batch 04

**Modules:** MATH-FUNC-001 to MATH-TRIG-006
**Status:** Substantive authored drafts; internal arithmetic/concept review completed; independent subject review and learner pilot pending.
**Scope:** Functions, systems, polynomial algebra, quadratics, exponential/logarithmic models and trigonometry. This is a major pathway batch, not a claim that all mathematics is complete.

# MATH-FUNC-001 — Functions as mathematical models

## Why functions matter
A function is a rule that assigns exactly one output to each permitted input. The input set is the domain; the set of outputs actually produced is the range. The rule can be represented by words, a table, a graph, an equation, or a procedure. These representations are not interchangeable decorations: each reveals different features. A table makes individual values visible, a graph reveals global behaviour, and an equation can expose parameters and support calculation.

For example, let C(h)=80+25h represent a delivery charge in taka for h kilometres, within the service area 0≤h≤20. The fixed 80 is the starting charge; 25 is the additional cost per kilometre. C(4)=180. The model is not valid for every real h: negative distance is meaningless, and beyond 20 km the company may use a different tariff. A formula without a domain can therefore communicate an incomplete model.

## Worked examples
**1. Evaluate a function.** If f(x)=3x²−2x+1, then f(−2)=3(4)+4+1=17. Substitute the entire input, including its sign, before simplifying.

**2. Determine whether a relation is a function.** The pairs {(1,4),(2,4),(3,7)} define a function: different inputs may share an output. The pairs {(1,4),(1,5)} do not: input 1 has two outputs.

**3. Find a domain restriction.** For g(x)=1/(x−5), x=5 is excluded because division by zero is undefined. For h(x)=√(x−2) over the real numbers, require x−2≥0, so x≥2.

**4. Interpret a rate of change.** If a tank contains 12 L at time 0 and 30 L after 6 minutes at a steady rate, the average rate is (30−12)/6=3 L/min. The model T(t)=12+3t is justified only while the steady-fill assumption holds.

## Guided practice
1. For p(x)=−2x+9, find p(3) and p(−1). **Answers:** 3 and 11.
2. Is {(0,2),(1,2),(2,2)} a function? **Answer:** yes; every input has one output.
3. State the real domain of q(x)=√(7−x). **Answer:** x≤7.

## Independent practice and answer guidance
1. f(x)=x²−4x. Find f(0), f(4), and f(−1). **Answers:** 0, 0, 5.
2. A membership service costs ৳150 to join and ৳40 per month. Write a cost function and interpret its domain for a one-year membership. **Answer:** C(m)=150+40m; for whole billed months m∈{0,…,12} if prepayment and cancellation rules allow those values.
3. Explain why a graph that passes the vertical-line test represents a function. **Answer:** each allowed x-coordinate intersects the graph at most once, so it has no more than one y-output.
4. Give a real example where a linear model is useful and state one reason it may fail outside its domain. **Answer:** answers vary; must identify a stable rate assumption and a boundary/change.

## Misconceptions and correction
- “A function cannot repeat outputs.” Correction: uniqueness applies to outputs per input, not inputs per output.
- “The domain is always all real numbers.” Correction: denominators, even roots, context and measurement limits can restrict it.
- “A straight-looking graph proves a linear law.” Correction: a finite sample may only approximate linear behaviour; test residuals and context.

## Assessment (12 points)
Evaluate two function values (2); classify a relation with justification (2); derive a domain restriction (3); build and interpret a contextual model including units and domain (3); identify one model limitation (2). Independent threshold: 10/12, with no error on the function definition or domain restriction.

## Transfer task
Model a real process with input, output, units, domain, rule and one limitation. Collect at least five observations, compare the table and graph with the rule, and explain whether the model is exact, approximate or unsupported.

## Retention
After the lesson, reconstruct the function definition and vertical-line test from memory. Next day, solve one evaluation and one domain problem. After a week, model a new context. After a month, critique a function model with a restricted domain. Increase spacing only while retrieval remains reasonably accurate.

# MATH-ALG-002 — Systems of linear equations and constraints

## The central idea
A linear equation in two variables describes a line. A system asks for values that satisfy several equations at once. Geometrically, a solution is an intersection. Two distinct non-parallel lines have one intersection; parallel distinct lines have none; identical lines have infinitely many shared points. Algebraic methods—substitution, elimination and graphing—are different ways to identify the same intersection.

## Worked examples
**1. Substitution.** Solve y=2x+1 and x+y=10. Substitute: x+(2x+1)=10, so 3x=9, x=3 and y=7. Check: 7=2(3)+1 and 3+7=10.

**2. Elimination.** Solve 2x+y=11 and 2x−y=1. Add equations: 4x=12, so x=3. Substitute: y=5. The opposite y-coefficients cancel because adding the equations preserves equality.

**3. No solution.** y=3x+2 and y=3x−4 have equal slopes and different intercepts. They are parallel, so no ordered pair satisfies both.

**4. Contextual model.** Plan A costs 100+20u; Plan B costs 40+30u, where u is a number of uses. Set equal: 100+20u=40+30u, so u=6. At six uses both cost ৳220. Below six, B is cheaper; above six, A is cheaper. The result depends on the stated pricing assumptions.

## Method selection
Use substitution when a variable is already isolated or has coefficient 1. Use elimination when coefficients can be made opposites with simple scaling. Use a graph to understand intersection and compare approximate solutions, but use algebra when exact values matter. For inequalities, each linear inequality defines a half-plane; a system's feasible region is the overlap. Boundary lines are included for ≤ or ≥ and excluded for < or >.

## Guided practice
1. Solve y=x+2 and x+y=8. **Answer:** (3,5).
2. Solve 3x+y=10 and 3x−y=2. **Answer:** (2,4).
3. Describe x+y≤8, x≥0, y≥0. **Answer:** the triangular feasible region in the first quadrant on or below x+y=8.

## Independent practice and answer guidance
1. Solve 2x+3y=13 and x+y=5. **Answer:** (2,3).
2. Determine whether y=−2x+4 and 2y=−4x+8 have one, none or infinitely many solutions. **Answer:** infinitely many; the second equation is the first multiplied by 2.
3. Two tickets cost ৳500 total. Adult tickets cost ৳80 and student tickets ৳40. There are 8 tickets. Find counts. **Answer:** a+s=8, 80a+40s=500; solving gives a=4.5, impossible as a ticket count. The data are inconsistent with whole tickets; do not report a fractional ticket as a valid real-world solution.
4. A workshop has at most 30 labour-hours; product A uses 2 hours and B uses 3. Write the constraint. **Answer:** 2a+3b≤30, with a,b≥0 and usually whole-number constraints.

## Misconceptions
- A solution to one equation is automatically a solution to the system. Check every equation.
- Multiplying an equation by zero preserves equivalence. It destroys information; only nonzero scaling is reversible.
- A numerical solution is always feasible. Context may require nonnegative integers or other restrictions.

## Assessment (14 points)
Solve one system by substitution (3), one by elimination (3), classify a dependent or inconsistent system (2), formulate a contextual system with units (3), and interpret feasibility constraints (3). Threshold: 11/14, with both original equations checked.

## Transfer
Compare two actual or hypothetical pricing plans. Define variables and units, find the break-even point, state which plan is preferable on each side, and list fees or conditions omitted from the model.

## Retention
Alternate substitution and elimination problems so method choice must be made. Revisit a contextual break-even model after a day and a constrained optimisation interpretation after a week.

# MATH-ALG-003 — Polynomials, factoring and polynomial behaviour

## What a polynomial is
A polynomial in x is a finite sum of terms aₙxⁿ where exponents are non-negative integers and coefficients belong to the chosen number system. Examples include 4x³−2x+7 and −5. Expressions such as 1/x and √x are not polynomials in x because they use negative or fractional exponents. Degree is the largest exponent with a nonzero coefficient.

Polynomials can be added by combining like powers and multiplied using the distributive property. Factoring reverses multiplication: it expresses a polynomial as a product. A zero of p is an input r for which p(r)=0. If (x−r) is a factor, then r is a zero; this connects algebraic factorisation with graph x-intercepts.

## Worked examples
**1. Combine.** (3x²+2x−1)+(x²−5x+4)=4x²−3x+3. Only like powers combine.

**2. Multiply.** (x+3)(x−2)=x²−2x+3x−6=x²+x−6. Each term in the first factor multiplies each term in the second.

**3. Factor a common factor.** 6x³−9x²=3x²(2x−3). Check by expanding.

**4. Factor a quadratic.** x²+x−6=(x+3)(x−2). The two numbers multiply to −6 and add to 1. The zeros are −3 and 2.

## Graph behaviour
A degree-n polynomial has at most n real zeros. Its graph is continuous and has no breaks or vertical asymptotes. For large positive or negative x, the leading term controls end behaviour. An even degree has ends pointing in the same direction; an odd degree has ends in opposite directions. The sign of the leading coefficient determines whether the right end rises or falls. These are end-behaviour rules, not a complete graph: turning points and repeated roots require additional analysis.

## Guided practice
1. Simplify (2x²−x+3)+(x²+4x−5). **Answer:** 3x²+3x−2.
2. Expand (x−4)(x+2). **Answer:** x²−2x−8.
3. Factor x²−9. **Answer:** (x−3)(x+3).

## Independent practice and answer guidance
1. Multiply (2x−1)(x+5). **Answer:** 2x²+9x−5.
2. Factor 2x²+7x+3. **Answer:** (2x+1)(x+3).
3. Find zeros of x²−5x+6. **Answer:** x=2,3.
4. State end behaviour of −2x⁵+3x²−1. **Answer:** left end rises as x→−∞; right end falls as x→∞.

## Misconceptions
- Degree equals number of terms. It is the highest exponent after like terms are combined.
- Every quadratic factors over integers. Some do not; use the quadratic formula or another valid method.
- A zero is always a point on the y-axis. A zero is an input where output is zero, so it corresponds to an x-intercept.

## Assessment (12 points)
Classify polynomial/non-polynomial (2), simplify and multiply (3), factor correctly and verify by expansion (3), identify zeros and connect to intercepts (2), explain end behaviour (2). Threshold: 10/12.

## Transfer
Model the area of a rectangle whose sides depend on x, expand the resulting polynomial, factor it back to identify meaningful dimensions, and state the physical domain. Reject algebraic roots that imply impossible negative lengths.

## Retention
Practise expansion and factorisation in mixed order. For delayed retrieval, connect factors, zeros and graph intercepts rather than rehearsing each as an isolated procedure.

# MATH-ALG-004 — Quadratic equations and parabolic models

## Quadratics describe curved relationships
A quadratic function has form f(x)=ax²+bx+c with a≠0. Its graph is a parabola. If a>0 it opens upward and has a minimum; if a<0 it opens downward and has a maximum. The vertex gives the turning point. The axis of symmetry is x=−b/(2a). Quadratics appear in area problems, projectile models under idealised assumptions, and optimisation with a curved relationship.

## Four solution methods
1. **Factoring:** efficient when the expression factors cleanly.
2. **Square-root method:** useful when an equation is already in form (x−h)²=k.
3. **Completing the square:** rewrites a quadratic as a(x−h)²+k and reveals the vertex.
4. **Quadratic formula:** works for every quadratic with real coefficients: x=[−b±√(b²−4ac)]/(2a).

The discriminant D=b²−4ac predicts real-root count: D>0 gives two distinct real roots; D=0 gives one repeated real root; D<0 gives no real roots (the roots are complex).

## Worked examples
**1. Factor.** x²−5x+6=0 gives (x−2)(x−3)=0, so x=2 or 3. Check both in the original equation.

**2. Formula.** 2x²+3x−2=0: D=9−4(2)(−2)=25. x=[−3±5]/4, giving x=1/2 or x=−2.

**3. Vertex.** f(x)=−x²+6x−5. The vertex x-coordinate is −6/[2(−1)]=3; f(3)=4. The maximum value is 4 at x=3.

**4. Context restriction.** A height model h(t)=−5t²+20t+1 (metres) has a mathematical vertex at t=2 seconds, height 21 m. The formula is only a simplified model; the physically meaningful time interval begins at launch and ends when height reaches ground. Solve h(t)=0 and select the nonnegative root.

## Guided practice
1. Solve x²−7x+12=0. **Answer:** 3,4.
2. Find the vertex x-coordinate of 2x²−8x+1. **Answer:** 2.
3. Classify roots of x²+2x+5=0. **Answer:** D=−16, no real roots.

## Independent practice and answer guidance
1. Solve 3x²−12=0. **Answer:** x=±2.
2. Solve x²+4x+1=0. **Answer:** x=−2±√3.
3. Find vertex of f(x)=2(x−1)²−7. **Answer:** (1,−7), minimum −7.
4. A rectangle has width x and length x+3, area 40. Find dimensions. **Answer:** x(x+3)=40; x²+3x−40=0=(x+8)(x−5); physical width x=5, length 8.

## Misconceptions
- The ± sign is optional. Both branches are required when solving a square equation.
- The vertex x-coordinate is −b/2. It is −b/(2a).
- Every algebraic root is contextually valid. Check units, domain and physical meaning.

## Assessment (15 points)
Solve by factoring (3), use quadratic formula correctly (4), interpret discriminant (2), find and interpret a vertex (3), solve a contextual model and justify domain choice (3). Threshold: 12/15 and all contextual restrictions handled correctly.

## Transfer
Design a rectangular enclosure with a fixed amount of fencing. Express area as a quadratic in one dimension, determine the maximum area, and explain why the mathematical optimum is physically feasible under the stated constraints.

## Retention
Interleave factoring, formula and vertex problems. On delayed review, first choose a method and explain why; then calculate and verify.

# MATH-EXP-005 — Exponential and logarithmic models

## Multiplicative change is not additive change
A linear model adds a constant amount per equal input interval. An exponential model multiplies by a constant factor per equal interval: P(t)=P₀bᵗ, where P₀ is the initial amount and b is the growth factor. If b>1 there is growth; if 0<b<1 there is decay. A 5% increase per period means b=1.05; a 5% decrease means b=0.95. The percentage is applied to the current amount each period, so the absolute change is not constant.

A logarithm answers the inverse question: log_b(x)=y means bʸ=x, with b>0, b≠1 and x>0. Logarithms are useful for solving for time or exponent. They do not make an invalid model valid; model assumptions still need checking.

## Worked examples
**1. Compound growth.** ৳1,000 grows by 10% annually for 2 years: A=1000(1.10)²=৳1,210. The second year's increase is 110, not 100, because it applies to the new balance.

**2. Decay.** A 200 g sample retains 80% each hour: M(t)=200(0.8)ᵗ. After 2 hours, 128 g remains.

**3. Solve with logarithms.** 2ˣ=20 gives x=log₂20=ln20/ln2≈4.322. Check by estimating 2⁴=16 and 2⁵=32.

**4. Half-life.** If a quantity halves every 3 days, Q(t)=Q₀(1/2)^(t/3). At 9 days, three half-lives have passed and Q=Q₀/8.

## Logarithm laws and conditions
For positive M,N and valid base b: log_b(MN)=log_bM+log_bN; log_b(M/N)=log_bM−log_bN; log_b(Mᵏ)=k log_bM. The product and quotient rules follow from exponent laws. Never apply them to non-positive arguments in real-number work. A common error is log(a+b)=log a+log b; this is false.

## Guided practice
1. A value of 500 rises 4% per year. Write the model. **Answer:** P(t)=500(1.04)^t.
2. Evaluate log₃81. **Answer:** 4.
3. A quantity follows 64(1/2)^t. Find t when it reaches 8. **Answer:** t=3.

## Independent practice and answer guidance
1. ৳2,000 earns 6% annual compound growth for 3 years. Find the final amount. **Answer:** 2000(1.06)^3≈৳2,382.03.
2. A machine's output falls 12% per year from 1,000 units. Model after t years. **Answer:** 1000(0.88)^t.
3. Solve 5^(x+1)=125. **Answer:** x=2.
4. Explain why a constant 10-unit decrease each month is not exponential decay. **Answer:** it is additive change; exponential decay removes a constant proportion, not a constant amount.

## Misconceptions
- A 10% increase then 10% decrease cancels. Multipliers 1.10×0.90=0.99, so the final value is 99% of the start.
- log(a+b)=log a+log b. No such general rule exists.
- Exponential growth continues forever in real systems. Resources, constraints and regime changes often invalidate long-run extrapolation.

## Assessment (14 points)
Identify linear vs exponential (2), construct growth/decay model with correct multiplier (3), calculate a compound value (2), solve exponential equation using logarithms (3), interpret half-life or doubling time (2), state one model limitation (2). Threshold: 11/14.

## Transfer
Compare two savings or depreciation scenarios using explicit rates, compounding periods, fees and time units. State which assumptions are hypothetical and avoid presenting the exercise as personal financial advice.

## Retention
Retrieve the meaning of base and exponent, reconstruct the logarithm definition, then solve mixed growth/decay/time problems after increasing delays. Include a misconception check on percentage-point versus proportional change.

# MATH-TRIG-006 — Trigonometry, the unit circle and periodic behaviour

## Angles and ratios
Trigonometry connects angles with side ratios and circular motion. In a right triangle, for an acute angle θ: sinθ=opposite/hypotenuse, cosθ=adjacent/hypotenuse, and tanθ=opposite/adjacent. These ratios depend on the angle, not the triangle's size, because similar right triangles preserve corresponding side ratios.

Radians measure angle by arc length divided by radius. One full turn is 2π radians or 360 degrees; therefore π radians=180 degrees. The unit circle has radius 1. A point at angle θ has coordinates (cosθ,sinθ), which extends sine and cosine beyond acute right-triangle angles and explains their signs in all four quadrants.

## Worked examples
**1. Right triangle.** A right triangle has opposite side 3 and hypotenuse 5 relative to θ. sinθ=3/5. The adjacent side is 4 by Pythagoras, so cosθ=4/5 and tanθ=3/4.

**2. Convert degrees.** 150°×π/180°=5π/6 radians. Convert radians to degrees by multiplying by 180/π.

**3. Unit circle.** At θ=π/3, coordinates are (1/2,√3/2), so cosθ=1/2 and sinθ=√3/2.

**4. Periodic model.** A simplified tide-height model H(t)=2+0.8cos(πt/6) metres has midline 2, amplitude 0.8 and period 12 hours because 2π/(π/6)=12. The model predicts oscillation, not exact local tide conditions.

## Choosing a method
Use right-triangle ratios when the geometry is a right triangle and an angle/side is known. Use the unit circle for exact values, signs and periodic functions. Use inverse trigonometric functions to estimate an angle from a ratio, while checking the calculator's degree/radian mode. The sine rule and cosine rule extend triangle solving to non-right triangles, but require careful identification of opposite side-angle pairs.

## Guided practice
1. In a right triangle, opposite=5 and hypotenuse=13. Find sine. **Answer:** 5/13.
2. Convert 225° to radians. **Answer:** 5π/4.
3. State the period of y=sin(3x). **Answer:** 2π/3.

## Independent practice and answer guidance
1. A 10 m ladder makes a 60° angle with level ground. Find the idealised vertical reach. **Answer:** 10sin60°=5√3≈8.66 m.
2. Convert 7π/6 radians to degrees. **Answer:** 210°.
3. For y=−2cos(4x)+1, state amplitude, period, reflection and midline. **Answer:** amplitude 2; period π/2; reflected across midline relative to positive cosine; midline y=1.
4. Explain why calculator mode matters. **Answer:** the same numeral is interpreted as degrees or radians, producing different trigonometric values.

## Misconceptions
- Sine means opposite divided by adjacent. That is tangent; sine uses hypotenuse.
- Radians and degrees are interchangeable numerals. They are different units.
- Sine and cosine are only defined for acute angles. The unit circle defines them for all real angles.
- Period is always 2π. For sin(bx), period is 2π/|b|.

## Assessment (14 points)
Use a right-triangle ratio (3), convert angle units (2), identify unit-circle coordinates/signs (3), analyse amplitude/midline/period (3), solve a contextual triangle task and state assumptions (3). Threshold: 11/14 with correct angle mode and units.

## Transfer
Estimate the height of an inaccessible object using a measured horizontal distance and angle of elevation. Record measurement uncertainty and assumptions (level ground, line of sight, angle instrument calibration). Do not climb or approach unsafe locations to collect measurements.

## Retention
Mix triangle-ratio questions with unit-circle and graph questions. Delayed review must include angle conversion and a prompt requiring the learner to select a method rather than being told which identity to use.
