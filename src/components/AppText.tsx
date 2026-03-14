import { Text, TextStyle } from 'react-native';
import { tokens } from '@/constants/tokens';
import { ReactNode } from 'react';

type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'subtitle' | 'body' | 'caption';
type TextColor = 'primary' | 'muted' | 'accent' | 'error';

interface AppTextProps {
  variant?: TextVariant;
  color?: TextColor;
  numberOfLines?: number;
  style?: TextStyle;
  children: ReactNode;
}

export const AppText = ({
  variant = 'body',
  color = 'primary',
  numberOfLines,
  style,
  children,
}: AppTextProps) => {
  const typography = tokens.theme.typography[variant];
  
  let colorValue = tokens.theme.colors.textPrimary;
  if (color === 'muted') colorValue = tokens.theme.colors.textMuted;
  if (color === 'accent') colorValue = tokens.theme.colors.accentPrimary;
  if (color === 'error') colorValue = tokens.theme.colors.error;

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
};
