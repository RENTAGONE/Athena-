# ATHENA — Master Project Bible
Version: 0.1.0
Last consolidated: 2026-11-16
Status: Living specification; initial consolidation, not a finished product spec.

## 1. Purpose
ATHENA is an advanced personal learning and knowledge-management system. It is not merely a habit tracker, checklist, progress-bar dashboard, or static skill tree. It should help the user plan learning, build and connect knowledge, test competence, retain information, manage projects, and progressively take ownership of their own learning system.

## 2. Governing principles
- Understanding over speed. Time estimates are provisional, never arbitrary deadlines.
- Adaptive progression: accelerate when demonstrated competence is strong; extend and remediate when gaps persist.
- Just-in-Time Depth Acquisition: acquire the prerequisites needed for the next meaningful application, then deepen as new applications demand it. Never skip essential foundations or safety.
- Evidence over self-reported completion. Distinguish exposure, self-reported understanding, demonstrated performance, and retained knowledge.
- No automatic mastery declarations. Mastery requires defined criteria and evidence.
- No silent overwrites or destructive changes. Preview, validate, approve, preserve history.
- Keep personal learning progression distinct from ATHENA software capability progression.
- Mobile-first, local-first, low-maintenance, portable data and offline-capable core; live cloud sync is deferred beyond v1.
- Detailed architecture may be designed early; active tracking and advanced features should be activated progressively.
- Sample/demo data must be clearly labelled. Never present invented metrics as real.

## 3. User context relevant to design
- Phone-first Android user; currently no dedicated PC/laptop. The app must be usable on a narrow mobile screen and practical to maintain from a phone.
- School schedule: Sunday–Thursday, 8:00 AM–1:00 PM. Learning start planned for 2026-12-10, after Class 8 finals end 2026-12-09.
- User correction on 2026-11-16: age 15, height 5'11" (180.3 cm), weight 44 kg (user-reported). Treat these as user-reported current figures, not a diagnosis. Because this is a very low weight for the reported height, encourage discussion with a parent/guardian and prompt assessment by a qualified doctor using age- and sex-appropriate growth charts before setting a weight-gain or training prescription. Avoid aggressive bulking, supplements, or high-load training plans without appropriate guidance.
- Sleep target: 8–10 hours for age 15; proposed routine target 10:30 PM–7:00 AM.
- Physical activity interests include football, badminton and tennis-ball footwork. Training must be age-appropriate and prioritize technique, gradual progression, nutrition, sleep and recovery.
- Strong English; technical Bangla wording in science/math can be difficult. Assess current knowledge rather than assuming it.
- Mathematics: basic algebra familiarity; exponents and square roots not yet learned at last report. Baseline assessment required.
- No vegetables reported; nutrition guidance should be practical, non-shaming, age-appropriate and encourage guardian/qualified professional support when needed.
- User has practical exposure to Python, web projects, GitHub/Vercel workflows and a small digital-products business, but should not be assumed independently proficient in maintaining a complex application.

## 4. Platform and implementation ownership
- Product direction: hybrid mobile-first PWA.
- Core learning and knowledge data should work locally/offline where feasible.
- Cloud backup and synchronization are separate layers, not a hard dependency for basic use.
- Claude owns full application implementation and may research, recommend and select technical architecture, frameworks, libraries, storage, graph rendering and deployment approaches.
- ChatGPT owns knowledge architecture and content: stable knowledge IDs, disciplines, skills, objectives, prerequisites, cross-links, micro-skills, assessment/evidence definitions, structured seed data and review.
- Claude should document significant technical choices in Architecture Decision Records (ADRs), explain trade-offs, and preserve the product invariants in this Bible.
- The user approves consequential product decisions and changes.

## 5. Three application environments
### A. Execution
Daily plan, study sessions, revisions, routines, micro-skill practice, physical activity, weekly review, fallback plans and actual execution records.
### B. Knowledge
Knowledge graph, discipline maps, curricula, resources, notes, concepts, skills, objectives, competencies, research, projects and long-term roadmaps.
### C. Architect Studio
Content/data authoring and management: discipline/skill/curriculum editors, resources, assessments, micro-skills, schedules, feature roadmap, import/export, backup/restore, version history and rollback.
Routine knowledge/content changes should be manageable in Architect Studio without source-code edits. Software capability changes require Claude-led development, tests and deployment.

## 6. Learning/update loop
1. User studies with Gemini.
2. User reports topic, material studied, own explanation, what is understood, what remains unclear, and what they can do independently.
3. ChatGPT independently evaluates the material and tests understanding through recall, explanation, problems and practical tasks. Verify claims as appropriate; do not assume Gemini is correct.
4. ChatGPT separates studied, self-reported understanding and demonstrated competence; identifies misconceptions, gaps and next actions.
5. ChatGPT generates a structured ATHENA update package.
6. ATHENA validates schema, IDs, dependencies, duplicates and conflicts; shows a preview and preserves history.
7. User approves before the update is committed/imported.
Roles: Gemini teaches; ChatGPT evaluates and prepares structured updates; ATHENA validates, stores, organizes and schedules; user learns, explains, practises, applies and approves.

## 7. Competency model
Never collapse these into one checkbox:
- Exposure: material was encountered.
- Self-report: learner says they understand or can perform it.
- Demonstration: learner produces evidence under defined conditions.
- Retention: learner can retrieve/apply after a time interval.
- Mastery: repeated, reliable performance across suitable contexts, meeting explicit criteria.
Record evidence, date, conditions, assessment method, confidence, provenance and assessor. A single correct answer is not automatically mastery.

## 8. Six foundational pillars
1. Learning how to learn: retrieval practice, spaced practice, active recall, interleaving, deliberate practice, Feynman explanation, cognitive-load management, note systems and self-assessment.
2. Mathematics foundations: baseline; arithmetic; fractions/decimals/percentages; ratios; negative numbers; algebra; equations/inequalities; exponents/roots; geometry; graphs.
3. Logic and analytical reasoning: deduction, induction, abduction, conditionals, patterns, fallacies, causality, hypotheses, probability and decision-making.
4. Research literacy: source types, primary/secondary sources, evidence quality, fact-checking, documentation, textbooks/papers and note provenance.
5. Communication and language: technical English, academic vocabulary, reading comprehension, concise writing, explanation, structured argument and technical Bangla vocabulary.
6. Digital/workflow foundations: file management, keyboard skills, terminal, Git/GitHub, OS concepts, digital security, documentation and knowledge management.

## 9. Initial 18 discipline domains
See `../01_REGISTRIES/DISCIPLINE_REGISTRY.json`. The initial domains are an organizing taxonomy, not a claim that every curriculum is fully specified. Cross-links should be explicit and typed.

## 10. Micro-skill subsystem
Micro-skills are a distinct layer linked to macro disciplines. Categories: cognitive/mental, dexterity/coordination, practical/everyday, social/communication, safety/emergency. Each record should include definition, target performance, prerequisites, practice protocol, measurable test, maintenance/retention and safe variations. Short practice slots must not displace school, sleep, foundations or recovery. Age and safety constraints apply; omit dangerous lighter tricks and unlawful lock-bypass activities. First aid/CPR should be learned through qualified, supervised instruction.

## 11. Scheduling and fallback
- Weekly schedule: school Sunday–Thursday 8 AM–1 PM; Friday/Saturday weekends/buffer.
- Daily modes: minimum viable day, normal day, high-capacity day.
- Fallbacks: busy, low-energy, missed session, illness/injury and several missed days.
- Do not cram missed work into the next day or create a backlog spiral.
- Routine templates, proposed schedules and actual execution records must be separate.
- Schedule changes are proposals until user approves them.
- Weekly strategic review: Saturday, 8 PM Asia/Dhaka, one hour. A recurring review automation already exists; do not create a duplicate. It reviews learning, execution, assessments, retention, disciplines, micro-skills, projects, research, activity/recovery and next-week priorities. It proposes changes only.

## 12. Knowledge graph requirements
- Data-driven graph; never hardcode a static illustration as the knowledge model.
- Permanent IDs for nodes and edges. Semantic relationships are separate from visual positions/layout.
- Relationship types include prerequisite, contains/part-of, related-concept, supports, applies-to and cross-disciplinary connection; define direction and semantics.
- Visual positions are user-adjustable and stored separately. Support manual/automatic/hierarchical/force-directed/grouped layouts and reset.
- Mobile interactions: pan, pinch zoom, drag nodes, tap for details, expand children, long-press/context actions, pin nodes. Creating edges must validate allowed relationship types and prevent invalid cycles where relevant.
- Each discipline has a stable color and icon identity. Node status uses a separate consistent visual language: unexplored, learning, demonstrated, mastered, needs revision. Avoid confusing color with competence.
- Clickable edge explains the relationship. Active learning path may be highlighted. Motion should be restrained and respect reduced-motion settings.
- Node detail: description, objectives, prerequisites, children, curriculum stage, resources, notes, assessment history, project evidence, retention state and next action.

## 13. Architect Studio and governance
Data/content changes: edit skills, curricula, resources, prerequisites, micro-skills, assessments and routines.
Software changes: new analytics, graph engine, retention algorithm, storage architecture, integrations and modules.
Require drafts, validation, preview, approval, audit history and rollback for consequential changes. Feature flags/roadmap statuses: Available, Designed, Planned, Future, Needs upgrade. Eligibility does not automatically deploy code.

## 14. Visual/product quality direction
Premium, motivating command center; dark charcoal/near-black base, deep navy/teal surfaces, restrained cyan/violet highlights, strong typography, useful hierarchy, distinctive discipline colors, clear evidence-based progress visuals and subtle purposeful transitions. Do not squeeze a desktop dashboard onto a phone. Avoid excessive gamification, decorative animation, layout-shifting motion, generic SaaS sameness, fake metrics, placeholder functionality and unimplemented controls.

## 15. Anti-slop adaptation
Use the uploaded Anti-Slop Bible selectively:
- Specificity and evidence over vague claims.
- Avoid generic AI phrases, filler, empty adjectives and vague CTAs.
- Mobile performance discipline; measure performance rather than claiming it.
- Optimize assets and fonts; avoid main-thread bloat.
- Prefer purposeful transform/opacity motion; avoid scroll-jacking and continuous decoration.
- Respect accessibility and reduced motion.
- No truncated code, fake completion, TODO placeholders presented as finished work, or unrelated scope changes.
Do NOT import its Dhaka B2B niche matrices, lead-generation funnels, pricing/ROI assumptions, WhatsApp sales architecture, medical/real-estate/visa components or fixed business color matrices into ATHENA.

## 16. Launch preparation and learning-lane model
- 2026-11-16 through 2026-12-09 is the ATHENA creation/preparation period. User explicitly does not want to begin the formal learning curriculum during this period; focus on developing ATHENA, its knowledge architecture, assessments, and launch materials.
- Formal learning launch is planned for 2026-12-10. Begin with a baseline diagnostic snapshot, not a requirement to complete all six foundational pillars before any other discipline can be studied.
- Baselines are diagnostic assessments, not a prolonged gate. Results determine what to teach, practise, skip provisionally, or revisit.
- Use parallel, workload-controlled learning lanes after launch: (A) foundational learning as the main priority; (B) continuity practice such as vocal exercises; (C) business reading and application, including finishing the user's current Hormozi book; (D) aesthetics/creative practice including fashion and phone photography; (E) physical development, health, sport and recovery.
- These lanes are not equally weighted and should not all receive intensive daily sessions. Maintain selected interests through short, deliberate practice and rotate deeper projects. Do not defer every non-foundational interest until all foundations are completed.
- Existing learning and practice should be assessed before assigning beginner material. Use practical application to connect lanes (e.g. photography with composition/visual design; business reading with the user's existing business).
- Holiday/school-day schedules are separate templates. Build the routine around actual school and family commitments if they resume.

## 17. Current state and next work
- ATHENA Build Pack v0.1 exists as the initial Claude build brief and decision/ID foundation.
- This Master Vault v0.1 consolidates known project context and is the canonical working snapshot.
- Full skill/subskill taxonomy, objective registry, micro-skill registry, edge registry, assessment schemas and detailed curriculum remain to be built and reviewed. Do not invent hundreds of IDs before definitions and relationships are stable.
- Next architecture work: develop a rigorous, staged knowledge taxonomy across all 18 domains, then assign stable IDs and create prerequisite/cross-link registries.


## Long-term development roadmap
See `ATHENA_LONG_TERM_CAPABILITY_ROADMAP.md`. The roadmap is provisional and evidence-led, not a promise of mastery or a rigid deadline.


## Competitive advantage and value creation
See `ATHENA_COMPETITIVE_ADVANTAGE_STRATEGY.md` for the user's intended multidisciplinary top-1%-style ambition, academic transfer, economic value creation and evidence-based measurement. This is an aspirational target, not a guaranteed percentile.


## Academic and financial outcomes
See `ATHENA_ACADEMIC_AND_FINANCIAL_OUTCOMES.md`. ATHENA is an independent multidisciplinary learning system, not a school-management, syllabus-tracking, homework or exam-preparation app. Its foundational knowledge should create natural cross-domain transfer into school and everyday life (for example, mathematics supporting physics or anatomy supporting biology), without mirroring the school syllabus. It should also develop independent reading/learning and ethical financial capability. No grades or income are guaranteed.


## Cross-domain transfer requirement
ATHENA must explicitly model meaningful knowledge transfer across disciplines and into external contexts. Transfer relationships are distinct from prerequisites and visual graph edges; see `ATHENA_ACADEMIC_AND_FINANCIAL_OUTCOMES.md`. School is an incidental destination for transferable knowledge, not an application workflow or managed curriculum. The user handles school independently.


## Current knowledge-architecture status (2026-11-16)
- Ontology v0.1 defines canonical learning object types and typed relationships.
- Historical Domain Map v0.2 contained 109 draft domains and 40 skill families. The current Domain Map v0.3 in Knowledge Pack v0.8 contains 113 draft domains and 40 skill families after restoring four previously missing seed domains.
- These entries are proposals requiring review; do not treat the count as a measure of curriculum completeness.
- Next work: review domain boundaries and omissions, then author skill/subskill/objective registries in controlled batches, followed by prerequisites, transfer edges, assessment and micro-skill registries.
- The user is building the knowledge architecture with ChatGPT while Claude completes Stage 0 technical architecture. Reconcile semantic model and implementation decisions after Claude returns.


## Cross-domain transfer registry status (2026-11-16)
- Transfer Registry v0.2 currently contains 31 draft links and six application contexts.
- It includes examples such as algebra to physics problem-solving, anatomy to physiology, anatomy to biomechanics, statistics to financial risk, research design to customer discovery, and command-line fluency to automation.
- These are hypothesised mechanisms, not guaranteed transfer effects. The learner must demonstrate transfer in a new context before it is treated as evidenced.
- External contexts are not additional disciplines and do not convert ATHENA into a school or syllabus-management system.


## Discipline boundary governance (2026-11-16)
- A draft boundary matrix exists for all 18 disciplines.
- Each knowledge object should have one canonical owner based on its primary learning outcome. Cross-domain usefulness is modelled through typed relationships rather than duplicate copies.
- Distinct aspects of a shared subject may have separate objectives when their outcomes differ; the boundary must be explicit.
- Specialist/safety-critical learning requires authoritative sources and appropriate supervision; ATHENA completion is not a professional qualification.


## Learning objectives and competency evidence (2026-11-16)
- Approved learning objectives must specify observable action, target, relevant conditions, success criteria and assessment method.
- Resource completion is never sufficient evidence of competency.
- Competency states preserve evidence history and can regress to needs_revision when forgetting or instability is observed.
- Mastery requires repeated independent evidence across appropriate variation and time; criteria are objective/domain-specific rather than a universal percentage.
- AI evaluators may assist but cannot silently confer mastery; preserve task, response, rubric, evaluator, provenance and uncertainty.


## Product and implementation specification update — 2026-11-17

Master Vault v1.4 adds the binding `ATHENA_PRODUCT_AND_EXPERIENCE_SPEC_v1.0.md`, `ATHENA_VISUAL_IDENTITY_AND_DESIGN_SYSTEM_v1.0.md`, and `ATHENA_PRIVACY_BACKUP_AND_DEVICE_PORTABILITY_v1.0.md`. These documents refine the existing project invariants; they do not turn ATHENA into a school-management app or generic productivity tracker.

The visual direction is the **Cognitive Atlas**: a distinctive research-observatory / editorial-atlas interface with a precise token system, stable discipline identity colours, restrained state-based glow, meaningful graph motion, explicit component states and concrete screen compositions. Generic dashboard styling is not an acceptable substitute.

Privacy and device decisions: local-first personal data; no mandatory account/cloud/telemetry in v1; user-controlled versioned backups intended to be saved to SD card where Android permits; multi-device portability designed now but live sync deferred; optional personal health tracking designed dormant and disabled until the user explicitly activates it using a threshold/trigger they define.

The content-authoring roadmap and domain coverage inventory are included in `ATHENA_CONTENT_AUTHORING_ROADMAP_v1.0.md` and the embedded Knowledge Architecture Pack v0.8. They explicitly distinguish taxonomy coverage from approved curriculum coverage.
