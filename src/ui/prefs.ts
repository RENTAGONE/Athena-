// Device-local preferences. These are never written into the knowledge store: they change how the
// app presents itself, not what it knows. Kept small and versioned so a bad value cannot break boot.
import { useEffect, useState } from "react";

export interface Prefs {
  /** Planned length of the derived routine, in minutes. */
  minutesTarget: number;
  motion: boolean;
  boot: boolean;
  /** Let the atlas orbit on its own until the viewer pauses it. */
  atlasOrbit: boolean;
}

const KEY = "athena.prefs.v1";
const DEFAULTS: Prefs = { minutesTarget: 35, motion: true, boot: true, atlasOrbit: true };

function read(): Prefs {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw) as Partial<Prefs>;
    return {
      minutesTarget: typeof parsed.minutesTarget === "number" ? Math.max(10, Math.min(180, parsed.minutesTarget)) : DEFAULTS.minutesTarget,
      motion: parsed.motion !== false,
      boot: parsed.boot !== false,
      atlasOrbit: parsed.atlasOrbit !== false,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

let current: Prefs = typeof window === "undefined" ? { ...DEFAULTS } : read();
const listeners = new Set<() => void>();

function applyMotion(): void {
  if (typeof document === "undefined") return;
  document.documentElement.dataset["motion"] = current.motion ? "on" : "off";
}

export function getPrefs(): Prefs {
  return current;
}

export function setPrefs(patch: Partial<Prefs>): void {
  current = { ...current, ...patch };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(current));
  } catch {
    // Storage can be full or blocked; the in-memory value still applies for this session.
  }
  applyMotion();
  for (const l of listeners) l();
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function usePrefs(): Prefs {
  const [value, setValue] = useState(getPrefs);
  useEffect(() => subscribe(() => setValue(getPrefs())), []);
  return value;
}

if (typeof window !== "undefined") applyMotion();
