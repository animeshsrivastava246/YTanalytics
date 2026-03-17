import { BlurView, BlurTint } from 'expo-blur';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { View, StyleSheet, ViewStyle, StyleProp, Platform } from 'react-native';
import { tokens } from '@/constants/tokens';
import { ReactNode } from 'react';

type GlassType = 'primary' | 'secondary' | 'tertiary';

interface GlassSurfaceProps {
  type?: GlassType;
  intensity?: number;
  tint?: BlurTint;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  isInteractive?: boolean;
}

export const GlassSurface = ({ 
  type = 'secondary', 
  intensity,
  tint,
  style, 
  children,
  isInteractive = false,
  ...rest
}: GlassSurfaceProps) => {
  const isLiquidGlass = Platform.OS === 'ios' && isLiquidGlassAvailable();
  const effect = tokens.theme.glassEffect[type];
  const glassStyle = tokens.theme.glassStyle[type];

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
    <BlurView
      intensity={intensity ?? effect.intensity}
      tint={tint ?? effect.tint}
      style={[styles.container, style]}
      {...rest}
    >
      <View style={StyleSheet.absoluteFillObject} />
      {children}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  }
});
