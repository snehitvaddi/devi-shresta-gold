import type { Metadata } from "next";
import ContactSection from "@/components/ContactSection";
import MapEmbed from "@/components/MapEmbed";
import { getOrgData, getCurrentOrgId } from "@/lib/data/org";

export async function generateMetadata(): Promise<Metadata> {
  const orgData = await getOrgData(getCurrentOrgId());
  return {
    title: "Contact Us",
    description: `Get in touch with ${orgData.name}. Visit our store, call us, or send us a message.`,
  };
}

export default async function ContactPage() {
  const orgData = await getOrgData(getCurrentOrgId());
  const coords = orgData.address.coordinates;

  return (
    <div className="pt-20">
      {/* Page Header */}
      <section className="section text-center">
        <div className="container-site">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="block w-8 h-px bg-[var(--color-primary)]" />
            <span className="block w-2 h-2 rotate-45 bg-[var(--color-primary)]" />
            <span className="block w-8 h-px bg-[var(--color-primary)]" />
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold text-gradient mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Contact Us
          </h1>
          <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
            We would love to hear from you. Reach out to discuss your perfect piece,
            schedule a consultation, or simply say hello.
          </p>
        </div>
      </section>

      <ContactSection orgData={orgData} />

      {coords && (
        <MapEmbed
          lat={coords.lat}
          lng={coords.lng}
          title="Visit Our Store"
        />
      )}
    </div>
  );
}
