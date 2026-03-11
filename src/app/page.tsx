'use client';

import { shows } from '@/data/shows';
import { motion } from 'framer-motion';
import { useSelections } from '@/shared/hooks/useSelections';
import ShowCard from '@/features/shows/ShowCard';
import StickyShareBar from '@/features/shows/StickyShareBar';

export default function Home() {
  const { getSelectionCount, getSelection } = useSelections();
  const selectionCount = getSelectionCount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 to-bg-warm dark:from-dark-bg dark:to-dark-surface">
      {/* Skip navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded focus:shadow"
      >
        メインコンテンツへスキップ
      </a>

      <div className="container mx-auto px-4 py-12 pb-28" id="main-content">
        <header className="text-center mb-12">
          <motion.h1
            className="text-5xl font-bold mb-4 bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(to right, #5DD9B9, #EC4899, #a855f7)' }}
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
            ♥ サバイバルオーディション番組の1pickを選んでシェアしよう
          </motion.p>
          {selectionCount > 0 && (
            <motion.p
              className="mt-3 text-base font-semibold text-pink-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              {selectionCount} / {shows.length} 番組選択済み ♥
            </motion.p>
          )}
        </header>

        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          aria-label="番組一覧"
        >
          <div className="space-y-4">
            {shows.map((show, index) => {
              const selection = getSelection(show.id);
              const selectedContestant = selection
                ? show.contestants.find((c) => c.id === selection.contestantId)
                : null;

              return (
                <ShowCard
                  key={show.id}
                  show={show}
                  index={index}
                  selectedContestant={selectedContestant}
                />
              );
            })}
          </div>
        </motion.section>
      </div>

      <StickyShareBar selectionCount={selectionCount} />
    </div>
  );
}
