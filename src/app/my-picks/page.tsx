'use client';

import { useSelections } from '@/hooks/useSelections';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import MultiPickShareImage from '@/components/MultiPickShareImage';
import Image from 'next/image';
import { generateMultiPickShareText, generateTwitterShareText, copyToClipboard, encodeShareData } from '@/lib/shareUtils';

export default function MyPicksPage() {
  const { getAllMultiPickData, getSelectionCount, removeSelection } = useSelections();
  const [shareText, setShareText] = useState('');
  const [showTweetModal, setShowTweetModal] = useState(false);
  const [tweetText, setTweetText] = useState('');

  const multiPicks = getAllMultiPickData();
  const selectionCount = getSelectionCount();

  // Escキーでモーダルを閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showTweetModal) {
        setShowTweetModal(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showTweetModal]);

  const handleGenerateShareText = () => {
    const text = generateMultiPickShareText(multiPicks);
    setShareText(text);
  };

  const handleCopyShareText = async () => {
    if (!shareText) {
      handleGenerateShareText();
      return;
    }

    const success = await copyToClipboard(shareText);
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

  const handleShowTweetModal = () => {
    if (multiPicks.length === 0) return;

    const twitterText = generateTwitterShareText(multiPicks);
    setTweetText(twitterText);
    setShowTweetModal(true);
  };

  const handleConfirmTweet = async () => {
    if (!tweetText) return;

    // 共有URLを生成
    const shareId = encodeShareData(multiPicks);
    const shareUrl = `${window.location.origin}/share/${shareId}`;
    const tweetTextWithUrl = `${tweetText}\n\n${shareUrl}`;

    // Web Share API の利用を試みる
    if (typeof navigator.share !== 'undefined') {
      try {
        const shareData = {
          text: tweetTextWithUrl,
        };

        if (navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData);
          setShowTweetModal(false);
          return;
        }
      } catch (error) {
        const err = error as Error;
        if (err.name === 'AbortError') {
          // ユーザーがキャンセル
          setShowTweetModal(false);
          return;
        }
        // それ以外のエラーはフォールバックへ
        console.warn('Web Share API failed, will fallback to Twitter Web Intent:', err);
      }
    }

    // Web Share API が使えない場合は Twitter Web Intent にフォールバック
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetTextWithUrl)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
    setShowTweetModal(false);
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
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            {selectionCount > 0
              ? `${selectionCount}つの番組から選んだあなたの1pickコレクション`
              : 'まだ1pickが選択されていません'
            }
          </p>
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
                  <MultiPickShareImage multiPicks={multiPicks} />
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
                      onClick={handleShowTweetModal}
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
                          className="text-red-500 hover:text-red-700 p-1"
                          title="削除"
                        >
                          ×
                        </button>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                          <Image
                            src={contestant.image}
                            alt={contestant.displayName}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.textContent = contestant.displayName.charAt(0);
                              }
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                            {contestant.displayName}
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

      {/* ツイートモーダル */}
      {showTweetModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowTweetModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ヘッダー */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <span>Xでシェア</span>
                <span>𝕏</span>
              </h2>
              <button
                onClick={() => setShowTweetModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
              >
                ×
              </button>
            </div>

            {/* コンテンツ */}
            <div className="p-6 space-y-6">
              {/* ツイート内容 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                  ツイート内容
                </h3>
                <textarea
                  value={tweetText}
                  onChange={(e) => setTweetText(e.target.value)}
                  className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={8}
                />
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-right">
                  {tweetText.length} 文字
                </div>
              </div>

              {/* ハッシュタグ表示 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                  含まれるハッシュタグ
                </h3>

                {/* 参加者ハッシュタグ */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    参加者 ({multiPicks.length}人)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {multiPicks.map(({ contestant }) => {
                      // 参加者の本名（displayName）をそのまま使用
                      const hashtag = `#${contestant.displayName}`;
                      return (
                        <span
                          key={contestant.id}
                          className="inline-block px-3 py-1 bg-mint-500/10 dark:bg-mint-500/20 text-mint-600 dark:text-mint-400 rounded-full text-sm font-medium"
                        >
                          {hashtag}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* 番組・その他のハッシュタグ */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    番組・その他
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['#1pick', '#Share1Pick'].map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-3 py-1 bg-coral-600/10 dark:bg-coral-600/20 text-coral-600 dark:text-coral-400 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* アクションボタン */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleConfirmTweet}
                  className="flex-1 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <span>ツイートする</span>
                  <span>𝕏</span>
                </button>
                <button
                  onClick={() => setShowTweetModal(false)}
                  className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}