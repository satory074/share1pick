import { Show, Contestant, MultiPickData } from '@/types';

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
  const allShowTags = new Set<string>();
  const contestantHashtags: string[] = [];

  multiPicks.forEach(({ show, contestant }) => {
    // 番組ごとのハッシュタグを収集
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

    // 参加者のハッシュタグを生成
    const hashtag = generateContestantHashtag(contestant.displayName, contestant.furigana);
    contestantHashtags.push(`#${hashtag}`);
  });

  // 全てのハッシュタグを結合
  const allHashtags = [
    ...contestantHashtags,
    ...baseHashtags.map(tag => `#${tag}`),
    ...Array.from(allShowTags).map(tag => `#${tag}`)
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