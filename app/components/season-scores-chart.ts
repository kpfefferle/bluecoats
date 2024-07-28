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
  subtext: 'Relative to Final Performance',
};

const GRID_OPTION: EChartsOption['grid'] = {
  top: '80px',
  left: '2%',
  right: '3%',
  bottom: '10%',
  containLabel: true,
};

const X_AXIS_OPTION: EChartsOption['xAxis'] = {
  type: 'value',
  min: -49,
  max: 0,
  interval: 7,
  minorTick: {
    show: true,
    splitNumber: 7,
  },
  minorSplitLine: {
    show: true,
  },
};

const Y_AXIS_OPTION: EChartsOption['yAxis'] = {
  type: 'value',
  min: 60,
  max: 100,
  minorTick: {
    show: true,
    splitNumber: 2,
  },
  minorSplitLine: {
    show: true,
  },
};

export default class SeasonScoresChart extends Component<SeasonScoresChartSignature> {
  get chartOption(): EChartsOption {
    let { legendOption, seriesOption } = this;
    return {
      title: TITLE_OPTION,
      grid: GRID_OPTION,
      xAxis: X_AXIS_OPTION,
      yAxis: Y_AXIS_OPTION,
      legend: legendOption,
      series: seriesOption,
    };
  }

  get legendOption(): EChartsOption['legend'] {
    let { selectedSeason } = this;
    return {
      data: [`${selectedSeason.year}`],
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
    let data = scores.map(({ date, score }) => {
      let performanceDate = DateTime.fromISO(date);
      let daysToFinal = finalDate.diff(performanceDate, 'days').days;
      return [-daysToFinal, score];
    });

    return {
      name: `${year}`,
      type: 'line',
      step: 'end',
      data,
      itemStyle: {
        color: isSelected ? color : 'lightgray',
      },
    };
  }
}
