// Chunk 4.5: seeded-store verification. The heatmap and the rogue tether both read real Dexie
// state, so these tests commit the bundled Pack v1.0 seed before touching the atlas.
import { test, expect } from "@playwright/test";

test.setTimeout(120_000);

async function seed(page: any): Promise<void> {
  await page.goto("/#/studio/updates");
  await page.getByRole("button", { name: /Preview the draft seed/i }).click();
  const approve = page.getByRole("button", { name: /Approve and commit/i });
  await expect(approve).toBeVisible({ timeout: 20_000 });
  await approve.click();
  await expect(page.getByRole("button", { name: /Approve and commit/i })).toHaveCount(0, { timeout: 20_000 });
}

async function readNodes(page: any, filter: "rogue" | "assigned", id?: string): Promise<any[]> {
  return page.evaluate(
    async ({ filter, id }: { filter: string; id?: string }) => {
      const dbs = await indexedDB.databases();
      const name = dbs.find((d: any) => d.name && !/workbox|precache/i.test(d.name))?.name;
      if (!name) return [];
      const db: any = await new Promise((resolve, reject) => {
        const req = indexedDB.open(name);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
      const all: any[] = await new Promise((resolve, reject) => {
        const req = db.transaction("nodes", "readonly").objectStore("nodes").getAll();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
      return all.filter((n) =>
        id ? n.id === id : filter === "rogue" ? !n.owner_discipline_id : Boolean(n.owner_discipline_id),
      );
    },
    { filter, id },
  );
}

test("seeded store colours the heatmap from real Dexie mastery tiers", async ({ page }: { page: any }) => {
  const errors: string[] = [];
  page.on("pageerror", (e: Error) => errors.push(e.message));

  await seed(page);
  await page.goto("/#/knowledge");
  await expect(page.locator(".atlas-root")).toBeVisible();

  const heatmap = page.getByRole("button", { name: "Mastery heatmap" });
  await heatmap.click();
  await expect(page.locator(".atlas-root")).toHaveAttribute("data-heatmap", "true");

  const counts = (await page.locator(".atlas-root").getAttribute("data-heat"))!.split("/").map(Number);
  const [mastered, demonstrated, needsRevision, unassessed] = counts as [number, number, number, number];
  expect(mastered + demonstrated + needsRevision + unassessed).toBeGreaterThanOrEqual(8);

  // data-heat-colors is read back off the scene's actual sprite materials, one entry per star.
  const colors = (await page.locator(".atlas-root").getAttribute("data-heat-colors"))!;
  const entries = colors.split(",").filter(Boolean).map((entry: string) => entry.split(":")[1]);
  expect(entries.length).toBe(mastered + demonstrated + needsRevision + unassessed);
  for (const hex of entries) {
    expect(["42e6c4", "9fe8d8", "ffc66d", "71819f"]).toContain(hex);
  }
  // Each tier that exists in Dexie must paint its own colour in the live scene.
  if (needsRevision > 0) expect(entries).toContain("ffc66d");
  if (unassessed > 0) expect(entries).toContain("71819f");
  if (mastered > 0) expect(entries).toContain("42e6c4");
  expect(errors).toEqual([]);
});

test("Assign Discipline round-trips a rogue star into Dexie", async ({ page }: { page: any }) => {
  const errors: string[] = [];
  page.on("pageerror", (e: Error) => errors.push(e.message));

  await seed(page);
  const rogues = await readNodes(page, "rogue");
  expect(rogues.length, "the seed ships unassigned rogue records").toBeGreaterThan(0);
  const rogue = rogues[0];

  await page.goto("/#/knowledge");
  await expect(page.locator(".atlas-root")).toBeVisible();
  await page.evaluate(
    (id: string) => window.dispatchEvent(new CustomEvent("athena:inspect", { detail: { id } })),
    rogue.id,
  );

  const select = page.locator(".assign-discipline select");
  await expect(select).toBeVisible({ timeout: 15_000 });
  await select.selectOption({ index: 1 });
  await expect(page.locator(".assign-discipline")).toHaveCount(0, { timeout: 20_000 });

  const [persisted] = await readNodes(page, "assigned", rogue.id);
  expect(persisted?.owner_discipline_id).toBeTruthy();
  expect(persisted.owner_discipline_id).not.toBe(rogue.owner_discipline_id ?? null);
  expect(errors).toEqual([]);
});
