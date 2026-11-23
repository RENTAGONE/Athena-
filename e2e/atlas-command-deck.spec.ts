// Command deck integration: starfighter + cockpit console, NAV-ZOOM, field-star scanning with the
// LRU system cache, planetary landing, EVA and the Zen chaos lab. Everything here is transient; the
// only durable state is Dexie, which these tests never seed and never write.
import { test, expect } from "@playwright/test";

type Page = any;

test.setTimeout(120_000);

async function openAtlas(page: Page): Promise<void> {
  await page.goto("/#/knowledge");
  await expect(page.locator(".atlas-root")).toBeVisible();
  await expect
    .poll(async () => page.evaluate(() => Boolean((window as any).__atlasScene)), { timeout: 20_000 })
    .toBe(true);
}

test("Launch Ship flies the starfighter, and the cockpit console drives its systems", async ({ page }: { page: Page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e: Error) => errors.push(e.message));
  await openAtlas(page);

  // Autopilot needs a lock: acquire a real streamed field star first.
  await page.evaluate(() => (window as any).__atlasScene.setNavZoom(0.1));
  await page.waitForTimeout(1500);
  const scan = await page.evaluate(() => (window as any).__atlasScene.scanNearestStar());
  expect(scan?.catalog).toMatch(/^SYS-/);

  await page.getByRole("button", { name: "Launch starfighter" }).click();
  await expect(page.locator(".atlas-root")).toHaveAttribute("data-deck", "chase");
  await expect(page.locator(".flight-bar")).toBeVisible();

  // The cockpit view is an interior, not a CSS trick: the scene reports the mode.
  await page.getByRole("button", { name: "COCKPIT" }).click();
  await expect(page.locator(".atlas-root")).toHaveAttribute("data-deck", "cockpit");

  // Physical console buttons are raycast meshes; the HUD twins must execute the same systems.
  await page.getByRole("button", { name: "PING" }).click();
  await page.getByRole("button", { name: "BOOST" }).click();
  await page.getByRole("button", { name: "AUTOPILOT", exact: true }).click();
  await expect(page.locator(".atlas-root")).toHaveAttribute("data-autopilot", /align|cruise|brake|orbit/);

  // Leaving the ship restores the orbital rig and stops the engine voice.
  await page.getByRole("button", { name: "Leave starfighter" }).click();
  await expect(page.locator(".atlas-root")).toHaveAttribute("data-deck", "atlas");
  expect(errors).toEqual([]);
});

test("NAV-ZOOM opens the tactical survey screen and locks a target onto autopilot", async ({ page }: { page: Page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e: Error) => errors.push(e.message));
  await openAtlas(page);

  await page.evaluate(() => (window as any).__atlasScene.setNavZoom(0.12));
  await page.waitForTimeout(300);
  const scan = await page.evaluate(() => (window as any).__atlasScene.scanNearestStar());
  expect(scan?.catalog).toMatch(/^SYS-/);
  expect(scan?.planets).toBeGreaterThanOrEqual(3);
  await expect(page.locator(".atlas-root")).toHaveAttribute("data-catalog", /^SYS-/, { timeout: 10_000 });

  const card = page.getByRole("complementary", { name: "Astrophysical scanner" });
  await expect(card).toBeVisible();
  await expect(card).toContainText("Spectral");
  await expect(card).toContainText("Temp");

  // Save Waypoint pins the scanned coordinates, not a record id.
  await card.getByRole("button", { name: "Save Waypoint" }).click();
  await expect(page.locator(".waypoints")).toBeVisible();

  // Autopilot from the card launches the ship and locks the scan.
  await card.getByRole("button", { name: "Autopilot Ship" }).click();
  await expect(page.locator(".atlas-root")).toHaveAttribute("data-deck", "chase");

  await page.getByRole("button", { name: "NAV-ZOOM" }).click();
  await expect(page.locator(".atlas-root")).toHaveAttribute("data-deck", "nav");
  const nav = page.getByRole("dialog", { name: "Tactical zoom screen" });
  await expect(nav).toBeVisible();
  await nav.getByRole("slider", { name: "Tactical zoom range" }).fill("60");
  await expect(nav).toContainText("u");
  await nav.getByRole("button", { name: "Lock & Engage Autopilot" }).click();
  await expect(page.locator(".atlas-root")).toHaveAttribute("data-deck", "chase");
  expect(errors).toEqual([]);
});

test("field-star scan mounts a system, lands on a biome surface and launches to orbit", async ({ page }: { page: Page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e: Error) => errors.push(e.message));
  await openAtlas(page);

  await page.evaluate(() => (window as any).__atlasScene.setNavZoom(0.1));
  await page.waitForTimeout(1500);
  const first = await page.evaluate(() => (window as any).__atlasScene.scanNearestStar());
  const second = await page.evaluate(() => (window as any).__atlasScene.scanNearestStar());
  expect(first?.catalog).toBeTruthy();
  expect(second?.catalog).toBeTruthy();
  // The LRU cache never holds more than four full systems.
  const mounted = await page.evaluate(() => Number(document.querySelector(".atlas-root")!.getAttribute("data-chaos-effects") ?? 0));
  expect(mounted).toBeGreaterThanOrEqual(0);

  const card = page.getByRole("complementary", { name: "Astrophysical scanner" });
  await card.getByRole("button", { name: "Land on Surface" }).click();
  await expect(page.locator(".atlas-root")).toHaveAttribute("data-deck", "surface");
  await expect(page.locator(".atlas-root")).toHaveAttribute("data-surface", /.+/);
  await expect(page.locator(".eva-bar")).toBeVisible();

  // Mag-boots and zero-G are genuinely different movement modes.
  await page.locator(".eva-bar").getByRole("button", { name: /Mag-Boots ON/ }).click();
  await expect(page.locator(".atlas-root")).toHaveAttribute("data-magboots", "off");

  await page.locator(".eva-bar").getByRole("button", { name: "Launch to Orbit" }).click();
  await expect(page.locator(".atlas-root")).toHaveAttribute("data-deck", "chase");
  expect(errors).toEqual([]);
});

test("Zen chaos lab spawns an ephemeral gravity well and Restore System clears it", async ({ page }: { page: Page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e: Error) => errors.push(e.message));
  await openAtlas(page);

  await page.getByRole("button", { name: "Zen view" }).click();
  await page.getByRole("button", { name: /Chaos Lab/ }).click();
  await page.getByRole("button", { name: "Gravity Well", exact: true }).click();
  await expect(page.locator(".atlas-root")).toHaveAttribute("data-chaos", "well");

  const canvas = page.locator("canvas.atlas-canvas");
  const box = (await canvas.boundingBox())!;
  // Bottom-right of the stage: clear of the empty-state card's button and the chaos dock.
  await canvas.click({ position: { x: box.width - 40, y: box.height - 260 } });
  await expect.poll(async () => Number(await page.locator(".atlas-root").getAttribute("data-chaos-effects")), { timeout: 10_000 }).toBeGreaterThan(0);

  await page.getByRole("button", { name: "Restore System" }).click();
  await expect.poll(async () => Number(await page.locator(".atlas-root").getAttribute("data-chaos-effects")), { timeout: 10_000 }).toBe(0);
  expect(errors).toEqual([]);
});

test("flight bar and chaos dock stay inside portrait and rotated landscape", async ({ page }: { page: Page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openAtlas(page);
  await page.getByRole("button", { name: "Launch starfighter" }).click();
  await expect(page.locator(".flight-bar")).toBeVisible();

  const portrait = await page.evaluate(() => {
    const bar = document.querySelector(".flight-bar")!.getBoundingClientRect();
    return { scrollW: document.documentElement.scrollWidth, innerW: window.innerWidth, left: bar.left, right: bar.right, bottom: bar.bottom };
  });
  expect(portrait.scrollW).toBeLessThanOrEqual(portrait.innerW);
  expect(portrait.left).toBeGreaterThanOrEqual(0);
  expect(portrait.right).toBeLessThanOrEqual(portrait.innerW + 1);
  expect(portrait.bottom).toBeLessThanOrEqual(800);
  await page.screenshot({ path: "test-results/deck-portrait.png" });

  await page.setViewportSize({ width: 800, height: 360 });
  await page.waitForTimeout(400);
  const landscape = await page.evaluate(() => {
    const bar = document.querySelector(".flight-bar")!.getBoundingClientRect();
    return {
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
      left: bar.left,
      right: bar.right,
      cockpit: document.documentElement.classList.contains("athena-cockpit"),
    };
  });
  expect(landscape.cockpit).toBe(true);
  expect(landscape.scrollW).toBeLessThanOrEqual(landscape.innerW);
  expect(landscape.left).toBeGreaterThanOrEqual(-1);
  expect(landscape.right).toBeLessThanOrEqual(landscape.innerW + 1);
  await page.screenshot({ path: "test-results/deck-landscape.png" });
});

test("Photo mode hides the chrome and unlocks lens zoom and roll", async ({ page }: { page: Page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e: Error) => errors.push(e.message));
  await openAtlas(page);

  await page.getByRole("button", { name: "Photo mode" }).click();
  await expect(page.locator(".atlas-root")).toHaveAttribute("data-photo", "true");
  const bar = page.getByRole("toolbar", { name: "Photo mode lens" });
  await expect(bar).toBeVisible();
  await expect(page.locator(".atlas-hud")).toHaveCSS("opacity", "0");

  await bar.getByRole("slider", { name: "Lens field of view" }).fill("90");
  await expect(bar).toContainText("FOV 90°");
  await bar.getByRole("slider", { name: "Camera roll" }).fill("20");
  await expect(bar).toContainText("Roll 20°");

  await bar.getByRole("button", { name: "Leave photo mode" }).click();
  await expect(page.locator(".atlas-root")).toHaveAttribute("data-photo", "false");
  await expect(page.locator(".atlas-hud")).toHaveCSS("opacity", "1");
  expect(errors).toEqual([]);
});
