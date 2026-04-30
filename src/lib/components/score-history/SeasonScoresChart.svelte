<script lang="ts">
  import { chart } from '$lib/actions/chart';
  import { buildChartOption } from '$lib/utils/chart-options';
  import type { SeasonScores } from '$data/base';

  let {
    seasonScores,
    selectedYears,
    fitAllSeasons,
  }: {
    seasonScores: SeasonScores[];
    selectedYears: SeasonScores['year'][];
    fitAllSeasons: boolean;
  } = $props();

  const chartOption = $derived(
    buildChartOption(seasonScores, selectedYears, fitAllSeasons),
  );
</script>

<div class="min-w-200 grow" use:chart={chartOption}></div>
