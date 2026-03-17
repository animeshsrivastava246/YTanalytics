import React, { useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Trash2, Clock } from 'lucide-react-native';
import { Image } from 'expo-image';
import { AppText } from '@/components/AppText';
import { IconButton } from '@/components/IconButton';
import { GlassSurface } from '@/components/GlassSurface';
import { Chip } from '@/components/Chip';
import { useComboStore } from '@/features/combos/useComboStore';
import { useVideos } from '@/hooks/useYouTube';
import { useWatchTime } from '@/hooks/useWatchTime';
import { tokens } from '@/constants/tokens';

export default function ComboDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { combos, deleteCombo } = useComboStore();
  
  const [speed, setSpeed] = useState<number>(1);
  const combo = combos.find(c => c.id === id);

  // Deeply flatten items
  // NOTE: For MVP, we handle only 'video' types correctly in this snippet loop without overcomplicating fetching.
  // Full implementation would require a custom parallel query hook to expand playlists and channels into video IDs.
  const videoIds = useMemo(() => {
    return combo?.items.filter(i => i.type === 'video').map(i => i.id) || [];
  }, [combo]);

  const { data: videos } = useVideos(videoIds);
  const watchTime = useWatchTime(videos || [], speed);

  if (!combo) {
    return (
      <View style={[styles.container, styles.center]}>
        <AppText variant="h3" color="error">Combo not found.</AppText>
        <IconButton icon={ArrowLeft} onPress={() => router.back()} glassType="tertiary" />
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert('Delete Combo?', 'Are you sure you want to delete this specific combo?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
          deleteCombo(combo.id);
          router.back();
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <GlassSurface type="primary" style={[styles.header, { paddingTop: insets.top }]}>
        <IconButton icon={ArrowLeft} onPress={() => router.back()} glassType="tertiary" />
        <AppText variant="h2" numberOfLines={1} style={styles.title}>{combo.title}</AppText>
        <IconButton icon={Trash2} color={tokens.theme.colors.error} onPress={handleDelete} glassType="tertiary" />
      </GlassSurface>

      <ScrollView contentContainerStyle={styles.content}>
        <GlassSurface type="secondary" style={styles.timeCard}>
          <View style={styles.timeHeader}>
            <Clock size={20} color={tokens.theme.colors.textPrimary} />
            <AppText variant="subtitle" style={{ marginLeft: 8 }}>Internal Duration: {watchTime.totalFormatted}</AppText>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.speedRow}>
            {[1, 1.25, 1.5, 1.75, 2].map(s => (
              <Chip key={s} label={`${s}x`} selected={speed === s} onPress={() => setSpeed(s)} />
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

        <AppText variant="h4" style={styles.listTitle}>Items ({combo.items.length})</AppText>
        {combo.items.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            {item.thumbnailUrl ? (
              <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
            ) : (
              <View style={[styles.thumbnail, { backgroundColor: tokens.theme.colors.glassSecondary }]} />
            )}
            <AppText variant="body" numberOfLines={2} style={styles.itemTitle}>{item.title}</AppText>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.theme.colors.surfaceBg },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, paddingBottom: 12 },
  title: { flex: 1, textAlign: 'center', marginHorizontal: 16 },
  content: { padding: 16 },
  timeCard: { padding: 16, borderRadius: tokens.theme.radii.lg, marginBottom: 24 },
  timeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  speedRow: { marginBottom: 16 },
  timeResult: { alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: tokens.theme.colors.borderSubtle },
  savedResult: { marginTop: 4 },
  listTitle: { marginBottom: 12 },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  thumbnail: { width: 80, height: 45, borderRadius: 4, marginRight: 12 },
  itemTitle: { flex: 1 },
});
