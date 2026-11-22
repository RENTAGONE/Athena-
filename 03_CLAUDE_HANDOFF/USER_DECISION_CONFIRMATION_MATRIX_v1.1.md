# ATHENA User Decision Confirmation Matrix v1.1
Version 1.1.0 · 2026-11-17
Purpose: Claude must confirm user-owned decisions without reopening already-settled product direction.

| ID | Topic | Current state | Recommended/default position | Blocks Phase 1? |
|---|---|---|---|---|
| UD-01 | Product purpose and 18 disciplines | Accepted | Preserve exactly; no school-management workflows | No |
| UD-02 | Local-first privacy | Accepted | Local data, no mandatory account/cloud/telemetry/automatic upload in v1 | No |
| UD-03 | SD-card backup | Accepted requirement | Export archive via Android picker/share; download-and-move fallback; real-device proof pending | No, but backup phase requires test |
| UD-04 | Future multi-device | Accepted architecture direction | Stable IDs/device metadata/export-import now; live sync later | No |
| UD-05 | Personal health tracking | Accepted architecture direction | Dormant and disabled; explicit user activation only with user-defined threshold/trigger; separate local data | No |
| UD-06 | Visual identity | Accepted | Cognitive Atlas specification is binding | No |
| UD-07 | Phone-first operation | Accepted | Core app and maintenance must not require a PC | No |
| UD-08 | Repository access/ownership | Needs user confirmation | Use a user-approved existing repo; inspect before writes; no destructive overwrite | Yes, for repo implementation |
| UD-09 | Hosting and public reachability | Needs user confirmation | No public deployment until approved; static preview only after user chooses host | No for local development; yes for release |
| UD-10 | Paid services/accounts | Needs user confirmation | Use free/local tools where possible; no purchases or new external accounts without approval | No |
| UD-11 | Dec 10 learning launch scope | Needs confirmation | Prefer a small reliable capture/protect slice if full MVP is not acceptance-ready; never weaken data integrity | No for development; yes for launch scope |
| UD-12 | Mastery profile | Provisional | Keep `conservative-v0` as reviewable data; objective-specific rules; learner alone confirms mastery | No for scaffolding; yes before mastery is presented as final |
| UD-13 | HIGH-risk micro-skill gate | Safety review pending | Keep all four HIGH-risk records DRAFT and unschedulable until human review; instructor-required items require qualified instruction | No for app shell; yes for those records |
| UD-14 | Micro-skill mastery semantics | Open | Recommended: no separate mastery label; use demonstrated/retained/maintenance status only | No |
| UD-15 | Bangla UI | Open | Recommended: English UI initially; full Unicode Bangla content and search from v1; Bangla interface can follow | No |
| UD-16 | Second device | User-specific timing unknown | Design portable multi-device architecture; no live sync in v1 | No |
| UD-17 | Target device | Known, browser version pending | Infinix HOT 60i X6728, Android 15, XOS 15.1.2, 8 GB physical RAM; record actual browser/version before final device QA | No |
| UD-18 | SD-card real-device test | Pending | Test Save/Share picker and manual fallback on target phone; report actual result | No for Phase 1; yes for backup release claim |
| UD-19 | `SUPERSEDES` relationship direction and cycle rule | Proposed; owner confirmation pending | Source = approved successor; target = superseded record; lifecycle lineage only; acyclic; never deletes historical records | No for Phase 1; yes before using this relation in committed content |

## Instructions to Claude
- Do not ask the user to reconfirm UD-01 through UD-07.
- Do not ask the user to decide technical library choices that fall within Claude's authority.
- Ask only for UD-08/09/10 when those actions are imminent, and UD-11/12/13/14/15 when their respective features reach a release gate.
- For non-blocking decisions, state the recommended default and proceed with reversible work.
- Do not silently mark an open decision as accepted.
