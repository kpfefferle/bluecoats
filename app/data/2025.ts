import { type SeasonScores } from 'bluecoats/data';

const COLOR_OPTIONS = ['#38bdf8', '#ec4899', '#facc15'];

export const SEASON_2025: SeasonScores = {
  year: '2025',
  color: COLOR_OPTIONS[Math.floor(Math.random() * COLOR_OPTIONS.length)],
  endDate: '2025-08-09',
  scores: [
    {
      date: '2025-07-06',
      location: 'La Crosse, WI',
      score: 83.3,
    },
    {
      date: '2025-07-12',
      location: 'Lisle, IL',
      score: 86.5,
    },
    {
      date: '2025-07-15',
      location: 'Broken Arrow, OK',
      score: 88.55,
    },
    {
      date: '2025-07-17',
      location: 'Denton, TX',
      score: 90.3,
    },
    {
      date: '2025-07-18',
      location: 'Houston, TX',
      score: 91.25,
    },
    {
      date: '2025-07-19',
      location: 'San Antonio, TX',
      score: 92.825,
    },
    {
      date: '2025-07-20',
      location: 'Bedford, TX',
      score: 92.95,
    },
    {
      date: '2025-07-25',
      location: 'Nashville, TN',
      score: 94.4,
    },
    {
      date: '2025-07-26',
      location: 'Atlanta, GA',
      score: 95.025,
    },
    {
      date: '2025-07-27',
      location: 'Winston-Salem, NC',
      score: 94.55,
    },
  ],
};
