import React, { useState, useEffect, memo } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { AppText } from './AppText';
import { useAppTheme } from '@/context/ThemeProvider';
import { GlassSurface } from './GlassSurface';
import * as Haptics from 'expo-haptics';

interface SpeedInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export const SpeedInput = memo(
  ({ value, onChange, min = 0.025, max = 16.0 }: SpeedInputProps) => {
    const { colors, spacing, radii } = useAppTheme();
    const [displayText, setDisplayText] = useState(value.toString());
    const [isFocused, setIsFocused] = useState(false);

    // Sync internal text with value prop
    useEffect(() => {
      if (!isFocused) {
        setDisplayText(value.toFixed(1).replace(/\.0$/, ''));
      }
    }, [value, isFocused]);

    const handleTextChange = (text: string) => {
      // Only allow numbers and decimal point
      const cleaned = text.replace(/[^0-9.]/g, '');
      setDisplayText(cleaned);

      const numericValue = parseFloat(cleaned);
      if (!isNaN(numericValue) && numericValue >= min && numericValue <= max) {
        onChange(numericValue);
      }
    };

    const handleBlur = () => {
      setIsFocused(false);
      const numericValue = parseFloat(displayText);
      if (isNaN(numericValue) || numericValue < min) {
        onChange(min);
        setDisplayText(min.toString());
      } else if (numericValue > max) {
        onChange(max);
        setDisplayText(max.toString());
      } else {
        setDisplayText(numericValue.toFixed(1).replace(/\.0$/, ''));
      }
    };

    const handleQuickAdd = (delta: number) => {
      const newValue = Math.min(max, Math.max(min, value + delta));
      onChange(newValue);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    return (
      <View style={styles.container}>
        <GlassSurface
          type="secondary"
          style={[
            styles.inputWrapper,
            {
              padding: spacing.sm,
              borderRadius: radii.md,
              borderColor: isFocused
                ? colors.accentSecondary
                : colors.borderSubtle,
            },
          ]}
        >
          <TextInput
            style={[
              styles.input,
              {
                color: colors.textPrimary,
                paddingHorizontal: spacing.sm,
              },
            ]}
            value={displayText}
            onChangeText={handleTextChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            keyboardType="decimal-pad"
            placeholder="1.0"
            placeholderTextColor={colors.textMuted}
            selectTextOnFocus
          />
          <AppText
            variant="caption"
            color="muted"
            style={{ marginRight: spacing.sm }}
          >
            x
          </AppText>
        </GlassSurface>

        <View style={[styles.quickControls, { gap: spacing.xs }]}>
          <Pressable
            onPress={() => handleQuickAdd(-0.1)}
            style={({ pressed }) => [
              styles.quickButton,
              {
                backgroundColor: colors.glassSecondary,
                borderRadius: radii.sm,
              },
              pressed && { opacity: 0.7 },
            ]}
          >
            <AppText variant="body">-</AppText>
          </Pressable>
          <Pressable
            onPress={() => handleQuickAdd(0.1)}
            style={({ pressed }) => [
              styles.quickButton,
              {
                backgroundColor: colors.glassSecondary,
                borderRadius: radii.sm,
              },
              pressed && { opacity: 0.7 },
            ]}
          >
            <AppText variant="body">+</AppText>
          </Pressable>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    minWidth: 80,
  },
  input: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    padding: 0,
    minWidth: 40,
  },
  quickControls: {
    flexDirection: 'row',
    marginLeft: 12,
  },
  quickButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
