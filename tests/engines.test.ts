// Engine tests. The engines are pure over a snapshot, so these fixtures are the whole world: no
// Dexie, no JSON registries, no clock. Each assertion is about a rule the interface promises.
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildRoutine } from "../src/app/engines/routine.ts";
import { buildPath, nextSteps } from "../src/app/engines/path.ts";
import { buildInbox } from "../src/app/engines/inbox.ts";
import { buildLesson } from "../src/app/engines/session.ts";
import type { EdgeRecord, NodeRecord } from "../src/domain/types.ts";

const NOW = new Date("2026-11-19T12:00:00.000Z");
const DAY = 86_400_000;

function node(id: string, code: string, type: string, over: Partial<NodeRecord> = {}): NodeRecord {
  return {
    id,
    code,
    object_type: type,
    title: `Title ${code}`,
    status: "approved",
    owner_discipline_id: "ATH-DISC-ENG",
    content_version: 1,
    version: 1,
    is_sample: false,
    provenance: { origin: "ai_package", at: "2026-01-01T00:00:00.000Z" },
    extensions: {},
    body: {},
    parent_id: null,
    discipline_ids: [],
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    ...over,
  };
}

function edge(id: string, type: string, source: string, target: string): EdgeRecord {
  return {
    id,
    code: null,
    relation_type: type,
    source_id: source,
    target_id: target,
    status: "approved",
    strength: null,
    gating: "soft",
    owner_discipline_id: null,
    rationale: null,
    hard_gate_justification: null,
    content_version: 1,
    version: 1,
    is_sample: false,
    provenance: { origin: "ai_package", at: "2026-01-01T00:00:00.000Z" },
    extensions: {},
    body: {},
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  };
}

function input(nodes: NodeRecord[], edges: EdgeRecord[] = [], tiers: Record<string, "unassessed" | "needs_revision" | "demonstrated" | "mastered"> = {}, last: Record<string, number> = {}) {
  return {
    nodes: Object.fromEntries(nodes.map((n) => [n.id, n])),
    edges: Object.fromEntries(edges.map((e) => [e.id, e])),
    tiers,
    lastEvidenceAt: last,
    now: NOW,
  };
}

test("routine is empty and honest when nothing is loaded", () => {
  const r = buildRoutine(input([]), { minutes: 35 });
  assert.equal(r.blocks.length, 0);
  assert.equal(r.totalMinutes, 0);
  assert.match(r.note, /Import the bundled pack/);
});

test("routine puts revision first and does not invent blocks", () => {
  const a = node("a", "ATH-SKILL-A", "skill");
  const b = node("b", "ATH-SKILL-B", "skill");
  const r = buildRoutine(input([a, b], [], { a: "needs_revision" }, { a: NOW.getTime() - 2 * DAY }), { minutes: 35 });
  assert.equal(r.blocks[0]?.kind, "review");
  assert.equal(r.blocks[1]?.kind, "practice");
  assert.equal(r.blocks.length, 2);
  assert.equal(r.totalMinutes, 27);
  assert.match(r.blocks[0]!.reason, /needs revision/);
  assert.equal(r.pool.practice, 1);
});

test("retention waits seven days and never fires earlier", () => {
  const held = node("h", "ATH-SKILL-H", "skill");
  const early = buildRoutine(input([held], [], { h: "demonstrated" }, { h: NOW.getTime() - 3 * DAY }), { minutes: 35 });
  assert.equal(early.blocks.filter((b) => b.kind === "retention").length, 0);
  const due = buildRoutine(input([held], [], { h: "demonstrated" }, { h: NOW.getTime() - 9 * DAY }), { minutes: 35 });
  assert.equal(due.blocks[0]?.kind, "retention");
  assert.match(due.blocks[0]!.reason, /9d ago/);
});

test("routine is deterministic for the same snapshot and date", () => {
  const a = node("a", "ATH-SKILL-A", "skill");
  const b = node("b", "ATH-SKILL-B", "skill");
  const snapshot = input([a, b]);
  assert.deepEqual(buildRoutine(snapshot, { minutes: 60 }).blocks, buildRoutine(snapshot, { minutes: 60 }).blocks);
});

test("path orders prerequisites before the target and marks only evidence as done", () => {
  const base = node("p1", "ATH-SKILL-P1", "skill");
  const mid = node("p2", "ATH-SKILL-P2", "skill");
  const target = node("t", "ATH-SKILL-T", "skill");
  const edges = [edge("e1", "PREREQUISITE_FOR", base.id, mid.id), edge("e2", "PREREQUISITE_FOR", mid.id, target.id)];
  const steps = buildPath(input([base, mid, target], edges, { p1: "demonstrated" }), target.id);
  assert.deepEqual(steps.map((s) => s.node.id), ["p1", "p2", "t"]);
  assert.equal(steps[0]!.state, "done");
  assert.equal(steps[1]!.state, "next");
  assert.equal(steps[2]!.state, "locked");
});

test("frontier excludes blocked records", () => {
  const base = node("p1", "ATH-SKILL-P1", "skill");
  const target = node("t", "ATH-SKILL-T", "skill");
  const blocked = nextSteps(input([base, target], [edge("e", "PREREQUISITE_FOR", base.id, target.id)]), 4);
  assert.deepEqual(blocked.map((s) => s.node.id), ["p1"]);
  const open = nextSteps(input([base, target], [edge("e", "PREREQUISITE_FOR", base.id, target.id)], { p1: "demonstrated" }), 4);
  assert.deepEqual(open.map((s) => s.node.id), ["t"]);
  assert.match(open[0]!.reason, /unlocks|open now|Prerequisites/);
});

test("inbox surfaces review flags and rejected imports", () => {
  const flagged = node("f", "ATH-SKILL-F", "skill", { status: "draft", body: { review_required_before_approval: true } });
  const inbox = buildInbox(input([flagged]), {
    pkg: { package_id: "pkg-9", package_hash: "x", state: "rejected", at: "2026-11-18T10:00:00.000Z", summary: {} },
  });
  assert.equal(inbox.counts.safety, 1);
  assert.equal(inbox.counts.import, 1);
  assert.equal(inbox.items[0]?.kind, "safety");
  assert.equal(inbox.items[1]?.kind, "import");
});

test("lesson builds prompts from fields that exist and falls back to a neutral protocol", () => {
  const skill = node("s", "ATH-SKILL-S", "skill", {
    body: { definition: "A precise definition.", time_to_initial_competence_minutes: 12, evidence_types: ["RETRIEVAL", "SELF_REPORT"] },
  });
  const plan = buildLesson(input([skill]), skill.id);
  assert.ok(plan);
  assert.equal(plan.minutes, 12);
  assert.equal(plan.protocol.length, 4);
  assert.equal(plan.hasProtocol, false);
  assert.equal(plan.prompts.length, 1);
  assert.equal(plan.prompts[0]!.reference, "A precise definition.");
  assert.deepEqual(plan.evidenceClasses, ["RETRIEVAL"]);
});
