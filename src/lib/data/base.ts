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
  /**
   * Final DCI placement. Omit for seasons that didn't reach a placed result
   * (parade corps only, canceled tours, in-progress seasons).
   */
  placement?: number;
  scores: Array<Score>;
}
