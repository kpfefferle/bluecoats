// Tree-shaken ECharts bundle: static named imports let Rollup prune every
// chart type / component / renderer this app doesn't use. The chart action
// pulls this module via dynamic `import()`, so it also splits into its own
// chunk kept out of the initial bundle. (Dynamically importing the
// `echarts/charts` barrels directly would defeat tree-shaking — the whole
// barrel would be retained — hence this dedicated statically-analyzable module.)
import { init, use } from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  MarkPointComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

use([
  LineChart,
  GridComponent,
  TooltipComponent,
  MarkPointComponent,
  CanvasRenderer,
]);

export { init };
