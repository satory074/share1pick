'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { useSelections } from '@/shared/hooks/useSelections';
import ShareImage from '@/features/sharing/ShareImage';
import TweetModal from '@/features/sharing/TweetModal';
import AvatarFallback from '@/shared/components/AvatarFallback';
import { generateMultiPickShareText, copyToClipboard } from '@/shared/utils/share';

export default function MyPicksPage() {
  const { getAllMultiPickData, getSelectionCount, removeSelection } = useSelections();
  const [shareText, setShareText] = useState('');
  const [showTweetModal, setShowTweetModal] = useState(false);

  const multiPicks = getAllMultiPickData;
  const selectionCount = getSelectionCount();

  const handleCopyShareText = async () => {
    const text = shareText || generateMultiPickShareText(multiPicks);
    if (!shareText) setShareText(text);
    const success = await copyToClipboard(text);
    if (success) {
      alert('シェアテキストをコピーしました！');
    } else {
      alert('コピーに失敗しました。');
    }
  };

  const handleRemoveSelection = (showId: string) => {
    if (confirm('この選択を削除しますか？')) {
      removeSelection(showId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 to-bg-warm dark:from-dark-bg dark:to-dark-surface">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center text-mint-600 hover:text-mint-500 mb-4"
          >
            ← ホームに戻る
          </Link>

          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            My 1Picks
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
            {selectionCount > 0
              ? `${selectionCount}つの番組から選んだあなたの1pickコレクション`
              : 'まだ1pickが選択されていません'}
          </p>
          {selectionCount > 0 && selectionCount === multiPicks.length && (
            <p className="text-base font-bold text-pink-500">全番組コンプリート！🎉</p>
          )}
        </motion.div>

        {multiPicks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-xl shadow-xl p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">🎤</div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                1pickを選んでみよう！
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                各番組から推しメンを選んで、あなただけの1pickコレクションを作りましょう。
              </p>
              <Link
                href="/"
                className="inline-block bg-mint-600 hover:bg-mint-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
              >
                番組を見る
              </Link>
            </div>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8"
            >
              <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
                <div className="flex-shrink-0">
                  <ShareImage multiPicks={multiPicks} />
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                    💡 クリックで背景色変更 (12種類)
                  </p>
                </div>

                <div className="text-center lg:text-left max-w-md">
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                    シェア準備完了！
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                    {selectionCount}つの番組から選んだ推しメンをまとめてシェアしましょう！
                  </p>

                  <div className="space-y-3">
                    <button
                      onClick={() => setShowTweetModal(true)}
                      className="w-full bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Xでシェア</span>
                      <span>𝕏</span>
                    </button>

                    <button
                      onClick={handleCopyShareText}
                      className="w-full bg-coral-600 hover:bg-coral-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      シェアテキストをコピー
                    </button>

                    {shareText && (
                      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                        {shareText}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                選択した1picks ({multiPicks.length}件)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {multiPicks.map(({ show, contestant }) => (
                  <motion.div
                    key={`${show.id}-${contestant.id}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                            {show.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {show.year}年 • {show.debutGroup}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveSelection(show.id)}
                          aria-label={`${show.title}の選択を削除`}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          ×
                        </button>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                          <AvatarFallback
                            src={contestant.image}
                            alt={contestant.displayName}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                            <span className="text-pink-500 mr-1">♥</span>{contestant.displayName}
                          </h4>
                          {contestant.furigana && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {contestant.furigana}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4">
                        <Link
                          href={`/show/${show.id}`}
                          className="text-mint-600 hover:text-mint-500 text-sm underline"
                        >
                          番組詳細を見る
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <Link
                href="/"
                className="inline-block bg-mint-600 hover:bg-mint-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
              >
                他の番組も見る
              </Link>
            </motion.div>
          </>
        )}
      </div>

      <TweetModal
        isOpen={showTweetModal}
        onClose={() => setShowTweetModal(false)}
        multiPicks={multiPicks}
      />
    </div>
  );
}
