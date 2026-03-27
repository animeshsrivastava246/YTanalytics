import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { IconButton } from '@/components/IconButton';
import { ArrowLeft, PlayCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/context/ThemeProvider';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PlaylistHeroProps {
  thumbnailUrl: string;
  topInset: number;
}

export function PlaylistHero({ thumbnailUrl, topInset }: PlaylistHeroProps) {
  const router = useRouter();
  const { colors, spacing, radii } = useAppTheme();

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: thumbnailUrl }}
        style={styles.backgroundImage}
        contentFit="cover"
      />
      <BlurView intensity={60} style={StyleSheet.absoluteFill} tint="dark" />

      <View
        style={[
          styles.headerOverlay,
          { top: topInset + spacing.sm, left: spacing.lg },
        ]}
      >
        <IconButton
          icon={ArrowLeft}
          onPress={() => router.back()}
          glassType="tertiary"
        />
      </View>

      <View style={styles.thumbnailWrapper}>
        <Image
          source={{ uri: thumbnailUrl }}
          style={[styles.mainThumbnail, { borderRadius: radii.md }]}
          contentFit="cover"
        />
        <View
          style={[styles.playOverlay, { backgroundColor: colors.scrimDark }]}
        >
          <PlayCircle size={48} color="#FFFFFF" strokeWidth={1.5} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    zIndex: 10,
  },
  thumbnailWrapper: {
    width: SCREEN_WIDTH * 0.6,
    aspectRatio: 16 / 9,
    marginTop: 40,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  mainThumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
