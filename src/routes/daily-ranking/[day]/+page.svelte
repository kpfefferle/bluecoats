<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import Card from '$components/shared/Card.svelte';
  import DaySlider from '$components/daily-ranking/DaySlider.svelte';
  import Table from '$components/daily-ranking/Table.svelte';
  import PageContent from '$components/shared/PageContent.svelte';
  import PageHeader from '$components/shared/PageHeader.svelte';
  import { ALL_SEASONS_INCLUDING_SCHEDULED, POPULATED_SEASONS } from '$data';
  import {
    buildDailyRankings,
    currentDayUntilFinals,
    currentSeasonYear,
    maxDayBeforeFinals,
  } from '$lib/utils/daily-ranking';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const maxDay = $derived(maxDayBeforeFinals(POPULATED_SEASONS));
  const currentDay = $derived(
    currentDayUntilFinals(ALL_SEASONS_INCLUDING_SCHEDULED, maxDay),
  );
  const selectedDay = $derived(data.day);
  const rankings = $derived(buildDailyRankings(POPULATED_SEASONS, selectedDay));
  const currentYear = $derived(currentSeasonYear(POPULATED_SEASONS));

  // The last three days of the season are DCI championship rounds:
  // Prelims (2 days out), Semis (1 day out), Finals (day 0).
  const pageTitle = $derived.by(() => {
    if (selectedDay === 0) return 'Finals Ranking | Bluecoats Scores';
    if (selectedDay === 1) return 'Semis Ranking | Bluecoats Scores';
    if (selectedDay === 2) return 'Prelims Ranking | Bluecoats Scores';
    return `Day ${selectedDay} Ranking | Bluecoats Scores`;
  });

  function onDayChange(day: number) {
    void goto(resolve('/daily-ranking/[day]', { day: String(day) }), {
      replaceState: true,
      keepFocus: true,
      noScroll: true,
    });
  }
</script>

<svelte:head>
  <title>{pageTitle}</title>
</svelte:head>

<PageHeader
  title="Daily ranking"
  subtitle="Where this season stacks up vs. every past Bluecoats season at the same point in the tour."
/>
<PageContent>
  <div class="grid grid-cols-1 gap-4">
    <Card subtle>
      <DaySlider
        value={selectedDay}
        maximum={maxDay}
        {currentDay}
        onChange={onDayChange}
      />
    </Card>
    <Card disablePadding>
      <div
        class="flex items-baseline justify-between border-b border-gray-200 px-4 py-4 sm:px-6"
      >
        <div>
          <div class="text-sm font-semibold text-gray-900">
            {`Leaderboard at ${selectedDay} ${selectedDay === 1 ? 'day' : 'days'} before Finals`}
          </div>
          <div class="text-xs text-gray-500">
            {rankings.length}
            {rankings.length === 1 ? 'season' : 'seasons'} ranked
          </div>
        </div>
      </div>
      <Table {rankings} {currentYear} />
    </Card>
  </div>
</PageContent>
