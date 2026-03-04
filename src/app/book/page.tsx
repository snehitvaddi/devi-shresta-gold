import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Star, Phone } from "lucide-react";
import BookingForm from "@/components/BookingForm";
import { getOrgData, getCurrentOrgId } from "@/lib/data/org";

export async function generateMetadata(): Promise<Metadata> {
  const orgData = await getOrgData(getCurrentOrgId());
  return {
    title: "Book an Appointment",
    description: `Schedule a private consultation with the jewelry experts at ${orgData.name}. Personalized service for bridal, custom designs, and more.`,
    openGraph: {
      title: `Book Appointment | ${orgData.name}`,
      description: `Schedule your private jewelry consultation at ${orgData.name}.`,
    },
  };
}

export default async function BookPage() {
  const orgData = await getOrgData(getCurrentOrgId());
  const openHours = orgData.businessHours.filter((h) => !h.closed);

  return (
    <div className="pt-24">
      {/* Page Header */}
      <section className="section pb-0 text-center">
        <div className="container-site max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="block w-12 h-px bg-[var(--color-primary)]" />
            <span className="block w-2 h-2 rotate-45 border border-[var(--color-primary)]" />
            <span className="block w-12 h-px bg-[var(--color-primary)]" />
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold text-gradient mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Book an Appointment
          </h1>
          <p className="text-[var(--color-text-muted)] text-lg mb-8">
            Schedule a private consultation with our jewelry experts for a
            personalized experience tailored to your needs.
          </p>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section pt-8 pb-4">
        <div className="container-site max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              {
                title: "Consultation",
                desc: "Expert guidance on choosing the perfect piece",
              },
              {
                title: "Custom Design",
                desc: "Bring your dream jewelry to life with our artisans",
              },
              {
                title: "Valuation",
                desc: "Professional assessment and certification services",
              },
            ].map((service) => (
              <div
                key={service.title}
                className="p-5 bg-[var(--color-bg-surface)] rounded-[var(--radius-md)] border border-[var(--color-text)]/5 text-center"
              >
                <h3
                  className="text-base font-semibold text-[var(--color-text)] mb-1"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {service.title}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <BookingForm />

      {/* Business Hours & Social Proof */}
      <section className="section">
        <div className="container-site max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Hours */}
            <div className="p-6 bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)] border border-[var(--color-text)]/5">
              <div className="flex items-center gap-3 mb-4">
                <Clock size={20} className="text-[var(--color-primary)]" />
                <h3
                  className="text-lg font-semibold text-[var(--color-text)]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Business Hours
                </h3>
              </div>
              <div className="space-y-2">
                {orgData.businessHours.map((h) => (
                  <div
                    key={h.day}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-[var(--color-text-muted)]">
                      {h.day}
                    </span>
                    <span
                      className={
                        h.closed
                          ? "text-[var(--color-error)]"
                          : "text-[var(--color-text)]"
                      }
                    >
                      {h.closed ? "Closed" : `${h.open} - ${h.close}`}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-[var(--color-text)]/5">
                <a
                  href={`tel:${orgData.phone}`}
                  className="flex items-center gap-2 text-sm text-[var(--color-primary)] hover:underline"
                >
                  <Phone size={14} />
                  {orgData.phone}
                </a>
              </div>
            </div>

            {/* Testimonial */}
            {orgData.testimonials.length > 0 && (
              <div className="p-6 bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)] border border-[var(--color-text)]/5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < orgData.testimonials[0].rating
                            ? "text-[var(--color-primary)] fill-[var(--color-primary)]"
                            : "text-[var(--color-bg-surface-light)]"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-4">
                    &ldquo;{orgData.testimonials[0].body}&rdquo;
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    {orgData.testimonials[0].customerName}
                  </p>
                  {orgData.testimonials[0].verified && (
                    <p className="text-xs text-[var(--color-primary)]">
                      Verified Customer
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
