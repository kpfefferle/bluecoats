import { DateTime } from 'luxon';
import type { EChartsOption, SeriesOption } from 'echarts';
import type { SeasonScores } from '$data/base';

const GRID_OPTION: EChartsOption['grid'] = {
  top: '32px',
  left: '32px',
  right: '32px',
  bottom: '80px',
};

const X_AXIS_OPTION_MIN = -10 * 7;
const Y_AXIS_OPTION_MIN = 30;

const X_AXIS_OPTION: EChartsOption['xAxis'] = {
  type: 'value',
  min: X_AXIS_OPTION_MIN,
  max: 0,
  interval: 7,
  minorTick: { show: true, splitNumber: 7 },
  minorSplitLine: { show: true },
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
  minorTick: { length: 0, show: true, splitNumber: 2 },
  minorSplitLine: { show: true },
};

const LINE_SERIES_OPTION_BASE = {
  type: 'line' as const,
  step: 'end' as const,
  tooltip: {
    formatter(params: unknown) {
      const { data } = params as {
        seriesName: string;
        data: [number, number, string, string];
      };
      const formattedDate = DateTime.fromISO(data[2]).toLocaleString(
        DateTime.DATE_FULL,
      );
      return `
        <div class="text-lg font-semibold">${data[1].toFixed(3)}</div>
        <div class="text-sm">${data[3]}</div>
        <div class="text-xs">${formattedDate}</div>
      `;
    },
  },
};

function seriesForSeason(
  season: SeasonScores,
  isSelected: boolean,
): SeriesOption {
  const finalDate = DateTime.fromISO(season.endDate);
  const data = season.scores
    .filter(
      (entry): entry is { date: string; location: string; score: number } =>
        typeof entry.score === 'number',
    )
    .map(({ date, location, score }) => {
      const performanceDate = DateTime.fromISO(date);
      const daysToFinal = finalDate.diff(performanceDate, 'days').days;
      return [-daysToFinal, score, date, location];
    });

  return {
    ...LINE_SERIES_OPTION_BASE,
    name: season.year,
    data,
    z: isSelected ? 1 : 0,
    itemStyle: {
      color: isSelected ? (season.color ?? '#1d4ed8') : '#e5e7eb',
    },
    emphasis: {
      itemStyle: { borderColor: season.color ?? '#2563eb' },
      lineStyle: { color: season.color ?? '#2563eb' },
    },
  };
}

function xAxisMin(seasons: SeasonScores[]): number {
  const lengths = seasons
    .map((season) => {
      const firstScored = season.scores.find(
        ({ score }) => typeof score === 'number',
      );
      if (!firstScored) return undefined;
      const finalDate = DateTime.fromISO(season.endDate);
      const firstDate = DateTime.fromISO(firstScored.date);
      return finalDate.diff(firstDate, 'days').days;
    })
    .filter((days): days is number => days !== undefined);
  if (lengths.length === 0) return X_AXIS_OPTION_MIN;
  const longest = Math.max(...lengths);
  const weeks = Math.ceil(longest / 7);
  return -weeks * 7;
}

function yAxisMin(seasons: SeasonScores[]): number {
  const scores = seasons.flatMap((season) =>
    season.scores
      .map(({ score }) => score)
      .filter((score): score is number => typeof score === 'number'),
  );
  if (scores.length === 0) return Y_AXIS_OPTION_MIN;
  const minScore = Math.min(...scores);
  return Math.floor(minScore / 10) * 10;
}

export function buildChartOption(
  seasonScores: SeasonScores[],
  selectedYears: SeasonScores['year'][],
  fitAllSeasons: boolean,
): EChartsOption {
  const matchedSelected = seasonScores.filter((season) =>
    selectedYears.includes(season.year),
  );
  const selectedSeasons = matchedSelected.length
    ? matchedSelected
    : [seasonScores[seasonScores.length - 1]];
  const unselectedSeasons = seasonScores.filter(
    (season) => !selectedSeasons.includes(season),
  );

  const legend = {
    data: selectedSeasons
      .map(({ year }) => year)
      .sort()
      .reverse(),
    selectedMode: false,
  };

  const series: SeriesOption[] = [
    ...unselectedSeasons.map((season) => seriesForSeason(season, false)),
    ...selectedSeasons.map((season) => seriesForSeason(season, true)),
  ];

  const xAxis = fitAllSeasons
    ? X_AXIS_OPTION
    : { ...X_AXIS_OPTION, min: xAxisMin(selectedSeasons) };

  const yAxis = fitAllSeasons
    ? Y_AXIS_OPTION
    : { ...Y_AXIS_OPTION, min: yAxisMin(selectedSeasons) };

  return {
    grid: GRID_OPTION,
    tooltip: {},
    legend,
    series,
    xAxis,
    yAxis,
  };
}
