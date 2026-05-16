<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import Card from '$components/shared/Card.svelte';
  import DaySlider from '$components/daily-ranking/DaySlider.svelte';
  import Table from '$components/daily-ranking/Table.svelte';
  import PageContent from '$components/shared/PageContent.svelte';
  import PageHeader from '$components/shared/PageHeader.svelte';
  import { ALL_SEASONS_INCLUDING_SCHEDULED, POPULATED_SEASONS } from '$data';
  import {
    buildDailyRankings,
    currentDayUntilFinals,
    maxDayBeforeFinals,
  } from '$lib/utils/daily-ranking';
  import { setParam } from '$lib/utils/url-state';

  const maxDay = $derived(maxDayBeforeFinals(POPULATED_SEASONS));
  const currentDay = $derived(
    currentDayUntilFinals(ALL_SEASONS_INCLUDING_SCHEDULED, maxDay),
  );
  const dayParam = $derived(browser ? page.url.searchParams.get('day') : null);
  const selectedDay = $derived.by(() => {
    const raw = dayParam !== null ? Number(dayParam) : currentDay;
    return raw >= 0 ? raw : 0;
  });
  const rankings = $derived(buildDailyRankings(POPULATED_SEASONS, selectedDay));

  const subtitle = $derived(
    selectedDay === 0
      ? 'Finals Day'
      : `${selectedDay} ${selectedDay === 1 ? 'day' : 'days'} before DCI Finals`,
  );

  function onDayChange(day: number) {
    void setParam('day', day === currentDay ? null : String(day));
  }

  function resetToToday() {
    void setParam('day', null);
  }
</script>

<svelte:head>
  <title>Daily ranking | Bluecoats Scores</title>
</svelte:head>

<PageHeader title="Daily ranking" {subtitle}>
  {#if selectedDay !== currentDay}
    <button
      onclick={resetToToday}
      class="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      type="button"
    >
      Reset to Today
    </button>
  {/if}
</PageHeader>
<PageContent>
  <div class="grid grid-cols-1 gap-4">
    <Card>
      <DaySlider value={selectedDay} maximum={maxDay} onChange={onDayChange} />
    </Card>
    <Card disablePadding>
      <div
        class="flex items-baseline justify-between border-b border-gray-200 px-4 py-4 sm:px-6"
      >
        <div>
          <div class="text-sm font-semibold text-gray-900">
            Leaderboard at {selectedDay}{selectedDay === 1 ? ' day' : ' days'} before
            Finals
          </div>
          <div class="text-xs text-gray-500">
            {rankings.length}
            {rankings.length === 1 ? 'season' : 'seasons'} ranked
          </div>
        </div>
      </div>
      <Table {rankings} />
    </Card>
  </div>
</PageContent>
