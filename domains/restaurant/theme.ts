import type { DomainTheme } from '@/types';

export const restaurantTheme: DomainTheme = {
  colors: {
    primary: '#EA580C',
    primaryDark: '#C2410C',
    secondary: '#FFF7ED',
    accent: '#F59E0B',
    background: '#1C1917',
    surface: '#292524',
    surfaceLight: '#3D3835',
    text: '#FAFAF9',
    textMuted: '#A8A29E',
    textDark: '#1C1917',
    success: '#22C55E',
    error: '#EF4444',
  },
  fonts: {
    heading: "'Prata', serif",
    body: "'Inter', sans-serif",
    accent: "'Dancing Script', cursive",
  },
  borderRadius: { sm: '4px', md: '8px', lg: '12px' },
  spacing: { section: '80px', container: '1200px' },
};

export type Theme = typeof restaurantTheme;
