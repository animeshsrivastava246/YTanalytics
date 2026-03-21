import React from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Users, Video } from 'lucide-react-native';
import { Image } from 'expo-image';
import { AppText } from '@/components/AppText';
import { IconButton } from '@/components/IconButton';
import { StatPill } from '@/components/StatPill';
import { useChannel } from '@/hooks/useYouTube';
import { tokens } from '@/constants/tokens';

export function ChannelDetail({ id }: { id: string }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data: channel, isLoading, isError } = useChannel(id);

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
      <View style={styles.heroContainer}>
        {/* Banner placeholder via heavily blurred avatar */}
        <Image
          source={{ uri: channel.thumbnail.url }}
          style={styles.heroImageBlur}
          blurRadius={60}
          contentFit="cover"
        />
        <View style={styles.heroImageOverlay} />

        <View style={[styles.headerOverlay, { top: insets.top }]}>
          <IconButton
            icon={ArrowLeft}
            onPress={() => router.back()}
            glassType="tertiary"
          />
        </View>

        <Image
          source={{ uri: channel.thumbnail.url }}
          style={styles.avatar}
          contentFit="cover"
        />
      </View>

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
  heroContainer: {
    width: '100%',
    height: 220,
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  heroImageBlur: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  heroImageOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    zIndex: 5,
    borderWidth: 3,
    borderColor: tokens.theme.colors.surfaceBg,
  },
  headerOverlay: { position: 'absolute', top: 40, left: 16, zIndex: 10 },
  content: { padding: tokens.theme.spacing.lg, alignItems: 'center' },
  title: { marginBottom: 16, textAlign: 'center' },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    justifyContent: 'center',
  },
  description: { marginTop: 8, lineHeight: 24, textAlign: 'center' },
});
