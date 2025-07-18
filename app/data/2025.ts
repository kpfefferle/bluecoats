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
  ],
};
