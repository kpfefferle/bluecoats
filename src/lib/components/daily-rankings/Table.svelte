<script lang="ts">
  import type { DailyRankingsItem } from '$lib/utils/daily-rankings';
  import { ordinalSuffix } from '$lib/utils/ordinal';

  let { rankings }: { rankings: DailyRankingsItem[] } = $props();

  const MEDALS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };
</script>

<table class="min-w-full divide-y divide-gray-300">
  <thead class="bg-gray-50">
    <tr>
      <th
        scope="col"
        class="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6"
      >
        <span class="sr-only">Rank</span>
      </th>
      <th
        scope="col"
        class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
      >
        Year
      </th>
      <th
        scope="col"
        class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
      >
        Show
      </th>
      <th
        scope="col"
        class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
      >
        Score
      </th>
      <th
        scope="col"
        class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
      >
        Location
      </th>
    </tr>
  </thead>
  <tbody class="divide-y divide-gray-200 bg-white">
    {#each rankings as ranking (ranking.year)}
      <tr>
        <td
          class="w-px py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:w-auto sm:pl-6"
        >
          {#if MEDALS[ranking.rank]}
            <span aria-hidden="true">{MEDALS[ranking.rank]}</span>
            <span class="sr-only"
              >{ranking.rank}{ordinalSuffix(ranking.rank)}</span
            >
          {:else}
            {ranking.rank}{ordinalSuffix(ranking.rank)}
          {/if}
        </td>
        <td
          class="w-full max-w-0 px-3 py-4 text-sm text-gray-900 sm:w-auto sm:max-w-none sm:whitespace-nowrap"
        >
          <div class="flex items-baseline gap-2">
            <span class="font-medium">{ranking.year}</span>
            {#if ranking.show}
              <span class="min-w-0 truncate text-gray-500 sm:hidden">
                {ranking.show}
              </span>
            {/if}
          </div>
          <dl class="font-normal sm:hidden">
            <dt class="sr-only">Score</dt>
            <dd class="mt-1 truncate text-gray-500">{ranking.score}</dd>
          </dl>
        </td>
        <td
          class="hidden px-3 py-4 text-sm whitespace-nowrap text-gray-500 sm:table-cell"
        >
          {ranking.show ?? ''}
        </td>
        <td
          class="hidden px-3 py-4 text-sm whitespace-nowrap text-gray-500 sm:table-cell"
        >
          {ranking.score}
        </td>
        <td
          class="hidden px-3 py-4 text-sm whitespace-nowrap text-gray-500 sm:table-cell"
        >
          {ranking.location}
          {#if ranking.daysOld}
            <div class="text-gray-400">
              {ranking.daysOld}
              {ranking.daysOld === 1 ? 'day' : 'days'} prior
            </div>
          {/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>
