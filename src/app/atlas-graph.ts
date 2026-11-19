// Hand-written 3D math for the Knowledge Atlas. No WebGL, no graph library: a camera, a perspective
// projection, golden-angle star placement, tilted elliptical orbits and quadratic Bezier threads.
// Everything is deterministic — the same state and the same clock always draw the same frame.

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
export const GALAXY_RADIUS = 440;
/** Cube the stars wrap inside, so panning never runs out of sky. */
export const WRAP_SIZE = 1400;

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
    distance: lerp(from.distance, to.distance, t),
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
