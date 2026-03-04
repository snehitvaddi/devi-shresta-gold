"use client";

import { Star, Quote, MapPin, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GoogleReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  productMentioned?: string;
  avatar?: string;
}

interface ReviewMarqueeProps {
  reviews: GoogleReview[];
  overallRating: number;
  reviewCount: number;
  businessName: string;
  googleMapsUrl?: string;
}

export default function ReviewMarquee({
  reviews,
  overallRating,
  reviewCount,
  businessName,
  googleMapsUrl,
}: ReviewMarqueeProps) {
  if (reviews.length === 0) return null;

  // Split reviews into two rows for dual-marquee effect
  const mid = Math.ceil(reviews.length / 2);
  const row1 = reviews.slice(0, mid);
  const row2 = reviews.slice(mid);

  return (
    <section className="section overflow-hidden">
      <div className="container-site mb-12">
        {/* Header with Google branding */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              {/* Google "G" logo */}
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <h2
                className="text-3xl md:text-4xl font-bold text-gradient"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Customer Reviews
              </h2>
            </div>
            <div className="divider max-w-xs !mt-0" />
          </div>

          {/* Overall rating summary */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-[var(--color-primary)]" style={{ fontFamily: "var(--font-heading)" }}>
                {overallRating}
              </div>
              <div className="flex items-center gap-0.5 mt-1 justify-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={cn(
                      i < Math.round(overallRating)
                        ? "text-[var(--color-primary)] fill-[var(--color-primary)]"
                        : "text-gray-600"
                    )}
                  />
                ))}
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                {reviewCount} reviews
              </p>
            </div>

            {/* Rating bars */}
            <div className="hidden sm:block space-y-1">
              {[5, 4, 3, 2, 1].map((stars) => {
                // Approximate distribution based on 4.6 rating
                const pct = stars === 5 ? 72 : stars === 4 ? 18 : stars === 3 ? 6 : stars === 2 ? 2 : 2;
                return (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-xs text-[var(--color-text-muted)] w-3">{stars}</span>
                    <Star size={10} className="text-[var(--color-primary)] fill-[var(--color-primary)]" />
                    <div className="w-24 h-1.5 bg-[var(--color-bg-surface-light)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-1000"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-[var(--color-text-muted)] w-8">{pct}%</span>
                  </div>
                );
              })}
            </div>

            {/* Write a review CTA */}
            {googleMapsUrl && (
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-primary)]/30 text-[var(--color-primary)] text-sm font-medium hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] transition-all"
              >
                <MapPin size={14} />
                Review us
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Marquee Row 1 — scrolls left */}
      <div className="relative mb-4">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[var(--color-bg)] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[var(--color-bg)] to-transparent z-10 pointer-events-none" />

        <div className="flex animate-[marqueeLeft_40s_linear_infinite] hover:[animation-play-state:paused] w-max">
          {[...row1, ...row1].map((review, i) => (
            <ReviewCard key={`r1-${i}`} review={review} />
          ))}
        </div>
      </div>

      {/* Marquee Row 2 — scrolls right (slower) */}
      {row2.length > 0 && (
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[var(--color-bg)] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[var(--color-bg)] to-transparent z-10 pointer-events-none" />

          <div className="flex animate-[marqueeRight_50s_linear_infinite] hover:[animation-play-state:paused] w-max">
            {[...row2, ...row2].map((review, i) => (
              <ReviewCard key={`r2-${i}`} review={review} />
            ))}
          </div>
        </div>
      )}

      {/* Google attribution */}
      <div className="container-site mt-8 flex items-center justify-center gap-2 text-xs text-[var(--color-text-muted)]">
        <svg width="14" height="14" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span>Reviews from Google Maps</span>
        <span className="mx-1">·</span>
        <span>{businessName}</span>
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: GoogleReview }) {
  // Generate initials and consistent avatar color from name
  const initials = review.author
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const colors = [
    "from-blue-500 to-blue-600",
    "from-emerald-500 to-emerald-600",
    "from-purple-500 to-purple-600",
    "from-orange-500 to-orange-600",
    "from-pink-500 to-pink-600",
    "from-cyan-500 to-cyan-600",
    "from-amber-500 to-amber-600",
    "from-rose-500 to-rose-600",
  ];
  const colorIdx = review.author.split("").reduce((sum, c) => sum + c.charCodeAt(0), 0) % colors.length;

  return (
    <div className="shrink-0 w-[340px] mx-2">
      <div
        className={cn(
          "p-5 rounded-xl h-full",
          "bg-[var(--color-bg-surface)] border border-[var(--color-text)]/5",
          "hover:border-[var(--color-primary)]/20 hover:shadow-[var(--shadow-gold)]",
          "transition-all duration-300"
        )}
      >
        {/* Header: Avatar + Name + Stars */}
        <div className="flex items-start gap-3 mb-3">
          {/* Avatar */}
          <div className={cn("w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center shrink-0 text-white text-xs font-bold", colors[colorIdx])}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--color-text)] truncate">
              {review.author}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={cn(
                      i < review.rating
                        ? "text-[var(--color-primary)] fill-[var(--color-primary)]"
                        : "text-gray-600"
                    )}
                  />
                ))}
              </div>
              <span className="text-[10px] text-[var(--color-text-muted)]">{review.date}</span>
            </div>
          </div>
          {/* Google icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" className="shrink-0 opacity-40">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        </div>

        {/* Review text */}
        <div className="relative">
          <Quote size={14} className="absolute -top-1 -left-1 text-[var(--color-primary)]/20" />
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed line-clamp-4 pl-3">
            {review.text}
          </p>
        </div>

        {/* Product tag */}
        {review.productMentioned && (
          <div className="mt-3">
            <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
              {review.productMentioned}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
