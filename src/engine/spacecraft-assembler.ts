/**
 * Procedural spacecraft and station assembler.
 *
 * 6 bus chassis × 6 solar-wing architectures × 5 payloads = 180 unique satellites, all built from
 * shared geometry and a handful of materials so a whole fleet costs a few draw calls. Stations are
 * multi-deck structures with catwalk decks, docking pads, a lit hangar mouth and a full interior,
 * tagged with walkable surfaces and interior bounds for the EVA/cockpit update.
 */
import * as THREE from "three";
import { mulberry32 } from "./cosmos-seed.ts";

export const BUS_COUNT = 6;
export const WING_COUNT = 6;
export const PAYLOAD_COUNT = 5;
export const SATELLITE_VARIANTS = BUS_COUNT * WING_COUNT * PAYLOAD_COUNT;

export type BusId = "octagonal" | "cylindrical" | "hexprism" | "truss" | "pressure" | "centrifuge";
export type WingId = "twin" | "quad" | "petal" | "rollout" | "concentrator" | "rtg";
export type PayloadId = "dish" | "phased" | "laser" | "magnetometer" | "docking";

export const BUS_IDS: readonly BusId[] = ["octagonal", "cylindrical", "hexprism", "truss", "pressure", "centrifuge"];
export const WING_IDS: readonly WingId[] = ["twin", "quad", "petal", "rollout", "concentrator", "rtg"];
export const PAYLOAD_IDS: readonly PayloadId[] = ["dish", "phased", "laser", "magnetometer", "docking"];

export interface SatelliteIdentity {
  index: number;
  bus: BusId;
  wing: WingId;
  payload: PayloadId;
  label: string;
}

/** Decode a variant index into its three modular choices. */
export function satelliteIdentity(index: number): SatelliteIdentity {
  const i = ((index % SATELLITE_VARIANTS) + SATELLITE_VARIANTS) % SATELLITE_VARIANTS;
  const bus = BUS_IDS[i % BUS_COUNT]!;
  const wing = WING_IDS[Math.floor(i / BUS_COUNT) % WING_COUNT]!;
  const payload = PAYLOAD_IDS[Math.floor(i / (BUS_COUNT * WING_COUNT)) % PAYLOAD_COUNT]!;
  return { index: i, bus, wing, payload, label: `${bus} · ${wing} · ${payload}` };
}

const GOLD = new THREE.MeshStandardMaterial({ color: 0xe0bd63, roughness: 0.4, metalness: 0.6, emissive: 0x2a1d05, emissiveIntensity: 0.4 });
const TITANIUM = new THREE.MeshStandardMaterial({ color: 0xc4d0e2, roughness: 0.45, metalness: 0.55 });
const HULL = new THREE.MeshStandardMaterial({ color: 0x9aaecf, roughness: 0.5, metalness: 0.45, emissive: 0x0a1524, emissiveIntensity: 0.5 });
const PANEL = new THREE.MeshStandardMaterial({ color: 0x24457f, roughness: 0.28, metalness: 0.82, emissive: 0x0a1a33, emissiveIntensity: 0.75 });
const MIRROR = new THREE.MeshStandardMaterial({ color: 0xe8f4ff, roughness: 0.1, metalness: 1 });
const DARK = new THREE.MeshStandardMaterial({ color: 0x2a3346, roughness: 0.72, metalness: 0.55 });
const FOIL = new THREE.MeshStandardMaterial({ color: 0xc9a24a, roughness: 0.42, metalness: 0.85 });
const BEACON = new THREE.MeshBasicMaterial({ color: 0x9cf7ff });

function chassis(id: BusId, r: number): THREE.Object3D {
  const node = new THREE.Object3D();
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh => {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    node.add(mesh);
    return mesh;
  };
  switch (id) {
    case "octagonal":
      add(new THREE.CylinderGeometry(r * 0.82, r * 0.82, r * 1.75, 8), GOLD);
      for (let i = 0; i < 8; i += 1) {
        const a = (i / 8) * Math.PI * 2;
        add(new THREE.BoxGeometry(r * 0.16, r * 1.5, r * 0.04), FOIL, Math.cos(a) * r * 0.84, 0, Math.sin(a) * r * 0.84).rotation.y = -a;
      }
      break;
    case "cylindrical":
      add(new THREE.CylinderGeometry(r * 0.6, r * 0.6, r * 2.1, 24), TITANIUM);
      add(new THREE.TorusGeometry(r * 0.62, r * 0.05, 8, 28), DARK, 0, r * 0.9, 0).rotation.x = Math.PI / 2;
      break;
    case "hexprism":
      add(new THREE.CylinderGeometry(r * 0.7, r * 0.7, r * 1.6, 6), HULL);
      add(new THREE.CylinderGeometry(r * 0.74, r * 0.74, r * 0.16, 6), TITANIUM, 0, r * 0.82, 0);
      break;
    case "truss": {
      add(new THREE.BoxGeometry(r * 0.9, r * 0.5, r * 0.9), DARK);
      for (const dir of [-1, 1]) {
        const beam = add(new THREE.BoxGeometry(r * 0.06, r * 2.4, r * 0.06), TITANIUM, 0, dir * r * 1.2, 0);
        beam.rotation.z = 0.06 * dir;
      }
      for (let i = -2; i <= 2; i += 1) add(new THREE.BoxGeometry(r * 0.9, r * 0.03, r * 0.03), TITANIUM, 0, i * r * 0.42, 0);
      break;
    }
    case "pressure":
      add(new THREE.SphereGeometry(r * 0.85, 24, 18), HULL);
      add(new THREE.TorusGeometry(r * 0.86, r * 0.05, 8, 32), GOLD).rotation.x = Math.PI / 2;
      break;
    default:
      add(new THREE.TorusGeometry(r * 1.15, r * 0.14, 12, 44), HULL).rotation.x = Math.PI / 2;
      for (let i = 0; i < 4; i += 1) {
        const spoke = add(new THREE.BoxGeometry(r * 1.1, r * 0.05, r * 0.05), TITANIUM);
        spoke.rotation.y = (i / 4) * Math.PI;
      }
      add(new THREE.CylinderGeometry(r * 0.22, r * 0.22, r * 0.7, 12), GOLD);
      break;
  }
  return node;
}

function wings(id: WingId, r: number): THREE.Object3D {
  const node = new THREE.Object3D();
  const panel = (w: number, h: number, x: number, y: number, z: number, rot = 0): THREE.Mesh => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, r * 0.03), PANEL);
    mesh.position.set(x, y, z);
    mesh.rotation.z = rot;
    node.add(mesh);
    return mesh;
  };
  switch (id) {
    case "twin":
      for (const dir of [-1, 1]) {
        const strut = new THREE.Mesh(new THREE.BoxGeometry(r * 0.9, r * 0.07, r * 0.07), TITANIUM);
        strut.position.set(dir * r * 0.6, 0, 0);
        node.add(strut);
        panel(r * 1.9, r * 0.9, dir * r * 1.85, 0, 0);
      }
      break;
    case "quad": {
      const geo = new THREE.BoxGeometry(r * 1.2, r * 0.06, r * 1.0);
      for (let i = 0; i < 4; i += 1) {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const mesh = new THREE.Mesh(geo, PANEL);
        mesh.position.set(Math.cos(a) * r * 1.5, 0, Math.sin(a) * r * 1.5);
        mesh.rotation.y = -a;
        node.add(mesh);
      }
      break;
    }
    case "petal": {
      const geo = new THREE.CylinderGeometry(r * 0.52, r * 0.52, r * 0.03, 6);
      for (let i = 0; i < 6; i += 1) {
        const a = (i / 6) * Math.PI * 2;
        const petal = new THREE.Mesh(geo, MIRROR);
        petal.position.set(Math.cos(a) * r * 1.15, 0, Math.sin(a) * r * 1.15);
        petal.rotation.set(0.55, a, 0);
        node.add(petal);
      }
      break;
    }
    case "rollout":
      for (const dir of [-1, 1]) {
        for (let k = 0; k < 3; k += 1) panel(r * 0.5, r * 1.6, dir * (r * 0.95 + k * r * 0.5), 0, 0);
      }
      break;
    case "concentrator": {
      for (let i = 0; i < 6; i += 1) {
        const a = (i / 6) * Math.PI * 2;
        const mirror = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.42, r * 0.42, r * 0.04, 6), MIRROR);
        mirror.position.set(Math.cos(a) * r * 1.3, r * 0.42, Math.sin(a) * r * 1.3);
        mirror.rotation.set(0.4, a, 0.2);
        node.add(mirror);
      }
      break;
    }
    default:
      for (const dir of [-1, 1]) {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(r * 0.9, r * 1.4, r * 0.05), DARK);
        fin.position.set(dir * r * 1.0, 0, 0);
        fin.rotation.y = dir * 0.35;
        node.add(fin);
      }
      const rtg = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.22, r * 0.22, r * 1.1, 12), TITANIUM);
      rtg.position.y = -r * 1.2;
      node.add(rtg);
      break;
  }
  return node;
}

function payload(id: PayloadId, r: number): THREE.Object3D {
  const node = new THREE.Object3D();
  switch (id) {
    case "dish": {
      const dish = new THREE.Mesh(new THREE.SphereGeometry(r * 0.95, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), MIRROR);
      dish.rotation.x = Math.PI;
      dish.position.y = r * 1.1;
      node.add(dish);
      const feed = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.04, r * 0.04, r * 1.1, 6), TITANIUM);
      feed.position.y = r * 1.7;
      node.add(feed);
      break;
    }
    case "phased": {
      const plate = new THREE.Mesh(new THREE.BoxGeometry(r * 1.5, r * 0.9, r * 0.06), PANEL);
      plate.position.y = r * 1.1;
      plate.rotation.x = -0.4;
      node.add(plate);
      for (let i = 0; i < 4; i += 1) {
        const row = new THREE.Mesh(new THREE.BoxGeometry(r * 1.4, r * 0.04, r * 0.02), TITANIUM);
        row.position.set(0, r * (0.78 + i * 0.18), r * 0.05);
        node.add(row);
      }
      break;
    }
    case "laser": {
      const turret = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.34, r * 0.4, r * 0.5, 14), DARK);
      turret.position.y = r * 1.0;
      node.add(turret);
      const lens = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.22, r * 0.22, r * 0.12, 16), new THREE.MeshBasicMaterial({ color: 0x8be9fd }));
      lens.position.y = r * 1.28;
      node.add(lens);
      break;
    }
    case "magnetometer": {
      const boom = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.035, r * 0.035, r * 5.2, 6), TITANIUM);
      boom.rotation.z = Math.PI / 2;
      boom.position.x = r * 2.6;
      node.add(boom);
      const sensor = new THREE.Mesh(new THREE.SphereGeometry(r * 0.16, 10, 8), BEACON);
      sensor.position.set(r * 5.3, 0, 0);
      node.add(sensor);
      break;
    }
    default: {
      const collar = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.34, r * 0.4, r * 0.4, 16, 1, true), TITANIUM);
      collar.position.y = r * 1.0;
      node.add(collar);
      const haloRing = new THREE.Mesh(new THREE.TorusGeometry(r * 0.38, r * 0.03, 8, 24), BEACON);
      haloRing.position.y = r * 1.2;
      node.add(haloRing);
      break;
    }
  }
  return node;
}

/** Assemble one satellite of the 180-variant fleet. */
export function buildSatellite(index: number, radius: number): THREE.Group {
  const group = new THREE.Group();
  const identity = satelliteIdentity(index);
  const r = radius;
  group.add(chassis(identity.bus, r));
  group.add(wings(identity.wing, r));
  group.add(payload(identity.payload, r));
  const strobe = new THREE.Mesh(new THREE.SphereGeometry(r * 0.13, 8, 6), new THREE.MeshBasicMaterial({ color: 0xff4d5e }));
  strobe.position.set(0, -r * 1.1, 0);
  group.add(strobe);
  group.userData.satellite = identity;
  group.userData.walkableSurfaces = [
    { type: "hull", center: new THREE.Vector3(0, 0, 0), size: new THREE.Vector3(r * 1.4, r * 1.6, r * 1.4) },
  ];
  return group;
}

export interface WalkableSurface {
  type: "deck" | "hangar" | "corridor" | "rails" | "docking_pad";
  center: THREE.Vector3;
  size: THREE.Vector3;
}

export interface BuiltStation {
  group: THREE.Group;
  rings: THREE.Object3D[];
  beacons: { mat: THREE.MeshBasicMaterial; phase: number }[];
  bay: THREE.Mesh;
  interior: THREE.Group;
  walkableSurfaces: WalkableSurface[];
  interiorBounds: THREE.Box3;
}

/** Multi-deck station with exterior catwalks, docking pads, an open hangar mouth and an interior. */
export function buildStation(scale: number): BuiltStation {
  const group = new THREE.Group();
  const rings: THREE.Object3D[] = [];
  const beacons: { mat: THREE.MeshBasicMaterial; phase: number }[] = [];

  const trim = new THREE.MeshStandardMaterial({ color: 0xc8d6ec, roughness: 0.4, metalness: 0.86 });
  const hull = new THREE.MeshStandardMaterial({ color: 0x8fa2c4, roughness: 0.55, metalness: 0.72 });

  const ringA = new THREE.Object3D();
  ringA.add(new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.052, 10, 48), trim));
  for (let i = 0; i < 10; i += 1) {
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.5), hull);
    spoke.rotation.y = (i / 10) * Math.PI * 2;
    ringA.add(spoke);
  }
  rings.push(ringA);
  group.add(ringA);

  const ringB = new THREE.Object3D();
  ringB.add(new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.036, 8, 40), hull));
  ringB.rotation.set(Math.PI / 2.6, 0.3, 0);
  rings.push(ringB);
  group.add(ringB);

  group.add(new THREE.Mesh(new THREE.SphereGeometry(0.16, 18, 12), trim));

  // Spine and habitat modules.
  const spine = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.5, 0.06), hull);
  group.add(spine);
  for (const y of [-0.4, 0.4]) {
    const module = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.34, 12), trim);
    module.position.y = y;
    group.add(module);
  }

  // Catwalk decks with guardrails: real walkable surfaces, tagged for the EVA update.
  const walkableSurfaces: WalkableSurface[] = [];
  for (const y of [-0.32, 0.32]) {
    const deck = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.015, 0.22), new THREE.MeshStandardMaterial({ color: 0x5f7290, roughness: 0.8, metalness: 0.4 }));
    deck.position.set(0, y, 0);
    group.add(deck);
    walkableSurfaces.push({ type: "deck", center: new THREE.Vector3(0, y, 0), size: new THREE.Vector3(1.05, 0.02, 0.22) });
    for (const dir of [-1, 1]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.01, 0.01), new THREE.MeshBasicMaterial({ color: 0x9be8ff }));
      rail.position.set(0, y + 0.09, dir * 0.11);
      group.add(rail);
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.09, 0.012), trim);
      post.position.set(dir * 0.5, y + 0.045, dir * 0.11);
      group.add(post);
    }
    walkableSurfaces.push({ type: "rails", center: new THREE.Vector3(0, y + 0.09, 0), size: new THREE.Vector3(1.05, 0.02, 0.24) });
  }

  // Docking pads on the outriggers.
  for (const dir of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.05, 0.05), hull);
    arm.position.x = dir * 0.42;
    group.add(arm);
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.02, 18), new THREE.MeshStandardMaterial({ color: 0x3c4a63, roughness: 0.7, metalness: 0.6 }));
    pad.position.set(dir * 0.62, 0, 0);
    group.add(pad);
    walkableSurfaces.push({ type: "docking_pad", center: new THREE.Vector3(dir * 0.62, 0, 0), size: new THREE.Vector3(0.18, 0.02, 0.18) });
  }

  // Open hangar mouth: a dark cylinder with a lit rim, never a sealed box.
  const bayMat = new THREE.MeshBasicMaterial({ color: 0x8be9fd, side: THREE.DoubleSide });
  const bay = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.15, 0.36, 18, 1, true), bayMat);
  bay.rotation.z = Math.PI / 2;
  group.add(bay);
  const mouth = new THREE.Mesh(
    new THREE.CircleGeometry(0.14, 24),
    new THREE.MeshBasicMaterial({ color: 0x050b16 }),
  );
  mouth.position.x = -0.18;
  mouth.rotation.y = -Math.PI / 2;
  group.add(mouth);
  const lip = new THREE.Mesh(
    new THREE.RingGeometry(0.13, 0.16, 28),
    new THREE.MeshBasicMaterial({ color: 0xbdf6ff, transparent: true, opacity: 0.9, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  lip.position.x = -0.18;
  lip.rotation.y = -Math.PI / 2;
  group.add(lip);

  for (const [x, y, z, color, phase] of [
    [-0.98, 0, 0, 0xff4d5e, 0],
    [0.98, 0, 0, 0x8be9fd, 1.7],
    [0, 0.56, 0, 0x9cf7ff, 3.1],
  ] as const) {
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1 });
    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 6), mat);
    beacon.position.set(x, y, z);
    group.add(beacon);
    beacons.push({ mat, phase });
  }

  group.scale.setScalar(scale);
  const interior = buildStationInterior();
  interior.visible = false;
  group.add(interior);

  return {
    group,
    rings,
    beacons,
    bay,
    interior,
    walkableSurfaces,
    interiorBounds: new THREE.Box3(new THREE.Vector3(-0.9, -0.5, -0.6), new THREE.Vector3(0.9, 0.5, 0.6)),
  };
}

/**
 * The interior command and hangar deck: floor plates, cyan structural ribs, a holographic star table
 * and an airlock. This is the geometry the cockpit/EVA update lands in.
 */
export function buildStationInterior(): THREE.Group {
  const group = new THREE.Group();
  const plate = new THREE.MeshStandardMaterial({ color: 0x3b465c, roughness: 0.6, metalness: 0.5, emissive: 0x0d1a2c, emissiveIntensity: 0.9 });
  const rib = new THREE.MeshBasicMaterial({ color: 0x35d9ff, transparent: true, opacity: 0.42, blending: THREE.AdditiveBlending, depthWrite: false });
  const glow = new THREE.MeshBasicMaterial({ color: 0x9be8ff });

  const floor = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.02, 3.2), plate);
  floor.position.set(0, -0.32, 0);
  group.add(floor);
  for (let i = 0; i < 14; i += 1) {
    const seam = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.004, 0.012), new THREE.MeshStandardMaterial({ color: 0x1a2232, roughness: 0.9 }));
    seam.position.set(0, -0.308, -1.5 + i * 0.23);
    group.add(seam);
  }
  // Ribs: inverted U frames marching down the corridor.
  for (let i = 0; i < 5; i += 1) {
    const z = -1.2 + i * 0.62;
    for (const dir of [-1, 1]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.72, 0.03), rib);
      post.position.set(dir * 0.66, -0.02, z);
      group.add(post);
    }
    const header = new THREE.Mesh(new THREE.BoxGeometry(1.34, 0.02, 0.03), rib);
    header.position.set(0, 0.36, z);
    group.add(header);
  }
  // Holo star table in the command bay.
  const table = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.3, 0.06, 20), new THREE.MeshStandardMaterial({ color: 0x3d4a60, roughness: 0.5, metalness: 0.7 }));
  table.position.set(0, -0.1, 0.3);
  group.add(table);
  const hologram = new THREE.Mesh(new THREE.IcosahedronGeometry(0.17, 2), new THREE.MeshBasicMaterial({ color: 0x7ce8ff, wireframe: true, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false }));
  hologram.position.set(0, 0.1, 0.3);
  group.add(hologram);
  group.userData.hologram = hologram;
  const lamp = new THREE.PointLight(0xbfefff, 2.2, 0, 1.3);
  lamp.position.set(0, 0.5, 0.6);
  group.add(lamp);
  // Airlock doors at the far end.
  for (const dir of [-1, 1]) {
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.62, 0.04), new THREE.MeshStandardMaterial({ color: 0x46536b, roughness: 0.6, metalness: 0.65 }));
    door.position.set(dir * 0.28, -0.02, 1.5);
    group.add(door);
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.62, 0.05), glow);
    frame.position.set(dir * 0.31, -0.02, 1.5);
    group.add(frame);
  }
  group.userData.walkableSurfaces = [
    { type: "corridor", center: new THREE.Vector3(0, -0.32, 0), size: new THREE.Vector3(1.4, 0.02, 3.2) },
    { type: "hangar", center: new THREE.Vector3(0, -0.32, -1.2), size: new THREE.Vector3(1.4, 0.02, 1.0) },
  ];
  group.userData.interiorBounds = new THREE.Box3(new THREE.Vector3(-0.7, -0.34, -1.7), new THREE.Vector3(0.7, 0.38, 1.7));
  return group;
}
