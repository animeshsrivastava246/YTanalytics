import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Search,
  ListFilter,
  Youtube,
  Info,
  LucideIcon,
} from 'lucide-react-native';
import { AppText } from './AppText';
import { GlassSurface } from './GlassSurface';
import { useAppTheme } from '@/context/ThemeProvider';

export type EmptyStateType = 'search' | 'combos' | 'no-results' | 'static';

interface EmptyStateProps {
  type: EmptyStateType;
  title?: string;
  description?: string;
  query?: string;
  isStatic?: boolean;
}

const EMPTY_CONFIG: Record<
  Exclude<EmptyStateType, 'static'>,
  { icon: LucideIcon; title: string; description: string }
> = {
  search: {
    icon: Search,
    title: 'Start Searching',
    description: 'Explore videos, playlists, and channels to analyze.',
  },
  combos: {
    icon: Youtube,
    title: 'No Combos Yet',
    description:
      'Combine multiple videos or playlists to calculate total watch time.',
  },
  'no-results': {
    icon: ListFilter,
    title: 'No Results Found',
    description: 'Try adjusting your search terms or filters.',
  },
};

export function EmptyState({
  type,
  title,
  description,
  query,
  isStatic = false,
}: EmptyStateProps) {
  const { colors, spacing, radii } = useAppTheme();
  const config = type !== 'static' ? EMPTY_CONFIG[type] : null;
  const Icon = config?.icon || Info;

  return (
    <View
      style={[
        styles.container,
        isStatic && styles.staticContainer,
        { padding: spacing.xl },
      ]}
    >
      <GlassSurface
        type="secondary"
        style={[
          styles.content,
          {
            padding: spacing.xl,
            borderRadius: radii.xl,
            borderColor: colors.borderSubtle,
          },
        ]}
      >
        <View
          style={[
            styles.iconWrapper,
            {
              marginBottom: spacing.lg,
              backgroundColor: colors.glassSecondary,
            },
          ]}
        >
          <Icon size={40} color={colors.accentPrimary} strokeWidth={1.5} />
        </View>

        <AppText
          variant="h3"
          style={[styles.title, { marginBottom: spacing.xs }]}
        >
          {title || config?.title}
        </AppText>
        <AppText variant="body" color="muted" style={styles.description}>
          {query ? `No results for "${query}". ` : ''}
          {description || config?.description}
        </AppText>
      </GlassSurface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  staticContainer: {
    marginVertical: 16,
  },
  content: {
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    maxWidth: '80%',
    lineHeight: 20,
  },
});
