import { type SeasonScores } from '$data/base';

const COLOR_OPTIONS = ['#38bdf8', '#ec4899', '#facc15'];

export const SEASON_2026: SeasonScores = {
  year: '2026',
  color: COLOR_OPTIONS[Math.floor(Math.random() * COLOR_OPTIONS.length)],
  endDate: '2026-08-08',
  scores: [],
};
