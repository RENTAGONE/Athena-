# ATHENA Wave 10 — App Integration Handoff

## Import assets
- `ATHENA_WAVE_10_MODULE_LEARNING_ADAPTATION_BANK_v1.0.json` — 216 module-specific strategy/adaptation profiles.
- `ATHENA_WAVE_10_STRATEGY_CARDS_v1.0.json` — 18 reusable strategy definitions.
- `ATHENA_WAVE_10_DISCIPLINE_ADAPTATION_PROFILES_v1.0.json` — 18 discipline-level profiles.
- `ATHENA_WAVE_10_SOURCE_REGISTER_v1.0.json` — provenance and scope limitations.

## Runtime behaviour
1. Resolve active objective and module ID.
2. Read diagnostic/mastery evidence and the matching adaptation record.
3. Present 1–3 suitable strategy options with rationale; never auto-force a strategy.
4. Capture pre-feedback confidence before revealing answer/feedback.
5. Record attempt conditions, aids, AI assistance, evidence and criterion-level results.
6. Classify error only when evidence supports it; allow `unknown` and learner correction.
7. Select next action using evidence rules; allow user override.
8. Schedule a review with an explicit reason and editable date; no universal interval.
9. Preserve original attempt and retries append-only.
10. Keep mastery, transfer, retention and session completion separate.

## UI requirements
- Mobile-first; one next action visible at a time; offline-first capture.
- Plain language; technical English plus optional Bangla glossary.
- Do not expose raw psychometric labels or infer diagnoses.
- No streak punishment, shame, compulsory timers or productivity scoring.
- Respect reduced motion, screen readers, keyboard navigation and low-bandwidth modes.
- Safety-sensitive practice must display its boundaries and stop rules.

## Suggested event contract
`LearningAttempt`: attempt_id, module_id, objective_id, started_at, completed_at, task_type, strategy_ids, response_mode, conditions, aids_used, ai_assistance, confidence_before_feedback, evidence_refs, criterion_results, error_class, feedback_ref, next_action, scheduled_review_at, schedule_reason, user_override, status.

## Non-goals
Do not infer intelligence, ADHD, motivation traits, learning styles, memory capacity, mental health or mastery from usage data. Do not personalise by unsupported “visual/auditory/kinesthetic learning style” labels. Do not treat AI evaluation as authoritative. Do not make online access a prerequisite for core planning, practice capture or review.
