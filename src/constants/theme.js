export const COLORS = {
  primary: '#1A73E8',      // Medical blue
  secondary: '#00897B',    // Emergency green
  background: '#F8FAFB',   // Light background
  white: '#FFFFFF',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  error: '#EF4444',
  success: '#22C55E',
  warning: '#F59E0B',
  free: '#00897B',         // Green badge for free
  discount: '#1A73E8',     // Blue badge for discount
  cardShadow: 'rgba(0,0,0,0.08)',
};

export const SIZES = {
  xs: 10,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  iconLarge: 80,
  borderRadius: 12,
  borderRadiusLarge: 20,
};

export const FONTS = {
  arabic: 'Cairo',
  english: 'Roboto',
  regular: { fontFamily: 'Cairo', fontSize: SIZES.md },
  bold: { fontFamily: 'Cairo', fontSize: SIZES.md, fontWeight: '700' },
  title: { fontFamily: 'Cairo', fontSize: SIZES.xl, fontWeight: '700' },
  h1: { fontFamily: 'Cairo', fontSize: SIZES.xxxl, fontWeight: '700' },
};

export const SERVICE_TYPES = {
  icu: 'icu',
  incubator: 'incubator',
  radiation: 'radiation',
};

export const SERVICE_ICONS = {
  icu: '❤️',
  incubator: '👶',
  radiation: '☢️',
};
