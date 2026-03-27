import React, { useState } from 'react';
import { View, StyleSheet, TextInput, FlatList, TextStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useComboStore, ComboItem } from './useComboStore';
import { GlassSurface } from '@/components/GlassSurface';
import { AppText } from '@/components/AppText';
import { IconButton } from '@/components/IconButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ArrowLeft, Plus, Search, Trash2 } from 'lucide-react-native';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearch } from '@/hooks/useYouTube';
import { ResultRow } from '@/features/search/components/ResultRow';
import { RawYouTubeSearchItem } from '@/services/youtube.types';
import { useAppTheme } from '@/context/ThemeProvider';

export function ComboBuilderModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, spacing, radii, typography } = useAppTheme();
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
    <View style={[styles.searchRowWrapper, { marginBottom: spacing.md }]}>
      <View style={styles.searchRowContent}>
        <ResultRow item={item} type="video" />
      </View>
      <IconButton
        icon={Plus}
        onPress={() => handleAddItem(item)}
        glassType="tertiary"
        color={colors.accentPrimary}
        style={[styles.addButton, { marginLeft: spacing.sm }]}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceBg }]}>
      <GlassSurface
        type="primary"
        style={[
          styles.header,
          {
            paddingTop: insets.top,
            paddingHorizontal: spacing.sm,
            paddingBottom: spacing.sm,
          },
        ]}
      >
        <IconButton icon={ArrowLeft} onPress={() => router.back()} />
        <AppText variant="h3" style={styles.headerTitle}>
          Build Combo
        </AppText>
        <PrimaryButton
          label="Save"
          onPress={handleSave}
          disabled={!title.trim() || cart.length === 0}
          style={{
            paddingVertical: spacing.xs,
            paddingHorizontal: spacing.md,
          }}
        />
      </GlassSurface>

      <View style={[styles.inputSection, { padding: spacing.lg }]}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.glassSecondary,
              color: colors.textPrimary,
              fontSize: typography.h3.fontSize,
              padding: spacing.lg,
              borderRadius: radii.lg,
              fontWeight:
                (typography.h3.fontWeight as TextStyle['fontWeight']) || '600',
            },
          ]}
          placeholder="Combo Title..."
          placeholderTextColor={colors.textMuted}
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View
        style={[
          styles.cartSection,
          {
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.lg,
          },
        ]}
      >
        <AppText
          variant="h4"
          style={[styles.sectionTitle, { marginBottom: spacing.sm }]}
        >
          Cart ({cart.length})
        </AppText>
        {cart.length > 0 ? (
          <View>
            {cart.map((c) => (
              <View
                key={c.id}
                style={[
                  styles.cartItemRow,
                  {
                    backgroundColor: colors.glassSecondary,
                    padding: spacing.sm,
                    borderRadius: radii.sm,
                    marginBottom: spacing.xs,
                  },
                ]}
              >
                <AppText
                  variant="body"
                  numberOfLines={1}
                  style={[styles.cartItemTitle, { marginRight: spacing.sm }]}
                >
                  {c.title}
                </AppText>
                <IconButton
                  icon={Trash2}
                  size={16}
                  onPress={() => handleRemoveItem(c.id)}
                  color={colors.error}
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

      <GlassSurface
        type="secondary"
        style={[
          styles.searchSection,
          {
            borderTopLeftRadius: radii.xl,
            borderTopRightRadius: radii.xl,
          },
        ]}
      >
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: colors.scrimLight,
              margin: spacing.lg,
              padding: spacing.md,
              borderRadius: radii.md,
            },
          ]}
        >
          <Search color={colors.textMuted} size={20} />
          <TextInput
            style={[
              styles.searchInput,
              {
                marginLeft: spacing.md,
                color: colors.textPrimary,
              },
            ]}
            placeholder="Search YouTube..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        <FlatList
          data={data?.items || []}
          keyExtractor={(item, index) => item.id?.videoId || String(index)}
          renderItem={renderSearchItem}
          contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
          style={[styles.searchResults, { paddingHorizontal: spacing.lg }]}
        />
      </GlassSurface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: { flex: 1, textAlign: 'center' },
  inputSection: {},
  input: {},
  cartSection: {},
  sectionTitle: {},
  cartItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartItemTitle: { flex: 1 },
  searchSection: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
  },
  searchResults: {},
  searchRowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {},
  searchRowContent: { flex: 1 },
});
