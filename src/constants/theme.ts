export type ThemeMode = 'dark' | 'light';

export const darkColors = {
  // Figma Signature Mint Emerald Dark Palette
  background: '#071013',
  cardBackground: '#0E1B1E',
  cardSecondary: '#15272B',
  surfaceLight: '#20383E',
  
  // Accents - Figma Signature Mint Teal
  primary: '#00BFA5',
  primaryDark: '#00897B',
  primaryLight: '#2DD4BF',
  
  // Financial status colors
  income: '#10B981',       // Mint Emerald
  incomeLight: '#34D399',
  incomeBg: 'rgba(16, 185, 129, 0.14)',
  
  expense: '#F43F5E',      // Rose
  expenseLight: '#FB7185',
  expenseBg: 'rgba(244, 63, 94, 0.14)',
  
  warning: '#F59E0B',      // Amber
  warningBg: 'rgba(245, 158, 11, 0.14)',
  
  info: '#38BDF8',         // Sky blue
  infoBg: 'rgba(56, 189, 248, 0.14)',
  
  purple: '#8B5CF6',
  purpleBg: 'rgba(139, 92, 246, 0.14)',
  
  cyan: '#06B6D4',
  cyanBg: 'rgba(6, 182, 212, 0.14)',
  
  // Text
  textPrimary: '#F2FDFB',
  textSecondary: '#8EA5A9',
  textMuted: '#5F797E',
  textLight: '#C6D8DB',
  
  // Borders & Dividers
  border: '#152A2E',
  borderLight: '#224249',
  borderDanger: '#F43F5E',
  
  // Role Badges & Navigation
  adminBadge: '#F59E0B',
  customerBadge: '#00BFA5',
  tabBarBg: '#071215',
  headerBg: '#071013',
  drawerBg: '#071013',
};

export const lightColors = {
  // Figma Fresh Teal / Mint Light Palette
  background: '#F4F8F7',
  cardBackground: '#FFFFFF',
  cardSecondary: '#EAF2F0',
  surfaceLight: '#D8E7E4',
  
  // Accents - Deep Mint Teal
  primary: '#0D9488',
  primaryDark: '#0F766E',
  primaryLight: '#14B8A6',
  
  // Financial status colors
  income: '#059669',       // Emerald
  incomeLight: '#10B981',
  incomeBg: 'rgba(5, 150, 105, 0.12)',
  
  expense: '#E11D48',      // Rose
  expenseLight: '#F43F5E',
  expenseBg: 'rgba(225, 29, 72, 0.12)',
  
  warning: '#D97706',      // Amber
  warningBg: 'rgba(217, 119, 6, 0.12)',
  
  info: '#0284C7',         // Sky blue
  infoBg: 'rgba(2, 132, 199, 0.12)',
  
  purple: '#7C3AED',
  purpleBg: 'rgba(124, 58, 237, 0.12)',
  
  cyan: '#0891B2',
  cyanBg: 'rgba(8, 145, 178, 0.12)',
  
  // Text
  textPrimary: '#0D1E21',
  textSecondary: '#375055',
  textMuted: '#68858A',
  textLight: '#293F44',
  
  // Borders & Dividers
  border: '#DFECE9',
  borderLight: '#CADBD7',
  borderDanger: '#E11D48',
  
  // Role Badges & Navigation
  adminBadge: '#D97706',
  customerBadge: '#0D9488',
  tabBarBg: '#FFFFFF',
  headerBg: '#FFFFFF',
  drawerBg: '#FFFFFF',
};

// Active colors object
export const colors = { ...darkColors };

export function setThemeMode(mode: ThemeMode) {
  const target = mode === 'dark' ? darkColors : lightColors;
  Object.assign(colors, target);
}

export const typography = {
  titleLarge: {
    fontSize: 26,
    fontWeight: '700' as const,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  titleMedium: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.textPrimary,
  },
  titleSmall: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },
  body: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  bodyBold: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },
  caption: {
    fontSize: 12,
    color: colors.textMuted,
  },
  currency: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: colors.textPrimary,
    letterSpacing: -0.8,
  },
};

export const layout = {
  borderRadiusSmall: 10,
  borderRadiusMedium: 16,
  borderRadiusLarge: 22,
  paddingHorizontal: 18,
};
