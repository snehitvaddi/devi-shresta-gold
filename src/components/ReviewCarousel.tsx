'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Review } from '@/types';

interface ReviewCarouselProps {
  reviews: Review[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={cn(
            i < rating
              ? 'text-[var(--color-primary)] fill-[var(--color-primary)]'
              : 'text-[var(--color-bg-surface-light)]',
          )}
        />
      ))}
    </div>
  );
}

export default function ReviewCarousel({ reviews }: ReviewCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const cardWidth = 360;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -cardWidth : cardWidth,
      behavior: 'smooth',
    });
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (isPaused || reviews.length <= 1) return;
    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scroll('right');
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, reviews.length, scroll]);

  if (reviews.length === 0) return null;

  return (
    <section className="section overflow-hidden">
      <div className="container-site">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2
              className="text-3xl md:text-4xl font-bold text-gradient mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              What Our Customers Say
            </h2>
            <div className="divider max-w-xs !mt-0" />
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-[var(--color-text)]/10 flex items-center justify-center text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all"
              aria-label="Previous review"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-[var(--color-text)]/10 flex items-center justify-center text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all"
              aria-label="Next review"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex gap-6 overflow-x-auto scrollbar-none pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reviews.map((review) => (
            <div
              key={review.id}
              className={cn(
                'shrink-0 w-[320px] sm:w-[360px] p-6 snap-start',
                'bg-[var(--color-bg-surface)] rounded-[var(--radius-md)]',
                'border border-[var(--color-text)]/5 hover:border-[var(--color-primary)]/20',
                'transition-all duration-300',
              )}
            >
              <StarRating rating={review.rating} />
              <h4
                className="text-base font-semibold text-[var(--color-text)] mt-4 mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {review.title}
              </h4>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4 line-clamp-4">
                &ldquo;{review.body}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    {review.customerName}
                  </p>
                  {review.verified && (
                    <p className="text-xs text-[var(--color-primary)]">Verified Purchase</p>
                  )}
                </div>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Google Reviews attribution */}
        <p className="text-xs text-[var(--color-text-muted)] mt-6 text-center">
          Reviews sourced from Google Reviews
        </p>
      </div>
    </section>
  );
}
