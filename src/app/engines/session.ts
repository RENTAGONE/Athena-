// Lesson engine. Turns one imported record into a session: the protocol steps it ships with, retrieval
// prompts built from fields that actually exist, the prerequisites to check first, and the evidence
// classes the record accepts. No question is invented and no answer is graded here.
import type { NodeRecord, PackageReceipt } from "../../domain/types.ts";
import { prerequisitesOf } from "./path.ts";
import { isHeld, tierOf, type EngineInput, type Tier } from "./types.ts";

export interface LessonPrompt {
  question: string;
  /** The imported text the learner can compare against after answering; null when the record has none. */
  reference: string | null;
}

export interface LessonPlan {
  node: NodeRecord;
  minutes: number;
  objective: string | null;
  successCriteria: string | null;
  protocol: string[];
  prompts: LessonPrompt[];
  evidenceClasses: string[];
  prerequisites: { node: NodeRecord; tier: Tier; held: boolean }[];
  related: { node: NodeRecord; relation: string; tier: Tier }[];
  hasProtocol: boolean;
}

const asString = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v.trim() : null);

const FALLBACK_PROTOCOL = [
  "Read the outcome statement and say what a finished attempt would look like.",
  "Work one item without notes, hints or help.",
  "Explain the result out loud, including the part you were unsure of.",
  "Record what actually happened — not what you hoped would happen.",
];

const FALLBACK_CLASSES = ["RETRIEVAL", "EXPLANATION", "PROBLEM_PERFORMANCE", "PRACTICAL_DEMONSTRATION"];

export function buildLesson(input: EngineInput, nodeId: string): LessonPlan | null {
  const node = input.nodes[nodeId];
  if (!node) return null;

  const raw = node.body["practice_protocol"];
  const steps: string[] = [];
  if (raw && typeof raw === "object" && Array.isArray((raw as Record<string, unknown>)["steps"])) {
    for (const s of (raw as Record<string, unknown>)["steps"] as unknown[]) {
      const text = asString(s);
      if (text) steps.push(text);
    }
  }
  const protocol = steps.length > 0 ? steps.slice(0, 10) : FALLBACK_PROTOCOL;

  const evidenceRaw = node.body["evidence_types"];
  const classes = Array.isArray(evidenceRaw)
    ? (evidenceRaw as unknown[]).map(asString).filter((x): x is string => !!x && x !== "SELF_REPORT")
    : [];
  const evidenceClasses = classes.length > 0 ? classes : FALLBACK_CLASSES;

  const minutesRaw = node.body["time_to_initial_competence_minutes"];
  const minutes = typeof minutesRaw === "number" && Number.isFinite(minutesRaw) ? Math.max(10, Math.min(60, Math.round(minutesRaw))) : 20;

  const definition = asString(node.body["definition"]);
  const outcome = asString(node.body["outcome_statement"]);
  const criteria = asString(node.body["success_criteria"]);
  const mastery = asString(node.body["mastery_criteria"]);

  const prompts: LessonPrompt[] = [];
  if (definition) prompts.push({ question: "Without notes, define this in one sentence.", reference: definition });
  if (outcome) prompts.push({ question: "What would count as a demonstration here?", reference: outcome });
  if (criteria) prompts.push({ question: "Which success criterion is hardest for you, and why?", reference: criteria });
  if (mastery) prompts.push({ question: "What would you need to show more than once, on a later day, to call this mastered?", reference: mastery });
  if (prompts.length === 0) prompts.push({ question: "What did you do, and what was hard about it?", reference: null });

  const prerequisites = prerequisitesOf(input, node.id).map((p) => ({
    node: p,
    tier: tierOf(input, p.id),
    held: isHeld(tierOf(input, p.id)),
  }));

  const related: LessonPlan["related"] = [];
  for (const e of Object.values(input.edges)) {
    if (e.relation_type === "PREREQUISITE_FOR" || e.relation_type === "CONTAINS") continue;
    if (e.source_id !== node.id && e.target_id !== node.id) continue;
    const other = input.nodes[e.source_id === node.id ? e.target_id : e.source_id];
    if (!other || related.some((r) => r.node.id === other.id)) continue;
    related.push({ node: other, relation: e.relation_type, tier: tierOf(input, other.id) });
  }

  return {
    node,
    minutes,
    objective: outcome ?? definition,
    successCriteria: criteria,
    protocol,
    prompts,
    evidenceClasses,
    prerequisites,
    related: related.slice(0, 8),
    hasProtocol: steps.length > 0,
  };
}

export interface ImportNotice {
  packageId: string;
  state: PackageReceipt["state"];
  at: string;
  summary: Record<string, number>;
}

/** Receipts that need a decision, newest first. Used by the Inbox. */
export function importNotices(receipts: Record<string, PackageReceipt>, limit = 3): ImportNotice[] {
  return Object.values(receipts)
    .filter((r) => r.state === "rejected" || r.state === "failed")
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, limit)
    .map((r) => ({ packageId: r.package_id, state: r.state, at: r.at, summary: r.summary }));
}
