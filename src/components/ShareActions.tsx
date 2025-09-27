'use client';

import { Show, Contestant } from '@/types';
import { generateShareText, copyToClipboard } from '@/lib/shareUtils';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface ShareActionsProps {
  show: Show;
  contestant: Contestant;
  onGenerateImage: () => void;
  isGeneratingImage: boolean;
}

export default function ShareActions({
  show,
  contestant,
  onGenerateImage,
  isGeneratingImage
}: ShareActionsProps) {
  const [shareText, setShareText] = useState(generateShareText(show, contestant));
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const regenerateShareText = () => {
    setShareText(generateShareText(show, contestant));
  };

  const shareToTwitter = () => {
    const url = `${window.location.origin}/show/${show.id}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleCopyShareText = async () => {
    const success = await copyToClipboard(shareText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
        <button
          onClick={onGenerateImage}
          disabled={isGeneratingImage}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 font-semibold transition-colors"
        >
          {isGeneratingImage ? '生成中...' : '📸 画像保存'}
        </button>

        <button
          onClick={() => setShowShareModal(true)}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold transition-colors"
        >
          🐦 シェア設定
        </button>

        <button
          onClick={shareToTwitter}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold transition-colors"
        >
          🚀 今すぐシェア
        </button>
      </div>

      {showShareModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowShareModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              シェア設定
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                シェア文
              </label>
              <textarea
                value={shareText}
                onChange={(e) => setShareText(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                rows={4}
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={regenerateShareText}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                🎲 ランダム生成
              </button>
              <button
                onClick={handleCopyShareText}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  copied
                    ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200'
                    : 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-700'
                }`}
              >
                {copied ? '✅ コピー完了' : '📋 コピー'}
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={shareToTwitter}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
              >
                🐦 Xでシェア
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                閉じる
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}