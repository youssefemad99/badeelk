// dataLoader.js - Scalable on-demand chunk loader & Cache API manager
// Compliant with Section 3: Do NOT load one giant file. Split by prefix, load on demand, cache locally, under 50ms lookup.
import { DRUG_DATABASE } from "./dataset.js";

// In-memory cache of loaded chunks
const loadedChunks = new Map();
let prefixIndex = null;
let isIndexLoading = false;

// Combined drug dataset starts with the pre-bundled 3,573 popular drugs
let activeDataset = [...DRUG_DATABASE];
const activeIdsSet = new Set(activeDataset.map(r => r.id));

/**
 * Initializes the prefix index file on startup (<5 KB)
 */
export async function initDataLoader() {
  if (prefixIndex || isIndexLoading) return;
  isIndexLoading = true;
  try {
    const res = await fetch("data/prefix_index.json");
    if (res.ok) {
      prefixIndex = await res.json();
    }
  } catch (err) {
    console.warn("Could not load prefix_index.json, running with core dataset:", err);
  } finally {
    isIndexLoading = false;
  }
}

/**
 * Determines the chunk key for a given input query.
 */
export function getChunkKeyForQuery(query) {
  if (!query || query.trim().length === 0) return null;
  const firstChar = query.trim()[0].toLowerCase();

  // Arabic characters range
  if (firstChar >= '\u0600' && firstChar <= '\u06FF') {
    return `ar_${firstChar}`;
  }

  // English letters
  if (firstChar >= 'a' && firstChar <= 'z') {
    return `en_${firstChar}`;
  }

  return null;
}

/**
 * Loads a chunk on demand by prefix and caches it in memory + Cache API.
 */
export async function loadChunkForPrefix(chunkKey) {
  if (!chunkKey || loadedChunks.has(chunkKey)) {
    return loadedChunks.get(chunkKey) || [];
  }

  const chunkPath = `data/chunks/${chunkKey}.json`;

  try {
    // Try Cache API if available in browser
    let response = null;
    let cache = null;
    if ("caches" in window) {
      try {
        cache = await caches.open("badeelak-chunks-v1");
        response = await cache.match(chunkPath);
      } catch (e) {
        // Fallback to fetch
      }
    }

    if (!response) {
      response = await fetch(chunkPath);
      if (response && response.ok && cache) {
        try {
          cache.put(chunkPath, response.clone());
        } catch (e) {}
      }
    }

    if (response && response.ok) {
      const records = await response.json();
      loadedChunks.set(chunkKey, records);

      // Merge newly loaded records into active dataset without duplicates
      for (const rec of records) {
        if (!activeIdsSet.has(rec.id)) {
          activeDataset.push(rec);
          activeIdsSet.add(rec.id);
        }
      }

      return records;
    }
  } catch (error) {
    console.warn(`Could not load chunk ${chunkKey}:`, error);
  }

  return [];
}

/**
 * Returns the full active dataset (core bundled + all loaded chunks).
 */
export function getActiveDataset() {
  return activeDataset;
}

/**
 * Searches for all records belonging to a substitute group across active dataset.
 */
export function getSubstitutesForGroup(groupId) {
  if (!groupId) return [];
  return activeDataset.filter(r => r.groupId === groupId);
}
