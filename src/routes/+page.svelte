<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import Card from '$components/shared/Card.svelte';
  import FitAllToggle from '$components/score-history/FitAllToggle.svelte';
  import PageContent from '$components/shared/PageContent.svelte';
  import PageHeader from '$components/shared/PageHeader.svelte';
  import SeasonScoresChart from '$components/score-history/SeasonScoresChart.svelte';
  import SeasonSelect from '$components/score-history/SeasonSelect.svelte';
  import { ALL_SEASONS } from '$data';
  import { setParam } from '$lib/utils/url-state';

  const yearsParam = $derived(
    browser ? page.url.searchParams.get('years') : null,
  );
  const selectedYears = $derived(
    (yearsParam ?? '2025').split(',').filter(Boolean).sort().reverse(),
  );

  const fitAllParam = $derived(
    browser ? page.url.searchParams.get('fitAll') : null,
  );
  const fitAllSeasons = $derived(fitAllParam === 'true');

  function onSelectedYearsChange(years: string[]) {
    const next = years.join(',');
    void setParam('years', next === '2025' ? null : next);
  }

  function onFitAllSeasonsChange(value: boolean) {
    void setParam('fitAll', value ? 'true' : null);
  }
</script>

<svelte:head>
  <title>Score History | Bluecoats Scores</title>
</svelte:head>

<PageHeader title="Score History" subtitle="Relative to DCI Finals" />
<PageContent>
  <div class="grid grid-cols-1 gap-4">
    <Card>
      <div class="grid grid-cols-1 gap-4">
        <SeasonSelect
          seasonScores={ALL_SEASONS}
          {selectedYears}
          onChange={onSelectedYearsChange}
        />
        <FitAllToggle {fitAllSeasons} onChange={onFitAllSeasonsChange} />
      </div>
    </Card>
    <Card>
      <div class="flex min-h-svh flex-col overflow-x-auto">
        <SeasonScoresChart
          seasonScores={ALL_SEASONS}
          {selectedYears}
          {fitAllSeasons}
        />
      </div>
    </Card>
  </div>
</PageContent>
