// Routine engine. A routine is a plan, not a score: it orders work that already exists in the store
// from what the evidence says is most useful next — revision first, then spaced retention, then new
// practice, then one unexplored domain. Nothing here is random and nothing is stored, so the same
// snapshot and date always produce the same routine.
import type { NodeRecord } from "../../domain/types.ts";
import {
  SKILL_TYPES,
  daysSince,
  disciplineTitle,
  isHeld,
  skillNodes,
  tierOf,
  type EngineInput,
  type Tier,
} from "./types.ts";

export const RETENTION_DAYS = 7;
export const REVIEW_DAYS = 3;

export const ROUTINE_KINDS = ["review", "retention", "practice", "explore"] as const;
export type RoutineKind = (typeof ROUTINE_KINDS)[number];

const KIND_MINUTES: Record<RoutineKind, number> = { review: 12, retention: 10, practice: 15, explore: 8 };

export interface RoutineBlock {
  id: string;
  kind: RoutineKind;
  nodeId: string;
  code: string;
  title: string;
  discipline: string | null;
  disciplineTitle: string;
  minutes: number;
  reason: string;
}

export interface Routine {
  date: string;
  targetMinutes: number;
  totalMinutes: number;
  blocks: RoutineBlock[];
  pool: Record<RoutineKind, number>;
  note: string;
}

export interface RoutineOptions {
  minutes?: number;
  discipline?: string | null;
}

const clamp = (n: number, min: number, max: number): number => Math.max(min, Math.min(max, n));

function planetHasEvidence(input: EngineInput, planet: NodeRecord): boolean {
  for (const n of Object.values(input.nodes)) {
    if (n.parent_id === planet.id && isHeld(tierOf(input, n.id))) return true;
  }
  for (const e of Object.values(input.edges)) {
    if (e.relation_type !== "SUPPORTS" || e.source_id === e.target_id) continue;
    const child = input.nodes[e.source_id];
    const parent = input.nodes[e.target_id];
    if (child && parent && parent.parent_id === planet.id && isHeld(tierOf(input, child.id))) return true;
  }
  return false;
}

export function buildRoutine(input: EngineInput, options: RoutineOptions = {}): Routine {
  const now = input.now ?? new Date();
  const targetMinutes = clamp(Math.round(options.minutes ?? 35), 10, 180);
  const discipline = options.discipline ?? null;
  const skills = skillNodes(input).filter((n) => !discipline || n.owner_discipline_id === discipline);
  const tier = (n: NodeRecord): string => tierOf(input, n.id);
  const byCode = (a: NodeRecord, b: NodeRecord): number => a.code.localeCompare(b.code);

  const review = skills
    .filter((n) => tier(n) === "needs_revision")
    .sort((a, b) => (input.lastEvidenceAt[a.id] ?? 0) - (input.lastEvidenceAt[b.id] ?? 0) || byCode(a, b));

  const retention = skills
    .filter((n) => {
      if (!isHeld(tier(n) as Tier)) return false;
      const days = daysSince(input, n.id);
      return days !== null && days >= RETENTION_DAYS;
    })
    .sort((a, b) => (input.lastEvidenceAt[a.id] ?? 0) - (input.lastEvidenceAt[b.id] ?? 0) || byCode(a, b));

  const practice = skills
    .filter((n) => tier(n) === "unassessed")
    .sort((a, b) => (a.owner_discipline_id ?? "").localeCompare(b.owner_discipline_id ?? "") || byCode(a, b));

  const explored = new Set<string>();
  for (const n of skills) {
    if (n.parent_id && isHeld(tierOf(input, n.id))) explored.add(n.parent_id);
  }
  const explorePool = Object.values(input.nodes)
    .filter((n) => (n.object_type === "domain" || n.object_type === "skill_family") && (!discipline || n.owner_discipline_id === discipline))
    .filter((p) => !explored.has(p.id) && !planetHasEvidence(input, p))
    .filter((p) => Object.values(input.nodes).some((n) => n.parent_id === p.id && SKILL_TYPES.has(n.object_type)))
    .sort((a, b) => (a.owner_discipline_id ?? "").localeCompare(b.owner_discipline_id ?? "") || byCode(a, b));

  const pool: Record<RoutineKind, number> = {
    review: review.length,
    retention: retention.length,
    practice: practice.length,
    explore: explorePool.length,
  };

  const capacity = Math.max(1, Math.floor(targetMinutes / 10));
  const takeReview = Math.min(review.length, Math.max(1, Math.round(capacity * 0.4)));
  const takeRetention = Math.min(retention.length, Math.max(1, Math.round(capacity * 0.3)));
  const takeExplore = explorePool.length > 0 && takeReview + takeRetention < capacity ? 1 : 0;
  const takePractice = Math.min(practice.length, Math.max(0, capacity - takeReview - takeRetention - takeExplore));

  const blocks: RoutineBlock[] = [];
  const push = (node: NodeRecord, kind: RoutineKind, reason: string): void => {
    blocks.push({
      id: `${kind}:${node.id}`,
      kind,
      nodeId: node.id,
      code: node.code,
      title: node.title,
      discipline: node.owner_discipline_id,
      disciplineTitle: disciplineTitle(input, node.owner_discipline_id),
      minutes: KIND_MINUTES[kind],
      reason,
    });
  };

  for (const n of review.slice(0, takeReview)) {
    const days = daysSince(input, n.id);
    push(n, "review", days === null ? "Latest scored outcome needs revision." : `Latest scored outcome needs revision · last seen ${days}d ago.`);
  }
  for (const n of retention.slice(0, takeRetention)) {
    const days = daysSince(input, n.id);
    push(n, "retention", `Last demonstrated ${days}d ago; spacing it out protects recall.`);
  }
  for (const n of practice.slice(0, takePractice)) {
    push(n, "practice", "No outcome scored yet. Practice it, then record what actually happened.");
  }
  for (const p of explorePool.slice(0, takeExplore)) {
    const count = Object.values(input.nodes).filter((n) => n.parent_id === p.id && SKILL_TYPES.has(n.object_type)).length;
    push(p, "explore", `New frontier · ${count} record${count === 1 ? "" : "s"} here, none with a scored outcome.`);
  }

  const totalMinutes = blocks.reduce((sum, b) => sum + b.minutes, 0);
  const date = now.toISOString().slice(0, 10);
  const note =
    blocks.length === 0
      ? "No practice records loaded yet. Import the bundled pack to derive a routine from the catalogue."
      : "Derived from stored evidence: revision first, then retention, then practice. A block is a suggestion, not a score.";
  return { date, targetMinutes, totalMinutes, blocks, pool, note };
}

/** Compact counts for the Today header, so the card never claims more than the pool holds. */
export function routineSummary(routine: Routine): string {
  if (routine.blocks.length === 0) return "No plan";
  return `${routine.blocks.length} block${routine.blocks.length === 1 ? "" : "s"} · ${routine.totalMinutes} min`;
}
