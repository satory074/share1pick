'use client';

import { useSelections } from '@/hooks/useSelections';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import html2canvas from 'html2canvas';
import MultiPickShareImage from '@/components/MultiPickShareImage';
import Image from 'next/image';
import { generateMultiPickShareText, generateTwitterShareText, copyToClipboard } from '@/lib/shareUtils';

export default function MyPicksPage() {
  const { getAllMultiPickData, getSelectionCount, removeSelection, clearAllSelections } = useSelections();
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [shareText, setShareText] = useState('');

  const multiPicks = getAllMultiPickData();
  const selectionCount = getSelectionCount();

  const generateShareImageBlob = async (): Promise<Blob | null> => {
    if (multiPicks.length === 0) return null;

    try {
      const element = document.getElementById('multi-pick-share-preview');
      if (!element) {
        console.error('Element with id "multi-pick-share-preview" not found');
        return null;
      }

      console.log('Found element, waiting for images to load...');

      // 画像の読み込みを待つ
      const images = element.querySelectorAll('img');
      await Promise.all(
        Array.from(images).map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete) {
                resolve(true);
              } else {
                img.onload = () => resolve(true);
                img.onerror = () => resolve(true); // エラーでも続行
              }
            })
        )
      );

      console.log('All images loaded, generating canvas...');

      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true
      });

      console.log('Canvas generated, converting to blob...');

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            console.log('Blob generated successfully, size:', blob.size);
          } else {
            console.error('Failed to generate blob from canvas');
          }
          resolve(blob);
        }, 'image/png');
      });
    } catch (error) {
      console.error('Failed to generate image blob:', error);
      return null;
    }
  };

  const generateShareImage = async () => {
    if (multiPicks.length === 0) return;

    setIsGeneratingImage(true);
    try {
      const element = document.getElementById('multi-pick-share-preview');
      if (element) {
        // 画像の読み込みを待つ
        const images = element.querySelectorAll('img');
        await Promise.all(
          Array.from(images).map(
            (img) =>
              new Promise((resolve) => {
                if (img.complete) {
                  resolve(true);
                } else {
                  img.onload = () => resolve(true);
                  img.onerror = () => resolve(true);
                }
              })
          )
        );

        const canvas = await html2canvas(element, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true,
          allowTaint: true
        });

        const link = document.createElement('a');
        link.download = `my-allstar-1picks-${multiPicks.length}shows.png`;
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

  const handleClearAll = () => {
    if (confirm(`全ての選択（${selectionCount}件）を削除しますか？`)) {
      clearAllSelections();
    }
  };

  const handleTwitterShare = async () => {
    if (multiPicks.length === 0) return;

    setIsGeneratingImage(true);

    let imageBlob: Blob | null = null;
    let twitterText = '';

    try {
      // 画像を生成
      imageBlob = await generateShareImageBlob();
      twitterText = generateTwitterShareText(multiPicks);

      if (!imageBlob) {
        alert('画像の生成に失敗しました。');
        setIsGeneratingImage(false);
        return;
      }

      console.log('Image blob generated successfully');

      // Web Share API の利用を試みる
      let webShareSuccess = false;

      if (typeof navigator.share !== 'undefined' && typeof navigator.canShare !== 'undefined') {
        try {
          const file = new File([imageBlob], `my-allstar-1picks-${multiPicks.length}shows.png`, {
            type: 'image/png',
          });

          const shareData = {
            text: twitterText,
            files: [file],
          };

          console.log('Checking if can share with files...');

          if (navigator.canShare(shareData)) {
            console.log('Web Share API with files is supported, attempting to share...');
            await navigator.share(shareData);
            console.log('Web Share API succeeded');
            webShareSuccess = true;
            setIsGeneratingImage(false);
            return;
          } else {
            console.log('Web Share API does not support file sharing');
          }
        } catch (error) {
          const err = error as Error;
          if (err.name === 'AbortError') {
            console.log('User cancelled the share');
            webShareSuccess = true; // ユーザーがキャンセルした場合は成功扱い
            setIsGeneratingImage(false);
            return;
          }
          console.warn('Web Share API failed, will fallback to Twitter Web Intent:', err);
        }
      } else {
        console.log('Web Share API not available');
      }

      // Web Share API が使えない場合は Twitter Web Intent にフォールバック
      if (!webShareSuccess) {
        console.log('Using Twitter Web Intent fallback');
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`;
        window.open(tweetUrl, '_blank', 'noopener,noreferrer');

        // 画像は別途ダウンロード
        const link = document.createElement('a');
        link.download = `my-allstar-1picks-${multiPicks.length}shows.png`;
        link.href = URL.createObjectURL(imageBlob);
        link.click();
        URL.revokeObjectURL(link.href);

        alert('Xのタブが開きました。ダウンロードした画像を手動で添付してください。');
      }
    } catch (error) {
      console.error('Failed to share to Twitter:', error);
      alert(`Xへの共有に失敗しました。\nエラー: ${(error as Error).message}`);
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">🎤</div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                1pickを選んでみよう！
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                各番組から推しメンを選んで、あなただけの1pickコレクションを作りましょう。
              </p>
              <Link
                href="/"
                className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
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
                      onClick={handleTwitterShare}
                      disabled={isGeneratingImage}
                      className="w-full bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {isGeneratingImage ? '生成中...' : (
                        <>
                          <span>Xでシェア</span>
                          <span>𝕏</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={generateShareImage}
                      disabled={isGeneratingImage}
                      className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isGeneratingImage ? '画像を生成中...' : '画像をダウンロード'}
                    </button>

                    <button
                      onClick={handleCopyShareText}
                      className="w-full bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
                    >
                      シェアテキストをコピー
                    </button>

                    {shareText && (
                      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                        {shareText}
                      </div>
                    )}

                    <button
                      onClick={handleClearAll}
                      className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors text-sm"
                    >
                      全て削除
                    </button>
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
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
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
                          className="text-purple-600 hover:text-purple-800 text-sm underline"
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
                className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                他の番組も見る
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}