'use client';

import { shows } from '@/data/shows';
import { Contestant } from '@/types';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import ContestantCard from '@/components/ContestantCard';
import { useSelections } from '@/hooks/useSelections';

interface ShowPageProps {
  params: Promise<{ id: string }>;
}

export default function ShowPage({ params }: ShowPageProps) {
  const resolvedParams = use(params);
  const [selectedContestant, setSelectedContestant] = useState<Contestant | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [stickyBarImageError, setStickyBarImageError] = useState(false);
  const { addSelection, getSelection } = useSelections();

  const getInitials = (displayName: string): string => {
    if (displayName.length > 1) {
      return displayName.slice(0, 2);
    }
    return displayName.charAt(0);
  };

  const getGradientColor = (displayName: string): string => {
    const hash = displayName.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);

    const gradients = [
      'from-purple-400 to-pink-400',
      'from-blue-400 to-cyan-400',
      'from-green-400 to-teal-400',
      'from-orange-400 to-red-400',
      'from-indigo-400 to-purple-400',
      'from-pink-400 to-rose-400',
      'from-cyan-400 to-blue-400',
      'from-teal-400 to-green-400'
    ];

    return gradients[Math.abs(hash) % gradients.length];
  };

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

  // Reset image error state when selected contestant changes
  useEffect(() => {
    setStickyBarImageError(false);
  }, [selectedContestant]);

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            参加者一覧
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {[...show.contestants]
              .sort((a, b) => {
                const aKey = a.furigana || a.displayName;
                const bKey = b.furigana || b.displayName;
                return aKey.localeCompare(bKey, 'ja');
              })
              .map((contestant, index) => (
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

      {/* Sticky Selection Bar */}
      {selectedContestant && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t-2 border-purple-200 dark:border-purple-700 z-50"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              {/* Selected Contestant Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Thumbnail */}
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden bg-gradient-to-br ${getGradientColor(selectedContestant.displayName)} flex items-center justify-center flex-shrink-0`}>
                  {!stickyBarImageError ? (
                    <Image
                      src={selectedContestant.image}
                      alt={selectedContestant.displayName}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={() => setStickyBarImageError(true)}
                    />
                  ) : (
                    <div className="text-white font-bold text-lg">
                      {getInitials(selectedContestant.displayName)}
                    </div>
                  )}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 dark:text-white text-sm md:text-base truncate">
                    {selectedContestant.displayName}
                  </p>
                  {selectedContestant.furigana && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {selectedContestant.furigana}
                    </p>
                  )}
                </div>
              </div>

              {/* Home Button */}
              <Link
                href="/"
                className="flex-shrink-0 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 md:px-6 md:py-2.5 rounded-lg font-semibold text-sm md:text-base transition-colors shadow-md hover:shadow-lg"
              >
                ホーム
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}