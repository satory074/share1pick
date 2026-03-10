'use client';

import { useMemo } from 'react';
import { useSelectionsStore } from '@/store/selectionsStore';
import { shows } from '@/data/shows';
import { MultiPickData } from '@/types';

/**
 * 選択状態を管理するカスタムフック（Zustand store のアダプター）
 * SSRハイドレーション完了前は selectionCount を 0 として扱う
 */
export function useSelections() {
  const {
    selections,
    _hasHydrated,
    addSelection,
    removeSelection,
    clearAll: clearAllSelections,
  } = useSelectionsStore();

  const getAllMultiPickData = useMemo((): MultiPickData[] => {
    if (!_hasHydrated) return [];
    return Object.values(selections)
      .map((sel) => {
        const show = shows.find((s) => s.id === sel.showId);
        const contestant = show?.contestants.find((c) => c.id === sel.contestantId);
        if (!show || !contestant) return null;
        return { show, contestant };
      })
      .filter((item): item is MultiPickData => item !== null);
  }, [selections, _hasHydrated]);

  const getSelectionCount = (): number => {
    if (!_hasHydrated) return 0;
    return Object.keys(selections).length;
  };

  const hasSelection = (showId: string): boolean => {
    if (!_hasHydrated) return false;
    return showId in selections;
  };

  const getSelection = (showId: string) => {
    if (!_hasHydrated) return null;
    return selections[showId] ?? null;
  };

  return {
    selections: _hasHydrated ? selections : {},
    addSelection,
    removeSelection,
    getSelection,
    getAllMultiPickData,
    getSelectionCount,
    hasSelection,
    clearAllSelections,
  };
}
