export interface Contestant {
  id: string;
  displayName: string;
  furigana?: string;
  /**
   * 画像URL。空文字禁止。
   * 優先度: ① /images/contestants/{show-id}/{id}.webp（セルフホスト）
   *          ② img.youtube.com/vi/{VIDEO_ID}/hqdefault.jpg（YouTube）
   *          ③ 外部プロフィールURL（kprofiles / kpopping / produce101.jp）
   * ④ 空文字 "" → 新規データでは禁止（`npm run validate:images` で検知）
   */
  image: string;
}

export interface Show {
  id: string;
  title: string;
  year: number;
  debutGroup?: string;
  officialWebsite?: string;
  logo?: string;
  contestants: Contestant[];
}

export interface UserSelection {
  showId: string;
  contestantId: string;
  timestamp: number;
}

export interface AllUserSelections {
  [showId: string]: UserSelection;
}

export interface MultiPickData {
  show: Show;
  contestant: Contestant;
}