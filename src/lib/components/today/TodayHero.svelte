<script lang="ts">
  import { browser } from '$app/environment';
  import FinalsCountdown from '$components/nav/FinalsCountdown.svelte';
  import { ordinalSuffix } from '$lib/utils/ordinal';
  import { ageLabel, daysAgo, type TodayHeroData } from '$lib/utils/today';

  let { hero }: { hero: TodayHeroData } = $props();

  const latestDaysAgo = $derived(browser ? daysAgo(hero.latest.date) : null);
  const latestAgeLabel = $derived(
    latestDaysAgo === null ? null : ageLabel(latestDaysAgo),
  );
  const rankFoot = $derived.by(() => {
    if (hero.rank === 1) return 'ahead of every past season at this stage';
    if (hero.behindYears.length === 0) return null;
    return `behind ${hero.behindYears.join(' and ')} at this stage`;
  });
</script>

<section
  class="bg-navy-900 relative -mx-4 -mt-6 overflow-hidden rounded-none text-white md:mx-0 md:mt-0 md:rounded-xl"
>
  <div
    class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(91,139,255,0.18),transparent_55%),radial-gradient(circle_at_0%_100%,rgba(199,154,58,0.1),transparent_50%)]"
    aria-hidden="true"
  ></div>
  <div class="relative px-5 py-6 sm:px-8 sm:py-7">
    <div
      class="text-brand-300 text-[0.71875rem] font-semibold tracking-[0.08em] uppercase"
    >
      {hero.year} season{#if hero.inProgress}&nbsp;<span aria-hidden="true"
          >·</span
        >&nbsp;<FinalsCountdown />{:else}&nbsp;<span aria-hidden="true">·</span
        >&nbsp;season complete{/if}
    </div>
    <h1
      class="mt-2 max-w-3xl text-2xl font-bold tracking-tight text-balance sm:text-[1.75rem]"
    >
      {#if hero.inProgress}
        With <em class="text-brand-300 not-italic"
          >{hero.latest.score.toFixed(3)}</em
        >
        in {hero.latest.location}, {hero.year} ranks as
        {#if hero.rank === 1}
          the <em class="text-brand-300 not-italic">best</em> Bluecoats season
        {:else}
          the
          <em class="text-brand-300 not-italic"
            >{hero.rank}{ordinalSuffix(hero.rank)} best</em
          > Bluecoats season
        {/if}
        at this point in the tour.
      {:else}
        {hero.year} closed at
        <em class="text-brand-300 not-italic">{hero.latest.score.toFixed(3)}</em
        >
        — the corps'
        <em class="text-brand-300 not-italic">#{hero.rank}</em> score all-time on
        Finals night.
      {/if}
    </h1>
    <p class="mt-2 max-w-xl text-sm text-white/70">
      {#if hero.inProgress}
        Scores climb all summer as shows are cleaned and rewritten. Here's how
        this corps stacks up against every past Bluecoats season at the same
        point in the tour.
      {:else}
        The {hero.year} tour is complete. Here's how the season stacked up against
        every Bluecoats tour before it.
      {/if}
    </p>
    <dl
      class="mt-6 grid grid-cols-1 gap-4 border-t border-white/10 pt-4 sm:grid-cols-3 sm:gap-0 sm:pt-0"
    >
      <div
        class="hidden sm:block sm:border-r sm:border-white/10 sm:py-4 sm:pr-5"
      >
        <dt class="text-[0.71875rem] font-medium text-white/60">
          {hero.inProgress ? 'Latest score' : 'Final score'}
        </dt>
        <dd
          class="mt-0.5 text-[1.625rem] font-semibold tracking-tight tabular-nums"
        >
          {hero.latest.score.toFixed(3)}
        </dd>
        <dd class="text-xs text-white/55">
          {hero.latest.location}{#if latestAgeLabel}&nbsp;· {latestAgeLabel}{/if}
        </dd>
      </div>
      <div
        class="hidden sm:block sm:border-r sm:border-white/10 sm:px-5 sm:py-4"
      >
        <dt class="text-[0.71875rem] font-medium text-white/60">
          Rank vs. all seasons {hero.inProgress ? 'today' : 'at Finals'}
        </dt>
        <dd
          class="mt-0.5 text-[1.625rem] font-semibold tracking-tight tabular-nums"
        >
          #{hero.rank}
          <span class="text-sm font-medium text-white/55"
            >of {hero.totalSeasons}</span
          >
        </dd>
        {#if rankFoot}
          <dd class="text-xs text-white/55">{rankFoot}</dd>
        {/if}
      </div>
      {#if hero.best}
        <div class="sm:py-4 sm:pl-5">
          <dt class="text-[0.71875rem] font-medium text-white/60">
            All-time best finals score
          </dt>
          <dd
            class="mt-0.5 text-[1.625rem] font-semibold tracking-tight tabular-nums"
          >
            {hero.best.score.toFixed(3)}
          </dd>
          <dd class="text-xs text-white/55">
            <span class="text-gold-400 font-semibold">{hero.best.year}</span
            >{#if hero.best.show}&nbsp;· {hero.best.show}{/if}
          </dd>
        </div>
      {/if}
    </dl>
  </div>
</section>
