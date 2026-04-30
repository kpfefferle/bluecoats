<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import Card from '$components/shared/Card.svelte';
  import DaySlider from '$components/daily-rankings/DaySlider.svelte';
  import Table from '$components/daily-rankings/Table.svelte';
  import PageContent from '$components/shared/PageContent.svelte';
  import PageHeader from '$components/shared/PageHeader.svelte';
  import { ALL_SEASONS } from '$data';
  import {
    buildDailyRankings,
    currentDayUntilFinals,
    maxDayBeforeFinals,
  } from '$lib/utils/daily-rankings';
  import { setParam } from '$lib/utils/url-state';

  const currentDay = $derived(currentDayUntilFinals(ALL_SEASONS));
  const dayParam = $derived(browser ? page.url.searchParams.get('day') : null);
  const selectedDay = $derived.by(() => {
    const raw = dayParam !== null ? Number(dayParam) : currentDay;
    return raw >= 0 ? raw : 0;
  });
  const maxDay = $derived(maxDayBeforeFinals(ALL_SEASONS));
  const rankings = $derived(buildDailyRankings(ALL_SEASONS, selectedDay));

  const subtitle = $derived.by(() => {
    if (selectedDay === 0) return 'Finals Day';
    return `${selectedDay} ${selectedDay === 1 ? 'day' : 'days'} before DCI Finals`;
  });

  function onDayChange(day: number) {
    void setParam('day', day === currentDay ? null : String(day));
  }

  function resetToToday() {
    void setParam('day', null);
  }
</script>

<svelte:head>
  <title>Daily Rankings | Bluecoats Scores</title>
</svelte:head>

<PageHeader title="Daily Rankings" {subtitle}>
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
      <Table {rankings} />
    </Card>
  </div>
</PageContent>
