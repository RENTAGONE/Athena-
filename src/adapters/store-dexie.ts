// Dexie (IndexedDB) implementation of the Store port, plus the operational tables added in v2.
// The v2 schema is additive: the knowledge tables, receipts and changesets keep their exact shape and
// every existing row survives the upgrade. Operational records are ordinary mutable rows (a schedule
// event is meant to be edited); only evidence and the audit/actual logs are append-only by policy.
import Dexie, { type Table } from "dexie";
import { AppendOnlyViolation, RevisionConflict, type Store } from "../domain/store.ts";
import { uuidv7 } from "../domain/ids.ts";
import { emptyState, type ChangeSet, type CodeEntry, type DbState, type Delta, type EdgeRecord, type EvidenceStored, type NodeRecord, type PackageReceipt } from "../domain/types.ts";
import { SYSTEM_INDEXES, SYSTEM_TABLES, type SystemRow, type SystemTable } from "../domain/system.ts";

interface MetaRow {
  key: string;
  value: unknown;
}

type OperationalTable = Table<SystemRow, string>;

export class AthenaDb extends Dexie {
  declare nodes: Table<NodeRecord, string>;
  declare edges: Table<EdgeRecord, string>;
  declare codes: Table<CodeEntry, string>;
  declare evidence: Table<EvidenceStored, string>;
  declare changesets: Table<ChangeSet, string>;
  declare receipts: Table<PackageReceipt, string>;
  declare meta: Table<MetaRow, string>;
  declare scheduleEvents: OperationalTable;
  declare routineTemplates: OperationalTable;
  declare routineOccurrences: OperationalTable;
  declare tasks: OperationalTable;
  declare availabilityWindows: OperationalTable;
  declare scheduleProposals: OperationalTable;
  declare activityActuals: OperationalTable;
  declare scheduleAuditEvents: OperationalTable;
  declare projects: OperationalTable;
  declare pclProgress: OperationalTable;
  declare spatialOverrides: OperationalTable;
  declare sideQuests: OperationalTable;

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
    // v2: additive. No table is dropped or re-indexed, so an upgrade cannot lose a record.
    this.version(2).stores({
      nodes: "id, code, object_type, status",
      edges: "id, relation_type, source_id, target_id",
      codes: "code, id",
      evidence: "id",
      changesets: "id",
      receipts: "package_id",
      meta: "key",
      ...SYSTEM_INDEXES,
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

  // --- Operational tables -------------------------------------------------------------------
  async listRows<T = SystemRow>(table: SystemTable): Promise<T[]> {
    return (await (this.db[table] as OperationalTable).toArray()) as T[];
  }
  async putRow(table: SystemTable, row: SystemRow): Promise<void> {
    await (this.db[table] as OperationalTable).put(structuredClone(row));
  }
  async deleteRow(table: SystemTable, id: string): Promise<void> {
    await (this.db[table] as OperationalTable).delete(id);
  }
  /** Append-only logs: refuses to overwrite an existing row instead of silently replacing history. */
  async appendRow(table: "activityActuals" | "scheduleAuditEvents", row: SystemRow): Promise<void> {
    const existing = await (this.db[table] as OperationalTable).get(row.id);
    if (existing) throw new AppendOnlyViolation(row.id);
    await (this.db[table] as OperationalTable).add(structuredClone(row));
  }
  async countRows(table: SystemTable): Promise<number> {
    return (this.db[table] as OperationalTable).count();
  }
  async clearOperational(): Promise<void> {
    await this.db.transaction("rw", SYSTEM_TABLES.map((t) => this.db[t] as OperationalTable), async () => {
      await Promise.all(SYSTEM_TABLES.map((t) => (this.db[t] as OperationalTable).clear()));
    });
  }
}
