import type { EChartsOption } from 'echarts';
import type { EChartsType } from 'echarts/core';
import type { Action } from 'svelte/action';

/**
 * Wires an ECharts instance to a `<div>`. The tree-shaken ECharts bundle
 * (`./echarts`) is loaded via dynamic `import()` so it splits into its own
 * chunk and stays out of the initial bundle. The chart is client-only and its
 * containers reserve a fixed height, so deferring the load causes no layout
 * shift. `update`/`destroy` tolerate the instance not being ready yet.
 */
export const chart: Action<HTMLDivElement, EChartsOption> = (node, options) => {
  let instance: EChartsType | undefined;
  let destroyed = false;
  let pending = options;

  void (async () => {
    const { init } = await import('./echarts');
    if (destroyed) return;
    instance = init(node);
    instance.setOption(pending);
  })();

  const onResize = () => instance?.resize();
  window.addEventListener('resize', onResize);
  const observer = new ResizeObserver(onResize);
  observer.observe(node);

  return {
    update(next: EChartsOption) {
      pending = next;
      instance?.setOption(next, { notMerge: true });
    },
    destroy() {
      destroyed = true;
      window.removeEventListener('resize', onResize);
      observer.disconnect();
      instance?.dispose();
    },
  };
};
