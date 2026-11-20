import test from "node:test";
import assert from "node:assert/strict";
import {
  applyProposal,
  combine,
  dayOf,
  decideProposal,
  detectConflicts,
  eventFromParse,
  occurrenceDates,
  parsePlan,
  planDay,
  proposeReschedule,
  skipOccurrence,
  undoProposal,
  type ParsedPlan,
} from "../src/app/engines/schedule.ts";
import type { RoutineTemplate, ScheduleEvent } from "../src/domain/system.ts";

const NOW = new Date("2026-11-19T09:00:00Z");

function event(over: Partial<ScheduleEvent> & { id: string; title: string }): ScheduleEvent {
  return {
    kind: "confirmed_event",
    startLocal: null,
    endLocal: null,
    timezone: "UTC",
    estimatedMinutes: null,
    estimateConfidence: null,
    status: "confirmed",
    flexibility: "flexible",
    priority: "normal",
    travelBeforeMin: 0,
    travelAfterMin: 0,
    prepMin: 0,
    recurrence: null,
    exceptions: [],
    source: "manual",
    lastConfirmedAt: null,
    links: {},
    revision: 1,
    ...over,
  } as ScheduleEvent;
}

test("natural-language capture: the brief's football example becomes a tentative proposal", () => {
  const text = "Tomorrow Friday at 8 AM I might go out for football, probably three hours, and travel is about 30 minutes round trip";
  const parsed = parsePlan(text, { now: NOW, timezone: "Europe/London" });
  assert.equal(parsed.kind, "tentative_plan");
  assert.equal(parsed.startMinute, 8 * 60);
  assert.equal(parsed.estimatedMinutes, 180);
  assert.equal(parsed.travelBeforeMin, 15);
  assert.equal(parsed.travelAfterMin, 15);
  assert.equal(parsed.flexibility, "flexible");
  assert.equal(parsed.questions.length, 0);
  assert.match(parsed.title, /Football/i);
  assert.ok(parsed.confidence < 0.8, "an uncertain word keeps confidence below a confirmed plan");
});

test("a tentative plan is proposed, never confirmed by the parser", () => {
  const parsed = parsePlan("maybe gym tomorrow at 6 pm", { now: NOW });
  const ev = eventFromParse(parsed, "evt-1", NOW);
  assert.equal(ev.status, "proposed");
  assert.equal(ev.lastConfirmedAt, null);
  assert.equal(ev.kind, "tentative_plan");
});

test("missing time and duration stay null and produce questions instead of invented values", () => {
  const parsed: ParsedPlan = parsePlan("I might go out for football tomorrow", { now: NOW });
  assert.equal(parsed.startMinute, null);
  assert.equal(parsed.estimatedMinutes, null);
  assert.ok(parsed.questions.some((q) => /time/i.test(q)));
  assert.ok(parsed.questions.some((q) => /how long/i.test(q)));
});

test("duration and clock parsing cover words, half hours and 24-hour times", () => {
  assert.equal(parsePlan("study for two and a half hours at 20:30", { now: NOW }).estimatedMinutes, 150);
  assert.equal(parsePlan("call at 7pm for 45 minutes", { now: NOW }).startMinute, 19 * 60);
  assert.equal(parsePlan("walk for half an hour", { now: NOW }).estimatedMinutes, 30);
});

test("overlapping commitments are reported with the actual times", () => {
  const day = dayOf("2026-11-21");
  const a = event({ id: "a", title: "Lecture", startLocal: combine(day, 540), endLocal: combine(day, 660), flexibility: "immovable", kind: "fixed_commitment" });
  const b = event({ id: "b", title: "Call", startLocal: combine(day, 600), endLocal: combine(day, 660) });
  const conflicts = detectConflicts([a, b], { recovery: { startMinute: 60, endMinute: 120 } });
  const overlap = conflicts.find((c) => c.type === "overlap");
  assert.ok(overlap);
  assert.equal(overlap!.severity, "error");
  assert.match(overlap!.explanation, /Lecture|Call/);
});

test("impossible travel is detected from locations and buffers", () => {
  const day = dayOf("2026-11-21");
  const a = event({ id: "a", title: "Dentist", startLocal: combine(day, 540), endLocal: combine(day, 600), location: "Clinic", travelAfterMin: 20, flexibility: "immovable" });
  const b = event({ id: "b", title: "Class", startLocal: combine(day, 610), endLocal: combine(day, 660), location: "Campus", travelBeforeMin: 25 });
  const conflicts = detectConflicts([a, b], { recovery: { startMinute: 60, endMinute: 120 } });
  assert.ok(conflicts.some((c) => c.type === "impossible_travel"));
});

test("a proposal keeps fixed commitments and moves only flexible ones; nothing applies before acceptance", () => {
  const day = dayOf("2026-11-21");
  const fixed = event({ id: "fixed", title: "Exam", startLocal: combine(day, 540), endLocal: combine(day, 660), flexibility: "immovable", kind: "fixed_commitment" });
  const flex = event({ id: "flex", title: "Practice", startLocal: combine(day, 600), endLocal: combine(day, 630), kind: "tentative_plan" });
  const conflicts = detectConflicts([fixed, flex], { recovery: { startMinute: 60, endMinute: 120 } });
  const proposal = proposeReschedule([fixed, flex], conflicts, { now: NOW });
  assert.equal(proposal.decision, "pending");
  assert.deepEqual(proposal.preservedIds, ["fixed"]);
  assert.equal(proposal.changes.length, 1);
  assert.equal(proposal.changes[0]!.id, "flex");
  assert.equal(proposal.afterSnapshot.find((e) => e.id === "fixed")!.startLocal, combine(day, 540));
  assert.throws(() => applyProposal(proposal), /not accepted/);
});

test("accept, apply and undo round-trip leaves the original schedule recoverable", () => {
  const day = dayOf("2026-11-21");
  const a = event({ id: "a", title: "A", startLocal: combine(day, 540), endLocal: combine(day, 600), flexibility: "immovable" });
  const b = event({ id: "b", title: "B", startLocal: combine(day, 570), endLocal: combine(day, 600), kind: "tentative_plan" });
  const proposal = proposeReschedule([a, b], detectConflicts([a, b]), { now: NOW });
  const accepted = decideProposal(proposal, "accepted", NOW);
  const applied = applyProposal(accepted.proposal);
  assert.notEqual(applied.events.find((e) => e.id === "b")!.startLocal, combine(day, 570));
  assert.equal(accepted.audit.approvedByUser, true);
  const undone = undoProposal(applied.reversible, NOW);
  assert.equal(undone.events.find((e) => e.id === "b")!.startLocal, combine(day, 570));
});

function template(over: Partial<RoutineTemplate> = {}): RoutineTemplate {
  return {
    id: "tpl",
    title: "Morning review",
    category: "learning",
    recurrence: { freq: "daily", interval: 2 },
    preferredWindow: { startMinute: 480, endMinute: 540 },
    minDurationMin: 10,
    maxDurationMin: 30,
    blocks: [{ title: "Review", minutes: 15 }],
    minimumViableBlocks: 1,
    exceptions: [],
    paused: false,
    reviewDate: null,
    ...over,
  };
}

test("recurrence expands deterministically and skips a single exception", () => {
  const dates = occurrenceDates(template(), "2026-11-01", "2026-11-05");
  assert.deepEqual(dates, ["2026-11-01", "2026-11-03", "2026-11-05"]);
  const skipped = skipOccurrence(template(), "2026-11-03");
  assert.deepEqual(occurrenceDates(skipped, "2026-11-01", "2026-11-05"), ["2026-11-01", "2026-11-05"]);
  assert.deepEqual(occurrenceDates(template({ paused: true }), "2026-11-01", "2026-11-05"), []);
});

test("day planning drops optional routine work rather than promising an impossible day", () => {
  const day = dayOf("2026-11-21");
  const plan = planDay({
    date: "2026-11-21",
    events: [event({ id: "a", title: "Work", startLocal: combine(day, 540), endLocal: combine(day, 660), estimatedMinutes: 120, flexibility: "immovable" })],
    tasks: [],
    routine: { title: "Routine", blocks: [{ title: "Review", minutes: 30 }, { title: "Explore", minutes: 30 }], optionalTail: 1 },
    availability: [{ id: "w", startLocal: combine(day, 480), endLocal: combine(day, 720), source: "learner", hard: false, timezone: "UTC", exceptions: [] }],
    recovery: { startMinute: 60, endMinute: 120 },
  });
  assert.equal(plan.availableMinutes, 240);
  assert.ok(plan.plannedMinutes <= plan.availableMinutes);
  assert.match(plan.note, /remain|capacity/i);
});
