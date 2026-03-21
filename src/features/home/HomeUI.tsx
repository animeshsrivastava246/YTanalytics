import React from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import { AppText } from '@/components/AppText';
import { GlassSurface } from '@/components/GlassSurface';
import { tokens } from '@/constants/tokens';

export function HomeUI() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <GlassSurface
        type="primary"
        style={[styles.header, { paddingTop: insets.top }]}
      >
        <AppText variant="h1" style={styles.title}>
          YTanalytics
        </AppText>

        <Pressable
          style={styles.searchBar}
          onPress={() => router.push('/search')}
        >
          <Search color={tokens.theme.colors.textMuted} size={20} />
          <AppText variant="body" color="muted" style={styles.searchText}>
            Search YouTube...
          </AppText>
        </Pressable>
      </GlassSurface>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 100 },
        ]}
      >
        <AppText variant="h3" style={styles.sectionTitle}>
          Welcome
        </AppText>
        <AppText variant="body" color="muted">
          Tap the search bar above to look for videos and calculate how much
          time you can save by watching at higher playback speeds.
        </AppText>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.theme.colors.surfaceBg },
  header: {
    paddingHorizontal: tokens.theme.spacing.xl,
    paddingBottom: tokens.theme.spacing.lg,
    borderBottomLeftRadius: tokens.theme.radii.xl,
    borderBottomRightRadius: tokens.theme.radii.xl,
    zIndex: 10,
  },
  title: {
    marginBottom: tokens.theme.spacing.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.theme.colors.glassSecondary,
    padding: tokens.theme.spacing.md,
    borderRadius: tokens.theme.radii.md,
  },
  searchText: {
    marginLeft: 12,
  },
  content: {
    padding: tokens.theme.spacing.xl,
  },
  sectionTitle: {
    marginBottom: tokens.theme.spacing.sm,
  },
});
