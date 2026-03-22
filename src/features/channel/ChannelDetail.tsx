import React from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Users, Video } from 'lucide-react-native';

import { AppText } from '@/components/AppText';
import { IconButton } from '@/components/IconButton';
import { StatPill } from '@/components/StatPill';
import { Chip } from '@/components/Chip';
import { ResultRow } from '@/features/search/components/ResultRow';
import { useChannel, usePlaylistItems, useVideos } from '@/hooks/useYouTube';
import { tokens } from '@/constants/tokens';
import { formatStat } from '@/utils/format';
import { ChannelHero } from './components/ChannelHero';

export function ChannelDetail({ id }: { id: string }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = React.useState<'uploads' | 'playlists'>(
    'uploads'
  );

  const { data: channel, isLoading, isError } = useChannel(id);

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
    return (
      <ActivityIndicator
        size="large"
        color={tokens.theme.colors.accentPrimary}
        style={{ flex: 1, backgroundColor: tokens.theme.colors.surfaceBg }}
      />
    );
  }

  if (isError || !channel) {
    return (
      <View style={[styles.container, styles.center]}>
        <AppText variant="h3" color="error">
          Error loading channel.
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
      <ChannelHero thumbnailUrl={channel.thumbnail.url} topInset={insets.top} />

      <View style={styles.content}>
        <AppText variant="h1" style={styles.title}>
          {channel.title}
        </AppText>

        <View style={styles.statsRow}>
          <StatPill icon={Users} value={formatStat(channel.subscriberCount)} />
          <StatPill icon={Video} value={formatStat(channel.videoCount)} />
        </View>

        <AppText variant="body" color="muted" style={styles.description}>
          {channel.description || 'No description provided.'}
        </AppText>

        <View style={styles.tabsContainer}>
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
                <ActivityIndicator color={tokens.theme.colors.accentPrimary} />
              ) : uploadVideos && uploadVideos.length > 0 ? (
                uploadVideos.map((video) => (
                  <View key={video.id} style={styles.videoRowWrapper}>
                    <ResultRow item={video} type="video" />
                  </View>
                ))
              ) : (
                <AppText variant="body" color="muted" style={styles.centerText}>
                  No recent uploads found.
                </AppText>
              )}
            </View>
          )}

          {activeTab === 'playlists' && (
            <View>
              <AppText variant="body" color="muted" style={styles.centerText}>
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
  container: { flex: 1, backgroundColor: tokens.theme.colors.surfaceBg },
  center: { justifyContent: 'center', alignItems: 'center' },

  content: { padding: tokens.theme.spacing.lg, alignItems: 'center' },
  title: { marginBottom: tokens.theme.spacing.xl, textAlign: 'center' },
  statsRow: {
    flexDirection: 'row',
    gap: tokens.theme.spacing.md,
    marginBottom: tokens.theme.spacing.xxl,
    justifyContent: 'center',
  },
  description: {
    marginTop: tokens.theme.spacing.sm,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: tokens.theme.spacing.xxl,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: tokens.theme.spacing.lg,
  },
  tabChip: {
    marginHorizontal: tokens.theme.spacing.xs,
  },
  tabContent: {
    width: '100%',
  },
  videoRowWrapper: {
    marginBottom: tokens.theme.spacing.sm,
  },
  centerText: {
    textAlign: 'center',
    marginTop: tokens.theme.spacing.xl,
  },
});
