# ATHENA Competency, Assessment, Evidence and Placement Framework

**Status:** Working governance specification; draft pending reconciliation with the canonical v0.8 schemas and application implementation.

## 1. What ATHENA is trying to establish

ATHENA does not measure whether a learner has consumed content. It records whether the learner can retrieve, explain, perform, apply, adapt and retain a capability under stated conditions.

The system must keep these claims distinct:

- **Exposure:** the learner encountered the material.
- **Recognition:** the learner can identify a concept or correct option when shown it.
- **Recall:** the learner can retrieve it without the answer being supplied.
- **Explanation:** the learner can describe the mechanism or reasoning accurately.
- **Guided performance:** the learner can perform with prompts, examples or feedback.
- **Independent demonstration:** the learner can meet the criterion without step-by-step support.
- **Repeatable demonstration:** the learner can do so on separate occasions or equivalent tasks.
- **Transfer:** the learner can adapt the capability to a meaningfully different context.
- **Retention:** delayed retrieval or performance remains adequate after time has passed.
- **Maintenance:** the capability remains sufficiently reliable under its current real-world use conditions.

A single quiz score cannot stand in for all these dimensions.

## 2. Evidence record minimum

Every meaningful assessment event should record:

1. Stable evidence ID allocated by ATHENA at commit time.
2. Target objective, skill, subskill or concept ID.
3. Evidence type: retrieval, explanation, procedure, creation, evaluation, transfer, project or external certification.
4. Date/time and elapsed time since relevant instruction where available.
5. Task prompt/version and conditions.
6. Result or artifact reference, with private data minimised.
7. Support level: unaided, cue, hint, worked example, collaboration, tool-assisted or externally supervised.
8. Accuracy/quality dimensions appropriate to the task, not a universal score.
9. Evaluator provenance: self, peer, teacher, qualified instructor, deterministic test, software test, AI-assisted review or external source.
10. Confidence estimate where useful, recorded separately from correctness.
11. Limitations, accommodations and context that materially affect interpretation.
12. Next action: continue, practise, transfer, review, seek instruction or no action.

Evidence is append-only. Corrections should supersede or annotate a record rather than silently erase history. Sensitive artifacts should remain local and should not be uploaded to an AI service by default.

## 3. Five assessment dimensions

The dimensions below are not a weighted universal score. Each objective declares which dimensions matter.

| Dimension | Question | Suitable evidence |
|---|---|---|
| Accuracy | Is the result or action correct? | Answer key, measurement, valid output, rubric |
| Independence | How much support was required? | Prompt/hint log, unaided attempt |
| Consistency | Does performance repeat? | Separate attempts, varied equivalent tasks |
| Adaptability | Does it work in a changed context? | Transfer task, unfamiliar example |
| Retention | Does it persist after delay? | Cold retrieval/performance check |

For some objectives, speed, safety, quality, precision, creativity or collaboration is also important. These are task-specific dimensions and must not be collapsed into one arbitrary total.

## 4. Objective-to-assessment contract

Each learning objective must specify:

- observable verb;
- knowledge or skill target;
- conditions/context;
- success criterion;
- acceptable support level;
- evidence type;
- known limitations or safety constraints.

Examples:

- Weak: “Understand fractions.”
- Better: “Given a visual model and an unfamiliar word problem, represent the quantity as a fraction, explain the numerator and denominator, and justify an equivalent fraction without a worked solution.”
- Weak: “Know Git.”
- Better: “In a disposable repository, inspect working-tree status, explain each changed hunk in a diff, and stage only the intended file.”
- Weak: “Be good at football.”
- Better: “In a controlled receiving drill, scan before the pass arrives, orient the first touch into available space and select a justified next action across multiple repetitions.”

## 5. Diagnostic placement

A diagnostic is a placement instrument, not an exam that must be passed to enter ATHENA.

A diagnostic may sample:
- prerequisite concepts;
- retrieval fluency;
- explanation quality;
- a short authentic task;
- confidence calibration;
- transfer to a nearby unfamiliar problem.

Placement outcomes:
- **Start here:** prerequisite understanding is not yet stable.
- **Bridge first:** most knowledge exists, but one named prerequisite needs repair.
- **Proceed with a check:** the learner likely has the foundation; verify through a short task.
- **Skip/revisit on demand:** evidence supports moving forward, while the unit remains available.

The learner may inspect all content regardless of placement. Only justified hard prerequisites may prevent a specific hazardous or technically dependent activity. A diagnostic should not repeatedly test mastered basics merely to enforce a fixed sequence.

## 6. Competency state interpretation

The application may derive a compact learner-facing state, but must preserve underlying evidence and dimensions.

- `not_exposed`: no recorded learning encounter.
- `exposed`: content encountered; no reliable performance claim.
- `practising`: active guided or independent practice.
- `understood_provisionally`: explanation or recognition evidence exists, but independent application is not yet established.
- `demonstrated`: one or more valid independent demonstrations exist.
- `retained`: delayed check supports current recall/performance.
- `mastered`: strong, repeated, adaptable evidence across relevant contexts; reserved for meaningful long-term competence, not a quiz threshold.
- `needs_revision`: current check indicates a lapse; prior achievements remain in history.

A separate `certified_current` state is only valid for skills where a recognised external body provides current training and practical assessment. ATHENA must store the provider, course, date, scope and renewal information where available. AI review cannot issue certification.

## 7. Assessment patterns by capability type

### Declarative facts
- Retrieval from a blank prompt.
- Discrimination between close concepts.
- Delayed recall and explanation.

### Conceptual understanding
- Explain a mechanism.
- Predict an outcome after changing one variable.
- Identify a counterexample or boundary condition.
- Apply to an unfamiliar example.

### Mathematics
- Solve a representative problem.
- Explain the method and assumptions.
- Check using an alternate method or inverse operation.
- Solve a transfer problem with changed surface context.

### Programming and technical work
- Produce a working artifact.
- Explain the code/design choices.
- Test expected and edge cases.
- Debug a seeded fault.
- Reproduce from a clean environment or documented setup.

### Practical and dexterity skills
- Demonstrate safely under ordinary conditions.
- Repeat on separate days.
- Use a slightly varied material or context.
- Record comfort, errors and safety limits.

### Communication and social skills
- Use a realistic role-play or real low-stakes interaction.
- Evaluate clarity and listener understanding.
- Receive feedback and adapt.
- Do not infer a stable personality trait from one performance.

### Physical/motor skills
- Use age-appropriate, progressive, low-risk practice.
- Evaluate movement quality and repeatability, not only time or volume.
- Include rest, discomfort and environmental conditions.
- Use qualified coaching for specialised or high-risk technique.

### Safety-critical capabilities
- Teach conceptual awareness and course navigation.
- Require current recognised practical instruction and qualified assessment.
- Never mark competent from text, video, quiz or AI conversation alone.

## 8. Review and retention triggers

Review timing should be chosen from evidence and item type, not one universal spaced-repetition curve.

Possible triggers:
- initial learning completed;
- first successful unaided retrieval;
- first delayed check;
- a failed cold check;
- a high-confidence error;
- a new context requiring transfer;
- a change in tool, software version, standard or safety guidance;
- upcoming real-world use;
- external certificate approaching expiry.

The scheduler should expose why a review is suggested and let the learner adjust non-safety-critical reminders. It should not claim a precise probability of forgetting unless calibrated data justifies that claim.

## 9. Relearning and lapse policy

A lapse changes the current evidence picture; it does not rewrite history.

1. Preserve earlier demonstrations and dates.
2. Record the failed or partial cold check.
3. Identify whether the lapse concerns recall, procedure, speed, accuracy, confidence or context adaptation.
4. Assign the smallest useful refresher.
5. Reassess without immediately showing the answer.
6. Record successful relearning as new evidence.

Do not punish missed reviews, create streak loss, or imply moral failure.

## 10. Human review and AI limitations

AI may draft questions, offer formative feedback, detect likely omissions and help organise evidence. It may be wrong, overconfident or biased. The system should:
- label AI-assisted evaluation as such;
- retain the prompt/rubric version when feasible;
- distinguish deterministic checks from subjective judgement;
- ask for human or expert review where stakes are high;
- never invent evidence or claim to have observed a performance it did not see;
- never issue medical, legal, professional or safety certification.

## 11. Release acceptance tests

- Exposure never automatically becomes demonstrated.
- A viewed resource never automatically becomes evidence of competence.
- Confidence is stored separately from correctness.
- A hint-assisted result cannot silently become an unaided demonstration.
- A lapse preserves prior evidence and changes only current status/next action.
- A transfer task links to both source and target objectives.
- A safety-critical skill cannot reach `certified_current` without external provenance.
- A diagnostic permits skipping demonstrated content and inspecting all non-hazardous content.
- A review reminder includes its reason and can be snoozed/adjusted where policy permits.
- Evidence records are append-only and exportable.
