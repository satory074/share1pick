'use client';

import { MultiPickData } from '@/types';
import { useState } from 'react';

interface MultiPickShareImageProps {
  multiPicks: MultiPickData[];
}

// 12種類の背景色プリセット
const BACKGROUND_PRESETS = [
  { name: 'Mint + Coral', gradient: 'linear-gradient(to bottom right, rgb(93, 217, 185), rgb(255, 138, 128))' },
  { name: 'Purple + Pink + Orange', gradient: 'linear-gradient(to bottom right, rgb(168, 85, 247), rgb(236, 72, 153), rgb(251, 146, 60))' },
  { name: 'Mint + Blue + Coral', gradient: 'linear-gradient(to bottom right, rgb(93, 217, 185), rgb(110, 197, 255), rgb(255, 138, 128))' },
  { name: 'Blue + Purple', gradient: 'linear-gradient(to bottom right, rgb(110, 197, 255), rgb(168, 85, 247))' },
  { name: 'Coral + Gold', gradient: 'linear-gradient(to bottom right, rgb(255, 138, 128), rgb(255, 213, 79))' },
  { name: 'Pink + Purple', gradient: 'linear-gradient(to bottom right, rgb(236, 72, 153), rgb(168, 85, 247))' },
  { name: 'Ocean', gradient: 'linear-gradient(to bottom right, rgb(56, 189, 248), rgb(20, 184, 166))' },
  { name: 'Sunset', gradient: 'linear-gradient(to bottom right, rgb(251, 146, 60), rgb(239, 68, 68), rgb(168, 85, 247))' },
  { name: 'Forest', gradient: 'linear-gradient(to bottom right, rgb(34, 197, 94), rgb(16, 185, 129))' },
  { name: 'Lavender', gradient: 'linear-gradient(to bottom right, rgb(167, 139, 250), rgb(236, 72, 153), rgb(147, 197, 253))' },
  { name: 'Fire', gradient: 'linear-gradient(to bottom right, rgb(239, 68, 68), rgb(251, 146, 60), rgb(250, 204, 21))' },
  { name: 'Night', gradient: 'linear-gradient(to bottom right, rgb(30, 58, 138), rgb(109, 40, 217), rgb(219, 39, 119))' },
];

export default function MultiPickShareImage({ multiPicks }: MultiPickShareImageProps) {
  // ランダムな初期背景色
  const [backgroundIndex, setBackgroundIndex] = useState(() =>
    Math.floor(Math.random() * BACKGROUND_PRESETS.length)
  );

  const getGridConfig = (count: number) => {
    if (count <= 1) return { cols: 1, rows: 1, width: 400, height: 600 };
    if (count <= 2) return { cols: 2, rows: 1, width: 600, height: 400 };
    if (count <= 4) return { cols: 2, rows: 2, width: 600, height: 700 };
    if (count <= 6) return { cols: 3, rows: 2, width: 800, height: 600 };
    if (count <= 9) return { cols: 3, rows: 3, width: 800, height: 800 };
    return { cols: 4, rows: 3, width: 1000, height: 800 };
  };

  // 外部画像をプロキシ経由で取得
  const getProxiedImageUrl = (imageUrl: string) => {
    // 外部URLの場合はプロキシを使用
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
    }
    // ローカル画像はそのまま
    return imageUrl;
  };

  // 次の背景色に切り替え
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
        background: currentBackground.gradient
      }}
      title="クリックで背景色変更"
    >
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}></div>

      <div className="relative z-10 h-full flex items-center justify-center">
          <div
            className="grid gap-4 w-full max-w-full"
            style={{
              gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
              gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`
            }}
          >
            {multiPicks.map(({ show, contestant }) => (
              <div
                key={`${show.id}-${contestant.id}`}
                className="rounded-lg p-3 flex flex-col items-center text-center backdrop-blur-sm"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <div
                  className="w-16 h-16 rounded-full overflow-hidden mb-2 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
                  style={{
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <img
                    src={getProxiedImageUrl(contestant.image)}
                    alt={contestant.displayName}
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.textContent = contestant.displayName.charAt(0);
                      }
                    }}
                  />
                </div>
                <div className="text-xs font-semibold truncate w-full">
                  {contestant.displayName}
                </div>
              </div>
            ))}
          </div>
      </div>

      <div className="absolute top-4 left-4 text-xs" style={{ opacity: 0.7 }}>
        {multiPicks.length} Picks
      </div>

      {/* 背景色プリセット番号とヒント */}
      <div className="absolute bottom-4 right-4 text-xs text-right" style={{ opacity: 0.7 }}>
        <div>{currentBackground.name}</div>
        <div className="mt-1">{backgroundIndex + 1}/{BACKGROUND_PRESETS.length}</div>
      </div>
    </div>
  );
}