<script lang="ts">
  import { daysToFinals } from '$lib/utils/days-to-finals';

  const days = daysToFinals();
</script>

<span
  class="bg-brand-400/15 text-brand-300 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.71875rem] font-semibold tracking-wide"
>
  <span class="bg-brand-400 size-1.5 rounded-full"></span>
  {#if days > 0}
    {days}
    {days === 1 ? 'day' : 'days'} to Finals
  {:else}
    Finals day
  {/if}
</span>
