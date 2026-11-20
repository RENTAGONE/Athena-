// Deep sky for the Knowledge Atlas. The background is a real sphere of stars, a galactic band and
// free-floating dust clouds rather than a flat 2D field, so dragging the camera turns the sky and the
// band swings past the systems. Everything is seeded once, so the sky is stable frame to frame and a
// reload draws exactly the same stars.

import { type Camera, type Vec3, hash01, normalize } from "../app/atlas-graph.ts";

export interface SkyStar {
  dir: Vec3;
  size: number;
  alpha: number;
  tint: string;
  tw: number;
}

export interface SkyLobe {
  dx: number;
  dy: number;
  size: number;
  alpha: number;
}

export interface SkyNebula {
  dir: Vec3;
  /** Angular radius in radians. */
  size: number;
  tint: string;
  lobes: SkyLobe[];
}

export interface Sky {
  /** Evenly spread stars, the ones the eye reads as "space" rather than as a band. */
  field: SkyStar[];
  /** Dense clumps hugging the galactic plane. */
  band: SkyStar[];
  nebulae: SkyNebula[];
}

const STAR_TINTS = ["#ffffff", "#dbe7ff", "#a9c3ff", "#ffe6c4", "#d8c9ff", "#bfe9ff"];
const NEBULA_TINTS = ["#35d9ff", "#a78bfa", "#42e6c4", "#5f7dff", "#c084fc"];

/** Plane of the galaxy: the band is drawn on the great circle perpendicular to this. */
const BAND_NORMAL = normalize({ x: 0.34, y: 0.87, z: -0.36 });

function unit(theta: number, w: number): Vec3 {
  // Basis on the galactic plane (u, v), offset out of the plane by w radians.
  const u = normalize(crossWith(BAND_NORMAL, { x: 0, y: 0, z: 1 }));
  const v = crossWith(BAND_NORMAL, u);
  const c = Math.cos(w);
  return normalize({
    x: u.x * Math.cos(theta) * c + v.x * Math.sin(theta) * c + BAND_NORMAL.x * Math.sin(w),
    y: u.y * Math.cos(theta) * c + v.y * Math.sin(theta) * c + BAND_NORMAL.y * Math.sin(w),
    z: u.z * Math.cos(theta) * c + v.z * Math.sin(theta) * c + BAND_NORMAL.z * Math.sin(w),
  });
}

function crossWith(a: Vec3, b: Vec3): Vec3 {
  return { x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x };
}

/** Fibonacci sphere plus seeded jitter: even coverage without a visible lattice. */
function fieldStar(i: number, total: number): Vec3 {
  const y = 1 - (2 * (i + 0.5)) / total;
  const r = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = i * 2.39996323 + hash01(i, 21) * 0.5;
  return { x: Math.cos(theta) * r, y: y + (hash01(i, 29) - 0.5) * 0.02, z: Math.sin(theta) * r };
}

export function createSky(): Sky {
  const field: SkyStar[] = [];
  const FIELD = 460;
  for (let i = 0; i < FIELD; i += 1) {
    const bright = hash01(i, 41);
    field.push({
      dir: normalize(fieldStar(i, FIELD)),
      // A handful of bright stars carry the frame; the rest are grain.
      size: bright > 0.975 ? 2.2 + hash01(i, 43) * 1.2 : 0.55 + bright * bright * 1.15,
      alpha: 0.35 + hash01(i, 47) * 0.6,
      tint: STAR_TINTS[Math.floor(hash01(i, 53) * STAR_TINTS.length)] ?? "#ffffff",
      tw: hash01(i, 59),
    });
  }

  const band: SkyStar[] = [];
  const BAND = 900;
  for (let i = 0; i < BAND; i += 1) {
    // Triangular distribution: dense on the plane, thinning quickly away from it.
    const w = (hash01(i, 7) + hash01(i, 11) + hash01(i, 13) - 1.5) * 0.19;
    const clump = hash01(i, 61);
    band.push({
      dir: unit(i * 2.39996323 + hash01(i, 3) * 0.08, w),
      size: 0.5 + clump * clump * clump * 1.5,
      alpha: 0.22 + clump * 0.62,
      tint: STAR_TINTS[Math.floor(hash01(i, 67) * STAR_TINTS.length)] ?? "#ffffff",
      tw: hash01(i, 71),
    });
  }

  const nebulae: SkyNebula[] = [];
  for (let i = 0; i < 6; i += 1) {
    const lobes: SkyLobe[] = [];
    for (let k = 0; k < 3; k += 1) {
      lobes.push({
        dx: (hash01(i, k + 80) - 0.5) * 1.1,
        dy: (hash01(i, k + 90) - 0.5) * 0.8,
        size: 0.4 + hash01(i, k + 100) * 0.6,
        alpha: 0.05 + hash01(i, k + 110) * 0.05,
      });
    }
    nebulae.push({
      dir: unit(i * 2.1 + hash01(i, 120) * 0.9, (hash01(i, 130) - 0.5) * 0.5),
      size: 0.16 + hash01(i, 140) * 0.16,
      tint: NEBULA_TINTS[i % NEBULA_TINTS.length] ?? "#35d9ff",
      lobes,
    });
  }

  return { field, band, nebulae };
}

function rgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  if (h.length !== 6) return `rgba(255,255,255,${alpha})`;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/**
 * Draws the whole deep-sky layer: dust clouds, the galactic band, then the ordinary stars. Points are
 * rotated into camera space and projected gnomonically, so a yaw drag turns the whole sky instead of
 * sliding a texture, and stars near the edge sweep out of frame as they would in a real view.
 */
export function drawSky(
  ctx: CanvasRenderingContext2D,
  sky: Sky,
  cam: Camera,
  width: number,
  height: number,
  t: number,
  reduceMotion: boolean,
): void {
  const cy = Math.cos(cam.yaw);
  const sy = Math.sin(cam.yaw);
  const cp = Math.cos(cam.pitch);
  const sp = Math.sin(cam.pitch);
  const k = Math.min(width, height) * 0.95;
  const cx = width / 2;
  const cyy = height / 2;

  const rotate = (d: Vec3): { x: number; y: number; z: number } => {
    const x1 = d.x * cy - d.z * sy;
    const z1 = d.x * sy + d.z * cy;
    const y2 = d.y * cp - z1 * sp;
    const z2 = d.y * sp + z1 * cp;
    return { x: x1, y: y2, z: z2 };
  };

  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  // Dust clouds first, so stars sit inside them rather than behind a curtain.
  for (const n of sky.nebulae) {
    const p = rotate(n.dir);
    if (p.z <= 0.2) continue;
    const px = cx + (p.x / p.z) * k;
    const py = cyy - (p.y / p.z) * k;
    const rad = Math.min(Math.max(width, height) * 1.1, (n.size * k) / p.z);
    if (px < -rad || px > width + rad || py < -rad || py > height + rad) continue;
    // Fade a cloud out as it leaves the field instead of popping at the edge.
    const edge = Math.min(1, (p.z - 0.2) * 2.4);
    for (const l of n.lobes) {
      const lx = px + l.dx * rad;
      const ly = py + l.dy * rad;
      const lr = Math.max(2, l.size * rad);
      const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, lr);
      g.addColorStop(0, rgba(n.tint, l.alpha * edge));
      g.addColorStop(0.45, rgba(n.tint, l.alpha * 0.42 * edge));
      g.addColorStop(1, rgba(n.tint, 0));
      ctx.fillStyle = g;
      ctx.fillRect(lx - lr, ly - lr, lr * 2, lr * 2);
    }
  }

  const plot = (stars: SkyStar[], bandPass: boolean): void => {
    for (const s of stars) {
      const p = rotate(s.dir);
      if (p.z <= 0.12) continue;
      const sx = cx + (p.x / p.z) * k;
      const syy = cyy - (p.y / p.z) * k;
      if (sx < -12 || sx > width + 12 || syy < -12 || syy > height + 12) continue;
      // Depth cue: stars nearly edge-on to the view dim very slightly, so the sky has bulk.
      const depth = Math.min(1, 0.55 + p.z * 0.6);
      const twinkle = reduceMotion ? 1 : 0.74 + 0.26 * Math.sin(t * 0.7 + s.tw * 6.283);
      const a = s.alpha * depth * twinkle * (bandPass ? 0.92 : 1);
      ctx.globalAlpha = a;
      ctx.fillStyle = s.tint;
      if (s.size > 1.15) {
        ctx.beginPath();
        ctx.arc(sx, syy, s.size * 0.72, 0, Math.PI * 2);
        ctx.fill();
        // Bright stars get a faint cross, the way a camera sees them.
        if (s.size > 2.1) {
          ctx.globalAlpha = a * 0.34;
          ctx.fillRect(sx - s.size * 4.5, syy - 0.4, s.size * 9, 0.8);
          ctx.fillRect(sx - 0.4, syy - s.size * 4.5, 0.8, s.size * 9);
        }
      } else {
        ctx.fillRect(sx, syy, s.size, s.size);
      }
    }
  };
  plot(sky.band, true);
  plot(sky.field, false);

  ctx.globalAlpha = 1;
  ctx.restore();
}
