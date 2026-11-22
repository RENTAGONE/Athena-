# ATHENA Resource Verification and Learning-Source Selection Standard — Wave 1

**Version:** 0.1-working | **Status:** Draft operating standard | **Message:** 8/20

## Purpose

ATHENA should recommend learning resources without fabricating links, confusing popularity with quality, or making one platform mandatory. A resource is an optional teaching aid; the learning objective and assessment remain under ATHENA's control.

## Resource record minimum fields

Each resource record should contain:
- stable `resource_id` and exact title;
- creator/author or responsible organisation;
- resource type (textbook, course, lecture, documentation, dataset, simulation, reference, video);
- canonical URL only after it has been opened and verified;
- edition/version and publication/update date where visible;
- access date and access condition (free, paid, registration, institutional, region-limited, unknown);
- licence/copyright status where explicitly stated; do not infer that free-to-view means reusable;
- intended level and prerequisite assumptions;
- exact learning objectives/unit codes it supports;
- coverage note: what it teaches and what it does not;
- quality notes, known limitations and potential bias;
- alternative resource or non-web route where practical;
- verification state: `candidate`, `url_checked`, `content_checked`, `license_checked`, `mapped`, `reviewed`.

## Verification procedure

1. Search for the primary publisher, institution, standards body or original author before secondary summaries.
2. Open the exact resource. Confirm title, creator, URL and that the content still exists.
3. Inspect the relevant chapter/lesson/section—not merely the landing page.
4. Compare the actual coverage with the target unit's prerequisites and learning outcomes.
5. Check date/version where currency matters (software documentation, security, device specifications, regulations).
6. Record access restrictions and licence terms. If unclear, record `unknown`; do not imply permission to copy, redistribute or embed.
7. Note whether the source is introductory, reference-level, exercise-rich, conceptual or application-focused.
8. Add a second source when a single source has a major gap, bias or unexplained claim.
9. Recheck links periodically and when a learner reports failure. Do not silently replace a source; preserve history.

## Discipline-specific source selection

- **MATH:** prefer sources with derivations, worked examples, varied exercises and answer/solution guidance. Check notation conventions and prerequisite level. Do not map a calculus chapter as sufficient proof of calculus competence.
- **ENG:** prefer official language/tool documentation, reputable textbooks and maintained technical references. Check software version; distinguish normative specification from tutorial opinion.
- **ELEC:** prefer recognised educational institutions, component manufacturer datasheets and established safety guidance. Datasheet values must be tied to exact part/version. No resource recommendation overrides safe supervision or component limits.
- **RES:** prefer primary papers, official datasets, transparent methods, systematic reviews and reputable research-method texts. Record limitations and possible conflicts.
- **LANG:** include authentic input plus explicit explanations and feedback opportunities. A vocabulary app alone does not cover listening, speaking, reading and writing.
- **COMM:** include models and practice/feedback. A persuasive speaker's personal method is not automatically evidence-based; separate rhetorical examples from validated findings.

## Scoring is a triage aid, not truth

Rate each dimension 0–2: authority/provenance, accuracy/method transparency, objective alignment, level fit, practice/feedback, accessibility, currency, and access reliability. A low score prompts review; a high score does not guarantee correctness. Safety-critical or high-stakes material requires competent human review regardless of score.

## Resource anti-patterns

- invented URLs, guessed titles or citations;
- search snippets treated as inspected content;
- recommending a whole platform without naming the relevant course/lesson;
- treating a free page as an open licence;
- recommending outdated software/security instructions without version notes;
- a single source presented as exhaustive;
- ranking by popularity or view count alone;
- resource completion treated as evidence of mastery.

## Current Wave 1 resource status

The inherited Mathematics resource register lists candidate sources and notes that exact lesson alignment, access and licensing checks remain open. This message establishes the verification procedure; it does not claim all Wave 1 resources have been externally checked. Resource records must be added only after source inspection.
