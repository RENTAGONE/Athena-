# ATHENA Wave 03 — Ontology Reconciliation Audit v1.0

**Status:** audit-only; no canonical IDs, registry records, graph edges or protocols changed. Expert/owner/learner review deferred until the app is usable.

## Baseline reconciliation

- Working registry: **156** draft candidates.
- Existing crosswalk: **20** canonical micro-skills across **20** rows.
- Candidate IDs linked to existing canonical rows: **24**.
- Candidates listed as unlinked: **130**.
- Candidate-level new-canonical extension proposals: **130**.
- All crosswalk relationships and extension proposals remain unapproved.

The 130 proposed new canonical records are a proposal queue, not a canonical registry expansion. No proposal should be imported as approved ontology data. Two candidates, MS-13-009 and MS-13-010, are absent from both the unlinked queue and new-canonical proposal queue; the 156-row reconciliation matrix flags them explicitly for later review.

## Candidate overlap / equivalence review queue

### MS-03-007, MS-09-001 — near-duplicate candidate overlap
Both target screwdriver/driver-bit selection. Compare target granularity and assessment; likely merge or make MS-09-001 a narrower fastener-specific component, but do not delete either ID.

### MS-03-001, MS-13-008 — near-duplicate candidate overlap
Both cover folding clothing; MS-13-008 broadens to fold and store common clothing. Could be a parent/extension or duplicate depending exact protocol scope.

### MS-03-002, MS-13-010 — partial overlap
Packing by checklist versus household checklist; shared checklist literacy but different task contexts.

### MS-03-008, MS-14-008 — partial overlap
Digital folder organisation versus inventory management; both involve classification/retrieval but different data objects and outcomes.

### MS-01-010, MS-14-001 — partial overlap
Chunk a procedure versus break a task into next actions; likely related but not identical if one focuses procedural decomposition and the other operational next-step planning.

### MS-01-009, MS-14-009 — shared reasoning component
Estimation before calculation and decision matrix comparison are distinct but share quantitative judgement and sensitivity checking.

### MS-08-007, MS-07-003 — shared component / context-specific distinction
Precise location description overlaps emergency communication location payload; retain emergency call skill as broader, location description as reusable component.

### MS-09-006, MS-07-005 — shared safety recognition pattern
Tool inspection and electrical hazard recognition both use stop/inspect/escalate; separate domains and hazards.

### MS-10-005, MS-02-010 — shared football skill family
Receiving/cushioning pass and wall pass control overlap first-touch outcomes; MS-02-010 combines passing and receiving against a wall, MS-10-005 isolates receiving.

### MS-10-008, MS-02-010 — shared football skill family
Weaker-foot pass is a specialised constraint on passing; preserve as distinct practice dimension if its assessment is independently meaningful.

### MS-11-003, MS-06-002 — component relation
Grid alignment is one technique within broader phone-photo framing; do not collapse composition skill into one setting.

### MS-12-007, MS-04-005 — partial overlap
Pacing a spoken explanation versus summarising in 60 seconds; one is delivery fluency, the other content selection/compression.

### MS-13-001, MS-07-008 — shared hygiene component
Handwashing is a routine; wound-care literacy includes hygiene but should not duplicate the full handwashing protocol.

### MS-13-006, MS-07-006 — shared product-label component
Cleaning product use requires label reading; label literacy is general and cleaning task is application.

### MS-15-003, MS-01-001 — strategy relation not equivalence
Method of loci is a mnemonic encoding strategy; blank-page active recall is a retrieval practice. Keep distinct and assess separately.

### MS-15-005, MS-01-003 — false-equivalence risk
Speed reading is reading-rate control; explaining simply is comprehension/explanation. Reading faster must not be used as a proxy for understanding.

### MS-15-002, MS-06-009 — potential duplicate/overlap
Structured scene description and observe-before-drawing both use deliberate observation; one is verbal scene encoding, the other visual construction. Compare protocols.

### MS-15-014, MS-13-009 — parent/extension relation
Signature dish is repeatable recipe execution; balanced meal planning is nutritional planning. Recipe competence does not establish balanced nutrition.

### MS-15-012, MS-07-007 — safety boundary relation
Safe lighter handling and fire-extinguisher decision model share fire-risk literacy but are not interchangeable; lighter handling remains recognition/adult handoff only.

### MS-15-015, MS-02-004, MS-02-005 — overlap family
Advanced everyday tie knots may overlap square knot/bowline. Scope must explicitly list knot types and exclude climbing/rescue/rigging/life-safety loads.

## Reconciliation rules

- **Equivalent:** same bounded outcome, context and assessment standard; only then can one canonical node represent multiple candidates.
- **Supporting component:** contributes to a broader skill but does not independently cover the full target.
- **Narrower variant:** a context- or tool-specific subskill with its own assessment.
- **Extension candidate:** distinct capability not represented in the current canonical set.
- **Related only:** conceptual association without dependency or equivalence.
- **No link:** no defensible semantic relation established.

Do not merge solely because names look similar. Compare target performance, prerequisites, contexts, error modes, assessment and safety constraints. Preserve IDs and provenance even if a future canonical decision consolidates records.

## Structural findings and open decisions

- Registry/catal​ogue mismatch: catalogue text has 140 candidate bullets; registry has 156. Registry is the operational source for this audit.
- Existing crosswalk is not a full 156-candidate semantic review; it is a proposal layer.
- Validator success is not proof of conceptual equivalence.
- Owner decisions about canonical promotion, duplicate disposition and category taxonomy remain open.
- Expert review and learner testing are deferred until the app is usable.

## Full candidate-level reconciliation

See `ATHENA_CANDIDATE_TO_CANONICAL_RECONCILIATION_MATRIX_156_v1.0.json` for a row for every registry ID, including existing canonical proposal links, extension proposals, unlinked entries and the two uncovered candidates.
