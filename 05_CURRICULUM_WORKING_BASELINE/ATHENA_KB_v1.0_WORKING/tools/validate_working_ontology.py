#!/usr/bin/env python3
"""Validate ATHENA working ontology candidate inventories; no approval is implied."""
from pathlib import Path
import json, sys
ROOT=Path(__file__).resolve().parents[1]
def load(p): return json.loads((ROOT/p).read_text(encoding="utf-8"))
errors=[]
wm=load("06_REGISTRIES/DISCIPLINE_DOMAIN_SKILL_FAMILY_MAP_v1.1_WORKING.json")
dc=load("07_VALIDATION/DOMAIN_MAP_RECONCILIATION_CROSSWALK_v0.4.json")
fc=load("07_VALIDATION/SKILL_FAMILY_RECONCILIATION_CANDIDATES_v0.3.json")
exp=load("07_VALIDATION/CANONICAL_SKILL_FAMILY_EXPANSION_CANDIDATES_v0.2.json")
rep=load("07_VALIDATION/REPEATED_FAMILY_NAME_SEMANTIC_REVIEW_v0.1.json")
links=load("07_VALIDATION/MICRO_SKILL_LINKING_REGISTER_v0.1.json")
spec=load("07_VALIDATION/SKILL_FAMILY_SPECIFICATION_BATCH_WAVE1_CORE_v0.1.json")
quality=load("07_VALIDATION/SKILL_FAMILY_SPECIFICATION_QUALITY_GATE_v0.1.json")
# Domain and family uniqueness/references.
domains=wm["records"]; dids=[x["id"] for x in domains]
family_rows=[(f,x["id"]) for x in domains for f in x.get("skill_families",[])]
fids=[f["id"] for f,_ in family_rows]
if len(dids)!=146 or len(set(dids))!=146: errors.append("Working domain map must contain 146 unique domains.")
if len(fids)!=741 or len(set(fids))!=741: errors.append("Working family map must contain 741 unique family IDs.")
if wm["domain_count"]!=146 or wm["skill_family_count"]!=741: errors.append("Working map envelope counts do not match records.")
for f,domain_id in family_rows:
    if not f.get("id") or not f.get("name"): errors.append(f"Malformed family under {domain_id}.")
# Crosswalk rows and canonical coverage.
rows=dc["rows"]
if len(rows)!=146 or len({x["working_domain_id"] for x in rows})!=146: errors.append("Domain crosswalk must have 146 unique working-domain rows.")
if dc["canonical_domains_with_at_least_one_candidate"]!=113 or dc["canonical_domains_without_candidate"]: errors.append("Canonical domain candidate coverage is not 113/113.")
if dc["classification_counts"]!={"single_target_scope_alignment_candidate":72,"composite_multi_target_mapping":62,"single_target_exact_title_candidate":11,"unmapped_extension_candidate":1}: errors.append("Domain crosswalk classification counts mismatch.")
if not any(x["working_domain_id"]=="DOM-MATH-09" and "ATH-DOM-MATH-CHEM" in x["canonical_target_ids"] for x in rows): errors.append("Chemistry working-domain candidate does not map to canonical chemistry candidate.")
# Family crosswalks must exactly cover the working family IDs.
fcids=[x["working_skill_family_id"] for x in fc["records"]]
expids=[x["working_skill_family_id"] for x in exp["candidate_records"]]
if len(fcids)!=741 or set(fcids)!=set(fids): errors.append("Skill-family reconciliation inventory does not exactly match the 741 working family IDs.")
if len(expids)!=741 or set(expids)!=set(fids): errors.append("Canonical family expansion inventory does not exactly match the 741 working family IDs.")
if fc["duplicate_id_count"]!=0: errors.append("Duplicate working family IDs reported.")
if len(rep["records"])!=11 or rep["group_count"]!=11: errors.append("Repeated-name review must cover all 11 groups.")
if any(x["decision"]!="preserve_separate" or x["merge_recommendation"]!="do_not_merge_or_alias_at_this_stage" for x in rep["records"]): errors.append("Repeated-name group was merged/aliased without approval.")
# Family specification coverage.
spec_ids=[x["working_skill_family_id"] for x in spec["records"]]
if len(spec_ids)!=59 or len(set(spec_ids))!=59: errors.append("Wave 1 family specification batch must contain 59 unique records.")
if not set(spec_ids).issubset(set(fids)): errors.append("Family specification references unknown working family IDs.")
for item in spec["records"]:
    if item["working_domain_id"] not in dids: errors.append(f"Family spec has dangling domain: {item['working_skill_family_id']}")
    if not item.get("scope_statement") or not item.get("observable_outcome") or len(item.get("success_criteria",[]))<3 or len(item.get("assessment_evidence_examples",[]))<2 or not item.get("scope_boundary"):
        errors.append(f"Family spec is incomplete: {item['working_skill_family_id']}")
if quality["actual"]["record_count"]!=59 or quality["status"]!="structural_quality_gate_passed_content_review_pending": errors.append("Family specification quality gate does not pass its structural checks.")
# Micro-skill link coverage.
if links["canonical_micro_skill_count"]!=20 or links["records_with_discipline_links"]!=20 or links["records_with_skill_links"]!=20: errors.append("Canonical micro-skill link coverage must be 20/20.")
if any(x["relationship_type"]!="SUPPORTS" or x["gating"]!="none" for x in links["records"]): errors.append("Micro-skill links must be non-gating SUPPORTS candidates.")
print(f"Working domains: {len(dids)}; working skill families: {len(fids)}")
print(f"Canonical domain candidate coverage: {dc['canonical_domains_with_at_least_one_candidate']}/113")
print(f"Family reconciliation and expansion rows: {len(fcids)}/{len(expids)}")
print(f"Repeated-name groups semantically reviewed: {len(rep['records'])}/11")
print(f"Wave 1 family specifications: {len(spec_ids)}/741")
print(f"Canonical micro-skills linked: {links['records_with_skill_links']}/20")
print(f"Errors: {len(errors)}")
if errors:
    for e in errors: print("FAIL:",e)
    sys.exit(1)
print("PASS: working ontology candidate validation; semantic approval still pending")
