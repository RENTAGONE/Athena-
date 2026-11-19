import type { EvidenceStored, Issue, OutcomeValue, Provenance } from "./types.ts";
import type { IdGen } from "./ids.ts";
import { isReservedEdgeCode } from "./registries.ts";

/** Fields a package must never carry: they would let an AI tool set competency, mastery or the learner's attestation. */
export const FORBIDDEN_EVIDENCE_FIELDS = ["mastery", "mastery_designation", "mastery_state", "competency_state", "derived_learner_state", "independence_attestation", "learner_state"];

export interface ExchangeEvidence {
  id: string;
  record_type: string;
  target_ids: string[];
  objective_ids?: string[];
  occurred_at: string;
  evidence_class: string;
  result_summary: string;
  outcome_schema_version?: string;
  outcome?: OutcomeValue;
  target_outcomes?: { target_id: string; outcome: OutcomeValue }[];
  rubric_results?: { criterion: string; result: string; met?: boolean | null }[];
  evaluator: Record<string, unknown>;
  conditions?: Record<string, unknown>;
  limitations?: string[];
  context?: string;
  [k: string]: unknown;
}

/** Semantic rules the JSON Schema cannot express (N-01, N-04). */
export function validateEvidenceSemantics(rec: ExchangeEvidence, path: string): Issue[] {
  const issues: Issue[] = [];
  const err = (code: string, sub: string, message: string): void => void issues.push({ severity: "error", code, path: `${path}${sub}`, message });
  for (const f of FORBIDDEN_EVIDENCE_FIELDS) if (f in rec) err("forbidden_field", `.${f}`, `a package cannot set '${f}'; only evidence creation and learner confirmation change competency`);
  for (const [field, arr] of [["target_ids", rec.target_ids], ["objective_ids", rec.objective_ids ?? []]] as const) {
    (arr ?? []).forEach((t, i) => {
      if (isReservedEdgeCode(t)) err("reserved_edge_code", `.${field}[${i}]`, "ATH-EDGE-* is reserved; structural edges have no permanent code");
    });
  }
  const targets = rec.target_ids ?? [];
  if (new Set(targets).size !== targets.length) err("duplicate_target", ".target_ids", "target_ids contains duplicates");
  const hasShared = rec.outcome !== undefined;
  const hasPer = rec.target_outcomes !== undefined;
  if (rec.outcome_schema_version === "0.2") {
    if (hasShared === hasPer) err("outcome_representation", "", "exactly one of 'outcome' or 'target_outcomes' is required for outcome_schema_version 0.2");
  } else if (hasShared || hasPer) {
    err("outcome_without_version", ".outcome_schema_version", "structured outcomes require outcome_schema_version '0.2'");
  }
  if (hasShared && hasPer) err("outcome_representation", "", "'outcome' and 'target_outcomes' cannot both be present");
  if (hasPer) {
    const seen = new Set<string>();
    for (const [i, o] of rec.target_outcomes!.entries()) {
      if (!targets.includes(o.target_id)) err("foreign_target_outcome", `.target_outcomes[${i}].target_id`, `'${o.target_id}' is not in target_ids`);
      if (seen.has(o.target_id)) err("duplicate_target_outcome", `.target_outcomes[${i}].target_id`, `'${o.target_id}' appears more than once`);
      seen.add(o.target_id);
    }
    for (const t of targets) if (!seen.has(t)) err("missing_target_outcome", ".target_outcomes", `no outcome for target '${t}'`);
  }
  if (rec.outcome_schema_version !== "0.2") issues.push({ severity: "info", code: "outcome_unscored", path, message: "legacy evidence without a structured outcome is parseable but outcome-unscored" });
  return issues;
}

export interface EvidenceContext {
  resolve(code: string): { id: string } | undefined;
  ids: IdGen;
  now: string;
  provenance: Provenance;
  isSample: boolean;
}
/** Exchange → storage. The attestation is always 'unknown' here: only the learner can attest, at approval time. */
export function toStoredEvidence(rec: ExchangeEvidence, ctx: EvidenceContext, itemSignature: string | null = null): EvidenceStored {
  const targetIds = rec.target_ids.map((c) => ctx.resolve(c)!.id);
  const scored = rec.outcome_schema_version === "0.2";
  const outcomes = !scored
    ? []
    : rec.outcome !== undefined
      ? rec.target_ids.map((c) => ({ target_id: ctx.resolve(c)!.id, outcome: rec.outcome! }))
      : rec.target_outcomes!.map((o) => ({ target_id: ctx.resolve(o.target_id)!.id, outcome: o.outcome }));
  const { extensions: _ignored, ...body } = rec as Record<string, unknown>;
  return {
    id: ctx.ids.next(),
    target_ids: targetIds,
    target_codes: [...rec.target_ids],
    occurred_at: rec.occurred_at,
    evidence_class: rec.evidence_class,
    result_summary: rec.result_summary,
    outcome_scored: scored,
    target_outcomes: outcomes,
    rubric_results: (rec.rubric_results ?? []).map((r) => ({ criterion: r.criterion, result: r.result, met: r.met ?? null })),
    conditions: { ...(rec.conditions ?? {}) },
    independence_attestation: "unknown",
    evaluator: { ...rec.evaluator },
    limitations: rec.limitations ?? [],
    item_signature: itemSignature,
    is_baseline: false,
    is_sample: ctx.isSample,
    provenance: ctx.provenance,
    body,
    created_at: ctx.now,
  };
}

/** N-02: independence is derived conservatively. Unknown attestation counts as assisted. */
export function deriveIndependence(ev: Pick<EvidenceStored, "independence_attestation" | "conditions">, assessmentAllowsNotes = false): "independent" | "assisted" {
  const c = ev.conditions;
  if (ev.independence_attestation !== "yes") return "assisted";
  if (c["ai_used"] === true || c["hints_used"] === true || c["collaboration_used"] === true) return "assisted";
  if (c["notes_used"] === true && !assessmentAllowsNotes) return "assisted";
  return "independent";
}
