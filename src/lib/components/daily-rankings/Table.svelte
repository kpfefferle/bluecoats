<script lang="ts">
  import type { DailyRankingsItem } from '$lib/utils/daily-rankings';
  import { ordinalSuffix } from '$lib/utils/ordinal';

  let { rankings }: { rankings: DailyRankingsItem[] } = $props();

  const CHAMPIONSHIP_YEARS = new Set(['2016']);

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

  function barWidth(score: number) {
    const { max, min } = range;
    if (max === min) return 0;
    return Math.max(2, ((score - min) / (max - min)) * 100);
  }
</script>

<table class="min-w-full">
  <thead class="bg-gray-50">
    <tr
      class="text-left text-[11px] font-semibold tracking-wider text-gray-500 uppercase"
    >
      <th scope="col" class="w-14 py-3 pr-3 pl-4 sm:pl-6">Rank</th>
      <th scope="col" class="px-3 py-3">Year</th>
      <th scope="col" class="hidden px-3 py-3 sm:table-cell">Show</th>
      <th scope="col" class="px-3 py-3 text-right">Score</th>
      <th scope="col" class="hidden w-40 px-3 py-3 sm:pr-6 md:table-cell">
        Relative
      </th>
    </tr>
  </thead>
  <tbody class="divide-y divide-gray-200 bg-white">
    {#each rankings as ranking (ranking.year)}
      {@const isChamp = CHAMPIONSHIP_YEARS.has(String(ranking.year))}
      <tr class="hover:bg-gray-50">
        <td class="py-3 pr-3 pl-4 align-middle sm:pl-6">
          <span
            class="inline-flex h-6 min-w-[1.75rem] items-center justify-center rounded-md px-1.5 text-xs font-semibold tabular-nums {rankClass(
              ranking.rank,
            )}"
            aria-label="{ranking.rank}{ordinalSuffix(ranking.rank)} place"
          >
            {ranking.rank}
          </span>
        </td>
        <td class="px-3 py-3 align-middle">
          <div class="text-sm font-semibold text-gray-900 tabular-nums">
            {ranking.year}
          </div>
          {#if ranking.show}
            <div class="mt-0.5 truncate text-xs text-gray-500 sm:hidden">
              {ranking.show}
            </div>
          {/if}
        </td>
        <td
          class="hidden max-w-0 truncate px-3 py-3 align-middle text-sm text-gray-600 sm:table-cell"
        >
          <span class="truncate">{ranking.show ?? '—'}</span>
          {#if isChamp}
            <span class="ml-1.5 text-amber-500" aria-label="DCI World Champion"
              >★</span
            >
          {/if}
          <div class="mt-0.5 text-xs text-gray-400">
            {ranking.location}{#if ranking.daysOld}
              <span>
                · {ranking.daysOld}
                {ranking.daysOld === 1 ? 'day' : 'days'} prior</span
              >
            {/if}
          </div>
        </td>
        <td
          class="px-3 py-3 text-right align-middle text-sm font-semibold text-gray-900 tabular-nums"
        >
          {ranking.score.toFixed(3)}
        </td>
        <td class="hidden px-3 py-3 align-middle sm:pr-6 md:table-cell">
          <div
            class="relative h-1.5 overflow-hidden rounded-full bg-gray-100"
            role="presentation"
          >
            <span
              class="absolute top-0 bottom-0 left-0 rounded-full {isChamp
                ? 'bg-amber-500'
                : 'bg-brand-600'}"
              style="width: {barWidth(ranking.score)}%"
            ></span>
          </div>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
