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
