# ATHENA Wave 04 — Retention & Skill-Acquisition Engineering v1.0

**Scope:** all 156 registered micro-skills. **Status:** design proposal; no learner performance data, calibrated decay curves or expert signoff claimed.

## 1. Baseline retained

The existing integration contains 156 records: {'D1': 6, 'D2': 66, 'D3': 67, 'D4': 17}. The four D1–D4 profiles are retained. No candidate's profile is silently changed in this wave.

## 2. Core model

Retention is not a single remembered/not-remembered flag. Track acquisition, current independent performance, retention after delay, context adaptation and maintenance separately. Preserve historical evidence when performance lapses.

### Attempt types

- `practice`: deliberate rehearsal; does not itself prove retention.
- `retrieval_check`: delayed unaided attempt after a gap.
- `transfer_check`: performance in a changed but appropriate context.
- `real_world_use`: authentic use; record context and risk.

### Evidence dimensions

Each skill has tailored dimensions in the JSON rules. Do not collapse accuracy, quality, speed, safety and confidence into one score. For D4, the dimensions are hazard recognition, stop/escalate decisions and external training status; no ATHENA self-certification.

## 3. Scheduling policy

1. Establish an initial task-specific independent performance baseline.
2. Schedule a delayed check after a meaningful gap; the system may suggest a timing, but must record the rationale and allow user adjustment.
3. If performance remains reliable, widen the interval gradually. Require more than one successful delayed check before large expansions.
4. If performance falls below criterion, retain historical success, set current state to `needs_revision`, identify the failed dimension and prescribe targeted relearning.
5. Retest after relearning using a fresh example; record recovery as a new event.
6. If the task context, tool, standard or risk changes, trigger a context review rather than assuming old evidence transfers.

## 4. Profile-specific policy

| Profile | Intended class | Scheduling behaviour | Safety interpretation |
|---|---|---|---|
| D1 | Durable low-risk routines | Delayed checks; widen cautiously after repeated success | Annual-only refresh is not automatic; only consider after durable evidence |
| D2 | Moderate decay | Periodic retrieval plus varied-context checks | No fixed calendar; task-specific criteria |
| D3 | Fluency, motor, social and performance skills | Short distributed practice; check quality and speed separately | One annual session usually cannot preserve fluency; protect recovery |
| D4 | Safety-critical | Scenario awareness plus external training status | Qualified current training is required; never self-certify |

## 5. Scheduler decision logic

```text
on_skill_attempt(skill, attempt):
  append immutable evidence event
  if skill.profile == D4:
    update awareness/readiness record only
    require external provider evidence for practical qualification
    never schedule hazardous solo practice
  else:
    compare each required dimension with task-specific criterion
    if attempt is practice:
      do not award retention state
    if attempt is delayed retrieval or transfer:
      if any critical dimension fails:
        current_state = needs_revision
        schedule targeted relearning + later retest
      else if this is first delayed success:
        schedule another delayed/context check
      else:
        widen interval conservatively
    if context/tool/standard changed:
      schedule context-specific reassessment
```

## 6. Data model requirements

- Immutable `SKILL_EVIDENCE_EVENT` history; no destructive overwrite.
- Separate current state from historical best/previous achievements.
- Store attempt type, timestamp, context, prompt level, dimension scores, confidence, feedback, safety stop, evidence reference and next-review rationale.
- Support user-adjustable reminders, snooze, pause and opt-out; no streak penalties.
- Support longitudinal practice tracks with non-terminal progression and pause/restart.
- Allow external qualification records with issuer, course, date, expiry/refresh rule and verification state; do not treat uploaded certificate image alone as proof without the applicable verification process.
- Keep scheduler recommendations explainable and exportable.

## 7. Special cases

- **Longitudinal practice:** ambidexterity is ongoing, non-terminal, context-specific practice. No “conquered forever” state.
- **Sleep-related optional skill:** no sleep restriction, alarms, supplements or intentional disruption; pause if wellbeing is affected.
- **Physical performance:** use warm-up, recovery and pain stop rules; distinguish performance decline from fatigue/injury.
- **Creative performance:** assess intentional choices and repeatability, not subjective taste alone.
- **D4 safety pathways:** CPR/AED, choking response and emergency practical skills remain certified-course pathways; ATHENA can track learning goals and course readiness, not competence.

## 8. Calibration plan for after app availability

1. Instrument a small pilot cohort and capture baseline, delayed check and context variation.
2. Examine task-level pass/fail patterns and false-positive/false-negative mastery decisions.
3. Calibrate interval expansion by skill family and risk; do not fit one universal forgetting curve.
4. Compare suggested review timing with actual recall/performance and user burden.
5. Require expert review for D4 and high-consequence skills before enabling practical learning workflows.
6. Keep the scheduler in recommendation mode until calibration and safety gates are satisfied.

## 9. Per-skill rules

### MS-01-001 — Active recall from a blank page (D1)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** After initial independent performance, schedule a delayed unaided check chosen by the learner/system from the the task forgetting risk and consequence; do not hard-code annual review.
- **If pass:** If performance is reliable on more than one delayed check and low-risk, widen the interval gradually; use event-triggered refresh after a long gap or context change.
- **If fail:** Identify the smallest missing component, do a brief targeted relearn, then retest later with a changed example.
- **Maintenance:** Occasional use or event-triggered check may suffice only after repeated delayed success.

### MS-01-002 — Confidence calibration (D2)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-01-003 — Explain a concept simply (D2)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-01-004 — Build a useful analogy (D2)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-01-005 — Spot a hidden assumption (D2)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-01-006 — Separate fact, inference, and opinion (D2)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-01-007 — Create a retrieval prompt (D1)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** After initial independent performance, schedule a delayed unaided check chosen by the learner/system from the the task forgetting risk and consequence; do not hard-code annual review.
- **If pass:** If performance is reliable on more than one delayed check and low-risk, widen the interval gradually; use event-triggered refresh after a long gap or context change.
- **If fail:** Identify the smallest missing component, do a brief targeted relearn, then retest later with a changed example.
- **Maintenance:** Occasional use or event-triggered check may suffice only after repeated delayed success.

### MS-01-008 — Error log analysis (D2)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-01-009 — Estimate before calculating (D1)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** After initial independent performance, schedule a delayed unaided check chosen by the learner/system from the the task forgetting risk and consequence; do not hard-code annual review.
- **If pass:** If performance is reliable on more than one delayed check and low-risk, widen the interval gradually; use event-triggered refresh after a long gap or context change.
- **If fail:** Identify the smallest missing component, do a brief targeted relearn, then retest later with a changed example.
- **Maintenance:** Occasional use or event-triggered check may suffice only after repeated delayed success.

### MS-01-010 — Chunk a procedure (D2)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-02-001 — Ambidexterity Basics (longitudinal non-dominant-hand use) (D3)
- **Dimensions:** accuracy, smoothness, consistency, speed_if_relevant, bilateral_or_context_adaptation
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-02-002 — Coin Rolling (finger roll and controlled transfer) (D3)
- **Dimensions:** accuracy, smoothness, consistency, speed_if_relevant, bilateral_or_context_adaptation
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-02-003 — Pen Spinning (safe basic rotations) (D3)
- **Dimensions:** accuracy, smoothness, consistency, speed_if_relevant, bilateral_or_context_adaptation
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-02-004 — Everyday Knot Tying (foundational knots) (D2)
- **Dimensions:** accuracy, smoothness, consistency, speed_if_relevant, bilateral_or_context_adaptation
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-02-005 — Knot tying: bowline (D2)
- **Dimensions:** accuracy, smoothness, consistency, speed_if_relevant, bilateral_or_context_adaptation
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-02-006 — Origami (foundational folds and model sequence) (D2)
- **Dimensions:** accuracy, smoothness, consistency, speed_if_relevant, bilateral_or_context_adaptation
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-02-007 — Handwriting legibility under time (D3)
- **Dimensions:** accuracy, smoothness, consistency, speed_if_relevant, bilateral_or_context_adaptation
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-02-008 — Keyboard touch-typing home row (D3)
- **Dimensions:** accuracy, smoothness, consistency, speed_if_relevant, bilateral_or_context_adaptation
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-02-009 — Mouse / trackpad precision (D3)
- **Dimensions:** accuracy, smoothness, consistency, speed_if_relevant, bilateral_or_context_adaptation
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-02-010 — Basic ball wall pass control (D3)
- **Dimensions:** accuracy, smoothness, consistency, speed_if_relevant, bilateral_or_context_adaptation
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-03-001 — Fold a T-shirt consistently (D1)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** After initial independent performance, schedule a delayed unaided check chosen by the learner/system from the the task forgetting risk and consequence; do not hard-code annual review.
- **If pass:** If performance is reliable on more than one delayed check and low-risk, widen the interval gradually; use event-triggered refresh after a long gap or context change.
- **If fail:** Identify the smallest missing component, do a brief targeted relearn, then retest later with a changed example.
- **Maintenance:** Occasional use or event-triggered check may suffice only after repeated delayed success.

### MS-03-002 — Pack a small bag by checklist (D2)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-03-003 — Sew on a button (D2)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-03-004 — Tie shoelaces securely (D1)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** After initial independent performance, schedule a delayed unaided check chosen by the learner/system from the the task forgetting risk and consequence; do not hard-code annual review.
- **If pass:** If performance is reliable on more than one delayed check and low-risk, widen the interval gradually; use event-triggered refresh after a long gap or context change.
- **If fail:** Identify the smallest missing component, do a brief targeted relearn, then retest later with a changed example.
- **Maintenance:** Occasional use or event-triggered check may suffice only after repeated delayed success.

### MS-03-005 — Read a measuring tape (D2)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-03-006 — Use a spirit level (D2)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-03-007 — Basic screwdriver selection (D2)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-03-008 — Organise a digital folder (D2)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-03-009 — Make a simple spreadsheet table (D2)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-03-010 — Read a public transport route (D3)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-04-001 — Introduce yourself clearly (D3)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-04-002 — Ask a precise question (D2)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-04-003 — Active listening summary (D3)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-04-004 — Give specific feedback (D3)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-04-005 — Disagree respectfully (D3)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-04-006 — Speak for one minute without notes (D3)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-04-007 — Summarise a long message (D2)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-04-008 — Read aloud with punctuation (D3)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-04-009 — Negotiate a simple agreement (D3)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-04-010 — Write a concise professional message (D2)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-05-001 — Use keyboard shortcuts safely (D2)
- **Dimensions:** correctness, reproducibility, safe_operation, error_recovery, transfer_to_new_example
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-05-002 — Search with exact phrases (D2)
- **Dimensions:** correctness, reproducibility, safe_operation, error_recovery, transfer_to_new_example
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-05-003 — Evaluate a source quickly (D2)
- **Dimensions:** correctness, reproducibility, safe_operation, error_recovery, transfer_to_new_example
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-05-004 — Capture a reproducible bug report (D2)
- **Dimensions:** correctness, reproducibility, safe_operation, error_recovery, transfer_to_new_example
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-05-005 — Use Git status and diff (D2)
- **Dimensions:** correctness, reproducibility, safe_operation, error_recovery, transfer_to_new_example
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-05-006 — Create a strong unique passphrase (D2)
- **Dimensions:** correctness, reproducibility, safe_operation, error_recovery, transfer_to_new_example
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-05-007 — Recognise phishing indicators (D3)
- **Dimensions:** correctness, reproducibility, safe_operation, error_recovery, transfer_to_new_example
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-05-008 — Back up a file and verify restore (D2)
- **Dimensions:** correctness, reproducibility, safe_operation, error_recovery, transfer_to_new_example
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-05-009 — Use a terminal safely (D3)
- **Dimensions:** correctness, reproducibility, safe_operation, error_recovery, transfer_to_new_example
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-05-010 — Read a simple JSON object (D2)
- **Dimensions:** correctness, reproducibility, safe_operation, error_recovery, transfer_to_new_example
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-06-001 — Notice three levels of visual hierarchy (D2)
- **Dimensions:** observation_accuracy, intentional_choice, technical_execution, explanation_of_choice, variation_across_examples
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-06-002 — Frame a phone photograph (D3)
- **Dimensions:** observation_accuracy, intentional_choice, technical_execution, explanation_of_choice, variation_across_examples
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-06-003 — Lock focus and exposure on phone (D3)
- **Dimensions:** observation_accuracy, intentional_choice, technical_execution, explanation_of_choice, variation_across_examples
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-06-004 — Use natural light direction (D3)
- **Dimensions:** observation_accuracy, intentional_choice, technical_execution, explanation_of_choice, variation_across_examples
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-06-005 — Sketch basic 3D forms (D3)
- **Dimensions:** observation_accuracy, intentional_choice, technical_execution, explanation_of_choice, variation_across_examples
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-06-006 — Identify dominant rhythm (D3)
- **Dimensions:** observation_accuracy, intentional_choice, technical_execution, explanation_of_choice, variation_across_examples
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-06-007 — Match a pitch by ear (D3)
- **Dimensions:** observation_accuracy, intentional_choice, technical_execution, explanation_of_choice, variation_across_examples
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-06-008 — Controlled breathing for speech (D3)
- **Dimensions:** observation_accuracy, intentional_choice, technical_execution, explanation_of_choice, variation_across_examples
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-06-009 — Observe a subject before drawing (D3)
- **Dimensions:** observation_accuracy, intentional_choice, technical_execution, explanation_of_choice, variation_across_examples
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-06-010 — Spot color temperature shifts (D2)
- **Dimensions:** observation_accuracy, intentional_choice, technical_execution, explanation_of_choice, variation_across_examples
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-07-001 — Identify local emergency contact route (D4)
- **Dimensions:** hazard_recognition, stop_or_escalate_decision, correct_contact_or_supervision_route, current_external_training_status
- **Delayed-check policy:** Knowledge-only scenario check plus current external course/certification status where relevant. Do not schedule a self-administered practical competency test.
- **If pass:** ATHENA may show awareness/readiness status only. Practical readiness follows the recognised provider’s current training and refresher requirements.
- **If fail:** Escalate to guardian/qualified instructor and current official guidance; never prescribe solo practice for hazardous tasks.
- **Maintenance:** Follow applicable certified training, supervision and external refresh requirements; annual self-study is never proof of readiness.

### MS-07-002 — Check a scene for immediate hazards (D4)
- **Dimensions:** hazard_recognition, stop_or_escalate_decision, correct_contact_or_supervision_route, current_external_training_status
- **Delayed-check policy:** Knowledge-only scenario check plus current external course/certification status where relevant. Do not schedule a self-administered practical competency test.
- **If pass:** ATHENA may show awareness/readiness status only. Practical readiness follows the recognised provider’s current training and refresher requirements.
- **If fail:** Escalate to guardian/qualified instructor and current official guidance; never prescribe solo practice for hazardous tasks.
- **Maintenance:** Follow applicable certified training, supervision and external refresh requirements; annual self-study is never proof of readiness.

### MS-07-003 — Communicate an emergency clearly (D4)
- **Dimensions:** hazard_recognition, stop_or_escalate_decision, correct_contact_or_supervision_route, current_external_training_status
- **Delayed-check policy:** Knowledge-only scenario check plus current external course/certification status where relevant. Do not schedule a self-administered practical competency test.
- **If pass:** ATHENA may show awareness/readiness status only. Practical readiness follows the recognised provider’s current training and refresher requirements.
- **If fail:** Escalate to guardian/qualified instructor and current official guidance; never prescribe solo practice for hazardous tasks.
- **Maintenance:** Follow applicable certified training, supervision and external refresh requirements; annual self-study is never proof of readiness.

### MS-07-004 — Basic digital account recovery hygiene (D3)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-07-005 — Recognise unsafe electrical conditions (D4)
- **Dimensions:** hazard_recognition, stop_or_escalate_decision, correct_contact_or_supervision_route, current_external_training_status
- **Delayed-check policy:** Knowledge-only scenario check plus current external course/certification status where relevant. Do not schedule a self-administered practical competency test.
- **If pass:** ATHENA may show awareness/readiness status only. Practical readiness follows the recognised provider’s current training and refresher requirements.
- **If fail:** Escalate to guardian/qualified instructor and current official guidance; never prescribe solo practice for hazardous tasks.
- **Maintenance:** Follow applicable certified training, supervision and external refresh requirements; annual self-study is never proof of readiness.

### MS-07-006 — Read a basic product safety label (D2)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-07-007 — Use a fire extinguisher decision model (D4)
- **Dimensions:** hazard_recognition, stop_or_escalate_decision, correct_contact_or_supervision_route, current_external_training_status
- **Delayed-check policy:** Knowledge-only scenario check plus current external course/certification status where relevant. Do not schedule a self-administered practical competency test.
- **If pass:** ATHENA may show awareness/readiness status only. Practical readiness follows the recognised provider’s current training and refresher requirements.
- **If fail:** Escalate to guardian/qualified instructor and current official guidance; never prescribe solo practice for hazardous tasks.
- **Maintenance:** Follow applicable certified training, supervision and external refresh requirements; annual self-study is never proof of readiness.

### MS-07-008 — Basic wound-care literacy (D4)
- **Dimensions:** hazard_recognition, stop_or_escalate_decision, correct_contact_or_supervision_route, current_external_training_status
- **Delayed-check policy:** Knowledge-only scenario check plus current external course/certification status where relevant. Do not schedule a self-administered practical competency test.
- **If pass:** ATHENA may show awareness/readiness status only. Practical readiness follows the recognised provider’s current training and refresher requirements.
- **If fail:** Escalate to guardian/qualified instructor and current official guidance; never prescribe solo practice for hazardous tasks.
- **Maintenance:** Follow applicable certified training, supervision and external refresh requirements; annual self-study is never proof of readiness.

### MS-07-009 — CPR/AED course readiness and qualified training pathway (D4)
- **Dimensions:** hazard_recognition, stop_or_escalate_decision, correct_contact_or_supervision_route, current_external_training_status
- **Delayed-check policy:** Knowledge-only scenario check plus current external course/certification status where relevant. Do not schedule a self-administered practical competency test.
- **If pass:** ATHENA may show awareness/readiness status only. Practical readiness follows the recognised provider’s current training and refresher requirements.
- **If fail:** Escalate to guardian/qualified instructor and current official guidance; never prescribe solo practice for hazardous tasks.
- **Maintenance:** Follow applicable certified training, supervision and external refresh requirements; annual self-study is never proof of readiness.

### MS-07-010 — Choking Response (certified practical competency pathway) (D4)
- **Dimensions:** hazard_recognition, stop_or_escalate_decision, correct_contact_or_supervision_route, current_external_training_status
- **Delayed-check policy:** Knowledge-only scenario check plus current external course/certification status where relevant. Do not schedule a self-administered practical competency test.
- **If pass:** ATHENA may show awareness/readiness status only. Practical readiness follows the recognised provider’s current training and refresher requirements.
- **If fail:** Escalate to guardian/qualified instructor and current official guidance; never prescribe solo practice for hazardous tasks.
- **Maintenance:** Follow applicable certified training, supervision and external refresh requirements; annual self-study is never proof of readiness.

### MS-08-001 — Orient a map to the environment (D3)
- **Dimensions:** orientation_accuracy, route_or_location_accuracy, safe_decision_process, fallback_and_escalation, context_transfer
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-08-002 — Follow a multi-step route plan (D3)
- **Dimensions:** orientation_accuracy, route_or_location_accuracy, safe_decision_process, fallback_and_escalation, context_transfer
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-08-003 — Estimate walking time and distance (D2)
- **Dimensions:** orientation_accuracy, route_or_location_accuracy, safe_decision_process, fallback_and_escalation, context_transfer
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-08-004 — Use a compass bearing safely (D3)
- **Dimensions:** orientation_accuracy, route_or_location_accuracy, safe_decision_process, fallback_and_escalation, context_transfer
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-08-005 — Recognise orientation landmarks (D3)
- **Dimensions:** orientation_accuracy, route_or_location_accuracy, safe_decision_process, fallback_and_escalation, context_transfer
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-08-006 — Recover calmly after a wrong turn (D3)
- **Dimensions:** orientation_accuracy, route_or_location_accuracy, safe_decision_process, fallback_and_escalation, context_transfer
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-08-007 — Give a precise location description (D4)
- **Dimensions:** hazard_recognition, stop_or_escalate_decision, correct_contact_or_supervision_route, current_external_training_status
- **Delayed-check policy:** Knowledge-only scenario check plus current external course/certification status where relevant. Do not schedule a self-administered practical competency test.
- **If pass:** ATHENA may show awareness/readiness status only. Practical readiness follows the recognised provider’s current training and refresher requirements.
- **If fail:** Escalate to guardian/qualified instructor and current official guidance; never prescribe solo practice for hazardous tasks.
- **Maintenance:** Follow applicable certified training, supervision and external refresh requirements; annual self-study is never proof of readiness.

### MS-08-008 — Read a transit interchange diagram (D3)
- **Dimensions:** orientation_accuracy, route_or_location_accuracy, safe_decision_process, fallback_and_escalation, context_transfer
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-08-009 — Maintain a situational check-in routine (D4)
- **Dimensions:** hazard_recognition, stop_or_escalate_decision, correct_contact_or_supervision_route, current_external_training_status
- **Delayed-check policy:** Knowledge-only scenario check plus current external course/certification status where relevant. Do not schedule a self-administered practical competency test.
- **If pass:** ATHENA may show awareness/readiness status only. Practical readiness follows the recognised provider’s current training and refresher requirements.
- **If fail:** Escalate to guardian/qualified instructor and current official guidance; never prescribe solo practice for hazardous tasks.
- **Maintenance:** Follow applicable certified training, supervision and external refresh requirements; annual self-study is never proof of readiness.

### MS-08-010 — Distinguish safe from unsafe shortcuts (D4)
- **Dimensions:** hazard_recognition, stop_or_escalate_decision, correct_contact_or_supervision_route, current_external_training_status
- **Delayed-check policy:** Knowledge-only scenario check plus current external course/certification status where relevant. Do not schedule a self-administered practical competency test.
- **If pass:** ATHENA may show awareness/readiness status only. Practical readiness follows the recognised provider’s current training and refresher requirements.
- **If fail:** Escalate to guardian/qualified instructor and current official guidance; never prescribe solo practice for hazardous tasks.
- **Maintenance:** Follow applicable certified training, supervision and external refresh requirements; annual self-study is never proof of readiness.

### MS-09-001 — Select the correct screwdriver bit (D2)
- **Dimensions:** tool_or_component_selection, inspection_and_setup, controlled_execution, result_quality, safe_stop_behaviour
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-09-002 — Use a hand tool with controlled force (D3)
- **Dimensions:** tool_or_component_selection, inspection_and_setup, controlled_execution, result_quality, safe_stop_behaviour
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-09-003 — Clamp a workpiece securely (D2)
- **Dimensions:** tool_or_component_selection, inspection_and_setup, controlled_execution, result_quality, safe_stop_behaviour
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-09-004 — Measure and mark a straight cut line (D3)
- **Dimensions:** tool_or_component_selection, inspection_and_setup, controlled_execution, result_quality, safe_stop_behaviour
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-09-005 — Identify common fastener types (D2)
- **Dimensions:** tool_or_component_selection, inspection_and_setup, controlled_execution, result_quality, safe_stop_behaviour
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-09-006 — Inspect a tool before use (D4)
- **Dimensions:** hazard_recognition, stop_or_escalate_decision, correct_contact_or_supervision_route, current_external_training_status
- **Delayed-check policy:** Knowledge-only scenario check plus current external course/certification status where relevant. Do not schedule a self-administered practical competency test.
- **If pass:** ATHENA may show awareness/readiness status only. Practical readiness follows the recognised provider’s current training and refresher requirements.
- **If fail:** Escalate to guardian/qualified instructor and current official guidance; never prescribe solo practice for hazardous tasks.
- **Maintenance:** Follow applicable certified training, supervision and external refresh requirements; annual self-study is never proof of readiness.

### MS-09-007 — Strip a wire to a specified length (D3)
- **Dimensions:** tool_or_component_selection, inspection_and_setup, controlled_execution, result_quality, safe_stop_behaviour
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-09-008 — Make a secure low-voltage breadboard connection (D3)
- **Dimensions:** tool_or_component_selection, inspection_and_setup, controlled_execution, result_quality, safe_stop_behaviour
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-09-009 — Identify resistor colour bands (D2)
- **Dimensions:** tool_or_component_selection, inspection_and_setup, controlled_execution, result_quality, safe_stop_behaviour
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-09-010 — Keep a tidy tool and parts station (D2)
- **Dimensions:** tool_or_component_selection, inspection_and_setup, controlled_execution, result_quality, safe_stop_behaviour
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-10-001 — Perform a balanced athletic landing (D3)
- **Dimensions:** movement_quality, control_and_balance, repeatability, adaptation_to_changed_condition, pain_and_fatigue_stop_signals
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-10-002 — Accelerate over a short distance (D3)
- **Dimensions:** movement_quality, control_and_balance, repeatability, adaptation_to_changed_condition, pain_and_fatigue_stop_signals
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-10-003 — Decelerate under control (D3)
- **Dimensions:** movement_quality, control_and_balance, repeatability, adaptation_to_changed_condition, pain_and_fatigue_stop_signals
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-10-004 — Change direction with body control (D3)
- **Dimensions:** movement_quality, control_and_balance, repeatability, adaptation_to_changed_condition, pain_and_fatigue_stop_signals
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-10-005 — Receive and cushion a football pass (D3)
- **Dimensions:** movement_quality, control_and_balance, repeatability, adaptation_to_changed_condition, pain_and_fatigue_stop_signals
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-10-006 — Pass accurately to a moving target (D3)
- **Dimensions:** movement_quality, control_and_balance, repeatability, adaptation_to_changed_condition, pain_and_fatigue_stop_signals
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-10-007 — Scan before receiving a ball (D3)
- **Dimensions:** movement_quality, control_and_balance, repeatability, adaptation_to_changed_condition, pain_and_fatigue_stop_signals
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-10-008 — Use the weaker foot for a controlled pass (D3)
- **Dimensions:** movement_quality, control_and_balance, repeatability, adaptation_to_changed_condition, pain_and_fatigue_stop_signals
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-10-009 — Maintain a steady aerobic pace (D3)
- **Dimensions:** movement_quality, control_and_balance, repeatability, adaptation_to_changed_condition, pain_and_fatigue_stop_signals
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-10-010 — Perform a safe dynamic warm-up sequence (D3)
- **Dimensions:** movement_quality, control_and_balance, repeatability, adaptation_to_changed_condition, pain_and_fatigue_stop_signals
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-11-001 — Clean a phone camera lens safely (D2)
- **Dimensions:** intended_effect, technical_quality, artifact_or_clipping_control, tradeoff_explanation, repeatability
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-11-002 — Choose an aspect ratio intentionally (D2)
- **Dimensions:** intended_effect, technical_quality, artifact_or_clipping_control, tradeoff_explanation, repeatability
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-11-003 — Use grid lines for alignment (D3)
- **Dimensions:** intended_effect, technical_quality, artifact_or_clipping_control, tradeoff_explanation, repeatability
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-11-004 — Avoid digital zoom degradation (D2)
- **Dimensions:** intended_effect, technical_quality, artifact_or_clipping_control, tradeoff_explanation, repeatability
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-11-005 — Expose for highlights (D3)
- **Dimensions:** intended_effect, technical_quality, artifact_or_clipping_control, tradeoff_explanation, repeatability
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-11-006 — Stabilise a handheld phone shot (D3)
- **Dimensions:** intended_effect, technical_quality, artifact_or_clipping_control, tradeoff_explanation, repeatability
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-11-007 — Use leading lines deliberately (D3)
- **Dimensions:** intended_effect, technical_quality, artifact_or_clipping_control, tradeoff_explanation, repeatability
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-11-008 — Separate subject from background (D3)
- **Dimensions:** intended_effect, technical_quality, artifact_or_clipping_control, tradeoff_explanation, repeatability
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-11-009 — Edit exposure without destroying detail (D3)
- **Dimensions:** intended_effect, technical_quality, artifact_or_clipping_control, tradeoff_explanation, repeatability
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-11-010 — Export an image for a target platform (D2)
- **Dimensions:** intended_effect, technical_quality, artifact_or_clipping_control, tradeoff_explanation, repeatability
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-12-001 — Find a comfortable speaking pitch (D3)
- **Dimensions:** accuracy_or_clarity, effort_and_strain, timing_or_pitch_if_relevant, repeatability, self_monitoring
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-12-002 — Articulate consonant endings clearly (D3)
- **Dimensions:** accuracy_or_clarity, effort_and_strain, timing_or_pitch_if_relevant, repeatability, self_monitoring
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-12-003 — Maintain a steady beat (D3)
- **Dimensions:** accuracy_or_clarity, effort_and_strain, timing_or_pitch_if_relevant, repeatability, self_monitoring
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-12-004 — Hear simple pitch direction (D3)
- **Dimensions:** accuracy_or_clarity, effort_and_strain, timing_or_pitch_if_relevant, repeatability, self_monitoring
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-12-005 — Sing a short phrase in tune (D3)
- **Dimensions:** accuracy_or_clarity, effort_and_strain, timing_or_pitch_if_relevant, repeatability, self_monitoring
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-12-006 — Use a clean vocal onset (D3)
- **Dimensions:** accuracy_or_clarity, effort_and_strain, timing_or_pitch_if_relevant, repeatability, self_monitoring
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-12-007 — Pace a spoken explanation (D3)
- **Dimensions:** accuracy_or_clarity, effort_and_strain, timing_or_pitch_if_relevant, repeatability, self_monitoring
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-12-008 — Listen for phrase structure in music (D2)
- **Dimensions:** accuracy_or_clarity, effort_and_strain, timing_or_pitch_if_relevant, repeatability, self_monitoring
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-12-009 — Project speech without shouting (D3)
- **Dimensions:** accuracy_or_clarity, effort_and_strain, timing_or_pitch_if_relevant, repeatability, self_monitoring
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-12-010 — Record clean phone audio (D2)
- **Dimensions:** accuracy_or_clarity, effort_and_strain, timing_or_pitch_if_relevant, repeatability, self_monitoring
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-13-001 — Wash hands using a complete routine (D4)
- **Dimensions:** hazard_recognition, stop_or_escalate_decision, correct_contact_or_supervision_route, current_external_training_status
- **Delayed-check policy:** Knowledge-only scenario check plus current external course/certification status where relevant. Do not schedule a self-administered practical competency test.
- **If pass:** ATHENA may show awareness/readiness status only. Practical readiness follows the recognised provider’s current training and refresher requirements.
- **If fail:** Escalate to guardian/qualified instructor and current official guidance; never prescribe solo practice for hazardous tasks.
- **Maintenance:** Follow applicable certified training, supervision and external refresh requirements; annual self-study is never proof of readiness.

### MS-13-002 — Read a food date and storage label (D4)
- **Dimensions:** hazard_recognition, stop_or_escalate_decision, correct_contact_or_supervision_route, current_external_training_status
- **Delayed-check policy:** Knowledge-only scenario check plus current external course/certification status where relevant. Do not schedule a self-administered practical competency test.
- **If pass:** ATHENA may show awareness/readiness status only. Practical readiness follows the recognised provider’s current training and refresher requirements.
- **If fail:** Escalate to guardian/qualified instructor and current official guidance; never prescribe solo practice for hazardous tasks.
- **Maintenance:** Follow applicable certified training, supervision and external refresh requirements; annual self-study is never proof of readiness.

### MS-13-003 — Prepare a simple no-heat snack hygienically (D3)
- **Dimensions:** sequence_accuracy, hygiene_and_cross_contamination_controls, label_or_product_decision, safe_supervision_boundary, repeatability
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-13-004 — Use a kitchen knife safely under supervision (D4)
- **Dimensions:** hazard_recognition, stop_or_escalate_decision, correct_contact_or_supervision_route, current_external_training_status
- **Delayed-check policy:** Knowledge-only scenario check plus current external course/certification status where relevant. Do not schedule a self-administered practical competency test.
- **If pass:** ATHENA may show awareness/readiness status only. Practical readiness follows the recognised provider’s current training and refresher requirements.
- **If fail:** Escalate to guardian/qualified instructor and current official guidance; never prescribe solo practice for hazardous tasks.
- **Maintenance:** Follow applicable certified training, supervision and external refresh requirements; annual self-study is never proof of readiness.

### MS-13-005 — Measure dry and liquid ingredients (D2)
- **Dimensions:** sequence_accuracy, hygiene_and_cross_contamination_controls, label_or_product_decision, safe_supervision_boundary, repeatability
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-13-006 — Clean a surface using the correct product (D4)
- **Dimensions:** hazard_recognition, stop_or_escalate_decision, correct_contact_or_supervision_route, current_external_training_status
- **Delayed-check policy:** Knowledge-only scenario check plus current external course/certification status where relevant. Do not schedule a self-administered practical competency test.
- **If pass:** ATHENA may show awareness/readiness status only. Practical readiness follows the recognised provider’s current training and refresher requirements.
- **If fail:** Escalate to guardian/qualified instructor and current official guidance; never prescribe solo practice for hazardous tasks.
- **Maintenance:** Follow applicable certified training, supervision and external refresh requirements; annual self-study is never proof of readiness.

### MS-13-007 — Sort laundry by care requirements (D2)
- **Dimensions:** sequence_accuracy, hygiene_and_cross_contamination_controls, label_or_product_decision, safe_supervision_boundary, repeatability
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-13-008 — Fold and store common clothing (D1)
- **Dimensions:** sequence_accuracy, hygiene_and_cross_contamination_controls, label_or_product_decision, safe_supervision_boundary, repeatability
- **Delayed-check policy:** After initial independent performance, schedule a delayed unaided check chosen by the learner/system from the the task forgetting risk and consequence; do not hard-code annual review.
- **If pass:** If performance is reliable on more than one delayed check and low-risk, widen the interval gradually; use event-triggered refresh after a long gap or context change.
- **If fail:** Identify the smallest missing component, do a brief targeted relearn, then retest later with a changed example.
- **Maintenance:** Occasional use or event-triggered check may suffice only after repeated delayed success.

### MS-13-009 — Plan a simple balanced meal (D2)
- **Dimensions:** sequence_accuracy, hygiene_and_cross_contamination_controls, label_or_product_decision, safe_supervision_boundary, repeatability
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-13-010 — Use a household checklist (D2)
- **Dimensions:** sequence_accuracy, hygiene_and_cross_contamination_controls, label_or_product_decision, safe_supervision_boundary, repeatability
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-14-001 — Break a task into next actions (D2)
- **Dimensions:** plan_quality, estimate_calibration, execution_and_follow_through, handoff_or_record_quality, appropriate_tool_independence
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-14-002 — Estimate task duration realistically (D2)
- **Dimensions:** plan_quality, estimate_calibration, execution_and_follow_through, handoff_or_record_quality, appropriate_tool_independence
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-14-003 — Create a simple contingency plan (D2)
- **Dimensions:** plan_quality, estimate_calibration, execution_and_follow_through, handoff_or_record_quality, appropriate_tool_independence
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-14-004 — Maintain a short decision log (D2)
- **Dimensions:** plan_quality, estimate_calibration, execution_and_follow_through, handoff_or_record_quality, appropriate_tool_independence
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-14-005 — Use a checklist without becoming dependent (D2)
- **Dimensions:** plan_quality, estimate_calibration, execution_and_follow_through, handoff_or_record_quality, appropriate_tool_independence
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-14-006 — Prioritise by consequence and urgency (D2)
- **Dimensions:** plan_quality, estimate_calibration, execution_and_follow_through, handoff_or_record_quality, appropriate_tool_independence
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-14-007 — Prepare a concise handoff (D2)
- **Dimensions:** plan_quality, estimate_calibration, execution_and_follow_through, handoff_or_record_quality, appropriate_tool_independence
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-14-008 — Keep a simple inventory (D2)
- **Dimensions:** plan_quality, estimate_calibration, execution_and_follow_through, handoff_or_record_quality, appropriate_tool_independence
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-14-009 — Compare two options with a decision matrix (D2)
- **Dimensions:** plan_quality, estimate_calibration, execution_and_follow_through, handoff_or_record_quality, appropriate_tool_independence
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-14-010 — Close a work session cleanly (D2)
- **Dimensions:** plan_quality, estimate_calibration, execution_and_follow_through, handoff_or_record_quality, appropriate_tool_independence
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-15-001 — Doomsday Algorithm (weekday mental calculation) (D2)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-15-002 — Visual Observation (structured scene description) (D2)
- **Dimensions:** observation_accuracy, intentional_choice, technical_execution, explanation_of_choice, variation_across_examples
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-15-003 — Memory Palace (method of loci) (D2)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-15-004 — Lucid-Dream Reality Checks (sleep-safe awareness practice) (D2)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-15-005 — Speed Reading (flexible reading-rate control) (D2)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-15-006 — Morse Code (basic send and receive) (D3)
- **Dimensions:** correctness, reproducibility, safe_operation, error_recovery, transfer_to_new_example
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-15-007 — Rubik’s Cube 3×3 (beginner solve) (D2)
- **Dimensions:** accuracy, smoothness, consistency, speed_if_relevant, bilateral_or_context_adaptation
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-15-008 — Locksport Fundamentals (owned transparent practice lock only) (D2)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-15-009 — French Drop (basic coin-vanish sleight) (D3)
- **Dimensions:** accuracy, smoothness, consistency, speed_if_relevant, bilateral_or_context_adaptation
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-15-010 — One-Handed Card Shuffle (basic packet control) (D3)
- **Dimensions:** accuracy, smoothness, consistency, speed_if_relevant, bilateral_or_context_adaptation
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-15-011 — Faro Shuffle (introductory card interweave) (D3)
- **Dimensions:** accuracy, smoothness, consistency, speed_if_relevant, bilateral_or_context_adaptation
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-15-012 — Safe Lighter Handling (non-flourish replacement for Zippo trick) (D4)
- **Dimensions:** hazard_recognition, stop_or_escalate_decision, correct_contact_or_supervision_route, current_external_training_status
- **Delayed-check policy:** Knowledge-only scenario check plus current external course/certification status where relevant. Do not schedule a self-administered practical competency test.
- **If pass:** ATHENA may show awareness/readiness status only. Practical readiness follows the recognised provider’s current training and refresher requirements.
- **If fail:** Escalate to guardian/qualified instructor and current official guidance; never prescribe solo practice for hazardous tasks.
- **Maintenance:** Follow applicable certified training, supervision and external refresh requirements; annual self-study is never proof of readiness.

### MS-15-013 — Stadium Whistle (finger-assisted loud whistle) (D3)
- **Dimensions:** accuracy_or_clarity, effort_and_strain, timing_or_pitch_if_relevant, repeatability, self_monitoring
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.

### MS-15-014 — Signature Dish (repeatable personal recipe) (D2)
- **Dimensions:** sequence_accuracy, hygiene_and_cross_contamination_controls, label_or_product_decision, safe_supervision_boundary, repeatability
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-15-015 — Advanced Everyday Tie Knots (non-life-safety set) (D2)
- **Dimensions:** accuracy, independent_execution, explanation_or_rationale, delayed_retrieval, context_adaptation
- **Delayed-check policy:** After initial independent performance, schedule a delayed retrieval/performance check; repeat with a different example or context before widening the interval.
- **If pass:** Widen cautiously when unaided accuracy and explanation remain stable; keep occasional retrieval and context variation.
- **If fail:** Shorten the next interval and practise the failed subcomponent; do not erase previous achievement.
- **Maintenance:** Periodic retrieval plus occasional varied-context performance; no fixed universal calendar.

### MS-13-011 — Prepare a kitchen station using mise en place (D3)
- **Dimensions:** sequence_accuracy, hygiene_and_cross_contamination_controls, label_or_product_decision, safe_supervision_boundary, repeatability
- **Delayed-check policy:** Check after a meaningful delay without warm-up or immediate rehearsal; for motor/fluency tasks, record accuracy/quality separately from speed and comfort.
- **If pass:** Use short distributed practice and occasional varied-context checks; widen only if fluency and quality both persist.
- **If fail:** Use a short focused practice block, restore technique at low intensity, then retest after a delay.
- **Maintenance:** Frequent brief use is usually more plausible than one annual session; dose depends on skill, workload and recovery.
