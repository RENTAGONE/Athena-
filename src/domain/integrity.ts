import type { DbState, Issue } from "./types.ts";

/** Referential closure check used before export and after a scratch restore. Reports problems; never repairs silently. */
export function checkIntegrity(state: DbState): Issue[] {
  const issues: Issue[] = [];
  const err = (code: string, path: string, message: string): void => void issues.push({ severity: "error", code, path, message });
  const nodeIds = new Set(Object.keys(state.nodes));
  for (const [k, e] of Object.entries(state.edges)) {
    if (!nodeIds.has(e.source_id)) err("edge_source_missing", `edges.${k}.source_id`, "edge source does not exist");
    if (!nodeIds.has(e.target_id)) err("edge_target_missing", `edges.${k}.target_id`, "edge target does not exist");
  }
  for (const [code, c] of Object.entries(state.codes)) {
    const found = c.kind === "node" ? state.nodes[c.id] : state.edges[c.id];
    if (!found) err("code_target_missing", `codes.${code}`, "code points at a record that does not exist");
    else if (found.code !== code) err("code_mismatch", `codes.${code}`, "code registry and record disagree");
  }
  for (const n of Object.values(state.nodes)) if (!state.codes[n.code]) err("node_code_unregistered", `nodes.${n.id}`, `node '${n.code}' has no code registry entry`);
  for (const [k, ev] of Object.entries(state.evidence)) for (const t of ev.target_ids) if (!nodeIds.has(t)) err("evidence_target_missing", `evidence.${k}`, "evidence target does not exist");
  return issues;
}
