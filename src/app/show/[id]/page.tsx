'use client';

import { shows } from '@/data/shows';
import { Contestant } from '@/types';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect, use } from 'react';
import ContestantCard from '@/components/ContestantCard';
import { useSelections } from '@/hooks/useSelections';

interface ShowPageProps {
  params: Promise<{ id: string }>;
}

export default function ShowPage({ params }: ShowPageProps) {
  const resolvedParams = use(params);
  const [selectedContestant, setSelectedContestant] = useState<Contestant | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const { addSelection, getSelection } = useSelections();

  useEffect(() => {
    const show = shows.find(s => s.id === resolvedParams.id);
    if (show) {
      const existingSelection = getSelection(show.id);
      if (existingSelection) {
        const existingContestant = show.contestants.find(c => c.id === existingSelection.contestantId);
        if (existingContestant) {
          setSelectedContestant(existingContestant);
        }
      }
    }
  }, [resolvedParams.id, getSelection]);

  const show = shows.find(s => s.id === resolvedParams.id);

  if (!show) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            番組が見つかりません
          </h1>
          <Link href="/" className="text-purple-600 hover:text-purple-800 underline">
            ホームに戻る
          </Link>
        </div>
      </div>
    );
  }

  const handleContestantSelect = async (contestant: Contestant) => {
    setIsSelecting(true);
    setSelectedContestant(contestant);
    addSelection(show.id, contestant.id);

    // Re-enable selection after showing feedback
    setTimeout(() => {
      setIsSelecting(false);
    }, 1000);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-4"
          >
            ← ホームに戻る
          </Link>

          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            {show.title}
          </h1>

          {show.debutGroup && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              デビューグループ: {show.officialWebsite ? (
                <span
                  className="font-semibold text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 cursor-pointer hover:underline inline-flex items-center gap-1"
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

        {selectedContestant && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <div className="text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 max-w-sm mx-auto">
              <p className="text-lg text-gray-800 dark:text-white">
                ✅ <span className="font-semibold text-purple-600">{selectedContestant.displayName}</span>
              </p>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            参加者一覧
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {show.contestants.map((contestant, index) => (
              <ContestantCard
                key={contestant.id}
                contestant={contestant}
                isSelected={selectedContestant?.id === contestant.id}
                onClick={() => handleContestantSelect(contestant)}
                index={index}
                disabled={isSelecting}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}