import type { DomainSeo } from '@/types';

export const restaurantSeo: DomainSeo = {
  keywords: [
    'restaurant near me',
    'best restaurant',
    'fine dining',
    'food delivery',
    'catering service',
    'private dining',
    'lunch specials',
    'dinner reservations',
    'family restaurant',
    'online menu',
  ],
  metaDescriptionTemplates: [
    '{{businessName}} - Exceptional dining in {{city}}. View our menu and reserve your table today.',
    'Experience the flavors of {{businessName}}. Fresh ingredients, handcrafted dishes, and warm hospitality in {{city}}.',
    '{{businessName}} offers fine dining, catering, and private events in {{city}}. Book now.',
  ],
  openGraph: {
    type: 'restaurant',
    locale: 'en_US',
    siteName: '{{businessName}}',
  },
};
