'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface StickyShareBarProps {
  selectionCount: number;
}

export default function StickyShareBar({ selectionCount }: StickyShareBarProps) {
  if (selectionCount === 0) return null;

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl shadow-xl border-t-2 border-mint-300/40 dark:border-mint-500/30 z-50"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-center">
          <Link
            href="/my-picks"
            className="inline-flex items-center text-white px-8 py-3 md:px-10 md:py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 text-base md:text-lg"
            style={{ background: 'linear-gradient(to right, #5DD9B9, #EC4899)' }}
          >
            ♥ シェアする
            <span className="ml-3 bg-white text-mint-600 px-3 py-1.5 rounded-full text-sm font-bold">
              {selectionCount}件
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
