# Phase 8: Animations & Micro-Interactions

## Task 26: Global Animation Guidelines

To achieve the "liquid glass" premium feel, YTanalytics animation philosophy is grounded in iOS HIG physics:

1. **Performance First**: All animations must run on the UI thread. Use `react-native-reanimated` for complex interpolated transitions and layout changes. Use `react-native-ease` or simple Reanimated hooks for tactile micro-interactions.
2. **Interruptibility**: No animation should block a user's gesture. If a card is scaling up on press out, and the user presses it again mid-animation, it should spring back down fluidly from its current scale without jumping.
3. **Speed**: Micro-interactions are fast (100ms-250ms). Screen transitions and layout shifts are slightly longer (300ms-400ms) to allow the eye to track the movement.
4. **Spring Physics over Linear/Ease**: Almost all animations should utilize Spring physics to feel organic rather than rigid, linear easings.

---

## Task 27: Per-Component Animation Specs

### 1. `PrimaryButton` / `IconButton`
- **Trigger**: `onPressIn` / `onPressOut`
- **Action**: Scale transform.
- **Values**: `1` -> `0.95` -> `1`.
- **Physics**: Fast spring (`mass: 1, damping: 15, stiffness: 300`).
- **Implementation**: Reanimated hooks or `react-native-ease`.

### 2. `Chip` (Filter toggles)
- **Trigger**: `onPress`
- **Action**: Scale down slightly and crossfade background color.
- **Values**: Scale `1` -> `0.92` -> `1`. Background color interpolates between `SurfaceSecondary` and `AccentSecondary`.
- **Physics**: Interpolated timing (e.g., `withTiming(..., { duration: 150 })`).

### 3. List Item / `Card` Entrance
- **Trigger**: On mount (when data resolves from query).
- **Action**: Staggered fade and slide up.
- **Values**: Opacity `0` -> `1`. TranslateY `20` -> `0`.
- **Physics**: Staggered by `idx * 50ms`. Spring entrance.
- **Implementation**: Reanimated `FadeInDown.delay(index * 50).springify()`.

### 4. Bottom Sheets (Modals / Combo Builder)
- **Trigger**: User action opening a modal.
- **Action**: Slide up from bottom of screen, pulling a dark overlay behind it.
- **Values**: TranslateY `ScreenHeight` -> `0`. Backdrop Opacity `0` -> `0.6`.
- **Physics**: Medium spring (`damping: 20, stiffness: 200`).
- **Implementation**: `@gorhom/bottom-sheet` or native Expo Router modal presentation.
