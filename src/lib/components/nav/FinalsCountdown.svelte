<script lang="ts">
  import { liveDaysToFinals } from '$lib/utils/days-to-finals';

  const days = liveDaysToFinals();
</script>

{#if days !== null}
  {#if days > 0}
    {days}
    {days === 1 ? 'day' : 'days'} to Finals
  {:else}
    Finals day
  {/if}
{/if}
