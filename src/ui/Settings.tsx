import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Database, Download, Layers, Orbit, RefreshCw } from "lucide-react";
import { usePrefs, setPrefs } from "./prefs.ts";
import {
  applyUpdate,
  checkForUpdate,
  purgeOfflineShell,
  subscribeUpdate,
  updateStatus,
  type UpdateStatus,
} from "./update.ts";
import { PageBack } from "./PageBack.tsx";
import { useApp } from "./context.ts";
import { Head } from "./ui.tsx";

function Toggle({ label, detail, checked, onChange }: { label: string; detail: string; checked: boolean; onChange: (v: boolean) => void }): ReactNode {
  return (
    <div className="setting-row">
      <div>
        <strong>{label}</strong>
        <p className="empty">{detail}</p>
      </div>
      <button
        className="switch"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
      >
        <span />
      </button>
    </div>
  );
}

function UpdatePanel(): ReactNode {
  const [status, setStatus] = useState<UpdateStatus>(() => updateStatus());
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => subscribeUpdate(() => setStatus(updateStatus())), []);

  const detail =
    status === "ready"
      ? "A newer build is installed and waiting for you to accept it."
      : status === "checking"
        ? "Checking the build on the server…"
        : status === "current"
          ? "This is the newest build on the server."
          : status === "unavailable"
            ? "Nothing is registered here. The dev server does not install an offline shell, so there is nothing to update."
            : "ATHENA checks on load and every minute while this tab stays open.";

  const reset = async (): Promise<void> => {
    setBusy(true);
    const removed = await purgeOfflineShell();
    setNote(removed > 0 ? "Offline shell removed. Reloading…" : "No offline shell to remove. Reloading…");
    window.setTimeout(() => window.location.reload(), 700);
  };

  return (
    <section className="panel">
      <span className="label"><RefreshCw size={13} strokeWidth={1.5} aria-hidden="true" /> App build</span>
      <dl className="kv" style={{ marginTop: 10 }}>
        <dt>Built</dt><dd className="mono">{__BUILD_STAMP__}</dd>
        <dt>Offline shell</dt><dd>{status === "unavailable" ? "not registered" : "registered"}</dd>
      </dl>
      <p className="empty" style={{ marginTop: 10 }} role="status">{detail}</p>
      <div className="row wrap" style={{ marginTop: 10 }}>
        {status === "ready" ? (
          <button className="btn primary" onClick={() => void applyUpdate()}>Update now</button>
        ) : (
          <button
            className="btn"
            disabled={busy}
            onClick={() => {
              setBusy(true);
              void checkForUpdate().then(() => setBusy(false));
            }}
          >
            Check for updates
          </button>
        )}
        <button className="btn ghost" disabled={busy} onClick={() => void reset()}>
          Reset offline cache
        </button>
      </div>
      <p className="empty" style={{ marginTop: 10 }}>
        Resetting replaces only the app shell. Records, links and evidence stay in this browser.
      </p>
      {note && <p className="empty" role="status">{note}</p>}
    </section>
  );
}

export function SettingsScreen(): ReactNode {
  const { state } = useApp();
  const prefs = usePrefs();
  const [usage, setUsage] = useState<{ used: number; quota: number } | null>(null);

  useEffect(() => {
    let alive = true;
    void navigator.storage?.estimate?.().then((e) => {
      if (!alive) return;
      setUsage({ used: e.usage ?? 0, quota: e.quota ?? 0 });
    });
    return () => {
      alive = false;
    };
  }, []);

  const mb = (n: number): string => `${(n / (1024 * 1024)).toFixed(n > 10 * 1024 * 1024 ? 0 : 1)} MB`;

  return (
    <>
      <PageBack href="#/today" label="Today" />
      <Head label="This device only" title="Settings" />
      <div className="workspace">
        <div className="span-7 stack">
          <section className="panel">
            <span className="label">Presentation</span>
            <p className="empty" style={{ marginTop: 6 }}>These preferences never touch the knowledge store or the evidence log.</p>
            <div className="settings-list">
              <Toggle
                label="Opening sequence"
                detail="Show the short ATHENA boot on the first load of a session."
                checked={prefs.boot}
                onChange={(v) => setPrefs({ boot: v })}
              />
              <Toggle
                label="Motion"
                detail="Atlas orbit, travelling threads and the boot animation. Turning this off pauses the atlas."
                checked={prefs.motion}
                onChange={(v) => setPrefs({ motion: v })}
              />
              <Toggle
                label="Atlas starts in orbit"
                detail="The default for a fresh atlas view. The pause control always overrides it."
                checked={prefs.atlasOrbit}
                onChange={(v) => setPrefs({ atlasOrbit: v })}
              />
            </div>
          </section>

          <section className="panel">
            <span className="label">Routine length</span>
            <p className="empty" style={{ marginTop: 6 }}>The routine engine fills this budget with revision, retention and new practice blocks. It never adds blocks to look busy.</p>
            <div className="chip-row" style={{ marginTop: 12 }}>
              {[15, 25, 35, 45, 60, 90].map((m) => (
                <button
                  key={m}
                  className="chip"
                  aria-pressed={prefs.minutesTarget === m}
                  onClick={() => setPrefs({ minutesTarget: m })}
                >
                  <span className="num">{m}</span> min
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="span-5 stack">
          <UpdatePanel />

          <section className="panel">
            <span className="label"><Database size={13} strokeWidth={1.5} aria-hidden="true" /> Local store</span>
            <dl className="kv" style={{ marginTop: 10 }}>
              <dt>Records</dt><dd className="num">{Object.keys(state.nodes).length.toLocaleString()}</dd>
              <dt>Links</dt><dd className="num">{Object.keys(state.edges).length.toLocaleString()}</dd>
              <dt>Evidence</dt><dd className="num">{Object.keys(state.evidence).length.toLocaleString()}</dd>
              <dt>Schema rev.</dt><dd className="num">{state.meta.revision}</dd>
              <dt>Device</dt><dd className="mono" style={{ overflowWrap: "anywhere" }}>{state.meta.device_id}</dd>
              {usage && <><dt>Used</dt><dd>{mb(usage.used)} of {mb(usage.quota)}</dd></>}
            </dl>
            <p className="empty" style={{ marginTop: 10 }}>Everything lives in this browser profile. Clearing site data removes it; a backup is the only copy that survives.</p>
            <a className="btn" href="#/studio/backup" style={{ marginTop: 10 }}><Download size={15} strokeWidth={1.5} aria-hidden="true" /> Back up now</a>
          </section>

          <section className="panel">
            <span className="label">System</span>
            <div className="stack" style={{ marginTop: 10 }}>
              <a className="setting-link" href="#/studio/updates"><Layers size={15} strokeWidth={1.5} aria-hidden="true" /> Studio · imports and packs</a>
              <a className="setting-link" href="#/studio/architect"><Orbit size={15} strokeWidth={1.5} aria-hidden="true" /> Architect · plan a path</a>
              <a className="setting-link" href="#/knowledge"><Orbit size={15} strokeWidth={1.5} aria-hidden="true" /> Knowledge Atlas</a>
            </div>
            <p className="empty" style={{ marginTop: 12 }}>ATHENA v0.1 · Pack v1.0 · 18 disciplines. No account, no sync, no network requests.</p>
          </section>
        </div>
      </div>
    </>
  );
}
