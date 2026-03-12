'use client';

import Image from 'next/image';
import { useState } from 'react';
import { getNameInitials, getNameGradientClass } from '@/shared/utils/contestant';

type AvatarFallbackProps = {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
} & (
  | { fill: true; width?: never; height?: never }
  | { fill?: false; width: number; height: number }
);

/**
 * 画像読み込みエラー時にイニシャル+グラデーションフォールバックを表示するアバターコンポーネント
 * Source of truth: DOM直接操作（e.target.style.display = 'none'）の代わりにこのコンポーネントを使用すること
 */
export default function AvatarFallback({
  src,
  alt,
  className = 'w-full h-full object-cover',
  loading = 'lazy',
  sizes,
  fill,
  ...rest
}: AvatarFallbackProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`w-full h-full bg-gradient-to-br ${getNameGradientClass(alt)} flex items-center justify-center text-white font-bold`}
      >
        <span className="text-2xl">{getNameInitials(alt)}</span>
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={className}
        loading={loading}
        onError={() => setHasError(true)}
      />
    );
  }

  const { width, height } = rest as { width: number; height: number };
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={loading}
      onError={() => setHasError(true)}
    />
  );
}
