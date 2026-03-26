import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Linking, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Clock,
  Eye,
  ThumbsUp,
  MessageCircle,
  Youtube,
  ExternalLink,
} from 'lucide-react-native';
import { Image } from 'expo-image';
import { AppText } from '@/components/AppText';
import { IconButton } from '@/components/IconButton';
import { GlassSurface } from '@/components/GlassSurface';
import { Chip } from '@/components/Chip';
import { StatPill } from '@/components/StatPill';
import { useVideo } from '@/hooks/useYouTube';
import { useWatchTime } from '@/hooks/useWatchTime';
import { useSettingsStore } from '@/services/settingsStore';
import { tokens } from '@/constants/tokens';
import { formatStat } from '@/utils/format';
import { DetailSkeleton } from '@/components/DetailSkeleton';
import { ErrorState } from '@/components/ErrorState';
import * as Haptics from 'expo-haptics';

export function VideoDetail({ id }: { id: string }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { playbackSpeed: defaultSpeed } = useSettingsStore();

  const [speed, setSpeed] = useState<number>(defaultSpeed);
  const { data: video, isLoading, isError, error, refetch } = useVideo(id);

  // Sync speed with global setting on mount or when setting changes
  useEffect(() => {
    setSpeed(defaultSpeed);
  }, [defaultSpeed]);

  const watchTime = useWatchTime(video ? [video] : [], speed);

  const handleWatchOnYouTube = () => {
    if (video) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Linking.openURL(`https://www.youtube.com/watch?v=${video.id}`);
    }
  };

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (isError || !video) {
    const err = error as { name?: string; code?: string };
    const errorType =
      err?.name === 'QuotaExceededError' || err?.code === 'quotaExceeded'
        ? 'quota'
        : 'api';
    return (
      <View style={[styles.container, styles.center]}>
        <ErrorState type={errorType} onRetry={() => refetch()} />
        <IconButton
          icon={ArrowLeft}
          onPress={() => router.back()}
          glassType="tertiary"
          style={styles.backButton}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.heroContainer}>
        <Image
          source={{ uri: video.thumbnail.url }}
          style={styles.heroImage}
          contentFit="cover"
        />
        <View
          style={[
            styles.headerOverlay,
            { top: insets.top + tokens.theme.spacing.sm },
          ]}
        >
          <IconButton
            icon={ArrowLeft}
            onPress={() => router.back()}
            glassType="tertiary"
          />
        </View>
      </View>

      <View style={styles.content}>
        <AppText variant="h2" style={styles.title}>
          {video.title}
        </AppText>
        <AppText variant="subtitle" color="muted" style={styles.channel}>
          {video.channelTitle}
        </AppText>

        <View style={styles.statsRow}>
          <StatPill icon={Eye} value={formatStat(video.viewCount)} />
          <StatPill icon={ThumbsUp} value={formatStat(video.likeCount)} />
          <StatPill
            icon={MessageCircle}
            value={formatStat(video.commentCount)}
          />
        </View>

        <GlassSurface type="secondary" style={styles.timeCard}>
          <View style={styles.timeHeader}>
            <Clock size={20} color={tokens.theme.colors.textPrimary} />
            <AppText variant="subtitle" style={styles.timeHeaderLabel}>
              Base Duration: {watchTime.totalFormatted}
            </AppText>
          </View>

          <AppText variant="caption" color="muted" style={styles.speedLabel}>
            Playback Speed
          </AppText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.speedRow}
            contentContainerStyle={styles.speedRowContent}
          >
            {[1, 1.25, 1.5, 1.75, 2, 2.5, 3].map((s) => (
              <Chip
                key={s}
                label={`${s}x`}
                selected={speed === s}
                onPress={() => {
                  setSpeed(s);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              />
            ))}
          </ScrollView>

          <View style={styles.timeResult}>
            <AppText variant="h1">{watchTime.timeAtSpeedFormatted}</AppText>
            {watchTime.timeSavedSeconds > 0 && (
              <AppText variant="h4" color="accent" style={styles.savedResult}>
                You save {watchTime.timeSavedFormatted}
              </AppText>
            )}
          </View>
        </GlassSurface>

        <Pressable
          style={({ pressed }) => [
            styles.youtubeButton,
            pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
          ]}
          onPress={handleWatchOnYouTube}
        >
          <Youtube color={tokens.theme.colors.accentPrimary} size={20} />
          <AppText
            variant="subtitle"
            color="accent"
            style={styles.youtubeButtonText}
          >
            Watch on YouTube
          </AppText>
          <ExternalLink color={tokens.theme.colors.accentPrimary} size={16} />
        </Pressable>

        <AppText variant="body" color="muted" style={styles.description}>
          {video.description}
        </AppText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.theme.colors.surfaceBg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  heroContainer: { width: '100%', height: 260, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  headerOverlay: {
    position: 'absolute',
    left: tokens.theme.spacing.lg,
    zIndex: 10,
  },
  backButton: { marginTop: tokens.theme.spacing.xl },
  content: { padding: tokens.theme.spacing.lg },
  title: { marginBottom: tokens.theme.spacing.xs },
  channel: { marginBottom: tokens.theme.spacing.xl },
  statsRow: {
    flexDirection: 'row',
    gap: tokens.theme.spacing.sm,
    marginBottom: tokens.theme.spacing.xxl,
    flexWrap: 'wrap',
  },
  timeCard: {
    padding: tokens.theme.spacing.xl,
    borderRadius: tokens.theme.radii.lg,
    marginBottom: tokens.theme.spacing.lg,
    borderWidth: 1,
    borderColor: tokens.theme.colors.borderSubtle,
  },
  timeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.theme.spacing.xl,
  },
  timeHeaderLabel: { marginLeft: tokens.theme.spacing.sm },
  speedLabel: {
    marginBottom: tokens.theme.spacing.sm,
    marginLeft: tokens.theme.spacing.xs,
  },
  speedRow: { marginBottom: tokens.theme.spacing.xl },
  speedRowContent: { gap: tokens.theme.spacing.sm },
  timeResult: {
    alignItems: 'center',
    paddingVertical: tokens.theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: tokens.theme.colors.borderSubtle,
  },
  savedResult: { marginTop: tokens.theme.spacing.xs },
  youtubeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.theme.colors.glassSecondary,
    padding: tokens.theme.spacing.md,
    borderRadius: tokens.theme.radii.md,
    marginBottom: tokens.theme.spacing.xxl,
    borderWidth: 1,
    borderColor: tokens.theme.colors.accentPrimary + '40',
  },
  youtubeButtonText: {
    marginHorizontal: tokens.theme.spacing.sm,
  },
  description: { marginTop: tokens.theme.spacing.sm, lineHeight: 24 },
});
