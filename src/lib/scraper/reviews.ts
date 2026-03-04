/**
 * Review aggregator
 *
 * Fetches and aggregates reviews from Google Places (and extensible
 * to other sources). Provides summary statistics and top reviews.
 */

import { getPlaceReviews, type Review } from "./google-maps";

// ── Types ───────────────────────────────────────────────────────────────────

export interface AggregatedReviews {
  avgRating: number;
  totalCount: number;
  ratingDistribution: Record<1 | 2 | 3 | 4 | 5, number>;
  summary: string;
  topPositive: Review[];
  topNegative: Review[];
  recentReviews: Review[];
  keywords: string[];
}

// ── Public API ──────────────────────────────────────────────────────────────

/** Fetch Google reviews for a place */
export async function getGoogleReviews(placeId: string): Promise<Review[]> {
  return getPlaceReviews(placeId);
}

/** Aggregate an array of reviews into summary statistics */
export function aggregateReviews(reviews: Review[]): AggregatedReviews {
  if (reviews.length === 0) {
    return {
      avgRating: 0,
      totalCount: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      summary: "No reviews available.",
      topPositive: [],
      topNegative: [],
      recentReviews: [],
      keywords: [],
    };
  }

  // Calculate average
  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const avgRating = Math.round((totalRating / reviews.length) * 10) / 10;

  // Rating distribution
  const distribution: Record<1 | 2 | 3 | 4 | 5, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
  for (const r of reviews) {
    const bucket = Math.min(5, Math.max(1, Math.round(r.rating))) as
      | 1
      | 2
      | 3
      | 4
      | 5;
    distribution[bucket]++;
  }

  // Sort for top positive / negative
  const sorted = [...reviews].sort((a, b) => b.rating - a.rating);
  const topPositive = sorted
    .filter((r) => r.rating >= 4 && r.text.length > 20)
    .slice(0, 3);
  const topNegative = sorted
    .filter((r) => r.rating <= 2 && r.text.length > 20)
    .reverse()
    .slice(0, 3);

  // Most recent
  const recentReviews = [...reviews]
    .sort((a, b) => b.time - a.time)
    .slice(0, 5);

  // Extract keywords
  const keywords = extractKeywords(reviews);

  // Generate summary
  const summary = generateSummary(
    avgRating,
    reviews.length,
    distribution,
    keywords
  );

  return {
    avgRating,
    totalCount: reviews.length,
    ratingDistribution: distribution,
    summary,
    topPositive,
    topNegative,
    recentReviews,
    keywords,
  };
}

/**
 * Fetch and aggregate reviews in one call.
 */
export async function fetchAndAggregateReviews(
  placeId: string
): Promise<AggregatedReviews> {
  const reviews = await getGoogleReviews(placeId);
  return aggregateReviews(reviews);
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function extractKeywords(reviews: Review[]): string[] {
  const wordFreq = new Map<string, number>();
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "it", "that", "this", "was", "are",
    "be", "have", "has", "had", "not", "they", "we", "he", "she", "i",
    "my", "me", "our", "you", "your", "very", "so", "just", "really",
    "will", "can", "would", "been", "were", "their", "there", "here",
    "all", "also", "than", "more", "about", "up", "out", "do", "did",
  ]);

  for (const review of reviews) {
    const words = review.text
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !stopWords.has(w));

    for (const word of words) {
      wordFreq.set(word, (wordFreq.get(word) ?? 0) + 1);
    }
  }

  return [...wordFreq.entries()]
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word]) => word);
}

function generateSummary(
  avgRating: number,
  totalCount: number,
  distribution: Record<1 | 2 | 3 | 4 | 5, number>,
  keywords: string[]
): string {
  const sentiment =
    avgRating >= 4.5
      ? "overwhelmingly positive"
      : avgRating >= 4.0
        ? "very positive"
        : avgRating >= 3.5
          ? "generally positive"
          : avgRating >= 3.0
            ? "mixed"
            : avgRating >= 2.0
              ? "mostly negative"
              : "poor";

  const fiveStarPct =
    totalCount > 0
      ? Math.round((distribution[5] / totalCount) * 100)
      : 0;

  const topKeywords = keywords.slice(0, 5).join(", ");

  let summary = `${totalCount} reviews with a ${avgRating}/5 average rating (${sentiment}). `;
  summary += `${fiveStarPct}% of reviewers gave 5 stars. `;

  if (topKeywords) {
    summary += `Customers frequently mention: ${topKeywords}.`;
  }

  return summary;
}
