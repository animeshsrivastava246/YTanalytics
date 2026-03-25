import { tokens } from '@/constants/tokens';
import * as Haptics from 'expo-haptics';
import React, { memo, useCallback } from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { AppText } from './AppText';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'solid' | 'glass';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const PrimaryButton = memo(
  ({
    label,
    onPress,
    variant = 'solid',
    loading,
    disabled,
    style,
  }: PrimaryButtonProps) => {
    const pressed = useSharedValue(0);

    const handlePressIn = useCallback(() => {
      pressed.value = withSpring(1, {
        mass: 1,
        damping: 15,
        stiffness: 300,
      });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, [pressed]);

    const handlePressOut = useCallback(() => {
      pressed.value = withSpring(0, {
        mass: 1,
        damping: 15,
        stiffness: 300,
      });
    }, [pressed]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        {
          scale: 1 - pressed.value * 0.05, // 1 to 0.95
        },
      ],
    }));

    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
      >
        <Animated.View
          style={[
            styles.base,
            variant === 'solid' ? styles.solid : styles.glass,
            animatedStyle,
            style,
          ]}
        >
          <AppText
            variant="subtitle"
            color={variant === 'solid' ? 'primary' : 'muted'}
            style={[styles.text, (loading || disabled) && styles.textDisabled]}
          >
            {loading ? 'Wait...' : label}
          </AppText>
        </Animated.View>
      </Pressable>
    );
  }
);

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
  },
  textDisabled: {
    opacity: 0.6,
  },
});
