import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassSurface } from '@/components/GlassSurface';
import { AppText } from '@/components/AppText';
import { Chip } from '@/components/Chip';
import { useSearch } from '@/hooks/useYouTube';
import { useDebounce } from '@/hooks/useDebounce';
import { tokens } from '@/constants/tokens';
import { ResultRow } from './components/ResultRow';

import { RawYouTubeSearchItem } from '@/services/youtube.types';

type SearchType = 'video' | 'playlist' | 'channel';

export function SearchUI() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const [type, setType] = useState<SearchType>('video');

  const { data, isLoading, isError } = useSearch(debouncedQuery, type);

  const renderItem = useCallback(
    ({ item, index }: { item: RawYouTubeSearchItem; index: number }) => (
      <ResultRow item={item} type={type} index={index} />
    ),
    [type]
  );

  return (
    <View style={styles.container}>
      <GlassSurface
        type="secondary"
        style={[styles.header, { paddingTop: insets.top }]}
      >
        <TextInput
          style={styles.input}
          placeholder="Search YouTube..."
          placeholderTextColor={tokens.theme.colors.textMuted}
          value={query}
          onChangeText={setQuery}
          autoFocus
        />
        <View style={styles.filters}>
          <Chip
            label="Videos"
            selected={type === 'video'}
            onPress={() => setType('video')}
          />
          <Chip
            label="Playlists"
            selected={type === 'playlist'}
            onPress={() => setType('playlist')}
          />
          <Chip
            label="Channels"
            selected={type === 'channel'}
            onPress={() => setType('channel')}
          />
        </View>
      </GlassSurface>

      <View style={styles.listContainer}>
        {isLoading && (
          <ActivityIndicator
            size="large"
            color={tokens.theme.colors.accentPrimary}
            style={styles.center}
          />
        )}
        {isError && (
          <AppText variant="body" color="error" style={styles.center}>
            Error fetching results.
          </AppText>
        )}
        {!isLoading &&
          !isError &&
          debouncedQuery &&
          (!data?.items || data.items.length === 0) && (
            <AppText variant="body" color="muted" style={styles.center}>
              No results found.
            </AppText>
          )}

        <FlatList
          data={data?.items || []}
          keyExtractor={(item, index) =>
            item.id?.videoId ||
            item.id?.playlistId ||
            item.id?.channelId ||
            String(index)
          }
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 80 },
          ]}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.theme.colors.surfaceBg },
  header: {
    paddingBottom: tokens.theme.spacing.md,
    paddingHorizontal: tokens.theme.spacing.lg,
    zIndex: 10,
  },
  input: {
    backgroundColor: tokens.theme.colors.glassSecondary,
    color: tokens.theme.colors.textPrimary,
    fontSize: tokens.theme.typography.body.fontSize,
    padding: tokens.theme.spacing.md,
    borderRadius: tokens.theme.radii.md,
    marginBottom: tokens.theme.spacing.md,
  },
  filters: { flexDirection: 'row' },
  listContainer: { flex: 1 },
  listContent: { padding: tokens.theme.spacing.lg },
  center: { marginTop: tokens.theme.spacing.xxxl, textAlign: 'center' },
});
