<script lang="ts">
  import type { DailyRankingItem } from '$lib/utils/daily-ranking';
  import { ordinalSuffix } from '$lib/utils/ordinal';
  import { rankBadgeClass } from '$lib/utils/rank-style';

  let {
    rankings,
    currentYear,
  }: { rankings: DailyRankingItem[]; currentYear?: string } = $props();

  const range = $derived.by(() => {
    if (rankings.length === 0) return { max: 0, min: 0 };
    const max = rankings[0].score;
    const min = rankings[rankings.length - 1].score - 0.5;
    return { max, min };
  });

  const MEDAL_LABEL: Record<number, string> = {
    1: 'DCI World Champion',
    2: 'DCI Silver Medalist',
    3: 'DCI Bronze Medalist',
  };
  const MEDAL_EMOJI: Record<number, string> = {
    1: '🥇',
    2: '🥈',
    3: '🥉',
  };
  const MEDAL_BAR_CLASS: Record<number, string> = {
    1: 'bg-amber-500',
    2: 'bg-slate-400',
    3: 'bg-orange-700',
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
      {@const isCurrent = ranking.year === currentYear}
      <tr
        class={isCurrent
          ? 'bg-gradient-to-r from-brand-600/8 to-brand-600/2'
          : 'hover:bg-gray-50'}
      >
        <td
          class="py-3 pr-3 pl-4 align-middle sm:pl-6 {isCurrent
            ? 'shadow-[inset_0.1875rem_0_0_0_var(--color-brand-600)]'
            : ''}"
        >
          <span
            class="inline-flex h-6 min-w-7 items-center justify-center rounded-md px-1.5 text-xs font-semibold tabular-nums {rankBadgeClass(
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
          <div
            class="text-sm font-semibold tabular-nums {isCurrent
              ? 'text-navy-800'
              : 'text-gray-900'}"
          >
            {ranking.year}{#if medal}<span
                class="ml-1.5"
                role="img"
                aria-label={MEDAL_LABEL[medal]}>{MEDAL_EMOJI[medal]}</span
              >{/if}{#if isCurrent}<span class="sr-only">
                (current season)</span
              >{/if}
          </div>
          {#if ranking.show}
            <div class="mt-0.5 truncate text-xs text-gray-500 sm:hidden">
              {ranking.show}
            </div>
          {/if}
        </td>
        <td
          class="hidden px-3 py-3 align-middle text-sm whitespace-nowrap text-gray-600 sm:table-cell"
        >
          {ranking.show ?? '—'}
        </td>
        <td
          class="hidden px-3 py-3 align-middle text-sm whitespace-nowrap text-gray-600 sm:table-cell"
        >
          {ranking.location}
        </td>
        <td
          class="px-3 py-3 pr-4 text-right align-middle whitespace-nowrap tabular-nums sm:pr-3"
        >
          <div
            class="text-sm font-semibold {isCurrent
              ? 'text-brand-600'
              : 'text-gray-900'}"
          >
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
              class="absolute top-0 bottom-0 left-0 rounded-full {isCurrent
                ? 'bg-brand-600 ring-[1.5px] ring-brand-600/25'
                : medal
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
