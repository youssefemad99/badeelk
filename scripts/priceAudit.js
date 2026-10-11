// scripts/priceAudit.js
// Price audit script for Badeelk dataset
// Groups drugs by (activeIngredientEn + concentration + form) and flags outliers (<40% or >250% of median, <=0, NaN)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOW = 0.4;
const HIGH = 2.5;

function calculateMedian(arr) {
  if (!arr || arr.length === 0) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 !== 0 ? s[m] : (s[m - 1] + s[m]) / 2;
}

export function runPriceAudit(drugs) {
  const groups = {};
  for (const d of drugs) {
    const key = [d.activeIngredientEn || 'UNKNOWN', d.concentration || 'UNKNOWN', d.form || 'UNKNOWN'].join('|');
    if (!groups[key]) groups[key] = [];
    groups[key].push(d);
  }

  const flagged = [];
  const groupStats = {};

  for (const [key, items] of Object.entries(groups)) {
    const validPrices = items.map(i => Number(i.price)).filter(p => !isNaN(p) && p > 0);
    const med = validPrices.length > 0 ? calculateMedian(validPrices) : 0;
    const min = validPrices.length > 0 ? Math.min(...validPrices) : 0;
    const max = validPrices.length > 0 ? Math.max(...validPrices) : 0;

    groupStats[key] = {
      median: med,
      min,
      max,
      totalCount: items.length,
      validPriceCount: validPrices.length
    };

    for (const item of items) {
      const p = Number(item.price);
      const isInvalid = isNaN(p) || p <= 0;
      const isOutlier = med > 0 && (p < med * LOW || p > med * HIGH);

      if (isInvalid || isOutlier) {
        flagged.push({
          id: item.id,
          key,
          brandEn: item.brandEn,
          brandAr: item.brandAr,
          price: item.price,
          medianPrice: med,
          minPrice: min,
          maxPrice: max,
          reason: isInvalid ? 'INVALID_PRICE' : (p < med * LOW ? 'PRICE_TOO_LOW' : 'PRICE_TOO_HIGH')
        });
      }
    }
  }

  return { flagged, groupStats, totalAudited: drugs.length };
}

// If run directly via node
const datasetPath = path.join(__dirname, '../js/dataset.js');
if (fs.existsSync(datasetPath)) {
  const content = fs.readFileSync(datasetPath, 'utf-8');
  const match = content.match(/export const DRUG_DATABASE = (\[[\s\S]*?\]);/);
  if (match) {
    try {
      const drugs = JSON.parse(match[1]);
      const { flagged, groupStats, totalAudited } = runPriceAudit(drugs);
      const reportPath = path.join(__dirname, '../data/priceAudit-report.json');
      fs.writeFileSync(reportPath, JSON.stringify({
        auditDate: new Date().toISOString(),
        thresholds: { LOW, HIGH },
        totalAudited,
        totalFlagged: flagged.length,
        flagged
      }, null, 2), 'utf-8');
      console.log(`Audited ${totalAudited} drugs. Flagged ${flagged.length} price outliers. Saved to ${reportPath}`);
    } catch (e) {
      console.error('Error parsing dataset JSON:', e);
    }
  }
}
