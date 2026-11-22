# ATHENA Product & Experience Specification
Version 1.0.0 · 2026-11-17 · Canonical product requirements for Stage 0 reconciliation

## 1. Product definition

ATHENA is an Advanced Personal Learning & Knowledge Management System. It is a personal capability-development environment that connects knowledge architecture, learning execution, evidence, retention, projects and cross-domain transfer.

ATHENA is not:
- a school-management, syllabus-tracking, homework, gradebook, tutoring or exam-preparation product;
- a generic task manager or habit tracker;
- a course-completion counter or gamified streak application;
- an AI chatbot that autonomously declares the learner competent.

Its purpose is to help the learner independently acquire, connect, demonstrate, retain and apply knowledge and skills across 18 macro disciplines.

## 2. Product invariants

1. **Evidence over activity:** time spent, resources viewed, streaks and self-reported confidence are not proof of competence.
2. **No fabricated mastery:** AI may propose evidence interpretations; only the learner can confirm a mastery designation after reviewing the evidence summary.
3. **User control:** knowledge changes are validated, previewed and explicitly approved. No silent destructive writes.
4. **Append-only evidence:** evidence is never edited or deleted; corrections supersede it with provenance.
5. **Stable identity:** IDs do not change when titles, display order or parent relationships change.
6. **Semantic graph vs visual layout:** dragging or styling nodes cannot alter knowledge relationships.
7. **Canonical ownership:** every knowledge object has one owner discipline; cross-domain use is represented through typed links.
8. **Local-first privacy:** learner data stays on the device by default. No mandatory account, cloud database, telemetry or third-party analytics in v1.
9. **Offline core:** core reading, capture, learning, assessment, review, import preview and backup must work offline after installation.
10. **Portability:** the user can export and restore the complete dataset in a documented, versioned format.
11. **Sustainable progression:** plans adapt to time, energy, obligations and recovery. Skipped work never creates an automatic backlog spiral.
12. **No false completeness:** draft taxonomy, placeholder content, untested technical choices and incomplete features are visibly labelled.

## 3. Users and operating model

V1 is a single-user personal system. No public profile, social feed, leaderboard, public sharing, or multi-tenant account model.

### Role split
- Learner: studies, explains, practises, applies, records reflections and approves changes.
- Gemini or another tutor: may teach and produce study material.
- ChatGPT or another evaluator: may independently test, research, evaluate and prepare structured update packages.
- ATHENA: validates packages, stores knowledge and evidence, derives competency views, schedules review and preserves history.
- Claude: owns technical implementation and technical ADRs; must preserve product and semantic invariants.
- User: owns product decisions and approves consequential scope, data, hosting and deployment choices.

No AI provider is privileged by the data model. Evaluator identity and provenance are recorded.

## 4. Core environments

### A. Execute
Purpose: make the next useful learning action obvious without turning the app into a rigid scheduler.

Required capabilities:
- current learning lanes and workload caps;
- proposed day mode (minimum, normal, high) and user override;
- next learning item with reason and expected outcome;
- session capture (read, watch, practise, review, build);
- notes, own explanation, uncertainty and independent capability report;
- project actions and milestone updates;
- review queue based on transparent, adjustable rules;
- fallback for busy, low-energy, missed, illness/injury and multi-day absence;
- no automatic carry-forward of missed tasks.

The app may suggest a plan; the learner approves it. A day mode never labels the learner as lazy or failed.

### B. Knowledge
Purpose: inspect the semantic model, find relationships and understand capability structure.

Required capabilities:
- searchable discipline/domain/skill/subskill/objective/resource/project catalogue;
- typed relationship graph with direction, rationale and gating metadata;
- filters by discipline, status, evidence state and relation type;
- skill and concept detail pages;
- prerequisite explanation and “what blocks this?” view;
- accessible searchable tree/list equivalent to every graph operation;
- transfer hypotheses visually distinguished from demonstrated transfer;
- draft and needs-review records visibly distinguished from approved records.

### C. Architect Studio
Purpose: maintain the knowledge system safely without editing source code.

Required capabilities:
- create/edit draft records and relationships;
- import/export knowledge subtrees;
- validate schemas, IDs, references, ownership, duplicates, dependency cycles and safety;
- impact analysis before approval;
- grouped diff preview and per-item accept/reject;
- approval and atomic commit;
- change history, undo/rollback and migration review;
- no software feature can be enabled merely by changing a content record.

### D. Updates inbox
Purpose: receive structured packages from ChatGPT, Gemini or other tools.

One shared pipeline for paste and file:
`received → parsed → validated → previewed → approved → committed`
with `rejected`, `failed` and `superseded` terminal states.

Required:
- provider-agnostic envelope;
- raw package/hash and provenance retained;
- schema and semantic validation;
- duplicate and version-drift detection;
- inert untrusted strings (never execute package text or fetch URLs automatically);
- AI cannot mint IDs or set mastery;
- preview before any write;
- restore point and atomic commit;
- package idempotency and conflict reporting.

## 5. Knowledge and capability model

The 18 macro disciplines remain the top-level taxonomy. Domains and skill families organise content beneath them. The hierarchy is not the only graph relationship: concepts, objectives, resources, assessments, projects, evidence and contexts link through typed edges.

A learning objective must specify:
- observable action;
- target knowledge/skill object;
- conditions;
- success criteria;
- assessment methods;
- evidence dimensions;
- relevant misconceptions and source references where appropriate.

A learning unit groups objectives, concepts, practice, resources and assessment. It is not a rigid school lesson or a completion badge.

A project integrates multiple capabilities through deliverables and acceptance criteria. Milestones are observable and reviewable.

### Competency dimensions
Store separately:
- exposure;
- self-reported understanding;
- demonstrated performance;
- retention;
- mastery designation.

The eight learner states (`not_exposed`, `exposed`, `practising`, `understood_provisionally`, `demonstrated`, `retained`, `mastered`, `needs_revision`) are derived display states, not an input ladder.

Never calculate capability from time spent, number of sessions, resources completed, streaks, or AI confidence. Every derived state must explain its evidence and rules version.

### Transfer
Transfer links are hypotheses until evidence demonstrates application in a distinct context. A relationship alone does not prove transfer. Transfer edges never act as prerequisites.

## 6. Learning lanes and workload

ATHENA supports parallel lanes with unequal budgets. Foundations are important but do not block all other interests until “completed.” The system should allow foundations, continuity practice, selected reading, aesthetics/photography, vocal practice, physical development, projects and other interests to coexist at sustainable intensity.

Baseline diagnostics are snapshots for routing, not gates. A baseline may identify gaps without blocking the learner from working in other domains.

Skipped items do not automatically roll forward. The next plan is re-derived from current constraints and priorities.

## 7. Physical development, nutrition and optional personal health tracking

ATHENA must teach physical development as a serious learning pathway, not as a cosmetic weight tracker.

### Knowledge pathway
`Physical Development & Nutrition` connects:
1. muscle growth and hypertrophy;
2. strength and power development;
3. healthy weight management, including gain and loss;
4. nutrition fundamentals and meal planning;
5. recovery, sleep and adaptation;
6. body composition and measurement literacy;
7. athletic conditioning and general physical capability.

Canonical ownership remains distributed:
- Body Science & Anatomy: physiology, metabolism, digestion, nutrition science and body composition.
- Athletics & Physical Performance: strength, hypertrophy, conditioning, mobility, technique and recovery.
- Mathematics & Scientific Reasoning: energy balance, measurement error, statistics and research interpretation.
- Psychology & Strategy: motivation, body image, sustainable behaviour and decision-making.

### Personal health tracking module
- Design the module and data contracts, but keep it dormant and disabled by default.
- Do not collect body measurements, nutrition logs, sleep records or other personal health data until the learner explicitly activates it.
- Activation is controlled by a threshold the learner defines. ATHENA must not invent a threshold, infer a diagnosis, or activate tracking automatically.
- Show exactly what data will be stored and why before activation.
- Keep health records in a logically separate data partition from learning evidence and competency records.
- Local-only by default; no AI sharing, cloud sync, analytics or third-party transfer without a separate explicit consent flow.
- User can pause, export and delete personal health records without deleting learning data.
- Do not turn weight, calories, body fat or measurements into public scores, streaks or mastery metrics.
- Any health guidance must be age-appropriate and avoid replacing qualified medical advice.

## 8. Privacy, backup and device portability

### V1 privacy
- Local-first IndexedDB or an equivalent browser-local store, selected by Claude after ADR review.
- No account requirement, cloud database, remote analytics, advertising SDK, third-party telemetry or automatic AI upload.
- Static app hosting is separate from personal data storage.
- Strict content security policy; self-hosted fonts/assets; sanitised Markdown; imported content is inert.
- Device lock is a later optional layer; do not claim browser-local data is encrypted at rest unless implemented and tested.

### Backup
- Complete versioned archive containing knowledge graph, relation registry, contexts, code tombstones, evidence, review events, sessions, notes, plans, projects, settings, rules, schema versions, changesets and provenance.
- SHA-256 integrity checksum; schema validation; archive manifest; record counts.
- Export verification reads the saved file and checks the checksum.
- Restore always begins with a dry-run into a scratch store and a conflict/count preview.
- Replace or merge requires explicit confirmation and creates a restore point first.
- Test lossless export → wipe scratch store → import → compare canonical hashes.
- Support passphrase-encrypted export as an optional capability only after key derivation, recovery and failure behaviour are documented. Never promise recovery if the user loses the key.

### SD card destination
- SD card is an intended user-controlled backup destination.
- Android browsers may not expose unrestricted direct SD-card writing. Do not hard-code direct filesystem access as a requirement.
- Preferred flow: generate archive → invoke supported Save/Share picker → user selects SD card in Android file picker.
- Fallback: download archive and instruct user to move/save it to the SD card through Android Files.
- Test the actual Infinix HOT 60i / Android 15 browser flow. Do not claim SD-card save works until a real-device test passes.
- Keep at least one independent backup copy where practical; an SD card alone can fail or be lost.

### Multi-device
- V1: one primary local device, documented export/import portability; no live sync.
- Architecture now: stable IDs, device IDs, record versions, timestamps, changesets and explicit conflict metadata so later multi-device support does not require identity redesign.
- Later: optional device-to-device or cloud sync, with per-record conflict resolution and user-visible merge preview. Never make an account mandatory.
- Future desktop/tablet is a first-class target, not a separate product.

## 9. Build principles and delivery constraints

- Phone-first authoring, testing and operation. No required PC-only workflow.
- Every critical flow must work at 360 CSS px and on a real mid-range Android device.
- Keep graph renderer lazy-loaded and benchmark before commitment.
- Core app should remain useful when graph visualisation is unavailable; accessible tree/list is mandatory.
- Performance budgets are targets until measured. Report measured device/browser and test conditions.
- No feature is marked complete from a static mockup. Buttons must work, state must persist, errors must be handled, and tests must cover behaviour.
- Claude may choose the stack after evaluating offline support, IndexedDB durability, mobile performance, maintainability, bundle size and developer workflow. Preserve existing ADRs and document changes.
- Do not start a cloud account, public deployment, paid service or irreversible repository action without user approval.

## 10. V1 scope and non-goals

V1 should prove a reliable vertical slice:
1. installable offline shell and navigation;
2. local data store and schema/version registry;
3. knowledge catalogue and skill/objective detail;
4. session capture and notes;
5. structured AI package import with validation, preview, approval and audit;
6. evidence append-only records and transparent derived competency view;
7. export/verify/restore dry-run;
8. basic knowledge graph plus accessible tree/list;
9. responsive design system and accessible interaction states.

Defer:
- live multi-device sync;
- mandatory account or cloud database;
- public sharing/social features;
- full coverage of all 18 disciplines' curricula;
- automatic AI tutoring inside ATHENA;
- automated health targets or body metrics;
- complex adaptive scheduling before reliable evidence exists.

## 11. Acceptance principle

A feature is complete only when its behaviour, persistence, validation, failure state, accessibility, mobile layout and tests are demonstrated. “Designed”, “planned”, “implemented”, “tested on emulator”, and “verified on real device” are separate statuses.
