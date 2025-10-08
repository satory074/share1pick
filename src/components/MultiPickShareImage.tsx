'use client';

import { MultiPickData } from '@/types';
import Image from 'next/image';

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

  const gridConfig = getGridConfig(multiPicks.length);

  return (
    <div
      id="multi-pick-share-preview"
      className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-6 text-white relative overflow-hidden"
      style={{
        width: `${gridConfig.width}px`,
        height: `${gridConfig.height}px`,
        fontFamily: 'Inter, sans-serif'
      }}
    >
      <div className="absolute inset-0 bg-black/10"></div>

      <div className="relative z-10 h-full flex flex-col">
        <div className="text-center mb-6">
          <div className="text-sm uppercase tracking-wider opacity-90 mb-2">
            MY ALL-STAR 1PICKS
          </div>
          <h1 className="text-2xl font-bold mb-2 leading-tight">
            {multiPicks.length}つの番組から選んだ推しメン
          </h1>
          <div className="text-sm opacity-90">
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
                className="bg-white/10 rounded-lg p-3 flex flex-col items-center text-center backdrop-blur-sm"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 mb-2 bg-white/10 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                  <Image
                    src={contestant.image}
                    alt={contestant.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.textContent = contestant.name.charAt(0);
                      }
                    }}
                  />
                </div>
                <div className="text-xs font-semibold mb-1 truncate w-full">
                  {contestant.name}
                </div>
                <div className="text-xs opacity-80 truncate w-full">
                  {show.title}
                </div>
                {contestant.rank && (
                  <div className="text-xs opacity-70">
                    #{contestant.rank}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-6">
          <div className="text-xs opacity-80 mb-2">
            Created with
          </div>
          <div className="text-lg font-bold">
            Share1Pick
          </div>
          <div className="text-xs opacity-70">
            share1pick.vercel.app
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
        <span className="text-lg">🎤</span>
      </div>

      <div className="absolute bottom-4 left-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
        <span className="text-sm">⭐</span>
      </div>

      <div className="absolute top-4 left-4 text-xs opacity-70">
        {multiPicks.length} PICKS
      </div>
    </div>
  );
}