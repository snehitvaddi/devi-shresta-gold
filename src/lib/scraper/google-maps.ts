/**
 * Google Places API client
 *
 * Search for places, get details, hours, reviews, and photos.
 * Requires GOOGLE_PLACES_API_KEY env var.
 */

const PLACES_API_BASE = "https://maps.googleapis.com/maps/api/place";

function getApiKey(): string {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) throw new Error("Missing GOOGLE_PLACES_API_KEY");
  return key;
}

// ── Types ───────────────────────────────────────────────────────────────────

export interface PlaceResult {
  placeId: string;
  name: string;
  address: string;
  rating?: number;
  userRatingsTotal?: number;
  types: string[];
  location: { lat: number; lng: number };
  openNow?: boolean;
  photoReferences: string[];
}

export interface PlaceDetails {
  placeId: string;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  rating?: number;
  userRatingsTotal?: number;
  types: string[];
  location: { lat: number; lng: number };
  hours?: {
    openNow: boolean;
    periods: { day: number; open: string; close: string }[];
    weekdayText: string[];
  };
  reviews: Review[];
  photos: PlacePhoto[];
  priceLevel?: number;
  businessStatus?: string;
}

export interface Review {
  authorName: string;
  rating: number;
  text: string;
  time: number;
  relativeTime: string;
  profilePhotoUrl?: string;
}

export interface PlacePhoto {
  reference: string;
  width: number;
  height: number;
  url?: string;
}

// ── Public API ──────────────────────────────────────────────────────────────

/** Search for a place by text query */
export async function searchPlace(query: string): Promise<PlaceResult[]> {
  const key = getApiKey();
  const url = new URL(`${PLACES_API_BASE}/textsearch/json`);
  url.searchParams.set("query", query);
  url.searchParams.set("key", key);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Places API search failed: ${res.status}`);
  }

  const data = await res.json();

  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    throw new Error(`Places API error: ${data.status} - ${data.error_message ?? ""}`);
  }

  return (data.results ?? []).map(mapPlaceResult);
}

/** Get full details for a place */
export async function getPlaceDetails(
  placeId: string
): Promise<PlaceDetails> {
  const key = getApiKey();
  const url = new URL(`${PLACES_API_BASE}/details/json`);
  url.searchParams.set("place_id", placeId);
  url.searchParams.set(
    "fields",
    "place_id,name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,types,geometry,opening_hours,reviews,photos,price_level,business_status"
  );
  url.searchParams.set("key", key);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Places API details failed: ${res.status}`);
  }

  const data = await res.json();

  if (data.status !== "OK") {
    throw new Error(`Places API error: ${data.status} - ${data.error_message ?? ""}`);
  }

  const r = data.result;

  return {
    placeId: r.place_id,
    name: r.name,
    address: r.formatted_address,
    phone: r.formatted_phone_number,
    website: r.website,
    rating: r.rating,
    userRatingsTotal: r.user_ratings_total,
    types: r.types ?? [],
    location: {
      lat: r.geometry?.location?.lat,
      lng: r.geometry?.location?.lng,
    },
    hours: r.opening_hours
      ? {
          openNow: r.opening_hours.open_now ?? false,
          periods: (r.opening_hours.periods ?? []).map(
            (p: { open?: { day: number; time: string }; close?: { day: number; time: string } }) => ({
              day: p.open?.day ?? 0,
              open: p.open?.time ?? "0000",
              close: p.close?.time ?? "2359",
            })
          ),
          weekdayText: r.opening_hours.weekday_text ?? [],
        }
      : undefined,
    reviews: (r.reviews ?? []).map(mapReview),
    photos: (r.photos ?? []).map((p: { photo_reference: string; width: number; height: number }) =>
      mapPhoto(p, key)
    ),
    priceLevel: r.price_level,
    businessStatus: r.business_status,
  };
}

/** Get reviews for a place (convenience wrapper) */
export async function getPlaceReviews(placeId: string): Promise<Review[]> {
  const details = await getPlaceDetails(placeId);
  return details.reviews;
}

/** Get a photo URL from a reference */
export function getPhotoUrl(
  photoReference: string,
  maxWidth: number = 800
): string {
  const key = getApiKey();
  return `${PLACES_API_BASE}/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${key}`;
}

// ── Mappers ─────────────────────────────────────────────────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */

function mapPlaceResult(r: any): PlaceResult {
  return {
    placeId: r.place_id,
    name: r.name,
    address: r.formatted_address,
    rating: r.rating,
    userRatingsTotal: r.user_ratings_total,
    types: r.types ?? [],
    location: {
      lat: r.geometry?.location?.lat,
      lng: r.geometry?.location?.lng,
    },
    openNow: r.opening_hours?.open_now,
    photoReferences: (r.photos ?? []).map(
      (p: any) => p.photo_reference as string
    ),
  };
}

function mapReview(r: any): Review {
  return {
    authorName: r.author_name,
    rating: r.rating,
    text: r.text,
    time: r.time,
    relativeTime: r.relative_time_description,
    profilePhotoUrl: r.profile_photo_url,
  };
}

function mapPhoto(p: any, apiKey: string): PlacePhoto {
  return {
    reference: p.photo_reference,
    width: p.width,
    height: p.height,
    url: `${PLACES_API_BASE}/photo?maxwidth=${p.width}&photo_reference=${p.photo_reference}&key=${apiKey}`,
  };
}
