import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/space-grotesk/latin-500.css";
import "@fontsource/space-grotesk/latin-700.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "./ui/tokens.css";
import "./ui/app.css";
import { App } from "./ui/App.tsx";

declare global {
  interface Window {
    __athenaUpdate?: () => Promise<void>;
  }
}
// A new service worker waits until the learner accepts it (ADR-011). The update banner in App.tsx calls this.
const updateSW = registerSW({
  onNeedRefresh() {
    window.dispatchEvent(new CustomEvent("athena-update-ready"));
  },
});
window.__athenaUpdate = () => updateSW(true);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
