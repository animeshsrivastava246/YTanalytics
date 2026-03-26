import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemePreference = 'system' | 'light' | 'dark';
export type PlaybackSpeed = 1 | 1.25 | 1.5 | 1.75 | 2;

interface SettingsState {
  playbackSpeed: PlaybackSpeed;
  theme: ThemePreference;
  reduceTransparency: boolean;
  searchHistory: string[];
  setPlaybackSpeed: (speed: PlaybackSpeed) => void;
  setTheme: (theme: ThemePreference) => void;
  setReduceTransparency: (reduce: boolean) => void;
  addSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      playbackSpeed: 1,
      theme: 'system',
      reduceTransparency: false,
      searchHistory: [],

      setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),
      setTheme: (theme) => set({ theme }),
      setReduceTransparency: (reduceTransparency) =>
        set({ reduceTransparency }),
      addSearchHistory: (query) =>
        set((state) => {
          const filtered = state.searchHistory.filter((q) => q !== query);
          return {
            searchHistory: [query, ...filtered].slice(0, 15),
          };
        }),
      clearSearchHistory: () => set({ searchHistory: [] }),
    }),
    {
      name: 'ytanalytics-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
