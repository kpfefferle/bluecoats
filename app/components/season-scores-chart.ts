import Component from '@glimmer/component';
import { type SeasonScores } from 'bluecoats/data';
import { type EChartsOption, type SeriesOption } from 'echarts';
import { DateTime } from 'luxon';

interface SeasonScoresChartSignature {
  Args: {
    fitAllSeasons: boolean;
    seasonScores: SeasonScores[];
    selectedYears: Array<number>;
  };
}

const TITLE_OPTION: EChartsOption['title'] = {
  text: 'Scores by Season',
  subtext: 'Relative to DCI Finals',
};

const GRID_OPTION: EChartsOption['grid'] = {
  top: '80px',
  left: '32px',
  right: '32px',
  bottom: '32px',
};

const X_AXIS_OPTION: EChartsOption['xAxis'] = {
  type: 'value',
  min: -10 * 7, // 10 weeks before finals
  max: 0,
  interval: 7,
  minorTick: {
    show: true,
    splitNumber: 7,
  },
  minorSplitLine: {
    show: true,
  },
  axisLabel: {
    formatter: function (value) {
      if (value === 0) return 'DCI Finals';
      let weeksNum = Math.abs(value) / 7;
      return `${weeksNum} week${weeksNum > 1 ? 's' : ''}`;
    },
  },
};

const LINE_SERIES_OPTION_BASE = {
  type: 'line' as const,
  step: 'end' as const,
  tooltip: {
    formatter(params: unknown) {
      let { data } = params as {
        seriesName: string;
        data: [number, number, string, string];
      };
      let formattedDate = DateTime.fromISO(data[2]).toLocaleString(
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

const Y_AXIS_OPTION: EChartsOption['yAxis'] = {
  type: 'value',
  min: 30,
  max: 100,
  minorTick: {
    length: 0,
    show: true,
    splitNumber: 2,
  },
  minorSplitLine: {
    show: true,
  },
};

export default class SeasonScoresChartComponent extends Component<SeasonScoresChartSignature> {
  get chartOption(): EChartsOption {
    let { legendOption, seriesOption, xAxisOption, yAxisOption } = this;

    return {
      title: TITLE_OPTION,
      grid: GRID_OPTION,
      tooltip: {},

      legend: legendOption,
      series: seriesOption,
      xAxis: xAxisOption,
      yAxis: yAxisOption,
    };
  }

  get legendOption(): EChartsOption['legend'] {
    let { selectedSeasons } = this;
    let data = selectedSeasons
      .map(({ year }) => `${year}`)
      .sort()
      .reverse();
    return {
      data,
      selectedMode: false,
    };
  }

  get selectedSeasons(): Array<SeasonScores> {
    let { seasonScores, selectedYears } = this.args;
    let selectedSeasons = seasonScores.filter((season) =>
      selectedYears.includes(season.year),
    );
    return selectedSeasons.length
      ? selectedSeasons
      : [seasonScores[seasonScores.length - 1]!];
  }

  get unselectedSeasons(): SeasonScores[] {
    let { seasonScores, selectedYears } = this.args;
    return seasonScores.filter(
      (season) => !selectedYears.includes(season.year),
    );
  }

  get seriesOption(): EChartsOption['series'] {
    let { selectedSeasons, unselectedSeasons } = this;

    return [
      ...unselectedSeasons.map((season) => this.seriesForSeason(season)),
      ...selectedSeasons.map((season) => this.seriesForSeason(season, true)),
    ];
  }

  get xAxisMinForSelectedSeason(): number {
    let { selectedSeasons } = this;
    let seasonLengths = selectedSeasons.map((season) => {
      let finalDate = DateTime.fromISO(season.endDate);
      let firstPerformanceDate = DateTime.fromISO(season.scores[0]!.date);
      return finalDate.diff(firstPerformanceDate, 'days').days;
    });
    let longestSeasonLength = Math.max(...seasonLengths);
    let numberOfWeeks = Math.ceil(longestSeasonLength / 7);
    return -numberOfWeeks * 7;
  }

  get xAxisOption(): EChartsOption['xAxis'] {
    let { fitAllSeasons } = this.args;
    let { xAxisMinForSelectedSeason } = this;

    if (fitAllSeasons) {
      return X_AXIS_OPTION;
    }

    return {
      ...X_AXIS_OPTION,
      min: xAxisMinForSelectedSeason,
    };
  }

  get yAxisMinForSelectedSeason(): number {
    let { selectedSeasons } = this;
    let minScores = selectedSeasons.map((season) => {
      return Math.min(...season.scores.map(({ score }) => score));
    });
    let minScore = Math.min(...minScores);
    let minScoreRounded = Math.floor(minScore / 10) * 10;
    return minScoreRounded;
  }

  get yAxisOption(): EChartsOption['yAxis'] {
    let { fitAllSeasons } = this.args;
    let { yAxisMinForSelectedSeason } = this;

    if (fitAllSeasons) {
      return Y_AXIS_OPTION;
    }

    let yAxisOption = {
      ...Y_AXIS_OPTION,
      min: yAxisMinForSelectedSeason,
    };
    return yAxisOption;
  }

  seriesForSeason(season: SeasonScores, isSelected = false): SeriesOption {
    let { color, endDate, scores, year } = season;

    let finalDate = DateTime.fromISO(endDate);
    let data = scores.map(({ date, location, score }) => {
      let performanceDate = DateTime.fromISO(date);
      let daysToFinal = finalDate.diff(performanceDate, 'days').days;
      return [-daysToFinal, score, date, location];
    });

    return {
      ...LINE_SERIES_OPTION_BASE,
      name: `${year}`,
      data,
      z: isSelected ? 1 : 0,
      itemStyle: {
        color: isSelected
          ? (color ?? '#1d4ed8') // blue-700
          : '#e5e7eb', // gray-200
      },
      emphasis: {
        itemStyle: {
          borderColor: color ?? '#2563eb', // blue-600
        },
        lineStyle: {
          color: color ?? '#2563eb', // blue-600
        },
      },
    };
  }
}
