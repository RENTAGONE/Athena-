# ATHENA Micro-skill Authoring & Governance Standard v0.1

**Status:** Draft standard. **Scope:** Small, bounded capabilities that can be practised in short sessions and assessed with observable criteria.

## 1. Boundary
A micro-skill is narrower than a normal skill or subskill. It should have a clear performance target, a short repeatable protocol, a simple assessment and a maintenance rule. If it needs a substantial curriculum, deep conceptual instruction or integrated project work, model it in the main skill hierarchy instead.

## 2. Five categories
- `COGNITIVE`: attention, memory, reasoning and learning procedures.
- `DEXTERITY_COORDINATION`: fine motor control and hand-eye coordination.
- `PRACTICAL_EVERYDAY`: bounded everyday capabilities.
- `SOCIAL_COMMUNICATION`: repeatable interpersonal and communication behaviours.
- `SAFETY_EMERGENCY`: hazard recognition, escalation and pathways to qualified training.

## 3. Required record fields
Every record needs a stable ID, name, category, operational definition, target performance, conditions, practice protocol, assessment method, evidence record, maintenance rule and lifecycle status. Add discipline/skill links and prerequisites only when they are meaningful. Include risk level, safety notes and supervision requirement for practical or safety-related tasks.

## 4. Performance and evidence
Targets must be observable and context-bounded. Record conditions, aids, environment, trial count and result. Self-report and session completion are not demonstrated competence. Do not use arbitrary universal pass percentages; define task-specific criteria after piloting.

## 5. Practice design
Use brief sessions, low friction and progressive difficulty. Increase speed or complexity only after accuracy and control are stable. Practice duration estimates are provisional planning aids, not guarantees of time-to-mastery.

## 6. Maintenance
Each record specifies when to revisit and what maintenance practice looks like. Maintenance frequency should respond to forgetting, task relevance and performance evidence rather than one universal schedule.

## 7. Safety and age-appropriateness
Do not include dangerous stunts, weapon handling, lock bypass, hazardous chemical handling or unsupervised electrical/medical procedures. Safety-critical capabilities require appropriate adult support, qualified instruction, correct equipment and/or certification. ATHENA must never imply professional qualification. A CPR/first-aid record may track course discovery or verified training, but cannot replace training.

## 8. Scheduling rules
Micro-skills are optional supporting practice, not a second full curriculum. They must not crowd out core foundations, school obligations, adequate sleep, recovery or sustained projects. Rotate a small number at a time. Provide minimum viable, normal and optional practice doses where the execution engine supports them.

## 9. Canonical ownership
Each capability has one canonical owner in the discipline/skill graph. Micro-skill records link to that owner rather than duplicating the same knowledge. Cross-domain relevance uses typed links.

## 10. Lifecycle
New records begin `DRAFT`, then move through review before approval. Retain deprecated records and their IDs for historical evidence. Never recycle stable IDs. Material changes to the performance outcome require a new ID and a supersession link.


## v0.2 structured maintenance and safety addendum
- `maintenance_policy.mode` is one of `interval`, `event_triggered`, `manual`, `provider_guided`.
- `interval_days` is present only when a source-supported interval is available; it is a provisional reminder cadence, not a scientifically optimal prescription.
- `success_criteria[]` stores a qualitative or externally defined criterion. Do not invent numeric thresholds when the source has not supplied them.
- Each record has `content_version`, `aliases`, `source_refs` and a `safety_review` state.
- HIGH-risk records remain DRAFT and are not schedulable until a human safety review confirms age suitability, local procedure, scope and supervision.
- CPR/first-aid readiness records may help identify a recognised course; they do not teach, assess or certify practical CPR/first-aid competence.
- Use `SUPPORTS` for links to macro skills/disciplines and `APPLIES_TO` for contexts. Micro-skills remain outside the main `CONTAINS` hierarchy and do not roll up into macro mastery.
