/**
 * Local planetary surface scene.
 *
 * Landing does not cut to a loading screen: the atlas builds a small self-contained scene at the
 * planet's coordinates, hides the orbital bodies and drops the camera to eye height. The biome decides
 * the ground, the sky and what stands on the horizon; real mastery raises the cyber-metropolis.
 *
 * The mesh doubles as the EVA walking surface (`userData.surface`), so mag-boots work on terrain with
 * exactly the same raycast as a station catwalk.
 */
import * as THREE from "three";
import { mulberry32 } from "./cosmos-seed.ts";
import { textureFor } from "./planet-star-builder.ts";
import type { Biome } from "./system-synthesizer.ts";

export interface SurfaceScene {
  group: THREE.Group;
  /** Meshes the EVA boots can stand on. */
  surfaces: THREE.Object3D[];
  update: (dt: number, elapsed: number, camera: THREE.Camera) => void;
  /** Eye-height spawn point on the terrain, in world space. */
  spawn: THREE.Vector3;
  label: string;
  dispose: () => void;
}

interface BiomePalette {
  ground: number;
  accent: number;
  skyTop: number;
  skyHorizon: number;
  water: number | null;
  fog: number;
  label: string;
}

const PALETTES: Record<Biome, BiomePalette> = {
  oceanic: { ground: 0x2d5a4a, accent: 0x8fe0c0, skyTop: 0x123a5c, skyHorizon: 0x74c7de, water: 0x1b6f8f, fog: 0x2c6f8a, label: "Oceanic Archipelago" },
  lava: { ground: 0x2a1b18, accent: 0xff7a3c, skyTop: 0x1a0c0a, skyHorizon: 0x8a2a12, water: null, fog: 0x5a1f10, label: "Volcanic Magma Fissures" },
  crystalline: { ground: 0x1d3a44, accent: 0x8ff0e0, skyTop: 0x0a2030, skyHorizon: 0x2f7f8f, water: null, fog: 0x1e5a68, label: "Crystalline Spires" },
  desert: { ground: 0x8a5a34, accent: 0xffc98a, skyTop: 0x3a1d12, skyHorizon: 0xd08a52, water: null, fog: 0xa06840, label: "Desert Dunes" },
  ice: { ground: 0x9fc4d8, accent: 0xdff6ff, skyTop: 0x1a2f4a, skyHorizon: 0x9fd0e8, water: 0x6f9fbf, fog: 0x8fb8d0, label: "Frozen Tundra" },
  lush: { ground: 0x2f5a34, accent: 0xa8e89a, skyTop: 0x1b3a54, skyHorizon: 0x8fc8a8, water: 0x2f7f8f, fog: 0x3f6f5f, label: "Lush Terrain" },
  barren: { ground: 0x6a6a72, accent: 0xb8c4d0, skyTop: 0x10141c, skyHorizon: 0x4a5568, water: null, fog: 0x3a4452, label: "Barren Regolith" },
  gas_giant: { ground: 0x9a7a5a, accent: 0xffd2a0, skyTop: 0x2a1f1a, skyHorizon: 0xb08a62, water: null, fog: 0x8a7050, label: "Aerial Cloud Deck" },
};

export interface SurfaceOptions {
  biome: Biome;
  /** Real mastery 0..1: drives the illuminated city and the giant orbital structures overhead. */
  mastery: number;
  /** Parent star colour and radius, rendered on the horizon. */
  starColor: number;
  starRadius: number;
  /** True when the planet has a ring; the band is drawn across the sky. */
  ringed: boolean;
  /** Moons as simple discs overhead. */
  moons: number;
  seed: number;
}

export function buildSurface(options: SurfaceOptions): SurfaceScene {
  const palette = PALETTES[options.biome];
  const rng = mulberry32(options.seed);
  const group = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  /* ── sky dome ─────────────────────────────────────────────────────────── */
  const skyMat = new THREE.ShaderMaterial({
    uniforms: {
      uTop: { value: new THREE.Color(palette.skyTop) },
      uHorizon: { value: new THREE.Color(palette.skyHorizon) },
      uStar: { value: new THREE.Color(options.starColor) },
      uStarDir: { value: new THREE.Vector3(0.35, 0.16, -1).normalize() },
    },
    vertexShader: "varying vec3 vW; void main(){ vec4 wp = modelMatrix*vec4(position,1.0); vW = wp.xyz; gl_Position = projectionMatrix*viewMatrix*wp; }",
    fragmentShader:
      "uniform vec3 uTop; uniform vec3 uHorizon; uniform vec3 uStar; uniform vec3 uStarDir; varying vec3 vW;\n" +
      "void main(){ vec3 d = normalize(vW); float h = clamp(d.y*0.5+0.5, 0.0, 1.0);\n" +
      " vec3 c = mix(uHorizon, uTop, pow(h, 0.85));\n" +
      " float sd = max(0.0, dot(d, normalize(uStarDir)));\n" +
      " c += uStar * pow(sd, 220.0) * 2.2 + uStar * pow(sd, 12.0) * 0.12;\n" +
      " gl_FragColor = vec4(c, 1.0); }",
    side: THREE.BackSide,
    depthWrite: false,
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(2_400, 32, 20), skyMat);
  disposables.push(sky.geometry, skyMat);
  group.add(sky);

  /* ── terrain ──────────────────────────────────────────────────────────── */
  const size = 900;
  const segments = 96;
  const geo = new THREE.PlaneGeometry(size, size, segments, segments);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.getAttribute("position") as THREE.BufferAttribute;
  const noise = (x: number, z: number): number => {
    // Two octaves of value noise: broad dunes plus rocky detail. Deterministic per seed.
    const a = Math.sin(x * 0.012 + options.seed * 0.001) * Math.cos(z * 0.01 - options.seed * 0.002);
    const b = Math.sin(x * 0.041 - z * 0.037) * 0.35;
    const c = Math.cos(x * 0.11 + z * 0.09) * 0.08;
    return (a + b + c) * 0.5 + 0.5;
  };
  const amplitude = options.biome === "desert" ? 26 : options.biome === "lava" ? 34 : options.biome === "ice" ? 16 : 22;
  for (let i = 0; i < pos.count; i += 1) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const h = noise(x, z);
    // A flat landing shelf at the origin so the astronaut never spawns on a cliff.
    const flatten = Math.min(1, Math.hypot(x, z) / 90);
    pos.setY(i, (h - 0.45) * amplitude * flatten);
  }
  geo.computeVertexNormals();
  const groundMat = new THREE.MeshStandardMaterial({
    map: textureFor(options.biome === "gas_giant" ? "planet-banded-giant" : options.biome === "oceanic" ? "planet-ocean-earth" : options.biome === "lava" ? "planet-volcanic" : options.biome === "crystalline" ? "planet-crystal-teal" : options.biome === "desert" ? "planet-rust-desert" : options.biome === "ice" ? "planet-ice-world" : options.biome === "lush" ? "planet-lush-alien" : "planet-cratered-grey"),
    color: palette.ground,
    roughness: 0.92,
    metalness: 0.04,
  });
  const ground = new THREE.Mesh(geo, groundMat);
  ground.userData.surface = "regolith";
  ground.userData.walkable = true;
  disposables.push(geo, groundMat);
  group.add(ground);

  /* ── water, fissures, spires, dunes, ice and the city ─────────────────── */
  if (palette.water !== null) {
    const waterGeo = new THREE.PlaneGeometry(size * 1.4, size * 1.4, 1, 1);
    const waterMat = new THREE.MeshStandardMaterial({ color: palette.water, roughness: 0.08, metalness: 0.55, transparent: true, opacity: 0.9 });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.y = -6;
    disposables.push(waterGeo, waterMat);
    group.add(water);
  }

  const accentMat = new THREE.MeshBasicMaterial({ color: palette.accent, toneMapped: false, transparent: true, opacity: 0.85 });
  disposables.push(accentMat);

  if (options.biome === "lava") {
    // Glowing fissures: thin emissive ribbons laid across the terrain.
    for (let i = 0; i < 14; i += 1) {
      const len = 60 + rng() * 260;
      const fissure = new THREE.Mesh(new THREE.PlaneGeometry(2 + rng() * 4, len), accentMat);
      fissure.rotation.x = -Math.PI / 2;
      fissure.rotation.z = rng() * Math.PI;
      fissure.position.set((rng() - 0.5) * 600, 2 + rng() * 6, (rng() - 0.5) * 600);
      group.add(fissure);
    }
    for (let i = 0; i < 6; i += 1) {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(26 + rng() * 30, 60 + rng() * 70, 7), new THREE.MeshStandardMaterial({ color: 0x241512, roughness: 1, flatShading: true }));
      cone.position.set((rng() - 0.5) * 700, 8, (rng() - 0.5) * 700);
      group.add(cone);
    }
  } else if (options.biome === "crystalline") {
    for (let i = 0; i < 34; i += 1) {
      const h = 40 + rng() * 190;
      const spire = new THREE.Mesh(
        new THREE.ConeGeometry(4 + rng() * 12, h, 5 + Math.floor(rng() * 3)),
        new THREE.MeshStandardMaterial({ color: 0x8ff0e0, emissive: 0x1a6a72, emissiveIntensity: 0.6, roughness: 0.15, metalness: 0.6, flatShading: true, transparent: true, opacity: 0.88 }),
      );
      spire.position.set((rng() - 0.5) * 760, h / 2 - 6, (rng() - 0.5) * 760);
      spire.rotation.z = (rng() - 0.5) * 0.24;
      group.add(spire);
    }
  } else if (options.biome === "desert") {
    for (let i = 0; i < 26; i += 1) {
      const dune = new THREE.Mesh(new THREE.SphereGeometry(40 + rng() * 90, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), groundMat);
      dune.scale.set(1, 0.16 + rng() * 0.1, 0.6);
      dune.position.set((rng() - 0.5) * 900, -4, (rng() - 0.5) * 900);
      group.add(dune);
    }
  } else if (options.biome === "ice") {
    for (let i = 0; i < 30; i += 1) {
      const shard = new THREE.Mesh(new THREE.ConeGeometry(5 + rng() * 14, 30 + rng() * 90, 4), new THREE.MeshStandardMaterial({ color: 0xcfeeff, roughness: 0.12, metalness: 0.3, transparent: true, opacity: 0.82, flatShading: true }));
      shard.position.set((rng() - 0.5) * 800, 4, (rng() - 0.5) * 800);
      shard.rotation.z = (rng() - 0.5) * 0.3;
      group.add(shard);
    }
  } else if (options.biome === "oceanic" || options.biome === "lush") {
    for (let i = 0; i < 40; i += 1) {
      const palm = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.8, 20 + rng() * 14, 6), new THREE.MeshStandardMaterial({ color: 0x4a3a24, roughness: 1 }));
      trunk.position.y = 10;
      palm.add(trunk);
      const crown = new THREE.Mesh(new THREE.ConeGeometry(9 + rng() * 4, 12, 7), new THREE.MeshStandardMaterial({ color: 0x2f7a4a, roughness: 0.85, flatShading: true }));
      crown.position.y = 26;
      palm.add(crown);
      palm.position.set((rng() - 0.5) * 640, 2, (rng() - 0.5) * 640);
      group.add(palm);
    }
  }

  // Cyber-metropolis: lit towers scaled by the real mastery ratio, so a mastered world really glows.
  const city: { mesh: THREE.Mesh; mat: THREE.MeshStandardMaterial; phase: number }[] = [];
  if (options.mastery > 0.05 && options.biome !== "gas_giant") {
    const count = Math.round(18 + options.mastery * 54);
    for (let i = 0; i < count; i += 1) {
      const h = (4 + rng() * 30) * (0.5 + options.mastery * 1.6);
      const w = 3 + rng() * 7;
      const mat = new THREE.MeshStandardMaterial({
        color: 0x0d1420,
        emissive: new THREE.Color(rng() > 0.72 ? 0xffc66d : 0x35d9ff),
        emissiveIntensity: 0.4 + options.mastery * 1.1,
        roughness: 0.45,
        metalness: 0.6,
      });
      const tower = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), mat);
      const angle = rng() * Math.PI * 2;
      const radius = 90 + rng() * 300;
      tower.position.set(Math.cos(angle) * radius, h / 2 + 2, Math.sin(angle) * radius);
      group.add(tower);
      city.push({ mesh: tower, mat, phase: rng() * 6.28 });
    }
  }

  /* ── sky furniture: ring band, moons, a second sun ────────────────────── */
  if (options.ringed) {
    const ringGeo = new THREE.RingGeometry(600, 1_100, 128, 1);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xe8d2b0, transparent: true, opacity: 0.24, side: THREE.DoubleSide, depthWrite: false });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -1.15;
    ring.position.y = 520;
    disposables.push(ringGeo, ringMat);
    group.add(ring);
  }
  const moonMat = new THREE.MeshBasicMaterial({ color: 0xd8e4f0, toneMapped: false });
  disposables.push(moonMat);
  for (let i = 0; i < Math.min(3, options.moons); i += 1) {
    const moon = new THREE.Mesh(new THREE.SphereGeometry(9 + rng() * 14, 12, 10), moonMat);
    moon.position.set(-500 + i * 420 + rng() * 90, 260 + rng() * 160, -1_400 - i * 200);
    group.add(moon);
  }
  const starDisc = new THREE.Mesh(
    new THREE.SphereGeometry(options.starRadius * 1.6, 20, 14),
    new THREE.MeshBasicMaterial({ color: options.starColor, toneMapped: false }),
  );
  starDisc.position.set(520, 300, -1_900);
  disposables.push(starDisc.geometry, starDisc.material as THREE.Material);
  group.add(starDisc);
  const starLight = new THREE.DirectionalLight(options.starColor, 2.8);
  starLight.position.copy(starDisc.position);
  group.add(starLight);
  group.add(new THREE.HemisphereLight(palette.skyHorizon, palette.ground, 1.05));
  group.add(new THREE.AmbientLight(0x9fb4d0, 0.42));
  // Fog is a scene property, not an Object3D: the caller adopts it when entering the surface.
  const fog = new THREE.FogExp2(palette.fog, 0.0016);
  group.userData.fog = fog;

  const spawn = new THREE.Vector3(0, 3.4, 26);
  const surfaces = [ground];

  const update = (dt: number, elapsed: number, camera: THREE.Camera): void => {
    // The dome and sky furniture follow the camera so the horizon never ends.
    sky.position.copy(camera.position);
    const flicker = 0.85 + 0.15 * Math.sin(elapsed * 0.7);
    for (const tower of city) {
      tower.mat.emissiveIntensity = (0.4 + options.mastery) * flicker + Math.sin(elapsed * 2.2 + tower.phase) * 0.12;
    }
    if (accentMat.opacity > 0.4) accentMat.opacity = 0.62 + 0.24 * Math.sin(elapsed * 0.9);
    if (palette.water !== null) {
      // A slow swell on the sea plane.
      group.children.forEach((child) => {
        if ((child as THREE.Mesh).geometry instanceof THREE.PlaneGeometry && child !== ground) child.position.y = -6 + Math.sin(elapsed * 0.6) * 0.4;
      });
    }
    void dt;
  };

  const dispose = (): void => {
    for (const item of disposables) item.dispose();
    group.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (mesh.geometry && !disposables.includes(mesh.geometry)) mesh.geometry.dispose();
      const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else mat?.dispose();
    });
  };

  return { group, surfaces, update, spawn, label: palette.label, dispose };
}
