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
        'border border-transparent hover:border-[var(--color-primary)]/40',
        'transition-all duration-500',
        'hover:shadow-[var(--shadow-gold)]',
        'hover:-translate-y-1',
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-[var(--color-bg-surface)]">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
        <span className="badge absolute top-3 left-3">
          {product.category}
        </span>

        {/* Discount badge */}
        {hasDiscount && (
          <span className="absolute top-3 right-3 px-2 py-1 text-xs font-semibold rounded bg-[var(--color-error)] text-white">
            SAVE {Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3
          className="text-base font-semibold text-[var(--color-text)] mb-1 line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {product.name}
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] mb-3 line-clamp-1">
          {product.shortDescription}
        </p>

        {/* Price range based on gold rate fluctuation */}
        <div className="flex items-center gap-2 flex-wrap">
          {hasDiscount ? (
            <>
              <span className="text-lg font-bold text-[var(--color-primary)]">
                {formatPrice(product.price, product.currency)}
              </span>
              <span className="text-sm text-[var(--color-text-muted)] line-through">
                {formatPrice(product.compareAtPrice!, product.currency)}
              </span>
            </>
          ) : (
            <>
              <span className="text-sm font-bold text-[var(--color-primary)]">
                {formatPrice(getPriceRange(product.price).low, product.currency)}
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">—</span>
              <span className="text-sm font-bold text-[var(--color-primary)]">
                {formatPrice(getPriceRange(product.price).high, product.currency)}
              </span>
            </>
          )}
        </div>
        <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
          *Price varies with gold rate
        </p>

        {/* Enquire / Add to Cart button */}
        {showEnquire && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi! I'm interested in: ${product.name}`)}`, "_blank");
            }}
            className="mt-3 w-full py-2 text-xs font-semibold rounded-md bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] transition-all duration-300"
          >
            Enquire Now
          </button>
        )}
      </div>
    </div>
  );
}
