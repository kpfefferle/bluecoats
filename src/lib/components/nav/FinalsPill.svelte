<script lang="ts">
  import { browser } from '$app/environment';
  import { daysToFinals } from '$lib/utils/days-to-finals';
  import FinalsCountdown from './FinalsCountdown.svelte';

  const days = browser ? daysToFinals() : null;
</script>

{#if days !== null}
  <span
    class="bg-brand-400/15 text-brand-300 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.71875rem] font-semibold tracking-wide"
  >
    <span class="bg-brand-400 size-1.5 rounded-full"></span>
    <FinalsCountdown {days} />
  </span>
{/if}
