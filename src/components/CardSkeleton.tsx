import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from './Skeleton';
import { GlassSurface } from './GlassSurface';
import { tokens } from '@/constants/tokens';

interface CardSkeletonProps {
  type?: 'video' | 'playlist' | 'channel';
}

export const CardSkeleton = ({ type = 'video' }: CardSkeletonProps) => {
  return (
    <GlassSurface type="secondary" style={styles.card}>
      <View style={styles.row}>
        {/* Thumbnail/Avatar Skeleton */}
        <View style={styles.thumbnailContainer}>
          <Skeleton
            width={type === 'channel' ? 68 : 120}
            height={68}
            borderRadius={
              type === 'channel'
                ? tokens.theme.radii.pill
                : tokens.theme.radii.sm
            }
          />
        </View>

        {/* Info Skeleton */}
        <View style={styles.info}>
          <Skeleton width="90%" height={20} style={styles.title} />
          <Skeleton width="60%" height={20} style={styles.title} />
          <Skeleton
            width="40%"
            height={14}
            borderRadius={tokens.theme.radii.xs}
          />
        </View>
      </View>
    </GlassSurface>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: tokens.theme.spacing.md,
    marginVertical: tokens.theme.spacing.sm,
    borderRadius: tokens.theme.radii.lg,
    borderWidth: 1,
    borderColor: tokens.theme.colors.borderSubtle,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  thumbnailContainer: {
    marginRight: tokens.theme.spacing.md,
  },
  info: { flex: 1, justifyContent: 'center' },
  title: { marginBottom: tokens.theme.spacing.xs },
});
