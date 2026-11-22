# ATHENA Wave 11 — Safety, Ethics, Privacy and Safeguarding Framework v1.0

**Status: authored control framework; qualified review and legal sign-off are not complete.** This is a product/content safety policy, not a certification, clinical protocol or legal opinion.

## 1. Governing rule

ATHENA is a learning and planning system. It may teach concepts, support safe simulations and help learners organise evidence. It must not represent a lesson, quiz, project or AI response as a professional licence, medical diagnosis, first-aid qualification, financial recommendation or proof of competence in a regulated activity.

When risk is high, the default is to reduce the activity to explanation, simulation or observation until a qualified reviewer has approved the exact procedure and supervision conditions. When risk is critical, procedural instruction is withheld pending qualified review.

## 2. Risk bands

- **Low:** ordinary conceptual learning with no meaningful physical, financial, privacy or public-exposure risk.
- **Moderate:** foreseeable but manageable risk; requires explicit controls, age-appropriate context and privacy/consent checks.
- **High:** meaningful injury, financial, cyber, privacy or legal harm is plausible; restrict to bounded/simulated work and require relevant adult/qualified oversight.
- **Critical:** severe harm or false competence is plausible; no procedural publication or mastery claim until a qualified specialist signs off the exact material and escalation pathway.

The machine-readable matrix covers the exact 18 canonical baseline disciplines. Separate activity overlays cover first aid, laboratory work, fieldwork, human-subject research, food handling and public product deployment because these risks cross discipline boundaries. Individual activities can be higher or lower; assess the activity, materials, learner, setting and consequences rather than inheriting a discipline label blindly.

## 3. Mandatory cross-cutting controls

The twelve `SAFE-*` controls in the JSON registry are normative for content and app behaviour. In particular:

1. Stop-first design: show stop conditions before the activity.
2. Emergency precedence: emergency help comes before ATHENA content or AI.
3. No credential substitution: no text, score or project completion grants certification.
4. Minors: guardian/adult involvement for real money, public release, physical hazards, fieldwork, unknown-adult contact and identifiable research data.
5. Consent: specific, informed and revocable; for minors, combine guardian permission with child assent where appropriate.
6. Privacy: local-first/minimal collection; exact location, credentials, government IDs and sensitive health/identity details are not routine learning fields.
7. No public-by-default evidence, recordings, schedule or reflections.
8. AI cannot diagnose, certify, investigate abuse, approve safety or make consequential decisions.

## 4. Domain-specific controls

The JSON risk matrix is the source of truth for per-discipline controls. Highest-priority restrictions:

- **First aid (critical):** awareness and emergency escalation only until recognised first-aid instructor and medical reviewer approve the exact protocol. Never delay emergency services. Reading is not CPR/AED/choking-response competence.
- **Electrical/workshop (high):** no mains electricity, exposed high-voltage components, damaged lithium cells, improvised chargers or unsupervised power tools. Soldering/cutting/drilling requires competent adult supervision.
- **Health/sport (high):** no diagnosis, extreme dieting, supplement experimentation, training through pain, dehydration/weight cutting or maximal tests. Stop for concerning symptoms and involve an adult/qualified professional.
- **Cybersecurity (high):** owned lab only, written scope, synthetic credentials/data. No public-target testing, credential theft, malware, phishing deployment or unauthorised access.
- **Finance/business (high):** hypothetical learning by default. Real money, contracts, customer data and public offers require guardian review; no leverage, borrowing, investment solicitation or custody of others' funds.
- **Human-subject research (moderate/high):** public/open data preferred; no covert recording; minors and sensitive topics require approval, consent/assent and data minimisation.

## 5. Privacy data map

The data map separates learning records, schedules, health/performance, identity/contact, media, credentials, human-subject data and AI metadata. Schedule data is treated as high sensitivity because it can reveal movement patterns and relationships. Health/performance data is sensitive. Credentials are prohibited. Images/audio/video are private by default and never uploaded automatically.

Minimum product requirements:
- purpose limitation and data minimisation;
- local-first storage for core personal records;
- clear per-item sharing preview and withdrawal;
- user-accessible export and deletion;
- no advertising or profiling use of learner evidence;
- no inference of intelligence, diagnosis, personality, motivation traits or sensitive identity;
- no silent sharing with a coach, guardian, teacher or collaborator;
- retention periods and backup deletion behaviour documented before release.

## 6. Safeguarding disclosure pathway

If a learner reports abuse, exploitation, coercion, self-endangerment or imminent danger:

1. Stop the ordinary lesson and do not interrogate the learner.
2. Respond calmly; do not promise absolute secrecy.
3. Encourage immediate contact with a trusted adult/safeguarding lead. If immediate danger exists, seek emergency help.
4. Preserve only the minimum information necessary; do not ask for graphic details or collect evidence beyond the safeguarding lead's protocol.
5. Escalate to the designated responsible adult/authority under a reviewed local procedure. Do not let an AI system decide credibility or investigate.
6. Record the incident-handling action without exposing the disclosure in ordinary progress dashboards.

Bangladesh source leads in the register include Child Helpline 1098, Bangladesh Police hotline listing and Fire Service 102. Reconfirm numbers and service availability before release. The Children Act 2013 is a jurisdictional source lead, not a complete legal analysis.

## 7. Legal and jurisdictional handling

Every local legal claim must record jurisdiction, exact instrument/section, official source, access date, reviewer and recheck date. Do not rely on search snippets, news articles or third-party legal trackers for a definitive statement of current law. The status of Bangladesh privacy/data-protection law was not resolved to a release-grade primary legal source in this pass; privacy policy must remain a design standard and the legal-compliance gate remains open.

## 8. Qualified review queue

At minimum: first aid/medical; electrical/workshop; youth sport/physiology; cybersecurity; Bangladesh finance/tax/consumer; child safeguarding/privacy/legal; research ethics; food safety where applicable. Reviewer packets are provided in Wave 14. No sign-off is implied by creating the packet.

## 9. Sources and limitations

See `ATHENA_WAVES_11_14_SOURCE_REGISTER_v1.0.json`. Sources include Bangladesh Laws, Ministry of Social Welfare, Bangladesh Police, Fire Service, WHO, UNICEF, BSEC, Bangladesh Bank and BFSA. They support policy design and source discovery; they do not replace claim-by-claim review or local legal advice.
