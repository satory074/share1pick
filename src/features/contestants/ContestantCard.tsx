'use client';

import { Contestant } from '@/types';
import { motion } from 'framer-motion';
import AvatarFallback from '@/shared/components/AvatarFallback';
import { getNameGradientClass } from '@/shared/utils/contestant';

interface ContestantCardProps {
  contestant: Contestant;
  isSelected: boolean;
  onClick: () => void;
  index: number;
  disabled?: boolean;
}

export default function ContestantCard({
  contestant,
  isSelected,
  onClick,
  index,
  disabled = false,
}: ContestantCardProps) {
  return (
    <motion.div
      role="radio"
      aria-checked={isSelected}
      aria-label={`${contestant.displayName}を選択`}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: Math.min(index * 0.05, 0.3) }}
      whileHover={disabled ? {} : { scale: 1.05, y: -5 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      onClick={disabled ? undefined : onClick}
      className={`
        bg-white dark:bg-gray-800 rounded-xl p-4 transition-all duration-300 border-2 group
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:shadow-xl'}
        ${isSelected
          ? 'border-pink-500 shadow-lg ring-2 ring-pink-200 dark:ring-pink-800 shadow-pink-200'
          : 'border-transparent hover:border-pink-300 shadow-md hover:shadow-lg'}
      `}
    >
      <div className="relative">
        <div
          className={`aspect-square mb-3 rounded-xl overflow-hidden bg-gradient-to-br ${getNameGradientClass(contestant.displayName)} flex items-center justify-center relative`}
        >
          <AvatarFallback
            src={contestant.image}
            alt={contestant.displayName}
            width={120}
            height={120}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-center">
          <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-1 line-clamp-2 group-hover:text-pink-500 dark:group-hover:text-pink-400 transition-colors">
            {contestant.displayName}
          </h3>
          {contestant.furigana && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {contestant.furigana}
            </p>
          )}
        </div>

        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.3, 1] }}
            transition={{ duration: 0.3 }}
            className="absolute -top-2 -right-2 w-7 h-7 bg-pink-500 rounded-full flex items-center justify-center text-white text-base shadow-md"
          >
            ♥
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
