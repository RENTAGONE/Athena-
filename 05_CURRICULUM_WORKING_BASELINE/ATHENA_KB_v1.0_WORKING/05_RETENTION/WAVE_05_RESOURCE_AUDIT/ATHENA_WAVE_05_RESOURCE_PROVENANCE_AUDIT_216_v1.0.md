# ATHENA Wave 05 — 216-module Resource Provenance & Alignment Audit v1.0

**Date:** 2026-11-19  
**Status:** draft audit; source scope inspection performed; full expert review and license/legal review pending.

## Executive findings

- Prior resource register: 52 actual resource objects, despite a declared `record_count` of 30. This is a metadata inconsistency, not 22 missing resources.
- Additive Wave 05 register: **59 resource records** (52 preserved + 7 Bangladesh-context additions).
- Module crosswalk: **216/216 rows** audited. Existing crosswalk links every module, but all remain candidate links.
- Existing link labels by count: `{'direct': 154, 'related': 21, 'supplementary': 38, 'safety_guardrail': 6}`.
- Audited link dispositions by count: `{'candidate_direct_fit_requires_exact_section_check': 154, 'related_context_only': 21, 'local_authority_context_not_complete_teaching_source': 53, 'supporting_reference': 38, 'guardrail_only': 6}`.
- Module audit flags: `{'NO_DIRECT_OR_SUPPORTING_SOURCE': 23, 'ACCESS_OR_CURRENCY_CHECK': 50, 'JURISDICTION_CHECK': 5, 'SAFETY_OR_SCOPE_SOURCE_GAP': 60}`.
- Resource status remains REVIEW/DRAFT; no source or lesson is approved.

## Verification depth

- 43+ publisher/host URLs were reopened in this audit or inspected through current official-domain search results; remaining resource records retain the prior Message 18 metadata check. The machine-readable source audit records the per-resource inspection state.
- Page identity and visible scope are not the same as reading the full resource, validating every claim, checking every chapter, confirming durable URL stability or obtaining permission to reproduce content.
- Paid resources are not described as free; inaccessible/JavaScript-only pages are not treated as full verification; copyright notices are preserved as restrictions.

## High-priority source findings

- OpenStax K–12 maths describes high-school/college preparation: check exact learner level before assigning to every baseline math outcome.
- Python official tutorial states it assumes basic programming knowledge; use a true beginner sequence before or alongside it.
- OpenStax Anatomy & Physiology subject page currently labels the listed entry retired; replace or identify a current edition before use.
- USAGov and Investor.gov are US-specific government resources; useful for concepts, not Bangladesh company registration, tax, securities law or brokerage instructions.
- Berklee Voice Technique 101 is a paid course; do not imply free access.
- Purdue OWL displays a restrictive copyright notice; link to the resource, do not copy/rewrite its material into ATHENA without permission.
- Cisco Linux Essentials renders as a JavaScript shell in the inspection; exact course access and content should be rechecked.
- Draw Practice Lab says mouse or Apple Pencil; Android touch suitability is not established.
- BFSA homepage timed out in direct inspection; the five food-safety keys were visible in official search output, but detailed guidance must be reopened.
- Bangladesh Railway, DDM, BSEC, DNCRP and NBR are valuable local anchors; dynamic details, current laws and emergency contacts must be rechecked at use time.

## Discipline coverage and gaps

| Discipline | Baseline modules | Current source situation |
|---|---:|---|
| AEST | 12 | 12 have candidate direct-fit links; 0 have related-only links; exact lesson-level checks remain open |
| ART | 12 | 6 have candidate direct-fit links; 1 have related-only links; exact lesson-level checks remain open |
| ATH | 12 | 12 have candidate direct-fit links; 0 have related-only links; exact lesson-level checks remain open |
| BIZ | 12 | 6 have candidate direct-fit links; 2 have related-only links; exact lesson-level checks remain open |
| BODY | 12 | 12 have candidate direct-fit links; 1 have related-only links; exact lesson-level checks remain open |
| COMM | 12 | 4 have candidate direct-fit links; 0 have related-only links; exact lesson-level checks remain open |
| CYBER | 12 | 6 have candidate direct-fit links; 2 have related-only links; exact lesson-level checks remain open |
| ELEC | 12 | 10 have candidate direct-fit links; 1 have related-only links; exact lesson-level checks remain open |
| ENG | 12 | 8 have candidate direct-fit links; 4 have related-only links; exact lesson-level checks remain open |
| FIN | 12 | 6 have candidate direct-fit links; 0 have related-only links; exact lesson-level checks remain open |
| INDEP | 12 | 5 have candidate direct-fit links; 4 have related-only links; exact lesson-level checks remain open |
| LANG | 12 | 1 have candidate direct-fit links; 2 have related-only links; exact lesson-level checks remain open |
| LEAD | 12 | 12 have candidate direct-fit links; 0 have related-only links; exact lesson-level checks remain open |
| MATH | 12 | 12 have candidate direct-fit links; 0 have related-only links; exact lesson-level checks remain open |
| PERF | 12 | 12 have candidate direct-fit links; 0 have related-only links; exact lesson-level checks remain open |
| PSY | 12 | 11 have candidate direct-fit links; 1 have related-only links; exact lesson-level checks remain open |
| RES | 12 | 12 have candidate direct-fit links; 0 have related-only links; exact lesson-level checks remain open |
| WORK | 12 | 7 have candidate direct-fit links; 3 have related-only links; exact lesson-level checks remain open |

## Bangladesh localisation additions

- BSEC investor education: capital-market education, risk, rights and official regulator route.
- Bangladesh Bank financial-literacy portal reference: youth, MFS and small-enterprise literacy; portal itself still needs direct inspection.
- NBR VAT FAQ: official tax reference; current legal rates and obligations require current verification.
- DNCRP complaint procedure: local consumer complaint route; verify deadlines and requirements at use time.
- BFSA food-safety messages: local hygiene and safe food handling; detailed procedures still need direct page inspection.
- Fire Service official hotline/station contacts: dynamic operational information; never hard-code without scheduled verification.
- BanglaBiz: Bangladesh government portal for business licensing and approvals; use as a current discovery route, not a substitute for entity-specific legal advice.

## Required next work

1. Inspect exact chapter/lesson sections for every mapped outcome, not only the landing page.
2. Add a second independent source for consequential scientific, safety, financial and technical claims.
3. Verify Bangladesh law, tax, public services and emergency contacts with current official pages.
4. Review source licensing and commercial-reuse restrictions before incorporating text, images, datasets or exercises.
5. Replace stale/paid/inaccessible/device-incompatible resources or provide an accessible alternative.
6. Keep resource records in REVIEW until a named subject reviewer has checked the content and its relevance.

## No false completion claims

No expert review, learner pilot, legal review, full-text resource audit, claim-by-claim corroboration or importer test is claimed. Resource links do not award mastery.
