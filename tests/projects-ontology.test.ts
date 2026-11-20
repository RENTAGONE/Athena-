import test from "node:test";
import assert from "node:assert/strict";
import { classifyObjectType, projectOntology, relationCounts, RELATION_SEMANTICS } from "../src/app/ontology.ts";
import { completeMilestone, emptyProject, nextStates, summarise, transition, validateProject } from "../src/app/engines/projects.ts";
import { buildGalaxy } from "../src/app/selectors.ts";
import { emptyState, type DbState, type NodeRecord } from "../src/domain/types.ts";

const NOW = new Date("2026-11-20T10:00:00Z");

test("six celestial classes stay distinct and attached systems are never celestial bodies", () => {
  assert.equal(classifyObjectType("discipline").celestial, "star");
  assert.equal(classifyObjectType("domain").celestial, "planet");
  assert.equal(classifyObjectType("skill_family").celestial, "constellation");
  assert.equal(classifyObjectType("skill").celestial, "moon");
  assert.equal(classifyObjectType("subskill").celestial, "satellite");
  assert.equal(classifyObjectType("micro_skill").celestial, "asteroid");
  assert.equal(classifyObjectType("concept").celestial, null);
  assert.equal(classifyObjectType("concept").attached, "knowledge");
  assert.equal(classifyObjectType("project").attached, "trajectory");
  assert.equal(RELATION_SEMANTICS.PREREQUISITE_FOR.gate, true);
  assert.equal(RELATION_SEMANTICS.SUPPORTS.gate, false);
});

function node(id: string, code: string, objectType: string, parentId: string | null, owner: string | null): NodeRecord {
  return {
    id,
    code,
    object_type: objectType,
    title: code,
    status: "approved",
    owner_discipline_id: owner,
    content_version: 1,
    version: 1,
    is_sample: false,
    provenance: { origin: "system", at: "2026-11-20T00:00:00Z" },
    extensions: {},
    body: {},
    parent_id: parentId,
    discipline_ids: [],
    created_at: "2026-11-20T00:00:00Z",
    updated_at: "2026-11-20T00:00:00Z",
  };
}

function stateWithTiers(): DbState {
  const s = emptyState("test-device");
  const rows: [string, string, string, string | null][] = [
    ["d1", "ATH-DISC-MATH", "discipline", null],
    ["dom", "ATH-DOM-MATH-ALG", "domain", "d1"],
    ["fam", "ATH-FAM-MATH-ALG-LIN", "skill_family", "dom"],
    ["sk", "ATH-SKILL-MATH-VEC", "skill", "fam"],
    ["sub", "ATH-SUB-MATH-VEC-DOT", "subskill", "sk"],
    ["mic", "ATH-MICRO-MATH-VEC-DOT-1", "micro_skill", "sub"],
  ];
  for (const [id, code, type, parent] of rows) {
    s.nodes[id] = node(id, code, type, parent, type === "discipline" ? null : "ATH-DISC-MATH");
    s.codes[code] = { code, id, kind: "node", state: "active", namespace: null, issued_at: NOW.toISOString() };
  }
  return s;
}

test("the atlas projection places six distinct tiers, not three compressed ones", () => {
  const s = stateWithTiers();
  const g = buildGalaxy(s);
  assert.equal(g.stars.length, 1);
  assert.equal(g.totals.planets, 1);
  assert.equal(g.totals.constellations, 1);
  assert.equal(g.totals.moons, 1);
  assert.equal(g.totals.satellites, 1);
  assert.equal(g.totals.asteroids, 1);
  const star = g.stars[0]!;
  assert.equal(star.planets[0]!.node.object_type, "domain");
  assert.equal(star.constellations[0]!.node.object_type, "skill_family");
  const moon = star.planets[0]!.moons[0]!;
  assert.equal(moon.node.object_type, "skill");
  assert.equal(moon.satellites[0]!.node.object_type, "subskill");
  assert.equal(moon.satellites[0]!.asteroids[0]!.node.object_type, "micro_skill");
  assert.equal(g.location.get("fam")!.kind, "constellation");
  assert.equal(g.location.get("mic")!.kind, "asteroid");
});

test("an orphan skill stays visible under its owner star and is reported by the ontology audit", () => {
  const s = stateWithTiers();
  s.nodes["lost"] = node("lost", "ATH-SKILL-X", "skill", null, "ATH-DISC-MATH");
  s.codes["ATH-SKILL-X"] = { code: "ATH-SKILL-X", id: "lost", kind: "node", state: "active", namespace: null, issued_at: NOW.toISOString() };
  const g = buildGalaxy(s);
  assert.ok(g.stars[0]!.moons.some((m) => m.node.id === "lost"), "an unparented skill is still drawn");
  const projection = projectOntology(s);
  assert.ok(projection.orphans.some((n) => n.id === "lost"), "and it is flagged for repair, not hidden");
});

test("relations keep their semantics when counted", () => {
  const s = stateWithTiers();
  s.edges["e1"] = {
    id: "e1", code: null, relation_type: "PREREQUISITE_FOR", source_id: "sk", target_id: "sub", status: "approved", strength: "strong", gating: "hard", owner_discipline_id: "ATH-DISC-MATH", rationale: null, hard_gate_justification: "dot product needs vectors", content_version: 1, version: 1, is_sample: false, provenance: { origin: "system", at: NOW.toISOString() }, extensions: {}, body: {}, created_at: NOW.toISOString(), updated_at: NOW.toISOString(),
  };
  assert.deepEqual(relationCounts(s), { PREREQUISITE_FOR: 1 });
});

test("projects have exactly three classes and a validated lifecycle", () => {
  const p = emptyProject("p1", "Patch the hall light", "personal_use", NOW);
  assert.deepEqual(nextStates("captured_idea").sort(), ["abandoned", "archived", "scoped"]);
  const active = transition(p, "active", NOW);
  assert.equal(active.ok, false, "captured ideas cannot jump straight to active");
  const scoped = transition({ ...p, goal: "Light works again", purpose: "Safety" }, "scoped", NOW);
  assert.equal(scoped.ok, true);
  const started = transition((scoped as { project: typeof p }).project, "active", NOW);
  assert.equal(started.ok, true);
});

test("completion is refused while milestones or deliverables remain open", () => {
  const p = emptyProject("p2", "Zine", "intrinsic", NOW);
  p.purpose = "Make something";
  p.goal = "Print ten copies";
  p.status = "completed";
  p.milestones = [{ id: "m1", title: "Draft", done: false, dependsOn: [], acceptance: [] }];
  p.deliverables = [{ id: "d1", title: "Printed zine", accepted: false }];
  const issues = validateProject(p);
  assert.ok(issues.some((i) => i.code === "milestones_open"));
  const done = transition(p, "completed", NOW);
  assert.equal(done.ok, false);
});

test("milestone dependencies are enforced before completion", () => {
  const p = emptyProject("p3", "Garden bed", "personal_use", NOW);
  p.milestones = [
    { id: "m1", title: "Clear ground", done: true, dependsOn: [], acceptance: [] },
    { id: "m2", title: "Build frame", done: false, dependsOn: ["m1"], acceptance: [] },
    { id: "m3", title: "Plant", done: false, dependsOn: ["m2"], acceptance: [] },
  ];
  const blocked = completeMilestone(p, "m3", NOW);
  assert.equal(blocked.ok, false);
  const ok = completeMilestone(p, "m2", NOW);
  assert.equal(ok.ok, true);
  assert.equal(summarise((ok as { project: typeof p }).project).milestonesDone, 2);
});

test("certificate-style summary counts real items only", () => {
  const p = emptyProject("p4", "Shelf", "personal_use", NOW);
  p.milestones = [{ id: "m1", title: "Cut", done: true, dependsOn: [], acceptance: [] }];
  p.acceptanceCriteria = [{ id: "c1", text: "Level", met: false }];
  const s = summarise(p);
  assert.equal(s.milestonesDone, 1);
  assert.equal(s.criteriaMet, 0);
  assert.equal(s.evidence, 0);
});
