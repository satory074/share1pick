'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import FocusTrap from 'focus-trap-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** モーダルのmax-width クラス。デフォルト: max-w-2xl */
  maxWidth?: string;
}

/**
 * 汎用モーダルコンポーネント
 * - ESCキーで閉じる
 * - バックドロップクリックで閉じる
 * - フォーカストラップ（キーボードナビゲーション）
 * - Framer Motion アニメーション
 */
export default function Modal({ isOpen, onClose, children, maxWidth = 'max-w-2xl' }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <FocusTrap>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl ${maxWidth} w-full max-h-[90vh] overflow-y-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </motion.div>
      </FocusTrap>
    </motion.div>
  );
}
