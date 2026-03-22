import React, { memo } from 'react';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { Pressable, StyleSheet, ViewStyle, StyleProp } from 'react-native';
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
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
      scale.value = withSpring(0.96, { damping: 20, stiffness: 300 });
    };
    const handlePressOut = () => {
      scale.value = withSpring(1, { damping: 20, stiffness: 300 });
    };

    const iconColor = color || tokens.theme.colors.textPrimary;

    const content = (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.base, style]}
      >
        <Icon size={size} color={iconColor} />
      </Pressable>
    );

    if (glassType === 'none') {
      return <Animated.View style={animatedStyle}>{content}</Animated.View>;
    }

    return (
      <Animated.View style={[animatedStyle, styles.glassWrapper]}>
        <GlassSurface type={glassType} style={styles.glassSurface}>
          {content}
        </GlassSurface>
      </Animated.View>
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
