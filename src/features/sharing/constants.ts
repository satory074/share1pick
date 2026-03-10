/**
 * 背景色プリセット（12種類）
 * html2canvas 互換: RGBA inline style を使用すること（Tailwind OKLCH 不可）
 */
export const BACKGROUND_PRESETS = [
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
] as const;

export type BackgroundPreset = typeof BACKGROUND_PRESETS[number];

export interface GridConfig {
  cols: number;
  rows: number;
  width: number;
  height: number;
}

export function getGridConfig(count: number): GridConfig {
  if (count <= 1) return { cols: 1, rows: 1, width: 400, height: 600 };
  if (count <= 2) return { cols: 2, rows: 1, width: 600, height: 400 };
  if (count <= 4) return { cols: 2, rows: 2, width: 600, height: 700 };
  if (count <= 6) return { cols: 3, rows: 2, width: 800, height: 600 };
  if (count <= 9) return { cols: 3, rows: 3, width: 800, height: 800 };
  return { cols: 4, rows: 3, width: 1000, height: 800 };
}
