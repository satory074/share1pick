export interface Contestant {
  id: string;
  displayName: string;
  furigana?: string;
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