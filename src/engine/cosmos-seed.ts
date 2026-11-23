/**
 * Deterministic cosmic seeds.
 *
 * Everything downstream — a whole universe, a galaxy arm, a planet biome, a satellite bus — is a
 * pure function of a 32-bit seed. No `Math.random()` is allowed in the engine: a reload, a sector
 * re-entry or a screenshot run must reproduce exactly the same sky.
 */

/** Mulberry32: 32-bit PRNG, fast enough to seed 60,000 stars inside a frame budget. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Stateless 0..1 hash of up to four integers, so a value never depends on call order. */
export function hash01(a: number, b = 0, c = 0, d = 0): number {
  let h = 0x811c9dc5 ^ Math.imul(a | 0, 0x9e3779b1);
  h = Math.imul(h ^ (b | 0), 0x85ebca6b);
  h = Math.imul(h ^ (c | 0), 0xc2b2ae35);
  h = Math.imul(h ^ (d | 0), 0x27d4eb2f);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

/** Deterministic seed for a canonical string id: stable across sessions and machines. */
export function seedFromString(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export type Range = readonly [number, number];

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp01(n: number): number {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

export function range(rng: () => number, [lo, hi]: Range): number {
  return lo + (hi - lo) * rng();
}

export function pick<T>(rng: () => number, list: readonly T[]): T {
  return list[Math.min(list.length - 1, Math.floor(rng() * list.length))]!;
}

export function pickWeighted<T>(rng: () => number, list: readonly { value: T; weight: number }[]): T {
  const total = list.reduce((sum, item) => sum + item.weight, 0);
  let roll = rng() * total;
  for (const item of list) {
    roll -= item.weight;
    if (roll <= 0) return item.value;
  }
  return list[list.length - 1]!.value;
}

/** A spectral class with the mass, radius, temperature and colour astronomy actually uses. */
export interface SpectralClass {
  id: "O" | "B" | "A" | "F" | "G" | "K" | "M" | "WD" | "NS" | "BH";
  label: string;
  /** Solar masses. */
  mass: readonly [number, number];
  /** Solar radii. */
  radius: readonly [number, number];
  /** Kelvin. */
  temperature: readonly [number, number];
  /** Photosphere colour used to tint the shared star textures. */
  color: number;
  /** Relative frequency in a magnitude-limited survey. */
  weight: number;
  texture: string;
}

/**
 * Real main-sequence proportions, compressed: M dwarfs dominate, O stars are rare. `WD`, `NS` and
 * `BH` are evolutionary endpoints the synthesizer may select from curriculum pressure instead.
 */
export const SPECTRAL_CLASSES: readonly SpectralClass[] = [
  { id: "O", label: "O · blue supergiant", mass: [16, 90], radius: [6.6, 15], temperature: [30_000, 52_000], color: 0x9bb8ff, weight: 0.4, texture: "star-blue-hot" },
  { id: "B", label: "B · blue-white", mass: [2.1, 16], radius: [1.8, 6.6], temperature: [10_000, 30_000], color: 0xaecbff, weight: 2.6, texture: "star-blue-hot" },
  { id: "A", label: "A · white", mass: [1.4, 2.1], radius: [1.4, 1.8], temperature: [7_500, 10_000], color: 0xe8f1ff, weight: 5.4, texture: "star-white-dwarf" },
  { id: "F", label: "F · yellow-white", mass: [1.04, 1.4], radius: [1.15, 1.4], temperature: [6_000, 7_500], color: 0xfff4e2, weight: 8, texture: "star-sun-granulation" },
  { id: "G", label: "G · yellow dwarf", mass: [0.8, 1.04], radius: [0.96, 1.15], temperature: [5_200, 6_000], color: 0xffe9b8, weight: 12, texture: "star-gold-g" },
  { id: "K", label: "K · orange dwarf", mass: [0.45, 0.8], radius: [0.7, 0.96], temperature: [3_700, 5_200], color: 0xffd28e, weight: 20, texture: "star-orange-dwarf" },
  { id: "M", label: "M · red dwarf", mass: [0.08, 0.45], radius: [0.15, 0.7], temperature: [2_400, 3_700], color: 0xff9a6b, weight: 42, texture: "star-red-giant" },
  { id: "WD", label: "white dwarf", mass: [0.5, 1.4], radius: [0.008, 0.02], temperature: [6_000, 40_000], color: 0xdff0ff, weight: 1.2, texture: "star-white-dwarf" },
  { id: "NS", label: "neutron star", mass: [1.2, 2.1], radius: [0.00002, 0.00003], temperature: [600_000, 1_000_000], color: 0xbfe5ff, weight: 0.35, texture: "star-neutron-crust" },
  { id: "BH", label: "black hole", mass: [3, 40], radius: [0.0001, 0.0002], temperature: [0, 0], color: 0x000000, weight: 0.15, texture: "star-carbon-star" },
];

/** Multiplicity from the mass ratio and the local record's pressure (see `synthesizeSystem`). */
export type Multiplicity = "single" | "binary" | "trinary";

export interface StarSpec {
  spectral: SpectralClass;
  mass: number;
  radius: number;
  /** Kelvin, faked above ~50,000 K so the shader stays in float range. */
  temperature: number;
  color: number;
  texture: string;
  multiplicity: Multiplicity;
  /** Companion separations in AU, one per companion. */
  companions: { spectral: SpectralClass; separation: number; mass: number; radius: number; color: number; texture: string }[];
}

const SPECTRAL_BY_ID = new Map(SPECTRAL_CLASSES.map((c) => [c.id, c]));

/** Sample a main-sequence class with the survey weights above. */
export function sampleSpectral(rng: () => number): SpectralClass {
  return pickWeighted(
    rng,
    SPECTRAL_CLASSES.filter((c) => c.id !== "BH" && c.id !== "NS" && c.id !== "WD").map((value) => ({
      value,
      weight: value.weight,
    })),
  );
}

export function spectralById(id: SpectralClass["id"]): SpectralClass {
  return SPECTRAL_BY_ID.get(id) ?? SPECTRAL_CLASSES[4]!;
}

/**
 * Physical plausibility guard: a star cannot be smaller than a white dwarf nor larger than the
 * largest known supergiant, and its temperature must sit inside its class envelope.
 */
export function clampStar(mass: number, radius: number, temperature: number, spectral: SpectralClass): StarSpec["companions"][number] {
  return {
    spectral,
    mass: Math.max(0.08, Math.min(90, mass)),
    radius: Math.max(0.008, Math.min(30, radius)),
    separation: 0,
    color: spectral.color,
    texture: spectral.texture,
  };
}
