import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { AppText } from './AppText';
import { GlassSurface } from './GlassSurface';
import { useAppTheme } from '@/context/ThemeProvider';

interface StatPillProps {
  icon: LucideIcon;
  label?: string;
  value: string;
}

export function StatPill({ icon: Icon, label, value }: StatPillProps) {
  const { colors, spacing, radii } = useAppTheme();

  return (
    <View style={styles.container}>
      <GlassSurface
        type="secondary"
        style={[
          styles.pill,
          {
            paddingVertical: spacing.xs,
            paddingHorizontal: spacing.sm,
            borderRadius: radii.pill,
            borderColor: colors.borderSubtle,
          },
        ]}
      >
        <Icon size={14} color={colors.accentPrimary} strokeWidth={2} />
        {label && (
          <AppText
            variant="caption"
            color="muted"
            style={[styles.label, { marginLeft: spacing.xs }]}
          >
            {label}:
          </AppText>
        )}
        <AppText
          variant="caption"
          style={[
            styles.value,
            { marginLeft: spacing.xs, color: colors.textPrimary },
          ]}
        >
          {value}
        </AppText>
      </GlassSurface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  label: {},
  value: {
    fontWeight: '600',
  },
});
