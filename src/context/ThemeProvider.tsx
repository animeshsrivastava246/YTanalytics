import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { tokens } from '@/constants/tokens';
import { useSettingsStore } from '@/services/settingsStore';

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  colors: typeof tokens.colors.dark;
  typography: typeof tokens.typography;
  spacing: typeof tokens.spacing;
  radii: typeof tokens.radii;
  glassEffect: typeof tokens.glassEffect.dark;
  glassStyle: typeof tokens.glassStyle.dark;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const themePreference = useSettingsStore((state) => state.theme);
  const reduceTransparency = useSettingsStore(
    (state) => state.reduceTransparency
  );

  const theme: ThemeType = useMemo(() => {
    if (themePreference === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return themePreference;
  }, [themePreference, systemColorScheme]);

  const value = useMemo(() => {
    const isDark = theme === 'dark';
    const baseColors = isDark ? tokens.colors.dark : tokens.colors.light;

    const colors = {
      ...baseColors,
      ...(reduceTransparency
        ? {
            glassPrimary: baseColors.cardPrimary,
            glassSecondary: baseColors.cardSecondary,
          }
        : {}),
    };

    return {
      theme,
      colors,
      typography: tokens.typography,
      spacing: tokens.spacing,
      radii: tokens.radii,
      glassEffect: isDark ? tokens.glassEffect.dark : tokens.glassEffect.light,
      glassStyle: isDark ? tokens.glassStyle.dark : tokens.glassStyle.light,
      isDark,
    };
  }, [theme, reduceTransparency]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};
