import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Clock, Video } from 'lucide-react-native';

import { AppText } from '@/components/AppText';
import { IconButton } from '@/components/IconButton';
import { GlassSurface } from '@/components/GlassSurface';
import { Chip } from '@/components/Chip';
import { StatPill } from '@/components/StatPill';
import { usePlaylist, usePlaylistItems, useVideos } from '@/hooks/useYouTube';
import { useWatchTime } from '@/hooks/useWatchTime';
import { tokens } from '@/constants/tokens';
import { ResultRow } from '@/features/search/components/ResultRow';
import { RawYouTubePlaylistItemDetails } from '@/services/youtube.types';
import { PlaylistHero } from './components/PlaylistHero';

export function PlaylistDetail({ id }: { id: string }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [speed, setSpeed] = useState<number>(1);

  const { data: playlist, isLoading: isPlaylistLoading } = usePlaylist(id);
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
    return (
      <ActivityIndicator
        size="large"
        color={tokens.theme.colors.accentPrimary}
        style={{ flex: 1, backgroundColor: tokens.theme.colors.surfaceBg }}
      />
    );
  }

  if (!playlist) {
    return (
      <View style={[styles.container, styles.center]}>
        <AppText variant="h3" color="error">
          Error loading playlist.
        </AppText>
        <IconButton
          icon={ArrowLeft}
          onPress={() => router.back()}
          glassType="tertiary"
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
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

        <GlassSurface type="secondary" style={styles.timeCard}>
          <View style={styles.timeHeader}>
            <Clock size={20} color={tokens.theme.colors.textPrimary} />
            <AppText variant="subtitle" style={styles.timeHeaderLabel}>
              Total Playlist Duration: {watchTime.totalFormatted}
            </AppText>
          </View>

          <AppText variant="caption" color="muted" style={styles.speedLabel}>
            Playback Speed
          </AppText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.speedRow}
          >
            {[1, 1.25, 1.5, 1.75, 2, 2.5, 3].map((s) => (
              <Chip
                key={s}
                label={`${s}x`}
                selected={speed === s}
                onPress={() => setSpeed(s)}
              />
            ))}
          </ScrollView>

          <View style={styles.timeResult}>
            {isVideosLoading ? (
              <ActivityIndicator
                color={tokens.theme.colors.textPrimary}
                size="small"
              />
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
  container: { flex: 1, backgroundColor: tokens.theme.colors.surfaceBg },
  center: { justifyContent: 'center', alignItems: 'center' },

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
    marginBottom: tokens.theme.spacing.xxl,
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
  timeResult: {
    alignItems: 'center',
    paddingVertical: tokens.theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: tokens.theme.colors.borderSubtle,
  },
  savedResult: { marginTop: tokens.theme.spacing.xs },
  description: {
    marginTop: tokens.theme.spacing.xl,
    lineHeight: 24,
    marginBottom: tokens.theme.spacing.xxl,
  },
  videoList: {
    marginTop: tokens.theme.spacing.lg,
  },
  listTitle: {
    marginBottom: tokens.theme.spacing.md,
  },
  videoRowWrapper: {
    marginBottom: tokens.theme.spacing.sm,
  },
});
