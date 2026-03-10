'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Show, Contestant } from '@/types';
import ContestantCard from './ContestantCard';

interface ContestantGridProps {
  show: Show;
  selectedContestantId?: string;
  isSelecting: boolean;
  onSelect: (contestant: Contestant) => void;
}

export default function ContestantGrid({
  show,
  selectedContestantId,
  isSelecting,
  onSelect,
}: ContestantGridProps) {
  const sortedContestants = useMemo(
    () =>
      [...show.contestants].sort((a, b) => {
        const aKey = a.furigana ?? a.displayName;
        const bKey = b.furigana ?? b.displayName;
        return aKey.localeCompare(bKey, 'ja');
      }),
    [show.contestants]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        参加者一覧
      </h2>

      <div
        role="radiogroup"
        aria-label={`${show.title} 参加者一覧`}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
      >
        {sortedContestants.map((contestant, index) => (
          <ContestantCard
            key={contestant.id}
            contestant={contestant}
            isSelected={selectedContestantId === contestant.id}
            onClick={() => onSelect(contestant)}
            index={index}
            disabled={isSelecting}
          />
        ))}
      </div>
    </motion.div>
  );
}
