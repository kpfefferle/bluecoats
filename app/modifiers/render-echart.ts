import Modifier, { type PositionalArgs } from 'ember-modifier';
import * as echarts from 'echarts';
import { type EChartsOption } from 'echarts';

interface RenderEchartModifierSignature {
  Element: HTMLDivElement;
  Args: {
    Positional: [EChartsOption];
  };
}

export default class RenderEchartModifier extends Modifier<RenderEchartModifierSignature> {
  modify(
    element: HTMLDivElement,
    [chartOption]: PositionalArgs<RenderEchartModifierSignature>,
  ) {
    echarts.init(element).setOption(chartOption);
  }
}
