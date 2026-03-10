import { z } from 'zod';
import { MultiPickData } from '@/types';
import { shows } from '@/data/shows';

// share URLデコード時のZodバリデーション
const MinimalShareDataSchema = z.object({
  picks: z
    .array(z.object({ s: z.string(), c: z.string() }))
    .min(1),
});

export interface ShareData {
  picks: Array<{
    showId: string;
    showTitle: string;
    contestantId: string;
    contestantName: string;
    contestantFurigana?: string;
  }>;
}

export function generateMultiPickShareText(multiPicks: MultiPickData[]): string {
  const picks = multiPicks
    .map(({ show, contestant }) => `${show.title}: ${contestant.displayName}`)
    .join('\n');
  return `私のオールスター1pickコレクション🎤\n\n${picks}\n\n${multiPicks.length}つの番組から選んだ推しメンたち✨\n\n#1pick #Share1Pick`;
}

export function generateTwitterShareText(multiPicks: MultiPickData[]): string {
  const contestantHashtags = multiPicks
    .map(({ contestant }) => `#${contestant.displayName}`)
    .join(' ');
  return `私のオールスター1pickコレクション🎤\n\n${contestantHashtags} #1pick #Share1Pick`;
}

export function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text)
      .then(() => true)
      .catch(() => false);
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-999999px';
  textarea.style.top = '-999999px';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return Promise.resolve(ok);
  } catch {
    document.body.removeChild(textarea);
    return Promise.resolve(false);
  }
}

export function encodeShareData(multiPicks: MultiPickData[]): string {
  const data = {
    picks: multiPicks.map(({ show, contestant }) => ({
      s: show.id,
      c: contestant.id,
    })),
  };
  const json = JSON.stringify(data);
  const base64 = Buffer.from(json).toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export function decodeShareData(shareId: string): ShareData | null {
  try {
    const base64 = shareId.replace(/-/g, '+').replace(/_/g, '/');
    const padding = '='.repeat((4 - (base64.length % 4)) % 4);
    const json = Buffer.from(base64 + padding, 'base64').toString('utf-8');
    const parsed = JSON.parse(json);

    if (!parsed.picks || parsed.picks.length === 0) return null;

    const firstPick = parsed.picks[0];

    // 最小化データ形式（新フォーマット）
    if ('s' in firstPick && 'c' in firstPick) {
      const result = MinimalShareDataSchema.safeParse(parsed);
      if (!result.success) return null;

      const restoredPicks = result.data.picks
        .map((pick) => {
          const show = shows.find((s) => s.id === pick.s);
          if (!show) return null;
          const contestant = show.contestants.find((c) => c.id === pick.c);
          if (!contestant) return null;
          return {
            showId: show.id,
            showTitle: show.title,
            contestantId: contestant.id,
            contestantName: contestant.displayName,
            contestantFurigana: contestant.furigana,
          };
        })
        .filter((p): p is NonNullable<typeof p> => p !== null);

      return restoredPicks.length > 0 ? { picks: restoredPicks } : null;
    }

    // 完全データ形式（旧フォーマット、後方互換）
    return parsed as ShareData;
  } catch {
    return null;
  }
}
