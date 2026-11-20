import { useState } from "react";
import type { ReactNode } from "react";
import { ClipboardCopy, CloudUpload, FileArchive, ShieldCheck } from "lucide-react";
import {
  buildKbPack,
  deltaForPreview,
  downloadBlob,
  packSpecText,
  previewKbPack,
  pushSnapshot,
  readOperational,
  type KbPreview,
} from "../app/kbpack.ts";
import { SYSTEM_TABLES, type SystemRow, type SystemTable } from "../domain/system.ts";
import { useApp } from "./context.ts";

export function KbPackPanel(): ReactNode {
  const app = useApp();
  const [preview, setPreview] = useState<KbPreview | null>(null);
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [target, setTarget] = useState({ owner: "RENTAGONE", repo: "Athena-", branch: "main", path: "data/athena-kb-snapshot.json", token: "" });
  const [pushMsg, setPushMsg] = useState<string | null>(null);

  const gather = async (): Promise<Partial<Record<SystemTable, SystemRow[]>>> => {
    const out: Partial<Record<SystemTable, SystemRow[]>> = {};
    for (const t of SYSTEM_TABLES) out[t] = await app.rt.store.listRows(t);
    return out;
  };

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

  const exportPack = (): Promise<void> =>
    run(async () => {
      const blob = await buildKbPack({ state: await app.rt.store.load(), operational: await gather(), appVersion: "0.1.0", createdAt: new Date().toISOString() });
      downloadBlob(blob, `athena-kb-pack-${new Date().toISOString().slice(0, 10)}.zip`);
      setMsg("Pack built and handed to your browser. It contains knowledge, evidence and your operational records; nothing left this device.");
    });

  const choosePack = (f: File): Promise<void> =>
    run(async () => {
      const data = await f.arrayBuffer();
      setBuffer(data);
      setPreview(await previewKbPack(data, await app.rt.store.load()));
    });

  const approve = (): Promise<void> =>
    run(async () => {
      if (!preview || !buffer) return;
      const current = await app.rt.store.load();
      const delta = deltaForPreview(preview, current);
      if (delta.puts.length > 0) await app.rt.store.persist(delta);
      for (const { table, rows } of await readOperational(buffer)) {
        for (const row of rows) await app.rt.store.putRow(table, row);
      }
      await app.refresh();
      setMsg(`Committed ${delta.puts.length} knowledge record${delta.puts.length === 1 ? "" : "s"} and the operational rows you approved. ${preview.rejected.length} rejected record${preview.rejected.length === 1 ? " was" : "s were"} left out.`);
      setPreview(null);
      setBuffer(null);
    });

  const copySpec = async (): Promise<void> => {
    const text = packSpecText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2_500);
    } catch {
      setMsg("Clipboard permission was refused. The spec is still available from the export file's README.");
    }
  };

  const push = (): Promise<void> =>
    run(async () => {
      setPushMsg(null);
      const state = await app.rt.store.load();
      const snapshot = JSON.stringify({ format: "athena-kb-snapshot", created_at: new Date().toISOString(), revision: state.meta.revision, nodes: state.nodes, edges: state.edges, codes: state.codes, evidence: state.evidence });
      const result = await pushSnapshot(target, snapshot);
      setPushMsg(`${result.created ? "Created" : "Updated"} ${target.owner}/${target.repo}/${target.path} on ${target.branch}. Commit ${result.sha.slice(0, 7)}.`);
      setTarget((t) => ({ ...t, token: "" }));
    });

  return (
    <div className="workspace">
      <section className="panel span-7">
        <span className="label">KB pack · export</span>
        <p style={{ marginTop: 8 }}>
          One <code>.zip</code> holding the canonical knowledge, its evidence and your operational records. It is plain JSON inside a zip, readable without ATHENA,
          and it never includes a nested archive, <code>node_modules</code> or <code>.git</code>.
        </p>
        <div className="row wrap" style={{ marginTop: 12 }}>
          <button className="btn primary" disabled={busy} onClick={() => void exportPack()}>
            <FileArchive size={15} strokeWidth={1.5} aria-hidden="true" /> Build pack
          </button>
          <button className="btn" onClick={() => void copySpec()}>
            <ClipboardCopy size={15} strokeWidth={1.5} aria-hidden="true" /> {copied ? "Copied" : "Copy GPT KB pack spec"}
          </button>
        </div>
        <p className="hint" style={{ marginTop: 10 }}>
          The spec gives a model the exact zip layout, ID prefixes, object classes and relations. A generated pack still has to pass the preview below; nothing is trusted because a model produced it.
        </p>

        <span className="label" style={{ display: "block", marginTop: 22 }}>KB pack · import</span>
        <p style={{ marginTop: 6 }}>Choose a pack. Every record is diffed and validated into added, updated and rejected before anything is written.</p>
        <label className="btn">
          Choose KB pack (.zip)
          <input type="file" accept=".zip,application/zip" hidden onChange={(e: { target: HTMLInputElement }) => { const f = e.target.files?.[0]; if (f) void choosePack(f); }} />
        </label>

        {msg && <div className="panel" role="status" style={{ marginTop: 12 }}>{msg}</div>}

        {preview && (
          <div className="panel rail" style={{ marginTop: 12 }}>
            <span className="label">Preview · nothing written yet</span>
            <dl className="kv">
              <dt>Added</dt><dd><span className="num">{preview.added.nodes}</span> records · <span className="num">{preview.added.edges}</span> links · <span className="num">{preview.added.evidence}</span> evidence</dd>
              <dt>Updated</dt><dd><span className="num">{preview.updated.nodes}</span> records · <span className="num">{preview.updated.edges}</span> links</dd>
              <dt>Unchanged</dt><dd><span className="num">{preview.unchanged.nodes}</span> records · <span className="num">{preview.unchanged.edges}</span> links</dd>
              <dt>Rejected</dt><dd><span className="num">{preview.rejected.length}</span> records</dd>
            </dl>
            {preview.rejected.length > 0 && (
              <ul className="list" style={{ marginTop: 10 }}>
                {preview.rejected.slice(0, 12).map((r, i) => <li key={`${r.table}:${r.id}:${i}`} className="mono">{r.table} · {r.code ?? r.id} · {r.reason}</li>)}
              </ul>
            )}
            {preview.warnings.map((w) => <p key={w} className="hint">{w}</p>)}
            <div className="row wrap" style={{ marginTop: 12 }}>
              <button className="btn primary" disabled={busy} onClick={() => void approve()}>
                <ShieldCheck size={15} strokeWidth={1.5} aria-hidden="true" /> Approve and commit
              </button>
              <button className="btn" onClick={() => { setPreview(null); setBuffer(null); }}>Reject</button>
            </div>
          </div>
        )}
      </section>

      <section className="panel span-5">
        <span className="label">GitHub direct push</span>
        <p style={{ marginTop: 8 }}>Writes one snapshot file to a repository you control. The token is used for this request and then cleared from the field; it is never stored.</p>
        <div className="git-form">
          <label><span className="label">Owner</span><input value={target.owner} onChange={(e: { target: HTMLInputElement }) => setTarget({ ...target, owner: e.target.value })} /></label>
          <label><span className="label">Repository</span><input value={target.repo} onChange={(e: { target: HTMLInputElement }) => setTarget({ ...target, repo: e.target.value })} /></label>
          <label><span className="label">Branch</span><input value={target.branch} onChange={(e: { target: HTMLInputElement }) => setTarget({ ...target, branch: e.target.value })} /></label>
          <label className="wide"><span className="label">Path</span><input value={target.path} onChange={(e: { target: HTMLInputElement }) => setTarget({ ...target, path: e.target.value })} /></label>
          <label className="wide"><span className="label">Fine-grained token · contents:write</span><input type="password" autoComplete="off" value={target.token} onChange={(e: { target: HTMLInputElement }) => setTarget({ ...target, token: e.target.value })} placeholder="github_pat_…" /></label>
        </div>
        <button className="btn" disabled={busy || !target.token} style={{ marginTop: 12 }} onClick={() => void push()}>
          <CloudUpload size={15} strokeWidth={1.5} aria-hidden="true" /> Push snapshot
        </button>
        {pushMsg && <p role="status" style={{ marginTop: 10 }}>{pushMsg}</p>}
        <p className="hint" style={{ marginTop: 10 }}>A push is an external write to a public or private repository. ATHENA resolves the existing SHA first, so it updates rather than overwriting blindly.</p>
      </section>
    </div>
  );
}
