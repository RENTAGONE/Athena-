import { canonicalJson, sha256Hex } from "../domain/canonical.ts";
import type { ExchangeValidator } from "../domain/validator.ts";
import { RelationRegistry, NamespaceRegistry, namespaceOf, isAthenaCode, isReservedEdgeCode, parseCode } from "../domain/registries.ts";
import { looksLikeUuid, type IdGen } from "../domain/ids.ts";
import { findCycle } from "../domain/graph.ts";
import { validateEvidenceSemantics, toStoredEvidence, type ExchangeEvidence } from "../domain/evidence.ts";
import { toDelta, withDerivedCaches } from "../domain/changeset.ts";
import { RevisionConflict, type Store } from "../domain/store.ts";
import type { ChangeOp, ChangeSet, CodeEntry, DbState, EdgeRecord, Issue, NodeRecord, PackageReceipt, Provenance } from "../domain/types.ts";

type Rec = Record<string, unknown>;
export interface ExchangePackage {
  athena_package: string;
  package_id: string;
  generated_by: { tool: string; model?: string; generated_at?: string };
  is_sample?: boolean;
  disciplines?: Rec[];
  nodes?: Rec[];
  micro_skills?: Rec[];
  contexts?: Rec[];
  relationships?: Rec[];
  transfer_links?: Rec[];
  evidence?: Rec[];
}
export interface ImportDeps {
  validator: ExchangeValidator;
  relations: RelationRegistry;
  namespaces: NamespaceRegistry;
  ids: IdGen;
  now: () => string;
}
export interface PlannedItem {
  action: "create" | "update" | "noop";
  table: "nodes" | "edges" | "evidence";
  code: string | null;
  label: string;
  /** For updates: the exchange fields whose values differ from the stored record. */
  changes?: string[];
}
export interface ImportPlan {
  ok: boolean;
  issues: Issue[];
  items: PlannedItem[];
  packageHash: string;
  baseRevision: number;
  alreadyCommitted: boolean;
  /** Internal: intents, materialised into UUIDs only at commit. */
  pkg: ExchangePackage | null;
}

const MAX_CHARS = 5_000_000;
const ENVELOPE_KEYS = new Set(["athena_package", "package_id", "generated_by", "is_sample", "disciplines", "nodes", "micro_skills", "contexts", "relationships", "transfer_links", "evidence"]);
const UNTRUSTED_ID_FIELDS = ["internal_id", "uuid", "_id", "db_id", "uid"];
const NODE_SCHEMA: Record<string, string> = {
  domain: "DOMAIN_RECORD", skill_family: "SKILL_FAMILY_RECORD", skill: "SKILL_RECORD", subskill: "SUBSKILL_RECORD",
  learning_objective: "LEARNING_OBJECTIVE", learning_unit: "LEARNING_UNIT", assessment: "ASSESSMENT", context: "CONTEXT_RECORD",
  resource: "RESOURCE_RECORD", project: "PROJECT_RECORD", milestone: "MILESTONE_RECORD", practice_protocol: "PRACTICE_PROTOCOL",
};
/** Foundation-seed concepts and objective stubs use their own schema when record_stage is present. */
const FOUNDATION_SCHEMA = "FOUNDATION_SEED_NODE";

export function parsePackage(text: string): { pkg: ExchangePackage | null; issues: Issue[] } {
  const issues: Issue[] = [];
  const fail = (code: string, message: string): { pkg: null; issues: Issue[] } => ({ pkg: null, issues: [...issues, { severity: "error", code, path: "$", message }] });
  if (text.length > MAX_CHARS) return fail("package_too_large", `package exceeds ${MAX_CHARS} characters`);
  let body = text.trim();
  const fence = /^```(?:json)?\s*\n([\s\S]*?)\n```$/.exec(body); // chat tools often wrap JSON in one code fence
  if (fence) body = fence[1]!;
  let data: unknown;
  try {
    data = JSON.parse(body);
  } catch (e) {
    return fail("not_json", `package is not valid JSON: ${(e as Error).message}`);
  }
  if (data === null || typeof data !== "object" || Array.isArray(data)) return fail("not_object", "package must be a JSON object");
  if (hasProtoKey(data)) return fail("forbidden_key", "package contains a '__proto__' key");
  const o = data as Rec;
  for (const k of Object.keys(o)) if (!ENVELOPE_KEYS.has(k)) issues.push({ severity: "error", code: "unknown_envelope_key", path: `$.${k}`, message: `unknown top-level key '${k}'` });
  if (o["athena_package"] !== "0.1") issues.push({ severity: "error", code: "unsupported_package_version", path: "$.athena_package", message: "athena_package must be '0.1'" });
  if (typeof o["package_id"] !== "string" || !o["package_id"]) issues.push({ severity: "error", code: "missing_package_id", path: "$.package_id", message: "package_id is required" });
  const gb = o["generated_by"] as Rec | undefined;
  if (!gb || typeof gb["tool"] !== "string") issues.push({ severity: "error", code: "missing_generated_by", path: "$.generated_by", message: "generated_by.tool is required" });
  if (issues.some((i) => i.severity === "error")) return { pkg: null, issues };
  return { pkg: o as unknown as ExchangePackage, issues };
}
function hasProtoKey(v: unknown): boolean {
  if (Array.isArray(v)) return v.some(hasProtoKey);
  if (v && typeof v === "object") return Object.keys(v).some((k) => k === "__proto__" || hasProtoKey((v as Rec)[k]));
  return false;
}

interface Wanted {
  code: string;
  kind: "discipline" | "node" | "micro" | "context";
  rec: Rec;
  objectType: string;
  owner: string | null;
  path: string;
}
interface WantedEdge {
  rec: Rec;
  code: string | null;
  type: string;
  src: string;
  tgt: string;
  owner: string | null;
  path: string;
  implied: boolean;
}
const s = (v: unknown): string | null => (typeof v === "string" && v ? v : null);
/** A micro-skill has no owner field in its schema; its first discipline link is where it is indexed (N-14). */
function microOwner(rec: Rec, kind: "discipline" | "node" | "micro" | "context"): string | null {
  const explicit = s(rec["owner_discipline_id"]);
  if (explicit || kind !== "micro") return explicit;
  const links = (rec["discipline_links"] as unknown[] | undefined) ?? [];
  return links.map((x) => s(x)).find((x): x is string => x !== null) ?? null;
}

/** Normalises embedded convenience links into edge records (G-08). Explicit edges always win over implied ones. */
function impliedEdges(w: Wanted): WantedEdge[] {
  const r = w.rec;
  const out: WantedEdge[] = [];
  const add = (type: string, src: string, tgt: string, extra: Rec = {}): void =>
    void out.push({ rec: { relation_type: type, status: "draft", gating: "none", strength: null, content_version: 1, rationale: "derived from an embedded link in the exchange record", ...extra }, code: null, type, src, tgt, owner: w.owner, path: `${w.path}`, implied: true });
  if (w.kind === "node") {
    const parent = s(r["parent_skill_id"]) ?? s(r["skill_family_id"]) ?? s(r["parent_id"]) ?? s(r["primary_domain_id"]) ?? (Array.isArray(r["domain_ids"]) ? s((r["domain_ids"] as unknown[])[0]) : null);
    if (parent && parent !== w.code) add("CONTAINS", parent, w.code);
    if (Array.isArray(r["prerequisite_ids"])) for (const p of r["prerequisite_ids"] as unknown[]) if (typeof p === "string") add("PREREQUISITE_FOR", p, w.code, { strength: "recommended" });
  }
  if (w.kind === "micro") {
    for (const sk of (r["skill_links"] as unknown[] | undefined) ?? []) if (typeof sk === "string") add("SUPPORTS", w.code, sk);
    for (const p of (r["prerequisites"] as unknown[] | undefined) ?? []) if (typeof p === "string") add("PREREQUISITE_FOR", p, w.code, { strength: "recommended" });
  }
  return out;
}

export async function buildPlan(state: DbState, pkg: ExchangePackage, deps: ImportDeps): Promise<ImportPlan> {
  const issues: Issue[] = [];
  const err = (code: string, path: string, message: string): void => void issues.push({ severity: "error", code, path, message });
  const packageHash = await sha256Hex(canonicalJson(pkg));
  const receipt = state.receipts[pkg.package_id];
  if (receipt && receipt.state === "committed" && receipt.package_hash === packageHash) {
    return { ok: true, issues: [{ severity: "info", code: "already_committed", path: "$", message: "this exact package was already committed; importing it again changes nothing" }], items: [], packageHash, baseRevision: state.meta.revision, alreadyCommitted: true, pkg };
  }
  if (receipt && receipt.state === "committed" && receipt.package_hash !== packageHash) err("package_id_reused", "$.package_id", "package_id was committed before with different content");

  // 1. Collect wanted nodes.
  const wanted: Wanted[] = [];
  const pushW = (list: Rec[] | undefined, kind: Wanted["kind"], listName: string): void =>
    (list ?? []).forEach((rec, i) => {
      const path = `$.${listName}[${i}]`;
      const code = s(rec["id"]);
      if (!code) return void err("missing_id", `${path}.id`, "record has no id");
      const objectType = kind === "micro" ? "micro_skill" : kind === "discipline" ? "discipline" : (s(rec["object_type"]) ?? "");
      const owner = kind === "discipline" ? code : microOwner(rec, kind);
      wanted.push({ code, kind, rec, objectType, owner, path });
    });
  pushW(pkg.disciplines, "discipline", "disciplines");
  pushW(pkg.nodes, "node", "nodes");
  pushW(pkg.micro_skills, "micro", "micro_skills");
  pushW(pkg.contexts, "context", "contexts");

  const byCode = new Map<string, Wanted>();
  for (const w of wanted) {
    for (const f of UNTRUSTED_ID_FIELDS) if (f in w.rec) err("untrusted_internal_id", `${w.path}.${f}`, `'${f}' is an internal identifier; only ATHENA mints those`);
    if (looksLikeUuid(w.code)) err("untrusted_internal_id", `${w.path}.id`, "exchange ids must be ATHENA codes; UUIDs are minted by ATHENA at commit");
    else if (isReservedEdgeCode(w.code)) err("reserved_edge_code", `${w.path}.id`, "ATH-EDGE-* is reserved");
    else if (!isAthenaCode(w.code)) err("invalid_code", `${w.path}.id`, `'${w.code}' is not a valid ATHENA code`);
    const prev = byCode.get(w.code);
    if (prev) err("duplicate_code_in_package", `${w.path}.id`, `code '${w.code}' appears at both ${prev.path} and ${w.path}; no last-write-wins`);
    byCode.set(w.code, w);
    // schema
    const key = w.kind === "micro" ? "MICRO_SKILL" : w.kind === "discipline" ? null : w.rec["record_stage"] !== undefined ? FOUNDATION_SCHEMA : NODE_SCHEMA[w.objectType] ?? null;
    if (key && deps.validator.has(key)) issues.push(...deps.validator.validate(key, w.rec, w.path));
    else if (key) err("no_schema", w.path, `no exchange schema '${key}' is available`);
    else if (w.kind === "node") err("unknown_object_type", `${w.path}.object_type`, `object_type '${w.objectType}' has no exchange schema`);
    // namespace / owner
    const ns = namespaceOf(w.code);
    if (ns !== null) {
      if (!deps.namespaces.has(ns)) err("unregistered_namespace", `${w.path}.id`, `namespace '${ns}' is not registered`);
      else if (w.owner && !deps.namespaces.ownerAllowed(ns, w.owner)) err("ownership_mismatch", `${w.path}.owner_discipline_id`, `owner '${w.owner}' is not allowed for namespace '${ns}'`);
    }
  }

  // 2. Compare with existing state.
  const items: PlannedItem[] = [];
  const nodeActions = new Map<string, "create" | "update" | "noop">();
  for (const w of wanted) {
    const entry = state.codes[w.code];
    if (!entry) {
      nodeActions.set(w.code, "create");
      continue;
    }
    if (entry.state === "tombstoned") {
      err("tombstoned_code", `${w.path}.id`, `code '${w.code}' is tombstoned and cannot be reused`);
      continue;
    }
    const existing = state.nodes[entry.id];
    if (!existing) {
      err("code_kind_conflict", `${w.path}.id`, `code '${w.code}' is registered to a non-node record`);
      continue;
    }
    if (canonicalJson(existing.body) === canonicalJson(w.rec)) nodeActions.set(w.code, "noop");
    else if (((w.rec["content_version"] as number | undefined) ?? 1) > existing.content_version) nodeActions.set(w.code, "update");
    else err("content_conflict", `${w.path}`, `code '${w.code}' exists with different content and content_version ${(w.rec["content_version"] as number | undefined) ?? 1} does not exceed ${existing.content_version}; no last-write-wins`);
  }

  // 3. Edges: explicit first, then implied.
  const edgeRecs: WantedEdge[] = [];
  const clientRefs = new Set<string>();
  const addExplicit = (list: Rec[] | undefined, name: string, schemaKey: string): void =>
    (list ?? []).forEach((rec, i) => {
      const path = `$.${name}[${i}]`;
      for (const f of UNTRUSTED_ID_FIELDS) if (f in rec) err("untrusted_internal_id", `${path}.${f}`, `'${f}' is an internal identifier; only ATHENA mints those`);
      const code = s(rec["id"]);
      if (code && isReservedEdgeCode(code)) err("reserved_edge_code", `${path}.id`, "ATH-EDGE-* is reserved; structural edges have no permanent code");
      const cr = s(rec["client_ref"]);
      if (cr) {
        if (isReservedEdgeCode(cr)) err("reserved_edge_code", `${path}.client_ref`, "client_ref must not use the ATH-EDGE-* namespace");
        if (clientRefs.has(cr)) err("duplicate_client_ref", `${path}.client_ref`, `client_ref '${cr}' is used twice in this package`);
        clientRefs.add(cr);
      }
      if (deps.validator.has(schemaKey)) issues.push(...deps.validator.validate(schemaKey, rec, path));
      const type = s(rec["relation_type"]) ?? "";
      const src = s(rec["source_id"]) ?? "";
      const tgt = s(rec["target_id"]) ?? "";
      edgeRecs.push({ rec, code: schemaKey === "TRANSFER_LINK" ? code : null, type, src, tgt, owner: s(rec["owner_discipline_id"]), path, implied: false });
    });
  addExplicit(pkg.relationships, "relationships", "KNOWLEDGE_RELATIONSHIP");
  addExplicit(pkg.transfer_links, "transfer_links", "TRANSFER_LINK");
  const seenKeys = new Set(edgeRecs.map((e) => `${e.type}|${e.src}|${e.tgt}`));
  for (const w of wanted) {
    for (const e of impliedEdges(w)) {
      const k = `${e.type}|${e.src}|${e.tgt}`;
      if (!seenKeys.has(k)) {
        seenKeys.add(k);
        edgeRecs.push(e);
      }
    }
  }

  // 4. Resolve references and run semantic rules on edges.
  const typeOf = (code: string): string | null => {
    const w = byCode.get(code);
    if (w) return w.objectType;
    const e = state.codes[code];
    return e && e.state === "active" ? (state.nodes[e.id]?.object_type ?? null) : null;
  };
  const ownerOf = (code: string): string | null => {
    const w = byCode.get(code);
    if (w) return w.owner;
    const e = state.codes[code];
    return e ? (state.nodes[e.id]?.owner_discipline_id ?? null) : null;
  };
  const resolvable = (code: string, path: string): boolean => {
    if (byCode.has(code)) return true;
    const e = state.codes[code];
    if (!e) return void err("dangling_reference", path, `'${code}' does not exist in the database or this package`), false;
    if (e.state === "tombstoned" || state.nodes[e.id]?.status === "archived") return void err("tombstoned_reference", path, `'${code}' is tombstoned or archived; an explicit migration is required`), false;
    return true;
  };
  const idToCode = new Map(Object.values(state.codes).map((c) => [c.id, c.code]));
  const hardPairs: [string, string][] = [];
  const containsParents = new Map<string, Set<string>>();
  const containsPairs: [string, string][] = [];
  for (const e of Object.values(state.edges)) {
    if (e.status === "archived") continue;
    const a = idToCode.get(e.source_id);
    const b = idToCode.get(e.target_id);
    if (!a || !b) continue;
    if (e.relation_type === "PREREQUISITE_FOR" && e.gating === "hard") hardPairs.push([a, b]);
    if (e.relation_type === "CONTAINS") {
      containsPairs.push([a, b]);
      containsParents.set(b, (containsParents.get(b) ?? new Set()).add(a));
    }
  }
  for (const e of edgeRecs) {
    const rt = deps.relations.get(e.type);
    if (!rt) {
      err("unknown_relation_type", `${e.path}.relation_type`, `relation type '${e.type}' is not in the relation registry`);
      continue;
    }
    const okS = resolvable(e.src, `${e.path}.source_id`);
    const okT = resolvable(e.tgt, `${e.path}.target_id`);
    if (okS && okT) {
      const ts = typeOf(e.src);
      const tt = typeOf(e.tgt);
      if (ts && !rt.allowed_source_types.includes(ts)) err("invalid_endpoint_type", `${e.path}.source_id`, `${e.type} may not start at a ${ts}`);
      if (tt && !rt.allowed_target_types.includes(tt)) err("invalid_endpoint_type", `${e.path}.target_id`, `${e.type} may not end at a ${tt}`);
      if (e.type === "CONTAINS") {
        const po = ownerOf(e.src);
        const co = ownerOf(e.tgt);
        if (po && co && po !== co) err("ownership_mismatch", `${e.path}`, `contained record owner '${co}' disagrees with its parent's owner '${po}'`);
      }
    }
    const gating = (e.rec["gating"] as string | undefined) ?? "none";
    if (gating !== "none" && !rt.gating_allowed) err("gating_not_allowed", `${e.path}.gating`, `${e.type} cannot be gated`);
    if (gating === "hard") {
      if (e.type !== "PREREQUISITE_FOR") err("gating_not_allowed", `${e.path}.gating`, "only PREREQUISITE_FOR may be hard-gated");
      if (e.rec["strength"] !== "required" || !s(e.rec["hard_gate_justification"])) err("hard_gate_unjustified", `${e.path}`, "a hard gate needs strength 'required' and a hard_gate_justification");
      hardPairs.push([e.src, e.tgt]);
    }
  }
  for (const e of edgeRecs) {
    if (e.type !== "CONTAINS") continue;
    containsPairs.push([e.src, e.tgt]);
    containsParents.set(e.tgt, (containsParents.get(e.tgt) ?? new Set()).add(e.src));
  }
  for (const [child, parents] of containsParents) {
    if (parents.size > 1) err("multiple_primary_parents", "$.relationships", `'${child}' would have ${parents.size} primary CONTAINS parents (${[...parents].join(", ")}); use a typed link for cross-discipline relations`);
  }
  const containsCycle = findCycle(containsPairs);
  if (containsCycle) err("containment_cycle", "$.relationships", `containment forms a cycle: ${containsCycle.join(" -> ")}`);
  const cycle = findCycle(hardPairs);
  if (cycle) err("hard_prerequisite_cycle", "$.relationships", `hard prerequisites form a cycle: ${cycle.join(" -> ")}`);

  // 5. Evidence.
  const evList = (pkg.evidence ?? []) as unknown as ExchangeEvidence[];
  const evActions: ("create" | "noop")[] = [];
  evList.forEach((ev, i) => {
    const path = `$.evidence[${i}]`;
    if (looksLikeUuid(ev.id)) err("untrusted_internal_id", `${path}.id`, "evidence ids are minted by ATHENA");
    if (deps.validator.has("EVIDENCE_RECORD")) issues.push(...deps.validator.validate("EVIDENCE_RECORD", ev, path));
    issues.push(...validateEvidenceSemantics(ev, path));
    (ev.target_ids ?? []).forEach((t, j) => resolvable(t, `${path}.target_ids[${j}]`));
    const prior = Object.values(state.evidence).find((x) => x.body["id"] === ev.id);
    if (prior) {
      if (canonicalJson(prior.body) === canonicalJson({ ...ev, extensions: undefined })) evActions[i] = "noop";
      else err("evidence_immutable", `${path}.id`, `evidence '${ev.id}' already exists with different content; evidence is append-only, add a new record instead`);
    } else evActions[i] = "create";
  });

  // 6. Summary.
  for (const w of wanted) {
    const action = nodeActions.get(w.code) ?? "noop";
    const item: PlannedItem = { action, table: "nodes", code: w.code, label: String(w.rec["title"] ?? w.rec["name"] ?? w.code) };
    if (action === "update") {
      const old = state.nodes[state.codes[w.code]!.id]!.body;
      item.changes = [...new Set([...Object.keys(old), ...Object.keys(w.rec)])].filter((k) => canonicalJson(old[k]) !== canonicalJson(w.rec[k])).sort();
    }
    items.push(item);
  }
  const edgeByKey = new Map<string, EdgeRecord>();
  for (const ex of Object.values(state.edges)) {
    const a = idToCode.get(ex.source_id);
    const b = idToCode.get(ex.target_id);
    if (a && b) edgeByKey.set(`${ex.relation_type}|${a}|${b}`, ex);
  }
  for (const e of edgeRecs) {
    const ex = edgeByKey.get(`${e.type}|${e.src}|${e.tgt}`);
    let action: PlannedItem["action"] = "create";
    if (ex) {
      if (canonicalJson(ex.body) === canonicalJson(e.rec)) action = "noop";
      else if (((e.rec["content_version"] as number | undefined) ?? 1) > ex.content_version) action = "update";
      else err("content_conflict", e.path, `relationship ${e.type} ${e.src} -> ${e.tgt} exists with different content and content_version does not exceed ${ex.content_version}`);
    }
    items.push({ action, table: "edges", code: e.code, label: `${e.type}: ${e.src} -> ${e.tgt}${e.implied ? " (from embedded link)" : ""}` });
  }
  evList.forEach((ev, i) => items.push({ action: evActions[i] ?? "noop", table: "evidence", code: null, label: `${ev.evidence_class} on ${(ev.target_ids ?? []).join(", ")}` }));
  const ok = !issues.some((i) => i.severity === "error");
  return { ok, issues, items, packageHash, baseRevision: state.meta.revision, alreadyCommitted: false, pkg };
}

/** Materialises UUIDs and code registrations. Called only at commit, never during preview. */
export async function materialise(state: DbState, plan: ImportPlan, deps: ImportDeps): Promise<ChangeSet> {
  const pkg = plan.pkg!;
  const now = deps.now();
  const prov: Provenance = { origin: "ai_package", package_id: pkg.package_id, tool: pkg.generated_by.tool, at: now, ...(pkg.generated_by.model ? { model: pkg.generated_by.model } : {}) };
  const isSample = pkg.is_sample === true;
  const ops: ChangeOp[] = [];
  const codeToId = new Map<string, string>(Object.values(state.codes).filter((c) => c.state === "active").map((c) => [c.code, c.id]));
  const lists: [Rec[] | undefined, Wanted["kind"]][] = [[pkg.disciplines, "discipline"], [pkg.nodes, "node"], [pkg.micro_skills, "micro"], [pkg.contexts, "context"]];
  const nodeRecs: { rec: Rec; kind: Wanted["kind"] }[] = lists.flatMap(([l, k]) => (l ?? []).map((rec) => ({ rec, kind: k })));
  for (const { rec, kind } of nodeRecs) {
    const code = rec["id"] as string;
    const existingEntry = state.codes[code];
    const objectType = kind === "micro" ? "micro_skill" : kind === "discipline" ? "discipline" : String(rec["object_type"]);
    const owner = kind === "discipline" ? code : microOwner(rec, kind);
    const common = { code, object_type: objectType, title: String(rec["title"] ?? rec["name"] ?? code), status: String(rec["status"] ?? "draft").toLowerCase(), owner_discipline_id: owner, content_version: (rec["content_version"] as number | undefined) ?? 1, is_sample: isSample, extensions: {}, body: rec };
    if (!existingEntry) {
      const id = deps.ids.next();
      codeToId.set(code, id);
      const node: NodeRecord = { id, ...common, version: 1, provenance: prov, parent_id: null, discipline_ids: [], created_at: now, updated_at: now };
      const entry: CodeEntry = { code, id, kind: "node", state: "active", namespace: namespaceOf(code), issued_at: now };
      ops.push({ table: "nodes", key: id, before: null, after: node }, { table: "codes", key: code, before: null, after: entry });
    } else {
      const old = state.nodes[existingEntry.id]!;
      if (canonicalJson(old.body) === canonicalJson(rec)) continue;
      ops.push({ table: "nodes", key: old.id, before: old, after: { ...old, ...common, version: old.version + 1, provenance: prov, updated_at: now } });
    }
  }
  const resolveId = (code: string): string => codeToId.get(code)!;
  const wantedAll: Wanted[] = nodeRecs.map(({ rec, kind }) => ({ code: rec["id"] as string, kind, rec, objectType: String(rec["object_type"] ?? ""), owner: kind === "discipline" ? (rec["id"] as string) : s(rec["owner_discipline_id"]), path: "" }));
  const explicit: WantedEdge[] = [
    ...(pkg.relationships ?? []).map((rec) => ({ rec, code: null, type: String(rec["relation_type"]), src: String(rec["source_id"]), tgt: String(rec["target_id"]), owner: s(rec["owner_discipline_id"]), path: "", implied: false })),
    ...(pkg.transfer_links ?? []).map((rec) => ({ rec, code: s(rec["id"]), type: String(rec["relation_type"]), src: String(rec["source_id"]), tgt: String(rec["target_id"]), owner: s(rec["owner_discipline_id"]), path: "", implied: false })),
  ];
  const seen = new Set(explicit.map((e) => `${e.type}|${e.src}|${e.tgt}`));
  const all = [...explicit];
  for (const w of wantedAll) for (const e of impliedEdges(w)) if (!seen.has(`${e.type}|${e.src}|${e.tgt}`)) { seen.add(`${e.type}|${e.src}|${e.tgt}`); all.push(e); }
  const existingKeys = new Map(Object.values(state.edges).map((e) => [`${e.relation_type}|${e.source_id}|${e.target_id}`, e]));
  for (const e of all) {
    const src = resolveId(e.src);
    const tgt = resolveId(e.tgt);
    const found = existingKeys.get(`${e.type}|${src}|${tgt}`);
    const r = e.rec;
    if (found && canonicalJson(found.body) === canonicalJson(r)) continue;
    const base = { relation_type: e.type, source_id: src, target_id: tgt, status: String(r["status"] ?? "draft").toLowerCase(), strength: s(r["strength"]), gating: String(r["gating"] ?? "none"), owner_discipline_id: e.owner, rationale: s(r["rationale"]), hard_gate_justification: s(r["hard_gate_justification"]), content_version: (r["content_version"] as number | undefined) ?? 1, is_sample: isSample, extensions: {}, body: r };
    if (found) {
      ops.push({ table: "edges", key: found.id, before: found, after: { ...found, ...base, version: found.version + 1, provenance: prov, updated_at: now } });
      continue;
    }
    const id = deps.ids.next();
    const edge: EdgeRecord = { id, code: e.code, ...base, version: 1, provenance: prov, created_at: now, updated_at: now };
    ops.push({ table: "edges", key: id, before: null, after: edge });
    if (e.code) ops.push({ table: "codes", key: e.code, before: null, after: { code: e.code, id, kind: "edge", state: "active", namespace: null, issued_at: now } satisfies CodeEntry });
  }
  const evList = (pkg.evidence ?? []) as unknown as ExchangeEvidence[];
  for (const ev of evList) {
    if (Object.values(state.evidence).some((x) => x.body["id"] === ev.id)) continue;
    const stored = toStoredEvidence(ev, { resolve: (c) => (codeToId.has(c) ? { id: codeToId.get(c)! } : undefined), ids: deps.ids, now, provenance: prov, isSample });
    ops.push({ table: "evidence", key: stored.id, before: null, after: stored });
  }
  return { id: deps.ids.next(), kind: "import", created_at: now, approved_at: now, approved_by: "learner", package_hash: plan.packageHash, device_id: state.meta.device_id, ops };
}

export type Decision = "approve" | "reject";
export interface CommitResult {
  committed: boolean;
  changeSetId: string | null;
  issues: Issue[];
}
/** Commits (or rejects) a previewed plan. Approval is explicit; a revision conflict means someone else wrote first and the plan must be rebuilt. */
export async function commitPlan(store: Store, plan: ImportPlan, decision: Decision, deps: ImportDeps): Promise<CommitResult> {
  const state = await store.load();
  const at = deps.now();
  const receipt = (st: PackageReceipt["state"]): { table: "receipts"; key: string; record: PackageReceipt } => ({ table: "receipts", key: plan.pkg?.package_id ?? "unknown", record: { package_id: plan.pkg?.package_id ?? "unknown", package_hash: plan.packageHash, state: st, at, summary: { items: plan.items.length } } });
  if (decision === "reject") {
    await store.persist({ expectedRevision: state.meta.revision, puts: [receipt("rejected")] });
    return { committed: false, changeSetId: null, issues: [] };
  }
  if (!plan.ok) return { committed: false, changeSetId: null, issues: plan.issues };
  if (plan.alreadyCommitted) return { committed: false, changeSetId: null, issues: plan.issues };
  if (plan.items.every((i) => i.action === "noop")) return { committed: false, changeSetId: null, issues: [{ severity: "info", code: "no_changes", path: "$", message: "every record already matches the database; nothing to commit" }] };
  if (state.meta.revision !== plan.baseRevision) throw new RevisionConflict(plan.baseRevision, state.meta.revision);
  const cs = await materialise(state, plan, deps);
  if (cs.ops.length === 0) return { committed: false, changeSetId: null, issues: [{ severity: "info", code: "no_changes", path: "$", message: "nothing to commit" }] };
  const delta = withDerivedCaches(state, toDelta(state, cs));
  delta.puts.push(receipt("committed"));
  await store.persist(delta);
  return { committed: true, changeSetId: cs.id, issues: [] };
}
