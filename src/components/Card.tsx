import React, { ReactNode, memo, useCallback } from 'react';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  FadeInDown,
} from 'react-native-reanimated';
import {
  StyleSheet,
  ViewStyle,
  View,
  StyleProp,
  Pressable,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { GlassSurface } from './GlassSurface';
import { tokens } from '@/constants/tokens';

interface CardProps {
  onPress?: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  index?: number;
}

export const Card = memo(
  ({ onPress, children, style, contentStyle, index }: CardProps) => {
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
          scale: 1 - pressed.value * 0.02, // 1 to 0.98
        },
      ],
    }));

    const content = (
      <GlassSurface
        type="secondary"
        isInteractive={!!onPress}
        style={[styles.surface, contentStyle]}
      >
        {children}
      </GlassSurface>
    );

    return (
      <Animated.View
        entering={
          index !== undefined
            ? FadeInDown.delay(index * 50).springify()
            : undefined
        }
        style={[styles.marginWrapper, style]}
      >
        {onPress ? (
          <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Animated.View style={animatedStyle}>
              <View style={styles.pressableContainer}>{content}</View>
            </Animated.View>
          </Pressable>
        ) : (
          <View style={styles.pressableContainer}>{content}</View>
        )}
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  marginWrapper: {
    marginVertical: tokens.theme.spacing.sm,
  },
  pressableContainer: {
    width: '100%',
  },
  surface: {
    borderRadius: tokens.theme.radii.lg,
    padding: tokens.theme.spacing.lg,
    borderWidth: 1,
    borderColor: tokens.theme.colors.borderSubtle,
  },
});
