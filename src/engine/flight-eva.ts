/**
 * ATHENA Starfighter, its interactive 3D cockpit, and the EVA astronaut.
 *
 * The ship is a real object in the atlas scene, not an overlay: it has a low-poly obsidian hull, twin
 * ion trails, a banking flight model and a full interior whose console buttons are meshes that can be
 * raycast. The scene owns the camera; this module owns everything bolted to the ship.
 *
 * All state is transient. Nothing here reads or writes Dexie.
 */
import * as THREE from "three";

export type CockpitAction = "AUTOPILOT" | "BOOST" | "NAV" | "PING" | "LAND" | "EVA" | "VIEW" | "AUDIO";

export interface FlightInput {
  /** -1..1 strafe, from the left thumb stick. */
  x: number;
  /** -1..1 pitch, positive is nose down. */
  y: number;
  /** -1..1 yaw from right-side drag. */
  yaw: number;
  /** 1 / 10 / 100 speed selector. */
  speed: number;
  boost: boolean;
}

export interface AutopilotState {
  active: boolean;
  target: THREE.Vector3 | null;
  /** "align" | "cruise" | "brake" | "orbit" | "arrived" */
  stage: "idle" | "align" | "cruise" | "brake" | "orbit" | "arrived";
  distance: number;
  /** Closing speed in km/s, for the reticle readout. */
  closing: number;
}

const CYAN = 0x35d9ff;
const HULL = 0x10131b;

function labelTexture(text: string, width = 256, height = 64): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const g = canvas.getContext("2d");
  if (g) {
    g.fillStyle = "#06121c";
    g.fillRect(0, 0, width, height);
    g.strokeStyle = "rgba(53,217,255,0.55)";
    g.lineWidth = 3;
    g.strokeRect(1.5, 1.5, width - 3, height - 3);
    g.fillStyle = "#8ff2ff";
    g.font = "600 26px 'IBM Plex Mono', ui-monospace, monospace";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(text, width / 2, height / 2 + 1);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** MFD screen with a live-ish readout, redrawn at a low rate. */
class Mfd {
  readonly mesh: THREE.Mesh;
  private readonly tex: THREE.CanvasTexture;
  private readonly canvas: HTMLCanvasElement;
  private clock = 0;
  private readonly title: string;

  constructor(title: string, width: number, height: number) {
    this.title = title;
    this.canvas = document.createElement("canvas");
    this.canvas.width = 256;
    this.canvas.height = 160;
    this.tex = new THREE.CanvasTexture(this.canvas);
    this.tex.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.MeshBasicMaterial({ map: this.tex, toneMapped: false });
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat);
  }

  draw(rows: string[], dt: number, accent = "#35d9ff"): void {
    this.clock += dt;
    if (this.clock < 0.12) return;
    this.clock = 0;
    const g = this.canvas.getContext("2d");
    if (!g) return;
    const { width, height } = this.canvas;
    g.fillStyle = "#03121c";
    g.fillRect(0, 0, width, height);
    g.strokeStyle = accent;
    g.lineWidth = 4;
    g.strokeRect(2, 2, width - 4, height - 4);
    g.fillStyle = accent;
    g.font = "600 20px 'IBM Plex Mono', ui-monospace, monospace";
    g.textAlign = "left";
    g.fillText(this.title, 12, 26);
    g.strokeStyle = "rgba(53,217,255,0.28)";
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(12, 34);
    g.lineTo(width - 12, 34);
    g.stroke();
    g.font = "500 17px 'IBM Plex Mono', ui-monospace, monospace";
    rows.slice(0, 6).forEach((row, i) => {
      g.fillStyle = i === 0 ? "#e8fbff" : "rgba(143,242,255,0.82)";
      g.fillText(row, 12, 58 + i * 18);
    });
    // A slow sweep line sells the illusion of a live instrument.
    const y = 40 + ((this.clock + performance.now() * 0.03) % (height - 46));
    g.fillStyle = "rgba(53,217,255,0.07)";
    g.fillRect(4, y, width - 8, 3);
    this.tex.needsUpdate = true;
  }
}

export class Starfighter {
  readonly group = new THREE.Group();
  readonly cockpit = new THREE.Group();
  readonly buttons: { mesh: THREE.Mesh; action: CockpitAction; label: string; rest: number }[] = [];
  readonly position = new THREE.Vector3();
  readonly velocity = new THREE.Vector3();
  readonly quaternion = new THREE.Quaternion();

  /* chase camera state (the scene reads these) */
  readonly chaseTarget = new THREE.Vector3();
  speedKmS = 0;
  thrustLevel = 0;
  banking = 0;
  boosted = 0;

  private readonly stick: THREE.Group;
  private readonly throttle: THREE.Mesh;
  private readonly trails: THREE.Mesh[] = [];
  private mfdMain!: Mfd;
  private mfdNav!: Mfd;
  private readonly hull: THREE.Group;
  private readonly buttonMats: THREE.MeshStandardMaterial[] = [];
  private autopilot: AutopilotState = { active: false, target: null, stage: "idle", distance: 0, closing: 0 };
  private orbitRadius = 12;
  private readonly tmp = new THREE.Vector3();
  private readonly tmpQ = new THREE.Quaternion();
  private readonly up = new THREE.Vector3(0, 1, 0);

  constructor() {
    this.hull = this.buildHull();
    this.group.add(this.hull);
    this.cockpit.add(this.buildInterior());
    this.cockpit.visible = false;
    this.group.add(this.cockpit);
    this.stick = this.cockpit.getObjectByName("flight-stick") as THREE.Group;
    this.throttle = this.cockpit.getObjectByName("throttle") as THREE.Mesh;
    this.mfdMain = this.cockpit.userData.mfdMain as Mfd;
    this.mfdNav = this.cockpit.userData.mfdNav as Mfd;
  }

  /* ── geometry ─────────────────────────────────────────────────────────── */

  private buildHull(): THREE.Group {
    const g = new THREE.Group();
    const obsidian = new THREE.MeshStandardMaterial({ color: HULL, roughness: 0.32, metalness: 0.86, flatShading: true });
    const plate = new THREE.MeshStandardMaterial({ color: 0x1b2634, roughness: 0.42, metalness: 0.7, flatShading: true });
    const glow = new THREE.MeshBasicMaterial({ color: CYAN, toneMapped: false });

    // Fuselage: a narrow wedge, nose forward (−Z), ~120 triangles.
    const body = new THREE.Mesh(new THREE.ConeGeometry(0.5, 3.4, 6, 1), obsidian);
    body.rotation.x = -Math.PI / 2;
    body.position.z = -0.4;
    g.add(body);
    const spine = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.3, 2.2), plate);
    spine.position.set(0, 0.22, 0.35);
    g.add(spine);

    // Delta wings with a cyan leading edge.
    for (const side of [-1, 1]) {
      const wing = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.6, 2.5, 3, 1), plate);
      wing.rotation.z = Math.PI / 2;
      wing.rotation.y = side * 0.42;
      wing.scale.set(1, 1, 0.16);
      wing.position.set(side * 0.95, -0.03, 0.55);
      g.add(wing);
      const edge = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 1.9), glow);
      edge.position.set(side * 1.28, 0.03, 0.35);
      edge.rotation.y = side * 0.42;
      g.add(edge);
      // Twin ion nacelles.
      const nacelle = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 1.1, 8), plate);
      nacelle.rotation.x = Math.PI / 2;
      nacelle.position.set(side * 0.52, -0.02, 1.05);
      g.add(nacelle);
      const nozzle = new THREE.Mesh(new THREE.CircleGeometry(0.15, 12), glow);
      nozzle.position.set(side * 0.52, -0.02, 1.62);
      nozzle.rotation.y = Math.PI;
      g.add(nozzle);
      const trail = new THREE.Mesh(
        new THREE.ConeGeometry(0.1, 4.2, 6, 1, true),
        new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.42, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
      );
      trail.rotation.x = -Math.PI / 2;
      trail.position.set(side * 0.52, -0.02, 3.7);
      trail.scale.setScalar(0.001);
      g.add(trail);
      this.trails.push(trail);
    }

    // Canopy: a tinted dome that reads as glass from outside.
    const canopy = new THREE.Mesh(
      new THREE.SphereGeometry(0.34, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0x0d2a38, roughness: 0.08, metalness: 0.35, transparent: true, opacity: 0.78 }),
    );
    canopy.position.set(0, 0.26, -0.42);
    canopy.scale.set(1, 0.7, 1.5);
    g.add(canopy);

    const engineLight = new THREE.PointLight(CYAN, 1.6, 26, 2);
    engineLight.position.set(0, 0, 1.7);
    g.add(engineLight);
    return g;
  }

  private buildInterior(): THREE.Group {
    const g = new THREE.Group();
    const titanium = new THREE.MeshStandardMaterial({ color: 0x232c38, roughness: 0.46, metalness: 0.82, flatShading: true });
    const carbon = new THREE.MeshStandardMaterial({ color: 0x070a0e, roughness: 0.78, metalness: 0.4, flatShading: true });
    // Unlit cyan trim: tone mapping would bleach an emissive strip to white against a bright star.
    const cyanMat = new THREE.MeshBasicMaterial({ color: CYAN, toneMapped: false });

    // Canopy frame struts: angled cyan-lit beams around the pilot's field of view.
    const strut = (x: number, y: number, rot: number): void => {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 1.5), cyanMat);
      bar.position.set(x, y, -0.45);
      bar.rotation.set(0.16, 0, rot);
      g.add(bar);
    };
    strut(-0.62, 0.22, 0.34);
    strut(0.62, 0.22, -0.34);
    // Canopy frame: a dim header rail and two A-pillars. An arch this close to the lens would read
    // as a neon band across the windscreen, so the frame stays graphite with a cyan edge.
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1b232e, roughness: 0.4, metalness: 0.8 });
    const header = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.035, 0.04), frameMat);
    header.position.set(0, 0.36, -1.16);
    g.add(header);
    const headerEdge = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.012, 0.012), cyanMat);
    headerEdge.position.set(0, 0.34, -1.17);
    g.add(headerEdge);
    for (const side of [-1, 1]) {
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.62, 0.05), frameMat);
      pillar.position.set(side * 0.7, 0.05, -1.16);
      pillar.rotation.z = side * 0.22;
      g.add(pillar);
      const pillarEdge = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.6, 0.012), cyanMat);
      pillarEdge.position.set(side * 0.685, 0.05, -1.17);
      pillarEdge.rotation.z = side * 0.22;
      g.add(pillarEdge);
    }

    // Console housing: an angled dashboard below the sightline.
    const dash = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.42, 0.5), titanium);
    dash.position.set(0, -0.44, -0.82);
    dash.rotation.x = -0.38;
    g.add(dash);
    const lip = new THREE.Mesh(new THREE.BoxGeometry(1.34, 0.05, 0.1), new THREE.MeshStandardMaterial({ color: 0x14202b, roughness: 0.4, metalness: 0.8 }));
    lip.position.set(0, -0.24, -1.06);
    const lipEdge = new THREE.Mesh(new THREE.BoxGeometry(1.34, 0.012, 0.012), cyanMat);
    lipEdge.position.set(0, -0.22, -1.07);
    g.add(lipEdge);
    // Edge strips: the console silhouette reads even against a bright star.
    for (const side of [-1, 1]) {
      const strip = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.02, 0.62), cyanMat);
      strip.position.set(side * 0.7, -0.26, -0.86);
      g.add(strip);
    }
    g.add(lip);

    // Two MFD panels.
    this.mfdMain = new Mfd("FLIGHT", 0.58, 0.36);
    this.mfdMain.mesh.position.set(-0.34, -0.2, -1.12);
    this.mfdMain.mesh.rotation.x = -0.38;
    g.add(this.mfdMain.mesh);
    this.mfdNav = new Mfd("TARGET", 0.44, 0.3);
    this.mfdNav.mesh.position.set(0.34, -0.21, -1.12);
    this.mfdNav.mesh.rotation.x = -0.38;
    g.add(this.mfdNav.mesh);
    g.userData.mfdMain = this.mfdMain;
    g.userData.mfdNav = this.mfdNav;

    // Eight physical console buttons, two rows of four, each with a glowing legend.
    const actions: CockpitAction[] = ["AUTOPILOT", "BOOST", "NAV", "PING", "LAND", "EVA", "VIEW", "AUDIO"];
    const legends = ["AUTOPILOT", "BOOST", "NAV-ZOOM", "PING", "LAND/DOCK", "EJECT EVA", "VIEW", "AUDIO"];
    actions.forEach((action, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const mat = new THREE.MeshStandardMaterial({ color: 0x1a2430, roughness: 0.36, metalness: 0.7, emissive: 0x000000 });
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.06, 0.13), mat);
      mesh.position.set(-0.5 + col * 0.33, -0.42 - row * 0.11, -1.0);
      mesh.rotation.x = -0.3;
      mesh.userData.cockpitAction = action;
      g.add(mesh);
      this.buttonMats.push(mat);
      const legend = new THREE.Mesh(
        new THREE.PlaneGeometry(0.19, 0.05),
        new THREE.MeshBasicMaterial({ map: labelTexture(legends[i]!, 192, 56), transparent: true, toneMapped: false }),
      );
      legend.position.set(mesh.position.x, mesh.position.y + 0.036, mesh.position.z + 0.014);
      legend.rotation.x = -1.9;
      g.add(legend);
      this.buttons.push({ mesh, action, label: legends[i]!, rest: mesh.position.y });
    });

    // Flight stick: a sculpted column that tilts with joystick deflection.
    const stick = new THREE.Group();
    stick.name = "flight-stick";
    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.4, 8), carbon);
    column.position.y = 0.2;
    stick.add(column);
    const grip = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 10), titanium);
    grip.position.y = 0.43;
    grip.scale.set(1, 0.8, 1.2);
    stick.add(grip);
    const trigger = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.03, 0.09), cyanMat);
    trigger.position.set(0, 0.47, -0.07);
    stick.add(trigger);
    stick.position.set(0, -0.52, -0.42);
    g.add(stick);

    // Throttle lever on the left rail.
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.06, 0.42), carbon);
    rail.position.set(-0.62, -0.36, -0.5);
    g.add(rail);
    const throttle = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.13), titanium);
    throttle.name = "throttle";
    throttle.position.set(-0.62, -0.29, -0.55);
    g.add(throttle);
    const throttleGlow = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.1), cyanMat);
    throttleGlow.position.set(-0.575, -0.29, -0.55);
    g.add(throttleGlow);

    // Seat, side bolsters and floor, so the pilot is enclosed rather than floating.
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.7, 0.16), carbon);
    seat.position.set(0, -0.36, 0.35);
    seat.rotation.x = 0.18;
    g.add(seat);
    const floor = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.05, 1.6), titanium);
    floor.position.set(0, -0.62, -0.1);
    g.add(floor);

    const rim = new THREE.PointLight(0x7fd8ff, 1.1, 3.4, 2);
    rim.position.set(0, 0.1, -0.6);
    g.add(rim);
    const fill = new THREE.PointLight(0xffa864, 0.5, 3.6, 2);
    fill.position.set(0.5, -0.4, 0.4);
    g.add(fill);
    // A whisper of ambient inside the hull so the console reads even against a bright star.
    g.add(new THREE.HemisphereLight(0x8fd8ff, 0x0a1018, 0.75));
    // A slightly larger cabin gives the console real depth instead of a wall at the lens.
    g.scale.setScalar(1.25);
    return g;
  }

  /* ── flight model ─────────────────────────────────────────────────────── */

  setView(mode: "chase" | "cockpit"): void {
    this.cockpit.visible = mode === "cockpit";
    this.hull.visible = mode === "chase";
  }

  /** Put the ship at a point facing a direction, with zero velocity. */
  spawnAt(position: THREE.Vector3, lookAt: THREE.Vector3 | null): void {
    this.position.copy(position);
    this.velocity.set(0, 0, 0);
    if (lookAt) {
      const m = new THREE.Matrix4().lookAt(position, lookAt, this.up);
      this.quaternion.setFromRotationMatrix(m);
    }
    this.speedKmS = 0;
    this.thrustLevel = 0;
  }

  get autopilotState(): AutopilotState {
    return this.autopilot;
  }

  setAutopilot(target: THREE.Vector3 | null, radius: number): void {
    if (!target) {
      this.autopilot = { active: false, target: null, stage: "idle", distance: 0, closing: 0 };
      return;
    }
    this.autopilot = { active: true, target: target.clone(), stage: "align", distance: target.distanceTo(this.position), closing: 0 };
    this.orbitRadius = Math.max(2.5, radius * 2.4);
  }

  cancelAutopilot(): void {
    this.autopilot = { active: false, target: null, stage: "idle", distance: 0, closing: 0 };
  }

  /**
   * Advance the ship. `camera` is only used to face the chase camera; the scene applies it.
   * Returns the current speed in km/s for the reticle.
   */
  update(dt: number, input: FlightInput, camera?: { position: THREE.Vector3; quaternion: THREE.Quaternion }): number {
    const speedMul = input.speed >= 100 ? 100 : input.speed >= 10 ? 10 : 1;
    const boost = input.boost ? 2.6 : 1;

    if (this.autopilot.active && this.autopilot.target) {
      this.flyAutopilot(dt);
    } else {
      // Manual flight: pitch/yaw from drag, roll bank from strafe. Exponential damping is
      // frame-rate independent, so a 30 Hz phone and a 144 Hz desktop feel identical.
      const k = 1 - Math.exp(-9 * dt);
      const pitchRate = -input.y * 0.95 - input.yaw * 0.05;
      const yawRate = -input.yaw * 0.9;
      this.tmpQ.setFromAxisAngle(new THREE.Vector3(1, 0, 0), pitchRate * dt);
      this.quaternion.multiply(this.tmpQ);
      this.tmpQ.setFromAxisAngle(this.up, yawRate * dt);
      this.quaternion.multiply(this.tmpQ);
      this.banking += ((-input.x * 0.55) - this.banking) * k;
      const forward = this.tmp.set(0, 0, -1).applyQuaternion(this.quaternion);
      const thrust = Math.max(0, -input.y) + Math.abs(input.x) * 0.4;
      const accel = (2.4 + thrust * 26) * speedMul * boost;
      this.velocity.addScaledVector(forward, accel * dt);
      this.velocity.multiplyScalar(Math.exp(-1.35 * dt));
      this.thrustLevel += ((thrust > 0.02 ? Math.min(1, thrust * 0.8 + 0.2) : 0.05) - this.thrustLevel) * k;
    }

    this.boosted += ((input.boost ? 1 : 0) - this.boosted) * (1 - Math.exp(-6 * dt));
    this.position.addScaledVector(this.velocity, dt);
    this.speedKmS = this.velocity.length() * 0.42;

    // The ship mesh lives in world space.
    this.group.position.copy(this.position);
    this.group.quaternion.copy(this.quaternion);
    this.tmpQ.setFromAxisAngle(new THREE.Vector3(0, 0, 1), this.banking);
    this.group.quaternion.multiply(this.tmpQ);

    for (const trail of this.trails) trail.scale.setScalar(0.2 + this.thrustLevel * 1.2 + this.boosted * 0.9);

    // Animate the physical controls with the pilot's actual input.
    if (this.stick) {
      this.stick.rotation.x = input.y * 0.35;
      this.stick.rotation.z = -input.x * 0.3;
    }
    if (this.throttle) this.throttle.position.z = -0.55 + this.thrustLevel * 0.16;

    const ap = this.autopilot;
    this.mfdMain?.draw(
      [
        `VEL  ${this.speedKmS.toFixed(1)} km/s`,
        `THR  ${Math.round(this.thrustLevel * 100)}%`,
        `DRIVE ${input.speed >= 100 ? "100x" : input.speed >= 10 ? "10x" : "1x"}${input.boost ? " · BOOST" : ""}`,
        `AP   ${ap.active ? ap.stage.toUpperCase() : "MANUAL"}`,
      ],
      dt,
    );
    this.mfdNav?.draw(
      ap.target
        ? [`RANGE ${Math.round(ap.distance).toString()} u`, `CLOSE ${ap.closing.toFixed(1)} km/s`, `ORBIT ${Math.round(this.orbitRadius)} u`, ap.stage.toUpperCase()]
        : ["NO LOCK", "TAP A BODY", "TO ACQUIRE", "—"],
      dt,
    );

    for (const button of this.buttons) {
      const mat = this.buttonMats[this.buttons.indexOf(button)];
      if (!mat) continue;
      const pressed = button.mesh.userData.pressed === true;
      button.mesh.position.y += ((pressed ? button.rest - 0.02 : button.rest) - button.mesh.position.y) * (1 - Math.exp(-22 * dt));
      const active = button.action === "AUTOPILOT" ? ap.active : button.action === "BOOST" ? this.boosted > 0.4 : false;
      mat.emissive.setHex(active ? CYAN : 0x000000);
      mat.emissiveIntensity = active ? 0.85 : 0;
    }
    return this.speedKmS;
  }

  /** Press a console button: depresses the mesh, returns the action for the scene to execute. */
  press(action: CockpitAction): void {
    const button = this.buttons.find((b) => b.action === action);
    if (!button) return;
    button.mesh.userData.pressed = true;
    window.setTimeout(() => {
      button.mesh.userData.pressed = false;
    }, 140);
  }

  private flyAutopilot(dt: number): void {
    const target = this.autopilot.target!;
    const toTarget = this.tmp.copy(target).sub(this.position);
    const distance = toTarget.length();
    const dir = toTarget.clone().normalize();
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.quaternion);
    const alignment = forward.dot(dir);
    const stage: AutopilotState["stage"] = alignment < 0.985 ? "align" : distance > this.orbitRadius * 6 ? "cruise" : distance > this.orbitRadius * 1.15 ? "brake" : "orbit";

    if (stage !== "orbit") {
      // Slerp the nose onto the target rather than snapping: a visible banked turn.
      const desired = new THREE.Matrix4().lookAt(this.position, target, this.up);
      const wanted = new THREE.Quaternion().setFromRotationMatrix(desired);
      this.quaternion.slerp(wanted, 1 - Math.exp(-3.4 * dt));
    }

    const maxSpeed = 900;
    const brakeDist = Math.max(8, (this.velocity.length() * this.velocity.length()) / (2 * 220));
    let wanted = 0;
    if (stage === "align") wanted = 0;
    else if (stage === "cruise") wanted = maxSpeed;
    else if (stage === "brake") wanted = Math.max(6, Math.min(maxSpeed, distance * 1.6));
    else wanted = distance > this.orbitRadius ? Math.max(1.6, distance * 0.8) : 0;

    const speed = this.velocity.length();
    if (wanted > speed) this.velocity.addScaledVector(dir, Math.min(wanted - speed, 260 * dt));
    else this.velocity.multiplyScalar(Math.exp(-2.2 * dt));

    // Never overshoot: when the brake distance is reached the ship stops and parks.
    if (stage === "orbit") {
      const tangent = new THREE.Vector3().crossVectors(dir, this.up).normalize();
      const park = target.clone().addScaledVector(dir, -this.orbitRadius);
      this.position.lerp(park, 1 - Math.exp(-2.2 * dt));
      this.velocity.copy(tangent).multiplyScalar(Math.min(9, this.orbitRadius * 0.55));
      this.position.addScaledVector(this.velocity, dt);
      if (!this.arrived) {
        this.arrived = true;
        this.onArrive?.();
      }
    } else {
      this.arrived = false;
    }

    this.autopilot.distance = distance;
    this.autopilot.closing = Math.max(0, speed - wanted) * 0.42;
    this.autopilot.stage = stage;
    this.thrustLevel += ((wanted > 0.2 ? 0.9 : 0.1) - this.thrustLevel) * (1 - Math.exp(-5 * dt));
    if (this.autopilot.stage === "orbit" && distance <= this.orbitRadius * 1.2 && this.autopilot.active) {
      this.autopilot.stage = "arrived";
    }
  }

  private arrived = false;
  /** Fired once when the autopilot settles into its parking orbit. */
  onArrive: (() => void) | null = null;

  /** Camera pose for each view. The scene applies the returned offset. */
  chaseOffset(out: THREE.Vector3, distance = 9): THREE.Vector3 {
    const back = new THREE.Vector3(0, 0, 1).applyQuaternion(this.quaternion);
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(this.quaternion);
    return out.copy(this.position).addScaledVector(back, distance).addScaledVector(up, distance * 0.26);
  }

  cockpitPose(out: { position: THREE.Vector3; quaternion: THREE.Quaternion }): void {
    out.position.copy(this.position).add(new THREE.Vector3(0, 0.24, 0.72).applyQuaternion(this.quaternion));
    out.quaternion.copy(this.quaternion);
    out.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -0.06));
  }
}

/** The EVA astronaut: mag-boot walking on supplied surfaces, or free zero-G drift. */
export class Eva {
  readonly group = new THREE.Group();
  readonly position = new THREE.Vector3();
  readonly velocity = new THREE.Vector3();
  magBoots = true;
  private readonly lamp: THREE.SpotLight;
  private readonly beam: THREE.Mesh;
  private walkClock = 0;
  private readonly body: THREE.Group;

  constructor() {
    const suit = new THREE.MeshStandardMaterial({ color: 0xd7e3ee, roughness: 0.62, metalness: 0.18 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x1a2230, roughness: 0.5, metalness: 0.7 });
    const visor = new THREE.MeshStandardMaterial({ color: 0x0a2230, roughness: 0.06, metalness: 0.9, emissive: 0x0d3344, emissiveIntensity: 0.5 });
    const cyan = new THREE.MeshBasicMaterial({ color: CYAN, toneMapped: false });
    const body = new THREE.Group();
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.34, 4, 10), suit);
    torso.position.y = 0.1;
    body.add(torso);
    const pack = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.34, 0.16), dark);
    pack.position.set(0, 0.12, 0.19);
    body.add(pack);
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 12), suit);
    helmet.position.y = 0.46;
    body.add(helmet);
    const glass = new THREE.Mesh(new THREE.SphereGeometry(0.115, 14, 12, 0, Math.PI * 2, 0, Math.PI * 0.62), visor);
    glass.position.set(0, 0.47, -0.03);
    glass.rotation.x = -0.35;
    body.add(glass);
    for (const side of [-1, 1]) {
      const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.26, 3, 8), suit);
      arm.position.set(side * 0.22, 0.12, 0);
      arm.rotation.z = side * 0.18;
      body.add(arm);
      const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.3, 3, 8), suit);
      leg.name = side < 0 ? "leg-l" : "leg-r";
      leg.position.set(side * 0.09, -0.24, 0);
      body.add(leg);
      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.08, 0.2), dark);
      boot.position.set(side * 0.09, -0.42, -0.03);
      body.add(boot);
      const status = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.06, 0.02), cyan);
      status.position.set(side * 0.18, 0.3, -0.12);
      body.add(status);
    }
    this.lamp = new THREE.SpotLight(0xd8f4ff, 2.6, 40, 0.42, 0.5, 1.2);
    this.lamp.position.set(0, 0.46, 0);
    this.lamp.target.position.set(0, -0.5, -6);
    body.add(this.lamp, this.lamp.target);
    const beam = new THREE.Mesh(
      new THREE.ConeGeometry(1.5, 8, 12, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xcdefff, transparent: true, opacity: 0.06, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
    );
    beam.rotation.x = -Math.PI / 2;
    beam.position.set(0, 0.46, -4);
    body.add(beam);
    this.beam = beam;
    this.body = body;
    this.group.add(body);
  }

  spawnAt(position: THREE.Vector3): void {
    this.position.copy(position);
    this.velocity.set(0, 0, 0);
    this.group.position.copy(position);
  }

  /**
   * @param move  -1..1 forward, strafe
   * @param jump  request a hop (mag-boots) or an upward puff (zero-G)
   * @param surfaces meshes that count as walkable
   */
  update(
    dt: number,
    move: { forward: number; strafe: number; jump: boolean },
    surfaces: THREE.Object3D[],
    camera?: THREE.PerspectiveCamera,
  ): { grounded: boolean; ground: string | null } {
    const forward = new THREE.Vector3(0, 0, -1);
    if (camera) forward.applyQuaternion(camera.quaternion).setY(0).normalize();
    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
    const speed = this.magBoots ? 2.2 : 3.4;
    const wish = new THREE.Vector3().addScaledVector(forward, move.forward).addScaledVector(right, move.strafe);
    if (wish.lengthSq() > 1) wish.normalize();

    let ground: string | null = null;
    let grounded = false;
    if (this.magBoots && surfaces.length > 0) {
      // Downward probe against the supplied catwalks, hangar plates and terrain.
      const ray = new THREE.Raycaster(this.position.clone().add(new THREE.Vector3(0, 1.2, 0)), new THREE.Vector3(0, -1, 0), 0, 6);
      const hits = ray.intersectObjects(surfaces, true);
      const hit = hits.find((h) => h.distance > 0.05);
      if (hit) {
        ground = (hit.object.userData.surface as string | undefined) ?? hit.object.name ?? "hull";
        const targetY = hit.point.y + 0.9;
        if (this.position.y <= targetY + 0.05) {
          grounded = true;
          this.position.y += (targetY - this.position.y) * (1 - Math.exp(-18 * dt));
          this.velocity.y = 0;
        }
      }
    }

    if (this.magBoots) {
      this.velocity.x += (wish.x * speed - this.velocity.x) * (1 - Math.exp(-10 * dt));
      this.velocity.z += (wish.z * speed - this.velocity.z) * (1 - Math.exp(-10 * dt));
      this.velocity.y -= 6.5 * dt;
      if (move.jump && grounded) this.velocity.y = 3.2;
    } else {
      // Zero-G: jetpack impulses, gentle drift, no gravity.
      this.velocity.addScaledVector(wish, 5.5 * dt);
      if (move.jump) this.velocity.y += 3.4 * dt;
      this.velocity.multiplyScalar(Math.exp(-0.55 * dt));
    }
    this.position.addScaledVector(this.velocity, dt);
    this.group.position.copy(this.position);

    // Walk cycle: legs alternate only while actually moving on a surface.
    const moving = Math.hypot(this.velocity.x, this.velocity.z) > 0.15 && grounded;
    this.walkClock += dt * (moving ? 7 : 0);
    const swing = Math.sin(this.walkClock) * (moving ? 0.5 : 0);
    const legL = this.body.getObjectByName("leg-l");
    const legR = this.body.getObjectByName("leg-r");
    if (legL) legL.rotation.x = swing;
    if (legR) legR.rotation.x = -swing;
    // Face the direction of travel.
    if (moving) this.group.rotation.y += (Math.atan2(this.velocity.x, this.velocity.z) - this.group.rotation.y) * (1 - Math.exp(-8 * dt));
    this.beam.visible = !this.magBoots || grounded;
    return { grounded, ground };
  }

  dispose(): void {
    this.group.traverse((object) => {
      const mesh = object as THREE.Mesh;
      mesh.geometry?.dispose();
    });
  }
}
