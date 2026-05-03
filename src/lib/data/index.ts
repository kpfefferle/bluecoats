import { type SeasonScores } from './base';

import { SEASON_1977 } from './seasons/1977';
import { SEASON_1978 } from './seasons/1978';
import { SEASON_1980 } from './seasons/1980';
import { SEASON_1981 } from './seasons/1981';
import { SEASON_1982 } from './seasons/1982';
import { SEASON_1984 } from './seasons/1984';
import { SEASON_1985 } from './seasons/1985';
import { SEASON_1986 } from './seasons/1986';
import { SEASON_1987 } from './seasons/1987';
import { SEASON_1988 } from './seasons/1988';
import { SEASON_1989 } from './seasons/1989';
import { SEASON_1990 } from './seasons/1990';
import { SEASON_1991 } from './seasons/1991';
import { SEASON_1992 } from './seasons/1992';
import { SEASON_1993 } from './seasons/1993';
import { SEASON_1994 } from './seasons/1994';
import { SEASON_1995 } from './seasons/1995';
import { SEASON_1996 } from './seasons/1996';
import { SEASON_1997 } from './seasons/1997';
import { SEASON_1998 } from './seasons/1998';
import { SEASON_1999 } from './seasons/1999';
import { SEASON_2000 } from './seasons/2000';
import { SEASON_2001 } from './seasons/2001';
import { SEASON_2002 } from './seasons/2002';
import { SEASON_2003 } from './seasons/2003';
import { SEASON_2004 } from './seasons/2004';
import { SEASON_2005 } from './seasons/2005';
import { SEASON_2006 } from './seasons/2006';
import { SEASON_2007 } from './seasons/2007';
import { SEASON_2008 } from './seasons/2008';
import { SEASON_2009 } from './seasons/2009';
import { SEASON_2010 } from './seasons/2010';
import { SEASON_2011 } from './seasons/2011';
import { SEASON_2012 } from './seasons/2012';
import { SEASON_2013 } from './seasons/2013';
import { SEASON_2014 } from './seasons/2014';
import { SEASON_2015 } from './seasons/2015';
import { SEASON_2016 } from './seasons/2016';
import { SEASON_2017 } from './seasons/2017';
import { SEASON_2018 } from './seasons/2018';
import { SEASON_2019 } from './seasons/2019';
import { SEASON_2022 } from './seasons/2022';
import { SEASON_2023 } from './seasons/2023';
import { SEASON_2024 } from './seasons/2024';
import { SEASON_2025 } from './seasons/2025';
import { SEASON_2026 } from './seasons/2026';

/**
 * Every known season, including upcoming ones whose `scores` array is empty
 * or contains only schedule entries (`score: null`). Reserved for
 * forward-looking computations like locating the next upcoming finals date.
 *
 * For anything that renders scores (charts, dropdowns, rankings) use
 * {@link POPULATED_SEASONS} instead.
 */
export const ALL_SEASONS_INCLUDING_SCHEDULED: SeasonScores[] = [
  SEASON_1977,
  SEASON_1978,
  SEASON_1980,
  SEASON_1981,
  SEASON_1982,
  SEASON_1984,
  SEASON_1985,
  SEASON_1986,
  SEASON_1987,
  SEASON_1988,
  SEASON_1989,
  SEASON_1990,
  SEASON_1991,
  SEASON_1992,
  SEASON_1993,
  SEASON_1994,
  SEASON_1995,
  SEASON_1996,
  SEASON_1997,
  SEASON_1998,
  SEASON_1999,
  SEASON_2000,
  SEASON_2001,
  SEASON_2002,
  SEASON_2003,
  SEASON_2004,
  SEASON_2005,
  SEASON_2006,
  SEASON_2007,
  SEASON_2008,
  SEASON_2009,
  SEASON_2010,
  SEASON_2011,
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
  SEASON_2025,
  SEASON_2026,
];

/**
 * Seasons with at least one scored entry. Use this for any UI that displays
 * scores — chart, season select, daily rankings.
 */
export const POPULATED_SEASONS: SeasonScores[] =
  ALL_SEASONS_INCLUDING_SCHEDULED.filter((season) =>
    season.scores.some((score) => score.score !== null),
  );
