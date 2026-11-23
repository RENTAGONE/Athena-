import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import Dexie from "dexie";

/** Dexie 4 exposes liveQuery on the default export at runtime; the wrapper's d.ts omits the named one. */
const liveQuery = (
  Dexie as unknown as {
    liveQuery: <T>(querier: () => T | Promise<T>) => { subscribe(observer: { next: (value: T) => void; error?: () => void }): { unsubscribe(): void } };
  }
).liveQuery;
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

/** A saved coordinate: a knowledge record or a procedural universe, galaxy, core or station. */
type Waypoint = { id: string; name: string; kind: "node" | "cosmic" };

const WAYPOINT_KEY = "athena.atlas.pins";

function readWaypoints(): Waypoint[] {
  try {
    const raw = window.localStorage.getItem(WAYPOINT_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((p): p is Waypoint => Boolean(p) && typeof p.id === "string" && typeof p.name === "string" && (p.kind === "node" || p.kind === "cosmic"))
      .slice(0, 6);
  } catch {
    return [];
  }
}

/** Declared atlas scale: 1 AU is the 1,650-unit outer orbit. Nothing here is a learner metric. */
function scaleReadout(distance: number): { value: string; unit: string } {
  const au = distance / UNITS_PER_AU;
  if (au < 0.02) return { value: Math.round(au * 149_597_870).toLocaleString("en-US"), unit: "km" };
  if (au < 6000) return { value: au < 10 ? au.toFixed(2) : Math.round(au).toLocaleString("en-US"), unit: "AU" };
  return { value: (au / 63_241).toFixed(2), unit: "ly" };
}

export function Knowledge(): ReactNode {
  const { state, rt, refresh } = useApp();
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
  /** Mastery heatmap: real Dexie tiers painted across the galaxy. */
  const [heatmap, setHeatmap] = useState(false);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [pinsOpen, setPinsOpen] = useState(false);
  const [webgl, setWebgl] = useState(true);
  /** Progression hardlock: unverified systems stay behind sensor fog until evidence unlocks them. */
  const [hardlock, setHardlock] = useState(false);
  /** Sim & Visual Test Lab: preview visual states without touching Dexie. */
  const [labOpen, setLabOpen] = useState(false);
  const [labMastery, setLabMastery] = useState<number | null>(null);
  const [labPreview, setLabPreview] = useState<string | null>(null);
  const [satellite, setSatellite] = useState(0);
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
  const liveKey = useRef("");
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
    setWaypoints(readWaypoints());
  }, []);

  /** Every discipline star's real mastery tier, keyed both by code and by its discipline id. */
  const heat = useMemo(() => {
    const out = new Map<string, MasteryTier>();
    for (const star of galaxy.stars) {
      const tier = masteryTier(index, star.discipline.id);
      out.set(star.code, tier);
      out.set(star.discipline.id, tier);
    }
    return out;
  }, [galaxy, index]);

  /** Tier counts straight from the same Dexie-derived map that feeds the scene. */
  const heatCounts = useMemo(() => {
    const out: Record<MasteryTier, number> = { mastered: 0, demonstrated: 0, needs_revision: 0, unassessed: 0 };
    for (const star of galaxy.stars) out[masteryTier(index, star.discipline.id)] += 1;
    return out;
  }, [galaxy, index]);
  const [heatColors, setHeatColors] = useState("");

  useEffect(() => {
    const apply = (): void => {
      const scene = sceneRef.current;
      scene?.setHeat(heat);
      setHeatColors(scene?.heatColors() ?? "");
    };
    apply();
    const t = window.setTimeout(apply, 80);
    return () => window.clearTimeout(t);
  }, [heat, galaxy]);

  /** Deep-link/automation hook: select a record by id without hunting for its star. */
  useEffect(() => {
    const onInspect = (event: Event): void => {
      const id = (event as CustomEvent<{ id?: string }>).detail?.id;
      if (typeof id !== "string") return;
      setCore(null);
      setSelected(id);
    };
    window.addEventListener("athena:inspect", onInspect);
    return () => window.removeEventListener("athena:inspect", onInspect);
  }, []);

  useEffect(() => {
    sceneRef.current?.setHeatmap(heatmap);
  }, [heatmap]);

  useEffect(() => {
    sceneRef.current?.setProgressionLocked(hardlock);
  }, [hardlock]);

  useEffect(() => {
    sceneRef.current?.previewMastery(labMastery);
  }, [labMastery]);

  /** Test Lab transport: build a phenomenon in front of the camera. Nothing is written to Dexie. */
  const preview = useCallback((kind: "blackhole" | "quasar" | "wormhole" | "binary" | "gas_giant" | "lava" | "pulsar" | "station" | "satellite") => {
    setLabPreview(kind);
    sceneRef.current?.spawnShowcase(kind, satellite);
  }, [satellite]);

  const stepSatellite = useCallback((dir: number) => {
    const next = sceneRef.current?.cycleSatellite(dir) ?? satellite;
    setSatellite(next);
    setLabPreview("satellite");
  }, [satellite]);

  const resetLab = useCallback(() => {
    sceneRef.current?.exitShowcase();
    sceneRef.current?.previewMastery(null);
    setLabMastery(null);
    setLabPreview(null);
  }, []);

  const saveWaypoints = useCallback((next: Waypoint[]) => {
    setWaypoints(next);
    try {
      window.localStorage.setItem(WAYPOINT_KEY, JSON.stringify(next));
    } catch {
      /* storage can be blocked; the pins then last for this session only */
    }
  }, []);

  const pin = useCallback(
    (point: Waypoint) => {
      setWaypoints((current) => {
        const next = [point, ...current.filter((p) => p.id !== point.id)].slice(0, 6);
        try {
          window.localStorage.setItem(WAYPOINT_KEY, JSON.stringify(next));
        } catch {
          /* session-only fallback */
        }
        return next;
      });
      setPinsOpen(true);
    },
    [],
  );

  const goTo = useCallback((point: Waypoint) => {
    setPinsOpen(false);
    if (point.kind === "cosmic") {
      sceneRef.current?.focusCosmic(point.id);
      return;
    }
    setSelected(point.id);
    sceneRef.current?.travel(point.id);
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

  /**
   * Dexie live subscription. A KB .zip import, a JSON pack, captured evidence or a rogue-star
   * assignment commits a delta; liveQuery observes the store and reloads it, which rebuilds the
   * galaxy and repopulates stars, planets, constellations, moons and satellites without a reload.
   */
  useEffect(() => {
    if (!rt) return;
    const db = rt.store.db;
    const sub = liveQuery(async () => {
      const [nodes, edges, evidenceCount, changesets] = await Promise.all([db.nodes.count(), db.edges.count(), db.evidence.count(), db.changesets.count()]);
      return `${nodes}:${edges}:${evidenceCount}:${changesets}:${db.meta ? "1" : "0"}`;
    }).subscribe({
      next: (key: string) => {
        const first = liveKey.current === "";
        if (liveKey.current === key) return;
        liveKey.current = key;
        if (!first) void refresh();
      },
      error: () => undefined,
    });
    return () => sub.unsubscribe();
  }, [rt, refresh]);

  /** Assign a discipline to a rogue star: persist the node, then the live query re-anchors it. */
  const assignDiscipline = useCallback(
    async (id: string, code: string): Promise<void> => {
      if (!rt || !code) return;
      const node = state.nodes[id];
      if (!node) return;
      try {
        await rt.store.persist({
          expectedRevision: state.meta.revision,
          puts: [{ table: "nodes", key: id, record: { ...node, owner_discipline_id: code, updated_at: new Date().toISOString() } }],
        });
        await refresh();
        // Let the live rebuild place the star, then draw its violet→cyan anchoring tether.
        window.setTimeout(() => sceneRef.current?.anchorFlash(id), 220);
        navigator.vibrate?.(8);
      } catch {
        /* a concurrent write bumps the revision; the live subscription will reload the winner */
      }
    },
    [rt, state.nodes, state.meta.revision, refresh],
  );

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
      data-heatmap={heatmap ? "true" : "false"}
      data-heat={`${heatCounts.mastered}/${heatCounts.demonstrated}/${heatCounts.needs_revision}/${heatCounts.unassessed}`}
      data-heat-colors={heatColors}
      data-progression={hardlock ? "locked" : "explorer"}
      data-lab={labOpen ? "open" : "closed"}
      data-lab-preview={labPreview ?? ""}
      data-mastery={labMastery === null ? "live" : labMastery.toFixed(2)}
      data-satellite={String(satellite)}
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
          {view === "atlas" && (
            <button
              className="btn sm ghost"
              aria-label={hardlock ? "Progression locked" : "Progression explorer"}
              aria-pressed={hardlock}
              title={hardlock ? "Unverified systems are fogged until evidence unlocks them" : "Free explorer: inspect everything"}
              onClick={() => setHardlock((on) => !on)}
            >
              <span className="lock-dot" aria-hidden="true" />
              <span>{hardlock ? "Locked" : "Explorer"}</span>
            </button>
          )}
          {view === "atlas" && (
            <button
              className="btn sm ghost"
              aria-label="Sim and Visual Test Lab"
              aria-expanded={labOpen}
              aria-pressed={labOpen}
              onClick={() => setLabOpen((open) => !open)}
            >
              <span aria-hidden="true">⌬</span>
              <span>Test Lab</span>
            </button>
          )}
          {view === "atlas" && (
            <button
              className="btn sm ghost"
              aria-label="Mastery heatmap"
              aria-pressed={heatmap}
              onClick={() => setHeatmap((on) => !on)}
            >
              <span className="heat-dot" aria-hidden="true" />
              <span>Heatmap</span>
            </button>
          )}
          {view === "atlas" && (
            <button
              className="btn sm ghost"
              aria-label="Pinned coordinates"
              aria-expanded={pinsOpen}
              onClick={() => setPinsOpen((open) => !open)}
            >
              <span aria-hidden="true">◈</span>
              <span>Waypoints</span>
              {waypoints.length > 0 && <span className="num">{waypoints.length}</span>}
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
          <button
            className="btn ghost pin-btn"
            onClick={() => pin({ id: selectedNode.id, name: selectedNode.title, kind: "node" })}
          >
            ◈ {waypoints.some((p) => p.id === selectedNode.id) ? "Pinned" : "Pin Location"}
          </button>
          {!selectedNode.owner_discipline_id && (
            <label className="assign-discipline">
              <span className="label">
                <span className="rogue-dot" aria-hidden="true" /> Rogue wanderer · unassigned
              </span>
              <select
                aria-label={`Assign a discipline to ${selectedNode.title}`}
                value=""
                onChange={(e: { target: HTMLSelectElement }) => void assignDiscipline(selectedNode.id, e.target.value)}
              >
                <option value="">Assign Discipline…</option>
                {DISCIPLINES.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </label>
          )}
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
          <button className="btn ghost pin-btn" onClick={() => pin({ id: core.id, name: core.name, kind: "cosmic" })}>
            ◈ {waypoints.some((p) => p.id === core.id) ? "Pinned" : "Pin Location"}
          </button>
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

      {pinsOpen && view === "atlas" && (
        <div className="waypoints" role="dialog" aria-label="Pinned coordinates">
          <div className="row between">
            <strong>Pinned coordinates</strong>
            <button className="icon-btn" aria-label="Close pinned coordinates" onClick={() => setPinsOpen(false)}>
              <X size={14} strokeWidth={1.6} aria-hidden="true" />
            </button>
          </div>
          {waypoints.length === 0 ? (
            <p className="hint">Open any record, star, galaxy or singularity and choose <strong>Pin Location</strong> to save it here.</p>
          ) : (
            <ul>
              {waypoints.map((point) => (
                <li key={point.id}>
                  <button className="waypoint" onClick={() => goTo(point)} title={`Return to ${point.name}`}>
                    <span aria-hidden="true">{point.kind === "cosmic" ? "✧" : "◆"}</span>
                    <span className="name">{point.name}</span>
                  </button>
                  <button
                    className="icon-btn"
                    aria-label={`Remove ${point.name}`}
                    onClick={() => saveWaypoints(waypoints.filter((p) => p.id !== point.id))}
                  >
                    <X size={12} strokeWidth={1.6} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="hint">Up to 6 coordinates · saved on this device</p>
        </div>
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

      {labOpen && view === "atlas" && (
        <div className="test-lab" role="dialog" aria-label="Sim and Visual Test Lab">
          <div className="row between">
            <strong>Sim &amp; Visual Test Lab</strong>
            <button className="icon-btn" aria-label="Close Test Lab" onClick={() => setLabOpen(false)}>
              <X size={14} strokeWidth={1.6} aria-hidden="true" />
            </button>
          </div>
          <p className="hint">Preview visual states in 3D. Nothing here is written to Dexie.</p>
          <label className="lab-slider">
            <span className="row between">
              <span className="label">Mastery city lights</span>
              <output>{labMastery === null ? "live Dexie" : `${Math.round(labMastery * 100)}%`}</output>
            </span>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              aria-label="Mastery city lights and megastructures override"
              value={labMastery === null ? 100 : Math.round(labMastery * 100)}
              onChange={(e: { target: HTMLInputElement }) => setLabMastery(Number(e.target.value) / 100)}
            />
            <span className="lab-scale" aria-hidden="true"><i>0% dark</i><i>50% regional</i><i>100% orbital ring</i></span>
          </label>
          <div className="lab-grid" role="group" aria-label="Spawn phenomena">
            <button className="btn sm" aria-pressed={labPreview === "blackhole"} onClick={() => preview("blackhole")}>Black Hole</button>
            <button className="btn sm" aria-pressed={labPreview === "quasar"} onClick={() => preview("quasar")}>Quasar</button>
            <button className="btn sm" aria-pressed={labPreview === "wormhole"} onClick={() => preview("wormhole")}>Wormhole</button>
            <button className="btn sm" aria-pressed={labPreview === "binary"} onClick={() => preview("binary")}>Binary Star</button>
            <button className="btn sm" aria-pressed={labPreview === "gas_giant"} onClick={() => preview("gas_giant")}>Ringed Gas Giant</button>
            <button className="btn sm" aria-pressed={labPreview === "lava"} onClick={() => preview("lava")}>Lava World</button>
            <button className="btn sm" aria-pressed={labPreview === "pulsar"} onClick={() => preview("pulsar")}>Pulsar</button>
          </div>
          <div className="lab-row">
            <span className="label">Satellite gallery · <span className="num">{satellite + 1}/180</span></span>
            <div className="row">
              <button className="btn sm ghost" aria-label="Previous satellite" onClick={() => stepSatellite(-1)}>‹ Prev</button>
              <button className="btn sm ghost" aria-label="Next satellite" onClick={() => stepSatellite(1)}>Next ›</button>
            </div>
          </div>
          <div className="lab-row">
            <button className="btn sm" aria-pressed={labPreview === "station"} onClick={() => { setLabPreview("station"); sceneRef.current?.enterStationInterior(); }}>
              Station Interior
            </button>
            <button className="btn sm ghost" aria-label="Reset to live Dexie" onClick={resetLab}>
              Reset to Live Dexie
            </button>
          </div>
        </div>
      )}

      {controls && (
        <div className="atlas-controls" role="dialog" aria-label="Flight controls">
          <div className="row between">
            <strong>Flight controls</strong>
            <button className="icon-btn" aria-label="Close controls" onClick={() => setControls(false)}>
              <X size={14} strokeWidth={1.6} aria-hidden="true" />
            </button>
          </div>
          <ul>
            <li><b>Left thumb</b> invisible flight stick (28 px from the edge, clear of Android Back): push to thrust, slide to strafe, lift to stop</li>
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
