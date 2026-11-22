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
import { hash01, separatedStarPositions, type Vec3 } from "../app/atlas-graph.ts";
import { moonMap, planetMap, starMap } from "./textures.ts";
import { DISCIPLINE_BY_ID } from "./disciplines.ts";
import type { NodeRecord } from "../domain/types.ts";

/** Minimum 3D separation between two discipline systems, in world units. */
export const SYSTEM_SEPARATION = 4200;
/** Radius of the sphere the systems are placed on. */
export const SYSTEM_SPHERE = 8600;
export const STAR_RADIUS = 42;
export const MIN_CAMERA_DISTANCE = 0.9;
export const MAX_CAMERA_DISTANCE = 22_000;
/** One astronomical unit, declared as the outer orbital radius of the atlas. */
export const UNITS_PER_AU = 1650;

export type BodyKind = "star" | "planet" | "moon" | "satellite" | "asteroid";

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
}

const clamp = (n: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, n));

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
  label: string;
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

  /* camera rig */
  private target = new THREE.Vector3(0, 0, 0);
  private yaw = 0.62;
  private pitch = 1.06;
  private distance = 20_000;
  private follow: string | null = null;
  private followPrev = new THREE.Vector3();
  private glide: {
    from: { target: THREE.Vector3; distance: number; yaw: number; pitch: number };
    to: { target: THREE.Vector3; distance: number; yaw: number; pitch: number };
    start: number;
    dur: number;
  } | null = null;

  /* interaction */
  private pointers = new Map<number, { x: number; y: number }>();
  private dragMode: "orbit" | "pan" = "orbit";
  private draggedDistance = 0;
  private pinchStart = 0;
  private pinchDistanceValue = 0;
  private pointerAt = { x: 0, y: 0 };
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
    this.camera = new THREE.PerspectiveCamera(50, 1, 0.05, 900_000);
    this.labelCtx = callbacks.labelCanvas.getContext("2d");
    this.scene.background = new THREE.Color(0x05080f);
    this.scene.add(this.root);
    this.scene.add(new THREE.AmbientLight(0x9db4e0, 0.14));
    this.buildBackdrop();

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
      const r = 80_000 + hash01(i, 13) * 40_000;
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
      size: 340,
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

  /** Rebuild every body from the stored galaxy. Positions, maps, tilts and phases are seeded. */
  setGalaxy(galaxy: Galaxy, evidence: Map<string, number>): void {
    this.disposeRoot();
    this.bodies.clear();
    this.pickables = [];
    this.motions = [];
    this.bodyObject.clear();
    this.systems = [];
    if (galaxy.stars.length === 0) return;

    const anchors = separatedStarPositions(galaxy.stars.length, SYSTEM_SPHERE, SYSTEM_SEPARATION);
    galaxy.stars.forEach((system, si) => {
      const anchor = anchors[si] ?? { x: 0, y: 0, z: 0 };
      this.buildSystem(system, si, anchor, evidence);
    });
    this.addClusterHaze();
    this.frameGalaxy();
  }

  private buildSystem(system: GalaxyStar, index: number, anchor: Vec3, evidence: Map<string, number>): void {
    const group = new THREE.Group();
    group.position.set(anchor.x, anchor.y, anchor.z);
    const color = new THREE.Color(disciplineColor(system.code));

    const starGeo = new THREE.SphereGeometry(STAR_RADIUS, 48, 32);
    const starTexture = loadTexture(starMap(surfaceSeed(system.code)));
    starTexture.repeat.set(1, 1);
    // A star is self-luminous: the map carries granulation, the warm tint keeps it from reading as a
    // planet wearing a dark crust, and the additive shell guarantees it never looks lit from outside.
    const starMat = new THREE.MeshBasicMaterial({ map: starTexture, color: 0xfff3e2, transparent: true });
    const star = new THREE.Mesh(starGeo, starMat);
    star.userData.bodyId = system.discipline.id;
    group.add(star);
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(STAR_RADIUS * 1.015, 32, 24),
      new THREE.MeshBasicMaterial({ color: 0xfff8ee, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    group.add(core);

    const corona = new THREE.Sprite(new THREE.SpriteMaterial({
      map: radialSprite("rgba(255,255,255,0.95)", `${hex(color)}aa`),
      color: 0xffffff,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }));
    corona.scale.setScalar(STAR_RADIUS * 3.6);
    group.add(corona);
    const bloom = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: SOFT_DOT,
        color: new THREE.Color(0xfff6e8),
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    bloom.scale.setScalar(STAR_RADIUS * 2.9);
    group.add(bloom);

    const light = new THREE.PointLight(color.clone().lerp(new THREE.Color(0xffffff), 0.6), 18, 0, 0.35);
    group.add(light);

    const planets = new THREE.Group();
    const moons = new THREE.Group();
    const satellites = new THREE.Group();
    group.add(planets, moons, satellites);

    const starBody: AtlasBody = {
      id: system.discipline.id,
      node: system.discipline,
      kind: "star",
      system: index,
      tier: "unassessed",
      radius: STAR_RADIUS,
      label: system.discipline.title,
      parentId: null,
    };
    this.bodies.set(starBody.id, starBody);
    this.bodyObject.set(starBody.id, star);
    this.pickables.push(star);
    this.pickables.push(this.proxy(star, STAR_RADIUS * 1.6, starBody.id));

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
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius, banded ? 40 : 32, banded ? 28 : 24),
        new THREE.MeshStandardMaterial({
          map: loadTexture(planetMap(seed, banded)),
          color: color.clone().lerp(new THREE.Color(0xffffff), 0.32),
          roughness: 0.92,
          metalness: 0.02,
        }),
      );
      mesh.rotation.z = (hash01(index, pi, 8) * 35 * Math.PI) / 180;
      mesh.userData.bodyId = planet.node.id;
      holder.add(mesh);
      holder.add(this.atmosphere(radius, color));

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
        mPivot.add(this.orbitLine(orbitR0, 0.82, 0x35d9ff, 0.22));

        const moonMesh = new THREE.Mesh(
          new THREE.SphereGeometry(mRadius, 24, 18),
          new THREE.MeshStandardMaterial({
            map: loadTexture(moonMap(surfaceSeed(moon.node.code))),
            color: color.clone().lerp(new THREE.Color(0xdfe8f7), 0.55),
            roughness: 0.96,
            metalness: 0.02,
          }),
        );
        moonMesh.userData.bodyId = moon.node.id;
        mHolder.add(moonMesh);

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
          const craft = this.satelliteMesh(sRadius, color);
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

    this.root.add(group);
    this.systems.push({ index, code: system.code, color, group, star, corona, light, planets, moons, satellites, label: system.discipline.title });
    void evidence;
  }

  private orbitLine(radius: number, flatten: number, color: number, opacity: number): THREE.LineLoop {
    const pts: THREE.Vector3[] = [];
    const segments = 128;
    for (let i = 0; i < segments; i += 1) {
      const a = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius * flatten));
    }
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false });
    return new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), mat);
  }

  private atmosphere(radius: number, color: THREE.Color): THREE.Mesh {
    const mat = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: color.clone() }, uStrength: { value: 0.5 } },
      vertexShader:
        "varying vec3 vNormal; varying vec3 vView;\n" +
        "void main() {\n" +
        "  vNormal = normalize(normalMatrix * normal);\n" +
        "  vec4 mv = modelViewMatrix * vec4(position, 1.0);\n" +
        "  vView = normalize(-mv.xyz);\n" +
        "  gl_Position = projectionMatrix * mv;\n" +
        "}",
      fragmentShader:
        "uniform vec3 uColor; uniform float uStrength; varying vec3 vNormal; varying vec3 vView;\n" +
        "void main() {\n" +
        "  float rim = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 2.6);\n" +
        "  gl_FragColor = vec4(uColor * rim * uStrength, rim * uStrength * 0.9);\n" +
        "}",
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    });
    return new THREE.Mesh(new THREE.SphereGeometry(radius * 1.06, 32, 24), mat);
  }

  private satelliteMesh(radius: number, color: THREE.Color): THREE.Group {
    const group = new THREE.Group();
    const bus = new THREE.Mesh(
      new THREE.BoxGeometry(radius * 1.5, radius * 1.9, radius * 1.5),
      new THREE.MeshStandardMaterial({ color: 0xd7e2f4, roughness: 0.55, metalness: 0.7 }),
    );
    group.add(bus);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x2a4c8f, roughness: 0.35, metalness: 0.8, emissive: 0x0a1630, emissiveIntensity: 0.6 });
    for (const dir of [-1, 1]) {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(radius * 2.6, radius * 1.35, radius * 0.09), panelMat);
      wing.position.set(dir * radius * 2.2, 0, 0);
      group.add(wing);
    }
    const dish = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 0.52, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0xaebdd6, roughness: 0.5, metalness: 0.6, side: THREE.DoubleSide }),
    );
    dish.rotation.x = Math.PI;
    dish.position.y = -radius * 1.1;
    group.add(dish);
    const beacon = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 0.3, 10, 8),
      new THREE.MeshBasicMaterial({ color: color.clone().lerp(new THREE.Color(0xffffff), 0.5) }),
    );
    beacon.position.y = radius * 1.3;
    group.add(beacon);
    return group;
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
    const clusters = [
      { anchor: new THREE.Vector3(0, 0, 0), radius: SYSTEM_SPHERE * 1.05, color: 0x7ea4ff, count: 2400 },
      { anchor: new THREE.Vector3(-SYSTEM_SPHERE * 1.5, -900, -SYSTEM_SPHERE * 0.7), radius: 2600, color: 0xffc66d, count: 1400 },
      { anchor: new THREE.Vector3(SYSTEM_SPHERE * 1.6, 1000, SYSTEM_SPHERE * 0.6), radius: 2200, color: 0xa78bfa, count: 1200 },
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
          size: 90,
          sizeAttenuation: true,
          vertexColors: true,
          map: SOFT_DOT,
          transparent: true,
          opacity: ci === 0 ? 0.5 : 0.3,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      points.position.copy(c.anchor);
      this.root.add(points);

      // Every galaxy has a supermassive black hole at its centre.
      const holeRadius = ci === 0 ? 150 : 90;
      const hole = new THREE.Mesh(
        new THREE.SphereGeometry(holeRadius, 24, 16),
        new THREE.MeshBasicMaterial({ color: 0x000000 }),
      );
      hole.position.copy(c.anchor);
      this.root.add(hole);
      const disc = new THREE.Mesh(
        new THREE.RingGeometry(holeRadius * 1.4, holeRadius * 4.2, 64),
        new THREE.MeshBasicMaterial({ color: 0xffb066, transparent: true, opacity: 0.55, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }),
      );
      disc.rotation.x = Math.PI / 2 - 0.28;
      disc.position.copy(c.anchor);
      this.root.add(disc);
      const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: radialSprite("rgba(255,226,190,0.9)", "rgba(126,164,255,0.35)"), transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }));
      glow.scale.setScalar(ci === 0 ? 2600 : 1500);
      glow.position.copy(c.anchor);
      this.root.add(glow);
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
        this.yaw -= dx * 0.005;
        this.pitch = clamp(this.pitch - dy * 0.005, 0.05, Math.PI - 0.05);
        this.glide = null;
      }
    };

    const up = (e: PointerEvent): void => {
      this.pointers.delete(e.pointerId);
      if (this.pointers.size === 0) canvas.classList.remove("dragging");
      if (this.draggedDistance > 6) return;
      const p = local(e);
      const hit = this.pick(p.x, p.y);
      this.callbacks.onSelect(hit ? hit.id : null);
      if (hit) this.focus(hit.id);
    };

    const wheel = (e: WheelEvent): void => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const next = clamp(this.distance * Math.exp(e.deltaY * 0.0012), MIN_CAMERA_DISTANCE, MAX_CAMERA_DISTANCE);
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
      this.reset();
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

  private pick(x: number, y: number): AtlasBody | null {
    const n = this.ndc(x, y);
    this.pointer.set(n.x, n.y);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.pickables, false);
    for (const hit of hits) {
      const id = hit.object.userData.bodyId as string | undefined;
      if (id) {
        const body = this.bodies.get(id);
        if (body) return body;
      }
    }
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
    const nd = clamp(nextDistance, MIN_CAMERA_DISTANCE, MAX_CAMERA_DISTANCE);
    const n = this.ndc(at.x, at.y);
    this.pointer.set(n.x, n.y);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const shift = this.distance - nd;
    this.target.addScaledVector(this.raycaster.ray.direction, shift * 0.9);
    this.distance = nd;
    this.glide = null;
    if (nd < 4) this.follow = this.pick(at.x, at.y)?.id ?? this.follow;
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
    this.glideTo(anchor, 1250, 0.55, 1.16, instant ? 0 : 620);
    this.follow = null;
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
    this.glideTo(pos, dist, this.yaw, clamp(this.pitch, 0.5, Math.PI - 0.5), instant ? 0 : 600);
    this.follow = id;
    this.followPrev.copy(pos);
  }

  reset(): void {
    this.follow = null;
    this.glideTo(new THREE.Vector3(0, 0, 0), 20_500, 0.62, 1.06, 620);
  }

  /** Fly to one of the three galaxies, or out to the whole local group. */
  focusCluster(key: "core" | "frontier" | "vault" | "universe"): void {
    if (key === "universe") {
      this.glideTo(new THREE.Vector3(0, 0, 0), MAX_CAMERA_DISTANCE, 0.62, 1.06, 760);
      return;
    }
    const anchors = {
      core: new THREE.Vector3(0, 0, 0),
      frontier: new THREE.Vector3(-SYSTEM_SPHERE * 1.5, -900, -SYSTEM_SPHERE * 0.7),
      vault: new THREE.Vector3(SYSTEM_SPHERE * 1.6, 1000, SYSTEM_SPHERE * 0.6),
    };
    const anchor = anchors[key];
    this.glideTo(anchor, key === "core" ? 20_500 : 5200, 0.62, 1.04, 720);
    this.follow = null;
  }

  private glideTo(target: THREE.Vector3, distance: number, yaw: number, pitch: number, dur: number): void {
    if (dur <= 0) {
      this.target.copy(target);
      this.distance = clamp(distance, MIN_CAMERA_DISTANCE, MAX_CAMERA_DISTANCE);
      this.yaw = yaw;
      this.pitch = pitch;
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
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
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

    if (this.glide) {
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
    this.camera.near = Math.max(0.02, this.distance * 0.00025);
    this.camera.far = Math.max(120_000, this.distance * 40);
    this.camera.updateProjectionMatrix();

    // Level of detail, measured from the camera to each system's own star.
    const camPos = this.camera.position;
    for (const s of this.systems) {
      const d = camPos.distanceTo(s.group.position);
      // Level of detail is what keeps a phone at 60 FPS: only the system being flown stays fully
      // populated, and its moons and satellites appear as the camera closes on them.
      s.planets.visible = d < 4800;
      s.moons.visible = d < 700;
      s.satellites.visible = d < 60;
      s.star.rotation.y += dt * 0.02;
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
    const placed: { x0: number; y0: number; x1: number; y1: number }[] = [];
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

    const label = (text: string, x: number, y: number, color: string, alpha: number, weight = 600): void => {
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

    // Star systems are labelled from galaxy range in: they are the map's landmarks.
    for (const s of this.systems) {
      const p = project(s.star);
      if (!p || p.x < -80 || p.x > this.width + 80) continue;
      const dim = this.filter !== null && this.filter !== s.code;
      const alpha = dim ? 0.18 : this.selected === s.star.userData.bodyId ? 0.95 : 0.8;
      const offset = clamp((STAR_RADIUS / p.scale) * (this.height / 2) / Math.tan((this.camera.fov * Math.PI) / 360), 6, 90);
      label(s.code, p.x, p.y - offset - 6, hex(s.color), alpha);
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
          label(body.label, p.x, p.y - r - 8, "#f1f5ff", 1, 600);
        }
      }
    }

    // Planet, moon and satellite names appear as their orbit comes into readable range.
    for (const body of this.bodies.values()) {
      if (body.kind === "star" || body.kind === "asteroid") continue;
      const object = this.bodyObject.get(body.id);
      if (!object) continue;
      const p = project(object);
      if (!p) continue;
      const limit = body.kind === "planet" ? 2600 : body.kind === "moon" ? 260 : 26;
      if (p.scale > limit) continue;
      if (p.x < 0 || p.x > this.width || p.y < 0 || p.y > this.height) continue;
      const px = (body.radius / Math.max(0.001, p.scale)) * (this.height / 2) / Math.tan((this.camera.fov * Math.PI) / 360);
      label(body.label, p.x, p.y - Math.max(7, px * 1.5) - 5, body.kind === "planet" ? "#a8b6d2" : "#8fa3c4", body.kind === "planet" ? 0.8 : 0.62, 500);
    }

    // The claimed system wears a gold dashed ring, drawn in 3D-safe screen space.
    for (const s of this.systems) {
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
  }

  /* ── teardown ─────────────────────────────────────────────────────────── */

  private disposeRoot(): void {
    this.scene.remove(this.root);
    this.root.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
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

function disciplineColor(code: string): string {
  return DISCIPLINE_BY_ID[code]?.color ?? "#7ea4ff";
}

function hex(color: THREE.Color): string {
  return `#${color.getHexString()}`;
}
