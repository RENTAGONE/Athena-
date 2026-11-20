// Inbox engine. There is no message table: every item is derived from records, evidence and import
// receipts that already exist. An empty inbox means the store genuinely has nothing waiting — not
// that a feed has not loaded.
import type { PackageReceipt } from "../../domain/types.ts";
import { importNotices } from "./session.ts";
import { RETENTION_DAYS, REVIEW_DAYS } from "./routine.ts";
import { daysSince, disciplineTitle, isHeld, tierOf, type EngineInput } from "./types.ts";

export type InboxKind = "safety" | "import" | "revision" | "retention" | "draft";
export type InboxTone = "red" | "amber" | "teal" | "violet" | "muted";

export interface InboxItem {
  id: string;
  kind: InboxKind;
  tone: InboxTone;
  title: string;
  detail: string;
  href: string;
  meta: string;
}

export interface Inbox {
  items: InboxItem[];
  counts: Record<InboxKind, number>;
  note: string;
}

const ORDER: InboxKind[] = ["safety", "import", "revision", "retention", "draft"];
const TONE: Record<InboxKind, InboxTone> = { safety: "red", import: "amber", revision: "amber", retention: "teal", draft: "violet" };

export function buildInbox(input: EngineInput, receipts: Record<string, PackageReceipt> = {}): Inbox {
  const counts: Record<InboxKind, number> = { safety: 0, import: 0, revision: 0, retention: 0, draft: 0 };
  const items: InboxItem[] = [];

  for (const n of Object.values(input.nodes)) {
    const flagged = n.body["review_required_before_approval"] === true;
    if (!flagged || n.status === "approved") continue;
    counts.safety += 1;
    if (counts.safety > 4) continue;
    items.push({
      id: `safety:${n.id}`,
      kind: "safety",
      tone: TONE.safety,
      title: n.title,
      detail: "The package marks this record as needing human review before approval. It stays draft until someone checks it.",
      href: `#/knowledge/${encodeURIComponent(n.code)}`,
      meta: `${n.code} · ${disciplineTitle(input, n.owner_discipline_id)}`,
    });
  }

  for (const notice of importNotices(receipts)) {
    counts.import += 1;
    items.push({
      id: `import:${notice.packageId}`,
      kind: "import",
      tone: TONE.import,
      title: `Import ${notice.state}`,
      detail: `Package ${notice.packageId} did not commit. Nothing from it was written. Open Studio to preview it again.`,
      href: "#/studio/updates",
      meta: new Date(notice.at).toLocaleString(),
    });
  }

  const revision = Object.values(input.nodes)
    .filter((n) => tierOf(input, n.id) === "needs_revision")
    .sort((a, b) => (input.lastEvidenceAt[a.id] ?? 0) - (input.lastEvidenceAt[b.id] ?? 0));
  for (const n of revision) {
    counts.revision += 1;
    if (counts.revision > 5) continue;
    const days = daysSince(input, n.id);
    items.push({
      id: `revision:${n.id}`,
      kind: "revision",
      tone: TONE.revision,
      title: n.title,
      detail: `Latest scored outcome was not a demonstration${days === null ? "" : ` · ${days}d ago`}. Retry it once, without notes.`,
      href: `#/learn/${encodeURIComponent(n.code)}`,
      meta: `${n.code} · ${disciplineTitle(input, n.owner_discipline_id)}`,
    });
  }

  const retention = Object.values(input.nodes)
    .filter((n) => {
      const tier = tierOf(input, n.id);
      if (!isHeld(tier)) return false;
      const days = daysSince(input, n.id);
      return days !== null && days >= RETENTION_DAYS;
    })
    .sort((a, b) => (input.lastEvidenceAt[a.id] ?? 0) - (input.lastEvidenceAt[b.id] ?? 0));
  for (const n of retention) {
    counts.retention += 1;
    if (counts.retention > 4) continue;
    const days = daysSince(input, n.id);
    items.push({
      id: `retention:${n.id}`,
      kind: "retention",
      tone: TONE.retention,
      title: n.title,
      detail: `Demonstrated ${days}d ago. One delayed attempt keeps it honest.`,
      href: `#/learn/${encodeURIComponent(n.code)}`,
      meta: `${n.code} · ${disciplineTitle(input, n.owner_discipline_id)}`,
    });
  }

  const draft = Object.values(input.nodes).filter((n) => n.status === "draft").length;
  if (draft > 0) {
    counts.draft = draft;
    items.push({
      id: "draft:all",
      kind: "draft",
      tone: TONE.draft,
      title: `${draft.toLocaleString()} draft record${draft === 1 ? "" : "s"}`,
      detail: "Draft records are readable but not approved. Review the package in Studio to change that.",
      href: "#/studio/updates",
      meta: "Knowledge base",
    });
  }

  items.sort((a, b) => ORDER.indexOf(a.kind) - ORDER.indexOf(b.kind));
  const note =
    items.length === 0
      ? "Nothing is waiting. Review items appear only from scored evidence, imports and unanswered review flags."
      : "Every item is derived from your own store. Opening an item does not clear it; recording an outcome does.";
  return { items, counts, note };
}

/** How many records the spaced-retention rule considers due, for the Today card. */
export function dueForReview(input: EngineInput): number {
  return Object.values(input.nodes).filter((n) => {
    const days = daysSince(input, n.id);
    const tier = tierOf(input, n.id);
    return days !== null && (tier === "needs_revision" ? days >= REVIEW_DAYS : isHeld(tier) && days >= RETENTION_DAYS);
  }).length;
}
