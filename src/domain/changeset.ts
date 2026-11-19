import type { ChangeOp, ChangeSet, DbState, Delta, EdgeRecord, NodeRecord, CodeEntry } from "./types.ts";
import type { IdGen } from "./ids.ts";
import { clone } from "./canonical.ts";
import { recomputeCaches } from "./graph.ts";

export class NotInvertible extends Error {
  constructor(what: string) {
    super(`cannot invert: ${what}`);
    this.name = "NotInvertible";
  }
}

/** Turns a change set into a Delta. The derived caches are recomputed afterwards so no direct cache write can survive (N-06). */
export function toDelta(state: DbState, cs: ChangeSet): Delta {
  const puts: Delta["puts"] = cs.ops.map((o) => ({ table: o.table, key: o.key, record: o.after }));
  puts.push({ table: "changesets", key: cs.id, record: cs });
  return { expectedRevision: state.meta.revision, puts };
}

/** Rewrites cache fields on node puts from the state the delta would produce. Direct writes to parent_id/discipline_ids are overwritten. */
export function withDerivedCaches(state: DbState, delta: Delta): Delta {
  const preview = clone(state);
  for (const p of delta.puts) (preview[p.table] as Record<string, unknown>)[p.key] = clone(p.record);
  recomputeCaches(preview);
  const puts = delta.puts.map((p) =>
    p.table === "nodes" ? { ...p, record: preview.nodes[p.key] as NodeRecord } : p,
  );
  // Parents or owners may change for nodes the delta does not touch; include any node whose caches changed.
  const touched = new Set(delta.puts.filter((p) => p.table === "nodes").map((p) => p.key));
  for (const n of Object.values(preview.nodes)) {
    const old = state.nodes[n.id];
    if (old && !touched.has(n.id) && (old.parent_id !== n.parent_id || JSON.stringify(old.discipline_ids) !== JSON.stringify(n.discipline_ids))) {
      puts.push({ table: "nodes", key: n.id, record: n });
    }
  }
  return { ...delta, puts };
}

/** Inverse change set. Updates restore the previous record; creates become archived/tombstoned (codes are never recycled). Evidence cannot be inverted. */
export function invertChangeSet(cs: ChangeSet, ids: IdGen, now: string): ChangeSet {
  const ops: ChangeOp[] = [];
  for (const o of [...cs.ops].reverse()) {
    if (o.table === "evidence") throw new NotInvertible("evidence is append-only");
    if (o.table === "receipts" || o.table === "changesets") continue;
    if (o.before !== null) {
      ops.push({ table: o.table, key: o.key, before: o.after, after: o.before });
      continue;
    }
    if (o.table === "nodes" || o.table === "edges") {
      const rec = clone(o.after) as NodeRecord | EdgeRecord;
      ops.push({ table: o.table, key: o.key, before: o.after, after: { ...rec, status: "archived", version: rec.version + 1, updated_at: now } });
    } else if (o.table === "codes") {
      const rec = clone(o.after) as CodeEntry;
      ops.push({ table: "codes", key: o.key, before: o.after, after: { ...rec, state: "tombstoned" } });
    }
  }
  return { id: ids.next(), kind: "undo", created_at: now, approved_at: now, approved_by: "learner", package_hash: null, device_id: cs.device_id, ops };
}
