// ─── App-level Domain Entities ───────────────────────────────────────────────

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
  publishedAt: string;
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

export interface AppCommentThread {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  publishedAt: string;
  likeCount: number;
}

// ─── Custom Combo (App-level virtual entity) ─────────────────────────────────

export type ComboItemType = 'video' | 'playlist' | 'channel';

export interface ComboItem {
  id: string; // The YouTube ID
  type: ComboItemType;
  title: string;
  thumbnailUrl: string;
}

export interface CustomCombo {
  id: string; // Internal UUID
  title: string;
  items: ComboItem[];
  createdAt: string; // ISO Date string
}

// ─── Raw YouTube API Response Types ──────────────────────────────────────────

export interface RawThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface RawYouTubeVideoItem {
  id: string;
  snippet?: {
    title?: string;
    description?: string;
    thumbnails?: { high?: RawThumbnail };
    publishedAt?: string;
    channelId?: string;
    channelTitle?: string;
  };
  contentDetails?: {
    duration?: string;
  };
  statistics?: {
    viewCount?: string;
    likeCount?: string;
    commentCount?: string;
  };
}

export interface RawYouTubePlaylistItem {
  id: string;
  snippet?: {
    title?: string;
    description?: string;
    thumbnails?: { high?: RawThumbnail };
    channelId?: string;
    channelTitle?: string;
  };
  contentDetails?: {
    itemCount?: number;
  };
}

export interface RawYouTubeChannelItem {
  id: string;
  snippet?: {
    title?: string;
    description?: string;
    thumbnails?: { high?: RawThumbnail };
  };
  statistics?: {
    subscriberCount?: string;
    videoCount?: string;
  };
}

export interface RawYouTubeCommentThreadItem {
  id: string;
  snippet?: {
    topLevelComment?: {
      snippet?: {
        authorDisplayName?: string;
        authorProfileImageUrl?: string;
        textDisplay?: string;
        publishedAt?: string;
        likeCount?: number;
      };
    };
  };
}

export interface RawYouTubePlaylistItemDetails {
  contentDetails: {
    videoId: string;
  };
}

export interface RawYouTubeSearchItem {
  id: {
    kind: string;
    videoId?: string;
    playlistId?: string;
    channelId?: string;
  };
  snippet?: {
    title?: string;
    description?: string;
    thumbnails?: { high?: RawThumbnail };
    channelId?: string;
    channelTitle?: string;
    publishedAt?: string;
  };
}

// ─── Quota Error ─────────────────────────────────────────────────────────────

export class QuotaExceededError extends Error {
  constructor() {
    super('YouTube API daily quota exceeded.');
    this.name = 'QuotaExceededError';
  }
}
