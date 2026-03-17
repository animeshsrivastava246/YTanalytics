import React from 'react';
import Animated, { useAnimatedStyle, withTiming, withSpring, useSharedValue } from 'react-native-reanimated';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { AppText } from './AppText';
import { GlassSurface } from './GlassSurface';
import { tokens } from '@/constants/tokens';

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export const Chip = ({ label, selected, onPress, style }: ChipProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: withTiming(
      selected ? tokens.theme.colors.accentSecondary : tokens.theme.colors.glassSecondary,
      { duration: 150 }
    ),
    borderColor: withTiming(
      selected ? tokens.theme.colors.accentSecondary : tokens.theme.colors.borderSubtle,
      { duration: 150 }
    )
  }));

  const handlePressIn = () => { scale.value = withSpring(0.92); };
  const handlePressOut = () => { scale.value = withSpring(1); };

  return (
    <Animated.View style={[styles.container, animatedStyle, style]}>
      <GlassSurface type="tertiary" style={styles.glassSurface}>
        <Pressable 
          onPress={onPress} 
          onPressIn={handlePressIn} 
          onPressOut={handlePressOut}
          style={styles.pressable}
        >
          <AppText variant="caption" color={selected ? 'primary' : 'muted'}>
            {label}
          </AppText>
        </Pressable>
      </GlassSurface>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: tokens.theme.radii.pill,
    borderWidth: 1,
    overflow: 'hidden',
    marginRight: tokens.theme.spacing.sm,
  },
  glassSurface: {
    borderRadius: tokens.theme.radii.pill,
  },
  pressable: {
    paddingVertical: tokens.theme.spacing.sm,
    paddingHorizontal: tokens.theme.spacing.lg,
  }
});
