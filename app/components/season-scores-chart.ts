import Component from '@glimmer/component';
import { type SeasonScores } from 'bluecoats/data';
import { type EChartsOption, type SeriesOption } from 'echarts';
import { DateTime } from 'luxon';

interface SeasonScoresChartSignature {
  Args: {
    seasonScores: SeasonScores[];
    selectedYear: number;
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
    show: true,
    splitNumber: 2,
  },
  minorSplitLine: {
    show: true,
  },
};

export default class SeasonScoresChartComponent extends Component<SeasonScoresChartSignature> {
  get chartOption(): EChartsOption {
    let { legendOption, seriesOption } = this;
    return {
      title: TITLE_OPTION,
      grid: GRID_OPTION,
      xAxis: X_AXIS_OPTION,
      yAxis: Y_AXIS_OPTION,
      legend: legendOption,
      series: seriesOption,
      tooltip: {},
    };
  }

  get legendOption(): EChartsOption['legend'] {
    let { selectedSeason } = this;
    return {
      data: [`${selectedSeason.year}`],
      selectedMode: false,
    };
  }

  get selectedSeason(): SeasonScores {
    let { seasonScores, selectedYear } = this.args;
    return (
      seasonScores.find((season) => season.year == selectedYear) ??
      seasonScores[seasonScores.length - 1]!
    );
  }

  get unselectedSeasons(): SeasonScores[] {
    let { seasonScores, selectedYear } = this.args;
    return seasonScores.filter((season) => season.year != selectedYear);
  }

  get seriesOption(): EChartsOption['series'] {
    let { selectedSeason, unselectedSeasons } = this;

    let seriesOption = unselectedSeasons.map((season) => {
      return this.seriesForSeason(season);
    });
    seriesOption.push(this.seriesForSeason(selectedSeason, true));

    return seriesOption;
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
      itemStyle: {
        color: isSelected ? (color ?? '#012F70') : 'lightgray',
      },
      emphasis: {
        itemStyle: {
          borderColor: isSelected ? color : '#0245A2',
        },
        lineStyle: {
          color: isSelected ? color : '#0245A2',
        },
      },
    };
  }
}
