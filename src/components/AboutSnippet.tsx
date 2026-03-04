import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface AboutSnippetProps {
  businessName: string;
  description: string;
  tagline: string;
  features?: string[];
}

export default function AboutSnippet({
  businessName,
  description,
  tagline,
  features = [],
}: AboutSnippetProps) {
  return (
    <section className="section overflow-hidden">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-[var(--radius-lg)] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800"
                alt="Jewelry craftsmanship"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Decorative gold border frame (offset) */}
            <div
              className={cn(
                'absolute -bottom-4 -right-4 w-full h-full',
                'border-2 border-[var(--color-primary)]/20 rounded-[var(--radius-lg)]',
                'pointer-events-none',
                'hidden lg:block',
              )}
            />

            {/* Experience badge */}
            <div
              className={cn(
                'absolute -bottom-6 -left-6 lg:bottom-8 lg:-left-6',
                'bg-[var(--color-primary)] text-[var(--color-text-dark)]',
                'w-28 h-28 rounded-full',
                'flex flex-col items-center justify-center',
                'shadow-lg',
              )}
            >
              <span className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                35+
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider">
                Years
              </span>
            </div>
          </div>

          {/* Text Side */}
          <div>
            {/* Decorative diamond */}
            <div className="flex items-center gap-3 mb-6">
              <span className="block w-8 h-px bg-[var(--color-primary)]" />
              <span className="block w-2 h-2 rotate-45 bg-[var(--color-primary)]" />
              <span className="text-sm uppercase tracking-widest text-[var(--color-primary)]">
                Our Story
              </span>
            </div>

            <h2
              className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {businessName}
            </h2>

            <p
              className="text-lg text-[var(--color-primary)] mb-6"
              style={{ fontFamily: 'var(--font-accent)' }}
            >
              {tagline}
            </p>

            <p className="text-[var(--color-text-muted)] leading-relaxed mb-8">
              {description}
            </p>

            {/* Features */}
            {features.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-8">
                {features.slice(0, 4).map((feat) => (
                  <div key={feat} className="flex items-center gap-2">
                    <span className="block w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                    <span className="text-sm text-[var(--color-text-muted)]">{feat}</span>
                  </div>
                ))}
              </div>
            )}

            <Link href="/about" className="btn btn-outline">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
