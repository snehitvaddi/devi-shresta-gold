import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Calculator,
  MessageCircle,
  FileText,
  UserCheck,
  CreditCard,
  HelpCircle,
  MapPin,
  Phone,
} from 'lucide-react';
import EMICalculator from '@/components/EMICalculator';

/* ── Metadata ── */

export const metadata: Metadata = {
  title: 'EMI Calculator | Devi Shresta Gold & Diamonds',
  description:
    'Plan your jewelry purchase with easy EMI options. Calculate monthly installments for gold, diamond, and silver jewelry at Devi Shresta Gold & Diamonds, Vijayawada.',
};

/* ── FAQ Data ── */

const faqs = [
  {
    q: 'Is there a processing fee for EMI?',
    a: 'Processing fees vary by partner bank. Most options have zero or minimal processing fees. Visit our store or WhatsApp us for the latest offers.',
  },
  {
    q: 'What documents are needed to apply?',
    a: 'You will need a valid government ID (Aadhaar / PAN), proof of income (salary slips or bank statements), and one passport-sized photograph.',
  },
  {
    q: 'Who is eligible for jewelry EMI?',
    a: 'Salaried individuals and self-employed persons aged 21-60 with a regular source of income are eligible. Minimum purchase value for EMI is ₹10,000.',
  },
  {
    q: 'Which banks and cards are supported?',
    a: 'We partner with HDFC, ICICI, SBI, Axis, Kotak, and Bajaj Finserv for EMI options. Both credit card and no-cost EMI options are available on select items.',
  },
  {
    q: 'Can I prepay or foreclose my EMI?',
    a: 'Yes, prepayment is allowed after 3 months. Foreclosure charges depend on the financing partner. Contact us for specific terms.',
  },
  {
    q: 'Is 0% EMI really zero interest?',
    a: 'Yes, on select jewelry items we offer genuine 0% interest EMI through our banking partners. The total amount you pay equals the product price with no hidden charges.',
  },
];

/* ── Page ── */

export default function EMICalculatorPage() {
  return (
    <main>
      {/* ── Hero ── */}
      <section
        className="section relative overflow-hidden"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 70%)',
        }}
      >
        <div className="container-site text-center max-w-3xl mx-auto">
          <div className="badge mb-6 mx-auto inline-flex items-center gap-1.5">
            <Calculator size={14} />
            EMI Calculator
          </div>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Make Your Dream Jewelry{' '}
            <span className="text-gradient">Affordable</span>
          </h1>

          <p
            className="text-base md:text-lg max-w-xl mx-auto mb-10"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Break your purchase into easy monthly installments. No hidden
            charges, flexible tenure, and instant approval at our Vijayawada
            store.
          </p>

          {/* Quick highlights */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { icon: CreditCard, label: '0% EMI Available' },
              { icon: FileText, label: 'Minimal Documentation' },
              { icon: UserCheck, label: 'Instant Approval' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="glass flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
              >
                <Icon size={16} style={{ color: 'var(--color-primary)' }} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Calculator ── */}
      <section className="container-site" style={{ marginTop: '-2rem' }}>
        <div className="max-w-xl mx-auto">
          <EMICalculator
            defaultPrice={50000}
            whatsappNumber="917337372922"
          />
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section">
        <div className="container-site max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="badge mb-4 mx-auto inline-flex items-center gap-1.5">
              <HelpCircle size={14} />
              FAQs
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map(({ q, a }, i) => (
              <details
                key={i}
                className="group card"
                style={{
                  border: '1px solid var(--color-bg-surface-light)',
                }}
              >
                <summary
                  className="flex items-center justify-between cursor-pointer px-6 py-4 text-base font-medium list-none"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {q}
                  <span
                    className="ml-4 shrink-0 transition-transform group-open:rotate-180"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 8 10 12 14 8" />
                    </svg>
                  </span>
                </summary>
                <div
                  className="px-6 pb-4 text-sm leading-relaxed"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section">
        <div className="container-site">
          <div
            className="glass rounded-2xl p-8 md:p-12 text-center max-w-2xl mx-auto"
            style={{ border: '1px solid rgba(212,175,55,0.15)' }}
          >
            <h2
              className="text-2xl md:text-3xl font-bold mb-3"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Ready to Get Started?
            </h2>
            <p
              className="text-sm md:text-base mb-8 max-w-md mx-auto"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Visit our Vijayawada store or chat with us on WhatsApp to apply
              for EMI on your favorite jewelry.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <a
                href="https://wa.me/917337372922?text=Hi%2C%20I%27m%20interested%20in%20EMI%20options%20for%20jewelry.%20Could%20you%20share%20more%20details%3F"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <MessageCircle size={18} />
                WhatsApp to Apply
              </a>
              <Link href="/contact" className="btn btn-outline">
                <MapPin size={18} />
                Visit Store
              </Link>
            </div>

            <p
              className="text-xs mt-6 flex items-center justify-center gap-1.5"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <Phone size={12} />
              +91-7337372922 | Governorpet, Vijayawada
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
