import Link from 'next/link';
import { cn } from '@/lib/utils';

interface HeroProps {
  title: string;
  subtitle: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
}

export default function Hero({
  title,
  subtitle,
  ctaPrimary = { label: 'Explore Collection', href: '/collections' },
  ctaSecondary = { label: 'Book Consultation', href: '/booking' },
}: HeroProps) {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-[var(--color-bg)]">
      {/* Subtle background effects — no image, clean dark */}
      <div className="absolute inset-0">
        {/* Radial gold glow — very subtle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[var(--color-primary)]/[0.03] blur-[120px]" />
        {/* Bottom fade to page bg */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--color-bg)] to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-site text-center max-w-4xl mx-auto px-5">
        {/* Decorative line */}
        <div className="flex items-center justify-center gap-4 mb-8 animate-fade-in">
          <span className="block w-12 h-px bg-[var(--color-primary)]" />
          <span className="block w-2 h-2 rotate-45 border border-[var(--color-primary)]" />
          <span className="block w-12 h-px bg-[var(--color-primary)]" />
        </div>

        <h1
          className={cn(
            'text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6',
            'animate-slide-up',
          )}
          style={{ fontFamily: 'var(--font-heading)', animationDelay: '0.1s', animationFillMode: 'both' }}
        >
          <span className="text-gradient">{title}</span>
        </h1>

        <p
          className="text-lg sm:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto mb-10 animate-slide-up"
          style={{ fontFamily: 'var(--font-body)', animationDelay: '0.3s', animationFillMode: 'both' }}
        >
          {subtitle}
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
          style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
        >
          <Link href={ctaPrimary.href} className="btn btn-primary">
            {ctaPrimary.label}
          </Link>
          <Link href={ctaSecondary.href} className="btn btn-outline">
            {ctaSecondary.label}
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-[var(--color-primary)]/40 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-[var(--color-primary)] rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
