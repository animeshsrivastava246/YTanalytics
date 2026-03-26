import { BlurView, BlurTint } from 'expo-blur';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { View, StyleSheet, ViewStyle, StyleProp, Platform } from 'react-native';
import { tokens } from '@/constants/tokens';
import React, { ReactNode, memo } from 'react';

import { useSettingsStore } from '@/services/settingsStore';

type GlassType = 'primary' | 'secondary' | 'tertiary';

interface GlassSurfaceProps {
  type?: GlassType;
  intensity?: number;
  tint?: BlurTint;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  isInteractive?: boolean;
}

export const GlassSurface = memo(
  ({
    type = 'secondary',
    isInteractive = false,
    intensity,
    tint,
    style,
    children,
    ...rest
  }: GlassSurfaceProps) => {
    const { reduceTransparency } = useSettingsStore();
    const isLiquidGlass =
      Platform.OS === 'ios' && isLiquidGlassAvailable() && !reduceTransparency;

    const effect =
      tokens.theme.glassEffect[type] || tokens.theme.glassEffect.secondary;
    const glassStyle =
      tokens.theme.glassStyle[type] || tokens.theme.glassStyle.secondary;

    const finalIntensity = reduceTransparency
      ? (intensity ?? effect.intensity) * 0.3
      : (intensity ?? effect.intensity);

    if (isLiquidGlass) {
      return (
        <View style={[styles.container, style]} {...rest}>
          <GlassView
            glassEffectStyle={glassStyle.style}
            colorScheme={glassStyle.colorScheme}
            isInteractive={isInteractive}
            style={StyleSheet.absoluteFillObject}
          />
          {children}
        </View>
      );
    }

    return (
      <View
        style={[styles.container, style, reduceTransparency && styles.reduced]}
        {...rest}
      >
        {!reduceTransparency && (
          <BlurView
            intensity={finalIntensity}
            tint={tint ?? effect.tint}
            style={StyleSheet.absoluteFillObject}
          />
        )}
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: reduceTransparency
                ? tokens.theme.colors.glassSecondary
                : type === 'primary'
                  ? 'rgba(0,0,0,0.2)'
                  : 'transparent',
            },
          ]}
        />
        {children}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  reduced: {
    backgroundColor: tokens.theme.colors.glassSecondary,
    borderWidth: 1,
    borderColor: tokens.theme.colors.borderSubtle,
  },
});
