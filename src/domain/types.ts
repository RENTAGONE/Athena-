import type { Uuid } from "./ids.ts";

export type Severity = "error" | "warning" | "info";
export interface Issue {
  severity: Severity;
  code: string; // machine-readable, e.g. "dangling_reference"
  path: string; // where, e.g. "nodes[3].parent_id"
  message: string;
}

export interface Provenance {
  origin: "learner" | "ai_package" | "authored_import" | "system";
  package_id?: string;
  tool?: string;
  model?: string;
  at: string;
}

/** Stored knowledge node. `body` keeps the exchange record whole; `parent_id` and `discipline_ids` are DERIVED caches (N-06). */
export interface NodeRecord {
  id: Uuid;
  code: string;
  object_type: string;
  title: string;
  status: string;
  owner_discipline_id: string | null; // ATHENA code of the owner discipline
  content_version: number;
  version: number; // optimistic-concurrency counter
  is_sample: boolean;
  provenance: Provenance;
  extensions: Record<string, unknown>;
  body: Record<string, unknown>;
  parent_id: Uuid | null; // derived cache
  discipline_ids: Uuid[]; // derived cache
  created_at: string;
  updated_at: string;
}

export interface EdgeRecord {
  id: Uuid;
  code: string | null; // only transfer links carry a permanent code (ATH-XFER-*)
  relation_type: string;
  source_id: Uuid;
  target_id: Uuid;
  status: string;
  strength: string | null;
  gating: string;
  owner_discipline_id: string | null;
  rationale: string | null;
  hard_gate_justification: string | null;
  content_version: number;
  version: number;
  is_sample: boolean;
  provenance: Provenance;
  extensions: Record<string, unknown>;
  body: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CodeEntry {
  code: string;
  id: Uuid;
  kind: "node" | "edge";
  state: "active" | "tombstoned";
  namespace: string | null;
  issued_at: string;
}

export type OutcomeValue = "not_demonstrated" | "partial" | "demonstrated";
export interface EvidenceStored {
  id: Uuid;
  target_ids: Uuid[]; // internal ids
  target_codes: string[]; // snapshot, so links survive an id loss
  occurred_at: string;
  evidence_class: string;
  result_summary: string;
  outcome_scored: boolean; // false for legacy records without a structured outcome
  target_outcomes: { target_id: Uuid; outcome: OutcomeValue }[]; // shared outcome is expanded per target
  rubric_results: { criterion: string; result: string; met: boolean | null }[];
  conditions: Record<string, unknown>;
  independence_attestation: "yes" | "no" | "unknown"; // storage-only; packages cannot set it
  evaluator: Record<string, unknown>;
  limitations: string[];
  item_signature: string | null;
  is_baseline: boolean;
  is_sample: boolean;
  provenance: Provenance;
  body: Record<string, unknown>;
  created_at: string;
}

export interface PackageReceipt {
  package_id: string;
  package_hash: string;
  state: "committed" | "rejected" | "failed";
  at: string;
  summary: Record<string, number>;
}

export interface ChangeOp {
  table: Table;
  key: string;
  before: unknown | null;
  after: unknown;
}
export interface ChangeSet {
  id: Uuid;
  kind: "import" | "studio" | "activity" | "system" | "migration" | "restore" | "undo";
  created_at: string;
  approved_at: string | null;
  approved_by: "learner" | "system";
  package_hash: string | null;
  device_id: string;
  ops: ChangeOp[];
}

export type Table = "nodes" | "edges" | "codes" | "evidence" | "changesets" | "receipts";
export interface DbState {
  meta: { revision: number; device_id: string };
  nodes: Record<string, NodeRecord>;
  edges: Record<string, EdgeRecord>;
  codes: Record<string, CodeEntry>;
  evidence: Record<string, EvidenceStored>;
  changesets: Record<string, ChangeSet>;
  receipts: Record<string, PackageReceipt>;
}
export function emptyState(deviceId: string): DbState {
  return { meta: { revision: 0, device_id: deviceId }, nodes: {}, edges: {}, codes: {}, evidence: {}, changesets: {}, receipts: {} };
}

export interface Delta {
  expectedRevision: number;
  puts: { table: Table; key: string; record: unknown }[];
}
