// Imports the complete Pack v1.0 seed (canonical v0.9 + the KB working tier) through the real importer into the in-memory store and checks structural invariants.
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildPlan, commitPlan } from "../src/app/importer.ts";
import { contentHash, MemoryStore } from "../src/domain/store.ts";
import { emptyState } from "../src/domain/types.ts";
import { cachesAreConsistent } from "../src/domain/graph.ts";
import { exportArchive, readArchive } from "../src/domain/archive.ts";
import { packToPackages, currentFoundationNodes } from "../src/adapters/formats/pack.ts";
import { makeDeps, packFiles } from "./support/fixtures.ts";

const f = packFiles();
const pack = () => packToPackages(f, "pack-v1.0-seed", "2026-11-19T00:00:00Z");
const arr = (o: any, k: string): any[] => o[k] ?? [];

test("Pack v1.0 seed imports cleanly as DRAFT, with the object counts the fixtures declare", async () => {
  const deps = makeDeps();
  const store = new MemoryStore(emptyState("device-seed"));
  const plan = await buildPlan(await store.load(), pack(), deps);
  assert.equal(plan.ok, true, JSON.stringify(plan.issues.filter((i) => i.severity === "error").slice(0, 3)));
  assert.equal((await commitPlan(store, plan, "approve", deps)).committed, true);
  const st = await store.load();
  const by = (t: string): number => Object.values(st.nodes).filter((n) => n.object_type === t).length;
  assert.equal(by("discipline"), 18);
  assert.equal(by("domain"), 146, "113 canonical + 33 KB working-map domains");
  assert.equal(by("skill_family"), 777, "40 canonical + 737 KB working-map families");
  assert.equal(by("skill"), arr(f.skills, "skills").length);
  assert.equal(by("subskill"), arr(f.subskills, "subskills").length);
  assert.equal(by("micro_skill"), 158, "156 KB candidates + 2 canonical records with no counterpart");
  assert.equal(by("context"), 6);
  assert.equal(by("concept"), currentFoundationNodes(f.foundation).filter((n) => n["object_type"] === "concept").length);
  assert.ok(Object.values(st.nodes).filter((n) => n.object_type !== "discipline").every((n) => n.status === "draft"), "nothing is approved; everything imports as draft");
  assert.ok(cachesAreConsistent(st), "derived caches match CONTAINS edges");
});

test("Pack v1.0 seed: structural invariants hold on real data", async () => {
  const deps = makeDeps();
  const store = new MemoryStore(emptyState("device-seed"));
  await commitPlan(store, await buildPlan(await store.load(), pack(), deps), "approve", deps);
  const st = await store.load();
  const edges = Object.values(st.edges);
  const parents = new Map<string, number>();
  for (const e of edges) if (e.relation_type === "CONTAINS") parents.set(e.target_id, (parents.get(e.target_id) ?? 0) + 1);
  assert.ok([...parents.values()].every((c) => c === 1), "every contained record has exactly one primary parent");
  assert.equal(edges.filter((e) => e.code !== null && !e.code.startsWith("ATH-XFER-")).length, 0, "only transfer links carry permanent edge codes");
  assert.equal(edges.filter((e) => e.code?.startsWith("ATH-XFER-")).length, arr(f.transfers, "transfers").length);
  assert.equal(edges.filter((e) => e.gating === "hard").length, 0, "the seed contains no hard gate");
  assert.ok(edges.every((e) => e.relation_type === "PREREQUISITE_FOR" || e.gating === "none"), "only PREREQUISITE_FOR carries gating");
  const legacy = Object.values(st.nodes).filter((n) => /^ATH-(CON|OBJ)-(SCI|LEARN)-/.test(n.code));
  assert.ok(legacy.length >= 4 && legacy.every((n) => n.owner_discipline_id !== null), "legacy SCI/LEARN records carry explicit owners");
  for (const dom of ["ATH-DOM-ENG-COMPUTE", "ATH-DOM-MATH-PHYS", "ATH-DOM-MATH-CHEM", "ATH-DOM-WORK-LEARN"]) assert.ok(st.codes[dom], `restored domain ${dom} is present`);
  const mirrors = arr(f.foundation, "nodes").filter((n) => n.record_stage === "domain_map_mirror");
  assert.ok(mirrors.length > 0 && mirrors.every((m) => st.codes[m.id]), "domain-map mirrors resolve to the single canonical domain, not duplicates");
  assert.equal(Object.values(st.nodes).filter((n) => n.code === mirrors[0].id).length, 1);
});

test("Pack v1.0 seed: re-import is a no-op, and a full archive round-trips with an identical content hash", async () => {
  const deps = makeDeps();
  const store = new MemoryStore(emptyState("device-seed"));
  await commitPlan(store, await buildPlan(await store.load(), pack(), deps), "approve", deps);
  const h = await contentHash(await store.load());
  const again = await buildPlan(await store.load(), pack(), deps);
  assert.equal(again.alreadyCommitted, true);
  const renamed = await buildPlan(await store.load(), { ...pack(), package_id: "pack-v1.0-seed-b" }, deps);
  assert.ok(renamed.items.filter((i) => i.table === "nodes").every((i) => i.action === "noop"), "no node changes");
  await commitPlan(store, renamed, "approve", deps);
  assert.equal(await contentHash(await store.load()), h);
  const text = await exportArchive(await store.load(), "0.1.0-test", "2026-11-17T00:00:00Z");
  const { state } = await readArchive(text);
  assert.equal(await contentHash(state), h);
  console.log(`# seed archive: ${(text.length / 1024).toFixed(0)} KB uncompressed NDJSON, ${Object.keys(state.nodes).length} nodes, ${Object.keys(state.edges).length} edges`);
});

test("micro-skills: success criteria stay qualitative text; numbers inside prose are never parsed as thresholds", async () => {
  const deps = makeDeps();
  const store = new MemoryStore(emptyState("device-seed"));
  await commitPlan(store, await buildPlan(await store.load(), pack(), deps), "approve", deps);
  const micro = Object.values((await store.load()).nodes).filter((n) => n.object_type === "micro_skill");
  assert.equal(micro.length, 158);
  assert.ok(micro.every((m) => m.status === "draft"));
  const high = micro.filter((m) => m.body["risk_level"] === "HIGH");
  assert.equal(high.length, 8);
  assert.ok(high.every((m) => (m.body["safety_review"] as any).review_required_before_approval === true), "HIGH-risk records stay blocked pending human review");
  assert.ok(micro.every((m) => Array.isArray(m.body["success_criteria"]) && (m.body["success_criteria"] as any[]).every((c) => c.threshold_type === "qualitative")));
});

test("Pack v1.0 carries the KB v3.28 working tier without orphaning canonical records", async () => {
  const deps = makeDeps();
  const store = new MemoryStore(emptyState("device-seed"));
  const plan = await buildPlan(await store.load(), pack(), deps);
  assert.equal((await commitPlan(store, plan, "approve", deps)).committed, true);
  const st = await store.load();
  const domains = Object.values(st.nodes).filter((n) => n.object_type === "domain");
  const families = Object.values(st.nodes).filter((n) => n.object_type === "skill_family");
  assert.equal(domains.length, 146);
  assert.equal(families.length, 777);
  assert.ok(families.every((fam) => fam.parent_id !== null && st.nodes[fam.parent_id]?.object_type === "domain"), "every family hangs off a domain");
  assert.ok(domains.every((d) => d.parent_id !== null && st.nodes[d.parent_id]?.object_type === "discipline"), "every domain hangs off a discipline");
  const m14 = Object.values(st.edges).filter((e) => (e.code ?? "").startsWith("ATH-XFER-M14-"));
  assert.equal(m14.length, 44, "message-14 transfer hypotheses are present");
  assert.ok(m14.every((e) => e.status === "draft" && e.gating === "none"), "KB transfer hypotheses stay draft and ungated");
  const kbMicro = Object.values(st.nodes).filter((n) => n.object_type === "micro_skill" && (n.body["authoring_notes"] as string ?? "").includes("substantive protocol authored"));
  assert.equal(kbMicro.length, 156, "every KB candidate maps to one imported micro-skill record");
  assert.ok(kbMicro.every((n) => (n.body["practice_protocol"] as any).steps.length >= 2), "each imported candidate keeps its authored practice steps");
  assert.ok(kbMicro.every((n) => n.status === "draft"), "candidates stay draft; authoring is not approval");
});

test("a revised draft body commits without a content_version bump; approved content still refuses", async () => {
  const deps = makeDeps();
  const store = new MemoryStore(emptyState("device-seed"));
  await commitPlan(store, await buildPlan(await store.load(), pack(), deps), "approve", deps);

  // The real failure mode: an authoring tool revises 18 micro-skills but leaves content_version alone.
  const before = await store.load();
  const revised = packToPackages(f, "pack-kb-revision", "2026-11-19T00:00:00Z");
  const micros = (revised.micro_skills ?? []).slice(0, 18);
  for (const m of micros) m["definition"] = `${m["definition"]} (revised protocol)`;
  const strict = await buildPlan(await store.load(), revised, deps);
  assert.equal(strict.ok, false, "a plain package import still refuses to overwrite a draft silently");
  const plan = await buildPlan(await store.load(), revised, deps, { allowDraftRevision: true });
  assert.equal(plan.ok, true, JSON.stringify(plan.issues.filter((i) => i.severity === "error").slice(0, 3)));
  const updates = plan.items.filter((i) => i.table === "nodes" && i.action === "update");
  assert.equal(updates.length, 18, "all 18 revised drafts are planned as updates");
  assert.ok(plan.issues.some((i) => i.code === "draft_revision" && i.severity === "info"), "the preview says drafts were revised");
  assert.equal((await commitPlan(store, plan, "approve", deps)).committed, true);

  const after = await store.load();
  for (const m of micros) {
    const entry = after.codes[m["id"] as string]!;
    const node = after.nodes[entry.id]!;
    assert.match(String(node.body["definition"]), /revised protocol/);
    assert.equal(node.content_version, before.nodes[before.codes[m["id"] as string]!.id]!.content_version + 1, "the stored content_version moves forward even without a bump");
    assert.equal(node.status, "draft");
  }

  // Approved content is never overwritten silently: a different body at the same version is an error.
  const approved = await store.load();
  const disc = Object.values(approved.nodes).find((n) => n.object_type === "discipline")!;
  const pkg = packToPackages(f, "pack-approved-change", "2026-11-19T00:00:00Z");
  const rec = pkg.disciplines!.find((n) => n["id"] === disc.code)!;
  rec["name"] = `${rec["name"]} (renamed)`;
  const refused = await buildPlan(await store.load(), pkg, deps);
  assert.equal(refused.ok, false);
  assert.ok(refused.issues.some((i) => i.code === "content_conflict"), "an approved record needs a bumped content_version");
});

test("a revised draft relationship commits as a revision, with its stored version moved forward", async () => {
  const deps = makeDeps();
  const store = new MemoryStore(emptyState("device-seed"));
  await commitPlan(store, await buildPlan(await store.load(), pack(), deps), "approve", deps);

  // The other half of the 18-micro-skill bug: a revised record also revises the links shipped with it.
  // Those links carry the same content_version, so they must be accepted by the same authoring path.
  const revised = packToPackages(f, "pack-kb-edge-revision", "2026-11-19T00:00:00Z");
  const rel = (revised.relationships ?? [])[0]!;
  rel["rationale"] = "revised rationale from the KB revision";
  const strict = await buildPlan(await store.load(), revised, deps);
  assert.equal(strict.ok, false, "a plain import still refuses to overwrite a draft link silently");
  assert.ok(strict.issues.some((i) => i.code === "content_conflict"));

  const plan = await buildPlan(await store.load(), revised, deps, { allowDraftRevision: true });
  assert.equal(plan.ok, true, JSON.stringify(plan.issues.filter((i) => i.severity === "error").slice(0, 3)));
  assert.ok(plan.items.some((i) => i.table === "edges" && i.action === "update"), "the revised link is planned as an update");
  assert.equal((await commitPlan(store, plan, "approve", deps)).committed, true);

  const after = await store.load();
  const found = Object.values(after.edges).find((e) => e.body["rationale"] === "revised rationale from the KB revision");
  assert.ok(found, "the revised link is stored");
  assert.equal(found!.content_version, 2, "the stored link version moves forward even without a bump");
});
