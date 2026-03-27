import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { IconButton } from '@/components/IconButton';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/context/ThemeProvider';

interface ChannelHeroProps {
  thumbnailUrl: string;
  topInset: number;
}

export function ChannelHero({ thumbnailUrl, topInset }: ChannelHeroProps) {
  const router = useRouter();
  const { colors, spacing } = useAppTheme();

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: thumbnailUrl }}
        style={styles.backgroundImage}
        contentFit="cover"
      />
      <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="dark" />

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

      <View
        style={[
          styles.avatarContainer,
          {
            paddingBottom: spacing.xl,
          },
        ]}
      >
        <Image
          source={{ uri: thumbnailUrl }}
          style={[
            styles.avatar,
            {
              borderRadius: 60,
              backgroundColor: colors.surfaceBg,
              borderColor: colors.surfaceBg,
            },
          ]}
          contentFit="cover"
        />
        <View
          style={[styles.avatarScrim, { backgroundColor: colors.scrimDark }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 240,
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
  avatarContainer: {
    marginTop: 40,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderWidth: 4,
  },
  avatarScrim: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 60,
    opacity: 0.1,
  },
});
