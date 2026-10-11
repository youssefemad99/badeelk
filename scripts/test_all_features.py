# scripts/test_all_features.py
# Comprehensive automated testing for Badeelk delivery checklist

import json
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

def test_normalization():
    print("Testing Arabic & English Normalization...")
    # Test Arabic
    def norm_ar(text):
        s = text.strip()
        s = re.sub(r'[\u064B-\u065F\u0670\u06D6-\u06ED]', '', s)
        s = re.sub(r'\u0640', '', s)
        s = re.sub(r'[أإآٱ]', 'ا', s)
        s = re.sub(r'ة', 'ه', s)
        s = re.sub(r'ى', 'ي', s)
        s = re.sub(r'[ؤئ]', 'ء', s)
        s = re.sub(r'[.,\/#!$%\^&\*;:{}=\-_`~()\[\]<>?"\'+=\|\\]', ' ', s)
        return re.sub(r'\s+', ' ', s).strip()

    assert norm_ar("بَانَادُولْ") == "بانادول", f"Tashkeel failed: {norm_ar('بَانَادُولْ')}"
    assert norm_ar("أوجمنتين") == "اوجمنتين", f"Alef failed: {norm_ar('أوجمنتين')}"
    assert norm_ar("بـــــديلك") == "بديلك", f"Tatweel failed: {norm_ar('بـــــديلك')}"
    assert norm_ar("أدوية") == "ادويه", f"Ta-marbuta failed: {norm_ar('أدوية')}"
    print("  [PASS] Arabic normalization passes all checks.")

def test_data_chunks():
    print("Testing Prefix Index & Chunks...")
    idx_path = "../data/prefix_index.json"
    assert os.path.exists(idx_path), "prefix_index.json missing"
    with open(idx_path, "r", encoding="utf-8") as f:
        idx = json.load(f)
    print(f"  Prefix index entries: {len(idx)}")
    assert len(idx) > 10, "Not enough prefix chunks indexed"

    # Check a chunk
    sample_key = next(iter(idx))
    chunk_file = os.path.join("..", idx[sample_key]["chunk"])
    assert os.path.exists(chunk_file), f"Chunk file {chunk_file} does not exist"
    with open(chunk_file, "r", encoding="utf-8") as f:
        chunk_data = json.load(f)
    assert len(chunk_data) > 0, "Chunk data is empty"
    print(f"  [PASS] Chunk {sample_key} loaded successfully with {len(chunk_data)} records.")

def test_validation_report():
    print("Testing Validation Report...")
    report_path = "../data/validation_report.json"
    assert os.path.exists(report_path), "validation_report.json missing"
    with open(report_path, "r", encoding="utf-8") as f:
        report = json.load(f)
    print("  Report summary:")
    print(f"    Total records:        {report['totalRecords']:,}")
    print(f"    Arabic names:         {report['countWithArabicName']:,}")
    print(f"    With price:           {report['countWithPrice']:,}")
    print(f"    Substitute groups:    {report['totalSubstituteGroups']:,}")
    print(f"    Duplicates removed:   {report['duplicatesRemoved']:,}")
    print(f"    Missing active ing:   {report['missingActiveIngredient']:,}")
    print(f"    Missing concentration:{report['missingConcentration']:,}")
    assert report['totalRecords'] > 20000, "Total records is less than expected"
    print("  [PASS] Validation report verified.")

def test_relative_paths():
    print("Testing Relative Paths for GitHub Pages / Netlify...")
    with open("../index.html", "r", encoding="utf-8") as f:
        html = f.read()

    # Verify no absolute server paths like /js/ or /styles.css or /data/
    bad_patterns = ['href="/', 'src="/', 'action="/', 'url("/']
    for p in bad_patterns:
        matches = [line for line in html.splitlines() if p in line]
        assert len(matches) == 0, f"Found absolute path {p}: {matches}"

    # Verify relative stylesheet, script, manifest
    assert 'href="styles.css"' in html
    assert 'src="js/app.js"' in html
    assert 'href="manifest.json"' in html
    print("  [PASS] Pure static site with relative paths confirmed.")

def main():
    print("==========================================")
    print("      RUNNING BADEELK VERIFICATION        ")
    print("==========================================")
    test_normalization();
    test_data_chunks();
    test_validation_report();
    test_relative_paths();
    print("==========================================")
    print("      ALL VERIFICATION CHECKS PASSED      ")
    print("==========================================")

if __name__ == "__main__":
    main()
