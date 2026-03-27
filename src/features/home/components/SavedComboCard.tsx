import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Clock, ListVideo, ChevronRight } from 'lucide-react-native';
import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { CustomCombo } from '@/services/youtube.types';
import { useAppTheme } from '@/context/ThemeProvider';

interface SavedComboCardProps {
  combo: CustomCombo;
  index: number;
  onPress: () => void;
}

export const SavedComboCard = memo(
  ({ combo, index, onPress }: SavedComboCardProps) => {
    const { colors, spacing } = useAppTheme();
    const createdDate = new Date(combo.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    return (
      <Card
        key={combo.id}
        index={index}
        onPress={onPress}
        style={[styles.cardWrapper, { marginBottom: spacing.md }]}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardInfo}>
            <AppText
              variant="h3"
              numberOfLines={1}
              style={[styles.cardTitle, { marginBottom: spacing.xs }]}
            >
              {combo.title}
            </AppText>

            <View style={[styles.cardMetaRow, { gap: spacing.md }]}>
              <View style={[styles.metaItem, { gap: spacing.xs }]}>
                <ListVideo color={colors.textMuted} size={14} />
                <AppText
                  variant="caption"
                  color="muted"
                  style={styles.metaText}
                >
                  {combo.items.length}{' '}
                  {combo.items.length === 1 ? 'item' : 'items'}
                </AppText>
              </View>
              <View style={[styles.metaItem, { gap: spacing.xs }]}>
                <Clock color={colors.textMuted} size={14} />
                <AppText
                  variant="caption"
                  color="muted"
                  style={styles.metaText}
                >
                  {createdDate}
                </AppText>
              </View>
            </View>
          </View>

          <View style={[styles.cardAction, { paddingLeft: spacing.md }]}>
            <ChevronRight color={colors.textMuted} size={20} />
          </View>
        </View>
      </Card>
    );
  }
);

const styles = StyleSheet.create({
  cardWrapper: {},
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {},
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {},
  cardAction: {},
});
