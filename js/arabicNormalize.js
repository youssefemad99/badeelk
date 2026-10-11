// arabicNormalize.js - Comprehensive Arabic & English text normalization utility
// Compliant with Section 1: Arabic diacritics removal, unification of alef/ya/ta-marbuta, English normalization, and digit conversions.

/**
 * Normalizes Arabic text by:
 * - Stripping tashkeel (diacritics: fathah, dammah, kasrah, sukun, shaddah, tanween, dagger alef)
 * - Removing tatweel (kashida)
 * - Unifying Alef forms (أ, إ, آ, ٱ -> ا)
 * - Unifying Ta Marbuta and Haa (ة -> ه)
 * - Unifying Alef Maqsura and Ya (ى -> ي)
 * - Unifying Hamza variants (ؤ, ئ -> ء)
 * - Removing punctuation and collapsing spaces
 */
export function normalizeArabic(text) {
  if (!text) return "";
  let str = text.toString().trim();

  // Remove Arabic diacritics / tashkeel (ranges \u064B-\u065F, \u0670, \u06D6-\u06ED)
  str = str.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "");

  // Remove tatweel / kashida (\u0640)
  str = str.replace(/\u0640/g, "");

  // Unify Alef forms (أ, إ, آ, ٱ -> ا)
  str = str.replace(/[أإآٱ]/g, "ا");

  // Unify Ta Marbuta and Haa (ة -> ه)
  str = str.replace(/ة/g, "ه");

  // Unify Alef Maqsura and Ya (ى -> ي)
  str = str.replace(/ى/g, "ي");

  // Unify Hamza on Waw / Ya (ؤ, ئ -> ء)
  str = str.replace(/[ؤئ]/g, "ء");

  // Remove punctuation, dashes, slashes, brackets
  str = str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\[\]<>?"'+=|\\]/g, " ");

  // Collapse multiple whitespaces
  str = str.replace(/\s+/g, " ").trim();

  return str;
}

/**
 * Normalizes English text:
 * - Case-insensitive (lowercase)
 * - Strips punctuation, hyphens, slashes, and symbols
 * - Collapses consecutive spaces
 */
export function normalizeEnglish(text) {
  if (!text) return "";
  let str = text.toString().trim().toLowerCase();
  str = str.replace(/[^a-z0-9]/g, " ");
  str = str.replace(/\s+/g, " ").trim();
  return str;
}

/**
 * Compact normalization (removes ALL spaces and symbols) for fuzzy prefix comparison.
 */
export function compactString(text) {
  if (!text) return "";
  return text.toString().toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]/g, "");
}

/**
 * Converts Western digits (0-9) to Arabic-Indic digits (٠-٩).
 */
export function toArabicDigits(str) {
  if (str === null || str === undefined) return "";
  const eastern = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return str.toString().replace(/[0-9]/g, d => eastern[parseInt(d, 10)]);
}

/**
 * Converts Arabic-Indic digits (٠-٩) to Western digits (0-9).
 */
export function toWesternDigits(str) {
  if (str === null || str === undefined) return "";
  return str.toString().replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
}

/**
 * Formats numbers according to user preference ("western" or "arabic").
 */
export function formatDigitDisplay(numberOrStr, digitPreference = "western") {
  if (numberOrStr === null || numberOrStr === undefined) return "";
  const western = toWesternDigits(numberOrStr);
  return digitPreference === "arabic" ? toArabicDigits(western) : western;
}
