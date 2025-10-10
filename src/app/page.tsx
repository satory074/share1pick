'use client';

import { shows } from '@/data/shows';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useSelections } from '@/hooks/useSelections';

export default function Home() {
  const { getSelectionCount, hasSelection, getSelection } = useSelections();

  const sortedShows = [...shows].sort((a, b) => a.year - b.year);

  const selectionCount = getSelectionCount();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900">
      <div className="container mx-auto px-4 py-12 pb-28">
        <header className="text-center mb-12">
          <motion.h1
            className="text-5xl font-bold text-gray-800 dark:text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Share1Pick
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            サバイバルオーディション番組の1pickを選んでシェアしよう
          </motion.p>
        </header>

        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-4">
            {sortedShows.map((show, index) => {
              const selection = getSelection(show.id);
              const selectedContestant = selection
                ? show.contestants.find(c => c.id === selection.contestantId)
                : null;

              return (
                <ShowCard
                  key={show.id}
                  show={show}
                  index={index}
                  selectedContestant={selectedContestant}
                  hasSelection={hasSelection(show.id)}
                  getInitials={getInitials}
                  getGradientColor={getGradientColor}
                />
              );
            })}
          </div>
        </motion.section>
      </div>

      {/* Sticky Share Button */}
      {selectionCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t-2 border-purple-200 dark:border-purple-700 z-50"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-center">
              <Link
                href="/my-picks"
                className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 md:px-10 md:py-4 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-base md:text-lg"
              >
                🎉 シェアする
                <span className="ml-3 bg-white text-purple-600 px-3 py-1.5 rounded-full text-sm font-bold">
                  {selectionCount}件
                </span>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface ShowCardProps {
  show: typeof shows[0];
  index: number;
  selectedContestant: typeof shows[0]['contestants'][0] | null | undefined;
  hasSelection: boolean;
  getInitials: (name: string) => string;
  getGradientColor: (name: string) => string;
}

function ShowCard({ show, index, selectedContestant, hasSelection, getInitials, getGradientColor }: ShowCardProps) {
  const [imageError, setImageError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 relative"
    >
      <Link href={`/show/${show.id}`} className="block p-5">
        <div className={`flex ${selectedContestant ? 'flex-col md:flex-row gap-4' : 'flex-col'}`}>
          <div className="flex-1">
            {show.logo && !logoError && (
              <div className="mb-3">
                <Image
                  src={show.logo}
                  alt={`${show.title} Logo`}
                  width={200}
                  height={48}
                  className="h-12 w-auto"
                  loading="lazy"
                  onError={() => setLogoError(true)}
                />
              </div>
            )}
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              {show.title}
            </h3>

            {show.debutGroup && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                デビューグループ: {show.officialWebsite ? (
                  <span
                    className="font-semibold text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 cursor-pointer hover:underline inline-flex items-center gap-1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(show.officialWebsite, '_blank', 'noopener,noreferrer');
                    }}
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
          </div>

          {selectedContestant && (
            <div className="flex md:flex-col items-center md:items-center gap-3 md:w-32">
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-gradient-to-br ${getGradientColor(selectedContestant.displayName)} flex items-center justify-center relative flex-shrink-0`}>
                {!imageError ? (
                  <Image
                    src={selectedContestant.image}
                    alt={selectedContestant.displayName}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-bold">
                    <span className="text-xl">{getInitials(selectedContestant.displayName)}</span>
                  </div>
                )}
              </div>
              <div className="text-left md:text-center flex-1 md:flex-none">
                <p className="font-semibold text-gray-800 dark:text-white text-sm line-clamp-2">
                  {selectedContestant.displayName}
                </p>
                {selectedContestant.furigana && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {selectedContestant.furigana}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
