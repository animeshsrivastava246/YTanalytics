import React from 'react';
import { StyleSheet, Pressable, ViewStyle, StyleProp } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { GlassSurface, GlassType } from './GlassSurface';
import { useAppTheme } from '@/context/ThemeProvider';

interface IconButtonProps {
  icon: LucideIcon;
  onPress?: () => void;
  glassType?: GlassType;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export function IconButton({
  icon: Icon,
  onPress,
  glassType = 'secondary',
  size = 24,
  color,
  style,
  disabled = false,
}: IconButtonProps) {
  const { colors, spacing, radii } = useAppTheme();
  const iconColor = color || colors.textPrimary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.container,
        {
          padding: spacing.md,
          borderRadius: radii.pill,
        },
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {glassType !== 'none' && (
        <GlassSurface
          type={glassType}
          style={[StyleSheet.absoluteFillObject, { borderRadius: radii.pill }]}
        />
      )}
      <Icon size={size} color={iconColor} strokeWidth={2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  disabled: {
    opacity: 0.5,
  },
});
