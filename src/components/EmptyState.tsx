import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Ghost, Search, PlusCircle, History } from 'lucide-react-native';
import { AppText } from './AppText';
import { tokens } from '@/constants/tokens';

export type EmptyType =
  | 'search'
  | 'no-results'
  | 'combos'
  | 'recent'
  | 'generic'
  | 'static';

interface EmptyStateProps {
  type?: EmptyType;
  title?: string;
  description?: string;
  query?: string;
  style?: StyleProp<ViewStyle>;
  isStatic?: boolean;
}

export const EmptyState = ({
  type = 'generic',
  title,
  description,
  query,
  style,
  isStatic = false,
}: EmptyStateProps) => {
  const getEmptyConfig = () => {
    switch (type) {
      case 'static':
        return {
          Icon: History,
          title: title || 'No recent history',
          description: description || 'Your past searches will appear here.',
        };
      case 'search':
        return {
          Icon: Search,
          title: title || 'Search YouTube',
          description:
            description || 'Search for a YouTube video, channel, or playlist.',
        };
      case 'no-results':
        return {
          Icon: Ghost,
          title: title || 'No results found',
          description:
            description ||
            `We couldn't find anything for '${query}'. Try different keywords.`,
        };
      case 'combos':
        return {
          Icon: PlusCircle,
          title: title || 'No Combos yet',
          description:
            description ||
            "You haven't saved any Combos yet. Tap the '+' button to build your first playlist.",
        };
      case 'recent':
        return {
          Icon: History,
          title: title || 'No recent searches',
          description: description || 'Your recent searches will appear here.',
        };
      default:
        return {
          Icon: Ghost,
          title: title || 'Empty',
          description: description || 'Nothing to show here.',
        };
    }
  };

  const config = getEmptyConfig();
  const { Icon } = config;

  return (
    <View style={[styles.container, isStatic && styles.staticContainer, style]}>
      <Icon
        size={isStatic ? 32 : 64}
        color={tokens.theme.colors.textMuted}
        strokeWidth={1.5}
        style={[styles.icon, isStatic && styles.staticIcon]}
      />
      <View style={isStatic && styles.staticTextWrapper}>
        <AppText variant={isStatic ? 'subtitle' : 'h3'} style={styles.title}>
          {config.title}
        </AppText>
        <AppText
          variant="caption"
          color="muted"
          style={[styles.description, isStatic && styles.staticDescription]}
        >
          {config.description}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: tokens.theme.spacing.xxl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  staticContainer: {
    flex: 0,
    flexDirection: 'row',
    padding: tokens.theme.spacing.lg,
    justifyContent: 'flex-start',
    backgroundColor: tokens.theme.colors.glassSecondary,
    borderRadius: tokens.theme.radii.md,
    marginHorizontal: tokens.theme.spacing.xl,
  },
  icon: {
    marginBottom: tokens.theme.spacing.xl,
    opacity: 0.5,
  },
  staticIcon: {
    marginBottom: 0,
    marginRight: tokens.theme.spacing.md,
    opacity: 0.7,
  },
  staticTextWrapper: {
    flex: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: tokens.theme.spacing.sm,
  },
  description: {
    textAlign: 'center',
    maxWidth: 300,
  },
  staticDescription: {
    textAlign: 'left',
  },
});
