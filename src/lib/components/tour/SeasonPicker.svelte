<script lang="ts">
  import type { SeasonScores } from '$data/base';
  import { isInProgress, finalsOrLatestScore } from '$lib/utils/tour';

  let {
    seasons,
    year,
    onChange,
  }: {
    seasons: SeasonScores[];
    year: string;
    onChange: (year: string) => void;
  } = $props();

  const ordered = $derived(
    [...seasons].sort((a, b) => Number(a.year) - Number(b.year)),
  );
  const index = $derived(ordered.findIndex((s) => s.year === year));
  const prev = $derived(index > 0 ? ordered[index - 1] : null);
  const next = $derived(index < ordered.length - 1 ? ordered[index + 1] : null);

  function optionLabel(season: SeasonScores): string {
    const progress = isInProgress(season) ? ' · in progress' : '';
    const score = finalsOrLatestScore(season);
    const scoreText = score !== null ? ` — ${score.toFixed(3)}` : '';
    return `${season.year}${progress}${scoreText}`;
  }
</script>

<div class="flex flex-col gap-3">
  <div class="flex items-center gap-2">
    <button
      type="button"
      class="inline-flex h-9 items-center gap-1 rounded-md border border-gray-200 px-2.5 text-sm font-medium text-gray-700 enabled:hover:bg-gray-50 disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
      onclick={() => prev && onChange(prev.year)}
      disabled={!prev}
      aria-label="Previous season"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.25"
        class="size-4"
        aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg
      >
      {#if prev}<span class="tabular-nums">{prev.year}</span>{/if}
    </button>

    <div class="relative flex-1">
      <label class="sr-only" for="tour-season">Season</label>
      <select
        id="tour-season"
        class="h-9 w-full appearance-none rounded-md border border-gray-200 bg-white pr-9 pl-3 text-sm font-semibold tabular-nums text-gray-900 focus:border-brand-500 focus:outline-none"
        value={year}
        onchange={(e) => onChange(e.currentTarget.value)}
      >
        {#each [...ordered].reverse() as season (season.year)}
          <option value={season.year}>{optionLabel(season)}</option>
        {/each}
      </select>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        class="pointer-events-none absolute top-1/2 right-3 size-3 -translate-y-1/2 text-gray-400"
        aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg
      >
    </div>

    <button
      type="button"
      class="inline-flex h-9 items-center gap-1 rounded-md border border-gray-200 px-2.5 text-sm font-medium text-gray-700 enabled:hover:bg-gray-50 disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none"
      onclick={() => next && onChange(next.year)}
      disabled={!next}
      aria-label="Next season"
    >
      {#if next}<span class="tabular-nums">{next.year}</span>{/if}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.25"
        class="size-4"
        aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg
      >
    </button>
  </div>

  <div class="flex flex-wrap gap-1">
    {#each ordered as season (season.year)}
      {@const active = season.year === year}
      {@const champ = season.placement === 1}
      <button
        type="button"
        class="h-7 rounded px-1.5 text-xs font-semibold tabular-nums transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:outline-none {active
          ? 'bg-brand-600 text-white'
          : champ
            ? 'bg-gold-100 text-gold-700 hover:bg-gold-400/30'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}"
        onclick={() => onChange(season.year)}
        aria-label="{season.year} season"
        aria-current={active ? 'true' : undefined}
      >
        {season.year.slice(2)}
      </button>
    {/each}
  </div>
</div>
