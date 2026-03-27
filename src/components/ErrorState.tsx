import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import {
  AlertCircle,
  WifiOff,
  Database,
  RefreshCcw,
  LucideIcon,
} from 'lucide-react-native';
import { AppText } from './AppText';
import { GlassSurface } from './GlassSurface';
import { useAppTheme } from '@/context/ThemeProvider';

export type ErrorType = 'network' | 'quota' | 'api' | 'generic';

interface ErrorStateProps {
  type: ErrorType;
  onRetry?: () => void;
  message?: string;
}

const ERROR_CONFIG: Record<
  ErrorType,
  { icon: LucideIcon; title: string; defaultMessage: string; colorKey: string }
> = {
  network: {
    icon: WifiOff,
    title: 'Network Error',
    defaultMessage: 'Please check your internet connection.',
    colorKey: 'textMuted',
  },
  quota: {
    icon: Database,
    title: 'Quota Exceeded',
    defaultMessage: 'YouTube API limit reached. Try again later.',
    colorKey: 'warning',
  },
  api: {
    icon: AlertCircle,
    title: 'API Error',
    defaultMessage: 'Something went wrong with the YouTube service.',
    colorKey: 'accentPrimary',
  },
  generic: {
    icon: AlertCircle,
    title: 'Unexpected Error',
    defaultMessage: 'An unknown error occurred.',
    colorKey: 'error',
  },
};

export function ErrorState({ type, onRetry, message }: ErrorStateProps) {
  const { colors, spacing, radii } = useAppTheme();
  const config = ERROR_CONFIG[type];
  const Icon = config.icon;
  const iconColor =
    colors[config.colorKey as keyof typeof colors] || colors.error;

  return (
    <View style={[styles.container, { padding: spacing.lg }]}>
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
        <View style={[styles.iconWrapper, { marginBottom: spacing.lg }]}>
          <Icon size={48} color={iconColor} strokeWidth={1.5} />
        </View>

        <AppText
          variant="h3"
          style={[styles.title, { marginBottom: spacing.sm }]}
        >
          {config.title}
        </AppText>
        <AppText
          variant="body"
          color="muted"
          style={[styles.message, { marginBottom: spacing.xl }]}
        >
          {message || config.defaultMessage}
        </AppText>

        {onRetry && (
          <Pressable
            onPress={onRetry}
            style={({ pressed }) => [
              styles.retryButton,
              {
                backgroundColor: colors.accentPrimary,
                borderRadius: radii.pill,
                paddingVertical: spacing.md,
                paddingHorizontal: spacing.xl,
              },
              pressed && styles.pressed,
            ]}
          >
            <RefreshCcw size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
            <AppText variant="subtitle" style={styles.retryText}>
              Try Again
            </AppText>
          </Pressable>
        )}
      </GlassSurface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
  },
  iconWrapper: {
    padding: 16,
    borderRadius: 30,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
