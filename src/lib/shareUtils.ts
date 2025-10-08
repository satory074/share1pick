import { Show, Contestant, MultiPickData } from '@/types';
import { getNationalityFlag } from './nationalityUtils';

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

  const rankText = contestant.rank ? `（最終順位${contestant.rank}位）` : '';
  const nationalityEmoji = getNationalityFlag(contestant.nationality);

  const templates = [
    `${show.title}の1pickは${contestant.name}${rankText}です！${nationalityEmoji}\n\n${hashtags}`,
    `私の${show.title} 1pickを発表🎤\n✨ ${contestant.name} ${rankText}${nationalityEmoji}\n\n${hashtags}`,
    `${show.title}で推してたのは${contestant.name}${rankText}！${nationalityEmoji}\nみんなの1pickは誰？\n\n${hashtags}`
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
      const rankText = contestant.rank ? `（#${contestant.rank}）` : '';
      const nationalityEmoji = getNationalityFlag(contestant.nationality);
      return `${show.title}: ${contestant.name}${rankText}${nationalityEmoji}`;
    })
    .join('\n');

  const templates = [
    `私のオールスター1pickコレクション🎤\n\n${picksList}\n\n${multiPicks.length}つの番組から選んだ推しメンたち✨\n\n${hashtags}`,
    `サバイバルオーディション 1pick まとめ！\n\n${picksList}\n\nみんなの推しは誰？\n\n${hashtags}`,
    `${multiPicks.length}番組の1pickを発表🌟\n\n${picksList}\n\n最高のコレクションができました！\n\n${hashtags}`
  ];

  return templates[Math.floor(Math.random() * templates.length)];
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