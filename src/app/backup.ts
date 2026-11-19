import { exportArchive, readArchive, type ArchiveManifest } from "../domain/archive.ts";
import { checkIntegrity } from "../domain/integrity.ts";
import { contentHash, MemoryStore } from "../domain/store.ts";
import { sha256Hex } from "../domain/canonical.ts";
import type { DbState, Issue } from "../domain/types.ts";

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const out = new Blob([bytes as BlobPart]).stream().pipeThrough(stream);
  return new Uint8Array(await new Response(out).arrayBuffer());
}
export const APP_VERSION = "0.1.0";

export interface BackupFile {
  bytes: Uint8Array;
  fileName: string;
  sha256: string;
  manifest: ArchiveManifest;
}
/** gzip-compressed NDJSON archive. The SHA-256 shown to the learner is over the compressed file; the archive also carries its own internal checksum. */
export async function createBackup(state: DbState, now: Date): Promise<BackupFile> {
  const integrity = checkIntegrity(state);
  if (integrity.length) throw new Error(`refusing to export a database with ${integrity.length} integrity problem(s): ${integrity[0]!.message}`);
  const text = await exportArchive(state, APP_VERSION, now.toISOString());
  const bytes = await pipe(new TextEncoder().encode(text), new CompressionStream("gzip"));
  const { manifest } = await readArchive(text);
  const stamp = now.toISOString().replace(/[-:]/g, "").slice(0, 13);
  return { bytes, fileName: `athena-backup-${stamp}.athena.gz`, sha256: await sha256Hex(Array.from(bytes, (b) => String.fromCharCode(b)).join("")), manifest };
}

export interface RestoreCheck {
  ok: boolean;
  manifest: ArchiveManifest | null;
  issues: Issue[];
  counts: Record<string, number>;
  contentHash: string | null;
  message: string;
}
/** Reads a backup into a scratch in-memory store. Never touches the real database. */
export async function scratchRestoreCheck(bytes: Uint8Array): Promise<RestoreCheck> {
  try {
    const isGzip = bytes[0] === 0x1f && bytes[1] === 0x8b;
    const raw = isGzip ? await pipe(bytes, new DecompressionStream("gzip")) : bytes;
    const { manifest, state } = await readArchive(new TextDecoder().decode(raw));
    const scratch = new MemoryStore(state);
    const loaded = await scratch.load();
    const issues = checkIntegrity(loaded);
    const counts = Object.fromEntries(Object.entries(manifest.counts));
    return { ok: issues.length === 0, manifest, issues, counts, contentHash: await contentHash(loaded), message: issues.length ? `${issues.length} integrity problem(s) found in the scratch copy` : "Archive checksum matches and every reference resolves in a scratch copy. Your real data was not touched." };
  } catch (e) {
    return { ok: false, manifest: null, issues: [], counts: {}, contentHash: null, message: (e as Error).message };
  }
}
export async function shareOrDownload(file: BackupFile): Promise<"shared" | "downloaded" | "cancelled"> {
  const f = new File([file.bytes as BlobPart], file.fileName, { type: "application/gzip" });
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.canShare?.({ files: [f] })) {
    try {
      await nav.share({ files: [f], title: "ATHENA backup" });
      return "shared";
    } catch (e) {
      if ((e as DOMException).name === "AbortError") return "cancelled";
    }
  }
  const url = URL.createObjectURL(f);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
  return "downloaded";
}
