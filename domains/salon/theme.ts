import type { DomainTheme } from '@/types';

export const salonTheme: DomainTheme = {
  colors: {
    primary: '#A855F7',
    primaryDark: '#7E22CE',
    secondary: '#FDF4FF',
    accent: '#EC4899',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    surfaceLight: '#FDF4FF',
    text: '#1E1B2E',
    textMuted: '#6B7280',
    textDark: '#1E1B2E',
    success: '#22C55E',
    error: '#EF4444',
  },
  fonts: {
    heading: "'Didact Gothic', sans-serif",
    body: "'Inter', sans-serif",
    accent: "'Great Vibes', cursive",
  },
  borderRadius: { sm: '8px', md: '16px', lg: '24px' },
  spacing: { section: '80px', container: '1200px' },
};

export type Theme = typeof salonTheme;
