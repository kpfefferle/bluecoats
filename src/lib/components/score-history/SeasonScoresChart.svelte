<script lang="ts">
  import { chart } from '$lib/actions/chart';
  import { buildChartOption } from '$lib/utils/chart-options';
  import type { SeasonScores } from '$data/base';

  let {
    seasonScores,
    selectedYears,
    featuredYear,
    featuredInProgress = false,
  }: {
    seasonScores: SeasonScores[];
    selectedYears: SeasonScores['year'][];
    featuredYear?: SeasonScores['year'];
    featuredInProgress?: boolean;
  } = $props();

  const chartOption = $derived(
    buildChartOption({
      seasons: seasonScores,
      selectedYears,
      featuredYear,
      featuredInProgress,
    }),
  );
</script>

<div class="min-w-200 grow" use:chart={chartOption}></div>
