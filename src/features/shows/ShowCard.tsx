'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Show, Contestant } from '@/types';
import AvatarFallback from '@/shared/components/AvatarFallback';
import { getNameGradientClass } from '@/shared/utils/contestant';

interface ShowCardProps {
  show: Show;
  index: number;
  selectedContestant?: Contestant | null;
}

export default function ShowCard({ show, index, selectedContestant }: ShowCardProps) {
  const [logoError, setLogoError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.1, 0.3) }}
      whileHover={{ scale: 1.02 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 relative min-h-[200px]"
    >
      <Link href={`/show/${show.id}`} className="block h-full">
        <div className="flex h-full flex-col md:flex-row">
          {/* Show info */}
          <div className="flex-1 p-5">
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
                デビューグループ:{' '}
                {show.officialWebsite ? (
                  <span
                    className="font-semibold text-mint-600 hover:text-mint-500 dark:text-mint-400 dark:hover:text-mint-300 cursor-pointer hover:underline inline-flex items-center gap-1"
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

          {/* Contestant thumbnail */}
          <div className="relative w-full h-56 md:w-48 md:h-auto group">
            {selectedContestant ? (
              <>
                <div className={`absolute inset-0 bg-gradient-to-br ${getNameGradientClass(selectedContestant.displayName)}`}>
                  <AvatarFallback
                    src={selectedContestant.image}
                    alt={selectedContestant.displayName}
                    width={192}
                    height={224}
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Gradient overlay */}
                <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}
                />
                {/* Name + furigana */}
                <div className="absolute inset-x-0 bottom-0 p-3 text-white z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                  <p className="font-bold text-sm leading-tight line-clamp-2">
                    {selectedContestant.displayName}
                  </p>
                  {selectedContestant.furigana && (
                    <p className="text-xs mt-0.5 truncate" style={{ opacity: 0.9 }}>
                      {selectedContestant.furigana}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="absolute inset-0 bg-mint-100/50 dark:bg-mint-600/20 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center text-mint-600 dark:text-mint-400">
                  <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="font-medium text-lg">未選択</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
