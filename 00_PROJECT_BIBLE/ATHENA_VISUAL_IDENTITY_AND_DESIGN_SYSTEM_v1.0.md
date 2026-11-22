# ATHENA Visual Identity & Interface Design System
Version 1.0.0 · 2026-11-17 · Binding visual direction for the first implementation

## 1. The design brief

ATHENA must look like a purpose-built instrument for navigating knowledge and building capability—not a generic SaaS dashboard, school app, habit tracker, or neon gaming interface.

### Core art direction: THE COGNITIVE ATLAS
A fusion of:
- a modern research observatory (precision, orientation, signal);
- an editorial field atlas (hierarchy, annotation, legibility);
- a high-end technical instrument (measured controls, clear state, restrained light);
- a living knowledge constellation (relationships, pathways, evidence trails).

The interface should feel intelligent, calm, precise, tactile and slightly futuristic. It must be visually distinctive at first glance while remaining readable during long study sessions.

### Signature visual devices
1. **Atlas grid:** an extremely subtle coordinate/grid texture in large empty canvases, never behind dense text.
2. **Signal rail:** a thin luminous edge or short gradient stroke identifying the active environment, selected discipline or current focus.
3. **Constellation map:** knowledge nodes use discipline-specific accent colours, precise connectors and restrained focus halos. Layout is a view, never the source of semantic truth.
4. **Evidence trace:** compact chronological marks showing what was demonstrated, under which conditions, and when it was last retained.
5. **Focus lens:** selecting a skill/objective isolates its immediate prerequisite, supporting and transfer neighbourhood; unrelated graph content recedes rather than disappearing without explanation.
6. **Instrument labels:** small uppercase/monospaced metadata for IDs, status, dates, versions and provenance; readable body copy remains normal case.
7. **Editorial asymmetry:** use deliberate hierarchy, large section titles, concise explanations and varied content density. Do not arrange every screen as identical rows of equal cards.

## 2. Brand personality

| Attribute | Expression |
|---|---|
| Intelligent | Clear hierarchy, precise language, useful data visualisation |
| Ambitious | Strong scale and confident composition, never motivational clichés |
| Calm | Dark mineral surfaces, controlled contrast, no constant movement |
| Scientific | Evidence provenance, units, uncertainty and explicit status |
| Exploratory | Atlas/constellation motifs and meaningful cross-links |
| Personal | One learner's private instrument, not a public social profile |

Avoid: childish gamification, cartoon mascots, trophy cabinets, streak flames, generic AI sparkle icons, random gradients, cyberpunk overload, glassmorphism everywhere, giant empty hero slogans, and fake data.

## 3. Colour system

### Core dark theme (v1 default)
| Token | Hex | Use |
|---|---|---|
| `canvas-0` | `#080D12` | Main app background |
| `canvas-1` | `#0D141B` | Large work areas |
| `surface-1` | `#121C25` | Primary panels |
| `surface-2` | `#182631` | Raised panels and selected rows |
| `surface-3` | `#20323F` | Popovers, sheets, elevated controls |
| `line-subtle` | `#253743` | Quiet dividers |
| `line-strong` | `#3A505E` | Structural borders |
| `text-primary` | `#F1F5F7` | Primary copy |
| `text-secondary` | `#B0BEC7` | Supporting copy |
| `text-muted` | `#8799A5` | Metadata; never essential alone |
| `text-inverse` | `#071016` | Text on bright accent fills |
| `signal-teal` | `#5BE0C1` | Active/focus/primary signal |
| `signal-blue` | `#8CB9FF` | Information and navigation |
| `signal-violet` | `#B8A5FF` | Knowledge/creative secondary signal |
| `signal-amber` | `#F2C47B` | Caution, provisional, attention |
| `signal-coral` | `#FF8E87` | Error, destructive or disputed state |
| `signal-green` | `#70D7A5` | Verified/success state |

Rules:
- The dark theme is the initial shipped theme, not a permanent prohibition on light mode.
- Accent fills are rare. Most accents appear as 1–3 px rails, node rings, icon strokes, focus outlines or small chart marks.
- Use `text-primary` and `text-secondary` for essential content. `text-muted` is metadata only and must pass contrast for its actual size.
- Semantic states always include text/icon/shape, not colour alone.
- Do not use a single green “progress” colour to imply that every learning state is good or complete.

### Discipline identity palette
Discipline colour is a stable identity token, not a mastery indicator. Use it for a small glyph, rail, graph node ring and filter marker; do not tint entire screens.

| Discipline | Token | Hex |
|---|---|---|
| Engineering & Computer Science | `discipline-eng` | `#75AFFF` |
| Business & Entrepreneurship | `discipline-biz` | `#E9B66D` |
| Electronics & Hardware | `discipline-elec` | `#65CFE0` |
| Finance & Economics | `discipline-fin` | `#A9D58A` |
| Body Science & Anatomy | `discipline-body` | `#E58FA0` |
| Psychology & Strategy | `discipline-psy` | `#B5A0F4` |
| Aesthetics & Visual Design | `discipline-aest` | `#F09BC5` |
| Workflow & Productivity | `discipline-work` | `#91AAB8` |
| Artistic Development | `discipline-art` | `#DFA77A` |
| Athletics & Physical Performance | `discipline-ath` | `#79D3A5` |
| Vocal & Performance Arts | `discipline-perf` | `#C9A0F2` |
| Mathematics & Scientific Reasoning | `discipline-math` | `#8FB7F0` |
| Cybersecurity & Digital Infrastructure | `discipline-cyber` | `#79B6D0` |
| Language & Linguistic Intelligence | `discipline-lang` | `#D4B77D` |
| Research & Information Intelligence | `discipline-res` | `#9ABBA8` |
| Practical Independence | `discipline-indep` | `#D4A88C` |
| Leadership & Management | `discipline-lead` | `#A6B1E2` |
| Communication & Rhetoric | `discipline-comm` | `#E0A09B` |

## 4. Typography

Use self-hosted, locally bundled font files. No runtime Google Fonts or external font requests.

- **Display / section headings:** Space Grotesk (or a metrically similar geometric sans fallback). Use for H1/H2 and high-level numbers only.
- **UI / body:** Inter (or system sans fallback). Use for navigation, labels, forms, paragraphs and descriptions.
- **Technical metadata:** IBM Plex Mono (or system monospace fallback). Use for IDs, timestamps, schema versions, units and compact data labels.

Typography rules:
- Body text default 15–16 px on mobile, line-height 1.45–1.6.
- Dense metadata may be 11–12 px, but never for essential instructions or long paragraphs.
- Heading scale: 30–36 px page title on desktop; 25–30 px mobile; section title 20–24 px; component title 15–18 px.
- Use tabular numerals for durations, counts, dates and measurements.
- Do not use all-caps for paragraphs. Small uppercase metadata labels may use letter spacing 0.08em.
- Support 200% text scaling without clipping or loss of controls.

## 5. Layout and geometry

### Spacing scale
4 px base: `space-1=4`, `space-2=8`, `space-3=12`, `space-4=16`, `space-5=20`, `space-6=24`, `space-8=32`, `space-10=40`, `space-12=48`, `space-16=64`.

### Shape
- Compact controls: 8 px radius.
- Standard panels: 12 px radius.
- Feature panels and sheets: 16 px radius.
- Modal/large overlay: 20 px radius.
- Avoid pill-shaped everything. Pills are reserved for filters, compact statuses and segmented controls.
- Structural borders are clearer than muddy shadows. Use shadow only to establish overlay depth.

### Responsive breakpoints
- `compact`: 0–479 px (primary phone target).
- `tablet`: 480–839 px.
- `desktop`: 840–1199 px.
- `wide`: 1200 px and above.

At 360 px:
- one primary content column;
- bottom navigation for the three environments;
- top bar holds ATHENA mark, current context and compact utility actions;
- primary actions remain within thumb reach;
- no horizontal page scroll;
- sheets use near-full width and safe-area padding;
- charts and graph canvases can pan internally but must not trap page navigation.

At desktop:
- persistent left navigation rail;
- content canvas with an optional right inspector;
- graph and Studio may use multi-pane layouts;
- avoid stretching reading text across the full viewport (ideal reading measure 60–80 characters).

## 6. Iconography and graphic language

Use one consistent line-icon family (Lucide or equivalent) with 1.75–2 px stroke. Icons are 18–22 px in controls and 24–28 px in section identity. Do not mix emoji, filled icon packs and multiple stroke weights.

Each discipline has:
- one simple glyph/icon;
- one stable accent token;
- one short label;
- optional small geometric motif for graph nodes.

Create a small ATHENA monogram/mark based on a compass aperture or abstract A-shaped coordinate instrument. Do not use an owl, Greek helmet, goddess portrait or stock AI sparkle.

## 7. Motion and lighting

Motion communicates state, hierarchy and relationship—not decoration.

| Interaction | Duration target | Behaviour |
|---|---:|---|
| Hover/press/focus | 100–160 ms | Colour/opacity/scale ≤ 1.02 |
| Button and selection | 120–180 ms | Short ease-out; clear pressed state |
| Sheet/popover | 180–240 ms | Transform + opacity |
| Page/environment transition | 180–260 ms | Crossfade/short directional movement |
| Graph focus/re-layout | 220–360 ms | Animate only changed nodes/edges |
| Success confirmation | 180–240 ms | Brief check/rail signal; no confetti |

Lighting rules:
- Active primary control: restrained teal halo (small radius, low opacity).
- Selected graph node: accent ring plus subtle halo; neighbouring nodes gain a low-opacity connection highlight.
- Keyboard focus: visible 2 px high-contrast outline with offset.
- Destructive actions: coral signal, never a glowing green confirmation.
- Ambient atlas grid is static. No permanently pulsing nodes, breathing cards, animated backgrounds, or looping decorative glows.
- Honour `prefers-reduced-motion`; reduce transitions to immediate state changes.
- Use transform and opacity for animation; avoid animating blur, large shadows, layout dimensions or expensive filters on low-end phones.

## 8. Surface and component system

Every reusable component must define default, hover, pressed, focused, disabled, loading, error and selected states where applicable.

### Navigation
- `AppShell`: top context bar, environment navigation, content canvas, optional inspector.
- `BottomNav`: Execute, Knowledge, Studio; active environment uses the signal rail and icon.
- `ContextHeader`: page title, one-line purpose, breadcrumb/context, primary action.
- `CommandSearch`: global search, recent targets, quick capture; keyboard and touch support.

### Data and content
- `DisciplineMark`: icon + accent + label; never colour-only.
- `StatusTag`: Draft, Needs review, Approved, Deprecated, Archived; neutral by default.
- `EvidenceTrace`: compact event strip with date, evidence class, independence and outcome.
- `CompetencyPanel`: five separate dimensions with explanation links; no single global score.
- `RelationChip`: typed relation label, direction and rationale affordance.
- `ProvenanceLine`: source, evaluator/provider, model/version, timestamp and package reference.
- `MetricReadout`: value, unit, date and context; never a bare number without meaning.
- `EmptyState`: explains why empty and gives a real next action.
- `LoadingState`: skeletons that match final layout, not generic spinners everywhere.
- `ErrorState`: what failed, what remains safe, retry/export/recovery action.

### Actions and forms
- `PrimaryButton`, `SecondaryButton`, `QuietButton`, `DestructiveButton`.
- `TextField`, `TextArea`, `SearchField`, `Select`, `SegmentedControl`, `Checkbox`, `DateField`.
- `ConfirmDialog` for irreversible actions; clear consequence text.
- `BottomSheet` on mobile and `Dialog` on desktop.
- `Toast` for transient confirmation only; persistent errors remain visible.
- Every control has a visible label or accessible name and a 48 px minimum touch target on phone.

### Knowledge-specific
- `AtlasCanvas`: graph viewport, zoom controls, minimap/overview where useful, visible node cap and loading state.
- `AtlasNode`: discipline/domain/skill/objective variants; state ring and relation handles.
- `AtlasEdge`: arrow direction, type-specific line treatment, focus/hover explanation.
- `NeighbourhoodInspector`: selected object, prerequisites, support links, transfer links and evidence state.
- `KnowledgeTreeTwin`: searchable accessible tree/list sharing selection with AtlasCanvas.
- `DependencyPanel`: hard/recommended/helpful dependencies with explicit gate labels.
- `TransferHypothesisCard`: visibly marked hypothesis until evidence exists.

### Studio and import
- `StudioStepRail`: Edit → Validate → Impact → Preview → Approve.
- `ValidationSummary`: errors, warnings and informational notes grouped by record.
- `DiffViewer`: additions, changes, archives and relationship changes; before/after values.
- `ImpactMap`: affected dependents, evidence orphan risks and graph consequences.
- `PackageReceipt`: source, provider/model, created time, package hash and validation result.
- `ApprovalFooter`: exact count and consequences; no approve-all default for risky packages.

### Backup and privacy
- `BackupStatus`: last export, verified status, age and destination.
- `ExportFlow`: archive generation, checksum, save/share picker and SD-card fallback instructions.
- `RestorePreview`: source, archive version, counts, conflicts, migration plan and scratch validation.
- `PrivacyControl`: data category, storage location, sharing state and explicit activation.

## 9. Screen composition requirements

### 9.1 Execute / Today
- Header: “Today” plus local date and current day mode.
- Primary focus area: one recommended next action with the reason it was selected, target capability and estimated effort (if known).
- Lane rail: compact list of active lanes with priority and weekly budget, not completion percentages.
- Continue strip: unfinished project or learning thread, explicitly optional.
- Review queue: due items with last demonstrated date and evidence cue.
- Quick capture action always reachable.
- Empty day state says “No plan approved” and offers to create/review one; it must not imply failure.

### 9.2 Knowledge Atlas
- Search and discipline filters above the canvas.
- Atlas viewport with visible-node cap and focus-lens selection.
- Legend shows node types, relation types, lifecycle and evidence state.
- A list/tree toggle is always available and is a full equivalent, not a degraded fallback.
- Tap node opens a bottom sheet on phone; desktop uses right inspector.
- Selecting a node shows its direct neighbourhood and hides distant detail progressively, not randomly.
- Explore mode cannot drag nodes. Arrange mode is explicit and separate.
- Graph layout writes are stored separately from semantic nodes/edges.

### 9.3 Skill detail
- Identity header: skill title, discipline mark, lifecycle status, stable code.
- Capability statement in plain language.
- Five competency dimensions shown separately with short evidence explanation.
- Objectives and subskills with clear status.
- Prerequisites grouped by hard/recommended/helpful; hard gate reason shown.
- Practice protocols, resources and assessments.
- Evidence trace and retention history.
- Linked projects and demonstrated transfer.
- “Start practice” and “Record evidence” actions must be functional.

### 9.4 Learning session
- One primary task at a time; do not surround learning with dashboard chrome.
- Show objective, conditions, materials and completion criteria.
- Optional timer; elapsed time never becomes mastery evidence.
- During session: note, uncertainty marker, ask-for-help marker.
- End session asks for own explanation, what remains unclear and what can be done independently.
- Evidence submission is separate from self-report and requires conditions.

### 9.5 Architect Studio
- Phone: vertical guided steps Edit → Validate → Impact → Preview → Approve.
- Desktop: editor, validation/impact inspector and diff preview in a balanced multi-pane layout.
- Draft autosave is local. Nothing commits merely because a form was edited.
- Errors block commit; warnings require explicit acknowledgement where policy permits.
- Impact preview identifies affected dependents, evidence references, ownership changes and graph cycles.

### 9.6 Updates inbox
- Show package origin, provider/model, package ID, timestamp, based-on versions and content hash.
- Validation report before diff.
- Group changes by additions, edits, relationship changes, deprecations and evidence.
- User can accept/reject individual records where dependency closure permits.
- AI cannot set mastery or write to health records.
- Untrusted text remains inert and is never executed.

### 9.7 Backup & Restore
- Main state: last verified export and days since.
- One obvious export action; user chooses a destination, including SD card through Android picker where supported.
- Verify archive and show checksum/record counts.
- Restore flow first dry-runs into scratch storage, then shows replace/merge options.
- A restore point is created before merge, replace, migration or purge.
- Explain that an on-device restore point does not protect against device loss.

### 9.8 Personal Health (dormant)
- Show a calm “Not enabled” state; do not display empty weight/calorie charts or ask for data.
- Explain what the optional module could store and that it remains local.
- Activation requires a user-defined threshold/trigger and a separate confirmation.
- The module must not activate because a model or app rule decides the learner “needs” it.
- After activation, pause/export/delete controls remain prominent.
- Health status never appears in public-style achievement or leaderboard UI.

## 10. Visualisation rules

- Charts must answer a real question and label units, time range, sample size and uncertainty where relevant.
- No single total score for the learner.
- Prefer small multiples or evidence timelines over decorative radial progress rings.
- Use sparklines only when enough data exists; do not fabricate history.
- Graphs must preserve edge direction and relation type.
- Distinguish observed evidence from derived estimates and AI proposals.
- Use stable discipline colours; never use colour as the only key.

## 11. Anti-slop acceptance checklist

Reject a screen if:
- it could be mistaken for a generic AI SaaS dashboard;
- every section is the same 3-column card grid;
- gradients, blur, glow or animation are present without communicating state;
- a chart has no decision/useful interpretation;
- it shows a progress percentage unsupported by evidence;
- it uses generic “Welcome back / Unlock your potential” filler;
- controls are decorative or non-functional;
- mobile layout is a squeezed desktop layout;
- graph and list views disagree;
- focus, empty, loading, error, disabled or reduced-motion states are missing;
- external font/CDN requests break the offline/privacy contract.

## 12. Visual QA deliverables

Before calling the visual system accepted, Claude must provide:
1. implemented design-token file and component inventory;
2. mobile screenshots at 360×800 and 393×852 for Execute, Atlas, Skill Detail, Studio and Backup;
3. desktop screenshots at 1440×900 for Execute, Atlas and Studio;
4. reduced-motion and 200% text-scale checks;
5. keyboard and TalkBack walkthrough notes;
6. Lighthouse/Web Vitals measurements with device/emulation conditions;
7. a list of intentional deviations from this specification with rationale.

The first build may use seed data, but it must be visually complete and clearly label seed content as sample/draft. The design system is specific enough to constrain the visual result while leaving component implementation and technical details to Claude.
