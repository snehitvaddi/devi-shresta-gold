import type { DomainSeo } from '@/types';

export const salonSeo: DomainSeo = {
  keywords: [
    'hair salon near me',
    'beauty salon',
    'haircut',
    'hair color',
    'nail salon',
    'spa services',
    'facial treatment',
    'bridal makeup',
    'salon appointment',
    'beauty services',
  ],
  metaDescriptionTemplates: [
    '{{businessName}} - Your destination for beauty in {{city}}. Hair, nails, skincare, and more. Book online today.',
    'Transform your look at {{businessName}}. Expert stylists, relaxing atmosphere, and premium products in {{city}}.',
    '{{businessName}} offers hair styling, color, nails, facials, and bridal packages. Book your appointment now.',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: '{{businessName}}',
  },
};
