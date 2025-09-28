export interface Contestant {
  id: string;
  name: string;
  image: string;
  company?: string;
  rank?: number;
  nationality?: string;
}

export interface Show {
  id: string;
  title: string;
  year: number;
  type: 'male' | 'female' | 'mixed';
  status: 'completed' | 'ongoing' | 'upcoming';
  logo?: string;
  description?: string;
  debutGroup?: string;
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