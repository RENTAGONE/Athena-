# Relationship lifecycle semantics v0.1

**Status:** Proposed clarification for owner confirmation; not yet an approved canonical change.

## SUPERSEDES

Recommended direction: `source` is the approved successor/replacement and `target` is the record being superseded. The edge records version/lifecycle lineage only. It is not a prerequisite, equivalence, containment or generic related-to relationship. The lineage graph should be acyclic. Superseding a record does not delete it; historical records and evidence remain inspectable.

The current relationship registry v0.2 already states that source is the approved successor/replacement for target, but its cycle policy is only `non_prerequisite`. Proposed registry v0.3 adds `acyclic_lineage`. Keep this proposal unpromoted until the content owner confirms.
