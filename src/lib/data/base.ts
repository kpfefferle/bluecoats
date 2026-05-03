export interface Score {
  date: string;
  location: string;
  // null means the event is scheduled but has not yet been competed
  score: number | null;
}

export interface SeasonScores {
  year: string;
  color?: string;
  endDate: string;
  scores: Array<Score>;
}
