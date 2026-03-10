'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShareData } from '@/shared/utils/share';

interface SharePageClientProps {
  shareData: ShareData | null;
}

export default function SharePageClient({ shareData }: SharePageClientProps) {
  if (!shareData || shareData.picks.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mint-50 to-bg-warm dark:from-dark-bg dark:to-dark-surface flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md text-center"
        >
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            無効な共有リンクです
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            このリンクは無効か、期限切れの可能性があります。
          </p>
          <Link
            href="/"
            className="inline-block bg-mint-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-mint-500 transition-colors"
          >
            ホームに戻る
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 to-bg-warm dark:from-dark-bg dark:to-dark-surface">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            オールスター1pickコレクション 🎤
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {shareData.picks.length}つの番組から選ばれた推しメンたち
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {shareData.picks.map((pick, index) => (
            <motion.div
              key={`${pick.showId}-${pick.contestantId}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(0.1 * index, 0.3) }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                {pick.showTitle}
              </h3>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  {pick.contestantName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {pick.contestantName}
                  </h4>
                  {pick.contestantFurigana && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {pick.contestantFurigana}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/"
            className="inline-block bg-mint-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-mint-500 transition-colors text-lg"
          >
            あなたも1pickを選んでシェアする
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
