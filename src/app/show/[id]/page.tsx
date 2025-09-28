'use client';

import { shows } from '@/data/shows';
import { Contestant } from '@/types';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import ShareImagePreview from '@/components/ShareImagePreview';
import ShareActions from '@/components/ShareActions';
import ContestantFilter from '@/components/ContestantFilter';
import ContestantCard from '@/components/ContestantCard';
import { useSelections } from '@/hooks/useSelections';

interface ShowPageProps {
  params: Promise<{ id: string }>;
}

export default function ShowPage({ params }: ShowPageProps) {
  const [selectedContestant, setSelectedContestant] = useState<Contestant | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [filteredContestants, setFilteredContestants] = useState<Contestant[]>([]);
  const { addSelection, getSelection, getSelectionCount } = useSelections();

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

  const handleContestantSelect = (contestant: Contestant) => {
    setSelectedContestant(contestant);
    addSelection(show.id, contestant.id);
  };

  const generateShareImage = async () => {
    if (!selectedContestant) return;

    setIsGeneratingImage(true);
    try {
      const element = document.getElementById('share-preview');
      if (element) {
        const canvas = await html2canvas(element, {
          backgroundColor: '#ffffff',
          scale: 2,
          width: 400,
          height: 600
        });

        const link = document.createElement('a');
        link.download = `${show.title}-${selectedContestant.name}-1pick.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    } catch (error) {
      console.error('Failed to generate image:', error);
      alert('画像の生成に失敗しました。');
    } finally {
      setIsGeneratingImage(false);
    }
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
            <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
              <div className="flex-shrink-0">
                <ShareImagePreview show={show} contestant={selectedContestant} />
              </div>

              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                  選択完了！
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  あなたの1pickは <span className="font-semibold text-purple-600">{selectedContestant.name}</span> です！
                </p>

                {getSelectionCount() > 1 && (
                  <div className="mb-4">
                    <Link
                      href="/my-picks"
                      className="inline-flex items-center text-purple-600 hover:text-purple-800 text-sm underline"
                    >
                      全ての1picks ({getSelectionCount()}件) を見る →
                    </Link>
                  </div>
                )}

                <ShareActions
                  show={show}
                  contestant={selectedContestant}
                  onGenerateImage={generateShareImage}
                  isGeneratingImage={isGeneratingImage}
                />
              </div>
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

        {!selectedContestant && (
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