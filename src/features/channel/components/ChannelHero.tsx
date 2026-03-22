import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { IconButton } from '@/components/IconButton';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { tokens } from '@/constants/tokens';

interface ChannelHeroProps {
  thumbnailUrl: string;
  topInset: number;
}

export function ChannelHero({ thumbnailUrl, topInset }: ChannelHeroProps) {
  const router = useRouter();

  return (
    <View style={styles.heroContainer}>
      <Image
        source={{ uri: thumbnailUrl }}
        style={styles.heroImageBlur}
        blurRadius={60}
        contentFit="cover"
      />
      <View style={styles.heroImageOverlay} />

      <View style={[styles.headerOverlay, { top: topInset }]}>
        <IconButton
          icon={ArrowLeft}
          onPress={() => router.back()}
          glassType="tertiary"
        />
      </View>

      <Image
        source={{ uri: thumbnailUrl }}
        style={styles.avatar}
        contentFit="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  heroContainer: {
    width: '100%',
    height: 220,
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: tokens.theme.spacing.xl,
  },
  heroImageBlur: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  heroImageOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: tokens.theme.colors.scrimDark,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    zIndex: 5,
    borderWidth: 3,
    borderColor: tokens.theme.colors.surfaceBg,
  },
  headerOverlay: {
    position: 'absolute',
    left: tokens.theme.spacing.lg,
    zIndex: 10,
  },
});
