import React from 'react';
import {
  StyleSheet,
  Pressable,
  ViewStyle,
  StyleProp,
  ActivityIndicator,
} from 'react-native';
import { AppText } from './AppText';
import { useAppTheme } from '@/context/ThemeProvider';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}: PrimaryButtonProps) {
  const { colors, spacing, radii } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.container,
        {
          paddingVertical: spacing.lg,
          paddingHorizontal: spacing.xl,
          borderRadius: radii.pill,
          backgroundColor:
            variant === 'primary'
              ? colors.accentPrimary
              : colors.glassSecondary,
        },
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#FFFFFF' : colors.accentPrimary}
        />
      ) : (
        <AppText
          variant="subtitle"
          style={{
            color: variant === 'primary' ? '#FFFFFF' : colors.accentPrimary,
            fontWeight: '600',
          }}
        >
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
});
