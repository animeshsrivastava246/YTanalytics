import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Search } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { AppText } from '@/components/AppText';
import { GlassSurface } from '@/components/GlassSurface';
import { Chip } from '@/components/Chip';
import { SavedComboCard } from './components/SavedComboCard';
import { useSettingsStore } from '@/services/settingsStore';
import { useComboStore } from '@/features/combos/useComboStore';
import { EmptyState } from '@/components/EmptyState';
import { useAppTheme } from '@/context/ThemeProvider';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

export function HomeUI() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, spacing, radii } = useAppTheme();
  const { searchHistory } = useSettingsStore();
  const { combos } = useComboStore();

  const greeting = useMemo(() => getGreeting(), []);

  const searchPressed = useSharedValue(0);
  const viewAllPressed = useSharedValue(0);

  const handleSearchPressIn = useCallback(() => {
    searchPressed.value = withSpring(1, {
      mass: 1,
      damping: 15,
      stiffness: 300,
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [searchPressed]);

  const handleSearchPressOut = useCallback(() => {
    searchPressed.value = withSpring(0, {
      mass: 1,
      damping: 15,
      stiffness: 300,
    });
  }, [searchPressed]);

  const handleViewAllPressIn = useCallback(() => {
    viewAllPressed.value = withSpring(1, {
      mass: 1,
      damping: 15,
      stiffness: 300,
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [viewAllPressed]);

  const handleViewAllPressOut = useCallback(() => {
    viewAllPressed.value = withSpring(0, {
      mass: 1,
      damping: 15,
      stiffness: 300,
    });
  }, [viewAllPressed]);

  const searchAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - searchPressed.value * 0.02 }],
  }));

  const viewAllAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - viewAllPressed.value * 0.05 }],
  }));

  // Show at most 3 combos on home screen
  const previewCombos = combos.slice(0, 3);

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceBg }]}>
      {/* Hero Header */}
      <GlassSurface
        type="primary"
        style={[
          styles.header,
          {
            paddingTop: insets.top + spacing.md,
            paddingHorizontal: spacing.xl,
            paddingBottom: spacing.xl,
            borderBottomLeftRadius: radii.xl,
            borderBottomRightRadius: radii.xl,
          },
        ]}
      >
        <AppText
          variant="h1"
          style={[styles.title, { marginBottom: spacing.xs }]}
        >
          {greeting}
        </AppText>
        <AppText
          variant="body"
          color="muted"
          style={[styles.subtitle, { marginBottom: spacing.xl }]}
        >
          Ready to save some time today?
        </AppText>

        <Link href="/search" asChild>
          <Pressable
            onPressIn={handleSearchPressIn}
            onPressOut={handleSearchPressOut}
          >
            <Animated.View
              style={[
                styles.searchBar,
                {
                  padding: spacing.lg,
                  borderRadius: radii.lg,
                  borderColor: colors.borderSubtle,
                },
                searchAnimatedStyle,
              ]}
            >
              <GlassSurface
                type="secondary"
                isInteractive
                style={StyleSheet.absoluteFillObject}
              />
              <Search color={colors.textMuted} size={20} />
              <AppText
                variant="body"
                color="muted"
                style={[styles.searchText, { marginLeft: spacing.md }]}
              >
                Search videos, playlists...
              </AppText>
            </Animated.View>
          </Pressable>
        </Link>
      </GlassSurface>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingVertical: spacing.xl,
            paddingBottom: insets.bottom + 100,
          },
        ]}
      >
        {/* Recent Searches Section */}
        <View
          style={[
            styles.sectionHeader,
            { paddingHorizontal: spacing.xl, marginBottom: spacing.md },
          ]}
        >
          <AppText variant="h3">Recent Searches</AppText>
        </View>

        {searchHistory.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
            contentContainerStyle={[
              styles.horizontalScrollContent,
              { paddingHorizontal: spacing.xl, paddingBottom: spacing.md },
            ]}
          >
            {searchHistory.map((search) => (
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
        ) : (
          <EmptyState
            type="static"
            title="Popular Searches"
            description="Try: React Native, Expo Router, Svelte..."
            isStatic
          />
        )}

        {/* Saved Combos Section */}
        <View
          style={[
            styles.sectionHeader,
            {
              paddingHorizontal: spacing.xl,
              marginBottom: spacing.md,
              marginTop: spacing.xxl,
            },
          ]}
        >
          <AppText variant="h3">Saved Combos</AppText>
          <Link href="/combos" asChild>
            <Pressable
              onPressIn={handleViewAllPressIn}
              onPressOut={handleViewAllPressOut}
            >
              <Animated.View style={viewAllAnimatedStyle}>
                <AppText variant="body" color="accent">
                  View All
                </AppText>
              </Animated.View>
            </Pressable>
          </Link>
        </View>

        <View style={[styles.combosList, { paddingHorizontal: spacing.xl }]}>
          {previewCombos.length > 0 ? (
            previewCombos.map((combo, index) => (
              <SavedComboCard
                key={combo.id}
                combo={combo}
                index={index}
                onPress={() => router.push(`/combo/${combo.id}`)}
              />
            ))
          ) : (
            <EmptyState
              type="combos"
              title="No Combos Yet"
              description="Tap 'Combos' to build your first watch-time group."
              isStatic
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    zIndex: 10,
  },
  title: {},
  subtitle: {},
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  searchText: {},
  content: {},
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  horizontalScroll: {
    flexGrow: 0,
  },
  horizontalScrollContent: {
    gap: 8,
  },
  combosList: {},
});
