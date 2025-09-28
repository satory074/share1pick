'use client';

import { useState, useEffect } from 'react';
import { AllUserSelections, UserSelection, MultiPickData } from '@/types';
import { shows } from '@/data/shows';

export function useSelections() {
  const [selections, setSelections] = useState<AllUserSelections>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('allSelections');
      if (saved) {
        try {
          setSelections(JSON.parse(saved));
        } catch (error) {
          console.error('Failed to parse saved selections:', error);
          setSelections({});
        }
      }

      const legacySelection = localStorage.getItem('lastSelection');
      if (legacySelection && !saved) {
        try {
          const legacy: UserSelection = JSON.parse(legacySelection);
          const migrated = { [legacy.showId]: legacy };
          setSelections(migrated);
          localStorage.setItem('allSelections', JSON.stringify(migrated));
        } catch (error) {
          console.error('Failed to migrate legacy selection:', error);
        }
      }
    }
  }, []);

  const saveSelections = (newSelections: AllUserSelections) => {
    setSelections(newSelections);
    if (typeof window !== 'undefined') {
      localStorage.setItem('allSelections', JSON.stringify(newSelections));
    }
  };

  const addSelection = (showId: string, contestantId: string) => {
    const newSelection: UserSelection = {
      showId,
      contestantId,
      timestamp: Date.now()
    };

    const newSelections = {
      ...selections,
      [showId]: newSelection
    };

    saveSelections(newSelections);

    if (typeof window !== 'undefined') {
      localStorage.setItem('lastSelection', JSON.stringify(newSelection));
    }
  };

  const removeSelection = (showId: string) => {
    const newSelections = { ...selections };
    delete newSelections[showId];
    saveSelections(newSelections);
  };

  const getSelection = (showId: string): UserSelection | null => {
    return selections[showId] || null;
  };

  const getAllMultiPickData = (): MultiPickData[] => {
    return Object.values(selections).map(selection => {
      const show = shows.find(s => s.id === selection.showId);
      const contestant = show?.contestants.find(c => c.id === selection.contestantId);

      if (!show || !contestant) {
        return null;
      }

      return { show, contestant };
    }).filter((item): item is MultiPickData => item !== null);
  };

  const getSelectionCount = (): number => {
    return Object.keys(selections).length;
  };

  const hasSelection = (showId: string): boolean => {
    return showId in selections;
  };

  const clearAllSelections = () => {
    setSelections({});
    if (typeof window !== 'undefined') {
      localStorage.removeItem('allSelections');
      localStorage.removeItem('lastSelection');
    }
  };

  return {
    selections,
    addSelection,
    removeSelection,
    getSelection,
    getAllMultiPickData,
    getSelectionCount,
    hasSelection,
    clearAllSelections
  };
}