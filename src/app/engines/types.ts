// Shared engine input. Engines are pure functions over a loaded snapshot: they never read the DOM,
// never write to the store and never invent a number. The UI supplies the mastery tiers and the last
// evidence timestamps it already derived, so every engine sees exactly what the screens see.
import type { EdgeRecord, NodeRecord } from "../../domain/types.ts";

export type Tier = "unassessed" | "needs_revision" | "demonstrated" | "mastered";

export interface EngineInput {
  nodes: Record<string, NodeRecord>;
  edges: Record<string, EdgeRecord>;
  /** node id → mastery tier, derived from stored evidence. */
  tiers: Record<string, Tier>;
  /** node id → epoch ms of the newest scored evidence, or absent when there is none. */
  lastEvidenceAt: Record<string, number>;
  now?: Date;
}

export const SKILL_TYPES = new Set(["skill", "subskill", "micro_skill"]);
export const PLANET_TYPES = new Set(["domain", "skill_family"]);
export const DAY_MS = 86_400_000;

export function tierOf(input: EngineInput, id: string): Tier {
  return input.tiers[id] ?? "unassessed";
}

/** A tier that counts as demonstrated recall for scheduling purposes. */
export function isHeld(tier: Tier): boolean {
  return tier === "demonstrated" || tier === "mastered";
}

/** Whole days since the newest scored evidence, or null when nothing was ever recorded. */
export function daysSince(input: EngineInput, id: string): number | null {
  const at = input.lastEvidenceAt[id];
  if (!at) return null;
  const now = (input.now ?? new Date()).getTime();
  return Math.max(0, Math.floor((now - at) / DAY_MS));
}

export function skillNodes(input: EngineInput): NodeRecord[] {
  return Object.values(input.nodes).filter((n) => SKILL_TYPES.has(n.object_type));
}

export function disciplineTitle(input: EngineInput, id: string | null): string {
  if (!id) return "Cross-cutting";
  return input.nodes[id]?.title ?? id.replace("ATH-DISC-", "");
}

export function evidenceTargets(input: EngineInput, nodeId: string): string[] {
  const out: string[] = [];
  for (const e of Object.values(input.edges)) {
    if (e.source_id === nodeId) out.push(e.target_id);
    else if (e.target_id === nodeId) out.push(e.source_id);
  }
  return out;
}
