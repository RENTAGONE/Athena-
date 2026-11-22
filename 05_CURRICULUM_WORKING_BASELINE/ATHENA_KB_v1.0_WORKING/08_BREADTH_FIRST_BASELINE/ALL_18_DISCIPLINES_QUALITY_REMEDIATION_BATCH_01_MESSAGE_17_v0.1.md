# ATHENA — 18-Discipline Instructional Quality Remediation, Batch 01

**Production message:** 17  
**Version:** 0.1 working draft  
**Status:** Internally authored remediation; subject review and learner validation required  
**Coverage:** One deliberately bounded baseline module per discipline (18/18). Existing `BASE-*` identifiers are preserved. This is a first remediation slice, not completion of the 216-module baseline.

## How to use this batch

Each unit below supplements its matching baseline record. The baseline JSON remains unchanged. The unit is a draft learning experience: study the explanation, reproduce the worked reasoning, attempt the exercises without looking, and submit an explanation plus artefact where applicable. An answer key is supplied for self-checking; it is not an automatic mastery award. Where the subject involves physical, financial, cyber, health, or legal risk, use the stated boundary and obtain qualified adult/professional guidance as appropriate.

## Internal quality rubric

Each unit is judged on five dimensions, 0–3 each: (1) scope and observable outcomes; (2) conceptual explanation and worked reasoning; (3) practice and answer/feedback quality; (4) assessment and transfer alignment; (5) prerequisites, safety/ethics and retention. A score of 0 means absent, 1 outline-level, 2 usable draft with a material limitation, and 3 strong draft meeting the stated unit standard. Scores are internal editorial judgements, not expert ratings or learner outcomes. No unit is approved by this rubric alone.

---

## ENG — BASE-ENG-007: Debugging and testing

**Outcome.** Given a small program that fails, isolate a reproducible fault, form a testable hypothesis, make the smallest justified change, and demonstrate that the fix works without breaking a previously working case.

**Prerequisites.** Variables, control flow, functions, and the ability to run a program. A learner may use pseudocode if not yet coding.

**Core model.** Debugging is evidence-led fault isolation, not random editing. A useful cycle is: reproduce → minimise → observe → hypothesise → test → change → regression-test. A test case records input, expected result, actual result, and whether they match. Normal cases alone are insufficient; test boundaries and invalid inputs too.

**Worked example.** A function should return the larger of two values, but returns the second value every time. Test `(3, 8)` and `(8, 3)`. The first passes and the second fails. Inspect the comparison and find `if a < b: return b; return b`. The second return is wrong: change it to `return a`. Retest both orders and equal inputs `(4, 4)`. The equality case should return 4 whichever branch is used. The evidence is the failing test before the change and the full test set after it.

**Guided practice.** A total function adds item prices but skips the final item. First write a three-item test with expected total 60 and actual total 40. Inspect loop bounds; a range ending before the final index is a likely cause. Correct the boundary and test one item, three items, and an empty list (define whether empty total is zero).

**Independent task.** Diagnose a deliberately faulty percentage calculator. Submit three test cases, a minimal fix, and a regression test. **Answer guidance:** include 10% of 200 = 20, 0% of 200 = 0, and a boundary/invalid-input case; explain the chosen input domain.

**Misconceptions.** A program that runs is correct; changing several lines at once is efficient; one passing example proves the fix; an error message always identifies the root cause.

**Assessment and transfer.** Score reproducibility, hypothesis quality, minimality, test coverage and explanation (0–2 each). Transfer by debugging a spreadsheet formula or a small workflow, keeping the same evidence cycle. Retain by revisiting a previously fixed bug after a delay and predicting which test would catch a regression.

**Safety boundary.** Use a copy or version-control branch; do not experiment on production data, live payment systems, or another person's device/account.

## BIZ — BASE-BIZ-009: Unit economics

**Outcome.** Calculate contribution per sale, distinguish revenue from profit and cash, and decide what information is still needed before scaling an offer.

**Prerequisites.** Arithmetic, percentages, basic transaction records, and a defined product/service.

**Core model.** Revenue is the amount earned from sales before costs. Variable costs change with each unit sold. Contribution per unit = selling price − variable cost per unit. Contribution helps pay fixed costs; it is not the same as net profit. Break-even units = fixed costs ÷ contribution per unit, when contribution is positive and assumptions are stable.

**Worked example.** A digital item sells for ৳100. Each sale costs ৳25 in supplier/platform fees. Contribution is ৳75. If monthly fixed costs are ৳1,500, break-even is 1,500 ÷ 75 = 20 sales before tax, owner labour and other omitted costs. If the price falls to ৳80 while variable cost stays ৳25, contribution becomes ৳55 and break-even rises to 27.27, so at least 28 whole sales. This does not prove demand exists.

**Guided practice.** Price ৳250; variable delivery cost ৳90; monthly fixed cost ৳800. Contribution = ৳160; break-even = 5 sales. Ask what costs are missing: refunds, failed transactions, marketing, tax, labour, currency conversion and support time may matter.

**Independent task.** Build a one-page unit-economics sheet for a hypothetical lawful product. Show price, variable costs, contribution, fixed costs, break-even and three assumptions. **Answer guidance:** formulas must reconcile; label omitted costs rather than silently treating them as zero.

**Misconceptions.** Sales equal profit; cash received equals earned revenue; break-even guarantees a viable business; higher volume always improves profit.

**Assessment and transfer.** Evaluate calculation accuracy, cost classification, assumptions, sensitivity analysis and decision quality (0–2 each). Transfer to compare two service packages with different support time. Retain by recalculating after changing one cost input.

**Safety/ethics.** This is educational arithmetic, not investment, tax or legal advice. A minor should involve a trusted adult in real contracts, payments, customer data and compliance decisions. Never hide fees or misrepresent profitability.

## ELEC — BASE-ELEC-003: Measurement instruments

**Outcome.** Explain what a multimeter measurement means, choose a suitable mode/range, and identify unsafe or invalid measurement setups in a low-voltage learning context.

**Prerequisites.** Voltage, current, resistance, circuit symbols and basic electrical safety concepts.

**Core model.** A meter does not reveal a property without being connected in a way that measures it. Voltage is measured across two points (parallel). Current is measured through a circuit path (series) using the correct current input and range. Resistance/continuity is measured only on a de-energised circuit, with stored energy safely discharged. Meter jack, dial, range and lead placement must all match the measurement.

**Worked example.** To measure the voltage across a battery-powered low-voltage LED circuit, select DC voltage, place the black lead in COM and red lead in the voltage jack, then place probes across the two points of interest. The reading is a potential difference, not the current through the LED. Do not move the red lead to the current jack and place probes across the battery: that can create a short circuit.

**Guided practice.** Classify each task: battery voltage (parallel, DC V); current in a simple low-voltage circuit (series, correct fused current input, supervised); continuity of an unpowered wire (continuity mode, circuit isolated). Explain why resistance mode on a powered circuit is invalid.

**Independent task.** On paper, annotate a simple battery-resistor-LED schematic with safe voltage-measurement points and identify two incorrect meter setups. **Answer guidance:** voltage probes go across the component; never place a current-configured meter directly across a source.

**Misconceptions.** Voltage and current are measured the same way; continuity mode is harmless on live circuits; the meter's displayed number is always valid regardless of range/jacks.

**Assessment and transfer.** Score mode selection, connection logic, interpretation, hazard recognition and explanation (0–2 each). Transfer to reading a measurement procedure in a device manual.

**Safety boundary.** This unit is conceptual and limited to isolated, battery-powered extra-low-voltage educational circuits under competent adult supervision. Do not measure mains, wall outlets, power supplies, high-energy batteries, or unknown circuits. Do not perform live-current measurements without qualified supervision and appropriate equipment.

## FIN — BASE-FIN-008: Risk and uncertainty

**Outcome.** Separate uncertainty from loss exposure, identify concentration and liquidity risks, and avoid presenting uncertain returns as guaranteed.

**Prerequisites.** Percentages, basic budgeting, cash-flow concepts and arithmetic.

**Core model.** Risk is not one number. Relevant dimensions include the chance of loss, size of possible loss, timing, liquidity, counterparty reliability, fraud, inflation and concentration. Expected value can compare simplified scenarios, but it does not describe the full range of outcomes or guarantee what will happen. Money needed soon should not be exposed to large or illiquid risks.

**Worked example.** Option A has a 90% chance of gaining ৳100 and a 10% chance of losing ৳500. Expected change = 0.9×100 + 0.1×(−500) = ৳40. A positive expected value does not mean the loss is affordable or that the outcome is predictable. A learner with only ৳300 available cannot treat a possible ৳500 loss as acceptable merely because the average is positive.

**Guided practice.** Compare holding all savings in one volatile asset with keeping an emergency reserve separate. Identify concentration, liquidity and loss-capacity issues before discussing potential return.

**Independent task.** Write a risk register for a fictional savings goal: goal date, amount needed, acceptable loss (if any), access needs, fraud checks and unknowns. **Answer guidance:** do not invent a guaranteed rate; explain why time horizon and ability to absorb loss matter.

**Misconceptions.** Higher return is always better; diversification removes all risk; a past return predicts a future return; an average outcome describes every possible outcome.

**Assessment and transfer.** Score risk identification, scenario arithmetic, liquidity reasoning, uncertainty language and protective action (0–2 each). Transfer to assess a non-financial decision with uncertain outcomes.

**Safety/ethics.** Educational only; not personal financial advice. A young learner should not open accounts, trade, borrow, speculate in crypto or enter financial contracts without a parent/guardian and applicable legal checks. Do not share credentials or one-time codes.

## BODY — BASE-BODY-004: Homeostasis

**Outcome.** Explain homeostasis as regulated variables kept within workable ranges through feedback, and distinguish a negative-feedback loop from a simple one-way response.

**Prerequisites.** Cells, organs, basic nervous/endocrine roles and the idea of a variable changing over time.

**Core model.** A regulated system has a variable, a sensor/receptor, a control centre or coordinating process, effectors, and a response. Negative feedback opposes a deviation from a regulated range; it does not mean the response is bad. The body is dynamic: variables fluctuate, and regulation has limits. Not every biological process is a negative-feedback loop.

**Worked example.** During a rise in body temperature, temperature-sensitive systems detect the change. Responses such as sweating and increased skin blood flow can increase heat loss. As temperature moves back toward its regulated range, the drive for those responses decreases. The loop counters the initial deviation. This is a simplified model; real thermoregulation involves multiple pathways and context.

**Guided practice.** Map blood glucose regulation at a high level: rising glucose after a meal stimulates insulin release; insulin promotes uptake/storage; blood glucose tends to fall toward its regulated range. Identify variable, signal, effect and direction of response.

**Independent task.** Draw a feedback diagram for body temperature and write a short explanation of what happens if the response is insufficient. **Answer guidance:** state that the system may fail to maintain the range; do not infer a diagnosis from a single temperature reading.

**Misconceptions.** Homeostasis means an unchanging internal state; negative feedback is harmful; one hormone controls the whole system; a simplified diagram captures every detail.

**Assessment and transfer.** Score component identification, causal direction, feedback explanation, limits and accurate use of terms (0–2 each). Transfer to a non-biological thermostat system and identify where the analogy breaks.

**Safety boundary.** This is biology education, not diagnosis. Persistent or severe symptoms require a trusted adult and qualified health professional; do not attempt to alter medication or treatment based on this model.

## PSY — BASE-PSY-007: Biases and heuristics

**Outcome.** Identify a possible reasoning shortcut in a decision, generate a competing explanation, and use a check that could change the conclusion.

**Prerequisites.** Distinguish observation from interpretation; understand that people make decisions with incomplete information.

**Core model.** A heuristic is a shortcut that can be useful under time or information limits. A bias is a systematic tendency that can distort judgement in some contexts. Naming a bias is not proof that it occurred. A useful audit asks: what evidence supports this belief, what evidence would challenge it, what alternative explanation fits, and what decision rule should be used?

**Worked example.** A learner sees three posts saying a new app is excellent and concludes “everyone likes it.” Availability and selection effects may be involved: visible posts are not a representative sample, and unhappy users may be less visible. Better evidence would include a defined user group, a sampling method, negative experiences and reasons for non-use.

**Guided practice.** Someone buys a product because it costs more and assumes it must be better. Generate two alternative explanations (brand premium, marketing, scarcity) and identify a test: compare specifications and independent evidence against the actual need.

**Independent task.** Keep a decision journal for one low-stakes choice. Record initial belief, evidence, alternative explanation, confidence, and what later observation would update the belief. **Answer guidance:** avoid diagnosing yourself or others; describe the reasoning process, not a personality label.

**Misconceptions.** Knowing bias names makes a person immune; every disagreement is a bias; one counterexample disproves a broad pattern; confidence equals accuracy.

**Assessment and transfer.** Score evidence separation, plausible alternatives, falsifiable check, calibrated confidence and update (0–2 each). Transfer to evaluating a viral claim or business assumption.

**Ethics.** Do not use bias labels to shame, manipulate or dismiss another person. Psychological concepts are explanatory tools, not clinical diagnoses.

## AEST — BASE-AEST-008: Interface states

**Outcome.** Design coherent loading, empty, error, success and disabled states so users understand what happened and what action is available.

**Prerequisites.** Basic hierarchy, layout, colour/contrast and a defined user task.

**Core model.** An interface is not only its ideal populated screen. Every asynchronous or conditional task has states. A state should communicate status, preserve user input where possible, offer a meaningful next action, and avoid implying success before the system confirms it. State differences must not rely on colour alone.

**Worked example.** A user submits a form. Before response, disable duplicate submission only if the interface clearly indicates “Saving…” and prevents accidental loss. On confirmed success, show a confirmation and next step. On failure, preserve entered values, explain the problem in actionable language, and provide retry or support guidance. Do not show “Payment successful” merely because the button was clicked.

**Guided practice.** Design an empty order-history state. It should explain that no orders exist yet and offer a safe next action. Contrast it with an error state where orders could not be loaded; the latter must not falsely claim there are no orders.

**Independent task.** Create five annotated wireframes for one feature. For each, state trigger, message, available action and data-preservation rule. **Answer guidance:** loading ≠ empty; empty ≠ failed; disabled controls need a reason or clear context.

**Misconceptions.** A spinner solves every loading problem; an error message should blame the user; success can be optimistic for irreversible actions; colour alone communicates status.

**Assessment and transfer.** Score state coverage, truthful status, action clarity, accessibility and consistency (0–2 each). Transfer to a mobile upload flow with slow network and retry.

**Ethics/accessibility.** Avoid dark patterns, fake urgency and misleading confirmations. Provide text labels, visible focus, readable contrast and screen-reader-relevant status where applicable.

## WORK — BASE-WORK-007: Terminal foundations

**Outcome.** Navigate a controlled directory, inspect files, create a test folder, and explain a command before executing it.

**Prerequisites.** File/folder concepts and basic text entry. Use a sandbox or practice directory.

**Core model.** A shell reads commands in a current working directory. Relative paths are interpreted from that location; absolute paths identify a location from the filesystem root. Commands can read, create, modify or delete data. Before running an unfamiliar command, inspect its purpose, target path and destructive options. Quoting paths protects spaces and shell metacharacters.

**Worked example.** In a practice directory, `pwd` displays the current path; `ls` lists contents; `mkdir practice` creates a folder; `cd practice` enters it; `touch notes.txt` creates an empty file on common Unix-like shells. `ls` then confirms the file. These commands are not universal across every shell, so identify the environment first.

**Guided practice.** Create `athena-practice`, enter it, create `draft.txt`, and list the directory. Before each command, predict the effect. If the shell lacks `touch`, use the editor or documented equivalent.

**Independent task.** Make a folder tree for a fictional project and produce a listing. Explain which paths are relative and which are absolute. **Answer guidance:** do not run cleanup commands; demonstrate safe navigation and inspection only.

**Misconceptions.** The shell always starts in the same directory; `..` means the filesystem root; commands are identical on Windows, Linux and Android; a command copied from the internet is safe.

**Assessment and transfer.** Score navigation, path interpretation, prediction, verification and safe command selection (0–2 each). Transfer to a documented file-management task on another operating system.

**Safety boundary.** Practice in a disposable folder. Do not use recursive deletion, elevated privileges, disk-formatting commands or copied scripts on personal/system data. Back up important files first.

## ART — BASE-ART-004: Proportion and measurement

**Outcome.** Compare relative dimensions in an observed subject, construct a proportioned study, and revise it using measured relationships rather than isolated guesses.

**Prerequisites.** Observation, basic line control, simple geometric shapes and permission to use a reference image or object.

**Core model.** Proportion is the relationship between parts and whole. Choose a repeatable unit (for example, the object's width) and compare other dimensions against it. Sight-measuring with a pencil or using a grid can help, but the chosen viewpoint and alignment must remain consistent. Measurements guide observation; they do not replace it.

**Worked example.** A bottle appears about twice as tall as it is wide. If the drawing's width is 4 cm, begin with a height near 8 cm. Compare shoulder width, neck height and base width to the same reference unit. If the drawing looks too narrow, re-check the whole silhouette before detailing labels or reflections.

**Guided practice.** Draw a mug using three landmarks: top ellipse width, body height and handle projection. Mark their ratios before shading. Compare the sketch with the object from the same viewing position.

**Independent task.** Produce two 10-minute studies of the same simple object, one freehand and one using comparative measurement. Annotate three ratios and identify one remaining uncertainty. **Answer guidance:** judge relationships and consistency, not resemblance to a single ideal style.

**Misconceptions.** One universal body/object proportion fits all subjects; measurement guarantees accuracy; details can repair a wrong overall silhouette; perspective does not affect apparent proportion.

**Assessment and transfer.** Score landmark selection, ratio consistency, silhouette accuracy, revision rationale and observation notes (0–2 each). Transfer to a room/object layout sketch.

**Ethics/accessibility.** Use references lawfully and credit the source; do not present another artist's study as original work.

## ATH — BASE-ATH-008: Agility and deceleration

**Outcome.** Explain why controlled deceleration precedes a change of direction, identify basic movement-quality cues, and plan a low-risk progression without chasing maximal speed.

**Prerequisites.** Comfortable walking/jogging, basic balance and pain-free performance of simple bodyweight movements.

**Core model.** Agility includes perception and decision, not just fast feet. Deceleration requires reducing momentum and controlling body position before redirecting force. A safe progression moves from planned, low-speed movements to faster or reactive work only when technique and recovery are adequate. Surface, footwear, fatigue and available space change risk.

**Worked example.** In a planned 5-metre shuttle, the learner approaches at an easy jog, shortens steps before the line, lowers the centre of mass modestly, plants under control and pushes into the return direction. If the final step is long and the torso leans uncontrollably, reduce speed and increase stopping distance rather than forcing a sharper turn.

**Guided practice.** Walk through a wide figure-eight, then perform it at an easy jog if pain-free and space is clear. Observe balance, foot placement and whether the learner can stop on command. Rest between repetitions.

**Independent task.** Record a short side-view video of a planned low-speed turn (with consent and privacy). Note one controlled feature and one change for the next attempt. **Answer guidance:** quality and control matter more than time; do not compare performance to elite athletes.

**Misconceptions.** Agility is only ladder speed; lower stance always means better movement; fatigue proves a session worked; maximal cutting is a beginner drill.

**Assessment and transfer.** Score approach control, braking, balance, direction change and self-monitoring (0–2 each). Transfer to a sport-specific movement at a controlled speed.

**Safety boundary.** Warm up, use a dry non-slip surface, clear obstacles and stop for pain, dizziness or unusual symptoms. No maximal sprint/cutting tests, weighted drills or forced flexibility. A trusted adult/coach should supervise youth training; recovery and gradual progression take priority.

## PERF — BASE-PERF-006: Articulation and diction

**Outcome.** Improve intelligibility by coordinating consonant and vowel production at a comfortable pace without forcing the jaw, tongue or voice.

**Prerequisites.** Comfortable speaking voice, ability to notice syllables and basic breath awareness.

**Core model.** Articulation shapes speech sounds through coordinated movement of lips, tongue, jaw and soft palate. Diction is not the same as speaking loudly or exaggerating every sound. Clear speech depends on audience, language, rate, sound patterns and context. Warm, gentle practice is preferable to strain.

**Worked example.** Record a short sentence at a natural pace. Listen for one unclear consonant cluster. Practise the phrase slowly while keeping the jaw relaxed, then return gradually to conversational speed. Compare recordings for intelligibility, not for a supposedly perfect accent.

**Guided practice.** Speak a short phrase once slowly, once at normal speed and once while preserving clear word endings. If tension or hoarseness appears, stop and rest rather than repeating harder.

**Independent task.** Record a 30-second explanation of a familiar topic. Ask a willing listener which words were difficult to understand. Choose one specific sound or pacing adjustment and record again. **Answer guidance:** listener feedback should identify intelligibility, not ridicule accent or identity.

**Misconceptions.** Clear speech requires shouting; one accent is inherently correct; faster speech sounds more skilled; persistent hoarseness should be trained through.

**Assessment and transfer.** Score intelligibility, pacing, relaxed production, listener comprehension and reflective revision (0–2 each). Transfer to a short presentation or voice recording.

**Safety boundary.** Stop if there is pain, persistent hoarseness, loss of voice or vocal fatigue; seek advice from a qualified clinician or voice professional with a trusted adult. Avoid extreme range, prolonged shouting and forced imitation.

## MATH — BASE-MATH-009: Exponents, powers and roots

**Outcome.** Interpret integer powers, apply exponent laws only under their conditions, distinguish a principal square root from the solutions of a squared equation, and use scientific notation.

**Prerequisites.** Multiplication/division, fractions, negative numbers and simple equations.

**Core explanation.** For a positive integer `n`, `a^n` means multiplying `a` by itself `n` times. Thus `2^4 = 2×2×2×2 = 16`. For non-zero `a`, `a^0 = 1` and `a^{-n}=1/a^n`. Product rule `a^m·a^n=a^{m+n}` and quotient rule `a^m/a^n=a^{m−n}` require the same non-zero base for the quotient; `(a^m)^n=a^{mn}`. The principal square root `√9` is 3, while `x²=9` has two solutions, 3 and −3. Scientific notation writes a number as `c×10^n`, with `1≤|c|<10` for non-zero values.

**Worked examples.** `3²×3⁴=3⁶=729`. `10⁻³=1/1000=0.001`. `√25=5`, but solving `x²=25` gives `x=±5`. `4,500,000 = 4.5×10⁶`.

**Guided practice with answers.** (1) `2³=8`; (2) `5⁰=1`; (3) `2⁻²=1/4`; (4) `√36=6`; (5) `x²=36` gives `x=±6`; (6) `0.00072=7.2×10⁻⁴`.

**Independent practice.** Simplify `4²×4³`; express `1/100` as a power of ten; estimate `√50` between consecutive integers; explain why `√(a+b)` generally is not `√a+√b`. **Answer guidance:** `4⁵=1024`; `10⁻²`; between 7 and 8; use a counterexample such as `√(9+16)=5` while `3+4=7`.

**Misconceptions.** `a^m+a^n=a^{m+n}`; `a^{-n}` is negative; `√x` has two values; exponent laws apply across unlike bases without rewriting.

**Assessment and transfer.** Score meaning, valid law selection, root distinction, estimation and notation (0–2 each). Transfer to comparing file sizes, distances or scientific measurements across scales. Retain with mixed retrieval after a delay.

## CYBER — BASE-CYBER-004: Authentication and authorization

**Outcome.** Distinguish identity verification from permission, identify common authentication factors, and explain why account access should be limited and recoverable.

**Prerequisites.** Accounts, passwords, devices and basic privacy concepts.

**Core model.** Authentication asks “who or what are you?” Authorization asks “what are you allowed to do?” A password, passkey or authenticator factor can help authenticate; a role or permission policy determines allowed actions. Multi-factor authentication uses different factor categories, not merely two passwords. Recovery methods are part of account security and can become an attack path.

**Worked example.** A student signs into a school portal with a passkey. The system authenticates the account. The student role may view assignments but cannot edit school-wide settings. A teacher role may have additional permissions. Being authenticated does not mean every action is authorized.

**Guided practice.** Classify: password check (authentication); read-only student access (authorization); one-time code sent to a separate device (additional authentication factor, with phishing/SIM risks depending on method); administrator permission to delete records (authorization).

**Independent task.** Draw an account access matrix for learner, teacher and administrator roles. Give each only the minimum actions needed and identify a secure recovery path. **Answer guidance:** avoid shared administrator credentials; review who can reset accounts and how changes are logged.

**Misconceptions.** A logged-in user is trusted with everything; two passwords are MFA; SMS codes are invulnerable; account recovery is less important than login.

**Assessment and transfer.** Score terminology, factor classification, least privilege, recovery analysis and threat awareness (0–2 each). Transfer to permissions in a local file or app.

**Safety boundary.** Use fictional accounts and diagrams. Never test on another person's account, bypass controls, request their codes or store real credentials in a learning document. Only the account owner/admin should change access.

## LANG — BASE-LANG-009: Bangla-English technical bridging

**Outcome.** Explain a technical concept accurately in Bangla and English, preserve its meaning across languages, and flag terms that do not have a clean one-word equivalent.

**Prerequisites.** Basic comprehension in both languages and a short technical text with known context.

**Core model.** Translation is meaning transfer, not word substitution. A technical term may need a borrowed term, a descriptive phrase, an example, or a definition. Keep the concept stable while adapting sentence structure and audience vocabulary. When a term is ambiguous, retain the original term in parentheses and explain it.

**Worked example.** “Voltage” is commonly rendered as “ভোল্টেজ”; explaining it as “দুই বিন্দুর মধ্যে বৈদ্যুতিক বিভব পার্থক্য” gives conceptual meaning. Replacing it with “কারেন্ট” is incorrect because current is a different quantity. A bilingual explanation should state the distinction rather than merely list translations.

**Guided practice.** Explain “authentication” and “authorization” in Bangla using one example. Suggested distinction: পরিচয় যাচাই বনাম কোন কাজ করার অনুমতি নির্ধারণ. Keep the English terms beside the Bangla phrases until the distinction is secure.

**Independent task.** Choose five terms from a science or computing lesson. Create a two-column glossary with definition, example, common confusion and source context. Ask a bilingual reader to identify any meaning drift. **Answer guidance:** more than one Bangla phrase may be acceptable if the concept remains accurate.

**Misconceptions.** Every English term has one exact Bangla equivalent; transliteration is a definition; literal translation always preserves grammar and meaning; technical vocabulary is evidence of understanding.

**Assessment and transfer.** Score conceptual accuracy, clarity in both languages, context, ambiguity handling and example quality (0–2 each). Transfer to explaining a textbook diagram to a family member without losing the scientific relationship.

**Ethics.** Respect dialect and language variation; do not treat accent or vocabulary prestige as intelligence.

## RES — BASE-RES-003: Source credibility

**Outcome.** Evaluate a source using its authority, evidence, method, currency, purpose and conflicts, then state what it can and cannot support.

**Prerequisites.** A focused question, basic search skills and ability to distinguish a claim from supporting evidence.

**Core model.** Credibility is claim- and context-dependent. A government page may be authoritative for its own policy but not neutral evidence about every outcome. A peer-reviewed article can still have limitations. Check who produced the source, what evidence it presents, how the evidence was obtained, whether it is current for the question, why it was published, and who funded or benefits from it.

**Worked example.** A product page claims “90% improvement.” Before accepting it, ask: improvement in what measure, compared with what, among whom, over what period, and according to whose study? A marketing page may establish the manufacturer's claim, but not independently verify its truth.

**Guided practice.** Compare a textbook chapter, a government information page and a social-media post for a question about a public safety rule. Identify which source is best for the current official rule and which may provide lived experience but needs corroboration.

**Independent task.** Build a source-evaluation table for three sources on one low-risk question. Record exact claim, source type, evidence/method, date, limitation and intended use. **Answer guidance:** do not rank sources by domain name alone; explain fit to the specific claim.

**Misconceptions.** Search ranking equals reliability; citations guarantee correctness; a source is either fully trustworthy or useless; recent is always better than methodologically sound.

**Assessment and transfer.** Score source identification, evidence inspection, method critique, currency/context and calibrated conclusion (0–2 each). Transfer to evaluating a viral statistic.

**Ethics.** Do not collect private data or contact people for research without appropriate consent and adult/qualified oversight. Cite sources and distinguish reporting from inference.

## INDEP — BASE-INDEP-004: Food safety

**Outcome.** Identify common contamination routes and apply safe separation, handwashing, storage and cooking guidance using authoritative local instructions.

**Prerequisites.** Basic kitchen hygiene, reading labels and ability to ask an adult for help.

**Core model.** Food can become unsafe through biological, chemical or physical contamination. Raw and ready-to-eat foods should be kept separate; hands, utensils and surfaces must be cleaned; food should be stored and cooked according to reliable temperature/time guidance. Smell and appearance cannot reliably prove that food is safe. Local climate and power interruptions can make storage especially important.

**Worked example.** Raw chicken is prepared on a board. Using the same unwashed board for salad can transfer harmful microbes. Keep raw items separate, wash hands and clean/sanitise surfaces and utensils as directed by product instructions. Refrigerate perishable foods promptly; do not leave them out because they “still smell fine.”

**Guided practice.** Identify hazards in a meal workflow: raw meat above uncovered cooked food in a fridge; shared knife; unwashed hands; cooked rice left warm for many hours. Propose separation, cleaning and prompt safe storage; ask an adult to verify local storage guidance.

**Independent task.** Create a kitchen checklist for one simple meal: handwashing, clean surface, raw/ready-to-eat separation, cooking, storage and cleanup. **Answer guidance:** use current food-safety guidance for exact temperatures and time limits; this unit intentionally does not invent a universal number for every food or appliance.

**Misconceptions.** Food is safe if it smells normal; washing raw poultry makes it safer; reheating always reverses unsafe storage; all foods have the same storage rules.

**Assessment and transfer.** Score hazard recognition, separation, hygiene sequence, storage decision and source use (0–2 each). Transfer to packing a lunch safely.

**Safety boundary.** Youth learners should use knives, heat and appliances only with appropriate adult supervision. When in doubt about potentially unsafe food, do not taste-test it; ask a responsible adult and follow local food-safety authority guidance.

## LEAD — BASE-LEAD-006: Feedback and coaching

**Outcome.** Give feedback tied to an observable behaviour and agreed goal, invite the recipient's perspective, and agree on a realistic next experiment.

**Prerequisites.** Listening, clear communication, a shared task and basic respect for consent and boundaries.

**Core model.** Useful feedback is specific, timely, actionable and proportionate. Separate observation from interpretation: “The report was submitted two days after the agreed date” is observable; “you are lazy” is a judgement. Ask what happened before prescribing a solution. Coaching supports the other person's reasoning; it is not control or humiliation.

**Worked example.** Instead of “Your presentation was bad,” say: “In the first two minutes, the main question was not stated, so I was unsure what to listen for. Would opening with the question help? What were you aiming for?” The recipient can accept, reject or adapt the suggestion. Agree on one change and a way to review it.

**Guided practice.** Rewrite “You never communicate” as a specific observation and request. Example: “I did not receive an update before the deadline yesterday. Can we agree on a short message if a task is at risk?”

**Independent task.** Conduct a feedback conversation about a low-stakes shared task. Record the agreed goal, observation, question, proposed experiment and review date. **Answer guidance:** do not record private details without consent; a recipient may decline feedback.

**Misconceptions.** Feedback means criticism; praise must be vague; a leader should always have the answer; directness excuses disrespect; agreement means the feedback was correct.

**Assessment and transfer.** Score specificity, evidence/interpretation separation, listening, actionable next step and respect for autonomy (0–2 each). Transfer to peer review of a project.

**Ethics.** Avoid public humiliation, coercion, discriminatory assumptions and feedback outside one's role or competence. Escalate safeguarding or serious misconduct concerns to an appropriate trusted adult/authority rather than attempting to investigate alone.

## COMM — BASE-COMM-008: Argument and reasoning

**Outcome.** Present a claim supported by relevant reasons and evidence, explain the warrant connecting them, and acknowledge a meaningful limitation or counterargument.

**Prerequisites.** Clear sentence construction, audience awareness and basic source evaluation.

**Core model.** An argument is not merely a strong opinion. It includes a claim, reasons, evidence and a warrant (why the evidence supports the claim). A counterargument identifies a serious alternative or limitation; responding to it improves precision. Evidence must match the scope of the claim.

**Worked example.** Claim: “Our club should schedule one weekly beginner session.” Reason: new members need a lower-pressure entry point. Evidence: attendance records show beginners leave after the first session more often than returning members. Warrant: if beginners face a skill gap, a separate introductory session may improve access. Limitation: attendance records alone do not prove why people leave. A short voluntary survey could test the explanation.

**Guided practice.** Improve “Phones are bad for learning” by narrowing the claim: “Notifications during independent problem-solving can interrupt concentration.” Add evidence from a suitable study or a small transparent classroom observation, and state its limits.

**Independent task.** Write a 250-word argument on a low-stakes school or project decision. Mark claim, reasons, evidence, warrant, counterargument and limitation. **Answer guidance:** avoid fabricated statistics; if evidence is unavailable, label the argument as a hypothesis rather than a proven conclusion.

**Misconceptions.** More evidence always makes an argument stronger; a counterargument weakens the writer; confident language substitutes for evidence; correlation proves causation.

**Assessment and transfer.** Score claim precision, evidence relevance, warrant validity, counterargument fairness and limitation honesty (0–2 each). Transfer to a short oral explanation or proposal.

**Ethics.** Do not misquote, cherry-pick, conceal conflicts or use personal attacks. Represent opposing positions in a form their proponents would recognise.

---

## Batch-wide editorial findings and next remediation priorities

1. The 216-record baseline remains a curriculum map, not a set of completed lessons. Its repeated generic metadata is still a substantive defect; this batch does not rewrite the registry fields.
2. This batch adds one usable draft unit per discipline. It does not fill the remaining 198 non-Mathematics outline modules or the many gaps within the 12 selected disciplines.
3. Units with elevated safety sensitivity (ELEC, FIN, BODY, ATH, PERF, CYBER, INDEP) have explicit scope boundaries, but these are not qualified safety reviews.
4. The next breadth-first batches should author the next one or two highest-priority modules per discipline, then run subject-specific factual checks and learner pilots before expanding volume.
5. Baseline prerequisites are mostly sequence suggestions rather than validated hard gates. This batch lists practical entry assumptions but does not modify canonical prerequisite edges.

## Status declaration

All 18 units are internally authored draft material. The rubric scores and review findings are editorial triage only. No external subject expert, safeguarding professional, accessibility specialist, learner pilot, or independent second reviewer is claimed. No unit awards mastery. Original baseline records and stable identifiers remain unchanged.
