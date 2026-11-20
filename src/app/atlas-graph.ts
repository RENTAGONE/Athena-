// Hand-written 3D math for the Knowledge Atlas. No WebGL, no graph library: a camera, a perspective
// projection, golden-angle star placement, tilted elliptical orbits and quadratic Bezier threads.
// Everything is deterministic — the same state and the same clock always draw the same frame.
//
// v2 scale: the galaxy is a real 6,500-unit radius and the camera can be flown from 28 units above a
// single asteroid out to 24,000 units for the multi-galaxy cluster. Zoom is exponential, so a wheel
// notch feels the same at every scale and the view never snaps back on release.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Camera {
  targetX: number;
  targetY: number;
  targetZ: number;
  yaw: number;
  pitch: number;
  distance: number;
}

export interface Projected {
  sx: number;
  sy: number;
  scale: number;
  depth: number;
}

/** Focal length in pixels (spec value). */
export const FOCAL = 540;
/** Galaxy radius in world units. */
export const GALAXY_RADIUS = 6500;
/** Minimum separation the star placement keeps inside the core galaxy. */
export const MIN_STAR_SEPARATION = 2400;
/** Closest orbit: low-orbit inspection of an asteroid or satellite. */
export const MIN_DISTANCE = 28;
/** Furthest orbit: the deep field has no edge, so the camera may keep going out. */
export const MAX_DISTANCE = 900_000;
/** Orbit where the three local galaxies are individual islands inside the deep field. */
export const UNIVERSE_DISTANCE = 52_000;
/** Beyond this the other galaxies are drawn as bodies in their own right. */
export const MACRO_DISTANCE = 3200;
/** Hyperspace warp duration, in milliseconds. */
export const WARP_MS = 650;
/** Cube the stars wrap inside at close range, so panning never runs out of sky. */
export const WRAP_SIZE = 14_000;

export function makeCamera(overrides: Partial<Camera> = {}): Camera {
  return { targetX: 0, targetY: 0, targetZ: 0, yaw: 0.35, pitch: 0.42, distance: 1250, ...overrides };
}

export function v3(x = 0, y = 0, z = 0): Vec3 {
  return { x, y, z };
}

export function add(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}
export function sub(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}
export function scale(a: Vec3, k: number): Vec3 {
  return { x: a.x * k, y: a.y * k, z: a.z * k };
}
export function lerpVec(a: Vec3, b: Vec3, t: number): Vec3 {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: a.z + (b.z - a.z) * t };
}
export function length(a: Vec3): number {
  return Math.hypot(a.x, a.y, a.z);
}
export function normalize(a: Vec3): Vec3 {
  const l = length(a);
  return l === 0 ? v3() : scale(a, 1 / l);
}
export function dot(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}
export function cross(a: Vec3, b: Vec3): Vec3 {
  return { x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x };
}

/** Camera-space transform: move to target, yaw, pitch, then push back by the orbit distance. */
export function toCameraSpace(p: Vec3, cam: Camera): Vec3 {
  const dx = p.x - cam.targetX;
  const dy = p.y - cam.targetY;
  const dz = p.z - cam.targetZ;
  const cy = Math.cos(cam.yaw);
  const sy = Math.sin(cam.yaw);
  const x1 = dx * cy - dz * sy;
  const z1 = dx * sy + dz * cy;
  const cp = Math.cos(cam.pitch);
  const sp = Math.sin(cam.pitch);
  const y2 = dy * cp - z1 * sp;
  const z2 = dy * sp + z1 * cp;
  return { x: x1, y: y2, z: z2 + cam.distance };
}

/** Projects a world point. Returns null when the point is behind the camera plane. */
export function project(p: Vec3, cam: Camera, width: number, height: number): Projected | null {
  const c = toCameraSpace(p, cam);
  if (c.z <= 8) return null;
  const k = FOCAL / c.z;
  return { sx: width / 2 + c.x * k, sy: height / 2 - c.y * k, scale: k, depth: c.z };
}

const clamp = (n: number, min: number, max: number): number => Math.max(min, Math.min(max, n));

/**
 * Logarithmic zoom. distance *= exp(delta * sensitivity), where delta is normalised wheel/pinch
 * movement. Returns a clamped distance, so a hard scroll stops at the floor/ceiling instead of
 * flipping past it, and a negative delta never produces a zero or negative camera distance.
 */
export function zoomDistance(distance: number, delta: number, sensitivity = 1): number {
  const next = distance * Math.exp(delta * sensitivity);
  return clamp(Number.isFinite(next) ? next : distance, MIN_DISTANCE, MAX_DISTANCE);
}

/** Meter readout for the HUD: 0 at the cluster, 1 at the surface. Log scale, so the bar is honest. */
export function zoomFraction(distance: number): number {
  const d = clamp(distance, MIN_DISTANCE, MAX_DISTANCE);
  return 1 - Math.log(d / MIN_DISTANCE) / Math.log(MAX_DISTANCE / MIN_DISTANCE);
}

/** Dolly: moves both the camera orbit and its target along the view direction. */
export function dolly(cam: Camera, units: number): Camera {
  const dir = normalize(v3(Math.sin(cam.yaw) * Math.cos(cam.pitch), -Math.sin(cam.pitch), Math.cos(cam.yaw) * Math.cos(cam.pitch)));
  const step = scale(dir, units);
  return { ...cam, targetX: cam.targetX + step.x, targetY: cam.targetY + step.y, targetZ: cam.targetZ + step.z, distance: clamp(cam.distance - units, MIN_DISTANCE, MAX_DISTANCE) };
}

/** Golden angle: phi = pi * (3 - sqrt 5). Star i sits on a Fibonacci sphere of radius R. */
export function goldenStarPositions(n: number, radius = GALAXY_RADIUS): Vec3[] {
  const phi = Math.PI * (3 - Math.sqrt(5));
  const out: Vec3[] = [];
  for (let i = 0; i < n; i += 1) {
    const y = n === 1 ? 0 : 1 - (2 * i) / (n - 1);
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = i * phi;
    out.push({ x: Math.cos(theta) * r * radius, y: y * radius, z: Math.sin(theta) * r * radius });
  }
  return out;
}

/**
 * Star placement that guarantees a minimum separation: Fibonacci sphere, then a deterministic
 * relaxation pass that pushes any pair closer than `minSeparation` apart without randomising the set.
 */
export function separatedStarPositions(n: number, radius = GALAXY_RADIUS, minSeparation = MIN_STAR_SEPARATION): Vec3[] {
  const pts = goldenStarPositions(n, radius);
  for (let pass = 0; pass < 24; pass += 1) {
    for (let i = 0; i < pts.length; i += 1) {
      for (let j = i + 1; j < pts.length; j += 1) {
        const a = pts[i]!;
        const b = pts[j]!;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dz = b.z - a.z;
        const d = Math.hypot(dx, dy, dz);
        if (d >= minSeparation || d === 0) continue;
        const push = (minSeparation - d) * 0.5;
        const ux = dx / d;
        const uy = dy / d;
        const uz = dz / d;
        a.x -= ux * push;
        a.y -= uy * push;
        a.z -= uz * push;
        b.x += ux * push;
        b.y += uy * push;
        b.z += uz * push;
      }
      const p = pts[i]!;
      const l = Math.hypot(p.x, p.y, p.z) || 1;
      if (l > radius) {
        p.x = (p.x / l) * radius;
        p.y = (p.y / l) * radius;
        p.z = (p.z / l) * radius;
      }
    }
  }
  return pts;
}

/** A flat spiral arm, used for the secondary galaxies seen in the macro view. */
export function spiralPositions(n: number, radius: number, arms = 2, twist = 0.55): Vec3[] {
  const out: Vec3[] = [];
  for (let i = 0; i < n; i += 1) {
    const t = i / Math.max(1, n - 1);
    const arm = i % arms;
    const theta = t * Math.PI * 4 + (arm / arms) * Math.PI * 2;
    const r = radius * (0.16 + t * 0.84);
    out.push({ x: Math.cos(theta) * r, y: (hash01(i, 7) - 0.5) * radius * 0.06, z: Math.sin(theta) * r * twist });
  }
  return out;
}

/** Point on a tilted 3D ellipse. tilt rotates the orbital plane; orbitYaw spins the plane's major axis. */
export function orbitPoint(center: Vec3, rx: number, rz: number, tilt: number, orbitYaw: number, theta: number): Vec3 {
  const lx = Math.cos(theta) * rx;
  const lz = Math.sin(theta) * rz;
  const ty = -Math.sin(tilt) * lz;
  const tz = Math.cos(tilt) * lz;
  const x = lx * Math.cos(orbitYaw) - tz * Math.sin(orbitYaw);
  const z = lx * Math.sin(orbitYaw) + tz * Math.cos(orbitYaw);
  return { x: center.x + x, y: center.y + ty, z: center.z + z };
}

/** Nearest periodic copy of p around the camera target: endless panning without visible edges. */
export function wrapPoint(p: Vec3, cam: Camera, size = WRAP_SIZE): Vec3 {
  const wrap = (v: number, t: number): number => {
    const d = v - t;
    const w = ((d + size / 2) % size + size) % size - size / 2;
    return t + w;
  };
  return { x: wrap(p.x, cam.targetX), y: wrap(p.y, cam.targetY), z: wrap(p.z, cam.targetZ) };
}

/** Stable 0..1 hash for a set of integers (used for per-cell jitter). */
export function hash01(...values: number[]): number {
  let h = 2166136261;
  for (const v of values) {
    let x = Math.imul(v | 0, 374761393) ^ 0x5f356495;
    x = Math.imul(x ^ (x >>> 13), 1274126177);
    h = (h ^ x) >>> 0;
    h = Math.imul(h, 16777619) >>> 0;
  }
  return ((h >>> 8) & 0xffff) / 0xffff;
}

/**
 * Deterministic depth/angle jitter applied only to the periodic copy a star re-entered through, so the
 * wrap boundary never reads as a tiled grid and yet the sky is stable across frames.
 */
export function reentryJitter(wrapped: Vec3, base: Vec3, size = WRAP_SIZE): Vec3 {
  const cx = Math.round((wrapped.x - base.x) / size);
  const cy = Math.round((wrapped.y - base.y) / size);
  const cz = Math.round((wrapped.z - base.z) / size);
  if (cx === 0 && cy === 0 && cz === 0) return wrapped;
  const a = hash01(cx, cy, cz) * Math.PI * 2;
  const d = (hash01(cz, cx, cy) - 0.5) * 90;
  return { x: wrapped.x + Math.cos(a) * d, y: wrapped.y + (hash01(cy, cz, cx) - 0.5) * 70, z: wrapped.z + Math.sin(a) * d };
}

/** Quadratic Bezier control point: midpoint pushed along a normal by dCurve. */
export function bezierControl(p1: Vec3, p2: Vec3, dCurve: number, normalHint?: Vec3): Vec3 {
  const mid = scale(add(p1, p2), 0.5);
  const dir = sub(p2, p1);
  const hint = normalHint ?? v3(0, 0, 1);
  let n = cross(dir, hint);
  if (length(n) < 1e-3) n = cross(dir, v3(0, 1, 0));
  if (length(n) < 1e-3) n = v3(1, 0, 0);
  return add(mid, scale(normalize(n), dCurve));
}

export function quadraticPoint(p0: Vec3, c: Vec3, p1: Vec3, t: number): Vec3 {
  const u = 1 - t;
  return {
    x: u * u * p0.x + 2 * u * t * c.x + t * t * p1.x,
    y: u * u * p0.y + 2 * u * t * c.y + t * t * p1.y,
    z: u * u * p0.z + 2 * u * t * c.z + t * t * p1.z,
  };
}

export interface ScreenPoint {
  x: number;
  y: number;
}

export function distanceToPolyline(px: number, py: number, points: ScreenPoint[]): number {
  let best = Number.POSITIVE_INFINITY;
  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1]!;
    const b = points[i]!;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const lenSq = dx * dx + dy * dy;
    const t = lenSq === 0 ? 0 : Math.max(0, Math.min(1, ((px - a.x) * dx + (py - a.y) * dy) / lenSq));
    const d = Math.hypot(px - (a.x + t * dx), py - (a.y + t * dy));
    if (d < best) best = d;
  }
  return best;
}

/** Cubic-out easing (220ms system isolation, 700ms cross-system flight). */
export function easeOutCubic(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - c, 3);
}

/** Warp easing: accelerate hard, then decelerate into the target. Used by the 650ms hyperspace jump. */
export function easeInOutQuart(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c < 0.5 ? 8 * c * c * c * c : 1 - Math.pow(-2 * c + 2, 4) / 2;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function mixCamera(from: Camera, to: Camera, t: number): Camera {
  return {
    targetX: lerp(from.targetX, to.targetX, t),
    targetY: lerp(from.targetY, to.targetY, t),
    targetZ: lerp(from.targetZ, to.targetZ, t),
    yaw: lerpAngle(from.yaw, to.yaw, t),
    pitch: lerp(from.pitch, to.pitch, t),
    // Distance is interpolated in log space so a warp from the surface to the cluster does not spend
    // most of its time in the near field.
    distance: Math.exp(lerp(Math.log(from.distance), Math.log(to.distance), t)),
  };
}

/** Shortest-path angle interpolation, so a flight never spins the long way round. */
export function lerpAngle(from: number, to: number, t: number): number {
  let d = (to - from) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return from + d * t;
}

/** Orbit phase from elapsed seconds: theta(t) = theta0 + omega t. */
export function phaseAt(phase0: number, omega: number, seconds: number): number {
  return phase0 + omega * seconds;
}

/* ── Wave 2: galaxies, phenomena, biomes and stage growth ─────────────────────────────────────
 * Everything below is a pure function of stored data. A black hole is not decoration: it is drawn
 * only when a discipline holds a real body of records and none of them carries evidence. A quasar is
 * drawn only where mastery is actually concentrated. Neither can be produced by browsing.
 */

export type GalaxyKey = "core" | "frontier" | "vault";

export interface GalaxyCluster {
  key: GalaxyKey;
  label: string;
  /** Where the cluster sits in the 24,000-unit macro view. */
  anchor: Vec3;
  radius: number;
}

/**
 * The macro view is a cluster of three galaxies, not one galaxy on its own. The core holds the
 * mapped curriculum; the Frontier holds records still in draft and the Vault holds retired records.
 * Anchors are fixed so a flight between them is repeatable.
 */
export const GALAXY_CLUSTERS: GalaxyCluster[] = [
  { key: "core", label: "ATHENA Core", anchor: v3(0, 0, 0), radius: GALAXY_RADIUS * 0.62 },
  // Kept just outside the core's 6,500-unit radius, so the three galaxies frame together at 0.5×.
  // Wide enough to read as a galaxy beside the core at cluster range, not as a smudge.
  { key: "frontier", label: "Frontier", anchor: v3(-GALAXY_RADIUS * 1.5, -900, -GALAXY_RADIUS * 0.7), radius: 2400 },
  { key: "vault", label: "Vault", anchor: v3(GALAXY_RADIUS * 1.6, 1000, GALAXY_RADIUS * 0.6), radius: 2000 },
];

export function clusterByKey(key: GalaxyKey): GalaxyCluster {
  return GALAXY_CLUSTERS.find((c) => c.key === key) ?? GALAXY_CLUSTERS[0]!;
}

export interface DeepGalaxy {
  anchor: Vec3;
  radius: number;
  tilt: number;
  yaw: number;
  hue: string;
  /** Which pre-rendered sprite variant draws this galaxy (hue × arm count). */
  sprite: number;
  brightness: number;
}

export const DEEP_HUES = ["#7ea4ff", "#a78bfa", "#63d2b8", "#ffc66d", "#f29bd0", "#8fa8c8"];
/** The deep field tiles inside this cube, wrapped around the camera target, so it never runs out. */
export const DEEP_WRAP = 260_000;

/**
 * The deep field: deterministic galaxies beyond the local cluster, so scrolling out never ends in
 * empty sky. Positions, sizes and spins are seeded, so the same sky comes back every visit; nothing
 * here stands in for a record count and nothing is claimed about the learner.
 */
export const DEEP_GALAXIES: DeepGalaxy[] = Array.from({ length: 1000 }, (_, i) => {
  const radius = 700 + Math.pow(hash01(i, 304), 2.6) * 3600;
  return {
    // Uniform inside the wrap cube: panning or zooming out always reveals more sky, never an edge.
    anchor: v3(
      (hash01(i, 301) - 0.5) * DEEP_WRAP,
      (hash01(i, 302) - 0.5) * DEEP_WRAP * 0.62,
      (hash01(i, 303) - 0.5) * DEEP_WRAP,
    ),
    radius,
    tilt: (hash01(i, 305) - 0.5) * 1.3,
    yaw: hash01(i, 306) * Math.PI * 2,
    hue: DEEP_HUES[i % DEEP_HUES.length]!,
    sprite: (i % DEEP_HUES.length) * 3 + (i % 3),
    brightness: 0.3 + hash01(i, 307) * 0.42,
  };
});

/** A jump is a warp only when it crosses a real distance, not when it nudges the camera. */
export function isHyperspaceJump(from: Vec3, to: Vec3): boolean {
  return length(sub(to, from)) > 2600;
}

export type SystemPhenomenonKind = "black_hole" | "quasar";

export interface SystemPhenomenon {
  kind: SystemPhenomenonKind;
  /** 0..1, used for glow and jet length. Never a performance score. */
  intensity: number;
}

/**
 * A discipline's phenomenon, derived from its own records:
 *  · black hole — at least twelve records, not one of them carrying evidence (a large unmapped mass);
 *  · quasar     — at least three confirmed masteries and a quarter of the system evidenced (energy
 *                 leaving the core because the learner actually demonstrated it).
 * A system with some evidence and no mastery reads as a normal star, because that is what it is.
 */
export function systemPhenomenon(counts: { total: number; evidenced: number; mastered: number }): SystemPhenomenon | null {
  if (counts.total < 12) return null;
  const density = counts.evidenced / Math.max(1, counts.total);
  if (counts.evidenced === 0) return { kind: "black_hole", intensity: 1 };
  if (counts.mastered >= 3 && density >= 0.25) return { kind: "quasar", intensity: Math.min(1, counts.mastered / 6) };
  if (density < 0.06) return { kind: "black_hole", intensity: 1 - density / 0.06 };
  return null;
}

export type Biome = "ocean" | "verdant" | "desert" | "ice" | "volcanic" | "barren";

/** Deterministic biome: the same record always has the same world. */
export function biomeFor(seed: number): Biome {
  const k = hash01(seed, 901);
  if (k < 0.24) return "ocean";
  if (k < 0.44) return "verdant";
  if (k < 0.6) return "desert";
  if (k < 0.74) return "ice";
  if (k < 0.86) return "volcanic";
  return "barren";
}

/**
 * Stage growth from evidence: a body that has been demonstrated grows, up to 55%, and never shrinks
 * below its base size when evidence is absent. Labels and hit targets follow the drawn radius.
 */
export function stageGrowth(evidenceCount: number): number {
  if (evidenceCount <= 0) return 1;
  return 1 + Math.min(0.55, Math.log1p(evidenceCount) * 0.17);
}

/** City lights on the night side: one settlement per piece of evidence, capped so a body stays a body. */
export function cityLightCount(evidenceCount: number): number {
  return Math.max(0, Math.min(56, Math.round(evidenceCount * 1.6)));
}

/** Ring geometry for a mastery state: arc fraction and whether the core is filled. */
export function masteryRing(tier: "unassessed" | "needs_revision" | "demonstrated" | "mastered"): { arc: number; filled: boolean; color: string } {
  switch (tier) {
    case "needs_revision":
      return { arc: 0.62, filled: false, color: "#ffc66d" };
    case "demonstrated":
      return { arc: 0.45, filled: false, color: "#42e6c4" };
    case "mastered":
      return { arc: 1, filled: true, color: "#42e6c4" };
    default:
      return { arc: 0, filled: false, color: "#71819f" };
  }
}
