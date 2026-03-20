import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { IconButton } from '@/components/IconButton';
import { GlassSurface } from '@/components/GlassSurface';
import { useComboStore, CustomCombo } from '@/features/combos/useComboStore';
import { tokens } from '@/constants/tokens';

export default function CombosScreen() {
  const { combos } = useComboStore();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleCreateCombo = () => {
    // In a full implementation, this opens a modal builder
    useComboStore.getState().addCombo('My New Combo', []);
  };

  const renderEmpty = () => (
    <View style={styles.center}>
      <AppText variant="h3" color="muted" style={{ textAlign: 'center' }}>
        You haven&apos;t saved any Combos yet.{'\n'}Tap the &apos;+&apos; button
        to build your first playlist.
      </AppText>
    </View>
  );

  const renderItem = ({ item }: { item: CustomCombo }) => (
    <Card onPress={() => router.push(`/combo/${item.id}`)} style={styles.card}>
      <AppText variant="h2">{item.title}</AppText>
      <AppText variant="body" color="muted">
        {item.items.length} items
      </AppText>
    </Card>
  );

  return (
    <View style={styles.container}>
      <GlassSurface
        type="primary"
        style={[styles.header, { paddingTop: insets.top }]}
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
          { paddingBottom: insets.bottom + 80 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.theme.colors.surfaceBg },
  header: {
    paddingHorizontal: tokens.theme.spacing.lg,
    paddingBottom: tokens.theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  listContent: {
    padding: tokens.theme.spacing.lg,
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: tokens.theme.spacing.lg,
  },
});
