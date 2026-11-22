# ATHENA Wave 09 — App Integration Handoff
Version 1.0 · 2026-11-19 · Draft implementation contract

## Import package

Files:
- `ATHENA_WAVE_09_PROJECT_RECORDS_v1.0.json`
- `ATHENA_WAVE_09_PROJECT_BLUEPRINTS_v1.0.json`
- `ATHENA_WAVE_09_PROJECT_CLASS_CONTRACT_v1.0.json`
- `ATHENA_WAVE_09_PROJECT_TRACEABILITY_v1.0.json`
- `ATHENA_WAVE_09_LEGACY_PROJECT_CLASS_CROSSWALK_v1.0.json`
- `ATHENA_PROJECT_RECORD_SCHEMA_v1.1.json`

## Required product behaviour

### 1. Exactly three project classes
The project creation flow must require one explicit `project_class`:
- `personal_use`
- `product_business_foundation`
- `intrinsic_exploration`

Do not offer a generic integrated-project class as a fourth category. Teamwork, research, design, software and presentation are methods or formats, not classes.

### 2. Class-specific intake
The first prompt asks why the learner wants to do the project. The interface then uses class-specific questions:
- Personal-use: What real problem in your own context are you trying to solve? What happens now? What would count as improvement?
- Product/business-foundation: Who is the defined user? What problem evidence exists? What is the smallest useful prototype? What would justify continuing or stopping?
- Intrinsic: What are you curious about or trying to express? What would be interesting to explore? Explicitly show that usefulness, public sharing and monetisation are not required.

If the learner's answer fits more than one class, suggest splitting it into linked projects or selecting one primary purpose. Never silently blend the three class rubrics.

### 3. Different success criteria and review prompts
Render class-specific completion criteria:
- Personal-use: Did the learner's actual situation improve?
- Product/business-foundation: What evidence justifies the next investment of effort?
- Intrinsic: What did the learner discover, notice, create or become curious about?

Intrinsic projects must not display commercial viability, customer demand, utility or public audience as success fields. Personal-use projects must not require customer validation. Product/business-foundation projects must not imply that a sale is required.

### 4. Project evidence and competence are separate
Store project artefacts/process evidence independently from module assessment outcomes. Link target modules through `target_module_ids`; each target links to its Wave 08 instrument by exact module ID. The link is a candidate opportunity only. Project completion never auto-completes a module, awards mastery or establishes retention.

### 5. Lifecycle and user control
Suggested project state flow: proposed → active → paused → completed / archived. Stopping or pausing is a valid user decision. Do not auto-create overdue tasks or carry missed milestones into the next day. Keep changes reviewable and reversible.

### 6. Privacy and safety
- Default to local-only project records.
- Use dummy/synthetic data unless real data are necessary and permissioned.
- No credentials, recovery codes, private customer records or sensitive personal data in project artefacts.
- Public release, spending, paid services, contracts, customer payments or real user data involving a minor require guardian involvement and applicable legal/platform checks.
- Never auto-fetch project resource URLs or execute imported project content.

### 7. Legacy migration
- Preserve `ATH-IP-M14-001` through `ATH-IP-M14-009` and all IP-001–IP-024 legacy references.
- Use `ATHENA_WAVE_09_LEGACY_PROJECT_CLASS_CROSSWALK_v1.0.json` as a proposed navigation map only.
- `ATH-IP-M14-009` is a collaboration format, not a project class; concrete instances must select one of the three classes.
- Do not auto-classify the older IP-001–IP-024 bank until each project's purpose and success condition have been inspected.
- New records use `ATH-PROJ-*` IDs and schema v1.1.

## Import validation requirements
1. Validate project records against `ATHENA_PROJECT_RECORD_SCHEMA_v1.1.json`.
2. Validate blueprints against `ATHENA_WAVE_09_PROJECT_BLUEPRINT_SCHEMA_v1.0.json`.
3. Resolve every target module ID against the 216-module baseline.
4. Resolve every assessment instrument reference against the Wave 08 assessment bank.
5. Check project class, blueprint reference and record ID agree.
6. Reject duplicate IDs and unknown class values.
7. Display class, purpose, target modules, safety notes and evidence requirements in preview before import.
8. Do not create mastery/evidence claims during import.
9. Keep import provenance and package hash; use the existing Updates Inbox preview/approve/commit pipeline.

## Acceptance checks for the app
- Each class can be created, edited, paused and completed without sharing fields that impose another class's success condition.
- An intrinsic project can be completed with no audience, practical use or business plan.
- A personal-use project can be completed without a customer, public launch or sale.
- A product/business-foundation project can be completed with a stop decision and no revenue.
- Target module links open the correct module and assessment; no automatic status mutation occurs.
- A project can be paused/stopped without a backlog spiral.
- Offline project capture, editing and export work under the product's local-first requirements.
