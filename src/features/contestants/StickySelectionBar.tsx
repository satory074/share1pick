'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Contestant } from '@/types';
import AvatarFallback from '@/shared/components/AvatarFallback';
import { getNameGradientClass } from '@/shared/utils/contestant';

interface StickySelectionBarProps {
  contestant: Contestant;
}

export default function StickySelectionBar({ contestant }: StickySelectionBarProps) {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl shadow-xl border-t-2 border-mint-300/40 dark:border-mint-500/30 z-50"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Selected contestant info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className={`w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden bg-gradient-to-br ${getNameGradientClass(contestant.displayName)} flex items-center justify-center flex-shrink-0`}
            >
              <AvatarFallback
                src={contestant.image}
                alt={contestant.displayName}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 dark:text-white text-sm md:text-base truncate">
                {contestant.displayName}
              </p>
              {contestant.furigana && (
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {contestant.furigana}
                </p>
              )}
            </div>
          </div>

          {/* Home button */}
          <Link
            href="/"
            className="flex-shrink-0 bg-mint-600 hover:bg-mint-500 text-white px-4 py-2 md:px-6 md:py-2.5 rounded-lg font-semibold text-sm md:text-base transition-all duration-300 shadow-md hover:shadow-lg"
          >
            ホーム
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
