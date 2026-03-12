import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightLeft,
  Scale,
  ShieldCheck,
  Banknote,
  ChevronRight,
  Gem,
  BadgeCheck,
  Clock,
  FileText,
  HelpCircle,
  MessageCircle,
  MapPin,
  CalendarCheck,
  FlaskConical,
  HandCoins,
  Sparkles,
  Receipt,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Gold Exchange & Buyback Policy",
  description:
    "Exchange your old gold jewelry for stunning new designs at Devi Shresta Gold & Diamonds, Vijayawada. 100% value on own gold, fair rates for other jeweler gold, transparent purity testing.",
  keywords: [
    "gold exchange",
    "gold buyback",
    "old gold exchange Vijayawada",
    "sell gold Vijayawada",
    "gold exchange policy",
    "Devi Shresta exchange",
  ],
  openGraph: {
    title: "Gold Exchange & Buyback Policy",
    description:
      "Get the best value for your old gold. Transparent testing, best market rates, and zero making charges on exchange.",
  },
};

const exchangeSteps = [
  {
    icon: Gem,
    title: "Bring Your Jewelry",
    description:
      "Walk into our store with your old gold jewelry. No prior appointment needed for exchange.",
  },
  {
    icon: FlaskConical,
    title: "Purity Testing",
    description:
      "Our certified experts test your gold purity using advanced XRF technology right in front of you.",
  },
  {
    icon: Receipt,
    title: "Get Valuation",
    description:
      "Receive a transparent valuation based on current market gold rate and verified purity.",
  },
  {
    icon: Sparkles,
    title: "Choose New Design",
    description:
      "Browse our stunning collection of 22K and 18K designs. Pick what speaks to you.",
  },
  {
    icon: HandCoins,
    title: "Pay the Difference",
    description:
      "Simply pay the difference between your old gold value and the new piece. Zero making charges on exchange.",
  },
];

const whyExchangeReasons = [
  {
    icon: Scale,
    title: "Transparent Testing",
    description:
      "Gold purity tested in front of you using state-of-the-art XRF machines. No guesswork, only science.",
  },
  {
    icon: Banknote,
    title: "Best Market Rates",
    description:
      "We offer rates benchmarked to live gold prices. You always get the best value for your gold.",
  },
  {
    icon: ArrowRightLeft,
    title: "Zero Making Charges",
    description:
      "Exchange old gold for new designs with zero making charges on a wide range of our collection.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Since Decades",
    description:
      "Vijayawada's trusted name in gold jewelry. 4.6-star Google rating with 185+ happy customers.",
  },
];

const faqs = [
  {
    question: "What documents do I need for gold exchange?",
    answer:
      "You'll need a valid government-issued photo ID (Aadhaar, PAN, or Passport) and the original purchase bill if available. If the bill is not available, we can still process the exchange based on purity testing.",
  },
  {
    question: "Can I exchange diamond jewelry?",
    answer:
      "Yes, we accept diamond jewelry for exchange. Diamonds are valued separately based on the 4Cs (Cut, Clarity, Color, Carat) by our certified gemologist, and gold content is valued at prevailing market rates.",
  },
  {
    question: "Is there a minimum weight for exchange?",
    answer:
      "There is no minimum weight requirement. We accept gold jewelry of any weight for exchange or buyback. However, for buyback (cash payment), a minimum of 2 grams is recommended for practical purposes.",
  },
  {
    question: "Can I exchange gold purchased from another store?",
    answer:
      "Absolutely. We accept gold from any jeweler across India. The gold will be tested for purity and valued at fair market rates. Own-store gold gets 100% value; other jeweler gold is valued based on actual purity testing.",
  },
  {
    question: "How long does the exchange process take?",
    answer:
      "The entire process — from testing to valuation to selecting new jewelry — typically takes 30-45 minutes. For buyback with immediate payment, it takes about 20 minutes.",
  },
  {
    question: "Do you charge any deduction on exchange?",
    answer:
      "For gold purchased from Devi Shresta, we offer 100% exchange value with zero deductions. For gold from other jewelers, a nominal testing charge may apply, but we guarantee the most competitive rates in Vijayawada.",
  },
];

export default function ExchangePolicyPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)]/5 via-transparent to-[var(--color-bg)]" />

        <div className="relative container-site text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="block w-8 h-px bg-[var(--color-primary)]" />
            <span className="block w-2 h-2 rotate-45 bg-[var(--color-primary)]" />
            <span className="block w-8 h-px bg-[var(--color-primary)]" />
          </div>

          <div className="inline-flex items-center gap-2 mb-6">
            <ArrowRightLeft size={28} className="text-[var(--color-primary)]" />
          </div>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Gold Exchange & Buyback Policy
          </h1>

          <p
            className="text-lg md:text-xl text-[var(--color-primary)]/80 mb-4"
            style={{ fontFamily: "var(--font-accent)" }}
          >
            Your old gold, reimagined into new beginnings
          </p>

          <p className="text-[var(--color-text-muted)] leading-relaxed max-w-2xl mx-auto">
            At Devi Shresta Gold & Diamonds, we believe your gold should always
            work for you. Exchange your old jewelry for stunning new designs, or
            get instant cash at the best market rates.
          </p>
        </div>
      </section>

      {/* Exchange Policy */}
      <section className="section bg-[var(--color-bg-surface)]">
        <div className="container-site">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="badge mb-4">Exchange</span>
              <h2
                className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Exchange Policy
              </h2>
              <div className="divider max-w-xs mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Own Gold */}
              <div className="p-6 rounded-[var(--radius-md)] bg-[var(--color-bg)] border border-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/40 transition-all">
                <div className="w-12 h-12 mb-4 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                  <BadgeCheck size={24} className="text-[var(--color-primary)]" />
                </div>
                <h3
                  className="text-xl font-semibold text-[var(--color-text)] mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Devi Shresta Gold
                </h3>
                <p className="text-3xl font-bold text-[var(--color-primary)] mb-2">
                  100% Value
                </p>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  Gold jewelry purchased from Devi Shresta gets full 100%
                  exchange value based on current gold rate. No deductions,
                  no hidden charges. Just bring your original bill.
                </p>
              </div>

              {/* Other Gold */}
              <div className="p-6 rounded-[var(--radius-md)] bg-[var(--color-bg)] border border-[var(--color-text)]/5 hover:border-[var(--color-primary)]/20 transition-all">
                <div className="w-12 h-12 mb-4 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                  <Scale size={24} className="text-[var(--color-primary)]" />
                </div>
                <h3
                  className="text-xl font-semibold text-[var(--color-text)] mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Other Jeweler Gold
                </h3>
                <p className="text-3xl font-bold text-[var(--color-primary)] mb-2">
                  Fair Value
                </p>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  Gold from any other jeweler is welcome. We test purity
                  in front of you and offer fair market value based on
                  actual gold content. Transparent and honest, always.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="section">
        <div className="container-site">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="badge mb-4">How It Works</span>
              <h2
                className="text-3xl md:text-4xl font-bold text-gradient mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Exchange in 5 Simple Steps
              </h2>
              <div className="divider max-w-xs mx-auto" />
            </div>

            <div className="relative">
              {/* Vertical line for desktop */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--color-primary)]/40 via-[var(--color-primary)]/20 to-transparent -translate-x-1/2" />

              <div className="space-y-8 md:space-y-12">
                {exchangeSteps.map((step, index) => (
                  <div
                    key={step.title}
                    className={`flex flex-col md:flex-row items-center gap-4 md:gap-8 ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Content */}
                    <div
                      className={`flex-1 ${
                        index % 2 === 0 ? "md:text-right" : "md:text-left"
                      }`}
                    >
                      <div
                        className={`p-5 rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] border border-[var(--color-text)]/5 hover:border-[var(--color-primary)]/20 transition-all ${
                          index % 2 === 0 ? "md:ml-auto" : "md:mr-auto"
                        } max-w-sm`}
                      >
                        <h3
                          className="text-lg font-semibold text-[var(--color-text)] mb-1"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {step.title}
                        </h3>
                        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Icon Node */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-14 h-14 rounded-full bg-[var(--color-bg)] border-2 border-[var(--color-primary)] flex items-center justify-center shadow-[var(--shadow-gold)]">
                        <step.icon size={22} className="text-[var(--color-primary)]" />
                      </div>
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--color-primary)] text-[var(--color-text-dark)] text-[10px] font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="flex-1 hidden md:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Buyback Policy */}
      <section className="section bg-[var(--color-bg-surface)]">
        <div className="container-site">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="badge mb-4">Buyback</span>
              <h2
                className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Buyback Policy
              </h2>
              <div className="divider max-w-xs mx-auto" />
              <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto mt-4">
                Need cash instead of new jewelry? We buy back gold at
                competitive market rates with same-day payment.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-[var(--radius-md)] bg-[var(--color-bg)] border border-[var(--color-text)]/5">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                  <Banknote size={24} className="text-[var(--color-primary)]" />
                </div>
                <h3
                  className="text-lg font-semibold text-[var(--color-text)] mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Market Rates
                </h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Buyback price benchmarked to live gold market rates. No lowball offers.
                </p>
              </div>

              <div className="text-center p-6 rounded-[var(--radius-md)] bg-[var(--color-bg)] border border-[var(--color-text)]/5">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                  <Clock size={24} className="text-[var(--color-primary)]" />
                </div>
                <h3
                  className="text-lg font-semibold text-[var(--color-text)] mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Same-Day Payment
                </h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Get paid the same day via bank transfer, UPI, or cheque. No waiting period.
                </p>
              </div>

              <div className="text-center p-6 rounded-[var(--radius-md)] bg-[var(--color-bg)] border border-[var(--color-text)]/5">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                  <FileText size={24} className="text-[var(--color-primary)]" />
                </div>
                <h3
                  className="text-lg font-semibold text-[var(--color-text)] mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Proper Documentation
                </h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Complete invoice and tax-compliant documentation provided for every buyback transaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Exchange With Us */}
      <section className="section">
        <div className="container-site">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl font-bold text-gradient mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Why Exchange With Us
              </h2>
              <div className="divider max-w-xs mx-auto" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {whyExchangeReasons.map((reason) => (
                <div
                  key={reason.title}
                  className="flex gap-4 p-5 rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] border border-[var(--color-text)]/5 hover:border-[var(--color-primary)]/20 transition-all"
                >
                  <div className="w-12 h-12 flex-shrink-0 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                    <reason.icon size={22} className="text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-semibold text-[var(--color-text)] mb-1"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {reason.title}
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-[var(--color-bg-surface)]">
        <div className="container-site">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4">
                <HelpCircle size={20} className="text-[var(--color-primary)]" />
                <span className="badge">FAQ</span>
              </div>
              <h2
                className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Frequently Asked Questions
              </h2>
              <div className="divider max-w-xs mx-auto" />
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-[var(--radius-md)] bg-[var(--color-bg)] border border-[var(--color-text)]/5 overflow-hidden"
                >
                  <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-[var(--color-text)] font-medium hover:text-[var(--color-primary)] transition-colors list-none">
                    <span className="pr-4">{faq.question}</span>
                    <ChevronRight
                      size={18}
                      className="text-[var(--color-primary)] flex-shrink-0 transition-transform duration-300 group-open:rotate-90"
                    />
                  </summary>
                  <div className="px-5 pb-4">
                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container-site">
          <div className="max-w-3xl mx-auto text-center">
            <h2
              className="text-3xl md:text-4xl font-bold text-gradient mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Ready to Exchange?
            </h2>
            <p className="text-[var(--color-text-muted)] mb-8 max-w-xl mx-auto">
              Visit our store in Governorpet, Vijayawada, or reach out to us on
              WhatsApp to know the current gold rates and exchange value.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="btn btn-primary gap-2"
              >
                <MapPin size={16} />
                Visit Store
              </Link>

              <a
                href="https://wa.me/917337372922?text=Hi!%20I%27d%20like%20to%20know%20about%20your%20gold%20exchange%20policy."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline gap-2"
              >
                <MessageCircle size={16} />
                WhatsApp Us
              </a>

              <Link
                href="/booking"
                className="btn btn-ghost gap-2 text-[var(--color-primary)]"
              >
                <CalendarCheck size={16} />
                Book Appointment
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
