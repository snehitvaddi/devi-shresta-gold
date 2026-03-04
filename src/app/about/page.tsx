import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Award, Heart, Gem, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { getOrgData, getCurrentOrgId } from "@/lib/data/org";
import ReviewCarousel from "@/components/ReviewCarousel";

export async function generateMetadata(): Promise<Metadata> {
  const orgData = await getOrgData(getCurrentOrgId());
  return {
    title: `About Us | ${orgData.name}`,
    description: `Learn about ${orgData.name} - ${orgData.tagline}`,
  };
}

const values = [
  {
    icon: Gem,
    title: "Exceptional Quality",
    description:
      "Every piece is crafted with the finest materials and meticulous attention to detail.",
  },
  {
    icon: Heart,
    title: "Passion for Craft",
    description:
      "Our artisans bring decades of experience and genuine love for jewelry making.",
  },
  {
    icon: Shield,
    title: "Trust & Integrity",
    description:
      "Certified diamonds, transparent pricing, and a lifetime guarantee on craftsmanship.",
  },
  {
    icon: Award,
    title: "Heritage of Excellence",
    description:
      "Three decades of creating timeless pieces that become cherished family heirlooms.",
  },
];

export default async function AboutPage() {
  const orgData = await getOrgData(getCurrentOrgId());

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1920"
            alt="Jewelry craftsmanship"
            fill
            className="object-cover opacity-20"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)] via-transparent to-[var(--color-bg)]" />
        </div>

        <div className="relative container-site text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="block w-8 h-px bg-[var(--color-primary)]" />
            <span className="block w-2 h-2 rotate-45 bg-[var(--color-primary)]" />
            <span className="block w-8 h-px bg-[var(--color-primary)]" />
          </div>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Our Story
          </h1>

          <p
            className="text-xl text-[var(--color-primary)] mb-4"
            style={{ fontFamily: "var(--font-accent)" }}
          >
            {orgData.tagline}
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="section">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-[var(--radius-lg)] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800"
                  alt="Our workshop"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div
                className={cn(
                  "absolute -bottom-4 -right-4 w-full h-full",
                  "border-2 border-[var(--color-primary)]/20 rounded-[var(--radius-lg)]",
                  "pointer-events-none hidden lg:block",
                )}
              />
            </div>

            <div>
              <h2
                className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-6"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {orgData.name}
              </h2>

              <p className="text-[var(--color-text-muted)] leading-relaxed mb-6">
                {orgData.description}
              </p>

              <p className="text-[var(--color-text-muted)] leading-relaxed mb-8">
                For over three decades, our master jewelers have dedicated their craft to
                creating pieces that celebrate life&apos;s most precious moments. From engagement
                rings that mark the beginning of a journey to custom designs that express
                individual style, every creation carries our commitment to excellence.
              </p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {orgData.features.map((feat) => (
                  <div key={feat} className="flex items-center gap-2">
                    <span className="block w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                    <span className="text-sm text-[var(--color-text-muted)]">{feat}</span>
                  </div>
                ))}
              </div>

              <Link href="/contact" className="btn btn-primary">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-[var(--color-bg-surface)]">
        <div className="container-site">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold text-gradient mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Our Values
            </h2>
            <div className="divider max-w-xs mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v) => (
              <div
                key={v.title}
                className="text-center p-6 rounded-[var(--radius-md)] bg-[var(--color-bg)] border border-[var(--color-text)]/5 hover:border-[var(--color-primary)]/20 transition-all"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                  <v.icon size={24} className="text-[var(--color-primary)]" />
                </div>
                <h3
                  className="text-lg font-semibold text-[var(--color-text)] mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {v.title}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <ReviewCarousel reviews={orgData.testimonials} />
    </div>
  );
}
