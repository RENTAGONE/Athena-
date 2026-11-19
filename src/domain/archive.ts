import { canonicalJson, sha256Hex } from "./canonical.ts";
import type { DbState, Table } from "./types.ts";
import { emptyState } from "./types.ts";

export const ARCHIVE_FORMAT_VERSION = 1;
export const CURRENT_SCHEMA_VERSIONS: Record<string, string> = { evidence: "0.2", archive: String(ARCHIVE_FORMAT_VERSION) };
const TABLES: Table[] = ["nodes", "edges", "codes", "evidence", "changesets", "receipts"];

export interface ArchiveManifest {
  format: "athena-archive";
  format_version: number;
  app_version: string;
  schema_versions: Record<string, string>;
  created_at: string;
  device_id: string;
  revision: number;
  counts: Record<string, number>;
}
export class ArchiveError extends Error {
  readonly reason: "malformed" | "truncated" | "checksum_mismatch" | "newer_format";
  constructor(reason: ArchiveError["reason"], message: string) {
    super(message);
    this.name = "ArchiveError";
    this.reason = reason;
  }
}

/** NDJSON: manifest line, one line per record, footer with a SHA-256 over every preceding byte. Compression is applied by the file-io adapter. */
export async function exportArchive(state: DbState, appVersion: string, createdAt: string): Promise<string> {
  const counts: Record<string, number> = {};
  const lines: string[] = [];
  for (const t of TABLES) {
    const keys = Object.keys(state[t]).sort();
    counts[t] = keys.length;
    for (const k of keys) lines.push(canonicalJson({ t, k, r: (state[t] as Record<string, unknown>)[k] }));
  }
  const manifest: ArchiveManifest = { format: "athena-archive", format_version: ARCHIVE_FORMAT_VERSION, app_version: appVersion, schema_versions: CURRENT_SCHEMA_VERSIONS, created_at: createdAt, device_id: state.meta.device_id, revision: state.meta.revision, counts };
  const body = [canonicalJson(manifest), ...lines].join("\n") + "\n";
  return body + canonicalJson({ footer: true, sha256: await sha256Hex(body) }) + "\n";
}

export async function readArchive(text: string): Promise<{ manifest: ArchiveManifest; state: DbState }> {
  const idx = text.lastIndexOf('{"footer":true');
  if (idx < 0 || !text.endsWith("\n")) throw new ArchiveError("truncated", "archive has no footer; it is truncated or not an ATHENA archive");
  const body = text.slice(0, idx);
  let footer: { sha256?: string };
  try {
    footer = JSON.parse(text.slice(idx));
  } catch {
    throw new ArchiveError("malformed", "archive footer is not valid JSON");
  }
  if ((await sha256Hex(body)) !== footer.sha256) throw new ArchiveError("checksum_mismatch", "archive checksum does not match its contents; the file was changed or damaged");
  const lines = body.split("\n").filter(Boolean);
  let manifest: ArchiveManifest;
  try {
    manifest = JSON.parse(lines[0]!) as ArchiveManifest;
  } catch {
    throw new ArchiveError("malformed", "archive manifest is not valid JSON");
  }
  if (manifest.format !== "athena-archive") throw new ArchiveError("malformed", "not an ATHENA archive");
  if (manifest.format_version > ARCHIVE_FORMAT_VERSION) throw new ArchiveError("newer_format", `archive format ${manifest.format_version} is newer than this app understands (${ARCHIVE_FORMAT_VERSION})`);
  const state = emptyState(manifest.device_id);
  state.meta.revision = manifest.revision;
  const counts: Record<string, number> = {};
  for (const line of lines.slice(1)) {
    const row = JSON.parse(line) as { t: Table; k: string; r: unknown };
    if (!TABLES.includes(row.t)) throw new ArchiveError("malformed", `unknown table '${row.t}'`);
    (state[row.t] as Record<string, unknown>)[row.k] = row.r;
    counts[row.t] = (counts[row.t] ?? 0) + 1;
  }
  for (const t of TABLES) if ((counts[t] ?? 0) !== (manifest.counts[t] ?? 0)) throw new ArchiveError("truncated", `table '${t}' has ${counts[t] ?? 0} records, manifest says ${manifest.counts[t] ?? 0}`);
  return { manifest, state };
}

export interface MigrationStep {
  type: string;
  from: string;
  to: string;
  effect: string;
}
/** Dry run only: reports what a migration would do, writes nothing. */
export function previewMigration(manifest: ArchiveManifest): { steps: MigrationStep[]; needed: boolean } {
  const steps: MigrationStep[] = [];
  const ev = manifest.schema_versions["evidence"] ?? "0.1";
  if (ev !== CURRENT_SCHEMA_VERSIONS["evidence"]) {
    steps.push({ type: "evidence", from: ev, to: "0.2", effect: "records without outcome_schema_version stay as they are and are classified outcome-unscored; no evidence is rewritten" });
  }
  return { steps, needed: steps.length > 0 };
}
