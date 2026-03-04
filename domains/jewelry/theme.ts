import type { DomainTheme } from '@/types';

export const jewelryTheme: DomainTheme = {
  colors: {
    primary: '#D4AF37',
    primaryDark: '#B8960C',
    secondary: '#1a1a2e',
    accent: '#e8d5b7',
    background: '#0a0a0a',
    surface: '#1a1a1a',
    surfaceLight: '#2a2a2a',
    text: '#ffffff',
    textMuted: '#a0a0a0',
    textDark: '#1a1a2e',
    success: '#22c55e',
    error: '#ef4444',
  },
  fonts: {
    heading: "'Playfair Display', serif",
    body: "'Inter', sans-serif",
    accent: "'Cormorant Garamond', serif",
  },
  borderRadius: { sm: '4px', md: '8px', lg: '16px' },
  spacing: { section: '80px', container: '1200px' },
};

export type Theme = typeof jewelryTheme;
