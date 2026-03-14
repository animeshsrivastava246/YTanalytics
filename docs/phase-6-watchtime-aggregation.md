# Phase 6: Watch-time & Aggregation Logic

## Task 18: Pure Watch-Time Utilities

All watch-time math should reside in pure, perfectly testable functions in `utils/watchTime.ts`.

```typescript
/**
 * Parses a YouTube ISO 8601 duration string (e.g., "PT1H2M10S") into total seconds.
 */
export function parseISO8601DurationToSeconds(duration: string): number { ... }

/**
 * Returns the sum of an array of durations (in seconds).
 */
export function sumDurations(secondsArray: number[]): number { ... }

/**
 * Computes the time it takes to watch `totalSeconds` at `playbackSpeed`.
 */
export function computeTotalTimeAtSpeed(totalSeconds: number, playbackSpeed: number): number { ... }

/**
 * Computes how much time is saved (or lost) by watching at `playbackSpeed`.
 */
export function computeTimeSaved(totalSeconds: number, playbackSpeed: number): number { ... }

/**
 * Formats seconds into a human-readable HH:MM:SS format.
 * Drops the hours if 0. Handles negative values gracefully.
 */
export function formatDuration(totalSeconds: number): string { ... }
```

---

## Task 19: `useWatchTime` Hook Contract

This React hook wires the pure utilities into the component lifecycle, optionally taking an array of video entities and memoizing the math.

```typescript
interface UseWatchTimeResult {
  totalSeconds: number;
  totalFormatted: string;
  timeAtSpeedSeconds: number;
  timeAtSpeedFormatted: string;
  timeSavedSeconds: number;
  timeSavedFormatted: string;
}

export function useWatchTime(videos: AppVideo[], playbackSpeed: number): UseWatchTimeResult {
  return useMemo(() => {
    // 1. Map videos to seconds
    // 2. Sum
    // 3. Compute speed & saved
    // 4. Format all strings
    // Return object
  }, [videos, playbackSpeed]);
}
```
*Note: Using `useMemo` is critical here as formatting large arrays of videos into `AppVideo` on every render can be expensive.*

---

## Task 20: Combo Aggregation Rules

A `CustomCombo` is a user-curated playlist that can mix Videos, Playlists, and Channels together.

**Aggregation Flow:**
1. Given a `CustomCombo`, extract its `items`.
2. Map over the items.
   - For `type === 'video'`, push the ID to a `resolvedVideos` list.
   - For `type === 'playlist'`, use `usePlaylistItems` to fetch all child video IDs, then push them to `resolvedVideos`.
   - For `type === 'channel'`, use `useChannelVideos` (via uploads playlist) to fetch recent video IDs, then push to `resolvedVideos`.
3. Deduplicate `resolvedVideos` so a single video appearing via multiple sources isn't double-counted for duration/stats.
4. Pass the final `resolvedVideos` array to the `useWatchTime` hook.
5. Global stats (total views, likes across the combo) are just a `.reduce()` sum over the `resolvedVideos`.
