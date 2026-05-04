<script lang="ts">
  import { resolve } from '$app/paths';
  import { daysToFinals, nextFinalsSeason } from '$lib/utils/days-to-finals';

  const seasonYear = nextFinalsSeason()?.year;
  const days = daysToFinals();
</script>

<a
  href={resolve('/')}
  class="flex shrink-0 items-center gap-3 text-white"
  aria-label="Bluecoats Scores — home"
>
  <span
    class="from-brand-500 to-brand-600 grid size-9 place-items-center rounded-lg bg-gradient-to-b text-sm font-extrabold tracking-tight text-white shadow-[inset_0_-0.125rem_0_rgba(0,0,0,0.18),0_0.0625rem_0_rgba(255,255,255,0.15)]"
    aria-hidden="true"
  >
    BC
  </span>
  <span class="flex flex-col leading-[1.05]">
    <span class="text-[0.9375rem] font-bold tracking-tight">
      Bluecoats Scores
    </span>
    {#if seasonYear}
      <span class="text-[0.6875rem] font-medium text-white/60 md:hidden">
        {seasonYear} season ·
        {#if days > 0}
          {days}
          {days === 1 ? 'day' : 'days'} to Finals
        {:else}
          Finals day
        {/if}
      </span>
    {/if}
    <span class="hidden text-[0.6875rem] font-medium text-white/60 md:inline">
      Independent alumni archive · 1977&ndash;2026
    </span>
  </span>
</a>
