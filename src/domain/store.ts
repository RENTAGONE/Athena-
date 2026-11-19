import { canonicalJson, clone, sha256Hex } from "./canonical.ts";
import type { DbState, Delta } from "./types.ts";

/** Persistence port. Domain logic loads a snapshot, computes a Delta purely, and persists it atomically with a revision check. */
export interface Store {
  load(): Promise<DbState>;
  persist(delta: Delta): Promise<{ revision: number }>;
}
export class RevisionConflict extends Error {
  constructor(expected: number, actual: number) {
    super(`revision conflict: expected ${expected}, store is at ${actual}`);
    this.name = "RevisionConflict";
  }
}
export class AppendOnlyViolation extends Error {
  constructor(key: string) {
    super(`evidence '${key}' already exists; evidence is append-only`);
    this.name = "AppendOnlyViolation";
  }
}

/** Applies a delta to a copy of the state. Throws before returning anything if any rule is violated (atomic by construction). */
export function applyDelta(state: DbState, delta: Delta): DbState {
  if (delta.expectedRevision !== state.meta.revision) throw new RevisionConflict(delta.expectedRevision, state.meta.revision);
  const next = clone(state);
  for (const p of delta.puts) {
    const table = next[p.table] as Record<string, unknown>;
    if (p.table === "evidence" && p.key in table) throw new AppendOnlyViolation(p.key);
    table[p.key] = clone(p.record);
  }
  next.meta.revision = state.meta.revision + 1;
  return next;
}

/** Hash over content tables only. Receipts and the revision counter are excluded, so a rejected or failed import leaves it unchanged. */
export async function contentHash(state: DbState): Promise<string> {
  const { nodes, edges, codes, evidence, changesets } = state;
  return sha256Hex(canonicalJson({ nodes, edges, codes, evidence, changesets }));
}

export class MemoryStore implements Store {
  private state: DbState;
  /** Test hook: throw after N puts to simulate a crash mid-write. */
  failAfterPuts: number | null = null;
  constructor(initial: DbState) {
    this.state = clone(initial);
  }
  async load(): Promise<DbState> {
    return clone(this.state);
  }
  async persist(delta: Delta): Promise<{ revision: number }> {
    if (this.failAfterPuts !== null && delta.puts.length > this.failAfterPuts) {
      throw new Error("simulated crash during persist");
    }
    this.state = applyDelta(this.state, delta);
    return { revision: this.state.meta.revision };
  }
}
