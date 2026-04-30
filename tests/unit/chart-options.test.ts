import { describe, expect, it } from 'vitest';
import { buildChartOption } from '../../src/lib/utils/chart-options';
import type { SeasonScores } from '../../src/lib/data/base';

const SEASON_A: SeasonScores = {
  year: '2023',
  endDate: '2023-08-12',
  color: '#aabbcc',
  scores: [
    { date: '2023-06-22', location: 'Akron, OH', score: 70.0 },
    { date: '2023-08-12', location: 'Indianapolis, IN', score: 92.5 },
  ],
};

const SEASON_B: SeasonScores = {
  year: '2024',
  endDate: '2024-08-10',
  color: '#112233',
  scores: [
    { date: '2024-06-21', location: 'Akron, OH', score: 65.0 },
    { date: '2024-08-10', location: 'Indianapolis, IN', score: 95.0 },
  ],
};

const SEASONS = [SEASON_A, SEASON_B];

describe('buildChartOption', () => {
  it('falls back to the latest season when selectedYears is empty', () => {
    const opt = buildChartOption(SEASONS, [], false);
    const legend = opt.legend as { data: string[] };
    expect(legend.data).toEqual(['2024']);
  });

  it('uses the selected years when provided', () => {
    const opt = buildChartOption(SEASONS, ['2023'], false);
    const legend = opt.legend as { data: string[] };
    expect(legend.data).toEqual(['2023']);
  });

  it('uses static x/y axis bounds when fitAllSeasons is true', () => {
    const opt = buildChartOption(SEASONS, ['2023'], true);
    const xAxis = opt.xAxis as { min: number };
    const yAxis = opt.yAxis as { min: number };
    expect(xAxis.min).toBe(-70);
    expect(yAxis.min).toBe(30);
  });

  it('zooms axes to selected season bounds when fitAllSeasons is false', () => {
    const opt = buildChartOption(SEASONS, ['2023'], false);
    const xAxis = opt.xAxis as { min: number };
    const yAxis = opt.yAxis as { min: number };
    // 2023 spans 51 days → ceil(51/7)=8 weeks → -56
    expect(xAxis.min).toBe(-56);
    // min score 70 → floor(70/10)*10 = 70
    expect(yAxis.min).toBe(70);
  });
});
