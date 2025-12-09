## React Native - YT analysis - PRD 

### Overview

Mobile app (React Native) to search YouTube videos/playlists and display key analytics—total watch time (adjusted by playback speed), likes, views, comments. Users can also paste YouTube URLs for instant stats. No authentication or video playback due to API limits.

### Key Features

- Search videos/playlists with filters (category, upload date, relevance).
- Paste YouTube links to fetch analytics directly.
- Set playback speed (1x, 2x, 3x, etc.) to calculate adjusted total watch time.
- Show likes, views, comments for videos; aggregate stats for playlists.
- Real-time data fetching with caching to handle API rate limits.


### User Flow

1. Open app → search or paste URL
2. View results with thumbnails and basic info
3. Select playback speed
4. See adjusted watch time and engagement stats
5. Navigate back to search

### Technical Specifications

- **Frontend:** React Native, Redux/Context API, React Navigation, Axios, Day.js, React Native Paper/NativeBase
- **Backend:** Optional Node.js + Express for caching or aggregation
- **API:** YouTube Data API v3 — search, video, playlist endpoints
- **Caching:** Use AsyncStorage/in-memory cache to reduce API calls
- **No video playback** due to free API tier


### Wireframe Outline

- **Search Screen:** Search bar, filters, results list with thumbnails and brief stats, URL input field
- **Details Screen:** Video/playlist title \& thumbnail, playback speed selector, adjusted watch time, likes/views/comments display, aggregated playlist stats