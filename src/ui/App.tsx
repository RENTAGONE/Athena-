import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { BookOpen, CalendarDays, Inbox as InboxIcon, Layers, Orbit, Settings, Sun } from "lucide-react";
import { createRuntime, type Runtime } from "../app/runtime.ts";
import type { DbState } from "../domain/types.ts";
import { Ctx } from "./context.ts";
import { ApertureMark } from "./ApertureMark.tsx";
import { Boot } from "./Boot.tsx";
import { Today, SkillDetail } from "./screens.tsx";
import { Knowledge } from "./AtlasCanvas.tsx";
import { Studio } from "./studio.tsx";
import { InboxScreen } from "./Inbox.tsx";
import { LessonScreen } from "./Lesson.tsx";
import { SettingsScreen } from "./Settings.tsx";
import { ArchitectScreen } from "./Architect.tsx";
import { ScheduleScreen } from "./ScheduleScreen.tsx";
import { LibraryScreen } from "./LibraryScreen.tsx";
import { getPrefs } from "./prefs.ts";
import { applyUpdate, isUpdateReady, subscribeUpdate, watchForUpdate } from "./update.ts";

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
  const [updateReady, setUpdateReady] = useState(isUpdateReady);
  const [updateDismissed, setUpdateDismissed] = useState(false);
  /** The navigation rail folds away entirely, leaving the 3D surface unobstructed. */
  const [railCollapsed, setRailCollapsed] = useState(() => {
    try {
      return window.localStorage.getItem("athena.rail") === "collapsed";
    } catch {
      return false;
    }
  });
  const [boot, setBoot] = useState(() => {
    const prefs = getPrefs();
    if (!prefs.boot || !prefs.motion) return false;
    try {
      if (window.sessionStorage.getItem("athena.booted") === "1") return false;
      window.sessionStorage.setItem("athena.booted", "1");
    } catch {
      return false;
    }
    return true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("athena-rail-collapsed", railCollapsed);
    return () => document.documentElement.classList.remove("athena-rail-collapsed");
  }, [railCollapsed]);

  useEffect(() => {
    createRuntime()
      .then(async (r) => {
        setRt(r);
        setState(await r.store.load());
      })
      .catch((e: Error) => setError(e.message));
    const f = (): void => setUpdateReady(isUpdateReady());
    window.addEventListener("athena-update-ready", f);
    const unsubscribe = subscribeUpdate(f);
    let stopWatching = (): void => {};
    void watchForUpdate().then((stop) => {
      stopWatching = stop;
    });
    return () => {
      window.removeEventListener("athena-update-ready", f);
      unsubscribe();
      stopWatching();
    };
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
  const learnCode = route.startsWith("/learn/") ? decodeURIComponent(route.slice("/learn/".length)) : null;
  const page = route.startsWith("/knowledge/") ? (
    <SkillDetail code={decodeURIComponent(route.slice("/knowledge/".length))} />
  ) : isAtlas ? (
    <Knowledge />
  ) : learnCode ? (
    <LessonScreen code={learnCode} />
  ) : route.startsWith("/studio/architect") ? (
    <ArchitectScreen />
  ) : route.startsWith("/studio") ? (
    <Studio tab={route.endsWith("/backup") ? "backup" : route.endsWith("/pack") ? "pack" : route.endsWith("/author") ? "author" : "updates"} />
  ) : route.startsWith("/schedule") ? (
    <ScheduleScreen />
  ) : route.startsWith("/library") ? (
    <LibraryScreen />
  ) : route.startsWith("/inbox") ? (
    <InboxScreen />
  ) : route.startsWith("/settings") ? (
    <SettingsScreen />
  ) : (
    <Today />
  );
  const pageIs = (...prefixes: string[]): "page" | undefined => (prefixes.some((p) => route.startsWith(p)) ? "page" : undefined);

  return (
    <Ctx.Provider value={{ rt, state, refresh }}>
      <div className="shell" data-atlas={isAtlas ? "true" : undefined} data-rail={railCollapsed ? "collapsed" : undefined}>
        {boot && <Boot onDone={() => setBoot(false)} />}
        {updateReady && !updateDismissed && (
          <div className="banner" role="status">
            <span className="grow">A new version is ready. Updating does not change your data.</span>
            <button className="btn primary" onClick={() => void applyUpdate()}>Update now</button>
            <button className="btn ghost sm" onClick={() => setUpdateDismissed(true)}>Later</button>
          </div>
        )}
        <header className="brandrail">
          <a href="#/today" aria-label="ATHENA home">
            <ApertureMark variant="primary" size={44} />
          </a>
          <span className="rail-sub">Cognitive Atlas<br />Know · Learn · Achieve</span>
          <span className="rail-foot">
            <span className="tag ok">v1.0 pack</span>
            <br />
            <span className="num">{Object.keys(state.nodes).length}</span> records ·{' '}
            <span className="num">{Object.keys(state.edges).length}</span> links
          </span>
        </header>
        <div className="topbar">
          <ApertureMark variant="compact" size={30} />
          <span className="mark-word">
            <span className="mark-name">ATHENA</span>
            <span className="mark-tagline">Know · Learn · Achieve</span>
          </span>
          <span className="label">
            <span className="num">{Object.keys(state.nodes).length}</span> records
            <br />
            <span className="num">{Object.keys(state.edges).length}</span> links
          </span>
        </div>
        <main className={isAtlas ? "main full" : "main"}>{page}</main>
        <nav className="nav" aria-label="Environments">
          <button
            className="rail-collapse"
            aria-label="Collapse sidebar"
            aria-expanded={!railCollapsed}
            onClick={() => {
              setRailCollapsed(true);
              try {
                window.localStorage.setItem("athena.rail", "collapsed");
              } catch {
                /* storage may be blocked; the choice lasts for this session */
              }
            }}
          >
            «
          </button>
          <a href="#/today" aria-current={pageIs("/today")}>
            <Sun aria-hidden="true" strokeWidth={1.5} />Today
          </a>
          <a href="#/schedule" aria-current={pageIs("/schedule")}>
            <CalendarDays aria-hidden="true" strokeWidth={1.5} />Schedule
          </a>
          <a href="#/inbox" aria-current={pageIs("/inbox")}>
            <InboxIcon aria-hidden="true" strokeWidth={1.5} />Inbox
          </a>
          <a href="#/knowledge" aria-current={pageIs("/knowledge", "/learn")}>
            <Orbit aria-hidden="true" strokeWidth={1.5} />Knowledge
          </a>
          <a href="#/library" aria-current={pageIs("/library")}>
            <BookOpen aria-hidden="true" strokeWidth={1.5} />Library
          </a>
          <a href="#/studio/updates" aria-current={pageIs("/studio")}>
            <Layers aria-hidden="true" strokeWidth={1.5} />Studio
          </a>
          <a href="#/settings" aria-current={pageIs("/settings")}>
            <Settings aria-hidden="true" strokeWidth={1.5} />Settings
          </a>
        </nav>
        {railCollapsed && (
          <button
            className="rail-open"
            aria-label="Open sidebar"
            onClick={() => {
              setRailCollapsed(false);
              try {
                window.localStorage.setItem("athena.rail", "open");
              } catch {
                /* storage may be blocked */
              }
            }}
          >
            ☰<span>Menu</span>
          </button>
        )}
      </div>
    </Ctx.Provider>
  );
}
