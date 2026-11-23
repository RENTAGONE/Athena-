/**
 * Stat-driven system synthesizer.
 *
 * One canonical curriculum record (or a bare procedural seed) maps onto a complete star system: star
 * multiplicity, spectral class, 3–12 worlds, rings, moons, belts, comets, a station and a satellite
 * fleet. The mapping is deterministic and total — every record produces a system, no gaps, no dice.
 *
 * The synthesizer is deliberately pure: it returns a plain spec. Builders turn it into meshes so the
 * same spec can be previewed in the Test Lab, entered from a galaxy star, or serialised in a test.
 */
import {
  clamp01,
  hash01,
  lerp,
  mulberry32,
  pick,
  pickWeighted,
  range,
  sampleSpectral,
  seedFromString,
  type Multiplicity,
  type SpectralClass,
  type StarSpec,
} from "./cosmos-seed.ts";

export type Biome =
  | "oceanic"
  | "gas_giant"
  | "lava"
  | "ice"
  | "crystalline"
  | "lush"
  | "desert"
  | "barren";

export interface BiomeStyle {
  id: Biome;
  label: string;
  texture: string;
  /** Base albedo tint; the PBR builder multiplies the webp map by this. */
  tint: number;
  atmosphere: number;
  /** Ring systems only ever form outside the frost line. */
  rings: boolean;
  /** 0 = no water/cloud deck, 1 = full overcast. */
  clouds: number;
  roughness: number;
  metalness: number;
}

export const BIOMES: readonly BiomeStyle[] = [
  { id: "oceanic", label: "Oceanic world", texture: "planet-ocean-earth", tint: 0x8fb6ff, atmosphere: 0x6fb8ff, rings: false, clouds: 0.75, roughness: 0.55, metalness: 0.05 },
  { id: "gas_giant", label: "Ringed gas giant", texture: "planet-banded-giant", tint: 0xd8b48a, atmosphere: 0xffc98a, rings: true, clouds: 0.9, roughness: 0.85, metalness: 0 },
  { id: "lava", label: "Tidally locked lava world", texture: "planet-volcanic", tint: 0xff8a5c, atmosphere: 0xff7a3c, rings: false, clouds: 0.12, roughness: 0.7, metalness: 0.1 },
  { id: "ice", label: "Ice world", texture: "planet-ice-world", tint: 0xbfe6ff, atmosphere: 0xa8d8ff, rings: false, clouds: 0.28, roughness: 0.35, metalness: 0.04 },
  { id: "crystalline", label: "Crystalline world", texture: "planet-crystal-teal", tint: 0x8ff0e0, atmosphere: 0x7ce8ff, rings: true, clouds: 0.05, roughness: 0.2, metalness: 0.55 },
  { id: "lush", label: "Lush terrestrial", texture: "planet-lush-alien", tint: 0x9fe0a0, atmosphere: 0x9be8c0, rings: false, clouds: 0.6, roughness: 0.62, metalness: 0.02 },
  { id: "desert", label: "Desert canyon world", texture: "planet-rust-desert", tint: 0xe0a878, atmosphere: 0xffb27a, rings: false, clouds: 0.18, roughness: 0.78, metalness: 0.03 },
  { id: "barren", label: "Barren rock", texture: "planet-cratered-grey", tint: 0xa9b2c4, atmosphere: 0x8fa4c0, rings: false, clouds: 0, roughness: 0.9, metalness: 0.02 },
];

const BIOME_BY_ID = new Map(BIOMES.map((b) => [b.id, b]));

export function biomeById(id: Biome): BiomeStyle {
  return BIOME_BY_ID.get(id) ?? BIOMES[7]!;
}

/** Everything a system needs to be built, independent of any rendering framework. */
export interface SystemSpec {
  seed: number;
  /** Stable identity for picking, waypoints and inspector cards. */
  key: string;
  name: string;
  star: StarSpec;
  planets: PlanetSpec[];
  asteroidBelts: BeltSpec[];
  comets: CometSpec[];
  station: boolean;
  /** Number of satellites in the fleet; each one maps to a spacecraft-assembler variant. */
  fleet: number;
  /** Curriculum pressure used for the nebula tint and the station's traffic lights. */
  pressure: number;
  mastery: number;
}

export interface PlanetSpec {
  index: number;
  name: string;
  biome: BiomeStyle;
  /** World radius in atlas units at planetary scale (1.6–3.6). */
  radius: number;
  /** Orbit radius in atlas units (180–1,650). */
  orbit: number;
  /** Orbital inclination, radians. */
  inclination: number;
  /** Sidereal day length in scene seconds. */
  spin: number;
  axialTilt: number;
  moons: MoonSpec[];
  ring: RingSpec | null;
  /** 0..1: real Dexie mastery, drives city lights, the orbital ring and the Dyson swarm. */
  mastery: number;
  /** Tidal lock: one hemisphere always faces the star. */
  tidallyLocked: boolean;
  /** Dayside/nightside split for the lava class; observed-only, never a learner metric. */
  nightLights: boolean;
}

export interface MoonSpec {
  name: string;
  radius: number;
  orbit: number;
  inclination: number;
  texture: string;
  /** Roughness of the moon's regolith, used for the specular response. */
  albedo: number;
}

export interface RingSpec {
  inner: number;
  outer: number;
  /** Cassini-style gap fractions inside the ring. */
  gaps: number[];
  color: number;
  opacity: number;
}

export interface BeltSpec {
  radius: number;
  width: number;
  count: number;
  color: number;
}

export interface CometSpec {
  semiMajor: number;
  eccentricity: number;
  inclination: number;
  /** 0..1 tail brightness, scaled by evidence recency. */
  activity: number;
}

export interface SystemStats {
  domainCount: number;
  skillCount: number;
  masteryRatio: number;
  needsRevisionCount: number;
  tags: string[];
}

export interface SynthesizeInput {
  /** A canonical record id, so the same record always yields the same system. */
  key?: string;
  title?: string;
  /** Canonical curriculum metrics, when a real record exists. */
  stats?: Partial<SystemStats>;
  /** Bare procedural seed, for field stars that have no record behind them. */
  seed?: number;
}

const MOON_TEXTURES = [
  "moon-cratered-moon",
  "moon-carbon-moon",
  "moon-glassy-ice",
  "moon-ice-cracked",
  "moon-rust-moon",
  "moon-chalk-dust",
  "moon-metallic",
  "moon-sulphur-io",
  "moon-green-sulphur",
] as const;

function pressureOf(stats: Partial<SystemStats>): number {
  const domains = stats.domainCount ?? 3;
  const skills = stats.skillCount ?? 8;
  const revision = stats.needsRevisionCount ?? 0;
  const raw = revision / Math.max(1, skills) + (domains > 6 ? 0.2 : 0) + (stats.tags?.length ?? 0) * 0.01;
  return clamp01(raw);
}

/** Spectral class from mastery pressure: strong, stable systems burn hotter and rarer. */
function starFor(rng: () => number, mastery: number, pressure: number): StarSpec {
  let spectral: SpectralClass = sampleSpectral(rng);
  // Mastered systems skew to bright early types; revision-heavy systems skew late and cool.
  if (mastery > 0.72 && rng() < 0.55) spectral = pick(rng, [sampleSpectral(rng)]).id === "M" ? sampleSpectral(rng) : spectral;
  if (pressure > 0.6 && rng() < 0.6) spectral = { ...spectral, color: 0xffb27a, texture: "star-orange-supergiant", temperature: [3_000, 4_200] };

  const multiplicityRoll = rng();
  const multiplicity: Multiplicity = multiplicityRoll < 0.12 + mastery * 0.1 ? "binary" : multiplicityRoll > 0.96 ? "trinary" : "single";
  const mass = range(rng, spectral.mass);
  const radius = range(rng, spectral.radius) * (spectral.id === "BH" || spectral.id === "NS" ? 1 : 1);
  const companions: StarSpec["companions"] = [];
  const companionCount = multiplicity === "single" ? 0 : multiplicity === "binary" ? 1 : 2;
  for (let i = 0; i < companionCount; i += 1) {
    const cs = sampleSpectral(rng);
    companions.push({
      spectral: cs,
      mass: range(rng, cs.mass),
      radius: range(rng, cs.radius),
      separation: (0.4 + rng() * 1.4) * (i + 1),
      color: cs.color,
      texture: cs.texture,
    });
  }
  return {
    spectral,
    mass,
    radius,
    temperature: Math.round(lerp(spectral.temperature[0], spectral.temperature[1], rng())),
    color: spectral.color,
    texture: spectral.texture,
    multiplicity,
    companions,
  };
}

function biomeFor(rng: () => number, orbit: number, mastery: number): BiomeStyle {
  // Real ordering: hot rock inside the frost line, giants beyond it, ice at the rim.
  const roll = rng() + mastery * 0.08;
  if (orbit < 320) return pickWeighted(rng, [
    { value: biomeById("lava"), weight: 4 },
    { value: biomeById("desert"), weight: 3 },
    { value: biomeById("barren"), weight: 2 },
    { value: biomeById("crystalline"), weight: 1 },
  ]);
  if (orbit < 760) {
    if (roll > 0.86) return biomeById("oceanic");
    if (roll > 0.68) return biomeById("lush");
    if (roll > 0.52) return biomeById("desert");
    if (roll > 0.4) return biomeById("crystalline");
    return pickWeighted(rng, [
      { value: biomeById("barren"), weight: 2 },
      { value: biomeById("ice"), weight: 1 },
    ]);
  }
  if (roll > 0.5) return biomeById("gas_giant");
  return pickWeighted(rng, [
    { value: biomeById("ice"), weight: 3 },
    { value: biomeById("gas_giant"), weight: 2 },
    { value: biomeById("barren"), weight: 1 },
  ]);
}

function moonFor(rng: () => number, planetIndex: number, orbit: number, index: number): MoonSpec {
  return {
    name: `M${planetIndex + 1}·${index + 1}`,
    radius: 0.12 + rng() * 0.34,
    orbit: orbit * (0.09 + rng() * 0.05),
    inclination: (rng() - 0.5) * 0.9,
    texture: pick(rng, MOON_TEXTURES),
    albedo: 0.35 + rng() * 0.5,
  };
}

/**
 * Deterministically turn curriculum metrics or a bare seed into a full system. The same input always
 * produces the same system, down to the last moon.
 */
export function synthesizeCustomSystem(input: SynthesizeInput = {}): SystemSpec {
  const key = input.key ?? `PROC-${input.seed ?? 1}`;
  const seed = input.seed ?? seedFromString(key);
  const rng = mulberry32(seed);
  const stats = input.stats ?? {};
  const mastery = clamp01(stats.masteryRatio ?? hash01(seed, 1));
  const pressure = pressureOf(stats);
  const star = starFor(rng, mastery, pressure);

  const domains = Math.max(1, Math.round(stats.domainCount ?? 3 + Math.floor(rng() * 6)));
  const skills = Math.max(1, Math.round(stats.skillCount ?? 6 + Math.floor(rng() * 40)));
  const planetCount = Math.max(3, Math.min(12, domains + (rng() < 0.42 ? 1 : 0)));
  const outer = 1_650;
  const inner = 190 + rng() * 60;

  const planets: PlanetSpec[] = [];
  for (let i = 0; i < planetCount; i += 1) {
    const t = planetCount === 1 ? 0 : i / (planetCount - 1);
    const orbit = lerp(inner, outer, Math.pow(t, 0.86)) + (rng() - 0.5) * 34;
    const biome = biomeFor(rng, orbit, mastery);
    const isGiant = biome.id === "gas_giant";
    const radius = isGiant ? 2.6 + rng() * 1.0 : 1.6 + rng() * 1.6;
    const moonCount = isGiant ? 2 + Math.floor(rng() * 4) : Math.floor(rng() * 3);
    const moons: MoonSpec[] = [];
    for (let m = 0; m < moonCount; m += 1) moons.push(moonFor(rng, i, orbit, m));
    const ring: RingSpec | null =
      biome.rings && orbit > 700
        ? {
            inner: radius * 1.7,
            outer: radius * (2.6 + rng() * 1.1),
            gaps: [0.28 + rng() * 0.05, 0.62 + rng() * 0.06],
            color: isGiant ? 0xe8d2b0 : 0xbfe8ff,
            opacity: 0.62 + rng() * 0.3,
          }
        : null;
    planets.push({
      index: i,
      name: `${input.title?.slice(0, 18) ?? "World"} ${String.fromCharCode(98 + i)}`,
      biome,
      radius,
      orbit,
      inclination: (rng() - 0.5) * 0.07,
      spin: (0.06 + rng() * 0.22) * (isGiant ? 2.2 : 1),
      axialTilt: (rng() - 0.5) * 0.52,
      moons,
      ring,
      mastery: clamp01(mastery * (0.55 + rng() * 0.6)),
      tidallyLocked: orbit < 360 && rng() < 0.5,
      nightLights: biome.id !== "gas_giant" && mastery > 0.25,
    });
  }

  const asteroidBelts: BeltSpec[] = [];
  const beltCount = planets.length > 6 ? 2 : 1;
  for (let b = 0; b < beltCount; b += 1) {
    const at = 700 + b * 520 + rng() * 120;
    asteroidBelts.push({ radius: at, width: 46 + rng() * 52, count: 200 + Math.floor(rng() * 120), color: 0xa8927a });
  }

  const comets: CometSpec[] = [];
  for (let c = 0; c < 2; c += 1) {
    comets.push({
      semiMajor: 900 + rng() * 600,
      eccentricity: 0.45 + rng() * 0.4,
      inclination: (rng() - 0.5) * 0.8,
      activity: 0.4 + rng() * 0.6,
    });
  }

  return {
    seed,
    key,
    name: input.title ?? `Procedural system ${seed.toString(16).slice(0, 6)}`,
    star,
    planets,
    asteroidBelts,
    comets,
    station: skills > 12,
    fleet: Math.max(2, Math.min(96, Math.round(skills / 2) + (stats.tags?.length ?? 0))),
    pressure,
    mastery,
  };
}

/** Canonical curriculum metrics → synthesizer input. */

export function statsFromRecord(record: { id: string; title: string; owner_discipline_id?: string | null; tags?: string[] }, metrics: Partial<SystemStats>): SynthesizeInput {
  return {
    key: record.id,
    title: record.title,
    seed: seedFromString(record.id),
    stats: { ...metrics, tags: record.tags ?? [] },
  };
}
