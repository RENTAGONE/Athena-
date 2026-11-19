import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Pause, Play, Search, X } from "lucide-react";
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

  const [view, setView] = useState<"atlas" | "index">("atlas");
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
  const [playing, setPlaying] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [isolated, setIsolated] = useState<number | null>(null);
  const [confirm, setConfirm] = useState<{ star: number; title: string; code: string } | null>(null);

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
  const threadsRef = useRef<{ id: string; star: number; title: string; code: string; points: ScreenPoint[] }[]>([]);
  const clockRef = useRef(0);
  const dirtyRef = useRef(true);
  const reduceRef = useRef(false);

  useEffect(() => {
    sceneRef.current = { galaxy, starsWorld, location: galaxy.location };
    edgesRef.current = edges;
    dirtyRef.current = true;
  }, [galaxy, starsWorld, edges]);

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
      const to = makeCamera({ targetX: target.x, targetY: target.y, targetZ: target.z, yaw: 0.55, pitch: 0.5, distance: 540 });
      flightRef.current = { from: { ...cameraRef.current }, to, start: performance.now(), dur, isolate: starIdx };
    },
    [starsWorld],
  );

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

    const resize = (): void => {
      const rect = canvas.getBoundingClientRect();
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

    const field = Array.from({ length: 150 }, (_, i) => ({
      x: hash01(i, 11),
      y: hash01(i, 23),
      size: 0.6 + hash01(i, 37) * 0.9,
      depth: i % 2 === 0 ? 0.15 : 0.35,
      alpha: 0.3 + hash01(i, 53) * 0.55,
      streak: i % 7 === 0,
    }));
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

      // Layers 1 & 2 — two parallax star depths.
      for (const s of field) {
        const par = s.depth;
        const sx = ((s.x * width - cam.targetX * par * 0.12) % width + width) % width;
        const sy = ((s.y * height + cam.targetY * par * 0.12) % height + height) % height;
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = s.streak ? "#a8b6d2" : "#f1f5ff";
        ctx.fillRect(sx, sy, s.size, s.size);
      }
      ctx.globalAlpha = 1;

      // Layer 3 — equatorial coordinate ring.
      ctx.save();
      ctx.translate(width * 0.5, height * 0.5);
      ctx.rotate(-0.28);
      ctx.strokeStyle = "rgba(38,56,88,0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(0, 0, Math.min(width, height) * 0.46, Math.min(width, height) * 0.17, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

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
        const world = reentryJitter(wrapPoint(base, cam), base);
        const proj = project(world, cam, width, height);
        const dimSystem = (iso !== null && iso !== si) || (flt !== null && flt !== system.code);
        if (!proj) {
          starScreen.push({ x: -1e4, y: -1e4, scale: 0 });
          return;
        }
        starScreen.push({ x: proj.sx, y: proj.sy, scale: proj.scale });
        const meta = DISCIPLINE_BY_ID[system.code];
        const dim = dimSystem ? 0.12 : 1;
        const visible = proj.sx > -160 && proj.sx < width + 160 && proj.sy > -160 && proj.sy < height + 160;

        if (visible) {
          const r = Math.max(3.2, Math.min(13, 26 * proj.scale));
          ctx.globalAlpha = dim;
          ctx.beginPath();
          ctx.arc(proj.sx, proj.sy, r, 0, Math.PI * 2);
          ctx.fillStyle = meta?.color ?? "#648bff";
          ctx.fill();
          ctx.lineWidth = 1;
          ctx.strokeStyle = "rgba(241,245,255,0.75)";
          ctx.stroke();
          if (sel === system.discipline.id) {
            ctx.beginPath();
            ctx.arc(proj.sx, proj.sy, r + 5, 0, Math.PI * 2);
            ctx.strokeStyle = "#35d9ff";
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
          bodies.push({ node: system.discipline, kind: "star", star: si, x: proj.sx, y: proj.sy, r: r + 5, depth: proj.depth });
          nodePos.set(system.discipline.id, { p: world, x: proj.sx, y: proj.sy, r, tier: "unassessed", kind: "star", node: system.discipline, star: si });
        }

        // Planets and their moons stay in motion even while a system is isolated.
        if (iso !== null && iso !== si) return;

        system.planets.forEach((planet: GalaxyPlanet, pi: number) => {
          const rx = 78 + (pi % 3) * 34;
          const rz = rx * 0.74;
          const tilt = ((pi % 5) - 2) * 0.2 + si * 0.03;
          const orbitYaw = si * 0.6 + pi * 0.9;
          const omega = 0.035 + (pi % 3) * 0.012;
          const theta = phaseAt(pi * 2.399, omega, t);
          const p = orbitPoint(world, rx, rz, tilt, orbitYaw, theta);
          const pp = project(p, cam, width, height);
          if (!pp) return;
          const inView = pp.sx > -80 && pp.sx < width + 80 && pp.sy > -80 && pp.sy < height + 80;
          if (!inView) return;
          const r = Math.max(2.2, Math.min(9, 13 * pp.scale));
          const dimP = flt !== null && flt !== system.code ? 0.2 : 1;
          ctx.globalAlpha = dimP;
          ctx.beginPath();
          ctx.arc(pp.sx, pp.sy, r, 0, Math.PI * 2);
          ctx.fillStyle = meta?.color ?? "#648bff";
          ctx.globalAlpha = dimP * 0.85;
          ctx.fill();
          ctx.globalAlpha = dimP;
          ctx.strokeStyle = "rgba(7,11,24,0.8)";
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.globalAlpha = 1;
          bodies.push({ node: planet.node, kind: "planet", star: si, x: pp.sx, y: pp.sy, r: r + 4, depth: pp.depth });
          nodePos.set(planet.node.id, { p, x: pp.sx, y: pp.sy, r, tier: planet.tier, kind: "planet", node: planet.node, star: si });

          planet.moons.forEach((moon: GalaxyMoon, mi: number) => {
            const mr = 22 + (mi % 3) * 8;
            const mTilt = ((mi % 4) - 1.5) * 0.55;
            const mYaw = pi * 1.4 + mi * 1.7;
            const mOmega = 0.17 + (mi % 4) * 0.03;
            const mPos = orbitPoint(p, mr, mr * 0.85, mTilt, mYaw, phaseAt(mi * 2.1 + pi, mOmega, t));
            const mp = project(mPos, cam, width, height);
            if (!mp) return;
            if (mp.sx < -40 || mp.sx > width + 40 || mp.sy < -40 || mp.sy > height + 40) return;
            const mrPx = Math.max(1.6, Math.min(6, 7 * mp.scale));
            drawMoon(ctx, mp.sx, mp.sy, mrPx, moon.tier, moon.node.id === sel);
            bodies.push({ node: moon.node, kind: "moon", star: si, x: mp.sx, y: mp.sy, r: mrPx + 5, depth: mp.depth });
            nodePos.set(moon.node.id, { p: mPos, x: mp.sx, y: mp.sy, r: mrPx, tier: moon.tier, kind: "moon", node: moon.node, star: si });
          });
        });

        // Moons with no domain parent orbit their star directly.
        system.moons.forEach((moon: GalaxyMoon, mi: number) => {
          const mr = 46 + (mi % 4) * 14;
          const p = orbitPoint(world, mr, mr * 0.8, ((mi % 3) - 1) * 0.4, si + mi, phaseAt(mi * 1.7, 0.11 + (mi % 3) * 0.02, t));
          const mp = project(p, cam, width, height);
          if (!mp || mp.sx < -40 || mp.sx > width + 40 || mp.sy < -40 || mp.sy > height + 40) return;
          const mrPx = Math.max(1.6, Math.min(6, 7 * mp.scale));
          drawMoon(ctx, mp.sx, mp.sy, mrPx, moon.tier, moon.node.id === sel);
          bodies.push({ node: moon.node, kind: "moon", star: si, x: mp.sx, y: mp.sy, r: mrPx + 5, depth: mp.depth });
          nodePos.set(moon.node.id, { p, x: mp.sx, y: mp.sy, r: mrPx, tier: moon.tier, kind: "moon", node: moon.node, star: si });
        });
      });

      // Threads — intra-system cyan, cross-domain violet at 28%.
      const threads: { id: string; star: number; title: string; code: string; points: ScreenPoint[] }[] = [];
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
          ctx.beginPath();
          ctx.moveTo(pts[0]!.x, pts[0]!.y);
          for (let i = 1; i < pts.length; i += 1) ctx.lineTo(pts[i]!.x, pts[i]!.y);
          ctx.strokeStyle = color;
          ctx.lineWidth = widthPx;
          ctx.stroke();
          if (cross) threads.push({ id: e.id, star: b.star, title: DISCIPLINE_BY_ID[scene.galaxy.stars[b.star]?.code ?? ""]?.name ?? "another discipline", code: scene.galaxy.stars[b.star]?.code ?? "", points: pts });
        }
      };
      ctx.globalAlpha = iso === null && flt === null ? 1 : 0.55;
      drawThreads(edgesRef.current.intra, "rgba(53,217,255,0.34)", 1, 26, false);
      drawThreads(edgesRef.current.cross, "rgba(167,139,250,0.28)", 1, 60, true);
      ctx.globalAlpha = 1;
      threadsRef.current = threads;
      bodiesRef.current = bodies;

      // Labels with level-of-detail culling.
      const label = (text: string, x: number, y: number, color: string, alpha: number): void => {
        ctx.font = '600 11px "JetBrains Mono", ui-monospace, monospace';
        ctx.textAlign = "center";
        const w = ctx.measureText(text).width;
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
        if (screen.scale > 0.16 || iso === si) label(meta?.short.toUpperCase() ?? system.code, screen.x, screen.y - r - 10, meta?.color ?? "#f1f5ff", alpha);
      });
      // Planet labels appear once the camera is close enough to read them.
      if (cam.distance < 900) {
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
      if (selectedPos) label(selectedPos.node.title, selectedPos.x, selectedPos.y - selectedPos.r - 10, "#f1f5ff", 1);
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

    const onDown = (e: PointerEvent): void => {
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
      if (!dragging) return;
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
        if (pinchDistance > 0) cam.distance = Math.max(260, Math.min(2600, pinchStart * (pinchDistance / Math.max(1, d))));
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
      if (pointers.size > 0) return;
      dragging = false;
      if (moved > 8) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const hit = [...bodiesRef.current].sort((a, b) => b.depth - a.depth).find((b) => Math.hypot(b.x - x, b.y - y) <= b.r + 6);
      if (hit) {
        setSelected(hit.node.id);
        setConfirm(null);
        if (hit.kind === "star") {
          setIsolated(hit.star);
          flyToStar(hit.star, 220);
        } else {
          setIsolated(hit.star);
        }
        return;
      }
      const thread = threadsRef.current.find((t) => distanceToPolyline(x, y, t.points) < 9);
      if (thread) {
        setConfirm({ star: thread.star, title: thread.title, code: thread.code });
        return;
      }
      setSelected(null);
      setConfirm(null);
    };
    const onWheel = (e: WheelEvent): void => {
      e.preventDefault();
      const cam = cameraRef.current;
      cam.distance = Math.max(260, Math.min(2600, cam.distance * Math.exp(e.deltaY * 0.0012)));
      dirtyRef.current = true;
    };
    const onContext = (e: Event): void => e.preventDefault();

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("contextmenu", onContext);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("contextmenu", onContext);
    };
  }, [flyToStar]);

  const selectedNode = selected ? state.nodes[selected] : undefined;
  const selectedTier = selectedNode ? masteryTier(index, selectedNode.id) : null;
  const selectedMeta = selectedNode ? DISCIPLINE_BY_ID[selectedNode.owner_discipline_id ?? ""] : undefined;
  const groupsShown = filter === null ? groups : groups.filter((g) => g.discipline === filter);
  const needle = q.trim().toLowerCase();

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
          <div className="pill" role="group" aria-label="Atlas view">
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
          <p>The atlas draws only what is in your local store. Preview the Pack v0.9 draft seed and approve it to load the 293 records it ships with.</p>
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
          <p style={{ margin: 0 }}>
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

      {isolated !== null && view === "atlas" && (
        <button
          className="btn sm atlas-reset"
          onClick={() => {
            setIsolated(null);
            setSelected(null);
            const target = makeCamera({ distance: 1120 });
            flightRef.current = { from: { ...cameraRef.current }, to: target, start: performance.now(), dur: 400, isolate: null };
          }}
        >
          All systems
        </button>
      )}

      <div className="atlas-legend" aria-label="Mastery encoding">
        <span><i style={{ borderColor: "#71819f", color: "#71819f" }} />unassessed</span>
        <span><i style={{ borderColor: "#ffc66d", color: "#ffc66d" }} />needs revision</span>
        <span><i style={{ borderColor: "#42e6c4", color: "#42e6c4" }} />demonstrated</span>
        <span><i style={{ borderColor: "#42e6c4", color: "#42e6c4", background: "#42e6c4" }} />mastered</span>
      </div>
    </section>
  );
}

function drawMoon(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, tier: MasteryTier, selected: boolean): void {
  const ring = masteryRing(tier);
  if (ring.filled) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = ring.color;
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.strokeStyle = tier === "unassessed" ? "rgba(113,129,159,0.85)" : "rgba(113,129,159,0.35)";
  ctx.lineWidth = 1;
  ctx.stroke();
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
