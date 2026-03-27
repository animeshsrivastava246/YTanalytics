import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Users, Video } from 'lucide-react-native';
import { DetailSkeleton } from '@/components/DetailSkeleton';
import { ErrorState } from '@/components/ErrorState';
import { CardSkeleton } from '@/components/CardSkeleton';

import { AppText } from '@/components/AppText';
import { IconButton } from '@/components/IconButton';
import { StatPill } from '@/components/StatPill';
import { Chip } from '@/components/Chip';
import { ResultRow } from '@/features/search/components/ResultRow';
import { useChannel, usePlaylistItems, useVideos } from '@/hooks/useYouTube';
import { formatStat } from '@/utils/format';
import { ChannelHero } from './components/ChannelHero';
import { useAppTheme } from '@/context/ThemeProvider';

export function ChannelDetail({ id }: { id: string }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, spacing } = useAppTheme();
  const [activeTab, setActiveTab] = React.useState<'uploads' | 'playlists'>(
    'uploads'
  );

  const { data: channel, isLoading, isError, error, refetch } = useChannel(id);

  // Fetch uploads if uploads tab is active and we have the playlist ID
  const { data: uploadsPages, isLoading: isUploadsLoading } = usePlaylistItems(
    channel?.uploadsPlaylistId || ''
  );

  const uploadVideoIds = React.useMemo(() => {
    if (!uploadsPages) return [];
    return uploadsPages.pages
      .flatMap(
        (p: { items?: { contentDetails?: { videoId?: string } }[] }) =>
          p.items || []
      )
      .map((item) => item.contentDetails?.videoId)
      .filter((id): id is string => !!id);
  }, [uploadsPages]);

  const { data: uploadVideos, isLoading: isUploadVideosLoading } =
    useVideos(uploadVideoIds);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (isError || !channel) {
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
      <ChannelHero thumbnailUrl={channel.thumbnail.url} topInset={insets.top} />

      <View style={styles.content}>
        <AppText
          variant="h1"
          style={[styles.title, { marginBottom: spacing.xl }]}
        >
          {channel.title}
        </AppText>

        <View
          style={[
            styles.statsRow,
            { gap: spacing.md, marginBottom: spacing.xxl },
          ]}
        >
          <StatPill icon={Users} value={formatStat(channel.subscriberCount)} />
          <StatPill icon={Video} value={formatStat(channel.videoCount)} />
        </View>

        <AppText
          variant="body"
          color="muted"
          style={[
            styles.description,
            { marginTop: spacing.sm, marginBottom: spacing.xxl },
          ]}
        >
          {channel.description || 'No description provided.'}
        </AppText>

        <View style={[styles.tabsContainer, { marginBottom: spacing.lg }]}>
          <Chip
            label="Uploads"
            selected={activeTab === 'uploads'}
            onPress={() => setActiveTab('uploads')}
            style={styles.tabChip}
          />
          <Chip
            label="Playlists"
            selected={activeTab === 'playlists'}
            onPress={() => setActiveTab('playlists')}
            style={styles.tabChip}
          />
        </View>

        <View style={styles.tabContent}>
          {activeTab === 'uploads' && (
            <View>
              {isUploadsLoading || isUploadVideosLoading ? (
                <View>
                  {[1, 2, 3].map((i) => (
                    <CardSkeleton key={i} type="video" />
                  ))}
                </View>
              ) : uploadVideos && uploadVideos.length > 0 ? (
                uploadVideos.map((video, index) => (
                  <View key={video.id} style={styles.videoRowWrapper}>
                    <ResultRow item={video} type="video" index={index} />
                  </View>
                ))
              ) : (
                <AppText
                  variant="body"
                  color="muted"
                  style={[styles.centerText, { marginTop: spacing.xl }]}
                >
                  No recent uploads found.
                </AppText>
              )}
            </View>
          )}

          {activeTab === 'playlists' && (
            <View>
              <AppText
                variant="body"
                color="muted"
                style={[styles.centerText, { marginTop: spacing.xl }]}
              >
                Curated playlists feature coming soon.
              </AppText>
            </View>
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
  content: { padding: 16, alignItems: 'center' },
  title: { textAlign: 'center' },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  description: {
    lineHeight: 24,
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tabChip: {
    marginHorizontal: 4,
  },
  tabContent: {
    width: '100%',
  },
  videoRowWrapper: {
    marginBottom: 8,
  },
  centerText: {
    textAlign: 'center',
  },
});
