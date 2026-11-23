// Engine wiring: the Sim & Visual Test Lab and the Progression Hardlock toggle must drive the
// WebGL scene without touching Dexie, and must stay inside the viewport in both orientations.
import { test, expect } from "@playwright/test";

test.setTimeout(120_000);

const PHENOMENA: [string, string][] = [
  ["Black Hole", "blackhole"],
  ["Quasar", "quasar"],
  ["Wormhole", "wormhole"],
  ["Binary Star", "binary"],
  ["Ringed Gas Giant", "gas_giant"],
  ["Lava World", "lava"],
  ["Pulsar", "pulsar"],
];

test("Test Lab previews phenomena, satellites and station interior", async ({ page }: { page: any }) => {
  const errors: string[] = [];
  page.on("pageerror", (e: Error) => errors.push(e.message));

  await page.goto("/#/knowledge");
  const root = page.locator(".atlas-root");
  await expect(root).toBeVisible();

  await page.getByRole("button", { name: "Sim and Visual Test Lab" }).click();
  await expect(root).toHaveAttribute("data-lab", "open");
  const lab = page.getByRole("dialog", { name: "Sim and Visual Test Lab" });
  await expect(lab).toBeVisible();

  // Mastery override slider: 0% is a dark world, 100% lights the orbital ring.
  const slider = lab.getByRole("slider", { name: /Mastery city lights/ });
  await slider.fill("0");
  await expect(root).toHaveAttribute("data-mastery", "0.00");
  await slider.fill("100");
  await expect(root).toHaveAttribute("data-mastery", "1.00");

  for (const [name, key] of PHENOMENA) {
    await lab.getByRole("button", { name, exact: true }).click();
    await expect(root).toHaveAttribute("data-lab-preview", key);
    // The 700 ms camera glide runs; give the scene time to build and animate.
    await page.waitForTimeout(250);
  }

  await lab.getByRole("button", { name: "Next satellite" }).click();
  await expect(root).toHaveAttribute("data-satellite", "1");
  await expect(root).toHaveAttribute("data-lab-preview", "satellite");

  await lab.getByRole("button", { name: "Station Interior", exact: true }).click();
  await expect(root).toHaveAttribute("data-lab-preview", "station");

  // Reset returns the scene to live Dexie without a single write.
  await lab.getByRole("button", { name: "Reset to live Dexie" }).click();
  await expect(root).toHaveAttribute("data-mastery", "live");
  await expect(root).toHaveAttribute("data-lab-preview", "");

  expect(errors).toEqual([]);
});

test("Progression hardlock toggles between locked and explorer", async ({ page }: { page: any }) => {
  const errors: string[] = [];
  page.on("pageerror", (e: Error) => errors.push(e.message));

  await page.goto("/#/knowledge");
  const root = page.locator(".atlas-root");
  await expect(root).toHaveAttribute("data-progression", "explorer");

  await page.getByRole("button", { name: "Progression explorer" }).click();
  await expect(root).toHaveAttribute("data-progression", "locked");
  await expect(page.getByRole("button", { name: "Progression locked" })).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "Progression locked" }).click();
  await expect(root).toHaveAttribute("data-progression", "explorer");
  expect(errors).toEqual([]);
});

test("Test Lab fits portrait and rotated landscape without overflow", async ({ page }: { page: any }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/#/knowledge");
  await page.getByRole("button", { name: "Sim and Visual Test Lab" }).click();
  await expect(page.locator(".test-lab")).toBeVisible();
  const portrait = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    innerW: window.innerWidth,
    box: document.querySelector(".test-lab")!.getBoundingClientRect().toJSON(),
  }));
  expect(portrait.scrollW).toBeLessThanOrEqual(portrait.innerW);
  expect(portrait.box.left).toBeGreaterThanOrEqual(0);
  expect(portrait.box.right).toBeLessThanOrEqual(portrait.innerW + 1);
  await page.screenshot({ path: "test-results/lab-portrait.png" });

  await page.setViewportSize({ width: 800, height: 360 });
  await page.waitForTimeout(300);
  const landscape = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    innerW: window.innerWidth,
    box: document.querySelector(".test-lab")!.getBoundingClientRect().toJSON(),
    cockpit: document.documentElement.classList.contains("athena-cockpit"),
  }));
  expect(landscape.cockpit).toBe(true);
  expect(landscape.scrollW).toBeLessThanOrEqual(landscape.innerW);
  expect(landscape.box.right).toBeLessThanOrEqual(landscape.innerW + 1);
  expect(landscape.box.top).toBeGreaterThanOrEqual(0);
  await page.screenshot({ path: "test-results/lab-landscape.png" });
});
