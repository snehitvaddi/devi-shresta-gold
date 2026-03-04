import type { DomainSections } from '@/types';

export const restaurantSections: DomainSections = [
  { type: 'hero', title: 'Welcome', order: 1, enabled: true },
  { type: 'menu', title: 'Our Menu', order: 2, enabled: true },
  { type: 'featured-products', title: 'Chef Specials', order: 3, enabled: true },
  { type: 'about-snippet', title: 'Our Story', order: 4, enabled: true },
  { type: 'gallery', title: 'Gallery', order: 5, enabled: true },
  { type: 'testimonials', title: 'What Guests Say', order: 6, enabled: true },
  { type: 'booking', title: 'Reserve a Table', order: 7, enabled: true },
  { type: 'contact-cta', title: 'Contact Us', order: 8, enabled: true },
  { type: 'map', title: 'Find Us', order: 9, enabled: true },
];
