<script lang="ts">
  let {
    featuredYear,
    featuredIsChampion = false,
  }: { featuredYear?: string; featuredIsChampion?: boolean } = $props();
</script>

<div class="flex items-center gap-3.5 text-xs text-gray-500">
  {#if featuredIsChampion}
    <!--
      The featured line is gold because that season won, so it collapses into
      the Champion entry rather than showing two identical gold swatches.
    -->
    <span class="inline-flex items-center gap-1.5">
      <span class="bg-gold-500 inline-block h-0.5 w-3.5"></span>
      {featuredYear ?? 'Latest'} · Champion
    </span>
  {:else}
    <span class="inline-flex items-center gap-1.5">
      <span class="bg-brand-600 inline-block h-0.5 w-3.5"></span>
      {featuredYear ?? 'Latest'}
    </span>
    <span class="inline-flex items-center gap-1.5">
      <span class="bg-gold-500 inline-block h-0.5 w-3.5"></span>
      Champion
    </span>
  {/if}
  <span class="inline-flex items-center gap-1.5">
    <span class="bg-navy-900 inline-block h-0.5 w-3.5"></span>
    Compare
  </span>
</div>
