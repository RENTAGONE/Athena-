// Dexie (IndexedDB) implementation of the Store port. UNRUN in the authoring sandbox (Dexie could not be installed offline).
// Contract: persist() applies a whole Delta in ONE transaction after checking the revision; any thrown error aborts everything.
import Dexie, { type Table } from "dexie";
import { AppendOnlyViolation, RevisionConflict, type Store } from "../domain/store.ts";
import { uuidv7 } from "../domain/ids.ts";
import { emptyState, type ChangeSet, type CodeEntry, type DbState, type Delta, type EdgeRecord, type EvidenceStored, type NodeRecord, type PackageReceipt } from "../domain/types.ts";

interface MetaRow {
  key: string;
  value: unknown;
}
export class AthenaDb extends Dexie {
  declare nodes: Table<NodeRecord, string>;
  declare edges: Table<EdgeRecord, string>;
  declare codes: Table<CodeEntry, string>;
  declare evidence: Table<EvidenceStored, string>;
  declare changesets: Table<ChangeSet, string>;
  declare receipts: Table<PackageReceipt, string>;
  declare meta: Table<MetaRow, string>;
  constructor(name = "athena") {
    super(name);
    this.version(1).stores({
      nodes: "id, code, object_type, status",
      edges: "id, relation_type, source_id, target_id",
      codes: "code, id",
      evidence: "id",
      changesets: "id",
      receipts: "package_id",
      meta: "key",
    });
  }
}

export class DexieStore implements Store {
  readonly db: AthenaDb;
  constructor(db: AthenaDb = new AthenaDb()) {
    this.db = db;
  }
  async load(): Promise<DbState> {
    const d = this.db;
    return d.transaction("r", [d.nodes, d.edges, d.codes, d.evidence, d.changesets, d.receipts, d.meta], async () => {
      const [nodes, edges, codes, evidence, changesets, receipts, rev, dev] = await Promise.all([d.nodes.toArray(), d.edges.toArray(), d.codes.toArray(), d.evidence.toArray(), d.changesets.toArray(), d.receipts.toArray(), d.meta.get("revision"), d.meta.get("device_id")]);
      const state = emptyState((dev?.value as string | undefined) ?? "unregistered-device");
      state.meta.revision = (rev?.value as number | undefined) ?? 0;
      for (const n of nodes) state.nodes[n.id] = n;
      for (const e of edges) state.edges[e.id] = e;
      for (const c of codes) state.codes[c.code] = c;
      for (const v of evidence) state.evidence[v.id] = v;
      for (const c of changesets) state.changesets[c.id] = c;
      for (const r of receipts) state.receipts[r.package_id] = r;
      return state;
    });
  }
  /** Creates the device id once. Called at app start; load() never writes. */
  async ensureDeviceId(): Promise<string> {
    const existing = await this.db.meta.get("device_id");
    if (existing) return existing.value as string;
    const id = uuidv7();
    await this.db.meta.put({ key: "device_id", value: id });
    return id;
  }
  async persist(delta: Delta): Promise<{ revision: number }> {
    const d = this.db;
    return d.transaction("rw", [d.nodes, d.edges, d.codes, d.evidence, d.changesets, d.receipts, d.meta], async () => {
      const current = ((await d.meta.get("revision"))?.value as number | undefined) ?? 0;
      if (current !== delta.expectedRevision) throw new RevisionConflict(delta.expectedRevision, current);
      for (const p of delta.puts) {
        if (p.table === "evidence" && (await d.evidence.get(p.key))) throw new AppendOnlyViolation(p.key);
        await (d[p.table] as Table<unknown, string>).put(structuredClone(p.record));
      }
      await d.meta.put({ key: "revision", value: current + 1 });
      return { revision: current + 1 };
    });
  }
}
