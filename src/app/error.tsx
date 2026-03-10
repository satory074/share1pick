'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 to-bg-warm dark:from-dark-bg dark:to-dark-surface flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-6xl mb-6">😕</div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          エラーが発生しました
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          申し訳ありません。予期しないエラーが発生しました。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-mint-600 hover:bg-mint-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
          >
            もう一度試す
          </button>
          <Link
            href="/"
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 text-center"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
