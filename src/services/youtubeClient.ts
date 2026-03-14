import axios from 'axios';
import { AppVideo, AppPlaylist, AppChannel } from './youtube.types';
import { parseISO8601DurationToSeconds } from '@/utils/watchTime';

const API_KEY = process.env.EXPO_PUBLIC_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
  },
});

export const youtubeClient = {
  async search(query: string, type: 'video' | 'playlist' | 'channel', maxResults = 25, pageToken?: string) {
    const { data } = await api.get('/search', {
      params: {
        q: query,
        type,
        part: 'snippet',
        maxResults,
        pageToken,
        fields: 'nextPageToken,items(id,snippet(title,channelTitle,channelId,thumbnails/high))',
      },
    });
    return data;
  },

  async getVideos(ids: string[]): Promise<AppVideo[]> {
    if (!ids.length) return [];
    
    // Chunking to handle max 50 items per request
    const chunkSize = 50;
    let allVideos: AppVideo[] = [];
    
    for (let i = 0; i < ids.length; i += chunkSize) {
      const chunk = ids.slice(i, i + chunkSize);
      
      const { data } = await api.get('/videos', {
        params: {
          id: chunk.join(','),
          part: 'snippet,contentDetails,statistics',
          fields: 'items(id,snippet(title,description,thumbnails/high,publishedAt,channelId,channelTitle),contentDetails(duration),statistics(viewCount,likeCount,commentCount))',
        },
      });

      const mappedVideos: AppVideo[] = (data.items || []).map((item: any) => ({
        id: item.id,
        title: item.snippet?.title || '',
        description: item.snippet?.description || '',
        thumbnail: item.snippet?.thumbnails?.high || { url: '', width: 0, height: 0 },
        durationSeconds: parseISO8601DurationToSeconds(item.contentDetails?.duration || ''),
        viewCount: item.statistics?.viewCount ? parseInt(item.statistics.viewCount, 10) : 0,
        likeCount: item.statistics?.likeCount ? parseInt(item.statistics.likeCount, 10) : 0,
        commentCount: item.statistics?.commentCount ? parseInt(item.statistics.commentCount, 10) : 0,
        publishedAt: item.snippet?.publishedAt || '',
        channelId: item.snippet?.channelId || '',
        channelTitle: item.snippet?.channelTitle || '',
      }));
      
      allVideos = [...allVideos, ...mappedVideos];
    }
    
    return allVideos;
  },

  async getPlaylists(ids: string[]): Promise<AppPlaylist[]> {
    if (!ids.length) return [];
    
    const { data } = await api.get('/playlists', {
      params: {
        id: ids.join(','),
        part: 'snippet,contentDetails',
        fields: 'items(id,snippet(title,description,thumbnails/high,channelId,channelTitle),contentDetails(itemCount))',
      },
    });

    return (data.items || []).map((item: any) => ({
      id: item.id,
      title: item.snippet?.title || '',
      description: item.snippet?.description || '',
      thumbnail: item.snippet?.thumbnails?.high || { url: '', width: 0, height: 0 },
      videoCount: item.contentDetails?.itemCount ? parseInt(item.contentDetails.itemCount, 10) : 0,
      channelId: item.snippet?.channelId || '',
      channelTitle: item.snippet?.channelTitle || '',
    }));
  },

  async getChannels(ids: string[]): Promise<AppChannel[]> {
    if (!ids.length) return [];
    
    const { data } = await api.get('/channels', {
      params: {
        id: ids.join(','),
        part: 'snippet,statistics',
        fields: 'items(id,snippet(title,description,thumbnails/high),statistics(subscriberCount,videoCount))',
      },
    });

    return (data.items || []).map((item: any) => ({
      id: item.id,
      title: item.snippet?.title || '',
      description: item.snippet?.description || '',
      thumbnail: item.snippet?.thumbnails?.high || { url: '', width: 0, height: 0 },
      subscriberCount: item.statistics?.subscriberCount ? parseInt(item.statistics.subscriberCount, 10) : 0,
      videoCount: item.statistics?.videoCount ? parseInt(item.statistics.videoCount, 10) : 0,
    }));
  },

  async getPlaylistItems(playlistId: string, pageToken?: string) {
    const { data } = await api.get('/playlistItems', {
      params: {
        playlistId,
        part: 'contentDetails',
        maxResults: 50,
        pageToken,
        fields: 'nextPageToken,items(contentDetails(videoId))',
      },
    });
    return data; // Returns videoIds to be fetched by `getVideos`
  }
};
