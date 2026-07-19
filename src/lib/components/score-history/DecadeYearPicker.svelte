<script lang="ts">
  import type { SeasonScores } from '$data/base';

  let {
    seasonScores,
    selectedYears,
    featuredYear,
    onChange,
  }: {
    seasonScores: SeasonScores[];
    selectedYears: SeasonScores['year'][];
    featuredYear?: SeasonScores['year'];
    onChange: (years: SeasonScores['year'][]) => void;
  } = $props();

  const availableYears = $derived(
    new Set(seasonScores.map((season) => Number(season.year))),
  );
  const championYears = $derived(
    new Set(
      seasonScores
        .filter((season) => season.placement === 1)
        .map((season) => Number(season.year)),
    ),
  );

  // Group the data range into decade rows, surfacing gap years (e.g. no 1979,
  // 1983) as muted placeholders so the missing seasons read as intentional.
  const decades = $derived.by(() => {
    const years = [...availableYears];
    if (years.length === 0) return [];
    const min = Math.min(...years);
    const max = Math.max(...years);
    const rows: Array<{ label: string; years: number[] }> = [];
    for (let start = Math.floor(min / 10) * 10; start <= max; start += 10) {
      const from = Math.max(start, min);
      const to = Math.min(start + 9, max);
      const list: number[] = [];
      for (let year = from; year <= to; year += 1) list.push(year);
      rows.push({ label: `${String(start).slice(2)}s`, years: list });
    }
    return rows;
  });

  function toggle(year: number) {
    const value = String(year);
    const next = selectedYears.includes(value)
      ? selectedYears.filter((y) => y !== value)
      : [...selectedYears, value];
    onChange(next);
  }
</script>

<div role="group" aria-label="Season">
  {#each decades as decade (decade.label)}
    <div class="mb-2 flex gap-3">
      <span
        class="w-9 shrink-0 pt-2 text-[0.6875rem] font-semibold tracking-wider text-gray-500 uppercase"
      >
        {decade.label}
      </span>
      <div class="flex flex-wrap gap-1.5">
        {#each decade.years as year (year)}
          {#if !availableYears.has(year)}
            <!-- Gap years have no data, so they are inactive UI components. As a
                 disabled button they are exempt from WCAG 1.4.3 contrast (and
                 axe/Lighthouse skip :disabled controls), letting them stay muted
                 while aria-hidden keeps them out of the a11y tree. -->
            <button
              type="button"
              disabled
              aria-hidden="true"
              class="min-w-11 cursor-default rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-center text-xs font-medium text-gray-300 tabular-nums"
            >
              {year}
            </button>
          {:else if String(year) === featuredYear}
            <span
              aria-current="true"
              title="Featured season"
              class="border-brand-600 text-brand-600 ring-brand-600 inline-flex min-w-11 items-center justify-center gap-1 rounded-md border px-2.5 py-1.5 text-center text-xs font-semibold tabular-nums ring-1"
            >
              <span class="bg-brand-600 size-1.5 rounded-full"></span>{year}
            </span>
          {:else}
            <button
              type="button"
              aria-pressed={selectedYears.includes(String(year))}
              onclick={() => toggle(year)}
              class={[
                'min-w-11 rounded-md border px-2.5 py-1.5 text-center text-xs font-medium tabular-nums transition-colors',
                selectedYears.includes(String(year))
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300',
                championYears.has(year) &&
                  'shadow-[inset_0_-0.125rem_0_var(--color-gold-500)]',
              ]}
            >
              {year}
            </button>
          {/if}
        {/each}
      </div>
    </div>
  {/each}
</div>
