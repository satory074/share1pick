'use client';

import { shows } from '@/data/shows';
import { Show } from '@/types';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const groupedShows = shows.reduce((acc, show) => {
    const category = show.id.includes('produce101-japan') || show.id === 'nizi-project' ? 'japan' : 'korea';
    if (!acc[category]) acc[category] = [];
    acc[category].push(show);
    return acc;
  }, {} as Record<string, Show[]>);

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
        </header>

        {Object.entries(groupedShows).map(([category, categoryShows], categoryIndex) => (
          <motion.section
            key={category}
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
          >
            <h2 className="text-3xl font-semibold text-gray-700 dark:text-gray-200 mb-6 capitalize">
              {category === 'japan' ? '日本版' : '韓国版'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryShows.map((show, index) => (
                <motion.div
                  key={show.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <Link href={`/show/${show.id}`}>
                    <div className="p-6">
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

                      <div className="flex items-center justify-between">
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
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
}
