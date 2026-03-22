import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { IconButton } from '@/components/IconButton';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { tokens } from '@/constants/tokens';

interface PlaylistHeroProps {
  thumbnailUrl: string;
  topInset: number;
}

export function PlaylistHero({ thumbnailUrl, topInset }: PlaylistHeroProps) {
  const router = useRouter();

  return (
    <View style={styles.heroContainer}>
      <Image
        source={{ uri: thumbnailUrl }}
        style={styles.heroImageBlur}
        blurRadius={40}
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
        style={styles.heroImageClear}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  heroContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImageBlur: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
  heroImageOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: tokens.theme.colors.scrimDark,
  },
  heroImageClear: {
    width: '80%',
    height: '60%',
    borderRadius: tokens.theme.radii.md,
    zIndex: 5,
    marginTop: tokens.theme.spacing.xxl,
  },
  headerOverlay: {
    position: 'absolute',
    left: tokens.theme.spacing.lg,
    zIndex: 10,
  },
});
