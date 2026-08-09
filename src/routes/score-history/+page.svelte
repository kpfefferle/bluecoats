<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import Card from '$components/shared/Card.svelte';
  import ChartLegend from '$components/score-history/ChartLegend.svelte';
  import DecadeYearPicker from '$components/score-history/DecadeYearPicker.svelte';
  import EraSummary from '$components/score-history/EraSummary.svelte';
  import PageContent from '$components/shared/PageContent.svelte';
  import PageHeader from '$components/shared/PageHeader.svelte';
  import Seo from '$components/shared/Seo.svelte';
  import SeasonScoresChart from '$components/score-history/SeasonScoresChart.svelte';
  import { POPULATED_SEASONS } from '$data';
  import { getFeaturedSeason } from '$lib/utils/featured-season';
  import { setParam } from '$lib/utils/url-state';

  // The most recent season that has competed is the chart's protagonist; while
  // its tour is underway it also gets a "Today" marker.
  const featured = getFeaturedSeason(POPULATED_SEASONS);
  const featuredYear = featured?.season.year;
  const featuredInProgress = featured?.inProgress ?? false;
  // A featured season that placed 1st is drawn in gold rather than brand blue.
  const featuredIsChampion = featured?.season.placement === 1;

  const yearsParam = $derived(
    browser ? page.url.searchParams.get('years') : null,
  );
  const selectedYears = $derived((yearsParam ?? '').split(',').filter(Boolean));

  // Compare lines are the picked seasons other than the always-on protagonist.
  const compareYears = $derived(
    selectedYears
      .filter((year) => year !== featuredYear)
      .slice()
      .sort()
      .reverse(),
  );

  const headline = $derived(
    compareYears.length
      ? `All seasons · comparing ${featuredYear} with ${compareYears.join(', ')}`
      : `All seasons · ${featuredYear ?? 'latest'} featured`,
  );

  function onSelectedYearsChange(years: string[]) {
    const next = years.slice().sort();
    void setParam('years', next.length ? next.join(',') : null);
  }

  function clearSelection() {
    void setParam('years', null);
  }
</script>

<Seo
  title="Score History"
  description="An interactive chart of Bluecoats DCI competition scores across every season, from 1977 to today."
/>

<PageHeader
  title="Score history"
  subtitle="Every Bluecoats season charted as a full tour toward DCI Finals"
/>
<PageContent>
  <div class="grid grid-cols-1 gap-4">
    <Card disablePadding>
      <div
        class="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-4 sm:px-6"
      >
        <div>
          <div class="text-sm font-semibold text-gray-900">{headline}</div>
          <div class="text-xs text-gray-500">
            Hover any line to surface it · gold marks championship seasons
          </div>
        </div>
        <ChartLegend {featuredYear} {featuredIsChampion} />
      </div>
      <div class="flex h-200 flex-col overflow-x-auto px-2 pt-2">
        <SeasonScoresChart
          seasonScores={POPULATED_SEASONS}
          {selectedYears}
          {featuredYear}
          {featuredInProgress}
        />
      </div>
      <div class="px-4 pb-5 sm:px-6">
        <EraSummary />
      </div>
    </Card>

    <Card>
      <div class="mb-4 flex items-center justify-between gap-3">
        <div>
          <div class="text-sm font-semibold text-gray-900">Compare seasons</div>
          <div class="text-xs text-gray-500">
            Tap any year to promote it to a bold line on the chart above
          </div>
        </div>
        {#if compareYears.length}
          <button
            type="button"
            class="rounded-md px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100"
            onclick={clearSelection}
          >
            Clear
          </button>
        {/if}
      </div>
      <DecadeYearPicker
        seasonScores={POPULATED_SEASONS}
        {selectedYears}
        {featuredYear}
        onChange={onSelectedYearsChange}
      />
    </Card>
  </div>
</PageContent>
