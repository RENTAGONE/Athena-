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
        start_url: "/",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
      mode: "development",
        globPatterns: ["**/*.{js,css,html,woff2,svg,png,json}"],
        navigateFallback: "/index.html",
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
    }),
  ],
  build: { target: "es2022", sourcemap: false },
});
