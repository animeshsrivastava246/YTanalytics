import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Clock, Eye, ThumbsUp, MessageCircle } from 'lucide-react-native';
import { Image } from 'expo-image';
import { AppText } from '@/components/AppText';
import { IconButton } from '@/components/IconButton';
import { GlassSurface } from '@/components/GlassSurface';
import { Chip } from '@/components/Chip';
import { StatPill } from '@/components/StatPill';
import { useVideo } from '@/hooks/useYouTube';
import { useWatchTime } from '@/hooks/useWatchTime';
import { tokens } from '@/constants/tokens';

export default function VideoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [speed, setSpeed] = useState<number>(1);
  const { data: video, isLoading, isError } = useVideo(id as string);
  
  // Create an array so we can pass it to useWatchTime
  const watchTime = useWatchTime(video ? [video] : [], speed);

  if (isLoading) {
    return <ActivityIndicator size="large" color={tokens.theme.colors.accentPrimary} style={{ flex: 1, backgroundColor: tokens.theme.colors.surfaceBg }} />;
  }

  if (isError || !video) {
    return (
      <View style={[styles.container, styles.center]}>
        <AppText variant="h3" color="error">Error loading video.</AppText>
        <IconButton icon={ArrowLeft} onPress={() => router.back()} glassType="tertiary" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
      <View style={styles.heroContainer}>
        <Image 
          source={{ uri: video.thumbnail.url }} 
          style={styles.heroImage} 
          contentFit="cover" 
        />
        <View style={[styles.headerOverlay, { top: insets.top }]}>
          <IconButton icon={ArrowLeft} onPress={() => router.back()} glassType="tertiary" />
        </View>
      </View>

      <View style={styles.content}>
        <AppText variant="h2" style={styles.title}>{video.title}</AppText>
        <AppText variant="subtitle" color="muted" style={styles.channel}>{video.channelTitle}</AppText>

        <View style={styles.statsRow}>
          <StatPill icon={Eye} value={formatStat(video.viewCount)} />
          <StatPill icon={ThumbsUp} value={formatStat(video.likeCount)} />
          <StatPill icon={MessageCircle} value={formatStat(video.commentCount)} />
        </View>

        <GlassSurface type="secondary" style={styles.timeCard}>
          <View style={styles.timeHeader}>
            <Clock size={20} color={tokens.theme.colors.textPrimary} />
            <AppText variant="subtitle" style={{ marginLeft: 8 }}>Base Duration: {watchTime.totalFormatted}</AppText>
          </View>

          <AppText variant="caption" color="muted" style={styles.speedLabel}>Playback Speed</AppText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.speedRow}>
            {[1, 1.25, 1.5, 1.75, 2, 2.5, 3].map(s => (
              <Chip key={s} label={`${s}x`} selected={speed === s} onPress={() => setSpeed(s)} />
            ))}
          </ScrollView>

          <View style={styles.timeResult}>
            <AppText variant="h1">{watchTime.timeAtSpeedFormatted}</AppText>
            {watchTime.timeSavedSeconds > 0 && (
              <AppText variant="h4" color="accent" style={styles.savedResult}>
                Saved: {watchTime.timeSavedFormatted}
              </AppText>
            )}
          </View>
        </GlassSurface>

        <AppText variant="body" color="muted" style={styles.description}>
          {video.description}
        </AppText>
      </View>
    </ScrollView>
  );
}

function formatStat(num?: number): string {
  if (!num) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.theme.colors.surfaceBg },
  center: { justifyContent: 'center', alignItems: 'center' },
  heroContainer: { width: '100%', height: 260, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
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
