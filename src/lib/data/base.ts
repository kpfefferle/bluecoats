export interface Score {
  date: string;
  location: string;
  name?: string;
  /**
   * - omitted/`undefined` — scheduled but not yet competed
   * - `null` — competed (e.g. exhibition) with no published score
   * - `number` — scored competition result
   */
  score?: number | null;
}

export interface SeasonScores {
  year: string;
  color?: string;
  endDate: string;
  show?: string;
  scores: Array<Score>;
}
