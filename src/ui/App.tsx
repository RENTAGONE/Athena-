import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Layers, Orbit, Sun } from "lucide-react";
import { createRuntime, type Runtime } from "../app/runtime.ts";
import type { DbState } from "../domain/types.ts";
import { Ctx } from "./context.ts";
import { ApertureMark } from "./ApertureMark.tsx";
import { Today, SkillDetail } from "./screens.tsx";
import { Knowledge } from "./AtlasCanvas.tsx";
import { Studio } from "./studio.tsx";

function useHashRoute(): string {
  const read = (): string => window.location.hash.slice(1) || "/today";
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const f = (): void => setRoute(read());
    window.addEventListener("hashchange", f);
    return () => window.removeEventListener("hashchange", f);
  }, []);
  return route;
}

export function App(): ReactNode {
  const route = useHashRoute();
  const [rt, setRt] = useState<Runtime | null>(null);
  const [state, setState] = useState<DbState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updateReady, setUpdateReady] = useState(false);

  useEffect(() => {
    createRuntime()
      .then(async (r) => {
        setRt(r);
        setState(await r.store.load());
      })
      .catch((e: Error) => setError(e.message));
    const f = (): void => setUpdateReady(true);
    window.addEventListener("athena-update-ready", f);
    return () => window.removeEventListener("athena-update-ready", f);
  }, []);

  const refresh = useCallback(async (): Promise<void> => {
    if (rt) setState(await rt.store.load());
  }, [rt]);

  if (error) {
    return (
      <main className="main">
        <h1>Storage unavailable</h1>
        <p>ATHENA could not open its local database: {error}</p>
      </main>
    );
  }
  if (!rt || !state) {
    return (
      <main className="main">
        <span className="label">ATHENA</span>
        <p>Opening local database…</p>
      </main>
    );
  }

  const isAtlas = route === "/knowledge" || route === "/knowledge/";
  const page = route.startsWith("/knowledge/") ? (
    <SkillDetail code={decodeURIComponent(route.slice("/knowledge/".length))} />
  ) : route.startsWith("/knowledge") ? (
    <Knowledge />
  ) : route.startsWith("/studio") ? (
    <Studio tab={route.endsWith("/backup") ? "backup" : "updates"} />
  ) : (
    <Today />
  );
  const cur = (p: string): "page" | undefined => (route.startsWith(p) ? "page" : undefined);

  return (
    <Ctx.Provider value={{ rt, state, refresh }}>
      <div className="shell">
        {updateReady && (
          <div className="banner" role="status">
            <span className="grow">A new version is ready. Updating does not change your data.</span>
            <button className="btn" onClick={() => void window.__athenaUpdate?.()}>Update now</button>
          </div>
        )}
        <header className="brandrail">
          <a href="#/today" aria-label="ATHENA home">
            <ApertureMark variant="primary" size={46} />
          </a>
          <span className="rail-sub">Cognitive Atlas</span>
          <span className="rail-foot">
            v0.9 pack · <span className="num">{Object.keys(state.nodes).length}</span> records
          </span>
        </header>
        <div className="topbar">
          <ApertureMark variant="compact" size={28} />
          <span className="label">ATHENA · Cognitive Atlas</span>
        </div>
        <main className={isAtlas ? "main full" : "main"}>{page}</main>
        <nav className="nav" aria-label="Environments">
          <a href="#/today" aria-current={cur("/today")}>
            <Sun aria-hidden="true" strokeWidth={1.5} />Today
          </a>
          <a href="#/knowledge" aria-current={cur("/knowledge")}>
            <Orbit aria-hidden="true" strokeWidth={1.5} />Knowledge
          </a>
          <a href="#/studio/updates" aria-current={cur("/studio")}>
            <Layers aria-hidden="true" strokeWidth={1.5} />Studio
          </a>
        </nav>
      </div>
    </Ctx.Provider>
  );
}
