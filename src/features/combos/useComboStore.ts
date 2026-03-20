import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ComboItem, CustomCombo } from '@/services/youtube.types';

export type { ComboItem, CustomCombo };

interface ComboStore {
  combos: CustomCombo[];
  addCombo: (title: string, items: ComboItem[]) => void;
  updateCombo: (id: string, updates: Partial<CustomCombo>) => void;
  deleteCombo: (id: string) => void;
}

export const useComboStore = create<ComboStore>()(
  persist(
    (set) => ({
      combos: [],
      addCombo: (title, items) => {
        const newCombo: CustomCombo = {
          id: Date.now().toString(), // Simple TS UUID equivalent
          title,
          items,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ combos: [...state.combos, newCombo] }));
      },
      updateCombo: (id, updates) => {
        set((state) => ({
          combos: state.combos.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
      },
      deleteCombo: (id) => {
        set((state) => ({
          combos: state.combos.filter((c) => c.id !== id),
        }));
      },
    }),
    {
      name: 'ytanalytics-combos-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
