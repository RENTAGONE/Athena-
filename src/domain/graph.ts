import type { DbState, EdgeRecord } from "./types.ts";

/** Returns one cycle as a list of node keys (first == last) if the directed graph has one, else null. Iterative DFS. */
export function findCycle(pairs: [string, string][]): string[] | null {
  const adj = new Map<string, string[]>();
  for (const [a, b] of pairs) {
    if (!adj.has(a)) adj.set(a, []);
    adj.get(a)!.push(b);
  }
  const state = new Map<string, 0 | 1 | 2>(); // 1 = on stack, 2 = done
  for (const start of adj.keys()) {
    if (state.get(start) === 2) continue;
    const stack: { node: string; i: number }[] = [{ node: start, i: 0 }];
    const path: string[] = [start];
    state.set(start, 1);
    while (stack.length) {
      const top = stack[stack.length - 1]!;
      const next = adj.get(top.node)?.[top.i++];
      if (next === undefined) {
        state.set(top.node, 2);
        stack.pop();
        path.pop();
        continue;
      }
      const s = state.get(next);
      if (s === 1) return [...path.slice(path.indexOf(next)), next];
      if (s !== 2) {
        state.set(next, 1);
        stack.push({ node: next, i: 0 });
        path.push(next);
      }
    }
  }
  return null;
}

export function isActive(e: { status: string }): boolean {
  return e.status !== "archived" && e.status !== "deprecated";
}
/** Only PREREQUISITE_FOR edges with gating 'hard' must be acyclic. Everything else may cycle. */
export function hardPrerequisitePairs(edges: Iterable<EdgeRecord>): [string, string][] {
  const out: [string, string][] = [];
  for (const e of edges) if (e.relation_type === "PREREQUISITE_FOR" && e.gating === "hard" && isActive(e)) out.push([e.source_id, e.target_id]);
  return out;
}

/** N-06: parent_id and discipline_ids are read-only caches derived from CONTAINS edges and the explicit owner. */
export function recomputeCaches(state: DbState): void {
  const parentOf = new Map<string, string>();
  for (const e of Object.values(state.edges)) {
    if (e.relation_type === "CONTAINS" && isActive(e)) parentOf.set(e.target_id, e.source_id);
  }
  const idByCode = (c: string): string | undefined => state.codes[c]?.id;
  for (const n of Object.values(state.nodes)) {
    n.parent_id = parentOf.get(n.id) ?? null;
    const owner = n.owner_discipline_id ? idByCode(n.owner_discipline_id) : undefined;
    const extra = Array.isArray(n.body["discipline_ids"]) ? (n.body["discipline_ids"] as string[]).map(idByCode) : [];
    const ids = [owner, ...extra].filter((x): x is string => typeof x === "string");
    n.discipline_ids = [...new Set(ids)];
  }
}
/** Verifies the caches match what recomputation would produce. Used in tests and in the repository guard. */
export function cachesAreConsistent(state: DbState): boolean {
  const copy: DbState = structuredClone(state);
  recomputeCaches(copy);
  return Object.values(state.nodes).every((n) => {
    const c = copy.nodes[n.id]!;
    return n.parent_id === c.parent_id && JSON.stringify(n.discipline_ids) === JSON.stringify(c.discipline_ids);
  });
}
