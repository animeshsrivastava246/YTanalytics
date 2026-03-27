import React, { ReactNode, memo } from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';

import { useAppTheme } from '@/context/ThemeProvider';

type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'subtitle' | 'body' | 'caption';
type TextColor = 'primary' | 'muted' | 'accent' | 'error';

interface AppTextProps {
  variant?: TextVariant;
  color?: TextColor;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  children: ReactNode;
}

export const AppText = memo<AppTextProps>(
  ({
    variant = 'body',
    color = 'primary',
    numberOfLines,
    style,
    children,
  }: AppTextProps) => {
    const { colors, typography: themeTypography } = useAppTheme();
    const typography = themeTypography[variant] || themeTypography.body;

    const getColor = (): string => {
      switch (color) {
        case 'muted':
          return colors.textMuted;
        case 'accent':
          return colors.accentPrimary;
        case 'error':
          return colors.error;
        default:
          return colors.textPrimary;
      }
    };
    const colorValue = getColor();

    return (
      <Text
        numberOfLines={numberOfLines}
        style={[
          {
            fontSize: typography.fontSize,
            fontWeight: typography.fontWeight,
            color: colorValue,
          },
          style,
        ]}
      >
        {children}
      </Text>
    );
  }
);

AppText.displayName = 'AppText';
