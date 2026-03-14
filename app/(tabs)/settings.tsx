import React, { useState } from 'react';
import { View, StyleSheet, Switch, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { GlassSurface } from '@/components/GlassSurface';
import { Chip } from '@/components/Chip';
import { tokens } from '@/constants/tokens';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [defaultSpeed, setDefaultSpeed] = useState<number>(1);
  const [useSystemTheme, setUseSystemTheme] = useState(true);

  return (
    <View style={styles.container}>
      <GlassSurface type="primary" style={[styles.header, { paddingTop: insets.top }]}>
        <AppText variant="h1">Settings</AppText>
      </GlassSurface>
      
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
      >
        <GlassSurface type="secondary" style={styles.card}>
          <AppText variant="h3" style={styles.sectionTitle}>Default Playback Speed</AppText>
          <AppText variant="body" color="muted" style={styles.description}>
            This speed will be pre-selected in watch-time calculators across the app.
          </AppText>
          
          <View style={styles.speedRow}>
            {[1, 1.25, 1.5, 1.75, 2].map(speed => (
              <Chip 
                key={speed} 
                label={`${speed}x`} 
                selected={defaultSpeed === speed} 
                onPress={() => setDefaultSpeed(speed)} 
                style={styles.chip}
              />
            ))}
          </View>
        </GlassSurface>

        <GlassSurface type="secondary" style={[styles.card, styles.toggleRow]}>
          <View style={styles.toggleText}>
            <AppText variant="subtitle">Use System Theme</AppText>
            <AppText variant="caption" color="muted">Matches iOS Appearance</AppText>
          </View>
          <Switch 
            value={useSystemTheme} 
            onValueChange={setUseSystemTheme}
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
    paddingBottom: tokens.theme.spacing.md,
    zIndex: 10,
  },
  content: {
    padding: tokens.theme.spacing.lg,
  },
  card: {
    padding: tokens.theme.spacing.lg,
    borderRadius: tokens.theme.radii.lg,
    marginBottom: tokens.theme.spacing.md,
  },
  sectionTitle: { marginBottom: 8 },
  description: { marginBottom: 16 },
  speedRow: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { marginBottom: 8 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toggleText: { flex: 1 },
  footer: { textAlign: 'center', marginTop: 32 },
});
