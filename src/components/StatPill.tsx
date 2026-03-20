import React, { memo } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { AppText } from './AppText';
import { GlassSurface } from './GlassSurface';
import { tokens } from '@/constants/tokens';

interface StatPillProps {
  icon?: LucideIcon;
  value: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export const StatPill = memo(
  ({ icon: Icon, value, color, style }: StatPillProps) => {
    const textColor = color || tokens.theme.colors.textPrimary;

    return (
      <View style={[styles.wrapper, style]}>
        <GlassSurface type="tertiary" style={styles.surface}>
          <View style={styles.content}>
            {Icon && <Icon size={12} color={textColor} style={styles.icon} />}
            <AppText variant="caption" style={{ color: textColor }}>
              {value}
            </AppText>
          </View>
        </GlassSurface>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: tokens.theme.radii.xs,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  surface: {
    paddingHorizontal: tokens.theme.spacing.sm,
    paddingVertical: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
});
