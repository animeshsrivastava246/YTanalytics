import React from 'react';
import { View, StyleSheet, Switch, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { GlassSurface } from '@/components/GlassSurface';
import { Chip } from '@/components/Chip';
import { tokens } from '@/constants/tokens';
import {
  useSettingsStore,
  ThemePreference,
  PlaybackSpeed,
} from '@/services/settingsStore';
import * as Haptics from 'expo-haptics';

export function SettingsUI() {
  const insets = useSafeAreaInsets();
  const {
    playbackSpeed,
    theme,
    reduceTransparency,
    setPlaybackSpeed,
    setTheme,
    setReduceTransparency,
  } = useSettingsStore();

  const handleSpeedChange = (speed: PlaybackSpeed) => {
    setPlaybackSpeed(speed);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleThemeChange = (newTheme: ThemePreference) => {
    setTheme(newTheme);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleTransparencyToggle = (value: boolean) => {
    setReduceTransparency(value);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={styles.container}>
      <GlassSurface
        type="primary"
        style={[
          styles.header,
          { paddingTop: insets.top + tokens.theme.spacing.md },
        ]}
      >
        <AppText variant="h1">Settings</AppText>
      </GlassSurface>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 100 },
        ]}
      >
        <GlassSurface type="secondary" style={styles.card}>
          <AppText variant="h3" style={styles.sectionTitle}>
            Default Playback Speed
          </AppText>
          <AppText variant="body" color="muted" style={styles.description}>
            This speed will be pre-selected in watch-time calculators across the
            app.
          </AppText>

          <View style={styles.speedRow}>
            {([1, 1.25, 1.5, 1.75, 2] as const).map((speed) => (
              <Chip
                key={speed}
                label={`${speed}x`}
                selected={playbackSpeed === speed}
                onPress={() => handleSpeedChange(speed)}
                style={styles.chip}
              />
            ))}
          </View>
        </GlassSurface>

        <GlassSurface type="secondary" style={styles.card}>
          <AppText variant="h3" style={styles.sectionTitle}>
            Theme
          </AppText>
          <View style={styles.speedRow}>
            {(['system', 'light', 'dark'] as const).map((t) => (
              <Chip
                key={t}
                label={t.charAt(0).toUpperCase() + t.slice(1)}
                selected={theme === t}
                onPress={() => handleThemeChange(t)}
                style={styles.chip}
              />
            ))}
          </View>
        </GlassSurface>

        <GlassSurface type="secondary" style={[styles.card, styles.toggleRow]}>
          <View style={styles.toggleText}>
            <AppText variant="subtitle">Reduce Transparency</AppText>
            <AppText variant="caption" color="muted">
              Reduces glass effects for visibility or performance.
            </AppText>
          </View>
          <Switch
            value={reduceTransparency}
            onValueChange={handleTransparencyToggle}
            trackColor={{ true: tokens.theme.colors.success }}
          />
        </GlassSurface>

        <AppText variant="caption" color="muted" style={styles.footer}>
          YTanalytics v1.0.0{'\n'}Data provided by YouTube Data API v3
        </AppText>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.theme.colors.surfaceBg },
  header: {
    paddingHorizontal: tokens.theme.spacing.lg,
    paddingBottom: tokens.theme.spacing.lg,
    zIndex: 10,
  },
  content: {
    padding: tokens.theme.spacing.lg,
  },
  card: {
    padding: tokens.theme.spacing.lg,
    borderRadius: tokens.theme.radii.lg,
    marginBottom: tokens.theme.spacing.md,
    borderWidth: 1,
    borderColor: tokens.theme.colors.borderSubtle,
  },
  sectionTitle: { marginBottom: 8 },
  description: { marginBottom: 16 },
  speedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.theme.spacing.sm,
  },
  chip: { marginBottom: 0 },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleText: { flex: 1 },
  footer: { textAlign: 'center', marginTop: 32 },
});
