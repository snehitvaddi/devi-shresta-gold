import type { DomainSeo } from '@/types';

export const jewelrySeo: DomainSeo = {
  keywords: [
    'jewelry store',
    'fine jewelry',
    'diamond rings',
    'engagement rings',
    'wedding bands',
    'gold necklace',
    'gemstone jewelry',
    'custom jewelry',
    'luxury jewelry',
    'handcrafted jewelry',
    'pearl earrings',
    'silver bracelet',
    'jewelry repair',
    'jewelry near me',
    'buy jewelry online',
  ],
  metaDescriptionTemplates: [
    '{{businessName}} - Discover exquisite fine jewelry, diamond rings, and custom pieces in {{city}}. Visit our store or shop online.',
    'Shop handcrafted jewelry at {{businessName}}. Engagement rings, gold necklaces, gemstone earrings, and more. Free consultation available.',
    '{{businessName}} offers premium jewelry collections including diamonds, gold, and custom designs. Serving {{city}} since {{year}}.',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: '{{businessName}}',
  },
};
