# ATHENA Competency & Evidence Framework v0.1

Status: Draft product standard. It defines evidence handling, not a universal numerical grading system.

## 1. Separate content completion from learner capability

ATHENA must never infer competency merely because a learner opened a resource, watched a lesson, completed a reading or marked a task done. Learning activity and evidence of capability are separate records.

## 2. Learner-state vocabulary

- `not_exposed`: no recorded learning exposure.
- `exposed`: encountered the material; no reliable performance evidence yet.
- `practising`: currently developing the capability; performance may be inconsistent or prompted.
- `understood_provisionally`: can explain or perform in familiar conditions, but evidence is limited.
- `demonstrated`: completed a suitable assessment independently to its stated criteria at least once.
- `retained`: demonstrated again after a meaningful delay without simply repeating the original prompt.
- `mastered`: repeated independent performance across varied examples or contexts, with reliable explanation/decision-making and appropriate retention.
- `needs_revision`: evidence indicates forgetting, misconception, instability or a performance gap requiring targeted review.

These states are not a mandatory one-way ladder. A learner may move from demonstrated to needs_revision; mastery is not permanent immunity to forgetting. Store evidence history rather than overwriting prior states.

## 3. Evidence record minimum fields

Each evidence record should capture:
- immutable evidence ID;
- target objective/skill IDs;
- timestamp and context;
- assessment/task and rubric version;
- conditions: independent/prompted/collaborative, open-book/closed-book, tools permitted, time constraints where relevant;
- observed result and criterion-level judgement;
- artefact or reference where available;
- evaluator type and identity/provider;
- provenance and source;
- confidence and limitations;
- learner reflection/self-rating stored separately from observed result.

## 4. Evidence classes

- `SELF_REPORT`: learner says they understand or can perform; useful signal, not proof.
- `RETRIEVAL`: learner recalls or reconstructs information without seeing the answer.
- `EXPLANATION`: learner explains concepts, mechanisms or reasoning.
- `PROBLEM_PERFORMANCE`: learner solves a new problem under defined conditions.
- `PRACTICAL_DEMONSTRATION`: learner performs a real procedure or produces a functioning artefact.
- `PROJECT_ARTEFACT`: work product, code, design, analysis, performance or documented outcome.
- `TRANSFER_PERFORMANCE`: learner applies a capability in a new context and identifies the relevant mechanism.
- `EXTERNAL_VERIFICATION`: suitably qualified human or authoritative external check where appropriate.

## 5. Assessment conditions

Always record conditions that affect interpretation. Examples include whether the learner had notes, hints, worked examples, AI assistance, a calculator, collaboration, a reference manual or a time limit. Do not compare scores as if conditions were identical when they were not.

AI assistance must be disclosed in the evidence record. An AI evaluator can generate questions, critique work and propose a judgement, but its judgement is not automatically authoritative. Preserve the task, response, rubric, evaluator and uncertainty so a later human or independent assessment can review it.

## 6. Evidence dimensions

Use only dimensions relevant to the objective; do not force every domain into one score.

- `ACCURACY`: correctness and factual/procedural validity.
- `EXPLANATION`: quality of reasoning and ability to explain why.
- `INDEPENDENCE`: amount of prompting or external support required.
- `TRANSFER`: ability to apply in a changed or unfamiliar context.
- `RETENTION`: performance after a meaningful delay.
- `QUALITY`: craft, precision, robustness or finish of the output.
- `SAFETY`: compliance with relevant safety constraints, when applicable.
- `JUDGEMENT`: ability to choose an appropriate method and recognise limitations.

## 7. Mastery decision policy

Mastery is a conservative evidence-based claim, not an AI-generated badge. Require, as appropriate:
1. multiple independent demonstrations on separate occasions;
2. varied items or contexts, not memorised repetition of one example;
3. acceptable accuracy and quality against the objective's rubric;
4. explanation or decision rationale where the domain requires it;
5. delayed retrieval or performance when retention matters;
6. transfer evidence for objectives that claim transferable capability;
7. safety verification for safety-critical tasks.

The required evidence profile is discipline- and objective-specific. ATHENA should support a reviewable mastery rule rather than a single universal count or percentage.

## 8. Revision and decay

A `needs_revision` state should be triggered by observed forgetting, repeated errors, low-confidence recall, changed standards or a failed transfer attempt. Revision scheduling should consider forgetting risk, importance, prior stability, learning cost and upcoming use. Do not pretend that one fixed interval is optimal for every skill.

## 9. Practical and safety-critical capabilities

For first aid, tools, electronics, physical training, cooking and other safety-sensitive activities, knowledge recall alone is not enough. Practical demonstrations may require qualified instruction, adult supervision, safe equipment and locally appropriate certification. ATHENA must not label a learner professionally qualified.

## 10. Analytics rules

- Show evidence count and recency alongside any competency summary.
- Do not collapse all evidence into a single opaque percentage.
- Distinguish self-reported confidence from demonstrated performance.
- Allow contradictory evidence and show uncertainty.
- Preserve historical assessments and rubric versions.
- Progress visualisations must not imply expertise unsupported by evidence.
