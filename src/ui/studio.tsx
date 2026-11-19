import { useState } from "react";
import type { ReactNode } from "react";
import { buildPlan, commitPlan, parsePackage, type Decision, type ExchangePackage, type ImportPlan } from "../app/importer.ts";
import { loadSeedPackage } from "../app/runtime.ts";
import { createBackup, scratchRestoreCheck, shareOrDownload, type BackupFile, type RestoreCheck } from "../app/backup.ts";
import { exportArchive, readArchive } from "../domain/archive.ts";
import { checkIntegrity } from "../domain/integrity.ts";
import { projectGroups } from "../app/selectors.ts";
import type { Delta, Issue } from "../domain/types.ts";
import { useApp } from "./context.ts";
import { Head } from "./ui.tsx";

export function Studio({ tab }: { tab: "updates" | "backup" }): ReactNode {
  return (
    <>
      <Head label="Architect Studio" title={tab === "updates" ? "Updates inbox" : "Backup and restore"} />
      <nav className="seg" aria-label="Studio sections">
        <a href="#/studio/updates" aria-current={tab === "updates" ? "page" : undefined}>Updates</a>
        <a href="#/studio/backup" aria-current={tab === "backup" ? "page" : undefined}>Backup</a>
      </nav>
      {tab === "updates" ? (
        <div className="workspace">
          <div className="span-7">
            <ImportPanel seed />
          </div>
          <div className="span-5">
            <ProjectClasses />
          </div>
        </div>
      ) : (
        <BackupPanel />
      )}
    </>
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

  const preview = async (pkg: ExchangePackage): Promise<void> => {
    setBusy(true);
    setResult(null);
    try {
      setPlan(await buildPlan(await app.rt.store.load(), pkg, app.rt.deps));
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
    <section className="stack">
      {seed && (
        <div className="panel rail">
          <span className="label">Bundled Pack v0.9 draft seed</span>
          <p style={{ marginTop: 8 }}>The content owner’s draft seed ships inside the app. Preview it to see the exact create/update tally before anything is written.</p>
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
