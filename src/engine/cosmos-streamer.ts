/**
 * Endless 360° sector streamer.
 *
 * A 5×5×5 neighbourhood of cubic sectors is always active around the camera — above, below and on
 * every side — so there is never an empty wall at the edge of the world. Every sector is a pure
 * function of its integer coordinates, and all buffers are allocated once: entering a sector writes
 * into existing Float32Arrays instead of allocating new geometry.
 *
 * Three scales share the streamer:
 *   · universes  — sector 18,000 u, 24 universes each (3,000 active at once)
 *   · galaxies   — sector 6,000 u, 200 galaxies each (25,000 active)
 *   · field stars — sector 2,200 u, 500 stars each (62,500 active)
 */
import * as THREE from "three";
import { mulberry32, hash01 } from "./cosmos-seed.ts";

export const SECTOR_RADIUS = 2; // 5×5×5
export const SECTORS_ACTIVE = (SECTOR_RADIUS * 2 + 1) ** 3;

const CAPACITY = {
  universe: 3_200 * 14,
  galaxy: 26_000 * 3,
  star: 64_000,
} as const;

const SECTOR_SIZE = {
  universe: 18_000,
  galaxy: 6_000,
  star: 2_200,
} as const;

const PER_SECTOR = {
  universe: 24,
  galaxy: 200,
  star: 500,
} as const;

const TINTS = [0x7ce8ff, 0xffc66d, 0xa78bfa, 0x42e6c4, 0xff8fb1, 0x9fb6ff];

export type StreamKind = "universe" | "galaxy" | "star";

export interface StreamBody {
  id: string;
  kind: StreamKind;
  name: string;
  center: THREE.Vector3;
  radius: number;
}

function pointTexture(): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const g = canvas.getContext("2d");
  if (g) {
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.28, "rgba(255,255,255,0.75)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const SPRITE = pointTexture();

function nameFor(kind: StreamKind, seed: number): string {
  const syllables = ["Ael", "Bor", "Cyn", "Dra", "Eth", "Fen", "Gor", "Hyl", "Ith", "Jor", "Kel", "Lyr", "Mor", "Nyx", "Orb", "Pyr", "Quen", "Rho", "Syl", "Tor", "Umb", "Vex", "Wyr", "Xan", "Yth", "Zor"];
  const a = syllables[Math.floor(hash01(seed, 1) * syllables.length)]!;
  const b = syllables[Math.floor(hash01(seed, 2) * syllables.length)]!;
  const suffix = kind === "universe" ? ["verse", "cosm", "realm"][Math.floor(hash01(seed, 3) * 3)] : kind === "galaxy" ? ["galaxy", "spiral", "cloud"][Math.floor(hash01(seed, 4) * 3)] : "";
  return kind === "star" ? `${a}${b}-${(seed % 9000) + 1000}` : `${a}${b} ${suffix}`.trim();
}

export class CosmosStreamer {
  readonly group = new THREE.Group();
  readonly bodies: StreamBody[] = [];

  private readonly geometry: Record<StreamKind, THREE.BufferGeometry>;
  private readonly points: Record<StreamKind, THREE.Points>;
  private readonly pos: Record<StreamKind, Float32Array>;
  private readonly col: Record<StreamKind, Float32Array>;
  private readonly capacity: Record<StreamKind, number>;
  private readonly counts: Record<StreamKind, number> = { universe: 0, galaxy: 0, star: 0 };
  private readonly cell = new THREE.Vector3(Number.NaN, Number.NaN, Number.NaN);
  private stats = { universes: 0, galaxies: 0, stars: 0 };

  constructor() {
    const make = (kind: StreamKind, size: number, points: number): { geo: THREE.BufferGeometry; pts: THREE.Points; pos: Float32Array; col: Float32Array } => {
      const pos = new Float32Array(CAPACITY[kind] * 3);
      const col = new Float32Array(CAPACITY[kind] * 3);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
      geo.setDrawRange(0, 0);
      const mat = new THREE.PointsMaterial({
        size,
        sizeAttenuation: true,
        vertexColors: true,
        map: SPRITE,
        transparent: true,
        opacity: kind === "star" ? 0.95 : 0.82,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const pts = new THREE.Points(geo, mat);
      pts.frustumCulled = false;
      pts.visible = false;
      pts.renderOrder = -2;
      return { geo, pts, pos, col };
    };
    const u = make("universe", 420, PER_SECTOR.universe);
    const g = make("galaxy", 120, PER_SECTOR.galaxy);
    const s = make("star", 22, PER_SECTOR.star);
    this.geometry = { universe: u.geo, galaxy: g.geo, star: s.geo };
    this.points = { universe: u.pts, galaxy: g.pts, star: s.pts };
    this.pos = { universe: u.pos, galaxy: g.pos, star: s.pos };
    this.col = { universe: u.col, galaxy: g.col, star: s.col };
    this.capacity = { universe: CAPACITY.universe, galaxy: CAPACITY.galaxy, star: CAPACITY.star };
    this.group.add(u.pts, g.pts, s.pts);
  }

  /** Which scale should be streaming at this altitude (camera distance from the origin). */
  static scaleFor(altitude: number): StreamKind {
    if (altitude > 55_000) return "universe";
    if (altitude > 12_000) return "galaxy";
    return "star";
  }

  get activeKind(): StreamKind | null {
    for (const kind of ["universe", "galaxy", "star"] as StreamKind[]) if (this.points[kind].visible) return kind;
    return null;
  }

  get streamedStats(): { universes: number; galaxies: number; stars: number } {
    return { ...this.stats };
  }

  /** Move the streamed neighbourhood if the camera crossed a sector boundary. */
  update(camera: THREE.Vector3, altitude: number, force = false): boolean {
    const kind = CosmosStreamer.scaleFor(altitude);
    for (const k of ["universe", "galaxy", "star"] as StreamKind[]) this.points[k].visible = k === kind;
    if (kind !== "star" && altitude < 12_000) return false;
    const size = SECTOR_SIZE[kind];
    const cx = Math.floor(camera.x / size);
    const cy = Math.floor(camera.y / size);
    const cz = Math.floor(camera.z / size);
    if (!force && cx === this.cell.x && cy === this.cell.y && cz === this.cell.z) return false;
    this.cell.set(cx, cy, cz);
    this.regenerate(kind, cx, cy, cz);
    return true;
  }

  private regenerate(kind: StreamKind, cx: number, cy: number, cz: number): void {
    const pos = this.pos[kind];
    const col = this.col[kind];
    const cap = this.capacity[kind];
    const size = SECTOR_SIZE[kind];
    const per = PER_SECTOR[kind];
    let cursor = 0;
    this.bodies.length = 0;
    let universes = 0;
    let galaxies = 0;
    let stars = 0;

    for (let dx = -SECTOR_RADIUS; dx <= SECTOR_RADIUS; dx += 1) {
      for (let dy = -SECTOR_RADIUS; dy <= SECTOR_RADIUS; dy += 1) {
        for (let dz = -SECTOR_RADIUS; dz <= SECTOR_RADIUS; dz += 1) {
          const sx = cx + dx;
          const sy = cy + dy;
          const sz = cz + dz;
          const seed = ((sx * 73_856_093) ^ (sy * 19_349_663) ^ (sz * 83_492_791)) >>> 0;
          const rng = mulberry32(seed);
          const ox = (sx + 0.5) * size;
          const oy = (sy + 0.5) * size;
          const oz = (sz + 0.5) * size;

          if (kind === "universe") {
            for (let i = 0; i < per && cursor < cap; i += 1) {
              const radius = 900 + rng() * 900;
              const ux = ((sx + rng()) * size) * 0.96 + (rng() - 0.5) * size * 0.5;
              const uy = ((sy + rng()) * size) * 0.72 + (rng() - 0.5) * size * 0.4;
              const uz = ((sz + rng()) * size) * 0.96 + (rng() - 0.5) * size * 0.5;
              const tint = new THREE.Color(TINTS[Math.floor(rng() * TINTS.length)]!);
              // A cosmic-web filament cluster: 14 points strung along a bowed spine.
              const spine = new THREE.Vector3((rng() - 0.5) * 2, (rng() - 0.5) * 2, (rng() - 0.5) * 2).normalize();
              for (let v = 0; v < 14 && cursor < cap; v += 1) {
                const t = (v / 13 - 0.5) * 2;
                const bow = 1 - Math.abs(t) * 0.65;
                const jitter = 0.42 * bow;
                pos[cursor * 3] = ux + spine.x * radius * t + (rng() - 0.5) * radius * jitter;
                pos[cursor * 3 + 1] = uy + spine.y * radius * t + (rng() - 0.5) * radius * jitter;
                pos[cursor * 3 + 2] = uz + spine.z * radius * t + (rng() - 0.5) * radius * jitter;
                const fade = 0.5 + 0.5 * bow;
                col[cursor * 3] = tint.r * fade;
                col[cursor * 3 + 1] = tint.g * fade;
                col[cursor * 3 + 2] = tint.b * fade;
                cursor += 1;
              }
              if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1 && Math.abs(dz) <= 1) {
                universes += 1;
                this.bodies.push({ id: `STR-UNI-${sx}-${sy}-${sz}-${i}`, kind, name: nameFor(kind, seed + i), center: new THREE.Vector3(ux, uy, uz), radius });
              }
            }
          } else if (kind === "galaxy") {
            for (let i = 0; i < per && cursor < cap; i += 1) {
              const radius = 160 + rng() * 480;
              const gx = ox + (rng() - 0.5) * size * 0.92;
              const gy = oy + (rng() - 0.5) * size * 0.5;
              const gz = oz + (rng() - 0.5) * size * 0.92;
              const tint = new THREE.Color(rng() > 0.72 ? 0xffd28e : rng() > 0.45 ? 0x9bb8ff : TINTS[Math.floor(rng() * TINTS.length)]!);
              // Three points per galaxy: core plus two asymmetric arm tips.
              for (let v = 0; v < 3 && cursor < cap; v += 1) {
                const a = rng() * Math.PI * 2;
                const r = v === 0 ? 0 : radius * (0.55 + rng() * 0.5);
                pos[cursor * 3] = gx + Math.cos(a) * r;
                pos[cursor * 3 + 1] = gy + (rng() - 0.5) * radius * 0.16;
                pos[cursor * 3 + 2] = gz + Math.sin(a) * r;
                const fade = v === 0 ? 1 : 0.55;
                col[cursor * 3] = tint.r * fade;
                col[cursor * 3 + 1] = tint.g * fade;
                col[cursor * 3 + 2] = tint.b * fade;
                cursor += 1;
              }
              galaxies += 1;
              if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1 && Math.abs(dz) <= 1) {
                this.bodies.push({ id: `STR-GAL-${sx}-${sy}-${sz}-${i}`, kind, name: nameFor(kind, seed + i), center: new THREE.Vector3(gx, gy, gz), radius });
              }
            }
          } else {
            for (let i = 0; i < per && cursor < cap; i += 1) {
              const a = rng() * Math.PI * 2;
              const r = Math.sqrt(rng()) * size * 0.52;
              // Logarithmic spiral bias: stars concentrate in arms, not a uniform soup.
              const arm = Math.floor(rng() * 4) * (Math.PI / 2);
              const spiral = arm + Math.log(Math.max(1, r)) * 2.1;
              const sx2 = ox + Math.cos(spiral) * r + Math.cos(a) * 20;
              const sy2 = oy + (rng() - 0.5) * size * 0.18;
              const sz2 = oz + Math.sin(spiral) * r + Math.sin(a) * 20;
              const temp = rng();
              const color = temp > 0.82 ? 0x9bb8ff : temp > 0.35 ? 0xffd28e : 0xfff3d9;
              const c = new THREE.Color(color);
              pos[cursor * 3] = sx2;
              pos[cursor * 3 + 1] = sy2;
              pos[cursor * 3 + 2] = sz2;
              col[cursor * 3] = c.r;
              col[cursor * 3 + 1] = c.g;
              col[cursor * 3 + 2] = c.b;
              cursor += 1;
              stars += 1;
              // Only the 27 nearest cells carry pick records: that is enough to tap any star within
              // reach, without allocating 62,500 Vector3 objects every time a sector changes.
              if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1 && Math.abs(dz) <= 1) {
                this.bodies.push({
                  id: `STR-SYS-${sx}-${sy}-${sz}-${i}`,
                  kind,
                  name: nameFor(kind, (seed ^ (i * 2654435761)) >>> 0),
                  center: new THREE.Vector3(sx2, sy2, sz2),
                  radius: 3.2,
                });
              }
            }
          }
        }
      }
    }

    for (const kindKey of [kind] as StreamKind[]) {
      const geometry = this.geometry[kindKey];
      geometry.getAttribute("position").needsUpdate = true;
      geometry.getAttribute("color").needsUpdate = true;
      geometry.setDrawRange(0, cursor);
      this.counts[kindKey] = cursor;
      this.geometry[kindKey].computeBoundingSphere();
    }
    if (kind === "universe") this.stats.universes = universes;
    if (kind === "galaxy") this.stats.galaxies = galaxies;
    if (kind === "star") this.stats.stars = stars;
  }

  /** Active bodies for picking at the current scale (nearest first, bounded). */
  pickable(limit = 500): StreamBody[] {
    return this.bodies.slice(0, limit);
  }

  dispose(): void {
    for (const kind of ["universe", "galaxy", "star"] as StreamKind[]) {
      this.geometry[kind].dispose();
      (this.points[kind].material as THREE.Material).dispose();
    }
  }
}
