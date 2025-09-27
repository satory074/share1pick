'use client';

import { Contestant, Show } from '@/types';
import Image from 'next/image';

interface ShareImagePreviewProps {
  show: Show;
  contestant: Contestant;
}

export default function ShareImagePreview({ show, contestant }: ShareImagePreviewProps) {
  return (
    <div
      id="share-preview"
      className="w-[400px] h-[600px] bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-8 text-white relative overflow-hidden"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <div className="absolute inset-0 bg-black/10"></div>

      <div className="relative z-10 h-full flex flex-col">
        <div className="text-center mb-6">
          <div className="text-xs uppercase tracking-wider opacity-90 mb-2">
            SURVIVAL AUDITION
          </div>
          <h1 className="text-xl font-bold mb-2 leading-tight">
            {show.title}
          </h1>
          <div className="text-sm opacity-90">
            {show.year} • {show.debutGroup}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white/30 mb-6 bg-white/10 flex items-center justify-center">
            <Image
              src={contestant.image}
              alt={contestant.name}
              width={192}
              height={192}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://via.placeholder.com/192x192/6B7280/FFFFFF?text=${encodeURIComponent(contestant.name.split(' ')[0])}`;
              }}
            />
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold mb-2">MY 1PICK</div>
            <div className="text-xl mb-2 font-semibold">
              {contestant.name}
            </div>
            {contestant.rank && (
              <div className="text-sm opacity-90 mb-2">
                Final Rank: #{contestant.rank}
              </div>
            )}
            {contestant.company && (
              <div className="text-xs opacity-80">
                {contestant.company}
              </div>
            )}
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

      <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
        <span className="text-2xl">🎤</span>
      </div>

      <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
        <span className="text-xl">⭐</span>
      </div>
    </div>
  );
}