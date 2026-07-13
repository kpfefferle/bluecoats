<script lang="ts">
  import type { DailyRankingItem } from '$lib/utils/daily-ranking';
  import { ordinalSuffix } from '$lib/utils/ordinal';
  import {
    MEDAL_EMOJI,
    MEDAL_LABEL,
    rankBadgeClass,
  } from '$lib/utils/rank-style';

  let {
    items,
    featuredYear,
    featuredScore,
  }: {
    items: DailyRankingItem[];
    featuredYear?: string;
    featuredScore?: number;
  } = $props();

  function deltaLabel(score: number): string | null {
    if (featuredScore === undefined) return null;
    const diff = score - featuredScore;
    if (diff === 0) return '—';
    return `${diff > 0 ? '+' : '−'}${Math.abs(diff).toFixed(2)}`;
  }
</script>

<table class="min-w-full">
  <thead class="bg-gray-50">
    <tr
      class="border-b border-gray-200 text-left text-[0.6875rem] font-semibold tracking-wider text-gray-500 uppercase"
    >
      <th scope="col" class="py-3 pr-3 pl-4 whitespace-nowrap sm:pl-6">Rank</th>
      <th scope="col" class="px-3 py-3 whitespace-nowrap">Year</th>
      <th
        scope="col"
        class="hidden w-full px-3 py-3 whitespace-nowrap sm:table-cell"
      >
        Show
      </th>
      <th
        scope="col"
        class="px-3 py-3 pr-4 text-right whitespace-nowrap sm:pr-3"
      >
        Score
      </th>
      <th
        scope="col"
        class="hidden px-3 py-3 pr-4 text-right whitespace-nowrap sm:table-cell sm:pr-6"
      >
        {featuredYear ? `Δ vs. ${featuredYear}` : 'Δ'}
      </th>
    </tr>
  </thead>
  <tbody class="divide-y divide-gray-200 bg-white">
    {#each items as item (item.year)}
      {@const medal =
        item.placement && item.placement <= 3 ? item.placement : null}
      {@const isCurrent = item.year === featuredYear}
      {@const delta = isCurrent ? null : deltaLabel(item.score)}
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
              item.rank,
            )}"
            aria-label="{item.rank}{ordinalSuffix(item.rank)} place"
          >
            {item.rank}
          </span>
        </td>
        <td
          class="px-3 py-3 align-middle text-sm font-semibold whitespace-nowrap tabular-nums {isCurrent
            ? 'text-navy-800'
            : 'text-gray-900'}"
        >
          {item.year}{#if medal}<span
              class="ml-1.5"
              role="img"
              aria-label={MEDAL_LABEL[medal]}>{MEDAL_EMOJI[medal]}</span
            >{/if}{#if isCurrent}<span class="sr-only">
              (current season)</span
            >{/if}
          {#if item.show}
            <div
              class="mt-0.5 truncate text-xs font-normal text-gray-500 sm:hidden"
            >
              {item.show}
            </div>
          {/if}
        </td>
        <td
          class="hidden w-full px-3 py-3 align-middle text-sm text-gray-600 sm:table-cell"
        >
          {item.show ?? '—'}
        </td>
        <td
          class="px-3 py-3 pr-4 text-right align-middle whitespace-nowrap tabular-nums sm:pr-3"
        >
          <div
            class="text-sm font-semibold {isCurrent
              ? 'text-brand-600'
              : 'text-gray-900'}"
          >
            {item.score.toFixed(3)}
          </div>
          {#if item.daysOld}
            <div
              class="mt-0.5 text-xs font-normal whitespace-nowrap text-gray-500"
            >
              {item.daysOld}
              {item.daysOld === 1 ? 'day' : 'days'} prior
            </div>
          {/if}
        </td>
        <td
          class="hidden px-3 py-3 pr-4 text-right align-middle text-sm whitespace-nowrap text-gray-500 tabular-nums sm:table-cell sm:pr-6"
        >
          {delta ?? '—'}
        </td>
      </tr>
    {/each}
  </tbody>
</table>
