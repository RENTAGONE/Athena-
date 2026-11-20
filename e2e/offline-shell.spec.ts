// UNRUN in the authoring sandbox. Verifies AT-OFF-01 (shell opens offline after one online load) and AT-MOB-01 (no horizontal scroll at 360 px).
import { test, expect } from "@playwright/test";

test("shell loads, installs its service worker, and reopens offline", async ({ page, context }: { page: any; context: any }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /today/i })).toBeVisible();
  await page.evaluate(async () => {
    const reg = await navigator.serviceWorker.ready;
    return reg.active?.state;
  });
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading", { name: /today/i })).toBeVisible();
});

test("no horizontal scroll at 360 px on each route", async ({ page }: { page: any }) => {
  for (const route of ["#/today", "#/inbox", "#/knowledge", "#/learn/ATH-DOM-ENG-PROG", "#/studio/updates", "#/studio/backup", "#/studio/architect", "#/settings"]) {
    await page.goto("/" + route);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, route).toBeLessThanOrEqual(0);
  }
});

test("no third-party requests", async ({ page }: { page: any }) => {
  const external: string[] = [];
  page.on("request", (r: any) => {
    if (!r.url().startsWith("http://localhost")) external.push(r.url());
  });
  await page.goto("/");
  await page.goto("/#/knowledge");
  expect(external).toEqual([]);
});
