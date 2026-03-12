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
  return {
    title: {
      default: `${orgData.name} | ${orgData.tagline}`,
      template: `%s | ${orgData.name}`,
    },
    description: orgData.description,
    keywords: (orgData as unknown as Record<string, unknown>).seo
      ? ((orgData as unknown as Record<string, unknown>).seo as { keywords?: string[] }).keywords
      : undefined,
    openGraph: {
      title: orgData.name,
      description: orgData.description,
      type: "website",
      siteName: orgData.name,
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

  return (
    <html lang="en" data-domain={domain}>
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
