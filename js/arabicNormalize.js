// arabicNormalize.js - Text normalization utility for Arabic & English drug searches

/**
 * Normalizes Arabic text by unifying alef, marboota, alef maqsoora and removing tashkeel.
 */
export function normalizeArabic(text) {
  if (!text) return "";
  let normalized = text.toString().trim().toLowerCase();

  // Remove Arabic diacritics (tashkeel)
  normalized = normalized.replace(/[\u064B-\u065F\u0670]/g, "");

  // Unify Alef forms
  normalized = normalized.replace(/[أإآآ]/g, "ا");

  // Unify Taa Marboota & Haa
  normalized = normalized.replace(/ة/g, "ه");

  // Unify Ya & Alef Maqsoora
  normalized = normalized.replace(/ى/g, "ي");

  // Remove redundant punctuation and spaces
  normalized = normalized.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, " ");
  normalized = normalized.replace(/\s+/g, " ").trim();

  return normalized;
}

/**
 * Normalizes English text for case-insensitive matching and strips special characters.
 */
export function normalizeEnglish(text) {
  if (!text) return "";
  return text.toString().trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

/**
 * Helper to reverse a string (for handling PDF export reversed character artifacts)
 */
export function reverseString(str) {
  if (!str) return "";
  return str.split("").reverse().join("");
}
