import { DateTime } from 'luxon';
import type { EChartsOption, SeriesOption } from 'echarts';
import type { SeasonScores } from '$data/base';
import { FINALS_ZONE } from './time';

const GRID_OPTION: EChartsOption['grid'] = {
  top: '36px',
  left: '36px',
  right: '48px',
  bottom: '48px',
};

const X_AXIS_OPTION_MIN = -10 * 7;
const Y_AXIS_OPTION_MIN = 30;

const X_AXIS_OPTION: EChartsOption['xAxis'] = {
  type: 'value',
  min: X_AXIS_OPTION_MIN,
  max: 0,
  interval: 7,
  axisLabel: {
    formatter(value: number) {
      if (value === 0) return 'DCI Finals';
      const weeks = Math.abs(value) / 7;
      return `${weeks} week${weeks > 1 ? 's' : ''}`;
    },
  },
};

const Y_AXIS_OPTION: EChartsOption['yAxis'] = {
  type: 'value',
  min: Y_AXIS_OPTION_MIN,
  max: 100,
  axisTick: {
    show: false,
  },
};

/** The protagonist (most recent / in-progress) season. */
export const COLOR_FEATURED = '#1d57e8';
/** Championship seasons (placement 1). */
export const COLOR_CHAMPION = '#c79a3a';
/** Every other season, rendered as faint historical context. */
export const COLOR_FAINT = '#dfe3ea';
/**
 * Picker-selected "compare" seasons. A single dark navy that matches the
 * "Compare" swatch in the legend — selected lines are told apart by their end
 * labels, not by color.
 */
export const COLOR_COMPARE = '#0a1531';
/** Surfaced on hover and used for the featured end label / Today marker. */
const COLOR_INK = '#0a1531';
const COLOR_CHAMPION_INK = '#7a5a1d';

type Role = 'featured' | 'selected' | 'champion' | 'other';

const LINE_SERIES_OPTION_BASE = {
  type: 'line' as const,
  step: 'end' as const,
  tooltip: {
    formatter(params: unknown) {
      const { data } = params as {
        seriesName: string;
        data: [number, number, string, string];
      };
      const formattedDate = DateTime.fromISO(data[2], {
        zone: FINALS_ZONE,
      }).toLocaleString(DateTime.DATE_FULL);
      return `
        <div class="text-lg font-semibold">${data[1].toFixed(3)}</div>
        <div class="text-sm">${data[3]}</div>
        <div class="text-xs">${formattedDate}</div>
      `;
    },
  },
};

type ScoredEntry = { date: string; location: string; score: number };

function scoredEntries(season: SeasonScores): ScoredEntry[] {
  return season.scores.filter(
    (entry): entry is ScoredEntry => typeof entry.score === 'number',
  );
}

function daysBeforeFinals(season: SeasonScores, date: string): number {
  const finalDate = DateTime.fromISO(season.endDate, { zone: FINALS_ZONE });
  const performanceDate = DateTime.fromISO(date, { zone: FINALS_ZONE });
  return finalDate.diff(performanceDate, 'days').days;
}

function seasonData(season: SeasonScores) {
  return scoredEntries(season).map(({ date, location, score }) => [
    -daysBeforeFinals(season, date),
    score,
    date,
    location,
  ]);
}

function seriesForSeason(
  season: SeasonScores,
  role: Role,
  inProgress: boolean,
  ageLabel: string,
): SeriesOption {
  const base = {
    ...LINE_SERIES_OPTION_BASE,
    name: season.year,
    data: seasonData(season),
  };

  if (role === 'other') {
    return {
      ...base,
      z: 1,
      symbol: 'none',
      lineStyle: { color: COLOR_FAINT, width: 1, opacity: 0.55 },
      itemStyle: { color: COLOR_FAINT },
      emphasis: {
        focus: 'series',
        lineStyle: { color: COLOR_INK, width: 2, opacity: 1 },
      },
    };
  }

  if (role === 'champion') {
    return {
      ...base,
      z: 10,
      symbol: 'none',
      lineStyle: { color: COLOR_CHAMPION, width: 1.5, opacity: 0.75 },
      itemStyle: { color: COLOR_CHAMPION },
      endLabel: {
        show: true,
        formatter: `${season.year}`,
        color: COLOR_CHAMPION_INK,
        fontWeight: 'bold',
        fontSize: 12,
      },
      emphasis: {
        focus: 'series',
        lineStyle: { width: 2.5, opacity: 1 },
      },
    };
  }

  if (role === 'selected') {
    return {
      ...base,
      z: 30,
      symbol: 'none',
      lineStyle: { color: COLOR_COMPARE, width: 2.25, opacity: 1 },
      itemStyle: { color: COLOR_COMPARE },
      endLabel: {
        show: true,
        formatter: season.year,
        color: COLOR_COMPARE,
        fontWeight: 'bold',
        fontSize: 12,
      },
      emphasis: { focus: 'series', lineStyle: { width: 3 } },
    };
  }

  // featured protagonist
  const latest = scoredEntries(season).at(-1);
  const markPoint =
    inProgress && latest
      ? {
          symbol: 'circle',
          symbolSize: 12,
          itemStyle: {
            color: COLOR_FEATURED,
            borderColor: '#fff',
            borderWidth: 3,
          },
          label: {
            show: true,
            position: 'top' as const,
            formatter: `${ageLabel} · ${latest.score.toFixed(3)}`,
            color: '#fff',
            backgroundColor: COLOR_INK,
            borderRadius: 4,
            padding: [4, 8] as [number, number],
            fontWeight: 'bold' as const,
            fontSize: 11,
          },
          data: [
            {
              name: ageLabel,
              coord: [-daysBeforeFinals(season, latest.date), latest.score] as [
                number,
                number,
              ],
            },
          ],
        }
      : undefined;

  return {
    ...base,
    z: 100,
    symbol: 'circle',
    symbolSize: 6,
    lineStyle: { color: COLOR_FEATURED, width: 3.25, opacity: 1 },
    itemStyle: { color: COLOR_FEATURED, borderColor: '#fff', borderWidth: 2 },
    endLabel: {
      show: true,
      formatter: season.year,
      color: COLOR_FEATURED,
      fontWeight: 'bold',
      fontSize: 13,
    },
    markPoint,
  };
}

function xAxisMin(seasons: SeasonScores[]): number {
  const lengths = seasons
    .map((season) => {
      const firstScored = scoredEntries(season)[0];
      if (!firstScored) return undefined;
      return daysBeforeFinals(season, firstScored.date);
    })
    .filter((days): days is number => days !== undefined);
  if (lengths.length === 0) return X_AXIS_OPTION_MIN;
  const longest = Math.max(...lengths);
  const weeks = Math.ceil(longest / 7);
  return -weeks * 7;
}

function yAxisMin(seasons: SeasonScores[]): number {
  const scores = seasons.flatMap((season) =>
    scoredEntries(season).map(({ score }) => score),
  );
  if (scores.length === 0) return Y_AXIS_OPTION_MIN;
  const minScore = Math.min(...scores);
  return Math.floor(minScore / 10) * 10;
}

export interface ChartOptionInput {
  seasons: SeasonScores[];
  /** Picker-selected years to promote to compare lines. */
  selectedYears: SeasonScores['year'][];
  /** The protagonist season's year, highlighted in bold blue. */
  featuredYear?: SeasonScores['year'];
  /** True when the featured season's tour is still underway (shows the marker). */
  featuredInProgress?: boolean;
  /**
   * Capitalized label for the featured marker describing how long ago the
   * latest score landed, e.g. `"Today"`, `"Yesterday"`, `"3 days ago"`.
   * Defaults to `"Today"`.
   */
  featuredAgeLabel?: string;
}

export function buildChartOption({
  seasons,
  selectedYears,
  featuredYear,
  featuredInProgress = false,
  featuredAgeLabel = 'Today',
}: ChartOptionInput): EChartsOption {
  const roleFor = (season: SeasonScores): Role => {
    if (season.year === featuredYear) return 'featured';
    if (selectedYears.includes(season.year)) return 'selected';
    if (season.placement === 1) return 'champion';
    return 'other';
  };

  // Render order back-to-front so higher-priority roles paint last.
  const order: Record<Role, number> = {
    other: 0,
    champion: 1,
    selected: 2,
    featured: 3,
  };
  const series: SeriesOption[] = [...seasons]
    .map((season) => ({ season, role: roleFor(season) }))
    .sort((a, b) => order[a.role] - order[b.role])
    .map(({ season, role }) =>
      seriesForSeason(season, role, featuredInProgress, featuredAgeLabel),
    );

  // Scale the axes to the featured season alone until the viewer picks seasons
  // to compare, at which point the focus widens to the featured + selected set.
  // (Every season still renders as faint context regardless of the bounds.)
  const focusSeasons = (() => {
    const focus = seasons.filter(
      (season) =>
        season.year === featuredYear || selectedYears.includes(season.year),
    );
    return focus.length ? focus : seasons;
  })();

  return {
    grid: GRID_OPTION,
    tooltip: {},
    series,
    xAxis: { ...X_AXIS_OPTION, min: xAxisMin(focusSeasons) },
    yAxis: { ...Y_AXIS_OPTION, min: yAxisMin(focusSeasons) },
  };
}
