# Assessment and Evidence Standard v0.1
Status: Draft.

## 1. Assessment purpose
Use diagnostic, formative retrieval, explanation, problem performance, practical demonstration, project review, transfer task, delayed retention and external verification as appropriate. Select assessment from the target outcome, not convenience.

## 2. Conditions are part of the result
Record time, aids, calculator, notes, hints, AI assistance, collaboration, tools and environment when relevant. Performance with assistance is valid evidence, but it must not be mislabelled as independent performance.

## 3. Evidence is append-only
Create a new evidence record for each meaningful observation. Corrections or evaluator revisions append a superseding/annotated record; they do not silently overwrite history. Store artifacts or stable references when possible.

## 4. Evaluator provenance
Record evaluator type/name/version and prompt/rubric/protocol reference. AI output is one evaluator input, not unquestionable truth. Preserve uncertainty, limitations and conflicts. Self-report and confidence are stored separately from demonstrated performance.

## 5. Competency inference
Competency state is derived from multiple relevant evidence records over time, not resource completion or one score. Distinguish exposure, provisional understanding, demonstrated performance, retention and transfer. Mastery claims require varied demonstrations, acceptable quality and delayed evidence where relevant. Safety-critical claims require suitable supervision or external verification.

## 6. Rubrics
Use observable criteria tied to objectives. Avoid false precision and universal percentages. State what quality looks like and what aids/conditions are allowed. Provide actionable feedback and a next practice action.


## Structured outcome contract v0.2 (2026-11-17)

- Evidence exchange schema v0.2 adds `outcome` with `not_demonstrated`, `partial`, and `demonstrated`. Use a record-level outcome only when all `target_ids` share it.
- For mixed outcomes across a multi-target evidence record, omit record-level `outcome` and use `target_outcomes[]` with one outcome per target. Semantic validation must ensure exact one-to-one coverage of `target_ids`.
- `rubric_results[].met` is optional: `true` means the criterion threshold was met, `false` means it was not, and null/omitted means it was not evaluated. Do not infer it from prose or a numeric score without an explicit rubric rule.
- New records using this contract set `outcome_schema_version: "0.2"`. Legacy records without structured outcomes remain append-only and are classified as outcome-unscored; do not retroactively invent outcomes.
- A package may propose evidence, but it is only accepted after validation, preview and explicit user approval. Evidence does not directly write mastery or overwrite competency history.


