import React, { useState, useCallback, useEffect } from 'react';
import { View, TextInput, StyleSheet, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { GlassSurface } from '@/components/GlassSurface';
import { Chip } from '@/components/Chip';
import { useSearch } from '@/hooks/useYouTube';
import { useDebounce } from '@/hooks/useDebounce';
import { tokens } from '@/constants/tokens';
import { ResultRow } from './components/ResultRow';
import { CardSkeleton } from '@/components/CardSkeleton';
import { ErrorState, ErrorType } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';
import { RawYouTubeSearchItem } from '@/services/youtube.types';
import { useSettingsStore } from '@/services/settingsStore';

type SearchType = 'video' | 'playlist' | 'channel';

export function SearchUI() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const [type, setType] = useState<SearchType>('video');
  const { addSearchHistory } = useSettingsStore();

  const { data, isLoading, isError, error, refetch } = useSearch(
    debouncedQuery,
    type
  );

  // Persistence: Add to history when results are found
  useEffect(() => {
    if (data?.items && data.items.length > 0 && debouncedQuery) {
      addSearchHistory(debouncedQuery);
    }
  }, [data, debouncedQuery, addSearchHistory]);

  const renderItem = useCallback(
    ({ item, index }: { item: RawYouTubeSearchItem; index: number }) => (
      <ResultRow item={item} type={type} index={index} />
    ),
    [type]
  );

  const getErrorType = (): ErrorType => {
    if (!error) return 'generic';
    const err = error as {
      name?: string;
      code?: string;
      message?: string;
      response?: any;
    };
    if (err.name === 'QuotaExceededError' || err.code === 'quotaExceeded')
      return 'quota';
    if (err.message?.toLowerCase().includes('network') || !err.response)
      return 'network';
    return 'api';
  };

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
          clearButtonMode="while-editing"
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
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={styles.listContent}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <CardSkeleton key={i} type={type} />
            ))}
          </Animated.View>
        )}

        {isError && (
          <Animated.View entering={FadeIn.duration(200)} style={styles.center}>
            <ErrorState type={getErrorType()} onRetry={() => refetch()} />
          </Animated.View>
        )}

        {!isLoading && !isError && !debouncedQuery && (
          <Animated.View entering={FadeIn.duration(200)} style={styles.center}>
            <EmptyState type="search" />
          </Animated.View>
        )}

        {!isLoading &&
          !isError &&
          debouncedQuery &&
          (!data?.items || data.items.length === 0) && (
            <Animated.View
              entering={FadeIn.duration(200)}
              style={styles.center}
            >
              <EmptyState type="no-results" query={debouncedQuery} />
            </Animated.View>
          )}

        {!isLoading && !isError && data?.items && data.items.length > 0 && (
          <Animated.View entering={FadeIn.duration(200)} style={styles.flex}>
            <FlatList
              data={data.items}
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
              contentInsetAdjustmentBehavior="automatic"
            />
          </Animated.View>
        )}
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
  filters: { flexDirection: 'row', gap: tokens.theme.spacing.sm },
  listContainer: { flex: 1 },
  listContent: { padding: tokens.theme.spacing.lg },
  flex: { flex: 1 },
  center: { flex: 1, marginTop: tokens.theme.spacing.xxxl },
});
