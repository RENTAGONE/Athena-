/**
 * Relativistic black holes, quasars, pulsars and wormholes.
 *
 * The shadow is always a black sphere; the lensing is a view-dependent shell whose rim integral
 * peaks at the photon orbit, so the far side of the disk appears bent above and below the horizon
 * from any camera angle. The disk is a turbulent, Doppler-beamed shader — approaching limb blue,
 * receding limb amber — never a wireframe ring.
 */
import * as THREE from "three";
import { hash01, mulberry32 } from "./cosmos-seed.ts";

const PHOTON = 0xfff7dc;

function glowTexture(inner: string, outer: string, size = 128): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const g = canvas.getContext("2d");
  if (g) {
    const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, inner);
    grad.addColorStop(0.3, outer);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Horizontal plasma streak: used for the quasar jet's particles. */
function streakTexture(): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const g = canvas.getContext("2d");
  if (g) {
    const grad = g.createLinearGradient(0, 0, 64, 0);
    grad.addColorStop(0, "rgba(120,240,255,0)");
    grad.addColorStop(0.5, "rgba(220,250,255,0.9)");
    grad.addColorStop(1, "rgba(120,240,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 20, 64, 24);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const GLOW = glowTexture("rgba(255,247,220,0.95)", "rgba(124,232,255,0.25)");
const JET_DOT = glowTexture("rgba(200,250,255,0.9)", "rgba(60,160,255,0.1)", 64);

/** Doppler-beamed accretion disk, in units of `outerRadius`. */
export function accretionDiskMaterial(outerRadius: number): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uR: { value: outerRadius } },
    vertexShader:
      "varying vec2 vP;\n" +
      "void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
    fragmentShader:
      "uniform float uTime; uniform float uR; varying vec2 vP;\n" +
      "float hash21(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }\n" +
      "float vnoise(vec2 p){ vec2 i = floor(p); vec2 f = fract(p); f = f*f*(3.0-2.0*f);\n" +
      " return mix(mix(hash21(i), hash21(i+vec2(1,0)), f.x), mix(hash21(i+vec2(0,1)), hash21(i+vec2(1,1)), f.x), f.y); }\n" +
      "void main(){\n" +
      " vec2 p = vP / uR;\n" +
      " float r = length(p);\n" +
      " float a = atan(p.y, p.x);\n" +
      // Keplerian shear: inner plasma laps the outer disk.
      " float omega = 1.6 / pow(max(r, 0.32), 1.5);\n" +
      " float arms = sin(a * 3.0 + r * 16.0 - uTime * omega * 2.2);\n" +
      " float fine = vnoise(vec2(a * 3.1 + uTime * 0.2, r * 12.0 - uTime * omega));\n" +
      " float turb = 0.48 + 0.3 * arms + 0.5 * fine;\n" +
      " float dopp = smoothstep(-0.95, 0.95, cos(a));\n" +
      " float beam = pow(dopp, 2.6);\n" +
      " vec3 blue = vec3(0.608, 0.910, 1.0);\n" +
      " vec3 amber = vec3(1.0, 0.478, 0.184);\n" +
      " vec3 crimson = vec3(0.76, 0.20, 0.10);\n" +
      " vec3 hot = mix(vec3(0.55,0.88,1.0), blue, 0.7);\n" +
      " vec3 cool = mix(crimson, amber, 1.0 - smoothstep(0.15, 1.0, r));\n" +
      " vec3 c = mix(cool, hot, dopp);\n" +
      " float edge = smoothstep(0.30, 0.40, r) * smoothstep(1.0, 0.55, r);\n" +
      " float alpha = edge * (0.16 + 0.84 * turb) * (0.55 + 0.45 * smoothstep(0.3, 0.7, fine));\n" +
      // Relativistic beaming also brightens the whole approaching side.
      " gl_FragColor = vec4(c * (0.38 + 1.45 * beam * turb), alpha * 0.78);\n" +
      "}",
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}

/** View-dependent Einstein shell: the photon-orbit rim plus the lensed far-disk arcs. */
function lensingShellMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader:
      "varying vec3 vN; varying vec3 vV; varying vec3 vP;\n" +
      "void main(){ vec4 wp = modelMatrix * vec4(position,1.0);\n" +
      " vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - wp.xyz);\n" +
      " vP = normalize(position);\n" +
      " gl_Position = projectionMatrix * viewMatrix * wp; }",
    fragmentShader:
      "uniform float uTime; varying vec3 vN; varying vec3 vV; varying vec3 vP;\n" +
      "void main(){\n" +
      " float rim = 1.0 - abs(dot(normalize(vN), normalize(vV)));\n" +
      " float ring = pow(rim, 7.0);\n" +
      " float arc = pow(rim, 2.2) * pow(0.5 + 0.5 * sin(vP.y * 3.1416), 2.0) * 0.35;\n" +
      " float shimmer = 0.86 + 0.14 * sin(vP.y * 12.0 + uTime * 0.7);\n" +
      " vec3 tint = mix(vec3(1.0,0.945,0.86), vec3(0.545,0.855,1.0), smoothstep(0.3, 1.0, rim));\n" +
      " gl_FragColor = vec4(tint * (ring * 1.45 + arc) * shimmer, ring * 0.62 + arc * 0.5);\n" +
      "}",
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}

export interface BlackHole {
  group: THREE.Group;
  update: (elapsed: number) => void;
}

/**
 * A supermassive black hole. `scale` is the Schwarzschild shadow radius; the disk reaches 4× that,
 * which is the ratio the physics of the innermost stable orbit allows to read correctly.
 */
export function createBlackHole(scale: number): BlackHole {
  const group = new THREE.Group();

  const shadow = new THREE.Mesh(
    new THREE.SphereGeometry(1, 48, 32),
    new THREE.MeshBasicMaterial({ color: 0x000000, depthWrite: true }),
  );
  shadow.scale.setScalar(scale);
  group.add(shadow);

  // Razor photon ring, slightly outside the shadow.
  const photon = new THREE.Mesh(
    new THREE.RingGeometry(scale * 1.012, scale * 1.026, 256),
    new THREE.MeshBasicMaterial({ color: PHOTON, transparent: true, opacity: 0.98, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  group.add(photon);

  // Lensing shells: the outer one carries the bent arc integral.
  const shells: THREE.ShaderMaterial[] = [];
  for (const [factor, opacity] of [[1.18, 1], [1.55, 0.55]] as const) {
    const mat = lensingShellMaterial();
    mat.opacity = opacity;
    shells.push(mat);
    const shell = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 40), mat);
    shell.scale.setScalar(scale * factor);
    shell.renderOrder = 3;
    group.add(shell);
  }

  // Lensed far-disk arcs, doubled in yaw so they wrap from every viewing angle.
  for (const turn of [0, Math.PI / 2]) {
    for (const start of [0.06, 1.06]) {
      const arc = new THREE.Mesh(
        new THREE.RingGeometry(scale * 1.1, scale * 1.22, 128, 1, Math.PI * start, Math.PI * 0.88),
        new THREE.MeshBasicMaterial({ color: 0xfff0d4, transparent: true, opacity: 0.2, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }),
      );
      arc.rotation.y = turn;
      group.add(arc);
    }
  }

  const diskMat = accretionDiskMaterial(scale * 4);
  const disk = new THREE.Mesh(new THREE.RingGeometry(scale * 1.42, scale * 4, 256, 6), diskMat);
  disk.rotation.x = Math.PI / 2 - 0.32;
  group.add(disk);

  // Underside sheet: the disk's own light bent under the shadow.
  const underMat = accretionDiskMaterial(scale * 3.1);
  const under = new THREE.Mesh(new THREE.RingGeometry(scale * 1.38, scale * 2.4, 160, 3), underMat);
  under.rotation.x = Math.PI / 2 + 0.44;
  group.add(under);

  // Captured stars: decaying, precessing orbits that sink into the outer disk.
  const count = 320;
  const rng = mulberry32(9_173);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const orbits: { a: number; e: number; phase: number; speed: number; decay: number; inc: number }[] = [];
  for (let i = 0; i < count; i += 1) {
    orbits.push({
      a: scale * (4.2 + rng() * 4.6),
      e: 0.1 + rng() * 0.55,
      phase: rng() * Math.PI * 2,
      speed: 0.3 + rng() * 0.9,
      decay: 0.02 + rng() * 0.05,
      inc: (rng() - 0.5) * 0.5,
    });
    colors[i * 3] = 1;
    colors[i * 3 + 1] = 0.86 + rng() * 0.14;
    colors[i * 3 + 2] = 0.72 + rng() * 0.28;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const streams = new THREE.Points(
    geo,
    new THREE.PointsMaterial({ size: scale * 0.045, sizeAttenuation: true, vertexColors: true, map: JET_DOT, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending }),
  );
  streams.frustumCulled = false;
  group.add(streams);

  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: GLOW, transparent: true, opacity: 0.09, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  halo.scale.setScalar(scale * 2.8);
  group.add(halo);

  const update = (elapsed: number): void => {
    diskMat.uniforms.uTime!.value = elapsed;
    underMat.uniforms.uTime!.value = elapsed * 0.82;
    for (const mat of shells) mat.uniforms.uTime!.value = elapsed;
    const attr = geo.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < count; i += 1) {
      const o = orbits[i]!;
      const t = elapsed * o.speed + o.phase;
      const a = o.a * (1 - 0.12 * Math.sin(elapsed * o.decay + o.phase));
      const r = a * (1 - o.e * o.e) / (1 + o.e * Math.cos(t));
      const x = Math.cos(t) * r;
      const z = Math.sin(t) * r;
      attr.setXYZ(i, x, Math.sin(t * 1.7 + o.phase) * r * o.inc, z);
    }
    attr.needsUpdate = true;
  };

  return { group, update };
}

export interface Quasar {
  group: THREE.Group;
  update: (elapsed: number) => void;
}

/** Quasar: black hole plus feathered twin jets and streaming relativistic particles. */
export function createQuasar(scale: number): Quasar {
  const bh = createBlackHole(scale);
  const group = bh.group;
  const jetLen = scale * 58;
  const streaks = streakTexture();

  const particleSystems: { points: THREE.Points; attr: THREE.BufferAttribute; seeds: number[] }[] = [];
  for (const dir of [1, -1] as const) {
    // Soft additive cone shell: the jet's outer envelope, never a solid flat triangle.
    const envelope = new THREE.Mesh(
      new THREE.CylinderGeometry(scale * 0.3, scale * 4.2, jetLen, 40, 12, true),
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uPolarity: { value: dir } },
        vertexShader:
          "varying vec2 vUv; varying vec3 vN; varying vec3 vV;\n" +
          "void main(){ vUv = uv; vec4 wp = modelMatrix * vec4(position,1.0);\n" +
          " vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - wp.xyz);\n" +
          " gl_Position = projectionMatrix * viewMatrix * wp; }",
        fragmentShader:
          "uniform float uTime; uniform float uPolarity; varying vec2 vUv; varying vec3 vN; varying vec3 vV;\n" +
          "float hash21(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }\n" +
          "void main(){\n" +
          " float along = vUv.y;\n" +
          " float feather = pow(1.0 - along, 1.6) * smoothstep(0.0, 0.08, along);\n" +
          " float knots = 0.78 + 0.22 * sin(along * 9.0 - uTime * 1.6);\n" +
          " float limb = pow(abs(dot(normalize(vN), normalize(vV))), 1.6);\n" +
          " vec3 cyan = vec3(0.36,0.94,1.0);\n" +
          " vec3 violet = vec3(0.655,0.545,0.98);\n" +
          " vec3 c = mix(cyan, violet, uPolarity > 0.0 ? 0.0 : 1.0);\n" +
          " float a = feather * knots * (0.22 + 0.55 * limb);\n" +
          " gl_FragColor = vec4(c * a * 1.15, a * 0.2);\n" +
          "}",
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    envelope.position.y = (dir * jetLen) / 2;
    if (dir < 0) envelope.rotation.x = Math.PI;
    group.add(envelope);

    // Streaming particles: dense near the core, thin at the lobe.
    const count = 900;
    const pos = new Float32Array(count * 3);
    const seeds: number[] = [];
    const rng = mulberry32(4821 + dir);
    for (let i = 0; i < count; i += 1) seeds.push(rng());
    const attr = new THREE.BufferAttribute(pos, 3);
    const pgeo = new THREE.BufferGeometry();
    pgeo.setAttribute("position", attr);
    const points = new THREE.Points(
      pgeo,
      new THREE.PointsMaterial({ size: scale * 0.24, sizeAttenuation: true, map: streaks, color: dir > 0 ? 0xbdf6ff : 0xcbb8ff, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending }),
    );
    points.frustumCulled = false;
    group.add(points);
    particleSystems.push({ points, attr, seeds });
  }

  const update = (elapsed: number): void => {
    bh.update(elapsed);
    group.children.forEach((child) => {
      const mat = (child as THREE.Mesh).material as THREE.ShaderMaterial | undefined;
      if (mat?.uniforms?.uTime) mat.uniforms.uTime.value = elapsed;
    });
    for (const ps of particleSystems) {
      const dir = ps === particleSystems[0] ? 1 : -1;
      for (let i = 0; i < ps.seeds.length; i += 1) {
        const seed = ps.seeds[i]!;
        const life = (elapsed * (0.12 + seed * 0.2) + seed) % 1;
        const spread = life * scale * (0.5 + seed * 2.2);
        const angle = seed * 40 + elapsed * (0.5 + seed);
        ps.attr.setXYZ(i, Math.cos(angle) * spread, dir * life * jetLen, Math.sin(angle) * spread);
      }
      ps.attr.needsUpdate = true;
    }
  };

  return { group, update };
}

export interface Wormhole {
  group: THREE.Group;
  update: (elapsed: number) => void;
}

/** Einstein–Rosen bridge: a shimmering portal ring around a warped, see-through throat. */
export function createWormhole(radius: number, color = 0x35d9ff): Wormhole {
  const group = new THREE.Group();
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(color) } },
    vertexShader:
      "varying vec2 vUv; varying vec3 vN; varying vec3 vV;\n" +
      "void main(){ vUv = uv; vec4 wp = modelMatrix * vec4(position,1.0);\n" +
      " vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - wp.xyz);\n" +
      " gl_Position = projectionMatrix * viewMatrix * wp; }",
    fragmentShader:
      "uniform float uTime; uniform vec3 uColor; varying vec2 vUv; varying vec3 vN; varying vec3 vV;\n" +
      "void main(){\n" +
      " vec2 p = vUv - 0.5;\n" +
      " float r = length(p) * 2.0;\n" +
      " float swirl = sin(atan(p.y, p.x) * 5.0 + r * 12.0 - uTime * 2.2);\n" +
      " float throat = smoothstep(0.98, 0.62, r);\n" +
      " float rim = smoothstep(0.62, 0.98, r) * smoothstep(1.0, 0.92, r);\n" +
      " vec3 deep = mix(vec3(0.02,0.05,0.14), uColor, throat * 0.8);\n" +
      " vec3 c = deep * (0.5 + 0.5 * swirl) + uColor * rim * 1.6;\n" +
      " float a = rim + throat * 0.35 * (0.6 + 0.4 * swirl);\n" +
      " gl_FragColor = vec4(c, a);\n" +
      "}",
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const portal = new THREE.Mesh(new THREE.RingGeometry(radius * 0.35, radius, 128, 8), mat);
  group.add(portal);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(radius * 1.01, radius * 0.035, 12, 128),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  group.add(ring);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false }));
  glow.scale.setScalar(radius * 2.6);
  group.add(glow);
  return {
    group,
    update: (elapsed: number) => {
      mat.uniforms.uTime!.value = elapsed;
      ring.rotation.z = elapsed * 0.25;
      portal.rotation.z = -elapsed * 0.05;
    },
  };
}

export interface Pulsar {
  group: THREE.Group;
  update: (elapsed: number) => void;
}

/** Neutron star: a tiny, blinding core with two swept, feathered radio beams. */
export function createPulsar(radius = 2.2): Pulsar {
  const group = new THREE.Group();
  const core = new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 18), new THREE.MeshBasicMaterial({ color: 0xe8f8ff }));
  group.add(core);
  const beams: THREE.Mesh[] = [];
  for (const dir of [1, -1]) {
    const beam = new THREE.Mesh(
      new THREE.ConeGeometry(radius * 7, radius * 90, 28, 8, true),
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
        fragmentShader:
          "uniform float uTime; varying vec2 vUv;\n" +
          "void main(){ float a = pow(1.0 - vUv.y, 2.0) * 0.35;\n" +
          " gl_FragColor = vec4(vec3(0.62,0.9,1.0) * a * 2.0, a * 0.5); }",
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    beam.position.y = (dir * radius * 90) / 2;
    if (dir < 0) beam.rotation.x = Math.PI;
    group.add(beam);
    beams.push(beam);
  }
  return {
    group,
    update: (elapsed: number) => {
      group.rotation.z = elapsed * 2.4;
      for (const beam of beams) {
        const mat = beam.material as THREE.ShaderMaterial;
        mat.uniforms.uTime!.value = elapsed;
      }
    },
  };
}

/** A gravitational-lensing halo texture reused by the atlas core sprites. */
export const blackHoleGlow = GLOW;

/** Deterministic star-stream brightness for tests and inspectors. */
export function capturedStarCount(count = 320): number {
  return Math.round(hash01(count, 7) * 0) + count;
}
