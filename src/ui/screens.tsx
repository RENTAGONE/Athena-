import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ArrowRight, Check } from "lucide-react";
import { deriveCompetency, type CompetencyState } from "../domain/competency.ts";
import type { EvidenceStored, NodeRecord, OutcomeValue } from "../domain/types.ts";
import { confirmMastery, recordPractice } from "../app/activity.ts";
import { evidenceIndex, masteryTier, nodeByCode, prerequisiteCount, todayView, MASTERY_TIERS, type MasteryTier } from "../app/selectors.ts";
import { DISCIPLINE_BY_ID } from "./disciplines.ts";
import { useApp } from "./context.ts";
import { Empty, Head, StatusTag, disciplineVar } from "./ui.tsx";
import { ImportPanel } from "./studio.tsx";

const TIER_COLOR: Record<MasteryTier, string> = {
  unassessed: "var(--text-muted)",
  needs_revision: "var(--insight-amber)",
  demonstrated: "var(--growth-teal)",
  mastered: "var(--growth-teal)",
};
const TIER_LABEL: Record<MasteryTier, string> = {
  unassessed: "unassessed",
  needs_revision: "needs revision",
  demonstrated: "demonstrated",
  mastered: "mastered",
};

export function Today(): ReactNode {
  const { state } = useApp();
  const index = useMemo(() => evidenceIndex(state), [state]);
  const view = useMemo(() => todayView(state, index), [state, index]);
  const top = view.focus[0];
  const topMeta = top ? DISCIPLINE_BY_ID[top.discipline] : undefined;

  return (
    <>
      <Head label={view.localDate} title="Today" />
      <div className="workspace">
        <div className="span-7">
          <section className="panel rail">
            <div className="row between">
              <span className="label">Primary focus</span>
              <span className="mono" style={{ color: "var(--text-muted)" }}>{view.isoDate}</span>
            </div>
            {top && topMeta ? (
              <>
                <h2 style={{ marginTop: 8 }}>{topMeta.name}</h2>
                <p style={{ marginTop: 6 }}>
                  <span className="num">{top.needsRevision}</span> records need revision · <span className="num">{top.demonstrated}</span> demonstrated · <span className="num">{top.total}</span> skills tracked.
                </p>
                <a className="btn" href="#/knowledge">Open the atlas<ArrowRight size={15} strokeWidth={1.5} aria-hidden="true" /></a>
              </>
            ) : (
              <>
                <h2 style={{ marginTop: 8 }}>No learning evidence yet</h2>
                <p>Focus is derived from stored evidence, not from opening a page. Record a practice session on any skill and it appears here.</p>
                <a className="btn" href="#/knowledge">Browse the catalogue</a>
              </>
            )}
          </section>

          <section className="panel">
            <span className="label">Needs revision · <span className="num">{view.review.length}</span></span>
            {view.review.length === 0 ? (
              <p style={{ marginTop: 8 }} className="empty">Nothing is waiting for revision. A record enters this queue only when its latest scored outcome is “not demonstrated” or only partial.</p>
            ) : (
              <ul className="list" style={{ marginTop: 10 }}>
                {view.review.slice(0, 8).map((it) => (
                  <li key={it.node.id}>
                    <a className="item" href={`#/knowledge/${encodeURIComponent(it.node.code)}`} style={{ ["--rail" as string]: disciplineVar(it.node.owner_discipline_id) }}>
                      <span className="t">{it.node.title}</span>
                      <span className="code mono">{it.node.code}</span>
                      <span className="tag draft">{TIER_LABEL[it.tier]}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="panel">
            <span className="label">Active learning · <span className="num">{view.active.length}</span></span>
            {view.active.length === 0 ? (
              <p style={{ marginTop: 8 }} className="empty">No skill has an independent demonstration yet. The conservative rules need evidence you produced without help.</p>
            ) : (
              <ul className="list" style={{ marginTop: 10 }}>
                {view.active.slice(0, 8).map((it) => (
                  <li key={it.node.id}>
                    <a className="item" href={`#/knowledge/${encodeURIComponent(it.node.code)}`} style={{ ["--rail" as string]: disciplineVar(it.node.owner_discipline_id) }}>
                      <span className="t">{it.node.title}</span>
                      <span className="code mono">{it.node.code}</span>
                      <span className="tag ok">{TIER_LABEL[it.tier]}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="span-5">
          <section className="panel">
            <span className="label">Local store · honest counts</span>
            <dl className="kv" style={{ marginTop: 10 }}>
              <dt>Records</dt><dd><span className="num">{view.counts.nodes}</span> knowledge records</dd>
              <dt>Relations</dt><dd><span className="num">{view.counts.edges}</span> edges</dd>
              <dt>Disciplines</dt><dd><span className="num">{view.counts.disciplines}</span> canonical</dd>
              <dt>Domains</dt><dd><span className="num">{view.counts.domains}</span></dd>
              <dt>Skills</dt><dd><span className="num">{view.counts.skills}</span> skill, subskill and micro-skill records</dd>
              <dt>Evidence</dt><dd><span className="num">{view.counts.evidence}</span> records · <span className="num">{view.counts.scoredEvidence}</span> outcome-scored</dd>
              <dt>Draft</dt><dd><span className="num">{view.counts.draft}</span> of <span className="num">{view.counts.nodes}</span> records</dd>
              <dt>Last import</dt>
              <dd>{view.lastImport ? `${new Date(view.lastImport.at).toLocaleString()} · ${view.lastImport.state}` : "none yet"}</dd>
            </dl>
          </section>

          <section className="panel">
            <span className="label">Projects by class</span>
            <div className="stack" style={{ marginTop: 10 }}>
              {view.projects.map((g) => (
                <div key={g.key}>
                  <div className="row between">
                    <strong>{g.label}</strong>
                    <span className="num" style={{ color: "var(--text-muted)" }}>{g.projects.length}</span>
                  </div>
                  <p style={{ margin: "2px 0 0" }}>{g.description}</p>
                  {g.projects.length > 0 && (
                    <ul className="list" style={{ marginTop: 6 }}>
                      {g.projects.map((p) => (
                        <li key={p.id} className="mono">{p.code} · {p.title}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            <p style={{ marginTop: 12 }} className="empty">
              Projects appear here once a package imports them with a <code>project_class</code>. The bundled seed contains none.
            </p>
          </section>

          <section className="panel">
            <span className="label">Load content</span>
            <p style={{ marginTop: 8 }}>The Pack v1.0 seed ships with the app. Preview it first: nothing is written until you approve.</p>
            <ImportPanel seed />
          </section>
        </div>
      </div>
    </>
  );
}

/* ── Skill detail ─────────────────────────────────────────────────────────── */

const FACT_KEYS: [string, string][] = [
  ["Definition", "definition"],
  ["Description", "description"],
  ["Outcome", "outcome_statement"],
  ["Target performance", "target_performance"],
  ["Evidence accepted", "evidence_types"],
  ["Safety class", "safety_class"],
  ["Risk level", "risk_level"],
  ["Supervision", "supervision"],
  ["Practice protocol", "practice_protocol"],
  ["Assessment", "assessment"],
  ["Success criteria", "success_criteria"],
  ["Mastery criteria", "mastery_criteria"],
  ["Progression", "progression"],
  ["Maintenance", "maintenance"],
  ["Time to first competence (minutes)", "time_to_initial_competence_minutes"],
  ["Difficulty", "difficulty_dimensions"],
];

function renderValue(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  if (typeof v === "string") return v.trim() || null;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) {
    const parts = v.map((x) => (typeof x === "string" ? x : renderValue(x))).filter((x): x is string => !!x);
    return parts.length ? parts.join(" · ") : null;
  }
  if (typeof v === "object") {
    const rows = Object.entries(v as Record<string, unknown>)
      .map(([k, val]) => {
        const s = renderValue(val);
        return s ? `${k.replace(/_/g, " ")}: ${s}` : null;
      })
      .filter((x): x is string => !!x);
    return rows.length ? rows.join(" · ") : null;
  }
  return null;
}

export function SkillDetail({ code }: { code: string }): ReactNode {
  const { state } = useApp();
  const node = nodeByCode(state, code);
  const index = useMemo(() => evidenceIndex(state), [state]);
  const [comp, setComp] = useState<CompetencyState | null>(null);

  const evidence = useMemo(() => {
    if (!node) return [] as EvidenceStored[];
    return Object.values(state.evidence)
      .filter((e) => e.target_ids.includes(node.id))
      .sort((a, b) => b.occurred_at.localeCompare(a.occurred_at));
  }, [state.evidence, node]);

  useEffect(() => {
    if (!node) {
      setComp(null);
      return;
    }
    const confirmed = index.confirmed.has(node.id);
    const evidenceTypes = Array.isArray(node.body["evidence_types"]) ? (node.body["evidence_types"] as unknown[]) : [];
    const safety = node.body["safety_class"] ?? node.body["risk_level"];
    const scored = evidence.filter((e) => e.outcome_scored);
    void deriveCompetency({
      target_id: node.id,
      as_of: new Date().toISOString(),
      evidence,
      exposed: scored.length > 0,
      practice_activity: scored.length > 0,
      self_report: "unknown",
      mastery_confirmed: confirmed,
      review_due_at: null,
      flagged_misconception: false,
      flags: {
        retention_matters: true,
        transfer_matters: evidenceTypes.includes("TRANSFER_PERFORMANCE"),
        safety_critical: typeof safety === "string" && safety !== "none",
      },
    }).then(setComp);
  }, [node, evidence, index]);

  if (!node) {
    return (
      <>
        <Head label="Knowledge" title="Record not found" />
        <p>No record has the code <code>{code}</code>. <a href="#/knowledge">Back to the atlas</a></p>
      </>
    );
  }

  const tier = masteryTier(index, node.id);
  const meta = DISCIPLINE_BY_ID[node.owner_discipline_id ?? ""];
  const parent = node.parent_id ? state.nodes[node.parent_id] : undefined;
  const related = Object.values(state.edges)
    .filter((e) => (e.source_id === node.id || e.target_id === node.id) && e.relation_type !== "CONTAINS")
    .map((e) => ({ edge: e, other: state.nodes[e.source_id === node.id ? e.target_id : e.source_id], out: e.source_id === node.id }))
    .filter((r): r is { edge: (typeof r)["edge"]; other: NodeRecord; out: boolean } => !!r.other);
  const prerequisites = related.filter((r) => r.edge.relation_type === "PREREQUISITE_FOR" && !r.out);
  const neighbours = related.filter((r) => r.edge.relation_type !== "PREREQUISITE_FOR");
  const facts = FACT_KEYS.map(([label, key]) => ({ label, value: renderValue(node.body[key]) })).filter((f) => f.value !== null);
  const objectives = neighbours.filter((r) => r.other.object_type === "learning_objective");
  const units = neighbours.filter((r) => r.other.object_type === "learning_unit");
  const assessments = neighbours.filter((r) => r.other.object_type === "assessment");
  const steps = Array.isArray((node.body["practice_protocol"] as Record<string, unknown> | undefined)?.["steps"])
    ? (((node.body["practice_protocol"] as Record<string, unknown>)["steps"] as unknown[]).filter((s): s is string => typeof s === "string"))
    : [];

  return (
    <>
      <Head label={`${node.object_type.replace(/_/g, " ")} · ${meta?.short ?? "cross-cutting"}`} title={node.title} />
      <div className="workspace">
        <div className="span-7">
          <section className="panel rail" style={{ ["--rail" as string]: disciplineVar(node.owner_discipline_id) }}>
            <div className="row wrap">
              <StatusTag status={node.status} />
              <span className="tag" style={{ borderColor: TIER_COLOR[tier], color: TIER_COLOR[tier] }}>{TIER_LABEL[tier]}</span>
              {node.is_sample && <span className="tag">sample</span>}
              {meta && <span className="tag" style={{ color: meta.color, borderColor: meta.color }}>{meta.short}</span>}
            </div>
            <dl className="kv" style={{ marginTop: 12 }}>
              <dt>Code</dt><dd className="mono">{node.code}</dd>
              <dt>Owner</dt><dd className="mono">{node.owner_discipline_id ?? "none (cross-cutting)"}</dd>
              <dt>Parent</dt><dd>{parent ? <a href={`#/knowledge/${encodeURIComponent(parent.code)}`}>{parent.title}</a> : "none"}</dd>
              <dt>Prerequisites</dt><dd><span className="num">{prerequisiteCount(state, node.id)}</span></dd>
              <dt>Version</dt><dd>content v<span className="num">{node.content_version}</span> · record v<span className="num">{node.version}</span></dd>
            </dl>
          </section>

          <section className="panel">
            <span className="label">Imported specification · read only</span>
            <p style={{ marginTop: 8 }} className="empty">This text comes from the content package. It describes what would count as competence; it is not a claim about you.</p>
            <dl className="kv" style={{ marginTop: 10 }}>
              {facts.map((f) => (
                <div key={f.label} style={{ display: "contents" }}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
            {facts.length === 0 && <p className="empty">The package carries no additional descriptive fields for this record.</p>}

            {objectives.length > 0 && (
              <div style={{ marginTop: 14 }}>
                <span className="label">Learning objectives</span>
                <ul className="list" style={{ marginTop: 8 }}>
                  {objectives.map((r) => (
                    <li key={r.edge.id}><a href={`#/knowledge/${encodeURIComponent(r.other.code)}`}>{r.other.title}</a></li>
                  ))}
                </ul>
              </div>
            )}
            {units.length > 0 && (
              <div style={{ marginTop: 14 }}>
                <span className="label">Learning units</span>
                <ul className="list" style={{ marginTop: 8 }}>
                  {units.map((r) => (
                    <li key={r.edge.id}><a href={`#/knowledge/${encodeURIComponent(r.other.code)}`}>{r.other.title}</a></li>
                  ))}
                </ul>
              </div>
            )}
            {assessments.length > 0 && (
              <div style={{ marginTop: 14 }}>
                <span className="label">Assessments</span>
                <ul className="list" style={{ marginTop: 8 }}>
                  {assessments.map((r) => (
                    <li key={r.edge.id}><a href={`#/knowledge/${encodeURIComponent(r.other.code)}`}>{r.other.title}</a></li>
                  ))}
                </ul>
              </div>
            )}
            {prerequisites.length > 0 && (
              <div style={{ marginTop: 14 }}>
                <span className="label">Prerequisites</span>
                <ul className="list" style={{ marginTop: 8 }}>
                  {prerequisites.map((r) => (
                    <li key={r.edge.id}>
                      <a href={`#/knowledge/${encodeURIComponent(r.other.code)}`}>{r.other.title}</a>
                      <span className="mono" style={{ color: "var(--text-muted)" }}> · {r.edge.strength ?? "recommended"} · {r.edge.gating}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <PracticeSession node={node} steps={steps} />
        </div>

        <div className="span-5">
          <MasteryPanel node={node} comp={comp} confirmed={index.confirmed.has(node.id)} evidenceCount={evidence.length} />

          <section className="panel">
            <span className="label">Learner evidence · <span className="num">{evidence.length}</span></span>
            <p style={{ marginTop: 8 }} className="empty">Append-only. New records are added; nothing here can be edited or deleted.</p>
            {evidence.length === 0 ? (
              <p style={{ marginTop: 10 }} className="empty">No evidence recorded for this record.</p>
            ) : (
              <ul className="list" style={{ marginTop: 10 }}>
                {evidence.map((ev) => {
                  const outcome = ev.target_outcomes.find((o) => o.target_id === node.id)?.outcome;
                  return (
                    <li key={ev.id} className="panel flat" style={{ marginBottom: 8 }}>
                      <div className="row between">
                        <span className="tag">{ev.evidence_class.replace(/_/g, " ")}</span>
                        <span className="mono" style={{ color: "var(--text-muted)" }}>{new Date(ev.occurred_at).toLocaleDateString()}</span>
                      </div>
                      <p style={{ margin: "6px 0 0" }}>{ev.result_summary}</p>
                      <div className="row wrap" style={{ marginTop: 6 }}>
                        {outcome && <span className="tag">{outcome.replace(/_/g, " ")}</span>}
                        <span className="tag">{ev.independence_attestation === "yes" ? "attested independent" : "assisted"}</span>
                        {ev.item_signature && <span className="tag">item {ev.item_signature}</span>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <details className="panel">
            <summary className="label">Stored exchange record</summary>
            <pre className="mono" style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", marginTop: 8 }}>{JSON.stringify(node.body, null, 2)}</pre>
          </details>
        </div>
      </div>
    </>
  );
}

function MasteryPanel({ node, comp, confirmed, evidenceCount }: { node: NodeRecord; comp: CompetencyState | null; confirmed: boolean; evidenceCount: number }): ReactNode {
  const { state, rt, refresh } = useApp();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const candidate = comp?.dimensions.mastery === "candidate";
  return (
    <section className="panel rail" style={{ ["--rail" as string]: confirmed ? "var(--growth-teal)" : "var(--signal-blue)" }}>
      <span className="label">Mastery decision</span>
      <p style={{ marginTop: 8 }} className="empty">
        Derived by rules {comp?.rules_version ?? "…"} from <span className="num">{evidenceCount}</span> stored record(s). A page visit never changes it.
      </p>
      {comp && (
        <dl className="kv" style={{ marginTop: 10 }}>
          <dt>Exposure</dt><dd>{comp.dimensions.exposure.replace(/_/g, " ")}</dd>
          <dt>Performance</dt><dd>{comp.dimensions.performance.replace(/_/g, " ")}</dd>
          <dt>Retention</dt><dd>{comp.dimensions.retention}</dd>
          <dt>Mastery</dt><dd>{comp.dimensions.mastery}</dd>
          <dt>State</dt><dd><strong>{comp.derived_learner_state.replace(/_/g, " ")}</strong></dd>
        </dl>
      )}
      <p style={{ marginTop: 10 }} className="mono">{comp?.explanation ?? "Computing…"}</p>
      {confirmed ? (
        <p className="tag ok" style={{ marginTop: 10 }}>confirmed by you</p>
      ) : (
        <button
          className="btn primary"
          style={{ marginTop: 10 }}
          disabled={busy || !candidate}
          onClick={() => {
            if (!rt) return;
            setBusy(true);
            setMsg(null);
            confirmMastery(state, rt.store, node)
              .then(refresh)
              .then(() => setMsg("Confirmation recorded."))
              .catch((e: Error) => setMsg(`Not recorded: ${e.message}`))
              .finally(() => setBusy(false));
          }}
        >
          Confirm mastery
        </button>
      )}
      {!confirmed && !candidate && <p style={{ marginTop: 8 }} className="empty">The button unlocks only when every conservative clause is met. The line above lists what is still missing.</p>}
      {msg && <p role="status" style={{ marginTop: 8 }}>{msg}</p>}
    </section>
  );
}

function PracticeSession({ node, steps }: { node: NodeRecord; steps: string[] }): ReactNode {
  const { state, rt, refresh } = useApp();
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [evidenceClass, setEvidenceClass] = useState<string>(() => {
    const types = node.body["evidence_types"];
    return Array.isArray(types) && typeof types[0] === "string" ? types[0] : "RETRIEVAL";
  });
  const [outcome, setOutcome] = useState<OutcomeValue>("demonstrated");
  const [summary, setSummary] = useState("");
  const [independent, setIndependent] = useState(true);
  const [notesUsed, setNotesUsed] = useState(false);
  const [itemSignature, setItemSignature] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const classes = Array.isArray(node.body["evidence_types"])
    ? (node.body["evidence_types"] as unknown[]).filter((x): x is string => typeof x === "string")
    : [];
  const options = (classes.length > 0 ? classes : ["RETRIEVAL", "EXPLANATION", "PROBLEM_PERFORMANCE", "PRACTICAL_DEMONSTRATION"]).filter((c) => c !== "SELF_REPORT");

  return (
    <section className="panel">
      <span className="label">Learning session</span>
      <p style={{ marginTop: 8 }}>Work the protocol, then record what actually happened. The record is appended; it can never be edited later.</p>
      {steps.length > 0 && (
        <ol className="session-steps">
          {steps.map((step, i) => (
            <li key={i}>
              <label className="check">
                <input type="checkbox" checked={done[i] === true} onChange={(e: { target: HTMLInputElement }) => setDone((d) => ({ ...d, [i]: e.target.checked }))} />
                <span>{step}</span>
                {done[i] === true && <Check size={14} strokeWidth={1.5} aria-hidden="true" color="var(--growth-teal)" />}
              </label>
            </li>
          ))}
        </ol>
      )}
      <div className="form-grid" style={{ marginTop: 12 }}>
        <label>
          <span className="label">Evidence class</span>
          <select className="field" value={evidenceClass} onChange={(e: { target: HTMLSelectElement }) => setEvidenceClass(e.target.value)}>
            {options.map((c) => <option key={c} value={c}>{c.replace(/_/g, " ").toLowerCase()}</option>)}
          </select>
        </label>
        <label>
          <span className="label">Outcome</span>
          <select className="field" value={outcome} onChange={(e: { target: HTMLSelectElement }) => setOutcome(e.target.value as OutcomeValue)}>
            <option value="demonstrated">demonstrated</option>
            <option value="partial">partial</option>
            <option value="not_demonstrated">not demonstrated</option>
          </select>
        </label>
      </div>
      <label style={{ display: "block", marginTop: 10 }}>
        <span className="label">What was done</span>
        <textarea
          aria-label="What was done"
          value={summary}
          onChange={(e: { target: HTMLTextAreaElement }) => setSummary(e.target.value)}
          placeholder="One or two lines: the task, the item, and what made it hard."
          style={{ minHeight: 90 }}
        />
      </label>
      <div className="form-grid" style={{ marginTop: 10 }}>
        <label>
          <span className="label">Item signature</span>
          <input className="field" type="text" value={itemSignature} onChange={(e: { target: HTMLInputElement }) => setItemSignature(e.target.value)} placeholder="e.g. chapter-3-set-a" />
        </label>
        <div className="stack" style={{ alignSelf: "end" }}>
          <label className="check">
            <input type="checkbox" checked={independent} onChange={(e: { target: HTMLInputElement }) => setIndependent(e.target.checked)} />
            <span>I did this without hints, AI or other people.</span>
          </label>
          <label className="check">
            <input type="checkbox" checked={notesUsed} onChange={(e: { target: HTMLInputElement }) => setNotesUsed(e.target.checked)} />
            <span>Notes or references were open.</span>
          </label>
        </div>
      </div>
      <button
        className="btn primary"
        style={{ marginTop: 14 }}
        disabled={busy || summary.trim().length < 3}
        onClick={() => {
          if (!rt) return;
          setBusy(true);
          setMsg(null);
          recordPractice(state, rt.store, { node, evidenceClass, outcome, summary, independent, notesUsed, itemSignature, rubric: [] })
            .then(refresh)
            .then(() => {
              setMsg("Evidence recorded.");
              setSummary("");
              setItemSignature("");
              setDone({});
            })
            .catch((e: Error) => setMsg(`Not recorded: ${e.message}`))
            .finally(() => setBusy(false));
        }}
      >
        Record evidence
      </button>
      {msg && <p role="status" style={{ marginTop: 8 }}>{msg}</p>}
    </section>
  );
}

export const TIER_ORDER = MASTERY_TIERS;
