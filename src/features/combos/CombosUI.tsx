import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { IconButton } from '@/components/IconButton';
import { GlassSurface } from '@/components/GlassSurface';
import { useComboStore, CustomCombo } from '@/features/combos/useComboStore';
import { EmptyState } from '@/components/EmptyState';
import { useAppTheme } from '@/context/ThemeProvider';

export function CombosUI() {
  const { combos } = useComboStore();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, spacing } = useAppTheme();

  const handleCreateCombo = () => {
    router.push('/combo/builder');
  };

  const renderEmpty = () => <EmptyState type="combos" />;

  const renderItem = useCallback(
    ({ item, index }: { item: CustomCombo; index: number }) => (
      <Card
        onPress={() => router.push(`/combo/${item.id}`)}
        style={[styles.card, { padding: spacing.lg }]}
        index={index}
      >
        <AppText variant="h2">{item.title}</AppText>
        <AppText variant="body" color="muted">
          {item.items.length} items
        </AppText>
      </Card>
    ),
    [router, spacing.lg]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceBg }]}>
      <GlassSurface
        type="primary"
        style={[
          styles.header,
          {
            paddingTop: insets.top,
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.md,
          },
        ]}
      >
        <AppText variant="h1">Your Combos</AppText>
        <IconButton
          icon={Plus}
          onPress={handleCreateCombo}
          glassType="tertiary"
        />
      </GlassSurface>

      <FlatList
        data={combos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.listContent,
          {
            padding: spacing.lg,
            paddingBottom: insets.bottom + 80,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  listContent: {
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {},
});
