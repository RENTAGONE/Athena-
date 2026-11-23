/**
 * The atlas in three dimensions.
 *
 * Every body is real geometry: disciplines are 42-unit stars with a PointLight at their centre,
 * domains are 1.6–3.6-unit spheres on 180–1,650-unit orbits, skills are 0.32–0.75-unit moons, and
 * subskills are multi-part satellites a few tenths of a unit across. Nothing here is a camera-facing
 * sprite standing in for a body — the only sprites are the corona glow and the galaxy haze.
 *
 * The camera is free: it orbits any target through a full 360°, dollies along the ray under the
 * cursor from 0.9 units (a satellite hull) out to 22,000 units (the whole local group), pans with
 * two fingers or WASD, and rides a selected body's orbital displacement so a moving planet can be
 * inspected without the camera drifting off it.
 *
 * Scale honesty: the atlas has no real units, so the HUD conversion is declared, not invented —
 * 1 AU is the 1,650-unit outer orbit. Distances below 0.006 AU read in km, above 6,000 AU in
 * light-years, and no learner metric is ever derived from camera distance.
 */
import * as THREE from "three";
import type { Galaxy, GalaxyStar, MasteryTier } from "../app/selectors.ts";
import { DENSE_STARS_PER_GALAXY, hash01, separatedStarPositions, SpatialHash3D, type Vec3 } from "../app/atlas-graph.ts";
import { moonMap, planetMap, starMap } from "./textures.ts";
import { DISCIPLINE_BY_ID } from "./disciplines.ts";
import type { NodeRecord } from "../domain/types.ts";
import { buildSatellite, buildStation, SATELLITE_VARIANTS } from "../engine/spacecraft-assembler.ts";
import { createBlackHole, createPulsar, createQuasar, createWormhole } from "../engine/blackhole-quasar.ts";
import { CosmosStreamer } from "../engine/cosmos-streamer.ts";
import { synthesizeCustomSystem } from "../engine/system-synthesizer.ts";
import { buildShowcasePlanet, biomeById, buildSystem as buildEngineSystem } from "../engine/planet-star-builder.ts";

/** Minimum 3D separation between two discipline systems, in world units. */
export const SYSTEM_SEPARATION = 4200;
/** Radius of the sphere the systems are placed on. */
export const SYSTEM_SPHERE = 8600;
export const STAR_RADIUS = 42;
export const MIN_CAMERA_DISTANCE = 0.9;
export const MAX_CAMERA_DISTANCE = 96_000;
/** One astronomical unit, declared as the outer orbital radius of the atlas. */
export const UNITS_PER_AU = 1650;
/** Half-edge of the multiverse containment cube, in world units. */
export const MULTIVERSE_HALF = 30_000;
/** The cube fades in only once the camera pulls back past this distance. */
export const MULTIVERSE_REVEAL = 32_000;
export const UNIVERSE_COUNT = 24;
export const FIELD_GALAXY_COUNT = 184;
export const BASE_FOV = 55;

/** A body that is not a knowledge record: a universe, galaxy, black hole or orbital station. */
export interface CosmicBody {
  id: string;
  kind: "universe" | "galaxy" | "blackhole" | "quasar" | "bottleneck" | "station";
  name: string;
  center: THREE.Vector3;
  /** Pick radius in world units. */
  radius: number;
  /** Related record titles shown in the inspector (quasar transfer bridges, overdue skills). */
  detail?: string[];
}

export type BodyKind = "star" | "planet" | "moon" | "satellite" | "asteroid" | "constellation";

export interface AtlasBody {
  id: string;
  node: NodeRecord;
  kind: BodyKind;
  system: number;
  tier: MasteryTier;
  /** Drawn radius in world units. */
  radius: number;
  label: string;
  /** The node that owns this body, used for the breadcrumb chain. */
  parentId: string | null;
  /** An unassigned custom/frontier record drawn as a violet wanderer on the rim. */
  rogue?: boolean;
}

export interface AtlasViewState {
  distance: number;
  /** Discipline star the camera is inside, or null at galaxy range. */
  system: number | null;
  focused: string | null;
}

export interface AtlasSceneCallbacks {
  canvas: HTMLCanvasElement;
  labelCanvas: HTMLCanvasElement;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
  onState: (state: AtlasViewState) => void;
  /** A universe, galaxy, black hole or station was tapped. */
  onInspect?: (body: CosmicBody | null) => void;
}

const clamp = (n: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, n));

/** Reused frame vectors: eclipse tests must never allocate on a 60 Hz path. */
const SCRATCH_A = new THREE.Vector3();
const SCRATCH_B = new THREE.Vector3();
const SCRATCH_C = new THREE.Vector3();
const SCRATCH_D = new THREE.Vector3();

/** A gentle 8 ms haptic on lock or warp. Silently absent on desktop and on browsers without it. */
function pulse(ms = 8): void {
  try {
    if (typeof navigator !== "undefined") navigator.vibrate?.(ms);
  } catch {
    /* vibration can be blocked by policy; never let it break a gesture */
  }
}

/** WebGL availability, checked before a renderer is constructed so a headless browser gets a clean
 *  message instead of an exception on mount. */
export function webglAvailable(): boolean {
  try {
    const probe = document.createElement("canvas");
    return Boolean(probe.getContext("webgl2") ?? probe.getContext("webgl"));
  } catch {
    return false;
  }
}

/** A soft round dot for every point sprite: square points are the giveaway of a cheap star field. */
const SOFT_DOT = (() => {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const g = canvas.getContext("2d");
  if (g) {
    const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.35, "rgba(255,255,255,0.55)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
})();

/** One unit sphere shared by every body; meshes scale it instead of duplicating segment buffers. */
/*
 * A crisp stellar point, not a grey blur: a white-hot core inside a sharp spectral glow, crossed by
 * a four-point diffraction flare. Points are the far LOD, so this texture is what the sky actually
 * looks like at galaxy and multiverse range.
 */
const CRISP_STAR = (() => {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const c = size / 2;
  const halo = ctx.createRadialGradient(c, c, 0, c, c, c);
  halo.addColorStop(0, "rgba(255,255,255,1)");
  halo.addColorStop(0.09, "rgba(255,252,240,0.98)");
  halo.addColorStop(0.2, "rgba(200,230,255,0.5)");
  halo.addColorStop(0.42, "rgba(120,175,255,0.12)");
  halo.addColorStop(1, "rgba(60,110,220,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, size, size);
  // Diffraction spikes: long horizontal and vertical needles, brightest at the core.
  ctx.globalCompositeOperation = "lighter";
  for (const [w, h] of [[1.6, size * 0.96], [size * 0.96, 1.6]] as const) {
    const g = ctx.createLinearGradient(0, 0, w > h ? size : 0, w > h ? 0 : size);
    g.addColorStop(0, "rgba(180,220,255,0)");
    g.addColorStop(0.5, "rgba(255,255,255,0.85)");
    g.addColorStop(1, "rgba(180,220,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(c - w / 2, c - h / 2, w, h);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
})();

const UNIT_SPHERE = new THREE.SphereGeometry(1, 40, 28);
const UNIT_SPHERE_LO = new THREE.SphereGeometry(1, 24, 16);
const SHARED_GEOMETRY = new Set<THREE.BufferGeometry>([UNIT_SPHERE, UNIT_SPHERE_LO]);

/** One set of station parts shared by every orbital station in the scene. */
const STATION_PARTS = {
  ring: new THREE.TorusGeometry(0.62, 0.055, 10, 40),
  ring2: new THREE.TorusGeometry(0.42, 0.036, 8, 32),
  truss: new THREE.BoxGeometry(0.95, 0.05, 0.05),
  hub: new THREE.SphereGeometry(0.15, 14, 10),
  bay: new THREE.BoxGeometry(0.2, 0.09, 0.11),
  wing: new THREE.BoxGeometry(0.62, 0.012, 0.2),
  dock: new THREE.CylinderGeometry(0.13, 0.15, 0.34, 14, 1, true),
  pylon: new THREE.BoxGeometry(0.05, 0.05, 0.46),
  beacon: new THREE.SphereGeometry(0.028, 8, 6),
};
SHARED_GEOMETRY.add(STATION_PARTS.ring).add(STATION_PARTS.ring2).add(STATION_PARTS.truss).add(STATION_PARTS.hub).add(STATION_PARTS.bay)
  .add(STATION_PARTS.wing).add(STATION_PARTS.dock).add(STATION_PARTS.pylon).add(STATION_PARTS.beacon);

/** Stellar rays: soft cross + radial streaks, drawn as one additive quad around a star. */
const STELLAR_RAYS = (() => {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const g = canvas.getContext("2d");
  if (g) {
    g.translate(size / 2, size / 2);
    const halo = g.createRadialGradient(0, 0, 0, 0, 0, size / 2);
    halo.addColorStop(0, "rgba(255,250,240,0.55)");
    halo.addColorStop(0.25, "rgba(255,240,220,0.16)");
    halo.addColorStop(1, "rgba(255,240,220,0)");
    g.fillStyle = halo;
    g.fillRect(-size / 2, -size / 2, size, size);
    for (let i = 0; i < 22; i += 1) {
      const a = (i / 22) * Math.PI * 2 + 0.2;
      const len = size * (0.2 + ((i * 37) % 11) / 44);
      g.strokeStyle = `rgba(255,246,232,${0.05 + ((i * 13) % 7) / 90})`;
      g.lineWidth = i % 3 === 0 ? 1.6 : 0.8;
      g.beginPath();
      g.moveTo(Math.cos(a) * size * 0.04, Math.sin(a) * size * 0.04);
      g.lineTo(Math.cos(a) * len, Math.sin(a) * len);
      g.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
})();

/** Wispy procedural cloud deck, generated once and shared: the alpha map for every planet cloud layer. */
const CLOUD_MAP = (() => {
  const w = 512;
  const h = 256;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const g = canvas.getContext("2d");
  if (g) {
    g.clearRect(0, 0, w, h);
    for (let i = 0; i < 260; i += 1) {
      const x = hash01(i, 71) * w;
      const y = (0.06 + hash01(i, 72) * 0.88) * h;
      const rx = 16 + hash01(i, 73) * 62;
      const ry = 4 + hash01(i, 74) * 12;
      const grad = g.createRadialGradient(x, y, 0, x, y, rx);
      grad.addColorStop(0, `rgba(255,255,255,${0.16 + hash01(i, 75) * 0.3})`);
      grad.addColorStop(1, "rgba(255,255,255,0)");
      g.save();
      g.translate(x, y);
      g.scale(1, ry / rx);
      g.translate(-x, -y);
      g.fillStyle = grad;
      g.fillRect(x - rx, y - rx, rx * 2, rx * 2);
      g.restore();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  return tex;
})();

const textureCache = new Map<string, THREE.Texture>();
function loadTexture(url: string): THREE.Texture {
  const hit = textureCache.get(url);
  if (hit) return hit;
  const tex = new THREE.TextureLoader().load(url);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.wrapS = THREE.RepeatWrapping;
  textureCache.set(url, tex);
  return tex;
}

function radialSprite(inner: string, outer: string, size = 128): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const g = canvas.getContext("2d");
  if (g) {
    const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, inner);
    grad.addColorStop(0.32, outer);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** One shared constellation haze texture: creating a canvas per family would cost hundreds of textures. */
const CONSTELLATION_HAZE = radialSprite("rgba(53,217,255,0.34)", "rgba(70,80,200,0.05)");
const ROGUE_AURA = radialSprite("rgba(167,139,250,0.55)", "rgba(255,198,109,0.12)");

function surfaceSeed(code: string): number {
  let h = 2166136261;
  for (let i = 0; i < code.length; i += 1) {
    h ^= code.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

const TIER_COLOR: Record<MasteryTier, number> = {
  unassessed: 0x71819f,
  needs_revision: 0xffc66d,
  demonstrated: 0x42e6c4,
  mastered: 0x42e6c4,
};

interface OrbitMotion {
  pivot: THREE.Object3D;
  holder: THREE.Object3D;
  phase: number;
  omega: number;
  body: AtlasBody;
}

interface SystemNode {
  index: number;
  code: string;
  color: THREE.Color;
  group: THREE.Group;
  star: THREE.Mesh;
  corona: THREE.Sprite;
  light: THREE.PointLight;
  planets: THREE.Group;
  moons: THREE.Group;
  satellites: THREE.Group;
  /** Belts, comets and megastructures: hidden together with the planets at galaxy range. */
  small: THREE.Group;
  label: string;
  /** Tier-C spectral beacon: a constant-screen-size point that survives past 7,500 units. */
  beacon: THREE.Sprite;
  /** Mastery heatmap halo: shown only while the Heatmap chip is on. */
  heat: THREE.Sprite;
  /** Progression-hardlock sensor fog: an unverified system stays behind this until evidence lands. */
  fog: THREE.Sprite;
  /** Constellation threads: only drawn at close range, never as a cage around the whole galaxy. */
  wires: THREE.LineSegments[];
}

/**
 * A single WebGL canvas, its orbit rig and the 2D label overlay above it. All state that changes per
 * frame lives here rather than in React, so a 60 Hz camera never re-renders a component tree.
 */
export class AtlasScene {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly labelCtx: CanvasRenderingContext2D | null;
  private readonly callbacks: AtlasSceneCallbacks;
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();

  /** Everything built from the current galaxy; disposed on rebuild. */
  private root = new THREE.Group();
  private systems: SystemNode[] = [];
  private bodies = new Map<string, AtlasBody>();
  private pickables: THREE.Object3D[] = [];
  private motions: OrbitMotion[] = [];
  private bodyObject = new Map<string, THREE.Object3D>();
  private spinMats: THREE.ShaderMaterial[] = [];
  private clouds: { mesh: THREE.Mesh; speed: number }[] = [];
  private binaries: { pivot: THREE.Object3D; bridge: THREE.Mesh; phase: number; separation: number }[] = [];
  private moonRingMats: { mat: THREE.LineBasicMaterial; system: number }[] = [];
  /** Moons with their planet and a shadow-cone shell, evaluated every frame. */
  private moonEclipses: {
    moon: THREE.Object3D;
    shell: THREE.Mesh;
    planet: THREE.Object3D;
    planetRadius: number;
    system: number;
  }[] = [];
  private starFlares: { mesh: THREE.Object3D; mat: THREE.MeshBasicMaterial; phase: number; speed: number }[] = [];
  private belts: { holder: THREE.Object3D; spin: number }[] = [];
  private comets: {
    holder: THREE.Object3D;
    tail: THREE.Object3D;
    coma: THREE.Sprite;
    tailMat: THREE.MeshBasicMaterial;
    a: number;
    e: number;
    phase: number;
    speed: number;
    yaw: number;
  }[] = [];
  private megaStructures: { mesh: THREE.Object3D; speed: number }[] = [];
  private dysonSwarms: { group: THREE.Object3D; speed: number }[] = [];
  private progress = new Map<string, number>();
  private nightShaders: { mat: THREE.ShaderMaterial; body: AtlasBody }[] = [];
  private ringShaders: { mat: THREE.ShaderMaterial; mesh: THREE.Mesh }[] = [];

  /* constellation threads, rogue wanderers and the infinite dense field */
  private constellationTags: { pos: THREE.Vector3; label: string; color: string }[] = [];
  private rogues: { holder: THREE.Object3D; angle: number; radius: number; y: number; speed: number }[] = [];
  private infinitePoints: THREE.Points | null = null;
  private infiniteCell = "";
  private readonly infiniteHash = new SpatialHash3D<number>(2600);
  /** Frame-time guardian: rolling average and the current render quality multiplier. */
  private frameAvg = 16;
  private quality = 1;
  private guardClock = 0;

  /* multiverse scale, built once and never rebuilt with the galaxy */
  private readonly cosmos = new THREE.Group();
  private readonly multiverse = new THREE.Group();
  private readonly galaxyField = new THREE.Group();
  private cosmicBodies: CosmicBody[] = [];
  private stations: {
    holder: THREE.Object3D;
    craft: THREE.Object3D;
    cosmic: CosmicBody;
    rings: THREE.Object3D[];
    beacons: { mat: THREE.MeshBasicMaterial; phase: number }[];
    bay: THREE.Mesh;
  }[] = [];
  private diskMats: THREE.ShaderMaterial[] = [];
  private clusterGlows: { sprite: THREE.Sprite; center: THREE.Vector3 }[] = [];

  /* camera rig */
  private target = new THREE.Vector3(0, 0, 0);
  private yaw = 0.62;
  private pitch = 1.06;
  private distance = 20_000;
  /* Inertial targets: pointer input moves these, the frame damps the camera toward them. */
  private yawGoal = 0.62;
  private pitchGoal = 1.06;
  private distanceGoal = 20_000;
  private follow: string | null = null;
  private followPrev = new THREE.Vector3();
  private glide: {
    from: { target: THREE.Vector3; distance: number; yaw: number; pitch: number };
    to: { target: THREE.Vector3; distance: number; yaw: number; pitch: number };
    start: number;
    dur: number;
  } | null = null;

  /* hyperspace */
  private warp: {
    from: { target: THREE.Vector3; distance: number; yaw: number; pitch: number };
    to: { target: THREE.Vector3; distance: number; yaw: number; pitch: number };
    start: number;
    dur: number;
    follow: string | null;
    reticle: THREE.Vector3;
  } | null = null;
  private warpLines!: THREE.LineSegments;
  private warpShock!: THREE.Group;
  private warpShockMats: THREE.MeshBasicMaterial[] = [];
  private warpJitter = new THREE.Vector3();
  private warpSeed: { a: number; r: number; z: number; len: number; speed: number }[] = [];

  /* interaction */
  private pointers = new Map<number, { x: number; y: number }>();
  private dragMode: "orbit" | "pan" = "orbit";
  private draggedDistance = 0;
  private pinchStart = 0;
  private pinchDistanceValue = 0;
  private pointerAt = { x: 0, y: 0 };
  /** The steady bottom-left flight stick: armed on touch, live only after an 8 px drag. */
  private stick: { id: number; origin: { x: number; y: number }; vector: { x: number; y: number }; active: boolean } | null = null;
  /** Mastery heatmap state and the live tier map it colours from. */
  private heatmap = false;
  private heatTiers = new Map<string, MasteryTier>();
  private readonly tetherFlashes: { line: THREE.Line; born: number }[] = [];
  /** Engine phenomena that animate themselves (quasars, pulsars, wormholes, black holes). */
  private readonly stationsInteriors: THREE.Group[] = [];
  private readonly phenomena: { object: THREE.Object3D; update?: (elapsed: number) => void }[] = [];
  /** Infinite 360° sector streamer: multiverse → universe → galaxy → star field. */
  private readonly streamer = new CosmosStreamer();
  private progressionLocked = false;
  private masteryOverride: number | null = null;
  /** A Test Lab object placed in front of the camera, replaced on every preview. */
  private showcase: { group: THREE.Group; update?: (elapsed: number) => void; label: string } | null = null;
  private stationInteriorPreview: THREE.Group | null = null;
  private hovered: string | null = null;
  private selected: string | null = null;
  private filter: string | null = null;
  private home: string | null = null;
  private timeScale = 1;
  private elapsed = 0;
  private lastFrame = 0;
  private width = 1;
  private height = 1;
  private dpr = 1;
  private running = true;
  private stateClock = 0;
  private disposed = false;
  private readonly keys = new Set<string>();
  private readonly ro: ResizeObserver;
  private readonly cleanup: (() => void)[] = [];

  constructor(callbacks: AtlasSceneCallbacks) {
    this.callbacks = callbacks;
    const canvas = callbacks.canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance", alpha: false, logarithmicDepthBuffer: true });
    this.renderer.setClearColor(0x05080f, 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.camera = new THREE.PerspectiveCamera(BASE_FOV, 1, 0.05, 2_400_000);
    this.labelCtx = callbacks.labelCanvas.getContext("2d");
    this.scene.background = new THREE.Color(0x05080f);
    this.scene.add(this.root);
    this.scene.add(new THREE.AmbientLight(0x9db4e0, 0.14));
    this.scene.add(this.camera);
    this.buildBackdrop();
    this.buildInfiniteField();
    this.buildCosmos();
    this.buildWarpTunnel();

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas);
    this.resize();

    this.bindPointer(canvas);
    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      this.keys.add(e.key.toLowerCase());
      if (e.key === "Escape") this.reset();
    };
    const onKeyUp = (e: KeyboardEvent): void => {
      this.keys.delete(e.key.toLowerCase());
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    this.cleanup.push(() => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    });

    this.lastFrame = performance.now();
    this.renderer.setAnimationLoop(() => this.frame());
  }

  /* ── construction ─────────────────────────────────────────────────────── */

  private buildBackdrop(): void {
    // A real star sphere, far outside every orbit, plus the local group's three dust clouds.
    const count = 2600;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const tints = [new THREE.Color(0xcfe0ff), new THREE.Color(0xffffff), new THREE.Color(0xa9c4ff), new THREE.Color(0xffe0bd)];
    for (let i = 0; i < count; i += 1) {
      const u = hash01(i, 11) * 2 - 1;
      const a = hash01(i, 12) * Math.PI * 2;
      const r = 260_000 + hash01(i, 13) * 140_000;
      const s = Math.sqrt(Math.max(0, 1 - u * u));
      positions[i * 3] = Math.cos(a) * s * r;
      positions[i * 3 + 1] = u * r;
      positions[i * 3 + 2] = Math.sin(a) * s * r;
      const c = tints[i % tints.length]!;
      const b = 0.35 + hash01(i, 14) * 0.65;
      colors[i * 3] = c.r * b;
      colors[i * 3 + 1] = c.g * b;
      colors[i * 3 + 2] = c.b * b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size: 2_200,
      sizeAttenuation: true,
      vertexColors: true,
      map: SOFT_DOT,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.scene.add(new THREE.Points(geo, mat));
  }

  /**
   * The infinite cosmos: 27 spatial-hash cells of seeded stars tile around the camera, and a new ring
   * of cells is built only when the camera crosses a cell boundary. Panning or zooming out never
   * reaches an edge, and the hash prevents two cells from stacking a star on the same point.
   */
  private buildInfiniteField(): void {
    const perCell = 480;
    const cells = 27;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(perCell * cells * 3), 3));
    geo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(perCell * cells * 3), 3));
    const points = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        size: 150,
        sizeAttenuation: true,
        vertexColors: true,
        map: CRISP_STAR,
        transparent: true,
        opacity: 0.72,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    points.frustumCulled = false;
    points.renderOrder = -1;
    this.scene.add(points);
    this.infinitePoints = points;
    this.ensureInfiniteField(new THREE.Vector3(0, 0, 0), true);
  }

  private ensureInfiniteField(at: THREE.Vector3, force = false): void {
    const size = 18_000;
    const cx = Math.round(at.x / size);
    const cy = Math.round(at.y / size);
    const cz = Math.round(at.z / size);
    const key = `${cx},${cy},${cz}`;
    if (!force && key === this.infiniteCell) return;
    this.infiniteCell = key;
    this.infiniteHash.clear();
    const geo = this.infinitePoints?.geometry;
    if (!geo) return;
    const pos = geo.getAttribute("position") as THREE.BufferAttribute;
    const col = geo.getAttribute("color") as THREE.BufferAttribute;
    const perCell = 480;
    const tints = [new THREE.Color(0xcfe0ff), new THREE.Color(0xffffff), new THREE.Color(0x9fc0ff), new THREE.Color(0xffe0bd)];
    let w = 0;
    for (let ix = -1; ix <= 1; ix += 1) {
      for (let iy = -1; iy <= 1; iy += 1) {
        for (let iz = -1; iz <= 1; iz += 1) {
          const gx = cx + ix;
          const gy = cy + iy;
          const gz = cz + iz;
          for (let i = 0; i < perCell; i += 1) {
            const px = gx * size + (hash01(gx, gy, gz, i, 1) - 0.5) * size;
            const py = gy * size + (hash01(gx, gy, gz, i, 2) - 0.5) * size * 0.8;
            const pz = gz * size + (hash01(gx, gy, gz, i, 3) - 0.5) * size;
            // Spatial hash: keep the field free of coincident stars when two cell builds overlap.
            if (this.infiniteHash.query(px, py, pz, 20).length > 0) continue;
            this.infiniteHash.insert(w, px, py, pz);
            pos.setXYZ(w, px, py, pz);
            const tint = tints[i % tints.length]!;
            const b = 0.35 + hash01(i, w, 7) * 0.65;
            col.setXYZ(w, tint.r * b, tint.g * b, tint.b * b);
            w += 1;
          }
        }
      }
    }
    geo.setDrawRange(0, w);
    pos.needsUpdate = true;
    col.needsUpdate = true;
  }

  /** Rebuild every body from the stored galaxy. Positions, maps, tilts and phases are seeded. */
  setGalaxy(galaxy: Galaxy, evidence: Map<string, number>, progress: Map<string, number> = new Map()): void {
    this.progress = progress;
    this.disposeRoot();
    this.bodies.clear();
    this.pickables = [];
    this.motions = [];
    this.bodyObject.clear();
    this.systems = [];
    this.spinMats = [];
    this.clouds = [];
    this.binaries = [];
    this.moonRingMats = [];
    this.moonEclipses = [];
    this.starFlares = [];
    this.belts = [];
    this.comets = [];
    this.megaStructures = [];
    this.dysonSwarms = [];
    this.nightShaders = [];
    this.ringShaders = [];
    this.clusterGlows = [];
    this.constellationTags = [];
    this.rogues = [];
    this.stations = [];
    this.cosmicBodies = this.cosmicBodies.filter(
      (b) =>
        b.kind !== "station" &&
        !b.id.startsWith("CORE-BH-") &&
        !b.id.startsWith("QSO-") &&
        !b.id.startsWith("WELL-"),
    );
    if (galaxy.stars.length === 0) return;

    const anchors = separatedStarPositions(galaxy.stars.length, SYSTEM_SPHERE, SYSTEM_SEPARATION);
    galaxy.stars.forEach((system, si) => {
      const anchor = anchors[si] ?? { x: 0, y: 0, z: 0 };
      this.buildSystem(system, si, anchor, evidence);
    });
    this.addClusterHaze();
    this.buildRogues(galaxy);
    this.frameGalaxy();
  }

  private buildSystem(system: GalaxyStar, index: number, anchor: Vec3, evidence: Map<string, number>): void {
    const group = new THREE.Group();
    group.position.set(anchor.x, anchor.y, anchor.z);
    const color = new THREE.Color(disciplineColor(system.code));

    // Animated photosphere: the map drifts, a convection term modulates it, and a physical limb law
    // darkens the edge while the outermost shell warms into chromosphere colour.
    const starMat = new THREE.ShaderMaterial({
      uniforms: {
        uMap: { value: loadTexture(starMap(surfaceSeed(system.code))) },
        uSpin: { value: hash01(index, 3) },
        uTint: { value: new THREE.Color(0xfff3e2) },
      },
      vertexShader:
        "varying vec2 vUv; varying vec3 vN; varying vec3 vV;\n" +
        "void main() {\n" +
        "  vUv = uv; vN = normalize(normalMatrix * normal);\n" +
        "  vec4 mv = modelViewMatrix * vec4(position, 1.0); vV = normalize(-mv.xyz);\n" +
        "  gl_Position = projectionMatrix * mv;\n" +
        "}",
      fragmentShader:
        "uniform sampler2D uMap; uniform float uSpin; uniform vec3 uTint;\n" +
        "varying vec2 vUv; varying vec3 vN; varying vec3 vV;\n" +
        "void main() {\n" +
        "  vec2 uv = vec2(fract(vUv.x + uSpin), vUv.y);\n" +
        "  vec3 c = texture2D(uMap, uv).rgb * uTint;\n" +
        "  float gran = 0.9 + 0.1 * sin(uv.x * 34.0 + uSpin * 90.0) * cos(uv.y * 21.0 - uSpin * 55.0);\n" +
        "  c *= gran;\n" +
        "  float mu = clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0);\n" +
        "  c *= 0.42 + 0.58 * pow(mu, 0.55);\n" +
        "  c += vec3(0.55, 0.32, 0.16) * pow(1.0 - mu, 3.2) * 0.5;\n" +
        "  gl_FragColor = vec4(c * 0.68, 1.0);\n" +
        "}",
    });
    const star = new THREE.Mesh(UNIT_SPHERE, starMat);
    star.scale.setScalar(STAR_RADIUS);
    star.userData.bodyId = system.discipline.id;
    group.add(star);
    this.spinMats.push(starMat);

    // Chromosphere shell just above the photosphere, then the wide volumetric corona.
    const chromo = new THREE.Mesh(
      UNIT_SPHERE_LO,
      new THREE.MeshBasicMaterial({ color: new THREE.Color(0xffd9b0).lerp(color, 0.35), transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    chromo.scale.setScalar(STAR_RADIUS * 1.03);
    group.add(chromo);
    const rays = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: STELLAR_RAYS, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    rays.scale.setScalar(STAR_RADIUS * 5.4);
    group.add(rays);

    const corona = new THREE.Sprite(new THREE.SpriteMaterial({
      map: radialSprite("rgba(255,255,255,0.95)", `${hex(color)}aa`),
      color: 0xffffff,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }));
    corona.scale.setScalar(STAR_RADIUS * 3.2);
    group.add(corona);
    const bloom = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: SOFT_DOT,
        color: new THREE.Color(0xfff6e8),
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    bloom.scale.setScalar(STAR_RADIUS * 2.2);
    group.add(bloom);

    // Coronal flare loops: magnetic prominences along the equator, each an arc that rises, brightens
    // and fades on its own phase. Additive and unlit, so they read as plasma rather than geometry.
    const flareMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0xff8a4a).lerp(color, 0.3),
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const flareGeo = new THREE.TorusGeometry(STAR_RADIUS * 1.05, STAR_RADIUS * 0.013, 5, 44, Math.PI * 0.62);
    for (let f = 0; f < 4; f += 1) {
      const mat = flareMat.clone();
      const loop = new THREE.Mesh(flareGeo, mat);
      loop.rotation.set(Math.PI / 2 + (hash01(index, f, 71) - 0.5) * 0.9, hash01(index, f, 72) * Math.PI * 2, (hash01(index, f, 73) - 0.5) * 1.2);
      group.add(loop);
      this.starFlares.push({ mesh: loop, mat, phase: hash01(index, f, 74) * Math.PI * 2, speed: 0.5 + hash01(index, f, 75) * 0.8 });
    }

    const light = new THREE.PointLight(color.clone().lerp(new THREE.Color(0xffffff), 0.6), 8, 0, 0.4);
    group.add(light);

    // Stellar multiplicity from the domain count: 10–13 domains form a binary (primary 38 + companion
    // 24 at 140 units), 14+ adds a wide trinary companion at 260 units. A plasma stream links the pair.
    const multiplicity = system.planets.length >= 14 ? 3 : system.planets.length >= 10 ? 2 : 1;
    if (multiplicity >= 2) {
      star.scale.setScalar(38);
      const companionMat = new THREE.ShaderMaterial({
        uniforms: { uMap: { value: loadTexture(starMap(surfaceSeed(`${system.code}-B`))) }, uSpin: { value: 0.4 }, uTint: { value: new THREE.Color(0xffe2c4) } },
        vertexShader: starMat.vertexShader,
        fragmentShader: starMat.fragmentShader,
      });
      const companion = new THREE.Mesh(UNIT_SPHERE, companionMat);
      companion.scale.setScalar(24);
      this.spinMats.push(companionMat);
      const pivot = new THREE.Object3D();
      const holder = new THREE.Object3D();
      holder.position.set(140, 0, 0);
      holder.add(companion);
      pivot.add(holder);
      pivot.rotation.y = hash01(index, 91) * Math.PI * 2;
      group.add(pivot);
      // Mass-transfer stream: a thin additive cylinder stretched between the two photospheres each frame.
      const bridge = new THREE.Mesh(
        new THREE.CylinderGeometry(1.9, 3.2, 1, 8, 1, true),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(0xffd6a8), transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false }),
      );
      bridge.rotation.z = Math.PI / 2;
      group.add(bridge);
      this.binaries.push({ pivot, bridge, phase: hash01(index, 92) * Math.PI * 2, separation: 140 });
    }
    if (multiplicity === 3) {
      const thirdMat = new THREE.ShaderMaterial({
        uniforms: { uMap: { value: loadTexture(starMap(surfaceSeed(`${system.code}-C`))) }, uSpin: { value: 0.7 }, uTint: { value: new THREE.Color(0xffd2b0) } },
        vertexShader: starMat.vertexShader,
        fragmentShader: starMat.fragmentShader,
      });
      const third = new THREE.Mesh(UNIT_SPHERE_LO, thirdMat);
      third.scale.setScalar(17);
      this.spinMats.push(thirdMat);
      const wide = new THREE.Object3D();
      const wideHolder = new THREE.Object3D();
      wideHolder.position.set(260, 0, 0);
      wideHolder.add(third);
      wide.add(wideHolder);
      wide.rotation.set(0.22, hash01(index, 93) * Math.PI * 2, 0.1);
      group.add(wide);
      const orbit = this.orbitLine(260, 0.94, 0xffc66d, 0.16);
      orbit.rotation.x = 0.22;
      group.add(orbit);
      this.motions.push({
        pivot: wide,
        holder: wideHolder,
        phase: 0,
        omega: 0.05,
        body: { id: `${system.code}-TRINARY`, node: system.discipline, kind: "star", system: index, tier: "unassessed", radius: 17, label: "Wide Companion", parentId: system.discipline.id },
      });
    }

    const planets = new THREE.Group();
    const moons = new THREE.Group();
    const satellites = new THREE.Group();
    const small = new THREE.Group();
    group.add(planets, moons, satellites, small);

    const starBody: AtlasBody = {
      id: system.discipline.id,
      node: system.discipline,
      kind: "star",
      system: index,
      tier: "unassessed",
      radius: multiplicity >= 2 ? 38 : STAR_RADIUS,
      label: system.discipline.title,
      parentId: null,
    };
    this.bodies.set(starBody.id, starBody);
    this.bodyObject.set(starBody.id, star);
    this.pickables.push(star);
    this.pickables.push(this.proxy(star, STAR_RADIUS * 1.6, starBody.id));
    // A rotating ring-and-truss station orbits every discipline star, ready for the Chunk 5 cockpit.
    this.addStation(system.code, group, 0.65, 130 + hash01(index, 51) * 90);

    // Volumetric nebula behind the sector: dense family clusters read as star-forming clouds rather
    // than a scatter plot, and the haze separates one system's volume from its neighbour's.
    const haze = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: radialSprite("rgba(96,160,255,0.30)", "rgba(96,60,180,0.05)"),
        transparent: true,
        opacity: 0.20,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    haze.scale.setScalar(1650);
    haze.position.set(0, 0, -280);
    group.add(haze);

    // Tier C: beyond 7,500 units the textured sphere, corona and rings collapse into one spectral
    // beacon that keeps the discipline's exact colour and stays raycastable. A star never pops out.
    const beacon = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: CRISP_STAR, color: color.clone().lerp(new THREE.Color(0xffffff), 0.35), transparent: true, opacity: 0.92, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    beacon.scale.setScalar(220);
    beacon.visible = false;
    beacon.userData.bodyId = starBody.id;
    group.add(beacon);
    const wires: THREE.LineSegments[] = [];
    this.buildConstellationThreads(system, index, group, anchor, wires);

    // Relativistic quasar at a synthesis hub: a major cross-discipline bridge fires twin opposing
    // cyan/violet jets 1,200 units out, perpendicular to the accretion disk.
    if (system.planets.length >= 8) {
      const qso = this.quasar(70);
      qso.position.set(0, 330, 0);
      group.add(qso);
      this.cosmicBodies.push({
        id: `QSO-${system.code}`,
        kind: "quasar",
        name: `${system.discipline.title} Synthesis Quasar`,
        center: new THREE.Vector3(anchor.x, anchor.y + 330, anchor.z),
        radius: 70,
        detail: system.constellations.slice(0, 12).map((c) => c.node.title),
      });
    }

    // A stellar-mass well forms wherever revision debt concentrates: nearby orbital tracks visibly
    // bend toward it until the flagged records are cleared.
    const systemRatio = this.progress.get(system.discipline.id) ?? 0;
    if (systemRatio > 0 && systemRatio < 0.3) {
      const well = this.relativisticBlackHole(26);
      well.position.set(0, -430, 0);
      group.add(well);
      this.cosmicBodies.push({
        id: `WELL-${system.code}`,
        kind: "bottleneck",
        name: `${system.discipline.title} Revision Well`,
        center: new THREE.Vector3(anchor.x, anchor.y - 430, anchor.z),
        radius: 26,
      });
    }

    const planetCount = Math.max(1, system.planets.length);
    system.planets.forEach((planet, pi) => {
      // Orbital radius spread across the declared 180–1,650 band, never inside the star.
      const t = planetCount === 1 ? 0.34 : pi / (planetCount - 1);
      const orbitR = 180 + Math.pow(t, 0.82) * (1650 - 180);
      const orbitTilt = (hash01(index, pi, 5) - 0.5) * 0.42;
      const orbitYaw = hash01(index, pi, 6) * Math.PI * 2;
      const pivot = new THREE.Object3D();
      pivot.rotation.set(orbitTilt, orbitYaw, 0);
      const holder = new THREE.Object3D();
      holder.position.set(orbitR, 0, 0);
      pivot.add(holder);
      planets.add(pivot);

      const orbit = this.orbitLine(orbitR, 0.72, 0x35d9ff, 0.28);
      pivot.add(orbit);

      const banded = pi % 4 === 1;
      const radius = 1.6 + hash01(index, pi, 7) * (banded ? 2 : 1.4);
      const seed = surfaceSeed(planet.node.code);
      // Seeded biome class: one of seven worlds, each with its own gloss, tint and atmosphere. The
      // surface map is chosen by the same seed, so a domain always wears the same face.
      const biome = planetBiome(seed, banded);
      const surface = loadTexture(planetMap(seed, banded));
      const mesh = new THREE.Mesh(
        UNIT_SPHERE,
        new THREE.MeshStandardMaterial({
          map: surface,
          bumpMap: surface,
          bumpScale: radius * 0.02,
          color: biome.tint.clone().multiplyScalar(0.72).lerp(color, 0.2),
          roughness: biome.roughness,
          metalness: biome.metalness,
          envMapIntensity: biome.glint,
        }),
      );
      mesh.scale.setScalar(radius);
      // Axial tilt is seeded 4°–35° and never shared between two worlds.
      const axial = ((4 + hash01(seed, 6) * 31) * Math.PI) / 180;
      mesh.rotation.z = axial;
      mesh.userData.bodyId = planet.node.id;
      holder.add(mesh);
      mesh.userData.spin = 0.08 + hash01(seed, 7) * 0.22;

      // Rotating cloud deck, a hair above the terrain and turning slightly faster.
      const clouds = new THREE.Mesh(
        UNIT_SPHERE_LO,
        new THREE.MeshStandardMaterial({
          map: CLOUD_MAP,
          transparent: true,
          opacity: biome.clouds,
          depthWrite: false,
          roughness: 1,
          metalness: 0,
          color: biome.cloudTint,
        }),
      );
      clouds.scale.setScalar(radius * 1.016);
      clouds.rotation.z = axial;
      clouds.rotation.y = hash01(seed, 8) * Math.PI * 2;
      holder.add(clouds);
      this.clouds.push({ mesh: clouds, speed: 0.12 + hash01(seed, 9) * 0.2 });

      holder.add(this.atmosphere(radius, biome.atmosphere, group.position));

      // Night-side civilisation: an additive shader shell that only lights the hemisphere facing away
      // from the star, scaled by this domain's real mastery ratio.
      const ratio = this.progress.get(planet.node.id) ?? 0;
      const nightMat = nightLightsMaterial(group.position);
      nightMat.uniforms.uProgress!.value = clamp(ratio, 0, 1);
      const night = new THREE.Mesh(UNIT_SPHERE, nightMat);
      night.scale.setScalar(radius * 1.004);
      holder.add(night);
      this.nightShaders.push({ mat: nightMat, body: { id: planet.node.id, node: planet.node, kind: "planet", system: index, tier: planet.tier, radius, label: planet.node.title, parentId: system.discipline.id } });

      // Concentric rings: a single shader draws every band, the Cassini division, and the planet's own
      // shadow falling across the far side of the ring.
      if (biome.rings) {
        const ringMat = ringMaterial(radius * 1.45, radius * 2.65, color.clone().lerp(new THREE.Color(0xe8eefc), 0.55), group.position);
        const ringGeo = new THREE.RingGeometry(radius * 1.45, radius * 2.65, 160, 4);
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        const ringGroup = new THREE.Object3D();
        ringGroup.rotation.set(Math.PI / 2 + axial + 0.14 + hash01(seed, 12) * 0.26, hash01(seed, 13) * Math.PI, 0);
        ringMesh.rotation.z = 0.2;
        ringGroup.add(ringMesh);
        holder.add(ringGroup);
        this.ringShaders.push({ mat: ringMat, mesh: ringMesh });
      }

      // A faint halo makes a 2-unit world readable beside a 42-unit star without pretending to be bigger.
      const halo = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: SOFT_DOT,
          color: color.clone().lerp(new THREE.Color(0xffffff), 0.4),
          transparent: true,
          opacity: 0.5,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      halo.scale.setScalar(radius * 8);
      holder.add(halo);

      const body: AtlasBody = {
        id: planet.node.id,
        node: planet.node,
        kind: "planet",
        system: index,
        tier: planet.tier,
        radius,
        label: planet.node.title,
        parentId: system.discipline.id,
      };
      this.bodies.set(body.id, body);
      this.bodyObject.set(body.id, mesh);
      this.pickables.push(mesh);
      this.pickables.push(this.proxy(mesh, Math.max(radius * 1.8, 0.8), body.id));
      if (planet.tier === "mastered") this.addStation(`${planet.node.code}-STN`, holder, 0.65, radius * 3.2);
      // 100% domain mastery: a luminous orbital ring plus a space-elevator tether.
      if (ratio >= 0.995) {
        const mega = new THREE.Group();
        const megaMat = new THREE.MeshBasicMaterial({ color: 0x9beeff, transparent: true, opacity: 0.72, blending: THREE.AdditiveBlending, depthWrite: false });
        const ring = new THREE.Mesh(new THREE.TorusGeometry(radius * 1.95, radius * 0.035, 8, 96), megaMat);
        ring.rotation.x = Math.PI / 2 + axial;
        mega.add(ring);
        const tether = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.012, radius * 0.02, radius * 1.9, 6), megaMat);
        tether.position.y = radius * 0.95;
        mega.add(tether);
        holder.add(mega);
        this.megaStructures.push({ mesh: ring, speed: 0.4 });
        this.megaStructures.push({ mesh: tether, speed: -0.15 });
      }
      this.motions.push({
        pivot,
        holder,
        phase: hash01(index, pi, 9) * Math.PI * 2,
        omega: 0.09 * Math.pow(180 / orbitR, 0.6),
        body,
      });

      // Moons: one per skill, a fifth of the planet's radius, 7–24 units out.
      const moonCount = Math.max(1, planet.moons.length);
      planet.moons.forEach((moon, mi) => {
        const orbitR0 = 7 + (mi / moonCount) * 17;
        const mRadius = 0.32 + hash01(seed, mi, 1) * 0.43;
        const mPivot = new THREE.Object3D();
        mPivot.rotation.set((hash01(seed, mi, 2) - 0.5) * 0.9, hash01(seed, mi, 3) * Math.PI * 2, 0);
        holder.add(mPivot);
        const mHolder = new THREE.Object3D();
        mHolder.position.set(orbitR0, 0, 0);
        mPivot.add(mHolder);
        const moonRing = this.orbitLine(orbitR0, 0.82, 0x35d9ff, 0.22);
        mPivot.add(moonRing);
        this.moonRingMats.push({ mat: moonRing.material as THREE.LineBasicMaterial, system: index });

        const moonMesh = new THREE.Mesh(
          UNIT_SPHERE_LO,
          new THREE.MeshStandardMaterial({
            map: loadTexture(moonMap(surfaceSeed(moon.node.code))),
            color: color.clone().lerp(new THREE.Color(0xdfe8f7), 0.55),
            roughness: 0.96,
            metalness: 0.02,
          }),
        );
        moonMesh.scale.setScalar(mRadius);
        moonMesh.userData.bodyId = moon.node.id;
        mHolder.add(moonMesh);

        // Real planet shadow cone: a dark shell that fades in while this moon sits inside the
        // planet→star umbra cylinder, so a moon visibly darkens as it passes behind its world.
        const eclipseShell = new THREE.Mesh(
          UNIT_SPHERE_LO,
          new THREE.MeshBasicMaterial({ color: 0x02040a, transparent: true, opacity: 0, depthWrite: false }),
        );
        eclipseShell.scale.setScalar(mRadius * 1.02);
        eclipseShell.visible = false;
        mHolder.add(eclipseShell);
        this.moonEclipses.push({ moon: mHolder, shell: eclipseShell, planet: holder, planetRadius: radius, system: index });

        const moonBody: AtlasBody = {
          id: moon.node.id,
          node: moon.node,
          kind: "moon",
          system: index,
          tier: moon.tier,
          radius: mRadius,
          label: moon.node.title,
          parentId: planet.node.id,
        };
        this.bodies.set(moonBody.id, moonBody);
        this.bodyObject.set(moonBody.id, moonMesh);
        this.pickables.push(moonMesh);
        this.pickables.push(this.proxy(moonMesh, Math.max(mRadius * 2.4, 0.5), moonBody.id));
        this.motions.push({
          pivot: mPivot,
          holder: mHolder,
          phase: hash01(seed, mi, 4) * Math.PI * 2,
          omega: 0.55 * Math.sqrt(10 / orbitR0),
          body: moonBody,
        });

        // Satellites: subskills, a bus with solar wings and a beacon.
        moon.satellites.forEach((sat, xi) => {
          const satOrbit = 1.6 + (xi / Math.max(1, moon.satellites.length)) * 3.4;
          const sPivot = new THREE.Object3D();
          sPivot.rotation.set(0.4, (xi / Math.max(1, moon.satellites.length)) * Math.PI * 2, 0.18);
          mHolder.add(sPivot);
          const sHolder = new THREE.Object3D();
          sHolder.position.set(satOrbit, 0, 0);
          sPivot.add(sHolder);
          const sRadius = 0.12 + hash01(seed, mi, xi + 10) * 0.12;
          const craft = this.satelliteMesh(sRadius, color, Math.floor(hash01(seed, mi, xi + 40) * 10));
          craft.userData.bodyId = sat.node.id;
          sHolder.add(craft);
          const satBody: AtlasBody = {
            id: sat.node.id,
            node: sat.node,
            kind: "satellite",
            system: index,
            tier: sat.tier,
            radius: sRadius,
            label: sat.node.title,
            parentId: moon.node.id,
          };
          this.bodies.set(satBody.id, satBody);
          this.bodyObject.set(satBody.id, craft);
          this.pickables.push(craft);
          this.pickables.push(this.proxy(craft, Math.max(sRadius * 3, 0.32), satBody.id));
          this.motions.push({
            pivot: sPivot,
            holder: sHolder,
            phase: hash01(seed, xi, 12) * Math.PI * 2,
            omega: 0.9,
            body: satBody,
          });

          sat.asteroids.forEach((ast, ai) => {
            const aPivot = new THREE.Object3D();
            aPivot.rotation.set(0.6, hash01(seed, ai, 21) * Math.PI * 2, 0.3);
            sHolder.add(aPivot);
            const aHolder = new THREE.Object3D();
            aHolder.position.set(sRadius * 4 + 0.3, 0, 0);
            aPivot.add(aHolder);
            const asteroid = new THREE.Mesh(
              new THREE.IcosahedronGeometry(Math.max(0.05, sRadius * 0.28), 0),
              new THREE.MeshStandardMaterial({ color: TIER_COLOR[ast.tier], roughness: 1 }),
            );
            asteroid.userData.bodyId = ast.node.id;
            aHolder.add(asteroid);
            this.pickables.push(asteroid);
            this.pickables.push(this.proxy(asteroid, 0.22, ast.node.id));
            const astBody: AtlasBody = {
              id: ast.node.id,
              node: ast.node,
              kind: "asteroid",
              system: index,
              tier: ast.tier,
              radius: Math.max(0.05, sRadius * 0.28),
              label: ast.node.title,
              parentId: sat.node.id,
            };
            this.bodies.set(astBody.id, astBody);
            this.bodyObject.set(astBody.id, asteroid);
            this.motions.push({ pivot: aPivot, holder: aHolder, phase: hash01(seed, ai, 22) * 6.28, omega: 1.3, body: astBody });
          });
        });

        moon.asteroids.forEach((ast, ai) => {
          const aPivot = new THREE.Object3D();
          aPivot.rotation.set(0.5, hash01(seed, ai, 31) * Math.PI * 2, 0);
          mHolder.add(aPivot);
          const aHolder = new THREE.Object3D();
          aHolder.position.set(mRadius * 3 + 0.4, 0, 0);
          aPivot.add(aHolder);
          const asteroid = new THREE.Mesh(
            new THREE.IcosahedronGeometry(Math.max(0.04, mRadius * 0.2), 0),
            new THREE.MeshStandardMaterial({ color: TIER_COLOR[ast.tier], roughness: 1 }),
          );
          asteroid.userData.bodyId = ast.node.id;
          aHolder.add(asteroid);
          this.pickables.push(asteroid);
          const astBody: AtlasBody = {
            id: ast.node.id,
            node: ast.node,
            kind: "asteroid",
            system: index,
            tier: ast.tier,
            radius: Math.max(0.04, mRadius * 0.2),
            label: ast.node.title,
            parentId: moon.node.id,
          };
          this.bodies.set(astBody.id, astBody);
          this.bodyObject.set(astBody.id, asteroid);
          this.motions.push({ pivot: aPivot, holder: aHolder, phase: hash01(seed, ai, 32) * 6.28, omega: 1.1, body: astBody });
        });
      });
    });

    // Instanced asteroid belt: one draw call per system, a tilted torus of tumbling irregular rocks
    // between the inner rocky worlds and the outer giants.
    const beltCount = 180 + Math.floor(hash01(index, 61) * 80);
    const beltMesh = new THREE.InstancedMesh(
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.MeshStandardMaterial({ color: 0x5d6675, roughness: 1, metalness: 0.04, flatShading: true }),
      beltCount,
    );
    const bm = new THREE.Matrix4();
    const bq = new THREE.Quaternion();
    const bp = new THREE.Vector3();
    const bs = new THREE.Vector3();
    for (let i = 0; i < beltCount; i += 1) {
      const a = hash01(index, i, 62) * Math.PI * 2;
      const r = 520 + hash01(index, i, 63) * 120;
      bp.set(Math.cos(a) * r, (hash01(index, i, 64) - 0.5) * 26, Math.sin(a) * r);
      bq.setFromEuler(new THREE.Euler(hash01(index, i, 65) * 6.28, hash01(index, i, 66) * 6.28, hash01(index, i, 67) * 6.28));
      const size = 0.8 + hash01(index, i, 68) * 1.9;
      bs.set(size, size * (0.6 + hash01(index, i, 69) * 0.7), size);
      bm.compose(bp, bq, bs);
      beltMesh.setMatrixAt(i, bm);
    }
    beltMesh.instanceMatrix.needsUpdate = true;
    beltMesh.frustumCulled = false;
    const beltTilt = new THREE.Object3D();
    beltTilt.rotation.set((hash01(index, 70) - 0.5) * 0.4, 0, (hash01(index, 71) - 0.5) * 0.3);
    beltTilt.add(beltMesh);
    small.add(beltTilt);
    this.belts.push({ holder: beltMesh, spin: 0.6 + hash01(index, 72) * 0.8 });

    // Two long-period comets per system: eccentric ellipse, glowing coma, and a tail that is aimed
    // radially outward every frame and stretches as the comet nears perihelion.
    for (let ci = 0; ci < 2; ci += 1) {
      const holder = new THREE.Object3D();
      const nucleus = new THREE.Mesh(new THREE.SphereGeometry(1.1, 10, 8), new THREE.MeshBasicMaterial({ color: 0xeafcff }));
      holder.add(nucleus);
      const coma = new THREE.Sprite(new THREE.SpriteMaterial({ map: SOFT_DOT, color: 0xbfefff, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
      holder.add(coma);
      const tailMat = new THREE.MeshBasicMaterial({ color: 0x9fe7ff, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
      const tailGeo = new THREE.ConeGeometry(6, 1, 14, 1, true);
      tailGeo.translate(0, 0.5, 0);
      const tail = new THREE.Mesh(tailGeo, tailMat);
      holder.add(tail);
      small.add(holder);
      this.comets.push({ holder, tail, coma, tailMat, a: 900 + hash01(index, ci, 73) * 620, e: 0.58 + hash01(index, ci, 74) * 0.16, phase: hash01(index, ci, 75) * Math.PI * 2, speed: 0.16 + hash01(index, ci, 76) * 0.08, yaw: hash01(index, ci, 77) * Math.PI * 2 });
    }

    // 100% discipline mastery: a Dyson swarm of golden collectors encircling the star.
    const disciplineRatio = system.planets.length === 0 ? 0 : system.planets.reduce((sum, p) => sum + (this.progress.get(p.node.id) ?? 0), 0) / system.planets.length;
    if (disciplineRatio >= 0.995) {
      const swarm = new THREE.Object3D();
      swarm.rotation.set(0.3, 0, 0.14);
      const nodeCount = 72;
      const collectors = new THREE.InstancedMesh(
        new THREE.OctahedronGeometry(4.4, 0),
        new THREE.MeshStandardMaterial({ color: 0xffd27c, emissive: 0xffa63b, emissiveIntensity: 1.5, metalness: 0.9, roughness: 0.25 }),
        nodeCount,
      );
      const dm = new THREE.Matrix4();
      const dq = new THREE.Quaternion();
      const dp = new THREE.Vector3();
      const ds = new THREE.Vector3(1, 1, 1);
      const axis = new THREE.Vector3(0, 1, 0);
      for (let i = 0; i < nodeCount; i += 1) {
        const a = (i / nodeCount) * Math.PI * 2;
        dp.set(Math.cos(a) * 250, Math.sin(a * 3) * 7, Math.sin(a) * 250);
        dq.setFromAxisAngle(axis, -a);
        dm.compose(dp, dq, ds);
        collectors.setMatrixAt(i, dm);
      }
      collectors.instanceMatrix.needsUpdate = true;
      collectors.frustumCulled = false;
      swarm.add(collectors);
      const dish = new THREE.Mesh(new THREE.TorusGeometry(250, 0.9, 6, 128), new THREE.MeshBasicMaterial({ color: 0xffd27c, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending, depthWrite: false }));
      dish.rotation.x = Math.PI / 2;
      swarm.add(dish);
      small.add(swarm);
      this.dysonSwarms.push({ group: swarm, speed: 0.05 });
    }

    // Skills with no domain parent still orbit their star, as real moons do.
    system.moons.forEach((moon, mi) => {
      const orbitR = 64 + mi * 22;
      const pivot = new THREE.Object3D();
      pivot.rotation.set((hash01(index, mi, 41) - 0.5) * 0.6, hash01(index, mi, 42) * Math.PI * 2, 0);
      planets.add(pivot);
      const holder = new THREE.Object3D();
      holder.position.set(orbitR, 0, 0);
      pivot.add(holder);
      const radius = 0.32 + hash01(index, mi, 43) * 0.43;
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 20, 16),
        new THREE.MeshStandardMaterial({
          map: loadTexture(moonMap(surfaceSeed(moon.node.code))),
          color: color.clone().lerp(new THREE.Color(0xdfe8f7), 0.55),
          roughness: 0.95,
        }),
      );
      mesh.userData.bodyId = moon.node.id;
      holder.add(mesh);
      const body: AtlasBody = {
        id: moon.node.id,
        node: moon.node,
        kind: "moon",
        system: index,
        tier: moon.tier,
        radius,
        label: moon.node.title,
        parentId: system.discipline.id,
      };
      this.bodies.set(body.id, body);
      this.bodyObject.set(body.id, mesh);
      this.pickables.push(mesh);
      this.pickables.push(this.proxy(mesh, Math.max(radius * 2.4, 0.5), body.id));
      this.motions.push({ pivot, holder, phase: hash01(index, mi, 44) * 6.28, omega: 0.28, body });
    });

    // Mastery heatmap halo: one shared soft dot per discipline star, tinted from live Dexie tiers.
    const heat = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: SOFT_DOT, transparent: true, opacity: 0.46, depthWrite: false, blending: THREE.AdditiveBlending }),
    );
    heat.scale.setScalar(STAR_RADIUS * 11);
    heat.visible = false;
    group.add(heat);

    // Progression lock fog: a cool tactical haze plus a lock ring, parked until hardlock asks for it.
    const fog = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: SOFT_DOT, color: 0x2a4a7a, transparent: true, opacity: 0.42, depthWrite: false, blending: THREE.AdditiveBlending }),
    );
    fog.scale.setScalar(STAR_RADIUS * 17);
    fog.visible = false;
    group.add(fog);

    this.root.add(group);
    this.systems.push({ index, code: system.code, color, group, star, corona, light, planets, moons, satellites, small, label: system.discipline.title, beacon, heat, fog, wires });
    void evidence;
  }

  /**
   * Real 3D constellation mesh: every skill family becomes a closed `LineSegments` ring in
   * `#35D9FF` at 0.28 opacity, backed by a translucent nebula cell and one deduplicated name tag.
   * Members are the family's skills; the ring radius grows with the member count so a large family
   * reads as a larger constellation rather than a denser scribble.
   */
  private buildConstellationThreads(system: GalaxyStar, index: number, group: THREE.Group, anchor: Vec3, wires: THREE.LineSegments[]): void {
    system.constellations.forEach((c, ci) => {
      if (c.members.length === 0 && !c.planet) return;
      const count = Math.max(4, Math.min(11, c.members.length + 3));
      const radius = 520 + ci * 62 + Math.min(160, c.members.length * 18);
      const tilt = (hash01(index, ci, 81) - 0.5) * 0.75;
      const spin = hash01(index, ci, 82) * Math.PI * 2;
      const axisX = new THREE.Vector3(1, 0, 0);
      const axisY = new THREE.Vector3(0, 1, 0);
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i < count; i += 1) {
        const a = (i / count) * Math.PI * 2;
        const r = radius + Math.sin(i * 2.1 + ci) * radius * 0.12;
        pts.push(
          new THREE.Vector3(Math.cos(a) * r, Math.sin(a * 2 + ci) * 46, Math.sin(a) * r)
            .applyAxisAngle(axisX, tilt)
            .applyAxisAngle(axisY, spin),
        );
      }
      const positions: number[] = [];
      for (let i = 0; i < pts.length; i += 1) {
        const a = pts[i]!;
        const b = pts[(i + 1) % pts.length]!;
        positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      const threads = new THREE.LineSegments(
        geo,
        new THREE.LineBasicMaterial({ color: 0x35d9ff, transparent: true, opacity: 0.28, depthWrite: false }),
      );
      wires.push(threads);
      group.add(threads);

      // Subtle volumetric nebula backing behind the family, so the threads sit in gas rather than void.
      const nebula = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: CONSTELLATION_HAZE,
          transparent: true,
          opacity: 0.13,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      nebula.scale.setScalar(radius * 1.35);
      nebula.position.copy(pts[0]!).multiplyScalar(0.2);
      group.add(nebula);

      // A small selectable node anchors the family, with its own single label.
      const hub = new THREE.Object3D();
      hub.position.copy(pts[0]!);
      group.add(hub);
      const marker = new THREE.Mesh(
        new THREE.OctahedronGeometry(6, 0),
        new THREE.MeshBasicMaterial({ color: 0x9fe9ff, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }),
      );
      marker.userData.bodyId = c.node.id;
      hub.add(marker);
      this.pickables.push(marker, this.proxy(marker, 24, c.node.id));
      this.bodies.set(c.node.id, {
        id: c.node.id,
        node: c.node,
        kind: "constellation",
        system: index,
        tier: c.tier,
        radius: 6,
        label: c.node.title,
        parentId: system.discipline.id,
      });
      this.bodyObject.set(c.node.id, marker);
      this.constellationTags.push({
        pos: new THREE.Vector3(anchor.x + pts[0]!.x, anchor.y + pts[0]!.y, anchor.z + pts[0]!.z),
        label: c.node.title,
        color: "#35D9FF",
      });
    });
  }

  /** Rogue wanderers: unassigned frontier records drift along the rim in violet with a gold aura. */
  private buildRogues(galaxy: Galaxy): void {
    // Cap the drawn wanderers so a large unassigned frontier still holds 60 FPS; every rogue remains
    // reachable in the Index, and the first 96 keep their own pickable body and assignment card.
    const drawn = galaxy.rogues.slice(0, 96);
    const rogueMat = new THREE.MeshStandardMaterial({ color: 0xa78bfa, emissive: 0x5b21b6, emissiveIntensity: 0.75, roughness: 0.42, metalness: 0.18 });
    const haloMat = new THREE.SpriteMaterial({ map: CRISP_STAR, color: 0xffc66d, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false });
    drawn.forEach((rogue, ri) => {
      const holder = new THREE.Object3D();
      const angle = (ri / Math.max(1, drawn.length)) * Math.PI * 2 + hash01(ri, 501) * 0.4;
      const rim = SYSTEM_SPHERE * (0.92 + hash01(ri, 502) * 0.12);
      holder.position.set(Math.cos(angle) * rim, (hash01(ri, 503) - 0.5) * SYSTEM_SPHERE * 0.34, Math.sin(angle) * rim);
      holder.rotation.z = hash01(ri, 504) * 0.6;
      const mesh = new THREE.Mesh(UNIT_SPHERE_LO, rogueMat);
      mesh.scale.setScalar(26);
      mesh.userData.bodyId = rogue.node.id;
      holder.add(mesh);
      // Violet-gold orbital aura: two offset sprites that slowly pulse against each other.
      const aura = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: ROGUE_AURA, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }),
      );
      aura.scale.setScalar(150);
      holder.add(aura);
      const halo = new THREE.Sprite(haloMat);
      halo.scale.setScalar(90);
      holder.add(halo);
      this.root.add(holder);
      this.pickables.push(mesh, this.proxy(mesh, 34, rogue.node.id));
      this.bodies.set(rogue.node.id, {
        id: rogue.node.id,
        node: rogue.node,
        kind: "star",
        system: -1,
        tier: rogue.tier,
        radius: 26,
        label: rogue.node.title,
        parentId: null,
        rogue: true,
      });
      this.bodyObject.set(rogue.node.id, mesh);
      this.rogues.push({ holder, angle, radius: rim, y: holder.position.y, speed: 0.008 + hash01(ri, 505) * 0.012 });
    });
  }

  /**
   * An orbital wake. The ring is a child of the orbit pivot, so a vertex-colour gradient that is
   * brightest just behind the body (at angle −0.35) rotates with it and always reads as a trail.
   */
  private orbitLine(radius: number, flatten: number, color: number, opacity: number): THREE.LineLoop {
    const pts: THREE.Vector3[] = [];
    const colors: number[] = [];
    const segments = 128;
    const base = new THREE.Color(color);
    for (let i = 0; i < segments; i += 1) {
      const a = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius * flatten));
      let d = a + 0.35;
      if (d > Math.PI) d -= Math.PI * 2;
      if (d < -Math.PI) d += Math.PI * 2;
      const w = 0.05 + 0.95 * Math.exp(-(d * d) / 0.16);
      colors.push(base.r * w, base.g * w, base.b * w);
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    const mat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending });
    return new THREE.LineLoop(geo, mat);
  }

  /**
   * Rayleigh-style scattering rim: brightest along the sunlit limb, shifting to warm amber as the
   * view crosses the terminator, so a close pass reads as atmosphere rather than a painted outline.
   */
  private atmosphere(radius: number, color: THREE.Color, starPosition: THREE.Vector3): THREE.Mesh {
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: color.clone().lerp(new THREE.Color(0x9fd4ff), 0.35) },
        uWarm: { value: new THREE.Color(0xffb26b) },
        uSun: { value: starPosition.clone() },
        uStrength: { value: 0.62 },
      },
      vertexShader:
        "varying vec3 vNormal; varying vec3 vView; varying vec3 vWorld;\n" +
        "void main() {\n" +
        "  vNormal = normalize(normalMatrix * normal);\n" +
        "  vec4 world = modelMatrix * vec4(position, 1.0);\n" +
        "  vWorld = world.xyz;\n" +
        "  vec4 mv = viewMatrix * world;\n" +
        "  vView = normalize(-mv.xyz);\n" +
        "  gl_Position = projectionMatrix * mv;\n" +
        "}",
      fragmentShader:
        "uniform vec3 uColor; uniform vec3 uWarm; uniform vec3 uSun; uniform float uStrength;\n" +
        "varying vec3 vNormal; varying vec3 vView; varying vec3 vWorld;\n" +
        "void main() {\n" +
        "  float rim = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 2.6);\n" +
        "  float lit = clamp(dot(normalize(vNormal), normalize(uSun - vWorld)), 0.0, 1.0);\n" +
        "  float term = smoothstep(0.55, 0.0, lit);\n" +
        "  vec3 c = mix(uColor, uWarm, term * 0.55);\n" +
        "  float a = rim * uStrength * (0.35 + 0.65 * lit);\n" +
        "  gl_FragColor = vec4(c * a, a * 0.85);\n" +
        "}",
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(UNIT_SPHERE_LO, mat);
    mesh.scale.setScalar(radius * 1.048);
    return mesh;
  }

  /** One of 180 modular satellites (6 chassis × 6 wings × 5 payloads) from the assembler. */
  private satelliteMesh(radius: number, color: THREE.Color, variant: number): THREE.Group {
    void color;
    return buildSatellite(variant, radius);
  }

  /** An invisible, raycastable sphere so a 0.12-unit satellite can still be tapped from 2 units out. */
  private proxy(object: THREE.Object3D, radius: number, id: string): THREE.Mesh {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 12, 8),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false }),
    );
    mesh.userData.bodyId = id;
    object.add(mesh);
    return mesh;
  }

  private addClusterHaze(): void {
    // The two sibling galaxies are real dust clouds, not labels: the camera can fly to them.
    // Every galaxy is a real dense stellar population: 35,000 seeded stars, drawn as one Points
    // draw call. Spectral colour is per-vertex, so the arm structure is carried by real stars rather
    // than a photograph of a galaxy.
    const clusters = [
      { anchor: new THREE.Vector3(0, 0, 0), radius: SYSTEM_SPHERE * 1.05, color: 0x7ea4ff, count: DENSE_STARS_PER_GALAXY },
      { anchor: new THREE.Vector3(-SYSTEM_SPHERE * 1.5, -900, -SYSTEM_SPHERE * 0.7), radius: 2600, color: 0xffc66d, count: DENSE_STARS_PER_GALAXY },
      { anchor: new THREE.Vector3(SYSTEM_SPHERE * 1.6, 1000, SYSTEM_SPHERE * 0.6), radius: 2200, color: 0xa78bfa, count: DENSE_STARS_PER_GALAXY },
    ];
    for (const [ci, c] of clusters.entries()) {
      const positions = new Float32Array(c.count * 3);
      const colors = new Float32Array(c.count * 3);
      const base = new THREE.Color(c.color);
      for (let i = 0; i < c.count; i += 1) {
        const t = i / c.count;
        const arm = i % 3;
        const theta = t * Math.PI * 5.4 + (arm / 3) * Math.PI * 2 + ci;
        const r = c.radius * (0.06 + Math.pow(t, 0.9) * 0.94);
        positions[i * 3] = Math.cos(theta) * r + (hash01(i, ci, 1) - 0.5) * c.radius * 0.12;
        positions[i * 3 + 1] = (hash01(i, ci, 2) - 0.5) * c.radius * 0.1;
        positions[i * 3 + 2] = Math.sin(theta) * r * 0.72 + (hash01(i, ci, 3) - 0.5) * c.radius * 0.12;
        const b = 0.25 + hash01(i, ci, 4) * 0.75;
        colors[i * 3] = base.r * b;
        colors[i * 3 + 1] = base.g * b;
        colors[i * 3 + 2] = base.b * b;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const points = new THREE.Points(
        geo,
        new THREE.PointsMaterial({
          size: 13,
          sizeAttenuation: true,
          vertexColors: true,
          map: CRISP_STAR,
          transparent: true,
          opacity: ci === 0 ? 0.55 : 0.4,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      points.frustumCulled = true;
      points.position.copy(c.anchor);
      this.root.add(points);

      // Every galaxy has a relativistic supermassive black hole at its centre. A galactic core is
      // 140 units of event horizon, so it dwarfs the 42-unit discipline stars around it.
      const holeRadius = 140;
      const hole = this.relativisticBlackHole(holeRadius);
      hole.position.copy(c.anchor);
      this.root.add(hole);
      this.cosmicBodies.push({
        id: ci === 0 ? "CORE-BH-ATHENA" : `CORE-BH-${ci}`,
        kind: "blackhole",
        name: ci === 0 ? "ATHENA Core Singularity" : `${ci === 1 ? "Frontier" : "Vault"} Core Singularity`,
        center: c.anchor.clone(),
        radius: holeRadius,
      });
      const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: radialSprite("rgba(255,226,190,0.55)", "rgba(126,164,255,0.18)"), transparent: true, opacity: 0.26, blending: THREE.AdditiveBlending, depthWrite: false }));
      glow.scale.setScalar(ci === 0 ? 2100 : 1500);
      glow.position.copy(c.anchor);
      this.root.add(glow);
      this.clusterGlows.push({ sprite: glow, center: c.anchor.clone() });
    }
  }

  private frameGalaxy(): void {
    this.distance = 20_500;
    this.target.set(0, 0, 0);
    this.follow = null;
    this.glide = null;
  }

  /* ── interaction ──────────────────────────────────────────────────────── */

  private bindPointer(canvas: HTMLCanvasElement): void {
    const local = (e: PointerEvent): { x: number; y: number } => {
      // offsetX/offsetY are in the element's own coordinate space, so the 90° landscape cockpit does
      // not mirror or offset a single tap.
      return { x: e.offsetX, y: e.offsetY };
    };

    const touch = (e: PointerEvent): boolean => e.pointerType === "touch" || e.pointerType === "pen";

    const down = (e: PointerEvent): void => {
      canvas.setPointerCapture(e.pointerId);
      const p = local(e);
      this.pointers.set(e.pointerId, p);
      this.pointerAt = p;
      this.draggedDistance = 0;
      this.dragMode = e.button === 2 || e.shiftKey || this.pointers.size > 1 ? "pan" : "orbit";
      if (this.pointers.size === 2) {
        const [a, b] = [...this.pointers.values()];
        this.pinchDistanceValue = Math.hypot((a?.x ?? 0) - (b?.x ?? 0), (a?.y ?? 0) - (b?.y ?? 0));
        this.pinchStart = this.distance;
        this.dragMode = "pan";
        this.stick = null;
      }
      // ONE steady flight-stick anchor: a 124×124 zone at left 28 px / bottom 64 px. The 28 px inset
      // keeps a leftward drag clear of Android's edge Back gesture, and the zone sits above the
      // bottom chrome so the thumb never fights a HUD button. It arms on touch, goes live after an
      // 8 px drag, and is invisible the rest of the time.
      if (
        this.pointers.size === 1 &&
        touch(e) &&
        p.x >= 28 &&
        p.x <= 152 &&
        p.y >= this.height - 188 &&
        p.y <= this.height - 64
      ) {
        this.stick = { id: e.pointerId, origin: p, vector: { x: 0, y: 0 }, active: false };
        this.glide = null;
        this.warp = null;
      }
      canvas.classList.add("dragging");
    };

    const move = (e: PointerEvent): void => {
      const p = local(e);
      this.pointerAt = p;
      const prev = this.pointers.get(e.pointerId);
      if (!prev) {
        this.hover(p.x, p.y);
        return;
      }
      const dx = p.x - prev.x;
      const dy = p.y - prev.y;
      this.pointers.set(e.pointerId, p);
      this.draggedDistance += Math.abs(dx) + Math.abs(dy);
      if (this.stick && this.stick.id === e.pointerId) {
        const sx = p.x - this.stick.origin.x;
        const sy = p.y - this.stick.origin.y;
        if (!this.stick.active && Math.hypot(sx, sy) >= 8) this.stick.active = true;
        if (this.stick.active) {
          // Quadratic precision curve: tiny thumb movements give fine control around satellites and
          // stations, while full deflection still cruises a whole sector.
          const curve = (v: number): number => {
            const c = clamp(v / 62, -1, 1);
            return Math.sign(c) * c * c;
          };
          this.stick.vector.x = curve(sx);
          this.stick.vector.y = curve(sy);
        }
        return;
      }
      if (this.pointers.size === 2) {
        const [a, b] = [...this.pointers.values()];
        const d = Math.hypot((a?.x ?? 0) - (b?.x ?? 0), (a?.y ?? 0) - (b?.y ?? 0));
        if (this.pinchDistanceValue > 0) {
          const mid = { x: ((a?.x ?? 0) + (b?.x ?? 0)) / 2, y: ((a?.y ?? 0) + (b?.y ?? 0)) / 2 };
          this.dolly((this.pinchStart * this.pinchDistanceValue) / Math.max(1, d), mid);
        }
        return;
      }
      if (this.dragMode === "pan" || e.shiftKey) {
        this.pan(dx, dy);
      } else {
        // Target angles only: the frame loop damps the camera toward them, so a flick keeps gliding.
        this.yawGoal -= dx * 0.005;
        this.pitchGoal = clamp(this.pitchGoal - dy * 0.005, 0.05, Math.PI - 0.05);
        this.glide = null;
      }
    };

    const up = (e: PointerEvent): void => {
      const wasStick = this.stick?.id === e.pointerId;
      this.pointers.delete(e.pointerId);
      if (wasStick) {
        // Instant stop: the thumb lift zeroes thrust in the same frame, leaving 0 residual drift.
        if (this.stick) {
          this.stick.vector.x = 0;
          this.stick.vector.y = 0;
          this.stick.active = false;
        }
        this.stick = null;
        this.halt();
      }
      if (this.pointers.size === 0) {
        canvas.classList.remove("dragging");
        // Strict zero-drift: the instant the last finger lifts, every goal snaps to where the camera is.
        this.halt();
      }
      if (wasStick || this.draggedDistance > 6) return;
      const p = local(e);
      const hit = this.pick(p.x, p.y);
      if (!hit) {
        this.callbacks.onSelect(null);
        this.callbacks.onInspect?.(null);
        return;
      }
      // A subtle 8 ms haptic confirms a lock without buzzing through a whole drag.
      pulse(8);
      if (hit.cosmic) {
        this.callbacks.onSelect(null);
        this.callbacks.onInspect?.(hit.cosmic);
        this.focusCosmic(hit.id);
        return;
      }
      this.callbacks.onInspect?.(null);
      this.callbacks.onSelect(hit.id);
      if (hit.body) this.focus(hit.id);
    };

    const wheel = (e: WheelEvent): void => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      // Zoom steps scale with the current distance, so a wheel notch is gentle up close and long-range far out.
      const next = clamp(this.distance * Math.exp(e.deltaY * 0.0012), this.floorDistance(), MAX_CAMERA_DISTANCE);
      this.dolly(next, { x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const leave = (): void => {
      if (this.hovered) {
        this.hovered = null;
        canvas.classList.remove("over-body");
        this.callbacks.onHover(null);
      }
    };

    const context = (e: Event): void => e.preventDefault();
    const double = (e: MouseEvent): void => {
      e.preventDefault();
      // Double-tap dives straight into close inspection; empty space still resets the view.
      const p = local(e as unknown as PointerEvent);
      const hit = this.pick(p.x, p.y);
      if (hit?.cosmic) this.focusCosmic(hit.id);
      else if (hit) this.dive(hit.id);
      else this.reset();
    };

    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("wheel", wheel, { passive: false });
    canvas.addEventListener("pointerleave", leave);
    canvas.addEventListener("contextmenu", context);
    canvas.addEventListener("dblclick", double);
    this.cleanup.push(() => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("wheel", wheel);
      canvas.removeEventListener("pointerleave", leave);
      canvas.removeEventListener("contextmenu", context);
      canvas.removeEventListener("dblclick", double);
    });
  }

  private ndc(x: number, y: number): { x: number; y: number } {
    return { x: (x / Math.max(1, this.width)) * 2 - 1, y: -(y / Math.max(1, this.height)) * 2 + 1 };
  }

  private hover(x: number, y: number): void {
    const hit = this.pick(x, y);
    const id = hit?.id ?? null;
    if (id === this.hovered) return;
    this.hovered = id;
    this.callbacks.canvas.classList.toggle("over-body", id !== null);
    this.callbacks.onHover(id);
  }

  private pick(x: number, y: number): { id: string; body: AtlasBody | null; cosmic: CosmicBody | null } | null {
    const n = this.ndc(x, y);
    this.pointer.set(n.x, n.y);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    // Cosmic bodies are picked first, with generous analytic hit-spheres and a hard screen-space
    // floor. A 0.65-unit station or a core singularity stays tappable at any range, and — critically —
    // a black hole can never be hijacked by the discipline star whose anchor it happens to sit near.
    const sphere = new THREE.Sphere();
    const point = new THREE.Vector3();
    let best: { body: CosmicBody; distance: number } | null = null;
    for (const body of this.cosmicBodies) {
      // Never let a container swallow taps from inside it: the camera is already inside that universe
      // or galaxy, and empty space there must deselect rather than warp.
      const inside = this.camera.position.distanceTo(body.center);
      if ((body.kind === "universe" || body.kind === "galaxy") && inside < body.radius * 1.08) continue;
      const slack = body.kind === "station" ? 6 : body.kind === "galaxy" ? 1.35 : body.kind === "universe" ? 1.05 : 1.25;
      sphere.set(body.center, Math.max(body.radius * slack, 0.9));
      if (!this.raycaster.ray.intersectSphere(sphere, point)) continue;
      const distance = point.distanceTo(this.camera.position);
      if (!best || distance < best.distance) best = { body, distance };
    }
    // Anything that is itself the focus of study outranks the loose bodies behind it. Only the faint
    // galaxy/universe containers keep deferring to the star field inside them.
    if (best && best.body.kind !== "galaxy" && best.body.kind !== "universe") {
      return { id: best.body.id, body: null, cosmic: best.body };
    }

    const hits = this.raycaster.intersectObjects(this.pickables, false);
    let bodyHit: { id: string; body: AtlasBody } | null = null;
    for (const hit of hits) {
      const id = hit.object.userData.bodyId as string | undefined;
      if (!id) continue;
      const body = this.bodies.get(id);
      if (body) {
        bodyHit = { id, body };
        break;
      }
    }
    // Small hardware (satellites, stations, moons) gets a 28 px screen-space collider, so a thumb tap
    // never has to land on a two-pixel hull.
    const projected = new THREE.Vector3();
    let near: { id: string; body: AtlasBody; px: number } | null = null;
    // Universal tap-to-select: every kind of body carries a screen-space collider, so a thumb never
    // has to land exactly on a hull. Small hardware gets the widest allowance.
    for (const body of this.bodies.values()) {
      const object = this.bodyObject.get(body.id);
      if (!object) continue;
      object.getWorldPosition(projected);
      if (projected.clone().sub(this.camera.position).dot(this.raycaster.ray.direction) <= 0) continue;
      projected.project(this.camera);
      const dx = ((projected.x + 1) / 2) * this.width - x;
      const dy = ((1 - projected.y) / 2) * this.height - y;
      const px = Math.hypot(dx, dy);
      const limit = body.kind === "satellite" || body.kind === "moon" ? 28 : body.kind === "asteroid" ? 20 : 34;
      if (px > limit) continue;
      if (!near || px < near.px) near = { id: body.id, body, px };
    }
    if (near) return { id: near.id, body: near.body, cosmic: null };
    if (bodyHit) return { id: bodyHit.id, body: bodyHit.body, cosmic: null };
    if (best) return { id: best.body.id, body: null, cosmic: best.body };
    return null;
  }

  private pan(dx: number, dy: number): void {
    const wpp = (2 * Math.tan((this.camera.fov * Math.PI) / 360) * this.distance) / Math.max(1, this.height);
    const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    const up = new THREE.Vector3(
      -Math.sin(this.yaw) * Math.cos(this.pitch),
      Math.sin(this.pitch),
      -Math.cos(this.yaw) * Math.cos(this.pitch),
    );
    this.target.addScaledVector(right, -dx * wpp).addScaledVector(up, dy * wpp);
    this.glide = null;
    this.follow = null;
  }

  /** Dolly toward a screen point: the target moves along the pointer's own ray, so the thing under
   *  the cursor grows instead of the scene sliding sideways. */
  private dolly(nextDistance: number, at: { x: number; y: number }): void {
    const nd = clamp(nextDistance, this.floorDistance(), MAX_CAMERA_DISTANCE);
    const n = this.ndc(at.x, at.y);
    this.pointer.set(n.x, n.y);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const shift = this.distance - nd;
    this.target.addScaledVector(this.raycaster.ray.direction, shift * 0.9);
    // The distance itself is damped toward the goal, so a wheel kick carries momentum.
    this.distanceGoal = nd;
    this.glide = null;
    if (nd < 4) this.follow = this.pick(at.x, at.y)?.id ?? this.follow;
  }

  /** Double-tap dive: 2.8× the body radius, reference-frame lock kept alive. */
  dive(id: string): void {
    const body = this.bodies.get(id);
    const object = this.bodyObject.get(id);
    if (!body || !object) return;
    const pos = new THREE.Vector3();
    object.getWorldPosition(pos);
    const dist = Math.max(MIN_CAMERA_DISTANCE + 0.1, body.radius * 2.8);
    if (this.camera.position.distanceTo(pos) > 3000) {
      this.warpTo(pos, dist, this.yaw, clamp(this.pitch, 0.4, Math.PI - 0.4), id);
      return;
    }
    this.glideTo(pos, dist, this.yaw, clamp(this.pitch, 0.4, Math.PI - 0.4), 700);
    this.follow = id;
    this.followPrev.copy(pos);
  }

  /* ── public controls ──────────────────────────────────────────────────── */

  setFilter(code: string | null): void {
    this.filter = code;
    for (const s of this.systems) {
      const dim = code !== null && code !== s.code;
      const mat = s.star.material as THREE.MeshBasicMaterial;
      mat.transparent = true;
      mat.opacity = dim ? 0.22 : 1;
      s.corona.material.opacity = dim ? 0.1 : 0.55;
      s.light.intensity = dim ? 2 : 18;
      s.group.visible = !dim;
    }
  }

  setSelected(id: string | null): void {
    this.selected = id;
  }

  /**
   * Mastery heatmap: emerald-gold for mastered/demonstrated disciplines, amber warning rings for
   * needs-revision bottlenecks, cool slate for anything never assessed. Reads only real Dexie tiers.
   */
  setHeat(tiers: Map<string, MasteryTier>): void {
    this.heatTiers = tiers;
    for (const s of this.systems) {
      const tier = tiers.get(s.code) ?? "unassessed";
      const mat = s.heat.material as THREE.SpriteMaterial;
      mat.color.setHex(tier === "needs_revision" ? 0xffc66d : tier === "unassessed" ? 0x71819f : tier === "mastered" ? 0x42e6c4 : 0x9fe8d8);
    }
  }

  setHeatmap(on: boolean): void {
    this.heatmap = on;
    for (const s of this.systems) s.heat.visible = on;
    if (on) this.setHeat(this.heatTiers);
  }

  /** The exact colours the heatmap halo materials carry, for inspection and automated checks. */
  heatColors(): string {
    return this.systems
      .map((s) => `${s.code}:${(s.heat.material as THREE.SpriteMaterial).color.getHexString()}`)
      .join(",");
  }

  setHomeSystem(code: string | null): void {
    this.home = code;
  }

  setTimeScale(scale: number): void {
    this.timeScale = scale;
  }

  focusSystem(index: number, instant = false): void {
    const s = this.systems[index];
    if (!s) return;
    const anchor = s.group.position.clone();
    // Framed wide enough that the inner orbits and their worlds are in shot, not just the photosphere.
    if (!instant && this.camera.position.distanceTo(anchor) > 6000) {
      this.warpTo(anchor, 1250, 0.55, 1.16, null);
      return;
    }
    this.glideTo(anchor, 1250, 0.55, 1.16, instant ? 0 : 620);
    this.follow = null;
    this.yawGoal = 0.55;
    this.pitchGoal = 1.16;
    this.distanceGoal = 1250;
  }

  focus(id: string, instant = false): void {
    const body = this.bodies.get(id);
    const object = this.bodyObject.get(id);
    if (!body || !object) return;
    const pos = new THREE.Vector3();
    object.getWorldPosition(pos);
    const dist = Math.max(
      MIN_CAMERA_DISTANCE + 0.4,
      body.kind === "star" ? 1100 : body.radius * (body.kind === "planet" ? 7 : 9),
    );
    // Distant targets take the 900 ms hyperspace lane; nearby ones keep the short orbital glide.
    if (!instant && this.camera.position.distanceTo(pos) > 2600) {
      this.warpTo(pos, dist, this.yaw, clamp(this.pitch, 0.5, Math.PI - 0.5), id);
      return;
    }
    this.glideTo(pos, dist, this.yaw, clamp(this.pitch, 0.5, Math.PI - 0.5), instant ? 0 : 600);
    this.follow = id;
    this.followPrev.copy(pos);
  }

  reset(): void {
    this.follow = null;
    this.glideTo(new THREE.Vector3(0, 0, 0), 20_500, 0.62, 1.06, 620);
  }

  /** Fly to one of the three galaxies, out to the local group, or out to the multiverse box. */
  focusCluster(key: "core" | "frontier" | "vault" | "universe" | "multiverse"): void {
    this.follow = null;
    if (key === "multiverse") {
      this.warpTo(new THREE.Vector3(0, 0, 0), 64_000, 0.62, 1.08, null);
      return;
    }
    if (key === "universe") {
      this.warpTo(new THREE.Vector3(0, 0, 0), 26_500, 0.62, 1.06, null);
      return;
    }
    const anchors = {
      core: new THREE.Vector3(0, 0, 0),
      frontier: new THREE.Vector3(-SYSTEM_SPHERE * 1.5, -900, -SYSTEM_SPHERE * 0.7),
      vault: new THREE.Vector3(SYSTEM_SPHERE * 1.6, 1000, SYSTEM_SPHERE * 0.6),
    };
    this.warpTo(anchors[key], key === "core" ? 20_500 : 5200, 0.62, 1.04, null);
  }

  /** Fly to any universe, galaxy, black hole or station. */
  focusCosmic(id: string): void {
    const body = this.cosmicBodies.find((c) => c.id === id);
    if (!body) return;
    const dist =
      body.kind === "universe"
        ? Math.max(3200, body.radius * 2.4)
        : body.kind === "galaxy"
          ? Math.max(240, body.radius * 4)
          : body.kind === "blackhole"
            ? Math.max(520, body.radius * 6)
            : Math.max(6, body.radius * 10);
    this.warpTo(body.center.clone(), dist, this.yaw, clamp(this.pitch, 0.42, Math.PI - 0.42), null);
  }

  /** A public transport: any body id, near or far, routed through the warp lane. */
  /**
   * A rogue star anchoring into its sector: a brief #A78BFA → #35D9FF tether from wherever the
   * wanderer drifted to the galaxy core, fading out over 0.9 s.
   */
  anchorFlash(id: string): void {
    const object = this.bodyObject.get(id);
    if (!object) return;
    const from = new THREE.Vector3();
    object.getWorldPosition(from);
    const geo = new THREE.BufferGeometry().setFromPoints([from, new THREE.Vector3(0, 0, 0)]);
    geo.setAttribute("color", new THREE.BufferAttribute(new Float32Array([0.65, 0.55, 0.98, 0.21, 0.85, 1]), 3));
    const line = new THREE.Line(
      geo,
      new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    line.renderOrder = 5;
    this.scene.add(line);
    this.tetherFlashes.push({ line, born: typeof performance === "undefined" ? Date.now() : performance.now() });
  }

  /** Keep the streamer's nearest universes and galaxies tappable through the existing cosmic path. */
  private syncStreamerBodies(): void {
    this.cosmicBodies = this.cosmicBodies.filter((b) => !b.id.startsWith("STR-"));
    for (const b of this.streamer.pickable(420)) {
      this.cosmicBodies.push({
        id: b.id,
        kind: b.kind === "universe" ? "universe" : "galaxy",
        name: b.name,
        center: b.center,
        radius: b.radius,
      });
    }
  }

  /** Progression Hardlock: unverified systems sit behind sensor fog until real evidence unlocks them. */
  setProgressionLocked(locked: boolean): void {
    this.progressionLocked = locked;
    for (const s of this.systems) {
      const gate = this.masteryOverride ?? this.progress.get(s.code) ?? 0;
      s.fog.visible = locked && gate < 0.05;
    }
  }

  /** Test Lab override. `null` returns every world to its live Dexie mastery. */
  previewMastery(value: number | null): void {
    this.masteryOverride = value;
    for (const shader of this.nightShaders) shader.mat.uniforms.uProgress!.value = value ?? (this.progress.get(shader.body.node.id) ?? 0);
    for (const mega of this.megaStructures) mega.mesh.visible = (value ?? 1) >= 0.999;
    for (const swarm of this.dysonSwarms) swarm.group.visible = (value ?? 1) >= 0.999;
    if (this.progressionLocked) this.setProgressionLocked(true);
  }

  private clearShowcase(): void {
    if (!this.showcase) return;
    this.root.remove(this.showcase.group);
    this.showcase.group.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (mesh.geometry && !SHARED_GEOMETRY.has(mesh.geometry)) mesh.geometry.dispose();
    });
    this.showcase = null;
    this.stationInteriorPreview = null;
  }

  /** Place an engine-built phenomenon in front of the camera and fly to it. */
  spawnShowcase(kind: "blackhole" | "quasar" | "wormhole" | "binary" | "gas_giant" | "lava" | "pulsar" | "station" | "satellite", variant = 0): void {
    this.clearShowcase();
    const group = new THREE.Group();
    const at = this.target.clone();
    // Park the preview well above the local galaxy plane: a clean star-field backdrop, no label soup.
    at.y += 9000;
    at.x += 2500;
    let update: ((elapsed: number) => void) | undefined;
    let distance = 220;
    if (kind === "blackhole") {
      const bh = createBlackHole(48);
      group.add(bh.group);
      update = bh.update;
      distance = 700;
    } else if (kind === "quasar") {
      const qso = createQuasar(26);
      group.add(qso.group);
      update = qso.update;
      distance = 1400;
    } else if (kind === "wormhole") {
      const hole = createWormhole(120);
      group.add(hole.group);
      update = hole.update;
      distance = 520;
    } else if (kind === "pulsar") {
      const pulsar = createPulsar(2.2);
      group.add(pulsar.group);
      update = pulsar.update;
      distance = 90;
    } else if (kind === "binary") {
      const spec = synthesizeCustomSystem({ seed: 4821, stats: { domainCount: 2, skillCount: 9, masteryRatio: 0.7, needsRevisionCount: 0 } });
      spec.star.multiplicity = "binary";
      if (spec.star.companions.length === 0) spec.star.companions.push({ spectral: spec.star.spectral, separation: 0.9, mass: spec.star.mass * 0.8, radius: spec.star.radius * 0.7, color: 0xffd28e, texture: "star-orange-dwarf" });
      const built = buildEngineSystem(spec, { starRadius: 26, mastery: this.masteryOverride ?? spec.mastery });
      group.add(built.group);
      update = (elapsed) => built.update(0.016, elapsed, this.masteryOverride ?? undefined);
      distance = 620;
    } else if (kind === "station") {
      const station = buildStation(3.0);
      station.interior.visible = true;
      for (const child of station.group.children) if (child !== station.interior) child.visible = false;
      group.add(station.group);
      this.stationInteriorPreview = station.interior;
      distance = 13;
    } else if (kind === "satellite") {
      group.add(buildSatellite(variant, 1.1));
      distance = 9;
    } else {
      const style = biomeById(kind === "lava" ? "lava" : "gas_giant");
      const built = buildShowcasePlanet(style, kind === "gas_giant" ? 3.2 : 2.4, this.masteryOverride ?? 0.6);
      built.star.visible = false;
      group.add(built.group);
      update = (elapsed) => built.update(0.016, elapsed, this.masteryOverride ?? undefined);
      distance = kind === "gas_giant" ? 22 : 12;
    }
    group.position.copy(at);
    // Preview lighting: the gallery is lit like a studio, not by a distant star.
    const key = new THREE.PointLight(0xe8f4ff, 3.2, 0, 1.1);
    key.position.set(6, 9, 12);
    group.add(key);
    const fill = new THREE.PointLight(0x77b8ff, 1.4, 0, 1.4);
    fill.position.set(-10, -6, -8);
    group.add(fill);
    this.root.add(group);
    this.showcase = { group, update, label: kind };
    this.follow = null;
    this.selected = null;
    const previewPitch = kind === "blackhole" ? 1.5 : kind === "quasar" ? 1.56 : kind === "station" ? 1.52 : 1.15;
    this.glideTo(at, distance, this.yaw, previewPitch, 700);
  }

  /** Test Lab gallery: step through all 180 assembled satellites. */
  cycleSatellite(step: number): number {
    const current = this.showcase?.group.userData.variant as number | undefined;
    const next = (((current ?? 0) + step) % SATELLITE_VARIANTS + SATELLITE_VARIANTS) % SATELLITE_VARIANTS;
    this.spawnShowcase("satellite", next);
    if (this.showcase) this.showcase.group.userData.variant = next;
    return next;
  }

  /** Fly straight into the station's lit hangar and command deck. */
  enterStationInterior(): void {
    this.spawnShowcase("station");
  }

  exitShowcase(): void {
    this.clearShowcase();
  }

  travel(id: string): void {
    if (this.cosmicBodies.some((c) => c.id === id)) {
      this.focusCosmic(id);
      return;
    }
    const object = this.bodyObject.get(id);
    if (!object) return;
    const pos = new THREE.Vector3();
    object.getWorldPosition(pos);
    this.warpTo(pos, Math.max(120, this.distance), this.yaw, clamp(this.pitch, 0.4, Math.PI - 0.4), id);
  }

  /** Zero every autonomous velocity: no drift survives a lifted finger. */
  private halt(): void {
    this.yawGoal = this.yaw;
    this.pitchGoal = this.pitch;
    this.distanceGoal = this.distance;
    this.stick = null;
  }

  /** Closest the camera may come: 1.45× the focused body's radius, never inside its hull. Moons and
   *  satellites get a 0.45-unit floor so their hulls can be inspected at panel scale. */
  private floorDistance(): number {
    const id = this.follow ?? this.selected;
    if (id) {
      const body = this.bodies.get(id);
      if (body) {
        const floor = body.kind === "satellite" || body.kind === "moon" ? 0.45 : MIN_CAMERA_DISTANCE;
        return Math.max(floor, body.radius * 1.45);
      }
      const cosmic = this.cosmicBodies.find((c) => c.id === id);
      if (cosmic && cosmic.kind !== "universe" && cosmic.kind !== "galaxy") return Math.max(MIN_CAMERA_DISTANCE, cosmic.radius * 1.45);
    }
    return MIN_CAMERA_DISTANCE;
  }

  private glideTo(target: THREE.Vector3, distance: number, yaw: number, pitch: number, dur: number): void {
    if (dur <= 0) {
      this.target.copy(target);
      this.distance = clamp(distance, MIN_CAMERA_DISTANCE, MAX_CAMERA_DISTANCE);
      this.yaw = yaw;
      this.pitch = pitch;
      this.yawGoal = yaw;
      this.pitchGoal = pitch;
      this.distanceGoal = this.distance;
      this.glide = null;
      return;
    }
    this.glide = {
      from: { target: this.target.clone(), distance: this.distance, yaw: this.yaw, pitch: this.pitch },
      to: { target: target.clone(), distance, yaw, pitch },
      start: performance.now(),
      dur,
    };
  }

  /* ── frame ────────────────────────────────────────────────────────────── */

  private resize(): void {
    const canvas = this.callbacks.canvas;
    const rect = canvas.getBoundingClientRect();
    this.width = Math.max(1, rect.width);
    this.height = Math.max(1, rect.height);
    this.dpr = Math.min(window.devicePixelRatio || 1, 2) * this.quality;
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.setSize(this.width, this.height, false);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    const label = this.callbacks.labelCanvas;
    label.width = Math.round(this.width * this.dpr);
    label.height = Math.round(this.height * this.dpr);
    label.style.width = `${this.width}px`;
    label.style.height = `${this.height}px`;
    this.labelCtx?.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  private frame(): void {
    if (this.disposed) return;
    const now = performance.now();
    const dt = Math.min(0.05, (now - this.lastFrame) / 1000);
    this.lastFrame = now;

    if (this.warp) {
      this.updateWarp(now);
    } else if (this.glide) {
      const raw = clamp((now - this.glide.start) / Math.max(1, this.glide.dur), 0, 1);
      const k = 1 - Math.pow(1 - raw, 3);
      this.target.lerpVectors(this.glide.from.target, this.glide.to.target, k);
      this.distance = Math.exp(
        Math.log(this.glide.from.distance) + (Math.log(this.glide.to.distance) - Math.log(this.glide.from.distance)) * k,
      );
      let dy = (this.glide.to.yaw - this.glide.from.yaw) % (Math.PI * 2);
      if (dy > Math.PI) dy -= Math.PI * 2;
      if (dy < -Math.PI) dy += Math.PI * 2;
      this.yaw = this.glide.from.yaw + dy * k;
      this.pitch = this.glide.from.pitch + (this.glide.to.pitch - this.glide.from.pitch) * k;
      if (raw >= 1) this.glide = null;
      this.yawGoal = this.yaw;
      this.pitchGoal = this.pitch;
      this.distanceGoal = this.distance;
    } else {
      // Inertial damping: orbit, pan and zoom all approach their targets instead of snapping.
      const k = 0.075;
      this.yaw += (this.yawGoal - this.yaw) * k;
      this.pitch += (this.pitchGoal - this.pitch) * k;
      this.distance += (this.distanceGoal - this.distance) * k;
    }

    // Keyboard thrust, in the camera's own frame.
    if (this.keys.size > 0) {
      const step = this.distance * 0.9 * dt;
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);
      const up = new THREE.Vector3(0, 1, 0);
      const push = new THREE.Vector3();
      if (this.keys.has("w") || this.keys.has("arrowup")) push.addScaledVector(forward, step);
      if (this.keys.has("s") || this.keys.has("arrowdown")) push.addScaledVector(forward, -step);
      if (this.keys.has("d") || this.keys.has("arrowright")) push.addScaledVector(right, step);
      if (this.keys.has("a") || this.keys.has("arrowleft")) push.addScaledVector(right, -step);
      if (this.keys.has("q")) push.addScaledVector(up, -step);
      if (this.keys.has("e")) push.addScaledVector(up, step);
      if (push.lengthSq() > 0) {
        this.target.add(push);
        this.follow = null;
        this.glide = null;
      }
    }

    // Left-thumb flight stick: thrust along the camera's look direction and strafe laterally. Speed
    // scales with the current cosmic altitude, and it stops dead the instant the thumb lifts.
    if (this.stick && this.stick.active && !this.warp) {
      const { x, y } = this.stick.vector;
      if (Math.abs(x) > 0.04 || Math.abs(y) > 0.04) {
        // Flight velocity is linked to the speed selector: 0x still flies (at 1x precision), 10x is
        // 2.4× and 100x is 4.6× thrust. Pausing orbits must never strand the pilot.
        const factor = this.timeScale >= 100 ? 4.6 : this.timeScale >= 10 ? 2.4 : 1;
        const speed = clamp(this.distance * 0.42, 3, 9000) * factor;
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);
        this.target.addScaledVector(forward, -y * speed * dt).addScaledVector(right, x * speed * dt);
        this.follow = null;
        this.glide = null;
      }
    }

    this.elapsed += dt * this.timeScale;

    // Orbits, then the reference-frame lock: the camera rides the focused body's displacement.
    let followDelta: THREE.Vector3 | null = null;
    for (const m of this.motions) {
      m.pivot.rotation.y = m.phase + this.elapsed * m.omega;
      if (this.follow && m.body.id === this.follow) {
        const pos = new THREE.Vector3();
        m.holder.getWorldPosition(pos);
        followDelta = pos.clone().sub(this.followPrev);
        this.followPrev.copy(pos);
      }
    }
    if (followDelta && this.follow) {
      this.target.add(followDelta);
    } else if (this.follow) {
      const object = this.bodyObject.get(this.follow);
      if (object) {
        const pos = new THREE.Vector3();
        object.getWorldPosition(pos);
        this.followPrev.copy(pos);
      }
    }

    this.camera.position.set(
      this.target.x + Math.sin(this.pitch) * Math.sin(this.yaw) * this.distance,
      this.target.y + Math.cos(this.pitch) * this.distance,
      this.target.z + Math.sin(this.pitch) * Math.cos(this.yaw) * this.distance,
    );
    this.camera.lookAt(this.target);
    if (this.warpJitter.lengthSq() > 0) this.camera.position.add(this.warpJitter);

    // Phenomenon shaders and the infinite sector field both advance on the same frame clock.
    for (const p of this.phenomena) p.update?.(this.elapsed);
    this.showcase?.update?.(this.elapsed);
    if (this.stationInteriorPreview) {
      const holo = this.stationInteriorPreview.userData.hologram as THREE.Mesh | undefined;
      if (holo) holo.rotation.y += dt * 0.6;
    }
    const streamed = this.streamer.update(this.camera.position, this.distance);
    if (streamed) this.syncStreamerBodies();
    this.camera.near = Math.max(0.02, this.distance * 0.00025);
    this.camera.far = Math.max(420_000, this.distance * 40);
    this.camera.updateProjectionMatrix();

    // Photosphere convection, cloud drift and the binary pair are animated on the same clock, so 0x
    // really freezes everything and 100x speeds it up rather than only moving orbits.
    for (const mat of this.spinMats) mat.uniforms.uSpin!.value = (mat.uniforms.uSpin!.value as number) + dt * 0.01 * Math.max(0.2, this.timeScale);
    for (const c of this.clouds) {
      c.mesh.rotation.y += dt * c.speed * this.timeScale;
      const terrain = c.mesh.parent?.children[0] as THREE.Mesh | undefined;
      if (terrain) terrain.rotation.y += dt * ((terrain.userData.spin as number | undefined) ?? 0.1) * this.timeScale;
    }
    for (const b of this.binaries) {
      const angle = b.phase + this.elapsed * 0.28;
      b.pivot.rotation.y = angle;
      const dir = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));
      b.bridge.position.copy(dir).multiplyScalar(b.separation * 0.5);
      b.bridge.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      b.bridge.scale.set(1, b.separation, 1);
    }
    // Prominences breathe: each loop swells and dims on its own phase, never in lockstep.
    for (const f of this.starFlares) {
      const k = 0.5 + 0.5 * Math.sin(this.elapsed * f.speed + f.phase);
      f.mesh.scale.setScalar(0.9 + k * 0.3);
      f.mat.opacity = 0.05 + k * 0.26;
    }
    // Comets on eccentric orbits: position on an ellipse, tail aimed radially away from the star,
    // longer and brighter near perihelion.
    for (const c of this.comets) {
      const theta = c.phase + this.elapsed * c.speed;
      const px = c.a * (Math.cos(theta) - c.e);
      const pz = c.a * Math.sqrt(Math.max(0, 1 - c.e * c.e)) * Math.sin(theta);
      c.holder.position.set(Math.cos(c.yaw) * px - Math.sin(c.yaw) * pz, Math.sin(theta * 2.3) * c.a * 0.06, Math.sin(c.yaw) * px + Math.cos(c.yaw) * pz);
      const r = c.holder.position.length();
      const glow = clamp(1 - r / (c.a * 1.7), 0, 1);
      const dir = c.holder.position.clone().normalize();
      c.tail.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      c.tail.scale.set(0.85 + glow * 0.6, 14 + glow * 46, 0.85 + glow * 0.6);
      c.coma.scale.setScalar(4 + glow * 7);
      c.tailMat.opacity = 0.1 + glow * 0.35;
    }
    for (const belt of this.belts) belt.holder.rotation.y += dt * 0.045 * belt.spin * Math.max(0.2, this.timeScale);
    for (const m of this.megaStructures) m.mesh.rotation.y += dt * m.speed;
    for (const d of this.dysonSwarms) d.group.rotation.y += dt * d.speed;

    // Level of detail, measured from the camera to each system's own star.
    const camPos = this.camera.position;
    for (const s of this.systems) {
      const d = camPos.distanceTo(s.group.position);
      // Moon and satellite rings fade out smoothly past system scale (no popping).
      const ringFade = clamp((d - 450) / 250, 0, 1);
      for (const r of this.moonRingMats) if (r.system === s.index) r.mat.opacity = 0.22 * (1 - ringFade);
      // Eclipse shadow cone: a moon behind its planet (relative to the star) and inside the umbra
      // radius goes dark. Truly geometric, not a painted-in gradient.
      if (d < 1800) {
        const sun = s.group.position;
        for (const e of this.moonEclipses) {
          if (e.system !== s.index) continue;
          e.moon.getWorldPosition(SCRATCH_A);
          e.planet.getWorldPosition(SCRATCH_B);
          SCRATCH_C.copy(sun).sub(SCRATCH_B).normalize();
          SCRATCH_D.copy(SCRATCH_A).sub(SCRATCH_B);
          const along = SCRATCH_D.dot(SCRATCH_C);
          SCRATCH_D.addScaledVector(SCRATCH_C, -along);
          const inside = along < 0 && SCRATCH_D.length() < e.planetRadius * 1.08;
          const mat = e.shell.material as THREE.MeshBasicMaterial;
          const target = inside ? 0.72 : 0;
          mat.opacity += (target - mat.opacity) * Math.min(1, dt * 6);
          e.shell.visible = mat.opacity > 0.01;
        }
      }
      // Level of detail is what keeps a phone at 60 FPS: only the system being flown stays fully
      // populated, and its moons and satellites appear as the camera closes on them.
      // Four LOD tiers. A: full geometry. B: spheres and tracks. C: one spectral beacon that keeps
      // the exact colour and stays pickable. D: beyond 95,000 units, only the galaxy it belongs to.
      const tier = d < 1800 ? "A" : d < 7500 ? "B" : d < 95_000 ? "C" : "D";
      s.planets.visible = tier === "A" || tier === "B";
      s.small.visible = tier === "A";
      s.moons.visible = tier === "A" && d < 700;
      s.satellites.visible = tier === "A" && d < 60;
      s.star.visible = tier === "A" || tier === "B";
      s.corona.visible = tier === "A" || tier === "B";
      s.beacon.visible = tier === "C";
      if (s.beacon.visible) s.beacon.scale.setScalar(Math.max(60, d * 0.017));
      // Constellation threads are a system-scale reading aid. At galaxy range they collapse into a
      // tangled wire cage, so they fade out entirely rather than clutter the sky.
      for (const wire of s.wires) wire.visible = !this.showcase && d < 3200;
      if (this.heatmap && s.heat.visible) {
        // Mastered sectors breathe emerald-gold; revision bottlenecks pulse an amber warning ring.
        const beat = 0.5 + 0.5 * Math.sin(this.elapsed * 0.0022 + s.index * 1.7);
        s.heat.scale.setScalar(STAR_RADIUS * (9 + beat * 3));
        (s.heat.material as THREE.SpriteMaterial).opacity = 0.28 + beat * 0.26;
      }
      s.star.rotation.y += dt * 0.02;
    }

    // Rogue anchoring tethers: fade in violet→cyan, then dispose without leaking geometries.
    for (let i = this.tetherFlashes.length - 1; i >= 0; i -= 1) {
      const flash = this.tetherFlashes[i]!;
      const age = (performance.now() - flash.born) / 900;
      if (age >= 1) {
        this.scene.remove(flash.line);
        flash.line.geometry.dispose();
        (flash.line.material as THREE.Material).dispose();
        this.tetherFlashes.splice(i, 1);
      } else {
        (flash.line.material as THREE.LineBasicMaterial).opacity = 0.9 * (1 - age);
      }
    }

    // Rogue wanderers drift along the galactic rim, slower at 0x, faster at 100x.
    for (const r of this.rogues) {
      r.angle += dt * r.speed * Math.max(0.15, this.timeScale);
      r.holder.position.set(Math.cos(r.angle) * r.radius, r.y + Math.sin(r.angle * 1.7) * 260, Math.sin(r.angle) * r.radius);
      r.holder.rotation.y += dt * 0.05;
    }
    // Infinite field: only rebuild the 27-cell block when the camera crosses a cell boundary.
    this.ensureInfiniteField(camPos);

    // Scale 1 and 0: the surrounding galaxy field fades in with the local universe, and the lattice
    // cube only appears once the camera pulls back past the universe's edge.
    this.galaxyField.visible = this.distance < 36_000;
    this.multiverse.visible = this.distance > MULTIVERSE_REVEAL;
    const stime = this.elapsed * Math.max(0.2, this.timeScale);
    for (const st of this.stations) {
      st.holder.getWorldPosition(st.cosmic.center);
      st.craft.rotation.y += dt * 0.65 * Math.max(0.2, this.timeScale);
      // Counter-rotating rings, a slow bay pulse and hard navigation strobes.
      st.rings[0]!.rotation.z += dt * 0.55;
      st.rings[1]!.rotation.z -= dt * 0.9;
      (st.bay.material as THREE.MeshBasicMaterial).color.setHSL(0.52, 0.95, 0.55 + 0.12 * Math.sin(stime * 2.2));
      for (const b of st.beacons) {
        const strobe = Math.sin(stime * 5.2 + b.phase);
        b.mat.opacity = strobe > 0.55 ? 1 : 0.12;
      }
    }
    // The galactic glow is a galaxy-scale cue; up close it would white out an inspection.
    for (const g of this.clusterGlows) g.sprite.visible = this.camera.position.distanceTo(g.center) > 3200;
    for (const mat of this.diskMats) mat.uniforms.uTime!.value = now * 0.001;
    // A ring's shadow term needs the planet's current world position, which orbits every frame.
    const wp = new THREE.Vector3();
    for (const r of this.ringShaders) {
      r.mesh.getWorldPosition(wp);
      (r.mat.uniforms.uPlanet!.value as THREE.Vector3).copy(wp);
    }

    // Frame-time guardian: if the rolling average exceeds 22 ms, scale the pixel ratio down in
    // steps; when the device recovers under 14 ms, restore it. This is what holds 60 FPS on Android.
    this.frameAvg = this.frameAvg * 0.92 + Math.min(60, dt * 1000) * 0.08;
    if (now - this.guardClock > 1000) {
      this.guardClock = now;
      if (this.frameAvg > 22 && this.quality > 0.6) {
        this.quality = Math.max(0.6, this.quality - 0.08);
        this.resize();
      } else if (this.frameAvg < 14 && this.quality < 1) {
        this.quality = Math.min(1, this.quality + 0.04);
        this.resize();
      }
    }

    this.renderer.render(this.scene, this.camera);
    this.drawLabels();
    this.emitState(now);
  }

  private emitState(now: number): void {
    if (now - this.stateClock < 120) return;
    this.stateClock = now;
    let nearest: number | null = null;
    let best = 900;
    for (const s of this.systems) {
      const d = this.camera.position.distanceTo(s.group.position);
      if (d < best) {
        best = d;
        nearest = s.index;
      }
    }
    this.callbacks.onState({ distance: this.distance, system: nearest, focused: this.follow });
  }

  /* ── labels ───────────────────────────────────────────────────────────── */

  private drawLabels(): void {
    const ctx = this.labelCtx;
    if (!ctx) return;
    ctx.clearRect(0, 0, this.width, this.height);
    if (this.width < 2) return;
    // A Test Lab preview is a clean specimen: no galaxy label soup over the phenomenon.
    if (this.showcase) return;
    const placed: { x0: number; y0: number; x1: number; y1: number }[] = [];
    // One clean label per visible object: a body can never be captioned twice in a frame.
    const seen = new Set<string>();
    const fits = (x: number, y: number, w: number): boolean => {
      const box = { x0: x - w / 2 - 4, y0: y - 9, x1: x + w / 2 + 4, y1: y + 4 };
      for (const b of placed) if (box.x0 < b.x1 && box.x1 > b.x0 && box.y0 < b.y1 && box.y1 > b.y0) return false;
      placed.push(box);
      return true;
    };
    const project = (object: THREE.Object3D): { x: number; y: number; scale: number } | null => {
      const p = new THREE.Vector3();
      object.getWorldPosition(p);
      const depth = p.distanceTo(this.camera.position);
      p.project(this.camera);
      if (p.z > 1 || p.z < -1) return null;
      return { x: (p.x * 0.5 + 0.5) * this.width, y: (-p.y * 0.5 + 0.5) * this.height, scale: depth };
    };

    const label = (text: string, x: number, y: number, color: string, alpha: number, weight = 600, id?: string): void => {
      if (id) {
        if (seen.has(id)) return;
        seen.add(id);
      }
      ctx.font = `${weight} 11px "JetBrains Mono", ui-monospace, monospace`;
      const w = ctx.measureText(text).width;
      // The top 132px belong to the search bar and the chips; a label under them is unreadable.
      if (x - w / 2 < 4 || x + w / 2 > this.width - 4 || y < 132 || y > this.height - 6) return;
      if (!fits(x, y, w)) return;
      ctx.globalAlpha = alpha * 0.74;
      ctx.fillStyle = "#05080f";
      ctx.fillRect(x - w / 2 - 4, y - 9, w + 8, 14);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.fillText(text, x, y + 1);
      ctx.globalAlpha = 1;
    };

    // Constellation name tags: one per skill family, deduplicated by label, only at sector range.
    if (this.distance < 11_000) {
      for (const t of this.constellationTags) {
        const p = this.projectAt(t.pos);
        if (!p) continue;
        label(t.label, p.x, p.y - 8, t.color, 0.55, 500, `con-${t.label}`);
      }
    }

    // Star systems are labelled from galaxy range in: they are the map's landmarks, and at multiverse
    // scale they are pinpricks that must not bury the universe names.
    for (const s of this.systems) {
      if (this.distance > MULTIVERSE_REVEAL - 2000) break;
      const p = project(s.star);
      if (!p || p.x < -80 || p.x > this.width + 80) continue;
      const dim = this.filter !== null && this.filter !== s.code;
      const alpha = dim ? 0.18 : this.selected === s.star.userData.bodyId ? 0.95 : 0.8;
      const offset = clamp((STAR_RADIUS / p.scale) * (this.height / 2) / Math.tan((this.camera.fov * Math.PI) / 360), 6, 90);
      label(s.code, p.x, p.y - offset - 6, hex(s.color), alpha, 600, `star-${s.code}`);
    }

    // Selected body: pulse ring + its name, always legible.
    if (this.selected) {
      const object = this.bodyObject.get(this.selected);
      const body = this.bodies.get(this.selected);
      if (object && body) {
        const p = project(object);
        if (p) {
          const px = (body.radius / Math.max(0.001, p.scale)) * (this.height / 2) / Math.tan((this.camera.fov * Math.PI) / 360);
          const r = Math.max(8, px * 1.35);
          ctx.strokeStyle = "rgba(53,217,255,0.9)";
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.stroke();
          label(body.label, p.x, p.y - r - 8, "#f1f5ff", 1, 600, body.id);
        }
      }
    }

    // Planet, moon and satellite names appear as their orbit comes into readable range.
    for (const body of this.bodies.values()) {
      if (this.distance > 14_000) break;
      if (body.kind === "star" || body.kind === "asteroid") continue;
      if (body.kind === "constellation") continue;
      const object = this.bodyObject.get(body.id);
      if (!object) continue;
      const p = project(object);
      if (!p) continue;
      const limit = body.kind === "planet" ? 2600 : body.kind === "moon" ? 260 : 26;
      if (p.scale > limit) continue;
      if (p.x < 0 || p.x > this.width || p.y < 0 || p.y > this.height) continue;
      const px = (body.radius / Math.max(0.001, p.scale)) * (this.height / 2) / Math.tan((this.camera.fov * Math.PI) / 360);
      label(body.label, p.x, p.y - Math.max(7, px * 1.5) - 5, body.kind === "planet" ? "#a8b6d2" : "#8fa3c4", body.kind === "planet" ? 0.8 : 0.62, 500, body.id);
    }

    // The claimed system wears a gold dashed ring, drawn in 3D-safe screen space.
    for (const s of this.systems) {
      if (this.distance > MULTIVERSE_REVEAL - 2000) break;
      if (s.code !== this.home) continue;
      const p = project(s.star);
      if (!p) continue;
      const px = (STAR_RADIUS / Math.max(0.001, p.scale)) * (this.height / 2) / Math.tan((this.camera.fov * Math.PI) / 360);
      const r = Math.max(10, px * 1.7);
      ctx.save();
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = "rgba(255,206,140,0.95)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      ctx.font = '700 9px "JetBrains Mono", ui-monospace, monospace';
      ctx.fillStyle = "rgba(255,214,160,0.95)";
      ctx.textAlign = "center";
      ctx.fillText("MY ATHENA", p.x, p.y - r - 6);
    }

    // Universes and galaxies are labelled only while the camera is out at their scale.
    if (this.multiverse.visible) {
      for (const body of this.cosmicBodies) {
        if (body.kind !== "universe") continue;
        const d = this.camera.position.distanceTo(body.center);
        if (d > 120_000 || d < body.radius * 1.4) continue;
        const p = this.projectAt(body.center);
        if (!p) continue;
        label(body.name, p.x, p.y - 16, body.id === "UNI-0" ? "#eafcff" : "#9fb6d8", 0.72, 600, `uni-${body.id}`);
      }
    }
    if (this.galaxyField.visible) {
      for (const body of this.cosmicBodies) {
        if (body.kind !== "galaxy") continue;
        const d = this.camera.position.distanceTo(body.center);
        if (d > 14_000) continue;
        const p = this.projectAt(body.center);
        if (!p) continue;
        label(body.name, p.x, p.y - 12, "#b9cbe8", 0.55, 500, `gal-${body.id}`);
        if (seen.size > 40) break;
      }
    }

    // Hyperspace: a target reticle locks on while the camera stretches its field of view.
    if (this.warp) {
      const p = this.projectAt(this.warp.reticle);
      if (p) {
        const t = (performance.now() - this.warp.start) / this.warp.dur;
        const r = 18 + clamp(t, 0, 1) * 26;
        ctx.strokeStyle = "rgba(255,243,209,0.95)";
        ctx.lineWidth = 1.6;
        const corners: [number, number][] = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
        for (const [sx, sy] of corners) {
          ctx.beginPath();
          ctx.moveTo(p.x + sx * r, p.y + sy * (r - 9));
          ctx.lineTo(p.x + sx * r, p.y + sy * r);
          ctx.lineTo(p.x + sx * (r - 9), p.y + sy * r);
          ctx.stroke();
        }
        ctx.font = '700 9px "JetBrains Mono", ui-monospace, monospace';
        ctx.fillStyle = "rgba(255,243,209,0.9)";
        ctx.textAlign = "center";
        ctx.fillText("TARGET LOCK", p.x, p.y + r + 14);
      }
    }

    // The invisible flight stick: a 48 px translucent cyan ring under the live thumb, and nothing at all
    // when the thumb lifts. The puck rides the quadratic curve, so it hugs the centre until the
    // thumb commits to a direction.
    const stick = this.stick;
    if (stick && stick.active) {
      const o = stick.origin;
      ctx.save();
      ctx.strokeStyle = "rgba(53,217,255,0.55)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(o.x, o.y, 48, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "rgba(53,217,255,0.10)";
      ctx.beginPath();
      ctx.arc(o.x, o.y, 48, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(126,232,255,0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(o.x, o.y, 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "rgba(126,232,255,0.9)";
      ctx.beginPath();
      ctx.arc(o.x + stick.vector.x * 38, o.y + stick.vector.y * 38, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  /** Project a world point to screen pixels, used by labels and the warp reticle. */
  private projectAt(point: THREE.Vector3): { x: number; y: number } | null {
    const p = point.clone().project(this.camera);
    if (p.z > 1 || p.z < -1) return null;
    return { x: (p.x * 0.5 + 0.5) * this.width, y: (-p.y * 0.5 + 0.5) * this.height };
  }

  /* ── multiverse, galaxies and hyperspace ──────────────────────────────── */

  /** Scale 0 and 1: the lattice cube, 24 universes, the surrounding galaxy field, web and nebulae. */
  private buildCosmos(): void {
    this.scene.add(this.cosmos);
    this.cosmos.add(this.multiverse, this.galaxyField);

    const h = MULTIVERSE_HALF;
    // The containment wireframe cube is gone: the streamer owns the 360° field now.
    this.cosmos.add(this.streamer.group);
    this.streamer.group.position.set(0, 0, 0);
    this.streamer.update(new THREE.Vector3(0, 0, 0), 60_000, true);

    // 24 procedural universes, spread through the volume with a real minimum separation.
    const centres: THREE.Vector3[] = [new THREE.Vector3(0, 0, 0)];
    for (let i = 1; i < UNIVERSE_COUNT; i += 1) {
      for (let attempt = 0; attempt < 80; attempt += 1) {
        const p = new THREE.Vector3(
          (hash01(i, attempt, 61) - 0.5) * h * 1.56,
          (hash01(i, attempt, 62) - 0.5) * h * 1.56,
          (hash01(i, attempt, 63) - 0.5) * h * 1.56,
        );
        if (centres.every((c) => c.distanceTo(p) > 7600)) {
          centres.push(p);
          break;
        }
      }
    }
    const tints = [0x7ce8ff, 0xffc66d, 0xa78bfa, 0x42e6c4, 0xff8fb1, 0x9fb6ff];
    const uniPos: number[] = [];
    const uniCol: number[] = [];
    for (let i = 0; i < centres.length; i += 1) {
      const centre = centres[i]!;
      const radius = i === 0 ? 8800 : 2200 + hash01(i, 64) * 1500;
      const cloud = galaxyPoints(i * 131 + 7, i === 0 ? 900 : 560, radius, i % 4);
      const tint = new THREE.Color(tints[i % tints.length]!);
      for (let v = 0; v < cloud.positions.length; v += 3) {
        uniPos.push(cloud.positions[v]! + centre.x, cloud.positions[v + 1]! + centre.y, cloud.positions[v + 2]! + centre.z);
        uniCol.push(cloud.colors[v]! * tint.r, cloud.colors[v + 1]! * tint.g, cloud.colors[v + 2]! * tint.b);
      }
      this.cosmicBodies.push({ id: `UNI-${i}`, kind: "universe", name: universeName(i), center: centre, radius });
    }
    const uniGeo = new THREE.BufferGeometry();
    uniGeo.setAttribute("position", new THREE.Float32BufferAttribute(uniPos, 3));
    uniGeo.setAttribute("color", new THREE.Float32BufferAttribute(uniCol, 3));
    this.multiverse.add(
      new THREE.Points(
        uniGeo,
        new THREE.PointsMaterial({ size: 170, sizeAttenuation: true, vertexColors: true, map: CRISP_STAR, transparent: true, opacity: 0.92, depthWrite: false, blending: THREE.AdditiveBlending }),
      ),
    );

    // Inter-universe filaments: every universe threads to its two nearest neighbours along a bowed
    // path, giving the lattice cube visible large-scale structure instead of a bare wireframe.
    const filPos: number[] = [];
    const filCol: number[] = [];
    for (let i = 0; i < centres.length; i += 1) {
      const near = centres
        .map((c, j) => ({ j, d: centres[i]!.distanceTo(c) }))
        .filter((o) => o.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      for (const n of near) {
        const a = centres[i]!;
        const b = centres[n.j]!;
        const mid = a
          .clone()
          .add(b)
          .multiplyScalar(0.5)
          .add(new THREE.Vector3(0, (hash01(i, n.j, 65) - 0.5) * 2200, 0));
        const tint = new THREE.Color(tints[i % tints.length]!);
        filPos.push(a.x, a.y, a.z, mid.x, mid.y, mid.z, mid.x, mid.y, mid.z, b.x, b.y, b.z);
        for (let v = 0; v < 4; v += 1) filCol.push(tint.r * 0.32, tint.g * 0.32, tint.b * 0.32);
      }
    }
    const filGeo = new THREE.BufferGeometry();
    filGeo.setAttribute("position", new THREE.Float32BufferAttribute(filPos, 3));
    filGeo.setAttribute("color", new THREE.Float32BufferAttribute(filCol, 3));
    this.multiverse.add(
      new THREE.LineSegments(
        filGeo,
        new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending }),
      ),
    );

    // Scale 1 — 184 galaxies in every direction, merged into one draw call of glowing arms.
    const galPos: number[] = [];
    const galCol: number[] = [];
    const galaxies: { center: THREE.Vector3; radius: number }[] = [];
    for (let i = 0; i < FIELD_GALAXY_COUNT; i += 1) {
      const a = hash01(i, 71) * Math.PI * 2;
      const shell = 13_000 + hash01(i, 72) * 13_000;
      const centre = new THREE.Vector3(Math.cos(a) * shell, (hash01(i, 73) - 0.5) * 11_000, Math.sin(a) * shell);
      const radius = 300 + hash01(i, 74) * 640;
      const variant = i % 4;
      const cloud = galaxyPoints(i * 97 + 13, 240 + (i % 5) * 46, radius, variant);
      for (let v = 0; v < cloud.positions.length; v += 3) {
        galPos.push(cloud.positions[v]! + centre.x, cloud.positions[v + 1]! + centre.y, cloud.positions[v + 2]! + centre.z);
        galCol.push(cloud.colors[v]!, cloud.colors[v + 1]!, cloud.colors[v + 2]!);
      }
      galaxies.push({ center: centre, radius });
      this.cosmicBodies.push({ id: `GAL-${i}`, kind: "galaxy", name: galaxyName(i), center: centre, radius });
    }
    const galGeo = new THREE.BufferGeometry();
    galGeo.setAttribute("position", new THREE.Float32BufferAttribute(galPos, 3));
    galGeo.setAttribute("color", new THREE.Float32BufferAttribute(galCol, 3));
    this.galaxyField.add(
      new THREE.Points(
        galGeo,
        new THREE.PointsMaterial({ size: 34, sizeAttenuation: true, vertexColors: true, map: CRISP_STAR, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending }),
      ),
    );

    // Cosmic web filaments between nearby galaxies: faint structure, never a black wall.
    const web: number[] = [];
    let links = 0;
    for (let i = 0; i < galaxies.length && links < 150; i += 1) {
      for (let j = i + 1; j < galaxies.length && links < 150; j += 1) {
        const a = galaxies[i]!;
        const b = galaxies[j]!;
        if (a.center.distanceTo(b.center) > 9500) continue;
        web.push(a.center.x, a.center.y, a.center.z, b.center.x, b.center.y, b.center.z);
        links += 1;
      }
    }
    const webGeo = new THREE.BufferGeometry();
    webGeo.setAttribute("position", new THREE.Float32BufferAttribute(web, 3));
    this.galaxyField.add(new THREE.LineSegments(webGeo, new THREE.LineBasicMaterial({ color: 0x3d5c96, transparent: true, opacity: 0.22, depthWrite: false })));

    // Volumetric nebulae: three deep hues layered at different scales, so 360° flight reads as a
    // galaxy rather than a scatter plot. Colour is additive and low-opacity to keep stars legible.
    const nebulaTints = ["rgba(30,58,95,0.95)", "rgba(45,27,78,0.95)", "rgba(19,56,58,0.95)"];
    const nebulaCores = ["rgba(96,164,255,0.5)", "rgba(168,120,255,0.45)", "rgba(96,235,214,0.4)"];
    for (let i = 0; i < 18; i += 1) {
      const a = hash01(i, 76) * Math.PI * 2;
      const r = 9000 + hash01(i, 77) * 18_000;
      const hue = i % 3;
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: radialSprite(nebulaCores[hue]!, nebulaTints[hue]!),
          transparent: true,
          opacity: 0.2,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      sprite.scale.setScalar(6000 + hash01(i, 78) * 15_000);
      sprite.position.set(Math.cos(a) * r, (hash01(i, 79) - 0.5) * 11_000, Math.sin(a) * r);
      this.galaxyField.add(sprite);
    }

    // Every galaxy has a supermassive black hole at its centre, drawn as three instanced meshes.
    this.buildInstancedCores([...galaxies, ...centres.slice(1).map((c, i) => ({ center: c, radius: 2200 + i * 40 }))]);
  }

  private buildInstancedCores(cores: { center: THREE.Vector3; radius: number }[]): void {
    if (cores.length === 0) return;
    const n = cores.length;
    const horizon = new THREE.InstancedMesh(UNIT_SPHERE_LO, new THREE.MeshBasicMaterial({ color: 0x000000 }), n);
    const photon = new THREE.InstancedMesh(
      new THREE.RingGeometry(1.0, 1.1, 40),
      new THREE.MeshBasicMaterial({ color: 0xfff3d1, transparent: true, opacity: 0.9, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }),
      n,
    );
    const diskMat = blackHoleDiskMaterial(3.4);
    this.diskMats.push(diskMat);
    const disk = new THREE.InstancedMesh(new THREE.RingGeometry(1.35, 3.4, 56), diskMat, n);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const pos = new THREE.Vector3();
    const scl = new THREE.Vector3();
    const tilt = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2 - 0.3);
    cores.forEach((core, i) => {
      const scale = Math.max(14, core.radius * 0.06);
      pos.copy(core.center);
      q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), hash01(i, 81) * Math.PI * 2);
      m.compose(pos, q, scl.setScalar(scale));
      horizon.setMatrixAt(i, m);
      photon.setMatrixAt(i, m);
      q.multiply(tilt);
      m.compose(pos, q, scl.setScalar(scale));
      disk.setMatrixAt(i, m);
    });
    for (const mesh of [horizon, photon, disk]) {
      mesh.instanceMatrix.needsUpdate = true;
      mesh.frustumCulled = false;
      this.galaxyField.add(mesh);
    }
  }

  /** A quasar: relativistic black hole with feathered, particle-streaming twin jets. */
  private quasar(scale: number): THREE.Group {
    const qso = createQuasar(scale);
    this.phenomena.push({ object: qso.group, update: qso.update });
    return qso.group;
  }

  /** A relativistic black hole: Schwarzschild shadow, photon ring, lensing shell, Doppler disk. */
  private relativisticBlackHole(scale: number): THREE.Group {
    const bh = createBlackHole(scale);
    this.phenomena.push({ object: bh.group, update: bh.update });
    return bh.group;
  }

  /** A multi-deck outpost from the spacecraft assembler: decks, rails, pads, hangar and interior. */
  private stationMesh(scale: number): { craft: THREE.Group; rings: THREE.Object3D[]; beacons: { mat: THREE.MeshBasicMaterial; phase: number }[]; bay: THREE.Mesh } {
    const station = buildStation(scale);
    const craft = station.group;
    craft.userData.walkableSurfaces = station.walkableSurfaces;
    craft.userData.interiorBounds = station.interiorBounds;
    craft.userData.interior = station.interior;
    this.stationInteriorPreview = station.interior;
    this.stationsInteriors.push(station.interior);
    return { craft, rings: station.rings, beacons: station.beacons, bay: station.bay };
  }

  private addStation(id: string, parent: THREE.Object3D, scale: number, orbit: number): void {
    const pivot = new THREE.Object3D();
    pivot.rotation.set((hash01(id.length, 91) - 0.5) * 0.5, hash01(id.length, 92) * Math.PI * 2, 0.12);
    const holder = new THREE.Object3D();
    holder.position.set(orbit, 0, 0);
    pivot.add(holder);
    const { craft, rings, beacons, bay } = this.stationMesh(scale);
    holder.add(craft);
    parent.add(pivot);
    const cosmic: CosmicBody = { id, kind: "station", name: "Orbital Station", center: new THREE.Vector3(), radius: scale };
    this.cosmicBodies.push(cosmic);
    this.stations.push({ holder, craft, cosmic, rings, beacons, bay });
  }

  /** The tunnel is a child of the camera, so it always streaks straight ahead. */
  private buildWarpTunnel(): void {
    const count = 520;
    const positions = new Float32Array(count * 6);
    const colors = new Float32Array(count * 6);
    const palette = [new THREE.Color(0x7ce8ff), new THREE.Color(0xffd27c), new THREE.Color(0xa78bfa)];
    for (let i = 0; i < count; i += 1) {
      const a = hash01(i, 31) * Math.PI * 2;
      const r = 0.5 + hash01(i, 32) * 7;
      const z = -2 - hash01(i, 33) * 42;
      const len = 1.6 + hash01(i, 34) * 5;
      const c = palette[i % 3]!;
      positions.set([Math.cos(a) * r, Math.sin(a) * r, z, Math.cos(a) * r, Math.sin(a) * r, z - len], i * 6);
      colors.set([c.r, c.g, c.b, c.r * 0.15, c.g * 0.15, c.b * 0.15], i * 6);
      this.warpSeed.push({ a, r, z, len, speed: 26 + hash01(i, 35) * 46 });
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    this.warpLines = new THREE.LineSegments(
      geo,
      new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    this.warpLines.visible = false;
    this.warpLines.frustumCulled = false;
    this.camera.add(this.warpLines);

    // Arrival shockwave: two concentric rings (cyan outside, gold inside) expanding in the camera's
    // own frame as the ship drops out of hyperspace.
    this.warpShock = new THREE.Group();
    this.warpShockMats = [];
    for (const [color, z] of [[0x9beeff, -3.2], [0xffd79a, -3.0]] as const) {
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false });
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.86, 1, 96), mat);
      ring.position.z = z;
      ring.visible = false;
      this.warpShockMats.push(mat);
      this.warpShock.add(ring);
    }
    this.warpShock.visible = false;
    this.warpShock.frustumCulled = false;
    this.camera.add(this.warpShock);
  }

  /** 900 ms, three stages: lock-on (FOV 55→94), hyper-tunnel with micro-shake, then the deceleration
   *  drop-in and expanding arrival shockwave (94→55). */
  warpTo(position: THREE.Vector3, distance: number, yaw: number, pitch: number, follow: string | null): void {
    this.warp = {
      from: { target: this.target.clone(), distance: this.distance, yaw: this.yaw, pitch: this.pitch },
      to: { target: position.clone(), distance: clamp(distance, MIN_CAMERA_DISTANCE, MAX_CAMERA_DISTANCE), yaw, pitch },
      start: performance.now(),
      dur: 900,
      follow,
      reticle: position.clone(),
    };
    this.glide = null;
    this.stick = null;
    this.callbacks.canvas.parentElement?.classList.add("warping");
  }

  private updateWarp(now: number): void {
    const w = this.warp;
    if (!w) return;
    const raw = clamp((now - w.start) / w.dur, 0, 1);
    const peak = 94;
    const fov = raw < 0.2 ? BASE_FOV + (peak - BASE_FOV) * Math.pow(raw / 0.2, 0.7) : raw < 0.8 ? peak : peak + (BASE_FOV - peak) * Math.pow((raw - 0.8) / 0.2, 0.55);
    // High-velocity micro-shake, strongest mid-tunnel and gone before the drop-in settles.
    if (raw > 0.18 && raw < 0.82) {
      const amp = 0.045 * Math.sin(Math.PI * clamp((raw - 0.18) / 0.64, 0, 1));
      this.warpJitter.set(Math.sin(now * 0.077) * amp, Math.cos(now * 0.093) * amp, 0);
    } else {
      this.warpJitter.multiplyScalar(0.8);
    }
    // Arrival ring: expands from the reticle and fades over the last 260 ms.
    const shock = clamp((raw - 0.76) / 0.24, 0, 1);
    this.warpShock.visible = shock > 0 && shock < 1;
    this.warpShock.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      mesh.visible = this.warpShock.visible;
      const k = clamp(shock * 1.25 - i * 0.18, 0, 1);
      mesh.scale.setScalar(0.35 + k * 11);
      this.warpShockMats[i]!.opacity = (1 - shock) * 0.65;
    });
    this.camera.fov = fov;
    this.camera.updateProjectionMatrix();
    if (raw < 0.8) {
      // Hold the origin while the tunnel conveys the distance, with a slight pull-back for scale.
      this.target.copy(w.from.target);
      this.distance = w.from.distance * (1 - 0.1 * clamp((raw - 0.2) / 0.6, 0, 1));
      this.yaw = w.from.yaw + raw * 0.16;
      this.pitch = w.from.pitch;
    } else {
      const k = 1 - Math.pow(1 - (raw - 0.8) / 0.2, 3);
      this.target.lerpVectors(w.from.target, w.to.target, k);
      this.distance = Math.exp(Math.log(w.from.distance) + (Math.log(w.to.distance) - Math.log(w.from.distance)) * k);
      let dy = (w.to.yaw - w.from.yaw) % (Math.PI * 2);
      if (dy > Math.PI) dy -= Math.PI * 2;
      if (dy < -Math.PI) dy += Math.PI * 2;
      this.yaw = w.from.yaw + dy * k;
      this.pitch = w.from.pitch + (w.to.pitch - w.from.pitch) * k;
    }
    this.yawGoal = this.yaw;
    this.pitchGoal = this.pitch;
    this.distanceGoal = this.distance;
    this.warpLines.visible = raw >= 0.18 && raw < 0.86;
    if (this.warpLines.visible) this.streakTunnel(1);
    if (raw >= 1) {
      this.camera.fov = BASE_FOV;
      this.camera.updateProjectionMatrix();
      this.warpLines.visible = false;
      this.warpShock.visible = false;
      this.warpJitter.set(0, 0, 0);
      this.callbacks.canvas.parentElement?.classList.remove("warping");
      this.warp = null;
      pulse(8);
      this.follow = w.follow;
      if (w.follow) {
        const object = this.bodyObject.get(w.follow);
        if (object) this.followPrev.setFromMatrixPosition(object.matrixWorld);
      }
    }
  }

  private streakTunnel(step: number): void {
    const attr = this.warpLines.geometry.getAttribute("position") as THREE.BufferAttribute;
    const array = attr.array as Float32Array;
    for (let i = 0; i < this.warpSeed.length; i += 1) {
      const s = this.warpSeed[i]!;
      s.z += s.speed * step;
      if (s.z > -1.2) s.z -= 44;
      const x = Math.cos(s.a) * s.r;
      const y = Math.sin(s.a) * s.r;
      array[i * 6] = x;
      array[i * 6 + 1] = y;
      array[i * 6 + 2] = s.z;
      array[i * 6 + 3] = x;
      array[i * 6 + 4] = y;
      array[i * 6 + 5] = s.z - s.len;
    }
    attr.needsUpdate = true;
  }

  /* ── teardown ─────────────────────────────────────────────────────────── */

  private disposeRoot(): void {
    this.scene.remove(this.root);
    this.root.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      // Shared unit spheres and generated sprites survive a rebuild; disposing them would blank every
      // later system.
      if (mesh.geometry && !SHARED_GEOMETRY.has(mesh.geometry)) mesh.geometry.dispose();
      const mat = (mesh as THREE.Mesh).material;
      if (Array.isArray(mat)) for (const m of mat) m.dispose();
      else if (mat) mat.dispose();
    });
    this.scene.add(this.root);
  }

  destroy(): void {
    this.disposed = true;
    this.renderer.setAnimationLoop(null);
    this.ro.disconnect();
    for (const fn of this.cleanup) fn();
    this.cleanup.length = 0;
    this.disposeRoot();
    this.renderer.dispose();
  }
}

/** Doppler-beamed accretion disk: blue-white on the approaching side, gold-amber on the receding side. */
function blackHoleDiskMaterial(radius: number): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uR: { value: radius } },
    vertexShader:
      "varying vec2 vP;\n" +
      "void main() { vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader:
      "uniform float uTime; uniform float uR; varying vec2 vP;\n" +
      "float hash21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }\n" +
      "float vnoise(vec2 p) {\n" +
      "  vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);\n" +
      "  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),\n" +
      "             mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x), f.y);\n" +
      "}\n" +
      "void main() {\n" +
      "  vec2 p = vP / uR;\n" +
      "  float r = length(p);\n" +
      "  float a = atan(p.y, p.x);\n" +
      // Differential rotation: the inner disk laps the outer disk, shearing the plasma into spiral arms.
      "  float spin = uTime * (0.6 + 1.7 / max(r, 0.14));\n" +
      "  float arms = sin(a * 3.0 + r * 15.0 - spin * 2.4);\n" +
      "  float fine = vnoise(vec2(a * 2.6 + uTime * 0.24, r * 10.0 - uTime * 0.85));\n" +
      "  float turb = 0.5 + 0.32 * arms + 0.42 * fine;\n" +
      "  turb *= 0.7 + 0.3 * vnoise(vec2(a * 7.0 - uTime * 0.4, r * 22.0 + uTime * 0.3));\n" +
      // Relativistic beaming: the approaching limb blueshifts and brightens, the receding limb redshifts.
      "  float dopp = smoothstep(-0.9, 0.9, cos(a));\n" +
      "  float beam = pow(dopp, 2.4);\n" +
      "  vec3 blue = vec3(0.545, 0.914, 0.992);\n" +
      "  vec3 white = vec3(1.0, 0.988, 0.965);\n" +
      "  vec3 amber = vec3(1.0, 0.616, 0.231);\n" +
      "  vec3 crimson = vec3(0.851, 0.306, 0.157);\n" +
      "  vec3 hot = mix(blue, white, clamp(beam * 1.2, 0.0, 1.0));\n" +
      "  vec3 cool = mix(crimson, amber, 1.0 - smoothstep(0.2, 1.0, r));\n" +
      "  vec3 c = mix(cool, hot, dopp);\n" +
      "  float edge = smoothstep(0.32, 0.44, r) * smoothstep(1.0, 0.6, r);\n" +
      "  float alpha = edge * (0.18 + 0.82 * turb) * (0.55 + 0.45 * smoothstep(0.3, 0.7, fine));\n" +
      "  gl_FragColor = vec4(c * (0.42 + 1.55 * beam * turb), alpha * 0.72);\n" +
      "}",
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}

/** View-dependent Einstein halo: brightens at grazing angles so the lensed shell wraps the shadow
 *  from every orbit position, bending the disk's far side above and below the horizon. */
function lensingHaloMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader:
      "varying vec3 vN; varying vec3 vV; varying vec3 vP;\n" +
      "void main() {\n" +
      "  vec4 wp = modelMatrix * vec4(position, 1.0);\n" +
      "  vN = normalize(mat3(modelMatrix) * normal);\n" +
      "  vV = normalize(cameraPosition - wp.xyz);\n" +
      "  vP = position;\n" +
      "  gl_Position = projectionMatrix * viewMatrix * wp;\n" +
      "}",
    fragmentShader:
      "uniform float uTime; varying vec3 vN; varying vec3 vV; varying vec3 vP;\n" +
      "void main() {\n" +
      "  float rim = 1.0 - abs(dot(normalize(vN), normalize(vV)));\n" +
      "  float ring = pow(rim, 6.0);\n" +
      "  float bend = pow(rim, 2.0) * 0.2;\n" +
      "  float bands = 0.78 + 0.22 * sin(vP.y * 8.0 + uTime * 0.9);\n" +
      "  vec3 tint = mix(vec3(1.0, 0.945, 0.86), vec3(0.545, 0.855, 1.0), smoothstep(0.35, 1.0, rim));\n" +
      "  gl_FragColor = vec4(tint * (ring * 1.3 + bend) * bands, ring * 0.55 + bend * 0.55);\n" +
      "}",
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}

/** Night-side emission: warm city grids and cyan fusion hubs, lit only where the star does not reach. */
function nightLightsMaterial(sun: THREE.Vector3): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uSun: { value: sun.clone() },
      uProgress: { value: 0 },
      uWarm: { value: new THREE.Color(0xffc66d) },
      uCool: { value: new THREE.Color(0x35d9ff) },
    },
    vertexShader:
      "varying vec3 vN; varying vec3 vWorld;\n" +
      "void main() {\n" +
      "  vN = normalize(mat3(modelMatrix) * normal);\n" +
      "  vec4 wp = modelMatrix * vec4(position, 1.0);\n" +
      "  vWorld = wp.xyz;\n" +
      "  gl_Position = projectionMatrix * viewMatrix * wp;\n" +
      "}",
    fragmentShader:
      "uniform vec3 uSun; uniform float uProgress; uniform vec3 uWarm; uniform vec3 uCool;\n" +
      "varying vec3 vN; varying vec3 vWorld;\n" +
      "void main() {\n" +
      "  vec3 n = normalize(vN);\n" +
      "  float lit = dot(n, normalize(uSun - vWorld));\n" +
      "  float night = smoothstep(0.14, -0.3, lit);\n" +
      "  float gx = sin(vWorld.x * 15.0) * sin(vWorld.y * 12.0) * sin(vWorld.z * 14.0);\n" +
      "  float grid = smoothstep(0.16, 0.96, abs(gx));\n" +
      "  float hub = smoothstep(0.5, 0.98, sin(vWorld.x * 3.1 + vWorld.y * 2.3) * sin(vWorld.z * 3.7));\n" +
      "  vec3 c = mix(uWarm, uCool, hub);\n" +
      "  float a = night * uProgress * (0.2 + 0.8 * grid);\n" +
      "  gl_FragColor = vec4(c * a * 1.35, a * 0.85);\n" +
      "}",
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}

/** A shader ring: concentric bands, a Cassini division, and the planet's shadow across the far side. */
function ringMaterial(inner: number, outer: number, tint: THREE.Color, sun: THREE.Vector3): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uInner: { value: inner },
      uOuter: { value: outer },
      uSun: { value: sun.clone() },
      uPlanet: { value: new THREE.Vector3() },
      uTint: { value: tint },
    },
    vertexShader:
      "varying vec3 vWorld; varying float vR;\n" +
      "void main() {\n" +
      "  vR = length(position.xy);\n" +
      "  vec4 wp = modelMatrix * vec4(position, 1.0);\n" +
      "  vWorld = wp.xyz;\n" +
      "  gl_Position = projectionMatrix * viewMatrix * wp;\n" +
      "}",
    fragmentShader:
      "uniform float uInner; uniform float uOuter; uniform vec3 uSun; uniform vec3 uPlanet; uniform vec3 uTint;\n" +
      "varying vec3 vWorld; varying float vR;\n" +
      "void main() {\n" +
      "  float t = clamp((vR - uInner) / (uOuter - uInner), 0.0, 1.0);\n" +
      "  float b1 = 0.5 + 0.5 * sin(t * 24.0);\n" +
      "  float b2 = 0.5 + 0.5 * sin(t * 57.0 + 1.7);\n" +
      "  float bands = 0.45 + 0.55 * (0.62 * b1 + 0.38 * b2);\n" +
      "  float cassini = smoothstep(0.43, 0.47, t) * smoothstep(0.57, 0.53, t);\n" +
      "  float gap = 1.0 - cassini * 0.92;\n" +
      "  float edge = smoothstep(0.0, 0.05, t) * smoothstep(1.0, 0.92, t);\n" +
      // A true shadow cylinder: project each ring fragment onto the planet→star axis. Anything behind\n      // the planet and inside its radius is in umbra, so the eclipse is a crisp curved band rather\n      // than a soft gradient. The penumbra widens slightly with distance.\n" +
      "  vec3 sunDir = normalize(uSun - uPlanet);\n" +
      "  vec3 rel = vWorld - uPlanet;\n" +
      "  float along = dot(rel, sunDir);\n" +
      "  float rAxis = length(rel - sunDir * along);\n" +
      "  float planetR = uInner / 1.45;\n" +
      "  float penumbra = planetR * (1.0 + max(0.0, -along) * 0.0008);\n" +
      "  float inCyl = smoothstep(penumbra * 1.12, penumbra * 0.94, rAxis);\n" +
      "  float behind = smoothstep(0.02, -0.06, along);\n" +
      "  float shadow = 1.0 - behind * inCyl * 0.86;\n" +
      "  vec3 c = mix(uTint, vec3(1.0), bands * 0.4);\n" +
      "  float a = edge * gap * (0.26 + 0.34 * bands) * shadow;\n" +
      "  gl_FragColor = vec4(c * (0.6 + 0.5 * bands) * shadow, a * 0.5);\n" +
      "}",
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
}

/** Seven seeded biome classes. Every domain reads as a distinct world: ocean, ringed giant, ice,
 *  lava, lush, crystalline or desert. */
interface PlanetBiome {
  name: string;
  tint: THREE.Color;
  atmosphere: THREE.Color;
  clouds: number;
  cloudTint: number;
  roughness: number;
  metalness: number;
  glint: number;
  rings: boolean;
}

function planetBiome(seed: number, banded: boolean): PlanetBiome {
  const klass = Math.floor(hash01(seed, 21) * 7) % 7;
  const tint = new THREE.Color([0x9fd4ff, 0xf2d3a0, 0xd8ecff, 0xff9a6b, 0x9ff0b6, 0xb8f4ff, 0xe8b87a][klass]!);
  const atmosphere = new THREE.Color([0x6fc4ff, 0xffc98f, 0x9fe2ff, 0xff8a5c, 0x8be9b0, 0xa8f2ff, 0xffb877][klass]!);
  return {
    name: ["Oceanic", "Ringed Gas Giant", "Ice World", "Volcanic", "Lush Terrestrial", "Crystalline", "Desert Canyon"][klass]!,
    tint,
    atmosphere,
    clouds: [0.5, 0.74, 0.36, 0.3, 0.62, 0.16, 0.24][klass]!,
    cloudTint: [0xffffff, 0xfff2dd, 0xeaf6ff, 0xffd2bd, 0xffffff, 0xd8fbff, 0xffe6c8][klass]!,
    roughness: [0.3, 0.86, 0.38, 0.72, 0.62, 0.12, 0.8][klass]!,
    metalness: [0.06, 0.04, 0.1, 0.08, 0.03, 0.5, 0.05][klass]!,
    glint: [1, 0.4, 0.7, 0.5, 0.6, 1.2, 0.4][klass]!,
    rings: banded || klass === 1 || (klass === 2 && hash01(seed, 22) > 0.55),
  };
}

/** One procedural galaxy shape: spiral, barred spiral, elliptical or ring. */
function galaxyPoints(seed: number, count: number, radius: number, variant: number): { positions: Float32Array; colors: Float32Array } {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const arms = 2 + Math.floor(hash01(seed, 4) * 2);
  const cyan = new THREE.Color(0x8be9fd);
  const magenta = new THREE.Color(0xff7ad9);
  const gold = new THREE.Color(0xffd08a);
  const blue = new THREE.Color(0x9fd4ff);
  const white = new THREE.Color(0xffffff);
  const dust = new THREE.Color(0x101725);
  const c = new THREE.Color();
  for (let i = 0; i < count; i += 1) {
    let x = 0;
    let y = 0;
    let z = 0;
    if (variant === 2) {
      // Golden elliptical: dense triaxial spheroid, hottest at the core, no arms at all.
      const a = hash01(i, seed, 2) * Math.PI * 2;
      const b = Math.acos(hash01(i, seed, 3) * 2 - 1);
      const rr = radius * Math.pow(hash01(i, seed, 4), 0.42);
      x = Math.sin(b) * Math.cos(a) * rr * 1.24;
      y = Math.cos(b) * rr * 0.52;
      z = Math.sin(b) * Math.sin(a) * rr * 0.72;
      c.copy(gold).lerp(white, Math.pow(hash01(i, seed, 11), 2) * 0.5);
    } else if (variant === 3) {
      // Polar ring: a compact blue-white core wrapped by a ring of young stars tilted ~90°.
      if (i % 4 === 0) {
        const a = hash01(i, seed, 2) * Math.PI * 2;
        const b = Math.acos(hash01(i, seed, 3) * 2 - 1);
        const rr = radius * 0.17 * Math.cbrt(hash01(i, seed, 4));
        x = Math.sin(b) * Math.cos(a) * rr;
        y = Math.cos(b) * rr;
        z = Math.sin(b) * Math.sin(a) * rr;
        c.copy(white).lerp(gold, hash01(i, seed, 6) * 0.45);
      } else {
        const a = hash01(i, seed, 5) * Math.PI * 2;
        const rr = radius * (0.6 + (hash01(i, seed, 7) - 0.5) * 0.22);
        x = Math.cos(a) * rr * 0.16;
        y = Math.sin(a) * rr;
        z = Math.cos(a) * rr * 0.95;
        c.copy(blue).lerp(cyan, 0.35).lerp(white, hash01(i, seed, 8) * 0.4);
      }
    } else if (variant === 1) {
      // Barred spiral: stars crowd a luminous bar, then sweep out of both ends.
      const t = Math.pow(hash01(i, seed, 1), 0.7);
      if (t < 0.3) {
        const u = (hash01(i, seed, 12) - 0.5) * 2;
        x = u * radius * 0.36;
        y = (hash01(i, seed, 13) - 0.5) * radius * 0.06;
        z = (hash01(i, seed, 14) - 0.5) * radius * 0.09;
        c.copy(gold).lerp(white, Math.abs(u) * 0.3);
      } else {
        const s = (t - 0.3) / 0.7;
        const side = i % 2 === 0 ? 1 : -1;
        const a = side * (0.3 + s * 3.6) + (hash01(i, seed, 15) - 0.5) * 0.6;
        const rr = radius * (0.26 + s * 0.74);
        x = Math.cos(a) * rr + (hash01(i, seed, 8) - 0.5) * radius * 0.12 * s;
        z = Math.sin(a) * rr * 0.84 + (hash01(i, seed, 9) - 0.5) * radius * 0.12 * s;
        y = (hash01(i, seed, 10) - 0.5) * radius * 0.1 * (1.15 - s);
        c.copy(blue).lerp(white, 0.2 + hash01(i, seed, 11) * 0.35).lerp(magenta, s * 0.2);
      }
    } else {
      // Grand-design spiral: logarithmic arms, dust lanes and cyan/magenta H-II knots.
      const t = Math.pow(hash01(i, seed, 1), 0.72);
      const arm = i % arms;
      const a = t * Math.PI * 3.3 + (arm / arms) * Math.PI * 2 + t * 2.5;
      const rr = radius * (0.09 + t * 0.91);
      x = Math.cos(a) * rr + (hash01(i, seed, 8) - 0.5) * radius * 0.18 * (1 - t);
      z = Math.sin(a) * rr * 0.87 + (hash01(i, seed, 9) - 0.5) * radius * 0.18 * (1 - t);
      y = (hash01(i, seed, 10) - 0.5) * radius * 0.12 * (1.25 - t);
      if (Math.sin(a * 2 + t * 5) < -0.6) c.copy(dust);
      else if (hash01(i, seed, 16) > 0.93) c.copy(hash01(i, seed, 17) > 0.5 ? cyan : magenta);
      else c.copy(blue).lerp(white, hash01(i, seed, 11) * 0.35);
    }
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  return { positions, colors };
}

const UNIVERSE_NAMES = [
  "ATHENA", "AURORA", "CASSIOPEIA", "DRACO", "ERIDANUS", "FORNAX", "GEMINI", "HALCYON",
  "INDUS", "JANUS", "KEPLER", "LYRA", "MORPHEUS", "NEREID", "ORION", "PERSEUS",
  "QUASAR", "RHEA", "SERPENS", "TITAN", "UMBRA", "VESPER", "WRAITH", "XENON",
];

function universeName(i: number): string {
  return i === 0 ? "ATHENA Universe" : `${UNIVERSE_NAMES[i % UNIVERSE_NAMES.length]} Universe`;
}

function galaxyName(i: number): string {
  const kinds = ["Spiral", "Barred Spiral", "Elliptical", "Ring"];
  return `${UNIVERSE_NAMES[(i * 7 + 3) % UNIVERSE_NAMES.length]} ${kinds[i % 4]}`;
}

function disciplineColor(code: string): string {
  return DISCIPLINE_BY_ID[code]?.color ?? "#7ea4ff";
}

function hex(color: THREE.Color): string {
  return `#${color.getHexString()}`;
}
