# Phase 10: Implementation Planning for Coding Agents

## Task 33: Map Specs to Implementation Tickets

Here is the structured sequence for an AI coding agent to build YTanalytics.

**Ticket 1: Foundation & Navigation Setup**

- **Description:** Initialize Expo Router file structure (`app/`), `src/` folders. Configure tab routing and empty screens representing the skeletons of Home, Search, Combos, and Settings.
- **Reference:** Phase 4 (`phase-4-navigation-and-structure.md`)
- **AC:** App boots. Bottom tabs visible. Fluid navigation between tabs works.

**Ticket 2: Design Tokens & Core Utilities**

- **Description:** Create `src/constants/tokens.ts` using Phase 2 specs. Create `src/utils/watchTime.ts` using Phase 6 specs.
- **Reference:** Phase 2 & Phase 6
- **AC:** Utilities pass Jest tests. Theme tokens export cleanly.

**Ticket 3: UI Primitives**

- **Description:** Implement `GlassSurface`, `AppText`, `IconButton`, `PrimaryButton`, `Card`, and `Chip` with standard react-native-ease animations.
- **Reference:** Phase 3 & Phase 8
- **AC:** Storybook/Test screen renders all primitives gracefully.

**Ticket 4: API Client & React Query Hooks**

- **Description:** Implement `src/services/youtubeClient.ts` and React Query hooks (`useSearch`, `useVideos`, etc.). Create TS interfaces.
- **Reference:** Phase 5
- **AC:** Can fetch real YouTube data and map to our normalized TS interfaces.

**Ticket 5: Feature: Search & Video Detail**

- **Description:** Build `app/search/index.tsx` and `app/video/[id].tsx`. Connect to API hooks. Implement `useWatchTime` logic.
- **Reference:** Phase 6 & Phase 7
- **AC:** User can search, parse a video, view speed options, and see accurate "Time Saved".

**Ticket 6: Feature: Playlist & Channel Detail**

- **Description:** Build `app/playlist/[id].tsx` and `app/channel/[id].tsx`. Show aggregate statistics.
- **Reference:** Phase 7
- **AC:** User can tap a playlist and see total watch-time required for 100 videos.

**Ticket 7: Feature: Custom Combos**

- **Description:** Build local state (Zustand) for creating and storing CustomCombos. Build Combo list and detail screens.
- **Reference:** Phase 6 & Phase 7
- **AC:** User can group arbitrary videos/playlists, save them, and see aggregated watch time.

**Ticket 8: Polish (Loading, Errors, Empty States)**

- **Description:** Implemented skeletons, 403 quota guards, offline states, and empty states.
- **Reference:** Phase 9
- **AC:** App behaves predictably without network, gracefully degrades under quota limits.

---

## Task 34: Define MVP vs v2 Scope

### **MVP Scope (Ticket 1 - 8)**

The Minimum Viable Product focuses exclusively on core value: "Saving Time via YouTube Data".

- Search (Videos, Playlists, Channels).
- Video details & Watch-time calculator (1x to 3x).
- Playlist/Channel aggregations.
- Local CustomCombos (AsyncStorage/Zustand).
- Dark/Light Theme.

_Rationale_: This loop proves the product's core utility metric (calculate time saved) without incurring high API costs or backend overhead.

### **V2 Scope (Post-Launch)**

- **Comments/Top Threads**: Fetching top comments requires separate API calls and UI. Excluded from MVP to protect quota and UI complexity.
- **Cloud Sync (User Accounts)**: Syncing CustomCombos across devices via Firebase/Supabase.
- **Advanced Analytics Graphing**: Highlighting channel growth over time (requires tracking historical data not natively provided by simple API calls).
- **Offline Support**: Caching video/playlist thumbnails and titles for offline viewing of saved Combos.
