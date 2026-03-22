import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { StatPill } from '@/components/StatPill';
import { tokens } from '@/constants/tokens';
import { RawYouTubeSearchItem } from '@/services/youtube.types';

type SearchType = 'video' | 'playlist' | 'channel';

interface ResultRowProps {
  item:
    | RawYouTubeSearchItem
    | {
        id?:
          | string
          | { videoId?: string; playlistId?: string; channelId?: string };
        snippet?: {
          title?: string;
          channelTitle?: string;
          thumbnails?: { high?: { url: string } };
        };
        title?: string;
        channelTitle?: string;
        thumbnail?: { url: string };
        durationFormatted?: string;
      };
  type: SearchType;
}

export function ResultRow({ item, type }: ResultRowProps) {
  const router = useRouter();

  const handlePress = () => {
    const rawId = item.id;
    let finalId = '';

    if (typeof rawId === 'string') {
      finalId = rawId;
    } else if (rawId && typeof rawId === 'object') {
      if (type === 'video' && 'videoId' in rawId)
        finalId = rawId.videoId as string;
      else if (type === 'playlist' && 'playlistId' in rawId)
        finalId = rawId.playlistId as string;
      else if (type === 'channel' && 'channelId' in rawId)
        finalId = rawId.channelId as string;
    }

    if (!finalId) return;

    if (type === 'video') {
      router.push(`/video/${finalId}`);
    } else if (type === 'playlist') {
      router.push(`/playlist/${finalId}`);
    } else if (type === 'channel') {
      router.push(`/channel/${finalId}`);
    }
  };

  const safeItem = item as Record<string, unknown>;
  const title = item.snippet?.title || (safeItem.title as string | undefined);
  const channelTitle =
    item.snippet?.channelTitle || (safeItem.channelTitle as string | undefined);
  const thumbnailUrl =
    item.snippet?.thumbnails?.high?.url ||
    (safeItem.thumbnail as Record<string, string> | undefined)?.url ||
    '';
  const durationFormatted = safeItem.durationFormatted as string | undefined;

  return (
    <Card onPress={handlePress} contentStyle={styles.card}>
      <View style={styles.row}>
        <View style={styles.thumbnailContainer}>
          <Image
            source={{ uri: thumbnailUrl }}
            style={type === 'channel' ? styles.avatar : styles.thumbnail}
            contentFit="cover"
          />
          {type === 'video' && durationFormatted && (
            <StatPill value={durationFormatted} style={styles.durationBadge} />
          )}
        </View>
        <View style={styles.info}>
          <AppText variant="subtitle" numberOfLines={2}>
            {title}
          </AppText>
          <AppText variant="caption" color="muted" style={styles.channelName}>
            {channelTitle || 'Unknown Channel'}
          </AppText>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: tokens.theme.spacing.md },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  thumbnailContainer: {
    position: 'relative',
    marginRight: tokens.theme.spacing.md,
  },
  thumbnail: {
    width: 120,
    height: 68,
    borderRadius: tokens.theme.radii.sm,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: tokens.theme.radii.pill,
  },
  durationBadge: {
    position: 'absolute',
    bottom: tokens.theme.spacing.xs,
    right: tokens.theme.spacing.xs,
    backgroundColor: tokens.theme.colors.scrimDark,
  },
  info: { flex: 1, justifyContent: 'center' },
  channelName: { marginTop: tokens.theme.spacing.xs },
});
