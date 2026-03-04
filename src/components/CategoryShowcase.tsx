import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

interface CategoryShowcaseProps {
  categories: Category[];
}

// Indian jewelry category images — verified traditional Indian gold jewelry
const categoryImages: Record<string, string> = {
  necklaces: 'https://images.unsplash.com/photo-1769500804057-ca1391bf4617?w=600&q=80',
  bangles: 'https://images.unsplash.com/photo-1617191880362-aac615de3c26?w=600&q=80',
  rings: 'https://images.unsplash.com/photo-1509119546138-bccc862c68de?w=600&q=80',
  earrings: 'https://images.unsplash.com/photo-1629381565693-75f7aab090b9?w=600&q=80',
  pendants: 'https://images.unsplash.com/photo-1585711715631-1e6bf224f092?w=600&q=80',
  bridal: 'https://images.unsplash.com/photo-1594140700405-f401ff47b29e?w=600&q=80',
  temple: 'https://images.unsplash.com/photo-1742891603547-950f510710d7?w=600&q=80',
  mens: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80',
  coins: 'https://images.unsplash.com/photo-1772461286710-ea453f875bb7?w=600&q=80',
};

export default function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  if (categories.length === 0) return null;

  return (
    <section className="py-10">
      <div className="container-site">
        <div className="text-center mb-8">
          <h2
            className="text-3xl md:text-4xl font-bold text-gradient mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Shop by Category
          </h2>
          <div className="divider max-w-xs mx-auto !mb-0" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/collections?category=${cat.slug}`}
              className={cn(
                'group relative aspect-[3/4] rounded-[var(--radius-md)] overflow-hidden',
                'border border-transparent hover:border-[var(--color-primary)]/40',
                'transition-all duration-500',
              )}
            >
              {/* Image */}
              <Image
                src={cat.image || categoryImages[cat.slug] || categoryImages.rings}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3
                  className="text-lg font-bold text-[var(--color-text)] mb-1 group-hover:text-[var(--color-primary)] transition-colors"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {cat.name}
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] line-clamp-1">
                  {cat.description}
                </p>
              </div>

              {/* Gold border glow on hover */}
              <div
                className={cn(
                  'absolute inset-0 rounded-[var(--radius-md)]',
                  'opacity-0 group-hover:opacity-100 transition-opacity duration-500',
                  'shadow-[inset_0_0_0_2px_var(--color-primary)]',
                )}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
