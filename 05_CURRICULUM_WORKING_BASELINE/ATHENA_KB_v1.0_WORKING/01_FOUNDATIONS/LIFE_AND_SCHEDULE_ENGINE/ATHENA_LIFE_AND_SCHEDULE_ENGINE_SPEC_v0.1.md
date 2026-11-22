# ATHENA Life & Schedule Engine — Product and Data Contract v0.1

**Status: proposed subsystem specification; not implemented or tested.** This is a distinct product subsystem, not an extension that should be mislabelled as the Wave 10 learning-review scheduler.

## 1. Purpose and boundary

The Life & Schedule Engine helps the user capture commitments, routines, tasks, deadlines, availability and actual time use; detect conflicts; propose safe changes; and improve time estimates from repeated observations. It is an assistant to user-directed planning, not an autonomous authority over the user's day.

The engine must never silently overwrite a routine, confirm a tentative event, cancel a commitment, move a deadline, or trade away sleep/recovery. Suggestions and confirmed decisions are separate records. Every applied change must be reversible and attributable.

## 2. Canonical record types

| Record type | Meaning | Required distinction |
|---|---|---|
| Fixed commitment | External/immovable obligation (e.g. school) | User-defined immovability and source |
| Tentative event | Possible event with uncertain occurrence/time | Does not reserve the same priority as confirmed commitment; may reserve a soft window |
| Confirmed event | User confirms an event | Has explicit start, duration estimate and status history |
| Routine | Repeating or semi-repeating user activity | Recurrence, flexibility, exceptions and minimum viable version |
| Task | Work that can be placed into available time | Effort estimate, splitting rules, priority and due date |
| Deadline | Latest completion boundary | Separate from work block; never moved automatically |
| Availability | Window the user declares free/available | Not an appointment; can be consumed by scheduling proposals |
| Actual record | What really happened, captured after or during event | Append-only actual start/end/duration; does not rewrite plan |
| Travel/preparation buffer | Time needed around an event | Separate from activity duration; configurable and learned cautiously |
| Schedule proposal | Proposed set of changes | Non-mutating until user accepts the exact diff |

## 3. Natural-language capture pipeline

Input may arrive by voice, text or manual form. The parser extracts candidate fields but does not commit ambiguous details silently:

1. Identify event/task/routine intent.
2. Parse date phrase relative to the user's timezone and current local date; store the interpreted date plus the original phrase.
3. Extract start time or window, activity duration, travel, preparation, location text (optional), participants (optional), recurrence and deadline.
4. Infer certainty only from explicit language. “Might”, “maybe”, “if he calls” => tentative; “confirmed”, “we agreed” => confirmed only if user confirms.
5. Mark missing or ambiguous fields; ask one focused clarification at a time.
6. Preview the parsed record and resulting schedule effect.
7. Save locally only after user confirms the record; allow draft capture when user wants to finish later.

Voice transcription uncertainty must be shown for dates, times, amounts and names. The original utterance is optional and should not be retained by default; structured extracted fields are enough for most uses.

## 4. Conflict engine

Conflict detection considers:
- overlap with fixed commitments, confirmed events and other scheduled blocks;
- soft overlap with tentative events and flexible routines;
- travel and preparation buffers before/after events;
- task effort, due date, priority and available uninterrupted block length;
- sleep/recovery windows, user-defined protected time and minimum routine requirements;
- uncertainty in event duration and transport.

Priority is not a universal hidden score. Use explicit categories and a transparent precedence policy:
1. Safety and user-defined protected sleep/recovery.
2. Immovable commitments and hard deadlines.
3. Confirmed events.
4. User-marked high-priority tasks and important routines.
5. Flexible routines and ordinary tasks.
6. Tentative events and optional activities.

The user can override ordering. The engine explains the trade-off rather than deciding that one value matters more.

## 5. Proposal behaviour

A proposal contains the exact changes: what stays, what moves, what is shortened, what is split, what is skipped, what becomes at risk, and why. It shows before/after time blocks and the consequences for deadlines, routines and recovery.

- Small changes inside a user-authorised flexible window may be applied only if the user has enabled that specific automation rule.
- Significant changes require explicit approval.
- Never silently delete a block or create schedule debt.
- If no safe fit exists, say so and present options such as declining the event, moving a flexible task, splitting a task, or asking the user for a decision.
- A proposal is immutable after approval; later changes create a new proposal/version.

## 6. Actual-time capture and estimation learning

After an event, ask optionally: actual start, actual end, whether travel was as expected, whether preparation was needed, interruptions, and whether the duration felt unusual. Do not nag.

Estimate model:
- Maintain separate estimates for activity, preparation and travel.
- Use robust summaries (e.g. median and a spread/uncertainty band), not a single observation.
- Require a minimum number of comparable observations before personalising.
- Segment by meaningful context only when supported (e.g. same activity and similar venue); avoid overfitting to day, friend, weather or sensitive traits.
- Keep population/default estimate and personal estimate visible; show sample count and confidence.
- Allow user correction and reset.
- A single unusually long or short event must not silently shift future plans.
- Estimates are recommendations, never facts or performance judgments.

## 7. Offline-first operation

Core capture, event storage, recurrence expansion, conflict detection, proposal generation, actual-time logging, local notifications and estimate summaries must work on-device without internet. Optional online AI may help parse messy language, but a deterministic/manual parser and editable preview must always remain. No cloud dependency for core schedule access.

Local database is the source of truth for local UI reads. Sync uses a durable outbox and idempotency keys. Conflicts are domain-specific: schedule changes preserve both versions and ask the user; no silent last-write-wins. Local notifications are best-effort under OS battery restrictions and must not be described as guaranteed alarms.

## 8. Privacy and safeguarding

Schedules can reveal school, movement, friendships, routines and home patterns. Store locally by default; exact location is optional; do not infer relationships or risk profiles; no public sharing; no advertising use. Sync is opt-in and encrypted in transit/at rest where supported. Export/delete and backup-retention behaviour must be clear. Never expose the user's routine to another person without item-level approval.

For minors, sharing schedules or location with guardians/others must be explicit and reviewed against applicable safeguarding and privacy requirements. The app should not silently notify friends, teachers or family members.

## 9. Proposed event schema

`ScheduleRecord` fields:
- `record_id` (app-owned immutable ID)
- `record_type` (`fixed_commitment|tentative_event|confirmed_event|routine|task|deadline|availability|actual_record|buffer`)
- `title`, `notes` (optional; avoid sensitive details)
- `start_at`, `end_at` or `time_window` (timezone-aware)
- `duration_estimate_minutes`, `duration_actual_minutes` (separate)
- `travel_before_minutes`, `travel_after_minutes`, `preparation_minutes`
- `certainty` (`unknown|tentative|confirmed`)
- `flexibility` (`immovable|fixed_time|flexible_window|movable|anytime`)
- `priority` (`protected|high|normal|low`)
- `recurrence_rule`, `exception_dates`, `parent_routine_id`
- `deadline_at`, `splittable`, `minimum_block_minutes` (task-specific)
- `source_phrase`, `parsed_fields`, `parse_confidence`, `user_confirmed_at`
- `status`, `created_at`, `updated_at`, `timezone_id`, `version`

`ScheduleActual` is append-only and links to a planned record; it records actual start/end, actual travel/prep if provided, variance reason and user confidence. It never overwrites the plan.

`ScheduleProposal` contains `proposal_id`, `base_schedule_version`, `changes[]`, `conflicts[]`, `rationale[]`, `risk_flags[]`, `expires_at`, `user_decision`, `decided_at`, `resulting_schedule_version`. Applying a proposal checks that the base version is still current; otherwise it must regenerate the diff.

## 10. Example acceptance scenario

User: “Friend called; tomorrow at 8 AM we’re playing football. Activity about 3 hours; round-trip travel 30 minutes; tentative.”

Engine should:
1. Resolve “tomorrow” using local timezone and show the exact interpreted date.
2. Create a draft event at 08:00 with 180-minute activity estimate, 30-minute round-trip travel estimate (not 30 minutes each way), certainty `tentative`.
3. Ask whether travel is total round trip and whether preparation time should be added if ambiguous; do not invent it.
4. Reserve a soft window of 07:45/07:30 etc only if the user confirms any preparation buffer; otherwise use event 08:00–11:00 plus separate 30-minute travel allocation with unknown direction split. The engine must not assume travel occurs entirely before the event.
5. Detect conflicts against existing fixed commitments, routines, tasks and protected sleep/recovery.
6. Show a tentative-event conflict proposal; do not move routines or mark the event confirmed.
7. Let the user confirm, edit, or leave it tentative.
8. After the activity, optionally capture actual start/end and travel; update estimates only after sufficient comparable observations.

## 11. Acceptance tests

- Ambiguous “tomorrow” date is previewed in local timezone.
- Tentative does not become confirmed.
- Activity duration and round-trip travel are separate fields.
- Travel is not blindly placed before the event when direction/split is unknown.
- Existing routine is not overwritten by event creation.
- Conflicts are detected against hard and soft blocks.
- Significant changes require explicit approval.
- Declined proposal leaves database hash and schedule version unchanged.
- Approved proposal is reversible through history/undo.
- Actual duration is append-only and distinct from estimate.
- One actual observation does not change personalised estimate.
- Local schedule works in airplane mode.
- Sync conflict preserves both edits and asks user.
- Sleep/recovery protection is never silently traded away.
- Export/delete and sharing controls are discoverable and functional.

## 12. Explicit non-goals

No surveillance, employee attendance scoring, hidden location tracking, medical/psychological inference, automatic commitment confirmation, punitive streaks, productivity ranking or guaranteed transport predictions.
