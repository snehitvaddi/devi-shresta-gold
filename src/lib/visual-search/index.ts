/**
 * Visual search index management
 *
 * Build and maintain the product embedding index for an organisation.
 */

import { generateEmbedding, generateTextEmbedding } from "./embeddings";
import { getIndex, setIndex, type ProductEntry } from "./search";

// ── Types ───────────────────────────────────────────────────────────────────

export interface ProductInput {
  id: string;
  name: string;
  description: string;
  category?: string;
  price?: number;
  imageUrl?: string;
  imageBase64?: string;
}

export interface IndexStats {
  orgId: string;
  totalProducts: number;
  indexedProducts: number;
  lastUpdated: number;
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Build (or rebuild) the entire search index for an organisation.
 *
 * For products with imageBase64, generates vision-based embeddings.
 * Otherwise falls back to text-based embeddings from name + description.
 */
export async function buildIndex(
  orgId: string,
  products: ProductInput[]
): Promise<IndexStats> {
  const entries: ProductEntry[] = [];

  for (const product of products) {
    const entry: ProductEntry = {
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      imageUrl: product.imageUrl,
    };

    try {
      if (product.imageBase64) {
        entry.embedding = await generateEmbedding(product.imageBase64);
      } else {
        entry.embedding = generateTextEmbedding(
          `${product.name}. ${product.description}. ${product.category ?? ""}`
        );
      }
    } catch (err) {
      console.error(`Failed to generate embedding for product ${product.id}:`, err);
      // Still include the product, just without embedding
    }

    entries.push(entry);
  }

  setIndex(orgId, entries);

  return {
    orgId,
    totalProducts: products.length,
    indexedProducts: entries.filter((e) => e.embedding).length,
    lastUpdated: Date.now(),
  };
}

/**
 * Add a single product to an existing index.
 */
export async function addToIndex(
  orgId: string,
  product: ProductInput
): Promise<void> {
  const index = getIndex(orgId);

  const entry: ProductEntry = {
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    price: product.price,
    imageUrl: product.imageUrl,
  };

  try {
    if (product.imageBase64) {
      entry.embedding = await generateEmbedding(product.imageBase64);
    } else {
      entry.embedding = generateTextEmbedding(
        `${product.name}. ${product.description}. ${product.category ?? ""}`
      );
    }
  } catch (err) {
    console.error(`Failed to generate embedding for product ${product.id}:`, err);
  }

  // Replace existing entry or add new
  const existingIdx = index.findIndex((e) => e.id === product.id);
  if (existingIdx >= 0) {
    index[existingIdx] = entry;
  } else {
    index.push(entry);
  }
}

/**
 * Remove a product from the index.
 */
export function removeFromIndex(orgId: string, productId: string): boolean {
  const index = getIndex(orgId);
  const idx = index.findIndex((e) => e.id === productId);

  if (idx >= 0) {
    index.splice(idx, 1);
    return true;
  }

  return false;
}

/**
 * Get stats about the current index for an organisation.
 */
export function getIndexStats(orgId: string): IndexStats {
  const index = getIndex(orgId);
  return {
    orgId,
    totalProducts: index.length,
    indexedProducts: index.filter((e) => e.embedding).length,
    lastUpdated: Date.now(),
  };
}
