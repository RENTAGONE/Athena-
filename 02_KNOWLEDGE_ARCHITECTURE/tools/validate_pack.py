#!/usr/bin/env python3
"""Validate ATHENA Knowledge Architecture Pack v0.9 fixtures.
Requires Python 3.10+ and jsonschema (Draft 2020-12).
Run from any directory: python tools/validate_pack.py
"""
from pathlib import Path
import json
import sys
from collections import Counter
import jsonschema

ROOT = Path(__file__).resolve().parents[1]

def load(rel):
    return json.loads((ROOT / rel).read_text(encoding="utf-8"))

def validate_records(label, schema_rel, records):
    schema = load(schema_rel)
    errors = []
    for index, record in enumerate(records):
        for error in jsonschema.Draft202012Validator(schema).iter_errors(record):
            errors.append(f"{label}[{index}] {record.get('id', record.get('client_ref', '?'))}: {error.message}")
    return errors

errors = []
json_files = list(ROOT.rglob("*.json"))
for path in json_files:
    try:
        json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        errors.append(f"JSON parse: {path.relative_to(ROOT)}: {exc}")

schema_files = [p for p in json_files if p.name.endswith(".schema.json") or ".schema." in p.name]
for path in schema_files:
    try:
        jsonschema.Draft202012Validator.check_schema(json.loads(path.read_text(encoding="utf-8")))
    except Exception as exc:
        errors.append(f"Schema meta-validation: {path.relative_to(ROOT)}: {exc}")

domain_map = load("ATHENA_DOMAIN_MAP_v0.3.json")
skills = load("REGISTRIES/ATHENA_SKILL_SEED_v0.3.json")["skills"]
subskills = load("REGISTRIES/ATHENA_SUBSKILL_SEED_v0.2.json")["subskills"]
relationships = load("REGISTRIES/ATHENA_RELATIONSHIP_SEED_v0.3.json")["edges"]
objectives = load("REGISTRIES/LEARNING_OBJECTIVE_SEED_v0.2.json")["objectives"]
units = load("REGISTRIES/LEARNING_UNIT_SEED_v0.2.json")["units"]
assessments = load("REGISTRIES/ASSESSMENT_SEED_v0.2.json")["assessments"]
foundation = load("FOUNDATION_NODE_SEED_v0.2.json")["nodes"]
transfers = load("ATHENA_CROSS_DOMAIN_TRANSFER_v0.3.json")
micro = load("ATHENA_MICRO_SKILL_REGISTRY_v0.3.json")["records"]
coverage = load("ATHENA_CONTENT_COVERAGE_v0.1.json")

record_sets = [
    ("domain map envelope", "SCHEMAS/DOMAIN_MAP_REGISTRY.schema.json", [domain_map]),
    ("domains", "SCHEMAS/DOMAIN_RECORD.schema.json", domain_map["domains"]),
    ("skill families", "SCHEMAS/SKILL_FAMILY_RECORD.schema.json", domain_map["skill_families"]),
    ("skills", "SCHEMAS/SKILL_RECORD.schema.json", skills),
    ("subskills", "SCHEMAS/SUBSKILL_RECORD.schema.json", subskills),
    ("contexts", "SCHEMAS/CONTEXT_RECORD.schema.json", transfers["context_registry"]),
    ("transfer links", "SCHEMAS/TRANSFER_LINK.schema.json", transfers["transfers"]),
    ("structural relationships", "SCHEMAS/KNOWLEDGE_RELATIONSHIP.schema.json", relationships),
    ("objectives", "LEARNING_OBJECTIVE.schema.json", objectives),
    ("learning units", "SCHEMAS/LEARNING_UNIT.schema.json", units),
    ("assessments", "SCHEMAS/ASSESSMENT.schema.json", assessments),
    ("micro-skills", "SCHEMAS/MICRO_SKILL.schema.v0.2.json", micro),
    ("foundation seed", "SCHEMAS/FOUNDATION_SEED_NODE.schema.json", foundation),
    ("content coverage envelope", "SCHEMAS/CONTENT_COVERAGE.schema.json", [coverage]),
    ("content coverage records", "SCHEMAS/CONTENT_COVERAGE_RECORD.schema.json", coverage["records"]),
]
for label, schema_rel, records in record_sets:
    errors.extend(validate_records(label, schema_rel, records))

disciplines = {f"ATH-DISC-{c}" for c in [
    "ENG","BIZ","ELEC","FIN","BODY","PSY","AEST","WORK","ART","ATH","PERF",
    "MATH","CYBER","LANG","RES","INDEP","LEAD","COMM"
]}
domains = {x["id"] for x in domain_map["domains"]}
families = {x["id"] for x in domain_map["skill_families"]}
skill_ids = {x["id"] for x in skills}
subskill_ids = {x["id"] for x in subskills}
contexts = {x["id"] for x in transfers["context_registry"]}
foundation_content = {x["id"] for x in foundation if x["object_type"] != "domain"}
micro_ids = {x["id"] for x in micro}
all_codes = list(disciplines | domains | families | skill_ids | subskill_ids | contexts | foundation_content | micro_ids)
duplicates = [code for code, count in Counter(all_codes).items() if count > 1]
if duplicates:
    errors.append(f"Duplicate canonical codes: {duplicates}")

domain_records = {x["id"]: x for x in domain_map["domains"]}
family_records = {x["id"]: x for x in domain_map["skill_families"]}
skill_records = {x["id"]: x for x in skills}
for domain in domain_map["domains"]:
    if domain["parent_id"] not in disciplines or domain["owner_discipline_id"] != domain["parent_id"]:
        errors.append(f"Domain owner/parent mismatch: {domain['id']}")
for family in domain_map["skill_families"]:
    parent = domain_records.get(family["parent_id"])
    if not parent or family["owner_discipline_id"] != parent["owner_discipline_id"]:
        errors.append(f"Skill-family owner/parent mismatch: {family['id']}")
for skill in skills:
    if skill["primary_domain_id"] not in domains or skill["primary_domain_id"] not in skill["domain_ids"]:
        errors.append(f"Skill primary-domain mapping invalid: {skill['id']}")
    if skill["owner_discipline_id"] not in disciplines:
        errors.append(f"Skill owner invalid: {skill['id']}")
    if skill["skill_family_id"]:
        family = family_records.get(skill["skill_family_id"])
        if not family or family["parent_id"] not in skill["domain_ids"]:
            errors.append(f"Skill-family mapping invalid: {skill['id']}")
    for sub_id in skill["subskill_ids"]:
        if sub_id not in subskill_ids:
            errors.append(f"Skill references missing subskill: {skill['id']} -> {sub_id}")
for subskill in subskills:
    parent = skill_records.get(subskill["parent_skill_id"])
    if not parent or subskill["domain_ids"] != parent["domain_ids"] or subskill["owner_discipline_id"] != parent["owner_discipline_id"]:
        errors.append(f"Subskill mapping does not inherit parent: {subskill['id']}")

valid_codes = set(all_codes)
client_refs = [edge["client_ref"] for edge in relationships]
if len(client_refs) != len(set(client_refs)):
    errors.append("Duplicate relationship client_ref values.")
for edge in relationships:
    if edge["source_id"] not in valid_codes or edge["target_id"] not in valid_codes:
        errors.append(f"Structural relationship has dangling endpoint: {edge['client_ref']}")
    if edge["client_ref"].startswith("ATH-EDGE-") or not edge["client_ref"].startswith("rel-"):
        errors.append(f"Invalid package-local client_ref namespace: {edge['client_ref']}")
    if edge["gating"] == "hard" and (edge["relation_type"] != "PREREQUISITE_FOR" or edge.get("strength") != "required" or not edge.get("hard_gate_justification")):
        errors.append(f"Illegal hard gate: {edge['client_ref']}")
for item in micro:
    if not item.get("discipline_links"):
        errors.append(f"Micro-skill lacks discipline link: {item['id']}")
    if not item.get("skill_links"):
        errors.append(f"Micro-skill lacks skill link: {item['id']}")
    for code in item.get("discipline_links", []):
        if code not in disciplines:
            errors.append(f"Micro-skill has dangling discipline link: {item['id']} -> {code}")
    for code in item.get("skill_links", []):
        if code not in skill_ids and code not in subskill_ids:
            errors.append(f"Micro-skill has dangling skill link: {item['id']} -> {code}")

for transfer in transfers["transfers"]:
    if transfer["source_id"] not in valid_codes or transfer["target_id"] not in valid_codes:
        errors.append(f"Transfer has dangling endpoint: {transfer['id']}")
    if transfer["gating"] != "none":
        errors.append(f"Transfer link must be non-gating: {transfer['id']}")
for node in foundation:
    if node.get("parent_id") and node["parent_id"] not in valid_codes:
        errors.append(f"Foundation seed has dangling parent: {node['id']} -> {node['parent_id']}")
for unit in units:
    if any(code not in {o["id"] for o in objectives} for code in unit["objective_ids"]):
        errors.append(f"Learning unit has dangling objective: {unit['id']}")
    if any(code not in skill_ids for code in unit["skill_ids"]):
        errors.append(f"Learning unit has dangling skill: {unit['id']}")
    if any(code not in {a["id"] for a in assessments} for code in unit["assessment_ids"]):
        errors.append(f"Learning unit has dangling assessment: {unit['id']}")
for assessment in assessments:
    if any(code not in skill_ids for code in assessment["target_ids"]):
        errors.append(f"Assessment has dangling target: {assessment['id']}")
    if any(code not in {o["id"] for o in objectives} for code in assessment["objective_ids"]):
        errors.append(f"Assessment has dangling objective: {assessment['id']}")

expected_domains = {
    "ATH-DOM-ENG-COMPUTE","ATH-DOM-MATH-PHYS","ATH-DOM-MATH-CHEM","ATH-DOM-WORK-LEARN"
}
if not expected_domains.issubset(domains):
    errors.append("One or more of the four restored domain IDs is missing.")
if len(domain_map["domains"]) != 113 or len(domain_map["skill_families"]) != 40:
    errors.append("Domain/family counts do not match the published 113/40 counts.")
if len(skills) != 42 or len(subskills) != 36 or len(micro) != 20:
    errors.append("Skill/subskill/micro-skill seed counts do not match the published 42/36/20 counts.")
if any(item["status"] != "DRAFT" for item in micro):
    errors.append("A micro-skill seed is not marked DRAFT.")
coverage_codes = [record["domain_code"] for record in coverage["records"]]
if len(coverage_codes) != 113 or set(coverage_codes) != domains or len(set(coverage_codes)) != 113:
    errors.append("Content coverage snapshot does not contain each of the 113 domains exactly once.")
if coverage["counts"]["taxonomy_only"] + coverage["counts"]["seeded_draft"] != 113:
    errors.append("Content coverage summary counts do not add up to 113.")
if any(item.get("risk_level") == "HIGH" and item["safety_review"]["status"] != "needs_review" for item in micro):
    errors.append("A HIGH-risk micro-skill lacks a pending safety review.")

# Structured evidence schema fixtures, including expected rejection of structural edge IDs.
evidence_schema = load("SCHEMAS/EVIDENCE_RECORD.schema.json")
evidence_cases = load("SCHEMAS/EVIDENCE_OUTCOME_SCHEMA_FIXTURES_v0.2.json")["cases"]
for case in evidence_cases:
    errs = list(jsonschema.Draft202012Validator(evidence_schema).iter_errors(case["record"]))
    if case["expected"] == "valid" and errs:
        errors.append(f"Evidence fixture unexpectedly invalid: {case['case_id']}: {errs[0].message}")
    if case["expected"] == "invalid" and not errs:
        errors.append(f"Evidence fixture unexpectedly valid: {case['case_id']}")
# Semantic one-to-one target coverage for target_outcomes.
for case in evidence_cases:
    rec = case["record"]
    if "target_outcomes" in rec:
        ids = [x["target_id"] for x in rec["target_outcomes"]]
        if len(ids) != len(set(ids)) or set(ids) != set(rec["target_ids"]):
            errors.append(f"Evidence target_outcomes coverage mismatch: {case['case_id']}")
    if case["expected"] == "valid" and rec.get("outcome_schema_version") == "0.2" and (('outcome' in rec) == ('target_outcomes' in rec)):
        errors.append(f"Evidence must use exactly one outcome representation: {case['case_id']}")

record_count = sum(len(records) for _, _, records in record_sets)
print(f"JSON files parsed: {len(json_files)}")
print(f"JSON Schema documents meta-validated: {len(schema_files)} (active: {sum(1 for p in schema_files if '/HISTORY/' not in str(p))}; historical: {sum(1 for p in schema_files if '/HISTORY/' in str(p))})")
print(f"Record instances validated: {record_count}")
print(f"Cross-reference and governance errors: {len(errors)}")
if errors:
    for error in errors:
        print("FAIL:", error)
    sys.exit(1)
print("PASS: all v0.9 fixture validations")
