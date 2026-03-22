import React, { ReactNode, memo } from 'react';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  FadeInUp,
} from 'react-native-reanimated';
import {
  Pressable,
  StyleSheet,
  ViewStyle,
  View,
  StyleProp,
} from 'react-native';
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
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
      scale.value = withSpring(0.98, { damping: 20, stiffness: 300 });
    };
    const handlePressOut = () => {
      scale.value = withSpring(1, { damping: 20, stiffness: 300 });
    };

    const content = (
      <GlassSurface type="secondary" style={[styles.surface, contentStyle]}>
        {children}
      </GlassSurface>
    );

    return (
      <Animated.View
        entering={
          index !== undefined
            ? FadeInUp.delay(index * 100).springify()
            : undefined
        }
        style={[styles.marginWrapper, style]}
      >
        <Animated.View style={animatedStyle}>
          {onPress ? (
            <Pressable
              onPress={onPress}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={styles.pressableContainer}
            >
              {content}
            </Pressable>
          ) : (
            <View style={styles.pressableContainer}>{content}</View>
          )}
        </Animated.View>
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
