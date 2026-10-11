// fuzzySearch.js - Damerau-Levenshtein distance, typo tolerance, and Franco-Arabic phonetic engine
// Compliant with Section 1: Edit distance 1 to 2 for words of 4+ characters, Franco-Arabic transliteration.

/**
 * Calculates Damerau-Levenshtein edit distance between two strings (handles transpositions).
 */
export function getEditDistance(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const lenA = a.length;
  const lenB = b.length;
  const matrix = Array.from({ length: lenA + 1 }, () => new Array(lenB + 1).fill(0));

  for (let i = 0; i <= lenA; i++) matrix[i][0] = i;
  for (let j = 0; j <= lenB; j++) matrix[0][j] = j;

  for (let i = 1; i <= lenA; i++) {
    for (let j = 1; j <= lenB; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,       // deletion
        matrix[i][j - 1] + 1,       // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );

      // Transposition
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        matrix[i][j] = Math.min(matrix[i][j], matrix[i - 2][j - 2] + cost);
      }
    }
  }

  return matrix[lenA][lenB];
}

/**
 * Checks if query matches target within allowed typo edit distance:
 * - Length < 4: exact/prefix only (no fuzzy distance)
 * - Length 4 to 6: edit distance <= 1
 * - Length >= 7: edit distance <= 2
 */
export function isFuzzyMatch(query, target) {
  if (!query || !target) return false;
  const q = query.trim().toLowerCase();
  const t = target.trim().toLowerCase();

  if (q.length < 4) return false;
  if (t === q || t.startsWith(q) || t.includes(q)) return true;

  const maxDist = q.length >= 7 ? 2 : 1;
  const dist = getEditDistance(q, t);
  return dist <= maxDist;
}

/**
 * Calculates similarity ratio between 0 and 1.
 */
export function getSimilarity(a, b) {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  const dist = getEditDistance(a, b);
  return Math.max(0, 1 - dist / maxLen);
}

/**
 * Franco-Arabic phonetic alias dictionary for popular Egyptian drugs
 */
export const FRANCO_MAP = {
  // Panadol & Paracetamol
  "banadol": "panadol",
  "bandol": "panadol",
  "panadool": "panadol",
  "baracetamol": "paracetamol",
  "paracetamole": "paracetamol",
  "paractamol": "paracetamol",
  "paramol": "paramol",
  "abimol": "abimol",
  "cetal": "cetal",
  "doliprane": "doliprane",

  // Augmentin & Antibiotics
  "ogmentin": "augmentin",
  "ogmantin": "augmentin",
  "ugmentin": "augmentin",
  "augmantin": "augmentin",
  "curam": "curam",
  "hibiotic": "hibiotic",
  "haibiotic": "hibiotic",
  "cipro": "ciprofloxacin",
  "ciprobay": "ciprofloxacin",
  "sepro": "ciprofloxacin",
  "zithromax": "azithromycin",
  "azitro": "azithromycin",
  "azithro": "azithromycin",

  // Concor & Heart / Blood Pressure
  "konkor": "concor",
  "conkor": "concor",
  "koncor": "concor",
  "concur": "concor",
  "bisoprolol": "bisoprolol",
  "capoten": "captopril",
  "norvasc": "amlodipine",

  // Voltaren & Painkillers
  "voltaren": "voltaren",
  "foltaren": "voltaren",
  "voltarin": "voltaren",
  "cataflam": "cataflam",
  "kataflam": "cataflam",
  "cataflame": "cataflam",
  "ketofan": "ketoprofen",
  "ketophan": "ketoprofen",
  "ketolac": "ketorolac",
  "brufen": "ibuprofen",
  "profen": "ibuprofen",
  "brofen": "ibuprofen",

  // Crestor & Statins
  "crestor": "crestor",
  "krestor": "crestor",
  "ator": "atorvastatin",
  "lipitor": "atorvastatin",

  // Diabetes & Blood thinners
  "glucophage": "glucophage",
  "glukofage": "glucophage",
  "glucofag": "glucophage",
  "jardiance": "jardiance",
  "gardiance": "jardiance",
  "forxiga": "forxiga",
  "forksiga": "forxiga",
  "xarelto": "xarelto",
  "zarelto": "xarelto",
  "ksarelto": "xarelto",
  "plavix": "clopidogrel",

  // Stomach & Acid reflux
  "nexium": "nexium",
  "neksium": "nexium",
  "controloc": "controloc",
  "kontrolok": "controloc",
  "antodine": "famotidine",
  "gaviscon": "gaviscon",
  "omeprazole": "omeprazole",

  // Allergies & Thyroid & Neuro
  "telfast": "telfast",
  "tilfast": "telfast",
  "zyrtec": "zyrtec",
  "zirtik": "zyrtec",
  "euthyrox": "euthyrox",
  "yuthyrox": "euthyrox",
  "eltroxin": "eltroxin",
  "keppra": "keppra",
  "lyrica": "lyrica",
  "lirika": "lyrica",
  "lerica": "lyrica",
  "singulair": "montelukast"
};

/**
 * Arabizi numerals transliteration (3->ع, 7->ح, 5->خ, etc.)
 */
export function convertFrancoToPhonetic(str) {
  if (!str) return "";
  let s = str.toLowerCase();
  s = s.replace(/3'/g, "غ").replace(/3/g, "ع");
  s = s.replace(/7/g, "ح");
  s = s.replace(/5/g, "خ");
  s = s.replace(/2/g, "ء");
  s = s.replace(/6/g, "ط");
  s = s.replace(/9/g, "ص");
  return s;
}
