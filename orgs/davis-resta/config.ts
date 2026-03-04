import type { OrgConfig } from '@/types';

export const orgConfig: OrgConfig = {
  orgId: 'davis-resta',
  domain: 'jewelry',
  sectionOverrides: [
    { type: 'hero', title: 'Devi Shresta Gold & Diamonds' },
    { type: 'featured-products', title: 'Our Collections' },
    { type: 'about-snippet', title: 'The Devi Shresta Legacy' },
  ],
  featureFlags: {
    aiChat: true,
    visualSearch: true,
    whatsappCms: true,
    booking: true,
    instagramFeed: true,
    googleMap: true,
  },
  whatsapp: {
    phoneNumber: '+917337372922',
    businessName: 'Devi Shresta Gold & Diamonds',
  },
  analytics: {
    googleAnalyticsId: undefined,
    metaPixelId: undefined,
  },
  customMeta: {
    'theme-color': '#D4AF37',
  },
};

export default orgConfig;
