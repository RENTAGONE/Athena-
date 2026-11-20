import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Pause, Play, RotateCcw, Search, X } from "lucide-react";
import { useApp } from "./context.ts";
import { DISCIPLINES, DISCIPLINE_BY_ID } from "./disciplines.ts";
import {
  buildGalaxy,
  evidenceIndex,
  indexGroups,
  masteryTier,
  partitionEdges,
  prerequisiteCount,
  type Galaxy,
  type GalaxyMoon,
  type GalaxyPlanet,
  type MasteryTier,
} from "../app/selectors.ts";
import {
  FOCAL,
  GALAXY_RADIUS,
  bezierControl,
  distanceToPolyline,
  easeOutCubic,
  goldenStarPositions,
  hash01,
  makeCamera,
  masteryRing,
  mixCamera,
  orbitPoint,
  phaseAt,
  project,
  quadraticPoint,
  reentryJitter,
  wrapPoint,
  type Camera,
  type ScreenPoint,
  type Vec3,
} from "../app/atlas-graph.ts";
import type { NodeRecord } from "../domain/types.ts";
import { getPrefs } from "./prefs.ts";
import { createSky, drawSky } from "./sky.ts";

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

interface Body {
  node: NodeRecord;
  kind: "star" | "planet" | "moon";
  star: number;
  x: number;
  y: number;
  r: number;
  depth: number;
}

interface ThreadHit {
  id: string;
  star: number;
  title: string;
  code: string;
  relation: string;
  sourceTitle: string;
  sourceCode: string;
  targetTitle: string;
  points: ScreenPoint[];
  mid: Vec3;
  sourceId: string;
  targetId: string;
}

interface Scene {
  galaxy: Galaxy;
  starsWorld: Vec3[];
  /** node id → where it is in the galaxy. */
  location: Map<string, { star: number; planet: number | null; moon: number | null }>;
}

export function Knowledge(): ReactNode {
  const { state } = useApp();
  const index = useMemo(() => evidenceIndex(state), [state]);
  const galaxy = useMemo(() => buildGalaxy(state, index), [state, index]);
  const edges = useMemo(() => partitionEdges(state), [state]);
  const groups = useMemo(() => indexGroups(state, index), [state, index]);
  const starsWorld = useMemo(() => goldenStarPositions(galaxy.stars.length), [galaxy.stars.length]);

  // Constellation web: every star is linked to its two nearest neighbours, so the galaxy reads as
  // structure at a glance instead of a cloud of unconnected dots. Recomputed only when the systems do.
  const constellation = useMemo(() => {
    const links: [Vec3, Vec3][] = [];
    for (let i = 0; i < starsWorld.length; i += 1) {
      const a = starsWorld[i];
      if (!a) continue;
      const near: { j: number; d: number }[] = [];
      for (let j = 0; j < starsWorld.length; j += 1) {
        const b = starsWorld[j];
        if (!b || j === i) continue;
        near.push({ j, d: Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z) });
      }
      near.sort((p, q) => p.d - q.d);
      for (const n of near.slice(0, 2)) {
        if (n.j <= i) continue;
        const b = starsWorld[n.j];
        if (b) links.push([a, b]);
      }
    }
    return links;
  }, [starsWorld]);

  const [view, setView] = useState<"atlas" | "index">("atlas");
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
  const [playing, setPlaying] = useState(() => {
    const p = getPrefs();
    return p.motion && p.atlasOrbit;
  });
  const [zoom, setZoom] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const [isolated, setIsolated] = useState<number | null>(null);
  const [confirm, setConfirm] = useState<{ star: number; title: string; code: string; relation: string; sourceTitle: string; sourceCode: string; targetTitle: string } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<Scene>({ galaxy, starsWorld, location: galaxy.location });
  const edgesRef = useRef(edges);
  const cameraRef = useRef<Camera>(makeCamera({ distance: 1120 }));
  const flightRef = useRef<{ from: Camera; to: Camera; start: number; dur: number; isolate: number | null } | null>(null);
  const isolatedRef = useRef<number | null>(null);
  const selectedRef = useRef<string | null>(null);
  const playingRef = useRef(playing);
  const filterRef = useRef<string | null>(filter);
  const matchedRef = useRef<Set<string> | null>(null);
  const bodiesRef = useRef<Body[]>([]);
  const linksRef = useRef<[Vec3, Vec3][]>(constellation);
  const threadsRef = useRef<ThreadHit[]>([]);
  const hoverRef = useRef<{ body: string | null; thread: string | null }>({ body: null, thread: null });
  const pointerRef = useRef<{ x: number; y: number; inside: boolean }>({ x: 0, y: 0, inside: false });
  const frameDistanceRef = useRef(1120);
  const clockRef = useRef(0);
  const dirtyRef = useRef(true);
  const reduceRef = useRef(false);

  // The camera moves in the animation loop, so the readout samples it instead of re-rendering React
  // on every frame.
  useEffect(() => {
    const id = window.setInterval(() => {
      const z = frameDistanceRef.current / Math.max(1, cameraRef.current.distance);
      setZoom((prev) => (Math.abs(prev - z) > 0.02 ? z : prev));
    }, 180);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    sceneRef.current = { galaxy, starsWorld, location: galaxy.location };
    edgesRef.current = edges;
    linksRef.current = constellation;
    dirtyRef.current = true;
  }, [galaxy, starsWorld, edges, constellation]);

  useEffect(() => {
    selectedRef.current = selected;
    dirtyRef.current = true;
    if (!selected) return;
    const loc = galaxy.location.get(selected);
    if (loc) {
      setIsolated(loc.star);
      isolatedRef.current = loc.star;
    }
  }, [selected, galaxy]);

  useEffect(() => {
    isolatedRef.current = isolated;
    dirtyRef.current = true;
  }, [isolated]);

  useEffect(() => {
    playingRef.current = playing;
    dirtyRef.current = true;
  }, [playing]);

  useEffect(() => {
    filterRef.current = filter;
    dirtyRef.current = true;
  }, [filter]);

  const matched = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return null;
    const set = new Set<string>();
    for (const g of groups) {
      for (const it of g.items) {
        if (it.node.title.toLowerCase().includes(needle) || it.node.code.toLowerCase().includes(needle)) set.add(it.node.id);
      }
      if (g.discipline && g.discipline.toLowerCase().includes(needle)) for (const it of g.items) set.add(it.node.id);
    }
    for (const s of galaxy.stars) if (s.discipline.title.toLowerCase().includes(needle) || s.code.toLowerCase().includes(needle)) set.add(s.discipline.id);
    return set;
  }, [q, groups, galaxy.stars]);

  useEffect(() => {
    matchedRef.current = matched;
    dirtyRef.current = true;
  }, [matched]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = (): void => {
      reduceRef.current = mq.matches;
      if (mq.matches) setPlaying(false);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const flyToStar = useCallback(
    (starIdx: number, dur: number): void => {
      const target = starsWorld[starIdx];
      if (!target) return;
      const to = makeCamera({ targetX: target.x, targetY: target.y, targetZ: target.z, yaw: 0.55, pitch: 0.5, distance: 140 });
      flightRef.current = { from: { ...cameraRef.current }, to, start: performance.now(), dur, isolate: starIdx };
    },
    [starsWorld],
  );

  /** Fly back to the framed galaxy and release any isolation. Double-click, Escape and the reset control share this. */
  const resetView = useCallback((): void => {
    const cam = cameraRef.current;
    const to = makeCamera({ targetX: 0, targetY: 0, targetZ: 0, yaw: cam.yaw, pitch: cam.pitch, distance: frameDistanceRef.current });
    flightRef.current = { from: { ...cam }, to, start: performance.now(), dur: 620, isolate: null };
    setIsolated(null);
    setSelected(null);
    setConfirm(null);
  }, []);

  /* ── Rendering loop ───────────────────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let last = performance.now();
    let width = 0;
    let height = 0;
    let dpr = 1;

    let framedLayout: boolean | null = null;
    const resize = (): void => {
      const rect = canvas.getBoundingClientRect();
      const isNarrow = rect.width < 700;
      // Re-frame on mount and whenever the layout switches between phone and desktop widths; a later
      // manual zoom or pan is left alone.
      if (rect.width > 0 && framedLayout !== isNarrow) {
        framedLayout = isNarrow;
        // Frame the whole galaxy (stars plus their planet clouds) inside the smaller viewport axis.
        const span = Math.min(rect.width, rect.height);
        // Stars sit on a 440-unit sphere and their planet clouds add ~160 units, so frame the outer extent.
        if (span > 0) {
          cameraRef.current.distance = Math.min(1620, Math.max(700, ((GALAXY_RADIUS + 160) * FOCAL) / (0.4 * span)));
          frameDistanceRef.current = cameraRef.current.distance;
        }
      }
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dirtyRef.current = true;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const sky = createSky();
    const shootStart = 3_000 + hash01(9, 9) * 4_000;

    const draw = (now: number): void => {
      const scene = sceneRef.current;
      if (scene.galaxy.stars.length === 0) {
        ctx.fillStyle = "#070b18";
        ctx.fillRect(0, 0, width, height);
        return;
      }
      const cam = cameraRef.current;
      const iso = isolatedRef.current;
      const sel = selectedRef.current;
      const flt = filterRef.current;
      const hits = matchedRef.current;
      const hover = hoverRef.current;
      const t = clockRef.current;
      ctx.clearRect(0, 0, width, height);

      // Layer 0 — void with a subtle deep-space falloff.
      ctx.fillStyle = "#070b18";
      ctx.fillRect(0, 0, width, height);
      const grad = ctx.createRadialGradient(width * 0.5, height * 0.46, 0, width * 0.5, height * 0.46, Math.max(width, height) * 0.7);
      grad.addColorStop(0, "rgba(11,18,36,0.95)");
      grad.addColorStop(1, "rgba(7,11,24,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // The deep sky: a real star sphere, a galactic band and dust clouds that turn with the camera,
      // so the background is 3D structure rather than a fixed wallpaper.
      drawSky(ctx, sky, cam, width, height, t, reduceRef.current);

      // Constellation web: faint links between neighbouring systems, only in the far view where the
      // whole galaxy is on screen.
      if (iso === null && cam.distance > 700) {
        const fade = Math.min(0.15, (cam.distance - 700) / 2600);
        ctx.save();
        ctx.strokeStyle = `rgba(96,138,220,${fade})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (const [a, b] of linksRef.current) {
          const pa = project(reentryJitter(wrapPoint(a, cam), a), cam, width, height);
          const pb = project(reentryJitter(wrapPoint(b, cam), b), cam, width, height);
          if (!pa || !pb) continue;
          ctx.moveTo(pa.sx, pa.sy);
          ctx.lineTo(pb.sx, pb.sy);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Sparse shooting star, silenced when the viewer asks for reduced motion.
      if (!reduceRef.current) {
        const cycle = 13_500;
        const age = ((now - shootStart) % cycle + cycle) % cycle;
        if (age < 1100) {
          const p = age / 1100;
          const x0 = width * 0.72 - p * width * 0.5;
          const y0 = height * 0.16 + p * height * 0.34;
          const g = ctx.createLinearGradient(x0, y0, x0 + 150, y0 - 105);
          const tint = Math.round(hash01(Math.floor((now - shootStart) / cycle), 5) * 2) === 0 ? "#35d9ff" : "#a78bfa";
          g.addColorStop(0, "rgba(53,217,255,0)");
          g.addColorStop(0.55, tint);
          g.addColorStop(1, "rgba(53,217,255,0)");
          ctx.strokeStyle = g;
          ctx.globalAlpha = Math.sin(p * Math.PI) * 0.75;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x0 + 150, y0 - 105);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      // Bodies
      const bodies: Body[] = [];
      const nodePos = new Map<string, { p: Vec3; x: number; y: number; r: number; tier: MasteryTier; kind: Body["kind"]; node: NodeRecord; star: number }>();
      const starScreen: { x: number; y: number; scale: number }[] = [];

      scene.galaxy.stars.forEach((system, si) => {
        const base = scene.starsWorld[si];
        if (!base) return;
        const world = iso === si ? base : reentryJitter(wrapPoint(base, cam), base);
        const proj = project(world, cam, width, height);
        const dimSystem = (iso !== null && iso !== si) || (flt !== null && flt !== system.code);
        if (!proj) {
          starScreen.push({ x: -1e4, y: -1e4, scale: 0 });
          return;
        }
        starScreen.push({ x: proj.sx, y: proj.sy, scale: proj.scale });
        // Screen size and depth of the star, so bodies behind its face can be occluded at close range.
        const starRNow = Math.max(5.2, Math.min(Math.max(140, Math.min(width, height) * 0.46), 38 * proj.scale));
        const starDepth = proj.depth;
        const meta = DISCIPLINE_BY_ID[system.code];
        const dim = dimSystem ? (iso !== null ? 0.05 : 0.12) : 1;
        const visible = proj.sx > -160 && proj.sx < width + 160 && proj.sy > -160 && proj.sy < height + 160;

        if (visible) {
          const color = meta?.color ?? "#648bff";
          const hovered = hover.body === system.discipline.id;
          // At close range the body keeps growing until it fills the viewport, so a wheel inside a
          // system ends on a surface rather than on a small disc.
          const maxR = Math.max(140, Math.min(width, height) * 0.46);
          const r = Math.max(5.2, Math.min(maxR, 38 * proj.scale)) * (hovered ? 1.14 : 1);

          // Wide halo, then two tilted orbit rings, then the lit core.
          const haloR = Math.min(r * 6.6, r + 320);
          const halo = ctx.createRadialGradient(proj.sx, proj.sy, r * 0.4, proj.sx, proj.sy, haloR);
          halo.addColorStop(0, rgba(color, 0.34 * dim));
          halo.addColorStop(0.4, rgba(color, 0.12 * dim));
          halo.addColorStop(1, "rgba(5,8,15,0)");
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(proj.sx, proj.sy, haloR, 0, Math.PI * 2);
          ctx.fill();

          ctx.save();
          // Close to a star, its own orbit rings would sweep across the photosphere; they belong to
          // the far view, so they thin out at surface range.
          ctx.globalAlpha = dim * (cam.distance < 620 ? 0.1 : 0.55);
          ctx.strokeStyle = rgba(color, 0.55);
          ctx.lineWidth = Math.max(0.6, Math.min(2.4, r * 0.03));
          for (const k of [1.6, 2.2]) {
            ctx.beginPath();
            ctx.ellipse(proj.sx, proj.sy, r * k, r * k * 0.4, si * 0.5 - 0.3, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.restore();

          const core = ctx.createRadialGradient(proj.sx - r * 0.3, proj.sy - r * 0.34, r * 0.1, proj.sx, proj.sy, r * 1.02);
          // A star is white-hot at the core with its discipline colour in the corona and limb, so it
          // reads as a star rather than as a coloured planet.
          core.addColorStop(0, "rgba(255,255,255,1)");
          core.addColorStop(0.3, rgba(mix(color, "#ffffff", 0.82), 1));
          core.addColorStop(0.62, rgba(mix(color, "#ffffff", 0.45), 1));
          core.addColorStop(0.88, rgba(mix(color, "#0b1020", 0.5), 1));
          core.addColorStop(1, "rgba(4,7,14,1)");
          ctx.globalAlpha = dim;
          ctx.beginPath();
          ctx.arc(proj.sx, proj.sy, r, 0, Math.PI * 2);
          ctx.fillStyle = core;
          ctx.fill();
          ctx.lineWidth = Math.max(0.8, Math.min(2.6, r * 0.045));
          ctx.strokeStyle = "rgba(241,245,255,0.45)";
          ctx.stroke();

          // Inner plate and monogram: a lit badge, not a flat dot. Suppressed once the body is a
          // surface, where a giant monogram would cover the star itself.
          if (r >= 9 && r < 46) {
            ctx.save();
            ctx.globalAlpha = dim;
            ctx.beginPath();
            ctx.arc(proj.sx, proj.sy, r * 0.66, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(5,8,16,0.88)";
            ctx.fill();
            ctx.strokeStyle = rgba(color, 0.85);
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.fillStyle = "#eef5ff";
            ctx.font = `700 ${Math.round(r * 0.6)}px "JetBrains Mono", ui-monospace, monospace`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText((meta?.short ?? "?").slice(0, 2).toUpperCase(), proj.sx, proj.sy + r * 0.03);
            ctx.restore();
          }

          drawStarDetail(ctx, proj.sx, proj.sy, r, color, surfaceSeed(system.code), clockRef.current, dim, hovered);

          // Some systems are binaries: a smaller companion with its own temperature, orbiting the
          // primary. Seeded per system, so the same discipline always has the same companion.
          const companion = hash01(si, 77);
          if (companion > 0.6 && r > 5) {
            const ang = si * 2.1 + clockRef.current * 0.18;
            const dist = r * (2.4 + companion * 0.7);
            const bx = proj.sx + Math.cos(ang) * dist;
            const by = proj.sy + Math.sin(ang) * dist * 0.52;
            const br = Math.max(1.4, r * (0.14 + companion * 0.1));
            const bTint = companion > 0.86 ? "#ffd6a0" : companion > 0.74 ? "#cfe4ff" : "#9fd4ff";
            const bglow = ctx.createRadialGradient(bx, by, 0, bx, by, br * 6);
            bglow.addColorStop(0, rgba(bTint, 0.85 * dim));
            bglow.addColorStop(0.22, rgba(bTint, 0.3 * dim));
            bglow.addColorStop(1, rgba(bTint, 0));
            ctx.fillStyle = bglow;
            ctx.beginPath();
            ctx.arc(bx, by, br * 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#ffffff";
            ctx.globalAlpha = dim * 0.9;
            ctx.beginPath();
            ctx.arc(bx, by, br, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
          }

          if (sel === system.discipline.id || hovered) {
            ctx.beginPath();
            ctx.arc(proj.sx, proj.sy, r + 7, 0, Math.PI * 2);
            ctx.strokeStyle = hovered ? "#ffffff" : "#35d9ff";
            ctx.lineWidth = 1.6;
            ctx.globalAlpha = dim * (hovered ? 0.95 : 0.7);
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
          bodies.push({ node: system.discipline, kind: "star", star: si, x: proj.sx, y: proj.sy, r: r + 10, depth: proj.depth });
          nodePos.set(system.discipline.id, { p: world, x: proj.sx, y: proj.sy, r, tier: "unassessed", kind: "star", node: system.discipline, star: si });
        }

        // Planets and their moons stay in motion even while a system is isolated.
        if (iso !== null && iso !== si) return;

        // Cluster: a few concentric bands, planets spaced evenly around their band. Structure first,
        // motion second — a system reads as one object instead of loose dots.
        const count = system.planets.length;
        const bands = Math.max(1, Math.min(4, Math.ceil(count / 6)));
        const perBand = Math.max(1, Math.ceil(count / bands));
        const bandRadius = (b: number): number => 74 + b * (32 + Math.min(10, count * 0.6));
        const cloudR = bandRadius(bands - 1) + 26;
        if (count > 0 && (iso === si || cam.distance < 1600)) {
          const sysColor = meta?.color ?? "#648bff";
          const cloud = ctx.createRadialGradient(proj.sx, proj.sy, 6, proj.sx, proj.sy, (cloudR * FOCAL) / Math.max(1, cam.distance) * 0.55 + 40);
          cloud.addColorStop(0, rgba(sysColor, 0.09 * dim));
          cloud.addColorStop(0.7, rgba(sysColor, 0.03 * dim));
          cloud.addColorStop(1, "rgba(5,8,15,0)");
          ctx.fillStyle = cloud;
          ctx.beginPath();
          ctx.arc(proj.sx, proj.sy, (cloudR * FOCAL) / Math.max(1, cam.distance) * 0.55 + 40, 0, Math.PI * 2);
          ctx.fill();
          // Inside a system the bands would cut straight across the star's face and read as glass;
          // they are a far-view structure, so they fade out at surface range.
          if (cam.distance >= 620) {
            ctx.save();
            ctx.strokeStyle = rgba(sysColor, 0.2 * dim);
            ctx.lineWidth = 1;
            for (let b = 0; b < bands; b += 1) {
              const br = bandRadius(b);
              let broken = false;
              ctx.beginPath();
              for (let k = 0; k <= 44; k += 1) {
                const rp = project(orbitPoint(world, br, br * 0.72, si * 0.03, si * 0.6, (k / 44) * Math.PI * 2), cam, width, height);
                if (!rp) {
                  broken = true;
                  break;
                }
                if (k === 0) ctx.moveTo(rp.sx, rp.sy);
                else ctx.lineTo(rp.sx, rp.sy);
              }
              if (!broken) ctx.stroke();
            }
            ctx.restore();
          }
          // Heliosphere: the bow shock where the system's wind meets the void.
          const helio = ((cloudR * FOCAL) / Math.max(1, cam.distance)) * 0.62;
          if (helio > 26) {
            ctx.save();
            ctx.strokeStyle = rgba(sysColor, 0.1 * dim);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(proj.sx, proj.sy, helio * 1.14, helio * 0.36, si * 0.6 - 0.3, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }
          // Debris belt: fine dust on the outermost band, so a system has an edge instead of a fade.
          if (cam.distance < 1100) {
            const beltR = bandRadius(bands - 1) + 18;
            const debris = 22 + Math.min(58, Math.round(count * 0.6));
            ctx.fillStyle = rgba(mix(sysColor, "#ffffff", 0.55), 1);
            for (let d = 0; d < debris; d += 1) {
              const ang = (d / debris) * Math.PI * 2 + hash01(si, d) * 0.09;
              const rad = beltR + (hash01(d, si + 3) - 0.5) * 18;
              const bp = project(orbitPoint(world, rad, rad * 0.72, si * 0.02 - 0.08, si * 0.6, ang), cam, width, height);
              if (!bp) continue;
              if (bp.sx < 0 || bp.sx > width || bp.sy < 0 || bp.sy > height) continue;
              ctx.globalAlpha = dim * (0.1 + hash01(d, si + 9) * 0.3);
              ctx.fillRect(bp.sx, bp.sy, 1.3, 1.3);
            }
            ctx.globalAlpha = 1;
          }
          // A long-period comet on a steep orbit: a bright nucleus and an ion tail trailing away.
          const cometR = bandRadius(bands - 1) + 42;
          const cTheta = si * 1.37 + t * 0.14;
          const cOrbit = (th: number) => project(orbitPoint(world, cometR, cometR * 0.46, 0.62 + si * 0.04, si * 0.6 + 0.4, th), cam, width, height);
          const head = cOrbit(cTheta);
          if (head && head.sx > -40 && head.sx < width + 40 && head.sy > -40 && head.sy < height + 40) {
            const tailEnd = cOrbit(cTheta - 0.22);
            if (tailEnd) {
              const tail = ctx.createLinearGradient(head.sx, head.sy, tailEnd.sx, tailEnd.sy);
              tail.addColorStop(0, `rgba(214,238,255,${0.5 * dim})`);
              tail.addColorStop(0.35, `rgba(150,200,255,${0.16 * dim})`);
              tail.addColorStop(1, "rgba(120,170,255,0)");
              ctx.strokeStyle = tail;
              ctx.lineWidth = Math.max(1.4, Math.min(5, 90 / Math.max(1, head.depth)));
              ctx.lineCap = "round";
              ctx.beginPath();
              ctx.moveTo(head.sx, head.sy);
              ctx.lineTo(tailEnd.sx, tailEnd.sy);
              ctx.stroke();
              ctx.lineCap = "butt";
            }
            const coma = ctx.createRadialGradient(head.sx, head.sy, 0, head.sx, head.sy, 5);
            coma.addColorStop(0, `rgba(255,255,255,${0.9 * dim})`);
            coma.addColorStop(1, "rgba(150,200,255,0)");
            ctx.fillStyle = coma;
            ctx.beginPath();
            ctx.arc(head.sx, head.sy, 5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        system.planets.forEach((planet: GalaxyPlanet, pi: number) => {
          const band = Math.min(bands - 1, Math.floor(pi / perBand));
          const slot = pi % perBand;
          const inBand = Math.min(perBand, count - band * perBand);
          const rx = bandRadius(band);
          const rz = rx * 0.72;
          const tilt = ((band % 3) - 1) * 0.12 + si * 0.02;
          const orbitYaw = si * 0.6 + band * 0.4;
          const omega = 0.04 + band * 0.012;
          const theta = (slot / Math.max(1, inBand)) * Math.PI * 2 + phaseAt(pi * 0.7, omega, t);
          const p = orbitPoint(world, rx, rz, tilt, orbitYaw, theta);
          const pp = project(p, cam, width, height);
          if (!pp) return;
          const inView = pp.sx > -80 && pp.sx < width + 80 && pp.sy > -80 && pp.sy < height + 80;
          if (!inView) return;
          // Inside a system up close, a planet on the far side of the star is hidden by its face.
          if (cam.distance < 620 && pp.depth > starDepth && Math.hypot(pp.sx - proj.sx, pp.sy - proj.sy) < starRNow * 0.99) return;
          const hoveredP = hover.body === planet.node.id;
          const planetMax = Math.max(56, Math.min(width, height) * 0.3);
          const r = Math.max(2.2, Math.min(planetMax, 13 * pp.scale)) * (system.planets.length > 30 ? 0.68 : 1) * (hoveredP ? 1.35 : 1);
          const dimP = flt !== null && flt !== system.code ? 0.2 : 1;
          const pColor = meta?.color ?? "#648bff";
          // Soft bloom, then a lit sphere with a rim, then the honest mastery arc.
          // Close up, the bloom shrinks so the body reads as solid, not as a lit bubble.
          const bloomR = r * (r > 18 ? 1.9 : 3.4);
          const bloom = ctx.createRadialGradient(pp.sx, pp.sy, r * 0.8, pp.sx, pp.sy, bloomR);
          bloom.addColorStop(0, rgba(pColor, (r > 18 ? 0.12 : 0.24) * dimP));
          bloom.addColorStop(1, "rgba(5,8,15,0)");
          ctx.fillStyle = bloom;
          ctx.beginPath();
          ctx.arc(pp.sx, pp.sy, bloomR, 0, Math.PI * 2);
          ctx.fill();

          const sphere = ctx.createRadialGradient(pp.sx - r * 0.34, pp.sy - r * 0.38, r * 0.06, pp.sx + r * 0.12, pp.sy + r * 0.14, r * 1.06);
          sphere.addColorStop(0, rgba(mix(pColor, "#ffffff", 0.3), 1));
          sphere.addColorStop(0.3, pColor);
          sphere.addColorStop(0.74, rgba(mix(pColor, "#04070f", 0.58), 1));
          sphere.addColorStop(1, "rgba(3,6,12,1)");
          ctx.globalAlpha = dimP;
          ctx.beginPath();
          ctx.arc(pp.sx, pp.sy, r, 0, Math.PI * 2);
          ctx.fillStyle = sphere;
          ctx.fill();
          ctx.strokeStyle = rgba(pColor, 0.3);
          ctx.lineWidth = Math.max(0.7, Math.min(1.6, r * 0.03));
          ctx.stroke();

          // Specular glint on the lit pole: the highlight that turns a shaded disc into a sphere.
          if (r > 7) {
            const gx = pp.sx - r * 0.3;
            const gy = pp.sy - r * 0.34;
            const glint = ctx.createRadialGradient(gx, gy, 0, gx, gy, r * 0.4);
            glint.addColorStop(0, "rgba(255,255,255,0.5)");
            glint.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = glint;
            ctx.beginPath();
            ctx.arc(gx, gy, r * 0.4, 0, Math.PI * 2);
            ctx.fill();
          }

          drawPlanetDetail(ctx, pp.sx, pp.sy, r, pColor, surfaceSeed(planet.node.code), clockRef.current, dimP, planet.node.object_type === "domain");

          if (r > 3.4 && r < 40) {
            ctx.save();
            ctx.globalAlpha = dimP * 0.4;
            ctx.strokeStyle = rgba(pColor, 0.7);
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.ellipse(pp.sx, pp.sy, r * 1.9, r * 0.55, -0.35 + (pi % 4) * 0.3, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }

          const pRing = masteryRing(planet.tier);
          if (pRing.arc > 0) {
            ctx.beginPath();
            ctx.arc(pp.sx, pp.sy, r + 2.4, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pRing.arc);
            ctx.strokeStyle = pRing.color;
            ctx.lineWidth = 1.5;
            ctx.lineCap = "round";
            ctx.stroke();
            ctx.lineCap = "butt";
          }
          if (planet.node.id === sel || hoveredP) {
            ctx.beginPath();
            ctx.arc(pp.sx, pp.sy, r + 4.5, 0, Math.PI * 2);
            ctx.strokeStyle = hoveredP ? "#ffffff" : "#35d9ff";
            ctx.lineWidth = 1.3;
            ctx.globalAlpha = dimP * 0.85;
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
          bodies.push({ node: planet.node, kind: "planet", star: si, x: pp.sx, y: pp.sy, r: r + 4, depth: pp.depth });
          nodePos.set(planet.node.id, { p, x: pp.sx, y: pp.sy, r, tier: planet.tier, kind: "planet", node: planet.node, star: si });

          planet.moons.forEach((moon: GalaxyMoon, mi: number) => {
            const moonCount = Math.max(1, planet.moons.length);
            const mr = 18 + (mi % 2) * 9 + moonCount * 1.2;
            const mTilt = ((mi % 3) - 1) * 0.35;
            const mYaw = pi * 0.7 + mi * 0.9;
            const mOmega = 0.2 + (mi % 3) * 0.025;
            const mTheta = (mi / moonCount) * Math.PI * 2 + phaseAt(pi * 0.4, mOmega, t);
            const mPos = orbitPoint(p, mr, mr * 0.82, mTilt, mYaw, mTheta);
            const mp = project(mPos, cam, width, height);
            if (!mp) return;
            if (mp.sx < -40 || mp.sx > width + 40 || mp.sy < -40 || mp.sy > height + 40) return;
            if (cam.distance < 620 && mp.depth > starDepth && Math.hypot(mp.sx - proj.sx, mp.sy - proj.sy) < starRNow * 0.985) return;
            const mrPx = Math.max(1.6, Math.min(Math.max(30, Math.min(width, height) * 0.16), 7 * mp.scale));
            // Close orbit: a short wake behind each moon so a moon reads as travelling, not parked.
            if (iso === si && cam.distance < 900 && mrPx > 2.4) {
              const tail = project(orbitPoint(p, mr, mr * 0.82, mTilt, mYaw, mTheta - 0.42), cam, width, height);
              if (tail) {
                ctx.strokeStyle = "rgba(150,178,222,0.32)";
                ctx.lineWidth = Math.max(0.8, mrPx * 0.55);
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(tail.sx, tail.sy);
                ctx.lineTo(mp.sx, mp.sy);
                ctx.stroke();
                ctx.lineCap = "butt";
              }
            }
            drawMoon(ctx, mp.sx, mp.sy, mrPx, moon.tier, moon.node.id === sel, surfaceSeed(moon.node.code));
            bodies.push({ node: moon.node, kind: "moon", star: si, x: mp.sx, y: mp.sy, r: mrPx + 5, depth: mp.depth });
            nodePos.set(moon.node.id, { p: mPos, x: mp.sx, y: mp.sy, r: mrPx, tier: moon.tier, kind: "moon", node: moon.node, star: si });
          });
        });

        // Moons with no domain parent orbit their star directly.
        system.moons.forEach((moon: GalaxyMoon, mi: number) => {
          const moonCount = Math.max(1, system.moons.length);
          const mr = 40 + (mi % 2) * 16;
          const p = orbitPoint(world, mr, mr * 0.78, ((mi % 3) - 1) * 0.3, si * 0.5, (mi / moonCount) * Math.PI * 2 + phaseAt(mi * 0.5, 0.09, t));
          const mp = project(p, cam, width, height);
          if (!mp || mp.sx < -40 || mp.sx > width + 40 || mp.sy < -40 || mp.sy > height + 40) return;
          const mrPx = Math.max(1.6, Math.min(Math.max(30, Math.min(width, height) * 0.16), 7 * mp.scale));
          drawMoon(ctx, mp.sx, mp.sy, mrPx, moon.tier, moon.node.id === sel, surfaceSeed(moon.node.code));
          bodies.push({ node: moon.node, kind: "moon", star: si, x: mp.sx, y: mp.sy, r: mrPx + 5, depth: mp.depth });
          nodePos.set(moon.node.id, { p, x: mp.sx, y: mp.sy, r: mrPx, tier: moon.tier, kind: "moon", node: moon.node, star: si });
        });
      });

      // Threads — intra-system cyan, cross-domain violet at 28%.
      const threads: ThreadHit[] = [];
      const systemStar = (code: string): number => scene.galaxy.stars.findIndex((s) => s.code === code);
      const drawThreads = (list: typeof edgesRef.current.intra, color: string, widthPx: number, curve: number, cross: boolean): void => {
        for (const e of list) {
          const a = nodePos.get(e.source_id);
          const b = nodePos.get(e.target_id);
          if (!a || !b) continue;
          if (iso !== null && (a.star !== iso || b.star !== iso)) continue;
          if (flt !== null && (a.star !== systemStar(flt) || b.star !== systemStar(flt))) continue;
          const c = bezierControl(a.p, b.p, curve);
          const pts: ScreenPoint[] = [];
          let clipped = false;
          for (let i = 0; i <= 18; i += 1) {
            const q3 = project(quadraticPoint(a.p, c, b.p, i / 18), cam, width, height);
            if (!q3) {
              clipped = true;
              break;
            }
            pts.push({ x: q3.sx, y: q3.sy });
          }
          if (clipped || pts.length < 2) continue;
          const active = hover.thread === e.id;
          const path = new Path2D();
          path.moveTo(pts[0]!.x, pts[0]!.y);
          for (let i = 1; i < pts.length; i += 1) path.lineTo(pts[i]!.x, pts[i]!.y);
          const stroke = ctx.createLinearGradient(pts[0]!.x, pts[0]!.y, pts[pts.length - 1]!.x, pts[pts.length - 1]!.y);
          const ca = DISCIPLINE_BY_ID[scene.galaxy.stars[a.star]?.code ?? ""]?.color ?? "#35d9ff";
          const cb = DISCIPLINE_BY_ID[scene.galaxy.stars[b.star]?.code ?? ""]?.color ?? "#a78bfa";
          stroke.addColorStop(0, active ? "#ffffff" : rgba(ca, 0.72));
          stroke.addColorStop(1, active ? "#ffffff" : rgba(cb, 0.72));
          if (active) {
            ctx.strokeStyle = rgba(cb, 0.28);
            ctx.lineWidth = widthPx + 9;
            ctx.stroke(path);
          }
          ctx.strokeStyle = active ? "rgba(255,255,255,0.92)" : stroke;
          ctx.lineWidth = active ? widthPx + 1.4 : widthPx;
          ctx.stroke(path);
          if (cross) {
            // Travelling dots make a cross-domain link read as a live connection rather than a hairline.
            ctx.save();
            ctx.setLineDash([2, 16]);
            ctx.lineDashOffset = -((t * 26) % 18);
            ctx.strokeStyle = rgba(cb, active ? 0.95 : 0.5);
            ctx.lineWidth = 1.6;
            ctx.stroke(path);
            ctx.restore();
          }
          if (cross) threads.push({
            id: e.id, star: b.star,
            title: DISCIPLINE_BY_ID[scene.galaxy.stars[b.star]?.code ?? ""]?.name ?? "another discipline",
            code: scene.galaxy.stars[b.star]?.code ?? "",
            relation: e.relation_type,
            sourceTitle: a.node.title, sourceCode: a.node.code,
            targetTitle: b.node.title,
            points: pts,
            mid: { x: a.p.x * 0.25 + c.x * 0.5 + b.p.x * 0.25, y: a.p.y * 0.25 + c.y * 0.5 + b.p.y * 0.25, z: a.p.z * 0.25 + c.z * 0.5 + b.p.z * 0.25 },
            sourceId: e.source_id, targetId: e.target_id,
          });
        }
      };
      ctx.globalAlpha = iso === null && flt === null ? 1 : 0.55;
      drawThreads(edgesRef.current.intra, "rgba(53,217,255,0.34)", 1, 26, false);
      drawThreads(edgesRef.current.cross, "rgba(167,139,250,0.28)", 1, 60, true);
      ctx.globalAlpha = 1;
      threadsRef.current = threads;
      bodiesRef.current = bodies;

      // Selection pulse: a ring that breathes around the inspected body while the clock runs.
      const pulsePos = sel ? nodePos.get(sel) : undefined;
      if (pulsePos) {
        const pulse = 0.5 + 0.5 * Math.sin(t * 2.6);
        ctx.beginPath();
        ctx.arc(pulsePos.x, pulsePos.y, pulsePos.r + 9 + pulse * 8, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(53,217,255,${0.5 * (1 - pulse)})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      // Labels with level-of-detail culling.
      // Greedy label placement: a label that would collide with one already drawn is culled, so 18
      // star names never pile up at 360px.
      const placed: { x0: number; y0: number; x1: number; y1: number }[] = [];
      const fitLabel = (x: number, y: number, w: number): boolean => {
        const box = { x0: x - w / 2 - 6, y0: y - 11, x1: x + w / 2 + 6, y1: y + 6 };
        for (const b of placed) if (box.x0 < b.x1 && box.x1 > b.x0 && box.y0 < b.y1 && box.y1 > b.y0) return false;
        placed.push(box);
        return true;
      };
      const label = (text: string, x: number, y: number, color: string, alpha: number, force = false): void => {
        ctx.font = '600 11px "JetBrains Mono", ui-monospace, monospace';
        ctx.textAlign = "center";
        const w = ctx.measureText(text).width;
        // Never draw a label half off the canvas: cull it instead of clipping the name.
        if (x - w / 2 < 6 || x + w / 2 > width - 6) return;
        if (!force && !fitLabel(x, y, w)) return;
        ctx.globalAlpha = alpha * 0.72;
        ctx.fillStyle = "#070b18";
        ctx.fillRect(x - w / 2 - 4, y - 9, w + 8, 15);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y + 2);
        ctx.globalAlpha = 1;
      };
      scene.galaxy.stars.forEach((system, si) => {
        const screen = starScreen[si];
        if (!screen || screen.scale === 0) return;
        if (screen.x < -60 || screen.x > width + 60) return;
        const dimAll = (iso !== null && iso !== si) || (flt !== null && flt !== system.code);
        const meta = DISCIPLINE_BY_ID[system.code];
        const matchedNow = matchedRef.current;
        const alpha = dimAll ? 0.22 : sel === system.discipline.id ? 0.95 : matchedNow === null || matchedNow.has(system.discipline.id) ? 0.86 : 0.34;
        const r = Math.max(3.2, Math.min(13, 26 * screen.scale));
        const moonTotal = system.moons.length + system.planets.reduce((m, p) => m + p.moons.length, 0);
        // The selected record already gets its full title label below; skip the short duplicate.
        if (sel !== system.discipline.id && (screen.scale > 0.16 || iso === si)) label(`${meta?.short.toUpperCase() ?? system.code} · ${moonTotal}`, screen.x, screen.y - r - 10, meta?.color ?? "#f1f5ff", alpha, false);
      });
      // Planet labels appear once the camera is close enough to read them.
      if (cam.distance < 900 && cam.distance > 280) {
        scene.galaxy.stars.forEach((system, si) => {
          if (iso !== null && iso !== si) return;
          for (const planet of system.planets) {
            const pos = nodePos.get(planet.node.id);
            if (!pos) continue;
            const dimAll = (iso !== null && iso !== si) || (flt !== null && flt !== system.code);
            label(planet.node.title, pos.x, pos.y - pos.r - 8, "#a8b6d2", dimAll ? 0.18 : 0.72);
          }
        });
      }
      const selectedPos = sel ? nodePos.get(sel) : undefined;
      if (selectedPos) label(selectedPos.node.title, selectedPos.x, selectedPos.y - selectedPos.r - 10, "#f1f5ff", 1, true);

      // Hover readout: the code, title and honest mastery tier of the body under the pointer, placed
      // beside the body so a deep zoom never loses track of what is on screen.
      const hoverPos = hover.body && hover.body !== sel ? nodePos.get(hover.body) : undefined;
      if (hoverPos) {
        const title = hoverPos.node.title.length > 30 ? `${hoverPos.node.title.slice(0, 29)}…` : hoverPos.node.title;
        const tier = TIER_LABEL[hoverPos.tier];
        ctx.font = '600 12px "Inter", ui-sans-serif, system-ui, sans-serif';
        const tw = ctx.measureText(title).width;
        ctx.font = '500 10px "JetBrains Mono", ui-monospace, monospace';
        const cw = ctx.measureText(`${hoverPos.node.code} · ${tier}`).width;
        const bw = Math.max(tw, cw) + 22;
        const bh = 44;
        let bx = hoverPos.x + hoverPos.r + 14;
        let by = hoverPos.y - bh / 2;
        if (bx + bw > width - 10) bx = hoverPos.x - hoverPos.r - bw - 14;
        bx = Math.max(10, Math.min(width - bw - 10, bx));
        by = Math.max(12, Math.min(height - bh - 12, by));
        roundRect(ctx, bx, by, bw, bh, 10);
        ctx.fillStyle = "rgba(7, 13, 26, 0.92)";
        ctx.fill();
        ctx.strokeStyle = "rgba(126, 170, 255, 0.35)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "#f1f5ff";
        ctx.font = '600 12px "Inter", ui-sans-serif, system-ui, sans-serif';
        ctx.fillText(title, bx + 11, by + 19);
        ctx.fillStyle = TIER_COLOR[hoverPos.tier];
        ctx.font = '500 10px "JetBrains Mono", ui-monospace, monospace';
        ctx.fillText(`${hoverPos.node.code} · ${tier}`, bx + 11, by + 34);
      }
    };

    const loop = (now: number): void => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const flight = flightRef.current;
      if (flight) {
        const p = Math.min(1, (now - flight.start) / flight.dur);
        cameraRef.current = mixCamera(flight.from, flight.to, easeOutCubic(p));
        if (p >= 1) {
          cameraRef.current = flight.to;
          flightRef.current = null;
          if (flight.isolate !== null) setIsolated(flight.isolate);
        }
        dirtyRef.current = true;
      }
      if (playingRef.current) {
        clockRef.current += dt;
        dirtyRef.current = true;
      }
      if (dirtyRef.current) {
        draw(now);
        dirtyRef.current = false;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    /* ── Interaction ────────────────────────────────────────────────────── */
    let dragging = false;
    let moved = 0;
    let lastX = 0;
    let lastY = 0;
    let mode: "orbit" | "pan" = "orbit";
    const pointers = new Map<number, { x: number; y: number }>();
    let pinchStart = 0;
    let pinchDistance = 0;

    /** World point under a screen coordinate at the camera's target depth, used to fly to any body. */
    const worldAt = (sx: number, sy: number): { x: number; y: number; z: number } => {
      const cam = cameraRef.current;
      const X = ((sx - width / 2) * cam.distance) / FOCAL;
      const Y = (-(sy - height / 2) * cam.distance) / FOCAL;
      const cy = Math.cos(cam.yaw);
      const sy2 = Math.sin(cam.yaw);
      const cp = Math.cos(cam.pitch);
      const sp = Math.sin(cam.pitch);
      const z1 = -Y * sp;
      return { x: cam.targetX + X * cy + z1 * sy2, y: cam.targetY + Y * cp, z: cam.targetZ - X * sy2 + z1 * cy };
    };

    const onDown = (e: PointerEvent): void => {
      canvas.classList.add("dragging");
      canvas.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      dragging = true;
      moved = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      mode = e.shiftKey || e.button === 2 || pointers.size > 1 ? "pan" : "orbit";
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinchDistance = Math.hypot((a?.x ?? 0) - (b?.x ?? 0), (a?.y ?? 0) - (b?.y ?? 0));
        pinchStart = cameraRef.current.distance;
        mode = "pan";
      }
    };
    const onMove = (e: PointerEvent): void => {
      if (!dragging) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        pointerRef.current = { x, y, inside: true };
        const body = [...bodiesRef.current]
          .filter((b) => Math.hypot(b.x - x, b.y - y) <= b.r + 6)
          .sort((a, b) => (a.kind === "star" ? -1 : 0) - (b.kind === "star" ? -1 : 0) || b.depth - a.depth)[0];
        const thread = body ? undefined : threadsRef.current.find((th) => distanceToPolyline(x, y, th.points) < 9);
        const next = { body: body?.node.id ?? null, thread: thread?.id ?? null };
        if (next.body !== hoverRef.current.body || next.thread !== hoverRef.current.thread) {
          hoverRef.current = next;
          dirtyRef.current = true;
          canvas.classList.toggle("over-body", Boolean(next.body || next.thread));
        }
        return;
      }
      const prev = pointers.get(e.pointerId);
      if (!prev) return;
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      moved += Math.abs(dx) + Math.abs(dy);
      const cam = cameraRef.current;
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const d = Math.hypot((a?.x ?? 0) - (b?.x ?? 0), (a?.y ?? 0) - (b?.y ?? 0));
        if (pinchDistance > 0) cam.distance = Math.max(60, Math.min(3200, pinchStart * (pinchDistance / Math.max(1, d))));
      } else if (mode === "pan" || e.shiftKey) {
        const k = (cam.distance / FOCAL) * 0.9;
        const cy = Math.cos(cam.yaw);
        const sy = Math.sin(cam.yaw);
        cam.targetX -= (dx * cy - dy * sy * Math.cos(cam.pitch)) * k;
        cam.targetY += dy * k;
        cam.targetZ += (dx * sy + dy * cy * Math.cos(cam.pitch)) * k;
        setIsolated(null);
      } else {
        cam.yaw += dx * 0.0055;
        cam.pitch = Math.max(-1.15, Math.min(1.15, cam.pitch + dy * 0.0045));
      }
      lastX = e.clientX;
      lastY = e.clientY;
      dirtyRef.current = true;
    };
    const onUp = (e: PointerEvent): void => {
      pointers.delete(e.pointerId);
      canvas.classList.remove("dragging");
      if (pointers.size > 0) return;
      dragging = false;
      if (moved > 8) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const hit = [...bodiesRef.current]
        .filter((b) => Math.hypot(b.x - x, b.y - y) <= b.r + 6)
        .sort((a, b) => (a.kind === "star" ? -1 : 0) - (b.kind === "star" ? -1 : 0) || b.depth - a.depth)[0];
      if (hit) {
        setSelected(hit.node.id);
        setConfirm(null);
        if (hit.kind === "star") {
          // Clicking an already-isolated system releases it and flies back out.
          if (isolatedRef.current === hit.star && cameraRef.current.distance <= 520) {
            resetView();
          } else {
            setIsolated(hit.star);
            flyToStar(hit.star, 720);
          }
        } else {
          // Zoom to the body itself, keeping both the system and the record in view.
          const w = worldAt(x, y);
          const d = Math.max(80, Math.min(780, cameraRef.current.distance * 0.5));
          const to = makeCamera({ targetX: w.x, targetY: w.y, targetZ: w.z, yaw: cameraRef.current.yaw, pitch: cameraRef.current.pitch, distance: d });
          flightRef.current = { from: { ...cameraRef.current }, to, start: performance.now(), dur: 520, isolate: hit.star };
        }
        return;
      }
      const thread = threadsRef.current.find((th) => distanceToPolyline(x, y, th.points) < 9);
      if (thread) {
        // A thread click flies to its midpoint and selects the far endpoint, so the relation is legible in place.
        const to = makeCamera({ targetX: thread.mid.x, targetY: thread.mid.y, targetZ: thread.mid.z, yaw: cameraRef.current.yaw, pitch: cameraRef.current.pitch, distance: 700 });
        flightRef.current = { from: { ...cameraRef.current }, to, start: performance.now(), dur: 640, isolate: null };
        setIsolated(null);
        setSelected(thread.targetId);
        setConfirm({ star: thread.star, title: thread.title, code: thread.code, relation: thread.relation, sourceTitle: thread.sourceTitle, sourceCode: thread.sourceCode, targetTitle: thread.targetTitle });
        return;
      }
      setSelected(null);
      setConfirm(null);
    };
    const onWheel = (e: WheelEvent): void => {
      e.preventDefault();
      const cam = cameraRef.current;
      const rect = canvas.getBoundingClientRect();
      const next = Math.max(60, Math.min(3200, cam.distance * Math.exp(e.deltaY * 0.0013)));
      // Keep the point under the cursor fixed: invert the camera rotation on the cursor ray at target depth.
      const X = ((e.clientX - rect.left) - width / 2) * (cam.distance / FOCAL);
      const Y = -((e.clientY - rect.top) - height / 2) * (cam.distance / FOCAL);
      const cy = Math.cos(cam.yaw);
      const sy = Math.sin(cam.yaw);
      const cp = Math.cos(cam.pitch);
      const sp = Math.sin(cam.pitch);
      const z1 = -Y * sp;
      const f = 1 - next / cam.distance;
      cam.targetX += (X * cy + z1 * sy) * f;
      cam.targetY += Y * cp * f;
      cam.targetZ += (-X * sy + z1 * cy) * f;
      cam.distance = next;
      dirtyRef.current = true;
    };
    const onLeave = (): void => {
      pointerRef.current.inside = false;
      if (hoverRef.current.body || hoverRef.current.thread) {
        hoverRef.current = { body: null, thread: null };
        canvas.classList.remove("over-body");
        dirtyRef.current = true;
      }
    };
    const onDouble = (e: MouseEvent): void => {
      e.preventDefault();
      resetView();
    };
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        setConfirm(null);
        setSelected(null);
        setIsolated(null);
        resetView();
      }
    };
    const onContext = (e: Event): void => e.preventDefault();

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("contextmenu", onContext);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("dblclick", onDouble);
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("contextmenu", onContext);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("dblclick", onDouble);
      window.removeEventListener("keydown", onKey);
    };
  }, [flyToStar, resetView]);

  const selectedNode = selected ? state.nodes[selected] : undefined;
  const selectedTier = selectedNode ? masteryTier(index, selectedNode.id) : null;
  const selectedMeta = selectedNode ? DISCIPLINE_BY_ID[selectedNode.owner_discipline_id ?? ""] : undefined;
  const groupsShown = filter === null ? groups : groups.filter((g) => g.discipline === filter);
  const needle = q.trim().toLowerCase();
  const focus = isolated !== null ? galaxy.stars[isolated] : undefined;

  return (
    <section className="atlas-root" aria-label="Knowledge Atlas">
      <canvas ref={canvasRef} className="atlas-canvas" aria-hidden={view === "index"} />
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
          <button
            className="btn sm ghost"
            aria-label={playing ? "Pause orbit" : "Play orbit"}
            aria-pressed={!playing}
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? <Pause size={15} strokeWidth={1.5} aria-hidden="true" /> : <Play size={15} strokeWidth={1.5} aria-hidden="true" />}
            <span>{playing ? "Pause" : "Orbit"}</span>
          </button>
          <div className="pill" role="group" aria-label="Atlas view" data-index={view === "index" ? "1" : "0"}>
            <span className="pill-thumb" aria-hidden="true" />
            <button aria-pressed={view === "atlas"} onClick={() => setView("atlas")}>Atlas</button>
            <button aria-pressed={view === "index"} onClick={() => setView("index")}>Index</button>
          </div>
        </div>
      </div>

      <div className="atlas-chips" role="group" aria-label="Discipline filter">
        <button className="chip" aria-pressed={filter === null} onClick={() => setFilter(null)}>All · <span className="num">{galaxy.totals.moons + galaxy.totals.planets}</span></button>
        {DISCIPLINES.map((d) => (
          <button key={d.id} className="chip" aria-pressed={filter === d.id} onClick={() => setFilter(filter === d.id ? null : d.id)}>
            <d.Icon size={13} strokeWidth={1.5} aria-hidden="true" color={d.color} />{d.short}
          </button>
        ))}
      </div>

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
        </aside>
      )}

      {confirm && (
        <div className="confirm-card" role="dialog" aria-modal="false" aria-label="Cross-domain thread">
          <span className="tag" style={{ borderColor: "var(--discovery-violet)", color: "var(--discovery-violet)" }}>{confirm.relation.replace(/_/g, " ").toLowerCase()}</span>
          <p style={{ margin: "8px 0 0" }}>
            <strong>{confirm.sourceTitle}</strong> <span className="mono">{confirm.sourceCode}</span> → <strong>{confirm.targetTitle}</strong>
          </p>
          <p style={{ margin: "6px 0 0" }}>
            Navigate to <strong>{confirm.title}</strong>?
          </p>
          <span className="label mono">{confirm.code}</span>
          <div className="row" style={{ marginTop: 12 }}>
            <button
              className="btn primary grow"
              onClick={() => {
                setConfirm(null);
                setIsolated(confirm.star);
                flyToStar(confirm.star, 700);
                setSelected(null);
              }}
            >
              Fly There
            </button>
            <button className="btn grow" onClick={() => setConfirm(null)}>Cancel</button>
          </div>
        </div>
      )}

      {view === "atlas" && galaxy.stars.length > 0 && (
        <button className="btn sm atlas-reset" onClick={resetView} aria-label="Reset atlas view">
          <RotateCcw size={13} strokeWidth={1.6} aria-hidden="true" />
          {isolated !== null ? "All systems" : "Reset view"}
        </button>
      )}

      {view === "atlas" && galaxy.stars.length > 0 && (
        <div className="atlas-zoom" aria-label="Zoom level">
          <b>{zoom < 10 ? zoom.toFixed(1) : Math.round(zoom)}×</b>
          <small>{zoom > 2.4 ? "surface" : zoom > 1.15 ? "inner system" : "galaxy"}</small>
        </div>
      )}

      {view === "atlas" && focus && (
        <div className="atlas-system" aria-live="polite">
          <span className="mono">{focus.code}</span>
          <strong>{DISCIPLINE_BY_ID[focus.code]?.name ?? "System"}</strong>
          <span className="num">
            {focus.planets.length} domains · {focus.moons.length + focus.planets.reduce((n, p) => n + p.moons.length, 0)} skills
          </span>
        </div>
      )}

      <div className="atlas-legend" aria-label="Mastery encoding">
        <span><i style={{ borderColor: "#71819f", color: "#71819f" }} />unassessed</span>
        <span><i style={{ borderColor: "#ffc66d", color: "#ffc66d" }} />needs revision</span>
        <span><i style={{ borderColor: "#42e6c4", color: "#42e6c4" }} />demonstrated</span>
        <span><i style={{ borderColor: "#42e6c4", color: "#42e6c4", background: "#42e6c4" }} />mastered</span>
        <span className="atlas-key">drag · scroll to the surface · double-click to reset</span>
      </div>
    </section>
  );
}

/** Deterministic per-record seed for surface features. Same code, same surface, every frame. */
function surfaceSeed(code: string): number {
  let h = 2166136261;
  for (let i = 0; i < code.length; i += 1) {
    h ^= code.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  const k = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + k, y);
  ctx.lineTo(x + w - k, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + k);
  ctx.lineTo(x + w, y + h - k);
  ctx.quadraticCurveTo(x + w, y + h, x + w - k, y + h);
  ctx.lineTo(x + k, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - k);
  ctx.lineTo(x, y + k);
  ctx.quadraticCurveTo(x, y, x + k, y);
  ctx.closePath();
}

/**
 * Star surface. Below ~10 px this is a glow; above it a corona grows out of the limb, then a
 * granulated photosphere with limb darkening, spots and prominences once the body fills real pixels.
 * Everything is seeded, so a star does not shimmer into a different star between frames.
 */
function drawStarDetail(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, seed: number, t: number, alpha: number, hovered: boolean): void {
  if (r < 7 || alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;

  // Corona filaments, tapering outwards. They rotate very slowly with the clock.
  const rays = 34 + Math.floor(hash01(seed, 2) * 22);
  for (let i = 0; i < rays; i += 1) {
    const a = (i / rays) * Math.PI * 2 + t * 0.01 + hash01(seed, i) * 0.18;
    const len = r * (1.02 + hash01(i, seed) * (hovered ? 0.24 : 0.16));
    ctx.strokeStyle = rgba(color, 0.1 + hash01(i, seed + 11) * 0.22);
    ctx.lineWidth = Math.max(0.4, r * 0.004);
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * r * 0.99, y + Math.sin(a) * r * 0.99);
    ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
    ctx.stroke();
  }

  if (r > 20) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r * 0.985, 0, Math.PI * 2);
    ctx.clip();

    // Granulation: bright convective cells and cooler lanes, strong enough to read as a surface.
    const cells = Math.max(30, Math.min(420, Math.floor(r * 1.6)));
    for (let i = 0; i < cells; i += 1) {
      const a = hash01(seed, i) * Math.PI * 2;
      const d = Math.sqrt(hash01(i, seed + 1)) * r * 0.97;
      const cr = r * (0.003 + hash01(i, seed + 2) * 0.016);
      ctx.fillStyle = hash01(i, seed + 3) > 0.5 ? "rgba(255,255,255,0.14)" : rgba(mix(color, "#05070f", 0.55), 0.14);
      ctx.beginPath();
      ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, cr, 0, Math.PI * 2);
      ctx.fill();
    }
    // Supergranulation: a slower layer of larger, softer cells under the fine grain.
    for (let i = 0; i < 34; i += 1) {
      const a = hash01(seed + 90, i) * Math.PI * 2;
      const d = Math.sqrt(hash01(i, seed + 91)) * r * 0.9;
      ctx.fillStyle = hash01(i, seed + 92) > 0.5 ? "rgba(255,255,255,0.045)" : rgba(mix(color, "#05070f", 0.6), 0.05);
      ctx.beginPath();
      ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, r * (0.05 + hash01(i, seed + 93) * 0.07), 0, Math.PI * 2);
      ctx.fill();
    }

    // Limb darkening — the edge of a star is cooler and darker than its face.
    const limb = ctx.createRadialGradient(x, y, r * 0.5, x, y, r);
    limb.addColorStop(0, "rgba(0,0,0,0)");
    limb.addColorStop(0.78, "rgba(4,8,18,0.24)");
    limb.addColorStop(1, "rgba(3,6,13,0.92)");
    ctx.fillStyle = limb;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);

    // A few starspots, seeded and clustered.
    const spots = 2 + Math.floor(hash01(seed, 7) * 4);
    for (let i = 0; i < spots; i += 1) {
      const a = hash01(seed + i, 4) * Math.PI * 2;
      const d = hash01(seed + i, 5) * r * 0.6;
      ctx.fillStyle = "rgba(6,10,22,0.13)";
      ctx.beginPath();
      ctx.ellipse(x + Math.cos(a) * d, y + Math.sin(a) * d, r * 0.05, r * 0.03, a, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Prominences: short bright arcs that leave the limb.
    if (r > 80) {
      for (let i = 0; i < 3; i += 1) {
        const a = hash01(seed, i + 21) * Math.PI * 2;
        const lift = r * (1.03 + hash01(i, seed + 5) * 0.12);
        ctx.strokeStyle = rgba(color, 0.35);
        ctx.lineWidth = Math.max(1, r * 0.008);
        ctx.beginPath();
        ctx.arc(x, y, lift, a - 0.16, a + 0.16);
        ctx.stroke();
      }
    }

    // Chromosphere: a soft band of light just outside the photosphere.
    ctx.strokeStyle = rgba(mix(color, "#ffffff", 0.55), 0.16);
    ctx.lineWidth = Math.max(1, r * 0.035);
    ctx.beginPath();
    ctx.arc(x, y, r * 1.005, 0, Math.PI * 2);
    ctx.stroke();

    // Rim light: a thin, hot edge rather than a plain circle stroke.
    const rim = ctx.createLinearGradient(x - r, y - r, x + r, y + r);
    rim.addColorStop(0, "rgba(255,255,255,0.95)");
    rim.addColorStop(0.5, rgba(mix(color, "#ffffff", 0.7), 0.85));
    rim.addColorStop(1, "rgba(255,255,255,0.18)");
    ctx.strokeStyle = rim;
    ctx.lineWidth = Math.max(1, r * 0.012);
    ctx.beginPath();
    ctx.arc(x, y, r * 0.995, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Planet surface. Domains read as banded giants, skill families as rocky worlds with continents and
 * craters. Both get a terminator, polar caps, an atmosphere rim and, sometimes, a ring.
 */
function drawPlanetDetail(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, seed: number, t: number, alpha: number, banded: boolean): void {
  if (r < 5 || alpha <= 0) return;
  const spin = t * 0.015 + hash01(seed, 1) * 6.28;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.arc(x, y, r * 0.985, 0, Math.PI * 2);
  ctx.clip();

  if (banded) {
    // Deeper atmosphere first, then alternating light and dark belts with a soft edge.
    ctx.fillStyle = rgba(mix(color, "#050810", 0.42), 0.7);
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
    const bands = 8 + Math.floor(hash01(seed, 2) * 7);
    for (let i = 0; i < bands; i += 1) {
      const by = y - r + ((i + 0.5) / bands) * 2 * r + Math.sin(spin + i) * r * 0.02;
      const bh = (2 * r / bands) * 0.68;
      ctx.fillStyle = i % 2 === 0 ? rgba(mix(color, "#ffffff", 0.42), 0.4) : rgba(mix(color, "#04070f", 0.62), 0.55);
      ctx.beginPath();
      ctx.ellipse(x, by, r * 1.1, bh, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // Storm ovals and one bright band edge drifting through the belts.
    for (let i = 0; i < 2; i += 1) {
      const oy = y + (hash01(seed, i + 8) - 0.5) * r * 1.2;
      const ox = x + Math.sin(spin * 0.7 + i) * r * 0.35;
      ctx.fillStyle = rgba(mix(color, "#ffffff", 0.6), 0.5);
      ctx.beginPath();
      ctx.ellipse(ox, oy, r * 0.24, r * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = Math.max(0.6, r * 0.012);
    ctx.beginPath();
    ctx.ellipse(x, y + Math.sin(spin) * r * 0.22, r * 1.02, r * 0.16, 0, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    // Rock and ocean: a darker sea, then lit continents over it.
    ctx.fillStyle = rgba(mix(color, "#04121c", 0.52), 0.55);
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
    // Continents: irregular clusters of overlapping arcs, pushed around by the slow spin.
    const land = 4 + Math.floor(hash01(seed, 3) * 4);
    for (let i = 0; i < land; i += 1) {
      const a = hash01(seed, i + 4) * Math.PI * 2 + spin * 0.4;
      const d = hash01(i, seed + 6) * r * 0.66;
      const cx = x + Math.cos(a) * d;
      const cy = y + Math.sin(a) * d * 0.8;
      const cr = r * (0.12 + hash01(i, seed + 7) * 0.2);
      ctx.fillStyle = rgba(mix(color, "#e8f6ff", 0.3), 0.38);
      for (let k = 0; k < 3; k += 1) {
        ctx.beginPath();
        ctx.arc(cx + Math.cos(k * 2.1) * cr * 0.6, cy + Math.sin(k * 2.1) * cr * 0.5, cr * (0.7 - k * 0.14), 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // Craters with a lit rim and a shadowed floor.
    const craters = Math.max(3, Math.min(22, Math.floor(r * 0.14)));
    for (let i = 0; i < craters; i += 1) {
      const a = hash01(seed, i + 30) * Math.PI * 2;
      const d = Math.sqrt(hash01(i, seed + 31)) * r * 0.78;
      const cr = r * (0.02 + hash01(i, seed + 32) * 0.06);
      ctx.fillStyle = "rgba(3,7,15,0.3)";
      ctx.beginPath();
      ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, cr, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.16)";
      ctx.lineWidth = Math.max(0.5, cr * 0.22);
      ctx.beginPath();
      ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, cr, Math.PI * 0.9, Math.PI * 1.9);
      ctx.stroke();
    }
  }

  // Polar caps.
  const capA = 0.16 + hash01(seed, 9) * 0.14;
  ctx.fillStyle = "rgba(240,248,255,0.5)";
  ctx.beginPath();
  ctx.ellipse(x, y - r * 0.92, r * 0.42, r * capA, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x, y + r * 0.94, r * 0.36, r * capA * 0.8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Terminator: light falls from the upper left, the lower right goes dark.
  const shade = ctx.createLinearGradient(x - r * 0.95, y - r * 0.95, x + r * 0.8, y + r * 0.95);
  shade.addColorStop(0, "rgba(255,255,255,0.13)");
  shade.addColorStop(0.3, "rgba(255,255,255,0.02)");
  shade.addColorStop(0.5, "rgba(0,0,0,0)");
  shade.addColorStop(0.68, "rgba(2,5,12,0.46)");
  shade.addColorStop(1, "rgba(1,3,8,0.96)");
  ctx.fillStyle = shade;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);

  // Crescent of light along the lit limb.
  ctx.strokeStyle = "rgba(255,255,255,0.45)";
  ctx.lineWidth = Math.max(0.8, r * 0.016);
  ctx.beginPath();
  ctx.arc(x, y, r * 0.9, Math.PI * 0.72, Math.PI * 1.58);
  ctx.stroke();

  // Thin cloud bands over the lit face, only when the body is large enough to read them.
  if (r > 26) {
    for (let i = 0; i < 3; i += 1) {
      const cy = y + (hash01(seed, i + 41) - 0.5) * r * 1.1;
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = Math.max(1, r * 0.03);
      ctx.beginPath();
      ctx.ellipse(x, cy, r * 0.72, r * 0.08, 0, Math.PI * 0.1, Math.PI * 0.9);
      ctx.stroke();
    }
  }
  ctx.restore();

  // Atmosphere outside the disc.
  const atmo = ctx.createRadialGradient(x, y, r * 0.96, x, y, r * 1.18);
  atmo.addColorStop(0, rgba(mix(color, "#ffffff", 0.3), 0.5));
  atmo.addColorStop(1, "rgba(5,8,15,0)");
  ctx.fillStyle = atmo;
  ctx.beginPath();
  ctx.arc(x, y, r * 1.16, 0, Math.PI * 2);
  ctx.fill();

  // Some worlds carry a ring; the near half is drawn over the disc so it reads as a ring, not a halo.
  if (hash01(seed, 12) > 0.68 && r > 12) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.3 + hash01(seed, 13) * 0.6);
    ctx.strokeStyle = rgba(color, 0.4);
    ctx.lineWidth = Math.max(1, r * 0.06);
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.7, r * 0.42, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = Math.max(0.6, r * 0.02);
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.95, r * 0.5, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}

/** Mix two #rrggbb colours; used to build light and shadow from one discipline hue. */
function mix(hex: string, target: string, t: number): string {
  const a = hex.replace("#", "");
  const b = target.replace("#", "");
  if (a.length !== 6 || b.length !== 6) return hex;
  const ch = (i: number): string => {
    const x = parseInt(a.slice(i, i + 2), 16);
    const y = parseInt(b.slice(i, i + 2), 16);
    return Math.round(x + (y - x) * t).toString(16).padStart(2, "0");
  };
  return `#${ch(0)}${ch(2)}${ch(4)}`;
}

/** #rrggbb → rgba() so the corona can fade a discipline colour into the void. */
function rgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  if (h.length !== 6) return `rgba(53,217,255,${alpha})`;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** What a moon is made of. Seeded from its code, so the same skill always shows the same world. */
type MoonClass = "ice" | "rock" | "volcanic" | "dust" | "metal";

const MOON_LOOK: Record<MoonClass, { base: string; dark: string; light: string; haze: string }> = {
  ice: { base: "#cfe6ff", dark: "#5c86ba", light: "#ffffff", haze: "rgba(150,205,255,0.40)" },
  rock: { base: "#a9b1c1", dark: "#3a4254", light: "#e9eef8", haze: "rgba(158,175,205,0.18)" },
  volcanic: { base: "#c98a6a", dark: "#35180f", light: "#ffd8a6", haze: "rgba(255,132,80,0.36)" },
  dust: { base: "#d9c4a1", dark: "#4f4130", light: "#fff1d8", haze: "rgba(233,199,152,0.24)" },
  metal: { base: "#a2b3cb", dark: "#283040", light: "#f5f9ff", haze: "rgba(196,216,246,0.28)" },
};

function moonClassOf(seed: number): MoonClass {
  const k = hash01(seed, 301);
  if (k < 0.3) return "ice";
  if (k < 0.58) return "rock";
  if (k < 0.76) return "volcanic";
  if (k < 0.92) return "dust";
  return "metal";
}

/**
 * Moons are satellites, not dots: each one has a composition (ice, rock, volcanic, dust, metal) that
 * decides its haze, its palette and its surface marks. Mastery still rides on top — the filled core
 * and the arc around the limb — so looks never stand in for evidence.
 */
function drawMoon(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, tier: MasteryTier, selected: boolean, seed: number): void {
  const ring = masteryRing(tier);
  const kind = moonClassOf(seed);
  const look = MOON_LOOK[kind];

  // Its own haze, tinted by what it is made of; a volcanic moon breathes wider than an icy one.
  const glowR = r * (kind === "volcanic" ? 3.8 : kind === "ice" ? 3.1 : 2.7);
  const glow = ctx.createRadialGradient(x, y, r * 0.5, x, y, glowR);
  glow.addColorStop(0, look.haze);
  if (ring.filled) glow.addColorStop(0.25, rgba(ring.color, 0.4));
  glow.addColorStop(1, "rgba(5,8,15,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, glowR, 0, Math.PI * 2);
  ctx.fill();

  // Shaded body: light falls from the upper left, so even a 4 px moon is a sphere.
  const body = ctx.createRadialGradient(x - r * 0.36, y - r * 0.4, r * 0.06, x + r * 0.1, y + r * 0.12, r * 1.05);
  body.addColorStop(0, look.light);
  body.addColorStop(0.34, look.base);
  body.addColorStop(0.78, look.dark);
  body.addColorStop(1, "#05070f");
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = body;
  ctx.fill();

  if (r > 3) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r * 0.99, 0, Math.PI * 2);
    ctx.clip();

    if (kind === "ice") {
      // Fracture lines over a bright frost sheet.
      for (let i = 0; i < 3 + Math.floor(hash01(seed, 310) * 4); i += 1) {
        const a = hash01(seed, i + 311) * Math.PI * 2;
        const d = Math.sqrt(hash01(i, seed + 312)) * r * 0.85;
        ctx.strokeStyle = "rgba(255,255,255,0.34)";
        ctx.lineWidth = Math.max(0.5, r * 0.05);
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a) * d, y + Math.sin(a) * d);
        ctx.lineTo(x + Math.cos(a + 0.9) * d * 0.5, y + Math.sin(a + 0.9) * d * 0.5);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(255,255,255,0.14)";
      ctx.beginPath();
      ctx.arc(x - r * 0.3, y - r * 0.26, r * 0.52, 0, Math.PI * 2);
      ctx.fill();
    } else if (kind === "volcanic") {
      // Fissures lit from inside, over a dull hot glow.
      const vent = ctx.createRadialGradient(x, y, 0, x, y, r * 0.8);
      vent.addColorStop(0, "rgba(255,120,60,0.3)");
      vent.addColorStop(1, "rgba(255,120,60,0)");
      ctx.fillStyle = vent;
      ctx.beginPath();
      ctx.arc(x, y, r * 0.8, 0, Math.PI * 2);
      ctx.fill();
      for (let i = 0; i < 4; i += 1) {
        const a = hash01(seed, i + 320) * Math.PI * 2;
        const d0 = r * (0.1 + hash01(i, seed + 321) * 0.3);
        const d1 = d0 + r * (0.35 + hash01(i, seed + 322) * 0.4);
        ctx.strokeStyle = i % 2 === 0 ? "rgba(255,140,72,0.72)" : "rgba(255,196,120,0.5)";
        ctx.lineWidth = Math.max(0.6, r * 0.06);
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a) * d0, y + Math.sin(a) * d0);
        ctx.lineTo(x + Math.cos(a + 0.4) * d1, y + Math.sin(a + 0.4) * d1);
        ctx.stroke();
      }
    } else if (kind === "metal") {
      // Machined plates: bright seams and shadowed gaps instead of terrain.
      for (let i = 0; i < 3; i += 1) {
        const yy = y + (i / 3 - 0.5) * r * 1.4;
        ctx.strokeStyle = i % 2 === 0 ? "rgba(255,255,255,0.22)" : "rgba(10,16,28,0.4)";
        ctx.lineWidth = Math.max(0.6, r * 0.07);
        ctx.beginPath();
        ctx.ellipse(x, yy, r * 0.96, r * 0.14, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      const sheen = ctx.createLinearGradient(x - r, y - r, x + r, y + r);
      sheen.addColorStop(0, "rgba(255,255,255,0.2)");
      sheen.addColorStop(0.45, "rgba(255,255,255,0)");
      sheen.addColorStop(1, "rgba(6,10,20,0.35)");
      ctx.fillStyle = sheen;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    } else {
      // Rock and dust: craters with a lit rim and a shadowed floor, denser on rock.
      const craters = Math.max(2, Math.min(16, Math.floor(r * (kind === "rock" ? 0.85 : 0.5))));
      for (let i = 0; i < craters; i += 1) {
        const a = hash01(seed, i + 330) * Math.PI * 2;
        const d = Math.sqrt(hash01(i, seed + 331)) * r * 0.82;
        const cr = r * (0.05 + hash01(i, seed + 332) * 0.17);
        ctx.fillStyle = kind === "dust" ? "rgba(60,44,26,0.22)" : "rgba(4,8,18,0.32)";
        ctx.beginPath();
        ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, cr, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.lineWidth = Math.max(0.4, cr * 0.2);
        ctx.beginPath();
        ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, cr, Math.PI * 0.95, Math.PI * 1.85);
        ctx.stroke();
      }
      if (kind === "dust") {
        // Drifting regolith: soft mottling rather than sharp geology.
        for (let i = 0; i < 5; i += 1) {
          const a = hash01(i, seed + 340) * Math.PI * 2;
          const d = hash01(seed, i + 341) * r * 0.6;
          ctx.fillStyle = "rgba(255,240,215,0.08)";
          ctx.beginPath();
          ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, r * (0.2 + hash01(i, seed + 342) * 0.24), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // A gentle photographic vignette keeps the disc round against its own haze.
    const shade = ctx.createRadialGradient(x - r * 0.1, y - r * 0.1, r * 0.2, x, y, r * 1.02);
    shade.addColorStop(0, "rgba(0,0,0,0)");
    shade.addColorStop(0.82, "rgba(3,7,16,0.16)");
    shade.addColorStop(1, "rgba(2,5,12,0.62)");
    ctx.fillStyle = shade;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
    ctx.restore();

    // Lit limb.
    ctx.strokeStyle = "rgba(255,255,255,0.42)";
    ctx.lineWidth = Math.max(0.6, r * 0.05);
    ctx.beginPath();
    ctx.arc(x, y, r * 0.9, Math.PI * 0.78, Math.PI * 1.6);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = tier === "unassessed" ? "rgba(113,129,159,0.85)" : "rgba(113,129,159,0.35)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Mastery is the only thing allowed to fill a moon in.
  if (ring.filled) {
    ctx.beginPath();
    ctx.arc(x, y, Math.max(1.4, r * 0.5), 0, Math.PI * 2);
    ctx.fillStyle = ring.color;
    ctx.fill();
  }
  if (ring.arc > 0 && ring.arc < 1) {
    ctx.beginPath();
    ctx.arc(x, y, r + 1.2, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ring.arc);
    ctx.strokeStyle = ring.color;
    ctx.lineWidth = 1.6;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.lineCap = "butt";
  }
  if (tier === "needs_revision") {
    ctx.beginPath();
    ctx.arc(x + r + 2.4, y - r - 2.4, 1.9, 0, Math.PI * 2);
    ctx.fillStyle = "#ffc66d";
    ctx.fill();
  }
  if (selected) {
    ctx.beginPath();
    ctx.arc(x, y, r + 5, 0, Math.PI * 2);
    ctx.strokeStyle = "#35d9ff";
    ctx.lineWidth = 1.4;
    ctx.stroke();
  }
}

/** Exposed for tests and the Index deep links. */
export function tierOf(state: Parameters<typeof evidenceIndex>[0], id: string): MasteryTier {
  return masteryTier(evidenceIndex(state), id);
}
