'use client';

import { MultiPickData } from '@/types';

interface MultiPickShareImageProps {
  multiPicks: MultiPickData[];
}

export default function MultiPickShareImage({ multiPicks }: MultiPickShareImageProps) {
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

  const gridConfig = getGridConfig(multiPicks.length);

  return (
    <div
      id="multi-pick-share-preview"
      className="p-6 text-white relative overflow-hidden"
      style={{
        width: `${gridConfig.width}px`,
        height: `${gridConfig.height}px`,
        fontFamily: 'Inter, sans-serif',
        background: 'linear-gradient(to bottom right, rgb(168, 85, 247), rgb(236, 72, 153), rgb(251, 146, 60))'
      }}
    >
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}></div>

      <div className="relative z-10 h-full flex flex-col">
        <div className="text-center mb-6">
          <div className="text-sm uppercase tracking-wider mb-2" style={{ opacity: 0.9 }}>
            MY ALL-STAR 1PICKS
          </div>
          <h1 className="text-2xl font-bold mb-2 leading-tight">
            {multiPicks.length}つの番組から選んだ推しメン
          </h1>
          <div className="text-sm" style={{ opacity: 0.9 }}>
            サバイバルオーディション 1pick コレクション
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
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
                <div className="text-xs font-semibold mb-1 truncate w-full">
                  {contestant.displayName}
                </div>
                <div className="text-xs truncate w-full" style={{ opacity: 0.8 }}>
                  {show.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-6">
          <div className="text-xs mb-2" style={{ opacity: 0.8 }}>
            Created with
          </div>
          <div className="text-lg font-bold">
            Share1Pick
          </div>
          <div className="text-xs" style={{ opacity: 0.7 }}>
            share1pick.vercel.app
          </div>
        </div>
      </div>

      <div
        className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
      >
        <span className="text-lg">🎤</span>
      </div>

      <div
        className="absolute bottom-4 left-4 w-10 h-10 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
      >
        <span className="text-sm">⭐</span>
      </div>

      <div className="absolute top-4 left-4 text-xs" style={{ opacity: 0.7 }}>
        {multiPicks.length} PICKS
      </div>
    </div>
  );
}