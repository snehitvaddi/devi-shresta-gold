// ── Shared Type Definitions ──

// ── Theme ──
export interface ThemeColors {
  primary: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceLight: string;
  text: string;
  textMuted: string;
  textDark: string;
  success: string;
  error: string;
}

export interface ThemeFonts {
  heading: string;
  body: string;
  accent: string;
}

export interface DomainTheme {
  colors: ThemeColors;
  fonts: ThemeFonts;
  borderRadius: { sm: string; md: string; lg: string };
  spacing: { section: string; container: string };
}

// ── Sections ──
export type SectionType =
  | 'hero'
  | 'featured-products'
  | 'categories'
  | 'about-snippet'
  | 'testimonials'
  | 'contact-cta'
  | 'instagram-feed'
  | 'map'
  | 'services'
  | 'menu'
  | 'doctors'
  | 'booking'
  | 'gallery'
  | 'pricing';

export interface SectionConfig {
  type: SectionType;
  title: string;
  order: number;
  enabled: boolean;
}

export type DomainSections = SectionConfig[];

// ── Prompts ──
export interface DomainPrompts {
  customerChat: string;
  visionIdentification: string;
  whatsappCms: string;
}

// ── SEO ──
export interface DomainSeo {
  keywords: string[];
  metaDescriptionTemplates: string[];
  openGraph: {
    type: string;
    locale: string;
    siteName: string;
  };
}

// ── Products ──
export interface Product {
  id: string;
  orgId: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  category: string;
  subcategory?: string;
  tags: string[];
  images: ProductImage[];
  featured: boolean;
  inStock: boolean;
  stockQuantity?: number;
  sku?: string;
  metadata: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

// ── Categories ──
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  parentId?: string;
  order: number;
}

// ── Reviews ──
export interface Review {
  id: string;
  productId?: string;
  customerName: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  createdAt: string;
}

// ── Booking ──
export interface BookingSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
  serviceId?: string;
  staffId?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  price: number;
  currency: string;
  category: string;
  image?: string;
}

// ── Business Info ──
export interface BusinessHours {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  youtube?: string;
  whatsapp?: string;
  tiktok?: string;
  linkedin?: string;
  google_maps?: string;
}

// ── Org Data (loaded from orgs/[orgId]/data.json) ──
export interface OrgData {
  id: string;
  name: string;
  domain: string;
  tagline: string;
  description: string;
  story?: string;
  logo?: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    full?: string;
    coordinates?: { lat: number; lng: number };
  };
  businessHours: BusinessHours[];
  socialLinks: SocialLinks;
  rating: number;
  reviewCount: number;
  currency?: string;
  locale?: string;
  features: string[];
  categories: Category[];
  testimonials: Review[];
}

// ── Org Config (loaded from orgs/[orgId]/config.ts) ──
export interface OrgConfig {
  orgId: string;
  domain: string;
  sectionOverrides?: Partial<SectionConfig>[];
  featureFlags: {
    aiChat: boolean;
    visualSearch: boolean;
    whatsappCms: boolean;
    booking: boolean;
    instagramFeed: boolean;
    googleMap: boolean;
  };
  whatsapp?: {
    phoneNumber: string;
    businessName: string;
  };
  analytics?: {
    googleAnalyticsId?: string;
    metaPixelId?: string;
  };
  customMeta?: Record<string, string>;
}
