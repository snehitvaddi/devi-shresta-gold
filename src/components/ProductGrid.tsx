'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import ProductCard from './ProductCard';
import type { Product } from '@/types';

export interface CategoryInfo {
  name: string;
  slug: string;
}

interface ProductGridProps {
  products: Product[];
  categories?: CategoryInfo[];
  showFilters?: boolean;
  showTitle?: boolean;
  limit?: number;
  defaultCategory?: string; // slug value
}

export default function ProductGrid({
  products,
  categories,
  showFilters = true,
  showTitle = true,
  limit,
  defaultCategory,
}: ProductGridProps) {
  const [activeSlug, setActiveSlug] = useState(defaultCategory || 'all');

  const allCategories = useMemo(() => {
    if (categories && categories.length > 0) {
      return [{ name: 'All', slug: 'all' }, ...categories];
    }
    // Derive from products — capitalize slug for display
    const unique = Array.from(new Set(products.map((p) => p.category)));
    return [
      { name: 'All', slug: 'all' },
      ...unique.map((s) => ({
        name: s.charAt(0).toUpperCase() + s.slice(1),
        slug: s,
      })),
    ];
  }, [products, categories]);

  const filtered = useMemo(() => {
    const list =
      activeSlug === 'all'
        ? products
        : products.filter(
            (p) => p.category.toLowerCase() === activeSlug.toLowerCase(),
          );
    return limit ? list.slice(0, limit) : list;
  }, [products, activeSlug, limit]);

  return (
    <section className="section">
      <div className="container-site">
        {/* Section Header */}
        {showTitle && (
          <div className="text-center mb-10">
            <h2
              className="text-3xl md:text-4xl font-bold text-gradient mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Featured Collections
            </h2>
            <div className="divider max-w-xs mx-auto" />
          </div>
        )}

        {/* Filter Tabs */}
        {showFilters && allCategories.length > 2 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {allCategories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveSlug(cat.slug)}
                className={cn(
                  'px-5 py-2 text-sm uppercase tracking-wider rounded-full transition-all duration-300',
                  activeSlug === cat.slug
                    ? 'bg-[var(--color-primary)] text-[var(--color-text-dark)] font-semibold'
                    : 'text-[var(--color-text-muted)] border border-[var(--color-text)]/10 hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)]',
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="animate-fade-in"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[var(--color-text-muted)] text-lg">
              No products found in this category.
            </p>
          </div>
        )}

        {/* View All link */}
        {limit && products.length > limit && (
          <div className="text-center mt-12">
            <Link href="/collections" className="btn btn-outline">
              View All Collections
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
