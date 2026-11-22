# Prerequisite and Dependency Rules v0.1
Status: Draft.

## 1. Separate relationship types
- `PREREQUISITE_FOR`: knowledge or capability needed before a target can be learned/performed safely or meaningfully.
- `SUPPORTS`: improves performance but is not required.
- `RELATED_TO`: useful association without an asserted learning dependency.
- `TRANSFER_TO` / `APPLIES_TO`: explicit application or transfer claim.
- `CONTAINS` / `PART_OF`: structural hierarchy.
Never use a prerequisite edge merely because two items are commonly taught in sequence.

## 2. Strength
`required` means the target cannot reasonably be attempted without it (or the risk/learning cost is unacceptable); `recommended` means it substantially improves success; `helpful` means useful but optional. Hard gates require a written justification and must be rare.

## 3. Graph constraints
The directed graph formed by active `PREREQUISITE_FOR` edges must be acyclic. Reject self-edges, dangling endpoints, duplicate semantic edges and cycles. Other relation types may form cycles. Structural `CONTAINS` edges must not create multiple canonical parents where the ontology requires one owner.

## 4. Progressive access
A missing recommended prerequisite should trigger a warning or support suggestion, not a block. Only explicit, reviewed required edges can block a learning unit. Do not use prerequisites to force the learner through an entire discipline before exploring another lane.

## 5. Evidence and maintenance
Every approved prerequisite edge needs rationale, source/evidence where available, and review date. Revisit edges when curriculum order, tools, safety requirements or learner evidence changes. A failed task may reveal a missing prerequisite but does not automatically prove one.


## v0.2 explicit gating
Every relationship has `gating`: `none`, `advisory` or `hard`. Only `PREREQUISITE_FOR` can be hard-gated. A hard edge must have `strength=required`, a non-empty justification, a valid source/target pair and must preserve an acyclic hard-prerequisite graph. `recommended` and `helpful` relations are never hard gates. `TRANSFER_TO`, `SUPPORTS`, `APPLIES_TO`, `EXPLAINS`, `ENABLES` and `SHARED_FOUNDATION_FOR` never block a learning route.
