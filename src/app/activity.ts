// Learner activity writes. Everything here appends evidence; nothing can rewrite or delete it, and no
// function in this file can set a competency state — that stays a pure derivation in domain/competency.ts.
import { DefaultIdGen } from "../domain/ids.ts";
import type { Store } from "../domain/store.ts";
import type { DbState, EvidenceStored, NodeRecord, OutcomeValue, Provenance } from "../domain/types.ts";

const ids = new DefaultIdGen();

const CLASSES = new Set([
  "RETRIEVAL",
  "EXPLANATION",
  "PROBLEM_PERFORMANCE",
  "PRACTICAL_DEMONSTRATION",
  "PROJECT_ARTEFACT",
  "TRANSFER_PERFORMANCE",
  "EXTERNAL_VERIFICATION",
]);

export interface PracticeInput {
  node: NodeRecord;
  evidenceClass: string;
  outcome: OutcomeValue;
  summary: string;
  independent: boolean;
  itemSignature: string;
  notesUsed: boolean;
  rubric: { criterion: string; result: string; met: boolean | null }[];
}

export const EVIDENCE_CLASSES = [...CLASSES];

function provenance(now: string): Provenance {
  return { origin: "learner", tool: "athena-app", at: now };
}

export function buildPracticeEvidence(input: PracticeInput, now: string = new Date().toISOString()): EvidenceStored {
  if (!CLASSES.has(input.evidenceClass)) throw new Error(`'${input.evidenceClass}' is not a scored performance class`);
  if (input.summary.trim().length < 3) throw new Error("a record needs a short description of what was done");
  return {
    id: ids.next(),
    target_ids: [input.node.id],
    target_codes: [input.node.code],
    occurred_at: now,
    evidence_class: input.evidenceClass,
    result_summary: input.summary.trim(),
    outcome_scored: true,
    target_outcomes: [{ target_id: input.node.id, outcome: input.outcome }],
    rubric_results: input.rubric.map((r) => ({ criterion: r.criterion, result: r.result, met: r.met })),
    conditions: {
      ai_used: false,
      hints_used: false,
      collaboration_used: false,
      notes_used: input.notesUsed,
      recorded_in: "learning session",
    },
    independence_attestation: input.independent ? "yes" : "no",
    evaluator: { type: "self", tool: "athena-app" },
    limitations: input.independent ? [] : ["Recorded as assisted: it counts toward practice, not mastery."],
    item_signature: input.itemSignature.trim() || null,
    is_baseline: false,
    is_sample: false,
    provenance: provenance(now),
    body: {
      record_type: "practice_log",
      item_signature: input.itemSignature.trim() || null,
      independence_attested_by_learner: input.independent,
    },
    created_at: now,
  };
}

/** Appends one practice record. Evidence is append-only, so a revision conflict simply asks the caller to retry. */
export async function recordPractice(state: DbState, store: Store, input: PracticeInput): Promise<EvidenceStored> {
  const ev = buildPracticeEvidence(input);
  await store.persist({ expectedRevision: state.meta.revision, puts: [{ table: "evidence", key: ev.id, record: ev }] });
  return ev;
}

/**
 * The learner's explicit mastery decision. Stored as an outcome-unscored evidence record, so it cannot
 * inflate performance or retention by itself: it only lets the conservative clauses resolve to "mastered".
 */
export async function confirmMastery(state: DbState, store: Store, node: NodeRecord): Promise<void> {
  const now = new Date().toISOString();
  const ev: EvidenceStored = {
    id: ids.next(),
    target_ids: [node.id],
    target_codes: [node.code],
    occurred_at: now,
    evidence_class: "MASTERY_CONFIRMATION",
    result_summary: `Learner confirmed mastery of ${node.code} against the conservative-v0 clauses.`,
    outcome_scored: false,
    target_outcomes: [],
    rubric_results: [],
    conditions: { mastery_confirmation: true },
    independence_attestation: "yes",
    evaluator: { type: "learner", tool: "athena-app" },
    limitations: ["A confirmation is a learner decision, not new performance evidence."],
    item_signature: null,
    is_baseline: false,
    is_sample: false,
    provenance: provenance(now),
    body: { record_type: "mastery_confirmation", confirms: node.code },
    created_at: now,
  };
  await store.persist({ expectedRevision: state.meta.revision, puts: [{ table: "evidence", key: ev.id, record: ev }] });
}
