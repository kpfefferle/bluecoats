<script lang="ts">
  let { days }: { days: number } = $props();
</script>

{#if days > 0}
  {days}
  {days === 1 ? 'day' : 'days'} to Finals
{:else}
  Finals day
{/if}
