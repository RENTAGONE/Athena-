# ATHENA Knowledge Architecture & Ontology
Version: 0.1.0 | Status: Initial architecture specification | Date: 2026-11-16

## 1. Purpose

This specification defines the knowledge model ATHENA uses to represent learning. It is deliberately independent of the application framework, database, graph renderer and AI provider. Claude may choose the implementation, but the semantic distinctions and invariants here are product-level requirements.

ATHENA is a multidisciplinary learning and knowledge system. It is not a school-management or syllabus-tracking system. School and other life contexts may benefit through natural transfer, but they are not the organising structure of the knowledge base.

## 2. Core modelling principle

Do not represent every item as a generic "skill" or "node". Different kinds of learning objects have different meanings and lifecycle rules. The system must preserve those distinctions even if the UI displays them together in a graph.

## 3. Canonical object types

| Object | Meaning | Example |
|---|---|---|
| Discipline | Broad, durable field of capability | Mathematics & Scientific Reasoning |
| Domain | Major branch within a discipline | Algebra |
| Skill | An ability that can be performed | Rearrange a linear equation |
| Subskill | A smaller component of a skill | Isolate a variable using inverse operations |
| Concept | A unit of declarative/procedural knowledge | Equality is preserved by applying the same operation to both sides |
| Learning objective | Observable outcome expected from a learning unit | Solve a one-variable linear equation and explain each transformation |
| Learning unit | Sequenced package of objectives, explanations and practice | Linear equations: fundamentals |
| Resource | External or internal learning material | Textbook chapter, video, simulation, article |
| Practice protocol | Repeatable method for developing a capability | Daily equation fluency practice |
| Assessment | Instrument or task that elicits evidence | Untaught equation set with explanation |
| Evidence record | A dated observation or artefact supporting a claim | Independently solved problem set |
| Competency state | Current evidence-based estimate of capability | Demonstrated, retained, needs revision |
| Project | Integrated application producing an outcome | Build a sensor-based measurement device |
| Milestone | Verifiable stage within a project | Calibrate sensor and document error |
| Transfer link | Explicit relationship between knowledge in different contexts | Algebraic rearrangement supports physics formula use |
| Micro-skill | Small, independently practised practical/cognitive ability | Mental arithmetic, origami fold, knot tying |

A curriculum is an ordered or partially ordered collection of learning units and objectives. A discipline is not itself a curriculum. A resource is not proof of learning. Completion of a resource must never automatically confer competency.

## 4. Hierarchy and composition

Recommended containment hierarchy:

`Discipline -> Domain -> Skill family -> Skill -> Subskill`

Concepts and learning objectives can be linked to any relevant level; they are not forced into a single parent tree. Learning units group objectives and supporting concepts. Resources attach to concepts, objectives or learning units. Assessments elicit evidence for one or more objectives/skills. Projects provide integrated evidence across multiple disciplines.

The knowledge graph is therefore a typed multi-relational graph, not merely a tree. A node may have one primary organisational parent and multiple semantic relationships.

## 5. Relationship types

| Relationship | Direction | Meaning |
|---|---|---|
| `CONTAINS` | Parent -> child | Organisational hierarchy |
| `PREREQUISITE_FOR` | Earlier -> later | Required or strongly recommended prior capability |
| `SUPPORTS` | Source -> target | Makes target easier or more reliable |
| `APPLIES_TO` | Knowledge -> context | Where the knowledge is used |
| `TRANSFER_TO` | Source -> target | A learned capability can be applied in a distinct context |
| `RELATED_TO` | Symmetric semantic association | Useful relationship without prerequisite claim |
| `CONTRASTS_WITH` | Usually symmetric | Important distinction or comparison |
| `PART_OF` | Component -> composite | A subskill contributes to a larger skill |
| `ASSESSES` | Assessment -> target | What an assessment measures |
| `EVIDENCES` | Evidence -> target | What a piece of evidence supports |
| `USES_RESOURCE` | Learning object -> resource | Resource supports learning |
| `DEVELOPS` | Practice/unit -> skill | Activity is intended to develop capability |
| `CONTRIBUTES_TO` | Skill -> project/milestone | Capability contributes to outcome |

Never infer `PREREQUISITE_FOR` merely from a `RELATED_TO` or `TRANSFER_TO` relationship. Relationship semantics must remain explicit.

## 6. Prerequisite strength

Use `required`, `recommended` or `helpful` as prerequisite strength. A required prerequisite blocks a recommended progression only when the learning design explicitly marks it as a hard dependency. Recommended and helpful prerequisites inform guidance but do not create arbitrary locks. Provide a rationale and evidence basis for every hard prerequisite.

## 7. Learning and competency states

Keep content lifecycle separate from learner competency.

Content lifecycle: `draft`, `review`, `approved`, `deprecated`, `archived`.

Learner evidence states should distinguish at least:
- `not_exposed`
- `exposed`
- `practising`
- `understood_provisionally`
- `demonstrated`
- `retained`
- `mastered`
- `needs_revision`

These are not a simple universal percentage scale. A user may demonstrate a skill but later need revision; an evidence record can be strong while retention decays. Mastery requires repeated, independent, sufficiently varied evidence over time and is never awarded solely by AI assertion or content completion.

## 8. Evidence model

Evidence records should capture: target IDs; date; context; task/instrument; conditions (open-book, prompted, independent, timed if relevant); result; rubric or criteria; artefact/reference; evaluator; confidence; provenance; and limitations. Separate user self-report, AI evaluation, objective test result and externally verified evidence. Do not collapse them into one score.

## 9. Transfer model

A transfer link describes how knowledge developed in one context may help in another. It must record:
- source object ID and target object/context ID;
- transfer type: `conceptual`, `procedural`, `mathematical`, `methodological`, `tooling`, `physical`, `communication` or `strategic`;
- mechanism: what exactly carries across;
- transfer distance: `near`, `intermediate` or `far`;
- expected benefit and limitations;
- whether the link is hypothesised or evidenced;
- an optional transfer task or observation.

Example: algebraic rearrangement -> physics formula manipulation. Mechanism: inverse operations and equality-preserving transformations. This is a transfer link, not a school workflow.

## 10. Sequencing rules

- Build foundations early, but do not require completion of every foundation before all other domains can begin.
- Use just-in-time prerequisite depth: teach the prerequisite depth needed for the current application, then deepen as later applications require it.
- Keep safety-critical prerequisites strict.
- Permit parallel learning lanes and continuity practice.
- Distinguish a recommended sequence from a hard dependency.
- Allow multiple routes to an objective when valid.
- Avoid duplicate concepts under multiple disciplines; use one canonical concept with cross-links and context-specific applications.

## 11. Provenance and content quality

Every authored knowledge object should carry author/source, creation date, review status, version, confidence or evidence basis where relevant. Imported AI content is untrusted draft content until validated. Preserve source attribution and user approval. Never fabricate citations, assessments, metrics or completion states.

## 12. Global invariants

1. Stable IDs are never recycled.
2. Human-readable codes are separate from internal database keys.
3. Semantic relationships are separate from visual graph layout.
4. A resource viewed is not a skill demonstrated.
5. Self-reported confidence is not demonstrated competency.
6. AI-generated assessment is not automatically authoritative.
7. School is not the knowledge base's organising taxonomy.
8. The 18 macro disciplines remain the current top-level registry unless the user approves a change.
9. Cross-domain transfer is represented explicitly, but not every relationship is forced.
10. All content remains exportable in documented, versioned formats.

## 13. Open design questions

- Whether learning units need nested modules/lessons in the first data release.
- Whether concept dependencies and skill prerequisites share one edge table with typed relations or use specialised projections.
- Which competency rubric dimensions are universal versus discipline-specific.
- How confidence calibration and evidence decay are represented without false precision.
These should be resolved with test cases, not aesthetic preference.


## v0.8 reconciliation addendum (2026-11-17)

### Explicit contexts
`Context` is a first-class typed record with stable `ATH-CTX-*` IDs. Contexts represent application environments (e.g. physics learning, collaborative projects), not additional ATHENA macro disciplines and not school-management objects. Transfer and application links may target contexts.

### Canonical ownership
Every knowledge node carries one `owner_discipline_id`. Hierarchy nodes also have one primary `CONTAINS` parent. Cross-discipline relevance is represented by typed relationships, not duplicated ownership. The owner must agree with the primary parent chain. Legacy ID namespace segments (`SCI`, `LEARN`) remain immutable origin labels and do not override current ownership.

### Relationship and gating vocabulary
Relationship types are defined in `RELATIONSHIP_TYPE_REGISTRY_v0.2.json`. `gating` is an edge attribute (`none`, `advisory`, `hard`), not a relationship type. Only `PREREQUISITE_FOR` may be hard-gated; a hard gate must have `strength=required`, an explicit justification and a validated acyclic dependency path. `TRANSFER_TO`, `SUPPORTS`, `APPLIES_TO`, `EXPLAINS`, `ENABLES` and `SHARED_FOUNDATION_FOR` never block learning.

### Storage and exchange
Convenience link fields may appear in exchange packages for readability. On import they are normalised to the edge store. Stored edges are the sole source of truth for relationships. Export regenerates exchange fields; conflicts are reported, never silently resolved.

### Mapping maturity
The v0.3 domain map contains 113 draft domains and 40 draft skill families. The 36 initial skill candidates each have a proposed primary domain; subskills inherit the mapping from their parent skill. These mappings are draft proposals, not approved curricula or complete coverage. Null family links are intentional where the current family registry has no clear match.
