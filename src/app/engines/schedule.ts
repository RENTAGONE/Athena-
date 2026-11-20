// Life & Schedule Engine. This is not the learning-routine generator in routine.ts: it owns real
// commitments, tentative plans, tasks, availability, recurrence, conflicts, proposals and actuals.
//
// Design rules enforced here:
//  - A proposal never writes. Scheduling functions return new arrays; the caller persists on approval.
//  - "Might / probably / maybe" stays tentative. Nothing is inferred into a confirmation.
//  - A missing time or duration is left null and turned into one clarification question, never filled in.
//  - Fixed commitments are never moved by a proposal. Only flexible/optional items can be shifted.
//  - Times are local wall-clock strings ("2026-11-21T08:00"), so a recurring 08:00 stays 08:00 when the
//    device timezone changes. Date arithmetic uses UTC day numbers so it never drifts by an hour.
import type {
  AvailabilityWindow,
  ConflictType,
  Flexibility,
  Priority,
  RecurrenceRule,
  RoutineTemplate,
  ScheduleConflict,
  ScheduleEvent,
  ScheduleProposal,
  ScheduleAuditEvent,
  Task,
} from "../../domain/system.ts";

export const DAY_MINUTES = 1440;
const DAY_MS = 86_400_000;
const WEEKDAY_NAMES = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

// ---------------------------------------------------------------------------------------------
// Local date helpers (timezone-free by construction)
// ---------------------------------------------------------------------------------------------

export interface LocalStamp {
  /** Days since 1970-01-01, computed in UTC from the written calendar date. */
  day: number;
  /** Minutes after local midnight. */
  minute: number;
}

export function parseLocal(value: string | null | undefined): LocalStamp | null {
  if (!value) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/.exec(value);
  if (!m) return null;
  const day = Math.floor(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])) / DAY_MS);
  const minute = m[4] ? Number(m[4]) * 60 + Number(m[5]) : 0;
  return { day, minute };
}

export function dateKey(day: number): string {
  return new Date(day * DAY_MS).toISOString().slice(0, 10);
}

export function dayOf(date: string): number {
  const s = parseLocal(date);
  if (!s) throw new Error(`not a local date: ${date}`);
  return s.day;
}

export function weekdayOf(day: number): number {
  return new Date(day * DAY_MS).getUTCDay();
}

export function combine(day: number, minute: number): string {
  const h = Math.floor(minute / 60);
  const m = minute % 60;
  return `${dateKey(day)}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function formatMinute(minute: number): string {
  const h = Math.floor(minute / 60) % 24;
  const m = minute % 60;
  const suffix = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function addDays(date: string, days: number): string {
  return dateKey(dayOf(date) + days);
}

// ---------------------------------------------------------------------------------------------
// Deterministic natural-language capture
// ---------------------------------------------------------------------------------------------

export interface ParseContext {
  now: Date;
  timezone?: string;
}

export interface ParsedPlan {
  title: string;
  kind: "tentative_plan" | "confirmed_event";
  dateLocal: string | null;
  startMinute: number | null;
  estimatedMinutes: number | null;
  travelBeforeMin: number;
  travelAfterMin: number;
  flexibility: Flexibility;
  priority: Priority;
  /** 0..1, derived from the certainty words actually used, not a model score. */
  confidence: number;
  unresolved: string[];
  questions: string[];
  sourceText: string;
  timezone: string;
}

const WORD_NUMBERS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, fifteen: 15, twenty: 20, thirty: 30, forty: 40, fortyfive: 45, sixty: 60, ninety: 90,
};

const ACTIVITY_WORDS = [
  "football", "basketball", "cricket", "tennis", "badminton", "gym", "workout", "swimming", "running", "walk",
  "class", "lecture", "lesson", "study", "revision", "exam", "meeting", "appointment", "interview", "doctor",
  "dentist", "call", "dinner", "lunch", "breakfast", "coffee", "shopping", "practice", "training", "work", "shift",
];

function numberFrom(token: string): number | null {
  if (/^\d+(?:\.\d+)?$/.test(token)) return Number(token);
  return WORD_NUMBERS[token.toLowerCase()] ?? null;
}

/** "three hours", "90 minutes", "an hour and a half", "two and a half hours", "3h". */
export function parseDuration(text: string): number | null {
  const t = text.toLowerCase();
  if (/\bhalf an hour\b|\bhalf hour\b/.test(t)) return 30;
  const andHalf = /(\d+|one|two|three|four|five|six)\s*(?:(?:hours?|hrs?)\s*and\s*a\s*half|and\s*a\s*half\s*(?:hours?|hrs?))/.exec(t);
  if (andHalf) {
    const n = numberFrom(andHalf[1]!);
    if (n !== null) return Math.round(n * 60 + 30);
  }
  const h = /(\d+(?:\.\d+)?|one|two|three|four|five|six|seven|eight|nine|ten)\s*(?:hours?|hrs?|h)\b/.exec(t);
  if (h) {
    const n = numberFrom(h[1]!);
    if (n !== null) return Math.round(n * 60);
  }
  const m = /(\d+(?:\.\d+)?|one|two|three|four|five|six|seven|eight|nine|ten|fifteen|twenty|thirty|forty|fortyfive|sixty|ninety)\s*(?:minutes?|mins?|m)\b/.exec(t);
  if (m) {
    const n = numberFrom(m[1]!);
    if (n !== null) return Math.round(n);
  }
  return null;
}

/** 08:00 / 8 AM / 8am / at 8 / 20:30. Returns minutes after midnight, or null. */
export function parseClock(text: string): number | null {
  const t = text.toLowerCase();
  const colon = /\b(?:at\s+)?(\d{1,2}):(\d{2})\s*(am|pm)?\b/.exec(t);
  if (colon) {
    let h = Number(colon[1]);
    const m = Number(colon[2]);
    const suffix = colon[3];
    if (suffix === "pm" && h < 12) h += 12;
    if (suffix === "am" && h === 12) h = 0;
    if (h < 24 && m < 60) return h * 60 + m;
  }
  const loose = /\b(?:at\s+)(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/.exec(t);
  if (loose) {
    let h = Number(loose[1]);
    const m = loose[2] ? Number(loose[2]) : 0;
    const suffix = loose[3];
    if (suffix === "pm" && h < 12) h += 12;
    if (suffix === "am" && h === 12) h = 0;
    if (h < 24 && m < 60) return h * 60 + m;
  }
  return null;
}

/** A date phrase to a calendar date. "tomorrow" wins over a weekday name when both are present. */
export function parseDateLocal(text: string, now: Date): string | null {
  const t = text.toLowerCase();
  const todayDay = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / DAY_MS);
  if (/\btoday\b/.test(t)) return dateKey(todayDay);
  if (/\btomorrow\b/.test(t)) return dateKey(todayDay + 1);
  if (/\bday after tomorrow\b/.test(t)) return dateKey(todayDay + 2);
  for (let i = 0; i < WEEKDAY_NAMES.length; i += 1) {
    if (!new RegExp(`\\b${WEEKDAY_NAMES[i]}\\b`).test(t)) continue;
    let delta = (i - weekdayOf(todayDay) + 7) % 7;
    if (delta === 0) delta = 7;
    return dateKey(todayDay + delta);
  }
  const iso = /\b(\d{4}-\d{2}-\d{2})\b/.exec(t);
  return iso ? iso[1]! : null;
}

function extractTitle(text: string): string {
  const t = text.toLowerCase();
  const going = /(?:go(?:ing)?\s+out\s+for|playing|play|attend|attending|do|doing)\s+([a-z][a-z\s-]{2,30}?)(?=\s*(?:,|\.|\bfor\b|\bprobably\b|\band\b|\btomorrow\b|\bat\b|$))/.exec(t);
  if (going) return titleCase(going[1]!.trim());
  for (const word of ACTIVITY_WORDS) {
    if (new RegExp(`\\b${word}\\b`).test(t)) return titleCase(word);
  }
  const cleaned = text
    .replace(/\b(?:tomorrow|today|maybe|might|probably|perhaps|possibly|around|about|at|on|in|the|a|an)\b/gi, " ")
    .replace(/\b\d{1,2}(?::\d{2})?\s*(?:am|pm)?\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = cleaned.split(" ").filter(Boolean).slice(0, 5);
  return words.length > 0 ? titleCase(words.join(" ")) : "Untitled plan";
}

function titleCase(s: string): string {
  return s.replace(/\b[a-z]/g, (c) => c.toUpperCase());
}

/**
 * Deterministic capture. The example in the brief — "Tomorrow Friday at 8 AM I might go out for
 * football, probably three hours, and travel is about 30 minutes round trip" — yields a tentative
 * 08:00 plan, 180 minutes, 15 minutes travel before and after, and no confirmation.
 */
export function parsePlan(text: string, ctx: ParseContext): ParsedPlan {
  const lower = text.toLowerCase();
  const uncertain = /\b(might|maybe|probably|perhaps|possibly|thinking of|considering|not sure)\b/.test(lower);
  const immovable = /\b(must|have to|required|fixed|appointment|interview|exam)\b/.test(lower);
  const confident = /\b(definitely|confirmed|will|booked)\b/.test(lower);
  const kind: ParsedPlan["kind"] = uncertain || !confident ? "tentative_plan" : "confirmed_event";

  const dateLocal = parseDateLocal(text, ctx.now);
  const startMinute = parseClock(text);
  const estimatedMinutes = parseDuration(text);

  // Travel: a round-trip figure is split between the two legs; an each-way figure applies to both.
  let travelBeforeMin = 0;
  let travelAfterMin = 0;
  const travel = /travel(?:\s+is|\s+time)?\s*(?:about|around|roughly)?\s*(\d+|one|two|three|four|five|six|seven|eight|nine|ten|fifteen|twenty|thirty|forty|fortyfive|sixty|ninety)\s*(?:minutes?|mins?)/.exec(lower);
  if (travel) {
    const total = numberFrom(travel[1]!) ?? 0;
    if (/each way|one way|one-way/.test(lower)) {
      travelBeforeMin = total;
      travelAfterMin = total;
    } else {
      const half = Math.round(total / 2);
      travelBeforeMin = half;
      travelAfterMin = half;
    }
  }

  const unresolved: string[] = [];
  const questions: string[] = [];
  if (!dateLocal) {
    unresolved.push("date");
    questions.push("Which day is this for?");
  }
  if (startMinute === null) {
    unresolved.push("start");
    questions.push("What time does it start?");
  }
  if (estimatedMinutes === null) {
    unresolved.push("duration");
    questions.push("Roughly how long will it take?");
  }
  if (travelBeforeMin === 0 && /\bgo out|travel|leave|trip\b/.test(lower) && !travel) {
    unresolved.push("travel");
    questions.push("How long is the journey, and is that one way or round trip?");
  }

  const confidence = Math.max(0.15, Math.min(0.95, 0.55 + (dateLocal ? 0.15 : 0) + (startMinute !== null ? 0.15 : 0) + (estimatedMinutes !== null ? 0.1 : 0) - (uncertain ? 0.25 : 0)));

  return {
    title: extractTitle(text),
    kind,
    dateLocal,
    startMinute,
    estimatedMinutes,
    travelBeforeMin,
    travelAfterMin,
    flexibility: kind === "tentative_plan" ? "flexible" : immovable ? "constrained" : "flexible",
    priority: immovable ? "high" : "normal",
    confidence,
    unresolved,
    questions,
    sourceText: text,
    timezone: ctx.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone ?? "local",
  };
}

/** Turns a parsed plan into a proposal record. Status is always "proposed"; nothing is confirmed. */
export function eventFromParse(parsed: ParsedPlan, id: string, now: Date): ScheduleEvent {
  let startLocal: string | null = null;
  let endLocal: string | null = null;
  if (parsed.dateLocal && parsed.startMinute !== null) {
    const day = dayOf(parsed.dateLocal);
    startLocal = combine(day, parsed.startMinute);
    if (parsed.estimatedMinutes !== null) endLocal = combine(day, parsed.startMinute + parsed.estimatedMinutes);
  }
  return {
    id,
    title: parsed.title,
    kind: parsed.kind,
    startLocal,
    endLocal,
    windowStart: null,
    windowEnd: null,
    timezone: parsed.timezone,
    estimatedMinutes: parsed.estimatedMinutes,
    estimateConfidence: parsed.confidence,
    actualMinutes: null,
    status: "proposed",
    flexibility: parsed.flexibility,
    priority: parsed.priority,
    location: null,
    travelBeforeMin: parsed.travelBeforeMin,
    travelAfterMin: parsed.travelAfterMin,
    prepMin: 0,
    recurrence: null,
    exceptions: [],
    source: "natural_language",
    lastConfirmedAt: null,
    links: {},
    revision: 1,
  };
}

// ---------------------------------------------------------------------------------------------
// Conflict detection
// ---------------------------------------------------------------------------------------------

export interface ConflictOptions {
  /** Sleep/recovery window in minutes after midnight. Defaults to 23:00–06:30. */
  recovery?: { startMinute: number; endMinute: number };
  /** Realistic planned ceiling per day, in minutes. */
  dailyCapMinutes?: number;
  availability?: AvailabilityWindow[];
  routineOccurrences?: number;
}

interface Span {
  event: ScheduleEvent;
  day: number;
  rawStart: number;
  rawEnd: number;
  paddedStart: number;
  paddedEnd: number;
}

function spanOf(e: ScheduleEvent): Span | null {
  const s = parseLocal(e.startLocal);
  if (!s) return null;
  const duration = e.estimatedMinutes ?? (e.endLocal ? Math.max(0, (parseLocal(e.endLocal)?.minute ?? s.minute) - s.minute) : 0);
  const rawEnd = e.endLocal ? (parseLocal(e.endLocal)?.minute ?? s.minute + duration) : s.minute + duration;
  return {
    event: e,
    day: s.day,
    rawStart: s.minute,
    rawEnd,
    paddedStart: s.minute - e.travelBeforeMin - e.prepMin,
    paddedEnd: rawEnd + e.travelAfterMin,
  };
}

const isCancelled = (e: ScheduleEvent): boolean => e.status === "cancelled" || e.kind === "cancelled";

function conflict(type: ConflictType, severity: ScheduleConflict["severity"], involved: string[], explanation: string, suggestions: string[]): ScheduleConflict {
  return {
    id: `conflict:${type}:${involved.slice().sort().join(":")}`,
    type,
    severity,
    involvedIds: involved,
    explanation,
    suggestions,
  };
}

/**
 * Detects overlaps, buffer gaps, impossible travel, recovery intrusion and daily overload. Explanations
 * state the actual times and minutes involved. Detection changes nothing.
 */
export function detectConflicts(events: ScheduleEvent[], options: ConflictOptions = {}): ScheduleConflict[] {
  const recovery = options.recovery ?? { startMinute: 23 * 60, endMinute: 6 * 60 + 30 };
  const cap = options.dailyCapMinutes ?? 720;
  const active = events.filter((e) => !isCancelled(e) && e.kind !== "availability" && e.kind !== "buffer");
  const spans = active.map(spanOf).filter((s): s is Span => s !== null);
  const out: ScheduleConflict[] = [];

  for (let i = 0; i < spans.length; i += 1) {
    const a = spans[i]!;
    const overlapsRecovery =
      recovery.startMinute > recovery.endMinute
        ? a.paddedEnd > recovery.startMinute || a.paddedStart < recovery.endMinute
        : a.paddedStart < recovery.endMinute && a.paddedEnd > recovery.startMinute;
    if (overlapsRecovery) {
      out.push(
        conflict("recovery_infringement", "warning", [a.event.id], `“${a.event.title}” runs into the ${formatMinute(recovery.startMinute)}–${formatMinute(recovery.endMinute)} recovery window.`, [
        "Move the start earlier so the activity and its travel finish before the recovery window.",
        "Keep it and mark the following morning as reduced, rather than pretending the sleep was full.",
      ]),
      );
    }
    for (let j = i + 1; j < spans.length; j += 1) {
      const b = spans[j]!;
      if (a.day !== b.day) continue;
      const rawOverlap = a.rawStart < b.rawEnd && b.rawStart < a.rawEnd;
      if (rawOverlap) {
        out.push(
          conflict("overlap", "error", [a.event.id, b.event.id], `“${a.event.title}” (${formatMinute(a.rawStart)}–${formatMinute(a.rawEnd)}) overlaps “${b.event.title}” (${formatMinute(b.rawStart)}–${formatMinute(b.rawEnd)}).`, [
            "Keep the fixed commitment and move the flexible one.",
            "Shorten one duration if the times are actually approximate.",
          ]),
        );
        continue;
      }
      const [first, second] = a.rawStart <= b.rawStart ? [a, b] : [b, a];
      const gap = second.rawStart - first.rawEnd;
      if (first.event.location && second.event.location && first.event.location !== second.event.location && gap < first.event.travelAfterMin + second.event.travelBeforeMin) {
        out.push(
          conflict("impossible_travel", "error", [first.event.id, second.event.id], `Only ${gap} min between “${first.event.title}” at ${first.event.location} and “${second.event.title}” at ${second.event.location}; the combined travel is ${first.event.travelAfterMin + second.event.travelBeforeMin} min.`, [
            "Add the missing travel time or change one location.",
            "Move the flexible event to make the journey possible.",
          ]),
        );
        continue;
      }
      if (a.paddedStart < b.paddedEnd && b.paddedStart < a.paddedEnd) {
        out.push(
          conflict("missing_buffer", "warning", [a.event.id, b.event.id], `The buffers for “${a.event.title}” and “${b.event.title}” collide even though the activities do not.`, [
            "Widen the gap so preparation and travel have real time.",
          ]),
        );
      }
    }
  }

  const byDay = new Map<number, Span[]>();
  for (const s of spans) {
    if (s.event.kind === "deadline" || s.event.kind === "task") continue;
    const list = byDay.get(s.day) ?? [];
    list.push(s);
    byDay.set(s.day, list);
  }
  for (const [day, list] of byDay) {
    const total = list.reduce((sum, s) => sum + (s.paddedEnd - s.paddedStart), 0);
    if (total > cap) {
      out.push(
        conflict("daily_overload", "warning", list.map((s) => s.event.id), `${dateKey(day)} holds ${Math.round(total / 6) / 10} hours of commitments and buffers against a ${Math.round(cap / 6) / 10}-hour ceiling.`, [
          "Drop one optional item rather than compressing every transition.",
          "Move a flexible item to a day with real room.",
        ]),
      );
    }
  }

  for (const e of active) {
    if (e.kind !== "task") continue;
    const s = spanOf(e);
    if (!s) continue;
    const windows = (options.availability ?? []).filter((w) => parseLocal(w.startLocal)?.day === s.day);
    if (windows.length === 0) continue;
    const room = windows.reduce((sum, w) => {
      const a = parseLocal(w.startLocal);
      const b = parseLocal(w.endLocal);
      return sum + (a && b ? Math.max(0, b.minute - a.minute) : 0);
    }, 0);
    if (room > 0 && (e.estimatedMinutes ?? 0) > room) {
      out.push(
        conflict("duration_exceeds_availability", "warning", [e.id], `“${e.title}” needs ${e.estimatedMinutes} min but only ${room} min of availability is recorded for ${dateKey(s.day)}.`, [
          "Split the task across two windows.",
          "Reduce the scope and keep the deadline honest.",
        ]),
      );
    }
  }

  return out.sort((a, b) => Number(b.severity === "error") - Number(a.severity === "error") || a.id.localeCompare(b.id));
}

// ---------------------------------------------------------------------------------------------
// Approval-gated rescheduling
// ---------------------------------------------------------------------------------------------

export interface ProposalContext {
  now: Date;
  ttlMinutes?: number;
  reason?: string;
}

/**
 * Builds a proposal that moves only flexible/optional non-fixed items out of a detected overlap.
 * The proposal contains before and after snapshots, the ids it preserved, and an explanation. It is
 * not applied here, and `applyProposal` refuses anything the learner has not accepted.
 */
export function proposeReschedule(events: ScheduleEvent[], conflicts: ScheduleConflict[], ctx: ProposalContext): ScheduleProposal {
  const ttl = ctx.ttlMinutes ?? 30;
  const byId = new Map(events.map((e) => [e.id, e]));
  const moves: ScheduleProposal["changes"] = [];
  const preserved: string[] = [];
  const after = events.map((e) => ({ ...e }));

  for (const c of conflicts) {
    if (c.type !== "overlap" && c.type !== "impossible_travel") continue;
    const involved = c.involvedIds.map((id) => byId.get(id)).filter((e): e is ScheduleEvent => !!e);
    if (involved.length < 2) continue;
    const fixed = involved.filter((e) => e.flexibility === "immovable" || e.kind === "fixed_commitment" || e.kind === "confirmed_event");
    const movable = involved.filter((e) => e.flexibility === "flexible" || e.flexibility === "optional");
    for (const f of fixed) preserved.push(f.id);
    if (movable.length === 0) continue;
    const anchor = fixed.length > 0 ? fixed[fixed.length - 1]! : involved[0]!;
    const anchorSpan = spanOf(anchor);
    if (!anchorSpan) continue;
    let cursor = anchorSpan.rawEnd + anchor.travelAfterMin + 10;
    for (const m of movable) {
      const moved = after.find((e) => e.id === m.id);
      const s = spanOf(m);
      if (!moved || !s) continue;
      const start = combine(s.day, cursor);
      const end = m.estimatedMinutes !== null ? combine(s.day, cursor + m.estimatedMinutes) : null;
      moves.push({ id: m.id, before: { startLocal: m.startLocal, endLocal: m.endLocal }, after: { startLocal: start, endLocal: end } });
      moved.startLocal = start;
      moved.endLocal = end;
      moved.revision += 1;
      cursor = (m.estimatedMinutes ?? 30) + m.travelAfterMin + cursor + 10;
    }
  }

  const summary =
    moves.length > 0
      ? `${moves.length} flexible item${moves.length === 1 ? "" : "s"} moved, ${preserved.length} commitment${preserved.length === 1 ? "" : "s"} preserved.`
      : "No safe move is available without changing a fixed commitment.";
  return {
    id: `proposal:${ctx.now.getTime()}:${moves.map((m) => m.id).join("+") || "none"}`,
    summary,
    changes: moves,
    conflictIds: conflicts.map((c) => c.id),
    preservedIds: [...new Set(preserved)],
    beforeSnapshot: events.map((e) => ({ ...e })),
    afterSnapshot: after,
    explanation:
      moves.length > 0
        ? `Only flexible items were considered. ${ctx.reason ?? "A conflict was detected"}; the proposal keeps every fixed or confirmed record where it is and shows the exact before/after times. Nothing changes until you accept.`
        : "The conflicting records are all fixed or confirmed, so moving them is not offered. Change the commitment itself, or reduce an optional item.",
    expiresAt: new Date(ctx.now.getTime() + ttl * 60_000).toISOString(),
    decision: "pending",
    createdAt: ctx.now.toISOString(),
  };
}

export function decideProposal(proposal: ScheduleProposal, decision: "accepted" | "rejected" | "edited", now: Date, reason = ""): { proposal: ScheduleProposal; audit: ScheduleAuditEvent } {
  return {
    proposal: { ...proposal, decision },
    audit: {
      id: `audit:${proposal.id}:${decision}`,
      entityId: proposal.id,
      beforeRef: proposal.id,
      afterRef: decision === "accepted" ? `${proposal.id}:after` : null,
      approvedByUser: decision === "accepted" || decision === "edited",
      timestamp: now.toISOString(),
      reason: reason || `Proposal ${decision}.`,
      source: "proposal",
    },
  };
}

/** Applies only an accepted proposal and returns both the schedule and the reversal snapshot. */
export function applyProposal(proposal: ScheduleProposal): { events: ScheduleEvent[]; reversible: ScheduleEvent[] } {
  if (proposal.decision !== "accepted" && proposal.decision !== "edited") {
    throw new Error("proposal was not accepted; refusing to change the schedule");
  }
  return { events: proposal.afterSnapshot.map((e) => ({ ...e })), reversible: proposal.beforeSnapshot.map((e) => ({ ...e })) };
}

/** Undo restores the exact before-snapshot. It is an explicit action, never automatic. */
export function undoProposal(reversible: ScheduleEvent[], now: Date, reason = "Undo accepted proposal."): { events: ScheduleEvent[]; audit: ScheduleAuditEvent } {
  return {
    events: reversible.map((e) => ({ ...e, revision: e.revision + 1 })),
    audit: { id: `audit:undo:${now.getTime()}`, entityId: "schedule", beforeRef: null, afterRef: null, approvedByUser: true, timestamp: now.toISOString(), reason, source: "undo" },
  };
}

// ---------------------------------------------------------------------------------------------
// Recurrence
// ---------------------------------------------------------------------------------------------

/** Local dates a template occurs on, inside an inclusive range, respecting exceptions and pause. */
export function occurrenceDates(template: RoutineTemplate, from: string, to: string): string[] {
  if (template.paused) return [];
  const start = dayOf(from);
  const end = dayOf(to);
  const interval = Math.max(1, template.recurrence.interval ?? 1);
  const weekdays = template.recurrence.weekdays ?? [];
  const out: string[] = [];
  for (let day = start; day <= end; day += 1) {
    const key = dateKey(day);
    if (template.recurrence.until && key > template.recurrence.until.slice(0, 10)) break;
    if (template.exceptions.includes(key)) continue;
    if (template.recurrence.freq === "daily") {
      if ((day - start) % interval === 0) out.push(key);
    } else {
      const wd = weekdayOf(day);
      const allowed = weekdays.length > 0 ? weekdays.includes(wd) : wd === weekdayOf(start);
      if (allowed && Math.floor((day - start) / 7) % interval === 0) out.push(key);
    }
    if (out.length > 400) break;
  }
  return out;
}

/** Skips exactly one occurrence without touching the template rule or any other date. */
export function skipOccurrence(template: RoutineTemplate, dateLocal: string): RoutineTemplate {
  if (template.exceptions.includes(dateLocal)) return template;
  return { ...template, exceptions: [...template.exceptions, dateLocal] };
}

export function occurrencesForRule(rule: RecurrenceRule, from: string, to: string, exceptions: string[] = []): string[] {
  return occurrenceDates({ id: "rule", title: "rule", category: "rule", recurrence: rule, preferredWindow: null, minDurationMin: 0, maxDurationMin: 0, blocks: [], minimumViableBlocks: 0, exceptions, paused: false, reviewDate: null }, from, to);
}

// ---------------------------------------------------------------------------------------------
// Recovery-aware day planning
// ---------------------------------------------------------------------------------------------

export interface PlanBlock {
  id: string;
  title: string;
  minutes: number;
  source: "commitment" | "routine" | "task" | "recovery";
  optional: boolean;
  reason: string;
}

export interface DayPlan {
  date: string;
  committedMinutes: number;
  availableMinutes: number;
  plannedMinutes: number;
  blocks: PlanBlock[];
  conflicts: ScheduleConflict[];
  note: string;
}

export interface PlanDayInput {
  date: string;
  events: ScheduleEvent[];
  tasks: Task[];
  routine?: { title: string; blocks: { title: string; minutes: number }[]; optionalTail?: number } | null;
  availability?: AvailabilityWindow[];
  recovery?: { startMinute: number; endMinute: number };
}

/**
 * Combines commitments, availability, tasks and the learning routine into one explainable day. When
 * the day is over capacity, optional routine blocks are dropped first and the trade-off is stated.
 * There is no backlog debt: yesterday's unplanned work is not silently added here.
 */
export function planDay(input: PlanDayInput): DayPlan {
  const day = dayOf(input.date);
  const recovery = input.recovery ?? { startMinute: 23 * 60, endMinute: 6 * 60 + 30 };
  const events = input.events.filter((e) => !isCancelled(e) && parseLocal(e.startLocal)?.day === day);
  const committedMinutes = events
    .filter((e) => e.kind !== "availability" && e.kind !== "buffer")
    .reduce((sum, e) => sum + (e.estimatedMinutes ?? 0) + e.travelBeforeMin + e.travelAfterMin + e.prepMin, 0);
  const availability = (input.availability ?? []).filter((w) => parseLocal(w.startLocal)?.day === day);
  const availableMinutes =
    availability.length > 0
      ? availability.reduce((sum, w) => {
          const a = parseLocal(w.startLocal);
          const b = parseLocal(w.endLocal);
          return sum + (a && b ? Math.max(0, b.minute - a.minute) : 0);
        }, 0)
      : Math.max(0, DAY_MINUTES - committedMinutes - (DAY_MINUTES - (recovery.startMinute - recovery.endMinute)));

  const blocks: PlanBlock[] = events
    .filter((e) => e.startLocal)
    .sort((a, b) => (a.startLocal ?? "").localeCompare(b.startLocal ?? ""))
    .map((e) => ({ id: e.id, title: e.title, minutes: (e.estimatedMinutes ?? 0) + e.travelBeforeMin + e.travelAfterMin, source: "commitment", optional: e.flexibility === "optional", reason: "Recorded commitment." }));

  const remaining = Math.max(0, availableMinutes - committedMinutes);
  if (input.routine) {
    let used = 0;
    const optionalTail = input.routine.optionalTail ?? 0;
    input.routine.blocks.forEach((b, i) => {
      const optional = i >= input.routine!.blocks.length - optionalTail;
      if (used + b.minutes > remaining) {
        if (!optional) return;
        return;
      }
      used += b.minutes;
      blocks.push({ id: `routine:${i}`, title: b.title, minutes: b.minutes, source: "routine", optional, reason: optional ? "Optional tail; droppable on a full day." : "Learning routine block inside remaining time." });
    });
  }

  const overdue = input.tasks.filter((t) => t.status === "open" && t.dueLocal && dayOf(t.dueLocal) <= day);
  for (const t of overdue) {
    const minutes = Math.min(t.minMinutes, Math.max(0, remaining - blocks.reduce((n, b) => n + b.minutes, 0)));
    if (minutes <= 0) break;
    blocks.push({ id: t.id, title: t.title, minutes, source: "task", optional: t.flexibility === "optional", reason: `Due ${t.dueLocal?.slice(0, 10)}; scheduled inside the remaining window.` });
  }

  const plannedMinutes = blocks.reduce((n, b) => n + b.minutes, 0);
  const conflicts = detectConflicts(input.events, { recovery, availability: input.availability });
  const note =
    plannedMinutes > availableMinutes
      ? `Over capacity by ${plannedMinutes - availableMinutes} min. Optional blocks were not protected.`
      : committedMinutes === 0
        ? "No commitments recorded. The whole day is open; nothing has been assumed."
        : `${Math.max(0, availableMinutes - plannedMinutes)} min remain after commitments and the routine.`;
  return { date: input.date, committedMinutes, availableMinutes, plannedMinutes, blocks, conflicts, note };
}

export function minutesToLabel(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

export function newTaskId(prefix = "task"): string {
  return `${prefix}:${Date.now().toString(36)}:${Math.random().toString(36).slice(2, 8)}`;
}
