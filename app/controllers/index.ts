import Controller from '@ember/controller';
import { type IndexRouteModel } from 'bluecoats/routes/index';
import { type EChartsOption } from 'echarts';
import { DateTime } from 'luxon';

const TITLE_OPTION: EChartsOption['title'] = {
  text: 'Scores by Season',
  subtext: 'Relative to Final Performance',
};

const GRID_OPTION: EChartsOption['grid'] = {
  top: '10%',
  left: '2%',
  right: '3%',
  bottom: '2%',
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

export default class IndexController extends Controller {
  declare model: IndexRouteModel;

  get chartOption(): EChartsOption {
    let { series } = this;
    return {
      title: TITLE_OPTION,
      grid: GRID_OPTION,
      xAxis: X_AXIS_OPTION,
      yAxis: Y_AXIS_OPTION,
      color: ['#BB0C2F'],
      series,
    };
  }

  get series(): EChartsOption['series'] {
    let { model } = this;

    let finalDate = DateTime.fromISO(model.endDate);
    let data = model.scores.map(({ date, score }) => {
      let performanceDate = DateTime.fromISO(date);
      let daysToFinal = finalDate.diff(performanceDate, 'days').days;
      return [-daysToFinal, score];
    });

    return [
      {
        name: `${model.year}`,
        type: 'line',
        step: 'end',
        data,
      },
    ];
  }
}
