// searchEngine.js - Pure Code Drug Alternatives Lookup Engine
import { DRUG_DATABASE, ARABIC_NAME_MAP } from "./dataset.js";
import { normalizeArabic, normalizeEnglish, reverseString } from "./arabicNormalize.js";

/**
 * Searches the drug database based on user input (Arabic or English).
 * @param {string} query - Raw user search input
 * @returns {object} { found: boolean, result: object|null, matchedBrand: string, suggestions: Array, message?: string }
 */
export function searchMedication(query) {
  if (!query || query.trim().length === 0) {
    return { found: false, result: null, matchedBrand: "", suggestions: [] };
  }

  const rawQuery = query.trim();
  const normArQuery = normalizeArabic(rawQuery);
  const normEnQuery = normalizeEnglish(rawQuery);
  const reversedEnQuery = normalizeEnglish(reverseString(rawQuery));

  // Step 1: Direct lookup in Arabic dictionary mapping (Part 3)
  let targetEnglishName = "";
  for (const [arKey, enVal] of Object.entries(ARABIC_NAME_MAP)) {
    if (normalizeArabic(arKey) === normArQuery || normArQuery.includes(normalizeArabic(arKey))) {
      targetEnglishName = enVal;
      break;
    }
  }

  // Step 2: Code search in DRUG_DATABASE
  for (const item of DRUG_DATABASE) {
    // Check if query matches English brand names (standard or reversed)
    for (const brand of item.brandsEn) {
      const normBrand = normalizeEnglish(brand);
      const reversedBrand = normalizeEnglish(reverseString(brand));

      if (
        (targetEnglishName && normBrand.includes(normalizeEnglish(targetEnglishName))) ||
        (normEnQuery.length >= 3 && normBrand.includes(normEnQuery)) ||
        (reversedEnQuery.length >= 3 && normBrand.includes(reversedEnQuery)) ||
        normBrand === normEnQuery ||
        reversedBrand === normEnQuery
      ) {
        return {
          found: true,
          result: item,
          matchedBrand: brand,
          matchedBrandAr: item.brandsAr[item.brandsEn.indexOf(brand)] || brand,
          suggestions: getSuggestions(rawQuery)
        };
      }
    }

    // Check if query matches Arabic brand names
    for (let i = 0; i < item.brandsAr.length; i++) {
      const normArBrand = normalizeArabic(item.brandsAr[i]);
      if (normArBrand.includes(normArQuery) || normArQuery.includes(normArBrand)) {
        return {
          found: true,
          result: item,
          matchedBrand: item.brandsEn[i] || item.brandsAr[i],
          matchedBrandAr: item.brandsAr[i],
          suggestions: getSuggestions(rawQuery)
        };
      }
    }

    // Check active ingredient names
    if (
      normalizeArabic(item.activeIngredientAr).includes(normArQuery) ||
      normalizeEnglish(item.activeIngredientEn).includes(normEnQuery)
    ) {
      return {
        found: true,
        result: item,
        matchedBrand: item.brandsEn[0],
        matchedBrandAr: item.brandsAr[0],
        suggestions: getSuggestions(rawQuery)
      };
    }
  }

  // Step 3: If Arabic query was not matched directly, check if we can convert it to English brand
  // Prompt rule: "لو الاسم اللي رجّعه الذكاء الاصطناعي مش موجود فعلاً في القائمة قول 'الدواء غير موجود في القاعدة' ومتألفش بديل"
  return {
    found: false,
    result: null,
    matchedBrand: "",
    message: "الدواء غير موجود في القاعدة",
    suggestions: getSuggestions(rawQuery)
  };
}

/**
 * Generates live autocomplete suggestions as the user types (Rule 3)
 */
export function getSuggestions(prefix) {
  if (!prefix || prefix.trim().length < 2) return [];

  const normArPrefix = normalizeArabic(prefix);
  const normEnPrefix = normalizeEnglish(prefix);
  const suggestionsMap = new Map();

  // Search Arabic dictionary keys
  for (const [arKey, enVal] of Object.entries(ARABIC_NAME_MAP)) {
    if (normalizeArabic(arKey).startsWith(normArPrefix)) {
      suggestionsMap.set(enVal, { textAr: arKey, textEn: enVal });
    }
  }

  // Search Database brands
  for (const item of DRUG_DATABASE) {
    for (let i = 0; i < item.brandsEn.length; i++) {
      const brandEn = item.brandsEn[i];
      const brandAr = item.brandsAr[i] || brandEn;
      const normEn = normalizeEnglish(brandEn);
      const normAr = normalizeArabic(brandAr);

      if (
        (normEnPrefix.length >= 2 && normEn.startsWith(normEnPrefix)) ||
        (normArPrefix.length >= 2 && normAr.startsWith(normArPrefix))
      ) {
        if (!suggestionsMap.has(brandEn)) {
          suggestionsMap.set(brandEn, { textAr: brandAr, textEn: brandEn, item });
        }
      }
    }
  }

  return Array.from(suggestionsMap.values()).slice(0, 8);
}
