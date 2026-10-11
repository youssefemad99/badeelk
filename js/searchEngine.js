// searchEngine.js - High-performance bilingual search & autocomplete engine
// Compliant with Section 1 (Arabic + English + Franco-Arabic + Fuzzy + Active Ingredient)
// and Section 2 (Autocomplete from 1st char, 8 suggestions, ranking, highlighting, recent searches).

import { normalizeArabic, normalizeEnglish, compactString } from "./arabicNormalize.js";
import { isFuzzyMatch, FRANCO_MAP, getEditDistance } from "./fuzzySearch.js";
import { getActiveDataset, loadChunkForPrefix, getChunkKeyForQuery, getSubstitutesForGroup } from "./dataLoader.js";

// Web Worker instance
let searchWorker = null;
let workerMsgId = 0;
const workerCallbacks = new Map();

try {
  searchWorker = new Worker("js/searchWorker.js");
  searchWorker.onmessage = function (e) {
    const { id, results } = e.data;
    const callback = workerCallbacks.get(id);
    if (callback) {
      callback(results);
      workerCallbacks.delete(id);
    }
  };
} catch (e) {
  console.info("Web Worker fallback to local thread execution:", e);
  searchWorker = null;
}

// Popularity weighting dictionary for top Egyptian medicines
const POPULAR_WEIGHTS = {
  "PANADOL": 100, "PARACETAMOL": 95, "AUGMENTIN": 95, "CONCOR": 90,
  "VOLTAREN": 90, "CATAFLAM": 90, "CRESTOR": 88, "GLUCOPHAGE": 88,
  "NEXIUM": 88, "TELFAST": 85, "ZYRTEC": 85, "BRUFEN": 85,
  "CONTROLOC": 85, "EUTHYROX": 85, "XARELTO": 85, "CIPRO": 85,
  "KEPPRA": 80, "LYRICA": 80, "FORXIGA": 80, "JARDIANCE": 80,
  "CETAL": 80, "ABIMOL": 80, "PARAMOL": 80, "DOLIPRANE": 80,
  "HIBIOTIC": 80, "CURAM": 80, "KETOFAN": 80, "ANTODINE": 80
};

function getPopularityScore(record) {
  const brandUpper = (record.brandEn || "").toUpperCase();
  for (const [key, score] of Object.entries(POPULAR_WEIGHTS)) {
    if (brandUpper.includes(key)) return score;
  }
  return 0;
}

/**
 * Searches medications and returns target record + strictly matched substitutes.
 */
export async function searchMedication(rawQuery, filterOptions = {}) {
  if (!rawQuery || rawQuery.trim().length === 0) {
    return { found: false, result: null, substitutes: [], matchedBrand: "", suggestions: [] };
  }

  const query = rawQuery.trim();
  const normAr = normalizeArabic(query);
  const normEn = normalizeEnglish(query);
  const compactQ = compactString(query);

  // Trigger on-demand chunk loading for current prefix
  const chunkKey = getChunkKeyForQuery(query);
  if (chunkKey) {
    await loadChunkForPrefix(chunkKey);
  }

  // Franco-Arabic phonetic alias lookup
  let francoMapped = FRANCO_MAP[normEn] || "";

  const dataset = getActiveDataset();
  let matchedRecord = null;

  // 1. Exact match on brand names (English or Arabic)
  for (const record of dataset) {
    const bAr = normalizeArabic(record.brandAr || "");
    const bEn = normalizeEnglish(record.brandEn || "");

    if (bAr === normAr || bEn === normEn || (francoMapped && bEn.includes(francoMapped))) {
      matchedRecord = record;
      break;
    }
  }

  // 2. Starts-with / prefix match on brand names
  if (!matchedRecord) {
    for (const record of dataset) {
      const bAr = normalizeArabic(record.brandAr || "");
      const bEn = normalizeEnglish(record.brandEn || "");

      if ((normAr && bAr.startsWith(normAr)) || (normEn && bEn.startsWith(normEn))) {
        matchedRecord = record;
        break;
      }
    }
  }

  // 3. Search by active ingredient (in Arabic or English)
  if (!matchedRecord) {
    for (const record of dataset) {
      const ingAr = normalizeArabic(record.activeIngredientAr || "");
      const ingEn = normalizeEnglish(record.activeIngredientEn || "");

      if ((normAr && ingAr.includes(normAr)) || (normEn && ingEn.includes(normEn))) {
        matchedRecord = record;
        break;
      }
    }
  }

  // 4. Fuzzy match fallback (edit distance 1-2 for words of 4+ characters)
  if (!matchedRecord && (normAr.length >= 4 || normEn.length >= 4)) {
    let bestDist = 99;
    for (const record of dataset) {
      const bAr = normalizeArabic(record.brandAr || "");
      const bEn = normalizeEnglish(record.brandEn || "");

      if (normEn.length >= 4 && isFuzzyMatch(normEn, bEn)) {
        const d = getEditDistance(normEn, bEn);
        if (d < bestDist) {
          bestDist = d;
          matchedRecord = record;
        }
      } else if (normAr.length >= 4 && isFuzzyMatch(normAr, bAr)) {
        const d = getEditDistance(normAr, bAr);
        if (d < bestDist) {
          bestDist = d;
          matchedRecord = record;
        }
      }
    }
  }

  if (!matchedRecord) {
    saveRecentSearch(query);
    return {
      found: false,
      result: null,
      substitutes: [],
      matchedBrand: "",
      query,
      suggestions: await getSuggestions(rawQuery)
    };
  }

  // Save successful search to recent searches
  saveRecentSearch(matchedRecord.brandEn || query);

  // Substitute matching: STRICTLY by identical active ingredient + concentration + form (groupId)
  let substitutes = [];
  if (matchedRecord.groupId) {
    substitutes = getSubstitutesForGroup(matchedRecord.groupId);
  }

  // Fallback if substitutes array is empty
  if (substitutes.length === 0) {
    substitutes = [matchedRecord];
  }

  // Remove exact duplicates by id
  const seenIds = new Set();
  substitutes = substitutes.filter(s => {
    if (seenIds.has(s.id)) return false;
    seenIds.add(s.id);
    return true;
  });

  // Apply filters
  if (filterOptions.companyFilter) {
    substitutes = substitutes.filter(s => s.company === filterOptions.companyFilter);
  }

  if (filterOptions.formFilter) {
    substitutes = substitutes.filter(s => s.form === filterOptions.formFilter);
  }

  // Apply sorting
  if (filterOptions.sortBy === "cheapest") {
    substitutes.sort((a, b) => {
      const aValid = a.priceVerified !== false && a.price !== null && a.price !== undefined && a.price > 0;
      const bValid = b.priceVerified !== false && b.price !== null && b.price !== undefined && b.price > 0;
      if (aValid && !bValid) return -1;
      if (!aValid && bValid) return 1;
      return (a.price || 999999) - (b.price || 999999);
    });
  } else if (filterOptions.sortBy === "company") {
    substitutes.sort((a, b) => (a.company || "").localeCompare(b.company || ""));
  } else if (filterOptions.sortBy === "name") {
    substitutes.sort((a, b) => (a.brandEn || "").localeCompare(b.brandEn || ""));
  }

  return {
    found: true,
    result: matchedRecord,
    substitutes,
    matchedBrandEn: matchedRecord.brandEn,
    matchedBrandAr: matchedRecord.brandAr,
    suggestions: await getSuggestions(rawQuery)
  };
}

/**
 * Autocomplete suggestions generator:
 * - Starts from the first character ("p" -> Panadol, "ب" -> بانادول)
 * - Returns up to 8 ranked suggestions
 * - Ranking:
 *   (1) Names starting with typed text
 *   (2) Names containing typed text
 *   (3) Active-ingredient matches
 *   (4) Fuzzy matches
 *   *Popular drugs rank higher within each group*
 */
export async function getSuggestions(query) {
  if (!query || query.trim().length === 0) return [];

  const raw = query.trim();
  const chunkKey = getChunkKeyForQuery(raw);
  if (chunkKey) {
    loadChunkForPrefix(chunkKey); // fire async load without blocking
  }

  const dataset = getActiveDataset();
  const normAr = normalizeArabic(raw);
  const normEn = normalizeEnglish(raw);
  let francoMapped = FRANCO_MAP[normEn] || "";

  const group1Starts = [];
  const group2Contains = [];
  const group3Active = [];
  const group4Fuzzy = [];

  const seenKeys = new Set();

  for (const record of dataset) {
    const bAr = normalizeArabic(record.brandAr || "");
    const bEn = normalizeEnglish(record.brandEn || "");
    const ingAr = normalizeArabic(record.activeIngredientAr || "");
    const ingEn = normalizeEnglish(record.activeIngredientEn || "");

    const key = `${record.brandEn}|${record.concentration}`;
    if (seenKeys.has(key)) continue;

    const item = {
      id: record.id,
      brandEn: record.brandEn,
      brandAr: record.brandAr,
      activeIngredientEn: record.activeIngredientEn,
      activeIngredientAr: record.activeIngredientAr,
      concentration: record.concentration,
      form: record.form,
      company: record.company,
      price: record.price,
      groupId: record.groupId,
      popScore: getPopularityScore(record)
    };

    if (
      (normAr && bAr.startsWith(normAr)) ||
      (normEn && bEn.startsWith(normEn)) ||
      (francoMapped && bEn.startsWith(francoMapped))
    ) {
      group1Starts.push(item);
      seenKeys.add(key);
    } else if (
      (normAr && bAr.includes(normAr)) ||
      (normEn && bEn.includes(normEn)) ||
      (francoMapped && bEn.includes(francoMapped))
    ) {
      group2Contains.push(item);
      seenKeys.add(key);
    } else if (
      (normAr && ingAr.includes(normAr)) ||
      (normEn && ingEn.includes(normEn))
    ) {
      group3Active.push(item);
      seenKeys.add(key);
    } else if (
      (normEn.length >= 4 && isFuzzyMatch(normEn, bEn)) ||
      (normAr.length >= 4 && isFuzzyMatch(normAr, bAr))
    ) {
      group4Fuzzy.push(item);
      seenKeys.add(key);
    }
  }

  // Sort within each group by popularity descending
  const sortByPopularity = (a, b) => b.popScore - a.popScore;
  group1Starts.sort(sortByPopularity);
  group2Contains.sort(sortByPopularity);
  group3Active.sort(sortByPopularity);
  group4Fuzzy.sort(sortByPopularity);

  const combined = [...group1Starts, ...group2Contains, ...group3Active, ...group4Fuzzy];
  return combined.slice(0, 8);
}

/**
 * Highlights the matched substring within a text string.
 */
export function highlightMatch(text, query) {
  if (!text || !query) return text || "";
  const qClean = query.trim();
  if (qClean.length === 0) return text;

  try {
    const escaped = qClean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return text.replace(regex, '<mark class="highlight-match">$1</mark>');
  } catch (e) {
    return text;
  }
}

/**
 * Local recent searches manager
 */
const RECENT_KEY = "badeelak_recent_searches";

export function getRecentSearches() {
  try {
    const data = localStorage.getItem(RECENT_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveRecentSearch(query) {
  if (!query || query.trim().length === 0) return;
  const term = query.trim();
  let list = getRecentSearches();
  list = list.filter(item => item.toLowerCase() !== term.toLowerCase());
  list.unshift(term);
  if (list.length > 8) list = list.slice(0, 8);
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch (e) {}
}

export function clearRecentSearches() {
  try {
    localStorage.removeItem(RECENT_KEY);
  } catch (e) {}
}
