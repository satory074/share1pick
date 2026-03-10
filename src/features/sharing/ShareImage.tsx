'use client';

/**
 * シェア画像プレビューコンポーネント
 *
 * ⚠️ html2canvas 制約:
 * - Tailwind CSS 4 の opacity 修飾子（bg-white/10 等）は OKLCH を生成するため使用不可
 * - Tailwind グラデーション（bg-gradient-to-br 等）も使用不可
 * - すべてのスタイルは RGBA inline style を使用すること
 */

import { MultiPickData } from '@/types';
import { useState } from 'react';
import { BACKGROUND_PRESETS, getGridConfig } from './constants';
import { getProxiedImageUrl } from '@/shared/utils/imageProxy';
import { getNameInitials } from '@/shared/utils/contestant';

interface ShareImageProps {
  multiPicks: MultiPickData[];
}

export default function ShareImage({ multiPicks }: ShareImageProps) {
  const [backgroundIndex, setBackgroundIndex] = useState(
    () => Math.floor(Math.random() * BACKGROUND_PRESETS.length)
  );

  const handleBackgroundChange = () => {
    setBackgroundIndex((prev) => (prev + 1) % BACKGROUND_PRESETS.length);
  };

  const gridConfig = getGridConfig(multiPicks.length);
  const currentBackground = BACKGROUND_PRESETS[backgroundIndex];

  return (
    <div
      id="multi-pick-share-preview"
      className="p-6 text-white relative overflow-hidden cursor-pointer"
      onClick={handleBackgroundChange}
      style={{
        width: `${gridConfig.width}px`,
        height: `${gridConfig.height}px`,
        fontFamily: 'Inter, sans-serif',
        background: currentBackground.gradient,
      }}
      title="クリックで背景色変更"
    >
      {/* 暗め overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
      />

      {/* Grid */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div
          className="grid gap-4 w-full max-w-full"
          style={{
            gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
            gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`,
          }}
        >
          {multiPicks.map(({ show, contestant }) => (
            <ContestantCell
              key={`${show.id}-${contestant.id}`}
              name={contestant.displayName}
              imageUrl={getProxiedImageUrl(contestant.image)}
            />
          ))}
        </div>
      </div>

      {/* Pick count */}
      <div className="absolute top-4 left-4 text-xs" style={{ opacity: 0.7 }}>
        {multiPicks.length} Picks
      </div>

      {/* Preset label */}
      <div className="absolute bottom-4 right-4 text-xs text-right" style={{ opacity: 0.7 }}>
        <div>{currentBackground.name}</div>
        <div className="mt-1">{backgroundIndex + 1}/{BACKGROUND_PRESETS.length}</div>
      </div>
    </div>
  );
}

interface ContestantCellProps {
  name: string;
  imageUrl: string;
}

function ContestantCell({ name, imageUrl }: ContestantCellProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="rounded-lg p-3 flex flex-col items-center text-center backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
    >
      <div
        className="w-16 h-16 rounded-full overflow-hidden mb-2 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
        style={{
          border: '2px solid rgba(255, 255, 255, 0.3)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        }}
      >
        {imageError ? (
          <span>{getNameInitials(name)}</span>
        ) : (
          // html2canvas のために <img> タグを直接使用（Next.js Image は使用不可）
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={name}
            crossOrigin="anonymous"
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <div className="text-xs font-semibold truncate w-full">{name}</div>
    </div>
  );
}
