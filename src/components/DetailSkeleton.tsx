import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Skeleton } from './Skeleton';
import { GlassSurface } from './GlassSurface';
import { tokens } from '@/constants/tokens';

export const DetailSkeleton = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Image Skeleton */}
      <Skeleton width="100%" height={260} borderRadius={0} />

      <View style={styles.content}>
        {/* Title & Channel Skeleton */}
        <Skeleton width="90%" height={32} style={styles.title} />
        <Skeleton width="60%" height={32} style={styles.title} />
        <Skeleton width="40%" height={20} style={styles.channel} />

        {/* Stats Row Skeleton */}
        <View style={styles.statsRow}>
          <Skeleton
            width={80}
            height={32}
            borderRadius={tokens.theme.radii.pill}
          />
          <Skeleton
            width={80}
            height={32}
            borderRadius={tokens.theme.radii.pill}
          />
          <Skeleton
            width={80}
            height={32}
            borderRadius={tokens.theme.radii.pill}
          />
        </View>

        {/* Main Card Skeleton */}
        <GlassSurface type="secondary" style={styles.timeCard}>
          <View style={styles.timeHeader}>
            <Skeleton width={24} height={24} borderRadius={12} />
            <Skeleton width={150} height={20} style={styles.marginLeft} />
          </View>
          <Skeleton width="100%" height={40} style={styles.marginTop} />
          <View style={[styles.center, styles.marginTopLg]}>
            <Skeleton width={200} height={48} />
            <Skeleton width={150} height={24} style={styles.marginTop} />
          </View>
        </GlassSurface>

        {/* Description Skeleton */}
        <Skeleton width="100%" height={16} style={styles.descLine} />
        <Skeleton width="100%" height={16} style={styles.descLine} />
        <Skeleton width="90%" height={16} style={styles.descLine} />
        <Skeleton width="80%" height={16} style={styles.descLine} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.theme.colors.surfaceBg },
  content: { padding: tokens.theme.spacing.lg },
  title: { marginBottom: tokens.theme.spacing.sm },
  channel: {
    marginBottom: tokens.theme.spacing.xl,
    marginTop: tokens.theme.spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: tokens.theme.spacing.sm,
    marginBottom: tokens.theme.spacing.xxl,
  },
  timeCard: {
    padding: tokens.theme.spacing.xl,
    borderRadius: tokens.theme.radii.lg,
    marginBottom: tokens.theme.spacing.xxl,
    borderWidth: 1,
    borderColor: tokens.theme.colors.borderSubtle,
  },
  timeHeader: { flexDirection: 'row', alignItems: 'center' },
  marginLeft: { marginLeft: tokens.theme.spacing.sm },
  marginTop: { marginTop: tokens.theme.spacing.md },
  marginTopLg: { marginTop: tokens.theme.spacing.xl },
  center: { alignItems: 'center' },
  descLine: { marginBottom: tokens.theme.spacing.sm },
});
