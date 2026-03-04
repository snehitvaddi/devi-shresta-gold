/**
 * Visual similarity search
 *
 * Search the product catalog by image or text description.
 */

import {
  generateEmbedding,
  generateTextEmbedding,
  cosineSimilarity,
  type Embedding,
} from "./embeddings";

// ── Types ───────────────────────────────────────────────────────────────────

export interface ProductEntry {
  id: string;
  name: string;
  description: string;
  category?: string;
  price?: number;
  imageUrl?: string;
  embedding?: Embedding;
}

export interface SearchResult {
  product: ProductEntry;
  score: number;
}

// ── In-memory index (per-org) ───────────────────────────────────────────────

const indexes = new Map<string, ProductEntry[]>();

/** Get or initialise the index for an org */
export function getIndex(orgId: string): ProductEntry[] {
  if (!indexes.has(orgId)) {
    indexes.set(orgId, []);
  }
  return indexes.get(orgId)!;
}

/** Replace the entire index for an org (used by index.ts buildIndex) */
export function setIndex(orgId: string, entries: ProductEntry[]): void {
  indexes.set(orgId, entries);
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Search the product catalog by uploading an image.
 * Returns products ranked by visual similarity.
 */
export async function searchByImage(
  imageBase64: string,
  orgId: string,
  topK: number = 5
): Promise<SearchResult[]> {
  const queryEmbedding = await generateEmbedding(imageBase64);
  const index = getIndex(orgId);

  return rankByEmbedding(queryEmbedding, index, topK);
}

/**
 * Search the product catalog by text description.
 * Returns products ranked by description similarity.
 */
export function searchByDescription(
  description: string,
  orgId: string,
  topK: number = 5
): SearchResult[] {
  const queryEmbedding = generateTextEmbedding(description);
  const index = getIndex(orgId);

  return rankByEmbedding(queryEmbedding, index, topK);
}

// ── Internal ────────────────────────────────────────────────────────────────

function rankByEmbedding(
  query: Embedding,
  index: ProductEntry[],
  topK: number
): SearchResult[] {
  const scored: SearchResult[] = [];

  for (const entry of index) {
    if (!entry.embedding) continue;

    const score = cosineSimilarity(query.vector, entry.embedding.vector);
    scored.push({ product: entry, score });
  }

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK);
}
