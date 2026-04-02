import type { Metadata } from "next";
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
// GoldPriceTicker is now embedded in the Header component
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getOrgData, getCurrentOrgId, getCurrentDomain } from "@/lib/data/org";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const orgData = await getOrgData(getCurrentOrgId());
  const siteUrl = "https://devi-shresta-gold.vercel.app";
  return {
    title: {
      default: `${orgData.name} | ${orgData.tagline}`,
      template: `%s | ${orgData.name}`,
    },
    description: orgData.description,
    keywords: (orgData as unknown as Record<string, unknown>).seo
      ? ((orgData as unknown as Record<string, unknown>).seo as { keywords?: string[] }).keywords
      : [
          "gold jewelry Vijayawada",
          "diamond jewelry Vijayawada",
          "temple jewelry",
          "bridal jewelry",
          "22K gold necklace",
          "Devi Shresta Gold",
          "gold store Governorpet",
          "South Indian jewelry",
        ],
    metadataBase: new URL(siteUrl),
    icons: {
      icon: [
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
    openGraph: {
      title: `${orgData.name} — Premium Gold & Diamond Jewelry in Vijayawada`,
      description: orgData.description,
      type: "website",
      siteName: orgData.name,
      url: siteUrl,
      locale: "en_IN",
      images: [
        {
          url: `${siteUrl}/images/og-image.jpg`,
          width: 1920,
          height: 1080,
          alt: `${orgData.name} — Gold & Diamond Jewelry Store, Vijayawada`,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${orgData.name} — Premium Gold & Diamond Jewelry`,
      description: orgData.description,
      images: [`${siteUrl}/images/og-image.jpg`],
    },
    other: {
      "google-site-verification": "REPLACE_WITH_YOUR_VERIFICATION_CODE",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgId = getCurrentOrgId();
  const domain = getCurrentDomain();
  const orgData = await getOrgData(orgId);
  const whatsappNumber = orgData.socialLinks.whatsapp;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: orgData.name,
    description: orgData.description,
    url: "https://devi-shresta-gold.vercel.app",
    telephone: "+91-7337372922",
    image: "https://devi-shresta-gold.vercel.app/images/og-image.jpg",
    logo: "https://devi-shresta-gold.vercel.app/images/icon-512.png",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Governorpet",
      addressLocality: "Vijayawada",
      addressRegion: "AP",
      postalCode: "520002",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 16.5062,
      longitude: 80.6480,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.6",
      reviewCount: "185",
      bestRating: "5",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "10:00",
      closes: "21:00",
    },
    priceRange: "₹₹₹",
    sameAs: [
      "https://www.instagram.com/devishrestagoldanddiamonds/",
    ],
  };

  return (
    <html lang="en" data-domain={domain}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} ${cormorant.variable} antialiased`}
        data-org={orgId}
      >
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded">Skip to content</a>
        <Header
          businessName={orgData.name}
          whatsappNumber={whatsappNumber}
          domain={domain}
        />

        <main id="main-content" className="min-h-screen">{children}</main>

        <Footer orgData={orgData} />

        {whatsappNumber && (
          <WhatsAppButton phoneNumber={whatsappNumber} businessName={orgData.name} />
        )}
      </body>
    </html>
  );
}
