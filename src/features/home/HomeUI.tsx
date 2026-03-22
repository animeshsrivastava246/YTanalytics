import React from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import { AppText } from '@/components/AppText';
import { GlassSurface } from '@/components/GlassSurface';
import { Chip } from '@/components/Chip';
import { tokens } from '@/constants/tokens';
import { SavedComboCard } from './components/SavedComboCard';

// Mock Data
const RECENT_SEARCHES = [
  'React Native Animations',
  'Expo 2024 Features',
  'UI/UX Masterclass',
  'JavaScript Basics',
];
const SAVED_COMBOS = [
  { id: '1', title: 'Learn React Native', itemsCount: 12, duration: '4:20:15' },
  { id: '2', title: 'Design Inspiration', itemsCount: 5, duration: '1:15:00' },
  { id: '3', title: 'Workout Mix', itemsCount: 20, duration: '3:45:00' },
];

export function HomeUI() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Hero Header */}
      <GlassSurface
        type="primary"
        style={[
          styles.header,
          { paddingTop: insets.top + tokens.theme.spacing.md },
        ]}
      >
        <AppText variant="h1" style={styles.title}>
          Good Morning
        </AppText>
        <AppText variant="body" color="muted" style={styles.subtitle}>
          Ready to save some time today?
        </AppText>

        <Pressable
          style={styles.searchBar}
          onPress={() => router.push('/search')}
        >
          <Search color={tokens.theme.colors.textMuted} size={20} />
          <AppText variant="body" color="muted" style={styles.searchText}>
            Search videos, playlists...
          </AppText>
        </Pressable>
      </GlassSurface>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 100 },
        ]}
      >
        {/* Recent Searches Section */}
        <View style={styles.sectionHeader}>
          <AppText variant="h3">Recent Searches</AppText>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
          contentContainerStyle={styles.horizontalScrollContent}
        >
          {RECENT_SEARCHES.map((search) => (
            <Chip
              key={search}
              label={search}
              selected={false}
              onPress={() =>
                router.push(`/search?q=${encodeURIComponent(search)}`)
              }
            />
          ))}
        </ScrollView>

        {/* Saved Combos Section */}
        <View style={[styles.sectionHeader, styles.marginTopLg]}>
          <AppText variant="h3">Saved Combos</AppText>
          <Pressable onPress={() => router.push('/combos')}>
            <AppText variant="body" color="accent">
              View All
            </AppText>
          </Pressable>
        </View>

        <View style={styles.combosList}>
          {SAVED_COMBOS.map((combo, index) => (
            <SavedComboCard
              key={combo.id}
              combo={combo}
              index={index}
              onPress={() => router.push(`/combo/${combo.id}`)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.theme.colors.surfaceBg },
  header: {
    paddingHorizontal: tokens.theme.spacing.xl,
    paddingBottom: tokens.theme.spacing.xl,
    borderBottomLeftRadius: tokens.theme.radii.xl,
    borderBottomRightRadius: tokens.theme.radii.xl,
    zIndex: 10,
  },
  title: {
    marginBottom: tokens.theme.spacing.xs,
  },
  subtitle: {
    marginBottom: tokens.theme.spacing.xl,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.theme.colors.glassSecondary,
    padding: tokens.theme.spacing.lg,
    borderRadius: tokens.theme.radii.lg,
    borderWidth: 1,
    borderColor: tokens.theme.colors.borderSubtle,
  },
  searchText: {
    marginLeft: tokens.theme.spacing.md,
  },
  content: {
    paddingVertical: tokens.theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: tokens.theme.spacing.xl,
    marginBottom: tokens.theme.spacing.md,
  },
  marginTopLg: {
    marginTop: tokens.theme.spacing.xxl,
  },
  horizontalScroll: {
    flexGrow: 0,
  },
  horizontalScrollContent: {
    paddingHorizontal: tokens.theme.spacing.xl,
    paddingBottom: tokens.theme.spacing.md,
  },
  combosList: {
    paddingHorizontal: tokens.theme.spacing.xl,
  },
});
