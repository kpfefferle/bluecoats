import { SEASON_2022 } from 'bluecoats/data/2022';
import { SEASON_2023 } from 'bluecoats/data/2023';
import { SEASON_2024 } from 'bluecoats/data/2024';

export interface SeasonScores {
  year: number;
  color?: string;
  endDate: string;
  scores: Array<{
    date: string;
    location: string;
    score: number;
  }>;
}

export const ALL_SEASONS: SeasonScores[] = [
  SEASON_2022,
  SEASON_2023,
  SEASON_2024,
];
