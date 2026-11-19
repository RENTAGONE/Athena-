import { test } from "node:test";
import assert from "node:assert/strict";
import { uuidv7, isUuidV7, SeqIdGen, looksLikeUuid } from "../src/domain/ids.ts";
import { findCycle, cachesAreConsistent, recomputeCaches } from "../src/domain/graph.ts";
import { applyDelta, contentHash, RevisionConflict } from "../src/domain/store.ts";
import { invertChangeSet, withDerivedCaches, toDelta } from "../src/domain/changeset.ts";
import { validateEvidenceSemantics, deriveIndependence, toStoredEvidence, type ExchangeEvidence } from "../src/domain/evidence.ts";
import { deriveCompetency, CONSERVATIVE_V0, type CompetencyInput } from "../src/domain/competency.ts";
import { emptyState, type EvidenceStored } from "../src/domain/types.ts";
import { read, makeValidator } from "./support/fixtures.ts";
import { seeded, newSkill } from "./support/baseline.ts";
import { buildPlan, commitPlan } from "../src/app/importer.ts";
import { pkg } from "./support/fixtures.ts";

test("ids: UUIDv7 has version 7, RFC variant and sorts by time", () => {
  const a = uuidv7(1_700_000_000_000);
  const b = uuidv7(1_700_000_005_000);
  assert.ok(isUuidV7(a) && isUuidV7(b));
  assert.ok(a < b, "later timestamps sort later");
  assert.equal(looksLikeUuid("ATH-SKILL-MATH-X"), false);
  const g = new SeqIdGen();
  const seen = new Set(Array.from({ length: 500 }, () => g.next()));
  assert.equal(seen.size, 500);
});

test("graph: cycle detection finds cycles and tolerates DAGs and self-loops", () => {
  assert.equal(findCycle([["a", "b"], ["b", "c"]]), null);
  assert.deepEqual(findCycle([["a", "b"], ["b", "c"], ["c", "a"]])?.length, 4);
  assert.ok(findCycle([["a", "a"]]));
  assert.equal(findCycle([["a", "b"], ["a", "c"], ["b", "d"], ["c", "d"]]), null, "a diamond is not a cycle");
});

test("store: a stale expectedRevision is rejected by the store itself, and applyDelta never mutates its input", async () => {
  const s0 = emptyState("d");
  const s1 = applyDelta(s0, { expectedRevision: 0, puts: [] });
  assert.equal(s0.meta.revision, 0);
  assert.equal(s1.meta.revision, 1);
  assert.throws(() => applyDelta(s1, { expectedRevision: 0, puts: [] }), RevisionConflict);
});

test("N-06: parent_id and discipline_ids are derived caches; direct writes are overwritten", async () => {
  const { store, deps } = await seeded();
  const st = await store.load();
  assert.ok(cachesAreConsistent(st), "caches match CONTAINS edges after import");
  const nodeId = st.codes["ATH-SKILL-MATH-NUMBER-ALGEBRA"]!.id;
  assert.ok(st.nodes[nodeId]!.parent_id !== null, "a skill has a parent derived from its CONTAINS edge");
  const forged = { ...st.nodes[nodeId]!, parent_id: "00000000-0000-7000-8000-000000000000", discipline_ids: ["x"] };
  const delta = withDerivedCaches(st, { expectedRevision: st.meta.revision, puts: [{ table: "nodes", key: nodeId, record: forged }] });
  const written = delta.puts.find((p) => p.key === nodeId)!.record as typeof forged;
  assert.notEqual(written.parent_id, forged.parent_id);
  const after = applyDelta(st, delta);
  assert.ok(cachesAreConsistent(after));
  void deps;
});

test("changeset inversion: updates restore the previous record; creates become archived and their code is tombstoned, never recycled", async () => {
  const { store, deps } = await seeded();
  const p = await buildPlan(await store.load(), pkg({ nodes: [newSkill("ATH-SKILL-MATH-TEST-INV")] }, "pkg-inv"), deps);
  await commitPlan(store, p, "approve", deps);
  const st = await store.load();
  const cs = Object.values(st.changesets).at(-1)!;
  const inv = invertChangeSet(cs, deps.ids, "2026-11-17T00:00:00Z");
  const after = applyDelta(st, withDerivedCaches(st, toDelta(st, inv)));
  const entry = after.codes["ATH-SKILL-MATH-TEST-INV"]!;
  assert.equal(entry.state, "tombstoned");
  assert.equal(after.nodes[entry.id]!.status, "archived");
  const again = await buildPlan(after, pkg({ nodes: [newSkill("ATH-SKILL-MATH-TEST-INV")] }, "pkg-inv2"), deps);
  assert.ok(again.issues.some((i) => i.code === "tombstoned_code"));
});

test("evidence fixtures v0.2: schema plus semantic validation agree with the content owner's expected verdicts", () => {
  const v = makeValidator();
  const cases = read("fixtures/pack-v0.9/EVIDENCE_OUTCOME_SCHEMA_FIXTURES_v0.2.json").cases as { case_id: string; expected: string; record: ExchangeEvidence }[];
  for (const c of cases) {
    const schema = v.validate("EVIDENCE_RECORD", c.record, "$").length;
    const sem = validateEvidenceSemantics(c.record, "$").filter((i) => i.severity === "error").length;
    const verdict = schema === 0 && sem === 0 ? "valid" : "invalid";
    assert.equal(verdict, c.expected, `${c.case_id}: schema issues ${schema}, semantic errors ${sem}`);
  }
  const legacy = cases.find((c) => c.case_id === "EVID-OUTCOME-05")!;
  assert.ok(validateEvidenceSemantics(legacy.record, "$").some((i) => i.code === "outcome_unscored"), "legacy evidence is classified outcome-unscored");
});

test("evidence: a package cannot set mastery, competency or independence attestation", () => {
  const rec = { ...(read("fixtures/pack-v0.9/EVIDENCE_OUTCOME_SCHEMA_FIXTURES_v0.2.json").cases[0].record as ExchangeEvidence), mastery_designation: "confirmed", independence_attestation: "yes" };
  const codes = validateEvidenceSemantics(rec, "$").map((i) => i.code);
  assert.ok(codes.includes("forbidden_field"));
});

// ---------- competency rules ----------
const T = "target-uuid";
let n = 0;
function ev(over: Partial<EvidenceStored> & { day: string; outcome: "not_demonstrated" | "partial" | "demonstrated" }): EvidenceStored {
  const { day, outcome, ...rest } = over;
  n += 1;
  return {
    id: `ev-${n}`, target_ids: [T], target_codes: ["ATH-SKILL-X"], occurred_at: `${day}T10:00:00Z`, evidence_class: "PROBLEM_PERFORMANCE", result_summary: "fixture",
    outcome_scored: true, target_outcomes: [{ target_id: T, outcome }], rubric_results: [{ criterion: "c1", result: "Met", met: true }], conditions: { ai_used: false, hints_used: false, notes_used: false, collaboration_used: false },
    independence_attestation: "yes", evaluator: { type: "human", name: "fixture" }, limitations: [], item_signature: `item-${n}`, is_baseline: false, is_sample: true,
    provenance: { origin: "learner", at: "2026-11-01T00:00:00Z" }, body: {}, created_at: "2026-11-01T00:00:00Z", ...rest,
  };
}
const input = (evidence: EvidenceStored[], over: Partial<CompetencyInput> = {}): CompetencyInput => ({ target_id: T, as_of: "2026-12-31T00:00:00Z", evidence, exposed: true, practice_activity: false, self_report: "unknown", mastery_confirmed: false, review_due_at: null, flagged_misconception: false, flags: { retention_matters: true, transfer_matters: false, safety_critical: false }, ...over });

test("competency: exposure, practice and self-report alone never reach performance states", async () => {
  assert.equal((await deriveCompetency(input([], { exposed: false }))).derived_learner_state, "not_exposed");
  assert.equal((await deriveCompetency(input([]))).derived_learner_state, "exposed");
  assert.equal((await deriveCompetency(input([], { practice_activity: true }))).derived_learner_state, "practising");
  const confident = await deriveCompetency(input([], { self_report: "confident" }));
  assert.equal(confident.derived_learner_state, "exposed", "'confident' self-report does not advance state");
  assert.equal(confident.dimensions.performance, "none");
});

test("competency: SELF_REPORT evidence and legacy unscored evidence count for nothing", async () => {
  const sr = ev({ day: "2026-11-01", outcome: "demonstrated", evidence_class: "SELF_REPORT" });
  const legacy = ev({ day: "2026-11-02", outcome: "demonstrated", outcome_scored: false, target_outcomes: [] });
  const c = await deriveCompetency(input([sr, legacy]));
  assert.equal(c.dimensions.performance, "none");
  assert.deepEqual(c.evidence_ids, []);
});

test("competency: independence is derived conservatively (unknown attestation, AI, hints, notes, collaboration all mean assisted)", async () => {
  assert.equal(deriveIndependence({ independence_attestation: "unknown", conditions: {} }), "assisted");
  assert.equal(deriveIndependence({ independence_attestation: "yes", conditions: { ai_used: true } }), "assisted");
  assert.equal(deriveIndependence({ independence_attestation: "yes", conditions: { hints_used: true } }), "assisted");
  assert.equal(deriveIndependence({ independence_attestation: "yes", conditions: { notes_used: true } }), "assisted");
  assert.equal(deriveIndependence({ independence_attestation: "yes", conditions: { notes_used: true } }, true), "independent");
  assert.equal(deriveIndependence({ independence_attestation: "yes", conditions: { collaboration_used: true } }), "assisted");
  const assisted = await deriveCompetency(input([ev({ day: "2026-11-01", outcome: "demonstrated", independence_attestation: "unknown" })]));
  assert.equal(assisted.dimensions.performance, "assisted");
  assert.equal(assisted.derived_learner_state, "understood_provisionally");
});

test("competency: one independent demonstration is 'demonstrated', never 'mastered'", async () => {
  const c = await deriveCompetency(input([ev({ day: "2026-11-01", outcome: "demonstrated" })]));
  assert.equal(c.derived_learner_state, "demonstrated");
  assert.equal(c.dimensions.mastery, "none");
});

test("competency: mastery needs every clause AND the learner's confirmation", async () => {
  const good = [
    ev({ day: "2026-11-01", outcome: "demonstrated", item_signature: "a" }),
    ev({ day: "2026-11-09", outcome: "demonstrated", item_signature: "b" }),
    ev({ day: "2026-11-20", outcome: "demonstrated", item_signature: "c" }),
  ];
  const cand = await deriveCompetency(input(good));
  assert.equal(cand.dimensions.mastery, "candidate");
  assert.notEqual(cand.derived_learner_state, "mastered", "a candidate is not mastered");
  const conf = await deriveCompetency(input(good, { mastery_confirmed: true }));
  assert.equal(conf.dimensions.mastery, "confirmed");
  assert.equal(conf.derived_learner_state, "mastered");
  const sameDay = await deriveCompetency(input([ev({ day: "2026-11-01", outcome: "demonstrated", item_signature: "a" }), ev({ day: "2026-11-01", outcome: "demonstrated", item_signature: "b" }), ev({ day: "2026-11-01", outcome: "demonstrated", item_signature: "c" })]));
  assert.notEqual(sameDay.dimensions.mastery, "candidate", "three results in one day cannot reach mastery");
  const noSigs = await deriveCompetency(input(good.map((g) => ({ ...g, item_signature: null }))));
  assert.notEqual(noSigs.dimensions.mastery, "candidate", "without item identity, variation cannot be shown");
  const noRubric = await deriveCompetency(input(good.map((g) => ({ ...g, rubric_results: [] }))));
  assert.notEqual(noRubric.dimensions.mastery, "candidate", "M3 needs rubric criteria met");
});

test("competency: regression after a demonstration is needs_revision, and confirmed mastery lapses visibly", async () => {
  const good = [ev({ day: "2026-11-01", outcome: "demonstrated", item_signature: "a" }), ev({ day: "2026-11-09", outcome: "demonstrated", item_signature: "b" }), ev({ day: "2026-11-20", outcome: "demonstrated", item_signature: "c" })];
  const fail = ev({ day: "2026-12-01", outcome: "not_demonstrated", item_signature: "d" });
  const c = await deriveCompetency(input([...good, fail], { mastery_confirmed: true }));
  assert.equal(c.derived_learner_state, "needs_revision");
  assert.equal(c.dimensions.mastery, "lapsed");
  assert.equal(c.dimensions.retention, "fragile");
});

test("competency: retention needs a later independent success on a different known item; immediate repeats do not count", async () => {
  const first = ev({ day: "2026-11-01", outcome: "demonstrated", item_signature: "a" });
  const sameItem = ev({ day: "2026-11-20", outcome: "demonstrated", item_signature: "a" });
  assert.equal((await deriveCompetency(input([first, sameItem]))).dimensions.retention, "unknown");
  const immediate = ev({ day: "2026-11-01", outcome: "demonstrated", item_signature: "b" });
  assert.equal((await deriveCompetency(input([first, immediate]))).dimensions.retention, "unknown");
  const delayed = ev({ day: "2026-11-12", outcome: "demonstrated", item_signature: "c" });
  const r = await deriveCompetency(input([first, delayed]));
  assert.equal(r.dimensions.retention, "retained");
  assert.equal(r.derived_learner_state, "retained");
  assert.equal((await deriveCompetency(input([first, delayed], { review_due_at: "2026-12-01T00:00:00Z" }))).dimensions.retention, "due");
});

test("competency: safeguard S4 - time spent and other activity fields cannot influence the result", async () => {
  const base = input([ev({ day: "2026-11-01", outcome: "partial" })]);
  const withMinutes = { ...base, minutes_spent: 100000, sessions_completed: 500, streak_days: 99, ai_confidence: 1 } as unknown as CompetencyInput;
  const a = await deriveCompetency(base);
  const b = await deriveCompetency(withMinutes);
  assert.equal(a.inputs_hash, b.inputs_hash);
  assert.equal(a.derived_learner_state, b.derived_learner_state);
});

test("competency: snapshots conform to the Pack's COMPETENCY_STATE schema; profile is data", async () => {
  const c = await deriveCompetency(input([ev({ day: "2026-11-01", outcome: "demonstrated" })]));
  const issues = makeValidator().validate("COMPETENCY_STATE", c, "$");
  assert.deepEqual(issues, []);
  assert.equal(c.rules_version, CONSERVATIVE_V0.rules_version);
  const strict = await deriveCompetency(input([ev({ day: "2026-11-01", outcome: "demonstrated" })]), { ...CONSERVATIVE_V0, performance_classes: ["EXPLANATION"], rules_version: "custom-test" });
  assert.equal(strict.dimensions.performance, "none", "changing the profile changes the result; nothing is hard-coded");
});

test("evidence storage: attestation is always 'unknown' on import and outcomes are expanded per target", async () => {
  const rec = read("fixtures/pack-v0.9/EVIDENCE_OUTCOME_SCHEMA_FIXTURES_v0.2.json").cases.find((c: { case_id: string }) => c.case_id === "EVID-OUTCOME-02").record as ExchangeEvidence;
  const ids = new Map(rec.target_ids.map((c, i) => [c, { id: `uuid-${i}` }]));
  const stored = toStoredEvidence(rec, { resolve: (c) => ids.get(c), ids: new SeqIdGen(), now: "2026-11-17T00:00:00Z", provenance: { origin: "ai_package", at: "2026-11-17T00:00:00Z" }, isSample: true });
  assert.equal(stored.independence_attestation, "unknown");
  assert.equal(stored.target_outcomes.length, rec.target_ids.length);
  assert.equal(stored.item_signature, null);
});
void recomputeCaches; void contentHash;

function deepFreeze<T>(o: T): T {
  if (o && typeof o === "object") {
    Object.freeze(o);
    for (const v of Object.values(o as Record<string, unknown>)) deepFreeze(v);
  }
  return o;
}
test("IMP-001 (strict): buildPlan never mutates the state it is given (a deep-frozen state must not throw)", async () => {
  const { store, deps } = await seeded();
  const frozen = deepFreeze(await store.load());
  const p = await buildPlan(frozen, pkg({ nodes: [newSkill("ATH-SKILL-MATH-TEST-FROZEN")] }, "pkg-frozen"), deps);
  assert.equal(p.ok, true);
});

test("containment: a second primary CONTAINS parent is rejected, and containment may not cycle", async () => {
  const { store, deps } = await seeded();
  const st = await store.load();
  const otherDomain = "ATH-DOM-MATH-NUM";
  const skill = "ATH-SKILL-MATH-NUMBER-ALGEBRA";
  const currentParentId = st.nodes[st.codes[skill]!.id]!.parent_id!;
  const currentParentCode = st.nodes[currentParentId]!.code;
  const second = currentParentCode === otherDomain ? "ATH-DOM-MATH-ALG" : otherDomain;
  const secondDomain = (await import("./support/baseline.ts")).byId((await import("./support/baseline.ts")).DOMAINS, second);
  const edge = { relation_type: "CONTAINS", source_id: second, target_id: skill, status: "draft", strength: null, rationale: "test: a second parent", hard_gate_justification: null, evidence_refs: [], source_refs: [], created_by: "test", owner_discipline_id: "ATH-DISC-MATH", gating: "none", content_version: 1, client_ref: "rel-second-parent" };
  const p = await buildPlan(st, pkg({ nodes: [secondDomain], relationships: [edge] }, "pkg-2parents"), deps);
  assert.ok(p.issues.some((i) => i.code === "multiple_primary_parents"), JSON.stringify(p.issues.filter((i) => i.severity === "error").map((i) => i.code)));
  const cyc = { ...edge, relation_type: "CONTAINS", source_id: skill, target_id: currentParentCode, client_ref: "rel-cycle-contains" };
  const q = await buildPlan(st, pkg({ relationships: [cyc] }, "pkg-contains-cycle"), deps);
  assert.ok(q.issues.some((i) => i.code === "containment_cycle" || i.code === "multiple_primary_parents" || i.code === "invalid_endpoint_type"), "an inverted containment edge is rejected");
});

import { checkIntegrity } from "../src/domain/integrity.ts";
test("integrity: a freshly imported database is referentially closed; broken references are reported, not repaired", async () => {
  const { store } = await seeded();
  const st = await store.load();
  assert.deepEqual(checkIntegrity(st), []);
  const broken = structuredClone(st);
  const someEdge = Object.values(broken.edges)[0]!;
  delete broken.nodes[someEdge.target_id];
  const codes = checkIntegrity(broken).map((i) => i.code);
  assert.ok(codes.includes("edge_target_missing") && codes.includes("code_target_missing"));
});
