import { canonicalJson, sha256Hex } from "./canonical.ts";
import { deriveIndependence } from "./evidence.ts";
import type { EvidenceStored, OutcomeValue } from "./types.ts";

export interface CompetencyProfile {
  rules_version: string;
  performance_classes: string[];
  m1_independent_demonstrations: number;
  m1_separate_days: number;
  m1_span_days: number;
  m2_distinct_item_signatures: number;
  retained_delay_days: number;
  m4_delayed_days: number;
}
/** Provisional parameters, held as data. NOT final: awaiting the learner's approval (UD-12). */
export const CONSERVATIVE_V0: CompetencyProfile = {
  rules_version: "conservative-v0",
  performance_classes: ["RETRIEVAL", "EXPLANATION", "PROBLEM_PERFORMANCE", "PRACTICAL_DEMONSTRATION", "PROJECT_ARTEFACT", "TRANSFER_PERFORMANCE", "EXTERNAL_VERIFICATION"],
  m1_independent_demonstrations: 3,
  m1_separate_days: 3,
  m1_span_days: 14,
  m2_distinct_item_signatures: 2,
  retained_delay_days: 7,
  m4_delayed_days: 14,
};

export interface ObjectiveFlags {
  retention_matters: boolean;
  transfer_matters: boolean;
  safety_critical: boolean;
}
export interface CompetencyInput {
  target_id: string;
  as_of: string;
  evidence: EvidenceStored[];
  exposed: boolean;
  practice_activity: boolean;
  self_report: "unknown" | "struggling" | "partial" | "confident";
  mastery_confirmed: boolean; // set only by the learner's explicit confirmation
  review_due_at: string | null;
  flagged_misconception: boolean;
  flags: ObjectiveFlags;
  assessment_allows_notes?: boolean;
}
export interface CompetencyState {
  id: string;
  record_type: "competency_snapshot";
  target_id: string;
  as_of: string;
  dimensions: {
    exposure: "not_exposed" | "exposed";
    self_report: "unknown" | "struggling" | "partial" | "confident";
    performance: "none" | "assisted" | "independent_partial" | "independent_demonstrated";
    retention: "unknown" | "due" | "fragile" | "retained";
    mastery: "none" | "candidate" | "confirmed" | "lapsed";
  };
  derived_learner_state: "not_exposed" | "exposed" | "practising" | "understood_provisionally" | "demonstrated" | "retained" | "mastered" | "needs_revision";
  explanation: string;
  evidence_ids: string[];
  rules_version: string;
  inputs_hash: string;
}

interface Entry {
  ev: EvidenceStored;
  outcome: OutcomeValue;
  independent: boolean;
  t: number; // ms
  day: string;
}
const DAY = 86_400_000;

/** Pure function of its input. Session minutes, completion counts and AI confidence are deliberately not parameters (safeguard S4). */
export async function deriveCompetency(input: CompetencyInput, profile: CompetencyProfile = CONSERVATIVE_V0): Promise<CompetencyState> {
  const why: string[] = [];
  const entries: Entry[] = [];
  for (const ev of input.evidence) {
    if (!ev.target_ids.includes(input.target_id)) continue;
    if (!ev.outcome_scored) continue; // legacy evidence is outcome-unscored and counts for nothing
    if (!profile.performance_classes.includes(ev.evidence_class)) continue; // SELF_REPORT never counts
    const o = ev.target_outcomes.find((x) => x.target_id === input.target_id)?.outcome;
    if (!o) continue;
    const t = Date.parse(ev.occurred_at);
    entries.push({ ev, outcome: o, independent: deriveIndependence(ev, input.assessment_allows_notes) === "independent", t, day: ev.occurred_at.slice(0, 10) });
  }
  entries.sort((a, b) => a.t - b.t);
  const indep = entries.filter((e) => e.independent);
  const indepDemo = indep.filter((e) => e.outcome === "demonstrated");
  const latestIndep = indep[indep.length - 1];

  let performance: CompetencyState["dimensions"]["performance"] = "none";
  if (indepDemo.length) performance = "independent_demonstrated";
  else if (indep.some((e) => e.outcome === "partial")) performance = "independent_partial";
  else if (entries.some((e) => e.outcome !== "not_demonstrated")) performance = "assisted";
  why.push(`performance=${performance} from ${entries.length} scored evidence record(s), ${indep.length} independent`);

  // Retention: a later independent demonstration at least N days after the first, on a different known item signature.
  const first = indepDemo[0];
  const delayed = (days: number): Entry | undefined =>
    first ? indepDemo.find((e) => e !== first && e.t - first.t >= days * DAY && e.ev.item_signature !== null && e.ev.item_signature !== first.ev.item_signature) : undefined;
  let retention: CompetencyState["dimensions"]["retention"] = "unknown";
  const lapsed = latestIndep?.outcome === "not_demonstrated";
  if (lapsed && first) retention = "fragile";
  else if (delayed(profile.retained_delay_days)) retention = "retained";
  if (input.review_due_at && Date.parse(input.review_due_at) <= Date.parse(input.as_of) && retention !== "unknown") retention = "due";
  why.push(`retention=${retention}`);

  // Mastery candidate: all clauses must hold. Novelty (M2's novel item) is not checkable: the evidence schema has no item field (see STATUS.md).
  const days = new Set(indepDemo.map((e) => e.day));
  const span = indepDemo.length ? (indepDemo[indepDemo.length - 1]!.t - indepDemo[0]!.t) / DAY : 0;
  const sigs = new Set(indepDemo.map((e) => e.ev.item_signature).filter((s): s is string => s !== null));
  const last2 = indep.slice(-2);
  const clauses: Record<string, boolean> = {
    M1: indepDemo.length >= profile.m1_independent_demonstrations && days.size >= profile.m1_separate_days && span >= profile.m1_span_days,
    M2: sigs.size >= profile.m2_distinct_item_signatures,
    M3: last2.length === 2 && last2.every((e) => e.outcome === "demonstrated" && e.ev.rubric_results.length > 0 && e.ev.rubric_results.every((r) => r.met === true)),
    M4: !input.flags.retention_matters || !!delayed(profile.m4_delayed_days),
    M5: !input.flags.transfer_matters || entries.some((e) => e.ev.evidence_class === "TRANSFER_PERFORMANCE" && e.outcome === "demonstrated" && typeof e.ev.body["context"] === "string"),
    M6: !input.flags.safety_critical || entries.some((e) => e.ev.evidence_class === "EXTERNAL_VERIFICATION" && e.outcome === "demonstrated"),
    M7: latestIndep !== undefined && latestIndep.outcome !== "not_demonstrated",
  };
  const candidateMet = Object.values(clauses).every(Boolean);
  const unmet = Object.entries(clauses).filter(([, ok]) => !ok).map(([k]) => k);
  let mastery: CompetencyState["dimensions"]["mastery"] = "none";
  if (candidateMet) mastery = input.mastery_confirmed ? "confirmed" : "candidate";
  else if (input.mastery_confirmed) mastery = "lapsed";
  why.push(candidateMet ? "mastery clauses M1-M7 met" : `mastery clauses not met: ${unmet.join(", ")}`);

  // Derived eight-state view; first match wins.
  const regressed = !!first && lapsed;
  const failedTransfer = entries.filter((e) => e.ev.evidence_class === "TRANSFER_PERFORMANCE").at(-1)?.outcome === "not_demonstrated";
  const assistedEvidence = entries.some((e) => ["EXPLANATION", "PROBLEM_PERFORMANCE", "PRACTICAL_DEMONSTRATION"].includes(e.ev.evidence_class));
  let state: CompetencyState["derived_learner_state"];
  if (regressed || input.flagged_misconception || failedTransfer) state = "needs_revision";
  else if (mastery === "confirmed") state = "mastered";
  else if (retention === "retained") state = "retained";
  else if (performance === "independent_demonstrated") state = "demonstrated";
  else if ((performance === "assisted" || performance === "independent_partial") && assistedEvidence) state = "understood_provisionally";
  else if (input.practice_activity || input.self_report === "struggling" || input.self_report === "partial") state = "practising";
  else if (input.exposed) state = "exposed";
  else state = "not_exposed";
  why.push(`state=${state}`);

  const evidenceIds = entries.map((e) => e.ev.id);
  const inputsHash = await sha256Hex(canonicalJson({ profile, evidenceIds, exposed: input.exposed, practice: input.practice_activity, self: input.self_report, mastery_confirmed: input.mastery_confirmed, due: input.review_due_at, flags: input.flags, misconception: input.flagged_misconception, as_of: input.as_of }));
  return {
    id: `competency-${input.target_id}-${inputsHash.slice(0, 12)}`,
    record_type: "competency_snapshot",
    target_id: input.target_id,
    as_of: input.as_of,
    dimensions: { exposure: input.exposed ? "exposed" : "not_exposed", self_report: input.self_report, performance, retention, mastery },
    derived_learner_state: state,
    explanation: why.join("; "),
    evidence_ids: evidenceIds,
    rules_version: profile.rules_version,
    inputs_hash: inputsHash,
  };
}
