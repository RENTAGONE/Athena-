# Micro-skill Retention, Relearning and Maintenance Policy

**Status:** Working policy for ATHENA Knowledge Base v1.0.  
**Scope:** Short, bounded capabilities tracked separately from the main discipline curriculum.

## 1. The promise ATHENA must not make

ATHENA must not tell a learner that a skill learned once will remain reliable forever, or that one hour of practice every year is universally sufficient. Retention varies with the type of capability, quality of initial learning, prior experience, retrieval history, context changes, and the performance standard required.

A skill may remain recognisable while speed, precision, confidence, safety judgement or performance under pressure has decayed. These are separate outcomes and should not be collapsed into a single “remembered” flag.

## 2. Four maintenance profiles

| Profile | Typical capability | Default approach | Annual-only refresh? |
|---|---|---|---|
| D1 — Durable routine | Simple low-risk routines and well-learned facts/procedures | Delayed unaided check; widen interval only after reliable performance | Possibly, if repeated delayed checks show durable performance |
| D2 — Moderate decay | Conceptual explanations and practical procedures | Periodic retrieval plus occasional varied-context performance | Sometimes, but only when the test standard remains met |
| D3 — Fluency / motor / social performance | Coordination, speech, typing, sport, musical and interpersonal performance | Short, more frequent practice; test accuracy and fluency separately | Usually insufficient to preserve peak fluency |
| D4 — Safety-critical | Emergency response and safety-critical procedures | Current qualified instruction, supervised practical assessment and required refreshers | Never treat one hour of solo annual revision as proof of readiness |

These profiles are planning defaults, not biological laws or fixed intervals. ATHENA should learn from observed performance rather than claim a precise forgetting curve for an individual.

## 3. Acquisition is not retention

A micro-skill can be introduced or made functional in a short burst, but “acquired” means only that the learner met a defined initial standard. It does not mean durable, flexible, safe or expert performance.

Use the following stages:

1. **Exposure:** the learner has encountered the skill.
2. **Guided practice:** the learner performs with prompts, demonstration or feedback.
3. **Initial independent performance:** the learner meets the target without step-by-step help.
4. **Delayed retention check:** the learner performs after a meaningful delay without rehearsing immediately beforehand.
5. **Context variation:** the learner adapts the skill to a changed but appropriate situation.
6. **Maintenance:** later checks or real use show that the required standard remains available.

The time needed varies. Acquisition estimates in the candidate registry are provisional planning estimates, not guarantees.

## 4. Review scheduling

For each skill, ATHENA should store:

- last successful unaided performance;
- time elapsed since that performance;
- accuracy, quality, speed and safety dimensions where relevant;
- prompts, hints or coaching required;
- context and equipment used;
- confidence before feedback;
- whether the attempt was a retrieval check, practice session or real-world use;
- next review rationale and user-adjustable timing.

Start with a conservative delayed check after initial learning. If performance is reliable, widen the interval gradually. If performance is weak, shorten the interval and prescribe targeted practice. Avoid one universal schedule and avoid pretending the scheduler predicts exact forgetting.

## 5. Lapse and relearning

A lapse does not delete or invalidate historical evidence. Preserve the original achievement, record the lapse and current performance, and set the present state to `needs_revision` when warranted. Successful relearning adds new evidence and may restore the current state. The history should show both the earlier capability and the later recovery.

## 6. What does “one hour per year” mean?

One hour once a year can be a reasonable *check-in* for some low-risk, already durable skills. It is not a reliable universal maintenance plan. For a coordination skill, one hour may restore some familiarity but not preserve continuous fluency. For a language or sport skill, short distributed use is generally more useful than a single annual block. For emergency skills, use current certified courses and practical refresh requirements.

ATHENA should let the learner test this empirically: attempt the skill cold after the planned interval, score it against the original rubric, and adjust the schedule. If the learner passes reliably across multiple cycles, the interval may be widened within safe limits.

## 7. Safety and scope

- CPR, AED use, choking response, bleeding control and similar emergency capabilities require recognised, current, hands-on instruction and qualified assessment. Reading or AI-generated questions cannot certify practical competence.
- Electrical, tool, repair, sport and physical skills must include age-appropriate equipment, environment and supervision constraints.
- Knot-tying practice is for ordinary low-risk use unless separately trained and assessed. A recreational knot skill must never be represented as competence for climbing, rescue, rigging or life-safety loads.
- ATHENA must distinguish knowledge of a safety procedure from the ability to execute it under pressure.

## 8. Evidence and user experience

A micro-skill record should show its target, test, last demonstrated date, current evidence state, retention profile, next check rationale and linked macro-skills. Do not use XP, streaks or a single mastery percentage. Make it easy to browse and practise a large library without implying that every item must be learned.


## 9. Longitudinal practice capabilities

Some micro-skills are not bounded acquisitions with a terminal completion state. Ambidexterity Basics is the explicit example: begin with non-dominant-hand brushing, door operation and phone use, then add optional domains over time. Track habit formation, active practice, maintained use, pauses and restarts. Preserve a history of performance across tasks; do not issue a permanent “conquered” state. Functional bilateral adaptability does not require equal performance between hands.

For longitudinal skills, the data model must support `progression_model: longitudinal_practice`, a non-terminal state machine, user-selected practice anchors, dated observations, context-specific performance and safe pause/restart. The scheduler should encourage sustainable use, not impose daily streaks.

## 10. Legacy skills and safety scope

Preserve the original ATHENA selections, including Rubik’s Cube 3×3, Origami, Locksport, Stadium Whistle, Doomsday Algorithm, Visual Observation, Memory Palace, optional lucid-dream reality checks, Speed Reading, Morse Code, Pen Spinning, French Drop, one-handed/Faro shuffles, Coin Rolling, Signature Dish, Advanced Everyday Tie Knots, Ambidexterity Basics, CPR/AED and choking response. The previous “Visual Profiling” label is corrected to structured visual observation; it must not teach personality or threat inference from appearance. The previous Zippo trick is replaced with safe lighter handling; no flame flourishes or ignition stunts. Locksport is confined to a learner-owned transparent educational practice lock with explicit ethical/legal boundaries.
