import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { deriveCompetency, type CompetencyState } from "../domain/competency.ts";
import { useApp } from "./context.ts";
import { Empty, Head, StatusTag, disciplineVar } from "./ui.tsx";
import { ImportPanel } from "./studio.tsx";

const CAPABILITIES: { name: string; status: string; note: string }[] = [
  { name: "Offline app shell and install", status: "Built, unverified on device", note: "service worker and manifest are configured; no offline test has been run yet" },
  { name: "Knowledge catalogue and detail", status: "Built, unverified on device", note: "reads the imported DRAFT seed; competency shows what the rules derive from zero evidence" },
  { name: "Import, preview, approve", status: "Built, unverified on device", note: "the importer logic passes its 22 conformance cases in an in-memory test" },
  { name: "Backup export and scratch-restore check", status: "Built, unverified on device", note: "SD-card save through the picker is untested" },
  { name: "Sessions, evidence entry, competency screens", status: "Designed", note: "the evidence and competency rules are implemented and tested; there are no screens yet" },
  { name: "Atlas graph, planning, Studio editors", status: "Designed", note: "not started" },
];

export function Today(): ReactNode {
  const { state } = useApp();
  const nodes = Object.values(state.nodes);
  const receipts = Object.values(state.receipts).filter((r) => r.state === "committed").sort((a, b) => b.at.localeCompare(a.at));
  return (
    <>
      <Head label="Execute" title="Today" />
      <section className="panel rail">
        <h2>No plan is approved</h2>
        <p>Planning is not built yet, so ATHENA cannot recommend a next action. You can load content and protect your data now.</p>
        <div className="row wrap">
          <a className="btn primary" href="#/studio/updates">Review updates</a>
          <a className="btn" href="#/knowledge">Browse knowledge</a>
        </div>
      </section>
      <section className="panel">
        <span className="label">Your data</span>
        <dl className="kv" style={{ marginTop: 8 }}>
          <dt>Records</dt><dd>{nodes.length} knowledge records, {Object.keys(state.edges).length} relationships</dd>
          <dt>Evidence</dt><dd>{Object.keys(state.evidence).length} records</dd>
          <dt>Last import</dt><dd>{receipts[0] ? new Date(receipts[0].at).toLocaleString() : "none yet"}</dd>
          <dt>Draft</dt><dd>{nodes.filter((n) => n.status === "draft").length} of {nodes.length} records are DRAFT</dd>
        </dl>
      </section>
      <section className="panel">
        <span className="label">What this build can do</span>
        <ul className="list" style={{ marginTop: 8 }}>
          {CAPABILITIES.map((c) => (
            <li key={c.name} style={{ marginBottom: 10 }}>
              <div className="row wrap"><strong className="grow">{c.name}</strong><span className={`tag ${c.status === "Designed" ? "" : "draft"}`}>{c.status}</span></div>
              <p style={{ margin: 0 }}>{c.note}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

const TYPE_ORDER = ["skill", "subskill", "domain", "skill_family", "micro_skill", "concept", "learning_objective", "learning_unit", "assessment", "context", "discipline"];
export function Knowledge(): ReactNode {
  const { state } = useApp();
  const nodes = Object.values(state.nodes);
  const [type, setType] = useState<string>("skill");
  const [q, setQ] = useState("");
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const n of nodes) m.set(n.object_type, (m.get(n.object_type) ?? 0) + 1);
    return m;
  }, [nodes]);
  if (nodes.length === 0) {
    return (
      <>
        <Head label="Knowledge" title="Catalogue" />
        <Empty title="Nothing imported yet">
          <p>The content owner’s Pack v0.9 draft seed is bundled with the app. Preview it, then approve it to load every record as DRAFT. Nothing is written until you approve.</p>
          <ImportPanel seed />
        </Empty>
      </>
    );
  }
  const needle = q.trim().toLowerCase();
  const shown = nodes.filter((n) => n.object_type === type && (!needle || n.title.toLowerCase().includes(needle) || n.code.toLowerCase().includes(needle))).sort((a, b) => a.title.localeCompare(b.title));
  const types = TYPE_ORDER.filter((t) => counts.has(t));
  return (
    <>
      <Head label="Knowledge" title="Catalogue" />
      <div className="chips" role="group" aria-label="Record type">
        {types.map((t) => (
          <button key={t} className="chip" aria-pressed={t === type} onClick={() => setType(t)}>{t.replace("_", " ")} · {counts.get(t)}</button>
        ))}
      </div>
      <input type="search" placeholder="Search title or code" aria-label="Search title or code" value={q} onChange={(e: { target: HTMLInputElement }) => setQ(e.target.value)} style={{ marginBottom: 12 }} />
      <ul className="list">
        {shown.slice(0, 300).map((n) => (
          <li key={n.id}>
            <a className="item" style={{ ["--rail" as string]: disciplineVar(n.owner_discipline_id) }} href={`#/knowledge/${encodeURIComponent(n.code)}`}>
              <span className="t">{n.title}</span>
              <span className="code mono">{n.code}</span>
              <StatusTag status={n.status} />
            </a>
          </li>
        ))}
      </ul>
      {shown.length === 0 && <p>No {type.replace("_", " ")} records match.</p>}
    </>
  );
}

export function SkillDetail({ code }: { code: string }): ReactNode {
  const { state } = useApp();
  const entry = state.codes[code];
  const node = entry ? state.nodes[entry.id] : undefined;
  const [comp, setComp] = useState<CompetencyState | null>(null);
  useEffect(() => {
    if (!node) return;
    void deriveCompetency({ target_id: node.id, as_of: new Date().toISOString(), evidence: Object.values(state.evidence), exposed: false, practice_activity: false, self_report: "unknown", mastery_confirmed: false, review_due_at: null, flagged_misconception: false, flags: { retention_matters: true, transfer_matters: false, safety_critical: false } }).then(setComp);
  }, [node, state.evidence]);
  if (!node) return <><Head label="Knowledge" title="Not found" /><p>No record has the code <code>{code}</code>. <a href="#/knowledge">Back to the catalogue</a></p></>;
  const parent = node.parent_id ? state.nodes[node.parent_id] : undefined;
  const rels = Object.values(state.edges).filter((e) => e.source_id === node.id || e.target_id === node.id).filter((e) => e.relation_type !== "CONTAINS");
  const text = (k: string): string | null => (typeof node.body[k] === "string" ? (node.body[k] as string) : null);
  const blurb = text("summary") ?? text("definition") ?? text("description");
  const safety = node.body["risk_level"] ? `${String(node.body["risk_level"])} risk · supervision ${String(node.body["supervision"])}` : null;
  return (
    <>
      <Head label={node.object_type.replace("_", " ")} title={node.title} />
      <section className="panel rail" style={{ ["--rail" as string]: disciplineVar(node.owner_discipline_id) }}>
        <div className="row wrap"><StatusTag status={node.status} />{node.is_sample && <span className="tag">sample</span>}</div>
        {blurb && <p style={{ marginTop: 12 }}>{blurb}</p>}
        <dl className="kv">
          <dt>Code</dt><dd className="mono">{node.code}</dd>
          <dt>Owner</dt><dd className="mono">{node.owner_discipline_id ?? "none (cross-cutting)"}</dd>
          <dt>Parent</dt><dd>{parent ? <a href={`#/knowledge/${encodeURIComponent(parent.code)}`}>{parent.title}</a> : "none"}</dd>
          <dt>Version</dt><dd>content v{node.content_version} · record v{node.version}</dd>
          {safety && (<><dt>Safety</dt><dd>{safety} · human safety review {String((node.body["safety_review"] as { status?: string } | undefined)?.status ?? "n/a")}</dd></>)}
        </dl>
      </section>
      <section className="panel">
        <span className="label">Competency (derived by rules {comp?.rules_version ?? "…"})</span>
        {comp && (
          <dl className="kv" style={{ marginTop: 8 }}>
            <dt>Exposure</dt><dd>{comp.dimensions.exposure.replace("_", " ")}</dd>
            <dt>Self-report</dt><dd>{comp.dimensions.self_report}</dd>
            <dt>Performance</dt><dd>{comp.dimensions.performance.replace("_", " ")}</dd>
            <dt>Retention</dt><dd>{comp.dimensions.retention}</dd>
            <dt>Mastery</dt><dd>{comp.dimensions.mastery}</dd>
            <dt>State</dt><dd>{comp.derived_learner_state.replace("_", " ")}</dd>
          </dl>
        )}
        <p style={{ marginTop: 12 }}>No evidence has been recorded. Evidence entry is not built yet, so every value shows what the rules derive from nothing.</p>
      </section>
      <section className="panel">
        <span className="label">Relationships ({rels.length})</span>
        <ul className="list" style={{ marginTop: 8 }}>
          {rels.map((e) => {
            const out = e.source_id === node.id;
            const other = state.nodes[out ? e.target_id : e.source_id];
            return (
              <li key={e.id} style={{ marginBottom: 8 }}>
                <span className="tag">{e.relation_type.replace(/_/g, " ").toLowerCase()}</span> {out ? "→" : "←"} {other ? <a href={`#/knowledge/${encodeURIComponent(other.code)}`}>{other.title}</a> : "unknown"}
                {e.rationale && <p style={{ margin: "4px 0 0" }}>{e.rationale}</p>}
              </li>
            );
          })}
          {rels.length === 0 && <li><p>No relationships besides containment.</p></li>}
        </ul>
      </section>
      <details className="panel"><summary>Stored record (exact exchange fields)</summary><pre className="mono" style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{JSON.stringify(node.body, null, 2)}</pre></details>
    </>
  );
}
