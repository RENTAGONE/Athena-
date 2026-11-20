// Path engine. Reads PREREQUISITE_FOR edges to answer two questions the interface needs: "what comes
// before this record?" and "what is on the frontier now?". A step is done only from evidence; the
// engine never marks progress because a page was opened.
import type { NodeRecord } from "../../domain/types.ts";
import { SKILL_TYPES, isHeld, tierOf, type EngineInput, type Tier } from "./types.ts";

export interface PathStep {
  node: NodeRecord;
  tier: Tier;
  state: "done" | "next" | "locked";
  depth: number;
}

/** Direct prerequisites: edges point from the prerequisite to the record it unlocks. */
export function prerequisitesOf(input: EngineInput, targetId: string): NodeRecord[] {
  const out: NodeRecord[] = [];
  for (const e of Object.values(input.edges)) {
    if (e.relation_type !== "PREREQUISITE_FOR" || e.target_id !== targetId) continue;
    const source = input.nodes[e.source_id];
    if (source && !out.some((n) => n.id === source.id)) out.push(source);
  }
  return out;
}

/**
 * Full prerequisite chain, deepest first, with the target last. Depth is capped and cycles are
 * broken so a malformed package can never hang the renderer.
 */
export function buildPath(input: EngineInput, targetId: string, max = 8): PathStep[] {
  const target = input.nodes[targetId];
  if (!target) return [];
  const chain: NodeRecord[] = [];
  const seen = new Set<string>([targetId]);
  const walk = (id: string, depth: number): void => {
    if (depth > 5) return;
    for (const p of prerequisitesOf(input, id)) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      chain.push(p);
      walk(p.id, depth + 1);
    }
  };
  walk(targetId, 0);

  const ordered: NodeRecord[] = [];
  const emitted = new Set<string>();
  const emit = (n: NodeRecord, guard = 0): void => {
    if (emitted.has(n.id) || guard > 8) return;
    emitted.add(n.id);
    for (const p of prerequisitesOf(input, n.id)) {
      if (seen.has(p.id)) emit(p, guard + 1);
    }
    ordered.push(n);
  };
  for (const n of chain) emit(n);
  ordered.push(target);

  const steps: PathStep[] = [];
  let nextMarked = false;
  for (const n of ordered.slice(-max)) {
    const tier = tierOf(input, n.id);
    const prereqs = prerequisitesOf(input, n.id).filter((p) => seen.has(p.id));
    const ready = prereqs.every((p) => isHeld(tierOf(input, p.id)));
    let state: PathStep["state"];
    if (isHeld(tier)) state = "done";
    else if (ready && !nextMarked) {
      state = "next";
      nextMarked = true;
    } else state = "locked";
    steps.push({ node: n, tier, state, depth: 0 });
  }
  return steps;
}

export interface NextStep {
  node: NodeRecord;
  tier: Tier;
  unlocks: number;
  reason: string;
}

/**
 * Frontier: skill-like records whose prerequisites are all demonstrated. Sorted by how many records
 * they unlock, so the list points at leverage rather than at the alphabet.
 */
export function nextSteps(input: EngineInput, limit = 4, discipline: string | null = null): NextStep[] {
  const unlocks = new Map<string, number>();
  for (const e of Object.values(input.edges)) {
    if (e.relation_type !== "PREREQUISITE_FOR") continue;
    unlocks.set(e.source_id, (unlocks.get(e.source_id) ?? 0) + 1);
  }
  const out: NextStep[] = [];
  for (const n of Object.values(input.nodes)) {
    if (!SKILL_TYPES.has(n.object_type)) continue;
    if (discipline && n.owner_discipline_id !== discipline) continue;
    const tier = tierOf(input, n.id);
    if (isHeld(tier)) continue;
    const prereqs = prerequisitesOf(input, n.id);
    if (!prereqs.every((p) => isHeld(tierOf(input, p.id)))) continue;
    const count = unlocks.get(n.id) ?? 0;
    const reason =
      tier === "needs_revision"
        ? "Ready to retry; prerequisites are demonstrated."
        : prereqs.length > 0
          ? `Prerequisites demonstrated · unlocks ${count} record${count === 1 ? "" : "s"}.`
          : "No recorded prerequisite; it is open now.";
    out.push({ node: n, tier, unlocks: count, reason });
  }
  out.sort((a, b) => b.unlocks - a.unlocks || a.node.code.localeCompare(b.node.code));
  return out.slice(0, limit);
}
