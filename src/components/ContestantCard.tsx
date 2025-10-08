'use client';

import { Contestant } from '@/types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

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
  disabled = false
}: ContestantCardProps) {
  const [imageError, setImageError] = useState(false);

  const getInitials = (displayName: string): string => {
    // Extract initials from display name
    if (displayName.length > 1) {
      return displayName.slice(0, 2);
    }
    return displayName.charAt(0);
  };

  const getGradientColor = (displayName: string): string => {
    // Generate consistent gradient based on name hash
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
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={disabled ? {} : { scale: 1.05, y: -5 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      onClick={disabled ? undefined : onClick}
      className={`
        bg-white dark:bg-gray-800 rounded-xl p-4 transition-all duration-300 border-2 group
        ${disabled
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer hover:shadow-xl'
        }
        ${isSelected
          ? 'border-purple-500 shadow-lg ring-2 ring-purple-200 dark:ring-purple-800'
          : 'border-transparent hover:border-purple-300 shadow-md hover:shadow-lg'}
      `}
    >
      <div className="relative">
        <div className={`aspect-square mb-3 rounded-xl overflow-hidden bg-gradient-to-br ${getGradientColor(contestant.displayName)} flex items-center justify-center relative`}>
          {!imageError ? (
            <Image
              src={contestant.image}
              alt={contestant.displayName}
              width={120}
              height={120}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-bold">
              <span className="text-2xl">{getInitials(contestant.displayName)}</span>
            </div>
          )}
        </div>

        <div className="text-center">
          <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-1 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
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