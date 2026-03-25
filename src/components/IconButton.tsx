import React, { memo, useCallback } from 'react';
import Animated, {
  useAnimatedStyle,
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
import { LucideIcon } from 'lucide-react-native';
import { GlassSurface } from './GlassSurface';
import { tokens } from '@/constants/tokens';

interface IconButtonProps {
  icon: LucideIcon;
  size?: number;
  color?: string;
  onPress?: () => void;
  glassType?: 'tertiary' | 'none';
  style?: StyleProp<ViewStyle>;
}

export const IconButton = memo(
  ({
    icon: Icon,
    size = 24,
    color,
    onPress,
    glassType = 'tertiary',
    style,
  }: IconButtonProps) => {
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

    const iconColor = color || tokens.theme.colors.textPrimary;

    const content = (
      <View style={[styles.base, style]}>
        <Icon size={size} color={iconColor} />
      </View>
    );

    const renderInner = () => {
      if (glassType === 'none') {
        return <Animated.View style={animatedStyle}>{content}</Animated.View>;
      }
      return (
        <Animated.View style={[animatedStyle, styles.glassWrapper]}>
          <GlassSurface
            type={glassType}
            isInteractive={!!onPress}
            style={styles.glassSurface}
          >
            {content}
          </GlassSurface>
        </Animated.View>
      );
    };

    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {renderInner()}
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  base: {
    padding: tokens.theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassWrapper: {
    borderRadius: tokens.theme.radii.pill,
    overflow: 'hidden',
  },
  glassSurface: {
    borderRadius: tokens.theme.radii.pill,
  },
});
