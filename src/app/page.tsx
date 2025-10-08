'use client';

import { shows } from '@/data/shows';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSelections } from '@/hooks/useSelections';

export default function Home() {
  const { getSelectionCount, hasSelection } = useSelections();

  const sortedShows = [...shows].sort((a, b) => a.year - b.year);

  const selectionCount = getSelectionCount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <motion.h1
            className="text-5xl font-bold text-gray-800 dark:text-white mb-4"
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
            サバイバルオーディション番組の1pickを選んでシェアしよう
          </motion.p>

          {selectionCount > 0 && (
            <motion.div
              className="mt-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link
                href="/my-picks"
                className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
              >
                🎉 シェアする
                <span className="ml-3 bg-white text-purple-600 px-3 py-1.5 rounded-full text-sm font-bold">
                  {selectionCount}件
                </span>
              </Link>
            </motion.div>
          )}
        </header>

        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-4">
            {sortedShows.map((show, index) => (
                <motion.div
                  key={show.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 relative"
                >
                  {hasSelection(show.id) && (
                    <div className="absolute top-3 right-3 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      選択済み
                    </div>
                  )}
                  <Link href={`/show/${show.id}`} className="block p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-semibold
                        ${show.type === 'male' ? 'bg-blue-100 text-blue-800' :
                          show.type === 'female' ? 'bg-pink-100 text-pink-800' :
                          'bg-purple-100 text-purple-800'}
                      `}>
                        {show.type === 'male' ? '男性' : show.type === 'female' ? '女性' : '混合'}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {show.year}年
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                      {show.title}
                    </h3>

                    {show.debutGroup && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        デビューグループ: <span className="font-semibold">{show.debutGroup}</span>
                      </p>
                    )}

                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {show.description}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {show.contestants.length}人の参加者
                      </span>
                      <span className={`
                        px-2 py-1 rounded text-xs
                        ${show.status === 'completed' ? 'bg-green-100 text-green-800' :
                          show.status === 'ongoing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'}
                      `}>
                        {show.status === 'completed' ? '完了' :
                         show.status === 'ongoing' ? '放送中' : '放送予定'}
                      </span>
                    </div>

                    {show.officialWebsite && (
                      <div className="mt-auto">
                        <span
                          className="inline-flex items-center text-xs text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(show.officialWebsite, '_blank', 'noopener,noreferrer');
                          }}
                        >
                          🌐 公式サイト
                          <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </span>
                      </div>
                    )}
                  </Link>
                </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
