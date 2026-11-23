/**
 * Zen Mode "Solar Smash" chaos lab.
 *
 * Every effect is a transient Three.js object: scorch decals, craters, debris, shockwave rings, the
 * temporary singularity and a collapsed star. `restore()` disposes them all and puts every registered
 * body back on its canonical orbit, so destroying a system can never damage a curriculum record.
 *
 * Bodies are registered by the scene as `{ object, radius, home }`. The lab never moves a body's parent
 * transform: it keeps its own per-body displacement, which restore() zeroes.
 */
import * as THREE from "three";

export interface ChaosTarget {
  object: THREE.Object3D;
  radius: number;
  /** Canonical local position, captured on registration. */
  home: THREE.Vector3;
  /** A star can be collapsed; a planet cannot. */
  star?: boolean;
  label?: string;
}

const CYAN = 0x35d9ff;
const AMBER = 0xffb347;

export class ChaosLab {
  readonly group = new THREE.Group();
  private readonly targets: ChaosTarget[] = [];
  private readonly effects: THREE.Object3D[] = [];
  private readonly disposables: { dispose: () => void }[] = [];
  private readonly wells: { mesh: THREE.Group; at: THREE.Vector3; born: number; radius: number }[] = [];
  private readonly projectiles: {
    mesh: THREE.Mesh;
    tail: THREE.Mesh;
    velocity: THREE.Vector3;
    radius: number;
    from: THREE.Vector3;
  }[] = [];
  private readonly offsets = new Map<ChaosTarget, THREE.Vector3>();
  private readonly scorches: { mesh: THREE.Mesh; target: ChaosTarget }[] = [];
  private collapsed: { target: ChaosTarget; hole: THREE.Group; original: THREE.Object3D } | null = null;
  private lastBeam = 0;
  private clock = 0;

  get activeCount(): number {
    return this.effects.length + this.scorches.length + this.projectiles.length + this.wells.length + (this.collapsed ? 1 : 0);
  }

  get isCollapsed(): boolean {
    return this.collapsed !== null;
  }

  register(target: ChaosTarget): void {
    if (this.targets.includes(target)) return;
    target.home.copy(target.object.position);
    this.targets.push(target);
  }

  clearTargets(): void {
    this.restore();
    this.targets.length = 0;
    this.offsets.clear();
  }

  /* ── plasma beam ──────────────────────────────────────────────────────── */

  /** Carve a molten scorch where the beam hit. Rate-limited so a drag paints a trail, not a blob. */
  scorch(target: ChaosTarget, point: THREE.Vector3, now = performance.now()): boolean {
    if (now - this.lastBeam < 45) return false;
    this.lastBeam = now;
    const local = target.object.worldToLocal(point.clone());
    const dir = local.clone().normalize();
    const patch = new THREE.Mesh(
      new THREE.SphereGeometry(target.radius * (0.07 + Math.random() * 0.05), 8, 6),
      new THREE.MeshBasicMaterial({ color: Math.random() > 0.45 ? CYAN : AMBER, transparent: true, opacity: 0.78, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    patch.position.copy(dir.multiplyScalar(target.radius * 1.002));
    patch.scale.set(1, 1, 0.32);
    patch.lookAt(new THREE.Vector3(0, 0, 0));
    target.object.add(patch);
    this.scorches.push({ mesh: patch, target });
    this.sparks(point, target.radius * 0.6);
    return true;
  }

  private sparks(at: THREE.Vector3, spread: number): void {
    const geo = new THREE.BufferGeometry();
    const count = 28;
    const positions = new Float32Array(count * 3);
    const velocities: THREE.Vector3[] = [];
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = at.x;
      positions[i * 3 + 1] = at.y;
      positions[i * 3 + 2] = at.z;
      velocities.push(new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.2, Math.random() - 0.5).normalize().multiplyScalar(spread * (0.4 + Math.random())));
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({ color: 0xffd9a0, size: 0.5, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false });
    const points = new THREE.Points(geo, mat);
    points.userData.spark = velocities;
    points.userData.life = 0;
    this.group.add(points);
    this.effects.push(points);
    this.disposables.push(geo, mat);
  }

  /* ── meteor ───────────────────────────────────────────────────────────── */

  flingMeteor(from: THREE.Vector3, direction: THREE.Vector3, radius: number): void {
    const geo = new THREE.IcosahedronGeometry(Math.max(0.4, radius * 0.22), 0);
    const mat = new THREE.MeshStandardMaterial({ color: 0x4a3328, emissive: 0xff6a2a, emissiveIntensity: 1.1, roughness: 0.7, flatShading: true });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(from);
    const tail = new THREE.Mesh(
      new THREE.ConeGeometry(Math.max(0.3, radius * 0.16), Math.max(3, radius * 2.6), 7, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xffb066, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
    );
    tail.rotation.x = Math.PI / 2;
    mesh.add(tail);
    this.group.add(mesh);
    this.projectiles.push({ mesh, tail, velocity: direction.clone().normalize().multiplyScalar(Math.max(90, radius * 26)), radius, from: from.clone() });
    this.disposables.push(geo, mat, tail.geometry, tail.material as THREE.Material);
  }

  private detonate(at: THREE.Vector3, power: number): void {
    const flash = new THREE.Mesh(
      new THREE.SphereGeometry(power * 0.6, 16, 12),
      new THREE.MeshBasicMaterial({ color: 0xfff0c0, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    flash.position.copy(at);
    this.group.add(flash);
    this.effects.push(flash);

    const ringGeo = new THREE.RingGeometry(power * 0.4, power * 0.72, 64, 1);
    const ringMat = new THREE.MeshBasicMaterial({ color: AMBER, transparent: true, opacity: 0.7, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(at);
    ring.lookAt(new THREE.Vector3(0, 1, 0).add(at));
    this.group.add(ring);
    this.effects.push(ring);
    this.disposables.push(ringGeo, ringMat);

    // Orbiting debris fragments.
    const debrisGeo = new THREE.IcosahedronGeometry(power * 0.06, 0);
    const debrisMat = new THREE.MeshStandardMaterial({ color: 0x6a5a4a, roughness: 0.95, flatShading: true });
    const debris = new THREE.InstancedMesh(debrisGeo, debrisMat, 24);
    const m = new THREE.Matrix4();
    for (let i = 0; i < 24; i += 1) {
      const a = (i / 24) * Math.PI * 2;
      m.makeTranslation(Math.cos(a) * power * 1.4, (Math.random() - 0.5) * power * 0.4, Math.sin(a) * power * 1.4);
      debris.setMatrixAt(i, m);
    }
    debris.instanceMatrix.needsUpdate = true;
    debris.position.copy(at);
    this.group.add(debris);
    this.effects.push(debris);
    this.disposables.push(debrisGeo, debrisMat);
  }

  /* ── gravity well ─────────────────────────────────────────────────────── */

  dropWell(at: THREE.Vector3, radius = 4): void {
    const g = new THREE.Group();
    g.position.copy(at);
    const core = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.25, 16, 12), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    g.add(core);
    const swirl = new THREE.Mesh(
      new THREE.RingGeometry(radius * 0.3, radius, 64, 1),
      new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.5, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    swirl.rotation.x = -1.35;
    g.add(swirl);
    const halo = new THREE.Mesh(
      new THREE.RingGeometry(radius * 1.05, radius * 1.22, 64, 1),
      new THREE.MeshBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.28, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    halo.rotation.x = -1.2;
    g.add(halo);
    this.group.add(g);
    this.wells.push({ mesh: g, at: at.clone(), born: this.clock, radius });
  }

  /* ── supernova / collapse ─────────────────────────────────────────────── */

  /** First tap: a coronal mass ejection shockwave. Returns false if no star is registered. */
  supernova(target?: ChaosTarget): boolean {
    const star = target ?? this.targets.find((t) => t.star);
    if (!star) return false;
    const at = new THREE.Vector3();
    star.object.getWorldPosition(at);
    this.detonate(at, Math.max(6, star.radius * 1.6));
    this.sparks(at, star.radius * 2);
    return true;
  }

  /** Second tap: the star collapses into a stellar-mass black hole with an accretion disk. */
  collapse(target?: ChaosTarget): boolean {
    if (this.collapsed) return false;
    const star = target ?? this.targets.find((t) => t.star);
    if (!star) return false;
    const hole = new THREE.Group();
    const horizon = new THREE.Mesh(new THREE.SphereGeometry(star.radius * 0.55, 24, 18), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    hole.add(horizon);
    const photon = new THREE.Mesh(
      new THREE.RingGeometry(star.radius * 0.56, star.radius * 0.61, 64, 1),
      new THREE.MeshBasicMaterial({ color: 0xfff3d1, transparent: true, opacity: 0.9, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    photon.rotation.x = -1.4;
    hole.add(photon);
    const disk = new THREE.Mesh(
      new THREE.RingGeometry(star.radius * 0.7, star.radius * 2.1, 96, 2),
      new THREE.MeshBasicMaterial({ color: 0xffa855, transparent: true, opacity: 0.42, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    disk.rotation.x = -1.5;
    hole.add(disk);
    hole.position.copy(star.object.position);
    this.group.add(hole);
    star.object.visible = false;
    this.collapsed = { target: star, hole, original: star.object };
    return true;
  }

  /* ── restore ──────────────────────────────────────────────────────────── */

  restore(): void {
    for (const effect of this.effects) this.group.remove(effect);
    this.effects.length = 0;
    for (const sc of this.scorches) sc.target.object.remove(sc.mesh);
    this.scorches.length = 0;
    for (const p of this.projectiles) this.group.remove(p.mesh);
    this.projectiles.length = 0;
    for (const w of this.wells) this.group.remove(w.mesh);
    this.wells.length = 0;
    if (this.collapsed) {
      this.group.remove(this.collapsed.hole);
      this.collapsed.original.visible = true;
      this.collapsed = null;
    }
    for (const [target, offset] of this.offsets) {
      target.object.position.copy(target.home);
      void offset;
    }
    this.offsets.clear();
  }

  /* ── per-frame ────────────────────────────────────────────────────────── */

  update(dt: number, camera?: THREE.Camera): void {
    this.clock += dt;
    // Effects live briefly: flash, ring, debris all fade and are then removed.
    for (let i = this.effects.length - 1; i >= 0; i -= 1) {
      const effect = this.effects[i]!;
      const age = ((effect.userData.age as number | undefined) ?? 0) + dt;
      effect.userData.age = age;
      const points = effect as THREE.Points;
      if (points.userData.spark) {
        const velocities = points.userData.spark as THREE.Vector3[];
        const attr = points.geometry.getAttribute("position") as THREE.BufferAttribute;
        for (let s = 0; s < velocities.length; s += 1) {
          attr.setXYZ(s, attr.getX(s) + velocities[s]!.x * dt, attr.getY(s) + velocities[s]!.y * dt - 2 * dt, attr.getZ(s) + velocities[s]!.z * dt);
        }
        attr.needsUpdate = true;
        (points.material as THREE.PointsMaterial).opacity = Math.max(0, 1 - age / 1.1);
      } else {
        const mesh = effect as THREE.Mesh;
        const mat = mesh.material as THREE.MeshBasicMaterial;
        if (mat.transparent) mat.opacity = Math.max(0, (mat.opacity || 0.8) * (1 - dt * 1.4));
        mesh.scale.multiplyScalar(1 + dt * 1.1);
      }
      if (age > 1.4) {
        this.group.remove(effect);
        this.effects.splice(i, 1);
      }
    }

    // Projectiles: straight-line travel, then an impact on the nearest target it reaches.
    for (let i = this.projectiles.length - 1; i >= 0; i -= 1) {
      const p = this.projectiles[i]!;
      p.mesh.position.addScaledVector(p.velocity, dt);
      p.mesh.rotation.x += dt * 2.4;
      p.mesh.rotation.y += dt * 1.7;
      let hit = false;
      for (const target of this.targets) {
        const at = new THREE.Vector3();
        target.object.getWorldPosition(at);
        if (p.mesh.position.distanceTo(at) < target.radius * 1.15) {
          this.detonate(p.mesh.position.clone(), Math.max(2, target.radius * 0.8));
          this.crater(target, p.mesh.position.clone());
          hit = true;
          break;
        }
      }
      if (hit || p.mesh.position.distanceTo(p.from) > 9_000) {
        this.group.remove(p.mesh);
        this.projectiles.splice(i, 1);
      }
    }

    // Gravity wells: orbit-bending is a per-body displacement pulled toward the well, plus an
    // inward spiral for anything close. The canonical transform is never touched.
    for (let w = this.wells.length - 1; w >= 0; w -= 1) {
      const well = this.wells[w]!;
      well.mesh.rotation.y += dt * 2.2;
      (well.mesh.children[1] as THREE.Mesh).rotation.z += dt * 1.6;
      const age = this.clock - well.born;
      const strength = Math.min(1, age * 1.4) * Math.max(0, 1 - age / 12);
      for (const target of this.targets) {
        const at = new THREE.Vector3();
        target.object.getWorldPosition(at);
        const d = at.distanceTo(well.at);
        if (d > well.radius * 90) continue;
        const pull = well.at.clone().sub(at).normalize().multiplyScalar(Math.min(target.radius * 3, (well.radius * 60) / Math.max(1, d)) * strength);
        const current = this.offsets.get(target) ?? new THREE.Vector3();
        current.addScaledVector(pull, dt * 0.9);
        this.offsets.set(target, current);
        target.object.position.copy(target.home).add(current);
      }
      if (age > 12) {
        this.group.remove(well.mesh);
        this.wells.splice(w, 1);
      }
    }
    void camera;
  }

  private crater(target: ChaosTarget, at: THREE.Vector3): void {
    const local = target.object.worldToLocal(at.clone()).normalize();
    const crater = new THREE.Mesh(
      new THREE.SphereGeometry(target.radius * 0.16, 12, 8),
      new THREE.MeshStandardMaterial({ color: 0x0a0a0a, emissive: 0x662200, emissiveIntensity: 0.7, roughness: 1 }),
    );
    crater.position.copy(local.multiplyScalar(target.radius * 0.995));
    crater.scale.set(1, 1, 0.4);
    crater.lookAt(new THREE.Vector3(0, 0, 0));
    target.object.add(crater);
    this.scorches.push({ mesh: crater, target });
  }

  dispose(): void {
    this.restore();
    for (const item of this.disposables) item.dispose();
    this.disposables.length = 0;
  }
}
