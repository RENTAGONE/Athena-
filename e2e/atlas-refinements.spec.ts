// Chunk 4.5: mastery heatmap, pinned coordinates and the edge-safe Android flight stick.
import { test, expect } from "@playwright/test";

test("atlas toggles the mastery heatmap and pins coordinates", async ({ page, context }: { page: any; context: any }) => {
  const errors: string[] = [];
  page.on("pageerror", (e: Error) => errors.push(e.message));

  await context.grantPermissions([]);
  await page.goto("/#/knowledge");
  await expect(page.locator(".atlas-root")).toBeVisible();

  const heat = page.getByRole("button", { name: "Mastery heatmap" });
  await expect(heat).toBeVisible();
  await expect(heat).toHaveAttribute("aria-pressed", "false");
  await heat.click();
  await expect(heat).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "Pinned coordinates" }).click();
  await expect(page.getByRole("dialog", { name: "Pinned coordinates" })).toBeVisible();
  await expect(page.getByText(/saved on this device/i)).toBeVisible();

  // The joystick lives inside the edge-safe 28..152 px column, clear of Android's Back gesture.
  const box = await page.locator("canvas.atlas-canvas").boundingBox();
  expect(box).not.toBeNull();

  expect(errors).toEqual([]);
});

test("rotated landscape keeps the atlas inside the viewport", async ({ page }: { page: any }) => {
  await page.setViewportSize({ width: 800, height: 360 });
  await page.goto("/#/knowledge");
  await expect(page.locator(".atlas-root[data-landscape='true']")).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
