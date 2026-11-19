import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "e2e",
  use: { baseURL: "http://localhost:4173", viewport: { width: 360, height: 800 }, hasTouch: true, isMobile: true },
  webServer: { command: "npm run build && npx vite preview --port 4173", url: "http://localhost:4173", reuseExistingServer: !process.env["CI"] },
});
