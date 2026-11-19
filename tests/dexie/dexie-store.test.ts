// CI-only contract test (UNRUN in the authoring sandbox): the Dexie store must behave like MemoryStore for the rules the importer relies on.
import "fake-indexeddb/auto";
import { test } from "node:test";
import assert from "node:assert/strict";
import { AthenaDb, DexieStore } from "../../src/adapters/store-dexie.ts";
import { AppendOnlyViolation, RevisionConflict, contentHash } from "../../src/domain/store.ts";
import { buildPlan, commitPlan } from "../../src/app/importer.ts";
import { makeDeps, pkg } from "../support/fixtures.ts";
import { baselinePackage, newSkill } from "../support/baseline.ts";

let n = 0;
async function fresh(): Promise<DexieStore> {
  n += 1;
  const s = new DexieStore(new AthenaDb(`athena-test-${n}`));
  await s.ensureDeviceId();
  return s;
}

test("dexie: baseline import commits and reloads with identical content", async () => {
  const store = await fresh();
  const deps = makeDeps();
  const plan = await buildPlan(await store.load(), baselinePackage(), deps);
  assert.equal(plan.ok, true);
  assert.equal((await commitPlan(store, plan, "approve", deps)).committed, true);
  const a = await store.load();
  assert.ok(Object.keys(a.nodes).length > 0);
  assert.equal(a.meta.revision, 1);
  assert.equal(await contentHash(await store.load()), await contentHash(a));
});

test("dexie: a stale revision is rejected and nothing is written", async () => {
  const store = await fresh();
  const deps = makeDeps();
  const st = await store.load();
  const plan = await buildPlan(st, baselinePackage(), deps);
  await commitPlan(store, plan, "approve", deps);
  const h = await contentHash(await store.load());
  const base = baselinePackage();
  const stale = await buildPlan(st, pkg({ disciplines: base.disciplines, nodes: [...(base.nodes ?? []), newSkill("ATH-SKILL-MATH-TEST-STALE")] }, "pkg-stale"), deps);
  await assert.rejects(() => commitPlan(store, stale, "approve", deps), RevisionConflict);
  assert.equal(await contentHash(await store.load()), h);
});

test("dexie: evidence is append-only and an aborted transaction leaves earlier puts unwritten", async () => {
  const store = await fresh();
  const st = await store.load();
  const ev = { id: "ev-1", target_ids: [], target_codes: [], occurred_at: "2026-11-17T00:00:00Z", evidence_class: "RETRIEVAL", result_summary: "x", outcome_scored: false, target_outcomes: [], rubric_results: [], conditions: {}, independence_attestation: "unknown", evaluator: {}, limitations: [], item_signature: null, is_baseline: false, is_sample: true, provenance: { origin: "learner", at: "x" }, body: {}, created_at: "x" };
  await store.persist({ expectedRevision: 0, puts: [{ table: "evidence", key: "ev-1", record: ev }] });
  const h = await contentHash(await store.load());
  await assert.rejects(() => store.persist({ expectedRevision: 1, puts: [{ table: "receipts", key: "r1", record: { package_id: "r1", package_hash: "h", state: "failed", at: "x", summary: {} } }, { table: "evidence", key: "ev-1", record: { ...ev, result_summary: "tampered" } }] }), AppendOnlyViolation);
  const after = await store.load();
  assert.equal(await contentHash(after), h);
  assert.equal("r1" in after.receipts, false, "the earlier put in the same transaction was rolled back");
  assert.equal(st.meta.revision, 0);
});
