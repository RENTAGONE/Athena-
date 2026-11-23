/**
 * LRU cache of fully built 3D star systems.
 *
 * The streamer can show 62,500 stars at once, but only a handful may exist as geometry: one system is
 * ~40 meshes plus an instanced belt, and a phone cannot hold a hundred of them. The manager therefore
 * mounts at most `capacity` systems (4), evicting the least-recently-used one and disposing its
 * geometries so nothing leaks while flying across thousands of sectors.
 */
import * as THREE from "three";
import type { SystemSpec } from "./system-synthesizer.ts";
import { buildSystem, type BuiltSystem } from "./planet-star-builder.ts";

export interface MountedSystem {
  key: string;
  spec: SystemSpec;
  built: BuiltSystem;
  center: THREE.Vector3;
  /** Monotonic use counter, for LRU. */
  used: number;
}

const RENDERABLE = new Set<THREE.BufferGeometry>();

export class SystemManager {
  readonly group = new THREE.Group();
  private readonly mounted = new Map<string, MountedSystem>();
  private readonly capacity: number;
  private tick = 0;

  constructor(capacity = 4) {
    this.capacity = Math.max(1, capacity);
  }

  get size(): number {
    return this.mounted.size;
  }

  keys(): string[] {
    return [...this.mounted.keys()];
  }

  get(key: string): MountedSystem | undefined {
    const hit = this.mounted.get(key);
    if (hit) hit.used = ++this.tick;
    return hit;
  }

  /**
   * Mount a system at `center`, evicting the least recently used one when full. Idempotent: mounting
   * the same key twice only refreshes its position and LRU stamp.
   */
  mount(spec: SystemSpec, center: THREE.Vector3, scale = 1): MountedSystem {
    const existing = this.mounted.get(spec.key);
    if (existing) {
      existing.center.copy(center);
      existing.built.group.position.copy(center);
      existing.used = ++this.tick;
      return existing;
    }
    while (this.mounted.size >= this.capacity) {
      let oldest: MountedSystem | null = null;
      for (const candidate of this.mounted.values()) if (!oldest || candidate.used < oldest.used) oldest = candidate;
      if (!oldest) break;
      this.evict(oldest.key);
    }
    const built = buildSystem(spec, { scale, mastery: spec.mastery });
    built.group.position.copy(center);
    built.group.userData.systemKey = spec.key;
    this.group.add(built.group);
    const entry: MountedSystem = { key: spec.key, spec, built, center: center.clone(), used: ++this.tick };
    this.mounted.set(spec.key, entry);
    return entry;
  }

  evict(key: string): void {
    const entry = this.mounted.get(key);
    if (!entry) return;
    this.group.remove(entry.built.group);
    entry.built.group.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (mesh.geometry && !RENDERABLE.has(mesh.geometry)) {
        mesh.geometry.dispose();
        RENDERABLE.add(mesh.geometry);
      }
    });
    this.mounted.delete(key);
  }

  /** Advance every mounted system and its star's plasma clock. */
  update(dt: number, elapsed: number): void {
    for (const entry of this.mounted.values()) entry.built.update(dt, elapsed, entry.spec.mastery);
  }

  /** Nearest mounted planet to a world point: used for landing prompts and the reticle. */
  nearestPlanet(point: THREE.Vector3): { key: string; name: string; radius: number; holder: THREE.Object3D; biome: string } | null {
    let best: { key: string; name: string; radius: number; holder: THREE.Object3D; biome: string; d: number } | null = null;
    const at = new THREE.Vector3();
    for (const entry of this.mounted.values()) {
      for (const planet of entry.built.planets) {
        planet.holder.getWorldPosition(at);
        const d = at.distanceTo(point) - planet.spec.radius;
        if (d < (best?.d ?? Infinity)) {
          best = { key: entry.key, name: planet.spec.name, radius: planet.spec.radius, holder: planet.holder, biome: planet.spec.biome.id, d };
        }
      }
    }
    return best && best.d < 40 ? best : null;
  }

  dispose(): void {
    for (const key of [...this.mounted.keys()]) this.evict(key);
  }
}
