import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react-native';
import { AppText } from '@/components/AppText';
import { IconButton } from '@/components/IconButton';
import { ComboItem } from '@/features/combos/useComboStore';
import { tokens } from '@/constants/tokens';

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
  return (
    <View style={styles.itemRowWrapper}>
      <View style={styles.reorderControls}>
        <IconButton
          icon={ChevronUp}
          size={20}
          glassType="none"
          onPress={index === 0 ? undefined : onMoveUp}
          color={
            index === 0
              ? tokens.theme.colors.textMuted
              : tokens.theme.colors.textPrimary
          }
        />
        <IconButton
          icon={ChevronDown}
          size={20}
          glassType="none"
          onPress={index === totalItems - 1 ? undefined : onMoveDown}
          color={
            index === totalItems - 1
              ? tokens.theme.colors.textMuted
              : tokens.theme.colors.textPrimary
          }
        />
      </View>
      <View style={styles.itemRow}>
        {item.thumbnailUrl ? (
          <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
        ) : (
          <View
            style={[
              styles.thumbnail,
              { backgroundColor: tokens.theme.colors.glassSecondary },
            ]}
          />
        )}
        <AppText variant="body" numberOfLines={2} style={styles.itemTitle}>
          {item.title}
        </AppText>
      </View>
      <View style={styles.removeControl}>
        <IconButton
          icon={Trash2}
          size={20}
          color={tokens.theme.colors.error}
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
    marginBottom: tokens.theme.spacing.md,
    backgroundColor: tokens.theme.colors.glassSecondary,
    borderRadius: tokens.theme.radii.md,
    padding: tokens.theme.spacing.sm,
  },
  reorderControls: { paddingRight: tokens.theme.spacing.sm },
  itemRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  thumbnail: {
    width: 80,
    height: 45,
    borderRadius: tokens.theme.radii.xs,
    marginRight: tokens.theme.spacing.md,
  },
  itemTitle: { flex: 1 },
  removeControl: { paddingLeft: tokens.theme.spacing.sm },
});
