/**
 * Command deck: everything the Atlas does after the cursor leaves the map.
 *
 * The scene stays responsible for the orbital camera rig. This deck takes over the camera only while
 * a mode needs it — starfighter chase, cockpit, EVA or a planetary surface — and hands it straight
 * back on exit. It also owns the LRU system cache, the field-star scanner, the chaos lab and audio.
 *
 * Every object it creates is transient: none of it is persisted, and leaving a mode disposes it.
 */
import * as THREE from "three";
import { CosmosStreamer, type StreamBody } from "../engine/cosmos-streamer.ts";
import { synthesizeCustomSystem } from "../engine/system-synthesizer.ts";
import { SystemManager } from "../engine/system-manager.ts";
import { Starfighter, Eva, type CockpitAction, type FlightInput } from "../engine/flight-eva.ts";
import { ChaosLab, type ChaosTarget } from "../engine/chaos-lab.ts";
import { buildSurface, type SurfaceScene } from "../engine/planet-surface.ts";
import { spaceAudio } from "../engine/space-audio.ts";
import type { Biome } from "../engine/system-synthesizer.ts";
export type { CockpitAction } from "../engine/flight-eva.ts";

export type DeckMode = "atlas" | "chase" | "cockpit" | "eva" | "surface" | "nav";
export type ChaosTool = "beam" | "meteor" | "well" | "star";

export interface ScanCard {
  id: string;
  name: string;
  catalog: string;
  kind: string;
  spectral: string;
  mass: number;
  temperature: number;
  planets: number;
  distance: number;
  planetsList: { name: string; biome: string; radius: number }[];
  position: { x: number; y: number; z: number };
  radius: number;
  seed: number;
}

export interface Telemetry {
  mode: DeckMode;
  speed: number;
  boost: boolean;
  autopilot: string;
  targetName: string | null;
  targetDistance: number;
  closing: number;
  screen: { x: number; y: number; onScreen: boolean } | null;
  grounded: boolean;
  magBoots: boolean;
  surface: string | null;
  prompt: string | null;
  mounted: number;
  scan: ScanCard | null;
  catalog: string | null;
  /** Live ephemeral effects: scorch marks, craters, debris, wells, a collapsed star. */
  effects: number;
  jumpHistory: { label: string; position: { x: number; y: number; z: number }; radius: number }[];
}

export interface DeckBridge {
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  root: THREE.Group;
  streamer: CosmosStreamer;
  width(): number;
  height(): number;
  /** Consume the pointer drag accumulated while the deck owns the camera. */
  look(): { dx: number; dy: number };
  /** Left-thumb stick vector, −1..1. */
  stick(): { x: number; y: number };
  glide(position: THREE.Vector3, distance: number, duration: number): void;
  setFollow(id: string | null): void;
  clearSelection(): void;
  telemetry(t: Telemetry): void;
  audio: typeof spaceAudio;
}

const noop = (): void => undefined;

export class CommandDeck {
  readonly group = new THREE.Group();
  readonly ship = new Starfighter();
  readonly eva = new Eva();
  readonly chaos = new ChaosLab();
  readonly manager = new SystemManager(4);
  mode: DeckMode = "atlas";
  navOpen = false;
  /* Speed selector shared with the HUD. */
  speed = 1;
  private targetId: string | null = null;
  private targetProvider: (() => THREE.Vector3) | null = null;
  private targetRadius = 4;
  private targetName: string | null = null;
  private surface: SurfaceScene | null = null;
  private surfaceHome = new THREE.Vector3();
  private chaosTargets: ChaosTarget[] = [];
  private scan: ScanCard | null = null;
  private history: Telemetry["jumpHistory"] = [];
  private historyAt = -1;
  private grounded = false;
  private groundLabel: string | null = null;
  private prompt: string | null = null;
  private promptAction: (() => void) | null = null;
  private lastTelemetry = 0;
  private elapsed = 0;
  private mountClock = 0;
  private disposed = false;
  private readonly tmp = new THREE.Vector3();
  private readonly tmpB = new THREE.Vector3();
  private readonly desired = new THREE.Vector3();
  private flightSpeed = 0;
  private readonly chasePose = { position: new THREE.Vector3(), quaternion: new THREE.Quaternion() };

  private readonly bridge: DeckBridge;

  constructor(bridge: DeckBridge) {
    this.bridge = bridge;
    this.group.add(this.manager.group);
    this.group.add(this.ship.group, this.eva.group, this.chaos.group);
    this.ship.group.visible = false;
    this.eva.group.visible = false;
    bridge.scene.add(this.group);
    this.ship.onArrive = () => {
      bridge.audio.play("chime");
      this.prompt = "Target Reached — Orbit Established";
      window.setTimeout(() => {
        if (this.prompt?.startsWith("Target")) this.prompt = null;
      }, 3200);
    };
  }

  get active(): boolean {
    return this.mode !== "atlas" && this.mode !== "nav";
  }

  get currentScan(): ScanCard | null {
    return this.scan;
  }

  /* ── field-star scanning ──────────────────────────────────────────────── */

  /**
   * Nearest streamed field star within a 24 px screen radius. This is a projection test, not a raycast
   * into a Points cloud: 62,500 points are not individually intersectable, but their centres are exact.
   */
  pickFieldStar(x: number, y: number): StreamBody | null {
    if (this.bridge.streamer.activeKind !== "star") return null;
    const camera = this.bridge.camera;
    let best: { body: StreamBody; px: number } | null = null;
    const p = this.tmp;
    for (const body of this.bridge.streamer.bodies) {
      if (body.kind !== "star") continue;
      p.copy(body.center);
      // Behind the camera: skip before projecting, or a mirrored point appears on screen.
      if (p.clone().sub(camera.position).dot(camera.getWorldDirection(this.tmpB)) <= 0) continue;
      p.project(camera);
      if (p.z > 1 || p.z < -1) continue;
      const dx = ((p.x + 1) / 2) * this.bridge.width() - x;
      const dy = ((1 - p.y) / 2) * this.bridge.height() - y;
      const px = Math.hypot(dx, dy);
      if (px > 24) continue;
      if (!best || px < best.px) best = { body, px };
    }
    return best?.body ?? null;
  }

  /** Glide to a procedural star, scan it and mount its full system. */
  focusFieldStar(body: StreamBody, addHistory = true): void {
    this.bridge.audio.play("ping", 0.7);
    const spec = synthesizeCustomSystem({ key: body.id, seed: hashFromId(body.id) });
    const radius = 42;
    const system = this.manager.mount(spec, body.center, 1);
    this.registerSystemTargets(system.key);
    const catalog = `SYS-${body.id.replace("STR-SYS-", "").replace(/-/g, ":")}`;
    this.scan = {
      id: body.id,
      name: spec.name,
      catalog,
      kind: "G-type star system",
      spectral: spec.star.spectral.label,
      mass: Math.round(spec.star.mass * 100) / 100,
      temperature: spec.star.temperature,
      planets: spec.planets.length,
      distance: Math.round(this.bridge.camera.position.distanceTo(body.center)),
      planetsList: spec.planets.map((pl) => ({ name: pl.name, biome: pl.biome.label, radius: Math.round(pl.radius * 100) / 100 })),
      position: { x: body.center.x, y: body.center.y, z: body.center.z },
      radius,
      seed: spec.seed,
    };
    this.bridge.setFollow(null);
    this.bridge.glide(body.center, radius * 3.2, 1100);
    this.targetId = body.id;
    this.targetProvider = () => body.center;
    this.targetRadius = radius;
    this.targetName = spec.name;
    if (addHistory) this.pushHistory({ label: `${catalog} · ${spec.name}`, position: { x: body.center.x, y: body.center.y, z: body.center.z }, radius });
  }

  /** Automation/deep-link hook: scan the nearest streamed field star without a pixel target. */
  scanNearestStar(): ScanCard | null {
    let nearest: StreamBody | null = null;
    let best = Infinity;
    for (const body of this.bridge.streamer.bodies) {
      if (body.kind !== "star") continue;
      const d = body.center.distanceTo(this.bridge.camera.position);
      if (d < best) {
        best = d;
        nearest = body;
      }
    }
    if (!nearest) return null;
    this.focusFieldStar(nearest);
    return this.scan;
  }

  /** Mount systems for the nearest field stars; only 4 survive, so the cache needs no babysitter. */
  private streamMount(): void {
    if (this.bridge.streamer.activeKind !== "star") return;
    const camera = this.bridge.camera.position;
    let nearest: StreamBody | null = null;
    let best = 1_800;
    for (const body of this.bridge.streamer.bodies) {
      if (body.kind !== "star") continue;
      const d = body.center.distanceTo(camera);
      if (d < best) {
        best = d;
        nearest = body;
      }
    }
    if (!nearest) return;
    if (this.manager.get(nearest.id)) return;
    const spec = synthesizeCustomSystem({ key: nearest.id, seed: hashFromId(nearest.id) });
    this.manager.mount(spec, nearest.center, 1);
    this.registerSystemTargets(nearest.id);
  }

  private registerSystemTargets(key: string): void {
    const entry = this.manager.get(key);
    if (!entry) return;
    // Only this system's registrations are replaced; the other three mounted systems keep theirs.
    this.chaosTargets = this.chaosTargets.filter((t) => t.label !== `sys:${key}` && t.label !== `sys:${key}:star`);
    for (const planet of entry.built.planets) {
      const holder = planet.holder;
      this.chaos.register({
        object: holder,
        radius: planet.spec.radius,
        home: holder.position.clone(),
        label: `sys:${key}`,
      });
    }
    this.chaos.register({
      object: entry.built.star,
      radius: 42,
      home: entry.built.star.position.clone(),
      star: true,
      label: `sys:${key}:star`,
    });
  }

  /* ── jump history ─────────────────────────────────────────────────────── */

  private pushHistory(entry: Telemetry["jumpHistory"][number]): void {
    if (this.historyAt >= 0 && this.history[this.historyAt]?.label === entry.label) return;
    this.history = this.history.slice(0, this.historyAt + 1);
    this.history.push(entry);
    if (this.history.length > 12) this.history.shift();
    this.historyAt = this.history.length - 1;
  }

  jump(direction: -1 | 1): void {
    if (this.history.length === 0) return;
    const next = Math.max(0, Math.min(this.history.length - 1, this.historyAt + direction));
    if (next === this.historyAt) return;
    this.historyAt = next;
    const entry = this.history[next]!;
    const at = new THREE.Vector3(entry.position.x, entry.position.y, entry.position.z);
    this.bridge.glide(at, entry.radius * 3.2, 900);
    this.targetName = entry.label;
    this.bridge.audio.play("lock", 0.6);
  }

  /** The scanner card for a tapped ATHENA record body, so the same card system is used everywhere. */
  describeRecord(name: string, position: THREE.Vector3, radius: number, catalog: string): ScanCard {
    this.scan = {
      id: catalog,
      name,
      catalog,
      kind: "canonical ATHENA record",
      spectral: "—",
      mass: 0,
      temperature: 0,
      planets: 0,
      distance: Math.round(this.bridge.camera.position.distanceTo(position)),
      planetsList: [],
      position: { x: position.x, y: position.y, z: position.z },
      radius,
      seed: hashFromId(catalog),
    };
    return this.scan;
  }

  /* ── modes ────────────────────────────────────────────────────────────── */

  launchShip(): void {
    this.mode = "chase";
    this.ship.group.visible = true;
    this.ship.setView("chase");
    // Spawn ahead of the camera, looking at whatever it was already inspecting.
    const camera = this.bridge.camera;
    const forward = camera.getWorldDirection(this.tmp).clone();
    const at = camera.position.clone().addScaledVector(forward, Math.max(6, camera.position.distanceTo(camera.position) + 12));
    const look = camera.position.clone().addScaledVector(forward, 40);
    this.ship.spawnAt(at, look);
    this.bridge.audio.unlock();
    this.bridge.audio.ambient(true);
    this.bridge.audio.play("click");
    this.pushHistory({ label: "Launch point", position: { x: at.x, y: at.y, z: at.z }, radius: 40 });
  }

  setView(mode: "chase" | "cockpit"): void {
    if (this.mode === "eva" || this.mode === "surface") return;
    this.mode = mode;
    this.ship.setView(mode);
    this.ship.group.visible = true;
    this.bridge.audio.play("button");
  }

  /** Leave the ship entirely and return to the orbital rig. */
  stowShip(): void {
    this.mode = this.surface ? "surface" : "atlas";
    this.ship.group.visible = false;
    this.ship.cancelAutopilot();
    this.bridge.audio.stopThruster();
    this.bridge.audio.ambient(false);
    if (this.mode === "atlas") this.leaveSurface();
  }

  setSpeed(speed: number): void {
    this.speed = speed;
  }

  toggleBoost(): void {
    this.boostRequested = !this.boostRequested;
    this.bridge.audio.play("beam", 0.5);
  }
  private boostRequested = false;

  /* ── targets and autopilot ────────────────────────────────────────────── */

  lockTarget(id: string, name: string, position: () => THREE.Vector3, radius: number): void {
    this.targetId = id;
    this.targetName = name;
    this.targetProvider = position;
    this.targetRadius = radius;
    this.bridge.audio.play("lock", 0.8);
    if (this.active) this.ship.setAutopilot(position(), radius);
  }

  engageAutopilot(): void {
    if (!this.targetProvider) {
      // With no lock, fall back to the scan card's position so the button is never dead.
      if (!this.scan) return;
      const at = new THREE.Vector3(this.scan.position.x, this.scan.position.y, this.scan.position.z);
      this.ship.setAutopilot(at, this.scan.radius);
    } else {
      this.ship.setAutopilot(this.targetProvider(), this.targetRadius);
    }
    if (!this.active) this.launchShip();
    this.bridge.audio.play("chime", 0.7);
    this.prompt = "Autopilot engaged";
  }

  ping(): void {
    this.bridge.audio.play("ping");
    const at = this.ship.position.clone();
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(1, 1.4, 64, 1),
      new THREE.MeshBasicMaterial({ color: 0x35d9ff, transparent: true, opacity: 0.8, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    ring.position.copy(at);
    ring.lookAt(this.bridge.camera.position);
    this.group.add(ring);
    let life = 0;
    const start = performance.now();
    const tick = (): void => {
      if (this.disposed) return;
      life = (performance.now() - start) / 1000;
      ring.scale.setScalar(1 + life * 90);
      (ring.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.8 - life * 0.55);
      if (life > 1.5) {
        this.group.remove(ring);
        ring.geometry.dispose();
        (ring.material as THREE.Material).dispose();
        return;
      }
      requestAnimationFrame(tick);
    };
    tick();
  }

  /** Execute a cockpit console button or its HUD twin. */
  command(action: CockpitAction): void {
    this.bridge.audio.unlock();
    this.bridge.audio.play("button");
    switch (action) {
      case "AUTOPILOT":
        this.engageAutopilot();
        break;
      case "BOOST":
        this.toggleBoost();
        break;
      case "NAV":
        this.navOpen = !this.navOpen;
        // NAV decouples the survey camera from the ship: the deck releases the camera and the
        // orbital rig takes over, while the flight model stays parked where the ship is.
        if (this.navOpen) {
          if (this.mode === "chase" || this.mode === "cockpit") {
            this.preNavMode = this.mode;
            this.mode = "nav";
            this.ship.setView("chase");
            this.ship.group.visible = false;
          }
        } else if (this.mode === "nav") {
          this.mode = this.preNavMode;
          this.ship.group.visible = true;
        }
        this.bridge.audio.play("ping", 0.5);
        break;
      case "PING":
        this.ping();
        break;
      case "LAND":
        this.requestLanding();
        break;
      case "EVA":
        this.deployEva();
        break;
      case "VIEW":
        this.setView(this.mode === "cockpit" ? "chase" : "cockpit");
        break;
      case "AUDIO":
        this.bridge.audio.setMuted(!this.bridge.audio.isMuted);
        break;
      default:
        break;
    }
  }

  /** Raycast the physical console buttons; returns the action under the pointer, if any. */
  cockpitHit(x: number, y: number): CockpitAction | null {
    if (this.mode !== "cockpit") return null;
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2((x / Math.max(1, this.bridge.width())) * 2 - 1, -(y / Math.max(1, this.bridge.height())) * 2 + 1);
    ray.setFromCamera(ndc, this.bridge.camera);
    const hits = ray.intersectObjects(this.ship.buttons.map((b) => b.mesh), false);
    for (const hit of hits) {
      const action = hit.object.userData.cockpitAction as CockpitAction | undefined;
      if (action) return action;
    }
    return null;
  }

  /* ── EVA ──────────────────────────────────────────────────────────────── */

  deployEva(): void {
    if (this.surface) return;
    this.mode = "eva";
    this.eva.group.visible = true;
    this.ship.group.visible = false;
    const at = this.ship.position.clone().add(new THREE.Vector3(0, 1.4, 0));
    this.eva.spawnAt(at);
    this.eva.magBoots = true;
    this.bridge.audio.play("click");
    this.prompt = "EVA deployed · Mag-Boots ON";
  }

  toggleMagBoots(): void {
    this.eva.magBoots = !this.eva.magBoots;
    this.bridge.audio.play("button");
    this.prompt = this.eva.magBoots ? "Mag-Boots ON" : "Zero-G jetpack";
  }

  boardShip(): void {
    if (this.surface) {
      this.launchToOrbit();
      return;
    }
    this.mode = "chase";
    this.eva.group.visible = false;
    this.ship.group.visible = true;
    this.ship.setView("chase");
    this.bridge.audio.play("click");
  }

  /* ── landing ──────────────────────────────────────────────────────────── */

  requestLanding(): void {
    if (this.surface) {
      this.launchToOrbit();
      return;
    }
    const near = this.manager.nearestPlanet(this.ship.position);
    if (!near) {
      this.prompt = "No surface within range";
      return;
    }
    const world = new THREE.Vector3();
    near.holder.getWorldPosition(world);
    this.land(near.name, near.biome as Biome, 0.55, near.radius, world);
  }

  /** Land on the scanned system's first world, or the closest mounted one to the camera. */
  landNearest(point: THREE.Vector3, maxDistance = 4_000): void {
    const scanned = this.scan ? this.manager.get(this.scan.id) : undefined;
    const planet = scanned?.built.planets[0];
    if (scanned && planet) {
      const world = new THREE.Vector3();
      planet.holder.getWorldPosition(world);
      this.land(planet.spec.name, planet.spec.biome.id as Biome, planet.spec.mastery, planet.spec.radius, world);
      return;
    }
    let nearest: ReturnType<SystemManager["nearestPlanet"]> = null;
    let best = maxDistance;
    const at = new THREE.Vector3();
    for (const key of this.manager.keys()) {
      const entry = this.manager.get(key);
      if (!entry) continue;
      for (const p of entry.built.planets) {
        p.holder.getWorldPosition(at);
        const d = at.distanceTo(point);
        if (d < best) {
          best = d;
          nearest = { key, name: p.spec.name, radius: p.spec.radius, holder: p.holder, biome: p.spec.biome.id };
        }
      }
    }
    if (!nearest) {
      this.prompt = "No world within landing range";
      return;
    }
    const world = new THREE.Vector3();
    nearest.holder.getWorldPosition(world);
    this.land(nearest.name, nearest.biome as Biome, 0.55, nearest.radius, world);
  }

  /** Entry from the inspector: land on a specific named world. */
  landOn(name: string, biome: string, mastery: number, radius: number, center: THREE.Vector3): void {
    this.land(name, biome as Biome, mastery, radius, center);
  }

  private land(name: string, biome: Biome, mastery: number, radius: number, center: THREE.Vector3): void {
    this.leaveSurface();
    this.surfaceHome.copy(center);
    const scene = buildSurface({
      biome,
      mastery,
      starColor: 0xffe9b8,
      starRadius: Math.max(1, radius),
      ringed: biome === "gas_giant",
      moons: 2,
      seed: hashFromId(name),
    });
    // The surface is built in its own local space and parked at the planet, so the sky furniture can
    // be positioned relative to the landing site instead of the origin.
    scene.group.position.copy(center);
    this.bridge.scene.add(scene.group);
    this.surface = scene;
    this.mode = "surface";
    this.ship.group.visible = false;
    this.eva.group.visible = true;
    // EVA always lives in world space; the surface is parked at the planet, so the boot spawn is too.
    if (this.eva.group.parent !== this.group) this.group.add(this.eva.group);
    this.eva.spawnAt(scene.spawn.clone().add(center));
    // A planetary EVA reads at landscape scale: the suit is the only reference object on the ground.
    this.eva.group.scale.setScalar(1.8);
    this.manager.group.visible = false;
    this.chaos.group.visible = false;
    this.bridge.audio.play("impact", 0.45);
    this.prompt = `Touchdown · ${scene.label}`;
    this.pushHistory({ label: scene.label, position: { x: center.x, y: center.y, z: center.z }, radius: Math.max(8, radius) });
  }

  launchToOrbit(): void {
    if (!this.surface) return;
    this.leaveSurface();
    this.mode = "chase";
    this.ship.group.visible = true;
    this.ship.setView("chase");
    this.ship.spawnAt(this.surfaceHome.clone().add(new THREE.Vector3(0, 40, 60)), this.surfaceHome);
    this.bridge.audio.play("warp", 0.4);
    this.prompt = "Launch to orbit";
  }

  private leaveSurface(): void {
    this.eva.group.scale.setScalar(1);
    if (!this.surface) return;
    this.bridge.scene.remove(this.surface.group);
    this.surface.dispose();
    this.surface = null;
    this.manager.group.visible = true;
    this.chaos.group.visible = true;
    this.eva.group.visible = false;
    if (this.mode === "surface") this.mode = "atlas";
  }

  /* ── chaos lab ────────────────────────────────────────────────────────── */

  setChaos(on: boolean): void {
    this.chaosTool = on ? (this.chaosTool ?? "beam") : null;
    if (!on) this.chaos.restore();
  }

  chaosTool: ChaosTool | null = null;
  private preNavMode: DeckMode = "chase";

  get chaosActive(): boolean {
    return this.chaosTool !== null;
  }

  setChaosTool(tool: ChaosTool | null): void {
    this.chaosTool = tool;
    if (tool === null) this.chaos.restore();
  }

  /** Route one chaos gesture from the canvas to the matching ephemeral tool. */
  chaosGesture(tool: ChaosTool, from: { x: number; y: number }, to: { x: number; y: number }, dragged: boolean): void {
    if (tool === "beam") {
      this.fireBeam(to.x, to.y);
      return;
    }
    if (tool === "meteor") {
      if (dragged) this.flingMeteor(from.x, from.y, to.x, to.y);
      return;
    }
    if (tool === "well" && !dragged) this.dropWell(to.x, to.y);
    if (tool === "star" && !dragged) this.collapseStar(to.x, to.y);
  }

  /** Fire the plasma beam at whatever registered body is under the pointer. */
  fireBeam(x: number, y: number): void {
    const hit = this.bodyUnderPointer(x, y);
    if (!hit) return;
    const target = this.chaosTargets.find((t) => t.object === hit.object || t.object === this.ownerOf(hit.object));
    if (!target) return;
    if (this.chaos.scorch(target, hit.point)) this.bridge.audio.play("beam", 0.55);
  }

  flingMeteor(x0: number, y0: number, x1: number, y1: number): void {
    const camera = this.bridge.camera;
    const dir = new THREE.Vector3();
    const from = new THREE.Vector3((x0 / Math.max(1, this.bridge.width())) * 2 - 1, -(y0 / Math.max(1, this.bridge.height())) * 2 + 1, 0.5).unproject(camera);
    const to = new THREE.Vector3((x1 / Math.max(1, this.bridge.width())) * 2 - 1, -(y1 / Math.max(1, this.bridge.height())) * 2 + 1, 0.5).unproject(camera);
    dir.copy(to).sub(from).normalize();
    this.chaos.flingMeteor(camera.position.clone().addScaledVector(from.sub(camera.position).normalize(), 30), dir, 6);
    this.bridge.audio.play("impact", 0.4);
  }

  dropWell(x: number, y: number): void {
    const at = this.pointAt(x, y, 600);
    if (!at) return;
    this.chaos.dropWell(at, 4);
    this.bridge.audio.play("warp", 0.35);
  }

  collapseStar(x: number, y: number): void {
    const hit = this.bodyUnderPointer(x, y);
    const target = hit ? this.chaosTargets.find((t) => t.object === hit.object || t.object === this.ownerOf(hit.object)) : undefined;
    if (this.chaos.isCollapsed) return;
    if (!this.chaos.supernova(target)) {
      this.bridge.audio.play("supernova", 0.6);
      return;
    }
    this.bridge.audio.play("supernova");
    this.prompt = "Coronal mass ejection";
    window.setTimeout(() => {
      if (this.chaos.collapse(target)) {
        this.prompt = "Star collapsed — black hole formed";
        this.bridge.audio.play("impact", 1.1);
      }
    }, 900);
  }

  restoreSystem(): void {
    this.chaos.restore();
    this.bridge.audio.play("chime", 0.8);
    this.prompt = "System restored to canonical orbits";
  }

  private ownerOf(object: THREE.Object3D): THREE.Object3D {
    let cursor: THREE.Object3D | null = object;
    while (cursor) {
      const match = this.chaosTargets.find((t) => t.object === cursor);
      if (match) return cursor;
      cursor = cursor.parent;
    }
    return object;
  }

  private bodyUnderPointer(x: number, y: number): { object: THREE.Object3D; point: THREE.Vector3 } | null {
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2((x / Math.max(1, this.bridge.width())) * 2 - 1, -(y / Math.max(1, this.bridge.height())) * 2 + 1);
    ray.setFromCamera(ndc, this.bridge.camera);
    const objects = this.chaosTargets.map((t) => t.object);
    const hits = ray.intersectObjects(objects, true);
    for (const hit of hits) {
      const owner = this.ownerOf(hit.object);
      const target = this.chaosTargets.find((t) => t.object === owner);
      if (target) return { object: target.object, point: hit.point };
    }
    return null;
  }

  private pointAt(x: number, y: number, distance: number): THREE.Vector3 | null {
    const camera = this.bridge.camera;
    const ndc = new THREE.Vector3((x / Math.max(1, this.bridge.width())) * 2 - 1, -(y / Math.max(1, this.bridge.height())) * 2 + 1, 0.5);
    ndc.unproject(camera);
    const dir = ndc.sub(camera.position).normalize();
    return camera.position.clone().addScaledVector(dir, Math.max(20, Math.min(distance, this.bridge.camera.far * 0.02)));
  }

  /* ── frame ────────────────────────────────────────────────────────────── */

  update(dt: number, now: number): void {
    if (this.disposed) return;
    this.elapsed += dt;
    this.chaos.update(dt);
    this.manager.update(dt, this.elapsed);

    this.mountClock += dt;
    if (this.mountClock > 1.4) {
      this.mountClock = 0;
      this.streamMount();
    }

    if (this.mode === "surface" && this.surface) {
      const surfaces = this.surface.surfaces;
      const stick = this.bridge.stick();
      const look = this.bridge.look();
      const result = this.eva.update(dt, { forward: -stick.y, strafe: stick.x, jump: this.jumpRequested }, surfaces, this.bridge.camera);
      this.jumpRequested = false;
      this.grounded = result.grounded;
      this.groundLabel = result.ground;
      void look;
      // Third-person surface camera: a slow follow that never enters the terrain.
      const cam = this.bridge.camera;
      const behind = new THREE.Vector3(0, 3.4, 8.5).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.eva.group.rotation.y);
      this.desired.copy(this.eva.position).add(behind);
      cam.position.copy(this.desired);
      cam.lookAt(this.eva.position.x, this.eva.position.y + 1.4, this.eva.position.z);
      this.surface.update(dt, this.elapsed, cam);
      this.emit(now);
      return;
    }

    if (this.mode === "eva") {
      const stick = this.bridge.stick();
      const look = this.bridge.look();
      const surfaces = this.collectWalkable();
      const result = this.eva.update(dt, { forward: -stick.y, strafe: stick.x, jump: this.jumpRequested }, surfaces, this.bridge.camera);
      this.jumpRequested = false;
      this.grounded = result.grounded;
      this.groundLabel = result.ground;
      const cam = this.bridge.camera;
      if (look.dx || look.dy) {
        this.evaOrbit -= look.dx * 0.006;
        this.evaPitch = Math.max(-0.4, Math.min(1.1, this.evaPitch - look.dy * 0.005));
      }
      const r = this.eva.magBoots ? 5.5 : 7.5;
      this.desired.set(
        this.eva.position.x + Math.sin(this.evaOrbit) * Math.cos(this.evaPitch) * r,
        this.eva.position.y + Math.sin(this.evaPitch) * r + 1.4,
        this.eva.position.z + Math.cos(this.evaOrbit) * Math.cos(this.evaPitch) * r,
      );
      cam.position.copy(this.desired);
      cam.lookAt(this.eva.position);
      this.emit(now);
      return;
    }

    if (this.mode === "chase" || this.mode === "cockpit") {
      const stick = this.bridge.stick();
      const look = this.bridge.look();
      this.lookYaw -= look.dx * 0.004;
      this.lookPitch = Math.max(-1.2, Math.min(1.2, this.lookPitch - look.dy * 0.004));
      // Right-drag attitude is applied to the flight model as a rate, so it behaves like a stick.
      const input: FlightInput = {
        x: stick.x,
        y: -stick.y + this.lookPitch,
        yaw: this.lookYaw,
        speed: this.speed,
        boost: this.boostRequested,
      };
      this.lookPitch *= 0.86;
      this.lookYaw *= 0.86;
      this.flightSpeed = this.ship.update(dt, input);
      this.bridge.audio.engine(Math.min(1, this.ship.thrustLevel + (this.boostRequested ? 0.3 : 0)));
      const cam = this.bridge.camera;
      if (this.mode === "cockpit") {
        this.ship.cockpitPose(this.chasePose);
        cam.position.copy(this.chasePose.position);
        cam.quaternion.copy(this.chasePose.quaternion);
      } else {
        this.ship.chaseOffset(this.desired, 9 + this.flightSpeed * 0.02);
        // The rig already wrote its orbit pose this frame; a lerp restarts from it every time, so the
        // chase camera is placed outright and inherits its smoothing from the ship's own damping.
        cam.position.copy(this.desired);
        // Frame the hull itself: aiming far ahead pushes the ship out of the lower frame.
        cam.lookAt(this.ship.position);
      }
      cam.near = 0.05;
      cam.fov = 55 + this.ship.boosted * 14;
      cam.updateProjectionMatrix();
      // Landing / docking prompt inside the ship.
      const nearPlanet = this.manager.nearestPlanet(this.ship.position);
      this.prompt = nearPlanet ? `Land on ${nearPlanet.name}` : null;
      if (this.prompt) this.promptAction = () => this.requestLanding();
      this.emit(now);
      return;
    }

    // Atlas / NAV view: nothing to drive, but keep the scanner and reticle fresh.
    if (this.targetProvider && this.targetProvider() && false) {
      /* unused: the atlas rig owns the camera here */
    }
    this.emit(now);
  }

  private evaOrbit = 0.6;
  private evaPitch = 0.28;
  private lookYaw = 0;
  private lookPitch = 0;
  jumpRequested = false;

  private collectWalkable(): THREE.Object3D[] {
    const out: THREE.Object3D[] = [];
    // Planet surfaces, rings and asteroid crusts are all solid enough to put a boot on.
    this.manager.group.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (mesh.isMesh) out.push(object);
    });
    // Station interiors and satellites carry explicit walkable surfaces from the assembler, and the
    // atlas root carries the current showcase hulls.
    for (const scope of [this.group, this.bridge.root]) {
      scope.traverse((object) => {
        const list = object.userData.walkableSurfaces as THREE.Object3D[] | undefined;
        if (list) for (const item of list) out.push(item);
        const mesh = object as THREE.Mesh;
        if (mesh.isMesh && (object.userData.catwalk || object.userData.hangar || object.userData.walkable)) out.push(object);
      });
    }
    return out;
  }

  /** Reticle telemetry, throttled to ~10 Hz so it never re-renders React at 60 FPS. */
  private emit(now: number): void {
    if (now - this.lastTelemetry < 100) return;
    this.lastTelemetry = now;
    let screen: Telemetry["screen"] = null;
    let distance = 0;
    let closing = 0;
    const targetAt = this.targetProvider?.();
    if (targetAt) {
      distance = this.bridge.camera.position.distanceTo(targetAt);
      const projected = targetAt.clone().project(this.bridge.camera);
      const onScreen = projected.z < 1 && projected.z > -1 && Math.abs(projected.x) < 0.94 && Math.abs(projected.y) < 0.9;
      screen = { x: (projected.x * 0.5 + 0.5) * this.bridge.width(), y: (-projected.y * 0.5 + 0.5) * this.bridge.height(), onScreen };
      closing = this.ship.autopilotState.closing;
    }
    this.bridge.telemetry({
      mode: this.mode,
      speed: this.flightSpeed,
      boost: this.boostRequested,
      autopilot: this.ship.autopilotState.active ? this.ship.autopilotState.stage : "manual",
      targetName: this.targetName,
      targetDistance: distance,
      closing,
      screen,
      grounded: this.grounded,
      magBoots: this.eva.magBoots,
      surface: this.surface?.label ?? null,
      prompt: this.prompt,
      mounted: this.manager.size,
      scan: this.scan,
      catalog: this.scan?.catalog ?? null,
      effects: this.chaos.activeCount,
      jumpHistory: this.history,
    });
  }

  activatePrompt(): void {
    this.promptAction?.();
  }

  dispose(): void {
    this.disposed = true;
    this.leaveSurface();
    this.manager.dispose();
    this.chaos.dispose();
    this.eva.dispose();
    this.bridge.scene.remove(this.group);
  }
}

function hashFromId(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i += 1) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export { noop };
