# Phase 5: API Layer Design (YouTube Data API v3)

## Task 14: YouTube Client Abstraction

A centralized service (`services/youtubeClient.ts`) handles all external HTTPS calls to Google APIs, wrapping standard `fetch` or `axios` methods. It maps raw responses to our normalized TS interfaces.

### Core Methods:

- `search(query: string, type: 'video'|'playlist'|'channel', pageToken?: string)`: Calls `GET /search`. Returns an array of basic ID objects + `nextPageToken`.
- `getVideos(ids: string[])`: Calls `GET /videos?part=snippet,contentDetails,statistics`. Chunks IDs if `ids.length > 50`.
- `getPlaylists(ids: string[])`: Calls `GET /playlists?part=snippet,contentDetails`.
- `getChannels(ids: string[])`: Calls `GET /channels?part=snippet,statistics`.
- `getPlaylistItems(playlistId: string, pageToken?: string)`: Calls `GET /playlistItems`. Returns list of video IDs inside the playlist.

---

## Task 15: TypeScript Interfaces for Normalized Responses

These interfaces represent the shapes consumed by the UI, stripped of YouTube's deeply nested boilerplate.

```typescript
export interface AppThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface AppVideo {
  id: string;
  title: string;
  description?: string;
  thumbnail: AppThumbnail;
  durationSeconds: number; // Parsed from ISO-8601
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  publishedAt: Date;
  channelId: string;
  channelTitle: string;
}

export interface AppPlaylist {
  id: string;
  title: string;
  description?: string;
  thumbnail: AppThumbnail;
  videoCount: number;
  channelId: string;
  channelTitle: string;
}

export interface AppChannel {
  id: string;
  title: string;
  description?: string;
  thumbnail: AppThumbnail;
  subscriberCount?: number;
  videoCount?: number;
}
```

---

## Task 16: Quota-Efficient Fetching Strategies

1. **ID Batching on Search**:
   - `search.list` only returns Video IDs.
   - The client takes those 10-20 IDs, batches them into a single `getVideos` (comma separated string) call, using exactly 1 quota unit instead of 10.
2. **Field Masking**:
   - `fields=items(id,snippet(title,description,thumbnails/high,publishedAt,channelId,channelTitle),contentDetails(duration),statistics)`
3. **Local Combo Flattening Cache**:
   - When resolving elements in a CustomCombo, sort IDs into sets (videos, playlists, channels).
   - Only request chunks of 50. Skip IDs already in `react-query` cache.

---

## Task 17: TanStack Query Hooks

By wrapping the `youtubeClient` methods in `react-query` hooks, we manage loading states and caching.

### Key Hooks:

1. **`useSearch(query, type)`**
   - **Key**: `['search', type, query]`
   - **Stale Time**: 10 minutes (search results rarely need real-time freshness).

2. **`useVideos(ids: string[])` / `useVideo(id: string)`**
   - **Key**: `['video', id]`
   - **Behavior**: `useVideos` takes multiple IDs, triggers batch fetch for any IDs missing from cache, then populates query client cache per-ID using `queryClient.setQueryData(['video', id], data)`.
   - **Stale Time**: 5 minutes.

3. **`usePlaylistItems(playlistId: string)`**
   - **Key**: `['playlistItems', playlistId]`
   - **Behavior**: Uses `useInfiniteQuery` to handle pagination tokens from `playlistItems.list`.

4. **`useCombosData(combo: CustomCombo)`**
   - **Behavior**: An orchestration hook that aggregates `useVideos`, `usePlaylists`, and `useChannels` in parallel based on the combo's item list.
