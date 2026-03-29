import { BlurView, BlurTint } from 'expo-blur';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { View, StyleSheet, ViewStyle, StyleProp, Platform } from 'react-native';
import React, { ReactNode, memo } from 'react';

import { useSettingsStore } from '@/services/settingsStore';
import { useAppTheme } from '@/context/ThemeProvider';

export type GlassType = 'primary' | 'secondary' | 'tertiary' | 'none';

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
    const { colors, glassEffect, glassStyle: themeGlassStyle } = useAppTheme();

    const isLiquidGlass =
      Platform.OS === 'ios' && isLiquidGlassAvailable() && !reduceTransparency;

    const effect =
      glassEffect[type as keyof typeof glassEffect] || glassEffect.secondary;
    const glassStyle =
      themeGlassStyle[type as keyof typeof themeGlassStyle] ||
      themeGlassStyle.secondary;

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
        style={[
          styles.container,
          style,
          reduceTransparency && {
            backgroundColor: colors.glassSecondary,
            borderWidth: 1,
            borderColor: colors.borderSubtle,
          },
        ]}
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
                ? colors.glassSecondary
                : type === 'primary' && colors.surfaceBg === '#000000'
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
});
