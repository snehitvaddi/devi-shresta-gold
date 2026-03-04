/**
 * Embedding generation for visual search
 *
 * MVP approach: use Claude to describe images, then create a simple
 * text-based embedding (hash-based fingerprint of the description).
 * Designed to be swapped for CLIP or similar model in the future.
 */

import { describeImage } from "@/lib/ai/vision";

// ── Types ───────────────────────────────────────────────────────────────────

export interface Embedding {
  vector: number[];
  description: string;
  timestamp: number;
}

// ── Constants ───────────────────────────────────────────────────────────────

const EMBEDDING_DIM = 128;

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Generate an embedding vector from a base64-encoded image.
 *
 * MVP implementation: Claude describes the image, and we create a
 * deterministic numeric fingerprint from the description tokens.
 */
export async function generateEmbedding(
  imageBase64: string,
  mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif" = "image/jpeg"
): Promise<Embedding> {
  const description = await describeImage(imageBase64, mediaType);
  const vector = textToVector(description);

  return {
    vector,
    description,
    timestamp: Date.now(),
  };
}

/**
 * Generate an embedding from a text description (no image required).
 * Useful for building search indexes from existing product descriptions.
 */
export function generateTextEmbedding(text: string): Embedding {
  return {
    vector: textToVector(text),
    description: text,
    timestamp: Date.now(),
  };
}

/** Calculate cosine similarity between two embedding vectors */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

// ── Internal ────────────────────────────────────────────────────────────────

/**
 * Convert text to a fixed-length numeric vector.
 *
 * Uses a simple token-frequency + positional hashing approach.
 * Not production-grade for semantic search, but good enough for MVP
 * demo and will be replaced by a real embedding model.
 */
function textToVector(text: string): number[] {
  const vector = new Float64Array(EMBEDDING_DIM);
  const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, "");
  const tokens = normalized.split(/\s+/).filter(Boolean);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const hash = simpleHash(token);
    const idx = Math.abs(hash) % EMBEDDING_DIM;
    // Combine token hash with positional info
    vector[idx] += 1.0 / (1 + i * 0.1);

    // Also populate adjacent dimensions for richer representation
    const idx2 = Math.abs(hash * 31) % EMBEDDING_DIM;
    vector[idx2] += 0.5 / (1 + i * 0.1);
  }

  // L2-normalize
  let norm = 0;
  for (let i = 0; i < EMBEDDING_DIM; i++) {
    norm += vector[i] * vector[i];
  }
  norm = Math.sqrt(norm);
  if (norm > 0) {
    for (let i = 0; i < EMBEDDING_DIM; i++) {
      vector[i] /= norm;
    }
  }

  return Array.from(vector);
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
