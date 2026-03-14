# Phase 9: Loading, Error, Empty States & Compliance

## Task 28: Loading and Skeleton States

To avoid jarring layout shifts, all async data fetching must use skeleton placeholders matching the final layout.

- **List Skeletons**: A `FlatList` rendering 5-6 `CardSkeleton` components. These cards have the exact dimensions of a loaded Card but feature a subtle, looping shimmer animation (opacity 0.4 to 0.8) over blocks representing the thumbnail and text lines.
- **Detail Skeletons**: 
  - The hero image is a solid `surfaceGlassSecondary` block.
  - Title and stat blocks are rounded pills (e.g. `borderRadius: 8`) shimmering.
- **Transition**: When data arrives, the skeleton fades out (`opacity: 0`) and the real content fades in (`opacity: 1`) using a 200ms `react-native-ease` transition.

---

## Task 29: Error States

Instead of crashing, the app must gracefully handle three primary error types:

1. **Network Error (No Connection)**  
   - **UI**: A full-screen or inline `Card` with a Wi-Fi slash icon.
   - **Copy**: "You're offline. Check your connection to load video stats."
   - **Action**: "Tap to Retry" button.

2. **API/Server Error (500, malformed data)**  
   - **UI**: A warning icon on a `TertiaryGlass` surface.
   - **Copy**: "Something went wrong communicating with YouTube."
   - **Action**: "Retry" button.

3. **Quota Exceeded (403)**
   - **UI**: A prominent `Card` with an eye-catching illustration/icon.
   - **Copy**: "Daily limit reached! To keep the app free, we limit daily YouTube requests. Check back tomorrow."
   - **Action**: No retry button. Optionally a "Learn More" button opening the settings/info page.

---

## Task 30: Empty States

Empty lists must never be pure blank screens. 

- **Search**: (Before query) "Search for a YouTube video, channel, or playlist."
- **Search**: (No results) "We couldn't find anything for '[Query]'. Try different keywords."
- **Combos**: "You haven't saved any Combos yet. Tap the '+' button to build your first playlist."
- **Recent Searches**: "Your recent searches will appear here."

---

## Task 31: Settings & Preferences

The `app/(tabs)/settings.tsx` screen controls global app behavior.

**Key Settings:**
- **Default Playback Speed**: A slider or segmented control (1x, 1.25x, 1.5x, 2x) that dictates the default speed applied in all `useWatchTime` calculations across the app.
- **Theme**: "System", "Light", "Dark".
- **Glass Intensity**: A toggle to reduce transparency effects for older devices or accessibility.

---

## Task 32: API Compliance Checklist

Before production release, the codebase must pass this checklist per YouTube Data API v3 Terms of Service:
1. **No Data Scraping**: All data is sourced via the official API endpoints, never DOM scraping.
2. **Caching Limits**: Data (like view counts) is not stored permanently. Caching is purely transient (`react-query` memory cache) to prevent excessive quota usage, aligning with ToS limits on data retention.
3. **Attribution**: Where required by ToS, standard YouTube logos and link-backs ("Watch on YouTube") are present on Video Detail screens.
4. **Quota Monitoring**: A mechanism is in place in the Google Cloud Console to alert the developer at 80% and 100% of the 10,000 unit daily limit.
