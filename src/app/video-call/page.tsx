import type { Metadata } from 'next';
import Link from 'next/link';
import { Video, Phone, Eye, CalendarCheck, MessageCircle, MapPin, Sparkles, Clock, Users, ShieldCheck } from 'lucide-react';
import VideoCallForm from '@/components/VideoCallForm';

export const metadata: Metadata = {
  title: 'Video Call Shopping',
  description: 'Shop jewelry from home with a live video call. Our experts show you pieces in real lighting, answer questions, and help you choose — all from the comfort of your couch.',
  openGraph: {
    title: 'Video Call Shopping',
    description: 'Book a live video call with our jewelry experts. See pieces up close from anywhere.',
  },
};

const steps = [
  { icon: CalendarCheck, title: 'Book a Slot', description: 'Pick a date and time that works for you. Takes 30 seconds.' },
  { icon: Phone, title: 'Get a Call', description: 'Our expert calls you on WhatsApp Video or Google Meet at your chosen time.' },
  { icon: Eye, title: 'See & Decide', description: 'We show you jewelry live under different lighting. Ask anything. No pressure.' },
];

const benefits = [
  { icon: Sparkles, title: 'Real Lighting', description: 'See jewelry in real store lighting — not just studio photos.' },
  { icon: Clock, title: 'Your Schedule', description: 'Browse at your pace. No rush, no crowds, no travel.' },
  { icon: Users, title: 'Expert Guidance', description: 'Our trained staff helps you pick the perfect piece for any occasion.' },
  { icon: MapPin, title: 'Outstation Friendly', description: 'Perfect if you are outside Vijayawada but love our designs.' },
  { icon: ShieldCheck, title: 'No Obligation', description: 'Browse freely. Buy only if you are convinced. Zero pressure.' },
];

export default function VideoCallPage() {
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
            <Video size={28} className="text-[var(--color-primary)]" />
          </div>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Shop Jewelry From Your Couch
          </h1>

          <p
            className="text-lg md:text-xl text-[var(--color-primary)]/80 mb-4"
            style={{ fontFamily: 'var(--font-accent)' }}
          >
            Live video call with our jewelry experts
          </p>

          <p className="text-[var(--color-text-muted)] leading-relaxed max-w-2xl mx-auto">
            See pieces up close, ask questions in real-time, and make confident choices — all
            from the comfort of your home. No other local jeweler in Vijayawada offers this.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="section bg-[var(--color-bg-surface)]">
        <div className="container-site">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">How It Works</span>
            <h2
              className="text-3xl md:text-4xl font-bold text-[var(--color-text)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              3 Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="relative mx-auto mb-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[var(--color-primary)]/10 border-2 border-[var(--color-primary)]/30 flex items-center justify-center">
                    <step.icon size={28} className="text-[var(--color-primary)]" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[var(--color-primary)] text-[var(--color-text-dark)] text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3
                  className="text-lg font-semibold text-[var(--color-text)] mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)]">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="section">
        <div className="container-site">
          <div className="text-center mb-10">
            <h2
              className="text-3xl md:text-4xl font-bold text-gradient"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Book Your Video Call
            </h2>
          </div>
          <div className="max-w-2xl mx-auto">
            <VideoCallForm />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section bg-[var(--color-bg-surface)]">
        <div className="container-site">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold text-[var(--color-text)]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Why Video Call Shopping?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="flex gap-4 p-5 rounded-[var(--radius-md)] bg-[var(--color-bg)] border border-[var(--color-text)]/5 hover:border-[var(--color-primary)]/20 transition-all"
              >
                <div className="w-10 h-10 flex-shrink-0 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                  <b.icon size={20} className="text-[var(--color-primary)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-text)] mb-1">{b.title}</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container-site text-center">
          <h2
            className="text-2xl md:text-3xl font-bold text-gradient mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Prefer an In-Store Visit?
          </h2>
          <p className="text-[var(--color-text-muted)] mb-8 max-w-md mx-auto">
            We are open 7 days a week at Governorpet, Vijayawada. Walk in anytime!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/booking" className="btn btn-primary">
              <CalendarCheck size={16} />
              Book In-Store Visit
            </Link>
            <a
              href="https://wa.me/917337372922?text=Hi!%20I%20have%20a%20quick%20question%20about%20your%20jewelry."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              <MessageCircle size={16} />
              Quick Question? WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
