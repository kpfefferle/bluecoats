export interface Score {
  date: string;
  location: string;
  score: number;
}

export interface SeasonScores {
  year: string;
  color?: string;
  endDate: string;
  scores: Array<Score>;
}
