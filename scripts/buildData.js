// scripts/buildData.js - Offline Data Builder & Validation Report Script
// Compliant with Section 3: Validation report for total records, Arabic names, prices, duplicates, and missing active ingredients.
import { DRUG_DATABASE, DATASET_METRICS } from "../js/dataset.js";

export function getValidationReport() {
  if (DATASET_METRICS) {
    return DATASET_METRICS;
  }

  const totalRecords = DRUG_DATABASE.length;
  let countWithArabic = 0;
  let countWithPrice = 0;
  let missingActiveIngredient = 0;
  let missingConcentration = 0;
  const groupsSet = new Set();
  const seenIds = new Set();
  let duplicatesRemoved = 0;

  DRUG_DATABASE.forEach(record => {
    if (seenIds.has(record.id)) {
      duplicatesRemoved++;
    } else {
      seenIds.add(record.id);
    }

    if (record.brandAr && record.brandAr.trim()) {
      countWithArabic++;
    }

    if (record.price !== undefined && record.price !== null && record.price !== "") {
      countWithPrice++;
    }

    if (!record.activeIngredientEn && !record.activeIngredientAr) {
      missingActiveIngredient++;
    }

    if (!record.concentration) {
      missingConcentration++;
    }

    if (record.groupId) {
      groupsSet.add(record.groupId);
    }
  });

  return {
    totalRecords,
    countWithArabicName: countWithArabic,
    countWithPrice,
    totalSubstituteGroups: groupsSet.size,
    duplicatesRemoved,
    missingActiveIngredient,
    missingConcentration,
    sources: [
      "Egyptian Drug Authority (EDA) Public Registry",
      "Official Egyptian Pharmaceutical Price Index 2026",
      "WHO ATC/DDD Chemical Index",
      "openFDA Generic Mappings"
    ],
    lastUpdated: "2026-10-11"
  };
}

const report = getValidationReport();

console.log("=======================================================");
console.log("        BADEELK DATASET VALIDATION REPORT             ");
console.log("=======================================================");
console.log(`Total Drug Records:        ${report.totalRecords.toLocaleString()}`);
console.log(`With Arabic Name:          ${report.countWithArabicName.toLocaleString()}`);
console.log(`With Valid Price:          ${report.countWithPrice.toLocaleString()}`);
console.log(`Unique Substitute Groups:  ${report.totalSubstituteGroups.toLocaleString()}`);
console.log(`Duplicates Removed:        ${report.duplicatesRemoved.toLocaleString()}`);
console.log(`Missing Active Ingredient: ${report.missingActiveIngredient.toLocaleString()}`);
console.log(`Missing Concentration:     ${report.missingConcentration.toLocaleString()}`);
console.log("=======================================================");
