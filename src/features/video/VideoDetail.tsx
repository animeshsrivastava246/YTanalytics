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
import { formatStat } from '@/utils/format';
import { DetailSkeleton } from '@/components/DetailSkeleton';
import { ErrorState } from '@/components/ErrorState';
import { SpeedInput } from '@/components/SpeedInput';
import { useAppTheme } from '@/context/ThemeProvider';
import * as Haptics from 'expo-haptics';

export function VideoDetail({ id }: { id: string }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, spacing, radii } = useAppTheme();
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
            { top: insets.top + spacing.sm, left: spacing.lg },
          ]}
        >
          <IconButton
            icon={ArrowLeft}
            onPress={() => router.back()}
            glassType="tertiary"
          />
        </View>
      </View>

      <View style={[styles.content, { padding: spacing.lg }]}>
        <AppText
          variant="h2"
          style={[styles.title, { marginBottom: spacing.xs }]}
        >
          {video.title}
        </AppText>
        <AppText
          variant="subtitle"
          color="muted"
          style={[styles.channel, { marginBottom: spacing.xl }]}
        >
          {video.channelTitle}
        </AppText>

        <View
          style={[
            styles.statsRow,
            { gap: spacing.sm, marginBottom: spacing.xxl },
          ]}
        >
          <StatPill icon={Eye} value={formatStat(video.viewCount)} />
          <StatPill icon={ThumbsUp} value={formatStat(video.likeCount)} />
          <StatPill
            icon={MessageCircle}
            value={formatStat(video.commentCount)}
          />
        </View>

        <GlassSurface
          type="secondary"
          style={[
            styles.timeCard,
            {
              padding: spacing.xl,
              borderRadius: radii.lg,
              marginBottom: spacing.lg,
              borderWidth: 1,
              borderColor: colors.borderSubtle,
            },
          ]}
        >
          <View style={[styles.timeHeader, { marginBottom: spacing.xl }]}>
            <Clock size={20} color={colors.textPrimary} />
            <AppText variant="subtitle" style={styles.timeHeaderLabel}>
              Base Duration: {watchTime.totalFormatted}
            </AppText>
          </View>

          <AppText
            variant="caption"
            color="muted"
            style={[
              styles.speedLabel,
              { marginBottom: spacing.sm, marginLeft: spacing.xs },
            ]}
          >
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
              style={[styles.presetScroll, { marginLeft: spacing.md }]}
              contentContainerStyle={styles.speedRowContent}
            >
              {[1, 1.25, 1.5, 1.75, 2, 2.5, 3, 5].map((s) => (
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
                paddingVertical: spacing.md,
                borderTopWidth: 1,
                borderTopColor: colors.borderSubtle,
              },
            ]}
          >
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
            {
              backgroundColor: colors.glassSecondary,
              padding: spacing.md,
              borderRadius: radii.md,
              marginBottom: spacing.xxl,
              borderWidth: 1,
              borderColor: colors.accentPrimary + '40',
            },
            pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
          ]}
          onPress={handleWatchOnYouTube}
        >
          <Youtube color={colors.accentPrimary} size={20} />
          <AppText
            variant="subtitle"
            color="accent"
            style={styles.youtubeButtonText}
          >
            Watch on YouTube
          </AppText>
          <ExternalLink color={colors.accentPrimary} size={16} />
        </Pressable>

        <AppText
          variant="body"
          color="muted"
          style={[styles.description, { marginTop: spacing.sm }]}
        >
          {video.description}
        </AppText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  heroContainer: { width: '100%', height: 260, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  headerOverlay: {
    position: 'absolute',
    zIndex: 10,
  },
  backButton: { marginTop: 24 },
  content: {},
  title: {},
  channel: {},
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeCard: {},
  timeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeHeaderLabel: { marginLeft: 8 },
  speedLabel: {},
  speedInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  presetScroll: {
    flex: 1,
  },
  speedRowContent: { gap: 8 },
  timeResult: {
    alignItems: 'center',
  },
  savedResult: { marginTop: 4 },
  youtubeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  youtubeButtonText: {
    marginHorizontal: 8,
  },
  description: { lineHeight: 24 },
});
