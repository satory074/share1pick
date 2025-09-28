'use client';

import { shows } from '@/data/shows';
import { Contestant } from '@/types';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ContestantFilter from '@/components/ContestantFilter';
import ContestantCard from '@/components/ContestantCard';
import { useSelections } from '@/hooks/useSelections';

interface ShowPageProps {
  params: Promise<{ id: string }>;
}

export default function ShowPage({ params }: ShowPageProps) {
  const [selectedContestant, setSelectedContestant] = useState<Contestant | null>(null);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [filteredContestants, setFilteredContestants] = useState<Contestant[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const { addSelection, getSelection } = useSelections();
  const router = useRouter();

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  useEffect(() => {
    if (resolvedParams) {
      const show = shows.find(s => s.id === resolvedParams.id);
      if (show) {
        setFilteredContestants(show.contestants);

        const existingSelection = getSelection(show.id);
        if (existingSelection) {
          const existingContestant = show.contestants.find(c => c.id === existingSelection.contestantId);
          if (existingContestant) {
            setSelectedContestant(existingContestant);
          }
        }
      }
    }
  }, [resolvedParams, getSelection]);

  if (!resolvedParams) {
    return <div>Loading...</div>;
  }

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

    // Wait a moment to show selection feedback
    setTimeout(() => {
      router.push('/');
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
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            {show.description}
          </p>

          {show.debutGroup && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              デビューグループ: <span className="font-semibold">{show.debutGroup}</span>
            </p>
          )}
        </motion.div>

        {selectedContestant && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <div className="text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                選択完了！
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                <span className="font-semibold text-purple-600">{selectedContestant.name}</span> を選択しました
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ホームページに戻ります...
              </p>
            </div>
          </motion.div>
        )}

        <ContestantFilter
          contestants={show.contestants}
          onFilter={setFilteredContestants}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            参加者一覧 ({filteredContestants.length}人)
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredContestants.map((contestant, index) => (
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

          {filteredContestants.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                条件に一致する参加者が見つかりませんでした
              </p>
            </div>
          )}
        </motion.div>

        {!selectedContestant && !isSelecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <p className="text-lg text-gray-600 dark:text-gray-300">
              ↑ 参加者をクリックして1pickを選択してください
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}