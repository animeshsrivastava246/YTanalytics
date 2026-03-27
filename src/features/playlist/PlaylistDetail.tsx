import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Clock, Video } from 'lucide-react-native';
import { DetailSkeleton } from '@/components/DetailSkeleton';
import { ErrorState } from '@/components/ErrorState';
import { Skeleton } from '@/components/Skeleton';

import { AppText } from '@/components/AppText';
import { IconButton } from '@/components/IconButton';
import { GlassSurface } from '@/components/GlassSurface';
import { Chip } from '@/components/Chip';
import { StatPill } from '@/components/StatPill';
import { usePlaylist, usePlaylistItems, useVideos } from '@/hooks/useYouTube';
import { useWatchTime } from '@/hooks/useWatchTime';
import { ResultRow } from '@/features/search/components/ResultRow';
import { RawYouTubePlaylistItemDetails } from '@/services/youtube.types';
import { PlaylistHero } from './components/PlaylistHero';
import { SpeedInput } from '@/components/SpeedInput';
import { useAppTheme } from '@/context/ThemeProvider';
import * as Haptics from 'expo-haptics';

export function PlaylistDetail({ id }: { id: string }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, spacing, radii } = useAppTheme();

  const [speed, setSpeed] = useState<number>(1);

  const {
    data: playlist,
    isLoading: isPlaylistLoading,
    isError,
    error,
    refetch,
  } = usePlaylist(id);
  const { data: pages, isLoading: isItemsLoading } = usePlaylistItems(id);

  const videoIds = useMemo(() => {
    if (!pages) return [];
    return pages.pages
      .flatMap((page: { items: RawYouTubePlaylistItemDetails[] }) =>
        (page.items || []).map((item) => item.contentDetails?.videoId)
      )
      .filter(Boolean);
  }, [pages]);

  const { data: videos, isLoading: isVideosLoading } = useVideos(videoIds);
  const watchTime = useWatchTime(videos || [], speed);

  const isLoading = isPlaylistLoading || isItemsLoading;

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (!playlist || isError) {
    const err = error as { name?: string; code?: string } | undefined;
    const errorType =
      err?.name === 'QuotaExceededError' || err?.code === 'quotaExceeded'
        ? 'quota'
        : 'api';
    return (
      <View
        style={[
          styles.container,
          styles.center,
          { backgroundColor: colors.surfaceBg },
        ]}
      >
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
      style={[styles.container, { backgroundColor: colors.surfaceBg }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
    >
      <PlaylistHero
        thumbnailUrl={playlist.thumbnail.url}
        topInset={insets.top}
      />

      <View style={styles.content}>
        <AppText variant="h2" style={styles.title}>
          {playlist.title}
        </AppText>
        <AppText variant="subtitle" color="muted" style={styles.channel}>
          {playlist.channelTitle}
        </AppText>

        <View style={styles.statsRow}>
          <StatPill icon={Video} value={`${playlist.videoCount} videos`} />
        </View>

        <GlassSurface
          type="secondary"
          style={[
            styles.timeCard,
            {
              padding: spacing.xl,
              borderRadius: radii.lg,
              marginBottom: spacing.xxl,
              borderWidth: 1,
              borderColor: colors.borderSubtle,
            },
          ]}
        >
          <View style={[styles.timeHeader, { marginBottom: spacing.xl }]}>
            <Clock size={20} color={colors.textPrimary} />
            <AppText variant="subtitle" style={styles.timeHeaderLabel}>
              Total Playlist Duration: {watchTime.totalFormatted}
            </AppText>
          </View>

          <AppText variant="caption" color="muted" style={styles.speedLabel}>
            Playback Speed
          </AppText>
          <View style={styles.speedInputRow}>
            <SpeedInput
              value={speed}
              onChange={(s) => {
                setSpeed(s);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.presetScroll}
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
          </View>

          <View
            style={[
              styles.timeResult,
              {
                borderTopColor: colors.borderSubtle,
                paddingVertical: spacing.md,
              },
            ]}
          >
            {isVideosLoading ? (
              <Skeleton width={120} height={42} borderRadius={radii.sm} />
            ) : (
              <>
                <AppText variant="h1">{watchTime.timeAtSpeedFormatted}</AppText>
                {watchTime.timeSavedSeconds > 0 && (
                  <AppText
                    variant="h4"
                    color="accent"
                    style={styles.savedResult}
                  >
                    You save {watchTime.timeSavedFormatted}
                  </AppText>
                )}
              </>
            )}
          </View>
        </GlassSurface>

        <AppText variant="body" color="muted" style={styles.description}>
          {playlist.description}
        </AppText>

        <View style={styles.videoList}>
          <AppText variant="h3" style={styles.listTitle}>
            Videos
          </AppText>
          {videos && videos.length > 0 ? (
            videos.map((video, index) => (
              <View key={video.id} style={styles.videoRowWrapper}>
                <ResultRow item={video} type="video" index={index} />
              </View>
            ))
          ) : (
            <AppText variant="body" color="muted" style={styles.center}>
              No videos found in this playlist.
            </AppText>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },
  backButton: { marginTop: 24 },
  content: { padding: 16 },
  title: { marginBottom: 4 },
  channel: { marginBottom: 24 },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 32,
    flexWrap: 'wrap',
  },
  timeCard: {},
  timeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeHeaderLabel: { marginLeft: 8 },
  speedLabel: {
    marginBottom: 8,
    marginLeft: 4,
  },
  speedInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  presetScroll: {
    flex: 1,
    marginLeft: 12,
  },
  speedRowContent: { gap: 8 },
  timeResult: {
    alignItems: 'center',
    borderTopWidth: 1,
  },
  savedResult: { marginTop: 4 },
  description: {
    marginTop: 24,
    lineHeight: 24,
    marginBottom: 32,
  },
  videoList: {
    marginTop: 16,
  },
  listTitle: {
    marginBottom: 12,
  },
  videoRowWrapper: {
    marginBottom: 8,
  },
});
