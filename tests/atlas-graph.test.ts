// Wave 2 atlas rules. These are pure functions over stored counts, so the fixtures are the whole
// world: no canvas, no clock, no browser. Each assertion is a promise the atlas makes to the learner.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  GALAXY_CLUSTERS,
  WARP_MS,
  biomeFor,
  cityLightCount,
  clusterByKey,
  isHyperspaceJump,
  masteryRing,
  stageGrowth,
  systemPhenomenon,
  v3,
} from "../src/app/atlas-graph.ts";

test("biomes are deterministic and every registered world is reachable", () => {
  const seen = new Set<string>();
  for (let seed = 0; seed < 600; seed += 1) {
    const biome = biomeFor(seed);
    assert.equal(biomeFor(seed), biome, "the same record always has the same world");
    seen.add(biome);
  }
  assert.deepEqual([...seen].sort(), ["barren", "desert", "ice", "ocean", "verdant", "volcanic"]);
});

test("stage growth starts at the base size, grows with evidence and never exceeds the 55% cap", () => {
  assert.equal(stageGrowth(0), 1, "no evidence means no growth, never a shrink");
  assert.equal(stageGrowth(-4), 1, "a malformed count cannot shrink a body");
  let previous = stageGrowth(1);
  for (const n of [2, 3, 5, 8, 13, 21, 40, 200]) {
    const g = stageGrowth(n);
    assert.ok(g >= previous, `growth is monotonic at ${n}`);
    assert.ok(g <= 1.55 + 1e-9, `growth stays capped at ${n}`);
    previous = g;
  }
  assert.ok(stageGrowth(1_000_000) <= 1.55);
});

test("city lights count one settlement per evidence and stop at the body budget", () => {
  assert.equal(cityLightCount(0), 0);
  assert.equal(cityLightCount(-2), 0);
  assert.ok(cityLightCount(3) > cityLightCount(1));
  assert.equal(cityLightCount(10_000), 56);
});

test("phenomena appear only from stored counts, never from a page view", () => {
  // A small system is a normal star, whatever its evidence.
  assert.equal(systemPhenomenon({ total: 11, evidenced: 0, mastered: 0 }), null);
  // A large, entirely unmapped mass is a black hole.
  assert.deepEqual(systemPhenomenon({ total: 12, evidenced: 0, mastered: 0 }), { kind: "black_hole", intensity: 1 });
  // Concentrated, demonstrated mastery is a quasar.
  assert.deepEqual(systemPhenomenon({ total: 12, evidenced: 3, mastered: 3 }), { kind: "quasar", intensity: 0.5 });
  // Evidence without mastery reads as a normal star.
  assert.equal(systemPhenomenon({ total: 40, evidenced: 10, mastered: 0 }), null);
  // A thin scatter of evidence over a large body is still mostly unmapped: a dim black hole.
  const sparse = systemPhenomenon({ total: 100, evidenced: 5, mastered: 0 });
  assert.equal(sparse?.kind, "black_hole");
  assert.ok(sparse!.intensity > 0 && sparse!.intensity < 0.2);
  // Mastery without a quarter of the system evidenced does not fire a quasar, and evidence above the
  // sparse floor keeps it a normal star.
  assert.equal(systemPhenomenon({ total: 40, evidenced: 8, mastered: 3 }), null);
});

test("a jump is a warp only across the real 2,600-unit threshold", () => {
  assert.equal(isHyperspaceJump(v3(0, 0, 0), v3(2600, 0, 0)), false, "the threshold itself is not a warp");
  assert.equal(isHyperspaceJump(v3(0, 0, 0), v3(2600.5, 0, 0)), true);
  assert.equal(isHyperspaceJump(v3(0, 0, 0), v3(0, -1800, 0)), false, "an in-system hop is not a warp");
  assert.ok(WARP_MS > 0 && WARP_MS <= 1000);
});

test("the three galaxies have unique keys and a stable lookup", () => {
  assert.deepEqual(GALAXY_CLUSTERS.map((c) => c.key), ["core", "frontier", "vault"]);
  assert.equal(new Set(GALAXY_CLUSTERS.map((c) => c.label)).size, 3);
  for (const c of GALAXY_CLUSTERS) assert.deepEqual(clusterByKey(c.key), c);
  assert.equal(clusterByKey("frontier").key, "frontier");
  assert.equal(clusterByKey("nope" as never).key, "core", "an unknown key falls back to the core, never to nothing");
});

test("mastery rings differ per tier and only mastered fills the core", () => {
  assert.equal(masteryRing("unassessed").arc, 0);
  assert.equal(masteryRing("needs_revision").filled, false);
  assert.equal(masteryRing("demonstrated").filled, false);
  assert.deepEqual(masteryRing("mastered"), { arc: 1, filled: true, color: "#42e6c4" });
});
