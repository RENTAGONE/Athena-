import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Eye, Menu, RotateCcw, Search, X } from "lucide-react";
import { useApp } from "./context.ts";
import { DISCIPLINES, DISCIPLINE_BY_ID } from "./disciplines.ts";
import {
  buildGalaxy,
  evidenceIndex,
  indexGroups,
  masteryTier,
  prerequisiteCount,
  type MasteryTier,
} from "../app/selectors.ts";
import type { NodeRecord } from "../domain/types.ts";
import { getPrefs } from "./prefs.ts";
import { AtlasScene, MULTIVERSE_REVEAL, UNITS_PER_AU, webglAvailable, type AtlasViewState, type CosmicBody } from "./atlas-scene.ts";

const TIER_LABEL: Record<MasteryTier, string> = {
  unassessed: "unassessed",
  needs_revision: "needs revision",
  demonstrated: "demonstrated",
  mastered: "mastered",
};

const TIER_COLOR: Record<MasteryTier, string> = {
  unassessed: "#71819f",
  needs_revision: "#ffc66d",
  demonstrated: "#42e6c4",
  mastered: "#42e6c4",
};

const SPEEDS = [0, 1, 10, 100] as const;

/** Declared atlas scale: 1 AU is the 1,650-unit outer orbit. Nothing here is a learner metric. */
function scaleReadout(distance: number): { value: string; unit: string } {
  const au = distance / UNITS_PER_AU;
  if (au < 0.02) return { value: Math.round(au * 149_597_870).toLocaleString("en-US"), unit: "km" };
  if (au < 6000) return { value: au < 10 ? au.toFixed(2) : Math.round(au).toLocaleString("en-US"), unit: "AU" };
  return { value: (au / 63_241).toFixed(2), unit: "ly" };
}

export function Knowledge(): ReactNode {
  const { state } = useApp();
  const index = useMemo(() => evidenceIndex(state), [state]);
  const galaxy = useMemo(() => buildGalaxy(state, index), [state, index]);
  const groups = useMemo(() => indexGroups(state, index), [state, index]);
  const [view, setView] = useState<"atlas" | "index">("atlas");
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [isolated, setIsolated] = useState<number | null>(null);
  const [speed, setSpeed] = useState<number>(1);
  /** Native orientation only: no manual rotation button, no CSS-rotated fake cockpit. */
  const [landscape, setLandscape] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia("(orientation: landscape)").matches,
  );
  const [railOpen, setRailOpen] = useState(false);
  const [zen, setZen] = useState(false);
  const [distance, setDistance] = useState(20_500);
  /** A universe, galaxy, black hole or station: inspected without a knowledge record behind it. */
  const [core, setCore] = useState<CosmicBody | null>(null);
  const [controls, setControls] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const [homeSystem, setHomeSystem] = useState<string | null>(() => {
    try {
      return window.localStorage.getItem("athena.home.system");
    } catch {
      return null;
    }
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const labelRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<AtlasScene | null>(null);
  const galaxyRef = useRef(galaxy);
  galaxyRef.current = galaxy;

  /** Evidence per node: growth, settlement lights and phenomena all read from stored evidence only. */
  const evidence = useMemo(() => {
    const out = new Map<string, number>();
    for (const [id, list] of index.byTarget) out.set(id, list.length);
    return out;
  }, [index]);

  /** Mastery ratio per record: 1 mastered, 0.6 demonstrated, 0.15 needs revision, 0 untouched. A
   *  domain's night lights, its orbital ring and a discipline's Dyson swarm all read this one map. */
  const progress = useMemo(() => {
    const children = new Map<string, NodeRecord[]>();
    for (const node of Object.values(state.nodes)) {
      if (!node.parent_id) continue;
      const list = children.get(node.parent_id) ?? [];
      list.push(node);
      children.set(node.parent_id, list);
    }
    const ratio = new Map<string, number>();
    const weight = (tier: MasteryTier): number =>
      tier === "mastered" ? 1 : tier === "demonstrated" ? 0.6 : tier === "needs_revision" ? 0.15 : 0;
    const walk = (node: NodeRecord): number => {
      const kids = children.get(node.id) ?? [];
      if (kids.length === 0) {
        const value = weight(masteryTier(index, node.id));
        ratio.set(node.id, value);
        return value;
      }
      let sum = 0;
      for (const kid of kids) sum += walk(kid);
      const value = sum / kids.length;
      ratio.set(node.id, value);
      return value;
    };
    for (const node of Object.values(state.nodes)) if (!node.parent_id) walk(node);
    return ratio;
  }, [state.nodes, index]);

  useEffect(() => {
    setWebgl(webglAvailable());
  }, []);

  // One renderer for the life of the screen. React never owns a per-frame value: the rig keeps its
  // own clock so orbiting, gliding and the follow lock never schedule a render.
  useEffect(() => {
    const canvas = canvasRef.current;
    const label = labelRef.current;
    if (!canvas || !label || !webglAvailable()) return;
    const scene = new AtlasScene({
      canvas,
      labelCanvas: label,
      onSelect: (id) => {
        setSelected(id);
        if (id) {
          const loc = galaxyRef.current.location.get(id);
          if (loc) setIsolated(loc.star);
        }
      },
      onHover: () => {
        /* hover only changes the cursor; no React work */
      },
      onState: (s: AtlasViewState) => {
        setDistance((prev) => (Math.abs(prev - s.distance) / Math.max(1, s.distance) > 0.01 ? s.distance : prev));
      },
      onInspect: (body) => {
        setCore(body);
        if (body) setSelected(null);
      },
    });
    sceneRef.current = scene;
    if (import.meta.env.DEV) (window as unknown as { __atlasScene?: AtlasScene }).__atlasScene = scene;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scene.setTimeScale(reduced ? 0 : getPrefs().atlasOrbit ? 1 : 0);
    return () => {
      scene.destroy();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.setGalaxy(galaxy, evidence, progress);
  }, [galaxy, evidence, progress]);

  useEffect(() => {
    sceneRef.current?.setSelected(selected);
  }, [selected]);

  useEffect(() => {
    sceneRef.current?.setFilter(filter);
  }, [filter]);

  useEffect(() => {
    sceneRef.current?.setHomeSystem(homeSystem);
  }, [homeSystem]);

  useEffect(() => {
    sceneRef.current?.setTimeScale(speed);
  }, [speed]);

  /** Zen hides the chrome itself, not only the overlays. */
  useEffect(() => {
    document.documentElement.classList.toggle("athena-zen", zen);
    return () => document.documentElement.classList.remove("athena-zen");
  }, [zen]);

  /**
   * The cockpit follows the device. A phone turned sideways gets the landscape layout without a
   * button, a rotation animation or any CSS transform: matchMedia is the single source of truth, with
   * resize/orientationchange as a fallback for WebViews that lag the media query.
   */
  useEffect(() => {
    const query = window.matchMedia("(orientation: landscape)");
    const apply = (): void => {
      const landscapeNow = window.matchMedia("(orientation: landscape)").matches && window.innerWidth > window.innerHeight;
      setLandscape(landscapeNow);
      document.documentElement.classList.toggle("athena-cockpit", landscapeNow);
      // The rail collapses into the compact drawer whenever the screen turns sideways.
      document.documentElement.classList.toggle("athena-rail-collapsed", landscapeNow);
      if (!landscapeNow) setRailOpen(false);
    };
    apply();
    query.addEventListener("change", apply);
    window.addEventListener("resize", apply);
    window.addEventListener("orientationchange", apply);
    return () => {
      query.removeEventListener("change", apply);
      window.removeEventListener("resize", apply);
      window.removeEventListener("orientationchange", apply);
      document.documentElement.classList.remove("athena-cockpit", "athena-rail-collapsed");
    };
  }, []);

  /** The drawer button only appears in landscape; it re-opens the collapsed sidebar on demand. */
  const toggleRail = useCallback(() => {
    setRailOpen((open) => {
      const next = !open;
      document.documentElement.classList.toggle("athena-rail-collapsed", !next);
      return next;
    });
  }, []);

  const focusSystem = useCallback((si: number) => {
    setIsolated(si);
    sceneRef.current?.focusSystem(si);
  }, []);

  /**
   * A discipline chip is a transport: choosing one flies to that star and dims the rest; choosing it
   * again releases the lock and returns to the galaxy. In Index view it filters the list instead.
   */
  const focusDiscipline = useCallback(
    (id: string) => {
      if (filter === id) {
        setFilter(null);
        setIsolated(null);
        sceneRef.current?.reset();
        return;
      }
      setFilter(id);
      const si = galaxy.stars.findIndex((s) => s.code === id || s.discipline.id === id);
      if (si < 0) return;
      setSelected(null);
      focusSystem(si);
    },
    [filter, galaxy.stars, focusSystem],
  );

  const resetView = useCallback(() => {
    setSelected(null);
    setIsolated(null);
    setFilter(null);
    sceneRef.current?.reset();
  }, []);

  const selectedNode = selected ? state.nodes[selected] : undefined;
  const selectedTier = selectedNode ? masteryTier(index, selectedNode.id) : null;
  const selectedMeta = selectedNode ? DISCIPLINE_BY_ID[selectedNode.owner_discipline_id ?? ""] : undefined;
  const groupsShown = filter === null ? groups : groups.filter((g) => g.discipline === filter);
  const needle = q.trim().toLowerCase();
  const focus = isolated !== null ? galaxy.stars[isolated] : undefined;

  /** Breadcrumb chain: universe → galaxy → star → planet → moon → satellite. */
  const crumbs = useMemo(() => {
    const chain: NodeRecord[] = [];
    let cursor = selectedNode;
    const seen = new Set<string>();
    while (cursor && chain.length < 5 && !seen.has(cursor.id)) {
      seen.add(cursor.id);
      chain.unshift(cursor);
      cursor = cursor.parent_id ? state.nodes[cursor.parent_id] : undefined;
    }
    return chain;
  }, [selectedNode, state.nodes]);

  const scale = scaleReadout(distance);
  const bottlenecks = useMemo(
    () => Object.values(state.nodes).filter((node) => masteryTier(index, node.id) === "needs_revision").length,
    [state.nodes, index],
  );
  const recordCount = Object.keys(state.nodes).length;
  const health = recordCount === 0 ? 100 : Math.round((1 - bottlenecks / recordCount) * 1000) / 10;

  return (
    <section
      className="atlas-root"
      aria-label="Knowledge Atlas"
      data-zen={zen ? "true" : undefined}
      data-landscape={landscape ? "true" : undefined}
      data-rail-open={railOpen ? "true" : undefined}
    >
      <div className="atlas-stage">
        <canvas ref={canvasRef} className="atlas-canvas" aria-hidden={view === "index"} />
        <canvas ref={labelRef} className="atlas-label-canvas" aria-hidden="true" />
        <div className="warp-overlay" aria-hidden="true">
          <div className="warp-streaks" />
          <div className="warp-reticle"><i /><i /><i /><i /></div>
          <span className="warp-lock">LOCK · HYPERSPACE</span>
        </div>
        {!webgl && (
          <div className="atlas-nogl" role="status">
            <h2>The 3D atlas needs WebGL</h2>
            <p>This browser has no WebGL context, so the orbital view cannot be drawn. Every record is still listed in Index view.</p>
            <button className="btn primary" onClick={() => setView("index")}>Open the index</button>
          </div>
        )}
      </div>

      <div className="atlas-hud">
        <div className="hud-search">
          <Search aria-hidden="true" size={16} strokeWidth={1.5} />
          <input
            type="search"
            aria-label="Search the atlas"
            placeholder="Search skills, codes, disciplines"
            value={q}
            onChange={(e: { target: HTMLInputElement }) => setQ(e.target.value)}
          />
        </div>
        <div className="hud-actions">
          <div className="pill warp" role="group" aria-label="Orbital speed">
            {SPEEDS.map((s) => (
              <button key={s} aria-pressed={speed === s} onClick={() => setSpeed(s)} aria-label={s === 0 ? "Pause orbits" : `${s} times orbital speed`}>
                {s}x
              </button>
            ))}
          </div>
          {landscape && (
            <button
              className="btn sm ghost hud-drawer"
              aria-label="Open navigation drawer"
              aria-expanded={railOpen}
              onClick={toggleRail}
            >
              <Menu size={17} strokeWidth={1.6} aria-hidden="true" />
            </button>
          )}
          <button className="btn sm ghost" aria-label="Zen view" aria-pressed={zen} onClick={() => setZen(true)}>
            <Eye size={15} strokeWidth={1.5} aria-hidden="true" />
            <span>Zen</span>
          </button>
          <div className="pill" role="group" aria-label="Atlas view" data-index={view === "index" ? "1" : "0"}>
            <span className="pill-thumb" aria-hidden="true" />
            <button aria-pressed={view === "atlas"} onClick={() => setView("atlas")}>Atlas</button>
            <button aria-pressed={view === "index"} onClick={() => setView("index")}>Index</button>
          </div>
          <button className="chip atlas-help" aria-expanded={controls} aria-label="Controls" onClick={() => setControls((v) => !v)}>
            ?<span>Controls</span>
          </button>
        </div>
      </div>

      <nav className="atlas-crumbs" aria-label="Scale path">
        <button onClick={() => { sceneRef.current?.focusCluster("multiverse"); }}>Multiverse</button>
        <span aria-hidden="true">›</span>
        <button onClick={() => { sceneRef.current?.focusCluster("universe"); }}>ATHENA Universe</button>
        <span aria-hidden="true">›</span>
        <button onClick={() => { sceneRef.current?.focusCluster("core"); }}>Core Galaxy</button>
        {crumbs.map((node) => (
          <span key={node.id} className="crumb">
            <span aria-hidden="true">›</span>
            <button
              aria-current={node.id === selected ? "true" : undefined}
              onClick={() => { sceneRef.current?.focus(node.id); }}
              title={node.title}
            >
              {node.title.length > 22 ? `${node.title.slice(0, 21)}…` : node.title}
            </button>
          </span>
        ))}
      </nav>

      <div className="atlas-chips" role="group" aria-label="Discipline filter">
        <button className="chip" aria-pressed={filter === null} onClick={() => { setFilter(null); setIsolated(null); sceneRef.current?.reset(); }}>
          All · <span className="num">{galaxy.totals.planets + galaxy.totals.constellations + galaxy.totals.moons + galaxy.totals.satellites + galaxy.totals.asteroids}</span>
        </button>
        {DISCIPLINES.map((d) => (
          <button
            key={d.id}
            className="chip"
            aria-pressed={filter === d.id}
            title={view === "atlas" ? `Fly to ${d.name}` : `Filter the index to ${d.name}`}
            onClick={() => (view === "atlas" ? focusDiscipline(d.id) : setFilter(filter === d.id ? null : d.id))}
          >
            <d.Icon size={13} strokeWidth={1.5} aria-hidden="true" color={d.color} />{d.short}
          </button>
        ))}
      </div>

      {view === "atlas" && filter !== null && isolated !== null && (
        <div className="atlas-lock" role="status">
          <span className="dot" aria-hidden="true" style={{ background: DISCIPLINE_BY_ID[filter]?.color ?? "#7ea4ff" }} />
          <span>Locked to <strong>{DISCIPLINE_BY_ID[filter]?.name ?? filter}</strong></span>
          <button className="btn sm ghost" onClick={resetView}>Release</button>
        </div>
      )}

      {view === "atlas" && (
        <div className="atlas-galaxies" role="group" aria-label="Galaxies">
          {([
            { key: "core" as const, label: "ATHENA Core", count: galaxy.totals.stars },
            { key: "frontier" as const, label: "Frontier", count: Object.values(state.nodes).filter((n) => n.status === "draft").length },
            { key: "vault" as const, label: "Vault", count: Object.values(state.nodes).filter((n) => /retired|archived|deprecated/.test(n.status)).length },
          ]).map((c) => (
            <button
              key={c.key}
              className="chip galaxy-chip"
              onClick={() => { sceneRef.current?.focusCluster(c.key); setIsolated(null); }}
              title={`Fly to ${c.label}`}
            >
              <span className="dot" aria-hidden="true" data-galaxy={c.key} />
              {c.label} · <span className="num">{c.count}</span>
            </button>
          ))}
          <button
            className="chip galaxy-chip"
            onClick={() => { sceneRef.current?.focusCluster("universe"); setIsolated(null); }}
            title="Pull back to the whole ATHENA universe"
          >
            <span className="dot" aria-hidden="true" data-galaxy="universe" />
            ATHENA Universe · <span className="num">{Object.keys(state.nodes).length}</span>
          </button>
          <button
            className="chip galaxy-chip"
            onClick={() => { sceneRef.current?.focusCluster("multiverse"); setIsolated(null); }}
            title="Pull back to the multiverse lattice"
          >
            <span className="dot" aria-hidden="true" data-galaxy="multiverse" />
            Multiverse · <span className="num">24</span>
          </button>
        </div>
      )}

      {galaxy.stars.length === 0 && view === "atlas" && (
        <div className="atlas-empty" role="status">
          <h2>No knowledge imported yet</h2>
          <p>The atlas draws only what is in your local store. Preview the bundled Pack v1.0 seed and approve it to load the 1,201 records it ships with.</p>
          <a className="btn primary" href="#/studio/updates">Open Studio</a>
        </div>
      )}

      {view === "index" && (
        <div className="atlas-index" role="region" aria-label="Knowledge index">
          {groupsShown.map((g) => {
            const meta = g.discipline ? DISCIPLINE_BY_ID[g.discipline] : undefined;
            const items = g.items.filter((it) => !needle || it.node.title.toLowerCase().includes(needle) || it.node.code.toLowerCase().includes(needle));
            if (items.length === 0) return null;
            return (
              <section key={g.discipline ?? "unassigned"} className="index-group">
                <h2 className="index-head">
                  <span style={{ color: meta?.color ?? "var(--text-secondary)" }}>{meta?.name ?? "Unassigned"}</span>
                  <span className="num index-count">{items.length}</span>
                </h2>
                <ul className="list">
                  {items.map((it) => (
                    <li key={it.node.id}>
                      <a className="item" href={`#/knowledge/${encodeURIComponent(it.node.code)}`} style={{ ["--rail" as string]: meta?.color ?? "var(--border)" }}>
                        <span className="t">{it.node.title}</span>
                        <span className="code mono">{it.node.code}</span>
                        <span className="tag" style={{ borderColor: TIER_COLOR[it.tier], color: TIER_COLOR[it.tier] }}>{TIER_LABEL[it.tier]}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
          {groupsShown.every((g) => g.items.filter((it) => !needle || it.node.title.toLowerCase().includes(needle) || it.node.code.toLowerCase().includes(needle)).length === 0) && (
            <p className="empty">No record matches “{q}”.</p>
          )}
        </div>
      )}

      {selectedNode && view === "atlas" && (
        <aside className="drawer" aria-label="Selected record">
          <div className="row between">
            <span className="label">{selectedNode.object_type.replace(/_/g, " ")}</span>
            <button className="icon-btn" aria-label="Close inspection" onClick={() => setSelected(null)}>
              <X size={16} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
          <h2>{selectedNode.title}</h2>
          <code className="drawer-code">{selectedNode.code}</code>
          <div className="row wrap" style={{ marginTop: 10 }}>
            {selectedTier && <span className="tag" style={{ borderColor: TIER_COLOR[selectedTier], color: TIER_COLOR[selectedTier] }}>{TIER_LABEL[selectedTier]}</span>}
            <span className="tag">{selectedMeta?.short ?? "cross-cutting"}</span>
            <span className="tag">
              <span className="num">{prerequisiteCount(state, selectedNode.id)}</span> prerequisites
            </span>
          </div>
          <a className="btn primary" href={`#/knowledge/${encodeURIComponent(selectedNode.code)}`} style={{ marginTop: 14 }}>
            Inspect Skill Detail
          </a>
          <button className="btn ghost" style={{ marginTop: 8 }} onClick={() => sceneRef.current?.travel(selectedNode.id)}>
            Fly There
          </button>
        </aside>
      )}

      {core && view === "atlas" && (
        <aside className="drawer core-card" aria-label="Galactic core inspection">
          <div className="row between">
            <span className="label">
              {core.kind === "blackhole"
                ? "supermassive black hole"
                : core.kind === "quasar"
                  ? "relativistic quasar"
                  : core.kind === "bottleneck"
                    ? "revision gravity well"
                    : core.kind}
            </span>
            <button className="icon-btn" aria-label="Close core inspection" onClick={() => setCore(null)}>
              <X size={16} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
          <h2>{core.kind === "blackhole" ? "Galactic Core Singularity" : core.name}</h2>
          {(core.kind === "quasar" || core.kind === "bottleneck") && core.detail && core.detail.length > 0 && (
            <ul className="core-bridges">
              {core.detail.slice(0, 6).map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          )}
          {core.kind === "quasar" && (
            <button className="btn primary" style={{ marginTop: 12 }} onClick={() => sceneRef.current?.focusCosmic(core.id)}>
              Warp Across Bridge
            </button>
          )}
          {core.kind === "bottleneck" && (
            <a className="btn primary" style={{ marginTop: 12 }} href="#/schedule">
              Start Revision Session
            </a>
          )}
          <code className="drawer-code">{core.id}</code>
          {core.kind === "blackhole" ? (
            <>
              <dl className="kv core-kv">
                <div><dt>Event horizon</dt><dd>{Math.round(core.radius)} u</dd></div>
                <div><dt>Photon ring</dt><dd className="core-photon">#FFF3D1</dd></div>
                <div><dt>Bottlenecks</dt><dd className="core-hot">{bottlenecks}</dd></div>
                <div><dt>Structural health</dt><dd>{health.toFixed(1)}%</dd></div>
              </dl>
              <div className="core-meter" role="img" aria-label={`Structural health ${health.toFixed(1)} percent`}>
                <span style={{ width: `${health}%` }} />
              </div>
              <p className="hint">
                {bottlenecks} record{bottlenecks === 1 ? "" : "s"} flagged <strong>needs revision</strong>. Resolving them raises structural health across the core.
              </p>
            </>
          ) : (
            <p className="hint">
              {core.kind === "galaxy"
                ? "A procedural barred spiral with a lensed core. Fly inside to orbit its singularity."
                : core.kind === "universe"
                  ? "A sealed universe in the multiverse box. Fly in to survey its galaxies."
                  : core.kind === "quasar"
                    ? "Twin relativistic jets mark a cross-discipline synthesis bridge. Every family listed here transfers into another domain."
                    : core.kind === "bottleneck"
                      ? "Flagged needs-revision records bend the local orbits into a gravity well until they are cleared."
                      : "An orbital station with lit docking bays, holding position for the Chunk 5 cockpit."}
            </p>
          )}
          {core.kind !== "quasar" && core.kind !== "bottleneck" && (
            <button className="btn primary" style={{ marginTop: 12 }} onClick={() => sceneRef.current?.focusCosmic(core.id)}>
              Fly There
            </button>
          )}
        </aside>
      )}

      {view === "atlas" && galaxy.stars.length > 0 && (
        <button className="btn sm atlas-reset" onClick={resetView} aria-label="Reset atlas view">
          <RotateCcw size={13} strokeWidth={1.6} aria-hidden="true" />
          {isolated !== null ? "All systems" : "Reset view"}
        </button>
      )}

      {view === "atlas" && galaxy.stars.length > 0 && (
        <div className="atlas-zoom" aria-label="Scale readout">
          <b>{scale.value}</b>
          <small>
            {scale.unit} ·{" "}
            {distance < 3 ? "hull" : distance < 90 ? "satellite belt" : distance < 900 ? "planetary" : distance < 14_000 ? "system" : distance < MULTIVERSE_REVEAL ? "galaxy field" : "multiverse"}
          </small>
        </div>
      )}

      {view === "atlas" && focus && (
        <div className="atlas-system" aria-live="polite">
          <span className="mono">{focus.code}</span>
          <strong>{DISCIPLINE_BY_ID[focus.code]?.name ?? "System"}</strong>
          <span className="num">
            {focus.planets.length} domains · {focus.constellations.length} constellations · {focus.moons.length + focus.planets.reduce((n, p) => n + p.moons.length, 0)} skills ·{" "}
            {focus.satellites.length + focus.planets.reduce((n, p) => n + p.moons.reduce((k, q) => k + q.satellites.length, 0), 0)} subskills
          </span>
          <button
            className="btn sm"
            aria-pressed={homeSystem === focus.code}
            onClick={() => {
              const next = homeSystem === focus.code ? null : focus.code;
              setHomeSystem(next);
              try {
                if (next) window.localStorage.setItem("athena.home.system", next);
                else window.localStorage.removeItem("athena.home.system");
              } catch {
                /* storage can be blocked; the choice then lasts for this session only */
              }
            }}
          >
            {homeSystem === focus.code ? "My Athena · locked" : "Make this my Athena"}
          </button>
        </div>
      )}

      <div className="atlas-legend" aria-label="Mastery encoding">
        <span><i style={{ borderColor: "#71819f", color: "#71819f" }} />unassessed</span>
        <span><i style={{ borderColor: "#ffc66d", color: "#ffc66d" }} />needs revision</span>
        <span><i style={{ borderColor: "#42e6c4", color: "#42e6c4" }} />demonstrated</span>
        <span><i style={{ borderColor: "#42e6c4", color: "#42e6c4", background: "#42e6c4" }} />mastered</span>
      </div>

      {controls && (
        <div className="atlas-controls" role="dialog" aria-label="Flight controls">
          <div className="row between">
            <strong>Flight controls</strong>
            <button className="icon-btn" aria-label="Close controls" onClick={() => setControls(false)}>
              <X size={14} strokeWidth={1.6} aria-hidden="true" />
            </button>
          </div>
          <ul>
            <li><b>Left thumb</b> invisible flight stick: push to thrust, slide to strafe</li>
            <li><b>Right drag</b> orbit 360° around the focal point</li>
            <li><b>Pinch / wheel</b> zoom, clamped to 1.45× the focused body</li>
            <li><b>Double-tap</b> dive into close orbit</li>
            <li><b>W A S D</b> thrust · <b>Q E</b> rise and fall · <b>Esc</b> reset</li>
            <li><b>Tap a body</b> warp there and inspect it</li>
          </ul>
        </div>
      )}

      {zen && (
        <button className="btn sm atlas-zen-exit" onClick={() => setZen(false)} aria-label="Leave Zen view">
          <X size={14} strokeWidth={1.6} aria-hidden="true" />
          Exit Zen
        </button>
      )}
    </section>
  );
}
