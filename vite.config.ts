import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt", // a new version waits until the learner accepts it (ADR-011)
      includeAssets: ["icon.svg"],
      manifest: {
        name: "ATHENA",
        short_name: "ATHENA",
        description: "Private, offline-first capability and knowledge system",
        theme_color: "#070B18",
        background_color: "#070B18",
        display: "standalone",
        orientation: "any",
        categories: ["education", "productivity"],
        start_url: "/",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // Development mode keeps the generated worker readable and skips the minified runtime.
        mode: "development",
        // Do not leave superseded precaches behind: they are what makes an install look stale.
        cleanupOutdatedCaches: true,
        globPatterns: ["**/*.{js,css,html,woff2,svg,png,json}"],
        navigateFallback: "/index.html",
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
    }),
  ],
  define: {
    // Stamped at build time so a running copy can say which build it actually is.
    __BUILD_STAMP__: JSON.stringify(new Date().toISOString().slice(0, 16).replace("T", " ") + "Z"),
  },
  build: { target: "es2022", sourcemap: false },
});
