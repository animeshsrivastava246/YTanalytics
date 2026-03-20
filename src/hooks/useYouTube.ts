import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { youtubeClient } from '@/services/youtubeClient';

import {
  RawYouTubeSearchItem,
  RawYouTubePlaylistItemDetails,
} from '@/services/youtube.types';

export function useSearch(
  query: string,
  type: 'video' | 'playlist' | 'channel'
) {
  return useQuery({
    queryKey: ['search', type, query],
    queryFn: async () => {
      const data = await youtubeClient.search(query, type);
      return data as { items: RawYouTubeSearchItem[]; nextPageToken?: string };
    },
    enabled: !!query,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useVideo(id: string) {
  return useQuery({
    queryKey: ['video', id],
    queryFn: async () => {
      const videos = await youtubeClient.getVideos([id]);
      return videos[0];
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useVideos(ids: string[]) {
  return useQuery({
    queryKey: ['videos', ids],
    queryFn: () => youtubeClient.getVideos(ids),
    enabled: ids.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePlaylist(id: string) {
  return useQuery({
    queryKey: ['playlist', id],
    queryFn: async () => {
      const playlists = await youtubeClient.getPlaylists([id]);
      return playlists[0];
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useChannel(id: string) {
  return useQuery({
    queryKey: ['channel', id],
    queryFn: async () => {
      const channels = await youtubeClient.getChannels([id]);
      return channels[0];
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePlaylistItems(playlistId: string) {
  return useInfiniteQuery({
    queryKey: ['playlistItems', playlistId],
    queryFn: async ({ pageParam }) => {
      const data = await youtubeClient.getPlaylistItems(playlistId, pageParam);
      return data as {
        items: RawYouTubePlaylistItemDetails[];
        nextPageToken?: string;
      };
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
    enabled: !!playlistId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCommentThreads(videoId: string, maxResults = 20) {
  return useInfiniteQuery({
    queryKey: ['commentThreads', videoId],
    queryFn: ({ pageParam }) =>
      youtubeClient.getCommentThreads(videoId, maxResults, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
    enabled: !!videoId,
    staleTime: 5 * 60 * 1000,
  });
}
