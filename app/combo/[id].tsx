import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Trash2, Clock } from 'lucide-react-native';
import { AppText } from '@/components/AppText';
import { IconButton } from '@/components/IconButton';
import { GlassSurface } from '@/components/GlassSurface';
import { Chip } from '@/components/Chip';
import { useComboStore } from '@/features/combos/useComboStore';
import { ComboItemRow } from '@/features/combos/components/ComboItemRow';
import { useComboAggregation } from '@/hooks/useComboAggregation';
import { useWatchTime } from '@/hooks/useWatchTime';
import { SpeedInput } from '@/components/SpeedInput';
import { useAppTheme } from '@/context/ThemeProvider';
import * as Haptics from 'expo-haptics';

export default function ComboDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, spacing, radii } = useAppTheme();
  const { combos, deleteCombo, updateCombo } = useComboStore();

  const [speed, setSpeed] = useState<number>(1);
  const combo = combos.find((c) => c.id === id);

  const { data: videos } = useComboAggregation(combo);
  const watchTime = useWatchTime(videos || [], speed);

  if (!combo) {
    return (
      <View
        style={[
          styles.container,
          styles.center,
          { backgroundColor: colors.surfaceBg },
        ]}
      >
        <AppText variant="h3" color="error">
          Combo not found.
        </AppText>
        <IconButton
          icon={ArrowLeft}
          onPress={() => router.back()}
          glassType="tertiary"
        />
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Combo?',
      'Are you sure you want to delete this specific combo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteCombo(combo.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceBg }]}>
      <GlassSurface
        type="primary"
        style={[
          styles.header,
          {
            paddingTop: insets.top,
            paddingHorizontal: spacing.sm,
            paddingBottom: spacing.md,
          },
        ]}
      >
        <IconButton
          icon={ArrowLeft}
          onPress={() => router.back()}
          glassType="tertiary"
        />
        <AppText
          variant="h2"
          numberOfLines={1}
          style={[styles.title, { marginHorizontal: spacing.lg }]}
        >
          {combo.title}
        </AppText>
        <IconButton
          icon={Trash2}
          color={colors.error}
          onPress={handleDelete}
          glassType="tertiary"
        />
      </GlassSurface>

      <ScrollView
        contentContainerStyle={[styles.content, { padding: spacing.lg }]}
      >
        <GlassSurface
          type="secondary"
          style={[
            styles.timeCard,
            {
              padding: spacing.xl,
              borderRadius: radii.lg,
              marginBottom: spacing.xxl,
              borderWidth: 1,
              borderColor: colors.borderSubtle,
            },
          ]}
        >
          <View style={[styles.timeHeader, { marginBottom: spacing.xl }]}>
            <Clock size={20} color={colors.textPrimary} />
            <AppText variant="subtitle" style={styles.timeHeaderLabel}>
              Internal Duration: {watchTime.totalFormatted}
            </AppText>
          </View>

          <AppText
            variant="caption"
            color="muted"
            style={[
              styles.speedLabel,
              { marginBottom: spacing.sm, marginLeft: spacing.xs },
            ]}
          >
            Playback Speed
          </AppText>
          <View style={[styles.speedInputRow, { marginBottom: spacing.xl }]}>
            <SpeedInput
              value={speed}
              onChange={(s) => {
                setSpeed(s);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={[styles.presetScroll, { marginLeft: spacing.md }]}
              contentContainerStyle={styles.speedRowContent}
            >
              {[1, 1.25, 1.5, 1.75, 2, 3, 5].map((s) => (
                <Chip
                  key={s}
                  label={`${s}x`}
                  selected={speed === s}
                  onPress={() => {
                    setSpeed(s);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                />
              ))}
            </ScrollView>
          </View>

          <View
            style={[
              styles.timeResult,
              {
                borderTopColor: colors.borderSubtle,
                paddingVertical: spacing.md,
              },
            ]}
          >
            <AppText variant="h1">{watchTime.timeAtSpeedFormatted}</AppText>
            {watchTime.timeSavedSeconds > 0 && (
              <AppText
                variant="h4"
                color="accent"
                style={[styles.savedResult, { marginTop: spacing.xs }]}
              >
                You save {watchTime.timeSavedFormatted}
              </AppText>
            )}
          </View>
        </GlassSurface>

        <AppText
          variant="h4"
          style={[styles.listTitle, { marginBottom: spacing.md }]}
        >
          Items ({combo.items.length})
        </AppText>
        {combo.items.map((item, index) => (
          <ComboItemRow
            key={`${item.id}-${index}`}
            item={item}
            index={index}
            totalItems={combo.items.length}
            onMoveUp={() => {
              const newItems = [...combo.items];
              [newItems[index - 1], newItems[index]] = [
                newItems[index],
                newItems[index - 1],
              ];
              updateCombo(combo.id, { items: newItems });
            }}
            onMoveDown={() => {
              const newItems = [...combo.items];
              [newItems[index + 1], newItems[index]] = [
                newItems[index],
                newItems[index + 1],
              ];
              updateCombo(combo.id, { items: newItems });
            }}
            onRemove={() => {
              const newItems = combo.items.filter((_, i) => i !== index);
              updateCombo(combo.id, { items: newItems });
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  content: {},
  timeCard: {},
  timeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeHeaderLabel: { marginLeft: 8 },
  speedLabel: {},
  speedInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  presetScroll: {
    flex: 1,
  },
  speedRowContent: { gap: 8 },
  timeResult: {
    alignItems: 'center',
    borderTopWidth: 1,
  },
  savedResult: {},
  listTitle: {},
});
