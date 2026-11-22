# Wave 1 Instructional Coverage Audit — Message 8

**Status:** Internal content-architecture audit; draft, not expert-approved.  
**Scope:** MATH, ENG, ELEC, RES, LANG, COMM.  
**Evidence inspected:** existing Message 5–7 teaching packs, assignment registries, Mathematics packs, 18-discipline ledger, project bank and release manifest.

## Executive finding

Wave 1 now has a coherent initial learning spine, but not six complete disciplines. Existing deepening units are discrete instructional drafts. The sequence map in `WAVE_1_PREREQUISITE_AND_PATHWAY_MAP_v0.1.json` is a recommended pathway proposal, not an approved prerequisite graph. The projects in the Message 8 project pack are assessment specifications, not learner-validated projects.

## Unit inventory by discipline

| Discipline | Deepening units currently named | Coverage represented | Material gaps requiring authored units |
|---|---|---|---|
| MATH | MATH-FUNC-001; MATH-ALG-002–004; MATH-EXP-005; MATH-TRIG-006; MATH-PROB-011–012; MATH-STAT-013–014; MATH-MOD-015; MATH-REASON-016; plus BASE-MATH-001–012 | Arithmetic/algebra/geometry/graphs; functions; selected algebra; sequences/probability/statistics foundations; modelling and proof | limits and continuity; full differential/integral calculus; linear algebra; discrete mathematics; number theory; numerical methods; richer scientific inference and cumulative bank |
| ENG | ENG-ARCH-001; ENG-SWE-002; ENG-ALGO-003 | Requirements, version control, algorithms/data structures and complexity | sustained programming pathway; testing/debugging; OS; networks; databases; security; architecture; AI evaluation; software project lifecycle |
| ELEC | ELEC-DEV-001; ELEC-MEAS-002; ELEC-DIG-003 | Diodes/transistor switching; low-voltage measurement; binary/digital combinational logic | circuit analysis; sequential logic; embedded systems; sensors/signals; power/battery; component datasheet practice; safe supervised labs |
| RES | RES-EVAL-001; RES-METHOD-002; RES-DATA-003 | Source appraisal; research question/design; cleaning/descriptive/reproducible workflow | systematic search/review; qualitative methods; sampling; causal inference; inferential statistics; synthesis; data stewardship |
| LANG | LANG-STRUCT-001; LANG-ACQ-002; LANG-READ-003 | Structural overview; deliberate acquisition; reading/inference/analytical writing | listening/speaking pathways; detailed grammar/language systems; writing/revision; pragmatics/discourse; multilingual transfer; diagnostic assessment |
| COMM | COMM-ARG-001; COMM-PRES-002; COMM-NEG-003 | Argument; presentation; negotiation/conflict resolution | interpersonal/nonverbal communication; listening; facilitation; writing for purpose; media literacy; cross-cultural communication; feedback conversations |

## Prerequisite graph audit

- A candidate recommended order exists for each discipline.
- No edge in this file is promoted to a hard progression gate.
- The current six-discipline units do not yet provide enough evidence to assert a complete acyclic prerequisite graph across all active pathways.
- Before hard edges are approved, each must state: source unit, target unit, competency that must already exist, why absence blocks safe/meaningful work, whether a diagnostic can waive the sequence, and review owner.
- Soft recommendations should remain soft when the learner can still explore or succeed with scaffolding.

## Quality findings

1. **Curriculum balance:** Wave 1 is balanced by discipline count, but not by instructional depth. Mathematics has more authored units than the other five; do not disguise this difference.
2. **Assessment:** Message 8 adds three integrated project specifications and a common evidence protocol. Discipline-specific cumulative banks remain incomplete.
3. **Resources:** A verification standard now exists. Actual resource-to-objective mapping is still incomplete for five disciplines and only partially checked for Mathematics.
4. **Projects:** Three projects span all six disciplines collectively, but not every project requires all six disciplines. This is intentional: project claims must match actual required contribution.
5. **Graph:** Unit codes and recommended order are recorded in a separate JSON registry. Stable-code collision and app-schema compatibility still require formal validation.
6. **Review:** All new content remains authored draft. No independent expert review or learner pilot is claimed.

## Wave 1 readiness decision

**Decision: NOT READY TO CLOSE WAVE 1.**

Message 8 closes the first consolidation pass only. Before Wave 2 starts, the production plan still calls for a second coverage/deepening pass and explicit Wave 1 gap accounting. The 20-message budget is an allocation target, not permission to lower release gates.

## Required next work

- Add more substantive ENG/ELEC/RES/LANG/COMM teaching units to reduce the current Mathematics-heavy content imbalance.
- Expand the Mathematics calculus/linear algebra/discrete/computational gaps without allowing it to dominate the wave.
- Create discipline-specific diagnostic and cumulative assessment banks.
- Verify exact resource sections and usage conditions.
- Have qualified reviewers inspect technical, electrical-safety, research-method and language/communication content.
- Pilot at least one project and one unit from each discipline with representative learners; revise from observed errors.
- Validate registry references, graph cycles, duplicate IDs and importer compatibility.
