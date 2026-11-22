# ATHENA Wave 12 — Accessibility, Language and Regional Adaptation v1.0

**Status: design and content assets authored; human bilingual review and device/accessibility testing remain open.**

## 1. Language model

ATHENA supports Bangla (`bn`) and English (`en`) without creating duplicate curriculum identities. Canonical IDs, code, APIs, formulas, units and source names remain stable. A learner can switch interface language and use a bilingual technical glossary. Technical meaning takes priority over literal word-for-word translation.

The glossary contains **72 entries**. Each entry includes a preferred Bangla rendering, a definition and a note where one English term has multiple context-dependent meanings. It is a controlled draft vocabulary, not a claim that every term has one universally accepted Bangla translation. A Bangla language educator and subject specialist must review it.

## 2. Plain-language rules

- Define technical terms at first use; keep the precise term visible.
- One main action per instruction step.
- Use short sentences where possible without deleting necessary conditions.
- Separate facts, assumptions, examples, uncertainty and recommendations.
- Preserve mathematical/scientific precision; do not simplify away the construct.
- Use locally meaningful examples only when they are accurate and non-stereotyping.
- Offer both technical English and Bangla explanation where this improves access.

## 3. Accessibility target

Use WCAG 2.2 AA as a design and test target for web-facing content; it is not yet a conformance claim. The checklist contains **40 testable checks** spanning text scaling, reflow, contrast, keyboard, focus, accessible names, captions, Bangla shaping, mixed-script direction, screen readers, touch targets, reduced motion, data saver, offline use and privacy controls.

Test at minimum on representative Android devices using TalkBack, system font scaling, reduced motion, keyboard where available, narrow viewport and poor network. Include people who use assistive technology; automated checks alone are insufficient.

## 4. Construct-preserving alternatives

Offer oral, written, diagrammatic, practical or assistive response modes only when the response modality is not itself the target skill. If the objective is pronunciation, handwriting, tool handling, public speaking or another modality-specific capability, the alternative must not erase that construct. Assessment criteria should score the target capability, not accent, expensive device access, typing speed or handwriting unless directly relevant.

## 5. Low-bandwidth and offline behaviour

The fallback registry defines text-first reading, local attempt capture, local schedule operation, downloaded search, media transcripts, deferred sync, local export and local notifications. Core flows should work without streaming video or a live model. Offline writes require durable local persistence, idempotent replay and visible conflict handling.

Android's offline-first guidance treats the local data source as the source read by higher layers and requires explicit sync/conflict handling. ATHENA should adopt the architectural principle, not blindly adopt last-write-wins for user-authored records or evidence.

## 6. Bangladesh adaptation

The regional audit specifies BDT, SI units, Asia/Dhaka timestamps, Bangla/English, official emergency source leads, locally reviewed finance and law, configurable education context, intermittent mobile data and non-Dhaka-specific examples. Exact location is not required for ordinary learning or schedule operation.

Emergency source leads presently identify 999, 102 and 1098 from official Bangladesh government pages. Reverify before release and show the date/jurisdiction. Legal claims remain blocked until checked against the current official gazette/law text by a Bangladesh legal reviewer.

## 7. Sources and limitations

- W3C WCAG 2.2 Recommendation: https://www.w3.org/TR/wcag/
- W3C Mobile Accessibility: https://www.w3.org/WAI/standards-guidelines/mobile/
- Android Developers offline-first architecture: https://developer.android.com/topic/architecture/data-layer/offline-first
- Bangladesh-specific sources are in the Wave 11–14 source register.

No learner pilot, disabled-user test, Bangla device test or WCAG conformance audit has been performed in this authoring pass.
