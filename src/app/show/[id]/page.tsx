'use client';

import { shows } from '@/data/shows';
import { Contestant } from '@/types';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect, useCallback, use } from 'react';
import ContestantGrid from '@/features/contestants/ContestantGrid';
import StickySelectionBar from '@/features/contestants/StickySelectionBar';
import { useSelections } from '@/shared/hooks/useSelections';

interface ShowPageProps {
  params: Promise<{ id: string }>;
}

export default function ShowPage({ params }: ShowPageProps) {
  const resolvedParams = use(params);
  const [selectedContestant, setSelectedContestant] = useState<Contestant | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const { addSelection, getSelection } = useSelections();

  const show = shows.find((s) => s.id === resolvedParams.id);

  // 既存選択を復元
  useEffect(() => {
    if (!show) return;
    const existing = getSelection(show.id);
    if (existing) {
      const contestant = show.contestants.find((c) => c.id === existing.contestantId);
      if (contestant) setSelectedContestant(contestant);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedParams.id]);

  const handleContestantSelect = useCallback((contestant: Contestant) => {
    if (!show) return;
    setIsSelecting(true);
    setSelectedContestant(contestant);
    addSelection(show.id, contestant.id);
    setTimeout(() => setIsSelecting(false), 500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show?.id, addSelection]);

  if (!show) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mint-50 to-bg-warm dark:from-dark-bg dark:to-dark-surface flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            番組が見つかりません
          </h1>
          <Link href="/" className="text-mint-600 hover:text-mint-500 underline">
            ホームに戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 to-bg-warm dark:from-dark-bg dark:to-dark-surface">
      <div className="container mx-auto px-4 py-8 pb-28">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            {show.title}
          </h1>

          {show.debutGroup && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              デビューグループ:{' '}
              {show.officialWebsite ? (
                <span
                  className="font-semibold text-mint-600 hover:text-mint-500 dark:text-mint-400 dark:hover:text-mint-300 cursor-pointer hover:underline inline-flex items-center gap-1"
                  onClick={() => window.open(show.officialWebsite, '_blank', 'noopener,noreferrer')}
                >
                  {show.debutGroup}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </span>
              ) : (
                <span className="font-semibold">{show.debutGroup}</span>
              )}
            </p>
          )}
        </motion.div>

        <ContestantGrid
          show={show}
          selectedContestantId={selectedContestant?.id}
          isSelecting={isSelecting}
          onSelect={handleContestantSelect}
        />
      </div>

      {selectedContestant && (
        <StickySelectionBar contestant={selectedContestant} />
      )}
    </div>
  );
}
