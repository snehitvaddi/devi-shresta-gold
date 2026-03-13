import type { Metadata } from 'next';
import Link from 'next/link';
import { Ruler, MessageCircle, CalendarCheck, Lightbulb } from 'lucide-react';
import RingSizeTool from '@/components/RingSizeTool';

export const metadata: Metadata = {
  title: 'Ring Size Guide',
  description: 'Find your perfect ring size at home. Interactive ring size chart with Indian, US, and UK sizes. Free professional sizing available at our Vijayawada store.',
  openGraph: {
    title: 'Ring Size Guide',
    description: 'Find your perfect ring size with our interactive guide. Indian, US & UK sizes.',
  },
};

const tips = [
  'Measure at the end of the day when fingers are slightly larger',
  'Measure multiple times for accuracy — try 3 times and take the average',
  'Wider bands (6mm+) need a slightly larger size than thin bands',
  'Avoid measuring when hands are cold — fingers shrink in cold weather',
  'Your dominant hand is usually slightly larger than the other',
];

export default function RingSizeGuidePage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)]/5 via-transparent to-[var(--color-bg)]" />
        <div className="relative container-site text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="block w-8 h-px bg-[var(--color-primary)]" />
            <span className="block w-2 h-2 rotate-45 bg-[var(--color-primary)]" />
            <span className="block w-8 h-px bg-[var(--color-primary)]" />
          </div>

          <div className="inline-flex items-center gap-2 mb-6">
            <Ruler size={28} className="text-[var(--color-primary)]" />
          </div>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Ring Size Guide
          </h1>

          <p
            className="text-lg md:text-xl text-[var(--color-primary)]/80 mb-4"
            style={{ fontFamily: 'var(--font-accent)' }}
          >
            Find your perfect fit from the comfort of home
          </p>

          <p className="text-[var(--color-text-muted)] leading-relaxed max-w-2xl mx-auto">
            Use our interactive tool to determine your ring size using simple methods.
            Choose between the string method or match an existing ring.
          </p>
        </div>
      </section>

      {/* Interactive Tool */}
      <section className="section">
        <div className="container-site">
          <RingSizeTool />
        </div>
      </section>

      {/* Tips */}
      <section className="section bg-[var(--color-bg-surface)]">
        <div className="container-site max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-4">
              <Lightbulb size={20} className="text-[var(--color-primary)]" />
              <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Pro Tips</span>
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold text-[var(--color-text)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Sizing Tips for Accuracy
            </h2>
          </div>

          <div className="space-y-4">
            {tips.map((tip, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-[var(--radius-md)] bg-[var(--color-bg)] border border-[var(--color-text)]/5"
              >
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center text-xs font-bold text-[var(--color-primary)]">
                  {i + 1}
                </span>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed pt-0.5">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container-site">
          <div className="max-w-2xl mx-auto text-center">
            <h2
              className="text-3xl md:text-4xl font-bold text-gradient mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Still Not Sure?
            </h2>
            <p className="text-[var(--color-text-muted)] mb-8">
              Visit our store for a free professional ring sizing — takes just 2 minutes.
              Or WhatsApp us and we will help you find the right size.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/booking" className="btn btn-primary">
                <CalendarCheck size={16} />
                Book Free Sizing
              </Link>
              <a
                href="https://wa.me/917337372922?text=Hi!%20I%20need%20help%20finding%20my%20ring%20size."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                <MessageCircle size={16} />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
