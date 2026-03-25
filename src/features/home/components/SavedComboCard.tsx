import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Clock, ListVideo, ChevronRight } from 'lucide-react-native';
import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { tokens } from '@/constants/tokens';

interface SavedComboCardProps {
  combo: { id: string; title: string; itemsCount: number; duration: string };
  index: number;
  onPress: () => void;
}

export const SavedComboCard = memo(
  ({ combo, index, onPress }: SavedComboCardProps) => {
    return (
      <Card
        key={combo.id}
        index={index}
        onPress={onPress}
        style={styles.cardWrapper}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardInfo}>
            <AppText variant="h3" style={styles.cardTitle}>
              {combo.title}
            </AppText>

            <View style={styles.cardMetaRow}>
              <View style={styles.metaItem}>
                <ListVideo color={tokens.theme.colors.textMuted} size={14} />
                <AppText
                  variant="caption"
                  color="muted"
                  style={styles.metaText}
                >
                  {combo.itemsCount} items
                </AppText>
              </View>
              <View style={styles.metaItem}>
                <Clock color={tokens.theme.colors.textMuted} size={14} />
                <AppText
                  variant="caption"
                  color="muted"
                  style={styles.metaText}
                >
                  {combo.duration}
                </AppText>
              </View>
            </View>
          </View>

          <View style={styles.cardAction}>
            <ChevronRight color={tokens.theme.colors.textMuted} size={20} />
          </View>
        </View>
      </Card>
    );
  }
);

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: tokens.theme.spacing.md,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    marginBottom: tokens.theme.spacing.xs,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.theme.spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.theme.spacing.xs,
  },
  metaText: {},
  cardAction: {
    paddingLeft: tokens.theme.spacing.md,
  },
});
