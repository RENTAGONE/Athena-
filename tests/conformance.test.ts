// Importer conformance suite IMP-001..IMP-022 (content owner's catalogue v0.1) executed against the in-memory store.
// Scope of this evidence: domain/importer logic on MemoryStore with a TEST-ONLY schema validator. Not Dexie, not Ajv, not a browser, not a device.
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildPlan, commitPlan, type ExchangePackage, type ImportPlan } from "../src/app/importer.ts";
import { contentHash, MemoryStore, AppendOnlyViolation, RevisionConflict } from "../src/domain/store.ts";
import { exportArchive, readArchive, previewMigration, ArchiveError } from "../src/domain/archive.ts";
import { invertChangeSet, NotInvertible } from "../src/domain/changeset.ts";
import { isUuidV7 } from "../src/domain/ids.ts";
import { emptyState, type CodeEntry } from "../src/domain/types.ts";
import { makeDeps, pkg, read } from "./support/fixtures.ts";
import { byId, files, newSkill, seeded } from "./support/baseline.ts";

const errs = (p: ImportPlan): string[] => p.issues.filter((i) => i.severity === "error").map((i) => i.code);
const A = "ATH-SKILL-MATH-NUMBER-ALGEBRA";
const B = "ATH-SKILL-MATH-SCIENTIFIC-REASONING";
const seedRel = (): Record<string, any> => structuredClone((files.relationships["edges"] as any[])[0]);
const rel = (type: string, src: string, tgt: string, ref: string, over: Record<string, unknown> = {}): Record<string, any> => ({ ...seedRel(), relation_type: type, source_id: src, target_id: tgt, client_ref: ref, ...over });
const hard = (src: string, tgt: string, ref: string): Record<string, any> => rel("PREREQUISITE_FOR", src, tgt, ref, { gating: "hard", strength: "required", hard_gate_justification: "Test fixture: the later skill cannot be attempted without the earlier one." });
const plan = async (s: MemoryStore, d: any, p: ExchangePackage): Promise<ImportPlan> => buildPlan(await s.load(), p, d);
const newSkills = (...codes: string[]): Record<string, any>[] => codes.map((c) => newSkill(c));

test("IMP-001 valid new record: preview is non-mutating; UUID and code are allocated only at commit", async () => {
  const { store, deps } = await seeded();
  const before = await contentHash(await store.load());
  const rev = (await store.load()).meta.revision;
  const p = await plan(store, deps, pkg({ nodes: newSkills("ATH-SKILL-MATH-TEST-NEW") }, "pkg-001"));
  assert.equal(p.ok, true);
  assert.deepEqual(p.items.filter((i) => i.table === "nodes").map((i) => i.action), ["create"]);
  assert.equal(await contentHash(await store.load()), before, "preview must not change the database");
  assert.equal((await store.load()).meta.revision, rev);
  assert.equal("ATH-SKILL-MATH-TEST-NEW" in (await store.load()).codes, false, "code is not registered during preview");
  const r = await commitPlan(store, p, "approve", deps);
  assert.equal(r.committed, true);
  const st = await store.load();
  const entry = st.codes["ATH-SKILL-MATH-TEST-NEW"] as CodeEntry;
  assert.ok(entry && isUuidV7(entry.id), "internal id is a UUIDv7 minted by ATHENA");
  assert.equal(st.nodes[entry.id]!.provenance.tool, "test-fixture");
  assert.equal(st.nodes[entry.id]!.provenance.origin, "ai_package");
});

test("IMP-002 valid update: field-level diff, stable code and id, audit changeset", async () => {
  const { store, deps } = await seeded();
  const st0 = await store.load();
  const id0 = st0.codes[A]!.id;
  const rec = { ...byId(files.skills["skills"] as any[], A), title: "Number and algebra (revised)", content_version: 2, subskill_ids: [], prerequisite_ids: [], objective_ids: [], concept_ids: [] };
  const p = await plan(store, deps, pkg({ nodes: [rec] }, "pkg-002"));
  assert.equal(p.ok, true);
  const item = p.items.find((i) => i.code === A)!;
  assert.equal(item.action, "update");
  assert.ok(item.changes!.includes("title") && item.changes!.includes("content_version"));
  await commitPlan(store, p, "approve", deps);
  const st = await store.load();
  assert.equal(st.codes[A]!.id, id0, "code and internal id are stable");
  assert.equal(st.nodes[id0]!.version, st0.nodes[id0]!.version + 1);
  assert.equal(st.nodes[id0]!.title, "Number and algebra (revised)");
  assert.ok(Object.values(st.changesets).some((c) => c.kind === "import" && c.ops.some((o) => o.key === id0 && o.before !== null)));
});

test("IMP-003 idempotent re-import: exact package twice is a no-op", async () => {
  const { store, deps } = await seeded();
  const p1 = pkg({ nodes: newSkills("ATH-SKILL-MATH-TEST-IDEM") }, "pkg-003");
  await commitPlan(store, await plan(store, deps, p1), "approve", deps);
  const h = await contentHash(await store.load());
  const p2 = await plan(store, deps, p1);
  assert.equal(p2.alreadyCommitted, true);
  const r = await commitPlan(store, p2, "approve", deps);
  assert.equal(r.committed, false);
  assert.equal(await contentHash(await store.load()), h, "no duplicate object or edge");
  const p3 = await plan(store, deps, { ...p1, package_id: "pkg-003-b" });
  assert.equal(p3.ok, true);
  assert.ok(p3.items.every((i) => i.action === "noop" || i.table === "edges"), "same content under a new package id creates no new nodes");
  const edgeCount = Object.keys((await store.load()).edges).length;
  await commitPlan(store, p3, "approve", deps);
  assert.equal(Object.keys((await store.load()).edges).length, edgeCount, "no duplicate edges");
});

test("IMP-004 conflicting duplicate code: rejected with both paths, never last-write-wins", async () => {
  const { store, deps } = await seeded();
  const a = newSkill("ATH-SKILL-MATH-TEST-DUP", "First meaning");
  const b = newSkill("ATH-SKILL-MATH-TEST-DUP", "Second meaning");
  const p = await plan(store, deps, pkg({ nodes: [a, b] }, "pkg-004"));
  assert.equal(p.ok, false);
  const issue = p.issues.find((i) => i.code === "duplicate_code_in_package")!;
  assert.ok(issue.message.includes("$.nodes[0]") && issue.message.includes("$.nodes[1]"), "both record paths are reported");
  const stale = { ...byId(files.skills["skills"] as any[], A), title: "Conflicting title", content_version: 1, subskill_ids: [], prerequisite_ids: [], objective_ids: [], concept_ids: [] };
  const p2 = await plan(store, deps, pkg({ nodes: [stale] }, "pkg-004b"));
  assert.ok(errs(p2).includes("content_conflict"));
});

test("IMP-005 dangling reference: precise path and unresolved code, no partial writes", async () => {
  const { store, deps } = await seeded();
  const h = await contentHash(await store.load());
  const p = await plan(store, deps, pkg({ nodes: newSkills("ATH-SKILL-MATH-TEST-OK"), relationships: [rel("SUPPORTS", A, "ATH-SKILL-MATH-DOES-NOT-EXIST", "rel-005")] }, "pkg-005"));
  assert.equal(p.ok, false);
  const i = p.issues.find((x) => x.code === "dangling_reference")!;
  assert.equal(i.path, "$.relationships[0].target_id");
  assert.ok(i.message.includes("ATH-SKILL-MATH-DOES-NOT-EXIST"));
  await commitPlan(store, p, "approve", deps);
  assert.equal(await contentHash(await store.load()), h);
});

test("IMP-006 tombstoned reference: rejected, not silently recreated or redirected", async () => {
  const { store, deps } = await seeded();
  const st = await store.load();
  const entry = st.codes[B]!;
  await store.persist({ expectedRevision: st.meta.revision, puts: [{ table: "codes", key: B, record: { ...entry, state: "tombstoned" } }] });
  const p = await plan(store, deps, pkg({ relationships: [rel("SUPPORTS", A, B, "rel-006")] }, "pkg-006"));
  assert.ok(errs(p).includes("tombstoned_reference"));
  const p2 = await plan(store, deps, pkg({ nodes: newSkills(B) }, "pkg-006b"));
  assert.ok(errs(p2).includes("tombstoned_code"), "a tombstoned code can never be re-issued");
});

test("IMP-007 schema-required field missing: schema path and requirement returned", async () => {
  const { store, deps } = await seeded();
  const unit = structuredClone((files.units["units"] as any[])[0]);
  delete unit["completion_criteria"];
  const p = await plan(store, deps, pkg({ nodes: [unit] }, "pkg-007"));
  assert.equal(p.ok, false);
  assert.ok(p.issues.some((i) => i.code === "schema" && i.message.includes("completion_criteria") && i.message.includes("required")));
});

test("IMP-008 invalid lifecycle enum is rejected", async () => {
  const { store, deps } = await seeded();
  const bad = { ...newSkill("ATH-SKILL-MATH-TEST-ENUM"), status: "complete_forever" };
  const p = await plan(store, deps, pkg({ nodes: [bad] }, "pkg-008"));
  assert.equal(p.ok, false);
  assert.ok(p.issues.some((i) => i.code === "schema" && (i.message.includes("not an allowed value") || i.message.includes("allowed values")) && i.path.includes("status")));
});

test("IMP-009 hard prerequisite without justification, or not PREREQUISITE_FOR/required, is rejected before commit", async () => {
  const { store, deps } = await seeded();
  const a = await plan(store, deps, pkg({ relationships: [rel("PREREQUISITE_FOR", A, B, "rel-009a", { gating: "hard", strength: "required", hard_gate_justification: null })] }, "pkg-009a"));
  assert.ok(errs(a).includes("hard_gate_unjustified"));
  const b = await plan(store, deps, pkg({ relationships: [rel("SUPPORTS", A, B, "rel-009b", { gating: "hard", strength: "required", hard_gate_justification: "x" })] }, "pkg-009b"));
  assert.ok(errs(b).includes("gating_not_allowed"));
  const c = await plan(store, deps, pkg({ relationships: [rel("PREREQUISITE_FOR", A, B, "rel-009c", { gating: "hard", strength: "recommended", hard_gate_justification: "Justified but not required strength." })] }, "pkg-009c"));
  assert.ok(errs(c).includes("hard_gate_unjustified"));
});

test("IMP-010 hard prerequisite cycle A->B->C->A: cycle path returned, nothing committed", async () => {
  const { store, deps } = await seeded();
  const h = await contentHash(await store.load());
  const [x, y, z] = ["ATH-SKILL-MATH-TEST-X", "ATH-SKILL-MATH-TEST-Y", "ATH-SKILL-MATH-TEST-Z"];
  const base = { nodes: newSkills(x, y, z) };
  const bad = await plan(store, deps, pkg({ ...base, relationships: [hard(x, y, "rel-chain-1"), hard(y, z, "rel-chain-2"), hard(z, x, "rel-chain-3")] }, "pkg-010"));
  assert.ok(errs(bad).includes("hard_prerequisite_cycle"));
  assert.ok(bad.issues.find((i) => i.code === "hard_prerequisite_cycle")!.message.includes(" -> "), "the cycle path is shown");
  await commitPlan(store, bad, "approve", deps);
  assert.equal(await contentHash(await store.load()), h);
  const ok = await plan(store, deps, pkg({ ...base, relationships: [hard(x, y, "rel-chain-1"), hard(y, z, "rel-chain-2")] }, "pkg-010ok"));
  assert.equal(ok.ok, true, "an acyclic hard chain is allowed");
});

test("IMP-011 non-gating cycles are allowed (RELATED_TO and SUPPORTS)", async () => {
  const { store, deps } = await seeded();
  const p = await plan(store, deps, pkg({ relationships: [rel("RELATED_TO", A, B, "rel-cycle-1"), rel("RELATED_TO", B, A, "rel-cycle-2"), rel("SUPPORTS", B, A, "rel-cycle-3")] }, "pkg-011"));
  assert.equal(p.ok, true, JSON.stringify(p.issues.filter((i) => i.severity === "error")));
});

test("IMP-012 duplicate client_ref is rejected; client_ref may not use ATH-EDGE-*", async () => {
  const { store, deps } = await seeded();
  const p = await plan(store, deps, pkg({ relationships: [rel("RELATED_TO", A, B, "same-ref"), rel("SUPPORTS", B, A, "same-ref")] }, "pkg-012"));
  assert.ok(errs(p).includes("duplicate_client_ref"));
  const q = await plan(store, deps, pkg({ relationships: [rel("RELATED_TO", A, B, "ATH-EDGE-FAKE")] }, "pkg-012b"));
  assert.ok(errs(q).includes("reserved_edge_code"));
});

test("IMP-013 AI cannot mint internal UUIDs or permanent codes", async () => {
  const { store, deps } = await seeded();
  const withUuid = { ...newSkill("ATH-SKILL-MATH-TEST-U"), id: "0192f3a4-7b1c-7d2e-8f3a-123456789abc" };
  assert.ok(errs(await plan(store, deps, pkg({ nodes: [withUuid] }, "pkg-013a"))).includes("untrusted_internal_id"));
  const withField = { ...newSkill("ATH-SKILL-MATH-TEST-F"), internal_id: "abc" };
  assert.ok(errs(await plan(store, deps, pkg({ nodes: [withField] }, "pkg-013b"))).includes("untrusted_internal_id"));
  const badNs = newSkill("ATH-SKILL-ZZZ-INVENTED");
  assert.ok(errs(await plan(store, deps, pkg({ nodes: [badNs] }, "pkg-013c"))).includes("unregistered_namespace"));
});

test("IMP-014 partial package failure is all-or-nothing; a crash mid-write leaves the database unchanged", async () => {
  const { store, deps } = await seeded();
  const h = await contentHash(await store.load());
  const rev = (await store.load()).meta.revision;
  const good = newSkills("ATH-SKILL-MATH-TEST-G1", "ATH-SKILL-MATH-TEST-G2");
  const bad = { ...newSkill("ATH-SKILL-MATH-TEST-BAD"), status: "complete_forever" };
  const p = await plan(store, deps, pkg({ nodes: [...good, bad] }, "pkg-014"));
  assert.equal(p.ok, false);
  const r = await commitPlan(store, p, "approve", deps);
  assert.equal(r.committed, false);
  assert.equal(await contentHash(await store.load()), h, "no subset committed");
  const ok = await plan(store, deps, pkg({ nodes: good }, "pkg-014b"));
  assert.equal(ok.ok, true);
  store.failAfterPuts = 0;
  await assert.rejects(() => commitPlan(store, ok, "approve", deps), /simulated crash/);
  store.failAfterPuts = null;
  assert.equal(await contentHash(await store.load()), h, "crash during persist changes nothing");
  assert.equal((await store.load()).meta.revision, rev);
});

test("IMP-015 evidence is append-only", async () => {
  const { store, deps } = await seeded();
  const fx = (read("fixtures/pack-v0.9/EVIDENCE_OUTCOME_SCHEMA_FIXTURES_v0.2.json").cases as any[]).find((c) => c.case_id === "EVID-OUTCOME-01").record;
  const ev = { ...fx, target_ids: [A] };
  const p = await plan(store, deps, pkg({ evidence: [ev] }, "pkg-015"));
  assert.equal(p.ok, true, JSON.stringify(p.issues.filter((i) => i.severity === "error")));
  await commitPlan(store, p, "approve", deps);
  const st = await store.load();
  const [evId] = Object.keys(st.evidence);
  assert.equal(st.evidence[evId!]!.independence_attestation, "unknown", "a package cannot attest independence");
  const changed = { ...ev, result_summary: "Rewritten history" };
  assert.ok(errs(await plan(store, deps, pkg({ evidence: [changed] }, "pkg-015b"))).includes("evidence_immutable"));
  await assert.rejects(() => store.persist({ expectedRevision: st.meta.revision, puts: [{ table: "evidence", key: evId!, record: { ...st.evidence[evId!]!, result_summary: "tampered" } }] }), AppendOnlyViolation);
  const cs = Object.values(st.changesets).find((c) => c.ops.some((o) => o.table === "evidence"))!;
  assert.throws(() => invertChangeSet(cs, deps.ids, "2026-11-17T00:00:00Z"), NotInvertible);
  const second = { ...ev, id: "evidence-fixture-single-002", result_summary: "A second, separate observation." };
  const p2 = await plan(store, deps, pkg({ evidence: [second] }, "pkg-015c"));
  await commitPlan(store, p2, "approve", deps);
  assert.equal(Object.keys((await store.load()).evidence).length, 2, "corrections and new observations are appended");
});

test("IMP-016 export/import round trip preserves codes, edges, tombstones, provenance and evidence", async () => {
  const { store, deps } = await seeded();
  const fx = (read("fixtures/pack-v0.9/EVIDENCE_OUTCOME_SCHEMA_FIXTURES_v0.2.json").cases as any[]).find((c) => c.case_id === "EVID-OUTCOME-01").record;
  await commitPlan(store, await plan(store, deps, pkg({ evidence: [{ ...fx, target_ids: [A] }], relationships: [rel("SUPPORTS", A, B, "rel-roundtrip")] }, "pkg-016")), "approve", deps);
  const st = await store.load();
  await store.persist({ expectedRevision: st.meta.revision, puts: [{ table: "codes", key: B, record: { ...st.codes[B]!, state: "tombstoned" } }] });
  const src = await store.load();
  const text = await exportArchive(src, "0.1.0-test", "2026-11-17T00:00:00Z");
  const { state, manifest } = await readArchive(text);
  assert.equal(manifest.counts["nodes"], Object.keys(src.nodes).length);
  assert.equal(await contentHash(state), await contentHash(src), "content hash is identical after a round trip");
  assert.equal(state.codes[B]!.state, "tombstoned");
  assert.deepEqual(Object.values(state.nodes).map((n) => n.provenance), Object.values(src.nodes).map((n) => n.provenance));
  assert.deepEqual(Object.keys(state.evidence), Object.keys(src.evidence));
  const fresh = new MemoryStore(emptyState("other-device"));
  await fresh.persist({ expectedRevision: 0, puts: Object.entries(state.nodes).map(([key, record]) => ({ table: "nodes" as const, key, record })) });
  assert.equal(Object.keys((await fresh.load()).nodes).length, Object.keys(src.nodes).length);
});

test("IMP-017 tampered, truncated or foreign archives are rejected before anything is written", async () => {
  const { store } = await seeded();
  const st = await store.load();
  const h = await contentHash(st);
  const text = await exportArchive(st, "0.1.0-test", "2026-11-17T00:00:00Z");
  const flip = text.replace('"title":"Number', '"title":"Nxmber');
  await assert.rejects(() => readArchive(flip), (e: unknown) => e instanceof ArchiveError && e.reason === "checksum_mismatch");
  const lines = text.trimEnd().split("\n");
  const noFooter = lines.slice(0, -1).join("\n") + "\n";
  await assert.rejects(() => readArchive(noFooter), (e: unknown) => e instanceof ArchiveError && e.reason === "truncated");
  const manifestEdit = [lines[0]!.replace('"revision":', '"revision":9'), ...lines.slice(1)].join("\n") + "\n";
  await assert.rejects(() => readArchive(manifestEdit), (e: unknown) => e instanceof ArchiveError);
  const dropped = [lines[0]!, ...lines.slice(2)].join("\n") + "\n";
  await assert.rejects(() => readArchive(dropped), (e: unknown) => e instanceof ArchiveError);
  assert.equal(await contentHash(await store.load()), h);
});

test("IMP-018 older schema version: deterministic migration preview, nothing written (rollback point is NOT implemented here)", async () => {
  const { store } = await seeded();
  const st = await store.load();
  const text = await exportArchive(st, "0.1.0-test", "2026-11-17T00:00:00Z");
  const { manifest } = await readArchive(text);
  const old = { ...manifest, schema_versions: { ...manifest.schema_versions, evidence: "0.1" } };
  const a = previewMigration(old);
  const b = previewMigration(old);
  assert.deepEqual(a, b, "deterministic");
  assert.equal(a.needed, true);
  assert.equal(a.steps[0]!.from, "0.1");
  assert.equal(previewMigration(manifest).needed, false);
  assert.equal(await contentHash(await store.load()), await contentHash(st));
});

test("IMP-019 unknown relationship type is rejected, never coerced to RELATED_TO", async () => {
  const { store, deps } = await seeded();
  const p = await plan(store, deps, pkg({ relationships: [rel("RELATES_LOOSELY", A, B, "rel-019")] }, "pkg-019"));
  assert.equal(p.ok, false);
  assert.ok(errs(p).includes("unknown_relation_type"));
  assert.ok(p.items.every((i) => !i.label.startsWith("RELATED_TO")));
});

test("IMP-020 concurrent commits of the same new code: one wins, the other fails cleanly, no duplicate mapping", async () => {
  const { store, deps } = await seeded();
  const st = await store.load();
  const mk = (title: string, id: string) => pkg({ nodes: [newSkill("ATH-SKILL-MATH-TEST-RACE", title)] }, id);
  const planA = await buildPlan(st, mk("Writer A", "pkg-020a"), deps);
  const planB = await buildPlan(st, mk("Writer B", "pkg-020b"), deps);
  assert.ok(planA.ok && planB.ok);
  await commitPlan(store, planA, "approve", deps);
  await assert.rejects(() => commitPlan(store, planB, "approve", deps), RevisionConflict);
  const after = await store.load();
  assert.equal(Object.values(after.codes).filter((c) => c.code === "ATH-SKILL-MATH-TEST-RACE").length, 1);
  const replanB = await plan(store, deps, mk("Writer B", "pkg-020b"));
  assert.ok(errs(replanB).includes("content_conflict"), "re-preview shows the conflict instead of overwriting");
});

test("IMP-021 cross-discipline ownership mismatch is rejected with the owner and parent path", async () => {
  const { store, deps } = await seeded();
  const ns = { ...newSkill("ATH-SKILL-MATH-TEST-OWN"), owner_discipline_id: "ATH-DISC-ENG", discipline_ids: ["ATH-DISC-ENG"] };
  assert.ok(errs(await plan(store, deps, pkg({ disciplines: [byId(files.disciplines["disciplines"] as any[], "ATH-DISC-ENG")], nodes: [ns] }, "pkg-021a"))).includes("ownership_mismatch"));
  const eng = { ...newSkill("ATH-SKILL-ENG-TEST-OWN"), owner_discipline_id: "ATH-DISC-ENG", discipline_ids: ["ATH-DISC-ENG"] };
  const p = await plan(store, deps, pkg({ disciplines: [byId(files.disciplines["disciplines"] as any[], "ATH-DISC-ENG")], nodes: [eng] }, "pkg-021b"));
  assert.ok(errs(p).includes("ownership_mismatch"), "ENG-owned skill placed under a MATH domain must be rejected");
  assert.ok(p.issues.find((i) => i.code === "ownership_mismatch" && i.message.includes("parent"))!.message.includes("ATH-DISC-"));
});

test("IMP-022 user rejects preview: no data change, no UUIDs or codes registered", async () => {
  const { store, deps } = await seeded();
  const h = await contentHash(await store.load());
  const p = await plan(store, deps, pkg({ nodes: newSkills("ATH-SKILL-MATH-TEST-REJECT") }, "pkg-022"));
  assert.equal(p.ok, true);
  const r = await commitPlan(store, p, "reject", deps);
  assert.equal(r.committed, false);
  const st = await store.load();
  assert.equal(await contentHash(st), h);
  assert.equal("ATH-SKILL-MATH-TEST-REJECT" in st.codes, false);
  assert.equal(st.receipts["pkg-022"]!.state, "rejected", "only the receipt records the rejection");
  const again = await plan(store, deps, pkg({ nodes: newSkills("ATH-SKILL-MATH-TEST-REJECT") }, "pkg-022"));
  assert.equal(again.alreadyCommitted, false, "a rejected package is not treated as committed");
});
