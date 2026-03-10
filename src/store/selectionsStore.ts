import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AllUserSelections, UserSelection } from '@/types';

interface SelectionsState {
  selections: AllUserSelections;
  _hasHydrated: boolean;
  addSelection: (showId: string, contestantId: string) => void;
  removeSelection: (showId: string) => void;
  clearAll: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useSelectionsStore = create<SelectionsState>()(
  persist(
    (set) => ({
      selections: {},
      _hasHydrated: false,
      setHasHydrated: (value) => set({ _hasHydrated: value }),
      addSelection: (showId, contestantId) => {
        const newSelection: UserSelection = {
          showId,
          contestantId,
          timestamp: Date.now(),
        };
        set((state) => ({
          selections: { ...state.selections, [showId]: newSelection },
        }));
        // 後方互換性: lastSelection も更新
        if (typeof window !== 'undefined') {
          localStorage.setItem('lastSelection', JSON.stringify(newSelection));
        }
      },
      removeSelection: (showId) =>
        set((state) => {
          const next = { ...state.selections };
          delete next[showId];
          return { selections: next };
        }),
      clearAll: () => {
        set({ selections: {} });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('lastSelection');
        }
      },
    }),
    {
      name: 'allSelections',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : ({} as Storage)
      ),
      onRehydrateStorage: () => (state) => {
        // 旧 lastSelection キーのマイグレーション（1回のみ）
        if (typeof window !== 'undefined') {
          const legacy = localStorage.getItem('lastSelection');
          const allSaved = localStorage.getItem('allSelections');
          if (legacy && !allSaved && state) {
            try {
              const legacySel: UserSelection = JSON.parse(legacy);
              state.selections = { [legacySel.showId]: legacySel };
            } catch {
              // ignore
            }
          }
        }
        state?.setHasHydrated(true);
      },
    }
  )
);
