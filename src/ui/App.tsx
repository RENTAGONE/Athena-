import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { createRuntime, type Runtime } from "../app/runtime.ts";
import type { DbState } from "../domain/types.ts";
import { Ctx } from "./context.ts";
import { Today, Knowledge, SkillDetail } from "./screens.tsx";
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

const Icon = ({ d }: { d: string }): ReactNode => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d={d} />
  </svg>
);

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

  if (error) return <main className="main"><h1>Storage unavailable</h1><p>ATHENA could not open its local database: {error}</p></main>;
  if (!rt || !state) return <main className="main"><span className="label">ATHENA</span><p>Opening local database…</p></main>;

  const page = route.startsWith("/knowledge/") ? <SkillDetail code={decodeURIComponent(route.slice("/knowledge/".length))} /> : route.startsWith("/knowledge") ? <Knowledge /> : route.startsWith("/studio") ? <Studio tab={route.endsWith("/backup") ? "backup" : "updates"} /> : <Today />;
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
        <div className="main">{page}</div>
        <nav className="nav" aria-label="Environments">
          <a href="#/today" aria-current={cur("/today")}><Icon d="M12 3v3M12 18v3M3 12h3M18 12h3M12 8a4 4 0 100 8 4 4 0 000-8z" />Today</a>
          <a href="#/knowledge" aria-current={cur("/knowledge")}><Icon d="M5 6a2 2 0 100 .01M19 6a2 2 0 100 .01M12 18a2 2 0 100 .01M6.7 7.2L11 16.3M17.3 7.2L13 16.3M7 6h10" />Knowledge</a>
          <a href="#/studio/updates" aria-current={cur("/studio")}><Icon d="M4 20h4L19 9l-4-4L4 16v4zM13 7l4 4" />Studio</a>
        </nav>
      </div>
    </Ctx.Provider>
  );
}
