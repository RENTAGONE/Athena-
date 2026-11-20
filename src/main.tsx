import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/space-grotesk/latin-500.css";
import "@fontsource/space-grotesk/latin-700.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/jetbrains-mono/latin-400.css";
import "@fontsource/jetbrains-mono/latin-600.css";
import "./ui/tokens.css";
import "./ui/app.css";
import { App } from "./ui/App.tsx";
import { escapeStaleShell, markUpdateReady, setUpdateAction } from "./ui/update.ts";

declare global {
  interface Window {
    __athenaUpdate?: () => Promise<void>;
  }
}
// A new service worker waits until the learner accepts it (ADR-011). The update banner in App.tsx calls this.
const updateSW = registerSW({
  onNeedRefresh() {
    // Recorded, not just announced: this fires before React mounts, so a listener alone loses it.
    markUpdateReady();
    window.dispatchEvent(new CustomEvent("athena-update-ready"));
  },
});
setUpdateAction(() => updateSW(true));
window.__athenaUpdate = () => updateSW(true);

// A worker controlling the dev server can only be a leftover from an earlier preview or production
// build on this origin, and it would keep answering with that old shell for as long as it lives.
if (import.meta.env.DEV) void escapeStaleShell();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
