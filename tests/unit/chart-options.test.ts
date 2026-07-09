import { describe, expect, it } from 'vitest';
import {
  buildChartOption,
  COLOR_CHAMPION,
  COLOR_COMPARE,
  COLOR_FAINT,
  COLOR_FEATURED,
} from '../../src/lib/utils/chart-options';
import type { SeasonScores } from '../../src/lib/data/base';

const SEASON_2023: SeasonScores = {
  year: '2023',
  endDate: '2023-08-12',
  placement: 5,
  scores: [
    { date: '2023-06-08', location: 'Akron, OH', score: 60.0 },
    { date: '2023-08-12', location: 'Indianapolis, IN', score: 92.5 },
  ],
};

const SEASON_2024: SeasonScores = {
  year: '2024',
  endDate: '2024-08-10',
  placement: 1, // champion
  color: '#dc2626',
  scores: [
    { date: '2024-07-06', location: 'Akron, OH', score: 70.0 },
    { date: '2024-08-10', location: 'Indianapolis, IN', score: 95.0 },
  ],
};

const SEASON_2025: SeasonScores = {
  year: '2025',
  endDate: '2025-08-09',
  placement: 2,
  scores: [
    { date: '2025-07-19', location: 'Akron, OH', score: 80.0 },
    { date: '2025-08-09', location: 'Indianapolis, IN', score: 98.25 },
  ],
};

const SEASONS = [SEASON_2023, SEASON_2024, SEASON_2025];

type Series = {
  name: string;
  data: unknown[];
  z?: number;
  symbol?: string;
  lineStyle?: { color?: string; width?: number; opacity?: number };
  itemStyle?: { color?: string };
  endLabel?: { show?: boolean };
  markPoint?: {
    label?: { formatter?: string };
    data: Array<{ coord: [number, number]; name?: string }>;
  };
};

function seriesByName(opt: ReturnType<typeof buildChartOption>, name: string) {
  const series = opt.series as Series[];
  const match = series.find((s) => s.name === name);
  if (!match) throw new Error(`no series for ${name}`);
  return match;
}

describe('buildChartOption', () => {
  it('renders every season as a series so history stays visible as context', () => {
    const opt = buildChartOption({
      seasons: SEASONS,
      selectedYears: [],
      featuredYear: '2025',
    });
    expect((opt.series as Series[]).length).toBe(SEASONS.length);
  });

  it('does not attach an ECharts legend (a semantic legend is rendered in markup)', () => {
    const opt = buildChartOption({
      seasons: SEASONS,
      selectedYears: [],
      featuredYear: '2025',
    });
    expect(opt.legend).toBeUndefined();
  });

  it('styles the featured season as the bold blue protagonist with an end label', () => {
    const opt = buildChartOption({
      seasons: SEASONS,
      selectedYears: [],
      featuredYear: '2025',
    });
    const featured = seriesByName(opt, '2025');
    expect(featured.lineStyle?.color).toBe(COLOR_FEATURED);
    expect(featured.symbol).toBe('circle');
    expect(featured.endLabel?.show).toBe(true);
    // protagonist sits on top of everything else
    const others = (opt.series as Series[]).filter((s) => s.name !== '2025');
    for (const s of others) expect(featured.z ?? 0).toBeGreaterThan(s.z ?? 0);
  });

  it('pins a Today marker to the latest result only while in progress', () => {
    const partial: SeasonScores = {
      year: '2026',
      endDate: '2026-08-08',
      scores: [
        { date: '2026-07-04', location: 'Hometown, OH', score: null },
        { date: '2026-07-25', location: 'Atlanta, GA', score: 88.0 },
        { date: '2026-08-08', location: 'Indianapolis, IN' },
      ],
    };
    const live = buildChartOption({
      seasons: [partial],
      selectedYears: [],
      featuredYear: '2026',
      featuredInProgress: true,
    });
    const marker = seriesByName(live, '2026').markPoint;
    expect(marker?.data[0].coord).toEqual([-14, 88.0]);
    // Defaults to "Today" when no age label is supplied.
    expect(marker?.data[0].name).toBe('Today');
    expect(marker?.label?.formatter).toBe('Today · 88.000');

    const offSeason = buildChartOption({
      seasons: [partial],
      selectedYears: [],
      featuredYear: '2026',
      featuredInProgress: false,
    });
    expect(seriesByName(offSeason, '2026').markPoint).toBeUndefined();
  });

  it('labels the marker with the supplied age label as days pass', () => {
    const partial: SeasonScores = {
      year: '2026',
      endDate: '2026-08-08',
      scores: [{ date: '2026-07-25', location: 'Atlanta, GA', score: 88.0 }],
    };
    const opt = buildChartOption({
      seasons: [partial],
      selectedYears: [],
      featuredYear: '2026',
      featuredInProgress: true,
      featuredAgeLabel: '3 days ago',
    });
    const marker = seriesByName(opt, '2026').markPoint;
    expect(marker?.data[0].name).toBe('3 days ago');
    expect(marker?.label?.formatter).toBe('3 days ago · 88.000');
  });

  it('renders championship seasons (placement 1) in gold when not selected', () => {
    const opt = buildChartOption({
      seasons: SEASONS,
      selectedYears: [],
      featuredYear: '2025',
    });
    expect(seriesByName(opt, '2024').lineStyle?.color).toBe(COLOR_CHAMPION);
    expect(seriesByName(opt, '2024').endLabel?.show).toBe(true);
  });

  it('renders ordinary unselected seasons as faint gray hairlines', () => {
    const opt = buildChartOption({
      seasons: SEASONS,
      selectedYears: [],
      featuredYear: '2025',
    });
    const other = seriesByName(opt, '2023');
    expect(other.lineStyle?.color).toBe(COLOR_FAINT);
    expect(other.endLabel?.show ?? false).toBe(false);
  });

  it('promotes selected seasons to the dark compare line above the hairlines', () => {
    const opt = buildChartOption({
      seasons: SEASONS,
      selectedYears: ['2023'],
      featuredYear: '2025',
    });
    const selected = seriesByName(opt, '2023');
    const champion = seriesByName(opt, '2024'); // champion, not selected
    expect(selected.endLabel?.show).toBe(true);
    expect(selected.lineStyle?.color).toBe(COLOR_COMPARE);
    // a compare line sits above the gold championship hairlines
    expect(selected.z ?? 0).toBeGreaterThan(champion.z ?? 0);
  });

  it('renders every selected season in the same compare color, even one with its own color', () => {
    const opt = buildChartOption({
      seasons: SEASONS,
      selectedYears: ['2023', '2024'], // 2024 defines color: '#dc2626'
      featuredYear: '2025',
    });
    expect(seriesByName(opt, '2023').lineStyle?.color).toBe(COLOR_COMPARE);
    expect(seriesByName(opt, '2024').lineStyle?.color).toBe(COLOR_COMPARE);
  });

  it('scales axes to the featured season alone when nothing is selected', () => {
    const opt = buildChartOption({
      seasons: SEASONS,
      selectedYears: [],
      featuredYear: '2025',
    });
    const xAxis = opt.xAxis as { min: number };
    const yAxis = opt.yAxis as { min: number };
    // featured 2025 spans 21 days → ceil(21/7)=3 weeks → -21
    expect(xAxis.min).toBe(-21);
    // featured 2025 lowest score is 80 → floor(80/10)*10 = 80
    expect(yAxis.min).toBe(80);
  });

  it('falls back to all seasons for bounds when no featured year resolves', () => {
    const opt = buildChartOption({ seasons: SEASONS, selectedYears: [] });
    const xAxis = opt.xAxis as { min: number };
    const yAxis = opt.yAxis as { min: number };
    // longest span is 2023 (65 days) → ceil(65/7)=10 weeks → -70
    expect(xAxis.min).toBe(-70);
    // lowest score across all seasons is 60 → floor(60/10)*10 = 60
    expect(yAxis.min).toBe(60);
  });

  it('zooms axes to the featured + selected seasons when a selection exists', () => {
    const opt = buildChartOption({
      seasons: SEASONS,
      selectedYears: ['2024'],
      featuredYear: '2025',
    });
    const xAxis = opt.xAxis as { min: number };
    const yAxis = opt.yAxis as { min: number };
    // focus = 2024 (35-day span, min 70) + 2025 (21-day span, min 80)
    // longest span 35 → ceil(35/7)=5 weeks → -35
    expect(xAxis.min).toBe(-35);
    // lowest focus score is 70 → floor(70/10)*10 = 70
    expect(yAxis.min).toBe(70);
  });

  it('ignores scheduled and exhibition entries in series data and axis bounds', () => {
    const partial: SeasonScores = {
      year: '2026',
      endDate: '2026-08-08',
      scores: [
        { date: '2026-07-04', location: 'Hometown, OH', score: null },
        { date: '2026-07-25', location: 'Atlanta, GA', score: 88.0 },
        { date: '2026-08-08', location: 'Indianapolis, IN' },
      ],
    };
    const opt = buildChartOption({
      seasons: [partial],
      selectedYears: ['2026'],
      featuredYear: '2026',
    });
    const xAxis = opt.xAxis as { min: number };
    const yAxis = opt.yAxis as { min: number };
    expect(xAxis.min).toBe(-14); // first scored 7/25 → 14 days → -14
    expect(yAxis.min).toBe(80); // min score 88 → 80
    expect(seriesByName(opt, '2026').data).toHaveLength(1);
  });
});
