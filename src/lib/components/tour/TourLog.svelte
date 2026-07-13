<script lang="ts">
  import { DateTime } from 'luxon';
  import type { TourLogRow } from '$lib/utils/tour';
  import { ordinalSuffix } from '$lib/utils/ordinal';

  let { rows }: { rows: TourLogRow[] } = $props();

  function formatDate(iso: string): string {
    return DateTime.fromISO(iso).toFormat('LLL d');
  }

  function rankClass(rank: number): string {
    if (rank === 1)
      return 'bg-amber-100 text-amber-900 ring-1 ring-inset ring-amber-300';
    if (rank === 2)
      return 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-300';
    if (rank === 3)
      return 'bg-orange-50 text-orange-800 ring-1 ring-inset ring-orange-200';
    return 'bg-gray-100 text-gray-600';
  }
</script>

<table class="min-w-full">
  <thead class="bg-gray-50">
    <tr
      class="border-b border-gray-200 text-left text-[11px] font-semibold tracking-wider text-gray-500 uppercase"
    >
      <th scope="col" class="py-3 pr-3 pl-4 whitespace-nowrap sm:pl-6">Date</th>
      <th scope="col" class="hidden px-3 py-3 whitespace-nowrap lg:table-cell">
        Day
      </th>
      <th scope="col" class="px-3 py-3">Event</th>
      <th scope="col" class="px-3 py-3 text-right whitespace-nowrap">Score</th>
      <th scope="col" class="hidden px-3 py-3 whitespace-nowrap sm:table-cell">
        Rank then
      </th>
      <th scope="col" class="px-3 py-3 whitespace-nowrap">Rank now</th>
      <th
        scope="col"
        class="hidden px-3 py-3 pr-6 whitespace-nowrap lg:table-cell"
      >
        Δ
      </th>
    </tr>
  </thead>
  <tbody class="divide-y divide-gray-200 bg-white">
    {#each rows as row, i (i)}
      <tr class="hover:bg-gray-50">
        <td
          class="py-3 pr-3 pl-4 align-middle text-sm font-semibold whitespace-nowrap text-gray-900 sm:pl-6"
        >
          {formatDate(row.date)}
        </td>
        <td
          class="hidden px-3 py-3 align-middle text-sm whitespace-nowrap text-gray-500 tabular-nums lg:table-cell"
        >
          {row.daysBeforeFinals}d
        </td>
        <td class="px-3 py-3 align-middle">
          <div class="text-sm font-medium text-gray-900">
            {row.name ?? row.location}
          </div>
          {#if row.name}
            <div class="text-xs text-gray-500">{row.location}</div>
          {/if}
        </td>
        <td
          class="px-3 py-3 text-right align-middle text-sm font-semibold whitespace-nowrap text-gray-900 tabular-nums"
        >
          {#if row.score !== null}
            {row.score.toFixed(3)}
          {:else}
            <span class="text-gray-300">—</span>
          {/if}
        </td>
        <td
          class="hidden px-3 py-3 align-middle whitespace-nowrap sm:table-cell"
        >
          {#if row.rankThen !== null}
            <span
              aria-label="ranked {row.rankThen}{ordinalSuffix(
                row.rankThen,
              )} at the time"
              class="inline-flex h-6 min-w-7 items-center justify-center rounded-md px-1.5 text-xs font-semibold tabular-nums {rankClass(
                row.rankThen,
              )}">#{row.rankThen}</span
            >
          {:else}
            <span class="text-xs text-gray-300">—</span>
          {/if}
        </td>
        <td class="px-3 py-3 align-middle whitespace-nowrap">
          {#if row.rankNow !== null}
            <span
              aria-label="ranked {row.rankNow}{ordinalSuffix(
                row.rankNow,
              )} today"
              class="inline-flex h-6 min-w-7 items-center justify-center rounded-md px-1.5 text-xs font-semibold tabular-nums {rankClass(
                row.rankNow,
              )}">#{row.rankNow}</span
            >
          {:else}
            <span class="text-xs text-gray-300">—</span>
          {/if}
        </td>
        <td
          class="hidden px-3 py-3 pr-6 align-middle whitespace-nowrap lg:table-cell"
        >
          {#if row.rankThen !== null && row.rankNow !== null}
            {@const delta = row.rankNow - row.rankThen}
            {#if delta === 0}
              <span class="text-xs text-gray-500">holds</span>
            {:else}
              <span
                aria-label={delta > 0
                  ? `dropped ${Math.abs(delta)} ${Math.abs(delta) === 1 ? 'place' : 'places'}`
                  : `improved ${Math.abs(delta)} ${Math.abs(delta) === 1 ? 'place' : 'places'}`}
                class="text-xs font-semibold {delta > 0
                  ? 'text-red-700'
                  : 'text-green-700'}"
              >
                {delta > 0 ? '↓' : '↑'}
                {Math.abs(delta)}
              </span>
            {/if}
          {:else}
            <span class="text-xs text-gray-300">—</span>
          {/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>
