# ATHENA Mathematics — Baseline Teaching Pack, Batch 03

**Modules:** BASE-MATH-009 to BASE-MATH-012  
**Status:** Complete instructional draft with internal mathematical/structural checks; independent subject review and learner pilot still required.  
**Purpose:** Finish the 12-module Mathematics breadth baseline with substantive instruction, not generic placeholders.

# BASE-MATH-009 — Exponents, powers and roots

**Suggested workload:** 3–4 focused sessions of 35–50 minutes  
**Entry knowledge:** Multiplication, division, factors, fractions and the meaning of variables.

### Learning outcomes
- Interpret a^n as repeated multiplication for positive integer n and identify base and exponent.
- Use product, quotient and power-of-a-power rules when their conditions are met.
- Explain zero and negative integer exponents for non-zero bases.
- Find and estimate square roots and cube roots, distinguishing principal square roots from both solutions of x² = a.
- Use powers of ten and scientific notation to express and compare very large or small quantities.

## 1. The central idea: a power is a compact multiplication pattern

In `4³`, the **base** is 4 and the **exponent** is 3. It means `4 × 4 × 4 = 64`. The exponent tells how many copies of the base are multiplied; it does not mean `4 × 3`. Read `4³` as “four cubed” or “four to the third power.” A power is useful when the same multiplicative factor repeats, such as the number of cells after repeated doubling or the volume of a cube.

The notation has a precise scope. `(-3)² = (-3)(-3) = 9`, while `-3²` conventionally means `-(3²) = -9` because exponentiation is evaluated before the leading negative sign. Parentheses remove ambiguity. Teach yourself to write them whenever a negative base is intended.

## 2. Exponent laws come from counting repeated factors

For the same non-zero base, `aᵐ × aⁿ = aᵐ⁺ⁿ`: the first factor contributes m copies of a and the second contributes n more. Example: `2³ × 2⁴ = (2×2×2)(2×2×2×2) = 2⁷ = 128`.

For `aᵐ ÷ aⁿ` with `a ≠ 0`, cancel common factors. If m is greater than n, `aᵐ ÷ aⁿ = aᵐ⁻ⁿ`. Example: `5⁶ ÷ 5² = 5⁴ = 625`. The condition matters: division by zero is undefined. If m=n, the quotient is 1, so `a⁰ = 1` for `a ≠ 0`. This does not define `0⁰`; leave it undefined at this level.

A power raised to a power multiplies exponents: `(aᵐ)ⁿ = aᵐⁿ`. For example, `(2³)² = 2³ × 2³ = 2⁶ = 64`. A power of a product distributes to each factor: `(ab)ⁿ = aⁿbⁿ`. It does **not** distribute over addition: `(a+b)²` is generally not `a²+b²`; expanding gives `a²+2ab+b²`.

For non-zero a, `a⁻ⁿ = 1/aⁿ`. A negative exponent means reciprocal, not a negative answer. For example, `2⁻³ = 1/2³ = 1/8`. Check: `2³ × 2⁻³ = 2⁰ = 1`.

## 3. Roots reverse powers, with an important distinction

A square root asks which non-negative number squares to the given non-negative value. `√49 = 7`, because the principal square root symbol returns the non-negative root. But the equation `x²=49` has two solutions: `x=7` and `x=-7`. Do not write `√49 = ±7`; the ± belongs when solving the equation, not evaluating the principal-root symbol.

A cube root reverses cubing and can be negative: `∛(-27)=-3`, because `(-3)³=-27`. Every real number has a real cube root. A negative number has no real square root. For positive values that are not perfect squares, estimate between known squares: `√30` lies between 5 and 6 because 25 < 30 < 36. Since 30 is closer to 25 than 36, the root is below the midpoint 5.5; a calculator approximation is about 5.477, but the interval reasoning is the important first check.

## 4. Scientific notation represents scale

Scientific notation writes a non-zero number as `c × 10ⁿ`, where `1 ≤ |c| < 10` and n is an integer. For example, 4,700,000 = `4.7 × 10⁶`; 0.00032 = `3.2 × 10⁻⁴`. The exponent records how far the decimal point moves. It is not a decorative label: the coefficient must remain in the stated range.

When multiplying scientific-notation numbers, multiply coefficients and add exponents: `(3×10⁵)(2×10³)=6×10⁸`. When dividing, divide coefficients and subtract exponents. Normalize the coefficient afterward if it falls outside the range 1 to less than 10. Addition is different: first express both terms with the same power of ten, then add coefficients. You cannot simply add exponents when adding quantities.

## 5. Worked examples

**Example A — Simplify a product.** `3² × 3⁴ = 3⁶ = 729`. Reason: six factors of 3. Check numerically: 9 × 81 = 729.

**Example B — Negative exponent.** `10⁻³ = 1/10³ = 1/1000 = 0.001`. The exponent changes the scale by a factor of one tenth three times; it does not make the value negative.

**Example C — Distinguish root from equation.** Evaluate `√81` and solve `x²=81`. The first is 9. The equation has x=9 or x=-9 because both square to 81.

**Example D — Scientific notation.** A microbe is 0.000006 m long. Move the decimal six places right to get 6, so the length is `6 × 10⁻⁶ m`. A value of `6 × 10⁻⁵ m` would be ten times larger; checking the exponent catches a common place-value error.

## 6. Guided practice with feedback

1. Expand `5³` and evaluate it. **Answer:** `5×5×5=125`; the exponent is not a multiplier.
2. Simplify `2⁴ × 2³`. **Answer:** `2⁷=128`; add exponents because the base is the same.
3. Simplify `7⁵ ÷ 7²`. **Answer:** `7³=343`; subtract exponents, with non-zero base.
4. Evaluate `4⁻²`. **Answer:** `1/4²=1/16`, not −16.
5. Evaluate `√64`, then solve `x²=64`. **Answer:** 8; x=±8.
6. Write 0.00091 in scientific notation. **Answer:** `9.1×10⁻⁴`; coefficient is between 1 and 10.

## 7. Independent practice

1. Evaluate `(-2)⁴` and `-2⁴`. Explain why the results differ.
2. Simplify `(3²)³` and `3²×3³`.
3. Simplify `10⁶÷10⁹` and express the result as a fraction and decimal.
4. A square has area 196 cm². Find its side length. Explain why only the positive root is used for a physical side.
5. A cube has volume 216 cm³. Find its edge length.
6. Order `4.5×10⁶`, `7.2×10⁵` and `0.0008` from least to greatest.
7. A population doubles every period, beginning at 300. Write and calculate the population after four doubling periods; state the assumption.
8. Explain why `(x+2)²` is not equal to `x²+4` for all x. Give a numerical counterexample.

**Answer guidance:** (1) 16 and −16; parentheses include the negative in the base. (2) 3⁶=729 and 3⁵=243. (3) 10⁻³=1/1000=0.001. (4) 14 cm; length is non-negative. (5) 6 cm because 6³=216. (6) 0.0008, 7.2×10⁵, 4.5×10⁶. (7) `300×2⁴=4,800`, assuming exact doubling and no capacity/limiting effects. (8) At x=1, left side 9 and right side 5; the missing middle term is 4x.

## 8. Common misconceptions and corrective moves

- **“Exponent means multiply by this number.”** Expand the power into repeated factors before calculating.
- **“A negative exponent makes a negative number.”** Rewrite it as a reciprocal and check the sign.
- **“The square root gives plus or minus.”** Separate the principal-root symbol from solving a squared equation.
- **“Exponent rules work across addition.”** Test a simple value such as x=1; expand `(x+2)²` to see the cross-term.
- **“A bigger exponent always means a bigger number.”** This fails for bases between 0 and 1 and for negative bases; compare actual values and conditions.
- **Scientific notation exponent sign reversed.** Reconstruct the ordinary decimal and count the place movement.

## 9. Assessment and mastery evidence

**Assessment A — structure and laws (8 points):** expand and evaluate a power (1); simplify a same-base product and quotient with conditions stated (2); simplify a power of a power (1); explain a negative exponent (1); identify an invalid distribution over addition (1); distinguish `√a` from solutions of `x²=a` (2).

**Assessment B — scale and modelling (6 points):** convert one small and one large quantity to scientific notation (2); multiply two scientific-notation quantities (1); interpret a repeated-doubling model and state an assumption (2); perform an order-of-magnitude reasonableness check (1).

**Independent-performance standard:** at least 11/14 points, no critical confusion between root notation and equation solutions, and all exponent-law conditions are respected. A learner who scores lower should revisit only the relevant concept family; a single total score must not hide a specific misconception. Oral explanation or a handwritten solution may be used as evidence.

## 10. Transfer task

A digital file is 2.4×10⁶ bytes and another is 7.5×10⁵ bytes. Estimate the combined size in scientific notation, then calculate exactly. Explain why the units and the decimal/binary definition of KB/MB must be specified before converting to larger storage units. As a second task, model repeated doubling in a hypothetical process and identify why real-world growth eventually may stop being exponential.

## 11. Retrieval and retention plan

- **Same session:** reconstruct the exponent laws from expanded factors; do not only recite them.
- **Next day:** 6 mixed items, including one misconception diagnosis and one root/equation distinction.
- **About one week later:** solve a fresh scientific-notation and repeated-growth problem without notes.
- **About one month later:** retrieve the rules inside a physics, computing or finance context.

These are starting review opportunities, not universal biological intervals. Shorten the interval after errors; lengthen it after accurate, effortful retrieval across more than one context. Keep an error log by misconception, not just by wrong answer.

## 12. Entry check and exit decision

Before starting, the learner should multiply whole numbers, understand reciprocals and compare decimals. If not, repair those foundations first. After the assessment, record separate evidence for exponent laws, roots and scientific notation. Do not mark the whole module “mastered” from a single successful worksheet.


# BASE-MATH-010 — Geometry, spatial reasoning and measurement

**Suggested workload:** 4–5 focused sessions of 35–50 minutes  
**Entry knowledge:** Arithmetic with decimals and fractions, unit conversion, multiplication, division and basic coordinate familiarity.

### Learning outcomes
- Distinguish length, perimeter, area, surface area and volume, with correct units.
- Measure and classify angles and use angle relationships to solve unknowns.
- Use triangle and quadrilateral properties to justify geometric conclusions.
- Calculate perimeter and area for rectangles, triangles and parallelograms, and circumference/area of circles at an introductory level.
- Calculate volume of rectangular prisms and explain how measurement uncertainty and unit conversion affect results.

## 1. Geometry studies properties and relationships in space

A **point** marks a location; a **line segment** has two endpoints; a **ray** begins at one endpoint and extends indefinitely; a **line** extends indefinitely in both directions. A plane is a flat two-dimensional surface. These ideal objects are mathematical models: a drawn dot has thickness, but the mathematical point does not.

An angle is formed by two rays sharing a vertex. Angle measure describes the amount of turn between them. A right angle is 90°, an acute angle is between 0° and 90°, an obtuse angle is between 90° and 180°, and a straight angle is 180°. Angles around a point total 360°. Adjacent angles on a straight line total 180°. Opposite (vertical) angles formed by intersecting lines are equal.

## 2. Triangles and quadrilaterals

A triangle has three sides and three interior angles whose measures total 180° in Euclidean plane geometry. If two angles are 48° and 67°, the third is `180°−48°−67°=65°`. An equilateral triangle has three equal sides and three 60° angles; an isosceles triangle has at least two equal sides and the base angles opposite those sides are equal; a scalene triangle has no equal sides. Side lengths must satisfy the triangle inequality: the sum of any two sides must be greater than the third.

A quadrilateral has four sides and interior-angle sum 360°. A rectangle has four right angles; a square is a rectangle with all sides equal. A parallelogram has both pairs of opposite sides parallel; opposite sides and opposite angles are equal. A rhombus has four equal sides. These definitions matter: a square is both a rectangle and a rhombus, not a separate mutually exclusive category.

## 3. Perimeter and area answer different questions

**Perimeter** is the distance around a two-dimensional shape, so its unit is linear (cm, m). **Area** measures the region inside a boundary, so its unit is squared (cm², m²). For a rectangle, perimeter is `P=2l+2w` and area is `A=lw`. For a triangle, `A=½bh`, where the height is perpendicular to the chosen base. For a parallelogram, `A=bh` with perpendicular height, not the slanted side length. A circle's circumference is `C=2πr` and area is `A=πr²`; radius is half the diameter.

A formula is a compressed relationship, not a substitute for understanding the dimensions. Doubling both sides of a rectangle doubles its perimeter but multiplies its area by four. If the length unit changes from metres to centimetres, area conversion is squared: 1 m² = 10,000 cm², not 100 cm².

## 4. Three-dimensional measurement

A rectangular prism has volume `V=lwh`. Volume measures space occupied and uses cubic units (cm³, m³). Surface area measures the total area of its outside faces and uses square units. For a rectangular prism, `SA=2(lw+lh+wh)`. A box 4 cm × 3 cm × 2 cm has volume 24 cm³ and surface area `2(12+8+6)=52 cm²`. Do not confuse capacity with volume: 1 cm³ equals 1 mL for water-volume conversion, while 1,000 cm³ equals 1 L.

## 5. Measurement is a model with units and uncertainty

A measurement is not just a number. It is a number plus a unit and a method. A ruler marked in millimetres does not justify reporting a length to an arbitrary number of decimal places. Read from the correct zero mark, align the object, avoid parallax where relevant and record the instrument's resolution. If a length is measured as 12.4 cm on a ruler with 1 mm divisions, do not imply the instrument guarantees 12.4000 cm.

Convert units using equalities. For length, 1 m=100 cm; for area, square the conversion factor; for volume, cube it. For example, 2.5 m = 250 cm, but 2.5 m² = 25,000 cm². Write the conversion as a factor equal to one so the unwanted units cancel.

## 6. Worked examples

**Example A — Find a missing angle.** A triangle has angles 38° and 79°. The third is `180−38−79=63°`. Check: 38+79+63=180°.

**Example B — Floor area and border.** A rectangular room is 4.2 m by 3.5 m. Area = `4.2×3.5=14.7 m²`. Perimeter = `2(4.2+3.5)=15.4 m`. Flooring is based on area; skirting or a border is based on perimeter. They cannot be interchanged.

**Example C — Triangle area.** A triangular sign has base 18 cm and perpendicular height 11 cm. Area = `½×18×11=99 cm²`. The 11 cm must be the perpendicular height, not a slanted edge.

**Example D — Box capacity.** A storage box has internal dimensions 30 cm × 20 cm × 15 cm. Volume = 9,000 cm³ = 9,000 mL = 9 L. This is the geometric internal volume; real usable capacity may be lower because of wall thickness, shape or required headspace.

## 7. Guided practice with feedback

1. Two angles on a straight line are 127° and x. Find x. **Answer:** 53°; a straight angle totals 180°.
2. A triangle has angles 45° and 45°. Find the third and classify it. **Answer:** 90°; right isosceles triangle.
3. A rectangle is 8 cm by 5 cm. Find perimeter and area. **Answer:** 26 cm and 40 cm²; note the different units.
4. A parallelogram has base 12 cm and perpendicular height 7 cm. Find area. **Answer:** 84 cm²; do not use the slanted side as height.
5. Convert 0.8 m² to cm². **Answer:** 8,000 cm² because 0.8×10,000=8,000.
6. A prism is 5 cm × 4 cm × 3 cm. Find volume. **Answer:** 60 cm³.

## 8. Independent practice

1. Can side lengths 4 cm, 7 cm and 12 cm form a triangle? Explain using the triangle inequality.
2. A quadrilateral has angles 90°, 85°, 110° and x. Find x.
3. A circular plate has radius 7 cm. Find circumference and area in terms of π, then approximate using π≈3.14.
4. A garden is 8 m by 5 m. A 1 m-wide path is built inside along all four edges. Find the remaining central rectangular area. State how you interpret the path width.
5. A tank measures 1.2 m × 0.8 m × 0.5 m internally. Find its volume in m³ and litres. Assume it is a rectangular prism and filled to the top.
6. A square has side 6 cm. If its side is tripled, by what factor do perimeter and area change? Explain.
7. A drawing uses scale 1:50. A wall is 7.4 cm long on the drawing. Find its actual length in metres.
8. A learner reports a pencil as 17.384 cm using a ruler with millimetre markings. Explain why this precision is not supported.

**Answer guidance:** (1) No: 4+7=11, not greater than 12. (2) 75°. (3) C=14π≈43.96 cm; A=49π≈153.86 cm². (4) The inside dimensions are 8−2=6 m and 5−2=3 m, so 18 m². (5) 0.48 m³ = 480 L. (6) Perimeter ×3; area ×9. (7) 7.4×50=370 cm=3.7 m. (8) Instrument resolution is 1 mm=0.1 cm; the thousandths place is unjustified unless a more precise method is used.

## 9. Common misconceptions and corrective moves

- **Area and perimeter are treated as interchangeable.** Ask whether the job covers a surface or follows a boundary; check units.
- **A slanted side is used as a triangle/parallelogram height.** Draw the right-angle marker; height is perpendicular to the selected base.
- **A square is not recognised as a rectangle.** Use inclusive definitions based on properties, not visual stereotypes.
- **Length conversion is applied directly to area or volume.** Square or cube the conversion factor.
- **A diagram is assumed to be to scale.** Use stated facts and deductions, not apparent proportions, unless measurement is explicitly requested.
- **Too many measurement digits are reported.** Match precision to instrument and method; include uncertainty where it affects the decision.

## 10. Assessment and mastery evidence

**Assessment A — geometry reasoning (8 points):** solve angle relationships with reasons (2); classify a triangle/quadrilateral using definitions (2); test a triangle inequality case (1); calculate a composite area/perimeter problem (2); identify a valid perpendicular height (1).

**Assessment B — measurement application (8 points):** choose appropriate units (2); calculate a prism volume and convert capacity (2); convert an area correctly (2); interpret scale and measurement precision (2).

**Independent-performance standard:** at least 13/16, all final quantities have correct units, and no critical area/perimeter or squared-unit confusion. A correct numeric answer with an incorrect dimensional unit is not full credit.

## 11. Transfer task

Measure a small rectangular area at home using a suitable ruler or tape. Record the instrument resolution, dimensions, estimated uncertainty, area and perimeter. Propose how much flooring material to buy and justify a reasonable waste allowance separately from the geometric area. Do not make structural, electrical or construction-safety decisions from this introductory exercise.

## 12. Retrieval and retention plan

Same session: redraw the formulas from dimensions and explain units. Next day: mixed angle, area and conversion questions. About one week later: solve a scale drawing and a volume task without notes. About one month later: apply geometry to a real measurement and explain uncertainty. Adjust review timing to actual errors and recall, not a fixed universal schedule.

## 13. Entry check and exit decision

The learner should multiply decimals, convert basic length units and understand fractions. Record separate evidence for angle reasoning, 2D measurement, 3D measurement and unit conversion. Do not infer competence in all geometry from one area-formula question.


# BASE-MATH-011 — Coordinate graphs, relations and functions

**Suggested workload:** 4–5 focused sessions of 35–50 minutes  
**Entry knowledge:** Signed numbers, ratios/rates, variables, simple equations and ordered pairs.

### Learning outcomes
- Plot and interpret ordered pairs on a Cartesian coordinate plane.
- Distinguish a relation from a function using the one-input-one-output rule.
- Interpret slope as rate of change and intercepts as contextual starting values.
- Construct and interpret tables, equations and graphs of simple linear relationships.
- Identify domain, range, scale choices and limitations in a graph-based model.

## 1. A graph is a representation of a relationship

The Cartesian plane has a horizontal **x-axis** and vertical **y-axis** meeting at the origin `(0,0)`. An ordered pair `(x,y)` tells how far to move horizontally and then vertically. The order matters: `(2,5)` and `(5,2)` are different points. The axes are number lines with a chosen scale; equal spacing must represent equal numerical steps.

A **relation** is a set of input-output pairs. A **function** is a relation in which every allowed input has exactly one output. One input cannot map to two different outputs. Different inputs may share the same output. On a graph, a vertical line test checks this: if a vertical line crosses the graph more than once, the relation is not a function of x.

## 2. Tables, equations and graphs describe the same rule

Consider a constant-rate situation: a delivery rider travels at a steady 12 km/h from a starting point. Distance after t hours is `d=12t`. A table gives (t,d): (0,0), (1,12), (2,24), (3,36). Plotting these points produces a straight line through the origin. The equation, table and graph are three views of one model.

A more general linear equation is `y=mx+b`. Here m is the slope and b is the y-intercept. Slope is the change in y divided by the corresponding change in x: `m=(y₂−y₁)/(x₂−x₁)`, provided x₂≠x₁. It is a rate with units: taka per item, kilometres per hour, or degrees per minute. The intercept b is the y-value when x=0, if x=0 is within the model's meaningful domain.

For `y=3x+2`, slope is 3 and y-intercept is 2. At x=4, y=14. The line does not pass through the origin because there is a starting value of 2. If the variables represent a fee of ৳2 plus ৳3 per kilometre, the equation is cost `C=3d+2`; the slope is ৳/km and the intercept is ৳2.

## 3. Slope direction and special cases

A positive slope rises from left to right; a negative slope falls; zero slope is horizontal. A vertical line has undefined slope because the change in x is zero, so division by zero would be required. A vertical line `x=4` is not a function y=f(x), because the input x=4 has many y-values.

Slope is not “how steep it looks” independent of scale. Changing the axis scales can make the same line look visually steeper or flatter. Read the numbers and units on both axes before interpreting a graph.

## 4. Domain and range keep models honest

The **domain** is the set of allowed inputs; the **range** is the set of resulting outputs. A line may be drawn infinitely in both directions as a mathematical object, but a real model may only apply over a limited interval. For example, a cost model for 0–20 kilometres should not automatically be extrapolated to 500 kilometres if the pricing system changes. Time, distance, item counts and money may also have constraints: item counts are whole numbers, and a model may not allow negative time.

A graph communicates only what its data and assumptions support. A graph can be misleading if axes are truncated without disclosure, intervals are unequal, categories are omitted, or a trend is extrapolated beyond the observed range. A correlation or visible trend does not by itself establish causation.

## 5. Worked examples

**Example A — Plot and read a point.** Plot `(-2,3)`: from the origin move 2 units left and 3 up. The point lies in quadrant II. Check x is negative and y positive.

**Example B — Find slope.** Points `(2,5)` and `(6,13)` give `m=(13−5)/(6−2)=8/4=2`. For every 1-unit increase in x, y rises by 2 units. The units are y-units per x-unit.

**Example C — Find an equation from slope and intercept.** A line has slope −3 and y-intercept 7. Its equation is `y=−3x+7`. At x=2, y=1. A negative slope means y decreases as x increases.

**Example D — Interpret a non-zero intercept.** A mobile service charges ৳40 fixed plus ৳5 per extra unit. `C=40+5u`. At u=6, C=৳70. The y-intercept is the fixed charge; slope is the marginal charge per unit.

## 6. Guided practice with feedback

1. What does point `(4,−3)` mean in movement from the origin? **Answer:** 4 right, 3 down; quadrant IV.
2. Is `{(1,2),(2,4),(1,5)}` a function? **Answer:** No; input 1 has two outputs.
3. Find slope between `(1,4)` and `(3,10)`. **Answer:** 3; change in y is 6 for change in x of 2.
4. For `y=−2x+6`, identify slope/intercept and find y when x=4. **Answer:** slope −2, intercept 6, y=−2.
5. A graph shows 0 km at 0 h, 15 km at 1 h, 30 km at 2 h. State the constant rate and model. **Answer:** 15 km/h; d=15t, if speed is constant.

## 7. Independent practice

1. Plot and label `A(−3,2)`, `B(2,−1)` and `C(0,4)`. State the quadrant or axis for each.
2. Determine whether `{(0,1),(1,1),(2,1),(3,1)}` is a function. Explain.
3. Find the slope through `(−1,5)` and `(3,−3)`.
4. A tank begins with 120 L and drains at 8 L/min. Write a linear model for remaining water after t minutes; identify domain restrictions and when the model reaches zero.
5. A shop charges ৳25 fixed plus ৳12 per item. Make a table for 0–4 items and write an equation. Explain the intercept and slope units.
6. A line passes through `(0,−4)` and `(2,0)`. Find its slope and equation.
7. Explain why a vertical line is not a function of x but a horizontal line is.
8. A graph's y-axis begins at 90 rather than 0. Explain how that can exaggerate apparent differences in a bar chart.

**Answer guidance:** (1) A quadrant II; B quadrant IV; C on y-axis. (2) Yes; each input has exactly one output; repeated outputs are allowed. (3) `(-3−5)/(3−(-1))=−8/4=−2`. (4) `V=120−8t`, with 0≤t≤15; it reaches zero at 15 min. (5) C=25+12n; costs 25, 37, 49, 61, 73 taka; intercept is fixed taka, slope taka/item. (6) slope 2; y=2x−4. (7) A vertical line gives multiple y-values for one x; a horizontal line gives one constant y for each x. (8) A shortened baseline makes small absolute differences occupy a large fraction of the visible bar height; show the scale clearly or start at zero for bar comparisons.

## 8. Common misconceptions and corrective moves

- **Swapping x and y.** Read ordered pairs aloud as “x first, y second”; verify axis labels.
- **Assuming a function must have different outputs.** Repeat outputs are allowed; repeat inputs with different outputs are not.
- **Using rise/run backwards.** Label the two points and calculate Δy/Δx consistently.
- **Calling the intercept the slope.** The slope is the rate of change; the intercept is the output at input zero.
- **Treating a graph as a photograph of reality.** State the model assumptions, domain and evidence limits.
- **Assuming a line's visual steepness is absolute.** Compare numeric axis scales and units.

## 9. Assessment and mastery evidence

**Assessment A — representation (6 points):** correctly plot points and label axes (2); decide whether a relation is a function (2); translate a table into a graph/equation (2).

**Assessment B — linear modelling (8 points):** calculate slope with units (2); identify/interpet intercept (2); construct a model from a context (2); state domain/range limits and one limitation (2).

**Independent-performance standard:** at least 11/14, with correct Δy/Δx, correct function reasoning and units in contextual slope/intercept interpretations. A graph that is numerically correct but has misleading scales or omitted labels is incomplete evidence.

## 10. Transfer task

Collect or invent a small dataset with a meaningful input and output, such as minutes and pages read at a steady pace or distance and time during a constant-speed segment. Build a table and graph, estimate a model, interpret slope and intercept, state domain limits and identify whether a linear model is justified. Do not claim causation from a plotted association alone.

## 11. Retrieval and retention plan

Same session: reconstruct slope and y=mx+b from two points. Next day: mixed function-test, graph and context items. About one week later: build a model from a new table without notes. About one month later: critique a real graph's axes, units and extrapolation. Adjust intervals according to recall and misconception evidence.

## 12. Entry check and exit decision

The learner should order signed numbers, use variables and solve simple equations. Record separate evidence for coordinate plotting, function identification, slope/intercept and model critique. These are distinct capabilities.


# BASE-MATH-012 — Mathematical reasoning, problem solving and proof

**Suggested workload:** 4–6 focused sessions of 35–50 minutes  
**Entry knowledge:** Arithmetic, fractions, variables, equations, basic geometry and the ability to explain a calculation in sentences.

### Learning outcomes
- Translate a verbal or practical situation into a mathematical representation and identify assumptions.
- Distinguish examples, counterexamples, conjectures, definitions and proofs.
- Use logical statements, implication and counterexample reasoning accurately.
- Construct clear arithmetic, algebraic and elementary geometric justifications.
- Check solutions, detect invalid reasoning and communicate a conclusion with appropriate limits.

## 1. A solution is more than an answer

Mathematical problem solving begins by identifying what is known, what is unknown and what relationship connects them. A useful cycle is: understand the problem; represent it; choose a strategy; carry it out; check the result; explain what the result means. The representation might be a diagram, table, number line, equation, graph or organised list. Choose the simplest representation that preserves the important relationships.

Before calculating, identify assumptions. If a question says a vehicle travels at 40 km/h for 2 hours, it may intend constant speed. If that assumption is not stated, a calculation of 80 km is an average-model result, not proof of the actual route distance. Mathematical models answer a defined question under stated conditions.

## 2. Definitions, conjectures and proof

A **definition** establishes exactly what a term means. A **conjecture** is a statement believed to be true based on patterns or examples but not yet proven. An **example** can illustrate a statement. A **counterexample** is one valid case that disproves a universal claim. A **proof** is a logically connected argument showing that a statement follows from accepted definitions, assumptions and previously established results.

Checking ten examples does not prove a statement about every integer. One counterexample is enough to disprove a universal claim. For example, “all prime numbers are odd” is false because 2 is prime and even. But testing many odd primes does not prove that all other primes are odd; a proof needs reasoning about divisibility and the special role of 2.

## 3. Statements and logical structure

A conditional statement has the form “if P, then Q.” P is the hypothesis; Q is the conclusion. The converse is “if Q, then P” and is not automatically true. For example: if a whole number is divisible by 4, it is even. The converse “if a whole number is even, it is divisible by 4” is false; 6 is even but not divisible by 4.

A statement and its contrapositive are logically equivalent: “if P then Q” has contrapositive “if not Q, then not P.” The inverse (“if not P, then not Q”) and converse are not generally equivalent to the original. At this level, focus on identifying hypothesis, conclusion and counterexamples before formal symbolic logic.

## 4. Algebraic justification

An equation is a statement that two expressions have the same value. To solve an equation, apply the same valid operation to both sides, preserving equivalence. For `3x+5=20`, subtract 5 from both sides to get `3x=15`, then divide both sides by 3 to get x=5. Check in the original: `3(5)+5=20`. The check matters because an algebraic manipulation can be invalid or a copied sign can be wrong.

A proof by example is not enough for a universal algebraic identity. To show `(a+b)² = a²+2ab+b²`, expand using distributivity: `(a+b)(a+b)=a(a+b)+b(a+b)=a²+ab+ab+b²=a²+2ab+b²`. The argument works for all values for which the operations are defined because it uses general symbols and valid algebraic laws, not a few selected numbers.

## 5. Geometric reasoning

A geometric argument should name the property used. If two angles form a linear pair, their measures sum to 180°. If a triangle has two known angles, its third angle follows from the triangle angle-sum property. If two sides of a triangle are equal, the opposite angles are equal. A diagram may help discover a pattern, but the written justification must rely on stated facts and valid properties, not “it looks equal.”

A proof can be written as a sequence of statements and reasons. Example: a triangle has angles A=50° and B=60°. Since the interior angles of a triangle sum to 180°, C=180°−50°−60°=70°. The reason is the triangle angle-sum property; the calculation follows from it.

## 6. Worked examples

**Example A — Disprove a claim.** Claim: “For every integer n, n² is greater than n.” Try n=0: 0²=0, not greater. The universal claim is false. Also n=1 gives equality. One counterexample is sufficient.

**Example B — Test a converse.** Statement: “If a number is a multiple of 10, it is divisible by 5.” This is true because every multiple of 10 is 10k=5(2k). Converse: “If a number is divisible by 5, it is a multiple of 10.” Counterexample: 15 is divisible by 5 but not by 10. Therefore the converse is false.

**Example C — Solve and verify.** `4(x−2)=20`. Divide both sides by 4: x−2=5. Add 2: x=7. Check: 4(7−2)=4×5=20. The solution satisfies the original equation.

**Example D — Build a model and state its limits.** A club charges ৳100 registration plus ৳30 per visit. For v visits, total cost `C=100+30v`. At 4 visits, C=৳220. Domain: non-negative whole numbers of visits. This model assumes no discounts, taxes or changing fees.

## 7. Guided practice with feedback

1. A learner tests n=2, 4 and 6 and concludes “all even numbers are divisible by 4.” What is wrong? **Answer:** examples do not prove a universal claim; n=2 is already a counterexample.
2. Identify P and Q: “If a shape is a square, then it has four equal sides.” **Answer:** P=shape is a square; Q=it has four equal sides.
3. Is the converse true? **Answer:** No; a rhombus has four equal sides but need not have four right angles.
4. Solve `5x−7=18` and check. **Answer:** x=5; 25−7=18.
5. A triangle has angles 35° and 85°. Find the third and give the reason. **Answer:** 60°; triangle angle sum is 180°.

## 8. Independent practice

1. Disprove: “Every number divisible by 3 is odd.” Give the simplest counterexample you can.
2. A student says, “If it rains, the road is wet. The road is wet, therefore it rained.” Explain why this conclusion is not logically guaranteed; give another cause.
3. Write the converse of “If an integer is divisible by 6, it is divisible by 3.” Is the converse true? Justify.
4. Solve `2(3x+1)=20`. Show each equivalent step and verify in the original equation.
5. Prove algebraically that the sum of two consecutive integers is odd. Let the integers be n and n+1.
6. A rectangle has length x+3 and width x. Write expressions for perimeter and area. Explain why they are different types of measurement.
7. A claim says “the product of two odd integers is odd.” Test examples, then write a general proof using odd integers in the form 2a+1 and 2b+1.
8. A graph suggests that more study time is associated with higher scores. State one reason this does not by itself prove that study time caused the higher scores.

**Answer guidance:** (1) 6 is divisible by 3 and even. (2) A sprinkler or street washing can wet the road; affirming the consequent is invalid. (3) Converse: if divisible by 3 then divisible by 6; false, e.g. 9. (4) 6x+2=20; 6x=18; x=3; check 2(9+1)=20. (5) n+(n+1)=2n+1, which has the form of an odd integer. (6) P=2(x+3)+2x=4x+6 units; A=x(x+3)=x²+3x square units. (7) `(2a+1)(2b+1)=4ab+2a+2b+1=2(2ab+a+b)+1`, odd. (8) Other variables (prior knowledge, teaching quality, resources, selection effects) may affect both; association alone does not establish causation.

## 9. Common misconceptions and corrective moves

- **Examples are treated as proof.** Ask whether the argument covers every allowed case; search for a counterexample to universal claims.
- **Converse is assumed equivalent to the original conditional.** Write P→Q and Q→P separately, then test a counterexample.
- **A diagram's appearance is used as the reason.** Name the geometric property or given fact that justifies the step.
- **An equation is manipulated asymmetrically.** Require the same operation on both sides and verify in the original statement.
- **A result is reported without assumptions.** State the domain, units and conditions under which the model applies.
- **Correlation is described as causation.** Identify possible confounders and alternative explanations.

## 10. Assessment and mastery evidence

**Assessment A — logic and counterexample (6 points):** identify hypothesis/conclusion (1); distinguish a statement from its converse (2); disprove a universal claim with a valid counterexample (1); explain why examples alone do not prove universality (2).

**Assessment B — justification (8 points):** solve an equation with equivalent steps and check (2); provide a general algebraic proof (3); justify a geometric result with a named property (2); state a model assumption/limitation (1).

**Independent-performance standard:** at least 11/14, no invalid converse reasoning, and a proof that covers the stated general case. A numerically correct answer without a valid justification does not meet the proof criterion.

## 11. Transfer task

Choose a claim from a product advertisement, online discussion or everyday argument that uses numbers or a mathematical relationship. Translate it into a precise statement, identify assumptions, test examples and counterexamples, and decide what evidence would be needed for a proof or empirical conclusion. Separate mathematical certainty from claims that require real-world data.

## 12. Retrieval and retention plan

Same session: reconstruct one proof without notes and explain why each step follows. Next day: classify conditional/converse examples and disprove a universal claim. About one week later: produce a new algebraic proof and a geometric justification. About one month later: audit a real quantitative claim for assumptions, counterexamples and evidence quality. Adjust timing to actual performance.

## 13. Entry check and exit decision

The learner should manipulate simple expressions, solve linear equations and use basic angle/shape properties. Record distinct evidence for modelling, counterexample reasoning, algebraic proof and geometric justification. These are not interchangeable abilities.


# Batch 03 — Quality and validation record

## Scope covered

All four remaining Mathematics breadth-baseline modules have individual teaching content, entry assumptions, measurable outcomes, worked examples, guided practice with answers, independent practice with answer guidance, misconception feedback, analytic assessment criteria, transfer tasks and differentiated retrieval/retention plans.

## Internal checks performed

- Every module ID matches the existing 216-module registry.
- Each module has a distinct title, learning outcomes, prerequisite links, misconception set, assessment design and retention plan.
- Worked calculations and answer guidance were manually reasoned through and independently checked with arithmetic where applicable.
- Unit dimensions are distinguished for geometry and measurement.
- Conditions and edge cases are stated for exponent laws, roots, functions and logical claims.
- Resource links point to established free instructional references; they are supplementary, not a replacement for the authored lesson.
- No module is marked expert-approved, learner-validated or canonically mastered.

## Remaining validation outside this batch

1. Independent mathematics educator review.
2. Learner pilot to identify confusing wording, pacing and prerequisite gaps.
3. Resource-page availability and suitability recheck at deployment time.
4. Alignment review against the wider Mathematics pathway and later algebra, geometry, statistics and proof modules.
5. Full assessment-bank expansion and cross-module cumulative diagnostic.

**Release interpretation:** “Finished” here means the four authored baseline teaching units are complete as draft instructional artifacts and pass the stated internal checks. It does not mean the Mathematics discipline or ATHENA v1.0 has passed external review.
