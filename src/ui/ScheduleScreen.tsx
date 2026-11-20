import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { CalendarDays, Check, Clock3, TriangleAlert, Undo2 } from "lucide-react";
import {
  applyProposal,
  decideProposal,
  detectConflicts,
  eventFromParse,
  formatMinute,
  parsePlan,
  planDay,
  proposeReschedule,
  type ParsedPlan,
} from "../app/engines/schedule.ts";
import { buildRoutine } from "../app/engines/routine.ts";
import type { ScheduleEvent, ScheduleProposal, Task } from "../domain/system.ts";
import { useApp } from "./context.ts";
import { PageHead, SectionHead } from "./ui.tsx";
import { useEngineInput } from "./use-engine-input.ts";

const todayLocal = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export function ScheduleScreen(): ReactNode {
  const { rt, state } = useApp();
  const input = useEngineInput();
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [proposal, setProposal] = useState<ScheduleProposal | null>(null);
  const [parsed, setParsed] = useState<ParsedPlan | null>(null);
  const [text, setText] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async (): Promise<void> => {
    const [e, t] = await Promise.all([rt.store.listRows<ScheduleEvent>("scheduleEvents"), rt.store.listRows<Task>("tasks")]);
    setEvents(e.sort((a, b) => (a.startLocal ?? "").localeCompare(b.startLocal ?? "")));
    setTasks(t);
    setLoading(false);
  }, [rt.store]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const routine = useMemo(() => buildRoutine(input, {}), [input]);
  const conflicts = useMemo(() => detectConflicts(events), [events]);
  const today = todayLocal();
  const plan = useMemo(
    () =>
      planDay({
        date: today,
        events,
        tasks,
        routine: { title: routine.date, blocks: routine.blocks.map((b) => ({ title: b.title, minutes: b.minutes })), optionalTail: 1 },
      }),
    [events, tasks, routine, today],
  );

  const readCapture = (): void => {
    const p = parsePlan(text, { now: new Date() });
    setParsed(p);
    setProposal(null);
    setNote(null);
  };

  const saveParsed = async (): Promise<void> => {
    if (!parsed) return;
    const ev = eventFromParse(parsed, `evt:${Date.now().toString(36)}`, new Date());
    await rt.store.putRow("scheduleEvents", ev as unknown as Record<string, unknown> & { id: string });
    setParsed(null);
    setText("");
    setNote("Recorded as a plan awaiting confirmation. Nothing was confirmed automatically.");
    await reload();
  };

  const confirm = async (ev: ScheduleEvent): Promise<void> => {
    await rt.store.putRow("scheduleEvents", { ...ev, status: "confirmed", lastConfirmedAt: new Date().toISOString(), revision: ev.revision + 1 } as unknown as Record<string, unknown> & { id: string });
    await reload();
  };

  const remove = async (ev: ScheduleEvent): Promise<void> => {
    await rt.store.deleteRow("scheduleEvents", ev.id);
    await reload();
  };

  const buildProposal = (): void => {
    setProposal(proposeReschedule(events, conflicts, { now: new Date() }));
  };

  const accept = async (): Promise<void> => {
    if (!proposal) return;
    const decided = decideProposal(proposal, "accepted", new Date());
    const applied = applyProposal(decided.proposal);
    for (const ev of applied.events) {
      await rt.store.putRow("scheduleEvents", ev as unknown as Record<string, unknown> & { id: string });
    }
    await rt.store.appendRow("scheduleAuditEvents", decided.audit as unknown as Record<string, unknown> & { id: string });
    setProposal(null);
    setNote("Accepted. The before-state was kept; Undo restores it exactly.");
    await reload();
  };

  return (
    <div className="page page-record page-schedule">
      <PageHead
        label="Execution · Life &amp; schedule"
        title="Time and commitments"
        meta={<>Every item here is either typed by you or parsed from your words with the gaps left open. <b>{events.length}</b> record{events.length === 1 ? "" : "s"} · <b>{conflicts.length}</b> conflict{conflicts.length === 1 ? "" : "s"} detected.</>}
        glyph={<CalendarDays strokeWidth={1.4} />}
      />

      <div className="workspace">
        <section className="panel span-7">
          <SectionHead label="Capture in your own words" aside={<span className="mono">offline · deterministic</span>} />
          <label className="capture-field">
            <span className="label">What is happening?</span>
            <textarea
              rows={3}
              value={text}
              onChange={(e: { target: HTMLTextAreaElement }) => setText(e.target.value)}
              placeholder="Tomorrow at 8 AM I might go out for football, probably three hours, and travel is about 30 minutes round trip."
            />
          </label>
          <div className="row wrap" style={{ marginTop: 10 }}>
            <button className="btn primary" onClick={readCapture} disabled={!text.trim()}>Read this</button>
            <span className="hint">A tentative plan stays tentative. Missing time or duration becomes a question, never a guess.</span>
          </div>

          {parsed && (
            <div className="preview-card">
              <div className="row between">
                <strong>{parsed.title}</strong>
                <span className="tag" style={{ borderColor: parsed.kind === "tentative_plan" ? "var(--insight-amber)" : "var(--growth-teal)" }}>
                  {parsed.kind.replace(/_/g, " ")}
                </span>
              </div>
              <dl className="kv">
                <div><dt>Date</dt><dd>{parsed.dateLocal ?? "not stated"}</dd></div>
                <div><dt>Start</dt><dd>{parsed.startMinute === null ? "not stated" : formatMinute(parsed.startMinute)}</dd></div>
                <div><dt>Duration</dt><dd>{parsed.estimatedMinutes === null ? "not stated" : `${parsed.estimatedMinutes} min`}</dd></div>
                <div><dt>Travel</dt><dd>{parsed.travelBeforeMin + parsed.travelAfterMin === 0 ? "none recorded" : `${parsed.travelBeforeMin} before · ${parsed.travelAfterMin} after`}</dd></div>
                <div><dt>Confidence</dt><dd><span className="num">{Math.round(parsed.confidence * 100)}</span>% from the words used</dd></div>
              </dl>
              {parsed.questions.length > 0 && (
                <ul className="list compact">
                  {parsed.questions.map((q) => <li key={q} className="mono">{q}</li>)}
                </ul>
              )}
              <div className="row" style={{ marginTop: 10 }}>
                <button className="btn primary grow" onClick={() => void saveParsed()}>Record plan</button>
                <button className="btn grow" onClick={() => setParsed(null)}>Discard</button>
              </div>
            </div>
          )}
          {note && <p className="hint" role="status" style={{ marginTop: 10 }}>{note}</p>}
        </section>

        <section className="panel span-5">
          <SectionHead label="Today at a glance" aside={<span className="num">{plan.plannedMinutes} min</span>} />
          <p style={{ marginTop: 6 }}>{plan.note}</p>
          <div className="stat-grid tight">
            <div className="stat"><b>{plan.committedMinutes}</b><span>committed min</span></div>
            <div className="stat"><b>{Math.max(0, plan.availableMinutes - plan.committedMinutes)}</b><span>available min</span></div>
            <div className="stat"><b>{conflicts.length}</b><span>conflicts</span></div>
          </div>
          <ul className="timeline">
            {plan.blocks.length === 0 && <li className="hint">Nothing is scheduled for today. That is a real empty state, not a placeholder.</li>}
            {plan.blocks.map((b) => (
              <li key={b.id}>
                <span className={`dot ${b.source}`} aria-hidden="true" />
                <span className="t">{b.title}</span>
                <span className="num">{b.minutes}m</span>
                <span className="hint">{b.reason}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="workspace">
        <section className="panel span-7">
          <SectionHead label="Recorded commitments" aside={<span className="mono">{loading ? "reading…" : "local"}</span>} />
          {events.length === 0 && !loading ? (
            <p className="empty">No schedule records yet. Capture one above, or add a fixed commitment with the form below.</p>
          ) : (
            <ul className="list">
              {events.map((ev) => (
                <li key={ev.id} className="item-row">
                  <span className="t">{ev.title}</span>
                  <span className="mono">{ev.startLocal ? ev.startLocal.replace("T", " ") : "time not set"}</span>
                  <span className="tag" style={{ borderColor: ev.status === "proposed" ? "var(--insight-amber)" : "var(--border)" }}>{ev.kind.replace(/_/g, " ")}</span>
                  <span className="hint">{ev.estimatedMinutes === null ? "duration not set" : `${ev.estimatedMinutes} min`}</span>
                  <span className="row gap">
                    {ev.status === "proposed" && <button className="icon-btn" aria-label={`Confirm ${ev.title}`} onClick={() => void confirm(ev)}><Check size={14} strokeWidth={1.6} /></button>}
                    <button className="icon-btn" aria-label={`Remove ${ev.title}`} onClick={() => void remove(ev)}><Undo2 size={14} strokeWidth={1.6} /></button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel span-5">
          <SectionHead label="Conflicts" aside={<TriangleAlert size={14} strokeWidth={1.5} aria-hidden="true" />} />
          {conflicts.length === 0 ? (
            <p className="empty">No overlap, travel gap, buffer or overload is currently detected in the recorded times.</p>
          ) : (
            <ul className="list">
              {conflicts.map((c) => (
                <li key={c.id}>
                  <div className="row between">
                    <strong style={{ color: c.severity === "error" ? "var(--insight-amber)" : "var(--text-secondary)" }}>{c.type.replace(/_/g, " ")}</strong>
                    <span className="tag">{c.severity}</span>
                  </div>
                  <p style={{ margin: "4px 0 0" }}>{c.explanation}</p>
                  <p className="hint">{c.suggestions[0]}</p>
                </li>
              ))}
            </ul>
          )}
          {conflicts.length > 0 && (
            <button className="btn" style={{ marginTop: 12 }} onClick={buildProposal}>
              <Clock3 size={14} strokeWidth={1.5} aria-hidden="true" /> Preview a reschedule
            </button>
          )}
          {proposal && (
            <div className="preview-card">
              <strong>{proposal.summary}</strong>
              <p style={{ margin: "6px 0" }}>{proposal.explanation}</p>
              <ul className="list compact">
                {proposal.changes.map((c) => (
                  <li key={c.id} className="mono">{c.id}: {c.before.startLocal?.slice(11) ?? "—"} → {c.after.startLocal?.slice(11) ?? "—"}</li>
                ))}
              </ul>
              <div className="row" style={{ marginTop: 10 }}>
                <button className="btn primary grow" onClick={() => void accept()} disabled={proposal.changes.length === 0}>Accept</button>
                <button className="btn grow" onClick={() => setProposal(null)}>Keep as is</button>
              </div>
              <p className="hint" style={{ marginTop: 8 }}>Expires {proposal.expiresAt.slice(11, 16)}. Nothing changes before you accept.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
