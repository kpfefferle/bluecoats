import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import type { Action } from 'svelte/action';

export const chart: Action<HTMLDivElement, EChartsOption> = (node, options) => {
  const instance = echarts.init(node);
  instance.setOption(options);

  const onResize = () => instance.resize();
  window.addEventListener('resize', onResize);
  const observer = new ResizeObserver(onResize);
  observer.observe(node);

  return {
    update(next: EChartsOption) {
      instance.setOption(next, { notMerge: true });
    },
    destroy() {
      window.removeEventListener('resize', onResize);
      observer.disconnect();
      instance.dispose();
    },
  };
};
