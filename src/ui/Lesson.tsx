import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ArrowRight, BookOpen, Check, Clock, Target } from "lucide-react";
import { buildLesson } from "../app/engines/session.ts";
import { buildPath } from "../app/engines/path.ts";
import { nodeByCode, masteryTier, evidenceIndex } from "../app/selectors.ts";
import { DISCIPLINE_BY_ID } from "./disciplines.ts";
import { PageBack } from "./PageBack.tsx";
import { PracticeSession } from "./screens.tsx";
import { useApp } from "./context.ts";
import { useEngineInput } from "./use-engine-input.ts";
import { PageHead, disciplineVar } from "./ui.tsx";

const STAGES = ["Read", "Practise", "Retrieve", "Record"] as const;

export function LessonScreen({ code }: { code: string }): ReactNode {
  const { state } = useApp();
  const input = useEngineInput();
  const node = nodeByCode(state, code);
  const plan = useMemo(() => (node ? buildLesson(input, node.id) : null), [input, node]);
  const path = useMemo(() => (node ? buildPath(input, node.id) : []), [input, node]);
  const index = useMemo(() => evidenceIndex(state), [state]);
  const [stage, setStage] = useState(0);
  const [done, setDone] = useState<Record<number, boolean>>({});

  if (!node || !plan) {
    return (
      <>
        <PageBack href="#/knowledge" label="Knowledge" />
        <PageHead label="Learning lesson" title="Record not found" />
        <p>No record has the code <code>{code}</code>. <a href="#/knowledge">Back to the atlas</a></p>
      </>
    );
  }

  const meta = DISCIPLINE_BY_ID[node.owner_discipline_id ?? ""];
  const tier = masteryTier(index, node.id);
  const doneCount = plan.protocol.filter((_, i) => done[i] === true).length;
  const last = stage === STAGES.length - 1;

  return (
    <div className="page page-lesson">
      <PageBack href={`#/knowledge/${encodeURIComponent(node.code)}`} label={node.title} />
      <PageHead
        label={`${node.object_type.replace(/_/g, " ")} · ${meta?.short ?? "cross-cutting"}`}
        title={`Learn · ${node.title}`}
        tone={disciplineVar(node.owner_discipline_id)}
        meta={<>{plan.minutes} min · {plan.protocol.length} protocol step{plan.protocol.length === 1 ? "" : "s"} · evidence is recorded only at the last stage.</>}
        glyph={<BookOpen strokeWidth={1.4} />}
      />

      <nav className="lesson-stepper" aria-label="Lesson stages">
        {STAGES.map((label, i) => (
          <button
            key={label}
            aria-current={i === stage ? "step" : undefined}
            data-done={i < stage ? "true" : undefined}
            onClick={() => setStage(i)}
          >
            <span className="step-num">{i < stage ? <Check size={13} strokeWidth={2.2} aria-hidden="true" /> : i + 1}</span>
            {label}
          </button>
        ))}
      </nav>

      <div className="workspace">
        <div className="span-7">
          <section className="panel lesson-stage" style={{ ["--rail" as string]: disciplineVar(node.owner_discipline_id) }}>
            <div className="stage-head">
              <span className="stage-index" aria-hidden="true">{String(stage + 1).padStart(2, "0")}</span>
              <span className="label">Stage {stage + 1} of {STAGES.length} · {STAGES[stage]}</span>
            </div>

            {stage === 0 && (
              <>
                <h2 className="lesson-h2">{plan.objective ?? node.title}</h2>
                <p className="empty" style={{ marginTop: 6 }}>
                  Imported specification, read only. It describes what competence would look like; it is not a claim about you.
                </p>
                {plan.successCriteria && (
                  <div className="lesson-block">
                    <span className="label"><Target size={13} strokeWidth={1.5} aria-hidden="true" /> Success criteria</span>
                    <p>{plan.successCriteria}</p>
                  </div>
                )}
                {plan.prerequisites.length > 0 && (
                  <div className="lesson-block">
                    <span className="label">Check first</span>
                    <ul className="list lesson-list">
                      {plan.prerequisites.map((p) => (
                        <li key={p.node.id}>
                          <a href={`#/knowledge/${encodeURIComponent(p.node.code)}`}>{p.node.title}</a>
                          <span className={`tag ${p.held ? "ok" : ""}`}>{p.held ? "demonstrated" : "no evidence yet"}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {path.length > 1 && (
                  <div className="lesson-block">
                    <span className="label">Path to this record</span>
                    <ol className="path-list">
                      {path.map((s, i) => (
                        <li key={s.node.id} data-state={s.state}>
                          <span className="mono">{i + 1}</span>
                          <a href={`#/knowledge/${encodeURIComponent(s.node.code)}`}>{s.node.title}</a>
                          <span className="tag">{s.state === "done" ? "done" : s.state === "next" ? "next" : "later"}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </>
            )}

            {stage === 1 && (
              <>
                <div className="row between wrap">
                  <h2 className="lesson-h2">Practice protocol</h2>
                  <span className="tag"><Clock size={12} strokeWidth={1.6} aria-hidden="true" /> {plan.minutes} min</span>
                </div>
                <p className="empty" style={{ marginTop: 6 }}>
                  {plan.hasProtocol
                    ? "The content package ships these steps. Tick them as you work; ticking is local and is not saved as evidence."
                    : "This record carries no protocol, so a neutral four-step routine is shown instead."}
                </p>
                <ol className="lesson-protocol">
                  {plan.protocol.map((step, i) => (
                    <li key={i}>
                      <label className="check">
                        <input
                          type="checkbox"
                          checked={done[i] === true}
                          onChange={(e: { target: HTMLInputElement }) => setDone((d) => ({ ...d, [i]: e.target.checked }))}
                        />
                        <span>{step}</span>
                        {done[i] === true && <Check size={14} strokeWidth={1.6} aria-hidden="true" color="var(--growth-teal)" />}
                      </label>
                    </li>
                  ))}
                </ol>
                <p className="mono empty"><span className="num">{doneCount}</span> of <span className="num">{plan.protocol.length}</span> steps ticked</p>
              </>
            )}

            {stage === 2 && (
              <>
                <h2 className="lesson-h2">Retrieval check</h2>
                <p className="empty" style={{ marginTop: 6 }}>Answer from memory first. The imported text stays hidden until you open it.</p>
                <div className="stack" style={{ marginTop: 14 }}>
                  {plan.prompts.map((p, i) => (
                    <details className="prompt-card" key={i}>
                      <summary>{p.question}</summary>
                      <p>{p.reference ?? "This record carries no reference text for this prompt."}</p>
                    </details>
                  ))}
                </div>
              </>
            )}

            {stage === 3 && <PracticeSession node={node} steps={plan.protocol} />}

            <div className="row between" style={{ marginTop: 18 }}>
              <button className="btn" disabled={stage === 0} onClick={() => setStage((s) => Math.max(0, s - 1))}>Previous</button>
              {!last ? (
                <button className="btn primary" onClick={() => setStage((s) => Math.min(STAGES.length - 1, s + 1))}>
                  {stage === 2 ? "Record what happened" : "Next stage"}
                  <ArrowRight size={15} strokeWidth={1.5} aria-hidden="true" />
                </button>
              ) : (
                <a className="btn" href={`#/knowledge/${encodeURIComponent(node.code)}`}>Open full record</a>
              )}
            </div>
          </section>
        </div>

        <div className="span-5 stack">
          <section className="panel rail" style={{ ["--rail" as string]: meta?.color ?? "var(--signal-blue)" }}>
            <span className="label">This record</span>
            <dl className="kv" style={{ marginTop: 10 }}>
              <dt>Code</dt><dd className="mono">{node.code}</dd>
              <dt>Status</dt><dd>{node.status}</dd>
              <dt>Mastery</dt><dd>{tier.replace(/_/g, " ")}</dd>
              <dt>Evidence</dt><dd className="num">{index.byTarget.get(node.id)?.length ?? 0}</dd>
              <dt>Discipline</dt><dd>{meta?.name ?? "cross-cutting"}</dd>
            </dl>
            <p className="empty" style={{ marginTop: 10 }}>Mastery changes only when stored evidence changes. Finishing a stage does not count.</p>
          </section>

          <section className="panel">
            <span className="label"><BookOpen size={13} strokeWidth={1.5} aria-hidden="true" /> Connected records</span>
            {plan.related.length === 0 ? (
              <p className="empty" style={{ marginTop: 8 }}>No non-hierarchical links from this record.</p>
            ) : (
              <ul className="list lesson-list" style={{ marginTop: 10 }}>
                {plan.related.map((r) => (
                  <li key={`${r.node.id}:${r.relation}`}>
                    <a href={`#/learn/${encodeURIComponent(r.node.code)}`}>{r.node.title}</a>
                    <span className="tag">{r.relation.replace(/_/g, " ").toLowerCase()}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
