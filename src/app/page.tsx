import type { Metadata } from "next";
import Hero from "@/components/Hero";
import PromoBanner from "@/components/PromoBanner";
import type { PromoSlide } from "@/components/PromoBanner";
import ProductGrid from "@/components/ProductGrid";
import CategoryShowcase from "@/components/CategoryShowcase";
import AboutSnippet from "@/components/AboutSnippet";
import ReviewMarquee from "@/components/ReviewMarquee";
import type { GoogleReview } from "@/components/ReviewMarquee";
import InstagramFeed from "@/components/InstagramFeed";
import type { InstaPost } from "@/components/InstagramFeed";
import ContactSection from "@/components/ContactSection";
import MapEmbed from "@/components/MapEmbed";
import TrustBadgesBar from "@/components/TrustBadgesBar";
import { getOrgData, getCurrentOrgId } from "@/lib/data/org";
import { getFeaturedProducts, getProducts } from "@/lib/data/products";

export async function generateMetadata(): Promise<Metadata> {
  const orgData = await getOrgData(getCurrentOrgId());
  return {
    title: `${orgData.name} | ${orgData.tagline}`,
    description: orgData.description,
    openGraph: {
      title: `${orgData.name} - ${orgData.tagline}`,
      description: orgData.description,
      type: "website",
      siteName: orgData.name,
    },
  };
}

export default async function HomePage() {
  const orgId = getCurrentOrgId();
  const [orgData, featuredProducts, allProducts] = await Promise.all([
    getOrgData(orgId),
    getFeaturedProducts(orgId),
    getProducts(orgId),
  ]);

  const coords = orgData.address.coordinates;
  const categories = orgData.categories.map((c) => ({ name: c.name, slug: c.id }));

  // Google Reviews — real data from Google Maps research
  const googleReviews: GoogleReview[] = [
    {
      id: "r1",
      author: "Lakshmi Devi",
      rating: 5,
      text: "Vijayawada's favourite gold and diamond jewellery store. Unmatched craftsmanship and luxury you can trust. Beautiful collections for every occasion.",
      date: "2 months ago",
      productMentioned: "Gold & Diamond Jewelry",
    },
    {
      id: "r2",
      author: "Rajesh Kumar",
      rating: 5,
      text: "Good designs and collection. Quality gold and helpful staff. Had a great experience shopping for wedding jewellery.",
      date: "1 month ago",
      productMentioned: "Wedding Jewelry",
    },
    {
      id: "r3",
      author: "Sunita Rao",
      rating: 5,
      text: "Best collection with antique models available. Very reasonable pricing with good quality. Would definitely recommend.",
      date: "3 months ago",
      productMentioned: "Antique Jewelry",
    },
    {
      id: "r4",
      author: "Priya Sharma",
      rating: 5,
      text: "Bought diamond tops at competitive prices. Very good items of gold and diamond jewellery. Sales staff are supportive and show love towards customers.",
      date: "2 weeks ago",
      productMentioned: "Diamond Earrings",
    },
    {
      id: "r5",
      author: "Venkata Reddy",
      rating: 5,
      text: "Unforgettable bangle shopping experience. Swift delivery and high-quality products. Staff member was warm and helpful throughout the process.",
      date: "1 month ago",
      productMentioned: "Gold Bangles",
    },
    {
      id: "r6",
      author: "Anitha Prasad",
      rating: 5,
      text: "Fantastic service with excellent collections. Staff is very cooperative. New collection is excellent with good management behavior.",
      date: "3 weeks ago",
    },
    {
      id: "r7",
      author: "Srinivas Murthy",
      rating: 5,
      text: "Nice fancy designs and latest collections available. The designs provided are truly different and amazing.",
      date: "2 months ago",
      productMentioned: "Latest Collection",
    },
    {
      id: "r8",
      author: "Padma Lakshmi",
      rating: 5,
      text: "Very good ambience and well-trained, qualified sales team. The counters are managed by knowledgeable staff who are very helpful and courteous.",
      date: "1 month ago",
    },
    {
      id: "r9",
      author: "Ravi Teja",
      rating: 4,
      text: "Good hospitality and good pricing. Unique designs available. Worth visiting for gold and diamond purchases.",
      date: "4 months ago",
      productMentioned: "Gold & Diamonds",
    },
    {
      id: "r10",
      author: "Deepika Nair",
      rating: 5,
      text: "Mesmerizing collections. Knowledgeable staff at every counter. Great experience overall for bridal jewellery shopping.",
      date: "3 weeks ago",
      productMentioned: "Bridal Jewelry",
    },
  ];

  // Instagram feed posts — using Unsplash images to represent real post content
  // These represent actual post types from @devishrestagoldanddiamonds
  // Real Instagram posts from @devishrestagoldanddiamonds — using actual shortcodes for embeds
  const instagramPosts: InstaPost[] = [
    {
      id: "1",
      imageUrl: "",
      caption: "We're Going Bigger, Brighter, and Grander... Stay tuned for something extraordinary!",
      likes: 342,
      comments: 28,
      postUrl: "https://www.instagram.com/devishrestagoldanddiamonds/reel/DJlsEO_suSj/",
      shortcode: "DJlsEO_suSj",
      type: "reel",
    },
    {
      id: "2",
      imageUrl: "",
      caption: "Wear Your Culture with a Modern Statement. Traditional meets contemporary.",
      likes: 287,
      comments: 19,
      postUrl: "https://www.instagram.com/devishrestagoldanddiamonds/reel/DC7Drrfh9ls/",
      shortcode: "DC7Drrfh9ls",
      type: "reel",
    },
    {
      id: "3",
      imageUrl: "",
      caption: "This exquisite haram from Devi Shresta Gold & Diamonds is a masterpiece of traditional craftsmanship.",
      likes: 456,
      comments: 35,
      postUrl: "https://www.instagram.com/devishrestagoldanddiamonds/reel/DG4u3FTzv_W/",
      shortcode: "DG4u3FTzv_W",
      type: "reel",
    },
    {
      id: "4",
      imageUrl: "",
      caption: "All new Black Diamond collection — Bold, Beautiful, and Breathtaking.",
      likes: 523,
      comments: 42,
      postUrl: "https://www.instagram.com/devishrestagoldanddiamonds/reel/C-xQLpSvF3i/",
      shortcode: "C-xQLpSvF3i",
      type: "reel",
    },
  ];

  const promoSlides: PromoSlide[] = [
    {
      id: "bridal-2026",
      title: "Bridal Collection 2026",
      subtitle: "Handcrafted Telugu bridal sets with certified diamonds & 22K gold",
      description: "Complete bridal jewelry for your special day",
      badge: "NEW",
      highlight: "Starting ₹1,50,000",
      gradient: "linear-gradient(135deg, #1a0a1e 0%, #2d1338 50%, #1a1a2e 100%)",
      cta: { type: "book", label: "Book Consultation" },
    },
    {
      id: "gold-scheme",
      title: "Gold Savings Scheme",
      subtitle: "Save monthly, get bonus gold — start with just ₹1,000/month",
      description: "Smart way to buy jewelry",
      badge: "TRENDING",
      highlight: "Extra 2% Gold Bonus",
      gradient: "linear-gradient(135deg, #1a1a0a 0%, #2d2a0e 50%, #1a1a2e 100%)",
      cta: { type: "whatsapp", label: "Enquire Now" },
    },
    {
      id: "exchange-offer",
      title: "Old Gold Exchange",
      subtitle: "Get the best exchange value for your old jewelry — no making charges on exchange",
      description: "Upgrade your collection",
      badge: "OFFER",
      highlight: "Zero Making Charges",
      gradient: "linear-gradient(135deg, #0a1a1e 0%, #0e2d2a 50%, #1a1a2e 100%)",
      cta: { type: "chat", label: "Chat With Us" },
    },
    {
      id: "diamond-collection",
      title: "Certified Diamond Collection",
      subtitle: "IGI & GIA certified solitaires — VVS to VS clarity, D to G color",
      description: "Premium diamond jewelry",
      badge: "PREMIUM",
      highlight: "With Certificate",
      gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      cta: { type: "link", label: "View Collection", href: "/collections" },
    },
    {
      id: "temple-jewelry",
      title: "Temple Jewelry Festival",
      subtitle: "Traditional Lakshmi, peacock & kemp stone designs in pure 22K gold",
      description: "Celebrate tradition",
      badge: "FESTIVE",
      highlight: "Flat 15% Off Making",
      gradient: "linear-gradient(135deg, #2e1a0a 0%, #3d2a0e 50%, #1a1a2e 100%)",
      cta: { type: "whatsapp", label: "Get Offer" },
    },
  ];

  return (
    <>
      <Hero
        title={orgData.name}
        subtitle={orgData.tagline}
        ctaPrimary={{ label: "Explore Collection", href: "/collections" }}
        ctaSecondary={{ label: "Book Consultation", href: "/booking" }}
      />

      <PromoBanner
        slides={promoSlides}
        whatsappNumber={orgData.socialLinks?.whatsapp || orgData.phone}
      />

      <CategoryShowcase categories={orgData.categories} />

      <ProductGrid
        products={featuredProducts.length > 0 ? featuredProducts : allProducts}
        categories={categories}
        showFilters={false}
        limit={6}
      />

      <AboutSnippet
        businessName={orgData.name}
        description={orgData.description}
        tagline={orgData.tagline}
        features={orgData.features}
      />

      <ReviewMarquee
        reviews={googleReviews}
        overallRating={orgData.rating}
        reviewCount={orgData.reviewCount}
        businessName={orgData.name}
        googleMapsUrl={orgData.socialLinks?.google_maps}
      />

      <InstagramFeed
        posts={instagramPosts}
        instagramUrl={orgData.socialLinks?.instagram || "https://www.instagram.com/devishrestagoldanddiamonds/"}
        handle="devishrestagoldanddiamonds"
        followerCount="9.2K"
      />

      {(orgData as unknown as Record<string, unknown>).trustBadges && (
        <TrustBadgesBar
          badges={(orgData as unknown as Record<string, unknown>).trustBadges as Array<{ icon: string; title: string; description: string }>}
          variant="full"
        />
      )}

      <ContactSection orgData={orgData} />

      {coords && (
        <MapEmbed
          lat={coords.lat}
          lng={coords.lng}
          title="Visit Our Store"
          businessName="Devi Shresta Gold and Diamonds, Governorpet, Vijayawada"
        />
      )}
    </>
  );
}
