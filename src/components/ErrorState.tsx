import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { WifiOff, AlertTriangle, Activity, Info } from 'lucide-react-native';
import { AppText } from './AppText';
import { PrimaryButton } from './PrimaryButton';
import { GlassSurface } from './GlassSurface';
import { tokens } from '@/constants/tokens';

export type ErrorType = 'network' | 'api' | 'quota' | 'generic';

interface ErrorStateProps {
  type?: ErrorType;
  message?: string;
  onRetry?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const ErrorState = ({
  type = 'generic',
  message,
  onRetry,
  style,
}: ErrorStateProps) => {
  const getErrorConfig = () => {
    switch (type) {
      case 'network':
        return {
          Icon: WifiOff,
          title: "You're offline",
          description: message || 'Check your connection to load video stats.',
          actionLabel: 'Tap to Retry',
          color: tokens.theme.colors.textMuted,
        };
      case 'api':
        return {
          Icon: AlertTriangle,
          title: 'Something went wrong',
          description:
            message || 'There was an issue communicating with YouTube.',
          actionLabel: 'Retry',
          color: tokens.theme.colors.warning,
        };
      case 'quota':
        return {
          Icon: Activity,
          title: 'Daily limit reached!',
          description:
            message ||
            'To keep the app free, we limit daily YouTube requests. Check back tomorrow.',
          actionLabel: null,
          color: tokens.theme.colors.accentPrimary,
        };
      default:
        return {
          Icon: Info,
          title: 'Error',
          description: message || 'An unexpected error occurred.',
          actionLabel: 'Retry',
          color: tokens.theme.colors.error,
        };
    }
  };

  const config = getErrorConfig();
  const { Icon } = config;

  return (
    <View style={[styles.container, style]}>
      <GlassSurface type="secondary" style={styles.card}>
        <View style={styles.iconWrapper}>
          <Icon size={48} color={config.color} strokeWidth={1.5} />
        </View>
        <AppText variant="h3" style={styles.title}>
          {config.title}
        </AppText>
        <AppText variant="body" color="muted" style={styles.description}>
          {config.description}
        </AppText>
        {onRetry && config.actionLabel && (
          <PrimaryButton
            label={config.actionLabel}
            onPress={onRetry}
            style={styles.button}
          />
        )}
      </GlassSurface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: tokens.theme.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    padding: tokens.theme.spacing.xl,
    borderRadius: tokens.theme.radii.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: tokens.theme.colors.borderSubtle,
  },
  iconWrapper: {
    marginBottom: tokens.theme.spacing.lg,
    opacity: 0.9,
  },
  title: {
    textAlign: 'center',
    marginBottom: tokens.theme.spacing.sm,
  },
  description: {
    textAlign: 'center',
    marginBottom: tokens.theme.spacing.xl,
  },
  button: {
    width: '100%',
  },
});
