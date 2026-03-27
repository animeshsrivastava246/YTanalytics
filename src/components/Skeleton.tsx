import React, { useEffect, memo } from 'react';
import { ViewStyle, StyleProp, DimensionValue } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  useSharedValue,
} from 'react-native-reanimated';
import { useAppTheme } from '@/context/ThemeProvider';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export const Skeleton = memo(
  ({ width, height, borderRadius, style }: SkeletonProps) => {
    const { colors, radii } = useAppTheme();
    const opacity = useSharedValue(0.3);

    useEffect(() => {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 800 }),
          withTiming(0.3, { duration: 800 })
        ),
        -1,
        true
      );
    }, [opacity]);

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
    }));

    const defaultBorderRadius = borderRadius ?? radii.sm;

    return (
      <Animated.View
        style={[
          {
            width,
            height,
            borderRadius: defaultBorderRadius,
            backgroundColor: colors.glassSecondary,
          },
          animatedStyle,
          style,
        ]}
      />
    );
  }
);
