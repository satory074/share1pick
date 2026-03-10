'use client';

import { useState, useEffect } from 'react';
import { MultiPickData } from '@/types';
import Modal from '@/shared/components/Modal';
import { generateTwitterShareText, encodeShareData } from '@/shared/utils/share';

interface TweetModalProps {
  isOpen: boolean;
  onClose: () => void;
  multiPicks: MultiPickData[];
}

export default function TweetModal({ isOpen, onClose, multiPicks }: TweetModalProps) {
  const [tweetText, setTweetText] = useState(() =>
    generateTwitterShareText(multiPicks)
  );

  // モーダルが開くたびにテキストをリセット
  useEffect(() => {
    if (isOpen) {
      setTweetText(generateTwitterShareText(multiPicks));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleConfirmTweet = async () => {
    if (!tweetText) return;

    const shareId = encodeShareData(multiPicks);
    const shareUrl = `${window.location.origin}/share/${shareId}`;
    const fullText = `${tweetText}\n\n${shareUrl}`;

    if (typeof navigator.share !== 'undefined') {
      try {
        const shareData = { text: fullText };
        if (navigator.canShare?.(shareData)) {
          await navigator.share(shareData);
          onClose();
          return;
        }
      } catch (err) {
        const error = err as Error;
        if (error.name === 'AbortError') {
          onClose();
          return;
        }
        console.warn('Web Share API failed, falling back to Twitter Web Intent:', error);
      }
    }

    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullText)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <span>Xでシェア</span>
          <span>𝕏</span>
        </h2>
        <button
          onClick={onClose}
          aria-label="閉じる"
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Tweet text */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
            ツイート内容
          </h3>
          <textarea
            value={tweetText}
            onChange={(e) => setTweetText(e.target.value)}
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={8}
            aria-label="ツイート内容"
          />
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-right">
            {tweetText.length} 文字
          </div>
        </div>

        {/* Hashtags preview */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
            含まれるハッシュタグ
          </h3>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              参加者 ({multiPicks.length}人)
            </h4>
            <div className="flex flex-wrap gap-2">
              {multiPicks.map(({ contestant }) => (
                <span
                  key={contestant.id}
                  className="inline-block px-3 py-1 bg-mint-500/10 dark:bg-mint-500/20 text-mint-600 dark:text-mint-400 rounded-full text-sm font-medium"
                >
                  #{contestant.displayName}
                </span>
              ))}
            </div>
          </div>

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

        {/* Action buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleConfirmTweet}
            className="flex-1 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <span>ツイートする</span>
            <span>𝕏</span>
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            キャンセル
          </button>
        </div>
      </div>
    </Modal>
  );
}
