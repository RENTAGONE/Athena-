// KB pack forge. Exports and imports a self-describing .zip, prints the exact spec a model can follow,
// and pushes a snapshot to GitHub. Import is preview-then-approve: `previewKbPack` only reads and
// diffs; `deltaForPreview` produces the Delta that the caller commits with an explicit approval.
import JSZip from "jszip";
import type { DbState, Delta, EdgeRecord, NodeRecord, Table } from "../domain/types.ts";
import { SYSTEM_TABLES, type SystemRow, type SystemTable } from "../domain/system.ts";

export const KB_PACK_FORMAT = "athena-kb-pack";
export const KB_PACK_VERSION = 1;

export interface KbManifest {
  format: "athena-kb-pack";
  format_version: number;
  app_version: string;
  created_at: string;
  device_id: string;
  revision: number;
  counts: Record<string, number>;
  /** Which tables the pack carries; a reader must check before assuming a table exists. */
  tables: string[];
}

export interface KbExportInput {
  state: DbState;
  operational: Partial<Record<SystemTable, SystemRow[]>>;
  appVersion: string;
  createdAt: string;
}

export async function buildKbPack(input: KbExportInput): Promise<Blob> {
  const { state } = input;
  const counts: Record<string, number> = {
    nodes: Object.keys(state.nodes).length,
    edges: Object.keys(state.edges).length,
    codes: Object.keys(state.codes).length,
    evidence: Object.keys(state.evidence).length,
    changesets: Object.keys(state.changesets).length,
    receipts: Object.keys(state.receipts).length,
  };
  for (const t of SYSTEM_TABLES) counts[t] = input.operational[t]?.length ?? 0;
  const manifest: KbManifest = {
    format: KB_PACK_FORMAT,
    format_version: KB_PACK_VERSION,
    app_version: input.appVersion,
    created_at: input.createdAt,
    device_id: state.meta.device_id,
    revision: state.meta.revision,
    counts,
    tables: ["nodes", "edges", "codes", "evidence", "changesets", "receipts", ...SYSTEM_TABLES],
  };
  const zip = new JSZip();
  zip.file("manifest.json", JSON.stringify(manifest, null, 2));
  zip.file(
    "knowledge.json",
    JSON.stringify({ nodes: state.nodes, edges: state.edges, codes: state.codes, evidence: state.evidence, changesets: state.changesets, receipts: state.receipts }),
  );
  zip.file("operational.json", JSON.stringify(input.operational));
  zip.file(
    "README.md",
    [
      "# ATHENA KB pack",
      "",
      `Format ${KB_PACK_FORMAT} v${KB_PACK_VERSION}. Created ${input.createdAt}.`,
      "",
      "This archive is a snapshot, not the whole application. Import previews every record and",
      "commits only what you approve; evidence is append-only and an existing evidence id is rejected",
      "rather than overwritten. The pack is plain JSON inside a zip, readable without ATHENA.",
      "",
      "Do not add a nested .zip, node_modules or .git directory to a pack.",
    ].join("\n"),
  );
  return zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
}

export interface RejectedRecord {
  table: string;
  id: string;
  code?: string;
  reason: string;
}

export interface KbPreview {
  manifest: KbManifest;
  added: { nodes: number; edges: number; evidence: number };
  updated: { nodes: number; edges: number };
  unchanged: { nodes: number; edges: number };
  rejected: RejectedRecord[];
  operationalCounts: Record<string, number>;
  warnings: string[];
  /** Nodes/edges that would be written, already filtered. */
  nodes: NodeRecord[];
  edges: EdgeRecord[];
  evidence: DbState["evidence"][string][];
}

const NODE_REQUIRED = ["id", "code", "object_type", "title", "status"] as const;

async function readJson<T>(zip: JSZip, name: string): Promise<T | null> {
  const file = zip.file(name);
  if (!file) return null;
  return JSON.parse(await file.async("string")) as T;
}

/**
 * Reads a pack and diffs it against the current store. It never mutates anything. Records are rejected
 * for a missing required field, an unknown table, an evidence id that already exists, or an edge whose
 * endpoints are absent from both the pack and the store. Those rejections are shown before approval.
 */
export async function previewKbPack(data: ArrayBuffer | Blob, current: DbState): Promise<KbPreview> {
  const zip = await JSZip.loadAsync(data);
  const manifest = await readJson<KbManifest>(zip, "manifest.json");
  if (!manifest || manifest.format !== KB_PACK_FORMAT) throw new Error("not an ATHENA KB pack: manifest.json is missing or has the wrong format");
  if (manifest.format_version > KB_PACK_VERSION) throw new Error(`pack format ${manifest.format_version} is newer than this app understands (${KB_PACK_VERSION})`);
  const knowledge = (await readJson<{ nodes?: Record<string, NodeRecord>; edges?: Record<string, EdgeRecord>; evidence?: DbState["evidence"] }>(zip, "knowledge.json")) ?? {};
  const operational = (await readJson<Record<string, SystemRow[]>>(zip, "operational.json")) ?? {};
  const rejected: RejectedRecord[] = [];
  const warnings: string[] = [];
  const merged = new Set([...Object.keys(current.nodes), ...Object.keys(knowledge.nodes ?? {})]);
  const nodes: NodeRecord[] = [];
  const edges: EdgeRecord[] = [];
  const evidence: DbState["evidence"][string][] = [];
  let addedNodes = 0;
  let updatedNodes = 0;
  let unchangedNodes = 0;
  let addedEdges = 0;
  let updatedEdges = 0;
  let unchangedEdges = 0;
  let addedEvidence = 0;

  for (const [id, n] of Object.entries(knowledge.nodes ?? {})) {
    const missing = NODE_REQUIRED.filter((k) => !n || typeof (n as unknown as Record<string, unknown>)[k] !== "string" || !(n as unknown as Record<string, unknown>)[k]);
    if (missing.length > 0 || !n) {
      rejected.push({ table: "nodes", id, code: n?.code, reason: `missing ${missing.join(", ")}` });
      continue;
    }
    const before = current.nodes[id];
    if (!before) addedNodes += 1;
    else if (JSON.stringify(before) === JSON.stringify(n)) {
      unchangedNodes += 1;
      continue;
    } else updatedNodes += 1;
    nodes.push(n);
  }
  for (const [id, e] of Object.entries(knowledge.edges ?? {})) {
    if (!e || !e.relation_type || !e.source_id || !e.target_id) {
      rejected.push({ table: "edges", id, reason: "missing relation_type, source_id or target_id" });
      continue;
    }
    if (!merged.has(e.source_id) || !merged.has(e.target_id)) {
      rejected.push({ table: "edges", id, code: e.code ?? undefined, reason: "endpoint not present in the pack or the local store" });
      continue;
    }
    const before = current.edges[id];
    if (!before) addedEdges += 1;
    else if (JSON.stringify(before) === JSON.stringify(e)) {
      unchangedEdges += 1;
      continue;
    } else updatedEdges += 1;
    edges.push(e);
  }
  for (const [id, ev] of Object.entries(knowledge.evidence ?? {})) {
    if (!ev || !Array.isArray(ev.target_ids)) {
      rejected.push({ table: "evidence", id, reason: "malformed evidence record" });
      continue;
    }
    if (current.evidence[id]) {
      rejected.push({ table: "evidence", id, reason: "evidence already exists; evidence is append-only and is never overwritten" });
      continue;
    }
    addedEvidence += 1;
    evidence.push(ev);
  }
  const operationalCounts: Record<string, number> = {};
  for (const t of SYSTEM_TABLES) {
    const rows = operational[t];
    if (!Array.isArray(rows)) continue;
    operationalCounts[t] = rows.length;
    if (rows.some((r) => !r || typeof r.id !== "string")) warnings.push(`${t}: some rows have no id and will be skipped on import`);
  }
  if (manifest.revision > current.meta.revision) warnings.push(`The pack was taken at revision ${manifest.revision}; this device is at ${current.meta.revision}. The diff below is what matters, not the revision number.`);
  if (nodes.some((n) => !/^ATH-[A-Z]+-/.test(n.code))) warnings.push("Some node codes do not start with a canonical ATH-* prefix. They are shown, not silently renamed.");

  return {
    manifest,
    added: { nodes: addedNodes, edges: addedEdges, evidence: addedEvidence },
    updated: { nodes: updatedNodes, edges: updatedEdges },
    unchanged: { nodes: unchangedNodes, edges: unchangedEdges },
    rejected,
    operationalCounts,
    warnings,
    nodes,
    edges,
    evidence,
  };
}

export function deltaForPreview(preview: KbPreview, current: DbState): Delta {
  const puts: Delta["puts"] = [];
  for (const n of preview.nodes) puts.push({ table: "nodes" as Table, key: n.id, record: n });
  for (const e of preview.edges) puts.push({ table: "edges" as Table, key: e.id, record: e });
  for (const v of preview.evidence) puts.push({ table: "evidence" as Table, key: v.id, record: v });
  return { expectedRevision: current.meta.revision, puts };
}

export interface OperationalImport {
  table: SystemTable;
  rows: SystemRow[];
}

/** Operational rows are mutable state, not canonical knowledge: they are merged by id on approval. */
export async function readOperational(data: ArrayBuffer | Blob): Promise<OperationalImport[]> {
  const zip = await JSZip.loadAsync(data);
  const operational = (await readJson<Record<string, SystemRow[]>>(zip, "operational.json")) ?? {};
  return SYSTEM_TABLES.filter((t) => Array.isArray(operational[t])).map((t) => ({ table: t, rows: (operational[t] ?? []).filter((r) => r && typeof r.id === "string") }));
}

// ---------------------------------------------------------------------------------------------
// The spec a model can follow to produce a valid pack
// ---------------------------------------------------------------------------------------------

export const GPT_PACK_SPEC = {
  format: KB_PACK_FORMAT,
  format_version: KB_PACK_VERSION,
  archive: {
    "manifest.json": "required: { format, format_version, app_version, created_at, device_id, revision, counts, tables }",
    "knowledge.json": "required: { nodes, edges, codes, evidence, changesets, receipts } keyed by id",
    "operational.json": "optional: { scheduleEvents, routineTemplates, routineOccurrences, tasks, availabilityWindows, scheduleProposals, activityActuals, scheduleAuditEvents, projects, pclProgress, spatialOverrides, sideQuests }",
  },
  idRules: {
    prefixes: ["ATH-DISC-", "ATH-DOM-", "ATH-FAM-", "ATH-SKILL-", "ATH-SUB-", "ATH-OBJ-", "ATH-UNIT-", "ATH-ASMT-", "ATH-CON-", "ATH-MICRO-", "ATH-EDGE-", "ATH-XFER-"],
    rule: "Every node.code starts with one of these prefixes. Never renumber an existing record; add a new code.",
  },
  objectTypes: {
    discipline: "star",
    domain: "planet",
    skill_family: "constellation",
    skill: "moon",
    subskill: "satellite",
    micro_skill: "asteroid",
    concept: "attached knowledge marker",
    learning_objective: "attached outcome marker",
    learning_unit: "expedition route",
    assessment: "performance beacon",
    resource: "probe beacon",
    project: "cross-discipline trajectory",
  },
  relations: ["CONTAINS", "PREREQUISITE_FOR", "SUPPORTS", "RELATED_TO", "TRANSFER_TO"],
  rules: [
    "A project is not a discipline, a resource is not a skill, and evidence is not knowledge.",
    "CONTAINS is structural. Only PREREQUISITE_FOR with gating='hard' can lock a path, and it must carry a justification.",
    "Evidence is append-only: never rewrite an evidence id.",
    "A draft record stays draft. Do not mark anything approved or mastered.",
    "Do not claim test results, learner evidence, revenue or validation.",
  ],
  minimalNode: {
    id: "uuid",
    code: "ATH-SKILL-EXAMPLE",
    object_type: "skill",
    title: "Example capability",
    status: "draft",
    owner_discipline_id: "ATH-DISC-MATH",
    body: {},
  },
} as const;

export function packSpecText(): string {
  return JSON.stringify(GPT_PACK_SPEC, null, 2);
}

// ---------------------------------------------------------------------------------------------
// GitHub direct push
// ---------------------------------------------------------------------------------------------

export interface GithubTarget {
  owner: string;
  repo: string;
  branch: string;
  path: string;
  token: string;
}

function utf8ToBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  return btoa(binary);
}

/**
 * PUT /repos/{owner}/{repo}/contents/{path}. Resolves the current SHA first so an existing file is
 * updated rather than rejected. The token is used for this request only and is never stored.
 */
export async function pushSnapshot(target: GithubTarget, content: string): Promise<{ sha: string; url: string | null; created: boolean }> {
  if (!target.token.trim()) throw new Error("A fine-grained token with contents:write is required.");
  const api = `https://api.github.com/repos/${encodeURIComponent(target.owner)}/${encodeURIComponent(target.repo)}/contents/${target.path.split("/").map(encodeURIComponent).join("/")}`;
  const headers = { Authorization: `Bearer ${target.token.trim()}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
  let sha: string | null = null;
  const head = await fetch(`${api}?ref=${encodeURIComponent(target.branch)}`, { headers });
  if (head.ok) {
    const body = (await head.json()) as { sha?: string };
    sha = body.sha ?? null;
  } else if (head.status !== 404) {
    throw new Error(`GitHub refused the lookup (${head.status}). Check the repository, branch and token scope.`);
  }
  const put = await fetch(api, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `ATHENA KB snapshot ${new Date().toISOString()}`,
      content: utf8ToBase64(content),
      branch: target.branch,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!put.ok) {
    const text = await put.text();
    throw new Error(`GitHub rejected the push (${put.status}): ${text.slice(0, 200)}`);
  }
  const result = (await put.json()) as { content?: { sha?: string; html_url?: string } };
  return { sha: result.content?.sha ?? "", url: result.content?.html_url ?? null, created: !sha };
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
