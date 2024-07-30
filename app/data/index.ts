import { SEASON_1981 } from 'bluecoats/data/1981';
import { SEASON_1982 } from 'bluecoats/data/1982';
import { SEASON_1984 } from 'bluecoats/data/1984';
import { SEASON_1985 } from 'bluecoats/data/1985';
import { SEASON_1986 } from 'bluecoats/data/1986';
import { SEASON_1987 } from 'bluecoats/data/1987';
import { SEASON_1988 } from 'bluecoats/data/1988';
import { SEASON_1989 } from 'bluecoats/data/1989';
import { SEASON_1990 } from 'bluecoats/data/1990';
import { SEASON_1991 } from 'bluecoats/data/1991';
import { SEASON_1992 } from 'bluecoats/data/1992';
import { SEASON_1993 } from 'bluecoats/data/1993';
import { SEASON_1994 } from 'bluecoats/data/1994';
import { SEASON_1995 } from 'bluecoats/data/1995';
import { SEASON_1996 } from 'bluecoats/data/1996';
import { SEASON_1997 } from 'bluecoats/data/1997';
import { SEASON_1998 } from 'bluecoats/data/1998';
import { SEASON_1999 } from 'bluecoats/data/1999';
import { SEASON_2000 } from 'bluecoats/data/2000';
import { SEASON_2001 } from 'bluecoats/data/2001';
import { SEASON_2002 } from 'bluecoats/data/2002';
import { SEASON_2003 } from 'bluecoats/data/2003';
import { SEASON_2004 } from 'bluecoats/data/2004';
import { SEASON_2005 } from 'bluecoats/data/2005';
import { SEASON_2006 } from 'bluecoats/data/2006';
import { SEASON_2007 } from 'bluecoats/data/2007';
import { SEASON_2008 } from 'bluecoats/data/2008';
import { SEASON_2009 } from 'bluecoats/data/2009';
import { SEASON_2010 } from 'bluecoats/data/2010';
import { SEASON_2011 } from 'bluecoats/data/2011';
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
];
