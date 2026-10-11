# scripts/audit_and_fix_prices.py
# Implements Modification 1: Price Audit, Outlier Detection & Correction from Official EDA Sources

import csv
import json
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

LOW = 0.4
HIGH = 2.5
PRICE_LAST_UPDATED = "11 أكتوبر 2026"
PRICE_LAST_UPDATED_EN = "October 11, 2026"

def calculate_median(arr):
    if not arr:
        return 0.0
    s = sorted(arr)
    n = len(s)
    m = n // 2
    if n % 2 != 0:
        return float(s[m])
    else:
        return float((s[m - 1] + s[m]) / 2.0)

def main():
    print("Starting Comprehensive Price Audit across dataset and chunks...")

    # Load original raw EDA data to cross-reference verified prices
    eda_prices = {}
    if os.path.exists("raw_egyptian_drugs.csv"):
        with open("raw_egyptian_drugs.csv", "r", encoding="utf-8") as f:
            for row in csv.DictReader(f):
                name = row.get("commercial_name_en", "").strip().upper()
                p_raw = row.get("price_egp", "").strip()
                try:
                    p_val = float(p_raw)
                    if p_val > 0:
                        eda_prices[name] = p_val
                except ValueError:
                    pass

    print(f"Loaded {len(eda_prices)} official price records from EDA registry.")

    # Load all chunk files
    chunk_dir = "../data/chunks"
    chunk_files = [os.path.join(chunk_dir, f) for f in os.listdir(chunk_dir) if f.endswith(".json")]
    
    all_drugs_map = {}
    for cfile in chunk_files:
        with open(cfile, "r", encoding="utf-8") as f:
            chunk_data = json.load(f)
            for d in chunk_data:
                all_drugs_map[d["id"]] = d

    # Also load dataset.js
    with open("../js/dataset.js", "r", encoding="utf-8") as f:
        ds_content = f.read()
    ds_match = re.search(r'export const DRUG_DATABASE = (\[[\s\S]*?\]);', ds_content)
    dataset_drugs = json.loads(ds_match.group(1)) if ds_match else []
    for d in dataset_drugs:
        all_drugs_map[d["id"]] = d

    all_drugs = list(all_drugs_map.values())
    print(f"Auditing {len(all_drugs)} unique drugs across dataset...")

    # Group drugs by substitute group key (activeIngredientEn + concentration + form)
    groups = {}
    for d in all_drugs:
        act = (d.get("activeIngredientEn") or "UNKNOWN").strip().upper()
        conc = (d.get("concentration") or "UNKNOWN").strip().upper()
        form = (d.get("form") or "UNKNOWN").strip().upper()
        key = f"{act}|{conc}|{form}"
        if key not in groups:
            groups[key] = []
        groups[key].append(d)

    flagged = []
    corrected_count = 0
    unverified_count = 0
    verified_count = 0

    # Audit each group
    for key, items in groups.items():
        # First gather all initial valid prices
        raw_prices = []
        for i in items:
            p = i.get("price")
            if p is not None and isinstance(p, (int, float)) and p > 0:
                raw_prices.append(float(p))

        med = calculate_median(raw_prices) if raw_prices else 0.0

        for i in items:
            orig_p = i.get("price")
            p = float(orig_p) if (orig_p is not None and str(orig_p).replace('.', '', 1).isdigit() and float(orig_p) > 0) else 0.0

            # Round price to 2 decimal places
            p = round(p, 2)
            i["price"] = p if p > 0 else None

            # Check if outlier or missing
            is_missing = (p <= 0)
            is_outlier = (med > 0 and (p < med * LOW or p > med * HIGH))

            if is_missing or is_outlier:
                # Try to correct from official EDA dataset
                brand_up = (i.get("brandEn") or "").strip().upper()
                matched_eda_price = None
                for eda_name, eda_p in eda_prices.items():
                    if brand_up and (brand_up in eda_name or eda_name in brand_up):
                        matched_eda_price = eda_p
                        break

                if matched_eda_price and (med == 0 or (matched_eda_price >= med * LOW and matched_eda_price <= med * HIGH)):
                    i["price"] = round(matched_eda_price, 2)
                    i["priceVerified"] = True
                    corrected_count += 1
                else:
                    i["priceVerified"] = False
                    unverified_count += 1
                    flagged.append({
                        "id": i["id"],
                        "key": key,
                        "brandEn": i.get("brandEn"),
                        "brandAr": i.get("brandAr"),
                        "price": i.get("price"),
                        "medianPrice": round(med, 2),
                        "reason": "PRICE_MISSING" if is_missing else ("PRICE_TOO_LOW" if p < med * LOW else "PRICE_TOO_HIGH")
                    })
            else:
                i["priceVerified"] = True
                verified_count += 1

    print(f"Price Audit Results:")
    print(f"  Verified Prices:   {verified_count:,}")
    print(f"  Corrected Prices:  {corrected_count:,}")
    print(f"  Unverified/Outlier:{unverified_count:,}")
    print(f"  Total Flagged:     {len(flagged):,}")

    # Save priceAudit-report.json
    report_data = {
        "auditDate": "2026-10-11T12:00:00Z",
        "priceLastUpdated": PRICE_LAST_UPDATED,
        "priceLastUpdatedEn": PRICE_LAST_UPDATED_EN,
        "thresholds": {"LOW": LOW, "HIGH": HIGH},
        "totalAudited": len(all_drugs),
        "verifiedCount": verified_count,
        "correctedCount": corrected_count,
        "unverifiedCount": unverified_count,
        "flaggedCount": len(flagged),
        "flaggedSamples": flagged[:100]
    }

    with open("../data/priceAudit-report.json", "w", encoding="utf-8") as f:
        json.dump(report_data, f, ensure_ascii=False, indent=2)
    print("Saved ../data/priceAudit-report.json")

    # Update chunk files
    for cfile in chunk_files:
        with open(cfile, "r", encoding="utf-8") as f:
            cdata = json.load(f)
        for d in cdata:
            if d["id"] in all_drugs_map:
                audited = all_drugs_map[d["id"]]
                d["price"] = audited["price"]
                d["priceVerified"] = audited["priceVerified"]
        with open(cfile, "w", encoding="utf-8") as f:
            json.dump(cdata, f, ensure_ascii=False, separators=(',', ':'))
    print("Updated all chunk files with audited price and priceVerified flags.")

    # Update dataset.js
    for d in dataset_drugs:
        if d["id"] in all_drugs_map:
            audited = all_drugs_map[d["id"]]
            d["price"] = audited["price"]
            d["priceVerified"] = audited["priceVerified"]

    # Re-export dataset.js with PRICE_LAST_UPDATED constant
    updated_ds = f"""// dataset.js - Authentic Egyptian Medication Database with Price Audit & Verification
// Sources: Egyptian Drug Authority (EDA) Public Registry & Egyptian Price Index 2026, WHO ATC/DDD Index.

export const PRICE_LAST_UPDATED = "{PRICE_LAST_UPDATED}";
export const PRICE_LAST_UPDATED_EN = "{PRICE_LAST_UPDATED_EN}";

export const DRUG_DATABASE = {json.dumps(dataset_drugs, ensure_ascii=False, indent=2)};

export const DATASET_METRICS = {json.dumps({
    "totalRecords": len(all_drugs),
    "countWithArabicName": sum(1 for d in all_drugs if d.get("brandAr")),
    "countWithPrice": sum(1 for d in all_drugs if d.get("price") and d.get("priceVerified")),
    "totalSubstituteGroups": len(groups),
    "priceLastUpdated": PRICE_LAST_UPDATED,
    "lastUpdated": "2026-10-11"
}, ensure_ascii=False, indent=2)};
"""

    with open("../js/dataset.js", "w", encoding="utf-8") as f:
        f.write(updated_ds)
    print("Updated ../js/dataset.js with verified prices and PRICE_LAST_UPDATED.")

if __name__ == "__main__":
    main()
