import React from 'react';
import { View, StyleSheet, Modal, FlatList, Pressable } from 'react-native';
import { AppText } from './AppText';
import { GlassSurface } from './GlassSurface';
import { useComboStore, ComboItem } from '@/features/combos/useComboStore';
import { useAppTheme } from '@/context/ThemeProvider';
import { X } from 'lucide-react-native';
import { IconButton } from './IconButton';
import * as Haptics from 'expo-haptics';

interface AddToComboModalProps {
  visible: boolean;
  onClose: () => void;
  item: ComboItem;
}

export function AddToComboModal({
  visible,
  onClose,
  item,
}: AddToComboModalProps) {
  const { combos, updateCombo } = useComboStore();
  const { colors, spacing, radii } = useAppTheme();

  const handleAddToCombo = (comboId: string) => {
    const combo = combos.find((c) => c.id === comboId);
    if (!combo) return;

    // Check if already in combo
    if (combo.items.some((i) => i.id === item.id)) {
      onClose();
      return;
    }

    updateCombo(comboId, { items: [...combo.items, item] });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={[styles.overlay, { backgroundColor: colors.scrimDark }]}>
        <GlassSurface
          type="primary"
          style={[
            styles.container,
            {
              padding: spacing.lg,
              borderTopLeftRadius: radii.xl,
              borderTopRightRadius: radii.xl,
            },
          ]}
        >
          <View style={styles.header}>
            <AppText variant="h3">Add to Combo</AppText>
            <IconButton icon={X} onPress={onClose} glassType="tertiary" />
          </View>

          <AppText
            variant="body"
            color="muted"
            style={{ marginBottom: spacing.md }}
          >
            Select a combo to add "{item.title}" to:
          </AppText>

          <FlatList
            data={combos}
            keyExtractor={(c) => c.id}
            renderItem={({ item: combo }) => (
              <Pressable
                style={({ pressed }) => [
                  styles.comboRow,
                  {
                    backgroundColor: colors.glassSecondary,
                    padding: spacing.md,
                    borderRadius: radii.md,
                    marginBottom: spacing.sm,
                    borderColor: colors.borderSubtle,
                    borderWidth: 1,
                  },
                  pressed && { opacity: 0.7 },
                ]}
                onPress={() => handleAddToCombo(combo.id)}
              >
                <AppText variant="subtitle">{combo.title}</AppText>
                <AppText variant="caption" color="muted">
                  {combo.items.length} items
                </AppText>
              </Pressable>
            )}
            ListEmptyComponent={
              <AppText
                variant="body"
                color="muted"
                style={{ textAlign: 'center', marginTop: spacing.xl }}
              >
                No combos found. Create one from the Combos tab first.
              </AppText>
            }
          />
        </GlassSurface>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    maxHeight: '60%',
    minHeight: 300,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  comboRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
