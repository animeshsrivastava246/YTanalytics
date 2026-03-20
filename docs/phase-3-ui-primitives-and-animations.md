# Phase 3: UI Primitives & Animation Contracts

## Task 8: Primitive UI Components

We define a set of core presentational layer components. These components do _not_ contain business logic, data fetching, or global state.

### 1. `GlassSurface`

- **Props:** `type`: `'primary' | 'secondary' | 'tertiary'`, `intensity?: number`, `style?: ViewStyle`, `children: ReactNode`
- **Usage**: The base wrapper around Expo's `BlurView`. Pulls the correct tint and intensity from the Design System tokens defined in Phase 2 based on the `type` prop.

### 2. `AppText`

- **Props:** `variant`: `'h1' | 'h2' | 'h3' | 'h4' | 'subtitle' | 'body' | 'caption'`, `color?`: `'primary' | 'muted' | 'accent'`, `numberOfLines?: number`, `style?: TextStyle`
- **Usage**: Strictly enforces HIG typography levels.

### 3. `IconButton`

- **Props:** `icon`: `LucideIconName`, `size?: number`, `onPress: () => void`, `glassType?: 'tertiary' | 'none'`
- **Usage**: A circle or rounded-rect button, often with a subtle `TertiaryGlass` background. Uses micro-animation on press.

### 4. `PrimaryButton`

- **Props:** `label: string`, `onPress: () => void`, `variant?: 'solid' | 'glass'`, `loading?: boolean`
- **Usage**: Primary call to actions (e.g. "Save Combo", "Retry").

### 5. `Card`

- **Props:** `onPress?: () => void`, `children: ReactNode`, `style?: ViewStyle`
- **Usage**: SecondaryGlass wrapper for list items and data blocks. Handles press states via micro-animation scaling.

### 6. `Chip`

- **Props:** `label: string`, `selected: boolean`, `onPress: () => void`
- **Usage**: Search type filters, speed toggles (e.g. 1x, 1.5x, 2x).

### 7. `StatPill`

- **Props:** `icon: LucideIconName`, `value: string`, `color?: string`
- **Usage**: Tiny un-pressable blocks for showing views, likes, or duration over thumbnails.

---

## Task 9: Animation Patterns

**Micro-Interactions (react-native-ease)**
For fast, tactile feedback, use a simple ease wrapper (or Reanimated shared value scaling).

- **Button Press (Scale)**: On `pressIn`, scale down from 1 to 0.96 with 150ms spring or ease. On `pressOut`, restore to 1.
- **Chip Toggle (Scale + Color)**: Scale briefly to 0.95 and fade to the `selected` color.
- **List Item Tap**: Subtle scale to 0.98.

**Complex/Entry Animations (Reanimated)**

- **Card Entrance (Staggered)**: On mount, lists should stagger fade-in (opacity 0 -> 1) and slide-up (translateY 15 -> 0).
- **Bottom Sheets**: Spring physics (damping / stiffness tuned to feel like iOS native sheets).
- **Screen Transitions**: Leverage `Expo Router` default stack animations, which mimic native iOS push/modal presentations perfectly. Overriding them should be avoided.

---

## Task 10: TSX-Oriented Component Blueprints

### Blueprint: `GlassSurface`

```tsx
import { BlurView } from 'expo-blur';
import { View, StyleSheet } from 'react-native';
import { tokens } from '@/constants/tokens';

export const GlassSurface = ({
  type = 'secondary',
  children,
  style,
  ...rest
}) => {
  const effect = tokens.theme.glassEffect[type];

  return (
    <BlurView
      intensity={effect.intensity}
      tint={effect.tint}
      style={[styles.container, style]}
      {...rest}
    >
      {/* Optional overlay to adjust background darkness based on type */}
      <View style={StyleSheet.absoluteFillObject} />
      {children}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
```

### Blueprint: `PrimaryButton`

```tsx
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { Pressable, StyleSheet } from 'react-native';
import { AppText } from './AppText';

export const PrimaryButton = ({ label, onPress, variant = 'solid' }) => {
  const scale = useSharedValue(1);

  const stylez = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96);
  };
  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View style={[stylez]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.base, variant === 'solid' ? styles.solid : styles.glass]}
      >
        <AppText
          variant="subtitle"
          color={variant === 'solid' ? 'primary' : 'muted'}
        >
          {label}
        </AppText>
      </Pressable>
    </Animated.View>
  );
};
```
