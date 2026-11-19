#!/usr/bin/env python3
"""Build fixtures/pack-v1.0 from the content owner's two archives.

Inputs (committed at the repository root):
  ATHENA_KB_v1.0_WORKING_ONTOLOGY_CONTRACT_v3.28.zip
  ATHENA_Master_Vault_v6.4_WORKING.zip
Canonical Pack v0.9 fixtures are read from fixtures/pack-v0.9 and carried forward.

The pack is additive: every canonical ATH-* code in v0.9 keeps its record, and the
working ontology adds the KB's macro tier (domains and skill families), its 156
substantive micro-skill candidates and its 44 cross-discipline transfer hypotheses.
No existing canonical record is rewritten or renumbered; where a KB working domain
matches a canonical domain by title, the KB families attach to the canonical record.

Run:  python3 tools/build_pack_v1_0.py
Then: npm run validate:pack && npm test
"""
from __future__ import annotations

import json
import re
import unicodedata
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
KB_ZIP = ROOT / "ATHENA_KB_v1.0_WORKING_ONTOLOGY_CONTRACT_v3.28.zip"
VAULT_ZIP = ROOT / "ATHENA_Master_Vault_v6.4_WORKING.zip"
V09 = ROOT / "fixtures" / "pack-v0.9"
OUT = ROOT / "fixtures" / "pack-v1.0"

KB_REGISTRIES = "ATHENA_KB_v1.0_WORKING/06_REGISTRIES/"
KB_DISCIPLINES = "ATHENA_KB_v1.0_WORKING/02_DISCIPLINES/"

STOP = {"and", "the", "of", "a", "an", "in", "for", "to", "with", "on", "by"}
CATEGORY = {
    "Cognitive & learning": ("COGNITIVE", "COG", "ATH-DISC-PSY"),
    "Dexterity & coordination": ("DEXTERITY_COORDINATION", "DEX", "ATH-DISC-ATH"),
    "Practical & everyday": ("PRACTICAL_EVERYDAY", "PRACT", "ATH-DISC-INDEP"),
    "Communication & social": ("SOCIAL_COMMUNICATION", "SOC", "ATH-DISC-COMM"),
    "Language & communication": ("SOCIAL_COMMUNICATION", "SOC", "ATH-DISC-LANG"),
    "Digital & technical": ("PRACTICAL_EVERYDAY", "PRACT", "ATH-DISC-ENG"),
    "Observation & creative": ("COGNITIVE", "COG", "ATH-DISC-AEST"),
    "Safety & emergency literacy": ("SAFETY_EMERGENCY", "SAFE", "ATH-DISC-INDEP"),
    "Navigation & situational awareness": ("PRACTICAL_EVERYDAY", "PRACT", "ATH-DISC-INDEP"),
    "Workshop & tool handling": ("PRACTICAL_EVERYDAY", "PRACT", "ATH-DISC-INDEP"),
    "Movement & sport technique": ("DEXTERITY_COORDINATION", "DEX", "ATH-DISC-ATH"),
    "Photography & visual capture": ("PRACTICAL_EVERYDAY", "PRACT", "ATH-DISC-AEST"),
    "Vocal & auditory performance": ("SOCIAL_COMMUNICATION", "SOC", "ATH-DISC-PERF"),
    "Household & food skills": ("PRACTICAL_EVERYDAY", "PRACT", "ATH-DISC-INDEP"),
    "Personal operations & planning": ("COGNITIVE", "COG", "ATH-DISC-WORK"),
}
# Canonical micro-skill codes carried onto their KB counterpart, so the v0.9 codes survive.
LEGACY_MICRO_MAP = {
    "ATH-MICRO-COG-ACTIVE-RECALL": "MS-01-007",
    "ATH-MICRO-COG-OBSERVATION-LOG": "MS-15-002",
    "ATH-MICRO-COG-MEMORY-CHUNKING": "MS-01-010",
    "ATH-MICRO-DEX-PEN-CONTROL": "MS-02-003",
    "ATH-MICRO-DEX-COIN-ROLL": "MS-02-002",
    "ATH-MICRO-DEX-ORIGAMI-BASE": "MS-02-006",
    "ATH-MICRO-DEX-TYPING-ACCURACY": "MS-02-008",
    "ATH-MICRO-PRACT-COOKING-MISE": "MS-13-011",
    "ATH-MICRO-PRACT-KNOT-SQUARE": "MS-02-004",
    "ATH-MICRO-PRACT-SEW-BUTTON": "MS-03-003",
    "ATH-MICRO-PRACT-NAVIGATION-LANDMARKS": "MS-08-005",
    "ATH-MICRO-SOC-ACTIVE-LISTENING": "MS-04-003",
    "ATH-MICRO-SOC-ONE-MIN-EXPLANATION": "MS-04-006",
    "ATH-MICRO-SOC-QUESTION-CLARIFICATION": "MS-04-002",
    "ATH-MICRO-SOC-DISAGREEMENT-STEELMAN": "MS-04-005",
    "ATH-MICRO-SAFE-EMERGENCY-CALL": "MS-07-003",
    "ATH-MICRO-SAFE-HAZARD-SCAN": "MS-07-002",
    "ATH-MICRO-SAFE-CPR-LEARNING-READINESS": "MS-07-009",
}
HIGH_RISK_NAMES = ("CPR", "AED", "Choking", "Fire extinguisher", "electrical conditions", "wound-care")
REVIEW_NOTE = "Draft candidate from the content owner's working registry; substantive protocol authored, expert and learner review outstanding."
# The exchange schema has a narrower transfer-type vocabulary than the KB's message-14 map.
TRANSFER_TYPE = {
    "quantitative": "mathematical",
    "technical": "tooling",
    "operational": "procedural",
    "linguistic": "communication",
    "applied": "procedural",
    "design": "conceptual",
    "creative": "conceptual",
    "safety": "procedural",
    "risk": "strategic",
    "scientific": "methodological",
}


def load(path: Path) -> dict:
    return json.loads(path.read_text())


def kb_json(zf: zipfile.ZipFile, name: str) -> dict:
    return json.loads(zf.read(name).decode("utf-8"))


def slug(text: str, limit: int = 34) -> str:
    t = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    t = re.sub(r"[^A-Za-z0-9]+", "-", t).strip("-").upper()
    return t[:limit].strip("-")


def tokens(text: str) -> set[str]:
    return {w for w in re.findall(r"[a-z]+", text.lower()) if w not in STOP and len(w) > 2}


def similarity(a: str, b: str) -> float:
    ta, tb = tokens(a), tokens(b)
    return len(ta & tb) / max(1, len(ta | tb))


def mnemonic(name: str, used: set[str]) -> str:
    words = [w for w in re.findall(r"[A-Za-z0-9]+", name) if w.lower() not in STOP]
    base = "-".join(w[0] for w in words[:3]).upper() if len(words) >= 3 else slug(name, 12)
    if len(base) < 3:
        base = slug(name, 12)
    candidate, n = base, 2
    while candidate in used:
        candidate = f"{base}{n}"
        n += 1
    used.add(candidate)
    return candidate


def family_code(name: str, used: set[str]) -> str:
    words = slug(name, 80).split("-")
    parts: list[str] = []
    for word in words:
        if parts and len("-".join(parts + [word])) > 26:
            break
        parts.append(word)
    base = "-".join(parts) or slug(name, 12)
    if len(base) < 3:
        base = mnemonic(name, set())
    candidate, n = base, 2
    while candidate in used:
        candidate = f"{base}-{n}"
        n += 1
    used.add(candidate)
    return candidate


def assign_domains(canonical: list[dict], working: list[dict]) -> tuple[dict[str, str], list[dict]]:
    """One-to-one title match per discipline. Returns canonical id -> working id, and unmatched working records."""
    pairs: list[tuple[float, str, str]] = []
    for old in canonical:
        for new in working:
            if "ATH-DISC-" + new["discipline_id"].split("-")[1] != old["owner_discipline_id"]:
                continue
            pairs.append((similarity(old["title"], new["name"]), old["id"], new["id"]))
    pairs.sort(key=lambda p: (-p[0], p[1], p[2]))
    old_to_new: dict[str, str] = {}
    new_taken: set[str] = set()
    for score, old_id, new_id in pairs:
        if old_id in old_to_new or new_id in new_taken:
            continue
        old_to_new[old_id] = new_id
        new_taken.add(new_id)
    unmatched = [w for w in working if w["id"] not in new_taken]
    return old_to_new, unmatched


def build_micro(zf: zipfile.ZipFile, candidate_doc: dict, legacy: dict) -> tuple[list[dict], dict[str, str]]:
    ids = {r["id"] for r in candidate_doc["records"]}
    code_of: dict[str, str] = {}
    legacy_code_for = {ms: code for code, ms in LEGACY_MICRO_MAP.items()}
    used = {r["id"] for r in legacy["records"]}
    for rec in candidate_doc["records"]:
        if rec["id"] in legacy_code_for:
            code_of[rec["id"]] = legacy_code_for[rec["id"]]
            continue
        prefix = CATEGORY[rec["category"]][1]
        base = f"ATH-MICRO-{prefix}-{slug(rec['name'])}"
        code, n = base, 2
        while code in used:
            code = f"{base}-{n}"
            n += 1
        used.add(code)
        code_of[rec["id"]] = code

    protocols = parse_protocols(zf)
    legacy_by_code = {r["id"]: r for r in legacy["records"]}
    out: list[dict] = []
    for rec in candidate_doc["records"]:
        code = code_of[rec["id"]]
        prior = legacy_by_code.get(code)
        section = protocols.get(rec["id"])
        if not section:
            raise SystemExit(f"no substantive protocol for {rec['id']}")
        out.append(micro_record(rec, code, section, prior))
    # Canonical records with no KB counterpart stay exactly as reviewed in v0.9.
    mapped = set(LEGACY_MICRO_MAP)
    for rec in legacy["records"]:
        if rec["id"] not in mapped:
            out.append(rec)
    return out, code_of


def parse_protocols(zf: zipfile.ZipFile) -> dict[str, dict[str, str]]:
    text = ""
    for name in zf.namelist():
        if KB_DISCIPLINES in name and "MICRO_SKILL_SUBSTANTIVE_PROTOCOLS_BATCH_" in name and name.endswith(".md"):
            text += "\n" + zf.read(name).decode("utf-8")
    sections: dict[str, dict[str, str]] = {}
    chunks = re.split(r"\n## (MS-\d\d-\d\d+) — ", text)
    for ms_id, body in zip(chunks[1::2], chunks[2::2]):
        fields: dict[str, str] = {}
        for m in re.finditer(r"\*\*(.+?):\*\*\s*(.+?)(?=\n\n|\n\*\*|\Z)", body, re.S):
            fields[m.group(1).strip()] = re.sub(r"\s+", " ", m.group(2)).strip()
        sections[ms_id] = fields
    # Message 18's protocol uses a different section layout.
    for name in zf.namelist():
        if KB_DISCIPLINES in name and "PROTOCOLS_BATCH_09" in name:
            body = zf.read(name).decode("utf-8")
            parts = re.split(r"\n## ", body)
            fields: dict[str, str] = {}
            for part in parts[1:]:
                title, _, rest = part.partition("\n")
                fields[title.strip()] = re.sub(r"\s+", " ", rest).strip()
            sections["MS-13-011"] = fields
    return sections


def section(fields: dict[str, str], *names: str) -> str:
    for n in names:
        for key, value in fields.items():
            if key.lower() == n.lower():
                return value
    return ""


def steps_from(text: str) -> list[str]:
    if not text:
        return []
    parts = re.split(r"(?:^|\s)(?:Step\s+)?\d+\.\s*", text)
    steps = [p.strip(" ;") for p in parts if p.strip(" ;")]
    return [s for s in steps if len(s) > 3]


def session_minutes(dose: str) -> int:
    m = re.search(r"(\d+)\s*(?:–|-|to)\s*(\d+)\s*minute", dose)
    if m:
        return max(1, min(30, int(m.group(2))))
    m = re.search(r"(\d+)\s*minute", dose)
    if m:
        return max(1, min(30, int(m.group(1))))
    return 15


def micro_record(rec: dict, code: str, fields: dict[str, str], prior: dict | None) -> dict:
    category, _, discipline = CATEGORY[rec["category"]]
    target = section(fields, "Target performance", "Target")
    pass_text = section(fields, "Assessment and pass criterion")
    if not pass_text:
        pass_text = section(fields, "Success criteria")
    record_text = section(fields, "Evidence to record", "Practice and evidence")
    dose = section(fields, "Practice dose")
    setup = section(fields, "Prerequisites and setup", "Entry conditions and boundaries")
    safety = section(fields, "Safety and scope", "Entry conditions and boundaries", "Review requirements")
    retention = section(fields, "Delayed retention check", "Retention and transfer")
    high = any(name.lower() in rec["name"].lower() for name in HIGH_RISK_NAMES)
    risk = "HIGH" if high else "MODERATE" if category in ("SAFETY_EMERGENCY",) or rec["category"] in (
        "Workshop & tool handling", "Household & food skills", "Movement & sport technique") else "LOW"
    final_risk = prior["risk_level"] if prior else risk
    high = final_risk == "HIGH"
    supervision = "QUALIFIED_INSTRUCTOR_REQUIRED" if high else (
        "ADULT_GUIDANCE_RECOMMENDED" if risk == "MODERATE" or category == "SAFETY_EMERGENCY" else "NONE_ROUTINE_SAFE_CONTEXT")
    steps = steps_from(section(fields, "Acquisition sequence", "Practice protocol"))
    if not steps:
        steps = [s.strip() for s in re.split(r"(?<=\.)\s+(?=[A-Z])", target) if s.strip()]
    maintenance_trigger = "Delayed cold retrieval after a meaningful delay"
    maintenance_protocol = retention or "Repeat a cold, unaided performance after the agreed delay and record the result."
    record = {
        "id": code,
        "name": rec["name"],
        "category": prior["category"] if prior else category,
        "definition": rec["target_performance"],
        "discipline_links": [discipline],
        "skill_links": [],
        "prerequisites": [],
        "target_performance": {
            "statement": target,
            "metric": pass_text or target,
            "conditions": setup or "Conditions recorded with each practice attempt.",
            "success_threshold": None,
        },
        "success_criteria": [{
            "criterion_id": "primary-performance-target",
            "statement": target,
            "measurement_method": "manual_observation_or_recorded_trials",
            "threshold_type": "qualitative",
            "threshold_text": pass_text or target,
        }],
        "practice_protocol": {
            "steps": steps,
            "session_minutes": session_minutes(dose),
            "frequency_per_week": dose or "Use short distributed sessions; record the dose actually completed.",
            "equipment": [],
            "environment": setup.split(". ")[0] if setup else "",
        },
        "assessment": {
            "method": pass_text or target,
            "record": record_text or "Record the artefact, the conditions and the assessor.",
        },
        "progression": [],
        "maintenance": {"trigger": maintenance_trigger, "protocol": maintenance_protocol},
        "maintenance_policy": {
            "mode": "manual",
            "interval_days": None,
            "trigger": maintenance_trigger,
            "protocol": maintenance_protocol,
            "scheduler_note": "A review interval is earned by performance evidence, not assigned from category alone.",
        },
        "risk_level": final_risk,
        "safety_notes": [n for n in [safety] if n],
        "supervision": prior["supervision"] if prior and prior.get("supervision") else supervision,
        "status": "DRAFT",
        "evidence_refs": [],
        "authoring_notes": " ".join(filter(None, [
            REVIEW_NOTE,
            f"Retention profile {rec['retention_profile']} from the candidate registry.",
            f"Protocol source: {rec['protocol_document']} ({rec['protocol_quality_status']}).",
            f"Placed under {discipline} as an app index; the registry treats this micro-skill as cross-disciplinary.",
            f"Supersedes canonical record {prior['id']} ({prior['name']})." if prior else "",
        ])),
        "content_version": 1,
        "aliases": [prior["name"]] if prior else [],
        "source_refs": [rec["protocol_document"], "ATHENA_MICRO_SKILL_CANDIDATE_REGISTRY_v1.0_WORKING"],
        "safety_review": {
            "status": "needs_review" if high else "not_flagged_for_high_risk_review",
            "review_required_before_approval": high,
            "review_note": REVIEW_NOTE,
        },
    }
    return record


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    canonical = load(V09 / "ATHENA_DOMAIN_MAP_v0.3.json")
    with zipfile.ZipFile(KB_ZIP) as kbz, zipfile.ZipFile(VAULT_ZIP) as vz:
        working = kb_json(vz, "ATHENA_Master_Vault/05_CURRICULUM_WORKING_BASELINE/" + KB_REGISTRIES + "DISCIPLINE_DOMAIN_SKILL_FAMILY_MAP_v1.1_WORKING.json")
        candidates = kb_json(vz, "ATHENA_Master_Vault/05_CURRICULUM_WORKING_BASELINE/" + KB_REGISTRIES + "MICRO_SKILL_CANDIDATE_REGISTRY_v1.0_WORKING.json")
        integration = kb_json(vz, "ATHENA_Master_Vault/05_CURRICULUM_WORKING_BASELINE/" + KB_REGISTRIES + "ATHENA_CROSS_DISCIPLINE_INTEGRATION_MAP_MESSAGE_14_v0.1.json")
        legacy_micro = load(V09 / "ATHENA_MICRO_SKILL_REGISTRY_v0.3.json")
        micro, micro_codes = build_micro(kbz, candidates, legacy_micro)

    old_to_new, new_only = assign_domains(canonical["domains"], working["records"])
    working_by_id = {r["id"]: r for r in working["records"]}
    concept_of = {r["id"]: r for r in working["records"]}

    domains = list(canonical["domains"])
    used_codes: dict[str, set[str]] = {}
    for d in domains:
        used_codes.setdefault(d["owner_discipline_id"], set()).add(d["code"])
    new_domain_id: dict[str, str] = {}
    for rec in new_only:
        disc = "ATH-DISC-" + rec["discipline_id"].split("-")[1]
        code = mnemonic(rec["name"], used_codes.setdefault(disc, set()))
        domain_id = f"ATH-DOM-{disc.split('-')[-1]}-{code}"
        new_domain_id[rec["id"]] = domain_id
        families = ", ".join(sf["name"] for sf in rec["skill_families"])
        domains.append({
            "id": domain_id,
            "object_type": "domain",
            "parent_id": disc,
            "code": code,
            "title": rec["name"],
            "description": f"Draft working-map domain from ATHENA KB v1.1, not approved curriculum. Working skill families: {families}.",
            "status": "draft",
            "content_version": 1,
            "review_state": "needs_review",
            "aliases": [],
            "source_basis": "ATHENA_DISCIPLINE_DOMAIN_SKILL_FAMILY_MAP v1.1-working (draft_for_content_authoring)",
            "existing_in_v0_1_seed": False,
            "discipline_ids": [disc],
            "owner_discipline_id": disc,
        })

    domain_of_working = dict(new_domain_id)
    for old_id, new_id in old_to_new.items():
        domain_of_working[new_id] = old_id

    families = list(canonical["skill_families"])
    legacy_family_names: dict[str, set[str]] = {}
    for f in families:
        legacy_family_names.setdefault(f["parent_id"], set()).add(f["title"].strip().lower())
    used_family_codes: dict[str, set[str]] = {}
    for f in families:
        used_family_codes.setdefault(f["parent_id"], set()).add(f["code"])
    skipped = 0
    for rec in working["records"]:
        domain_id = domain_of_working[rec["id"]]
        domain = next(d for d in domains if d["id"] == domain_id)
        disc = domain["owner_discipline_id"]
        seen = legacy_family_names.setdefault(domain_id, set())
        codes = used_family_codes.setdefault(domain_id, set())
        for sf in rec["skill_families"]:
            if sf["name"].strip().lower() in seen:
                skipped += 1
                continue
            seen.add(sf["name"].strip().lower())
            code = family_code(sf["name"], codes)
            families.append({
                "id": f"ATH-FAM-{disc.split('-')[-1]}-{domain['code']}-{code}",
                "object_type": "skill_family",
                "parent_id": domain_id,
                "code": code,
                "title": sf["name"],
                "status": "draft",
                "content_version": 1,
                "review_state": "needs_review",
                "discipline_ids": [disc],
                "owner_discipline_id": disc,
            })

    ms_to_code = {ms: c for ms, c in micro_codes.items()}
    for rec in micro:
        rec["prerequisites"] = []
    for candidate in candidates["records"]:
        code = micro_codes[candidate["id"]]
        record = next(r for r in micro if r["id"] == code)
        record["prerequisites"] = [ms_to_code[p] for p in candidate.get("prerequisites", []) if p in ms_to_code]

    domain_map = {
        "schema_version": "1.0-working",
        "registry_type": "ATHENA_DOMAIN_MAP",
        "status": "draft_for_content_authoring",
        "discipline_registry_version": "1.0",
        "counts": {"disciplines": 18, "domains": len(domains), "skill_families": len(families)},
        "domains": domains,
        "skill_families": families,
        "validation_notes": [
            "Canonical v0.3 domains and skill families are carried forward unchanged.",
            "Working domains and skill families come from ATHENA_DISCIPLINE_DOMAIN_SKILL_FAMILY_MAP v1.1-working; all are draft and unapproved.",
            f"{len(old_to_new)} working domains were matched to canonical domains by title within their discipline; the rest are additive.",
            f"{skipped} working families were skipped because the canonical map already carries a family of the same name under the same domain.",
        ],
    }

    micro_doc = {
        "registry": "ATHENA Micro-skill Registry",
        "version": "1.0-working",
        "status": "working_registry_draft",
        "count": len(micro),
        "retention_profiles": legacy_micro.get("retention_profiles", []),
        "records": micro,
        "protocol_source": "MICRO_SKILL_SUBSTANTIVE_PROTOCOLS_BATCH_01..09 (content owner, v0.1 drafts)",
        "note": "Canonical v0.3 records are preserved. KB candidate records supersede them where a canonical code maps onto the same capability.",
    }

    transfers = list(load(V09 / "ATHENA_CROSS_DOMAIN_TRANSFER_v0.3.json")["transfers"])
    contexts = load(V09 / "ATHENA_CROSS_DOMAIN_TRANSFER_v0.3.json")["context_registry"]
    used_transfer_ids = {t["id"] for t in transfers}
    for t in integration["transfers"]:
        tid = t["id"].replace("ATH-XFER-M14-", "ATH-XFER-M14-")
        if tid in used_transfer_ids:
            continue
        used_transfer_ids.add(tid)
        source = "ATH-DISC-" + t["source_discipline"]
        target = "ATH-DISC-" + t["target_discipline"]
        mapped_type = TRANSFER_TYPE.get(t["transfer_type"], t["transfer_type"])
        type_note = f" KB transfer type '{t['transfer_type']}' is recorded here as '{mapped_type}'." if mapped_type != t["transfer_type"] else ""
        transfers.append({
            "id": tid,
            "source_id": source,
            "target_id": target,
            "relation_type": "RELATED_TO",
            "status": "draft",
            "transfer_type": mapped_type,
            "transfer_distance": "intermediate",
            "mechanism": t["mechanism"],
            "rationale": f"{t['mechanism']} Boundary: {t['non_equivalence_boundary']}{type_note} Distance and strength are the app's conservative defaults; the KB does not classify either.",
            "evidence_refs": [],
            "review_state": "needs_review",
            "owner_discipline_id": source,
            "gating": "none",
            "strength": None,
            "content_version": 1,
            "transfer_evidence_state": "hypothesised",
        })

    transfer_doc = {
        "registry": "ATHENA_CROSS_DOMAIN_TRANSFER",
        "version": "1.0-working",
        "status": "draft",
        "context_registry": contexts,
        "transfers": transfers,
        "validation_notes": [
            "Canonical v0.3 transfer links are carried forward unchanged.",
            "Message 14 discipline-to-discipline hypotheses are imported as RELATED_TO because the relationship registry does not allow TRANSFER_TO between disciplines.",
            "Discipline-level hypotheses remain draft and are not evidence of transfer.",
        ],
    }

    relations = load(V09 / "RELATIONSHIP_TYPE_REGISTRY_v0.2.json")
    for rel in relations["types"]:
        if rel["code"] == "PREREQUISITE_FOR":
            # The KB registers micro-skill prerequisites (MS-09-007/008/009, MS-13-011).
            for side in ("allowed_source_types", "allowed_target_types"):
                if "micro_skill" not in rel[side]:
                    rel[side] = rel[side] + ["micro_skill"]

    write(OUT / "DISCIPLINE_REGISTRY.json", load(V09 / "DISCIPLINE_REGISTRY.json"))
    write(OUT / "ATHENA_DOMAIN_MAP_v1.0.json", domain_map)
    write(OUT / "ATHENA_MICRO_SKILL_REGISTRY_v1.0.json", micro_doc)
    write(OUT / "ATHENA_CROSS_DOMAIN_TRANSFER_v1.0.json", transfer_doc)
    for name, target in [
        ("ATHENA_SKILL_SEED_v0.3.json", "ATHENA_SKILL_SEED_v1.0.json"),
        ("ATHENA_SUBSKILL_SEED_v0.2.json", "ATHENA_SUBSKILL_SEED_v1.0.json"),
        ("FOUNDATION_NODE_SEED_v0.2.json", "FOUNDATION_NODE_SEED_v1.0.json"),
        ("LEARNING_OBJECTIVE_SEED_v0.2.json", "LEARNING_OBJECTIVE_SEED_v1.0.json"),
        ("LEARNING_UNIT_SEED_v0.2.json", "LEARNING_UNIT_SEED_v1.0.json"),
        ("ASSESSMENT_SEED_v0.2.json", "ASSESSMENT_SEED_v1.0.json"),
        ("ATHENA_RELATIONSHIP_SEED_v0.3.json", "ATHENA_RELATIONSHIP_SEED_v1.0.json"),
        ("RELATIONSHIP_TYPE_REGISTRY_v0.2.json", "RELATIONSHIP_TYPE_REGISTRY_v0.2.json"),
        ("ID_NAMESPACE_REGISTRY_v0.2.json", "ID_NAMESPACE_REGISTRY_v0.2.json"),
    ]:
        write(OUT / target, relations if name.startswith("RELATIONSHIP_TYPE_REGISTRY") else load(V09 / name))

    print(f"domains {len(domains)} (canonical {len(canonical['domains'])}, new {len(new_only)})")
    print(f"skill families {len(families)} (canonical {len(canonical['skill_families'])}, added {len(families) - len(canonical['skill_families'])}, skipped {skipped})")
    print(f"micro-skills {len(micro)} (KB candidates {len(candidates['records'])}, canonical kept {len(legacy_micro['records']) - len(LEGACY_MICRO_MAP)})")
    print(f"transfers {len(transfers)} (new {len(transfers) - len(load(V09 / 'ATHENA_CROSS_DOMAIN_TRANSFER_v0.3.json')['transfers'])})")


def write(path: Path, data: dict) -> None:
    path.write_text(json.dumps(data, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"wrote {path.relative_to(ROOT)} ({path.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
