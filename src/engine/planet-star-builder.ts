/**
 * Planet, star, ring, belt and comet builders.
 *
 * Every world is assembled from the shipped .webp maps plus procedural shader work: no cyan
 * atmosphere domes, only a paper-thin grazing-angle rim. Rings get a real planet shadow-cylinder
 * eclipse in the fragment shader, and comet tails always point away from the star.
 */
import * as THREE from "three";
import { mulberry32, type StarSpec } from "./cosmos-seed.ts";
import type { BeltSpec, BiomeStyle, CometSpec, MoonSpec, PlanetSpec, RingSpec, SystemSpec } from "./system-synthesizer.ts";
import planetOceanEarth from "../assets/textures/planet-ocean-earth.webp";
import planetRustDesert from "../assets/textures/planet-rust-desert.webp";
import planetIceWorld from "../assets/textures/planet-ice-world.webp";
import planetVolcanic from "../assets/textures/planet-volcanic.webp";
import planetBandedGiant from "../assets/textures/planet-banded-giant.webp";
import planetCrateredGrey from "../assets/textures/planet-cratered-grey.webp";
import planetLushAlien from "../assets/textures/planet-lush-alien.webp";
import planetCrystalTeal from "../assets/textures/planet-crystal-teal.webp";
import planetBlueOcean from "../assets/textures/planet-blue-ocean.webp";
import planetOrangeStorm from "../assets/textures/planet-orange-storm.webp";
import planetVioletGiant from "../assets/textures/planet-violet-giant.webp";
import moonCratered from "../assets/textures/moon-cratered-moon.webp";
import moonIceCracked from "../assets/textures/moon-ice-cracked.webp";
import moonSulphur from "../assets/textures/moon-sulphur-io.webp";
import moonCarbon from "../assets/textures/moon-carbon-moon.webp";
import moonGlassy from "../assets/textures/moon-glassy-ice.webp";
import starSun from "../assets/textures/star-sun-granulation.webp";
import starBlue from "../assets/textures/star-blue-hot.webp";
import starGold from "../assets/textures/star-gold-g.webp";
import starRed from "../assets/textures/star-red-giant.webp";
import starOrange from "../assets/textures/star-orange-dwarf.webp";
import starWhite from "../assets/textures/star-white-dwarf.webp";

const TEX: Record<string, string> = {
  "planet-ocean-earth": planetOceanEarth,
  "planet-rust-desert": planetRustDesert,
  "planet-ice-world": planetIceWorld,
  "planet-volcanic": planetVolcanic,
  "planet-banded-giant": planetBandedGiant,
  "planet-cratered-grey": planetCrateredGrey,
  "planet-lush-alien": planetLushAlien,
  "planet-crystal-teal": planetCrystalTeal,
  "planet-blue-ocean": planetBlueOcean,
  "planet-orange-storm": planetOrangeStorm,
  "planet-violet-giant": planetVioletGiant,
  "moon-cratered-moon": moonCratered,
  "moon-ice-cracked": moonIceCracked,
  "moon-sulphur-io": moonSulphur,
  "moon-carbon-moon": moonCarbon,
  "moon-glassy-ice": moonGlassy,
  "star-sun-granulation": starSun,
  "star-blue-hot": starBlue,
  "star-gold-g": starGold,
  "star-red-giant": starRed,
  "star-orange-dwarf": starOrange,
  "star-white-dwarf": starWhite,
};

const cache = new Map<string, THREE.Texture>();
export function textureFor(id: string): THREE.Texture {
  const hit = cache.get(id);
  if (hit) return hit;
  const tex = new THREE.TextureLoader().load(TEX[id] ?? planetCrateredGrey);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.wrapS = THREE.RepeatWrapping;
  cache.set(id, tex);
  return tex;
}

const SPHERE = new THREE.SphereGeometry(1, 48, 32);
const SPHERE_LO = new THREE.SphereGeometry(1, 24, 16);

/** Limb-darkened granulation, convection cells and a corona driven by the star's own temperature. */
export function buildStar(star: StarSpec, radius: number): THREE.Group {
  const group = new THREE.Group();
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: textureFor(star.texture) },
      uTime: { value: 0 },
      uTint: { value: new THREE.Color(star.color) },
      uTemp: { value: THREE.MathUtils.clamp((star.temperature - 2_400) / 30_000, 0, 1) },
    },
    vertexShader:
      "varying vec2 vUv; varying vec3 vN; varying vec3 vV; varying vec3 vW;\n" +
      "void main(){ vUv = uv; vec4 wp = modelMatrix * vec4(position,1.0); vW = wp.xyz;\n" +
      " vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - wp.xyz);\n" +
      " gl_Position = projectionMatrix * viewMatrix * wp; }",
    fragmentShader:
      "uniform sampler2D uMap; uniform float uTime; uniform vec3 uTint; uniform float uTemp;\n" +
      "varying vec2 vUv; varying vec3 vN; varying vec3 vV; varying vec3 vW;\n" +
      "float hash21(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }\n" +
      "float fbm(vec2 p){ float v=0.0, a=0.5;\n" +
      " for(int i=0;i<5;i++){ v += a * hash21(floor(p)); p *= 2.03; a *= 0.5; }\n" +
      " return v; }\n" +
      "void main(){\n" +
      " vec3 base = texture2D(uMap, vUv).rgb * uTint;\n" +
      " float cells = fbm(vUv * vec2(46.0, 26.0) + vec2(uTime*0.035, uTime*0.06));\n" +
      " float granules = smoothstep(0.42, 0.78, cells);\n" +
      " float limb = pow(clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0), 0.42);\n" +
      " vec3 hot = mix(base, vec3(1.0,0.96,0.88), 0.35 + 0.4*uTemp);\n" +
      " vec3 c = mix(base * 0.72, hot, granules) * (0.55 + 0.85*limb);\n" +
      " gl_FragColor = vec4(c * 1.25, 1.0);\n" +
      "}",
  });
  const sphere = new THREE.Mesh(SPHERE, mat);
  sphere.scale.setScalar(radius);
  group.add(sphere);
  const light = new THREE.PointLight(new THREE.Color(star.color), 2.6, 0, 1.4);
  light.distance = 0;
  group.add(light);
  group.userData.starMaterial = mat;
  return group;
}

/** Paper-thin grazing rim only: the surface itself is never covered. */
function rimShell(radius: number, color: number, strength = 0.45): THREE.Mesh {
  const mat = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uStrength: { value: strength } },
    vertexShader:
      "varying vec3 vN; varying vec3 vV;\n" +
      "void main(){ vec4 wp = modelMatrix * vec4(position,1.0);\n" +
      " vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - wp.xyz);\n" +
      " gl_Position = projectionMatrix * viewMatrix * wp; }",
    fragmentShader:
      "uniform vec3 uColor; uniform float uStrength; varying vec3 vN; varying vec3 vV;\n" +
      "void main(){ float r = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 5.0);\n" +
      " gl_FragColor = vec4(uColor * r * uStrength, r * uStrength); }",
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false,
  });
  const shell = new THREE.Mesh(SPHERE_LO, mat);
  shell.scale.setScalar(radius * 1.015);
  return shell;
}

/** City grids on the shadowed hemisphere; megastructures switch on at full mastery. */
function nightCities(radius: number): THREE.Mesh {
  const mat = new THREE.ShaderMaterial({
    uniforms: { uLevel: { value: 0 }, uTime: { value: 0 } },
    vertexShader:
      "varying vec2 vUv; varying vec3 vN; varying vec3 vW;\n" +
      "void main(){ vUv = uv; vec4 wp = modelMatrix * vec4(position,1.0); vW = wp.xyz;\n" +
      " vN = normalize(mat3(modelMatrix) * normal);\n" +
      " gl_Position = projectionMatrix * viewMatrix * wp; }",
    fragmentShader:
      "uniform float uLevel; uniform float uTime; varying vec2 vUv; varying vec3 vN; varying vec3 vW;\n" +
      "float hash21(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }\n" +
      "void main(){\n" +
      " float night = smoothstep(0.12, -0.24, normalize(vN).y);\n" +
      " vec2 g = vUv * vec2(90.0, 45.0);\n" +
      " vec2 cell = floor(g); vec2 f = fract(g);\n" +
      " float seed = hash21(cell);\n" +
      " float dotMask = step(0.86, seed) * smoothstep(0.42, 0.06, length(f - 0.5));\n" +
      " float grid = step(0.967, seed) * smoothstep(0.42, 0.5, abs(f.x - 0.5)) * smoothstep(0.4, 0.5, abs(f.y - 0.5));\n" +
      " float lit = (dotMask + grid) * step(seed, uLevel);\n" +
      " vec3 warm = vec3(1.0, 0.776, 0.427);\n" +
      " vec3 cool = vec3(0.208, 0.851, 1.0);\n" +
      " vec3 c = mix(warm, cool, step(0.93, seed));\n" +
      " gl_FragColor = vec4(c * lit * night * (0.6 + 0.4 * sin(uTime * 0.7 + seed * 40.0)), 1.0);\n" +
      "}",
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(SPHERE, mat);
  mesh.scale.setScalar(radius * 1.002);
  return mesh;
}

/** Cassini ring with a real planet shadow cylinder and two density gaps. */
function buildRing(ring: RingSpec, planetRadius: number): { mesh: THREE.Mesh; mat: THREE.ShaderMaterial } {
  const geo = new THREE.RingGeometry(ring.inner, ring.outer, 192, 8);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uInner: { value: ring.inner },
      uOuter: { value: ring.outer },
      uPlanet: { value: planetRadius },
      uGapA: { value: ring.gaps[0] ?? 0.4 },
      uGapB: { value: ring.gaps[1] ?? 0.7 },
      uColor: { value: new THREE.Color(ring.color) },
      uOpacity: { value: ring.opacity },
    },
    vertexShader:
      "varying vec3 vLocal; varying vec3 vWorld; varying vec3 vNormalW;\n" +
      "void main(){ vLocal = position; vec4 wp = modelMatrix * vec4(position,1.0); vWorld = wp.xyz;\n" +
      " vNormalW = normalize(mat3(modelMatrix) * normal);\n" +
      " gl_Position = projectionMatrix * viewMatrix * wp; }",
    fragmentShader:
      "uniform float uInner; uniform float uOuter; uniform float uPlanet; uniform float uGapA; uniform float uGapB;\n" +
      "uniform vec3 uColor; uniform float uOpacity;\n" +
      "varying vec3 vLocal; varying vec3 vWorld; varying vec3 vNormalW;\n" +
      "float hash21(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }\n" +
      "void main(){\n" +
      " float r = length(vLocal.xy); float t = (r - uInner) / max(0.001, uOuter - uInner);\n" +
      " float bands = 0.62 + 0.38 * sin(t * 46.0) * (0.72 + 0.28 * hash21(floor(vLocal.xy * 6.0)));\n" +
      " float gap = smoothstep(0.012, 0.03, abs(t - uGapA)) * smoothstep(0.012, 0.03, abs(t - uGapB));\n" +
      // Shadow cylinder: project this fragment onto the planet-sun axis.
      " vec3 toSun = normalize(-vWorld);\n" +
      " float along = dot(vWorld, toSun);\n" +
      " float perp = length(vWorld - toSun * along);\n" +
      " float shadow = along < 0.0 ? smoothstep(uPlanet * 1.06, uPlanet * 0.92, perp) : 1.0;\n" +
      " float edge = smoothstep(0.0, 0.05, t) * smoothstep(1.0, 0.94, t);\n" +
      " vec3 c = uColor * (0.35 + 0.9 * bands) * (0.14 + 0.86 * shadow);\n" +
      " gl_FragColor = vec4(c, edge * gap * bands * uOpacity * 0.72 * (0.35 + 0.65 * shadow));\n" +
      "}",
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = Math.PI / 2;
  return { mesh, mat };
}

export interface BuiltPlanet {
  holder: THREE.Object3D;
  spin: THREE.Mesh;
  spec: PlanetSpec;
  night: THREE.Mesh;
  clouds: THREE.Mesh | null;
  moons: { pivot: THREE.Object3D; holder: THREE.Object3D; spec: MoonSpec; speed: number }[];
}

export interface BuiltSystem {
  group: THREE.Group;
  star: THREE.Group;
  planets: BuiltPlanet[];
  belts: THREE.InstancedMesh[];
  comets: { group: THREE.Object3D; spec: CometSpec; pivot: THREE.Object3D; tail: THREE.Mesh }[];
  update: (dt: number, elapsed: number, mastery?: number) => void;
  setMastery: (value: number) => void;
}

function buildMoon(spec: MoonSpec): THREE.Mesh {
  const mat = new THREE.MeshStandardMaterial({
    map: textureFor(spec.texture),
    roughness: 0.9,
    metalness: 0.04,
  });
  const mesh = new THREE.Mesh(SPHERE_LO, mat);
  mesh.scale.setScalar(spec.radius);
  return mesh;
}

export interface BuildOptions {
  /** Star surface radius in scene units. */
  starRadius?: number;
  /** Root scale for the whole system, so the same spec can be a preview or a full system. */
  scale?: number;
  /** Live mastery override (Test Lab slider). */
  mastery?: number;
}

/** Build a complete system from its spec: star, worlds, rings, moons, belts, comets. */
export function buildSystem(spec: SystemSpec, options: BuildOptions = {}): BuiltSystem {
  const group = new THREE.Group();
  const starRadius = options.starRadius ?? 42;
  const rootScale = options.scale ?? 1;
  group.scale.setScalar(rootScale);

  const star = buildStar(spec.star, starRadius);
  group.add(star);

  // Binary and trinary companions share the star's plasma shader and orbit the barycentre.
  const companions: { group: THREE.Group; radius: number; phase: number; separation: number }[] = [];
  spec.star.companions.forEach((c, i) => {
    const companion = buildStar({ ...spec.star, ...c }, starRadius * 0.62);
    companion.position.x = 260 + i * 130;
    group.add(companion);
    companions.push({ group: companion, radius: 260 + i * 130, phase: i * 2.1, separation: 1 });
  });

  const planets: BuiltPlanet[] = [];
  for (const planet of spec.planets) {
    const pivot = new THREE.Object3D();
    pivot.rotation.x = planet.inclination;
    const holder = new THREE.Object3D();
    holder.position.x = planet.orbit;
    pivot.add(holder);

    const spinPivot = new THREE.Object3D();
    spinPivot.rotation.z = planet.axialTilt;
    holder.add(spinPivot);
    const mat = new THREE.MeshStandardMaterial({
      map: textureFor(planet.biome.texture),
      color: planet.biome.tint,
      roughness: planet.biome.roughness,
      metalness: planet.biome.metalness,
    });
    const surface = new THREE.Mesh(SPHERE, mat);
    surface.scale.setScalar(planet.radius);
    spinPivot.add(surface);
    spinPivot.add(rimShell(planet.radius, planet.biome.atmosphere));

    let clouds: THREE.Mesh | null = null;
    if (planet.biome.clouds > 0.05) {
      const cloudMat = new THREE.MeshStandardMaterial({
        color: 0xe8f2ff,
        transparent: true,
        opacity: planet.biome.clouds * 0.42,
        roughness: 1,
        depthWrite: false,
      });
      clouds = new THREE.Mesh(SPHERE_LO, cloudMat);
      clouds.scale.setScalar(planet.radius * 1.012);
      spinPivot.add(clouds);
    }

    const night = nightCities(planet.radius);
    night.visible = planet.nightLights;
    (night.material as THREE.ShaderMaterial).uniforms.uLevel!.value = 0;
    spinPivot.add(night);

    if (planet.ring) {
      const { mesh } = buildRing(planet.ring, planet.radius);
      spinPivot.add(mesh);
    }

    const moons: BuiltPlanet["moons"] = [];
    for (const moon of planet.moons) {
      const mPivot = new THREE.Object3D();
      mPivot.rotation.x = moon.inclination;
      const mHolder = new THREE.Object3D();
      mHolder.position.x = moon.orbit;
      mHolder.add(buildMoon(moon));
      mPivot.add(mHolder);
      holder.add(mPivot);
      moons.push({ pivot: mPivot, holder: mHolder, spec: moon, speed: 0.5 + 0.6 / Math.max(0.1, moon.orbit / 8) });
    }
    // `pivot` owns the orbit around the star; `holder` keeps the planet's own local frame.
    group.add(pivot);
    planets.push({ holder, spin: surface, spec: planet, night, clouds, moons });
  }

  // Instanced belts: one draw call per belt, tumbling rocks updated by matrix.
  const belts: THREE.InstancedMesh[] = [];
  for (const belt of spec.asteroidBelts) {
    const rockGeo = new THREE.IcosahedronGeometry(1, 0);
    const rockMat = new THREE.MeshStandardMaterial({ color: belt.color, roughness: 0.95, metalness: 0.05, flatShading: true });
    const mesh = new THREE.InstancedMesh(rockGeo, rockMat, belt.count);
    const rng = mulberry32(spec.seed ^ (belt.radius * 1000));
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    for (let i = 0; i < belt.count; i += 1) {
      const a = rng() * Math.PI * 2;
      const r = belt.radius + (rng() - 0.5) * belt.width;
      const y = (rng() - 0.5) * belt.width * 0.12;
      q.setFromEuler(e.set(rng() * 6.28, rng() * 6.28, rng() * 6.28));
      m.compose(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r), q, new THREE.Vector3(0.5 + rng() * 1.4, 0.4 + rng() * 1.1, 0.5 + rng() * 1.3));
      mesh.setMatrixAt(i, m);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.frustumCulled = false;
    group.add(mesh);
    belts.push(mesh);
  }

  const comets: BuiltSystem["comets"] = [];
  for (const comet of spec.comets) {
    const pivot = new THREE.Object3D();
    pivot.rotation.z = comet.inclination;
    const orbital = new THREE.Object3D();
    pivot.add(orbital);
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 10, 8),
      new THREE.MeshBasicMaterial({ color: 0xd9f4ff }),
    );
    orbital.add(head);
    const tailGeo = new THREE.ConeGeometry(1.5, 42, 12, 1, true);
    tailGeo.translate(0, 21, 0);
    const tail = new THREE.Mesh(
      tailGeo,
      new THREE.MeshBasicMaterial({ color: 0x9be8ff, transparent: true, opacity: 0.22 * comet.activity, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
    );
    orbital.add(tail);
    group.add(pivot);
    comets.push({ group: head, spec: comet, pivot, tail });
  }

  let masteryValue = options.mastery ?? Math.max(spec.mastery, ...spec.planets.map((p) => p.mastery));
  let clock = 0;

  const update = (dt: number, elapsed: number, masteryOverride?: number): void => {
    clock += dt;
    const masteryNow = masteryOverride ?? masteryValue;
    star.userData.starMaterial.uniforms.uTime.value = elapsed;
    for (const c of companions) {
      c.group.position.set(Math.cos(elapsed * 0.12 + c.phase) * c.radius, 0, Math.sin(elapsed * 0.12 + c.phase) * c.radius);
    }
    for (const p of planets) {
      p.holder.position.set(Math.cos(elapsed * p.spec.spin * 0.35) * p.spec.orbit, 0, Math.sin(elapsed * p.spec.spin * 0.35) * p.spec.orbit);
      p.spin.rotation.y = elapsed * p.spec.spin * 2.4 + p.spec.index;
      if (p.clouds) p.clouds.rotation.y = elapsed * p.spec.spin * 3.1 + p.spec.index;
      const level = Math.min(1, masteryNow * (0.5 + p.spec.mastery * 0.8));
      const nightMat = p.night.material as THREE.ShaderMaterial;
      nightMat.uniforms.uLevel!.value = level;
      nightMat.uniforms.uTime!.value = elapsed;
      for (const moon of p.moons) moon.pivot.rotation.y = clock * moon.speed + moon.spec.orbit;
    }
    for (const belt of belts) belt.rotation.y += dt * 0.03;
    for (const comet of comets) {
      const a = elapsed * 0.06 * (1 / (1 + comet.spec.eccentricity)) + comet.spec.inclination * 5;
      const r = comet.spec.semiMajor * (1 - comet.spec.eccentricity * Math.cos(a));
      comet.group.position.set(Math.cos(a) * r, Math.sin(a * 0.7) * 90, Math.sin(a) * r);
      // Tail flips to keep pointing away from the star at the origin.
      const away = comet.group.position.clone().normalize();
      comet.tail.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), away);
      comet.tail.position.copy(away).multiplyScalar(1.4);
    }
  };

  return {
    group,
    star,
    planets,
    belts,
    comets,
    update,
    setMastery: (value: number) => {
      masteryValue = Math.max(0, Math.min(1, value));
    },
  };
}

/** Convenience: a single preview world, used by the Test Lab biome buttons. */
export function buildShowcasePlanet(style: BiomeStyle, radius: number, mastery: number): BuiltSystem {
  const spec: SystemSpec = {
    seed: 7,
    key: "showcase",
    name: "Showcase",
    star: { spectral: { id: "G", label: "G", mass: [1, 1], radius: [1, 1], temperature: [5_800, 5_800], color: 0xffe9b8, weight: 1, texture: "star-gold-g" }, mass: 1, radius: 1, temperature: 5_800, color: 0xffe9b8, texture: "star-gold-g", multiplicity: "single", companions: [] },
    planets: [
      {
        index: 0,
        name: style.label,
        biome: style,
        radius,
        orbit: 0,
        inclination: 0,
        spin: 0.14,
        axialTilt: 0.3,
        moons: [],
        ring: style.rings ? { inner: radius * 1.6, outer: radius * 2.9, gaps: [0.33, 0.68], color: 0xe8d2b0, opacity: 0.8 } : null,
        mastery,
        tidallyLocked: style.id === "lava",
        nightLights: style.id !== "gas_giant",
      },
    ],
    asteroidBelts: [],
    comets: [],
    station: false,
    fleet: 0,
    pressure: 0,
    mastery,
  };
  const built = buildSystem(spec, { starRadius: 2.4, mastery });
  built.planets[0]!.holder.position.set(0, 0, 0);
  return built;
}

export type { CometSpec, BeltSpec };
export { biomeById } from "./system-synthesizer.ts";
