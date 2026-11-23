/**
 * Procedural Web Audio sci-fi synthesizer.
 *
 * Nothing is loaded from the network: every sound is generated from oscillators, noise buffers and
 * filters. The context is created lazily on the first user gesture (browsers refuse to start audio
 * otherwise) and suspended when muted, so an idle phone burns no audio thread.
 *
 * Sound groups are deliberately separate voices, not one mixer bus, because each has its own
 * lifetime: a thruster hum runs continuously and is gain-modulated by velocity, while a scanner ping
 * is a one-shot with a scheduled decay.
 */

export type SfxName =
  | "click"
  | "ping"
  | "lock"
  | "warp"
  | "beam"
  | "impact"
  | "supernova"
  | "chime"
  | "button";

type Ctx = AudioContext;

export class SpaceAudio {
  private ctx: Ctx | null = null;
  private master: GainNode | null = null;
  private muted = true;
  private started = false;
  private noise: AudioBuffer | null = null;
  /* Continuous voices, created on demand and reused. */
  private thruster: { osc: OscillatorNode; gain: GainNode; filter: BiquadFilterNode } | null = null;
  private drone: { osc: OscillatorNode; gain: GainNode } | null = null;

  get enabled(): boolean {
    return !this.muted && this.started;
  }

  get isMuted(): boolean {
    return this.muted;
  }

  /** Build the graph. Called from a real pointer/keyboard gesture only. */
  unlock(): void {
    if (this.started) {
      void this.ctx?.resume();
      return;
    }
    const AC: typeof AudioContext | undefined =
      typeof window === "undefined"
        ? undefined
        : window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    try {
      const ctx = new AC();
      this.ctx = ctx;
      const master = ctx.createGain();
      master.gain.value = 0.55;
      master.connect(ctx.destination);
      this.master = master;
      // One second of white noise, reused by every percussive voice.
      const frames = Math.floor(ctx.sampleRate);
      const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let last = 0;
      for (let i = 0; i < frames; i += 1) {
        const white = Math.random() * 2 - 1;
        // A gentle low-pass on the noise floor keeps the booms from hissing.
        last = last * 0.86 + white * 0.14;
        data[i] = last;
      }
      this.noise = buffer;
      this.started = true;
    } catch {
      this.started = false;
    }
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (!muted) this.unlock();
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setTargetAtTime(muted ? 0 : 0.55, now, 0.06);
    if (muted) {
      this.thruster?.gain.gain.setTargetAtTime(0, now, 0.05);
      this.drone?.gain.gain.setTargetAtTime(0, now, 0.2);
    } else {
      void ctx.resume();
    }
  }

  dispose(): void {
    const ctx = this.ctx;
    this.stopThruster();
    this.drone?.osc.stop();
    this.drone = null;
    this.started = false;
    this.ctx = null;
    this.master = null;
    if (ctx && ctx.state !== "closed") void ctx.close();
  }

  /** Velocity-reactive engine hum. `power` is 0..1; the filter opens as thrust builds. */
  engine(power: number): void {
    if (!this.enabled || !this.ctx || !this.master || !this.noise) return;
    const ctx = this.ctx;
    if (!this.thruster) {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = 46;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 240;
      filter.Q.value = 3.2;
      const gain = ctx.createGain();
      gain.gain.value = 0;
      osc.connect(filter).connect(gain).connect(this.master);
      osc.start();
      this.thruster = { osc, gain, filter };
    }
    const now = ctx.currentTime;
    const p = Math.max(0, Math.min(1, power));
    this.thruster.osc.frequency.setTargetAtTime(42 + p * 58, now, 0.08);
    this.thruster.filter.frequency.setTargetAtTime(180 + p * 900, now, 0.1);
    this.thruster.gain.gain.setTargetAtTime(p > 0.01 ? 0.035 + p * 0.075 : 0, now, 0.12);
  }

  stopThruster(): void {
    if (!this.thruster || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.thruster.gain.gain.setTargetAtTime(0, now, 0.08);
    const thruster = this.thruster;
    this.thruster = null;
    window.setTimeout(() => {
      try {
        thruster.osc.stop();
        thruster.osc.disconnect();
      } catch {
        /* already stopped */
      }
    }, 400);
  }

  /** A very quiet two-oscillator pad that gives deep space a floor of sound. */
  ambient(on: boolean): void {
    if (!on || !this.enabled || !this.ctx || !this.master) {
      if (this.drone && this.ctx) this.drone.gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.4);
      return;
    }
    const ctx = this.ctx;
    if (!this.drone) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = 55;
      const gain = ctx.createGain();
      gain.gain.value = 0;
      osc.connect(gain).connect(this.master);
      osc.start();
      this.drone = { osc, gain };
    }
    this.drone.gain.gain.setTargetAtTime(0.02, ctx.currentTime, 1.2);
  }

  play(name: SfxName, intensity = 1): void {
    if (!this.enabled || !this.ctx || !this.master) return;
    const ctx = this.ctx;
    const master = this.master;
    const t = ctx.currentTime;
    const gain = ctx.createGain();
    gain.connect(master);
    const tone = (freq: number, type: OscillatorType, dur: number, peak: number, slideTo?: number): void => {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      if (slideTo !== undefined) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t + dur);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + Math.min(0.03, dur * 0.2));
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    };
    const noiseBurst = (dur: number, peak: number, freq: number, q = 1.1): void => {
      if (!this.noise) return;
      const src = ctx.createBufferSource();
      src.buffer = this.noise;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(freq, t);
      filter.frequency.exponentialRampToValueAtTime(Math.max(40, freq * 0.25), t + dur);
      filter.Q.value = q;
      const env = ctx.createGain();
      env.gain.setValueAtTime(0.0001, t);
      env.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + 0.02);
      env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(filter).connect(env).connect(master);
      src.start(t);
      src.stop(t + dur + 0.02);
    };

    switch (name) {
      case "click":
      case "button":
        tone(name === "button" ? 880 : 1_260, "square", 0.045, 0.06 * intensity, 520);
        break;
      case "ping":
        tone(1_480, "sine", 0.5, 0.07 * intensity, 740);
        window.setTimeout(() => tone(2_180, "sine", 0.28, 0.03 * intensity, 1_100), 120);
        break;
      case "lock":
        tone(760, "square", 0.06, 0.05 * intensity, 1_140);
        window.setTimeout(() => tone(1_520, "square", 0.07, 0.04 * intensity, 1_900), 90);
        break;
      case "warp":
        noiseBurst(0.85, 0.09 * intensity, 2_400, 0.7);
        tone(90, "sawtooth", 0.9, 0.05 * intensity, 760);
        break;
      case "beam":
        noiseBurst(0.24, 0.07 * intensity, 3_600, 2.4);
        tone(1_900, "sawtooth", 0.18, 0.028 * intensity, 320);
        break;
      case "impact":
        noiseBurst(0.55, 0.16 * intensity, 320, 0.9);
        tone(96, "sine", 0.6, 0.12 * intensity, 34);
        break;
      case "supernova":
        noiseBurst(1.4, 0.2 * intensity, 1_800, 0.5);
        tone(180, "sawtooth", 1.6, 0.09 * intensity, 28);
        break;
      case "chime":
        tone(660, "sine", 0.22, 0.05 * intensity);
        window.setTimeout(() => tone(990, "sine", 0.34, 0.045 * intensity), 130);
        break;
      default:
        break;
    }
  }
}

/** One shared engine for the whole app: the Atlas is the only screen that creates it. */
export const spaceAudio = new SpaceAudio();
