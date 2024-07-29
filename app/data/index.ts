import { SEASON_2012 } from 'bluecoats/data/2012';
import { SEASON_2013 } from 'bluecoats/data/2013';
import { SEASON_2014 } from 'bluecoats/data/2014';
import { SEASON_2015 } from 'bluecoats/data/2015';
import { SEASON_2016 } from 'bluecoats/data/2016';
import { SEASON_2017 } from 'bluecoats/data/2017';
import { SEASON_2018 } from 'bluecoats/data/2018';
import { SEASON_2019 } from 'bluecoats/data/2019';
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
  SEASON_2012,
  SEASON_2013,
  SEASON_2014,
  SEASON_2015,
  SEASON_2016,
  SEASON_2017,
  SEASON_2018,
  SEASON_2019,
  SEASON_2022,
  SEASON_2023,
  SEASON_2024,
];
