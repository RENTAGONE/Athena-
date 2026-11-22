# Legacy Micro-skills — Preserved Decisions and Full Design Specification

**Status:** Working curriculum specification; draft pending instruction, evidence and safety review.
**Purpose:** Preserve the micro-skills explicitly selected in the original ATHENA planning conversations. These are not disposable examples and must remain in the v1.0 build.

## 1. Canonical preservation list

| Skill | ATHENA treatment | Retention / status model |
|---|---|---|
| Doomsday Algorithm | Mental calendar calculation | D2; delayed date-set checks |
| Visual Profiling → **Visual Observation** | Structured observation and uncertainty, not personality/threat profiling | D2; varied-scene checks |
| Memory Palace | Method of loci for ordered recall | D2; delayed recall and interference checks |
| Lucid-dream reality checks | Optional, sleep-safe awareness and dream recall | D2; exploratory, never required |
| Speed Reading | Flexible rate control with comprehension protection | D2; rate and comprehension measured separately |
| Morse Code | Basic send/receive | D3; distributed short practice |
| Rubik’s Cube 3×3 | Beginner solve, then optional speed/advanced methods | D2; cold solves on separate days |
| Locksport / lock picking | Owned transparent educational practice lock only | D2; legal/ethical scope is a hard invariant |
| Pen Spinning | Basic controlled rotation, then optional combos | D3; short dexterity practice |
| French Drop | Coin-vanish sleight for consensual performance | D3; repeatable clean performance |
| One-handed shuffle | Controlled packet shuffle | D3; comfort and clean repetitions |
| Faro shuffle | Introductory in/out faro and controlled interweave | D3; precision-focused practice |
| Coin Rolling | Finger roll and controlled transfer | D3; both-hand fluency tracked separately |
| Zippo trick | **Replaced** by safe lighter handling; no flame flourish | D4; safe habit, no stunt competency |
| Origami | Foundational folds and repeatable models | D2; reconstruct models after delay |
| Ambidexterity Basics | Long-term non-dominant-hand use in daily life | **Longitudinal continuation; never one-time conquered** |
| Signature Dish | One personally selected repeatable recipe | D2; repeat preparations and food-safety checks |
| Stadium Whistle | Controlled finger-assisted whistle and signalling | D3; short practice, hygiene and volume limits |
| Advanced Tie Knots | Selected everyday/decorative knot set | D2; exclude life-safety applications |
| CPR / AED | Certified practical pathway | D4; qualified course and renewal only |
| Heimlich / choking response | Certified practical pathway | D4; age-appropriate qualified instruction and practice |

The registry may add new skills, but must not silently remove or rename these user-selected items. Where a name changes for accuracy or safety, preserve the original label as an alias and explain the change.

## 2. Ambidexterity Basics: a longitudinal capability, not a badge

Ambidexterity Basics is explicitly different from a bounded trick. Its initial habit-building tasks are brushing teeth, operating doors and using a phone with the non-dominant hand. It is not a promise of equal two-hand performance, and it must not be marked complete after a short challenge.

### Data model requirements
- `progression_model: longitudinal_practice`
- `completion_mode: no_permanent_completion`
- `current_state`: `not_started`, `habit_forming`, `active_practice`, `maintained`, `paused`, `restarting`
- `practice_domains`: hygiene routine, doors/handles, phone interaction, handwriting/drawing, object manipulation, sport-specific use (optional)
- `handedness_context`: learner-declared dominant hand; do not infer from a single test
- `performance_dimensions`: accuracy, control, comfort, error rate, task time, fatigue/discomfort, real-world adoption
- `evidence`: dated task attempts and real-use observations, with context and hand used
- `maintenance`: user-selected everyday anchors and optional short deliberate drills

### Progression
1. **Baseline:** record current comfortable ability for each hand on simple, low-risk tasks.
2. **Habit formation:** choose one or two low-risk daily tasks; practise slowly with the non-dominant hand.
3. **Controlled expansion:** add another task only when the current one is comfortable and safe.
4. **Functional competence:** demonstrate reliable performance in several chosen everyday contexts.
5. **Long-term maintenance:** keep using the non-dominant hand in selected tasks; periodically reassess comfort, accuracy and usefulness.
6. **Optional specialization:** handwriting, drawing, musical technique or sport-specific bilateral skill are separate pathways, not assumed outcomes.

Never require non-dominant-hand use for dangerous tasks, hot/sharp tools, road use, emergency actions or precision work where switching would increase risk. Stop if pain or persistent strain develops. The aim is useful bilateral adaptability, not forced symmetry.

## 3. Skill-specific protocol requirements

Every item needs a complete protocol with: target outcome; prerequisites; equipment/environment; step-by-step practice; common errors; feedback method; independent test; delayed cold test; context-transfer task; maintenance profile; safety constraints; and evidence fields.

### Cognitive / memory
- **Doomsday Algorithm:** teach weekday anchors and year/month calculations in stages; include leap years, century exceptions and Gregorian scope; test unseen dates and require explanation, not rote answer memorisation.
- **Memory Palace:** teach familiar route selection, stable loci, image encoding, ordered retrieval and interference management; test delayed recall and distinguish memory performance from factual truth.
- **Speed Reading:** baseline rate and comprehension; practise previewing, purpose-driven skimming and normal-speed deep reading; report rate and comprehension separately; dense learning material defaults to comprehension.
- **Lucid-dream reality checks:** optional only; no sleep deprivation, forced awakenings or pressure to induce lucid dreams; stop if sleep or mental wellbeing worsens.
- **Visual Observation:** train description, spatial relations, change detection and uncertainty. Avoid claims that appearance reveals character, intent, criminality, health or other sensitive traits.

### Dexterity / performance
- **Rubik’s Cube:** notation and cube-state awareness → beginner layer method → independent cold solve → optional efficiency and speed pathway. Track solve validity and consistency before time.
- **Pen Spinning / Coin Rolling:** isolate the movement, use safe low-force repetitions, then link movements; track clean repetitions, drops and comfort.
- **French Drop:** explain the illusion, rehearse hand positioning and timing, test with consenting observers; explicitly prohibit theft, cheating and transactional deception.
- **One-handed / Faro shuffles:** start with packet control and card condition; progress from slow clean repetitions to consistency; do not equate a single lucky success with competence.
- **Origami:** crease vocabulary → alignment → base folds → model sequences → reconstruct from diagrams and memory.
- **Stadium Whistle:** hygiene, safe hand placement, short attempts, volume control and recovery; no prolonged maximal-volume forcing.

### Practical / household
- **Signature Dish:** select one recipe with accessible ingredients; teach mise en place, measurement, timing, sensory checks, food hygiene, allergen awareness and repeatability; supervised heat/knife work as appropriate.
- **Advanced Tie Knots:** define a finite recreational/everyday knot set; inspect structure and use limits; explicit exclusion of climbing, rescue, rigging and life-safety loads.
- **Safe lighter handling:** replace flame tricks; teach hazard recognition and safe storage only, with guardian permission/supervision; no ignition stunts.
- **Locksport:** educational ethics and transparent practice lock owned by learner; no real doors, other people's property, unknown locks, covert entry or security evasion.

### Safety-critical
- **CPR/AED and choking response:** ATHENA may provide course discovery, prerequisite knowledge and post-course recall prompts, but practical competency must come from current recognised instruction and qualified assessment. No text-only completion, no simulated self-certification, and no practice manoeuvres on another person. Record provider, course date, instructor assessment and renewal date where available.

## 4. Evidence states for micro-skills

Use separate states rather than a single “conquered” checkbox:
- `exposed` — encountered the skill.
- `guided_practice` — performs with demonstration, prompts or feedback.
- `initially_demonstrated` — meets initial independent test once.
- `repeatably_demonstrated` — meets it on separate occasions.
- `retained` — passes a delayed unaided check.
- `context_adaptable` — performs in a meaningfully varied context.
- `maintained` — meets the current standard during ongoing maintenance.
- `needs_revision` — current test shows a lapse; history remains intact.
- `certified_current` — reserved for skills with verifiable current external certification and practical assessment.

For longitudinal skills such as Ambidexterity Basics, use a parallel ongoing-practice state machine rather than forcing them through a terminal mastery state.

## 5. Annual refresh is not a universal promise

A one-hour yearly review may be enough to check some durable, low-risk procedures after repeated successful delayed tests. It does not guarantee retention. Dexterity, fluency, motor coordination and social performance often benefit from distributed short practice. Safety-critical capability follows current course/provider requirements. ATHENA should schedule from actual cold-test evidence and user context, not from a universal calendar.


## 6. Registry crosswalk and historical search aliases

The machine-readable registry stores historical user wording in `aliases` so prior decisions remain searchable. Examples: “Visual Profiling” resolves to the safer, evidence-bounded “Visual Observation” record; “Zippo Trick” resolves to safe lighter handling and explicitly does not preserve flame stunts; “Lock Picking” resolves to bounded locksport on an owned transparent practice lock; “Heimlich” resolves to a certified choking-response pathway.

The app-facing longitudinal state model is `06_REGISTRIES/LONGITUDINAL_MICRO_SKILL_STATE_MODEL_v1.0_WORKING.json`. It explicitly declares `terminal_mastery: false` for Ambidexterity Basics.
