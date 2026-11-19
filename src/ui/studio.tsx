import { useState } from "react";
import type { ReactNode } from "react";
import { buildPlan, commitPlan, parsePackage, type Decision, type ExchangePackage, type ImportPlan } from "../app/importer.ts";
import { loadSeedPackage } from "../app/runtime.ts";
import { createBackup, scratchRestoreCheck, shareOrDownload, type BackupFile, type RestoreCheck } from "../app/backup.ts";
import type { Issue } from "../domain/types.ts";
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
      {tab === "updates" ? <ImportPanel /> : <BackupPanel />}
    </>
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
      {seed ? (
        <button className="btn primary" disabled={busy} onClick={() => void loadSeedPackage().then(preview)}>Preview the draft seed</button>
      ) : (
        <>
          <p>Paste a package produced by ChatGPT, Gemini or any other tool, or choose a file. ATHENA validates it and shows a preview. Nothing is written until you approve.</p>
          <textarea aria-label="Package JSON" value={text} onChange={(e: { target: HTMLTextAreaElement }) => setText(e.target.value)} placeholder='{"athena_package":"0.1", ...}' />
          <div className="row wrap">
            <label className="btn">Choose file<input type="file" accept="application/json,.json,.txt" hidden onChange={(e: { target: HTMLInputElement }) => void e.target.files?.[0]?.text().then(setText)} /></label>
            <button className="btn primary" disabled={busy || !text.trim()} onClick={() => void previewText()}>Preview</button>
          </div>
        </>
      )}
      <IssueList issues={parseIssues} />
      {result && <div className="panel" role="status">{result}</div>}
      {plan && (
        <div className="panel rail">
          <span className="label">Preview · nothing written yet</span>
          <IssueList issues={plan.issues} />
          {plan.alreadyCommitted && <p>This exact package was already committed. Importing it again changes nothing.</p>}
          <dl className="kv" style={{ marginTop: 8 }}>
            <dt>Records</dt><dd>{tally("nodes", "create")} new · {tally("nodes", "update")} updated · {tally("nodes", "noop")} unchanged</dd>
            <dt>Relations</dt><dd>{tally("edges", "create")} new · {tally("edges", "update")} updated · {tally("edges", "noop")} unchanged</dd>
            <dt>Evidence</dt><dd>{tally("evidence", "create")} new</dd>
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

export function BackupPanel(): ReactNode {
  const app = useApp();
  const [file, setFile] = useState<BackupFile | null>(null);
  const [check, setCheck] = useState<RestoreCheck | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
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
      <div className="panel rail">
        <p>A backup is one compressed file holding your knowledge, evidence and history. Restore points on this phone do not protect you if the phone is lost or its site data is cleared; a file you keep elsewhere does.</p>
        <button className="btn primary" disabled={busy} onClick={() => void run(async () => { setCheck(null); setFile(await createBackup(await app.rt.store.load(), new Date())); })}>Create backup file</button>
      </div>
      {file && (
        <div className="panel">
          <span className="label">Backup ready · not yet saved anywhere</span>
          <dl className="kv" style={{ marginTop: 8 }}>
            <dt>File</dt><dd className="mono">{file.fileName}</dd>
            <dt>Size</dt><dd>{(file.bytes.length / 1024).toFixed(0)} KB compressed</dd>
            <dt>Contents</dt><dd>{Object.entries(file.manifest.counts).map(([k, v]) => `${v} ${k}`).join(" · ")}</dd>
            <dt>SHA-256</dt><dd className="mono">{file.sha256}</dd>
          </dl>
          <div className="row wrap" style={{ marginTop: 12 }}>
            <button className="btn primary" disabled={busy} onClick={() => void run(async () => setMsg({ shared: "Shared. Check the destination to confirm the file arrived.", downloaded: "Downloaded to this phone’s Downloads. Move it to your SD card or another safe place yourself.", cancelled: "Cancelled. Nothing was saved." }[await shareOrDownload(file)]))}>Share or save file</button>
            <button className="btn" disabled={busy} onClick={() => void run(async () => setCheck(await scratchRestoreCheck(file.bytes)))}>Check this backup</button>
          </div>
          <p style={{ marginTop: 12 }}>Saving straight to an SD card through the Android picker has not been tested on a real phone. Until it has, treat “download, then move the file” as the reliable route.</p>
        </div>
      )}
      <div className="panel">
        <h3>Check a backup file</h3>
        <p>Choose a backup. ATHENA reads it into a scratch copy and checks it. Your real data is never changed.</p>
        <label className="btn">Choose backup file<input type="file" hidden onChange={(e: { target: HTMLInputElement }) => void run(async () => { const f = e.target.files?.[0]; if (f) setCheck(await scratchRestoreCheck(new Uint8Array(await f.arrayBuffer()))); })} /></label>
      </div>
      {msg && <div className="panel" role="status">{msg}</div>}
      {check && (
        <div className="panel rail" style={{ ["--rail" as string]: check.ok ? "var(--signal-green)" : "var(--signal-coral)" }} role="status">
          <span className={`tag ${check.ok ? "ok" : "bad"}`}>{check.ok ? "scratch check passed" : "scratch check failed"}</span>
          <p style={{ marginTop: 8 }}>{check.message}</p>
          {check.manifest && <dl className="kv"><dt>Created</dt><dd>{check.manifest.created_at}</dd><dt>App</dt><dd>{check.manifest.app_version} · format {check.manifest.format_version}</dd><dt>Contents</dt><dd>{Object.entries(check.counts).map(([k, v]) => `${v} ${k}`).join(" · ")}</dd></dl>}
          <p style={{ marginTop: 8 }}>This checks the file in memory. It does not prove the copy on your SD card or cloud drive is readable; open that copy and check it again.</p>
        </div>
      )}
    </section>
  );
}
