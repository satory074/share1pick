'use client';

import { Contestant } from '@/types';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ContestantCardProps {
  contestant: Contestant;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

export default function ContestantCard({
  contestant,
  isSelected,
  onClick,
  index
}: ContestantCardProps) {
  const getNationalityFlag = (nationality?: string): string => {
    const flagMap: Record<string, string> = {
      'KR': '🇰🇷',
      'JP': '🇯🇵',
      'CN': '🇨🇳',
      'TW': '🇹🇼',
      'US': '🇺🇸',
      'CA': '🇨🇦',
      'AU': '🇦🇺',
      'VN': '🇻🇳'
    };
    return flagMap[nationality || ''] || '🌟';
  };

  const getRankColor = (rank?: number): string => {
    if (!rank) return 'text-gray-500';
    if (rank <= 3) return 'text-yellow-600 font-bold';
    if (rank <= 10) return 'text-purple-600 font-semibold';
    return 'text-gray-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        bg-white dark:bg-gray-800 rounded-xl p-4 cursor-pointer transition-all duration-300
        hover:shadow-xl border-2 group
        ${isSelected
          ? 'border-purple-500 shadow-lg ring-2 ring-purple-200 dark:ring-purple-800'
          : 'border-transparent hover:border-purple-300 shadow-md hover:shadow-lg'}
      `}
    >
      <div className="relative">
        <div className="aspect-square mb-3 rounded-xl overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center relative">
          <Image
            src={contestant.image}
            alt={contestant.name}
            width={120}
            height={120}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling!.classList.remove('hidden');
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl hidden">
            {contestant.name.charAt(0)}
          </div>

          {contestant.rank && contestant.rank <= 3 && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {contestant.rank}
            </div>
          )}
        </div>

        <div className="text-center">
          <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-1 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {contestant.name}
          </h3>

          {contestant.company && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 truncate">
              {contestant.company}
            </p>
          )}

          <div className="flex items-center justify-center gap-2 text-xs">
            {contestant.nationality && (
              <span className="flex items-center gap-1">
                {getNationalityFlag(contestant.nationality)}
                <span className="text-gray-500 dark:text-gray-400">
                  {contestant.nationality}
                </span>
              </span>
            )}

            {contestant.rank && (
              <span className={`${getRankColor(contestant.rank)}`}>
                #{contestant.rank}
              </span>
            )}
          </div>
        </div>

        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm"
          >
            ✓
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}