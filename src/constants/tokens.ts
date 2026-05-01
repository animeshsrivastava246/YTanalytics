import { BlurTint } from 'expo-blur';
import { GlassStyle, GlassColorScheme } from 'expo-glass-effect';

export const tokens = {
  colors: {
    light: {
      surfaceBg: '#F2F2F7',
      cardPrimary: '#FFFFFF',
      cardSecondary: '#F2F2F7',
      cardTertiary: '#E5E5EA',
      glassPrimary: 'rgba(255,255,255,0.85)',
      glassSecondary: 'rgba(242,242,247,0.75)',
      accentPrimary: '#FF3B30',
      accentSecondary: '#007AFF',
      textPrimary: '#000000',
      textMuted: '#636366',
      borderSubtle: 'rgba(0,0,0,0.1)',
      scrimDark: 'rgba(0,0,0,0.4)',
      scrimLight: 'rgba(0,0,0,0.1)',
      success: '#34C759',
      warning: '#FF9500',
      error: '#FF3B30',
    },
    dark: {
      surfaceBg: '#000000',
      cardPrimary: '#1C1C1E',
      cardSecondary: '#2C2C2E',
      cardTertiary: '#3A3A3C',
      glassPrimary: 'rgba(28,28,30,0.75)',
      glassSecondary: 'rgba(44,44,46,0.65)',
      accentPrimary: '#FF3B30',
      accentSecondary: '#0A84FF',
      textPrimary: '#FFFFFF',
      textMuted: '#8E8E93',
      borderSubtle: 'rgba(255,255,255,0.15)',
      scrimDark: 'rgba(0,0,0,0.4)',
      scrimLight: 'rgba(0,0,0,0.2)',
      success: '#30D158',
      warning: '#FF9F0A',
      error: '#FF453A',
    },
  },
  typography: {
    h1: { fontSize: 34, fontWeight: '700' as const },
    h2: { fontSize: 28, fontWeight: '600' as const },
    h3: { fontSize: 22, fontWeight: '600' as const },
    h4: { fontSize: 20, fontWeight: '600' as const },
    subtitle: { fontSize: 17, fontWeight: '500' as const },
    body: { fontSize: 17, fontWeight: '400' as const },
    caption: { fontSize: 13, fontWeight: '400' as const },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 48,
  },
  radii: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    pill: 9999,
  },
  glassEffect: {
    light: {
      primary: { intensity: 100, tint: 'light' as BlurTint },
      secondary: { intensity: 80, tint: 'light' as BlurTint },
      tertiary: { intensity: 50, tint: 'default' as BlurTint },
    },
    dark: {
      primary: { intensity: 100, tint: 'dark' as BlurTint },
      secondary: { intensity: 80, tint: 'dark' as BlurTint },
      tertiary: { intensity: 50, tint: 'default' as BlurTint },
    },
  },
  glassStyle: {
    light: {
      primary: {
        style: 'regular' as GlassStyle,
        colorScheme: 'light' as GlassColorScheme,
      },
      secondary: {
        style: 'regular' as GlassStyle,
        colorScheme: 'auto' as GlassColorScheme,
      },
      tertiary: {
        style: 'clear' as GlassStyle,
        colorScheme: 'auto' as GlassColorScheme,
      },
    },
    dark: {
      primary: {
        style: 'regular' as GlassStyle,
        colorScheme: 'dark' as GlassColorScheme,
      },
      secondary: {
        style: 'regular' as GlassStyle,
        colorScheme: 'auto' as GlassColorScheme,
      },
      tertiary: {
        style: 'clear' as GlassStyle,
        colorScheme: 'auto' as GlassColorScheme,
      },
    },
  },

  // Legacy fallback for components not yet converted to useAppTheme
  theme: {
    colors: {
      surfaceBg: '#000000',
      surfaceBgLight: '#F2F2F7',
      glassPrimary: 'rgba(28,28,30,0.75)',
      glassSecondary: 'rgba(44,44,46,0.65)',
      accentPrimary: '#FF3B30',
      accentSecondary: '#0A84FF',
      textPrimary: '#FFFFFF',
      textMuted: '#8E8E93',
      borderSubtle: 'rgba(255,255,255,0.15)',
      scrimDark: 'rgba(0,0,0,0.4)',
      scrimLight: 'rgba(0,0,0,0.2)',
      success: '#34C759',
      warning: '#FF9500',
      error: '#FF3B30',
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      xxl: 32,
      xxxl: 48,
    },
    radii: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      pill: 9999,
    },
  },
};
