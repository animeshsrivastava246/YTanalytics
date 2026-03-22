import React, { useState } from 'react';
import { View, StyleSheet, TextInput, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useComboStore, ComboItem } from './useComboStore';
import { GlassSurface } from '@/components/GlassSurface';
import { AppText } from '@/components/AppText';
import { IconButton } from '@/components/IconButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ArrowLeft, Plus, Search, Trash2 } from 'lucide-react-native';
import { tokens } from '@/constants/tokens';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearch } from '@/hooks/useYouTube';
import { ResultRow } from '@/features/search/components/ResultRow';
import { RawYouTubeSearchItem } from '@/services/youtube.types';

export function ComboBuilderModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addCombo } = useComboStore();

  const [title, setTitle] = useState('');
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const [cart, setCart] = useState<ComboItem[]>([]);

  const { data } = useSearch(debouncedQuery, 'video');

  const handleSave = () => {
    if (!title.trim() || cart.length === 0) return;
    addCombo(title, cart);
    router.back();
  };

  const handleAddItem = (item: RawYouTubeSearchItem) => {
    const newItem: ComboItem = {
      id: item.id?.videoId || '',
      type: 'video',
      title: item.snippet?.title || '',
      thumbnailUrl: item.snippet?.thumbnails?.high?.url || '',
    };
    if (!cart.find((c) => c.id === newItem.id)) {
      setCart([...cart, newItem]);
    }
  };

  const handleRemoveItem = (id: string) => {
    setCart(cart.filter((c) => c.id !== id));
  };

  const renderSearchItem = ({ item }: { item: RawYouTubeSearchItem }) => (
    <View style={styles.searchRowWrapper}>
      <View style={styles.searchRowContent}>
        <ResultRow item={item} type="video" />
      </View>
      <IconButton
        icon={Plus}
        onPress={() => handleAddItem(item)}
        glassType="tertiary"
        color={tokens.theme.colors.accentPrimary}
        style={styles.addButton}
      />
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <GlassSurface type="primary" style={styles.header}>
        <IconButton icon={ArrowLeft} onPress={() => router.back()} />
        <AppText variant="h3" style={styles.headerTitle}>
          Build Combo
        </AppText>
        <PrimaryButton
          label="Save"
          onPress={handleSave}
          disabled={!title.trim() || cart.length === 0}
          style={styles.saveBtn}
        />
      </GlassSurface>

      <View style={styles.inputSection}>
        <TextInput
          style={styles.input}
          placeholder="Combo Title..."
          placeholderTextColor={tokens.theme.colors.textMuted}
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View style={styles.cartSection}>
        <AppText variant="h4" style={styles.sectionTitle}>
          Cart ({cart.length})
        </AppText>
        {cart.length > 0 ? (
          <View>
            {cart.map((c) => (
              <View key={c.id} style={styles.cartItemRow}>
                <AppText
                  variant="body"
                  numberOfLines={1}
                  style={styles.cartItemTitle}
                >
                  {c.title}
                </AppText>
                <IconButton
                  icon={Trash2}
                  size={16}
                  onPress={() => handleRemoveItem(c.id)}
                  color={tokens.theme.colors.error}
                />
              </View>
            ))}
          </View>
        ) : (
          <AppText variant="body" color="muted">
            Search below to add videos to your Combo.
          </AppText>
        )}
      </View>

      <GlassSurface type="secondary" style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search color={tokens.theme.colors.textMuted} size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search YouTube..."
            placeholderTextColor={tokens.theme.colors.textMuted}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        <FlatList
          data={data?.items || []}
          keyExtractor={(item, index) => item.id?.videoId || String(index)}
          renderItem={renderSearchItem}
          contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
          style={styles.searchResults}
        />
      </GlassSurface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.theme.colors.surfaceBg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.theme.spacing.sm,
    paddingBottom: tokens.theme.spacing.sm,
  },
  headerTitle: { flex: 1, textAlign: 'center' },
  saveBtn: {
    paddingVertical: tokens.theme.spacing.xs,
    paddingHorizontal: tokens.theme.spacing.md,
  },
  inputSection: { padding: tokens.theme.spacing.lg },
  input: {
    backgroundColor: tokens.theme.colors.glassSecondary,
    color: tokens.theme.colors.textPrimary,
    fontSize: tokens.theme.typography.h3.fontSize,
    padding: tokens.theme.spacing.lg,
    borderRadius: tokens.theme.radii.lg,
    fontWeight: tokens.theme.typography.h3.fontWeight,
  },
  cartSection: {
    paddingHorizontal: tokens.theme.spacing.lg,
    paddingBottom: tokens.theme.spacing.lg,
  },
  sectionTitle: { marginBottom: tokens.theme.spacing.sm },
  cartItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.theme.colors.glassSecondary,
    padding: tokens.theme.spacing.sm,
    borderRadius: tokens.theme.radii.sm,
    marginBottom: tokens.theme.spacing.xs,
  },
  cartItemTitle: { flex: 1, marginRight: tokens.theme.spacing.sm },
  searchSection: {
    flex: 1,
    borderTopLeftRadius: tokens.theme.radii.xl,
    borderTopRightRadius: tokens.theme.radii.xl,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.theme.colors.scrimLight,
    margin: tokens.theme.spacing.lg,
    padding: tokens.theme.spacing.md,
    borderRadius: tokens.theme.radii.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: tokens.theme.spacing.md,
    color: tokens.theme.colors.textPrimary,
  },
  searchResults: { paddingHorizontal: tokens.theme.spacing.lg },
  searchRowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.theme.spacing.md,
  },
  addButton: { marginLeft: tokens.theme.spacing.sm },
  searchRowContent: { flex: 1 },
});
