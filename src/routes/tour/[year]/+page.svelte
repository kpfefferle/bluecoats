<script lang="ts">
  import Card from '$components/shared/Card.svelte';
  import PageContent from '$components/shared/PageContent.svelte';
  import SeasonPicker from '$components/tour/SeasonPicker.svelte';
  import TourStats from '$components/tour/TourStats.svelte';
  import TourLog from '$components/tour/TourLog.svelte';
  import { POPULATED_SEASONS } from '$data';
  import {
    buildTourLog,
    tourSummary,
    isInProgress,
    placementLabel,
  } from '$lib/utils/tour';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const season = $derived(data.season);

  const rows = $derived(buildTourLog(POPULATED_SEASONS, season));
  const summary = $derived(tourSummary(POPULATED_SEASONS, season));
  const inProgress = $derived(isInProgress(season));
  const placement = $derived(placementLabel(season.placement));

  const subtitle = $derived.by(() => {
    const count = `${rows.length} ${rows.length === 1 ? 'show' : 'shows'}`;
    if (inProgress) {
      return summary.seasonHigh !== null
        ? `${count} so far · high ${summary.seasonHigh.toFixed(3)}`
        : `${count} so far`;
    }
    if (summary.finalsScore !== null && summary.finalsRank !== null) {
      return `${count} · Final score ${summary.finalsScore.toFixed(3)} · #${summary.finalsRank} all-time finals score`;
    }
    return summary.seasonHigh !== null
      ? `${count} · season high ${summary.seasonHigh.toFixed(3)}`
      : count;
  });
</script>

<svelte:head>
  <title>{season.year} Tour | Bluecoats Scores</title>
</svelte:head>

<header class="mx-auto flex max-w-300 flex-col gap-2 px-4 pt-4 sm:pt-8 md:px-6">
  {#if placement || inProgress}
    <div class="flex flex-wrap items-center gap-2">
      {#if placement}
        <span
          class="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700"
        >
          {#if season.placement === 1}<span aria-hidden="true">🥇</span
            >{:else if season.placement === 2}<span aria-hidden="true">🥈</span
            >{:else if season.placement === 3}<span aria-hidden="true">🥉</span
            >{/if}
          {placement}
        </span>
      {/if}
      {#if inProgress}
        <span
          class="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-2.5 py-1 text-xs font-semibold text-brand-600"
        >
          <span class="size-1.5 rounded-full bg-brand-600"></span>Season in
          progress
        </span>
      {/if}
    </div>
  {/if}
  <div>
    <h1 class="text-3xl font-bold tracking-tight text-gray-900">
      {season.year} · {season.show ?? 'Untitled'}
    </h1>
    <p class="mt-1 text-sm text-gray-500">{subtitle}</p>
  </div>
</header>

<PageContent>
  <div class="grid grid-cols-1 gap-4">
    <Card subtle>
      <SeasonPicker seasons={POPULATED_SEASONS} year={season.year} />
    </Card>
    <TourStats {summary} {inProgress} />
    <Card disablePadding>
      <div
        class="flex items-baseline justify-between border-b border-gray-200 px-4 py-4 sm:px-6"
      >
        <div>
          <div class="text-sm font-semibold text-gray-900">
            Tour log · every show
          </div>
          <div class="text-xs text-gray-500">
            Rank then = at the time · Rank now = today
          </div>
        </div>
      </div>
      <TourLog {rows} />
      <div
        class="border-t border-gray-200 bg-gray-50 px-4 py-4 text-xs leading-relaxed text-gray-500 sm:px-6"
      >
        <span class="font-semibold text-gray-700">How to read this:</span>
        "Rank then" reflects only the seasons completed before this one. "Rank now"
        includes every Bluecoats season since. The Δ column shows whether history
        has caught up.
      </div>
    </Card>
  </div>
</PageContent>
