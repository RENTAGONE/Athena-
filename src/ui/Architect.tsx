import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ArrowRight, Clock, Route, Target } from "lucide-react";
import { buildPath, nextSteps } from "../app/engines/path.ts";
import { buildRoutine } from "../app/engines/routine.ts";
import { DISCIPLINES, DISCIPLINE_BY_ID } from "./disciplines.ts";
import { PageBack } from "./PageBack.tsx";
import { useApp } from "./context.ts";
import { useEngineInput } from "./use-engine-input.ts";
import { usePrefs } from "./prefs.ts";
import { Head } from "./ui.tsx";

/**
 * Architect. Composes a study path from the recorded graph: choose a discipline, see the frontier
 * (records whose prerequisites are already demonstrated), then inspect one record's prerequisite
 * chain. It writes nothing — the plan is a view of the store, and a lesson is where evidence starts.
 */
export function ArchitectScreen(): ReactNode {
  const { state } = useApp();
  const input = useEngineInput();
  const prefs = usePrefs();
  const [discipline, setDiscipline] = useState<string | null>(null);
  const [targetId, setTargetId] = useState<string | null>(null);

  const frontier = useMemo(() => nextSteps(input, 8, discipline), [input, discipline]);
  const routine = useMemo(
    () => buildRoutine(input, { minutes: prefs.minutesTarget, discipline }),
    [input, prefs.minutesTarget, discipline],
  );
  const chain = useMemo(() => (targetId ? buildPath(input, targetId) : []), [input, targetId]);
  const target = targetId ? state.nodes[targetId] : undefined;
  const meta = discipline ? DISCIPLINE_BY_ID[discipline] : undefined;

  return (
    <>
      <PageBack href="#/studio/updates" label="Studio" />
      <Head label="Architect Studio" title="Plan a path" />

      <div className="workspace">
        <div className="span-7 stack">
          <section className="panel">
            <div className="row between wrap">
              <span className="label">Frontier · <span className="num">{frontier.length}</span> open</span>
              <span className="tag"><Target size={12} strokeWidth={1.6} aria-hidden="true" /> prerequisites met</span>
            </div>
            <p className="empty" style={{ marginTop: 8 }}>
              Records whose PREREQUISITE_FOR sources are all demonstrated. Opening one never marks it done; the lesson records evidence.
            </p>
            <div className="chip-row">
              <button className="chip" aria-pressed={discipline === null} onClick={() => { setDiscipline(null); setTargetId(null); }}>All</button>
              {DISCIPLINES.map((d) => (
                <button
                  key={d.id}
                  className="chip"
                  aria-pressed={discipline === d.id}
                  onClick={() => { setDiscipline(discipline === d.id ? null : d.id); setTargetId(null); }}
                >
                  <d.Icon size={13} strokeWidth={1.5} aria-hidden="true" color={d.color} />{d.short}
                </button>
              ))}
            </div>
            {frontier.length === 0 ? (
              <p className="empty" style={{ marginTop: 14 }}>No open record in this scope. Every skill-like record is either demonstrated or blocked behind an unmet prerequisite.</p>
            ) : (
              <ul className="list frontier-list">
                {frontier.map((step) => (
                  <li key={step.node.id}>
                    <button className="frontier-item" onClick={() => setTargetId(step.node.id)} aria-pressed={targetId === step.node.id}>
                      <span className="frontier-main">
                        <strong>{step.node.title}</strong>
                        <span className="mono">{step.node.code}</span>
                        <span className="empty">{step.reason}</span>
                      </span>
                      <span className="tag">{step.tier.replace(/_/g, " ")}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {target && chain.length > 0 && (
            <section className="panel rail" style={{ ["--rail" as string]: meta?.color ?? "var(--signal-blue)" }}>
              <div className="row between wrap">
                <span className="label"><Route size={13} strokeWidth={1.5} aria-hidden="true" /> Path to {target.title}</span>
                <button className="btn sm ghost" onClick={() => setTargetId(null)}>Clear</button>
              </div>
              <ol className="path-list" style={{ marginTop: 12 }}>
                {chain.map((s, i) => (
                  <li key={s.node.id} data-state={s.state}>
                    <span className="mono">{i + 1}</span>
                    <a href={`#/knowledge/${encodeURIComponent(s.node.code)}`}>{s.node.title}</a>
                    <span className="tag">{s.state === "done" ? "demonstrated" : s.state === "next" ? "next" : "locked"}</span>
                  </li>
                ))}
              </ol>
              <a className="btn primary" style={{ marginTop: 14 }} href={`#/learn/${encodeURIComponent(target.code)}`}>
                Start this lesson<ArrowRight size={15} strokeWidth={1.5} aria-hidden="true" />
              </a>
            </section>
          )}
        </div>

        <div className="span-5 stack">
          <section className="panel">
            <span className="label"><Clock size={13} strokeWidth={1.5} aria-hidden="true" /> Draft routine · <span className="num">{routine.totalMinutes}</span> min</span>
            <p className="empty" style={{ marginTop: 6 }}>The same engine that fills Today, scoped to this discipline.</p>
            {routine.blocks.length === 0 ? (
              <p className="empty" style={{ marginTop: 10 }}>No block fits this scope yet. Load the pack or record an outcome.</p>
            ) : (
              <ul className="list routine-mini" style={{ marginTop: 10 }}>
                {routine.blocks.map((b) => (
                  <li key={b.id}>
                    <a href={`#/learn/${encodeURIComponent(b.code)}`}>
                      <span className={`routine-dot kind-${b.kind}`} aria-hidden="true" />
                      <span className="grow">{b.title}</span>
                      <span className="mono empty">{b.minutes}m</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="panel">
            <span className="label">How the path is ordered</span>
            <div className="stack" style={{ marginTop: 10 }}>
              <p>Only <code>PREREQUISITE_FOR</code> links order the chain. Related and transfer links are shown on the record, never treated as gates.</p>
              <p>A step counts as done only when its mastery tier is demonstrated or mastered from stored evidence.</p>
              <p>The frontier is capped at eight records and sorted by how many records each one unlocks.</p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
