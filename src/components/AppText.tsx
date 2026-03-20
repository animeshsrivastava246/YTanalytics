import React, { ReactNode, memo } from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import { tokens } from '@/constants/tokens';

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
    const typography =
      tokens.theme.typography[variant] || tokens.theme.typography.body;
    const getColor = (): string => {
      switch (color) {
        case 'muted':
          return tokens.theme.colors.textMuted;
        case 'accent':
          return tokens.theme.colors.accentPrimary;
        case 'error':
          return tokens.theme.colors.error;
        default:
          return tokens.theme.colors.textPrimary;
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
