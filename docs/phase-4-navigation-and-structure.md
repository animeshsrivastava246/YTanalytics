# Phase 4: Navigation & App Structure (Expo Router)

## Task 11: File Structure

The project adopts a domain-driven feature architecture organized tightly around the Expo Router filesystem conventions.

```text
YTanalytics/
├── app/                  # Expo Router filesystem routing
│   ├── _layout.tsx       # Root layout configuration & providers
│   ├── (tabs)/
│   │   ├── _layout.tsx   # Glass bottom tab bar config
│   │   ├── index.tsx     # Home / Dashboard
│   │   ├── combos.tsx    # Combos list
│   │   ├── settings.tsx  # Settings screen
│   ├── search/
│   │   └── index.tsx     # Search results screen
│   ├── video/
│   │   └── [id].tsx      # Video detail screen
│   ├── playlist/
│   │   └── [id].tsx      # Playlist detail screen
│   ├── channel/
│   │   └── [id].tsx      # Channel detail screen
├── src/                  # Main business logic & UI (can reside in root or /src)
│   ├── assets/           # Images, fonts, animations
│   ├── components/       # Global primitive components (e.g., GlassSurface, AppText)
│   ├── constants/        # Design tokens, API keys
│   ├── features/         # Domain-driven feature modules
│   │   ├── video/        # Video-specific components, hooks
│   │   ├── playlist/     # Playlist-specific components, hooks
│   │   ├── channel/      # Channel-specific components, hooks
│   │   ├── search/       # Sub-components for search UI
│   │   ├── combos/       # Combo builder UI & local state
│   ├── hooks/            # Global hooks (useTheme, useNetwork)
│   ├── services/         # API clients (youtubeClient.ts)
│   ├── utils/            # Pure functions (watchTime.ts)
```

**Rule of Thumb**: The `app/` directory handles pure orchestration, screen transitions, and injecting route parameters `[id]`. Complex UI or state logic resides in `src/features/`.

---

## Task 12: Navigation Flows

1. **Primary Navigation (Tabs)**
   - `(tabs)/index.tsx` (Home): Entry point. Shows recent searches, quick access to combos.
   - `(tabs)/combos.tsx` (Combos): Dedicated manager for user-created CustomCombos.
   - `(tabs)/settings.tsx` (Settings): App color scheme, global speed defaults, API limits.

2. **Search Flow**
   - User taps the Search bar in `Home` -> navigates to `app/search/index.tsx`.
   - Result list is segmented by filters (video, playlist, channel).
   - Tapping a result pushes the relevant detail screen (e.g., `app/video/[id].tsx`) onto the stack.

3. **Detail Screens & Deep Linking**
   - Detail screens accept a unique YouTube ID via route params (`useLocalSearchParams()`).
   - Deep linking supported out of the box (e.g., scheme `ytanalytics://video/xyz123`).
   - Back actions pop the stack smoothly back to the previous context.

4. **Modals**
   - For interrupting tasks like "Create Combo" or "Select Playback Speed", use a screen configured with `presentation: 'modal'` or an in-component bottom sheet.

---

## Task 13: Glass Usage in Layouts

- **Root Layout (`app/_layout.tsx`)**:
  - Sets the global page background to `surfaceBg`. Typically no glass is required at the absolute root unless it's a persistent dark overlay.
- **Tabs Layout (`app/(tabs)/_layout.tsx`)**:
  - Sets the `tabBarBackground` prop to render a `PrimaryGlass` component. This anchors the UI and mimics the iOS liquid bottom tab feel.
  - Tab headers: Sets `headerTransparent: true` and `headerBackground` to a `PrimaryGlass` component so content slides gracefully beneath the header.
- **Scroll Headers / Sticky Floating Elements**:
  - Elements like a scrolling search bar override leverage `SecondaryGlass` to separate them visually from list content without completely obfuscating what's beneath.
