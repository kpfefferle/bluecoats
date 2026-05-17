<script lang="ts">
  import type { DailyRankingItem } from '$lib/utils/daily-ranking';
  import { ordinalSuffix } from '$lib/utils/ordinal';

  let { rankings }: { rankings: DailyRankingItem[] } = $props();

  const range = $derived.by(() => {
    if (rankings.length === 0) return { max: 0, min: 0 };
    const max = rankings[0].score;
    const min = rankings[rankings.length - 1].score - 0.5;
    return { max, min };
  });

  function rankClass(rank: number) {
    if (rank === 1)
      return 'bg-amber-100 text-amber-900 ring-1 ring-inset ring-amber-300';
    if (rank === 2)
      return 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-300';
    if (rank === 3)
      return 'bg-orange-50 text-orange-800 ring-1 ring-inset ring-orange-200';
    return 'bg-gray-100 text-gray-600';
  }

  const MEDAL_LABEL: Record<number, string> = {
    1: 'DCI World Champion',
    2: 'DCI Silver Medalist',
    3: 'DCI Bronze Medalist',
  };
  const MEDAL_STAR_CLASS: Record<number, string> = {
    1: 'text-amber-500',
    2: 'text-slate-400',
    3: 'text-orange-400',
  };
  const MEDAL_BAR_CLASS: Record<number, string> = {
    1: 'bg-amber-500',
    2: 'bg-slate-400',
    3: 'bg-orange-400',
  };

  function barWidth(score: number) {
    const { max, min } = range;
    if (max === min) return 0;
    return Math.max(2, ((score - min) / (max - min)) * 100);
  }
</script>

<table class="min-w-full">
  <thead class="bg-gray-50">
    <tr
      class="border-b border-gray-200 text-left text-[11px] font-semibold tracking-wider text-gray-500 uppercase"
    >
      <th scope="col" class="py-3 pr-3 pl-4 whitespace-nowrap sm:pl-6">Rank</th>
      <th scope="col" class="px-3 py-3 whitespace-nowrap">Year</th>
      <th scope="col" class="hidden px-3 py-3 whitespace-nowrap sm:table-cell">
        Show
      </th>
      <th scope="col" class="hidden px-3 py-3 whitespace-nowrap sm:table-cell">
        Location
      </th>
      <th
        scope="col"
        class="px-3 py-3 pr-4 text-right whitespace-nowrap sm:pr-3"
      >
        Score
      </th>
      <th scope="col" class="hidden w-full px-3 py-3 pr-6 lg:table-cell">
        Relative
      </th>
    </tr>
  </thead>
  <tbody class="divide-y divide-gray-200 bg-white">
    {#each rankings as ranking (ranking.year)}
      {@const medal =
        ranking.placement && ranking.placement <= 3 ? ranking.placement : null}
      <tr class="hover:bg-gray-50">
        <td class="py-3 pr-3 pl-4 align-middle sm:pl-6">
          <span
            class="inline-flex h-6 min-w-7 items-center justify-center rounded-md px-1.5 text-xs font-semibold tabular-nums {rankClass(
              ranking.rank,
            )}"
            aria-label="{ranking.rank}{ordinalSuffix(ranking.rank)} place"
          >
            {ranking.rank}
          </span>
        </td>
        <td
          class="w-full max-w-0 px-3 py-3 align-middle sm:w-auto sm:max-w-none sm:whitespace-nowrap"
        >
          <div class="text-sm font-semibold text-gray-900 tabular-nums">
            {ranking.year}
          </div>
          {#if ranking.show}
            <div class="mt-0.5 truncate text-xs text-gray-500 sm:hidden">
              {ranking.show}{#if medal}<span
                  class="ml-1 {MEDAL_STAR_CLASS[medal]}"
                  aria-label={MEDAL_LABEL[medal]}>★</span
                >{/if}
            </div>
          {/if}
        </td>
        <td
          class="hidden px-3 py-3 align-middle text-sm whitespace-nowrap text-gray-600 sm:table-cell"
        >
          {ranking.show ?? '—'}
          {#if medal}
            <span
              class="ml-1.5 {MEDAL_STAR_CLASS[medal]}"
              aria-label={MEDAL_LABEL[medal]}>★</span
            >
          {/if}
        </td>
        <td
          class="hidden px-3 py-3 align-middle text-sm whitespace-nowrap text-gray-600 sm:table-cell"
        >
          {ranking.location}
        </td>
        <td
          class="px-3 py-3 pr-4 text-right align-middle whitespace-nowrap tabular-nums sm:pr-3"
        >
          <div class="text-sm font-semibold text-gray-900">
            {ranking.score.toFixed(3)}
          </div>
          {#if ranking.daysOld}
            <div class="mt-0.5 text-xs whitespace-nowrap text-gray-400">
              {ranking.daysOld}
              {ranking.daysOld === 1 ? 'day' : 'days'} prior
            </div>
          {/if}
        </td>
        <td class="hidden w-full px-3 py-3 pr-6 align-middle lg:table-cell">
          <div
            class="relative h-1.5 overflow-hidden rounded-full bg-gray-100"
            role="presentation"
          >
            <span
              class="absolute top-0 bottom-0 left-0 rounded-full {medal
                ? MEDAL_BAR_CLASS[medal]
                : 'bg-brand-600'}"
              style="width: {barWidth(ranking.score)}%"
            ></span>
          </div>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
