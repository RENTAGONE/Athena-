// Update lifecycle for the offline shell.
//
// A new service worker waits until the learner accepts it (ADR-011), so something has to notice that
// it is waiting. `registerSW` fires `onNeedRefresh` while main.tsx is still evaluating, which is
// before React has mounted and attached any listener — so the readiness is stored here rather than
// broadcast once into an empty room. That race is why a waiting build could sit invisible forever.

export type UpdateStatus = "idle" | "checking" | "ready" | "current" | "unavailable";

let ready = false;
let status: UpdateStatus = "idle";
let action: (() => Promise<void>) | null = null;
const listeners = new Set<() => void>();

function emit(): void {
  for (const l of listeners) l();
}

/** Called once from main.tsx with the registration's own "activate the waiting worker" function. */
export function setUpdateAction(fn: () => Promise<void>): void {
  action = fn;
}

/** Called by `registerSW` the moment a newer build has finished installing. */
export function markUpdateReady(): void {
  if (ready) return;
  ready = true;
  status = "ready";
  emit();
}

export function isUpdateReady(): boolean {
  return ready;
}

export function updateStatus(): UpdateStatus {
  return status;
}

export function subscribeUpdate(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

async function registration(): Promise<ServiceWorkerRegistration | null> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return null;
  try {
    return (await navigator.serviceWorker.getRegistration()) ?? null;
  } catch {
    return null;
  }
}

/**
 * Picks up a build that is already waiting (installed before this page loaded) and keeps watching
 * for one that appears later. Returns a cleanup function.
 */
export async function watchForUpdate(): Promise<() => void> {
  const reg = await registration();
  if (!reg) return () => {};

  // A waiting worker only means "newer build" when an older one is already in control. On the very
  // first install there is no controller yet and the waiting worker is simply this build.
  const sync = (): void => {
    if (reg.waiting && navigator.serviceWorker.controller) markUpdateReady();
  };
  sync();

  const onUpdateFound = (): void => {
    const installing = reg.installing;
    if (!installing) return;
    installing.addEventListener("statechange", () => {
      if (installing.state === "installed") sync();
    });
  };
  reg.addEventListener("updatefound", onUpdateFound);

  // Long-lived tabs otherwise never look again until the next navigation.
  const tick = (): void => {
    if (document.visibilityState !== "visible") return;
    void reg.update().catch(() => undefined);
  };
  const id = window.setInterval(tick, 60_000);
  document.addEventListener("visibilitychange", tick);

  return () => {
    window.clearInterval(id);
    document.removeEventListener("visibilitychange", tick);
    reg.removeEventListener("updatefound", onUpdateFound);
  };
}

/** An explicit check, for the Settings screen: asks the server for a new shell and reports back. */
export async function checkForUpdate(): Promise<UpdateStatus> {
  const reg = await registration();
  if (!reg) {
    status = "unavailable";
    emit();
    return status;
  }
  status = "checking";
  emit();
  try {
    await reg.update();
  } catch {
    // Offline or the server refused; the waiting-worker check below is still worth doing.
  }
  const deadline = Date.now() + 4_000;
  while (Date.now() < deadline) {
    if (reg.waiting && navigator.serviceWorker.controller) {
      markUpdateReady();
      return "ready";
    }
    if (!reg.installing) break;
    await new Promise((r) => window.setTimeout(r, 200));
  }
  if (reg.waiting && navigator.serviceWorker.controller) {
    markUpdateReady();
    return "ready";
  }
  status = "current";
  emit();
  return status;
}

/** Accept the waiting build. Falls back to a plain reload if the registration cannot take it. */
export async function applyUpdate(): Promise<void> {
  if (action) {
    try {
      await action();
      // workbox-window reloads on `controllerchange`; if the worker never takes control, reload anyway.
      window.setTimeout(() => window.location.reload(), 1_500);
      return;
    } catch {
      // Fall through to a plain reload.
    }
  }
  window.location.reload();
}

/** Drop the offline shell entirely. Knowledge and evidence live in IndexedDB, which this leaves alone. */
export async function purgeOfflineShell(): Promise<number> {
  let removed = 0;
  try {
    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const reg of regs) {
        if (await reg.unregister()) removed += 1;
      }
    }
  } catch {
    // Nothing to unregister, or the browser refused; the cache purge below still runs.
  }
  try {
    if (typeof caches !== "undefined") {
      for (const key of await caches.keys()) await caches.delete(key);
    }
  } catch {
    // Cache API unavailable (private mode). The reload still helps.
  }
  return removed;
}

/**
 * Escape a shell that is pinned by a worker from an older build. The old worker answers navigation
 * with its own precached index.html, so the app can never reach a newer page to fix itself — this
 * has to be resolved before anything renders. Guarded so it cannot loop.
 */
export async function escapeStaleShell(): Promise<boolean> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return false;
  if (!navigator.serviceWorker.controller) return false;
  try {
    if (window.sessionStorage.getItem("athena.shell-reset") === "1") return false;
    window.sessionStorage.setItem("athena.shell-reset", "1");
  } catch {
    return false;
  }
  await purgeOfflineShell();
  window.location.reload();
  return true;
}
