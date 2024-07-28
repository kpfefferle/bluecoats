import Component from '@glimmer/component';
import { type SeasonScores } from 'bluecoats/data';
import { type EChartsOption, type SeriesOption } from 'echarts';
import { DateTime } from 'luxon';

interface SeasonScoresChartSignature {
  Args: {
    seasonScores: SeasonScores[];
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
  min: -42,
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

const LEGEND_OPTION: EChartsOption['legend'] = {
  data: ['2024'],
};

export default class SeasonScoresChart extends Component<SeasonScoresChartSignature> {
  get chartOption(): EChartsOption {
    let { series } = this;
    return {
      title: TITLE_OPTION,
      grid: GRID_OPTION,
      xAxis: X_AXIS_OPTION,
      yAxis: Y_AXIS_OPTION,
      legend: LEGEND_OPTION,
      series,
    };
  }

  get series(): EChartsOption['series'] {
    let { seasonScores } = this.args;

    return seasonScores.map(this.seriesForSeason);
  }

  seriesForSeason(season: SeasonScores): SeriesOption {
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
        color: color,
      },
    };
  }
}
