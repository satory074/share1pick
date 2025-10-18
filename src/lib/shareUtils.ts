import { Show, Contestant, MultiPickData } from '@/types';
import { shows } from '@/data/shows';

export function generateHashtags(show: Show): string[] {
  const baseHashtags = ['1pick', 'Share1Pick'];

  const showSpecificHashtags = {
    'produce101': ['PRODUCE101', 'IOI', 'プデュ'],
    'produce101-s2': ['PRODUCE101SEASON2', 'WannaOne', 'プデュ2'],
    'produce48': ['PRODUCE48', 'IZONE', 'プデュ48'],
    'produce-x-101': ['PRODUCEX101', 'X1', 'プデュX'],
    'produce101-japan': ['PRODUCE101JAPAN', 'JO1', '日プ'],
    'produce101-japan-s2': ['PRODUCE101JAPAN_SEASON2', 'INI', '日プ2'],
    'produce101-japan-girls': ['PRODUCE101JAPAN_THE_GIRLS', 'MEI', '日プ女子'],
    'girls-planet-999': ['GirlsPlanet999', 'Kep1er', 'ガルプラ'],
    'boys-planet': ['BoysPlanet', 'ZEROBASEONE', 'ZB1', 'ボイプラ'],
    'i-land': ['ILAND', 'ENHYPEN', 'アイランド'],
    'r-u-next': ['RUNext', 'ILLIT', 'アルネク'],
    'nizi-project': ['NiziProject', 'NiziU', '虹プロ']
  };

  const showTags = showSpecificHashtags[show.id as keyof typeof showSpecificHashtags] || [];

  return [...baseHashtags, ...showTags];
}

export function generateShareText(show: Show, contestant: Contestant): string {
  const hashtags = generateHashtags(show).map(tag => `#${tag}`).join(' ');

  const templates = [
    `${show.title}の1pickは${contestant.displayName}です！\n\n${hashtags}`,
    `私の${show.title} 1pickを発表🎤\n✨ ${contestant.displayName}\n\n${hashtags}`,
    `${show.title}で推してたのは${contestant.displayName}！\nみんなの1pickは誰？\n\n${hashtags}`
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

export function generateOGPImageUrl(show: Show, contestant: Contestant): string {
  return `/api/og?showId=${encodeURIComponent(show.id)}&contestantId=${encodeURIComponent(contestant.id)}`;
}

export function generateMultiPickShareText(multiPicks: MultiPickData[]): string {
  const baseHashtags = ['1pick', 'Share1Pick'];
  const allShowTags = new Set<string>();

  multiPicks.forEach(({ show }) => {
    const showSpecificHashtags = {
      'produce101': ['PRODUCE101', 'IOI', 'プデュ'],
      'produce101-s2': ['PRODUCE101SEASON2', 'WannaOne', 'プデュ2'],
      'produce48': ['PRODUCE48', 'IZONE', 'プデュ48'],
      'produce-x-101': ['PRODUCEX101', 'X1', 'プデュX'],
      'produce101-japan': ['PRODUCE101JAPAN', 'JO1', '日プ'],
      'produce101-japan-s2': ['PRODUCE101JAPAN_SEASON2', 'INI', '日プ2'],
      'produce101-japan-girls': ['PRODUCE101JAPAN_THE_GIRLS', 'MEI', '日プ女子'],
      'girls-planet-999': ['GirlsPlanet999', 'Kep1er', 'ガルプラ'],
      'boys-planet': ['BoysPlanet', 'ZEROBASEONE', 'ZB1', 'ボイプラ'],
      'i-land': ['ILAND', 'ENHYPEN', 'アイランド'],
      'r-u-next': ['RUNext', 'ILLIT', 'アルネク'],
      'nizi-project': ['NiziProject', 'NiziU', '虹プロ']
    };

    const showTags = showSpecificHashtags[show.id as keyof typeof showSpecificHashtags] || [];
    showTags.forEach(tag => allShowTags.add(tag));
  });

  const hashtags = [...baseHashtags, ...Array.from(allShowTags)]
    .map(tag => `#${tag}`)
    .join(' ');

  const picksList = multiPicks
    .map(({ show, contestant }) => {
      return `${show.title}: ${contestant.displayName}`;
    })
    .join('\n');

  const templates = [
    `私のオールスター1pickコレクション🎤\n\n${picksList}\n\n${multiPicks.length}つの番組から選んだ推しメンたち✨\n\n${hashtags}`,
    `サバイバルオーディション 1pick まとめ！\n\n${picksList}\n\nみんなの推しは誰？\n\n${hashtags}`,
    `${multiPicks.length}番組の1pickを発表🌟\n\n${picksList}\n\n最高のコレクションができました！\n\n${hashtags}`
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

export function generateContestantHashtag(contestantName: string, furigana?: string): string {
  // ふりがながカタカナの場合（日本人参加者）はカタカナからハッシュタグを生成
  if (furigana && /^[\u30A0-\u30FF・]+$/.test(furigana)) {
    // 中点（・）を除去してハッシュタグ化
    return furigana.replace(/・/g, '');
  }
  // それ以外（韓国人/中国人参加者など）は元の名前をそのまま使用
  return contestantName;
}

export function generateTwitterShareText(multiPicks: MultiPickData[]): string {
  const baseHashtags = ['1pick', 'Share1Pick'];
  const contestantHashtags: string[] = [];

  multiPicks.forEach(({ contestant }) => {
    // 参加者の本名（displayName）をそのままハッシュタグに使用
    contestantHashtags.push(`#${contestant.displayName}`);
  });

  // 参加者ハッシュタグ + 基本ハッシュタグのみ
  const allHashtags = [
    ...contestantHashtags,
    ...baseHashtags.map(tag => `#${tag}`)
  ].join(' ');

  return `私のオールスター1pickコレクション🎤\n\n${allHashtags}`;
}

export function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text)
      .then(() => true)
      .catch(() => false);
  } else {
    // フォールバック
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return Promise.resolve(successful);
    } catch {
      document.body.removeChild(textArea);
      return Promise.resolve(false);
    }
  }
}

// 共有URLのためのデータエンコード/デコード

// 最小化されたデータ構造（URLサイズ削減のため）
interface MinimalShareData {
  picks: Array<{
    s: string; // showId
    c: string; // contestantId
  }>;
}

// 完全なデータ構造（後方互換性のため保持）
export interface ShareData {
  picks: Array<{
    showId: string;
    showTitle: string;
    contestantId: string;
    contestantName: string;
    contestantFurigana?: string;
  }>;
}

// showIdとcontestantIdから完全なデータを復元するヘルパー関数
function findContestantData(showId: string, contestantId: string): { show: Show; contestant: Contestant } | null {
  const show = shows.find(s => s.id === showId);
  if (!show) return null;

  const contestant = show.contestants.find(c => c.id === contestantId);
  if (!contestant) return null;

  return { show, contestant };
}

export function encodeShareData(multiPicks: MultiPickData[]): string {
  // 最小化されたデータ構造を使用してURLサイズを削減
  const minimalData: MinimalShareData = {
    picks: multiPicks.map(({ show, contestant }) => ({
      s: show.id,
      c: contestant.id,
    })),
  };

  // JSONを文字列化してBase64エンコード
  const jsonString = JSON.stringify(minimalData);
  const base64 = Buffer.from(jsonString).toString('base64');
  // URL safe にする
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export function decodeShareData(shareId: string): ShareData | null {
  try {
    // URL safe な文字を元に戻す
    const base64 = shareId.replace(/-/g, '+').replace(/_/g, '/');
    // パディングを追加
    const padding = '='.repeat((4 - (base64.length % 4)) % 4);
    const base64WithPadding = base64 + padding;

    // Base64デコードしてJSONパース
    const jsonString = Buffer.from(base64WithPadding, 'base64').toString('utf-8');
    const parsed = JSON.parse(jsonString);

    // 最小化データか完全データかを判定
    if (parsed.picks && parsed.picks.length > 0) {
      const firstPick = parsed.picks[0];

      // 最小化データの場合（'s'と'c'フィールドを持つ）
      if ('s' in firstPick && 'c' in firstPick) {
        const minimalData = parsed as MinimalShareData;

        // shows.tsからデータを復元
        const restoredPicks = minimalData.picks
          .map(pick => {
            const data = findContestantData(pick.s, pick.c);
            if (!data) return null;

            return {
              showId: data.show.id,
              showTitle: data.show.title,
              contestantId: data.contestant.id,
              contestantName: data.contestant.displayName,
              contestantFurigana: data.contestant.furigana,
            };
          })
          .filter((pick): pick is NonNullable<typeof pick> => pick !== null);

        if (restoredPicks.length === 0) return null;

        return { picks: restoredPicks };
      }

      // 完全データの場合（後方互換性のため）
      return parsed as ShareData;
    }

    return null;
  } catch (error) {
    console.error('Failed to decode share data:', error);
    return null;
  }
}