import { useQuery } from '@tanstack/react-query';
import {
  CustomCombo,
  AppVideo,
  RawYouTubePlaylistItemDetails,
} from '@/services/youtube.types';
import { youtubeClient } from '@/services/youtubeClient';

export function useComboAggregation(combo: CustomCombo | undefined) {
  return useQuery({
    queryKey: ['comboAggregation', combo?.id],
    queryFn: async (): Promise<AppVideo[]> => {
      if (!combo || !combo.items.length) return [];

      const videoIds = new Set<string>();

      // 1. Group items by type
      const directVideoIds: string[] = [];
      const playlistIds: string[] = [];
      const channelIds: string[] = [];

      combo.items.forEach((item) => {
        if (item.type === 'video') directVideoIds.push(item.id);
        else if (item.type === 'playlist') playlistIds.push(item.id);
        else if (item.type === 'channel') channelIds.push(item.id);
      });

      // Add direct video IDs immediately
      directVideoIds.forEach((id) => videoIds.add(id));

      // 2. Fetch all child video IDs for each Playlist
      await Promise.all(
        playlistIds.map(async (pid) => {
          let pageToken: string | undefined = undefined;
          do {
            const res = (await youtubeClient.getPlaylistItems(
              pid,
              pageToken
            )) as {
              items?: RawYouTubePlaylistItemDetails[];
              nextPageToken?: string;
            };
            if (res.items) {
              res.items.forEach((item) => {
                if (item.contentDetails?.videoId) {
                  videoIds.add(item.contentDetails.videoId);
                }
              });
            }
            pageToken = res.nextPageToken;
          } while (pageToken);
        })
      );

      // 3. Fetch recent videos from each Channel's "uploads" playlist
      if (channelIds.length > 0) {
        const channels = await youtubeClient.getChannels(channelIds);
        await Promise.all(
          channels.map(async (ch) => {
            if (ch.uploadsPlaylistId) {
              // We only fetch the first page (up to 50) recent videos for a channel's combo representation.
              const res = (await youtubeClient.getPlaylistItems(
                ch.uploadsPlaylistId
              )) as {
                items?: RawYouTubePlaylistItemDetails[];
                nextPageToken?: string;
              };
              if (res.items) {
                res.items.forEach((item) => {
                  if (item.contentDetails?.videoId) {
                    videoIds.add(item.contentDetails.videoId);
                  }
                });
              }
            }
          })
        );
      }

      const deduplicatedVideoIds = Array.from(videoIds);

      // 4. Fetch all Video details in chunks
      if (!deduplicatedVideoIds.length) return [];

      const videos = await youtubeClient.getVideos(deduplicatedVideoIds);
      return videos;
    },
    enabled: !!combo && combo.items.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}
