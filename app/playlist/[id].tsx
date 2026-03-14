import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Clock, Video } from 'lucide-react-native';
import { Image } from 'expo-image';
import { AppText } from '@/components/AppText';
import { IconButton } from '@/components/IconButton';
import { GlassSurface } from '@/components/GlassSurface';
import { Chip } from '@/components/Chip';
import { StatPill } from '@/components/StatPill';
import { usePlaylist, usePlaylistItems, useVideos } from '@/hooks/useYouTube';
import { useWatchTime } from '@/hooks/useWatchTime';
import { tokens } from '@/constants/tokens';

export default function PlaylistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [speed, setSpeed] = useState<number>(1);
  
  const { data: playlist, isLoading: isPlaylistLoading } = usePlaylist(id as string);
  const { data: pages, isLoading: isItemsLoading } = usePlaylistItems(id as string);

  const videoIds = useMemo(() => {
    if (!pages) return [];
    return pages.pages.flatMap((page: any) => 
      (page.items || []).map((item: any) => item.contentDetails?.videoId)
    ).filter(Boolean);
  }, [pages]);

  const { data: videos, isLoading: isVideosLoading } = useVideos(videoIds);
  const watchTime = useWatchTime(videos || [], speed);

  const isLoading = isPlaylistLoading || isItemsLoading;

  if (isLoading) {
    return <ActivityIndicator size="large" color={tokens.theme.colors.accentPrimary} style={{ flex: 1, backgroundColor: tokens.theme.colors.surfaceBg }} />;
  }

  if (!playlist) {
    return (
      <View style={[styles.container, styles.center]}>
        <AppText variant="h3" color="error">Error loading playlist.</AppText>
        <IconButton icon={ArrowLeft} onPress={() => router.back()} glassType="tertiary" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
      <View style={styles.heroContainer}>
        <Image 
          source={{ uri: playlist.thumbnail.url }} 
          style={styles.heroImageBlur} 
          blurRadius={40}
          contentFit="cover" 
        />
        <View style={styles.heroImageOverlay} />
        
        <View style={[styles.headerOverlay, { top: insets.top }]}>
          <IconButton icon={ArrowLeft} onPress={() => router.back()} glassType="tertiary" />
        </View>

        <Image 
          source={{ uri: playlist.thumbnail.url }} 
          style={styles.heroImageClear} 
          contentFit="contain" 
        />
      </View>

      <View style={styles.content}>
        <AppText variant="h2" style={styles.title}>{playlist.title}</AppText>
        <AppText variant="subtitle" color="muted" style={styles.channel}>{playlist.channelTitle}</AppText>

        <View style={styles.statsRow}>
          <StatPill icon={Video} value={`${playlist.videoCount} videos`} />
        </View>

        <GlassSurface type="secondary" style={styles.timeCard}>
          <View style={styles.timeHeader}>
            <Clock size={20} color={tokens.theme.colors.textPrimary} />
            <AppText variant="subtitle" style={{ marginLeft: 8 }}>Total Playlist Duration: {watchTime.totalFormatted}</AppText>
          </View>

          <AppText variant="caption" color="muted" style={styles.speedLabel}>Playback Speed</AppText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.speedRow}>
            {[1, 1.25, 1.5, 1.75, 2, 2.5, 3].map(s => (
              <Chip key={s} label={`${s}x`} selected={speed === s} onPress={() => setSpeed(s)} />
            ))}
          </ScrollView>

          <View style={styles.timeResult}>
            {isVideosLoading ? (
               <ActivityIndicator color={tokens.theme.colors.textPrimary} size="small" />
            ) : (
               <>
                 <AppText variant="h1">{watchTime.timeAtSpeedFormatted}</AppText>
                 {watchTime.timeSavedSeconds > 0 && (
                   <AppText variant="h4" color="accent" style={styles.savedResult}>
                     Saved: {watchTime.timeSavedFormatted}
                   </AppText>
                 )}
               </>
            )}
          </View>
        </GlassSurface>

        <AppText variant="body" color="muted" style={styles.description}>
          {playlist.description}
        </AppText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.theme.colors.surfaceBg },
  center: { justifyContent: 'center', alignItems: 'center' },
  heroContainer: { width: '100%', height: 300, position: 'relative', justifyContent: 'center', alignItems: 'center' },
  heroImageBlur: { position: 'absolute', width: '100%', height: '100%', opacity: 0.5 },
  heroImageOverlay: { position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)' },
  heroImageClear: { width: '80%', height: '60%', borderRadius: tokens.theme.radii.md, zIndex: 5, marginTop: 40 },
  headerOverlay: { position: 'absolute', top: 40, left: 16, zIndex: 10 },
  content: { padding: tokens.theme.spacing.lg },
  title: { marginBottom: 4 },
  channel: { marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 24, flexWrap: 'wrap' },
  timeCard: { padding: 16, borderRadius: tokens.theme.radii.lg, marginBottom: 24 },
  timeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  speedLabel: { marginBottom: 8, marginLeft: 4 },
  speedRow: { marginBottom: 16 },
  timeResult: { alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: tokens.theme.colors.borderSubtle },
  savedResult: { marginTop: 4 },
  description: { marginTop: 16, lineHeight: 24 },
});
