import { useMemo, useState } from "react";
import { Layers } from "lucide-react";
import type { ReactNode } from "react";
import { DISCIPLINES, DISCIPLINE_BY_ID } from "./disciplines.ts";
import { classifyObjectType } from "../app/ontology.ts";
import { buildPlan, commitPlan, parsePackage, type Decision, type ExchangePackage, type ImportPlan } from "../app/importer.ts";
import { loadSeedPackage } from "../app/runtime.ts";
import { createBackup, scratchRestoreCheck, shareOrDownload, type BackupFile, type RestoreCheck } from "../app/backup.ts";
import { exportArchive, readArchive } from "../domain/archive.ts";
import { checkIntegrity } from "../domain/integrity.ts";
import { projectGroups } from "../app/selectors.ts";
import { projectOntology, relationCounts } from "../app/ontology.ts";
import type { Delta, Issue } from "../domain/types.ts";
import { useApp } from "./context.ts";
import { PageHead } from "./ui.tsx";
import { KbPackPanel } from "./KbPackPanel.tsx";

export function Studio({ tab }: { tab: "updates" | "author" | "backup" | "pack" }): ReactNode {
  const title = tab === "updates" ? "Updates inbox" : tab === "author" ? "Authoring desk" : tab === "backup" ? "Backup and restore" : "KB pack forge";
  const meta =
    tab === "updates" ? (
      <>A package is previewed, tallied and then approved or rejected. Nothing is written before you approve the preview.</>
    ) : tab === "author" ? (
      <>Edit a draft, retire a record or branch a protocol. Every write goes through the same validate → preview → commit pipeline as an imported package, so authoring cannot bypass a rule.</>
    ) : tab === "backup" ? (
      <>A backup is one compressed file holding your records, evidence and history. The only copy that survives a cleared browser is one you keep elsewhere.</>
    ) : (
      <>A KB pack bundles knowledge, evidence and operational records into one zip. Import shows a diff first; the GitHub push writes a snapshot to a repository you own.</>
    );
  return (
    <div className="page page-studio">
      <PageHead label="Architect Studio" title={title} meta={meta} glyph={<Layers strokeWidth={1.4} />} />
      <nav className="seg" aria-label="Studio sections" data-index={tab === "updates" ? "0" : tab === "author" ? "1" : tab === "backup" ? "2" : "3"}>
        <span className="seg-thumb" aria-hidden="true" />
        <a href="#/studio/updates" aria-current={tab === "updates" ? "page" : undefined}>Updates</a>
        <a href="#/studio/author" aria-current={tab === "author" ? "page" : undefined}>Author</a>
        <a href="#/studio/backup" aria-current={tab === "backup" ? "page" : undefined}>Backup</a>
        <a href="#/studio/pack" aria-current={tab === "pack" ? "page" : undefined}>KB pack</a>
      </nav>
      {tab === "updates" ? (
        <div className="workspace">
          <div className="span-7">
            <ImportPanel seed />
          </div>
          <div className="span-5">
            <ProjectClasses />
            <OntologyAudit />
          </div>
        </div>
      ) : tab === "author" ? (
        <AuthorPanel />
      ) : tab === "backup" ? (
        <BackupPanel />
      ) : (
        <KbPackPanel />
      )}
    </div>
  );
}

function ProjectClasses(): ReactNode {
  const { state } = useApp();
  const groups = projectGroups(state);
  return (
    <section className="panel">
      <span className="label">Project classes</span>
      <p style={{ marginTop: 8 }}>Every project record declares one of three canonical classes. The split is read from the imported record, never guessed from its title.</p>
      <div className="stack" style={{ marginTop: 12 }}>
        {groups.map((g) => (
          <div key={g.key} className="panel flat" style={{ marginBottom: 0 }}>
            <div className="row between">
              <strong>{g.label}</strong>
              <span className="num" style={{ color: "var(--text-muted)" }}>{g.projects.length}</span>
            </div>
            <p style={{ margin: "4px 0 0" }}>{g.description}</p>
            {g.projects.length > 0 && (
              <ul className="list" style={{ marginTop: 8 }}>
                {g.projects.map((p) => (
                  <li key={p.id} className="mono">{p.code} · {p.title}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <a className="btn" href="#/studio/architect" style={{ marginTop: 14 }}>Plan a path in the Architect</a>
    </section>
  );
}

function OntologyAudit(): ReactNode {
  const { state } = useApp();
  const projection = projectOntology(state);
  const relations = relationCounts(state);
  const c = projection.counts;
  return (
    <section className="panel" style={{ marginTop: 14 }}>
      <span className="label">Semantic projection</span>
      <p style={{ marginTop: 8 }}>Six celestial classes are projected separately. Attached systems are markers, not parent-child levels.</p>
      <dl className="kv" style={{ marginTop: 10 }}>
        <dt>Stars</dt><dd><span className="num">{c.stars}</span></dd>
        <dt>Planets</dt><dd><span className="num">{c.planets}</span></dd>
        <dt>Constellations</dt><dd><span className="num">{c.constellations}</span></dd>
        <dt>Moons</dt><dd><span className="num">{c.moons}</span></dd>
        <dt>Satellites</dt><dd><span className="num">{c.satellites}</span></dd>
        <dt>Asteroids</dt><dd><span className="num">{c.asteroids}</span></dd>
        <dt>Orphans</dt><dd><span className="num" style={{ color: projection.orphans.length > 0 ? "var(--insight-amber)" : undefined }}>{projection.orphans.length}</span></dd>
      </dl>
      <p className="hint" style={{ marginTop: 8 }}>
        {Object.entries(relations).map(([k, v]) => `${v} ${k.replace(/_/g, " ").toLowerCase()}`).join(" · ") || "No relations in the store yet."}
      </p>
      {projection.orphans.length > 0 && (
        <ul className="list" style={{ marginTop: 10 }}>
          {projection.orphans.slice(0, 6).map((n) => <li key={n.id} className="mono">{n.code} · {n.title}</li>)}
        </ul>
      )}
      <p className="hint" style={{ marginTop: 6 }}>Orphans stay visible in the atlas and the index; they are flagged here for repair rather than hidden.</p>
    </section>
  );
}

function IssueList({ issues }: { issues: Issue[] }): ReactNode {
  const errors = issues.filter((i) => i.severity === "error");
  if (errors.length === 0) return null;
  return (
    <div role="alert">
      <h3 style={{ margin: "12px 0 8px" }}>{errors.length} problem{errors.length === 1 ? "" : "s"} found. Nothing can be approved.</h3>
      {errors.slice(0, 20).map((i, k) => (
        <div className="issue" key={k}><span className="mono">{i.path}</span><br />{i.message}</div>
      ))}
      {errors.length > 20 && <p>…and {errors.length - 20} more.</p>}
    </div>
  );
}

export function ImportPanel({ seed = false }: { seed?: boolean }): ReactNode {
  const app = useApp();
  const [text, setText] = useState("");
  const [plan, setPlan] = useState<ImportPlan | null>(null);
  const [parseIssues, setParseIssues] = useState<Issue[]>([]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const preview = async (pkg: ExchangePackage, allowDraftRevision = false): Promise<void> => {
    setBusy(true);
    setResult(null);
    try {
      setPlan(await buildPlan(await app.rt.store.load(), pkg, app.rt.deps, { allowDraftRevision }));
    } catch (e) {
      setResult(`Preview failed: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  };
  const previewText = async (): Promise<void> => {
    const { pkg, issues } = parsePackage(text);
    setParseIssues(issues);
    if (pkg) await preview(pkg);
    else setPlan(null);
  };
  const decide = async (d: Decision): Promise<void> => {
    if (!plan) return;
    setBusy(true);
    try {
      const r = await commitPlan(app.rt.store, plan, d, app.rt.deps);
      await app.refresh();
      setResult(d === "reject" ? "Rejected. Nothing was changed." : r.committed ? `Committed ${plan.items.filter((i) => i.action !== "noop").length} changes.` : "Nothing was committed.");
    } catch (e) {
      setResult(`Not committed: ${(e as Error).message}. Preview again.`);
    } finally {
      setPlan(null);
      setBusy(false);
    }
  };
  const changes = plan ? plan.items.filter((i) => i.action !== "noop") : [];
  const tally = (table: string, action: string): number => (plan ? plan.items.filter((i) => i.table === table && i.action === action).length : 0);
  return (
    <section className="stack uplink">
      {seed && (
        <div className="panel rail">
          <span className="label">Bundled Pack v1.0 seed</span>
          <p style={{ marginTop: 8 }}>The content owner’s canonical pack plus the KB v3.28 working tier ships inside the app. Preview it to see the exact create/update tally before anything is written.</p>
          <button className="btn primary" disabled={busy} onClick={() => void loadSeedPackage().then(preview)}>Preview the draft seed</button>
        </div>
      )}
      <p>Paste a package produced by ChatGPT, Gemini or any other tool, or choose a file. ATHENA validates it and shows a preview. Nothing is written until you approve.</p>
      <textarea aria-label="Package JSON" value={text} onChange={(e: { target: HTMLTextAreaElement }) => setText(e.target.value)} placeholder='{"athena_package":"0.1", ...}' />
      <div className="row wrap">
        <label className="btn">Choose file<input type="file" accept="application/json,.json,.txt" hidden onChange={(e: { target: HTMLInputElement }) => void e.target.files?.[0]?.text().then(setText)} /></label>
        <button className="btn primary" disabled={busy || !text.trim()} onClick={() => void previewText()}>Preview</button>
      </div>
      <IssueList issues={parseIssues} />
      {result && <div className="panel" role="status">{result}</div>}
      {plan && (
        <div className="panel rail">
          <span className="label">Preview · nothing written yet</span>
          <IssueList issues={plan.issues} />
          {!plan.ok && plan.issues.some((i) => i.code === "content_conflict") && (
            <div className="panel flat" style={{ marginTop: 10 }}>
              <p style={{ margin: 0 }}>Some records differ from the stored copy without a higher content_version. A package never overwrites silently — but if these are revisions of drafts you authored, you can accept them explicitly.</p>
              <button className="btn" disabled={busy} style={{ marginTop: 10 }} onClick={() => void preview(plan.pkg!, true)}>Accept changed drafts as revisions</button>
              <p className="hint" style={{ marginTop: 8 }}>Only draft records are revised and each stored content_version increments. Approved records still require a bumped content_version.</p>
            </div>
          )}
          {plan.issues.some((i) => i.code === "draft_revision") && (
            <p className="hint">Draft revisions accepted: each changed draft is replaced and its stored content_version increments by one.</p>
          )}
          {plan.alreadyCommitted && <p>This exact package was already committed. Importing it again changes nothing.</p>}
          <dl className="kv" style={{ marginTop: 8 }}>
            <dt>Records</dt><dd><span className="num">{tally("nodes", "create")}</span> new · <span className="num">{tally("nodes", "update")}</span> updated · <span className="num">{tally("nodes", "noop")}</span> unchanged</dd>
            <dt>Relations</dt><dd><span className="num">{tally("edges", "create")}</span> new · <span className="num">{tally("edges", "update")}</span> updated · <span className="num">{tally("edges", "noop")}</span> unchanged</dd>
            <dt>Evidence</dt><dd><span className="num">{tally("evidence", "create")}</span> new</dd>
          </dl>
          <ul className="list" style={{ marginTop: 12 }}>
            {changes.slice(0, 25).map((i, k) => (
              <li key={k} className="mono" style={{ marginBottom: 4 }}>{i.action} · {i.table === "nodes" ? (i.code ?? i.label) : i.label}{i.changes ? ` · changes: ${i.changes.join(", ")}` : ""}</li>
            ))}
          </ul>
          {changes.length > 25 && <p>…and {changes.length - 25} more.</p>}
          <div className="row wrap" style={{ marginTop: 12 }}>
            <button className="btn primary" disabled={busy || !plan.ok || changes.length === 0} onClick={() => void decide("approve")}>Approve and commit {changes.length} change{changes.length === 1 ? "" : "s"}</button>
            <button className="btn danger" disabled={busy} onClick={() => void decide("reject")}>Reject</button>
          </div>
        </div>
      )}
    </section>
  );
}

/** Which body field holds the readable description for each object type. */
const TEXT_KEYS = ["definition", "summary", "description", "purpose", "goal", "intent"] as const;

function textFieldOf(body: Record<string, unknown>): { key: string; value: string } {
  for (const k of TEXT_KEYS) if (typeof body[k] === "string") return { key: k, value: String(body[k]) };
  return { key: "definition", value: "" };
}

/**
 * Authoring desk. Edits are materialised as a one-record exchange package and pushed through the same
 * buildPlan → commitPlan pipeline as an imported pack: schema validation, namespace ownership, code
 * uniqueness and the draft-revision rule all apply. Nothing here writes the store directly.
 */
function AuthorPanel(): ReactNode {
  const app = useApp();
  const [discipline, setDiscipline] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftText, setDraftText] = useState("");
  const [textKey, setTextKey] = useState<string>("definition");
  const [draftStatus, setDraftStatus] = useState("draft");
  const [draftOwner, setDraftOwner] = useState<string>("ATH-DISC-ENG");
  const [newCode, setNewCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [errors, setErrors] = useState<Issue[]>([]);
  const [busy, setBusy] = useState(false);

  const selected = selectedId ? app.state.nodes[selectedId] : undefined;

  const records = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return Object.values(app.state.nodes)
      .filter((n) => n.object_type !== "discipline")
      .filter((n) => discipline === null || n.owner_discipline_id === discipline)
      .filter((n) => !needle || n.title.toLowerCase().includes(needle) || n.code.toLowerCase().includes(needle))
      .sort((a, b) => (a.status === b.status ? a.code.localeCompare(b.code) : a.status === "draft" ? -1 : b.status === "draft" ? 1 : a.code.localeCompare(b.code)))
      .slice(0, 150);
  }, [app.state.nodes, discipline, q]);

  const load = (id: string): void => {
    const node = app.state.nodes[id];
    if (!node) return;
    const field = textFieldOf(node.body);
    setSelectedId(id);
    setDraftTitle(node.title);
    setDraftText(field.value);
    setTextKey(field.key);
    setDraftStatus(node.status);
    setDraftOwner(node.owner_discipline_id ?? "ATH-DISC-ENG");
    setNewCode("");
    setMsg(null);
    setErrors([]);
  };

  const write = async (nodeCode: string, isMicro: boolean, rec: Record<string, unknown>, what: string): Promise<void> => {
    setBusy(true);
    setMsg(null);
    setErrors([]);
    try {
      const pkg: ExchangePackage = {
        athena_package: "0.1",
        package_id: `ath-author-${nodeCode}-${Date.now()}`,
        generated_by: { tool: "architect-studio", generated_at: new Date().toISOString() },
        ...(isMicro ? { micro_skills: [rec] } : { nodes: [rec] }),
      };
      const plan = await buildPlan(await app.rt.store.load(), pkg, app.rt.deps, { allowDraftRevision: true });
      if (!plan.ok) {
        const problems = plan.issues.filter((i) => i.severity === "error");
        setErrors(problems.slice(0, 8));
        setMsg(`${what} was not committed: ${problems.length} validation problem${problems.length === 1 ? "" : "s"}.`);
        return;
      }
      const result = await commitPlan(app.rt.store, plan, "approve", app.rt.deps);
      await app.refresh();
      setMsg(result.committed ? `${what} committed for ${nodeCode}. The stored content_version incremented.` : `${what}: nothing changed (${plan.issues[0]?.message ?? "the record already matches"}).`);
    } catch (e) {
      setMsg(`${what} failed: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  };

  const keepStatusCase = (node: typeof selected, next: string): string => {
    const original = typeof node?.body["status"] === "string" ? String(node.body["status"]) : "";
    return original && original === original.toUpperCase() ? next.toUpperCase() : next;
  };

  const save = (): void => {
    if (!selected) return;
    // Exchange schemas forbid additional properties, so the editor may only touch fields the stored
    // record already has. That is what makes a save a revision rather than a schema violation.
    const body: Record<string, unknown> = { ...selected.body };
    if ("id" in body) body["id"] = selected.code;
    if ("content_version" in body) body["content_version"] = selected.content_version + 1;
    if ("status" in body) body["status"] = keepStatusCase(selected, draftStatus);
    if (selected.object_type === "micro_skill") {
      body["name"] = draftTitle;
      body["definition"] = draftText;
      body["discipline_links"] = [draftOwner];
    } else {
      if ("title" in body) body["title"] = draftTitle;
      else if ("name" in body) body["name"] = draftTitle;
      if (textKey in body) body[textKey] = draftText;
      if ("owner_discipline_id" in body) body["owner_discipline_id"] = draftOwner;
    }
    void write(selected.code, selected.object_type === "micro_skill", body, "Revision");
  };

  const retire = (): void => {
    if (!selected) return;
    const body: Record<string, unknown> = { ...selected.body };
    if ("id" in body) body["id"] = selected.code;
    if ("content_version" in body) body["content_version"] = selected.content_version + 1;
    if ("status" in body) body["status"] = keepStatusCase(selected, "retired");
    void write(selected.code, selected.object_type === "micro_skill", body, "Retirement");
  };

  const branch = (): void => {
    if (!selected || selected.object_type !== "micro_skill") return;
    const code = newCode.trim().toUpperCase();
    if (!code) {
      setMsg("Give the new draft a code first, for example ATH-MICRO-ENG-MY-NEW-PROTOCOL.");
      return;
    }
    const body: Record<string, unknown> = { ...selected.body, id: code, name: `${draftTitle} (copy)`, content_version: 1, status: keepStatusCase(selected, "draft") };
    void write(code, true, body, "New draft");
  };

  const meta = selected ? classifyObjectType(selected.object_type) : null;
  const parent = selected?.parent_id ? app.state.nodes[selected.parent_id] : undefined;
  const evidenceFor = selected
    ? Object.values(app.state.evidence).filter((e) => (e.body["target_ids"] as string[] | undefined)?.includes(selected.code)).length
    : 0;

  return (
    <div className="workspace">
      <section className="panel span-5">
        <span className="label">Records · {records.length} shown</span>
        <input
          type="search"
          aria-label="Filter records"
          placeholder="Filter by title or code"
          value={q}
          onChange={(e: { target: HTMLInputElement }) => setQ(e.target.value)}
          style={{ marginTop: 10, width: "100%" }}
        />
        <div className="row wrap" role="group" aria-label="Authoring discipline filter" style={{ marginTop: 10 }}>
          <button className="chip" aria-pressed={discipline === null} onClick={() => setDiscipline(null)}>All</button>
          {DISCIPLINES.map((d) => (
            <button key={d.id} className="chip" aria-pressed={discipline === d.id} onClick={() => setDiscipline(discipline === d.id ? null : d.id)}>
              <d.Icon size={13} strokeWidth={1.5} aria-hidden="true" color={d.color} />{d.short}
            </button>
          ))}
        </div>
        <ul className="list author-list">
          {records.map((n) => (
            <li key={n.id}>
              <button
                className="item author-item"
                aria-pressed={selectedId === n.id}
                onClick={() => load(n.id)}
                style={{ ["--rail" as string]: DISCIPLINE_BY_ID[n.owner_discipline_id ?? ""]?.color ?? "var(--border)" }}
              >
                <span className="t">{n.title}</span>
                <span className="code mono">{n.code}</span>
                <span className="tag">{n.status}</span>
              </button>
            </li>
          ))}
          {records.length === 0 && <li className="empty">No record matches this filter.</li>}
        </ul>
      </section>

      <section className="panel span-7">
        {!selected ? (
          <>
            <span className="label">Authoring</span>
            <p style={{ marginTop: 10 }}>Choose a record to edit its title, description, status or owner. Every save is previewed against the same rules an import must pass, then committed as a revision with an incremented content version.</p>
            <p className="hint">Draft records can be revised without bumping content_version yourself; approved records cannot be overwritten silently.</p>
          </>
        ) : (
          <>
            <div className="row between">
              <span className="label">{selected.object_type.replace(/_/g, " ")} · {meta?.celestial ?? meta?.attached ?? "unclassified"}</span>
              <span className="tag">{selected.status}</span>
            </div>
            <h2 style={{ marginTop: 8 }}>{selected.title}</h2>
            <code className="drawer-code">{selected.code}</code>
            <dl className="kv" style={{ marginTop: 10 }}>
              <dt>Parent</dt><dd>{parent ? `${parent.title} · ${parent.object_type}` : "none recorded"}</dd>
              <dt>Content version</dt><dd><span className="num">{selected.content_version}</span> · saved revision becomes <span className="num">{selected.content_version + 1}</span></dd>
              <dt>Evidence</dt><dd><span className="num">{evidenceFor}</span> record{evidenceFor === 1 ? "" : "s"} target this code</dd>
            </dl>

            <div className="author-grid">
              <label><span className="label">Title</span><input value={draftTitle} onChange={(e: { target: HTMLInputElement }) => setDraftTitle(e.target.value)} /></label>
              <label><span className="label">Status</span>
                <select value={draftStatus} onChange={(e: { target: HTMLSelectElement }) => setDraftStatus(e.target.value)}>
                  {["draft", "in_review", "approved", "needs_revision", "retired"].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <label className="wide"><span className="label">Owner discipline</span>
                <select value={draftOwner} onChange={(e: { target: HTMLSelectElement }) => setDraftOwner(e.target.value)}>
                  {DISCIPLINES.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </label>
              <label className="wide"><span className="label">{textKey.replace(/_/g, " ")}</span>
                <textarea value={draftText} onChange={(e: { target: HTMLTextAreaElement }) => setDraftText(e.target.value)} rows={6} />
              </label>
            </div>

            <div className="row wrap" style={{ marginTop: 12 }}>
              <button className="btn primary" disabled={busy} onClick={save}>Save revision</button>
              <button className="btn danger" disabled={busy || selected.status === "retired"} onClick={retire}>Retire record</button>
            </div>
            <p className="hint" style={{ marginTop: 8 }}>A revision keeps the same code and bumps content_version. Retiring keeps the record findable in the Vault; it does not delete it.</p>

            {selected.object_type === "micro_skill" && (
              <div className="panel flat" style={{ marginTop: 14 }}>
                <span className="label">Branch this protocol</span>
                <p style={{ marginTop: 8 }}>Copy the full micro-skill body into a new draft under a new code. The clone keeps its practice steps, success criteria and safety review; the original is untouched.</p>
                <div className="row wrap" style={{ marginTop: 10 }}>
                  <input aria-label="New micro-skill code" placeholder="ATH-MICRO-ENG-MY-NEW-PROTOCOL" value={newCode} onChange={(e: { target: HTMLInputElement }) => setNewCode(e.target.value)} />
                  <button className="btn" disabled={busy || !newCode.trim()} onClick={branch}>Create draft copy</button>
                </div>
              </div>
            )}

            {msg && <div className="panel" role="status" style={{ marginTop: 12 }}>{msg}</div>}
            {errors.length > 0 && (
              <div role="alert" style={{ marginTop: 10 }}>
                {errors.map((e, i) => <div className="issue" key={i}><span className="mono">{e.path}</span><br />{e.message}</div>)}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

function downloadText(fileName: string, text: string, type: string): void {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export function BackupPanel(): ReactNode {
  const app = useApp();
  const [file, setFile] = useState<BackupFile | null>(null);
  const [check, setCheck] = useState<RestoreCheck | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [restoreMsg, setRestoreMsg] = useState<string | null>(null);
  const hasData = Object.keys(app.state.nodes).length > 0;
  const run = async (f: () => Promise<void>): Promise<void> => {
    setBusy(true);
    setMsg(null);
    try {
      await f();
    } catch (e) {
      setMsg((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="stack">
      <div className="workspace">
        <div className="span-7">
          <div className="panel rail">
            <span className="label">Export</span>
            <p style={{ marginTop: 8 }}>A backup is one compressed file holding your knowledge, evidence and history. Restore points on this phone do not protect you if the phone is lost or its site data is cleared; a file you keep elsewhere does.</p>
            <div className="row wrap">
              <button className="btn primary" disabled={busy} onClick={() => void run(async () => { setCheck(null); setFile(await createBackup(await app.rt.store.load(), new Date())); })}>Create backup file</button>
              <button
                className="btn"
                disabled={busy}
                onClick={() => void run(async () => {
                  const text = await exportArchive(await app.rt.store.load(), "0.1.0", new Date().toISOString());
                  downloadText(`athena-export-${new Date().toISOString().slice(0, 10)}.ndjson`, text, "application/x-ndjson");
                  setMsg("NDJSON export downloaded. It is plain text: keep it somewhere you control.");
                })}
              >
                Export NDJSON
              </button>
            </div>
          </div>

          {file && (
            <div className="panel">
              <span className="label">Backup ready · not yet saved anywhere</span>
              <dl className="kv" style={{ marginTop: 8 }}>
                <dt>File</dt><dd className="mono">{file.fileName}</dd>
                <dt>Size</dt><dd><span className="num">{(file.bytes.length / 1024).toFixed(0)}</span> KB compressed</dd>
                <dt>Contents</dt><dd>{Object.entries(file.manifest.counts).map(([k, v]) => <span key={k}><span className="num">{v}</span> {k} · </span>)}</dd>
                <dt>SHA-256</dt><dd className="mono">{file.sha256}</dd>
              </dl>
              <div className="row wrap" style={{ marginTop: 12 }}>
                <button className="btn primary" disabled={busy} onClick={() => void run(async () => setMsg({ shared: "Shared. Check the destination to confirm the file arrived.", downloaded: "Downloaded to this phone’s Downloads. Move it to your SD card or another safe place yourself.", cancelled: "Cancelled. Nothing was saved." }[await shareOrDownload(file)]))}>Share or save file</button>
                <button className="btn" disabled={busy} onClick={() => void run(async () => setCheck(await scratchRestoreCheck(file.bytes)))}>Check this backup</button>
              </div>
            </div>
          )}

          {msg && <div className="panel" role="status">{msg}</div>}

          {check && (
            <div className="panel rail" style={{ ["--rail" as string]: check.ok ? "var(--growth-teal)" : "var(--danger-red)" }} role="status">
              <span className={`tag ${check.ok ? "ok" : "bad"}`}>{check.ok ? "scratch check passed" : "scratch check failed"}</span>
              <p style={{ marginTop: 8 }}>{check.message}</p>
              {check.manifest && (
                <dl className="kv">
                  <dt>Created</dt><dd>{check.manifest.created_at}</dd>
                  <dt>App</dt><dd>{check.manifest.app_version} · format {check.manifest.format_version}</dd>
                  <dt>Contents</dt><dd>{Object.entries(check.counts).map(([k, v]) => `${v} ${k}`).join(" · ")}</dd>
                </dl>
              )}
              <p style={{ marginTop: 8 }}>This checks the file in memory. It does not prove the copy on your SD card or cloud drive is readable; open that copy and check it again.</p>
            </div>
          )}
        </div>

        <div className="span-5">
          <div className="panel">
            <span className="label">Import</span>
            <p style={{ marginTop: 8 }}>Read an NDJSON export, verify its checksum and every reference, then write it into an empty database. Nothing is merged: a restore never overwrites existing records.</p>
            <label className="btn">
              Choose NDJSON export
              <input
                type="file"
                accept=".ndjson,.json,.txt,application/x-ndjson"
                hidden
                onChange={(e: { target: HTMLInputElement }) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setRestoreMsg(null);
                  void run(async () => {
                    const text = await f.text();
                    const { manifest, state: incoming } = await readArchive(text);
                    const problems = checkIntegrity(incoming);
                    if (problems.length > 0) {
                      setRestoreMsg(`Refused: ${problems.length} integrity problem(s) in the file. First: ${problems[0]!.message}`);
                      return;
                    }
                    if (hasData) {
                      setRestoreMsg("Refused: this database already holds records. Restore is only offered into an empty database, so nothing is overwritten.");
                      return;
                    }
                    const current = await app.rt.store.load();
                    const puts: Delta["puts"] = [];
                    for (const table of ["nodes", "edges", "codes", "evidence", "changesets", "receipts"] as const) {
                      for (const [key, record] of Object.entries(incoming[table])) puts.push({ table, key, record });
                    }
                    await app.rt.store.persist({ expectedRevision: current.meta.revision, puts });
                    await app.refresh();
                    setRestoreMsg(`Restored ${puts.length} records from ${manifest.counts["nodes"] ?? 0} nodes. Revision is now ${(await app.rt.store.load()).meta.revision}.`);
                  });
                }}
              />
            </label>
            {restoreMsg && <p role="status" style={{ marginTop: 10 }}>{restoreMsg}</p>}
            {hasData && <p style={{ marginTop: 10 }} className="empty">This device already has records, so restore is disabled by design.</p>}
          </div>

          <div className="panel">
            <h3>Check a backup file</h3>
            <p>Choose a compressed backup. ATHENA reads it into a scratch copy and checks it. Your real data is never changed.</p>
            <label className="btn">Choose backup file<input type="file" hidden onChange={(e: { target: HTMLInputElement }) => void run(async () => { const f = e.target.files?.[0]; if (f) setCheck(await scratchRestoreCheck(new Uint8Array(await f.arrayBuffer()))); })} /></label>
          </div>
        </div>
      </div>
    </section>
  );
}
