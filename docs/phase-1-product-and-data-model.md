# Phase 1 – Product Definition & Data Model

## t1: Define core entities and fields
The domain model for YTanalytics relies on four core entities.

### Video
| Field | Type | Source (API Field) | Required |
|---|---|---|---|
| `id` | string | `id` | Yes |
| `title` | string | `snippet.title` | Yes |
| `description` | string | `snippet.description` | No |
| `thumbnails` | object | `snippet.thumbnails` | Yes |
| `duration` | string | `contentDetails.duration` | Yes |
| `views` | string | `statistics.viewCount` | No |
| `likes` | string | `statistics.likeCount` | No |
| `commentsCount` | string | `statistics.commentCount` | No |
| `publishedAt` | string | `snippet.publishedAt` | Yes |
| `channelId` | string | `snippet.channelId` | Yes |
| `channelTitle` | string | `snippet.channelTitle` | Yes |

### Playlist
| Field | Type | Source (API Field) | Required |
|---|---|---|---|
| `id` | string | `id` | Yes |
| `title` | string | `snippet.title` | Yes |
| `description` | string | `snippet.description` | No |
| `thumbnails` | object | `snippet.thumbnails` | Yes |
| `videoCount` | number | `contentDetails.itemCount` | Yes |
| `channelId` | string | `snippet.channelId` | Yes |
| `channelTitle` | string | `snippet.channelTitle` | Yes |

### Channel
| Field | Type | Source (API Field) | Required |
|---|---|---|---|
| `id` | string | `id` | Yes |
| `title` | string | `snippet.title` | Yes |
| `description` | string | `snippet.description` | No |
| `thumbnails` | object | `snippet.thumbnails` | Yes |
| `subscriberCount` | string | `statistics.subscriberCount` | No |
| `videoCount` | string | `statistics.videoCount` | No |

### CustomCombo
*Note: This is an app-level virtual entity rather than an API entity.*
| Field | Type | Source | Required |
|---|---|---|---|
| `id` | string | UUID (Internal) | Yes |
| `title` | string | User Input | Yes |
| `items` | array | Array of mixed typed IDs (Videos, Playlists, Channels) | Yes |
| `createdAt` | string | ISO Date string (Internal) | Yes |

---

## t2: Map entities to YouTube Data API v3 endpoints

| Entity/Feature | Endpoint Used | `part` Values Required | Notes for efficient usage |
|---|---|---|---|
| Videos | `videos.list` | `snippet,contentDetails,statistics` | Can batch query up to 50 IDs at once (`id=id1,id2,id3`). Use `fields` to limit payload size. |
| Playlists | `playlists.list` | `snippet,contentDetails` | Can batch query IDs. |
| Playlist Items | `playlistItems.list`| `snippet,contentDetails` | Used to expand a playlist and fetch its videos. Requires pagination. |
| Channels | `channels.list` | `snippet,statistics` | Can batch query IDs. |
| Search | `search.list` | `snippet` | High quota cost (100 units). Limit `maxResults`. Requires subsequent `videos.list` calls to get full `contentDetails.duration`. |
| Comments (v2) | `commentThreads.list`| `snippet` | For viewing a video's comments top-level threads. |

---

## t3: Define watch-time computation rules

**Formulas**:
- Total Duration: The sum of `parseISO8601DurationToSeconds()` for all videos in a list.
- Watch Time at Speed: `Total Duration / Playback Speed` (where speed is 0.25x - 3x).
- Time Saved: `Total Duration - Watch Time at Speed` (If speed > 1x. If speed < 1x, Time Saved is negative, meaning "Extra Time Needed").

**Edge Cases**:
- No Videos: Duration is 0, Watch Time is 0, Time Saved is 0.
- 0 Duration Video: Treat duration as 0 (e.g. Streams with unknown length).
- Non-standard speeds: Fallback to nearest reasonable default or cap at 3x to avoid absurd numbers.

**Formatting**:
- Round times to nearest whole second.
- Format duration as `HH:MM:SS` (e.g. `01:15:30`), omitting hours if 0 (e.g. `15:30`), omitting minutes if 0 but pad `0:54`.
- Present 'Time Saved' with a prefix text like: `"You save HH:MM:SS"`.

---

## t4: Specify YouTube API quota and optimization constraints

Daily default quota: 10,000 units per project.

**Optimization Strategies**:
1. **Batching**: Never request video details in a loop 1-by-1. Group `videos.list` requests in batches of 50.
2. **Field Limits**: Always use the `fields` parameter to request exactly what is needed (e.g. `fields=items(id,snippet(title,thumbnails,publishedAt,channelId,channelTitle),contentDetails(duration),statistics(viewCount,likeCount,commentCount))`). This drastically reduces payload processing time.
3. **Caching**: Utilize `react-query` to cache endpoint results with reasonable stale times (e.g., 5 mins) to prevent burning quota when users flip between screens or tabs.
4. **Duplicate Requests Prevention**: Filter out IDs that have already been resolved globally or in the cache before making batch calls.

**Quota Exceeded Fallback UX**:
- Catch `403 quotaExceeded` responses globally in the API client layer.
- Ensure the app displays a non-blocking UI alert or a friendly "Oops! YouTube API daily limit reached." state instead of a hard crash.
- Retrying a quota error should be blocked until token refresh or subsequent day.
