<script lang="ts">
  import { browser } from '$app/environment';
  import { chart } from '$lib/actions/chart';
  import { buildChartOption } from '$lib/utils/chart-options';
  import { ageLabel, daysAgo, latestScoredEntry } from '$lib/utils/today';
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

  // How long ago the featured season's latest score landed, capitalized for the
  // marker ("Today", "Yesterday", "3 days ago"). The chart renders client-side
  // only, so reading the clock in the browser needs no hydration guard, but we
  // fall back to the default label during prerender all the same.
  const featuredAgeLabel = $derived.by(() => {
    if (!browser || !featuredInProgress) return undefined;
    const featured = seasonScores.find((s) => s.year === featuredYear);
    const latest = featured && latestScoredEntry(featured);
    if (!latest) return undefined;
    const label = ageLabel(daysAgo(latest.date));
    return label.charAt(0).toUpperCase() + label.slice(1);
  });

  const chartOption = $derived(
    buildChartOption({
      seasons: seasonScores,
      selectedYears,
      featuredYear,
      featuredInProgress,
      featuredAgeLabel,
    }),
  );
</script>

<div class="min-w-200 grow" use:chart={chartOption}></div>
