import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react-native';
import { AppText } from '@/components/AppText';
import { IconButton } from '@/components/IconButton';
import { ComboItem } from '@/features/combos/useComboStore';
import { useAppTheme } from '@/context/ThemeProvider';

interface ComboItemRowProps {
  item: ComboItem;
  index: number;
  totalItems: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

export function ComboItemRow({
  item,
  index,
  totalItems,
  onMoveUp,
  onMoveDown,
  onRemove,
}: ComboItemRowProps) {
  const { colors, spacing, radii } = useAppTheme();

  return (
    <View
      style={[
        styles.itemRowWrapper,
        {
          marginBottom: spacing.md,
          backgroundColor: colors.glassSecondary,
          borderRadius: radii.md,
          padding: spacing.sm,
        },
      ]}
    >
      <View style={[styles.reorderControls, { paddingRight: spacing.sm }]}>
        <IconButton
          icon={ChevronUp}
          size={20}
          glassType="none"
          onPress={index === 0 ? undefined : onMoveUp}
          color={index === 0 ? colors.textMuted : colors.textPrimary}
        />
        <IconButton
          icon={ChevronDown}
          size={20}
          glassType="none"
          onPress={index === totalItems - 1 ? undefined : onMoveDown}
          color={
            index === totalItems - 1 ? colors.textMuted : colors.textPrimary
          }
        />
      </View>
      <View style={styles.itemRow}>
        {item.thumbnailUrl ? (
          <Image
            source={{ uri: item.thumbnailUrl }}
            style={[
              styles.thumbnail,
              { borderRadius: radii.xs, marginRight: spacing.md },
            ]}
          />
        ) : (
          <View
            style={[
              styles.thumbnail,
              {
                backgroundColor: colors.glassSecondary,
                borderRadius: radii.xs,
                marginRight: spacing.md,
              },
            ]}
          />
        )}
        <AppText variant="body" numberOfLines={2} style={styles.itemTitle}>
          {item.title}
        </AppText>
      </View>
      <View style={[styles.removeControl, { paddingLeft: spacing.sm }]}>
        <IconButton
          icon={Trash2}
          size={20}
          color={colors.error}
          glassType="none"
          onPress={onRemove}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemRowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reorderControls: {},
  itemRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  thumbnail: {
    width: 80,
    height: 45,
  },
  itemTitle: { flex: 1 },
  removeControl: {},
});
