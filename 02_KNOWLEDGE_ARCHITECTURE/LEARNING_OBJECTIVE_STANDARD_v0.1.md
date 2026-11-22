# ATHENA Learning Objective Authoring Standard v0.1

Status: Draft standard for knowledge-content authors. Applies across the 18 disciplines; subject-specific review remains mandatory.

## 1. Purpose

A learning objective states what the learner should be able to know, explain, decide, create or perform after a learning experience. It is not a topic heading, activity list or vague aspiration.

## 2. Objective construction

Use this pattern where practical:

`[Observable action] + [knowledge/skill object] + [conditions/context] + [quality or success criterion]`

Example: "Given a one-variable linear equation with integer coefficients, solve for the unknown, show valid transformations and verify the result by substitution."

Not acceptable as a final objective:
- "Understand algebra."
- "Learn anatomy."
- "Watch a video about networking."

These may be topic or activity descriptions, but they do not specify observable performance.

## 3. Outcome classes

- `RECALL`: retrieve facts, terms, definitions, symbols or procedures.
- `EXPLAIN`: describe mechanisms, relationships, causes or rationale in the learner's own words.
- `INTERPRET`: read diagrams, data, models, texts, measurements or system behaviour.
- `PROCEDURE`: execute a repeatable process to a stated standard.
- `SOLVE`: resolve a problem using appropriate reasoning and methods.
- `CREATE`: produce an artefact, design, model, plan, performance or working system.
- `EVALUATE`: compare alternatives, assess evidence, identify limitations or justify a decision.
- `TRANSFER`: apply a capability in a meaningfully different context and explain what carries across.

Objectives may combine classes, but should have one primary outcome class for analytics and assessment mapping.

## 4. Quality requirements

Every approved objective must:
1. Use an observable verb; avoid unobservable verbs alone (know, understand, appreciate, become familiar with).
2. Identify the actual object of learning, not only a broad topic.
3. Be appropriately scoped for one learning unit or coherent sequence.
4. State conditions where they materially affect performance (tools allowed, safety conditions, time constraints, open/closed reference).
5. Have assessable success criteria.
6. Link to one or more canonical concepts/skills and an assessment method.
7. Avoid claiming professional competence where the learning only establishes introductory literacy.
8. Include prerequisites only when there is a defensible dependency; mark helpful context as support rather than a hard gate.

## 5. Difficulty and progression

Do not encode difficulty only as beginner/intermediate/advanced. Record relevant dimensions:
- complexity of the material;
- number of steps or interacting variables;
- novelty of the context;
- degree of independence;
- precision/quality threshold;
- time or resource constraints;
- consequence and safety sensitivity.

A learner can be advanced in one dimension and novice in another. Difficulty labels may be displayed as a simplified view, not the source of truth.

## 6. Objective granularity

Split an objective when it contains distinct performances that require different evidence or practice. Keep related steps together when they form one meaningful performance.

A useful test: can one assessment task produce interpretable evidence for the whole objective? If not, split or define subcriteria.

## 7. Assessment alignment

Every approved objective must specify:
- suitable evidence type(s);
- assessment method(s);
- success criteria or rubric;
- acceptable aids/conditions;
- common failure modes or misconceptions;
- whether transfer or delayed retention matters.

A resource completion event is not assessment evidence. A multiple-choice score alone may be insufficient for practical, explanatory or creative objectives.

## 8. Objective lifecycle

`draft -> review -> approved -> deprecated/archived`

Approval requires subject accuracy, scope, measurable outcome, assessment alignment, source/provenance and duplicate check. Changes to wording do not change the stable ID if the semantic objective remains the same. A materially different outcome requires a new ID and a replacement/supersession relation.

## 9. Cross-domain objectives

Give an objective one canonical owner based on its primary capability. Link it to other domains with typed edges. Create a separate objective in another discipline only when the target discipline has a genuinely different performance outcome.

## 10. Example set

- Mathematics: "Given a ratio and a changed quantity, calculate the equivalent quantity and explain the proportional relationship."
- Body science: "Label the major structures of the knee on a supplied diagram and describe the basic role of each without making a diagnosis."
- Research: "Compare two sources making the same factual claim, identify provenance and limitations, and justify which is better supported."
- Programming: "Write and test a function that validates a supplied input specification, including normal and edge cases."
- Photography: "Produce three frames using different compositions and explain how framing changes the viewer's attention."
- Business: "Conduct a small, ethical customer-discovery exercise, record responses accurately and distinguish observations from assumptions."

These are illustrative objective patterns, not a complete curriculum or approved subject content.


## v0.2 ownership and exchange contract
Every approved objective must carry an explicit `owner_discipline_id` agreeing with its primary hierarchy path. Draft exchange records may include `parent_id` and `prerequisite_ids` for readability; import normalises them into typed edges. Stored edge records are the source of truth. A draft objective stub is not approvable until all required fields, assessment alignment, success criteria and evidence dimensions validate.
