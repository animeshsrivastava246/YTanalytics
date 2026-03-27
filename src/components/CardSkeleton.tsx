import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from './Skeleton';
import { GlassSurface } from './GlassSurface';
import { useAppTheme } from '@/context/ThemeProvider';

interface CardSkeletonProps {
  type?: 'video' | 'playlist' | 'channel';
}

export function CardSkeleton({ type = 'video' }: CardSkeletonProps) {
  const { colors, spacing, radii } = useAppTheme();

  return (
    <GlassSurface
      type="secondary"
      style={[
        styles.container,
        {
          padding: spacing.md,
          marginVertical: spacing.sm,
          borderRadius: radii.lg,
          borderColor: colors.borderSubtle,
        },
      ]}
    >
      <Skeleton
        width={type === 'channel' ? 60 : 100}
        height={60}
        borderRadius={type === 'channel' ? radii.pill : radii.sm}
        style={{ marginRight: spacing.md }}
      />

      <View style={styles.content}>
        <Skeleton
          width="80%"
          height={20}
          borderRadius={radii.xs}
          style={styles.title}
        />
        <Skeleton width="40%" height={16} borderRadius={radii.xs} />
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  content: {
    flex: 1,
  },
  title: {
    marginBottom: 8,
  },
});
