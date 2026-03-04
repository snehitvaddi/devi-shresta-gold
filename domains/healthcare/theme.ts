import type { DomainTheme } from '@/types';

export const healthcareTheme: DomainTheme = {
  colors: {
    primary: '#0891B2',
    primaryDark: '#0E7490',
    secondary: '#F0FDFA',
    accent: '#2DD4BF',
    background: '#FFFFFF',
    surface: '#F8FFFE',
    surfaceLight: '#F0FDFA',
    text: '#1E293B',
    textMuted: '#64748B',
    textDark: '#0F172A',
    success: '#22C55E',
    error: '#EF4444',
  },
  fonts: {
    heading: "'DM Sans', sans-serif",
    body: "'Inter', sans-serif",
    accent: "'DM Serif Display', serif",
  },
  borderRadius: { sm: '6px', md: '12px', lg: '20px' },
  spacing: { section: '80px', container: '1200px' },
};

export type Theme = typeof healthcareTheme;
