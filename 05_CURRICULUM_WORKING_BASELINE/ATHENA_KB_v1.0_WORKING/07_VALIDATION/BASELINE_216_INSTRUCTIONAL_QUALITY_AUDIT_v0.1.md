# ATHENA 216-Module Baseline — Instructional Quality Audit v0.1

**Date:** 2026-11-17  
**Scope:** All 216 records in `BREADTH_FIRST_BASELINE_216_MODULES_v1.0_WORKING.json`  
**Status:** Diagnostic audit; source baseline not silently rewritten.

## Executive finding

The 216-module baseline is a useful breadth-first topic map, but it is not yet 216 complete lessons. It is a structured outline layer. The record count and the presence of objective/practice/assessment fields overstate instructional depth if interpreted as completed curriculum. The user’s concern about generic material is supported by measurable evidence.

## Measured findings

| Field | Actual finding | Interpretation |
|---|---|---|
| `success_criteria` | 1 unique value(s); most common value appears in 216/216 records | Identical boilerplate across the entire baseline; must become discipline- and capability-specific. |
| `assessment_modes` | 1 unique value(s); most common value appears in 216/216 records | Identical boilerplate across the entire baseline; must become discipline- and capability-specific. |
| `retention_profile` | 1 unique value(s); most common value appears in 216/216 records | Identical boilerplate across the entire baseline; must become discipline- and capability-specific. |
| `safety_review` | 1 unique value(s); most common value appears in 216/216 records | Identical boilerplate across the entire baseline; must become discipline- and capability-specific. |
| `provenance` | 1 unique value(s); most common value appears in 216/216 records | Identical boilerplate across the entire baseline; must become discipline- and capability-specific. |
| `stage` | 1 unique value(s); most common value appears in 216/216 records | Identical boilerplate across the entire baseline; must become discipline- and capability-specific. |
| `status` | 1 unique value(s); most common value appears in 216/216 records | Identical boilerplate across the entire baseline; must become discipline- and capability-specific. |
| `learning_objective` | 216/216 distinct; average 8.2 words (range 5–12) | Distinct wording exists, but short prompts are not full instruction, worked examples or calibrated assessment. |
| `core_model` | 216/216 distinct; average 5.8 words (range 4–8) | Distinct wording exists, but short prompts are not full instruction, worked examples or calibrated assessment. |
| `guided_and_independent_practice` | 216/216 distinct; average 9.6 words (range 5–16) | Distinct wording exists, but short prompts are not full instruction, worked examples or calibrated assessment. |
| `assessment_task` | 216/216 distinct; average 8.4 words (range 5–17) | Distinct wording exists, but short prompts are not full instruction, worked examples or calibrated assessment. |
| `common_misconception` | 216/216 distinct; average 7.2 words (range 4–14) | Distinct wording exists, but short prompts are not full instruction, worked examples or calibrated assessment. |
| `transfer_bridge` | 215/216 distinct; average 3.7 words (range 2–8) | Distinct wording exists, but short prompts are not full instruction, worked examples or calibrated assessment. |

## What is genuinely useful already

- All 18 disciplines have 12 named entry modules, giving a first-pass breadth map.
- Most module titles and objectives are recognisably discipline-specific rather than copied wholesale.
- The baseline includes candidate misconceptions, practice prompts, assessment prompts and transfer bridges. These are useful authoring anchors.
- The foundational curriculum and 18 Wave 1 deepening units contain more substantial instructional material than the baseline records.

## What is not yet good enough

1. **Generic success criteria:** every module uses the same three criteria. “Performs the stated task independently” does not define what correct performance means for algebra, negotiation, circuit measurement, drawing or research.
2. **Generic assessment modes:** every module is assigned retrieval, explanation, application and transfer regardless of whether those modes are suitable or sufficiently specified.
3. **No actual retention profile:** every record points to a selector placeholder rather than a skill-specific review design.
4. **Generic safety metadata:** every record carries the same broad safety note, including low-risk and high-risk subjects. Actual hazards and boundaries must be explicit per unit.
5. **Thin instruction:** objectives average 8.2 words, practice prompts 9.6 words and assessment prompts 8.4 words. These are prompts for authoring, not a lesson.
6. **Missing worked teaching:** baseline records generally lack step-by-step explanations, worked examples with reasoning, graduated exercise sets, answer rationales, feedback paths and learner-facing references.
7. **Weak transfer specification:** 215/216 transfer bridges are distinct, but they are short destination labels, not tasks proving transfer.

## Correct interpretation of current coverage

- **216/216:** topic-outline coverage only.
- **216/216:** not complete lessons.
- **0/216:** subject-expert reviewed in this audit.
- **0/216:** learner-piloted in this audit.
- **0/216:** independently calibrated assessment banks established by this audit.
- Existing deeper units are separate assets and must be assessed on their own merits; they do not automatically upgrade the 216 baseline records.

## Required remediation standard for every baseline module

A module is not instructionally complete until it contains:
1. A bounded scope and explicit entry assumptions.
2. A learner-facing explanation of the central idea, including why it works.
3. At least two worked examples with reasoning, not just final answers.
4. Guided practice that fades support, followed by independent practice.
5. A graduated exercise set with answers and explanations or scoring guidance.
6. Common errors with diagnosis and corrective feedback.
7. A task-specific assessment with observable criteria and acceptable variants.
8. A transfer task that changes context and requires the learner to identify the underlying principle.
9. Appropriate retention/retrieval design for the type of capability.
10. Verified sources and subject review appropriate to risk.

## First remediation batch

The first full teaching-content rewrite is `BASE-MATH-001` through `BASE-MATH-004` (number sense, arithmetic, fractions/decimals, percentages/proportional change). The stable module IDs remain unchanged. The new teaching pack is additive and is the authoritative instructional draft for these four modules; the original 216-record baseline remains preserved as the breadth index until its schema and importer migration are approved.

## Audit method and limits

A reproducible structural comparison was run across all 216 JSON records. Exact-value repetition and field word counts are objective findings. This audit does not prove every unique sentence is correct or every module is equally weak; it identifies where the data is demonstrably templated and where instructional content is absent. Subject correctness still requires discipline review.
