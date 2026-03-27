import React, { memo, useCallback } from 'react';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import {
  StyleSheet,
  ViewStyle,
  StyleProp,
  View,
  Pressable,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { AppText } from './AppText';
import { GlassSurface } from './GlassSurface';
import { useAppTheme } from '@/context/ThemeProvider';

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export const Chip = memo(({ label, selected, onPress, style }: ChipProps) => {
  const { colors, spacing, radii } = useAppTheme();
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
        scale: 1 - pressed.value * 0.08, // 1 to 0.92
      },
    ],
    backgroundColor: withTiming(
      selected ? colors.accentSecondary : colors.glassSecondary,
      { duration: 150 }
    ),
    borderColor: withTiming(
      selected ? colors.accentSecondary : colors.borderSubtle,
      { duration: 150 }
    ),
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.container,
          {
            borderRadius: radii.pill,
            marginRight: spacing.sm,
          },
          animatedStyle,
          style,
        ]}
      >
        <GlassSurface
          type="tertiary"
          isInteractive
          style={[styles.glassSurface, { borderRadius: radii.pill }]}
        >
          <View
            style={[
              styles.content,
              {
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.lg,
              },
            ]}
          >
            <AppText variant="caption" color={selected ? 'primary' : 'muted'}>
              {label}
            </AppText>
          </View>
        </GlassSurface>
      </Animated.View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  glassSurface: {},
  content: {},
});
