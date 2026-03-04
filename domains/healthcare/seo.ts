import type { DomainSeo } from '@/types';

export const healthcareSeo: DomainSeo = {
  keywords: [
    'doctor near me',
    'healthcare clinic',
    'medical practice',
    'family doctor',
    'primary care',
    'specialist',
    'medical office',
    'health clinic',
    'appointment booking',
    'walk-in clinic',
  ],
  metaDescriptionTemplates: [
    '{{businessName}} - Trusted healthcare services in {{city}}. Book your appointment today.',
    'Visit {{businessName}} for comprehensive medical care. Accepting new patients in {{city}}.',
    '{{businessName}} provides quality healthcare with compassionate doctors. Call or book online.',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: '{{businessName}}',
  },
};
