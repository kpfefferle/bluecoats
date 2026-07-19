<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import type { ResolvedPathname } from '$app/types';
  import type { SeasonScores } from '$data/base';
  import { isInProgress, finalsOrLatestScore } from '$lib/utils/tour';

  let {
    seasons,
    year,
  }: {
    seasons: SeasonScores[];
    year: string;
  } = $props();

  const ordered = $derived(
    [...seasons].sort((a, b) => Number(a.year) - Number(b.year)),
  );
  const index = $derived(ordered.findIndex((s) => s.year === year));
  const prev = $derived(index > 0 ? ordered[index - 1] : null);
  const next = $derived(index < ordered.length - 1 ? ordered[index + 1] : null);

  function seasonHref(target: string): ResolvedPathname {
    return resolve('/tour/[year]', { year: target });
  }

  function optionLabel(season: SeasonScores): string {
    const progress = isInProgress(season) ? ' · in progress' : '';
    const score = finalsOrLatestScore(season);
    const scoreText = score !== null ? ` — ${score.toFixed(3)}` : '';
    return `${season.year}${progress}${scoreText}`;
  }
</script>

<div class="flex flex-col gap-3">
  <div class="flex items-center gap-2">
    {#if prev}
      <a
        href={seasonHref(prev.year)}
        class="focus-visible:ring-brand-500 inline-flex h-9 items-center gap-1 rounded-md border border-gray-200 px-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:ring-2 focus-visible:outline-none"
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
        <span class="tabular-nums">{prev.year}</span>
      </a>
    {:else}
      <span
        class="inline-flex h-9 items-center gap-1 rounded-md border border-gray-200 px-2.5 text-sm font-medium text-gray-700 opacity-40"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.25"
          class="size-4"><path d="M15 18l-6-6 6-6" /></svg
        >
      </span>
    {/if}

    <div class="relative flex-1">
      <label class="sr-only" for="tour-season">Season</label>
      <select
        id="tour-season"
        class="focus:border-brand-500 h-9 w-full appearance-none rounded-md border border-gray-200 bg-white pr-9 pl-3 text-sm font-semibold text-gray-900 tabular-nums focus:outline-none"
        value={year}
        onchange={(e) =>
          void goto(seasonHref(e.currentTarget.value), { keepFocus: true })}
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
        class="pointer-events-none absolute top-1/2 right-3 size-3 -translate-y-1/2 text-gray-500"
        aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg
      >
    </div>

    {#if next}
      <a
        href={seasonHref(next.year)}
        class="focus-visible:ring-brand-500 inline-flex h-9 items-center gap-1 rounded-md border border-gray-200 px-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:ring-2 focus-visible:outline-none"
        aria-label="Next season"
      >
        <span class="tabular-nums">{next.year}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.25"
          class="size-4"
          aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg
        >
      </a>
    {:else}
      <span
        class="inline-flex h-9 items-center gap-1 rounded-md border border-gray-200 px-2.5 text-sm font-medium text-gray-700 opacity-40"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.25"
          class="size-4"><path d="M9 6l6 6-6 6" /></svg
        >
      </span>
    {/if}
  </div>

  <div class="flex flex-wrap gap-1">
    {#each ordered as season (season.year)}
      {@const active = season.year === year}
      {@const champ = season.placement === 1}
      <a
        href={seasonHref(season.year)}
        class="focus-visible:ring-brand-500 inline-flex h-7 items-center rounded px-1.5 text-xs font-semibold tabular-nums transition-colors focus-visible:ring-2 focus-visible:outline-none {active
          ? 'bg-brand-600 text-white'
          : champ
            ? 'bg-gold-100 text-gold-700 hover:bg-gold-400/30'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
        aria-label="{season.year} season"
        aria-current={active ? 'page' : undefined}
      >
        {season.year.slice(2)}
      </a>
    {/each}
  </div>
</div>
