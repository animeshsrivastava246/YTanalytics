# Phase 7: Feature Modules & Screen Specs

## Task 21: Home / Dashboard Screen
- **Layout**: Uses a `ScrollView` with safe area at the top and bottom.
- **Hero Header**: `PrimaryGlass` container featuring a welcoming message and a quick search bar that acts as a button (pushes to Search Screen).
- **Recent Searches Section**: Horizontally scrolling `ScrollView` of `Chip` components showing recent queries.
- **Saved Combos**: A vertical list using `Card` primitives to show the user's top 3 saved combos, displaying thumbnail previews of the videos inside, total count, and total duration.

## Task 22: Search & Results Screen
- **Search Bar**: Sticky `SecondaryGlass` header containing a standard React Native `TextInput` auto-focused on mount.
- **Filters**: Directly below the search bar, a horizontal list of `Chip`s (Videos, Playlists, Channels). Defaults to Videos.
- **Results List**: `FlashList` (or `FlatList`) showing results.
  - *Video Row*: Thumbnail on the left, Title and Channel name on the right. Overlaid `StatPill` on bottom right of thumbnail for duration.
  - *Channel Row*: Circular avatar thumbnail on the left, Channel Name and subscriber count on right.
- **Interaction**: Pressing a row uses a React Native ease scale animation and pushes to the respective Detail screen.

## Task 23: Video Detail Screen
- **Hero Image**: Fills top 30% of screen. Back button is an `IconButton` floating on `TertiaryGlass` in the top left.
- **Title Block**: `AppText(h2)` for title, below it the channel name.
- **Time Block (The core feature)**:
  - A `SecondaryGlass` card.
  - Shows "Base Duration: `HH:MM:SS`".
  - A row of `Chip`s to select playback speed (1x, 1.25x, 1.5x, 2x).
  - Below, prominently displays "Time to Watch: `HH:MM:SS`".
  - A highlight text in `accentPrimary` color: "You save: `HH:MM:SS`".
- **Stats Block**: 3-column grid showing Views, Likes, and Comments (using abbreviated numbers like "1.2M").

## Task 24: Playlist & Channel Detail Screens

### Playlist Detail
- **Header**: Shows playlist thumbnail (blurred heavily as a background), clear thumbnail in foreground, Playlist Title, and total video count.
- **Aggregate Time Block**: Similar to Video Detail, but calculates the watch time for the *entire* playlist. Uses the Phase 6 `useWatchTime` hook passing the list of playlist items.
- **Video List**: A vertical list of videos in the playlist.

### Channel Detail
- **Header**: Channel banner image, circular avatar, Channel Title, subscriber count.
- **Uploads/Playlists Tabs**: Custom segmented control to switch between the channel's recent uploads and curated playlists.

## Task 25: Combos Feature Screens

- **Combos List (`(tabs)/combos.tsx`)**: Global view of all user-created `CustomCombo`s. 
- **Combo Detail Screen**: 
  - Header: Combo Title and "Edit" button.
  - Stats: Total items, Total Duration, Watch Time at Speed (with speed chips).
  - Items List: Reorderable list of the videos/playlists inside the combo.
- **Combo Builder/Editor Modal**:
  - Requires a search interface to find YouTube elements and add them to a local shopping-cart-style list.
  - Can remove items or rearrange them. Save writes data to local storage (Zustand/AsyncStorage).
