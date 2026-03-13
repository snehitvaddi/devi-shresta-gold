'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  showEnquire?: boolean;
  whatsappNumber?: string;
}

function formatPrice(price: number, currency: string): string {
  const locale = currency === 'INR' ? 'en-IN' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function getPriceRange(price: number): { low: number; high: number } {
  // Gold prices fluctuate ~5%, show a range
  const variance = Math.round(price * 0.05);
  return { low: price - variance, high: price + variance };
}

export default function ProductCard({ product, showEnquire = true, whatsappNumber = '917337372922' }: ProductCardProps) {
  const router = useRouter();
  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <div
      onClick={() => router.push(`/collections/${product.slug}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          router.push(`/collections/${product.slug}`);
        }
      }}
      className={cn(
        'group block bg-[var(--color-bg-card)] rounded-[var(--radius-md)] overflow-hidden cursor-pointer',
        'border border-transparent',
        'transition-all duration-300',
        'hover:scale-[1.02] hover:border-[var(--color-primary)]/30',
        'hover:shadow-[var(--shadow-gold)]',
      )}
    >
      {/* Image Container — shorter aspect on mobile for compact cards */}
      <div className="relative aspect-[4/5] md:aspect-square overflow-hidden bg-[var(--color-bg-surface)]">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[var(--color-text-muted)]">
            No Image
          </div>
        )}

        {/* Hover overlay */}
        <div
          className={cn(
            'absolute inset-0 bg-black/40 flex items-center justify-center',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-300',
          )}
        >
          <span className="btn btn-outline text-sm">View Details</span>
        </div>

        {/* Category badge */}
        <span className="badge absolute top-2 left-2 text-[10px] md:text-xs md:top-3 md:left-3">
          {product.category}
        </span>

        {/* Discount badge */}
        {hasDiscount && (
          <span className="absolute top-2 right-2 md:top-3 md:right-3 px-1.5 py-0.5 md:px-2 md:py-1 text-[10px] md:text-xs font-semibold rounded bg-[var(--color-error)] text-white">
            SAVE {Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5 md:p-4">
        <h3
          className="text-sm md:text-base font-semibold text-[var(--color-text)] mb-0.5 md:mb-1 line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {product.name}
        </h3>
        <p className="text-[10px] md:text-xs text-[var(--color-text-muted)] mb-2 md:mb-3 line-clamp-1">
          {product.shortDescription}
        </p>

        {/* Price range based on gold rate fluctuation */}
        <div className="flex items-center gap-1 md:gap-2 flex-wrap">
          {hasDiscount ? (
            <>
              <span className="text-base md:text-lg font-semibold text-[var(--color-primary)]">
                {formatPrice(product.price, product.currency)}
              </span>
              <span className="text-xs md:text-sm text-[var(--color-text-muted)] line-through">
                {formatPrice(product.compareAtPrice!, product.currency)}
              </span>
            </>
          ) : (
            <>
              <span className="text-sm md:text-base font-semibold text-[var(--color-primary)]">
                {formatPrice(getPriceRange(product.price).low, product.currency)}
              </span>
              <span className="text-[10px] md:text-xs text-[var(--color-text-muted)]">—</span>
              <span className="text-sm md:text-base font-semibold text-[var(--color-primary)]">
                {formatPrice(getPriceRange(product.price).high, product.currency)}
              </span>
            </>
          )}
        </div>
        <p className="text-[9px] md:text-[10px] text-[var(--color-text-muted)] mt-0.5">
          *Price varies with gold rate
        </p>

        {/* Visible CTA buttons */}
        {showEnquire && (
          <div className="flex gap-2 mt-2 md:mt-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi! I'm interested in: ${product.name}`)}`, "_blank");
              }}
              className="flex-1 py-1.5 md:py-2 text-[10px] md:text-xs font-semibold rounded-md bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] transition-all duration-300"
            >
              Enquire
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/collections/${product.slug}`);
              }}
              className="flex-1 py-1.5 md:py-2 text-[10px] md:text-xs font-semibold rounded-md text-[var(--color-text-muted)] border border-[var(--color-text)]/10 hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)] transition-all duration-300"
            >
              View Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
