// searchWorker.js - Web Worker for off-thread fuzzy search and autocomplete
// Compliant with Section 3: Background execution prevents UI thread freezing even with tens of thousands of records.

function normalizeArabic(text) {
  if (!text) return "";
  let str = text.toString().trim();
  str = str.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, ""); // Diacritics
  str = str.replace(/\u0640/g, ""); // Tatweel
  str = str.replace(/[أإآٱ]/g, "ا"); // Alef
  str = str.replace(/ة/g, "ه"); // Ta marbuta
  str = str.replace(/ى/g, "ي"); // Alef maqsura
  str = str.replace(/[ؤئ]/g, "ء"); // Hamza
  str = str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\[\]<>?"'+=|\\]/g, " ");
  return str.replace(/\s+/g, " ").trim().toLowerCase();
}

function normalizeEnglish(text) {
  if (!text) return "";
  return text.toString().toLowerCase().replace(/[^a-z0-9]/g, " ").replace(/\s+/g, " ").trim();
}

function getEditDistance(a, b) {
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
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        matrix[i][j] = Math.min(matrix[i][j], matrix[i - 2][j - 2] + cost);
      }
    }
  }
  return matrix[lenA][lenB];
}

function isFuzzyMatch(q, t) {
  if (q.length < 4) return false;
  if (t === q || t.startsWith(q) || t.includes(q)) return true;
  const maxDist = q.length >= 7 ? 2 : 1;
  return getEditDistance(q, t) <= maxDist;
}

self.onmessage = function (e) {
  const { id, type, query, dataset } = e.data;
  if (!query || !dataset) {
    self.postMessage({ id, results: [] });
    return;
  }

  const raw = query.trim();
  const normAr = normalizeArabic(raw);
  const normEn = normalizeEnglish(raw);

  if (type === "SUGGEST") {
    const group1Starts = [];
    const group2Contains = [];
    const group3Active = [];
    const group4Fuzzy = [];
    const seen = new Set();

    for (const record of dataset) {
      const bAr = normalizeArabic(record.brandAr || "");
      const bEn = normalizeEnglish(record.brandEn || "");
      const ingAr = normalizeArabic(record.activeIngredientAr || "");
      const ingEn = normalizeEnglish(record.activeIngredientEn || "");

      const key = `${record.brandEn}|${record.concentration}`;
      if (seen.has(key)) continue;

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
        groupId: record.groupId
      };

      if ((normAr && bAr.startsWith(normAr)) || (normEn && bEn.startsWith(normEn))) {
        group1Starts.push(item);
        seen.add(key);
      } else if ((normAr && bAr.includes(normAr)) || (normEn && bEn.includes(normEn))) {
        group2Contains.push(item);
        seen.add(key);
      } else if ((normAr && ingAr.includes(normAr)) || (normEn && ingEn.includes(normEn))) {
        group3Active.push(item);
        seen.add(key);
      } else if (normEn.length >= 4 && (isFuzzyMatch(normEn, bEn) || (normAr.length >= 4 && isFuzzyMatch(normAr, bAr)))) {
        group4Fuzzy.push(item);
        seen.add(key);
      }

      if (group1Starts.length >= 8) break;
    }

    const combined = [...group1Starts, ...group2Contains, ...group3Active, ...group4Fuzzy];
    self.postMessage({ id, results: combined.slice(0, 8) });
  }
};
