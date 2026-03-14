import { BlurView, BlurTint } from 'expo-blur';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { tokens } from '@/constants/tokens';
import { ReactNode } from 'react';

type GlassType = 'primary' | 'secondary' | 'tertiary';

interface GlassSurfaceProps {
  type?: GlassType;
  intensity?: number;
  tint?: BlurTint;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

export const GlassSurface = ({ 
  type = 'secondary', 
  intensity,
  tint,
  style, 
  children,
  ...rest
}: GlassSurfaceProps) => {
  const effect = tokens.theme.glassEffect[type];

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
