import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { GlassSurface } from './GlassSurface';
import { Skeleton } from './Skeleton';
import { useAppTheme } from '@/context/ThemeProvider';

export function DetailSkeleton() {
  const { colors, spacing, radii } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceBg }]}>
      <Skeleton width="100%" height={260} />

      <ScrollView
        contentContainerStyle={[styles.content, { padding: spacing.lg }]}
      >
        <Skeleton
          width="90%"
          height={32}
          borderRadius={radii.sm}
          style={[styles.title, { marginBottom: spacing.sm }]}
        />
        <Skeleton
          width="50%"
          height={20}
          borderRadius={radii.sm}
          style={{ marginBottom: spacing.xl, marginTop: spacing.xs }}
        />

        <View
          style={[
            styles.statsRow,
            { gap: spacing.sm, marginBottom: spacing.xxl },
          ]}
        >
          <Skeleton width={100} height={32} borderRadius={radii.pill} />
          <Skeleton width={100} height={32} borderRadius={radii.pill} />
          <Skeleton width={100} height={32} borderRadius={radii.pill} />
        </View>

        <GlassSurface
          type="secondary"
          style={[
            styles.timeCard,
            {
              padding: spacing.xl,
              borderRadius: radii.lg,
              marginBottom: spacing.xxl,
              borderColor: colors.borderSubtle,
            },
          ]}
        >
          <Skeleton width="60%" height={24} borderRadius={radii.sm} />
          <Skeleton
            width="100%"
            height={48}
            borderRadius={radii.sm}
            style={{ marginTop: spacing.md }}
          />
          <View style={[styles.center, { marginTop: spacing.xl }]}>
            <Skeleton width="50%" height={42} borderRadius={radii.sm} />
          </View>
        </GlassSurface>

        <View>
          <Skeleton
            width="100%"
            height={20}
            borderRadius={radii.xs}
            style={{ marginBottom: spacing.sm }}
          />
          <Skeleton
            width="100%"
            height={20}
            borderRadius={radii.xs}
            style={{ marginBottom: spacing.sm }}
          />
          <Skeleton
            width="80%"
            height={20}
            borderRadius={radii.xs}
            style={{ marginBottom: spacing.sm }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {},
  title: {},
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeCard: {
    borderWidth: 1,
  },
  center: { alignItems: 'center' },
});
