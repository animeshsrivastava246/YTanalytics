import React from 'react';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { AppText } from './AppText';
import { tokens } from '@/constants/tokens';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'solid' | 'glass';
  loading?: boolean;
  style?: ViewStyle;
}

export const PrimaryButton = ({ label, onPress, variant = 'solid', loading, style }: PrimaryButtonProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handlePressIn = () => { scale.value = withSpring(0.96, { damping: 15, stiffness: 300 }); };
  const handlePressOut = () => { scale.value = withSpring(1, { damping: 15, stiffness: 300 }); };

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable 
        onPress={onPress} 
        onPressIn={handlePressIn} 
        onPressOut={handlePressOut}
        disabled={loading}
        style={[styles.base, variant === 'solid' ? styles.solid : styles.glass]}
      >
        <AppText variant="subtitle" color={variant === 'solid' ? 'primary' : 'muted'} style={styles.text}>
          {loading ? 'Wait...' : label}
        </AppText>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: tokens.theme.spacing.lg,
    paddingHorizontal: tokens.theme.spacing.xl,
    borderRadius: tokens.theme.radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  solid: {
    backgroundColor: tokens.theme.colors.accentPrimary,
  },
  glass: {
    backgroundColor: tokens.theme.colors.glassSecondary,
  },
  text: {
    textAlign: 'center',
  }
});
